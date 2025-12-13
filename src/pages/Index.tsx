import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SocialProofSection from "@/components/SocialProofSection";
import AboutSection from "@/components/AboutSection";
import EcosystemSection from "@/components/EcosystemSection";
import GallerySection from "@/components/GallerySection";
import WhySection from "@/components/WhySection";
import InstagramSection from "@/components/InstagramSection";
import NewsletterSection from "@/components/NewsletterSection";
import AboutPreviewSection from "@/components/AboutPreviewSection";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Interior of AI | AI Interior Design & Home Decor Inspiration</title>
        <meta
          name="description"
          content="Discover AI-generated interior design, home decor ideas, and future living concepts. Interior of AI is the global hub for AI-powered interiors."
        />
        <meta property="og:title" content="Interior of AI | AI Interior Design & Home Decor Inspiration" />
        <meta
          property="og:description"
          content="Discover AI-generated interior design, home decor ideas, and future living concepts. Interior of AI is the global hub for AI-powered interiors."
        />
        <meta name="keywords" content="AI interior design, AI home decor, artificial intelligence design, future living, luxury interiors, AI generated interiors" />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <HeroSection />
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
        <WhySection />
        <InstagramSection />
        <section id="newsletter">
          <NewsletterSection />
        </section>
        <AboutPreviewSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
