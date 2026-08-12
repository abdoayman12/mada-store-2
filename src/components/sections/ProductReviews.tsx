"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FiAlertCircle } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import StarSelector from "@/components/ui/StarSelector";
import { Review } from "@/lib/types";
import { buildDistribution, calcAvg } from "@/lib/data";
import ReviewCard from "../ui/ReviewCard";
import DistributionBar from "../ui/DistributionBar";

export default function ProductReviews({ productId }: { productId: string }) {
    const { user } = useAuth();

    // ── State ──────────────────────────────────────────────────────────────
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    // فورم الإضافة/التعديل
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

    console.log(fetchError)

    // ── Fetch Reviews ──────────────────────────────────────────────────────
    async function fetchReviews() {
        try {
            const { data } = await axios.get<Review[]>(
                `/api/reviews/${productId}`,
            );
            setReviews(data);
            setFetchError("");
        } catch (error: unknown) {
            setFetchError("تعذّر تحميل التقييمات، حاول تاني");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    // ── Derived data ───────────────────────────────────────────────────────
    const avg = calcAvg(reviews);
    const dist = buildDistribution(reviews);
    const userReview = reviews.find((r) => r.userId === user?.id);

    // ── Open form for adding ────────────────────────────────────────────────
    function openAddForm() {
        setEditingId(null);
        setRating(0);
        setComment("");
        setSubmitError("");
        setSubmitSuccess("");
        setFormOpen(true);
    }

    // ── Open form for editing ───────────────────────────────────────────────
    function openEditForm(review: Review) {
        setEditingId(review.id);
        setRating(review.rating);
        setComment(review.comment ?? "");
        setSubmitError("");
        setSubmitSuccess("");
        setFormOpen(true);
    }

    // ── Submit review (add or update) ──────────────────────────────────────
    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (rating === 0) {
            setSubmitError("اختر عدد النجوم أولًا");
            return;
        }

        setSubmitting(true);
        setSubmitError("");
        setSubmitSuccess("");

        try {
            await axios.post(`/api/reviews/${productId}`, { rating, comment });
            setSubmitSuccess(
                editingId ? "تم تعديل تقييمك بنجاح" : "تم إضافة تقييمك بنجاح",
            );
            setFormOpen(false);
            await fetchReviews(); // إعادة تحميل التقييمات
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? "حدث خطأ، حاول تاني";
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    }

    // ── Delete review ──────────────────────────────────────────────────────
    async function handleDelete() {
        if (!confirm("هتحذف تقييمك؟")) return;
        try {
            await axios.delete(`/api/reviews/${productId}`);
            setSubmitSuccess("تم حذف تقييمك");
            setFormOpen(false);
            await fetchReviews();
        } catch {
            setSubmitError("حدث خطأ أثناء الحذف");
        }
    }

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <section className="mt-20">
            {/* ── Header ── */}
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
                <div>
                    <h2 className="font-display text-2xl font-bold text-ink">
                        تقييمات العملاء
                    </h2>
                    <p className="mt-1 text-sm text-ink-soft">
                        {reviews.length > 0
                            ? `${reviews.length} تقييم`
                            : "لا توجد تقييمات بعد — كن أول من يقيّم"}
                    </p>
                </div>

                {/* زر الإضافة */}
                {user?.name ? (
                    !userReview && !formOpen ? (
                        <button
                            type="button"
                            onClick={openAddForm}
                            className="rounded-full bg-sage-600 px-5 py-2.5 text-sm font-bold text-cream-soft transition hover:bg-sage-700"
                        >
                            أضف تقييمك
                        </button>
                    ) : null
                ) : (
                    <Link
                        href={`/login?callbackUrl=/products/${productId}`}
                        className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-sage-500 hover:text-sage-700"
                    >
                        سجّل دخولك لإضافة تقييم
                    </Link>
                )}
            </div>

            {/* ── رسائل النجاح والخطأ ── */}
            {submitSuccess && (
                <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                    {submitSuccess}
                </div>
            )}

            {/* ── Overview: متوسط + توزيع النجوم ── */}
            {reviews.length > 0 && (
                <div className="mt-8 grid gap-6 sm:grid-cols-[auto_1fr]">
                    {/* متوسط كبير */}
                    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white px-10 py-6 shadow-soft">
                        <span className="font-display text-5xl font-bold text-ink">
                            {avg.toFixed(1)}
                        </span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <FaStar
                                    key={s}
                                    size={16}
                                    className={
                                        s <= Math.round(avg)
                                            ? "text-clay-400"
                                            : "text-ink-faint"
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-xs text-ink-soft">
                            من {reviews.length} تقييم
                        </span>
                    </div>

                    {/* أشرطة التوزيع */}
                    <div className="flex flex-col justify-center gap-2 rounded-2xl bg-white p-5 shadow-soft">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <DistributionBar
                                key={star}
                                star={star}
                                count={dist[star]}
                                total={reviews.length}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ── فورم الإضافة/التعديل ── */}
            {formOpen && (
                <div className="mt-8 rounded-2xl border-2 border-sage-200 bg-white p-6 shadow-soft">
                    <h3 className="font-display text-lg font-bold text-ink">
                        {editingId ? "تعديل تقييمك" : "أضف تقييمك"}
                    </h3>

                    {submitError && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
                            <FiAlertCircle size={15} />
                            {submitError}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-5 space-y-5"
                    >
                        {/* اختيار النجوم */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-ink">
                                تقييمك <span className="text-clay-500">*</span>
                            </label>
                            <StarSelector value={rating} onChange={setRating} />
                        </div>

                        {/* التعليق */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-ink">
                                تعليقك{" "}
                                <span className="text-ink-faint font-normal">
                                    (اختياري)
                                </span>
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="شاركنا تجربتك مع المنتج..."
                                rows={4}
                                className="w-full rounded-xl border border-line bg-cream-soft px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500/30 resize-y"
                            />
                        </div>

                        {/* الأزرار */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-full bg-sage-600 px-6 py-2.5 text-sm font-bold text-cream-soft transition hover:bg-sage-700 disabled:opacity-60"
                            >
                                {submitting
                                    ? "جاري الحفظ..."
                                    : editingId
                                      ? "حفظ التعديل"
                                      : "نشر التقييم"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormOpen(false);
                                    setSubmitError("");
                                }}
                                className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-sage-50"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── قائمة التقييمات ── */}
            <div className="mt-8 space-y-4">
                {loading && (
                    <div className="py-8 text-center text-sm text-ink-soft">
                        جاري تحميل التقييمات...
                    </div>
                )}

                {fetchError && (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-red-500">
                        <FiAlertCircle size={16} />
                        {fetchError}
                    </div>
                )}

                {!loading && !fetchError && reviews.length === 0 && (
                    <div className="rounded-2xl bg-white py-12 text-center shadow-soft">
                        <p className="text-sm text-ink-soft">
                            لا توجد تقييمات بعد — كن أول من يقيّم هذا المنتج
                        </p>
                    </div>
                )}

                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        isOwner={user?.id === review.userId}
                        onEdit={() => openEditForm(review)}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </section>
    );
}
