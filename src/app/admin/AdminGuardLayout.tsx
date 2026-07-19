"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminGuardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#F7F4EC]" dir="rtl">
            <AdminSidebar />
            <div className="flex flex-1 flex-col">
                <AdminTopbar />
                <main className="flex-1 p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
