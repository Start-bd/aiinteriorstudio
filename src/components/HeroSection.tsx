import { Button } from "@/components/ui/button";
import { Instagram, ArrowRight, Users, Sparkles, Globe } from "lucide-react";
import heroImage from "@/assets/hero-interior.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="AI-generated luxury interior design with dramatic lighting"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="animate-fade-up opacity-0 delay-100">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              AI-Powered Design Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="animate-fade-up opacity-0 delay-200 text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight">
            The Future of{" "}
            <span className="text-gradient-gold">Interior Design</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up opacity-0 delay-300 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
            Design smarter spaces with artificial intelligence. Explore AI-generated interiors, home decor concepts, and luxury living ideas.
          </p>

          {/* Social Proof Stats */}
          <div className="animate-fade-up opacity-0 delay-350 flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <Instagram className="w-5 h-5 text-gold" />
              <span className="font-display font-bold text-lg">447K</span>
              <span className="text-muted-foreground text-sm">Followers</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="font-display font-bold text-lg">2.5M+</span>
              <span className="text-muted-foreground text-sm">Designs</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <Globe className="w-5 h-5 text-gold" />
              <span className="font-display font-bold text-lg">180+</span>
              <span className="text-muted-foreground text-sm">Countries</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="animate-fade-up opacity-0 delay-400 flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href="#ai-generator">
              <Button variant="hero" size="lg" className="group">
                Explore AI Interiors
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <a href="https://www.instagram.com/interiorofai?igsh=bWFyb3VrZXA1ejQ4" target="_blank" rel="noopener noreferrer">
              <Button variant="hero-secondary" size="lg" className="group">
                <Instagram className="mr-2 h-5 w-5" />
                Follow @interiorofai
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-up opacity-0 delay-600">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
