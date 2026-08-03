import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { NextRequest, NextResponse } from "next/server";

// get all users
export const GET = async (request: NextRequest) => {
    try {
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع عرض المستخدمين لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const users = await prisma.user.findMany({
            include: {
                orders: { select: { total: true, id: true } },
            },
        });
        if (!users) {
            return NextResponse.json(
                { message: "categoreis not found" },
                { status: 404 },
            );
        }
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
