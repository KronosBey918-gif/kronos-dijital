import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Zap, LayoutDashboard, Users, Images, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { label: "Genel Bakış", href: "/admin", icon: LayoutDashboard },
  { label: "Kullanıcılar", href: "/admin/kullanicilar", icon: Users },
  { label: "Tasarımlar", href: "/admin/tasarimlar", icon: Images },
  { label: "İstatistikler", href: "/admin/istatistikler", icon: BarChart3 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/giris");

  const supabase = await createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .single();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Admin sidebar */}
      <aside className="w-60 border-r border-border bg-brand-dark/50 fixed top-0 left-0 bottom-0 flex flex-col">
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">
              <span className="text-brand-cream">Kronos</span>{" "}
              <span className="gradient-text-orange">Admin</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-brand-surface/50 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Dashboard&apos;a Dön
          </Link>
        </div>
      </aside>

      <div className="pl-60 flex-1">{children}</div>
    </div>
  );
}
