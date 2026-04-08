import { createAdminClient } from "@/lib/supabase/server";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { DESIGN_TYPE_LABELS } from "@/lib/prompts/generator";
import type { DesignType } from "@/types/database";

export const metadata = { title: "Admin — Tasarımlar" };

export default async function AdminDesignsPage() {
  const supabase = await createAdminClient();
  const { data: generations } = await supabase
    .from("generations")
    .select("*, profiles(email, full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const statusColors: Record<string, string> = {
    completed: "bg-green-500/20 text-green-400",
    processing: "bg-brand-gold/20 text-brand-gold",
    failed: "bg-red-500/20 text-red-400",
    pending: "bg-blue-500/20 text-blue-400",
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Tasarımlar ({generations?.length ?? 0})
      </h1>

      <div className="grid grid-cols-1 gap-3">
        {(generations ?? []).map((gen) => (
          <div
            key={gen.id}
            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-brand-surface/50"
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-xl bg-brand-elevated overflow-hidden shrink-0">
              {gen.output_url && (
                <Image
                  src={gen.output_url}
                  alt={gen.brand_name}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain p-1"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-foreground text-sm">{gen.brand_name}</p>
                <span className="text-xs text-muted-foreground">
                  {DESIGN_TYPE_LABELS[gen.design_type as DesignType] ?? gen.design_type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {(gen as unknown as { profiles?: { email?: string } }).profiles?.email ?? gen.user_id}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(gen.created_at)}</p>
            </div>

            {/* Status + credits */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[gen.status] ?? ""}`}
              >
                {gen.status}
              </span>
              <span className="text-xs text-brand-gold">{gen.credits_used} kr</span>
              {gen.is_public && (
                <span className="text-xs text-brand-violet">Paylaşıldı</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
