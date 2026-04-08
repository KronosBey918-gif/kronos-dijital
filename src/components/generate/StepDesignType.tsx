"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ALL_DESIGN_TYPES,
  DESIGN_TYPE_LABELS,
  DESIGN_TYPE_ICONS,
  CREDIT_COSTS,
} from "@/lib/prompts/generator";
import type { WizardData } from "./BrandWizard";
import type { DesignType } from "@/types/database";

interface StepDesignTypeProps {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepDesignType({ data, onChange, onNext, onBack }: StepDesignTypeProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-brand-violet/15 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✦</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Hangi Tasarımı İstiyorsun?</h2>
        <p className="text-muted-foreground">
          <strong className="text-foreground">{data.brandName}</strong> için üretmek istediğin tasarım türünü seç.
        </p>
      </div>

      {/* Design types grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ALL_DESIGN_TYPES.map((type) => {
          const isSelected = data.designType === type;
          const cost = CREDIT_COSTS[type];

          return (
            <button
              key={type}
              onClick={() => onChange({ designType: type })}
              className={cn(
                "relative p-4 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5",
                isSelected
                  ? "border-brand-orange/50 bg-brand-orange/10 shadow-lg shadow-brand-orange/10"
                  : "border-border bg-brand-surface/50 hover:border-white/10 hover:bg-brand-surface"
              )}
            >
              <div className="text-2xl mb-2">{DESIGN_TYPE_ICONS[type]}</div>
              <div
                className={cn(
                  "font-semibold text-sm mb-1",
                  isSelected ? "text-brand-orange" : "text-foreground"
                )}
              >
                {DESIGN_TYPE_LABELS[type]}
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    isSelected ? "text-brand-gold" : "text-muted-foreground"
                  )}
                >
                  {cost} kredi
                </span>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Output format */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Çıktı Formatı</p>
        <div className="grid grid-cols-4 gap-2">
          {(["png", "jpg", "pdf", "svg"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => onChange({ outputFormat: fmt })}
              className={cn(
                "py-2 rounded-lg border text-sm font-medium transition-all",
                data.outputFormat === fmt
                  ? "border-brand-orange/50 bg-brand-orange/10 text-brand-orange"
                  : "border-border bg-brand-surface/50 text-muted-foreground hover:text-foreground"
              )}
            >
              .{fmt.toUpperCase()}
            </button>
          ))}
        </div>
        {data.outputFormat === "png" && (
          <p className="text-xs text-muted-foreground">
            PNG: Logo ve sticker için şeffaf arka plan
          </p>
        )}
        {data.outputFormat === "svg" && (
          <p className="text-xs text-muted-foreground">
            SVG: Rasterden dönüştürülür, tam vektör için Illustrator gerekir
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Button>
        <Button className="flex-2" onClick={onNext} disabled={!data.designType}>
          Özelleştir
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
