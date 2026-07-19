"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { FiBell } from "react-icons/fi";

const titles: Record<string, string> = {
    "/admin": "لوحة التحكم",
    "/admin/categories": "إدارة الفئات",
    "/admin/categories/new": "إضافة فئة جديدة",
    "/admin/products": "إدارة المنتجات",
    "/admin/products/new": "إضافة منتج جديد",
    "/admin/orders": "إدارة الطلبات",
    "/admin/users": "إدارة المستخدمين",
};

function getTitle(pathname: string) {
    if (titles[pathname]) return titles[pathname];
    if (pathname.startsWith("/admin/products") && pathname.includes("/edit"))
        return "تعديل المنتج";
    if (pathname.startsWith("/admin/orders/")) return "تفاصيل الطلب";
    return "الداشبورد";
}

export default function AdminTopbar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const title = getTitle(pathname);

    return (
        <header className="flex h-16 items-center justify-between border-b border-[#E3DECF] bg-white px-6">
            <h1 className="font-display text-lg font-bold text-[#2A2E26]">
                {title}
            </h1>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label="الإشعارات"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#666C5E] hover:bg-[#F7F4EC]"
                >
                    <FiBell size={18} />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#C9925E]" />
                </button>
                <div className="h-8 w-px bg-[#E3DECF]" />
                <span className="text-sm font-semibold text-[#2A2E26]">
                    {user?.name}
                </span>
            </div>
        </header>
    );
}
