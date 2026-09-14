import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-soft md:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-5 sm:p-8">{children}</div>
    </div>
  );
}
