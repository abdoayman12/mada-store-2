import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        (await cookies()).delete("jwtTokenMada");
        return NextResponse.json(
            { message: "تم تسجيل الخروج بنجاح" },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 500 },
        );
    }
};
