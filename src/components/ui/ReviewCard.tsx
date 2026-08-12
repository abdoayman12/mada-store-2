import { formatDate } from "@/lib/data";
import { Review } from "@/lib/types";
import { FaStar } from "react-icons/fa";
import { FiEdit2, FiTrash2, FiUser } from "react-icons/fi";

function ReviewCard({
    review,
    isOwner,
    onEdit,
    onDelete,
}: {
    review: Review;
    isOwner: boolean;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-50 text-sage-700">
                        <FiUser size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-ink">
                            {review.user.name}
                        </p>
                        <p className="text-xs text-ink-faint">
                            {formatDate(review.createdAt)}
                        </p>
                    </div>
                </div>

                {/* أيقونات التعديل والحذف — للمالك فقط */}
                {isOwner && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={onEdit}
                            aria-label="تعديل التقييم"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition hover:bg-sage-50 hover:text-sage-700"
                        >
                            <FiEdit2 size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={onDelete}
                            aria-label="حذف التقييم"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition hover:bg-red-50 hover:text-red-500"
                        >
                            <FiTrash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* النجوم */}
            <div className="mt-3 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar
                        key={s}
                        size={14}
                        className={
                            s <= review.rating
                                ? "text-clay-400"
                                : "text-ink-faint"
                        }
                    />
                ))}
            </div>

            {/* التعليق */}
            {review.comment && (
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                    {review.comment}
                </p>
            )}
        </div>
    );
}

export default ReviewCard;
