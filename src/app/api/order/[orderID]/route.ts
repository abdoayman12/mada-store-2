import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { NextRequest, NextResponse } from "next/server";

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
