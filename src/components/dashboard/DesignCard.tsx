"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Trash2, Share2, Globe2, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import type { Generation } from "@/types/database";

interface DesignCardProps {
  generation: Generation;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string, isPublic: boolean) => void;
  showActions?: boolean;
}

const designTypeLabels: Record<string, string> = {
  logo: "Logo",
  kartvizit: "Kartvizit",
  afis: "Afiş",
  brosur: "Broşür",
  sosyal_medya: "Sosyal Medya",
  menu: "Menü",
  davetiye: "Davetiye",
  etiket: "Etiket",
  sticker: "Sticker",
  tisort: "Tişört",
  banner: "Banner",
  ambalaj: "Ambalaj",
  kitap_ayiraci: "Kitap Ayracı",
  el_ilani: "El İlanı",
};

export function DesignCard({
  generation,
  onDelete,
  onTogglePublic,
  showActions = true,
}: DesignCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    await onDelete(generation.id);
    setDeleting(false);
  };

  const handleDownload = async () => {
    if (!generation.output_url) return;
    const response = await fetch(generation.output_url);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kronos-${generation.design_type}-${generation.id.slice(0, 8)}.${generation.output_format ?? "png"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTogglePublic = async () => {
    if (!onTogglePublic) return;
    setToggling(true);
    await onTogglePublic(generation.id, !generation.is_public);
    setToggling(false);
  };

  const isPending = generation.status === "pending" || generation.status === "processing";
  const isFailed = generation.status === "failed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative rounded-2xl border border-border bg-brand-surface overflow-hidden hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
    >
      {/* Image area */}
      <div className="relative aspect-square bg-brand-elevated overflow-hidden">
        {isPending ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
            <p className="text-xs text-muted-foreground">Üretiliyor...</p>
          </div>
        ) : isFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <p className="text-sm text-red-400 font-medium">Üretim Başarısız</p>
            <p className="text-xs text-muted-foreground">Kredi iade edildi</p>
          </div>
        ) : generation.output_url ? (
          <Image
            src={generation.output_url}
            alt={`${generation.brand_name} ${designTypeLabels[generation.design_type] ?? generation.design_type}`}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}

        {/* Overlay actions */}
        {showActions && !isPending && !isFailed && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="icon" variant="secondary" onClick={handleDownload} title="İndir">
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleTogglePublic}
              disabled={toggling}
              title={generation.is_public ? "Gizle" : "Toplulukta Paylaş"}
            >
              {toggling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : generation.is_public ? (
                <Globe2 className="w-4 h-4 text-brand-violet" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </Button>
            {onDelete && (
              <Button
                size="icon"
                variant="secondary"
                onClick={handleDelete}
                disabled={deleting}
                className="hover:text-red-400"
                title="Sil"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        )}

        {/* Public badge */}
        {generation.is_public && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-[10px] py-0.5">
              <Globe2 className="w-2.5 h-2.5 mr-1" />
              Herkese Açık
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-medium text-sm text-foreground truncate">{generation.brand_name}</p>
          <Badge variant="outline" className="text-[10px] shrink-0">
            {designTypeLabels[generation.design_type] ?? generation.design_type}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(generation.created_at)}
        </p>
      </div>
    </motion.div>
  );
}
