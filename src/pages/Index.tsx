import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SocialProofSection from "@/components/SocialProofSection";
import AboutSection from "@/components/AboutSection";
import EcosystemSection from "@/components/EcosystemSection";
import GallerySection from "@/components/GallerySection";
import WhySection from "@/components/WhySection";
import WhoUsesSection from "@/components/WhoUsesSection";
import TransformationsSection from "@/components/TransformationsSection";
import InstagramSection from "@/components/InstagramSection";
import NewsletterSection from "@/components/NewsletterSection";
import AboutPreviewSection from "@/components/AboutPreviewSection";
import FinalCTASection from "@/components/FinalCTASection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import { AIGenerator } from "@/components/AIGenerator";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const location = useLocation();

  // Handle smooth scroll to anchor on page load or hash change
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location.hash]);
  return (
    <>
      <Helmet>
        <title>Interior of AI | AI Interior Design & Decor Ideas</title>
        <link rel="canonical" href="https://interiorofai.com/" />
        <meta
          name="description"
          content="Discover AI-generated interior design, home decor ideas, and future living concepts. Interior of AI is the global hub for AI-powered interiors."
        />
        <meta property="og:title" content="Interior of AI | AI Interior Design & Decor Ideas" />
        <meta
          property="og:description"
          content="Discover AI-generated interior design, home decor ideas, and future living concepts. Interior of AI is the global hub for AI-powered interiors."
        />
        <meta name="keywords" content="AI interior design, AI home decor, artificial intelligence design, future living, luxury interiors, AI generated interiors" />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <HeroSection />
        <HowItWorksSection />
        <SocialProofSection />
        <section id="about">
          <AboutSection />
        </section>
        <section id="ecosystem">
          <EcosystemSection />
        </section>
        <section id="gallery">
          <GallerySection />
        </section>
        <section id="ai-generator" className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Create Your <span className="text-gradient-gold">Dream Room</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload a photo and let AI redesign your space in seconds
              </p>
            </div>
            <AIGenerator />
          </div>
        </section>
        <WhySection />
        <WhoUsesSection />
        <TransformationsSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <InstagramSection />
        <section id="newsletter">
          <NewsletterSection />
        </section>
        <ShopTheLookSection />
        <FinalCTASection />
        <AboutPreviewSection />
        <Footer />
      </main>
      <ChatBot />
      <ExitIntentPopup />
    </>
  );
};

export default Index;
