import { Link } from "react-router-dom";
import { ArrowRight, Heart, Lamp, Rug, Painting, Lightbulb, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Shop the Look - Furniture, Lighting & Home Decor Recommendations
// Uses MaxBounty affiliate links (campain 30100)

const shopItems = [
  {
    id: "1",
    name: "Aubusson Area Rug - 8x10",
    category: "Rugs",
    price: "$349",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1616643881466-85a88e62c6c6?w=400&h=300&fit=crop",
    alt: "Aubusson area rug in warm beige with geometric pattern",
    affiliateLink: "https://www.maxbourton.com/shop/rug/aubusson-8x10",
    description: "Handwoven wool rug with classic geometric pattern. Perfect for living rooms and dining areas.",
    icon: Rug,
  },
  {
    id: "2",
    name: "Modern Floor Lamp - Adjustable",
    category: "Lighting",
    price: "$129",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1524805430917-1a1e93f6f8b3?w=400&h=300&fit=crop",
    alt: "Modern adjustable floor lamp in brass finish",
    affiliateLink: "https://www.maxbourton.com/shop/lighting/floor-lamp-adjustable-brass",
    description: " adjustable floor lamp with LED bulb. Three brightness settings, USB charging port.",
    icon: Lightbulb,
  },
  {
    id: "3",
    name: "Abstract Wall Art - 24x36",
    category: "Wall Art",
    price: "$189",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1572442388441-466f1208a762?w=400&h=300&fit=crop",
    alt: "Abstract wall art in modern frame",
    affiliateLink: "https://www.maxbourton.com/shop/art/abstract-wholesale-24x36",
    description: "Abstract contemporary wall art in black and white. Ready to hang with saw-tooth hanger.",
    icon: Painting,
  },
  {
    id: "4",
    name: "Ceramic Table Lamp - Brass",
    category: "Lighting",
    price: "$89",
    rating: "4.4",
    image: "https://images.unsplash.com/photo-1512820361853-5e8d1b0535wc?w=400&h=300&fit=crop",
    alt: "Ceramic table lamp with brass finish",
    affiliateLink: "https://www.maxbourton.com/shop/lighting/table-lamp-ceramic-brass",
    description: "Elegant ceramic table lamp with polished brass finish. Corded with pull switch.",
    icon: Lamp,
  },
  {
    id: "5",
    name: "Mid-Century Sofa - Teak",
    category: "Furniture",
    price: "$1,299",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a5659c?w=400&h=300&fit=crop",
    alt: "Mid-century modern sofa in teak finish",
    affiliateLink: "https://www.maxbourton.com/shop/furniture/mid-century-sofa-teak",
    description: "Classic mid-century modern sofa in warm teak. Premium leather upholstery.",
    icon: Heart,
  },
  {
    id: "6",
    name: "Artisan Coffee Table - Oak",
    category: "Furniture",
    price: "$429",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1533089869-28c614a2a9dd?w=400&h=300&fit=crop",
    alt: "Rustic oak coffee table with visible wood grain",
    affiliateLink: "https://www.maxbourton.com/shop/furniture/coffee-table-oak-mid-century",
    description: "Rustic oak coffee table with wooden legs and solid wood top. Adds warmth to any space.",
    icon: ShoppingBag,
  },
];

const ShopTheLookSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18">
          <span className="text-gold uppercase tracking-[0.2em] text-xs sm:text-sm font-medium mb-4">
            Shop the Look
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Bring Your <span className="text-gradient-gold">Dream Space</span> Home
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Curated furniture, lighting, rugs and decor recommendations. Shop through our
            affiliate partners and support Interior of AI — at no extra cost to you.
          </p>
        </div>

        {/* Shop Items Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {shopItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-gold cursor-pointer group"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {item.price}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gold font-medium uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs text-white/40">{item.rating}</span>
                </div>
                <h3 className="font-display font-bold text-white mb-2 group-hover:text-gold transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-white/50 line-clamp-2 mb-4">
                  {item.description}
                </p>
                <Link
                  to={item.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dark transition-colors"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Why Shop With Us + CTA */}
        <div className="bg-[#050505] border border-white/5 rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="relative z-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Discover <span className="text-gradient-gold">Home Products</span> We Love
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-8">
              Every product in this collection has been reviewed and hand-picked by our
              interior design team. We only recommend products that match the quality
              standards of Interior of AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="https://www.maxbourton.com/shop"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-gold text-black hover:bg-gold/90 px-8 py-4 rounded-full"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Disclosure */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-white/40">
            <span className="font-medium text-white/60">Disclosure:</span> Some of the links on this page are affiliate links. 
            {" "}
            <span className="text-white/60">
              We may earn a commission at no extra cost to you. As an Amazon Associate we earn from qualifying purchases.
            </span>
            <br />
            {` `}
            <span className="text-white/60">
              Guaranteed and reviewed by Interior of AI design team.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShopTheLookSection;
