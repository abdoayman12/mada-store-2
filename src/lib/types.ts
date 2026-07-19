export type Category = {
    id: string;
    name: string;
    slug: string;
    image: string;
};

export type Product = {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    categoryId: string;
    categoryName: string;
    image: string;
    gallery: string[];
    rating: number;
    reviewsCount: number;
    description: string;
    details: string[];
    inStock: boolean;
    isNew?: boolean;
    isBestSeller?: boolean;
};

export type CartItem = {
    productId: string;
    quantity: number;
};

export type CartLine = CartItem & {
    product: Product;
};

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";

export type OrderItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

export type Order = {
    id: string;
    customer: string;
    phone: string;
    governorate: string;
    address: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    paymentMethod: "cod" | "card";
    createdAt: string; // ISO date string
};

// type dto
export interface RegisterUserDto {
    name: string;
    email: string;
    phone: string;
    password: string;
}
export interface LoginUserDto {
    email: string;
    password: string;
}
export interface bodyProductDTO {
    name: string;
    categoryId: string;
    price: number;
    compareAtPrice: number | undefined;
    description: string;
    details: string[];
    inStock: boolean;
    isNew: boolean;
    isBestSeller: boolean;
};

// type form state

// ─── Form state ───────────────────────────────────────────────────────────────
// details هنا string (نص في الـ Textarea) مش string[]
// لأن الـ Textarea بتتعامل مع نص عادي
// التحويل للـ array بيحصل فقط لما نبعت البيانات للـ API

export type FormStateProduct = {
    name: string;
    categoryId: string;
    price: string;
    compareAtPrice: string;
    description: string;
    details: string; // ← string (كل سطر = نقطة)
    inStock: boolean;
    isNew: boolean;
    isBestSeller: boolean;
};