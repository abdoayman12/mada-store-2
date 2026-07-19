import { toSlug } from "@/lib/adminData";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { bodyProductDTO } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// get all products
export const GET = async (request: NextRequest) => {
    try {
        const products = await prisma.product.findMany();
        if (!products) {
            return NextResponse.json(
                { message: "products not found" },
                { status: 404 },
            );
        }
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};

// add product
export const POST = async (request: NextRequest) => {
    try {
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع اضافه منتج لانك مستخدم عادى" },
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
        const newProduct = await prisma.product.create({
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
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
