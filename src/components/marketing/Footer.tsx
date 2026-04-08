import Link from "next/link";
import { Zap, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-brand-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg">
                <span className="text-brand-cream">Kronos</span>{" "}
                <span className="gradient-text-orange">Dijital</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
              Markanı Tasarla, Güvenle Büyüt. Yapay zeka destekli profesyonel marka tasarım platformu.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-brand-orange hover:border-brand-orange/40 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Ürün</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Özellikler", href: "#ozellikler" },
                { label: "Fiyatlar", href: "#fiyatlar" },
                { label: "Nasıl Çalışır", href: "#nasil-calisir" },
                { label: "Galeri", href: "/dashboard/topluluk" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Yasal</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Gizlilik Politikası", href: "/gizlilik" },
                { label: "Kullanım Koşulları", href: "/kosullar" },
                { label: "KVKK", href: "/kvkk" },
                { label: "İletişim", href: "mailto:destek@kronosdijital.com" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kronos Dijital. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-muted-foreground">
            Türkiye&apos;de 🇹🇷 ile üretildi
          </p>
        </div>
      </div>
    </footer>
  );
}
