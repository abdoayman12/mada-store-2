import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { checkoutSchema, CheckoutValues } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderItem = {
    productId: string;
    quantity: number;
    price: number;
};

type CheckoutValuesDTO = CheckoutValues & {
    total: number;
    items: OrderItem[];
};

// ─── GET: كل الطلبات — للأدمن فقط ────────────────────────────────────────────

export const GET = async (request: NextRequest) => {
    try {
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع عرض الطلبات لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const orders = await prisma.order.findMany({
            include: { items: true },
        });
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};

// ─── POST: إنشاء طلب جديد ────────────────────────────────────────────────────

export const POST = async (request: NextRequest) => {
    try {
        // ── 1. التحقق من الـ token ────────────────────────────────────────
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json(
                {
                    message:
                        "انت لا تستطيع اضافه طلب لانك عليك تسجيل الدخول اولا",
                },
                { status: 401 },
            );
        }

        const body: CheckoutValuesDTO = await request.json();

        // ── 2. Zod validation على بيانات الشحن والدفع ────────────────────
        const validation = checkoutSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 },
            );
        }

        // ── 3. التحقق إن الـ items موجودة ومش فاضية ──────────────────────
        if (!body.items || body.items.length === 0) {
            return NextResponse.json(
                { message: "السلة فاضية، أضف منتجات الأول" },
                { status: 400 },
            );
        }

        // ── 4. إنشاء الـ Order والـ OrderItems في نفس الوقت ──────────────
        const newOrder = await prisma.order.create({
            data: {
                customerName: body.fullName,
                phone: body.phone,
                governorate: body.governorate,
                city: body.city,
                address: body.address,
                notes: body.notes,
                paymentMethod: body.paymentMethod,
                total: body.total,
                userId: user.id,
                //  بنعمل الـ items مع الـ order في نفس العملية
                items: {
                    create: body.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: true, // بيرجع الـ items جوا الـ response
            },
        });

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
