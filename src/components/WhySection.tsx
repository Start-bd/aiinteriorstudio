import { Zap, Star, Globe, Rocket } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "AI-First",
    description: "100% artificial intelligence–driven design content",
  },
  {
    icon: Star,
    title: "Curated Excellence",
    description: "Only premium-quality visuals and concepts make the cut",
  },
  {
    icon: Globe,
    title: "Global Inspiration",
    description: "Styles influenced by cultures and trends worldwide",
  },
  {
    icon: Rocket,
    title: "Future-Ready",
    description: "Built for creators, brands, designers, and innovators",
  },
];

const WhySection = () => {
  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold uppercase tracking-widest text-sm font-medium">Why Us</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6">
            Why Interior of AI?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            More than inspiration — it's the future of interior design media.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6 group-hover:from-gold/30 group-hover:to-gold/15 transition-all duration-300 group-hover:scale-110">
                <value.icon className="w-10 h-10 text-gold" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
