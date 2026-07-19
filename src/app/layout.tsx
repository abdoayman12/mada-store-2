import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CategoryProvider } from "@/context/CategoryContext";
import { ProductsProvider } from "@/context/ProductsContext";
import FooterShow from "@/components/layout/FooterShow";

export const metadata: Metadata = {
    title: "مدى | متجر إلكتروني",
    description:
        "مدى — منتجات مختارة بعناية للمنزل والعناية الشخصية، بتجربة تسوق بسيطة وموثوقة.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@500;600;700&family=Tajawal:wght@300;400;500;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <AuthProvider>
                    <ProductsProvider>
                        <CategoryProvider>
                            <CartProvider>
                                <Header />
                                <main className="min-h-[60vh]">{children}</main>
                                <FooterShow />
                            </CartProvider>
                        </CategoryProvider>
                    </ProductsProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
