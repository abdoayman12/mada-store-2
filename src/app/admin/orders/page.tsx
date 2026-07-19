"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEye, FiFilter } from "react-icons/fi";
import {
  getOrders,
  updateOrderStatus,
  statusLabels,
  statusColors,
  OrderStatus,
  Order,
} from "@/lib/adminData";
import { currency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/Input";

const ALL_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  function handleStatusChange(orderId: string, status: OrderStatus) {
    updateOrderStatus(orderId, status);
    setOrders(getOrders());
  }

  const filtered = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <FiFilter size={15} className="text-[#9A9F8F]" />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition",
              filterStatus === "all"
                ? "bg-[#2A2E26] text-white"
                : "border border-[#E3DECF] bg-white text-[#666C5E] hover:border-[#71896A]"
            )}
          >
            الكل ({orders.length})
          </button>
          {ALL_STATUSES.map((s) => {
            const count = orders.filter((o) => o.status === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-bold transition",
                  filterStatus === s
                    ? "bg-[#2A2E26] text-white"
                    : "border border-[#E3DECF] bg-white text-[#666C5E] hover:border-[#71896A]"
                )}
              >
                {statusLabels[s]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F4EC] text-xs font-semibold text-[#9A9F8F]">
              <tr>
                <th className="px-5 py-3 text-right">رقم الطلب</th>
                <th className="px-5 py-3 text-right">العميل</th>
                <th className="px-5 py-3 text-right">المحافظة</th>
                <th className="px-5 py-3 text-right">الإجمالي</th>
                <th className="px-5 py-3 text-right">الدفع</th>
                <th className="px-5 py-3 text-right">الحالة</th>
                <th className="px-5 py-3 text-right">التاريخ</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DECF]">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAFBF5]">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#2A2E26]">{order.id}</td>
                  <td className="px-5 py-3 font-semibold text-[#2A2E26]">
                    <div>{order.customer}</div>
                    <div className="text-xs text-[#9A9F8F]" dir="ltr">{order.phone}</div>
                  </td>
                  <td className="px-5 py-3 text-[#666C5E]">{order.governorate}</td>
                  <td className="px-5 py-3 font-bold text-[#C9925E]">{currency(order.total)}</td>
                  <td className="px-5 py-3 text-xs text-[#666C5E]">
                    {order.paymentMethod === "cod" ? "عند الاستلام" : "بطاقة"}
                  </td>
                  <td className="px-5 py-3">
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={cn(
                        "w-32 rounded-full border-0 py-1 text-center text-xs font-bold",
                        statusColors[order.status]
                      )}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#9A9F8F]">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666C5E] hover:bg-[#EFF3ED] hover:text-[#71896A]"
                      aria-label="التفاصيل"
                    >
                      <FiEye size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-sm text-[#9A9F8F]">
                    لا توجد طلبات بهذه الحالة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
