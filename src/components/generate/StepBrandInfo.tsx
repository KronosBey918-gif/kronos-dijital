"use client";

import { ArrowRight, Building2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { WizardData } from "./BrandWizard";

interface StepBrandInfoProps {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  credits: number;
}

const industries = [
  "Yiyecek & İçecek",
  "Teknoloji",
  "Moda & Giyim",
  "Sağlık & Güzellik",
  "Eğitim",
  "Finans",
  "Gayrimenkul",
  "Turizm",
  "Spor",
  "Sanat & Tasarım",
  "Perakende",
  "Diğer",
];

export function StepBrandInfo({ data, onChange, onNext, credits }: StepBrandInfoProps) {
  const canProceed = data.brandName.trim().length >= 2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-brand-orange/15 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-7 h-7 text-brand-orange" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Markanı Tanıt</h2>
        <p className="text-muted-foreground">
          Yapay zekanın sana özel tasarım üretebilmesi için markan hakkında bilgi ver.
        </p>
      </div>

      {/* Brand mode toggle */}
      <div className="grid grid-cols-2 gap-3">
        {(["new", "existing"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onChange({ brandMode: mode })}
            className={cn(
              "p-4 rounded-xl border text-sm font-medium transition-all text-left",
              data.brandMode === mode
                ? "border-brand-orange/50 bg-brand-orange/10 text-brand-orange"
                : "border-border bg-brand-surface/50 text-muted-foreground hover:text-foreground hover:border-white/10"
            )}
          >
            <div className="font-semibold mb-1">
              {mode === "new" ? "🌱 Sıfırdan Marka Oluştur" : "✅ Markanı Tanıt"}
            </div>
            <div className="text-xs opacity-70">
              {mode === "new"
                ? "Henüz bir markan yok, beraber oluşturalım"
                : "Var olan markan için tasarım üret"}
            </div>
          </button>
        ))}
      </div>

      {/* Brand name */}
      <div className="space-y-2">
        <Label htmlFor="brandName">
          Marka Adı <span className="text-red-400">*</span>
        </Label>
        <Input
          id="brandName"
          placeholder="ör: Lezzet Durağı, TechFlow, Natura..."
          value={data.brandName}
          onChange={(e) => onChange({ brandName: e.target.value })}
          maxLength={100}
        />
      </div>

      {/* Brand description */}
      <div className="space-y-2">
        <Label htmlFor="brandDesc">
          Marka / Ürün Açıklaması{" "}
          <span className="text-muted-foreground text-xs">(isteğe bağlı)</span>
        </Label>
        <Textarea
          id="brandDesc"
          placeholder="Markanın ne yaptığını, değerlerini ve ne hissetirmesini istediğini birkaç cümleyle anlat..."
          value={data.brandDescription}
          onChange={(e) => onChange({ brandDescription: e.target.value })}
          maxLength={500}
          rows={3}
        />
        <p className="text-xs text-muted-foreground text-right">
          {data.brandDescription.length}/500
        </p>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label>
          Sektör <span className="text-muted-foreground text-xs">(isteğe bağlı)</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => onChange({ industry: data.industry === ind ? "" : ind })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                data.industry === ind
                  ? "border-brand-orange/50 bg-brand-orange/10 text-brand-orange"
                  : "border-border bg-brand-surface/50 text-muted-foreground hover:border-white/10 hover:text-foreground"
              )}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Target audience */}
      <div className="space-y-2">
        <Label htmlFor="audience">
          Hedef Kitle <span className="text-muted-foreground text-xs">(isteğe bağlı)</span>
        </Label>
        <Input
          id="audience"
          placeholder="ör: 25-40 yaş profesyoneller, genç anneler, öğrenciler..."
          value={data.targetAudience}
          onChange={(e) => onChange({ targetAudience: e.target.value })}
          maxLength={200}
        />
      </div>

      {/* Credits indicator */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-gold/10 border border-brand-gold/20">
        <Lightbulb className="w-4 h-4 text-brand-gold shrink-0" />
        <p className="text-xs text-brand-gold">
          Mevcut krediniz: <strong>{credits} kr</strong> — Her tasarım 1-4 kredi harcar.
        </p>
      </div>

      {/* Next */}
      <Button
        className="w-full"
        size="lg"
        onClick={onNext}
        disabled={!canProceed}
      >
        Devam Et — Tasarım Türü Seç
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
