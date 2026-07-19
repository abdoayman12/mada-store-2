import { Category, Product } from "./types";

/**
 * Mock data layer.
 * Replace the bodies of getCategories / getProducts / getProductBySlug
 * with real calls (DB, server actions, API routes) once the backend is wired —
 * the rest of the UI only depends on the shapes in `types.ts`.
 */

export const categories: Category[] = [
  {
    id: "c1",
    name: "العناية والجمال",
    slug: "beauty",
    image: "https://picsum.photos/seed/mada-beauty/600/700",
  },
  {
    id: "c2",
    name: "المنزل والديكور",
    slug: "home",
    image: "https://picsum.photos/seed/mada-home/600/700",
  },
  {
    id: "c3",
    name: "الحقائب والإكسسوارات",
    slug: "accessories",
    image: "https://picsum.photos/seed/mada-bags/600/700",
  },
  {
    id: "c4",
    name: "الشموع والعطور",
    slug: "fragrance",
    image: "https://picsum.photos/seed/mada-candles/600/700",
  },
];

export const products: Product[] = [
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
    details: ["خالٍ من الكحول والبارابين", "100 مل", "صنع يدويًا بزيوت طبيعية", "مناسب للاستخدام اليومي"],
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
    description: "شمعة صويا طبيعية برائحة العود واللافندر، مدة احتراق تصل إلى 40 ساعة، في إناء سيراميك قابل لإعادة الاستخدام.",
    details: ["شمع صويا 100%", "وزن 200 جم", "مدة الاحتراق 40 ساعة", "إناء سيراميك أبيض"],
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
    description: "حقيبة يد فسيحة من الجلد الطبيعي بتصميم بسيط وعملي، تناسب الاستخدام اليومي والمشاوير الطويلة.",
    details: ["جلد طبيعي 100%", "بطانة قماشية داخلية", "حزام كتف قابل للفصل", "متوفرة بثلاثة ألوان"],
    inStock: true,
    isBestSeller: true,
  },
  {
    id: "p4",
    name: "طقم أكواب سيراميك مرسومة يدويًا",
    slug: "handmade-ceramic-mugs",
    price: 390,
    categoryId: "c2",
    categoryName: "المنزل والديكور",
    image: "https://picsum.photos/seed/mada-p4/700/800",
    gallery: ["https://picsum.photos/seed/mada-p4/700/800", "https://picsum.photos/seed/mada-p4b/700/800"],
    rating: 4.6,
    reviewsCount: 39,
    description: "طقم من 4 أكواب سيراميك مصنوعة ومرسومة يدويًا، كل قطعة فريدة بتفاصيلها الصغيرة.",
    details: ["طقم من 4 قطع", "آمن للاستخدام في الميكروويف", "سعة 300 مل لكل كوب", "صناعة يدوية محلية"],
    inStock: true,
  },
  {
    id: "p5",
    name: "وشاح حرير منقوش",
    slug: "printed-silk-scarf",
    price: 510,
    categoryId: "c3",
    categoryName: "الحقائب والإكسسوارات",
    image: "https://picsum.photos/seed/mada-p5/700/800",
    gallery: ["https://picsum.photos/seed/mada-p5/700/800", "https://picsum.photos/seed/mada-p5b/700/800"],
    rating: 4.5,
    reviewsCount: 21,
    description: "وشاح من الحرير الطبيعي بنقشة مستوحاة من الطبيعة، يضيف لمسة أنيقة لأي إطلالة.",
    details: ["حرير طبيعي 100%", "المقاس 90×90 سم", "طباعة غير قابلة للبهتان"],
    inStock: true,
    isNew: true,
  },
  {
    id: "p6",
    name: "زيت الورد للعناية بالشعر",
    slug: "rose-hair-oil",
    price: 260,
    categoryId: "c1",
    categoryName: "العناية والجمال",
    image: "https://picsum.photos/seed/mada-p6/700/800",
    gallery: ["https://picsum.photos/seed/mada-p6/700/800", "https://picsum.photos/seed/mada-p6b/700/800"],
    rating: 4.4,
    reviewsCount: 67,
    description: "زيت طبيعي مغذٍ يقوي الشعر من الجذور ويمنحه لمعانًا صحيًا، مستخلص من بتلات الورد الطبيعية.",
    details: ["100 مل", "خالٍ من الزيوت المعدنية", "مناسب لكل أنواع الشعر"],
    inStock: true,
  },
  {
    id: "p7",
    name: "سلة تخزين قش طبيعي",
    slug: "natural-straw-basket",
    price: 340,
    categoryId: "c2",
    categoryName: "المنزل والديكور",
    image: "https://picsum.photos/seed/mada-p7/700/800",
    gallery: ["https://picsum.photos/seed/mada-p7/700/800", "https://picsum.photos/seed/mada-p7b/700/800"],
    rating: 4.7,
    reviewsCount: 28,
    description: "سلة منسوجة يدويًا من القش الطبيعي، مثالية لتنظيم المساحات بلمسة دافئة وطبيعية.",
    details: ["نسيج يدوي بالكامل", "القطر 35 سم", "مقابض جلدية"],
    inStock: false,
  },
  {
    id: "p8",
    name: "عطر خشب الصندل",
    slug: "sandalwood-perfume",
    price: 650,
    compareAtPrice: 760,
    categoryId: "c4",
    categoryName: "الشموع والعطور",
    image: "https://picsum.photos/seed/mada-p8/700/800",
    gallery: ["https://picsum.photos/seed/mada-p8/700/800", "https://picsum.photos/seed/mada-p8b/700/800"],
    rating: 4.9,
    reviewsCount: 95,
    description: "عطر دافئ يجمع بين خشب الصندل والمسك، ثبات يدوم طويلًا برائحة مميزة وغير تقليدية.",
    details: ["50 مل", "تركيز Eau de Parfum", "ثبات يصل إلى 8 ساعات"],
    inStock: true,
    isBestSeller: true,
  },
];

export function getCategories(): Category[] {
  return categories;
}

export function getProducts(options?: { categorySlug?: string; query?: string }): Product[] {
  let list = products;
  if (options?.categorySlug) {
    list = list.filter((p) => p.categoryName && p.categoryId === categories.find((c) => c.slug === options.categorySlug)?.id);
  }
  if (options?.query) {
    const q = options.query.trim();
    list = list.filter((p) => p.name.includes(q) || p.categoryName.includes(q));
  }
  return list;
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isBestSeller).slice(0, 4);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product): Product[] {
  return products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
}
