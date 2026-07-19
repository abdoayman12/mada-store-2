"use client";

import { SubmitEvent, useState } from "react";
import Image from "next/image";
import { FiCheck, FiTruck, FiCreditCard } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { currency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Input";
import { checkoutSchema, CheckoutValues } from "@/lib/validations";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SHIPPING_FEE = 60;

const governorates = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "الدقهلية",
    "الشرقية",
    "المنوفية",
    "القليوبية",
    "الغربية",
];

const initialValues: CheckoutValues = {
    fullName: "",
    phone: "",
    governorate: "",
    city: "",
    address: "",
    notes: "",
    paymentMethod: "cod",
};

export default function CheckoutPage() {
    const { lines, subtotal, clearCart } = useCart();
    const [values, setValues] = useState<CheckoutValues>(initialValues);
    const [errors, setErrors] = useState<
        Partial<Record<keyof CheckoutValues, string>>
    >({});
    const [placed, setPlaced] = useState(false);

    function handleChange<K extends keyof CheckoutValues>(
        key: K,
        value: CheckoutValues[K],
    ) {
        setValues((prev) => ({ ...prev, [key]: value }));
    }

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        const result = checkoutSchema.safeParse(values);
        if (!result.success) {
            const fieldErrors: typeof errors = {};
            result.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof CheckoutValues;
                fieldErrors[key] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});
        setPlaced(true);
        clearCart();
        // TODO: replace with a Next.js server action that creates the order in the database
    }

    if (placed) {
        return (
            <div className="wrap py-20">
                <EmptyState
                    icon={<FiCheck size={26} />}
                    title="تم استلام طلبك بنجاح"
                    description="هيوصلك تأكيد على رقم هاتفك، وفريقنا هيبدأ يجهز طلبك حالًا."
                    action={
                        <Link href="/products">
                            <Button>متابعة التسوق</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    if (lines.length === 0) {
        return (
            <div className="wrap py-20">
                <EmptyState
                    icon={<FiTruck size={26} />}
                    title="مفيش منتجات لإتمام الطلب"
                    description="ارجعي لسلتك وأضيفي منتجات الأول."
                    action={
                        <Link href="/products">
                            <Button>تصفحي المنتجات</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    const total = subtotal + SHIPPING_FEE;

    return (
        <div className="wrap py-12">
            <div className="border-b border-line pb-6">
                <span className="eyebrow">الخطوة الأخيرة</span>
                <h1 className="mt-2 font-display text-3xl font-bold text-ink">
                    إتمام الطلب
                </h1>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
                <form
                    id="checkout-form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-8"
                >
                    <section className="rounded-2xl bg-white p-6 shadow-soft">
                        <h2 className="font-display text-lg font-bold text-ink">
                            بيانات الشحن
                        </h2>
                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                            <FieldWrapper
                                label="الاسم الكامل"
                                required
                                error={errors.fullName}
                            >
                                <Input
                                    value={values.fullName}
                                    onChange={(e) =>
                                        handleChange("fullName", e.target.value)
                                    }
                                    placeholder="مثال: سارة أحمد"
                                />
                            </FieldWrapper>
                            <FieldWrapper
                                label="رقم الهاتف"
                                required
                                error={errors.phone}
                            >
                                <Input
                                    dir="ltr"
                                    value={values.phone}
                                    onChange={(e) =>
                                        handleChange("phone", e.target.value)
                                    }
                                    placeholder="01000000000"
                                />
                            </FieldWrapper>
                            <FieldWrapper
                                label="المحافظة"
                                required
                                error={errors.governorate}
                            >
                                <Select
                                    value={values.governorate}
                                    onChange={(e) =>
                                        handleChange(
                                            "governorate",
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">اختاري المحافظة</option>
                                    {governorates.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </Select>
                            </FieldWrapper>
                            <FieldWrapper
                                label="المدينة / المنطقة"
                                required
                                error={errors.city}
                            >
                                <Input
                                    value={values.city}
                                    onChange={(e) =>
                                        handleChange("city", e.target.value)
                                    }
                                    placeholder="مثال: مدينة نصر"
                                />
                            </FieldWrapper>
                        </div>
                        <div className="mt-5">
                            <FieldWrapper
                                label="العنوان التفصيلي"
                                required
                                error={errors.address}
                            >
                                <Input
                                    value={values.address}
                                    onChange={(e) =>
                                        handleChange("address", e.target.value)
                                    }
                                    placeholder="اسم الشارع، رقم العمارة، الدور..."
                                />
                            </FieldWrapper>
                        </div>
                        <div className="mt-5">
                            <FieldWrapper label="ملاحظات إضافية (اختياري)">
                                <Textarea
                                    value={values.notes}
                                    onChange={(e) =>
                                        handleChange("notes", e.target.value)
                                    }
                                    placeholder="أي تفاصيل تساعد مندوب التوصيل"
                                />
                            </FieldWrapper>
                        </div>
                    </section>

                    <section className="rounded-2xl bg-white p-6 shadow-soft">
                        <h2 className="font-display text-lg font-bold text-ink">
                            طريقة الدفع
                        </h2>
                        {errors.paymentMethod && (
                            <p className="mt-1 text-xs font-medium text-red-600">
                                {errors.paymentMethod}
                            </p>
                        )}
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <PaymentOption
                                label="الدفع عند الاستلام"
                                description="ادفعي نقدًا عند وصول الطلب"
                                icon={<FiTruck size={18} />}
                                active={values.paymentMethod === "cod"}
                                onClick={() =>
                                    handleChange("paymentMethod", "cod")
                                }
                            />
                            <PaymentOption
                                label="بطاقة ائتمان"
                                description="فيزا أو ماستركارد"
                                icon={<FiCreditCard size={18} />}
                                active={values.paymentMethod === "card"}
                                onClick={() =>
                                    handleChange("paymentMethod", "card")
                                }
                            />
                        </div>
                    </section>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full lg:hidden"
                    >
                        تأكيد الطلب · {currency(total)}
                    </Button>
                </form>

                <aside className="h-fit space-y-5 rounded-2xl bg-white p-6 shadow-soft">
                    <h2 className="font-display text-lg font-bold text-ink">
                        طلبك
                    </h2>
                    <div className="max-h-64 space-y-4 overflow-y-auto pe-1">
                        {lines.map((line) => (
                            <div
                                key={line.productId}
                                className="flex items-center gap-3"
                            >
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sage-50">
                                    <Image
                                        src={line.product.image}
                                        alt={line.product.name}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                    />
                                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-clay-500 text-[10px] font-bold text-cream-soft">
                                        {line.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="line-clamp-1 text-sm font-semibold text-ink">
                                        {line.product.name}
                                    </p>
                                    <p className="text-xs text-ink-soft">
                                        {currency(line.product.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 border-t border-line pt-4">
                        <div className="flex justify-between text-sm text-ink-soft">
                            <span>المجموع الفرعي</span>
                            <span className="font-semibold text-ink">
                                {currency(subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-ink-soft">
                            <span>الشحن</span>
                            <span className="font-semibold text-ink">
                                {currency(SHIPPING_FEE)}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-line pt-3">
                            <span className="font-display font-bold text-ink">
                                الإجمالي
                            </span>
                            <span className="font-display text-lg font-bold text-clay-600">
                                {currency(total)}
                            </span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        form="checkout-form"
                        size="lg"
                        className="hidden w-full lg:flex"
                    >
                        تأكيد الطلب
                    </Button>
                </aside>
            </div>
        </div>
    );
}

function PaymentOption({
    label,
    description,
    icon,
    active,
    onClick,
}: {
    label: string;
    description: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 rounded-xl border-2 p-4 text-right transition",
                active
                    ? "border-sage-600 bg-sage-50"
                    : "border-line hover:border-sage-300",
            )}
        >
            <span
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    active
                        ? "bg-sage-600 text-cream-soft"
                        : "bg-sage-50 text-sage-600",
                )}
            >
                {icon}
            </span>
            <span>
                <span className="block text-sm font-bold text-ink">
                    {label}
                </span>
                <span className="block text-xs text-ink-soft">
                    {description}
                </span>
            </span>
        </button>
    );
}
