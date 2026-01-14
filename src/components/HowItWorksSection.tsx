import { Camera, Palette, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Camera,
    number: "1",
    headline: "Upload",
    description: "Take or upload a photo of any room — bedroom, living room, kitchen, or office",
  },
  {
    icon: Palette,
    number: "2",
    headline: "Choose Style",
    description: "Select from 8+ professional design styles: Modern, Minimalist, Scandinavian, Luxury, and more",
  },
  {
    icon: Sparkles,
    number: "3",
    headline: "Get Designs",
    description: "Receive photorealistic room makeovers in 30 seconds. Save, compare, and download.",
  },
];

const HowItWorksSection = () => {
  const scrollToGenerator = () => {
    const element = document.getElementById("ai-generator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            How <span className="text-gradient-gold">Interior of AI</span> Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform any room in 3 simple steps
          </p>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="group bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardContent className="p-8 text-center">
                {/* Icon */}
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                  <step.icon className="w-8 h-8" />
                </div>

                {/* Headline */}
                <h3 className="text-xl md:text-2xl font-display font-bold mb-3 text-foreground">
                  {step.number}. {step.headline}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={scrollToGenerator}
            variant="gold"
            size="lg"
            className="text-lg px-8 py-6 font-semibold"
          >
            Try It Free Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
