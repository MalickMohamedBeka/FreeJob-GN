import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import Features from "@/components/landing/Features";
import PlatformPreview from "@/components/landing/PlatformPreview";
import HowItWorks from "@/components/landing/HowItWorks";
import DualCTA from "@/components/landing/DualCTA";
import Testimonials from "@/components/landing/Testimonials";
import Stats from "@/components/landing/Stats";
import PartnersCarousel from "@/components/landing/PartnersCarousel";
import TeamShowcase from "@/components/landing/TeamShowcase";
import PaymentMethods from "@/components/landing/PaymentMethods";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Features />
        <PlatformPreview />
        <HowItWorks />
        <DualCTA />
        <TeamShowcase />
        <Stats />
        <PartnersCarousel />
        <PaymentMethods />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
