import { Suspense } from "react";
import ProductsView from "./ProductsView";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="wrap py-24 text-center text-ink-soft">جاري التحميل...</div>}>
      <ProductsView />
    </Suspense>
  );
}
