import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Image, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useParallax";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const { slow, medium, fast } = useParallax();
  const isMobile = useIsMobile();

  const getParallaxOffset = (speed: string) => {
    switch (speed) {
      case "slow": return slow;
      case "medium": return medium;
      case "fast": return fast;
      default: return medium;
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] sm:bg-[#0a0a0a]">
      {/* ── Grain overlay ── */}
      <div
        className="grain absolute inset-0 pointer-events-none"
        style={{ opacity: 0.06, zIndex: 0, mixBlendMode: "overlay" }}
      />

      {/* ── Animated floating particles with parallax (hidden on mobile) ── */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          {[
            { size: 4, left: "8%", top: "15%", delay: 0, duration: 8, speed: "slow" },
            { size: 6, left: "18%", top: "55%", delay: 1, duration: 10, speed: "medium" },
            { size: 3, left: "28%", top: "35%", delay: 2, duration: 9, speed: "fast" },
            { size: 5, left: "42%", top: "75%", delay: 0.5, duration: 8, speed: "slow" },
            { size: 7, left: "62%", top: "50%", delay: 2.5, duration: 10, speed: "fast" },
            { size: 4, left: "78%", top: "30%", delay: 1, duration: 9, speed: "medium" },
            { size: 3, left: "88%", top: "60%", delay: 2, duration: 8, speed: "slow" },
            { size: 5, left: "12%", top: "65%", delay: 0.5, duration: 10, speed: "fast" },
            { size: 6, left: "52%", top: "15%", delay: 1.5, duration: 9, speed: "medium" },
            { size: 4, left: "92%", top: "18%", delay: 0.5, duration: 8, speed: "slow" },
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: particle.size,
                height: particle.size,
                left: particle.left,
                top: particle.top,
                animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                transform: `translateY(${getParallaxOffset(particle.speed)}px)`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Hero video background ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ zIndex: 0 }}
      />

      {/* ── Video overlay for text readability ── */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 1, mixBlendMode: "multiply", backgroundColor: "hsl(25, 10%, 5%)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: "linear-gradient(180deg, hsla(25, 10%, 5%, 0.15) 0%, hsla(25, 10%, 5%, 0.85) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-16 sm:pt-24 sm:pb-20" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          {/* ── Left-aligned editorial composition ── */}
          <div className="lg:flex lg:items-start lg:justify-between gap-12 lg:gap-16">
            {/* Left column: copy */}
            <div className="w-full lg:w-1/2 text-left space-y-8 order-2 lg:order-1">
              {/* Badge */}
              <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-sm font-medium text-white/80">
                  <Sparkles className="w-4 h-4 text-gold" />
                  AI Interior Design
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="animate-fade-up" style={{ animationDelay: "200ms" }}>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[1.05] tracking-tight text-white">
                  See Your Room.{" "}
                  <span className="text-gradient-gold">Redesigned.</span>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="animate-fade-up" style={{ animationDelay: "400ms" }}>
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 max-w-xl font-light">
                  Upload a room photo, choose your style, and get AI-generated interior designs in seconds.
                </span>
              </p>

              {/* CTA */}
              <div className="animate-fade-up" style={{ animationDelay: "600ms" }}>
                <Link to="/generate" className="block">
                  <Button
                    size="lg"
                    className="btn-gold w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-5 h-auto min-h-[56px] rounded-full"
                  >
                    Start Free Design
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Trust statement */}
              <p className="animate-fade-up" style={{ animationDelay: "800ms" }}>
                <span className="text-sm text-white/40">
                  <span className="text-white/60">No credit card required</span> · Free plan: 3 designs/month
                </span>
              </p>
            </div>

            {/* Right column: media showcase */}
            <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-lg">
                {/* Media entrance */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5"
                  style={{
                    opacity: 0,
                    transform: "scale(1.05)",
                    transition: "opacity 0.8s ease, transform 1.8s ease",
                  }}
                  onAnimationStart={(e) => {
                    const el = e.target as HTMLElement;
                    el.style.opacity = "1";
                    el.style.transform = "scale(1)";
                  }}
                >
                  {/* Decorative pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                      backgroundSize: "60px 60px",
                    }}
                  />
                  {/* Gold accent glow */}
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "radial-gradient(circle at 50% 50%, hsl(var(--gold)) 0%, transparent 70%)",
                      opacity: 0.3,
                    }}
                  />
                  {/* Image placeholder - will be replaced by actual media */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl" />
                  </div>
                  {/* Center decorative element */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-gradient-to-br from-gold/10 to-primary/5 blur-2xl" />
                </div>

                {/* Card frame over media */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5" />

                {/* Small decorative badge */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/5 text-xs text-white/70">
                    AI-Powered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust stats - refined ── */}
      <div className="relative z-10 container mx-auto px-6 pb-12" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 border-t border-white/5 pt-8">
            {[
              { value: "2.5M+", label: "Designs Created" },
              { value: "150K+", label: "Active Users" },
              { value: "431K+", label: "Instagram Followers" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-center sm:text-left animate-fade-up"
                style={{ animationDelay: `${800 + index * 150}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  {index === 0 && <Image className="w-5 h-5 text-gold" />}
                  {index === 1 && <Users className="w-5 h-5 text-gold" />}
                  {index === 2 && <Instagram className="w-5 h-5 text-gold" />}
                </div>
                <div>
                  <div className="stat-number text-white">{stat.value}</div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
