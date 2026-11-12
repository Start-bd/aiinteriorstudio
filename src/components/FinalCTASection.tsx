import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/useScrollAnimation";

const trustBadges = [
  "Verified: designs created this year",
  "Verified: users this month",
  "Verified: Instagram followers",
];

const FinalCTASection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
      {/* Background with gradient and gold accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-[hsl(25,10%,6%)] to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

      {/* Gold border glow effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Decorative elements - smaller on mobile */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gold/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gold/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mt-4 mb-4 sm:mb-6 text-white leading-tight ${getAnimationClasses(isVisible)}`} style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}>
            Ready to <span className="text-gradient-gold">Transform Your Space</span>?
          </h2>

          {/* Subheadline */}
          <p
            className={`text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-8 sm:mb-10 px-4 ${getAnimationClasses(isVisible)}`}
            style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
          >
            Upload a room photo and get AI interior designs in 30 seconds.
            <span className="text-white/80 font-medium"> Free to start.</span>
            <span className="text-white/50"> No credit card required.</span>
          </p>

          {/* Primary CTA Button - Full width on mobile */}
          <div
            className={`mb-8 sm:mb-10 px-4 sm:px-0 ${getAnimationClasses(isVisible)}`}
            style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
          >
            <Link to="/generate" className="block sm:inline-block">
              <Button
                size="lg"
                className="btn-gold w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 h-auto min-h-[56px] rounded-full"
              >
                Start Free Redesign
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div
            className={`flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 px-4 ${getAnimationClasses(isVisible)}`}
            style={{ transitionDelay: isVisible ? "450ms" : "0ms" }}
          >
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 text-white/50"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base text-white/50">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
