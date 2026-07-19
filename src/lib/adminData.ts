// ─── Orders ──────────────────────────────────────────────────────────────────

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

export const statusLabels: Record<OrderStatus, string> = {
    pending: "معلق",
    confirmed: "مؤكد",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    cancelled: "ملغي",
};

export const statusColors: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-sage-100 text-sage-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

let orders: Order[] = [
    {
        id: "ORD-0001",
        customer: "سارة أحمد",
        phone: "01001234567",
        governorate: "القاهرة",
        address: "مدينة نصر، شارع عباس العقاد، عمارة 15",
        items: [
            {
                productId: "p1",
                name: "سيروم العناية بالبشرة الطبيعي",
                price: 480,
                quantity: 2,
                image: "https://picsum.photos/seed/mada-p1/80/80",
            },
            {
                productId: "p4",
                name: "طقم أكواب سيراميك مرسومة يدويًا",
                price: 390,
                quantity: 1,
                image: "https://picsum.photos/seed/mada-p4/80/80",
            },
        ],
        total: 1410,
        status: "delivered",
        paymentMethod: "cod",
        createdAt: "2025-06-01T10:24:00Z",
    },
    {
        id: "ORD-0002",
        customer: "منى علي",
        phone: "01112345678",
        governorate: "الجيزة",
        address: "الدقي، شارع التحرير",
        items: [
            {
                productId: "p2",
                name: "شمعة عود ولافندر",
                price: 320,
                quantity: 1,
                image: "https://picsum.photos/seed/mada-p2/80/80",
            },
        ],
        total: 380,
        status: "shipped",
        paymentMethod: "card",
        createdAt: "2025-06-12T14:05:00Z",
    },
    {
        id: "ORD-0003",
        customer: "فاطمة محمد",
        phone: "01234567890",
        governorate: "الإسكندرية",
        address: "المنتزه، شارع الكورنيش",
        items: [
            {
                productId: "p3",
                name: "حقيبة يد جلد طبيعي",
                price: 1450,
                quantity: 1,
                image: "https://picsum.photos/seed/mada-p3/80/80",
            },
            {
                productId: "p5",
                name: "وشاح حرير منقوش",
                price: 510,
                quantity: 1,
                image: "https://picsum.photos/seed/mada-p5/80/80",
            },
        ],
        total: 2020,
        status: "confirmed",
        paymentMethod: "cod",
        createdAt: "2025-06-20T09:00:00Z",
    },
    {
        id: "ORD-0004",
        customer: "نور حسن",
        phone: "01556789012",
        governorate: "القاهرة",
        address: "المعادي، شارع ثروت",
        items: [
            {
                productId: "p8",
                name: "عطر خشب الصندل",
                price: 650,
                quantity: 1,
                image: "https://picsum.photos/seed/mada-p8/80/80",
            },
        ],
        total: 710,
        status: "pending",
        paymentMethod: "cod",
        createdAt: "2025-06-28T17:45:00Z",
    },
    {
        id: "ORD-0005",
        customer: "هبة إبراهيم",
        phone: "01098765432",
        governorate: "المنوفية",
        address: "شبين الكوم، شارع الجمهورية",
        items: [
            {
                productId: "p6",
                name: "زيت الورد للعناية بالشعر",
                price: 260,
                quantity: 2,
                image: "https://picsum.photos/seed/mada-p6/80/80",
            },
        ],
        total: 580,
        status: "cancelled",
        paymentMethod: "cod",
        createdAt: "2025-06-25T11:30:00Z",
    },
];

export function getOrders(): Order[] {
    return [...orders];
}

export function getOrderById(id: string): Order | undefined {
    return orders.find((o) => o.id === id);
}

export function updateOrderStatus(
    id: string,
    status: OrderStatus,
): Order | undefined {
    orders = orders.map((o) => (o.id === id ? { ...o, status } : o));
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

export function getOverviewStats() {
    const totalRevenue = orders
        .filter((o) => o.status === "delivered")
        .reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const totalCustomers = users.filter((u) => u.role === "customer").length;

    const revenueByMonth: Record<string, number> = {};
    orders
        .filter((o) => o.status === "delivered")
        .forEach((o) => {
            const month = o.createdAt.slice(0, 7);
            revenueByMonth[month] = (revenueByMonth[month] || 0) + o.total;
        });

    const ordersByStatus: Record<OrderStatus, number> = {
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
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

import { categories as seedCategories } from "./data";
import { Category } from "./types";

// mutable local copy
let adminCategories: Category[] = [...seedCategories];

export function getAdminCategories(): Category[] {
    return [...adminCategories];
}

export function getAdminCategoryById(id: string): Category | undefined {
    return adminCategories.find((c) => c.id === id);
}

export function createCategory(data: Omit<Category, "id">): Category {
    const newCat: Category = { ...data, id: `c${Date.now()}` };
    adminCategories = [...adminCategories, newCat];
    return newCat;
}

export function updateCategory(
    id: string,
    data: Partial<Omit<Category, "id">>,
): Category | undefined {
    adminCategories = adminCategories.map((c) =>
        c.id === id ? { ...c, ...data } : c,
    );
    return adminCategories.find((c) => c.id === id);
}

export function deleteCategory(id: string): boolean {
    const before = adminCategories.length;
    adminCategories = adminCategories.filter((c) => c.id !== id);
    return adminCategories.length < before;
}

/** Convert Arabic/English name to a URL-safe slug */
export function toSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/\s+/g, "-") // مسافات → شرطات
        .replace(/[^\w\u0621-\u064A-]/g, "") // يشيل كل حاجة غير حروف وأرقام وعربي
        .replace(/-+/g, "-") // شرطات متكررة → شرطة واحدة
        .replace(/^-|-$/g, ""); // يشيل شرطات من الأول والآخر
}
