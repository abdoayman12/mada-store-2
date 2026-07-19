import { User } from "@/generated/prisma/client";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { NextRequest } from "next/server";
// generate token
export function generateToken(payload: User): string {
    const token: string = jwt.sign(payload, process.env.JWT_SECRET!);
    return token;
}
// set cookie
export function setCookie(token: string): string {
    const cookie: string = serialize("jwtTokenMada", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 dayes
        path: "/",
    });
    return cookie;
}
// get data from cookie
export const verifyToken = (request: NextRequest): User | null => {
    try {
        const token = request.cookies.get("jwtTokenMada")?.value;
        if (!token) return null;

        const verifiedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
        ) as User;
        return verifiedToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};
