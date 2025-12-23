import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const ecosystems = [
  {
    name: "Home Decor AI",
    description: "AI-generated decor ideas for modern, minimal, and creative homes.",
    image: gallery1,
    color: "from-amber-500/20 to-orange-500/20",
    url: "https://homeai.design",
  },
  {
    name: "Home & House AI",
    description: "Room designs, floor concepts, and complete AI-designed homes.",
    image: gallery2,
    color: "from-gold/20 to-amber-600/20",
    url: "https://houseai.design",
  },
  {
    name: "Luxury AI Design",
    description: "High-end interiors, premium materials, and futuristic luxury concepts.",
    image: gallery3,
    color: "from-yellow-500/20 to-gold/20",
    url: "https://luxuryai.design",
  },
  {
    name: "Architecture AI",
    description: "Cutting-edge architectural concepts powered by AI imagination.",
    image: gallery4,
    color: "from-amber-600/20 to-yellow-600/20",
    url: "#ai-generator",
  },
];

const EcosystemSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-charcoal to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold uppercase tracking-widest text-sm font-medium">Platforms</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6">
            Explore Our AI Design Ecosystem
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dedicated platforms for every interior style, all powered by artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ecosystems.map((eco, index) => (
            <a
              key={index}
              href={eco.url}
              target={eco.url.startsWith("http") ? "_blank" : undefined}
              rel={eco.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative rounded-2xl overflow-hidden hover-lift cursor-pointer block"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={eco.image}
                  alt={eco.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${eco.color} via-background/80 to-background/95`} />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 min-h-[280px] flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-2 group-hover:text-gold transition-colors duration-300">
                  {eco.name}
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  {eco.description}
                </p>
                <Button variant="gold-outline" size="sm" className="w-fit group/btn">
                  Explore
                  <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
