"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SubmitEvent, useMemo, useState } from "react";
import {
    FiSearch,
    FiUser,
    FiShoppingCart,
    FiMenu,
    FiX,
    FiLogOut,
    FiGrid,
    FiChevronDown,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { defaultValueUser, useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductsContext";
import { cn } from "@/lib/utils";
import axios from "axios";

const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "المنتجات" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { itemsCount } = useCart();
    const { user, setUser } = useAuth();
    const { products } = useProducts();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const searchResults = useMemo(() => {
        if (!normalizedQuery) return [];

        return products
            .filter((product) => {
                const haystack = [
                    product.name,
                    product.description,
                    product.slug,
                    product.categoryId,
                ]
                    .join(" ")
                    .toLowerCase();

                return haystack.includes(normalizedQuery);
            })
            .slice(0, 6);
    }, [normalizedQuery, products]);

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
        setUserMenuOpen(false);
        router.push("/");
    }

    function handleSearchSubmit(event?: SubmitEvent) {
        event?.preventDefault();
        const query = searchQuery.trim();
        setSearchOpen(false);
        setSearchQuery("");
        router.push(
            query ? `/products?q=${encodeURIComponent(query)}` : "/products",
        );
    }

    function handleSelectProduct(productId: string) {
        setSearchOpen(false);
        setSearchQuery("");
        router.push(`/products/${productId}`);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-cream-soft/90 backdrop-blur">
            <div className="wrap flex h-20 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex shrink-0 items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="مدى"
                        width={56}
                        height={32}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-8 lg:flex">
                    {navLinks.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative text-sm font-semibold transition-colors hover:text-sage-700",
                                    active ? "text-sage-700" : "text-ink",
                                )}
                            >
                                {link.label}
                                {active && (
                                    <span className="absolute -bottom-2 right-0 left-0 h-[2px] rounded-full bg-clay-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                    {/* Search */}
                    <div className="relative hidden sm:block">
                        <button
                            type="button"
                            aria-label="بحث"
                            onClick={() => setSearchOpen((value) => !value)}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-sage-50 hover:text-sage-700"
                        >
                            <FiSearch size={18} />
                        </button>

                        {searchOpen && (
                            <div className="absolute left-0 top-full z-50 mt-2 w-[360px] overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="flex items-center gap-2 border-b border-line px-3 py-2"
                                >
                                    <FiSearch
                                        size={16}
                                        className="text-ink-soft"
                                    />
                                    <input
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="ابحث عن منتج..."
                                        className="w-full border-0 bg-transparent px-1 py-2 text-sm text-ink outline-none placeholder:text-ink-faint"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-full bg-sage-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-sage-700"
                                    >
                                        بحث
                                    </button>
                                </form>

                                {normalizedQuery ? (
                                    searchResults.length > 0 ? (
                                        <div className="max-h-80 overflow-y-auto p-2">
                                            {searchResults.map((product) => (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelectProduct(
                                                            product.id,
                                                        )
                                                    }
                                                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-right transition hover:bg-sage-50"
                                                >
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-ink">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-ink-soft">
                                                            {product.price} ر.س
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-5 text-center text-sm text-ink-soft">
                                            لا توجد منتجات مطابقة لبحثك
                                        </div>
                                    )
                                ) : (
                                    <div className="px-4 py-5 text-center text-sm text-ink-soft">
                                        اكتب اسم المنتج للبحث فورًا
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Auth area ──────────────────────────────────────────────────── */}
                    {user?.name ? (
                        /* ── Logged-in: dropdown menu ── */
                        <div className="relative hidden sm:block">
                            <button
                                type="button"
                                onClick={() => setUserMenuOpen((v) => !v)}
                                className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-ink transition hover:border-sage-400 hover:bg-sage-50"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-600 text-[11px] font-bold text-cream-soft">
                                    {user.name.charAt(0)}
                                </span>
                                <span className="max-w-[80px] truncate">
                                    {user.name}
                                </span>
                                <FiChevronDown
                                    size={14}
                                    className={cn(
                                        "transition-transform",
                                        userMenuOpen && "rotate-180",
                                    )}
                                />
                            </button>

                            {userMenuOpen && (
                                <>
                                    {/* backdrop */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    {/* dropdown */}
                                    <div className="absolute left-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
                                        <div className="border-b border-line px-4 py-3">
                                            <p className="text-xs font-bold text-ink">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-[11px] text-ink-soft">
                                                {user.email}
                                            </p>
                                        </div>
                                        {user.isAdmin && (
                                            <Link
                                                href="/admin"
                                                onClick={() =>
                                                    setUserMenuOpen(false)
                                                }
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-sage-700 hover:bg-sage-50"
                                            >
                                                <FiGrid size={15} />
                                                لوحة التحكم
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            disabled={loading}
                                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
                                        >
                                            <FiLogOut size={15} />
                                            {loading
                                                ? "جار تسجيل الخروج"
                                                : "تسجيل الخروج"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        /* ── Not logged in: Login button ──
               بيضيف callbackUrl = الصفحة الحالية عشان بعد الـ login يرجعلها */
                        <Link
                            href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                            aria-label="تسجيل الدخول"
                            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-sage-50 hover:text-sage-700 sm:flex"
                        >
                            <FiUser size={18} />
                        </Link>
                    )}

                    {/* Cart */}
                    <Link
                        href="/cart"
                        aria-label="السلة"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-sage-50 hover:text-sage-700"
                    >
                        <FiShoppingCart size={18} />
                        {itemsCount > 0 && (
                            <span className="absolute -top-0.5 -left-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-clay-500 px-1 text-[10px] font-bold text-cream-soft">
                                {itemsCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile menu toggle */}
                    <button
                        type="button"
                        aria-label="القائمة"
                        onClick={() => setMobileOpen((v) => !v)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-sage-50 hover:text-sage-700 lg:hidden"
                    >
                        {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile drawer ── */}
            {mobileOpen && (
                <div className="border-t border-line bg-cream-soft px-5 py-4 lg:hidden">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "rounded-xl px-4 py-3 text-sm font-semibold",
                                    pathname === link.href
                                        ? "bg-sage-50 text-sage-700"
                                        : "text-ink",
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="mt-2 border-t border-line pt-2">
                            {user?.name ? (
                                <>
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-bold text-ink">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-ink-soft">
                                            {user.email}
                                        </p>
                                    </div>
                                    {user.isAdmin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-sage-700"
                                        >
                                            <FiGrid size={15} /> لوحة التحكم
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleLogout();
                                            setMobileOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-red-500"
                                    >
                                        <FiLogOut size={15} /> تسجيل الخروج
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-ink"
                                >
                                    <FiUser size={15} /> تسجيل الدخول
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
