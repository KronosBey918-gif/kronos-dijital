"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Palette,
  Download,
  Globe2,
  Shield,
  Zap,
  ImageDown,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Destekli Tasarım",
    description:
      "FLUX.1-dev modeli ile sektörün en iyi görüntü üretim kalitesini elde edin. Her çıktı profesyonel düz tasarım standardında.",
    color: "from-brand-orange to-brand-gold",
    glow: "shadow-brand-orange/20",
  },
  {
    icon: Palette,
    title: "Marka Profili Sistemi",
    description:
      "Markanızı bir kez tanıtın, tüm tasarımlarınız tutarlı renk paleti ve stil ile otomatik oluşturulsun.",
    color: "from-brand-violet to-purple-600",
    glow: "shadow-brand-violet/20",
  },
  {
    icon: Zap,
    title: "Saniyeler İçinde Üretim",
    description:
      "Karmaşık tasarım yazılımlarına gerek yok. Markanızı tanıtın, 30 saniye içinde profesyonel çıktı alın.",
    color: "from-brand-gold to-yellow-500",
    glow: "shadow-brand-gold/20",
  },
  {
    icon: ImageDown,
    title: "Çoklu Format Desteği",
    description:
      "PNG (şeffaf), JPG, PDF ve SVG formatlarında indirin. Baskıya hazır, sosyal medyaya hazır çıktılar.",
    color: "from-green-500 to-emerald-400",
    glow: "shadow-green-500/20",
  },
  {
    icon: Globe2,
    title: "14+ Tasarım Kategorisi",
    description:
      "Logo, kartvizit, afiş, broşür, menü, davetiye, ambalaj ve daha fazlası. İhtiyacınız olan her şey tek platformda.",
    color: "from-blue-500 to-cyan-400",
    glow: "shadow-blue-500/20",
  },
  {
    icon: Users,
    title: "Topluluk Galerisi",
    description:
      "Diğer kullanıcıların tasarımlarından ilham alın, kendi çalışmalarınızı paylaşın, topluluğa katılın.",
    color: "from-pink-500 to-rose-400",
    glow: "shadow-pink-500/20",
  },
  {
    icon: Shield,
    title: "Güvenli ve Özel",
    description:
      "Tasarımlarınız tamamen size özel. Verileriniz şifreli olarak saklanır, kimseyle paylaşılmaz.",
    color: "from-brand-orange to-red-500",
    glow: "shadow-brand-orange/20",
  },
  {
    icon: Download,
    title: "Sınırsız İndirme",
    description:
      "Ürettiğiniz tüm tasarımları istediğiniz zaman geri dönüp indirebilirsiniz. Geçmişiniz her zaman güvende.",
    color: "from-brand-violet to-indigo-500",
    glow: "shadow-brand-violet/20",
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ozellikler" className="py-24 lg:py-32 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-brand-orange bg-brand-orange/10 px-4 py-1.5 rounded-full mb-4">
            Özellikler
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-brand-cream">Profesyonel tasarımın</span>
            <br />
            <span className="gradient-text">tüm araçları burada</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Kronos Dijital, markanızı oluşturmak için ihtiyacınız olan her şeyi tek çatı altında
            toplar. Yapay zeka destekli, sezgisel ve hızlı.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative p-6 rounded-2xl border border-border bg-brand-surface/50 hover:bg-brand-surface hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
