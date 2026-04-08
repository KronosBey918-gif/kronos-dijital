"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Plus,
  Coins,
  LayoutDashboard,
  Images,
  Globe2,
  Settings,
  Zap,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasarım Oluştur", href: "/olustur", icon: Plus, highlight: true },
  { label: "Galerim", href: "/dashboard/galeri", icon: Images },
  { label: "Topluluk", href: "/dashboard/topluluk", icon: Globe2 },
  { label: "Kredi Satın Al", href: "/dashboard/kredi", icon: Coins },
  { label: "Ayarlar", href: "/dashboard/ayarlar", icon: Settings },
];

interface DashboardHeaderProps {
  title?: string;
  credits?: number;
}

export function DashboardHeader({ title, credits }: DashboardHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-20 bg-brand-dark/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Mobile menu + title */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-brand-surface transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {title && (
              <h1 className="font-semibold text-foreground text-base hidden sm:block">{title}</h1>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Credits badge */}
            {credits !== undefined && (
              <Link
                href="/dashboard/kredi"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-gold/10 border border-brand-gold/20 hover:border-brand-gold/40 transition-colors"
              >
                <Coins className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-sm font-semibold text-brand-gold">{credits} kr</span>
              </Link>
            )}

            {/* New design CTA */}
            <Button size="sm" asChild className="hidden sm:flex">
              <Link href="/olustur">
                <Plus className="w-3.5 h-3.5" />
                Yeni Tasarım
              </Link>
            </Button>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-brand-dark/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <nav className="p-4 space-y-1">
              {mobileNavItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      item.highlight
                        ? "bg-brand-orange text-white"
                        : isActive
                        ? "bg-brand-surface text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-brand-surface/50"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
