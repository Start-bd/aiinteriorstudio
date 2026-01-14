import { Palette, Zap, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Palette,
    title: "8+ Professional Styles",
    description: "From modern minimalism to luxury bohemian — get designs that match your vision in seconds.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "No waiting. Upload a photo, pick a style, and get photorealistic designs in under 30 seconds.",
  },
  {
    icon: DollarSign,
    title: "Free to Start",
    description: "Start redesigning for free. Upgrade only when you need HD downloads and commercial rights.",
  },
];

const WhySection = () => {
  return (
    <section className="py-24 bg-muted/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-4 mb-6">
            Why <span className="text-gradient-gold">Interior of AI</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The fastest way to visualize your dream space
          </p>
        </div>

        {/* Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-primary/15 transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Differentiator Text */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-8 py-6">
            <p className="text-lg text-foreground leading-relaxed">
              Unlike other tools, we're not just an image generator. We're your{" "}
              <span className="text-primary font-semibold">AI design assistant</span> — helping you 
              visualize, decide, and take action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
