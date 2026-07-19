import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { checkoutSchema, CheckoutValues } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

// types
type CheckoutValuesDTO = CheckoutValues & {
    total: Number;
};
// get all products
export const GET = async (request: NextRequest) => {
    try {
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع عرض الطلبات لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const orders = await prisma.order.findMany();
        if (!orders) {
            return NextResponse.json(
                { message: "order not found" },
                { status: 404 },
            );
        }
        return NextResponse.json(orders, { status: 200 });
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

        const validation = checkoutSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 },
            );
        }
        const newOrder = await prisma.order.create({
            data: {
                customerName: body.fullName,
                address: body.address,
                phone: body.phone,
                city: body.city,
                governorate: body.governorate,
                notes: body.notes,
                paymentMethod: body.paymentMethod,
                userId: user.id,
                total: +body.total,
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
