import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import { Eye, Instagram, Users, Award } from "lucide-react";

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
    <section className="py-16 sm:py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] max-w-6xl bg-gold/2 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(25,10%,6%)] to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-gold uppercase tracking-[0.2em] text-xs sm:text-sm font-medium">
            Social Proof
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mt-3 mb-4 text-white">
            Trusted by thousands worldwide
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            See the designs our community creates — every week, a new wave of interiors.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {[
            { value: "Verified", label: "Designs Created", icon: Award },
            { value: "Verified", label: "Active Users", icon: Users },
            { value: "Verified", label: "Instagram Followers", icon: Instagram },
            { value: "Verified", label: "Monthly Impressions", icon: Eye },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-[#141414] border border-white/5 rounded-xl p-5 text-center hover:border-white/10 transition-all duration-500 hover:shadow-gold"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-gold" />
              </div>
              <div className="mt-3 stat-number text-white">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Instagram Grid Preview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-xl overflow-hidden hover:rounded-none transition-all duration-500 hover:shadow-gold cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-white">
                  <Eye className="w-4 h-4" />
                  <span className="font-semibold text-sm">{image.views} views</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 flex gap-1.5">
                <Instagram className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/40">@{index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Caption */}
        <div className="flex items-center justify-center gap-3 mt-8 text-center">
          <Instagram className="w-4 h-4 text-white/40" />
          <span className="text-sm text-white/30">
            Curated from <span className="text-white/60">@interiorofai</span> — your inspiration source
          </span>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
