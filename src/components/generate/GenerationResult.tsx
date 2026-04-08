"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Share2, Plus, Images, Check, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { DESIGN_TYPE_LABELS } from "@/lib/prompts/generator";
import type { WizardData } from "./BrandWizard";

interface GenerationResultProps {
  outputUrl: string;
  generationId: string;
  data: WizardData;
  onNewDesign: () => void;
  onGoGallery: () => void;
}

export function GenerationResult({
  outputUrl,
  generationId,
  data,
  onNewDesign,
  onGoGallery,
}: GenerationResultProps) {
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(outputUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kronos-${data.designType}-${data.brandName.replace(/\s/g, "-")}.${data.outputFormat}`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "İndirildi!", variant: "success" });
    } catch {
      toast({ title: "İndirme başarısız", variant: "error" });
    } finally {
      setDownloading(false);
    }
  };

  const handleTogglePublic = async () => {
    try {
      const response = await fetch(`/api/generations/${generationId}/toggle-public`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !isPublic }),
      });
      if (response.ok) {
        setIsPublic(!isPublic);
        toast({
          title: isPublic ? "Gizlendi" : "Toplulukta paylaşıldı!",
          variant: "success",
        });
      }
    } catch {
      toast({ title: "İşlem başarısız", variant: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-4">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-medium">Tasarımın hazır!</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">
          {data.designType && DESIGN_TYPE_LABELS[data.designType]} — {data.brandName}
        </h2>
        <p className="text-muted-foreground text-sm">
          Tasarımını indir veya galerinde kayıtlı olarak bul.
        </p>
      </motion.div>

      {/* Result image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border border-border bg-brand-elevated shadow-2xl"
      >
        <Image
          src={outputUrl}
          alt={`${data.brandName} ${data.designType}`}
          fill
          className="object-contain p-4"
          sizes="400px"
          priority
        />
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button className="w-full" onClick={handleDownload} disabled={downloading}>
          <Download className="w-4 h-4" />
          {downloading ? "İndiriliyor..." : `İndir (.${data.outputFormat})`}
        </Button>
        <Button variant="outline" className="w-full" onClick={handleTogglePublic}>
          {isPublic ? (
            <>
              <Globe2 className="w-4 h-4 text-brand-violet" />
              Herkese Açık
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Toplulukta Paylaş
            </>
          )}
        </Button>
        <Button variant="secondary" className="w-full" onClick={onGoGallery}>
          <Images className="w-4 h-4" />
          Galerime Git
        </Button>
        <Button variant="secondary" className="w-full" onClick={onNewDesign}>
          <Plus className="w-4 h-4" />
          Yeni Tasarım
        </Button>
      </motion.div>
    </div>
  );
}
