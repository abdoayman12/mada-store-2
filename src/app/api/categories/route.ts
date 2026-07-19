import { FormState } from "@/components/admin/CategoryForm";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// get all categories
export const GET = async (request: NextRequest) => {
    try {
        const categories = await prisma.category.findMany({
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
        if (!categories) {
            return NextResponse.json(
                { message: "categoreis not found" },
                { status: 404 },
            );
        }
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};

// add categore
export const POST = async (request: NextRequest) => {
    try {
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع اضافه فئه لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const body: FormState = await request.json();
        const createShema = z.object({
            name: z
                .string()
                .min(1, "اسم الفئة مطلوب اكثر من 4 حروف")
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
        const categoreSlug = await prisma.category.findUnique({
            where: { slug: body.slug },
        });
        if (categoreSlug) {
            return NextResponse.json(
                { message: "قيمه ال slug متكرره مع فئه اخره" },
                { status: 400 },
            );
        }
        const newCategore = await prisma.category.create({
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
        return NextResponse.json(newCategore, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
