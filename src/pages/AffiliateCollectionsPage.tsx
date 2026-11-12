import { Link } from "react-router-dom";
import { ArrowRight, Heart, Lamp, Rug, Painting, Lightbulb, ShoppingBag, Bed, Bath, Kitchen, Desk } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Affiliate Product Collections - MaxBounty Campaign 30100
// These collections are organized by room type and product category

const productCollections = [
  {
    id: "furniture",
    category: "Furniture",
    icon: ShoppingBag,
    title: "Furniture Collections",
    description: "Modern furniture pieces from trusted brands. Explore our curated furniture collections for every room.",
    affiliateLinks: {
      livingRoom: "https://www.maxbourton.com/shop/furniture/living-room",
      bedroom: "https://www.maxbourton.com/shop/furniture/bedroom",
      kitchen: "https://www.maxbourton.com/shop/furniture/kitchen",
      office: "https://www.maxbourton.com/shop/furniture/office",
    },
    products: [
      { name: "Sofas & Sectionals", link: "https://www.maxbourton.com/shop/furniture/sofas", rating: "4.7" },
      { name: "Beds & Mattresses", link: "https://www.maxbourton.com/shop/furniture/beds", rating: "4.6" },
      { name: "Dining Tables", link: "https://www.maxbourton.com/shop/furniture/dining-tables", rating: "4.5" },
      { name: "Desks & Office", link: "https://www.maxbourton.com/shop/furniture/desks", rating: "4.4" },
      { name: "Storage & Shelving", link: "https://www.maxbourton.com/shop/furniture/storage", rating: "4.3" },
    ],
  },
  {
    id: "lighting",
    category: "Lighting",
    icon: Lamp,
    title: "Lighting Collections",
    description: "Illuminate your space with premium lighting solutions. From ambient to accent lighting, we have you covered.",
    affiliateLinks: {
      ambient: "https://www.maxbourton.com/shop/lighting/ambient",
      task: "https://www.maxbourton.com/shop/lighting/task",
      accent: "https://www.maxbourton.com/shop/lighting/accent",
    },
    products: [
      { name: "Floor Lamps", link: "https://www.maxbourton.com/shop/lighting/floor-lamps", rating: "4.7" },
      { name: "Table Lamps", link: "https://www.maxbourton.com/shop/lighting/table-lamps", rating: "4.6" },
      { name: "Pendant Lights", link: "https://www.maxbourton.com/shop/lighting/pendants", rating: "4.5" },
      { name: "Ceiling Fixtures", link: "https://www.maxbourton.com/shop/lighting/ceilings", rating: "4.4" },
      { name: "Smart Lighting", link: "https://www.maxbourton.com/shop/lighting/smart", rating: "4.8" },
    ],
  },
  {
    id: "rugs",
    category: "Rugs & Carpets",
    icon: Rug,
    title: "Rug Collections",
    description: "Define your space with beautiful rugs. From plush area rugs to statement runners.",
    affiliateLinks: {
      livingRoom: "https://www.maxbourton.com/shop/rugs/living-room",
      bedroom: "https://www.maxbourton.com/shop/rugs/bedroom",
      entryway: "https://www.maxbourton.com/shop/rugs/entryway",
      kitchen: "https://www.maxbourton.com/shop/rugs/kitchen",
    },
    products: [
      { name: "Area Rugs", link: "https://www.maxbourton.com/shop/rugs/area-rugs", rating: "4.7" },
      { name: "Runner Rugs", link: "https://www.maxbourton.com/shop/rugs/runners", rating: "4.5" },
      { name: "Bedroom Rugs", link: "https://www.maxbourton.com/shop/rugs/bedroom", rating: "4.6" },
      { name: "Outdoor Rugs", link: "https://www.maxbourton.com/shop/rugs/outdoor", rating: "4.3" },
      { name: "Dog Rugs", link: "https://www.maxbourton.com/shop/rugs/dog", rating: "4.2" },
    ],
  },
  {
    id: "wall-art",
    category: "Wall Art & Decor",
    icon: Painting,
    title: "Wall Art & Decor",
    description: "Complete your space with curated wall art, frames, and home decor pieces.",
    affiliateLinks: {
      wallArt: "https://www.maxbourton.com/shop/art/wall-art",
      frames: "https://www.maxbourton.com/shop/frames",
      decor: "https://www.maxbourton.com/shop/decor",
    },
    products: [
      { name: "Abstract Paintings", link: "https://www.maxbourton.com/shop/art/abstract", rating: "4.6" },
      { name: "Family Photos", link: "https://www.maxbourton.com/shop/art/photos", rating: "4.5" },
      { name: "Print Collections", link: "https://www.maxbourton.com/shop/art/prints", rating: "4.4" },
      { name: "Wall Decor", link: "https://www.maxbourton.com/shop/decor/wall", rating: "4.3" },
      { name: "Plant Accessories", link: "https://www.maxbourton.com/shop/decor/plants", rating: "4.5" },
    ],
  },
];

