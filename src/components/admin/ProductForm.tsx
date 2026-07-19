"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheck } from "react-icons/fi";
import { FormStateProduct } from "@/lib/types";
import { FieldWrapper, Input, Textarea, Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCatgory } from "@/context/CategoryContext";
import axios from "axios";
import { useProducts } from "@/context/ProductsContext";
import { Product } from "@/generated/prisma/client";

// ── DB → Form ─────────────────────────────────────────────────────────────────
// لو المنتج موجود (edit): بيحوّل الـ array لأسطر في الـ Textarea
// مثال: ["100 مل", "خالٍ من الكحول"] → "100 مل\nخالٍ من الكحول"

function toFormState(product?: Partial<Product>): FormStateProduct {
    return {
        name: product?.name ?? "",
        categoryId: product?.categoryId ?? "",
        price: product?.price?.toString() ?? "",
        compareAtPrice: product?.compareAtPrice?.toString() ?? "",
        description: product?.description ?? "",
        details: product?.details?.join("\n") ?? "", // ← join هنا
        inStock: product?.inStock ?? true,
        isNew: product?.isNew ?? false,
        isBestSeller: product?.isBestSeller ?? false,
    };
}

// ── Form → API ────────────────────────────────────────────────────────────────
// بيحوّل الـ string رجع لـ array قبل ما يبعت للـ API أو الـ DB
// مثال: "100 مل\n\nخالٍ من الكحول\n" → ["100 مل", "خالٍ من الكحول"]

function parseDetails(raw: string): string[] {
    return raw
        .split("\n") // فصّل على كل سطر
        .map((s) => s.trim()) // شيل مسافات من الأول والآخر
        .filter(Boolean); // شيل الأسطر الفاضية
}

// ─── Component ────────────────────────────────────────────────────────────────

type Errors = Partial<Record<keyof FormStateProduct, string>>;

