import AdminSidebar from "@/components/admin/AdminSidebar";
import { countUnviewedBookings } from "@/lib/bookings";
import { countUnviewedContactRequests } from "@/lib/contactRequests";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const unviewedBookings = await countUnviewedBookings();
  const unviewedMessages = await countUnviewedContactRequests();

  return (
    <div className="flex min-h-screen flex-col bg-cream-soft md:flex-row">
      <AdminSidebar unviewedBookings={unviewedBookings} unviewedMessages={unviewedMessages} />
      <div className="flex-1 p-5 sm:p-8">{children}</div>
    </div>
  );
}
