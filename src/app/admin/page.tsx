import { createAdminClient } from "@/lib/supabase/server";
import { Users, Images, Coins, TrendingUp } from "lucide-react";

export const metadata = { title: "Admin — Genel Bakış" };

export default async function AdminDashboard() {
  const supabase = await createAdminClient();

  const [usersResult, generationsResult, paymentsResult] = await Promise.all([
    supabase.from("profiles").select("id, email, credits, created_at, is_admin").order("created_at", { ascending: false }),
    supabase.from("generations").select("id, status, credits_used, created_at").order("created_at", { ascending: false }),
    supabase.from("payments").select("id, amount, status, created_at").eq("status", "completed"),
  ]);

  const users = usersResult.data ?? [];
  const generations = generationsResult.data ?? [];
  const payments = paymentsResult.data ?? [];

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const completedGenerations = generations.filter((g) => g.status === "completed").length;
  const totalCreditsUsed = generations
    .filter((g) => g.status === "completed")
    .reduce((sum, g) => sum + g.credits_used, 0);

  const stats = [
    { label: "Toplam Kullanıcı", value: users.length, icon: Users, color: "text-brand-orange" },
    { label: "Toplam Tasarım", value: completedGenerations, icon: Images, color: "text-brand-violet" },
    { label: "Toplam Gelir", value: `${totalRevenue.toFixed(0)}₺`, icon: Coins, color: "text-brand-gold" },
    { label: "Kullanılan Kredi", value: totalCreditsUsed, icon: TrendingUp, color: "text-green-400" },
  ];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Genel Bakış</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-2xl border border-border bg-brand-surface/50">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div className="rounded-2xl border border-border bg-brand-surface/50 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Son Kayıt Olan Kullanıcılar</h2>
        </div>
        <div className="divide-y divide-border">
          {users.slice(0, 10).map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">{user.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-brand-gold font-semibold">{user.credits} kr</span>
                {user.is_admin && (
                  <span className="text-xs bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
