import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Image, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-[hsl(20,15%,8%)] to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        {/* Gold accent glow */}
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-[hsl(38,90%,55%)]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-[hsl(38,90%,55%)]/8 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="animate-fade-up opacity-0 delay-100">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/30 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="animate-fade-up opacity-0 delay-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight text-foreground">
            AI Interior Design
            <br />
            <span className="text-gradient-gold">Inspiration</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up opacity-0 delay-300 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
            Professional designs in 30 seconds
          </p>

          {/* CTA Button */}
          <div className="animate-fade-up opacity-0 delay-400 pt-4">
            <Link to="/generate">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-8 py-6 h-auto rounded-full shadow-gold transition-all duration-300 hover:scale-105"
              >
                Generate Your Dream Room
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-up opacity-0 delay-500 flex flex-wrap justify-center gap-6 md:gap-10 pt-8">
            <div className="flex items-center gap-2 text-foreground">
              <Image className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-xl">2.5M+</span>
              <span className="text-muted-foreground text-sm">Designs</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-xl">150K+</span>
              <span className="text-muted-foreground text-sm">Users</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Instagram className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-xl">433K</span>
              <span className="text-muted-foreground text-sm">Instagram</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="animate-fade-up opacity-0 delay-600 flex flex-wrap justify-center gap-4 md:gap-6 pt-4">
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <span className="text-primary">✓</span> Free to Start
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <span className="text-primary">✓</span> No Credit Card
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <span className="text-primary">✓</span> 30 Sec Results
            </span>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade - removed since hero now matches background */}
    </section>
  );
};

export default HeroSection;
