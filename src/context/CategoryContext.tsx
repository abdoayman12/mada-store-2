"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    useEffect,
} from "react";
import { Category, Product } from "@/generated/prisma/client";

interface CategoryAndProducts extends Category {
    products: Product[];
}

type CategorieContextValue = {
    category: CategoryAndProducts[];
    setCategory: Dispatch<CategoryAndProducts[]>;
};

const CategoryContext = createContext<CategorieContextValue | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
    const [category, setCategory] = useState<CategoryAndProducts[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("category");
            if (raw) setCategory(JSON.parse(raw));
        } catch {
            // ignore corrupted storage
        }
    }, []);
    return (
        <CategoryContext.Provider value={{ category, setCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCatgory() {
    const ctx = useContext(CategoryContext);
    if (!ctx)
        throw new Error("useCategory must be used inside <CategoryContext>");
    return ctx;
}
