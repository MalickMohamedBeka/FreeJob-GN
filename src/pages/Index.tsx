import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import Stats from "@/components/landing/Stats";
import CTASection from "@/components/landing/CTASection";
import PartnersCarousel from "@/components/landing/PartnersCarousel";
import TeamShowcase from "@/components/landing/TeamShowcase";
import PaymentMethods from "@/components/landing/PaymentMethods";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <TeamShowcase />
        <Stats />
        <PartnersCarousel />
        <PaymentMethods />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
