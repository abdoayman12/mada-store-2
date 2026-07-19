"use client"
import Link from "next/link";
import SectionDivider from "@/components/ui/SectionDivider";
import { useCatgory } from "@/context/CategoryContext";

export default function Categories() {
  const { category } = useCatgory()
  return (
    <section className="wrap py-16">
      <div className="text-center">
        <span className="eyebrow justify-center">تسوقي حسب الفئة</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink">كل ما يحتاجه يومك</h2>
        <SectionDivider />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {category.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-sage-100"
          >
            <img
              src={cat.image}
              alt={cat.name}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 h-full group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-display text-lg font-bold text-cream-soft">{cat.name}</p>
              <p className="text-xs text-cream-soft/80">{cat.products.length} منتج</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
