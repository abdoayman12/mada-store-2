import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { LoginUserDto } from "@/lib/types";
import bcrypt from "bcryptjs";
import { generateToken, setCookie } from "@/lib/tokenAndCookies";

export const POST = async (request: NextRequest) => {
    try {
        const body: LoginUserDto = await request.json();
        // validations with user data
        const createSchema = z.object({
            email: z
                .string()
                .min(1, "البريد الإلكتروني مطلوب")
                .email("صيغة البريد الإلكتروني غير صحيحة"),
            password: z.string().min(6, "كلمة المرور يجب ألا تقل عن 6 أحرف"),
        });
        const validation = createSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 },
            );
        }
        // find user
        const user = await prisma.user.findUnique({
            where: { email: body.email },
        });
        if (!user) {
            return NextResponse.json(
                {
                    message:
                        "ليس لديك حساب، يرجى إنشاء حساب أولاً!",
                },
                { status: 400 },
            );
        }
        // check password user
        const isPasswordMacth = await bcrypt.compare(
            body.password,
            user.password,
        );
        if (!isPasswordMacth) {
            return NextResponse.json(
                {
                    message: "كلمة المرور أو البريد الإلكتروني غير صحيح",
                },
                { status: 400 },
            );
        }
        const token = generateToken(user);
        const cookie = setCookie(token);
        return NextResponse.json(user, {
            status: 200,
            headers: { "Set-Cookie": cookie },
        });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 400 },
        );
    }
};
