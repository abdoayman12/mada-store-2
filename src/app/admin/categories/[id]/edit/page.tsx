"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { useCatgory } from "@/context/CategoryContext";

export default function EditCategoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { category } = useCatgory();
    const { id } = use(params);
    const categoryFound = category.find((item) => item.id === id);

    if (!categoryFound) return notFound();
    
    return <CategoryForm categoryProps={categoryFound} />;
}
