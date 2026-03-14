import { getInvoiceLogs } from "@/lib/excel";
import DashboardContent from "@/components/DashboardContent";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const logs = await getInvoiceLogs();
  
  return (
    <main className="min-h-screen bg-background selection:bg-purple-500/30">
      <Navbar />
      <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         <DashboardContent initialLogs={logs} />
      </div>
    </main>
  );
}
