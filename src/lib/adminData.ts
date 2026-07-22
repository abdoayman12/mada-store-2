// ─── Orders ──────────────────────────────────────────────────────────────────

import { Order } from "@/generated/prisma/client";

export type OrderStatus =
    | "PENDING" // معلق — تم استلام الطلب
    | "CONFIRMED" // مؤكد — جاري التجهيز
    | "SHIPPED" // تم الشحن — في الطريق
    | "DELIVERED" // تم التسليم
    | "CANCELLED"; // ملغي

export type OrderItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};


export const statusLabels: Record<OrderStatus, string> = {
    PENDING: "معلق",
    CONFIRMED: "مؤكد",
    SHIPPED: "تم الشحن",
    DELIVERED: "تم التسليم",
    CANCELLED: "ملغي",
};

export const statusColors: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-sage-100 text-sage-800",
    SHIPPED: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};




export function getOrderById(id: string, orders: Order[]): Order | undefined {
    return orders.find((o) => o.id === id);
}


// ─── Users ───────────────────────────────────────────────────────────────────

export type UserRole = "customer" | "admin";

export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    ordersCount: number;
    totalSpent: number;
    joinedAt: string;
    active: boolean;
};

let users: User[] = [
    {
        id: "u1",
        name: "سارة أحمد",
        email: "sara@example.com",
        phone: "01001234567",
        role: "customer",
        ordersCount: 3,
        totalSpent: 2800,
        joinedAt: "2025-01-10T00:00:00Z",
        active: true,
    },
    {
        id: "u2",
        name: "منى علي",
        email: "mona@example.com",
        phone: "01112345678",
        role: "customer",
        ordersCount: 1,
        totalSpent: 380,
        joinedAt: "2025-03-20T00:00:00Z",
        active: true,
    },
    {
        id: "u3",
        name: "فاطمة محمد",
        email: "fatma@example.com",
        phone: "01234567890",
        role: "customer",
        ordersCount: 2,
        totalSpent: 3200,
        joinedAt: "2025-02-14T00:00:00Z",
        active: true,
    },
    {
        id: "u4",
        name: "نور حسن",
        email: "nour@example.com",
        phone: "01556789012",
        role: "customer",
        ordersCount: 1,
        totalSpent: 710,
        joinedAt: "2025-05-01T00:00:00Z",
        active: true,
    },
    {
        id: "u5",
        name: "هبة إبراهيم",
        email: "heba@example.com",
        phone: "01098765432",
        role: "customer",
        ordersCount: 1,
        totalSpent: 580,
        joinedAt: "2025-04-18T00:00:00Z",
        active: false,
    },
    {
        id: "u6",
        name: "مدير النظام",
        email: "admin@mada-store.com",
        phone: "01000000000",
        role: "admin",
        ordersCount: 0,
        totalSpent: 0,
        joinedAt: "2025-01-01T00:00:00Z",
        active: true,
    },
];

export function getUsers(): User[] {
    return [...users];
}

export function toggleUserActive(id: string): User | undefined {
    users = users.map((u) => (u.id === id ? { ...u, active: !u.active } : u));
    return users.find((u) => u.id === id);
}

// ─── Overview stats ───────────────────────────────────────────────────────────

export function getOverviewStats(orders: Order[]) {
    const totalRevenue = orders
        .filter((o) => o.status === "DELIVERED")
        .reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
    const totalCustomers = users.filter((u) => u.role === "customer").length;

    const revenueByMonth: Record<string, number> = {};
    orders
        .filter((o) => o.status === "DELIVERED")
        .forEach((o) => {
            const month = new Date(o.createdAt).toISOString().slice(0, 7);
            revenueByMonth[month] = (revenueByMonth[month] || 0) + o.total;
        });

    const ordersByStatus: Record<OrderStatus, number> = {
        PENDING: 0,
        CONFIRMED: 0,
        SHIPPED: 0,
        DELIVERED: 0,
        CANCELLED: 0,
    };
    orders.forEach((o) => ordersByStatus[o.status]++);

    return {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalCustomers,
        revenueByMonth,
        ordersByStatus,
    };
}

// ─── Categories (admin CRUD) ───────────────────────────────────────────────────
// بيستخدم نفس بيانات src/lib/data.ts بس بيضيف عليها CRUD operations
// لما يتربط الـ backend، استبدل بـ Prisma calls

/** Convert Arabic/English name to a URL-safe slug */
export function toSlug(name: string, id?: string): string {
    const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-") // مسافات → شرطات
        .replace(/[^\w\u0621-\u064A-]/g, "") // يشيل كل حاجة غير حروف وأرقام وعربي
        .replace(/-+/g, "-") // شرطات متكررة → شرطة واحدة
        .replace(/^-|-$/g, ""); // يشيل شرطات من الأول والآخر
    return slug;
}
