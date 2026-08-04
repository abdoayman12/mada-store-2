"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiUserX, FiUserCheck } from "react-icons/fi";
import { currency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Order, User } from "@/generated/prisma/client";

// types
interface UserState extends User {
    orders: Order[];
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserState[]>([]);
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "admin">(
        "all",
    );

    async function handleToggle(id: string, active: boolean) {
        try {
            const res = await axios.put(`/api/allUsers/${id}`, {
                active: !active,
            });
            setUsers((currentUsers) =>
                currentUsers.map((user) => (user.id === id ? res.data : user)),
            );
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("/api/allUsers");
                const data = res.data;
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
                setUsers([]);
            }
        }

        fetchData();
    }, []);

    const filtered = useMemo(() => {
        return users.filter((u) => {
            const normalizedQuery = query.trim().toLowerCase();
            const matchQuery =
                !normalizedQuery ||
                u.name.toLowerCase().includes(normalizedQuery) ||
                u.email.toLowerCase().includes(normalizedQuery);
            const matchRole =
                roleFilter === "all"
                    ? true
                    : roleFilter === "admin"
                      ? u.isAdmin
                      : !u.isAdmin;

            return matchQuery && matchRole;
        });
    }, [users, roleFilter, query]);
    console.log(users);
    return (
        <div className="space-y-5">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                    <FiSearch
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9F8F]"
                        size={15}
                    />
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
                                    : "border border-[#E3DECF] bg-white text-[#666C5E] hover:border-[#71896A]",
                            )}
                        >
                            {r === "all"
                                ? "الكل"
                                : r === "customer"
                                  ? "العملاء"
                                  : "الأدمن"}
                        </button>
                    ))}
                </div>

                <div className="ms-auto flex gap-4 text-sm text-[#666C5E]">
                    <span>
                        <strong className="text-[#2A2E26]">
                            {users.filter((u) => !u.isAdmin).length}
                        </strong>{" "}
                        عميل
                    </span>
                    <span>
                        <strong className="text-[#2A2E26]">
                            {users.filter((u) => u.active).length}
                        </strong>{" "}
                        نشط
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F7F4EC] text-xs font-semibold text-[#9A9F8F]">
                            <tr>
                                <th className="px-5 py-3 text-right">
                                    المستخدم
                                </th>
                                <th className="px-5 py-3 text-right">الهاتف</th>
                                <th className="px-5 py-3 text-right">الدور</th>
                                <th className="px-5 py-3 text-right">
                                    الطلبات
                                </th>
                                <th className="px-5 py-3 text-right">
                                    إجمالي الإنفاق
                                </th>
                                <th className="px-5 py-3 text-right">
                                    تاريخ التسجيل
                                </th>
                                <th className="px-5 py-3 text-right">الحالة</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E3DECF]">
                            {filtered.map((user) => {
                                const totalSpent = user.orders?.reduce(
                                    (total, o) => total + o.total,
                                    0,
                                );

                                return (
                                    <tr
                                        key={user.id}
                                        className={cn(
                                            "hover:bg-[#FAFBF5]",
                                            !user.active && "opacity-60",
                                        )}
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#71896A]/15 font-bold text-[#71896A]">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#2A2E26]">
                                                        {user.name}
                                                    </p>
                                                    <p
                                                        className="text-xs text-[#9A9F8F]"
                                                        dir="ltr"
                                                    >
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td
                                            className="px-5 py-3 text-xs text-[#666C5E]"
                                            dir="ltr"
                                        >
                                            {user.phone}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={cn(
                                                    "rounded-full px-2.5 py-1 text-xs font-bold",
                                                    user.isAdmin
                                                        ? "bg-purple-50 text-purple-700"
                                                        : "bg-[#EFF3ED] text-[#71896A]",
                                                )}
                                            >
                                                {user.isAdmin ? "أدمن" : "عميل"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center font-bold text-[#2A2E26]">
                                            {user.orders ? user.orders.length : 0}
                                        </td>
                                        <td className="px-5 py-3 font-bold text-[#C9925E]">
                                            {totalSpent > 0
                                                ? currency(totalSpent)
                                                : "—"}
                                        </td>
                                        <td className="px-5 py-3 text-xs text-[#9A9F8F]">
                                            {new Date(
                                                user.createdAt,
                                            ).toLocaleDateString("ar-EG")}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={cn(
                                                    "rounded-full px-2.5 py-1 text-xs font-bold",
                                                    user.active
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-red-50 text-red-600",
                                                )}
                                            >
                                                {user.active ? "نشط" : "موقوف"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            {!user.isAdmin && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggle(
                                                            user.id,
                                                            user.active,
                                                        )
                                                    }
                                                    aria-label={
                                                        user.active
                                                            ? "إيقاف الحساب"
                                                            : "تفعيل الحساب"
                                                    }
                                                    className={cn(
                                                        "flex h-8 w-8 items-center justify-center rounded-lg transition",
                                                        user.active
                                                            ? "text-[#666C5E] hover:bg-red-50 hover:text-red-500"
                                                            : "text-[#666C5E] hover:bg-green-50 hover:text-green-600",
                                                    )}
                                                >
                                                    {user.active ? (
                                                        <FiUserX size={15} />
                                                    ) : (
                                                        <FiUserCheck
                                                            size={15}
                                                        />
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-14 text-center text-sm text-[#9A9F8F]"
                                    >
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
