import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Pricing } from "@/components/marketing/Pricing";
import { FAQ } from "@/components/marketing/FAQ";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-dark noise">
      <Navbar />
      <main>
        <Hero />
        <div className="section-divider" />
        <Features />
        <div className="section-divider" />
        <HowItWorks />
        <div className="section-divider" />
        <Pricing />
        <div className="section-divider" />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
