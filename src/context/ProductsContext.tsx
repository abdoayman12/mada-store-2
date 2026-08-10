"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
} from "react";
import { Product } from "@/generated/prisma/client";

type ProductsContextValue = {
    products: Product[];
    setProducts: Dispatch<Product[]>;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

const productsValue = () => {
    try {
        const raw = window.localStorage.getItem("products");
        if (raw) return JSON.parse(raw);
    } catch {
        // ignore corrupted storage
    }
    return [];
}

export function ProductsProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>(productsValue());

    return (
        <ProductsContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductsContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProducts() {
    const ctx = useContext(ProductsContext);
    if (!ctx)
        throw new Error("useProducts must be used inside <ProductsContext>");
    return ctx;
}
