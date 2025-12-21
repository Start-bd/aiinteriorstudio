import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { Eye, Instagram } from "lucide-react";

const images = [
  { src: gallery1, alt: "Minimalist living room with natural light", views: "2.4M" },
  { src: gallery2, alt: "Luxury bedroom with gold accents", views: "1.8M" },
  { src: gallery3, alt: "Futuristic kitchen design", views: "3.1M" },
  { src: gallery4, alt: "Spa-inspired bathroom", views: "2.7M" },
  { src: gallery5, alt: "Modern home office", views: "1.5M" },
  { src: gallery6, alt: "Elegant dining room", views: "2.2M" },
];

const SocialProofSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-charcoal">
      <div className="container mx-auto px-6">
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-display font-bold text-gradient-gold">447K</div>
            <div className="text-muted-foreground mt-2">Instagram Followers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-display font-bold text-gradient-gold">50M+</div>
            <div className="text-muted-foreground mt-2">Impressions</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-display font-bold text-gradient-gold">2.5M+</div>
            <div className="text-muted-foreground mt-2">Designs Created</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-display font-bold text-gradient-gold">180+</div>
            <div className="text-muted-foreground mt-2">Countries</div>
          </div>
        </div>

        {/* Instagram Grid Preview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden hover-lift cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2 text-foreground">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">{image.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Caption */}
        <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground">
          <Instagram className="w-5 h-5" />
          <span>Curated from @interiorofai</span>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
