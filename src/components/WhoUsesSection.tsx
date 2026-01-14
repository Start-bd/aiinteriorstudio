import { Home, Palette, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">Our Users</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-4 mb-6">
            Who Uses <span className="text-gradient-gold">Interior of AI</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trusted by homeowners, professionals, and agencies worldwide
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {personas.map((persona, index) => (
            <Card 
              key={index} 
              className="group bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col"
            >
              <CardContent className="p-8 flex flex-col h-full">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-primary/15 transition-all duration-300 group-hover:scale-110">
                  <persona.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-display font-bold mb-3 text-foreground">
                  {persona.title}
                </h3>

                {/* Quote */}
                <p className="text-muted-foreground italic mb-6 border-l-2 border-primary/50 pl-4">
                  "{persona.quote}"
                </p>

                {/* Benefits */}
                <ul className="space-y-3 flex-grow">
                  {persona.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link to="/generate">
            <Button variant="gold" size="lg" className="text-lg px-8 py-6 font-semibold group">
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
