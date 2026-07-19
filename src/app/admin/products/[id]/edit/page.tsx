"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { useProducts } from "@/context/ProductsContext";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products } = useProducts()
  const product = products.find((p) => p.id === id);

  if (!product) return notFound();
  
  return <ProductForm product={product} />;
}
