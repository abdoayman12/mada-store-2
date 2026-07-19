"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    useEffect,
} from "react";
import { Product } from "@/generated/prisma/client";

type ProductsContextValue = {
    products: Product[];
    setProducts: Dispatch<Product[]>;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem("products");
            if (raw) setProducts(JSON.parse(raw));
        } catch {
            // ignore corrupted storage
        }
    }, []);
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
