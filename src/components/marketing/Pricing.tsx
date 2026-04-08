"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const packages = [
  {
    id: "starter",
    name: "Başlangıç",
    icon: Zap,
    credits: 50,
    price: 49,
    pricePerCredit: "0.98₺/kredi",
    description: "Küçük projeler ve bireysel kullanım için ideal.",
    color: "brand-orange",
    features: [
      "50 tasarım kredisi",
      "Tüm tasarım kategorileri",
      "PNG, JPG çıktı",
      "Kişisel galeri",
      "7/24 destek",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Profesyonel",
    icon: Crown,
    credits: 150,
    price: 129,
    pricePerCredit: "0.86₺/kredi",
    description: "Aktif markalar ve düzenli kullanıcılar için.",
    color: "brand-violet",
    features: [
      "150 tasarım kredisi",
      "Tüm tasarım kategorileri",
      "PNG, JPG, PDF, SVG çıktı",
      "Kişisel + topluluk galerisi",
      "Öncelikli destek",
      "%12 indirim",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Kurumsal",
    icon: Sparkles,
    credits: 500,
    price: 349,
    pricePerCredit: "0.70₺/kredi",
    description: "Ajanslar ve yoğun kullanıcılar için ekonomik seçenek.",
    color: "brand-gold",
    features: [
      "500 tasarım kredisi",
      "Tüm tasarım kategorileri",
      "Tüm çıktı formatları",
      "Kişisel + topluluk galerisi",
      "VIP destek",
      "%28 indirim",
      "Fatura/e-fatura",
    ],
    popular: false,
  },
];

const creditCosts: Record<string, number> = {
  logo: 3,
  kartvizit: 2,
  "afiş": 3,
  "broşür": 4,
  "sosyal medya": 1,
  "menü": 4,
  "davetiye": 3,
  diğer: 2,
};

export function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="fiyatlar" className="py-24 lg:py-32 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-brand-gold bg-brand-gold/10 px-4 py-1.5 rounded-full mb-4">
            Fiyatlandırma
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-brand-cream">Sadece kullandığın</span>{" "}
            <span className="gradient-text">kadar öde</span>
          </h2>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground">
            Abonelik yok, gizli ücret yok. Kredi satın al, dilediğin zaman tasarım üret.
          </p>
        </motion.div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative p-6 rounded-2xl border transition-all duration-300",
                pkg.popular
                  ? "border-brand-violet/50 bg-brand-violet/5 shadow-xl shadow-brand-violet/10 scale-105"
                  : "border-border bg-brand-surface/50 hover:border-white/10"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-violet to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  En Popüler
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-${pkg.color}/15 flex items-center justify-center`}
                >
                  <pkg.icon className={`w-5 h-5 text-${pkg.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{pkg.name}</h3>
                  <p className="text-xs text-muted-foreground">{pkg.pricePerCredit}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-foreground">{pkg.price}₺</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{pkg.credits} kredi</p>
              </div>

              <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>

              <Button
                variant={pkg.popular ? "default" : "outline"}
                className="w-full mb-6"
                asChild
              >
                <Link href="/kayit">Satın Al</Link>
              </Button>

              <ul className="space-y-2.5">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 text-${pkg.color} shrink-0`} />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Credit cost table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto p-6 rounded-2xl border border-border bg-brand-surface/50"
        >
          <h3 className="font-semibold text-foreground mb-4 text-center">Tasarım Başı Kredi Maliyeti</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(creditCosts).map(([type, cost]) => (
              <div
                key={type}
                className="text-center p-3 rounded-xl bg-brand-elevated/50 border border-white/5"
              >
                <div className="text-xl font-bold text-brand-orange">{cost}</div>
                <div className="text-xs text-muted-foreground capitalize mt-0.5">{type}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
