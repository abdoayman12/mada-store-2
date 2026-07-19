"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiFilter } from "react-icons/fi";
import ProductCard from "@/components/ui/ProductCard";
import { Select } from "@/components/ui/Input";
import { categories, products } from "@/lib/data";
import { cn } from "@/lib/utils";

type SortKey = "default" | "price-asc" | "price-desc" | "rating";

export default function ProductsView() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const [sort, setSort] = useState<SortKey>("default");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = activeCategory ? products.filter((p) => categories.find((c) => c.slug === activeCategory)?.id === p.categoryId) : products;

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeCategory, sort]);

  return (
    <div className="wrap py-12">
      <div className="flex flex-col gap-2 border-b border-line pb-8">
        <span className="eyebrow">المتجر</span>
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">كل المنتجات</h1>
        <p className="text-sm text-ink-soft">{filtered.length} منتج متاح</p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <CategoryFilters activeCategory={activeCategory} />
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink lg:hidden"
            >
              <FiFilter size={15} />
              تصفية
            </button>

            <div className="ms-auto flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-ink-soft">
                ترتيب حسب
              </label>
              <Select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="w-44">
                <option value="default">الأحدث</option>
                <option value="price-asc">السعر: الأقل أولًا</option>
                <option value="price-desc">السعر: الأعلى أولًا</option>
                <option value="rating">الأعلى تقييمًا</option>
              </Select>
            </div>
          </div>

          {mobileFiltersOpen && (
            <div className="mb-6 lg:hidden">
              <CategoryFilters activeCategory={activeCategory} />
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-16 text-center shadow-soft">
              <p className="font-display text-lg font-bold text-ink">لا توجد منتجات في هذه الفئة حاليًا</p>
              <Link href="/products" className="mt-2 inline-block text-sm font-semibold text-sage-700">
                عرض كل المنتجات
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryFilters({ activeCategory }: { activeCategory: string | null }) {
  return (
    <div className="space-y-1 rounded-2xl bg-white p-4 shadow-soft">
      <p className="px-2 pb-2 text-sm font-bold text-ink">الفئات</p>
      <Link
        href="/products"
        className={cn(
          "block rounded-xl px-3 py-2.5 text-sm font-medium transition",
          !activeCategory ? "bg-sage-50 text-sage-700" : "text-ink-soft hover:bg-sage-50/60"
        )}
      >
        كل المنتجات
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className={cn(
            "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition",
            activeCategory === category.slug ? "bg-sage-50 text-sage-700" : "text-ink-soft hover:bg-sage-50/60"
          )}
        >
          {category.name}
          <span className="text-xs text-ink-faint">{12}</span>
        </Link>
      ))}
    </div>
  );
}
