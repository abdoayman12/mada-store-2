"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
} from "react";
import { Category, Product } from "@/generated/prisma/client";

interface CategoryAndProducts extends Category {
    products: Product[]
}

type CategorieContextValue = {
    category: CategoryAndProducts[];
    setCategory: Dispatch<CategoryAndProducts[]>;
};

const CategoryContext = createContext<CategorieContextValue | null>(null);

const categoryLocal = JSON.parse(localStorage.getItem("category") || "[]");

export function CategoryProvider({ children }: { children: ReactNode }) {
    const [category, setCategory] = useState<CategoryAndProducts[]>(
        () => categoryLocal ?? [],
    );

    return (
        <CategoryContext.Provider value={{ category, setCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCatgory() {
    const ctx = useContext(CategoryContext);
    if (!ctx) throw new Error("useAuth must be used inside <CategoryContext>");
    return ctx;
}
