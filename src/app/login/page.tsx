"use client";

import { SubmitEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowLeft,
    FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { FieldWrapper, Input } from "@/components/ui/Input";
import { loginSchema, LoginValues } from "@/lib/validations";
import { Suspense } from "react";
import axios from "axios";

// ─── Inner component (reads searchParams) ───────────────────────────────────

function LoginForm() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // callbackUrl: الصفحة اللي المستخدم جاي منها قبل ما يتوجه للـ login
    // لو مفيش callbackUrl نرجع للرئيسية
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";

    const [values, setValues] = useState<LoginValues>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<
        Partial<Record<keyof LoginValues, string>>
    >({});
    const [apiError, setApiError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // لو المستخدم بالفعل logged in، حوّله فورًا للـ callbackUrl
    useEffect(() => {
        if (user?.name) {
            router.replace(callbackUrl);
        }
    }, [user, callbackUrl, router]);

    function handleChange<K extends keyof LoginValues>(key: K, value: string) {
        setValues((prev) => ({ ...prev, [key]: value }));
        // امسح الـ error للحقل لما المستخدم يبدأ يكتب تاني
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
        if (apiError) setApiError("");
    }

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        // ── Client-side validation ──────────────────────────────────────────────
        const result = loginSchema.safeParse(values);
        if (!result.success) {
            const fieldErrors: typeof errors = {};
            result.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof LoginValues;
                fieldErrors[key] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setSubmitting(true);
        setApiError("");

        try {
            // ── API call ─────────────────────────────────────────────────────────
            const res = axios.post("http://localhost:3000/api/user/login", {
                email: values.email,
                password: values.password,
            });
            setUser((await res).data);
            localStorage.setItem("user", JSON.stringify((await res).data));
            router.replace("/");
            console.log(user);
        } catch (err: unknown) {
            // استخرج رسالة الخطأ من الـ API response
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
            {/* ── Form ── */}
            <div className="order-2 mx-auto w-full max-w-md lg:order-1">
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
                    أهلًا بعودتك
                </h1>
                <p className="mt-2 text-sm text-ink-soft">
                    سجّل الدخول لمتابعة طلباتك والاستمتاع بتجربة تسوق أسرع.
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
                        label="البريد الإلكتروني"
                        required
                        error={errors.email}
                    >
                        <div className="relative">
                            <FiMail
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint"
                                size={16}
                            />
                            <Input
                                type="email"
                                dir="ltr"
                                className="ps-4 pe-11"
                                value={values.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                placeholder="example@email.com"
                            />
                        </div>
                    </FieldWrapper>

                    <FieldWrapper
                        label="كلمة المرور"
                        required
                        error={errors.password}
                    >
                        <div className="relative">
                            <FiLock
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint"
                                size={16}
                            />
                            <Input
                                type={showPassword ? "text" : "password"}
                                dir="ltr"
                                className="ps-11 pe-11"
                                value={values.password}
                                onChange={(e) =>
                                    handleChange("password", e.target.value)
                                }
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-soft"
                                aria-label={
                                    showPassword
                                        ? "إخفاء كلمة المرور"
                                        : "إظهار كلمة المرور"
                                }
                            >
                                {showPassword ? (
                                    <FiEyeOff size={16} />
                                ) : (
                                    <FiEye size={16} />
                                )}
                            </button>
                        </div>
                    </FieldWrapper>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-ink-soft">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-line text-sage-600 focus:ring-sage-500/40"
                            />
                            تذكرني
                        </label>
                        <a
                            href="#"
                            className="font-semibold text-sage-700 hover:text-sage-800"
                        >
                            نسيت كلمة المرور؟
                        </a>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        className="w-full"
                    >
                        {submitting ? "جاري الدخول..." : "تسجيل الدخول"}
                        {!submitting && <FiArrowLeft size={18} />}
                    </Button>
                </form>

                <p className="mt-7 text-center text-sm text-ink-soft">
                    لسه معكيش حساب؟{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-sage-700 hover:text-sage-800"
                    >
                        إنشاء حساب جديد
                    </Link>
                </p>
            </div>

            {/* ── Hero image ── */}
            <div className="relative order-1 hidden aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift lg:order-2 lg:block">
                <Image
                    src="https://picsum.photos/seed/mada-login/700/880"
                    alt="مدى"
                    fill
                    sizes="40vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                    <p className="font-display text-2xl font-bold text-cream-soft">
                        على مدى يومك، اختاري ما يليق بك
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Page (wraps with Suspense for useSearchParams) ──────────────────────────

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="wrap py-24 text-center text-sm text-ink-soft">
                    جاري التحميل...
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
