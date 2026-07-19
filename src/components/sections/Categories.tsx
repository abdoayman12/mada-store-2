import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Categories() {
  return (
    <section className="wrap py-16">
      <div className="text-center">
        <span className="eyebrow justify-center">تسوقي حسب الفئة</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink">كل ما يحتاجه يومك</h2>
        <SectionDivider />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-sage-100"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-display text-lg font-bold text-cream-soft">{category.name}</p>
              <p className="text-xs text-cream-soft/80">{12} منتج</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
