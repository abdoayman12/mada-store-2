"use client";

import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { Product } from "@/lib/types";
import { currency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import Badge from "./Badge";
import Rating from "./Rating";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition-shadow duration-300 hover:shadow-card">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-sage-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.isNew && <Badge tone="sage">جديد</Badge>}
          {product.isBestSeller && <Badge tone="clay">الأكثر طلبًا</Badge>}
          {!product.inStock && <Badge tone="muted">غير متوفر</Badge>}
        </div>
        {product.compareAtPrice && (
          <div className="absolute top-3 left-3">
            <Badge tone="ink">
              خصم {Math.round(100 - (product.price / product.compareAtPrice) * 100)}٪
            </Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium text-sage-600">{product.categoryName}</span>
        <Link href={`/products/${product.slug}`} className="line-clamp-1 font-display text-base font-semibold text-ink hover:text-sage-700">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewsCount} />

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-clay-600">{currency(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-ink-faint line-through">{currency(product.compareAtPrice)}</span>
            )}
          </div>
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => addItem(product, 1)}
            aria-label="أضف إلى السلة"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-50 text-sage-700 transition-colors hover:bg-sage-600 hover:text-cream-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