const AffiliateCollectionsPage = () => {
  return (
    <>
      <Helmet>
        <title>Affiliate Collections | Interior of AI</title>
        <meta
          name="description"
          content="Explore curated affiliate collections from Interior of AI. Shop furniture, lighting, rugs, and decor recommendations. MaxBounty campaign 30100."
        />
        <meta property="og:title" content="Affiliate Collections | Interior of AI" />
        <meta
          property="og:description"
          content="Explore curated affiliate collections from Interior of AI. Shop furniture, lighting, rugs, and decor recommendations."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://interiorofai.com/affiliate-collections" />
        <meta property="og:image" content="https://interiorofai.com/og-image.jpg" />
        <link rel="canonical" href="https://interiorofai.com/affiliate-collections" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header */}
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="text-sm text-white/40">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/60">Affiliate Collections</span>
          </div>
        </div>

        {/* Hero */}
        <section className="relative bg-[#050505] py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              Shop <span className="text-gradient-gold">Affiliate Collections</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mb-8">
              Curated product collections organized by room and category. Shop through our
              affiliate partners — MaxBounty Campaign 30100 — at no extra cost to you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop-the-look">
                <Button
                  size="lg"
                  className="bg-gold text-black hover:bg-gold/90 px-8 py-4 rounded-full"
                >
                  View Shop the Look
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/coohom-interior-design">
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                  <Lamp className="mr-2 h-5 w-5" />
                  Explore Coohom
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-16 sm:py-24 bg-[#0a0a0a]">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-12 text-center">
              Curated <span className="text-gradient-gold">Collections</span>
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="bg-[#141414] border border-white/5 rounded-xl p-6 hover:border-gold/30 transition-all duration-300 hover:shadow-gold"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                      <collection.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-lg font-display font-bold">{collection.title}</h3>
                  </div>
                  <p className="text-sm text-white/50 mb-4">{collection.description}</p>
                  <Link
                    to={collection.affiliateLinks.livingRoom}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dark transition-colors"
                  >
                    Browse Collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-16 sm:py-24 bg-[#050505]">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-12 text-center">
              Featured <span className="text-gradient-gold">Products</span>
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Sofas & Sectionals", link: "https://www.maxbourton.com/shop/furniture/sofas", rating: "4.7", img: "https://images.unsplash.com/photo-1540414046915-d886cac704f1?w=400&h=300&fit=crop", alt: "Modern sofa collection" },
                { name: "Beds & Mattresses", link: "https://www.maxbourton.com/shop/furniture/beds", rating: "4.6", img: "https://images.unsplash.com/photo-1572916568295-5346119d041b?w=400&h=300&fit=crop", alt: "Bed and mattress collection" },
                { name: "Floor Lamps", link: "https://www.maxbourton.com/shop/lighting/floor-lamps", rating: "4.7", img: "https://images.unsplash.com/photo-1524805430917-1a1e93f6f8b3?w=400&h=300&fit=crop", alt: "Modern floor lamp collection" },
                { name: "Area Rugs", link: "https://www.maxbourton.com/shop/rugs/area-rugs", rating: "4.7", img: "https://images.unsplash.com/photo-1616643881466-85a88e62c6c6?w=400&h=300&fit=crop", alt: "Area rug collection" },
                { name: "Wall Art", link: "https://www.maxbourton.com/shop/art/wall-art", rating: "4.6", img: "https://images.unsplash.com/photo-1572442388441-466f1208a762?w=400&h=300&fit=crop", alt: "Wall art collection" },
                { name: "Dining Tables", link: "https://www.maxbourton.com/shop/furniture/dining-tables", rating: "4.5", img: "https://images.unsplash.com/photo-1533089869-28c614a2a9dd?w=400&h=300&fit=crop", alt: "Dining table collection" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-gold cursor-pointer group"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={item.img}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {item.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-white mb-2 group-hover:text-gold transition-colors">
                      {item.name}
                    </h3>
                    <Link
                      to={item.link}
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
          </div>
        </section>

        {/* Disclosure */}
        <section className="py-16 bg-[#0a0a0a]">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-white/40 leading-relaxed">
                <span className="font-medium text-white/60">Affiliate Disclosure:</span>
                {" "}
                <span className="text-white/60">
                  Some of the links on this page are affiliate links. As an Amazon Associate we earn from qualifying purchases. We may earn a commission at no extra cost to you.
                </span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AffiliateCollectionsPage;
