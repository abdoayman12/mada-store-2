import { toSlug } from "@/lib/adminData";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { bodyProductDTO } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// get single product
export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ productID: string }> },
) => {
    try {
        const { productID } = await params;
        if (!productID) {
            return NextResponse.json(
                { message: "the id is not found" },
                { status: 404 },
            );
        }
        const product = await prisma.product.findUnique({
            where: { id: productID },
        });
        if (!product) {
            return NextResponse.json(
                { message: "المنتج غير موجود" },
                { status: 404 },
            );
        }
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};

// delete product
export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ productID: string }> },
) => {
    try {
        const { productID } = await params;
        if (!productID) {
            return NextResponse.json(
                { message: "the id is not found" },
                { status: 404 },
            );
        }
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع حذف منتج لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const product = await prisma.product.findUnique({
            where: { id: productID },
        });
        if (!product) {
            return NextResponse.json(
                { message: "المنتج غير موجود" },
                { status: 404 },
            );
        }
        await prisma.product.delete({ where: { id: productID } });
        return NextResponse.json(
            { message: "تم حذف المنتج بنجاح" },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};

// Update product
export const PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ productID: string }> },
) => {
    try {
        const { productID } = await params;
        if (!productID) {
            return NextResponse.json(
                { message: "the id is not found" },
                { status: 404 },
            );
        }
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع تعديل منتج لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const body: bodyProductDTO = await request.json();
        const createShema = z.object({
            name: z
                .string()
                .min(1, "اسم المنتج مطلوب اكثر من 4 حروف")
                .max(25, "اسم الفئة مطلوب اقل من 26 حرف"),
            categoryId: z.string().min(1, "اختر الفئة"),
            price: z.number().min(1, "السعر مطلوب وصحيح"),
            description: z.string().min(1, "الوصف مطلوب"),
        });
        const validation = createShema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 },
            );
        }
        const updProduct = await prisma.product.update({
            where: { id: productID },
            data: {
                name: body.name,
                slug: toSlug(body.name),
                price: body.price,
                description: body.description,
                details: body.details,
                categoryId: body.categoryId,
                compareAtPrice: body.compareAtPrice,
                inStock: body.inStock,
                isNew: body.isNew,
                isBestSeller: body.isBestSeller,
            },
        });
        return NextResponse.json(updProduct, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
