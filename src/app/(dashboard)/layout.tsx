import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/giris");
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Sidebar />
      <div className="lg:pl-64">
        {children}
      </div>
    </div>
  );
}
