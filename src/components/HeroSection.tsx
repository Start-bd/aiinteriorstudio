import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Image, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#7C3AED] via-[#9333EA] to-[#EC4899]">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="animate-fade-up opacity-0 delay-100">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="animate-fade-up opacity-0 delay-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight text-white">
            AI Interior Design
            <br />
            <span className="text-white/90">Inspiration</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up opacity-0 delay-300 text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light">
            Professional designs in 30 seconds
          </p>

          {/* CTA Button */}
          <div className="animate-fade-up opacity-0 delay-400 pt-4">
            <Link to="/generate">
              <Button 
                size="lg" 
                className="bg-white text-[#7C3AED] hover:bg-white/90 font-semibold text-lg px-8 py-6 h-auto rounded-full shadow-2xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-black/30"
              >
                Generate Your Dream Room
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-up opacity-0 delay-500 flex flex-wrap justify-center gap-6 md:gap-10 pt-8">
            <div className="flex items-center gap-2 text-white">
              <Image className="w-5 h-5 text-white/70" />
              <span className="font-display font-bold text-xl">2.5M+</span>
              <span className="text-white/70 text-sm">Designs</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-white/70" />
              <span className="font-display font-bold text-xl">150K+</span>
              <span className="text-white/70 text-sm">Users</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Instagram className="w-5 h-5 text-white/70" />
              <span className="font-display font-bold text-xl">433K</span>
              <span className="text-white/70 text-sm">Instagram</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="animate-fade-up opacity-0 delay-600 flex flex-wrap justify-center gap-4 md:gap-6 pt-4">
            <span className="text-white/80 text-sm flex items-center gap-1.5">
              <span className="text-green-300">✓</span> Free to Start
            </span>
            <span className="text-white/80 text-sm flex items-center gap-1.5">
              <span className="text-green-300">✓</span> No Credit Card
            </span>
            <span className="text-white/80 text-sm flex items-center gap-1.5">
              <span className="text-green-300">✓</span> 30 Sec Results
            </span>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
