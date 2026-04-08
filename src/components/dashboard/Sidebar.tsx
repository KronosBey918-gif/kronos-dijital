"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Plus,
  Images,
  Globe2,
  Coins,
  Settings,
  Zap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Tasarım Oluştur",
    href: "/olustur",
    icon: Plus,
    highlight: true,
  },
  {
    label: "Galerim",
    href: "/dashboard/galeri",
    icon: Images,
  },
  {
    label: "Topluluk",
    href: "/dashboard/topluluk",
    icon: Globe2,
  },
  {
    label: "Kredi Satın Al",
    href: "/dashboard/kredi",
    icon: Coins,
  },
  {
    label: "Ayarlar",
    href: "/dashboard/ayarlar",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border bg-brand-dark/50 backdrop-blur-xl fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center shadow-lg shadow-brand-orange/30 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base">
            <span className="text-brand-cream">Kronos</span>{" "}
            <span className="gradient-text-orange">Dijital</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                item.highlight
                  ? "bg-brand-orange text-white hover:bg-brand-orange-hover shadow-lg shadow-brand-orange/20"
                  : isActive
                  ? "bg-brand-surface text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-brand-surface/50"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  item.highlight ? "text-white" : isActive ? "text-brand-orange" : "text-current"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && !item.highlight && (
                <ChevronRight className="w-3 h-3 text-brand-orange" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom credit display */}
      <div className="p-4 border-t border-border">
        <Link
          href="/dashboard/kredi"
          className="flex items-center justify-between p-3 rounded-xl bg-brand-surface border border-border hover:border-brand-orange/30 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-gold/15 flex items-center justify-center">
              <Coins className="w-3.5 h-3.5 text-brand-gold" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kalan Kredi</p>
              <p className="text-sm font-bold text-brand-gold" id="sidebar-credits">
                — kr
              </p>
            </div>
          </div>
          <Plus className="w-4 h-4 text-muted-foreground group-hover:text-brand-orange transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
