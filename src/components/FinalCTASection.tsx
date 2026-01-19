import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/useScrollAnimation";

const trustBadges = [
  "2.5M+ designs created this year",
  "Join 150K+ users this month",
  "431K+ Instagram followers",
];

const FinalCTASection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();
  
  return (
    <section ref={sectionRef} className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Background with gradient and gold accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-[hsl(35,30%,8%)] to-background" />
      
      {/* Gold border glow effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Decorative elements - smaller on mobile */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mb-4 sm:mb-6 px-2 ${getAnimationClasses(isVisible)}`}>
            Ready to{" "}
            <span className="text-gradient-gold">Transform Your Space</span>?
          </h2>

          {/* Subheadline */}
          <p className={`text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-4 ${getAnimationClasses(isVisible)}`} style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}>
            Upload a room photo and get AI interior designs in 30 seconds.{" "}
            <span className="text-foreground font-medium">Free to start.</span>{" "}
            No credit card required.
          </p>

          {/* Primary CTA Button - Full width on mobile */}
          <div className={`mb-8 sm:mb-10 px-4 sm:px-0 ${getAnimationClasses(isVisible)}`} style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
            <Link to="/generate" className="block sm:inline-block">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary via-amber-500 to-primary hover:from-primary/90 hover:via-amber-500/90 hover:to-primary/90 text-primary-foreground font-bold text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 min-h-[52px] rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Start Free Redesign
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Badges - Stack on mobile */}
          <div className={`flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 px-4 ${getAnimationClasses(isVisible)}`} style={{ transitionDelay: isVisible ? '300ms' : '0ms' }}>
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
