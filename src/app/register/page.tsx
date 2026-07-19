"use client";

import { SubmitEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { FieldWrapper, Input } from "@/components/ui/Input";
import { registerSchema, RegisterValues } from "@/lib/validations";
import axios from "axios";

const initialValues: RegisterValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
};

export default function RegisterPage() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const [values, setValues] = useState<RegisterValues>(initialValues);
    const [errors, setErrors] = useState<
        Partial<Record<keyof RegisterValues, string>>
    >({});
    const [apiError, setApiError] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [agreeError, setAgreeError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // لو مسجل دخول بالفعل ارجعه للرئيسية
    useEffect(() => {
        if (user?.name) {
            router.replace("/");
        }
    }, [user, router]);

    function handleChange<K extends keyof RegisterValues>(
        key: K,
        value: string,
    ) {
        setValues((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
        if (apiError) setApiError("");
    }

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();

        // ── Client-side validation ──────────────────────────────────────────────
        const result = registerSchema.safeParse(values);
        let hasError = false;

        if (!result.success) {
            const fieldErrors: typeof errors = {};
            result.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof RegisterValues;
                fieldErrors[key] = issue.message;
            });
            setErrors(fieldErrors);
            hasError = true;
        } else {
            setErrors({});
        }

        if (!agreed) {
            setAgreeError("لازم توافق على الشروط والأحكام للمتابعة");
            hasError = true;
        } else {
            setAgreeError("");
        }

        if (hasError) return;

        setSubmitting(true);
        setApiError("");

        try {
            // ── API call ─────────────────────────────────────────────────────────
            const res = axios.post("http://localhost:3000/api/user/register", {
                name: values.name,
                email: values.email,
                phone: values.phone,
                password: values.password,
            });
            setUser((await res).data);
            localStorage.setItem("user", JSON.stringify((await res).data));
            router.replace("/");
            console.log(user);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? "حدث خطأ ما، حاول تاني";
            setApiError(message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="wrap grid min-h-[70vh] items-center gap-12 py-14 lg:grid-cols-2">
            {/* ── Hero image ── */}
            <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift lg:block">
                <Image
                    src="https://picsum.photos/seed/mada-register/700/880"
                    alt="مدى"
                    fill
                    sizes="40vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                    <p className="font-display text-2xl font-bold text-cream-soft">
                        انضم لمدى واستمتع بخصم 20٪ على أول طلب
                    </p>
                </div>
            </div>

            {/* ── Form ── */}
            <div className="mx-auto w-full max-w-md">
                <Link href="/" className="inline-flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="مدى"
                        width={56}
                        height={32}
                        className="h-8 w-auto object-contain"
                    />
                </Link>
                <h1 className="mt-6 font-display text-3xl font-bold text-ink">
                    إنشاء حساب جديد
                </h1>
                <p className="mt-2 text-sm text-ink-soft">
                    خلص طلبك أسرع وتابع حالة طلباتك بسهولة.
                </p>

                {/* رسالة خطأ API */}
                {apiError && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        <FiAlertCircle size={16} />
                        {apiError}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="mt-8 space-y-5"
                >
                    <FieldWrapper
                        label="الاسم الكامل"
                        required
                        error={errors.name}
                    >
                        <Input
                            value={values.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                            placeholder="مثال: محمد أحمد"
                        />
                    </FieldWrapper>

                    <FieldWrapper
                        label="البريد الإلكتروني"
                        required
                        error={errors.email}
                    >
                        <Input
                            type="email"
                            dir="ltr"
                            value={values.email}
                            onChange={(e) =>
                                handleChange("email", e.target.value)
                            }
                            placeholder="example@email.com"
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

                    <div className="grid gap-5 sm:grid-cols-2">
                        <FieldWrapper
                            label="كلمة المرور"
                            required
                            error={errors.password}
                        >
                            <Input
                                type="password"
                                dir="ltr"
                                value={values.password}
                                onChange={(e) =>
                                    handleChange("password", e.target.value)
                                }
                                placeholder="••••••••"
                            />
                        </FieldWrapper>
                        <FieldWrapper
                            label="تأكيد كلمة المرور"
                            required
                            error={errors.confirmPassword}
                        >
                            <Input
                                type="password"
                                dir="ltr"
                                value={values.confirmPassword}
                                onChange={(e) =>
                                    handleChange(
                                        "confirmPassword",
                                        e.target.value,
                                    )
                                }
                                placeholder="••••••••"
                            />
                        </FieldWrapper>
                    </div>

                    <div>
                        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => {
                                    setAgreed(e.target.checked);
                                    if (e.target.checked) setAgreeError("");
                                }}
                                className="mt-0.5 h-4 w-4 rounded border-line text-sage-600 focus:ring-sage-500/40"
                            />
                            <span>
                                موافقة على{" "}
                                <a
                                    href="#"
                                    className="font-semibold text-sage-700 hover:text-sage-800"
                                >
                                    الشروط والأحكام
                                </a>{" "}
                                وسياسة الخصوصية
                            </span>
                        </label>
                        {agreeError && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {agreeError}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        className="w-full"
                    >
                        {submitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                        {!submitting && <FiArrowLeft size={18} />}
                    </Button>
                </form>

                <p className="mt-7 text-center text-sm text-ink-soft">
                    عندك حساب بالفعل؟{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-sage-700 hover:text-sage-800"
                    >
                        تسجيل الدخول
                    </Link>
                </p>
            </div>
        </div>
    );
}
