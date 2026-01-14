import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const trustBadges = [
  "2.5M+ designs created",
  "150K+ happy users",
  "433K Instagram followers",
];

const FinalCTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with gradient and gold accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-[hsl(35,30%,8%)] to-background" />
      
      {/* Gold border glow effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mb-6">
            Ready to{" "}
            <span className="text-gradient-gold">Transform Your Space</span>?
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload a room photo and get AI interior designs in 30 seconds.{" "}
            <span className="text-foreground font-medium">Free to start.</span>{" "}
            No credit card required.
          </p>

          {/* Primary CTA Button */}
          <div className="mb-10">
            <Link to="/generate">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary via-amber-500 to-primary hover:from-primary/90 hover:via-amber-500/90 hover:to-primary/90 text-primary-foreground font-bold text-lg px-10 py-7 rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                Start Free Redesign
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm md:text-base font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
