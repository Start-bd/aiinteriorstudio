import { Users, Globe, Zap, Building2 } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "150K+",
    label: "Users Worldwide",
  },
  {
    icon: Zap,
    value: "2.5M+",
    label: "Rooms Transformed",
  },
  {
    icon: Globe,
    value: "180+",
    label: "Countries",
  },
  {
    icon: Building2,
    value: "431K+",
    label: "Instagram Followers",
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
            Powered by AvailableView LLC
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            Interior of AI is a product of <span className="text-foreground font-medium">AvailableView LLC</span>, 
            a United States-based technology company specializing in artificial intelligence solutions for interior design.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our platform combines advanced machine learning with design expertise to deliver instant, 
            photorealistic room makeovers. Whether you're a homeowner planning a renovation, an interior 
            designer creating client presentations, or a real estate professional staging properties, 
            we provide the tools to visualize your space's full potential.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 hover-lift group text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4 mx-auto group-hover:from-gold/30 group-hover:to-gold/10 transition-all duration-300">
                <stat.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-1 text-foreground">
                {stat.value}
              </h3>
              <p className="text-muted-foreground text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Founded with a mission to democratize professional interior design, AvailableView LLC 
            is committed to continuous innovation, making professional design accessible to everyone 
            across <span className="text-foreground font-medium">180+ countries</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
