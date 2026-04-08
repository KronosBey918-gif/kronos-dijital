"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DesignCard } from "@/components/dashboard/DesignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { DESIGN_TYPE_LABELS } from "@/lib/prompts/generator";
import type { Generation, DesignType } from "@/types/database";

export default function GalleryPage() {
  const { userId } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const fetchGenerations = useCallback(async () => {
    if (!userId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setGenerations((data as Generation[]) ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations]);

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("generations")
      .delete()
      .eq("id", id)
      .eq("user_id", userId!);

    if (error) {
      toast({ title: "Silinemedi", variant: "error" });
    } else {
      setGenerations((prev) => prev.filter((g) => g.id !== id));
      toast({ title: "Silindi", variant: "success" });
    }
  };

  const handleTogglePublic = async (id: string, isPublic: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("generations")
      .update({ is_public: isPublic })
      .eq("id", id)
      .eq("user_id", userId!);

    if (!error) {
      setGenerations((prev) =>
        prev.map((g) => (g.id === id ? { ...g, is_public: isPublic } : g))
      );
      toast({
        title: isPublic ? "Toplulukta paylaşıldı!" : "Gizlendi",
        variant: "success",
      });
    }
  };

  const filteredGenerations = generations.filter((g) => {
    const matchSearch =
      !search ||
      g.brand_name.toLowerCase().includes(search.toLowerCase()) ||
      g.design_type.includes(search.toLowerCase());
    const matchType = filterType === "all" || g.design_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div>
      <DashboardHeader title="Galerim" />
      <main className="p-4 lg:p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Marka adı veya tür ara..."
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
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-brand-surface shimmer" />
            ))}
          </div>
        ) : filteredGenerations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border">
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-muted-foreground mb-4">
              {search || filterType !== "all"
                ? "Arama kriterlerine uygun tasarım yok."
                : "Henüz tasarım üretmediniz."}
            </p>
            {!search && filterType === "all" && (
              <Button asChild>
                <Link href="/olustur">
                  <Plus className="w-4 h-4" />
                  İlk Tasarımını Oluştur
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGenerations.map((gen) => (
                <DesignCard
                  key={gen.id}
                  generation={gen}
                  onDelete={handleDelete}
                  onTogglePublic={handleTogglePublic}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
