import { Home, Palette, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/useScrollAnimation";

const personas = [
  {
    icon: Home,
    title: "Homeowners & Renters",
    quote: "See design ideas before buying furniture or repainting",
    benefits: [
      "Test colors, layouts, and styles risk-free",
      "Plan your budget with visual guides",
      "Share options with family for decisions",
    ],
  },
  {
    icon: Palette,
    title: "Interior Designers",
    quote: "Generate client concepts in seconds, not hours",
    benefits: [
      "Create quick moodboards and presentations",
      "Show clients multiple style options instantly",
      "Win more projects with fast turnarounds",
    ],
  },
  {
    icon: Building2,
    title: "Real Estate & Airbnb",
    quote: "Virtually stage properties to sell or rent faster",
    benefits: [
      "Make empty rooms look inviting",
      "Increase listing appeal and bookings",
      "Stand out from competitors",
    ],
  },
];

const WhoUsesSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();
  
  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 ${getAnimationClasses(isVisible)}`}>
          <span className="text-primary uppercase tracking-widest text-xs sm:text-sm font-medium">Our Users</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            Who Uses <span className="text-gradient-gold">Interior of AI</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
            Trusted by homeowners, professionals, and agencies worldwide
          </p>
        </div>

        {/* Persona Cards - Stack vertically on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto mb-10 sm:mb-12">
          {personas.map((persona, index) => (
            <Card 
              key={index} 
              className={`group bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col ${getAnimationClasses(isVisible)}`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              <CardContent className="p-5 sm:p-6 md:p-8 flex flex-col h-full">
                {/* Icon - Touch-friendly size */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 sm:mb-6 group-hover:from-primary/30 group-hover:to-primary/15 transition-all duration-300 group-hover:scale-110">
                  <persona.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-display font-bold mb-2 sm:mb-3 text-foreground">
                  {persona.title}
                </h3>

                {/* Quote */}
                <p className="text-sm sm:text-base text-muted-foreground italic mb-4 sm:mb-6 border-l-2 border-primary/50 pl-3 sm:pl-4">
                  "{persona.quote}"
                </p>

                {/* Benefits */}
                <ul className="space-y-2 sm:space-y-3 flex-grow">
                  {persona.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button - Full width on mobile */}
        <div className={`text-center px-4 sm:px-0 ${getAnimationClasses(isVisible)}`} style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}>
          <Link to="/generate" className="block sm:inline-block">
            <Button variant="gold" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 font-semibold group min-h-[48px] active:scale-95 transition-transform">
              Start Your Free Design
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhoUsesSection;
