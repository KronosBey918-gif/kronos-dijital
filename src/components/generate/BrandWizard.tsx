"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { StepBrandInfo } from "./StepBrandInfo";
import { StepDesignType } from "./StepDesignType";
import { StepCustomize } from "./StepCustomize";
import { GenerationProgress } from "./GenerationProgress";
import { GenerationResult } from "./GenerationResult";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/toaster";
import type { DesignType, OutputFormat } from "@/types/database";

export interface WizardData {
  // Step 1
  brandMode: "new" | "existing";
  brandName: string;
  brandDescription: string;
  industry: string;
  targetAudience: string;
  // Step 2
  designType: DesignType | null;
  outputFormat: OutputFormat;
  // Step 3
  colorPalette: string[];
  styleNotes: string;
  keywords: string[];
}

const initialData: WizardData = {
  brandMode: "new",
  brandName: "",
  brandDescription: "",
  industry: "",
  targetAudience: "",
  designType: null,
  outputFormat: "png",
  colorPalette: [],
  styleNotes: "",
  keywords: [],
};

type WizardStep = "brand" | "type" | "customize" | "generating" | "result";

const STEPS: WizardStep[] = ["brand", "type", "customize", "generating", "result"];

const stepLabels: Record<WizardStep, string> = {
  brand: "Marka Bilgileri",
  type: "Tasarım Türü",
  customize: "Özelleştir",
  generating: "Üretiliyor",
  result: "Sonuç",
};

export function BrandWizard({ userCredits }: { userCredits: number }) {
  const [step, setStep] = useState<WizardStep>("brand");
  const [data, setData] = useState<WizardData>(initialData);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const router = useRouter();

  const currentStepIndex = STEPS.indexOf(step);
  const progressValue = (currentStepIndex / (STEPS.length - 1)) * 100;

  const updateData = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
    }
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) {
      setStep(STEPS[idx - 1]);
    }
  };

  const handleGenerate = async () => {
    if (!data.designType) return;

    setStep("generating");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designType: data.designType,
          brandName: data.brandName,
          brandDescription: data.brandDescription || undefined,
          industry: data.industry || undefined,
          targetAudience: data.targetAudience || undefined,
          colorPalette: data.colorPalette.length > 0 ? data.colorPalette : undefined,
          styleNotes: data.styleNotes || undefined,
          keywords: data.keywords.length > 0 ? data.keywords : undefined,
          outputFormat: data.outputFormat,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Üretim başarısız",
          description: result.error ?? "Bir hata oluştu",
          variant: "error",
        });
        setStep("customize");
        return;
      }

      setResultUrl(result.outputUrl);
      setGenerationId(result.generationId);
      setStep("result");

      toast({
        title: "Tasarım hazır!",
        description: `${result.creditsUsed} kredi kullanıldı.`,
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Bağlantı hatası",
        description: "Lütfen tekrar deneyin.",
        variant: "error",
      });
      setStep("customize");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      {step !== "result" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.filter((s) => s !== "generating" && s !== "result").map((s, i) => (
              <span
                key={s}
                className={`text-xs font-medium transition-colors ${
                  s === step || STEPS.indexOf(step) > STEPS.indexOf(s)
                    ? "text-brand-orange"
                    : "text-muted-foreground"
                }`}
              >
                {stepLabels[s]}
              </span>
            ))}
          </div>
          <Progress value={Math.min(progressValue, 75)} />
        </div>
      )}

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {step === "brand" && (
            <StepBrandInfo
              data={data}
              onChange={updateData}
              onNext={goNext}
              credits={userCredits}
            />
          )}

          {step === "type" && (
            <StepDesignType
              data={data}
              onChange={updateData}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === "customize" && (
            <StepCustomize
              data={data}
              onChange={updateData}
              onGenerate={handleGenerate}
              onBack={goBack}
              credits={userCredits}
            />
          )}

          {step === "generating" && <GenerationProgress designType={data.designType} />}

          {step === "result" && resultUrl && (
            <GenerationResult
              outputUrl={resultUrl}
              generationId={generationId!}
              data={data}
              onNewDesign={() => {
                setData(initialData);
                setResultUrl(null);
                setGenerationId(null);
                setStep("brand");
              }}
              onGoGallery={() => router.push("/dashboard/galeri")}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
