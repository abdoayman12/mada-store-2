import { verifyToken } from "@/lib/tokenAndCookies";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const user = verifyToken(request);
        if (!user) {
            return NextResponse.json(
                { message: "انت لم تسجل الدخول" },
                { status: 401 },
            );
        }
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
