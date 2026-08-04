import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokenAndCookies";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
    request: NextRequest,
    { params }: { params: Promise<{ userID: string }> },
) => {
    try {
        const { userID } = await params;
        if (!userID) {
            return NextResponse.json(
                { message: "the userID is not found" },
                { status: 404 },
            );
        }
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "انت لا تستطيع عرض المستخدمين لانك مستخدم عادى" },
                { status: 401 },
            );
        }
        const body: { active: boolean } = await request.json();
        if (!body) {
            return NextResponse.json(
                { message: "the body data is not found" },
                { status: 404 },
            );
        }
        const newUser = await prisma.user.update({
            where: { id: userID },
            data: { active: body.active },
        });
        return NextResponse.json(newUser, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
