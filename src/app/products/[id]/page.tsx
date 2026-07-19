"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiShoppingCart, FiCheck, FiTruck, FiRefreshCw, FiChevronLeft } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/ui/Rating";
import Button from "@/components/ui/Button";
import QuantityStepper from "@/components/ui/QuantityStepper";
import ProductCard from "@/components/ui/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { currency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProductBySlug(id);
  if (!product) return notFound();

  const related = getRelatedProducts(product);
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product!, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="wrap py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-soft">
        <Link href="/" className="hover:text-sage-700">الرئيسية</Link>
        <FiChevronLeft size={14} />
        <Link href="/products" className="hover:text-sage-700">المنتجات</Link>
        <FiChevronLeft size={14} />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sage-50 shadow-soft">
            <Image src={product.gallery[activeImage]} alt={product.name} fill sizes="50vw" className="object-cover" priority />
            <div className="absolute top-4 right-4 flex flex-col gap-1.5">
              {product.isNew && <Badge tone="sage">جديد</Badge>}
              {product.isBestSeller && <Badge tone="clay">الأكثر طلبًا</Badge>}
            </div>
          </div>
          {product.gallery.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.gallery.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                    activeImage === i ? "border-sage-600" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-sm font-semibold text-sage-600">{product.categoryName}</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">{product.name}</h1>
          <div className="mt-3">
            <Rating value={product.rating} count={product.reviewsCount} size={15} />
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-clay-600">{currency(product.price)}</span>
            {product.compareAtPrice && <span className="text-base text-ink-faint line-through">{currency(product.compareAtPrice)}</span>}
          </div>

          <p className="mt-5 max-w-lg leading-8 text-ink-soft">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.details.map((detail) => (
              <li key={detail} className="flex items-center gap-2 text-sm text-ink-soft">
                <FiCheck className="text-sage-600" size={15} />
                {detail}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <Button size="lg" disabled={!product.inStock} onClick={handleAdd} className="min-w-[200px]">
              {added ? (
                <>
                  <FiCheck size={18} /> تمت الإضافة
                </>
              ) : (
                <>
                  <FiShoppingCart size={18} />
                  {product.inStock ? "أضف إلى السلة" : "غير متوفر حاليًا"}
                </>
              )}
            </Button>
          </div>

          <div className="mt-8 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            <div className="flex items-center gap-2.5 text-sm text-ink-soft">
              <FiTruck className="text-sage-600" size={17} />
              شحن لكل المحافظات خلال 2-5 أيام
            </div>
            <div className="flex items-center gap-2.5 text-sm text-ink-soft">
              <FiRefreshCw className="text-sage-600" size={17} />
              إمكانية الإرجاع خلال 14 يوم
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold text-ink">قد يعجبك أيضًا</h2>
          <div className="mt-7 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
