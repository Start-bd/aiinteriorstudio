import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/useScrollAnimation";

// Import transformation images to simulate Instagram feed
import livingRoomAfter from "@/assets/transformations/living-room-after.jpg";
import bedroomAfter from "@/assets/transformations/bedroom-after.jpg";
import kitchenAfter from "@/assets/transformations/kitchen-after.jpg";
import officeAfter from "@/assets/transformations/office-after.jpg";
import bathroomAfter from "@/assets/transformations/bathroom-after.jpg";
import diningAfter from "@/assets/transformations/dining-after.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

const instagramPosts = [
  {
    id: 1,
    image: livingRoomAfter,
    likes: "12.4K",
    caption: "Modern living room transformation ✨",
  },
  {
    id: 2,
    image: bedroomAfter,
    likes: "8.9K",
    caption: "Scandinavian bedroom goals 🌿",
  },
  {
    id: 3,
    image: kitchenAfter,
    likes: "15.2K",
    caption: "Luxury kitchen redesign 💫",
  },
  {
    id: 4,
    image: officeAfter,
    likes: "6.7K",
    caption: "Minimalist home office setup 🖥️",
  },
  {
    id: 5,
    image: bathroomAfter,
    likes: "10.1K",
    caption: "Spa-like bathroom retreat 🛁",
  },
  {
    id: 6,
    image: diningAfter,
    likes: "9.3K",
    caption: "Contemporary dining elegance 🍽️",
  },
  {
    id: 7,
    image: gallery1,
    likes: "11.8K",
    caption: "AI-designed interiors 🏠",
  },
  {
    id: 8,
    image: gallery2,
    likes: "14.5K",
    caption: "Future of interior design 🚀",
  },
  {
    id: 9,
    image: gallery3,
    likes: "7.6K",
    caption: "Cozy corner inspiration 💖",
  },
];

const InstagramSection = () => {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-background to-muted/50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-12 ${getAnimationClasses(isVisible)}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 mb-6">
            <Instagram className="w-4 h-4" />
            <span className="text-sm font-medium">@interiorofai</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Join <span className="text-gradient-gold">Verified Followers</span> on Instagram
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See daily design inspiration and real user transformations
          </p>
        </div>

        {/* Instagram Feed Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10 ${getAnimationClasses(isVisible)}`} style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/interiorofai/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {/* Image */}
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
              />
              
              {/* Hover Overlay */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 ${
                  hoveredPost === post.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center gap-2 text-white mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="font-semibold">{post.likes}</span>
                </div>
                <p className="text-white/90 text-sm line-clamp-2">{post.caption}</p>
              </div>

              {/* Instagram Icon */}
              <div 
                className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                  hoveredPost === post.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
              >
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="text-center space-y-6">
          <a
            href="https://www.instagram.com/interiorofai/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                @interiorofai
              </div>
              <div className="text-sm text-muted-foreground">
                Follow us on Instagram →
              </div>
            </div>
          </a>

          <div className="pt-4">
            <a
              href="https://www.instagram.com/interiorofai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 hover:from-pink-600 hover:via-purple-600 hover:to-orange-500 text-white font-semibold px-8"
              >
                <Instagram className="mr-2 h-5 w-5" />
                Follow @interiorofai
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
