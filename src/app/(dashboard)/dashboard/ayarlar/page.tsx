import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UserProfile } from "@clerk/nextjs";

export const metadata = { title: "Ayarlar" };

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/giris");

  return (
    <div>
      <DashboardHeader title="Hesap Ayarları" />
      <main className="p-4 lg:p-6">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-brand-surface border border-border shadow-none rounded-2xl",
              navbar: "bg-brand-elevated border-border",
              navbarButton__active: "text-brand-orange",
              pageScrollBox: "bg-transparent",
              formButtonPrimary:
                "bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl",
              formFieldInput:
                "bg-brand-elevated border-border rounded-xl focus:ring-brand-orange/50",
            },
          }}
        />
      </main>
    </div>
  );
}
