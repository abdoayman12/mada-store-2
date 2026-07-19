import AdminGuardLayout from "./AdminGuardLayout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminGuardLayout>{children}</AdminGuardLayout>;
}
