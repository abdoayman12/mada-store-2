"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    FiGrid,
    FiPackage,
    FiShoppingBag,
    FiUsers,
    FiLogOut,
    FiExternalLink,
    FiChevronLeft,
    FiLayers,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { defaultValueUser, useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useState } from "react";

const navItems = [
    { href: "/admin", label: "لوحة التحكم", icon: FiGrid, exact: true },
    { href: "/admin/categories", label: "الفئات", icon: FiLayers },
    { href: "/admin/products", label: "المنتجات", icon: FiPackage },
    { href: "/admin/orders", label: "الطلبات", icon: FiShoppingBag },
    { href: "/admin/users", label: "المستخدمين", icon: FiUsers },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);

    function handleLogout() {
        setLoading(true);
        axios
            .post("http://localhost:3000/api/user/logout")
            .then((res) => {
                console.log(res.data.massage);
                setUser(defaultValueUser);
                localStorage.removeItem("user");
            })
            .catch((error) => {
                console.log(error?.response?.data?.message);
            })
            .finally(() => {
                setLoading(false);
            });
        router.replace("/");
    }

    function isActive(href: string, exact?: boolean) {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    }

    return (
        <aside className="flex h-screen w-64 flex-col border-l border-[#E3DECF] bg-[#2A2E26] text-cream-soft">
            {/* Logo */}
            <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
                <Image
                    src="/Untitled-1.png"
                    alt="مدى"
                    width={48}
                    height={28}
                    className="h-10 w-auto brightness-0 invert opacity-90"
                />
                <div className="leading-tight">
                    <span className="block text-xs font-bold text-cream-soft">
                        لوحة التحكم
                    </span>
                    <span className="block text-[10px] text-cream-soft/50">
                        إدارة المتجر
                    </span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-cream-soft/30">
                    القائمة الرئيسية
                </p>
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const active = isActive(item.href, item.exact);
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                                        active
                                            ? "bg-[#71896A] text-cream-soft"
                                            : "text-cream-soft/60 hover:bg-white/5 hover:text-cream-soft",
                                    )}
                                >
                                    <item.icon size={17} />
                                    {item.label}
                                    {active && (
                                        <FiChevronLeft
                                            size={14}
                                            className="ms-auto"
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-cream-soft/30">
                        أخرى
                    </p>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-cream-soft/60 transition-colors hover:bg-white/5 hover:text-cream-soft"
                    >
                        <FiExternalLink size={17} />
                        عرض المتجر
                    </Link>
                </div>
            </nav>

            {/* User footer */}
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#71896A] text-sm font-bold text-cream-soft">
                        {user?.name?.charAt(0) ?? "A"}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-semibold text-cream-soft">
                            {user?.name}
                        </p>
                        <p className="truncate text-xs text-cream-soft/50">
                            {user?.email}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loading}
                        aria-label={
                            loading ? "جار تسجيل الخروج" : "تسجيل الخروج"
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-cream-soft/40 transition hover:bg-white/10 hover:text-cream-soft"
                    >
                        <FiLogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
