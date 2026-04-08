"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Kronos Dijital nasıl çalışır?",
    answer:
      "Markanızı veya tasarım isteğinizi Türkçe olarak sisteme girersiniz. Yapay zekamız bu bilgileri yüksek kaliteli İngilizce prompt'a dönüştürür ve FLUX.1-dev modeliyle profesyonel düz tasarım çıktıları üretir. Tüm çıktılar mockup içermez, doğrudan kullanıma hazır düz tasarımlardır.",
  },
  {
    question: "Kredi sistemi nasıl işliyor?",
    answer:
      "Her tasarım üretimi belirli miktarda kredi harcar (logo: 3 kredi, kartvizit: 2 kredi, sosyal medya: 1 kredi vb.). İstediğiniz zaman kredi paketi satın alabilir, paketin süre sınırı olmadığından kullandıkça tüketirsiniz.",
  },
  {
    question: "Üretilen tasarımlar gerçekten profesyonel kalitede mi?",
    answer:
      "Evet. Kronos Dijital, piyasadaki en gelişmiş görüntü üretim modellerinden FLUX.1-dev'i kullanır. Çıktılar düz tasarım standardında, vektörel görünümde ve baskıya uygun kalitededir. Her prompt, maksimum kalite için özel mühendislik uygulanmış İngilizce şablonlardan üretilir.",
  },
  {
    question: "Tasarımları başka yerlerde kullanabilir miyim?",
    answer:
      "Ürettiğiniz tüm tasarımlar size aittir. Ticari projelerinizde, sosyal medyada, baskı materyallerinde serbestçe kullanabilirsiniz.",
  },
  {
    question: "SVG/vektörel çıktı gerçekten vektörel mi?",
    answer:
      "FLUX.1-dev modeli raster görüntü üretir. SVG seçeneğinde görüntü SVG formatına dönüştürülür, ancak bu piksel tabanlı bir SVG'dir. Tamamen yeniden ölçeklenebilir vektör için çıktıyı Illustrator veya Inkscape ile vektörleştirmenizi öneririz.",
  },
  {
    question: "Verilerimin güvenliği nasıl sağlanıyor?",
    answer:
      "Tüm veriler Supabase'de şifreli olarak saklanır. Kimlik doğrulama için Clerk kullanılır. Tasarımlarınız gizlidir, paylaşmadığınız sürece başkaları göremez.",
  },
  {
    question: "İade veya para iadesi var mı?",
    answer:
      "Teknik bir sorun nedeniyle üretim tamamlanamamışsa (Replicate hatası vb.) kredi otomatik olarak iade edilir. Kullanılan krediler için para iadesi yapılmamaktadır.",
  },
  {
    question: "Fatura alabilir miyim?",
    answer:
      "Evet. Kurumsal pakette otomatik e-fatura desteği mevcuttur. Diğer paketlerde satın alma sonrasında destek@kronosdijital.com adresine bildirim yaparak fatura talep edebilirsiniz.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      className={cn(
        "w-full text-left p-5 rounded-2xl border transition-all duration-200",
        open ? "border-brand-orange/30 bg-brand-orange/5" : "border-border bg-brand-surface/50 hover:border-white/10"
      )}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-foreground">{question}</span>
        {open ? (
          <Minus className="w-4 h-4 text-brand-orange shrink-0" />
        ) : (
          <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sss" className="py-24 lg:py-32" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-semibold text-brand-orange bg-brand-orange/10 px-4 py-1.5 rounded-full mb-4">
            Sık Sorulan Sorular
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-brand-cream">Aklınızdaki</span>{" "}
            <span className="gradient-text">sorular</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Hâlâ sorunuz var mı?{" "}
            <a href="mailto:destek@kronosdijital.com" className="text-brand-orange hover:underline">
              Bize yazın
            </a>
          </p>
        </motion.div>

        {/* FAQ list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {faqs.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
