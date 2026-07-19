"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiAlertCircle,
    FiTag,
} from "react-icons/fi";
import axios from "axios";
import { useCatgory } from "@/context/CategoryContext";

export default function AdminCategoriesPage() {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { category, setCategory } = useCatgory();
    async function confirmDelete(id: string) {
        setLoading(true);
        try {
            axios.delete(`http://localhost:3000/api/categories/${id}`);
            const categoryFilter = category?.filter((item) => item.id !== id);
            setCategory(categoryFilter);
            localStorage.setItem("category", JSON.stringify(categoryFilter));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setDeleteId(null);
        }
    }
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await axios.get(
                    "http://localhost:3000/api/categories",
                );
                console.log(res.data);
                setCategory(res.data);
                localStorage.setItem("category", JSON.stringify(res.data));
            } catch (error) {
                console.error(error);
            }
        }
        fetchCategories();
    }, []);
    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-[#666C5E]">
                    {category?.length} فئة مسجلة
                </p>
                <Link
                    href="/admin/categories/new"
                    className="flex items-center gap-2 rounded-full bg-[#71896A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5B6F55]"
                >
                    <FiPlus size={16} />
                    إضافة فئة
                </Link>
            </div>

            {/* Grid */}
            {category?.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-3xl bg-white py-16 text-center shadow-soft">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF3ED] text-[#71896A]">
                        <FiTag size={24} />
                    </div>
                    <p className="font-display text-lg font-bold text-[#2A2E26]">
                        لا توجد فئات بعد
                    </p>
                    <p className="text-sm text-[#9A9F8F]">
                        ابدأ بإضافة أول فئة للمتجر
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {category?.map((cat) => (
                        <div
                            key={cat.id}
                            className="group relative overflow-hidden rounded-2xl bg-white shadow-soft transition hover:shadow-card"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-[#EFF3ED]">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay actions */}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <Link
                                        href={`/admin/categories/${cat.id}/edit`}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2A2E26] shadow transition hover:bg-[#EFF3ED]"
                                        aria-label="تعديل"
                                    >
                                        <FiEdit2 size={15} />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteId(cat.id)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow transition hover:bg-red-50"
                                        aria-label="حذف"
                                    >
                                        <FiTrash2 size={15} />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <p className="font-display font-bold text-[#2A2E26]">
                                    {cat.name}
                                </p>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="rounded-full bg-[#EFF3ED] px-2.5 py-0.5 text-[11px] font-bold text-[#71896A]">
                                        {cat.products.length} منتج
                                    </span>
                                    <code className="text-[11px] text-[#9A9F8F]">
                                        {cat.slug}
                                    </code>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete confirm modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-lift">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <FiAlertCircle size={24} />
                        </div>
                        <h3 className="mt-4 font-display text-lg font-bold text-[#2A2E26]">
                            حذف الفئة؟
                        </h3>
                        <p className="mt-2 text-sm text-[#666C5E]">
                            هتتحذف الفئة نهائيًا. المنتجات المرتبطة بيها هتفضل
                            موجودة لكن من غير فئة.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => confirmDelete(deleteId)}
                                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
                            >
                                حذف
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeleteId(null)}
                                className="flex-1 rounded-full border border-[#E3DECF] py-2.5 text-sm font-bold text-[#2A2E26] transition hover:bg-[#F7F4EC]"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
