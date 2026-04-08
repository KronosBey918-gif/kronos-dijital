import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BrandWizard } from "@/components/generate/BrandWizard";

export const metadata = {
  title: "Tasarım Oluştur",
};

export default async function CreatePage() {
  const { userId } = await auth();
  if (!userId) redirect("/giris");

  const supabase = await createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  return (
    <div>
      <DashboardHeader title="Tasarım Oluştur" credits={profile?.credits ?? 0} />
      <main className="p-4 lg:p-8">
        <BrandWizard userCredits={profile?.credits ?? 0} />
      </main>
    </div>
  );
}
