import { FormState } from "@/components/admin/CategoryForm";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// get single categorie
export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ catID: string }> },
) => {
    try {
        const { catID } = await params;
        if (!catID) {
            return NextResponse.json(
                { message: "the id is not found" },
                { status: 404 },
            );
        }
        const categorie = await prisma.category.findUnique({
            where: { id: catID },
            include: {
                products: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                    },
                },
            },
        });
        if (!categorie) {
            return NextResponse.json(
                { message: "الفئه غير موجوده" },
                { status: 404 },
            );
        }
        return NextResponse.json(categorie, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};

// delete categorie
export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ catID: string }> },
) => {
    try {
        const { catID } = await params;
        if (!catID) {
            return NextResponse.json(
                { message: "the id is not found" },
                { status: 404 },
            );
        }
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع حذف فئه لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const categorie = await prisma.category.findUnique({
            where: { id: catID },
        });
        if (!categorie) {
            return NextResponse.json(
                { message: "الفئه غير موجوده" },
                { status: 404 },
            );
        }
        await prisma.category.delete({ where: { id: catID } });
        return NextResponse.json(
            { message: "تم حذف الفئه بنجاح" },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};

// Update categorie
export const PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ catID: string }> },
) => {
    try {
        const { catID } = await params;
        if (!catID) {
            return NextResponse.json(
                { message: "the id is not found" },
                { status: 404 },
            );
        }
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع تعديل فئه لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const body: FormState = await request.json();
        const createShema = z.object({
            name: z
                .string()
                .min(5, "اسم الفئة مطلوب اكثر من 4 حروف")
                .max(25, "اسم الفئة مطلوب اقل من 26 حرف"),
            slug: z
                .string()
                .min(1)
                .regex(
                    /^[a-z0-9-]+$/,
                    "الـ slug يقبل فقط أحرف إنجليزية صغيرة وأرقام وشرطات",
                ),
            image: z.string().min(1, "رابط الصورة مطلوب"),
        });
        const validation = createShema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 },
            );
        }
        const categorie = await prisma.category.findUnique({
            where: { id: catID },
        });
        if (!categorie) {
            return NextResponse.json(
                { message: "الفئه غير موجوده" },
                { status: 404 },
            );
        }
        const updCategorie = await prisma.category.update({
            where: { id: catID },
            data: {
                name: body.name,
                slug: body.slug,
                image: body.image,
            },
            include: {
                products: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                    },
                },
            },
        });
        return NextResponse.json(updCategorie, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
