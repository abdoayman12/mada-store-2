"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import {
  getOrderById,
  updateOrderStatus,
  statusLabels,
  statusColors,
  OrderStatus,
} from "@/lib/adminData";
import { currency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ALL_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const initial = getOrderById(id);
  if (!initial) return notFound();

  const [order, setOrder] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState<OrderStatus>(order.status);

  function handleSave() {
    const updated = updateOrderStatus(order.id, selected);
    if (updated) {
      setOrder(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  const steps: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back */}
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-bold text-[#71896A] hover:text-[#5B6F55]">
        <FiArrowRight size={15} />
        العودة للطلبات
      </Link>

      {/* Header card */}
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-[#2A2E26]">{order.id}</h2>
            <p className="mt-1 text-sm text-[#9A9F8F]">
              {new Date(order.createdAt).toLocaleString("ar-EG")}
            </p>
          </div>
          <span className={cn("rounded-full px-3 py-1.5 text-sm font-bold", statusColors[order.status])}>
            {statusLabels[order.status]}
          </span>
        </div>

        {/* Progress bar — hidden if cancelled */}
        {order.status !== "cancelled" && (
          <div className="mt-6 flex items-center">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                    i <= currentStep
                      ? "bg-[#71896A] text-white"
                      : "bg-[#E3DECF] text-[#9A9F8F]"
                  )}>
                    {i < currentStep ? <FiCheck size={14} /> : i + 1}
                  </div>
                  <span className="text-[10px] text-[#9A9F8F] whitespace-nowrap">{statusLabels[step]}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("h-0.5 flex-1 mx-1", i < currentStep ? "bg-[#71896A]" : "bg-[#E3DECF]")} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Items */}
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <h3 className="mb-4 font-display text-base font-bold text-[#2A2E26]">المنتجات</h3>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#EFF3ED]">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#2A2E26]">{item.name}</p>
                  <p className="text-xs text-[#9A9F8F]">الكمية: {item.quantity}</p>
                </div>
                <p className="font-bold text-[#C9925E]">{currency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#E3DECF] pt-4">
            <span className="font-display font-bold text-[#2A2E26]">الإجمالي</span>
            <span className="font-display text-lg font-bold text-[#C9925E]">{currency(order.total)}</span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Customer info */}
          <div className="rounded-2xl bg-white p-5 shadow-soft space-y-2">
            <h3 className="font-display text-sm font-bold text-[#2A2E26]">بيانات العميل</h3>
            <p className="text-sm font-semibold text-[#2A2E26]">{order.customer}</p>
            <p className="text-xs text-[#666C5E]" dir="ltr">{order.phone}</p>
            <p className="text-xs text-[#666C5E]">{order.governorate} — {order.address}</p>
            <p className="text-xs text-[#9A9F8F]">
              الدفع: {order.paymentMethod === "cod" ? "عند الاستلام" : "بطاقة"}
            </p>
          </div>

          {/* Status update */}
          <div className="rounded-2xl bg-white p-5 shadow-soft space-y-3">
            <h3 className="font-display text-sm font-bold text-[#2A2E26]">تحديث الحالة</h3>
            <div className="space-y-2">
              {ALL_STATUSES.map((s) => (
                <label key={s} className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2 transition",
                  selected === s ? "border-[#71896A] bg-[#EFF3ED]" : "border-[#E3DECF] hover:border-[#A2B79B]"
                )}>
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={selected === s}
                    onChange={() => setSelected(s)}
                    className="text-[#71896A] focus:ring-[#71896A]/40"
                  />
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", statusColors[s])}>
                    {statusLabels[s]}
                  </span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-full bg-[#71896A] py-2.5 text-sm font-bold text-white transition hover:bg-[#5B6F55]"
            >
              {saved ? <span className="flex items-center justify-center gap-1.5"><FiCheck size={15} /> تم الحفظ</span> : "حفظ الحالة"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
