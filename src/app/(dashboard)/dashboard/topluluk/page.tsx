"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DesignCard } from "@/components/dashboard/DesignCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Search, Users } from "lucide-react";
import { DESIGN_TYPE_LABELS } from "@/lib/prompts/generator";
import type { Generation } from "@/types/database";

export default function CommunityPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchPublic = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("generations")
        .select("*")
        .eq("is_public", true)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(48);

      setGenerations((data as Generation[]) ?? []);
      setLoading(false);
    };

    fetchPublic();
  }, []);

  const filtered = generations.filter((g) => {
    const matchSearch =
      !search || g.brand_name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || g.design_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div>
      <DashboardHeader title="Topluluk Galerisi" />
      <main className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-brand-violet/10 border border-brand-violet/20">
          <Users className="w-5 h-5 text-brand-violet shrink-0" />
          <p className="text-sm text-muted-foreground">
            Kullanıcıların paylaştığı tasarımlar. İlham almak için inceleyin!
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Marka ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Tüm türler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Türler</SelectItem>
              {Object.entries(DESIGN_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-brand-surface shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border">
            <div className="text-4xl mb-3">🌐</div>
            <p className="text-muted-foreground">
              Henüz paylaşılan tasarım yok veya arama kriterlerine uygun sonuç bulunamadı.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((gen) => (
              <DesignCard key={gen.id} generation={gen} showActions={false} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
