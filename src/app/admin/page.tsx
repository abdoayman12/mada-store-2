"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiAlertCircle } from "react-icons/fi";
import { products as allProducts } from "@/lib/data";
import { currency } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [localProducts, setLocalProducts] = useState(allProducts);

  const filtered = localProducts.filter(
    (p) => p.name.includes(query) || p.categoryName.includes(query)
  );

  function confirmDelete(id: string) {
    setLocalProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="space-y-5">
      {/* Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9F8F]" size={15} />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64 rounded-xl border border-[#E3DECF] bg-white py-2 pe-4 ps-9 text-sm text-[#2A2E26] focus:border-[#71896A] focus:outline-none focus:ring-2 focus:ring-[#71896A]/20"
          />
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-[#71896A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5B6F55]"
        >
          <FiPlus size={16} />
          إضافة منتج
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F4EC] text-xs font-semibold text-[#9A9F8F]">
              <tr>
                <th className="px-5 py-3 text-right">المنتج</th>
                <th className="px-5 py-3 text-right">الفئة</th>
                <th className="px-5 py-3 text-right">السعر</th>
                <th className="px-5 py-3 text-right">التقييم</th>
                <th className="px-5 py-3 text-right">الحالة</th>
                <th className="px-5 py-3 text-right">الوسوم</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DECF]">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-[#FAFBF5]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#EFF3ED]">
                        <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <span className="font-semibold text-[#2A2E26] line-clamp-1 max-w-[200px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#666C5E]">{product.categoryName}</td>
                  <td className="px-5 py-3">
                    <span className="font-bold text-[#C9925E]">{currency(product.price)}</span>
                    {product.compareAtPrice && (
                      <span className="mr-1.5 text-xs text-[#9A9F8F] line-through">{currency(product.compareAtPrice)}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#2A2E26]">⭐ {product.rating}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      product.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                    )}>
                      {product.inStock ? "متوفر" : "غير متوفر"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      {product.isNew && <Badge tone="sage" className="text-[10px]">جديد</Badge>}
                      {product.isBestSeller && <Badge tone="clay" className="text-[10px]">الأكثر طلبًا</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666C5E] hover:bg-[#EFF3ED] hover:text-[#71896A]"
                        aria-label="تعديل"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(product.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666C5E] hover:bg-red-50 hover:text-red-500"
                        aria-label="حذف"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-sm text-[#9A9F8F]">
                    لا توجد منتجات تطابق البحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-lift">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <FiAlertCircle size={24} />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-[#2A2E26]">حذف المنتج؟</h3>
            <p className="mt-2 text-sm text-[#666C5E]">
              هيتم حذف المنتج نهائيًا ومش هتقدر ترجعه تاني.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
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
