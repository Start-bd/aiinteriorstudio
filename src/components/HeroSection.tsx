import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Image, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useParallax";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const { slow, medium, fast } = useParallax();
  const isMobile = useIsMobile();

  // Generate random particles
  const particles = [
    { size: 4, left: '10%', top: '20%', delay: 0, duration: 6, speed: 'slow' },
    { size: 6, left: '20%', top: '60%', delay: 1, duration: 8, speed: 'medium' },
    { size: 3, left: '30%', top: '30%', delay: 2, duration: 7, speed: 'fast' },
    { size: 5, left: '40%', top: '80%', delay: 0.5, duration: 9, speed: 'slow' },
    { size: 4, left: '50%', top: '15%', delay: 1.5, duration: 6, speed: 'medium' },
    { size: 7, left: '60%', top: '50%', delay: 2.5, duration: 8, speed: 'fast' },
    { size: 3, left: '70%', top: '70%', delay: 0, duration: 7, speed: 'slow' },
    { size: 5, left: '80%', top: '25%', delay: 1, duration: 9, speed: 'medium' },
    { size: 4, left: '85%', top: '85%', delay: 2, duration: 6, speed: 'fast' },
    { size: 6, left: '15%', top: '45%', delay: 0.5, duration: 8, speed: 'slow' },
    { size: 3, left: '75%', top: '40%', delay: 1.5, duration: 7, speed: 'medium' },
    { size: 5, left: '25%', top: '75%', delay: 2.5, duration: 9, speed: 'fast' },
    { size: 4, left: '55%', top: '35%', delay: 0, duration: 6, speed: 'slow' },
    { size: 6, left: '45%', top: '55%', delay: 1, duration: 8, speed: 'medium' },
    { size: 3, left: '90%', top: '10%', delay: 2, duration: 7, speed: 'fast' },
  ];

  const getParallaxOffset = (speed: string) => {
    switch (speed) {
      case 'slow': return slow;
      case 'medium': return medium;
      case 'fast': return fast;
      default: return medium;
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-[hsl(20,15%,8%)] to-background">
      {/* Animated floating particles with parallax — hidden on mobile for performance */}
      {!isMobile && <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.left,
              top: particle.top,
              animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
              transform: `translateY(${getParallaxOffset(particle.speed)}px)`,
            }}
          />
        ))}
      </div>}

      {/* Grid pattern overlay with slow parallax */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          transform: `translateY(${slow * 0.5}px)`,
        }}
      />

      {/* Decorative glow elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" 
          style={{ transform: `translateY(${medium}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse-slow" 
          style={{ animationDelay: '2s', transform: `translateY(${slow}px)` }} 
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" 
          style={{ transform: `translate(-50%, calc(-50% + ${fast * 0.3}px))` }}
        />
        {/* Gold accent glow */}
        <div 
          className="absolute top-20 right-1/4 w-64 h-64 bg-[hsl(38,90%,55%)]/10 rounded-full blur-[100px] animate-pulse-slow" 
          style={{ animationDelay: '1s', transform: `translateY(${fast}px)` }} 
        />
        <div 
          className="absolute bottom-40 left-1/3 w-72 h-72 bg-[hsl(38,90%,55%)]/8 rounded-full blur-[120px] animate-pulse-slow" 
          style={{ animationDelay: '3s', transform: `translateY(${medium}px)` }} 
        />
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
          <h1 className="animate-fade-up opacity-0 delay-200 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight text-foreground">
            <span className="block sm:inline">Upload Your Room Photo.</span>
            <br className="hidden sm:block" />
            <span className="block sm:inline text-gradient-gold">Get AI Interior Designs in 30 Seconds.</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up opacity-0 delay-300 text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-light px-2">
            Perfect for homeowners, interior designers, and real estate professionals who want instant, professional room makeovers.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-up opacity-0 delay-400 pt-4 px-4 sm:px-0">
            <Link to="/generate" className="block sm:inline-block">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto min-h-[44px] rounded-full shadow-gold transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Generate Your Dream Room
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust statement with urgency */}
          <p className="animate-fade-up opacity-0 delay-500 text-muted-foreground text-xs sm:text-sm px-4">
            No credit card required • 2.5M+ designs created • <span className="text-primary font-medium">Join 150K+ users this month</span>
          </p>

          {/* Stats - Horizontal scroll on mobile */}
          <div className="animate-fade-up opacity-0 delay-600 pt-6 sm:pt-8 w-full">
            <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 md:gap-10 overflow-x-auto pb-2 px-4 sm:px-0 scrollbar-hide">
              <div className="flex items-center gap-2 text-foreground flex-shrink-0">
                <Image className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                <span className="font-display font-bold text-lg sm:text-xl">2.5M+</span>
                <span className="text-muted-foreground text-xs sm:text-sm">Designs</span>
              </div>
              <div className="flex items-center gap-2 text-foreground flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                <span className="font-display font-bold text-lg sm:text-xl">150K+</span>
                <span className="text-muted-foreground text-xs sm:text-sm">Users</span>
              </div>
              <div className="flex items-center gap-2 text-foreground flex-shrink-0">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                <span className="font-display font-bold text-lg sm:text-xl">431K+</span>
                <span className="text-muted-foreground text-xs sm:text-sm">Instagram</span>
              </div>
            </div>
          </div>

          {/* Trust badges - Stack on mobile */}
          <div className="animate-fade-up opacity-0 delay-700 flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 pt-4 px-4">
            <span className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1.5">
              <span className="text-primary">✓</span> Free to Start
            </span>
            <span className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1.5">
              <span className="text-primary">✓</span> No Credit Card
            </span>
            <span className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1.5">
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
