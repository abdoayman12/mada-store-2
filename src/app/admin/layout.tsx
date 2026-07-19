import { CategoryProvider } from "@/context/CategoryContext";
import AdminGuardLayout from "./AdminGuardLayout";
import { ProductsProvider } from "@/context/ProductsContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CategoryProvider>
            <ProductsProvider>
                <AdminGuardLayout>{children}</AdminGuardLayout>
            </ProductsProvider>
        </CategoryProvider>
    );
}