export default function ProductForm({ product }: { product?: Product }) {
    const router = useRouter();
    const isEdit = Boolean(product);
    const [form, setForm] = useState<FormStateProduct>(() =>
        toFormState(product),
    );
    const [errors, setErrors] = useState<Errors>({});
    const [saved, setSaved] = useState(false);
    const { category } = useCatgory();
    const { products, setProducts } = useProducts();

    // functions--------------------
    function set<K extends keyof FormStateProduct>(
        key: K,
        value: FormStateProduct[K],
    ) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function validate(): boolean {
        const e: Errors = {};
        if (!form.name.trim()) e.name = "اسم المنتج مطلوب";
        if (!form.categoryId) e.categoryId = "اختر الفئة";
        if (!form.price || isNaN(Number(form.price)))
            e.price = "السعر مطلوب وصحيح";
        if (!form.description.trim()) e.description = "الوصف مطلوب";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;

        // ── البيانات الجاهزة للـ API ──────────────────────────────────────────
        const payload = {
            name: form.name.trim(),
            categoryId: form.categoryId,
            price: Number(form.price),
            compareAtPrice: form.compareAtPrice
                ? Number(form.compareAtPrice)
                : undefined,
            description: form.description.trim(),
            details: parseDetails(form.details), // ← split هنا → string[]
            inStock: form.inStock,
            isNew: form.isNew,
            isBestSeller: form.isBestSeller,
        };

        if (isEdit && product) {
            try {
                const res = await axios.put(
                    `http://localhost:3000/api/products/${product.id}`,
                    payload,
                );
                const productsUpd = products.map((p) =>
                    p.id === product.id ? res.data : p,
                );
                setProducts(productsUpd);
                localStorage.setItem("products", JSON.stringify(productsUpd));
                setSaved(true);
                setTimeout(() => router.replace("/admin/products"), 1000);
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const res = await axios.post(
                    "http://localhost:3000/api/products",
                    payload,
                );
                setProducts([...products, res.data]);
                localStorage.setItem(
                    "products",
                    JSON.stringify([...products, res.data]),
                );
                setSaved(true);
                setTimeout(() => router.replace("/admin/products"), 1000);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {saved && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                    <FiCheck size={16} />
                    {isEdit
                        ? "تم تحديث المنتج بنجاح"
                        : "تم إضافة المنتج بنجاح"}{" "}
                    — جاري التحويل...
                </div>
            )}

            <div className="rounded-2xl bg-white p-6 shadow-soft space-y-5">
                <h2 className="font-display text-base font-bold text-[#2A2E26] border-b border-[#E3DECF] pb-3">
                    المعلومات الأساسية
                </h2>

                <FieldWrapper label="اسم المنتج" required error={errors.name}>
                    <Input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="مثال: شمعة عود ولافندر"
                    />
                </FieldWrapper>

                <FieldWrapper label="الفئة" required error={errors.categoryId}>
                    <Select
                        value={form.categoryId}
                        onChange={(e) => set("categoryId", e.target.value)}
                    >
                        <option value="">اختر الفئة</option>
                        {category.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </Select>
                </FieldWrapper>

                <div className="grid gap-5 sm:grid-cols-2">
                    <FieldWrapper
                        label="السعر (ج.م)"
                        required
                        error={errors.price}
                    >
                        <Input
                            type="number"
                            dir="ltr"
                            min={0}
                            value={form.price}
                            onChange={(e) => set("price", e.target.value)}
                            placeholder="0"
                        />
                    </FieldWrapper>
                    <FieldWrapper label="السعر قبل الخصم (اختياري)">
                        <Input
                            type="number"
                            dir="ltr"
                            min={0}
                            value={form.compareAtPrice}
                            onChange={(e) =>
                                set("compareAtPrice", e.target.value)
                            }
                            placeholder="0"
                        />
                    </FieldWrapper>
                </div>

                <FieldWrapper
                    label="وصف المنتج"
                    required
                    error={errors.description}
                >
                    <Textarea
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder="اكتب وصفًا مختصرًا وجذابًا للمنتج..."
                    />
                </FieldWrapper>

                {/* details: كل سطر = عنصر في الـ array عند الإرسال */}
                <FieldWrapper
                    label="تفاصيل المنتج"
                    hint="كل سطر هيتحول لنقطة (•) في صفحة المنتج — اضغط Enter للسطر الجديد"
                >
                    <Textarea
                        value={form.details} // ← string عادي
                        onChange={(e) => set("details", e.target.value)} // ← بيحفظ كـ string
                        placeholder={
                            "100 مل\nخالٍ من الكحول\nمناسب لكل أنواع البشرة"
                        }
                        className="min-h-[120px] font-mono text-xs leading-6"
                    />
                    {/* معاينة حية للنقاط */}
                    {form.details.trim() && (
                        <ul className="mt-2 space-y-1 rounded-xl border border-[#E3DECF] bg-[#F7F4EC] px-4 py-3">
                            {parseDetails(form.details).map((line, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-xs text-[#2A2E26]"
                                >
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#71896A]" />
                                    {line}
                                </li>
                            ))}
                        </ul>
                    )}
                </FieldWrapper>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-soft space-y-4">
                <h2 className="font-display text-base font-bold text-[#2A2E26] border-b border-[#E3DECF] pb-3">
                    الحالة والوسوم
                </h2>

                <div className="space-y-3">
                    {[
                        { key: "inStock" as const, label: "متوفر في المخزون" },
                        { key: "isNew" as const, label: "وسم «جديد»" },
                        {
                            key: "isBestSeller" as const,
                            label: "وسم «الأكثر طلبًا»",
                        },
                    ].map(({ key, label }) => (
                        <label
                            key={key}
                            className="flex cursor-pointer items-center gap-3"
                        >
                            <div
                                onClick={() => set(key, !form[key])}
                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                    form[key] ? "bg-[#71896A]" : "bg-[#E3DECF]"
                                }`}
                            >
                                <span
                                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
                                        form[key] ? "right-1" : "right-6"
                                    }`}
                                />
                            </div>
                            <span className="text-sm font-semibold text-[#2A2E26]">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button onClick={handleSubmit} size="lg" disabled={saved}>
                    {saved ? (
                        <>
                            <FiCheck size={16} /> تم الحفظ
                        </>
                    ) : isEdit ? (
                        "حفظ التعديلات"
                    ) : (
                        "إضافة المنتج"
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.back()}
                >
                    إلغاء
                </Button>
            </div>
        </div>
    );
}
