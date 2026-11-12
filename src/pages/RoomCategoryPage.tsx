import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Image, Wand2, Sparkles } from "lucide-react";

const roomData = {
  "living-room": {
    title: "Living Room Design | AI Living Room Ideas",
    description: "Explore AI-powered living room design ideas. From cozy reading nooks to statement sofas, discover how Interior of AI transforms your living space.",
    category: "Room Guides",
  },
  kitchen: {
    title: "Kitchen Design | AI Kitchen Makeovers",
    description: "Transform your kitchen with AI-powered design concepts. Explore modern kitchen layouts, materials, and styles.",
    category: "Room Guides",
  },
  bedroom: {
    title: "Bedroom Design | AI Bedroom Concepts",
    description: "Create your dream bedroom with AI interior design. Explore styles from minimalist retreats to luxury collaborative spaces.",
    category: "Room Guides",
  },
  bathroom: {
    title: "Bathroom Design | AI Bathroom Transformation",
    description: "Design your perfect bathroom with AI technology. Explore modern bathroom styles, materials, and layouts.",
    category: "Room Guides",
  },
};

const roomContent = {
  "living-room": {
    intro: "Your living room is the heart of your home — where you unwind, entertain, and spend quality time with family. AI design tools make it easy to visualize different styles before committing to changes.",
    styles: [
      { name: "Cozy Minimalist", desc: "Clean lines, neutral tones, and uncluttered spaces create a calm, functional atmosphere.", icon: "✦" },
      { name: "Modern Luxury", desc: "Rich textures, statement pieces, and sophisticated accents for a high-end feel.", icon: "◆" },
      { name: "Boho Chic", desc: "Layered textures, eclectic patterns, and global-inspired accessories.", icon: "◉" },
      { name: "Scandinavian", desc: "Light woods, light colors, and natural light for bright, airy spaces.", icon: "◍" },
    ],
    cta: "Upload your living room photo to see AI transformations",
    ctaUrl: "/generate",
  },
  kitchen: {
    intro: "The kitchen is often the most-used room in the house — a space for cooking, connecting, and creating memories. AI can help you visualize layouts and styles that work for your needs.",
    styles: [
      { name: "Modern Minimalist", desc: "Clean lines, matte finishes, and efficient workflow layouts.", icon: "✦" },
      { name: "Industrial Loft", desc: "Exposed elements, metal accents, and bold color pops.", icon: "◆" },
      { name: "Warm Traditional", desc: "Wood tones, classic fixtures, and timeless elegance.", icon: "◉" },
      { name: "Smart Modern", desc: "Hidden technology, adaptive lighting, and futuristic materials.", icon: "◍" },
    ],
    cta: "Upload your kitchen photo to see AI transformations",
    ctaUrl: "/generate",
  },
  bedroom: {
    intro: "Your bedroom should be a sanctuary — a place to rest, rejuvenate, and escape from the world. AI design helps you create the perfect sleep environment for your needs.",
    styles: [
      { name: "Spa Retreat", desc: "Calming colors, soft textures, and soothing lighting for ultimate relaxation.", icon: "✦" },
      { name: "Modern Minimal", desc: "Clean, uncluttered, and functional with a focus on quality pieces.", icon: "◆" },
      { name: "Coastal", desc: "Light, airy, and natural with breezy fabrics and sea-inspired tones.", icon: "◉" },
      { name: "Hotel Classic", desc: "Luxurious bedding, dramatic lighting, and elegant details.", icon: "◍" },
    ],
    cta: "Upload your bedroom photo to see AI transformations",
    ctaUrl: "/generate",
  },
  bathroom: {
    intro: "Your bathroom is a personal retreat — a place to start your day and unwind in the evening. AI design helps you visualize layouts, materials, and styles that work best.",
    styles: [
      { name: "Spa Sanctuary", desc: "Calming water elements, natural stone, and soothing tones.", icon: "✦" },
      { name: "Modern Minimal", desc: "Clean lines, hidden fixtures, and functional storage.", icon: "◆" },
      { name: "Industrial", desc: "Exposed brick, metal accents, and bold statement pieces.", icon: "◉" },
      { name: "Classic Elegance", desc: "Premium materials, refined finishes, and timeless beauty.", icon: "◍" },
    ],
    cta: "Upload your bathroom photo to see AI transformations",
    ctaUrl: "/generate",
  },
};

