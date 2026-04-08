"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles, X, Plus, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CREDIT_COSTS, DESIGN_TYPE_LABELS } from "@/lib/prompts/generator";
import type { WizardData } from "./BrandWizard";

interface StepCustomizeProps {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
  onGenerate: () => void;
  onBack: () => void;
  credits: number;
}

const PRESET_COLORS = [
  "#F97316", "#A78BFA", "#F59E0B", "#10B981", "#3B82F6",
  "#EF4444", "#EC4899", "#8B5CF6", "#06B6D4", "#84CC16",
  "#1F2937", "#FFFFFF",
];

const STYLE_PRESETS = [
  "Minimalist & Modern",
  "Lüks & Şık",
  "Eğlenceli & Renkli",
  "Kurumsal & Profesyonel",
  "Vintage & Retro",
  "Sade & Temiz",
  "Dinamik & Genç",
  "Doğal & Organik",
];

export function StepCustomize({
  data,
  onChange,
  onGenerate,
  onBack,
  credits,
}: StepCustomizeProps) {
  const [keywordInput, setKeywordInput] = useState("");
  const creditCost = data.designType ? CREDIT_COSTS[data.designType] : 0;
  const canGenerate = credits >= creditCost;

  const toggleColor = (color: string) => {
    const current = data.colorPalette;
    if (current.includes(color)) {
      onChange({ colorPalette: current.filter((c) => c !== color) });
    } else if (current.length < 5) {
      onChange({ colorPalette: [...current, color] });
    }
  };

  const addKeyword = () => {
    const kw = keywordInput.trim();
    if (kw && !data.keywords.includes(kw) && data.keywords.length < 10) {
      onChange({ keywords: [...data.keywords, kw] });
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    onChange({ keywords: data.keywords.filter((k) => k !== kw) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-brand-gold" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Son Dokunuşlar</h2>
        <p className="text-muted-foreground">
          {data.designType && (
            <span>
              <strong className="text-foreground">{DESIGN_TYPE_LABELS[data.designType]}</strong> tasarımını isteğe göre özelleştir.
              Bu adım isteğe bağlıdır.
            </span>
          )}
        </p>
      </div>

      {/* Color palette */}
      <div className="space-y-3">
        <Label>
          Renk Paleti{" "}
          <span className="text-muted-foreground text-xs">(maks. 5 renk seçilebilir)</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => {
            const selected = data.colorPalette.includes(color);
            return (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                title={color}
                className={cn(
                  "w-8 h-8 rounded-lg border-2 transition-all hover:scale-110",
                  selected ? "border-brand-orange scale-110 shadow-lg" : "border-transparent"
                )}
                style={{ backgroundColor: color }}
              >
                {selected && (
                  <span className="flex items-center justify-center text-white text-xs">✓</span>
                )}
              </button>
            );
          })}
        </div>
        {data.colorPalette.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {data.colorPalette.map((c) => (
              <div
                key={c}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-brand-surface text-xs"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                <span className="text-muted-foreground">{c}</span>
                <button onClick={() => toggleColor(c)}>
                  <X className="w-3 h-3 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Style preset */}
      <div className="space-y-3">
        <Label>
          Stil Tercihi{" "}
          <span className="text-muted-foreground text-xs">(isteğe bağlı)</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((style) => (
            <button
              key={style}
              onClick={() =>
                onChange({ styleNotes: data.styleNotes === style ? "" : style })
              }
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                data.styleNotes === style
                  ? "border-brand-orange/50 bg-brand-orange/10 text-brand-orange"
                  : "border-border bg-brand-surface/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {style}
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Ya da kendi stil notunuzu yazın: ör. 'koyu zemin, altın sarısı yazılar, geometrik şekiller'..."
          value={STYLE_PRESETS.includes(data.styleNotes) ? "" : data.styleNotes}
          onChange={(e) => onChange({ styleNotes: e.target.value })}
          rows={2}
          maxLength={300}
        />
      </div>

      {/* Keywords */}
      <div className="space-y-3">
        <Label>
          Anahtar Kelimeler{" "}
          <span className="text-muted-foreground text-xs">(maks. 10)</span>
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="ör: güvenilir, yenilikçi, sıcak..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            maxLength={50}
          />
          <Button variant="outline" size="icon" onClick={addKeyword}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {data.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((kw) => (
              <div
                key={kw}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-brand-surface text-xs"
              >
                <span className="text-muted-foreground">{kw}</span>
                <button onClick={() => removeKeyword(kw)}>
                  <X className="w-3 h-3 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Credit cost warning */}
      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-xl border",
          canGenerate
            ? "border-brand-gold/20 bg-brand-gold/5"
            : "border-red-500/20 bg-red-500/5"
        )}
      >
        <div className="flex items-center gap-2">
          <Coins className={`w-4 h-4 ${canGenerate ? "text-brand-gold" : "text-red-400"}`} />
          <div>
            <p className="text-sm font-medium text-foreground">
              Bu tasarım{" "}
              <strong className={canGenerate ? "text-brand-gold" : "text-red-400"}>
                {creditCost} kredi
              </strong>{" "}
              harcar
            </p>
            <p className="text-xs text-muted-foreground">
              {canGenerate
                ? `Bakiyeniz: ${credits} kr`
                : `Yetersiz kredi! Bakiyeniz: ${credits} kr, gereken: ${creditCost} kr`}
            </p>
          </div>
        </div>
        {!canGenerate && (
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/kredi">Kredi Al</a>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Button>
        <Button
          className="flex-1"
          size="lg"
          onClick={onGenerate}
          disabled={!canGenerate}
        >
          <Sparkles className="w-4 h-4" />
          Tasarımı Üret ({creditCost} kredi)
        </Button>
      </div>
    </div>
  );
}
