"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { DESIGN_TYPE_LABELS, DESIGN_TYPE_ICONS } from "@/lib/prompts/generator";
import type { DesignType } from "@/types/database";

const LOADING_MESSAGES = [
  "Marka bilgilerin analiz ediliyor...",
  "Yaratıcı prompt hazırlanıyor...",
  "Yapay zeka tasarımı şekillendiriyor...",
  "Renk paleti ve stiller uygulanıyor...",
  "Son rötuşlar yapılıyor...",
  "Az kaldı, tasarımın neredeyse hazır...",
];

export function GenerationProgress({ designType }: { designType: DesignType | null }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 8, 90));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      {/* Animated icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center mb-6 shadow-xl shadow-brand-orange/30"
      >
        {designType ? (
          <span className="text-3xl">{DESIGN_TYPE_ICONS[designType]}</span>
        ) : (
          <Loader2 className="w-10 h-10 text-white" />
        )}
      </motion.div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        {designType ? `${DESIGN_TYPE_LABELS[designType]} Üretiliyor` : "Üretiliyor"}
      </h2>

      {/* Animated message */}
      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-muted-foreground mb-8 h-6"
      >
        {LOADING_MESSAGES[messageIndex]}
      </motion.p>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-2 rounded-full bg-brand-elevated overflow-hidden mb-3">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-orange to-brand-gold rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>

      {/* Hint */}
      <div className="mt-10 p-4 rounded-xl bg-brand-surface/50 border border-border max-w-sm">
        <p className="text-xs text-muted-foreground">
          💡 <strong className="text-foreground">İpucu:</strong> Tasarımlar düz format çıktısı
          olarak üretilir — mockup, el veya ürün fotoğrafı içermez.
        </p>
      </div>
    </div>
  );
}
