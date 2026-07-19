/**
 * Mock data layer.
 * Replace the bodies of getCategories / getProducts / getProductBySlug
 * with real calls (DB, server actions, API routes) once the backend is wired —
 * the rest of the UI only depends on the shapes in `types.ts`.
*/
import { Product } from "@/generated/prisma/client";

export const products = [
    {
        id: "p1",
        name: "سيروم العناية بالبشرة الطبيعي",
        slug: "natural-face-serum",
        price: 480,
        compareAtPrice: 590,
        categoryId: "c1",
        categoryName: "العناية والجمال",
        image: "https://picsum.photos/seed/mada-p1/700/800",
        gallery: [
            "https://picsum.photos/seed/mada-p1/700/800",
            "https://picsum.photos/seed/mada-p1b/700/800",
            "https://picsum.photos/seed/mada-p1c/700/800",
        ],
        rating: 4.8,
        reviewsCount: 126,
        description:
            "تركيبة خفيفة بمستخلصات طبيعية تمنح بشرتك نضارة وترطيبًا يدوم طوال اليوم، مناسبة لكل أنواع البشرة.",
        details: [
            "خالٍ من الكحول والبارابين",
            "100 مل",
            "صنع يدويًا بزيوت طبيعية",
            "مناسب للاستخدام اليومي",
        ],
        inStock: true,
        isBestSeller: true,
    },
    {
        id: "p2",
        name: "شمعة عود ولافندر",
        slug: "oud-lavender-candle",
        price: 320,
        categoryId: "c4",
        categoryName: "الشموع والعطور",
        image: "https://picsum.photos/seed/mada-p2/700/800",
        gallery: [
            "https://picsum.photos/seed/mada-p2/700/800",
            "https://picsum.photos/seed/mada-p2b/700/800",
        ],
        rating: 4.9,
        reviewsCount: 84,
        description:
            "شمعة صويا طبيعية برائحة العود واللافندر، مدة احتراق تصل إلى 40 ساعة، في إناء سيراميك قابل لإعادة الاستخدام.",
        details: [
            "شمع صويا 100%",
            "وزن 200 جم",
            "مدة الاحتراق 40 ساعة",
            "إناء سيراميك أبيض",
        ],
        inStock: true,
        isNew: true,
    },
    {
        id: "p3",
        name: "حقيبة يد جلد طبيعي",
        slug: "leather-tote-bag",
        price: 1450,
        compareAtPrice: 1750,
        categoryId: "c3",
        categoryName: "الحقائب والإكسسوارات",
        image: "https://picsum.photos/seed/mada-p3/700/800",
        gallery: [
            "https://picsum.photos/seed/mada-p3/700/800",
            "https://picsum.photos/seed/mada-p3b/700/800",
            "https://picsum.photos/seed/mada-p3c/700/800",
        ],
        rating: 4.7,
        reviewsCount: 53,
        description:
            "حقيبة يد فسيحة من الجلد الطبيعي بتصميم بسيط وعملي، تناسب الاستخدام اليومي والمشاوير الطويلة.",
        details: [
            "جلد طبيعي 100%",
            "بطانة قماشية داخلية",
            "حزام كتف قابل للفصل",
            "متوفرة بثلاثة ألوان",
        ],
        inStock: true,
        isBestSeller: true,
    },
];


// export function getProducts(options?: {
//     categorySlug?: string;
//     query?: string;
// }): Product[] {
//     let list = products;
//     if (options?.categorySlug) {
//         list = list.filter(
//             (p) =>
//                 p.categoryName &&
//                 p.categoryId ===
//                     categories.find((c) => c.slug === options.categorySlug)?.id,
//         );
//     }
//     if (options?.query) {
//         const q = options.query.trim();
//         list = list.filter(
//             (p) => p.name.includes(q) || p.categoryName.includes(q),
//         );
//     }
//     return list;
// }

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
