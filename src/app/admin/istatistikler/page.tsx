import { createAdminClient } from "@/lib/supabase/server";
import { BarChart3, TrendingUp, Users, Images, Coins } from "lucide-react";

export const metadata = { title: "Admin — İstatistikler" };

export default async function AdminStatsPage() {
  const supabase = await createAdminClient();

  const [usersResult, generationsResult, paymentsResult, txResult] = await Promise.all([
    supabase.from("profiles").select("id, created_at, credits"),
    supabase.from("generations").select("id, status, design_type, credits_used, created_at"),
    supabase.from("payments").select("id, amount, status, created_at"),
    supabase.from("credit_transactions").select("id, amount, type, created_at"),
  ]);

  const users = usersResult.data ?? [];
  const generations = generationsResult.data ?? [];
  const payments = paymentsResult.data ?? [];
  const transactions = txResult.data ?? [];

  const completedGens = generations.filter((g) => g.status === "completed");
  const failedGens = generations.filter((g) => g.status === "failed");
  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + Number(p.amount), 0);

  // Design type distribution
  const typeCount: Record<string, number> = {};
  completedGens.forEach((g) => {
    typeCount[g.design_type] = (typeCount[g.design_type] ?? 0) + 1;
  });
  const topTypes = Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  // Weekly activity (last 7 days)
  const now = Date.now();
  const weekly = Array.from({ length: 7 }, (_, i) => {
    const dayStart = new Date(now - (6 - i) * 24 * 60 * 60 * 1000);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    const count = completedGens.filter((g) => {
      const d = new Date(g.created_at);
      return d >= dayStart && d <= dayEnd;
    }).length;
    return { day: dayStart.toLocaleDateString("tr-TR", { weekday: "short" }), count };
  });

  const maxCount = Math.max(...weekly.map((w) => w.count), 1);

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">İstatistikler</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Toplam Kullanıcı", value: users.length, icon: Users, color: "text-brand-orange" },
          { label: "Başarılı Tasarım", value: completedGens.length, icon: Images, color: "text-green-400" },
          { label: "Başarısız Tasarım", value: failedGens.length, icon: BarChart3, color: "text-red-400" },
          { label: "Toplam Gelir", value: `${totalRevenue.toFixed(0)}₺`, icon: Coins, color: "text-brand-gold" },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-2xl border border-border bg-brand-surface/50">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="p-6 rounded-2xl border border-border bg-brand-surface/50">
        <h2 className="font-semibold text-foreground mb-6">Son 7 Gün — Üretim Grafiği</h2>
        <div className="flex items-end gap-3 h-32">
          {weekly.map((w) => (
            <div key={w.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">{w.count}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-brand-orange to-brand-gold transition-all"
                style={{ height: `${(w.count / maxCount) * 100}%`, minHeight: w.count > 0 ? "4px" : "0" }}
              />
              <span className="text-xs text-muted-foreground">{w.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top design types */}
      <div className="p-6 rounded-2xl border border-border bg-brand-surface/50">
        <h2 className="font-semibold text-foreground mb-4">En Çok Üretilen Tasarım Türleri</h2>
        <div className="space-y-3">
          {topTypes.map(([type, count]) => (
            <div key={type} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-28 capitalize">{type}</span>
              <div className="flex-1 h-2 rounded-full bg-brand-elevated overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-orange to-brand-gold rounded-full"
                  style={{ width: `${(count / (topTypes[0]?.[1] ?? 1)) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
