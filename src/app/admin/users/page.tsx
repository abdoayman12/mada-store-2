"use client";

import { useState } from "react";
import { FiSearch, FiUserX, FiUserCheck } from "react-icons/fi";
import { getUsers, toggleUserActive, User } from "@/lib/adminData";
import { currency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "admin">("all");

  function handleToggle(id: string) {
    toggleUserActive(id);
    setUsers(getUsers());
  }

  const filtered = users.filter((u) => {
    const matchQuery =
      !query || u.name.includes(query) || u.email.toLowerCase().includes(query.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchQuery && matchRole;
  });

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9F8F]" size={15} />
          <input
            type="text"
            placeholder="ابحث باسم أو بريد..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-56 rounded-xl border border-[#E3DECF] bg-white py-2 pe-4 ps-9 text-sm text-[#2A2E26] focus:border-[#71896A] focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "customer", "admin"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-bold transition",
                roleFilter === r
                  ? "bg-[#2A2E26] text-white"
                  : "border border-[#E3DECF] bg-white text-[#666C5E] hover:border-[#71896A]"
              )}
            >
              {r === "all" ? "الكل" : r === "customer" ? "العملاء" : "الأدمن"}
            </button>
          ))}
        </div>

        <div className="ms-auto flex gap-4 text-sm text-[#666C5E]">
          <span>
            <strong className="text-[#2A2E26]">{users.filter((u) => u.role === "customer").length}</strong> عميل
          </span>
          <span>
            <strong className="text-[#2A2E26]">{users.filter((u) => u.active).length}</strong> نشط
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F4EC] text-xs font-semibold text-[#9A9F8F]">
              <tr>
                <th className="px-5 py-3 text-right">المستخدم</th>
                <th className="px-5 py-3 text-right">الهاتف</th>
                <th className="px-5 py-3 text-right">الدور</th>
                <th className="px-5 py-3 text-right">الطلبات</th>
                <th className="px-5 py-3 text-right">إجمالي الإنفاق</th>
                <th className="px-5 py-3 text-right">تاريخ التسجيل</th>
                <th className="px-5 py-3 text-right">الحالة</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DECF]">
              {filtered.map((user) => (
                <tr key={user.id} className={cn("hover:bg-[#FAFBF5]", !user.active && "opacity-60")}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#71896A]/15 font-bold text-[#71896A]">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#2A2E26]">{user.name}</p>
                        <p className="text-xs text-[#9A9F8F]" dir="ltr">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#666C5E]" dir="ltr">{user.phone}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      user.role === "admin"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-[#EFF3ED] text-[#71896A]"
                    )}>
                      {user.role === "admin" ? "أدمن" : "عميل"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center font-bold text-[#2A2E26]">{user.ordersCount}</td>
                  <td className="px-5 py-3 font-bold text-[#C9925E]">
                    {user.totalSpent > 0 ? currency(user.totalSpent) : "—"}
                  </td>
                  <td className="px-5 py-3 text-xs text-[#9A9F8F]">
                    {new Date(user.joinedAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      user.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                    )}>
                      {user.active ? "نشط" : "موقوف"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {user.role !== "admin" && (
                      <button
                        type="button"
                        onClick={() => handleToggle(user.id)}
                        aria-label={user.active ? "إيقاف الحساب" : "تفعيل الحساب"}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition",
                          user.active
                            ? "text-[#666C5E] hover:bg-red-50 hover:text-red-500"
                            : "text-[#666C5E] hover:bg-green-50 hover:text-green-600"
                        )}
                      >
                        {user.active ? <FiUserX size={15} /> : <FiUserCheck size={15} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-sm text-[#9A9F8F]">
                    لا توجد نتائج
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
