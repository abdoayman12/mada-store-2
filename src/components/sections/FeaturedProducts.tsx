"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import ProductCard from "@/components/ui/ProductCard";
import { getFeaturedProducts } from "@/lib/data";
import { useProducts } from "@/context/ProductsContext";
import { useEffect } from "react";
import axios from "axios";

export default function FeaturedProducts() {
    const { products, setProducts } = useProducts();
    const items = getFeaturedProducts(products);
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(
                    "/api/products",
                );
                setProducts(res.data);
                localStorage.setItem("products", JSON.stringify(res.data));
            } catch (error: unknown) {
                console.error(error);
            }
        }
        fetchData();
    }, []);
    return (
        <section className="bg-cream-soft py-16">
            <div className="wrap">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="eyebrow">مختارات مدى</span>
                        <h2 className="mt-3 font-display text-3xl font-bold text-ink">
                            الأكثر طلبًا
                        </h2>
                    </div>
                    <Link
                        href="/products"
                        className="flex items-center gap-1.5 text-sm font-bold text-sage-700 hover:text-sage-800"
                    >
                        عرض كل المنتجات
                        <FiArrowLeft size={15} />
                    </Link>
                </div>

                <div className="mt-9 grid grid-cols-2 gap-5 lg:grid-cols-4">
                    {items.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
