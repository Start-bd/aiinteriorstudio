import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Image, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

// Floating particle component
const FloatingParticle = ({ 
  size, 
  left, 
  top, 
  delay, 
  duration 
}: { 
  size: number; 
  left: string; 
  top: string; 
  delay: number; 
  duration: number;
}) => (
  <div
    className="absolute rounded-full bg-primary/20"
    style={{
      width: size,
      height: size,
      left,
      top,
      animation: `float ${duration}s ease-in-out ${delay}s infinite`,
    }}
  />
);

const HeroSection = () => {
  // Generate random particles
  const particles = [
    { size: 4, left: '10%', top: '20%', delay: 0, duration: 6 },
    { size: 6, left: '20%', top: '60%', delay: 1, duration: 8 },
    { size: 3, left: '30%', top: '30%', delay: 2, duration: 7 },
    { size: 5, left: '40%', top: '80%', delay: 0.5, duration: 9 },
    { size: 4, left: '50%', top: '15%', delay: 1.5, duration: 6 },
    { size: 7, left: '60%', top: '50%', delay: 2.5, duration: 8 },
    { size: 3, left: '70%', top: '70%', delay: 0, duration: 7 },
    { size: 5, left: '80%', top: '25%', delay: 1, duration: 9 },
    { size: 4, left: '85%', top: '85%', delay: 2, duration: 6 },
    { size: 6, left: '15%', top: '45%', delay: 0.5, duration: 8 },
    { size: 3, left: '75%', top: '40%', delay: 1.5, duration: 7 },
    { size: 5, left: '25%', top: '75%', delay: 2.5, duration: 9 },
    { size: 4, left: '55%', top: '35%', delay: 0, duration: 6 },
    { size: 6, left: '45%', top: '55%', delay: 1, duration: 8 },
    { size: 3, left: '90%', top: '10%', delay: 2, duration: 7 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-[hsl(20,15%,8%)] to-background">
      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <FloatingParticle key={i} {...particle} />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative glow elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        {/* Gold accent glow */}
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-[hsl(38,90%,55%)]/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-[hsl(38,90%,55%)]/8 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
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
