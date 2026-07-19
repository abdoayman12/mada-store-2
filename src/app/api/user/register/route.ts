import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { RegisterUserDto } from "@/lib/types";
import bcrypt from "bcryptjs";
import { generateToken, setCookie } from "@/lib/tokenAndCookies";

export const POST = async (request: NextRequest) => {
    try {
        const body: RegisterUserDto = await request.json();
        // validations with user data
        const createSchema = z.object({
            name: z.string().min(3, "الاسم يجب ألا يقل عن 3 أحرف"),
            email: z
                .string()
                .min(1, "البريد الإلكتروني مطلوب")
                .email("صيغة البريد الإلكتروني غير صحيحة"),
            phone: z
                .string()
                .min(1, "رقم الهاتف مطلوب")
                .regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم هاتف مصري غير صحيح"),
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
        if (user) {
            return NextResponse.json(
                { message: "هذا المستخدم موجود بالفعل." },
                { status: 400 },
            );
        }
        const userPhone = await prisma.user.findUnique({
            where: {phone: body.phone}
        }) 
        if (userPhone) {
            return NextResponse.json(
                { message: "يجب عليك ادخال رقم هاتف غير مستخدم بالفعل" },
                { status: 400 },
            );
        }
        // hash password user
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(body.password, salt);
        // add user in dataBase
        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                password: hashPassword,
            },
        });
        const token = generateToken(newUser);
        const cookie = setCookie(token);
        return NextResponse.json(newUser, {
            status: 201,
            headers: { "Set-Cookie": cookie },
        });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} please try again` },
            { status: 400 },
        );
    }
};
