import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 mesh-gradient">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center shadow-lg shadow-brand-orange/30 group-hover:scale-110 transition-transform">
          <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl">
          <span className="text-brand-cream">Kronos</span>{" "}
          <span className="gradient-text-orange">Dijital</span>
        </span>
      </Link>

      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-brand-surface border border-border shadow-2xl rounded-2xl",
            headerTitle: "text-foreground font-bold",
            headerSubtitle: "text-muted-foreground",
            formButtonPrimary:
              "bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl transition-all hover:scale-105",
            formFieldInput:
              "bg-brand-elevated border-border text-foreground rounded-xl focus:ring-brand-orange/50 focus:border-brand-orange/50",
            formFieldLabel: "text-muted-foreground",
            footerActionLink: "text-brand-orange hover:text-brand-orange-hover",
            dividerText: "text-muted-foreground",
            socialButtonsBlockButton:
              "border-border bg-brand-elevated hover:bg-brand-surface text-foreground rounded-xl",
            socialButtonsBlockButtonText: "text-foreground font-medium",
          },
        }}
      />
    </div>
  );
}
