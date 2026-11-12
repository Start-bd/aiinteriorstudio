import { ArrowRight, Check, Sparkles, Zap, Crown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/useScrollAnimation";
import { PRICING_TIERS, formatCurrency } from "@/lib/pricing";

// Map tier IDs to their icons
const tierIcons: Record<string, typeof Sparkles> = {
  free: Sparkles,
  basic: Zap,
  pro: Crown,
  business: Building2,
};

// Build a consistent card structure from the centralized pricing config
const pricingPlans = PRICING_TIERS.map((tier) => {
  const isUnlimited = tier.credits === -1;
  return {
    name: tier.displayName,
    price: isUnlimited
      ? "Unlimited"
      : formatCurrency(tier.price.usd, "USD"),
    period: isUnlimited ? "" : "/ month",
    description:
      tier.id === "free"
        ? "Perfect for trying out"
        : tier.id === "basic"
        ? "For serious designers"
        : "For teams & agencies",
    icon: tierIcons[tier.id],
    features: tier.features,
    popular: tier.popular || false,
    href: tier.id === "free" ? "/auth" : "/pricing",
    cta: tier.id === "free" ? "Start Free" : "Upgrade",
  };
});

const PricingSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-28 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(25,10%,8%)] to-background" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 ${getAnimationClasses(isVisible)}`}>
          <span className="text-primary uppercase tracking-[0.2em] text-xs sm:text-sm font-medium">
            Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 text-white">
            Simple, <span className="text-gradient-gold">Transparent</span> Pricing
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2 text-white/60">
            Start free, upgrade when you're ready
          </p>
        </div>

        {/* Pricing Cards - now driven by PRICING_TIERS, 4 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className={cn(
                `relative overflow-hidden transition-all duration-500 hover:shadow-gold ${getAnimationClasses(isVisible)}`,
                plan.popular
                  ? "border-gold/30 shadow-gold order-first md:order-none md:scale-105"
                  : "border-white/5 hover:border-white/10"
              )}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 120}ms` : "0ms" }}
            >
              {/* Popular Badge - Always visible */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 z-10">
                  <div className="bg-gradient-to-r from-gold to-gold-dark text-primary-foreground text-xs sm:text-sm font-semibold py-2.5 text-center tracking-wide">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Premium card background with subtle gradient */}
              <div className={`absolute inset-0 rounded-xl opacity-40 ${plan.popular ? "bg-gold/5" : "bg-gradient-to-b from-background to-transparent"}`} />

              <CardHeader className={cn("text-center pb-4 pt-6", plan.popular && "pt-12 sm:pt-12")}>
                <div className={`mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${plan.popular ? "bg-gold/10" : "bg-white/5"}`}>
                  <plan.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${plan.popular ? "text-gold" : "text-white/60"}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs sm:text-sm text-white/40">{plan.description}</p>
                <div className="mt-3 sm:mt-4">
                  <span className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white ${plan.popular ? "text-gold" : ""}`}>
                    {plan.price}
                  </span>
                  {plan.period && <span className="text-sm sm:text-base text-white/40">{plan.period}</span>}
                </div>
              </CardHeader>

              <CardContent className="pt-0 pb-6">
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2.5 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/50">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.href} className="block">
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className={cn(
                      "w-full font-semibold min-h-[48px] sm:min-h-[44px]",
                      plan.popular
                        ? "bg-gold text-primary-foreground hover:bg-gold-dark"
                        : "border-white/10 text-white/80 hover:border-white/20 hover:text-white"
                    )}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Line */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 text-xs sm:text-sm text-white/40">
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-gold" />
              No credit card required for free plan
            </span>
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-gold" />
              Cancel anytime
            </span>
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-gold" />
              30-day money-back guarantee
            </span>
          </div>

          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium transition-colors group min-h-[44px]"
          >
            See Full Pricing Details
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
