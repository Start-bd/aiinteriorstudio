import { Sparkles, Home, Crown, Building2 } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Interiors",
    description: "Cutting-edge artificial intelligence design concepts",
  },
  {
    icon: Home,
    title: "Home Decor",
    description: "Modern, minimal, and creative living spaces",
  },
  {
    icon: Crown,
    title: "Luxury Design",
    description: "High-end premium materials and concepts",
  },
  {
    icon: Building2,
    title: "Future Living",
    description: "Tomorrow's homes, designed today",
  },
];

const AboutSection = () => {
  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-gold uppercase tracking-widest text-sm font-medium">About Us</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6 line-glow mx-auto w-fit">
            What Is Interior of AI?
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A curated digital ecosystem focused on <span className="text-foreground font-medium">AI interior design</span>, 
            home decor, and future living concepts. We showcase how artificial intelligence is 
            transforming the way we imagine and create living spaces.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 hover-lift group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4 group-hover:from-gold/30 group-hover:to-gold/10 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
