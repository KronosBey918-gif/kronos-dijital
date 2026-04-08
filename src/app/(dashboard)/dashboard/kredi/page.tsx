"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { Coins, Zap, Crown, Sparkles, Check, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CreditPackage, CreditTransaction } from "@/types/database";

const packageIcons: Record<number, { icon: typeof Zap; color: string; glow: string }> = {
  0: { icon: Zap, color: "text-brand-orange", glow: "shadow-brand-orange/20" },
  1: { icon: Crown, color: "text-brand-violet", glow: "shadow-brand-violet/20" },
  2: { icon: Sparkles, color: "text-brand-gold", glow: "shadow-brand-gold/20" },
};

export default function CreditsPage() {
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const [credits, setCredits] = useState(0);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [paymentHtml, setPaymentHtml] = useState<string | null>(null);

  // Check for payment return
  useEffect(() => {
    const status = searchParams.get("durum");
    const krediler = searchParams.get("kredi");

    if (status === "basarili") {
      toast({
        title: "Ödeme başarılı!",
        description: `${krediler} kredi hesabınıza eklendi.`,
        variant: "success",
      });
      fetchData();
    } else if (status === "basarisiz") {
      toast({ title: "Ödeme başarısız", variant: "error" });
    } else if (status === "hata") {
      toast({ title: "Bir hata oluştu", variant: "error" });
    }
  }, [searchParams]);

  const fetchData = async () => {
    if (!userId) return;
    const supabase = createClient();

    const [profileResult, packagesResult, txResult] = await Promise.all([
      supabase.from("profiles").select("credits").eq("id", userId).single(),
      supabase.from("credit_packages").select("*").eq("is_active", true).order("sort_order"),
      supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    setCredits(profileResult.data?.credits ?? 0);
    setPackages((packagesResult.data as CreditPackage[]) ?? []);
    setTransactions((txResult.data as CreditTransaction[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handlePurchase = async (pkg: CreditPackage) => {
    setPurchasing(pkg.id);
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ title: data.error ?? "Ödeme başlatılamadı", variant: "error" });
        return;
      }

      setPaymentHtml(data.checkoutFormContent);
    } catch {
      toast({ title: "Bağlantı hatası", variant: "error" });
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div>
      <DashboardHeader title="Kredi Satın Al" credits={credits} />
      <main className="p-4 lg:p-6 space-y-8">
        {/* Current credits */}
        <div className="flex items-center gap-4 p-6 rounded-2xl border border-brand-gold/20 bg-brand-gold/5">
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 flex items-center justify-center">
            <Coins className="w-7 h-7 text-brand-gold" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mevcut Krediniz</p>
            <p className="text-4xl font-black text-brand-gold">
              {credits}
              <span className="text-lg font-normal ml-1 text-muted-foreground">kredi</span>
            </p>
          </div>
        </div>

        {/* Packages */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">Kredi Paketleri</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-2xl bg-brand-surface shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {packages.map((pkg, i) => {
                const pkgMeta = packageIcons[i] ?? packageIcons[0];
                const PkgIcon = pkgMeta.icon;
                const isPopular = i === 1;

                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "relative p-6 rounded-2xl border transition-all",
                      isPopular
                        ? "border-brand-violet/40 bg-brand-violet/5 shadow-lg shadow-brand-violet/10"
                        : "border-border bg-brand-surface/50 hover:border-white/10"
                    )}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-violet text-white text-xs font-bold px-3 py-0.5 rounded-full">
                        Popüler
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl bg-${pkgMeta.color.replace("text-", "")}/15 flex items-center justify-center`}
                      >
                        <PkgIcon className={`w-5 h-5 ${pkgMeta.color}`} />
                      </div>
                      <div className="font-bold text-foreground">{pkg.name}</div>
                    </div>
                    <div className="mb-1">
                      <span className="text-3xl font-black text-foreground">
                        {formatCurrency(pkg.price)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-5">
                      {pkg.credits} kredi •{" "}
                      {formatCurrency(pkg.price / pkg.credits)}/kredi
                    </p>
                    <Button
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => handlePurchase(pkg)}
                      disabled={purchasing === pkg.id}
                    >
                      {purchasing === pkg.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Coins className="w-4 h-4" />
                          Satın Al
                        </>
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transaction history */}
        <div>
          <h2 className="font-semibold text-foreground mb-4">İşlem Geçmişi</h2>
          {transactions.length === 0 ? (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-border">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Henüz işlem yok.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-brand-surface/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      tx.amount > 0 ? "text-green-400" : "text-muted-foreground"
                    )}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount} kr
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* iyzico payment modal */}
        {paymentHtml && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPaymentHtml(null)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              dangerouslySetInnerHTML={{ __html: paymentHtml }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
