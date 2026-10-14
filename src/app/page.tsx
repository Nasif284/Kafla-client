import type { Metadata } from "next";
import { LandingNavbar } from "@/src/features/landing/components/LandingNavbar";
import { HeroSection } from "@/src/features/landing/components/HeroSection";
import { ValueMetricsBar } from "@/src/features/landing/components/ValueMetricsBar";
import { RouteMapSpotlight } from "@/src/features/landing/components/RouteMapSpotlight";
import { BentoFeaturesSection } from "@/src/features/landing/components/BentoFeaturesSection";
import { HowItWorksSection } from "@/src/features/landing/components/HowItWorksSection";
import { ComparisonSection } from "@/src/features/landing/components/ComparisonSection";
import { FAQSection } from "@/src/features/landing/components/FAQSection";
import { LandingCTA } from "@/src/features/landing/components/LandingCTA";
import { LandingFooter } from "@/src/features/landing/components/LandingFooter";

export const metadata: Metadata = {
  title: "Kafla | The Simple Collaborative Group Trip App",
  description:
    "Plan day-by-day itineraries with AI, see your route on Google Maps, split expenses with automated debt minimization, and collaborate with your travel group in real time.",
  keywords: [
    "group trip planner",
    "trip itinerary Google Maps",
    "split travel expenses",
    "debt minimization",
    "group travel checklist",
    "AI trip generator",
    "Kafla",
  ],
  openGraph: {
    title: "Kafla | The Simple Collaborative Group Trip App",
    description:
      "Ditch messy chat groups and confusing spreadsheets. Plan routes, split expenses, and travel together with Kafla.",
    type: "website",
    locale: "en_US",
    siteName: "Kafla",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kafla | The Simple Collaborative Group Trip App",
    description:
      "All-in-one group travel hub: AI itineraries, Google Maps route pacing, simplified expense splitting, and squad video calls.",
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Kafla",
    applicationCategory: "TravelApplication",
    description:
      "A collaborative workspace for group travel squads featuring AI itineraries, Google Maps route pacing, debt-minimized expense splitting, luggage checklists, and video calls.",
    operatingSystem: "All modern web browsers",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  return (
    <div className="min-h-screen bg-[#f7faf6] flex flex-col text-[#181d1a] selection:bg-[#a0f3d4] selection:text-[#005440]">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LandingNavbar />

      <main className="flex-1">
        <HeroSection />
        <ValueMetricsBar />
        <RouteMapSpotlight />
        <BentoFeaturesSection />
        <HowItWorksSection />
        <ComparisonSection />
        <FAQSection />
        <LandingCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
