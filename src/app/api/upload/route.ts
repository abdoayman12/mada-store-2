import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/tokenAndCookies";

export const POST = async (request: NextRequest) => {
    try {
        // ── حماية: أدمن فقط ──────────────────────────────────────────────
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
        }

        // ── قراءة الملف ───────────────────────────────────────────────────
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { message: "لم يتم إرسال أي ملف" },
                { status: 400 },
            );
        }

        // ── التحقق من نوع الملف ───────────────────────────────────────────
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowed.includes(file.type)) {
            return NextResponse.json(
                { message: "نوع الملف غير مسموح — jpg / png / webp / gif فقط" },
                { status: 400 },
            );
        }

        // ── التحقق من الحجم (5 MB) ────────────────────────────────────────
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { message: "حجم الصورة يتجاوز الحد المسموح (5 MB)" },
                { status: 400 },
            );
        }

        // ── تجهيز اسم فريد للملف ─────────────────────────────────────────
        const ext = file.name.split(".").pop() ?? "jpg";
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        // ── الحفظ في public/uploads/ ──────────────────────────────────────
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(join(uploadDir, safeName), buffer);

        const url = `/uploads/${safeName}`;
        return NextResponse.json({ url }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: `${error} — حاول تاني` },
            { status: 500 },
        );
    }
};
