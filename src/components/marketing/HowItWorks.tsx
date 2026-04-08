"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Wand2, Download, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Markanı Tanıt",
    description:
      "Marka adını, sektörünü, hedef kitlenizi ve istediğiniz stili girin. Sıfırdan başlayabilir ya da var olan markanızı tanıtabilirsiniz.",
    color: "brand-orange",
    details: ["Marka adı ve sloganu", "Sektör ve hedef kitle", "Renk tercihleri", "Stil notları"],
  },
  {
    number: "02",
    icon: Wand2,
    title: "Tasarım Türünü Seç",
    description:
      "Logo, kartvizit, afiş, broşür, sosyal medya postu gibi 14+ kategoriden birini seçin. Yapay zeka gerisini halleder.",
    color: "brand-violet",
    details: ["14+ tasarım kategorisi", "Özelleştirme seçenekleri", "Boyut ve format ayarı", "Anlık önizleme"],
  },
  {
    number: "03",
    icon: Download,
    title: "İndir ve Kullan",
    description:
      "Saniyeler içinde profesyonel düz tasarım çıktınız hazır. PNG, JPG, PDF veya SVG formatında indirin, hemen kullanmaya başlayın.",
    color: "brand-gold",
    details: ["PNG / JPG / PDF / SVG", "Baskıya hazır kalite", "Galerinize otomatik kayıt", "Sınırsız indirme"],
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="nasil-calisir" className="py-24 lg:py-32 relative" ref={ref}>
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-surface/30 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-semibold text-brand-violet bg-brand-violet/10 px-4 py-1.5 rounded-full mb-4">
            Nasıl Çalışır?
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-brand-cream">3 adımda</span>{" "}
            <span className="gradient-text">profesyonel marka</span>
          </h2>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground">
            Tasarım bilgisi gerektirmez. Markanızı tarif edin, yapay zeka sizin için çalışsın.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-brand-orange via-brand-violet to-brand-gold" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              {/* Step number + icon */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`relative w-14 h-14 rounded-2xl bg-${step.color}/15 border border-${step.color}/30 flex items-center justify-center`}
                >
                  <step.icon className={`w-7 h-7 text-${step.color}`} />
                  <span
                    className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-${step.color} text-white text-[10px] font-bold flex items-center justify-center`}
                  >
                    {i + 1}
                  </span>
                </div>
                <div>
                  <span className="text-4xl font-black text-white/5">{step.number}</span>
                </div>
              </div>

              {/* Content card */}
              <div className="p-6 rounded-2xl border border-border bg-brand-surface/50 hover:bg-brand-surface transition-colors">
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">{step.description}</p>

                {/* Detail list */}
                <ul className="space-y-2">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className={`w-3.5 h-3.5 text-${step.color} shrink-0`} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