const categoryPages: Array<{
  id: keyof typeof roomData;
  title: string;
  description: string;
}> = [
  {
    id: "living-room",
    title: "Living Room Ideas",
    description: "Modern, cozy, and stylish living room design concepts created with AI.",
  },
  {
    id: "kitchen",
    title: "Kitchen Design",
    description: "Discover how AI is revolutionizing kitchen design with stunning new layouts and styles.",
  },
  {
    id: "bedroom",
    title: "Bedroom Inspiration",
    description: "Create your perfect sleep sanctuary with AI-powered bedroom design concepts.",
  },
  {
    id: "bathroom",
    title: "Bathroom Transformation",
    description: "AI-powered bathroom design ideas from spa-like retreats to luxury wellness spaces.",
  },
];

const RoomCategoryPage = ({ slug }: { slug: string }) => {
  const data = roomData[slug as keyof typeof roomData];
  const content = roomContent[slug as keyof typeof roomContent];

  return (
    <>
      <Helmet>
        <title>{data.title} | Interior of AI</title>
        <meta name="description" content={data.description} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://interiorofai.com/${slug}`} />
        <meta property="og:image" content="https://interiorofai.com/og-image.jpg" />
        <link rel="canonical" href={`https://interiorofai.com/${slug}`} />
        <meta name="keywords" content={`AI interior design, ${slug} design, room design ideas, home improvement, interior design trends`} />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="text-sm text-white/40">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <SpanDash />
            <Link to={`/room/${slug}`} className="hover:text-gold transition-colors">{data.title}</Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-[#050505] py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <span className="text-gold uppercase tracking-[0.2em] text-xs sm:text-sm font-medium mb-4">
              {data.category}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6">
              {data.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/50 max-w-3xl mb-8">
              {content.intro}
            </p>
            <Link to={content.ctaUrl}>
              <Button
                size="lg"
                className="bg-gold text-black hover:bg-gold/90 px-8 py-4 rounded-full"
              >
                {content.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Styles Section */}
        <section className="py-16 sm:py-24 bg-[#0a0a0a]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                {slug === "living-room" && "Living Room Styles"}
                {slug === "kitchen" && "Kitchen Design Styles"}
                {slug === "bedroom" && "Bedroom Style Ideas"}
                {slug === "bathroom" && "Bathroom Design Styles"}
                <span className="text-gold"> /</span>
                <span className="text-white/50">
                  {data.title.split("|")[0].trim()}
                </span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Explore different design styles for your {slug.replace("-", " ")} and see how AI can bring them to life.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.styles.map((style, index) => (
                <div
                  key={style.name}
                  className="bg-[#141414] border border-white/5 rounded-xl p-6 hover:border-gold/30 transition-all duration-300 hover:shadow-gold"
                >
                  <div className="text-3xl mb-4">{style.icon}</div>
                  <h3 className="text-lg font-display font-bold mb-2">{style.name}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{style.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inspiration CTA */}
        <section className="py-16 sm:py-24 bg-[#050505]">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 sm:p-12 text-center">
              <Sparkles className="w-12 h-12 text-gold mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
                Ready to Transform Your {slug.replace("-", " ")}?
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                Upload a photo of your space and get AI-generated design concepts unique to your room.
              </p>
              <Link to={content.ctaUrl}>
                <Button
                  size="lg"
                  className="bg-gold text-black hover:bg-gold/90 px-8 py-4 rounded-full"
                >
                  <Image className="mr-2 h-5 w-5" />
                  Upload Your {slug.replace("-", " ")} Photo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

const SpanDash = () => <span className="text-white/30">/</span>;

export default RoomCategoryPage;
