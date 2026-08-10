"use client";

import { useRef, useState, DragEvent } from "react";
import axios from "axios";
import { FiUpload, FiLink, FiX, FiStar, FiImage } from "react-icons/fi";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
    images: string[]; // الـ array الحالية من الـ form state
    onChange: (images: string[]) => void; // تحديث الـ form state
    maxImages?: number; // الحد الأقصى (default 6)
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImageUploader({
    images,
    onChange,
    maxImages = 6,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [urlInput, setUrlInput] = useState("");
    const [urlMode, setUrlMode] = useState(false); // إظهار حقل URL
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const canAddMore = images.length < maxImages;

    // ── رفع ملف واحد للـ API ─────────────────────────────────────────────────
    async function uploadFile(file: File) {
        setError("");
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const { data } = await axios.post<{ url: string }>(
                "/api/upload",
                fd,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            onChange([...images, data.url]);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? "فشل الرفع، حاول تاني";
            setError(msg);
        } finally {
            setUploading(false);
        }
    }

    // ── اختيار ملف من الجهاز ─────────────────────────────────────────────────
    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        // رفع كل ملف واحد تلو الآخر لحد ما نوصل للحد الأقصى
        for (const file of files) {
            if (images.length >= maxImages) break;
            await uploadFile(file);
        }
        // reset input عشان نقدر نختار نفس الملف تاني لو المستخدم حذفه
        e.target.value = "";
    }

    // ── Drag & Drop ───────────────────────────────────────────────────────────
    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        setDragging(true);
    }

    function handleDragLeave() {
        setDragging(false);
    }

    async function handleDrop(e: DragEvent) {
        e.preventDefault();
        setDragging(false);
        if (!canAddMore) return;
        const files = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/"),
        );
        for (const file of files) {
            if (images.length >= maxImages) break;
            await uploadFile(file);
        }
    }

    // ── إضافة عن طريق URL ────────────────────────────────────────────────────
    function handleAddUrl() {
        const url = urlInput.trim();
        if (!url) return;
        if (!url.startsWith("http")) {
            setError("الرابط يجب أن يبدأ بـ http");
            return;
        }
        if (images.includes(url)) {
            setError("هذه الصورة مضافة بالفعل");
            return;
        }
        onChange([...images, url]);
        setUrlInput("");
        setUrlMode(false);
        setError("");
    }

    // ── حذف صورة ─────────────────────────────────────────────────────────────
    function removeImage(index: number) {
        onChange(images.filter((_, i) => i !== index));
    }

    // ── نقل صورة للأول (تصبح cover) ──────────────────────────────────────────
    function makeCover(index: number) {
        if (index === 0) return;
        const next = [...images];
        const [moved] = next.splice(index, 1);
        next.unshift(moved);
        onChange(next);
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-3">
            {/* ── شبكة الصور الحالية ── */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {images.map((url, i) => (
                        <div
                            key={url}
                            className="group relative aspect-square overflow-hidden rounded-xl border-2 border-[#E3DECF] bg-[#F7F4EC]"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={url}
                                alt={`صورة ${i + 1}`}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0ede5'/%3E%3C/svg%3E";
                                }}
                            />

                            {/* شارة الـ Cover على أول صورة */}
                            {i === 0 && (
                                <span className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-[#71896A] px-2 py-0.5 text-[10px] font-bold text-white">
                                    <FiStar size={9} />
                                    غلاف
                                </span>
                            )}

                            {/* أزرار ظاهرة عند hover */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                {i !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => makeCover(i)}
                                        title="اعمله غلاف"
                                        className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-[#2A2E26] transition hover:bg-[#EFF3ED]"
                                    >
                                        <FiStar size={11} />
                                        غلاف
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    title="حذف الصورة"
                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
                                >
                                    <FiX size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── منطقة الرفع (drag & drop) ── */}
            {canAddMore && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !urlMode && fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition ${
                        dragging
                            ? "border-[#71896A] bg-[#EFF3ED]"
                            : "border-[#E3DECF] bg-[#FAFBF5] hover:border-[#A2B79B] hover:bg-[#F7F4EC]"
                    } ${uploading ? "pointer-events-none opacity-60" : ""}`}
                >
                    {uploading ? (
                        <>
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#71896A] border-t-transparent" />
                            <p className="text-sm text-[#666C5E]">
                                جاري الرفع...
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF3ED] text-[#71896A]">
                                <FiImage size={22} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#2A2E26]">
                                    اسحب الصور هنا أو اضغط للاختيار
                                </p>
                                <p className="mt-1 text-xs text-[#9A9F8F]">
                                    JPG, PNG, WebP — الحد الأقصى 5 MB للصورة
                                    {maxImages > 1 &&
                                        ` — يمكنك إضافة حتى ${maxImages} صور`}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── أزرار الإضافة ── */}
            {canAddMore && !uploading && (
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-full border border-[#E3DECF] bg-white px-4 py-2 text-sm font-semibold text-[#2A2E26] transition hover:border-[#71896A] hover:bg-[#EFF3ED] hover:text-[#71896A]"
                    >
                        <FiUpload size={14} />
                        رفع صورة
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setUrlMode((v) => !v);
                            setError("");
                        }}
                        className="flex items-center gap-2 rounded-full border border-[#E3DECF] bg-white px-4 py-2 text-sm font-semibold text-[#2A2E26] transition hover:border-[#71896A] hover:bg-[#EFF3ED] hover:text-[#71896A]"
                    >
                        <FiLink size={14} />
                        إضافة رابط
                    </button>
                </div>
            )}

            {/* ── حقل URL ── */}
            {urlMode && (
                <div className="flex gap-2">
                    <input
                        type="url"
                        dir="ltr"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 rounded-xl border border-[#E3DECF] bg-white px-4 py-2 text-sm text-[#2A2E26] placeholder:text-[#9A9F8F] focus:border-[#71896A] focus:outline-none focus:ring-2 focus:ring-[#71896A]/20"
                    />
                    <button
                        type="button"
                        onClick={handleAddUrl}
                        className="rounded-xl bg-[#71896A] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#5B6F55]"
                    >
                        إضافة
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setUrlMode(false);
                            setUrlInput("");
                            setError("");
                        }}
                        className="rounded-xl border border-[#E3DECF] px-4 py-2 text-sm font-semibold text-[#666C5E] transition hover:bg-[#F7F4EC]"
                    >
                        إلغاء
                    </button>
                </div>
            )}

            {/* رسالة خطأ */}
            {error && (
                <p className="text-xs font-medium text-red-600">{error}</p>
            )}

            {/* عداد الصور */}
            <p className="text-xs text-[#9A9F8F]">
                {images.length} / {maxImages} صور —{" "}
                <span className="text-[#71896A]">
                    أول صورة هي الغلاف، اضغط على أي صورة لجعلها الغلاف
                </span>
            </p>

            {/* input مخفي للملفات */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
