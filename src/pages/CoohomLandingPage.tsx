import { Link } from "react-router-dom";
import { ArrowRight, Cube, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const CoohomLandingPage = () => {
  return (
    <>
      <Helmet>
        <title>Coohom | 3D Interior Design Software | Interior of AI</title>
        <meta
          name="description"
          content="Explore Coohom - professional 3D interior design software. Learn the difference between AI room visualization and professional 3D planning."
        />
        <meta
          property="og:title"
          content="Coohom | Professional 3D Interior Design Software"
        />
        <meta
          property="og:description"
          content="Explore Coohom - professional 3D interior design software for architects, designers, and homeowners."
        />
        <link rel="canonical" href="https://interiorofai.com/coohom-interior-design" />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-display font-bold">
                  Interior <span className="text-gradient-gold">of AI</span>
                </span>
              </div>
              <nav className="flex items-center gap-6">
                <Link
                  to="/"
                  className="text-sm text-white/50 hover:text-gold transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/generate"
                  className="text-sm text-white/50 hover:text-gold transition-colors"
                >
                  Generate
                </Link>
                <Link
                  to="/coohom-interior-design"
                  className="text-sm text-white/50 hover:text-gold transition-colors bg-gold/10 px-3 py-1.5 rounded-full"
                >
                  Coohom
                </Link>
                <Link
                  to="/pricing"
                  className="text-sm text-white/50 hover:text-gold transition-colors"
                >
                  Pricing
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 bg-[#050505]">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-gold uppercase tracking-[0.2em] text-xs sm:text-sm font-medium mb-4">
                Affiliate Program
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                Master 3D Interior Design with{" "}
                <span className="text-gradient-gold">Coohom</span>
              </h1>
              <p className="text-xl text-white/50 max-w-2xl mx-auto mb-8">
                Coohom is professional 3D interior design software that takes
                your ideas from concept to reality. Learn how it complements our
                AI room visualization tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="https://www.coohom.com" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-gold text-black hover:bg-gold/90 px-8 py-4 rounded-full"
                  >
                    Explore Coohom
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/10 bg-white/5 hover:bg-white/10"
                >
                  <Link to="/generate">
                    Try AI Room Visualization
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What is Coohom Section */}
        <section className="py-16 sm:py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
                  What is <span className="text-gradient-gold">Coohom?</span>
                </h2>
                <p className="text-white/50 leading-relaxed mb-4">
                  Coohom is a professional 3D interior design software that
                  empowers designers, architects, and homeowners to create
                  photorealistic 3D renders and walkthroughs.
                </p>
                <p className="text-white/50 leading-relaxed mb-6">
                  Unlike our AI room visualization, which generates instant
                  design concepts from uploaded photos, Coohom provides
                  complete control over every detail of your 3D space.
                </p>
                <ul className="space-y-3">
                  {[
                    "Create photorealistic 3D interiors",
                    "Add furniture, lighting, and materials",
                    "Walkthrough mode for client presentations",
                    "Export high-resolution renders",
                    "Perfect for residential and commercial projects",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#141414] border border-white/5 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Cube className="w-8 h-8 text-gold" />
                  <h3 className="text-xl font-display font-bold">
                    Quick Overview
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-white/60">
                  <div className="flex justify-between">
                    <span>Platform:</span>
                    <span className="text-white/50">Web-based 3D software</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best for:</span>
                    <span className="text-white/50">Designers & professionals</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rendering:</span>
                    <span className="text-white/50">Photorealistic 3D</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Walkthrough:</span>
                    <span className="text-white/50">Interactive 3D tours</span>
                  </div>
                </div>
                <Link
                  to="https://www.coohom.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="mt-6 w-full bg-gold text-black hover:bg-gold/90 rounded-full">
                    Visit Coohom
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Differences Section */}
        <section className="py-16 sm:py-20 bg-[#050505]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold">
                AI Visualization vs <span className="text-gradient-gold">3D Planning</span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto mt-4">
                Understanding which tool is right for your needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-8">
                <h3 className="text-2xl font-display font-bold mb-4 text-gold">
                  AI Room Visualization
                </h3>
                <ul className="space-y-3">
                  {[
                    "Upload a room photo",
                    "Get instant design concepts",
                    "AI-generated variations",
                    "Best for: quick inspiration",
                    "No 3D skills required",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#141414] border border-white/5 rounded-2xl p-8">
                <h3 className="text-2xl font-display font-bold mb-4 text-gold">
                  Professional 3D Planning
                </h3>
                <ul className="space-y-3">
                  {[
                    "Full control over every detail",
                    "Walkthrough & 3D modeling",
                    "Complete architectural control",
                    "Best for: detailed planning",
                    "Requires 3D design skills",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold">
                Start Your <span className="text-gradient-gold">Coohom</span> Journey
              </h2>
            </div>

            <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create Your Account",
                  description: "Sign up for a free Coohom account",
                },
                {
                  step: "02",
                  title: "Design Your Space",
                  description: "Use professional 3D tools to design",
                },
                {
                  step: "03",
                  title: "Explore & Export",
                  description: "Walkthrough, render, and share",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="text-center p-6 bg-[#141414] border border-white/5 rounded-2xl"
                >
                  <div className="text-gold text-4xl font-display font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/50">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="https://www.coohom.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-gold text-black hover:bg-gold/90 px-8 py-4 rounded-full"
                >
                  Get Started with Coohom
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Affiliate CTA */}
        <section className="py-16 sm:py-20 bg-[#050505]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
                Build Your Design Career with <span className="text-gradient-gold">Coohom</span>
              </h2>
              <p className="text-xl text-white/50 mb-8 max-w-2xl mx-auto">
                Join our affiliate program. We offer{" "}
                <span className="text-gold font-medium">22.5% initial commission</span>
                {", "}
                <span className="text-gold font-medium">campain 30100</span>
                {" "}
                on all referrals.
              </p>
              <Link
                to="https://www.coohom.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-gold text-black hover:bg-gold/90 px-8 py-4 rounded-full"
                >
                  Join Coohom Affiliate Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-white/40 mt-4">
                Track your referrals through our affiliate dashboard
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0a0a0a] border-t border-white/5">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/40">
                &copy; 2026 AvailableView LLC. Interior of AI is a product of
                AvailableView LLC.
              </p>
              <div className="flex gap-6">
                <Link
                  to="/terms"
                  className="text-sm text-white/40 hover:text-gold transition-colors"
                >
                  Terms
                </Link>
                <Link
                  to="/privacy"
                  className="text-sm text-white/40 hover:text-gold transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  to="/cookies"
                  className="text-sm text-white/40 hover:text-gold transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default CoohomLandingPage;
