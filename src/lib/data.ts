import { Product } from "@/generated/prisma/client";
import { Review } from "./types";

// helpers products
export function getFeaturedProducts(products: Product[]): Product[] {
    return products.filter((p) => p.isBestSeller).slice(0, 4);
}

export function getNewProducts(products: Product[]): Product[] {
    return products.filter((p) => p.isNew);
}

export function getProductBySlug(
    slug: string,
    products: Product[],
): Product | undefined {
    return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(
    product: Product,
    products: Product[],
): Product[] {
    return products
        .filter(
            (p) => p.categoryId === product.categoryId && p.id !== product.id,
        )
        .slice(0, 4);
}

// helpers product reviews
export function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/** توزيع التقييمات — كم مرة ظهرت كل نجمة */
export function buildDistribution(reviews: Review[]) {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => dist[r.rating]++);
    return dist;
}

/** متوسط التقييم */
export function calcAvg(reviews: Review[]) {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}
