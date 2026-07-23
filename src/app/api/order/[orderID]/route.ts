import { OrderStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// get single order
export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ orderID: string }> },
) => {
    try {
        const { orderID } = await params;
        if (!orderID) {
            return NextResponse.json(
                { message: "the id is not found" },
                { status: 404 },
            );
        }
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع عرض الطلب لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const order = await prisma.order.findUnique({
            where: { id: orderID },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
        if (!order) {
            return NextResponse.json(
                { message: "الطلب غير موجود" },
                { status: 404 },
            );
        }
        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};

// Update order
export const PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ orderID: string }> },
) => {
    try {
        const { orderID } = await params;
        if (!orderID) {
            return NextResponse.json(
                { message: "the id is not found" },
                { status: 404 },
            );
        }
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع تعديل الطلب لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const body: { status: OrderStatus } = await request.json();
        const createShema = z.object({
            status: z.enum(
                ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
                {
                    errorMap: () => ({
                        message: "هذه القيمه غير موجوده فى الاختيرات",
                    }),
                },
            ),
        });
        const validation = createShema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 },
            );
        }
        const updOrder = await prisma.order.update({
            where: { id: orderID },
            data: { status: body.status },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
        return NextResponse.json(updOrder, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
