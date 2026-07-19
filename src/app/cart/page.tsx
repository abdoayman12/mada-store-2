"use client";

import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { currency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import QuantityStepper from "@/components/ui/QuantityStepper";
import EmptyState from "@/components/ui/EmptyState";

const SHIPPING_FEE = 60;

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <div className="wrap py-16">
        <EmptyState
          icon={<FiShoppingBag size={26} />}
          title="السلة فاضية حاليًا"
          description="لسه مفيش منتجات في سلتك، يلا نلاقي حاجة تعجبك."
          action={
            <Link href="/products">
              <Button>تصفحي المنتجات</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const total = subtotal + SHIPPING_FEE;

  return (
    <div className="wrap py-12">
      <div className="border-b border-line pb-6">
        <span className="eyebrow">سلة التسوق</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">سلتك ({lines.length} منتج)</h1>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {lines.map((line) => (
            <div key={line.productId} className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft sm:items-center">
              <Link href={`/products/${line.product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sage-50">
                <Image src={line.product.image} alt={line.product.name} fill sizes="96px" className="object-cover" />
              </Link>

              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-sage-600">{line.product.categoryName}</p>
                  <Link href={`/products/${line.product.slug}`} className="font-display text-sm font-bold text-ink hover:text-sage-700">
                    {line.product.name}
                  </Link>
                  <p className="mt-1 text-sm font-bold text-clay-600">{currency(line.product.price)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <QuantityStepper value={line.quantity} onChange={(q) => updateQuantity(line.productId, q)} />
                  <button
                    type="button"
                    aria-label="حذف من السلة"
                    onClick={() => removeItem(line.productId)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink-faint transition hover:bg-red-50 hover:text-red-500"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage-700 hover:text-sage-800">
            <FiArrowLeft className="rotate-180" size={15} />
            متابعة التسوق
          </Link>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-lg font-bold text-ink">ملخص الطلب</h2>
          <div className="mt-5 space-y-3 border-b border-line pb-5">
            <div className="flex justify-between text-sm text-ink-soft">
              <span>المجموع الفرعي</span>
              <span className="font-semibold text-ink">{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-ink-soft">
              <span>الشحن</span>
              <span className="font-semibold text-ink">{currency(SHIPPING_FEE)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-5">
            <span className="font-display text-base font-bold text-ink">الإجمالي</span>
            <span className="font-display text-xl font-bold text-clay-600">{currency(total)}</span>
          </div>
          <Link href="/checkout">
            <Button size="lg" className="w-full">
              إتمام الطلب
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}
