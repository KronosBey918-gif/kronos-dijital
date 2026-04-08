import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DesignCard } from "@/components/dashboard/DesignCard";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Sparkles,
  Coins,
  Images,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import type { Generation } from "@/types/database";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/giris");

  const supabase = await createAdminClient();

  // Fetch profile + recent generations in parallel
  const [profileResult, generationsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase
      .from("generations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const profile = profileResult.data;
  const recentGenerations = (generationsResult.data ?? []) as Generation[];

  const stats = [
    {
      icon: Coins,
      label: "Kalan Kredi",
      value: profile?.credits ?? 0,
      unit: "kr",
      color: "text-brand-gold",
      bg: "bg-brand-gold/10",
      href: "/dashboard/kredi",
    },
    {
      icon: Images,
      label: "Toplam Tasarım",
      value: recentGenerations.length,
      unit: "",
      color: "text-brand-orange",
      bg: "bg-brand-orange/10",
      href: "/dashboard/galeri",
    },
    {
      icon: TrendingUp,
      label: "Bu Ay Üretilen",
      value: recentGenerations.filter(
        (g) =>
          new Date(g.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      unit: "",
      color: "text-brand-violet",
      bg: "bg-brand-violet/10",
      href: "/dashboard/galeri",
    },
  ];

  return (
    <div>
      <DashboardHeader
        title={`Merhaba, ${profile?.full_name?.split(" ")[0] ?? "Kullanıcı"} 👋`}
        credits={profile?.credits ?? 0}
      />

      <main className="p-4 lg:p-6 space-y-8">
        {/* Hero CTA */}
        <div className="relative overflow-hidden rounded-2xl border border-brand-orange/20 bg-gradient-to-br from-brand-orange/10 to-brand-violet/5 p-6 lg:p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-brand-orange" />
              <span className="text-sm font-semibold text-brand-orange">Yapay Zeka Destekli</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Yeni bir tasarım üret
            </h2>
            <p className="text-muted-foreground mb-5 max-w-md">
              Logo, kartvizit, afiş ve daha fazlası. Markanı tarif et, saniyeler içinde profesyonel
              tasarımını al.
            </p>
            <Button size="lg" asChild>
              <Link href="/olustur">
                <Plus className="w-4 h-4" />
                Tasarım Oluştur
              </Link>
            </Button>
          </div>
          <div className="absolute right-4 top-4 text-8xl opacity-5">✦</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-brand-surface/50 hover:border-white/10 hover:bg-brand-surface transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                  {stat.unit && (
                    <span className="text-sm font-normal ml-1">{stat.unit}</span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent designs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Son Tasarımlar</h3>
            <Link
              href="/dashboard/galeri"
              className="text-sm text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 transition-colors"
            >
              Tümünü Gör
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentGenerations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-border">
              <div className="text-4xl mb-3">✦</div>
              <p className="text-muted-foreground mb-4">
                Henüz tasarım üretmediniz.
              </p>
              <Button asChild>
                <Link href="/olustur">
                  <Plus className="w-4 h-4" />
                  İlk Tasarımı Oluştur
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {recentGenerations.map((gen) => (
                <DesignCard
                  key={gen.id}
                  generation={gen}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
