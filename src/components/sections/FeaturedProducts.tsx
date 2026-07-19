import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import ProductCard from "@/components/ui/ProductCard";
import { getFeaturedProducts } from "@/lib/data";

export default function FeaturedProducts() {
  const items = getFeaturedProducts();

  return (
    <section className="bg-cream-soft py-16">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">مختارات مدى</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink">الأكثر طلبًا</h2>
          </div>
          <Link href="/products" className="flex items-center gap-1.5 text-sm font-bold text-sage-700 hover:text-sage-800">
            عرض كل المنتجات
            <FiArrowLeft size={15} />
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
