import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ─── Validation ───────────────────────────────────────────────────────────────

const reviewSchema = z.object({
    rating: z
        .number()
        .int()
        .min(1, "التقييم يجب أن يكون بين 1 و 5")
        .max(5, "التقييم يجب أن يكون بين 1 و 5"),
    comment: z.string().optional(),
});

// ─── Helper: إعادة حساب rating و reviewsCount بعد كل عملية ──────────────────

async function updateProductStats(productId: string) {
    const reviews = await prisma.review.findMany({ where: { productId } });
    const count = reviews.length;
    const avg =
        count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    await prisma.product.update({
        where: { id: productId },
        data: {
            rating: Math.round(avg * 10) / 10, // يحفظ رقم واحد بعد الفاصلة
            reviewsCount: count,
        },
    });
}

// ─── GET /api/reviews/[productId] — عام (مش محتاج login) ─────────────────────

export const GET = async (
    _request: NextRequest,
    { params }: { params: Promise<{ productId: string }> },
) => {
    try {
        const { productId } = await params;

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};

// ─── POST /api/reviews/[productId] — محتاج login (إضافة أو تعديل) ────────────
// بيستخدم upsert — لو المستخدم عنده تقييم قديم بيعدّله، لو لأ بيضيف جديد

export const POST = async (
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> },
) => {
    try {
        // ── 1. التحقق من الـ token ─────────────────────────────────────────
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json(
                { message: "سجّل دخولك أولًا لإضافة تقييم" },
                { status: 401 },
            );
        }

        const { productId } = await params;

        // ── 2. التحقق إن المنتج موجود ──────────────────────────────────────
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            return NextResponse.json(
                { message: "المنتج غير موجود" },
                { status: 404 },
            );
        }

        // ── 3. Validation ──────────────────────────────────────────────────
        const body = await request.json();
        const validation = reviewSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 },
            );
        }

        // ── 4. upsert: إضافة لو مفيش، تعديل لو موجود ──────────────────────
        const review = await prisma.review.upsert({
            where: {
                userId_productId: { userId: user.id, productId },
            },
            create: {
                userId: user.id,
                productId: productId,
                rating: body.rating,
                comment: body.comment ?? null,
            },
            update: {
                rating: body.rating,
                comment: body.comment ?? null,
            },
            include: {
                user: { select: { id: true, name: true } },
            },
        });

        // ── 5. إعادة حساب إحصائيات المنتج ─────────────────────────────────
        await updateProductStats(productId);

        return NextResponse.json(review, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};

// ─── DELETE /api/reviews/[productId] — محتاج login (حذف تقييمه) ──────────────

export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> },
) => {
    try {
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json(
                { message: "سجّل دخولك أولًا" },
                { status: 401 },
            );
        }

        const { productId } = await params;

        // تأكد إن التقييم موجود قبل الحذف
        const existing = await prisma.review.findUnique({
            where: { userId_productId: { userId: user.id, productId } },
        });
        if (!existing) {
            return NextResponse.json(
                { message: "التقييم غير موجود" },
                { status: 404 },
            );
        }

        await prisma.review.delete({
            where: { userId_productId: { userId: user.id, productId } },
        });

        // إعادة حساب إحصائيات المنتج بعد الحذف
        await updateProductStats(productId);

        return NextResponse.json(
            { message: "تم حذف التقييم بنجاح" },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
