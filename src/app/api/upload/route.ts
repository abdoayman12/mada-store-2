import cloudinary from "@/lib/cloudinary";
import { verifyToken } from "@/lib/tokenAndCookies";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        // ── 1. حماية — أدمن فقط ──────────────────────────────────────────
        const user = verifyToken(request);
        if (!user || user.isAdmin !== true) {
            return NextResponse.json(
                { message: "غير مصرح — أدمن فقط" },
                { status: 401 },
            );
        }

        // ── 2. قراءة الملف من الـ request ────────────────────────────────
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { message: "لم يتم إرسال أي ملف" },
                { status: 400 },
            );
        }

        // ── 3. التحقق من نوع الملف ────────────────────────────────────────
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { message: "نوع الملف غير مدعوم — jpg / png / webp / gif فقط" },
                { status: 400 },
            );
        }

        // ── 4. التحقق من الحجم (5 MB) ─────────────────────────────────────
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { message: "حجم الصورة يتجاوز الحد المسموح (5 MB)" },
                { status: 400 },
            );
        }

        // ── 5. تحويل الملف لـ base64 Data URI عشان Cloudinary يقدر يقراه ──
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

        // ── 6. رفع لـ Cloudinary ───────────────────────────────────────────
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: "mada-store/products", // بيتنظموا في folder واحد
            resource_type: "image",
            // تحويل تلقائي لـ webp لتوفير مساحة وتحسين الأداء
            format: "webp",
            // ضبط الجودة تلقائي من Cloudinary
            quality: "auto",
        });

        // result.secure_url → https://res.cloudinary.com/your-cloud/...
        return NextResponse.json({ url: result.secure_url }, { status: 201 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { message: "فشل الرفع، حاول تاني" },
            { status: 500 },
        );
    }
};
