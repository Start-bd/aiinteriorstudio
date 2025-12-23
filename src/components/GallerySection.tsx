import { useState } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const categories = ["All", "Living Room", "Bedroom", "Kitchen", "Bathroom", "Office"];

const galleryItems = [
  { src: gallery1, category: "Living Room", title: "Scandinavian Comfort" },
  { src: gallery2, category: "Bedroom", title: "Dark Luxury Suite" },
  { src: gallery3, category: "Kitchen", title: "Smart Kitchen 2025" },
  { src: gallery4, category: "Bathroom", title: "Marble Spa Haven" },
  { src: gallery5, category: "Office", title: "Urban Workspace" },
  { src: gallery6, category: "Living Room", title: "Art Deco Dining" },
];

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-gold uppercase tracking-widest text-sm font-medium">Gallery</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6">
            Featured AI Interiors
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore stunning AI-generated interiors curated for inspiration.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gold text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="group relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full transition-transform duration-500 group-hover:scale-105"
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <span className="text-gold text-xs uppercase tracking-wider">{item.category}</span>
                  <h3 className="text-xl font-display font-semibold text-foreground mt-1">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
