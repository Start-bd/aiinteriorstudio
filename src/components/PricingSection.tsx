import { ArrowRight, Check, Sparkles, Crown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    description: "Perfect for trying out",
    icon: Sparkles,
    features: [
      "10 designs per month",
      "Standard quality",
      "Watermarked images",
      "8+ design styles",
      "Community support",
    ],
    cta: "Start Free",
    ctaVariant: "outline" as const,
    popular: false,
    href: "/auth",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For serious designers",
    icon: Crown,
    features: [
      "100 designs per month",
      "HD quality downloads",
      "No watermarks",
      "Commercial use rights",
      "Priority processing",
      "AI design assistant",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    ctaVariant: "default" as const,
    popular: true,
    href: "/pricing",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams & agencies",
    icon: Building2,
    features: [
      "Unlimited designs",
      "API access",
      "White-label option",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    popular: false,
    href: "/pricing",
  },
];

const PricingSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-primary uppercase tracking-widest text-xs sm:text-sm font-medium">
            Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            Simple, <span className="text-gradient-gold">Transparent</span> Pricing
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
            Start free, upgrade when you're ready
          </p>
        </div>

        {/* Pricing Cards - Stack vertically on mobile, Popular badge visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-10 sm:mb-12">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-xl",
                plan.popular
                  ? "border-primary/50 shadow-lg shadow-primary/10 order-first md:order-none md:scale-105"
                  : "border-border/50 hover:border-primary/30"
              )}
            >
              {/* Popular Badge - Always visible */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 z-10">
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs sm:text-sm font-semibold py-2 text-center">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Glow effect for popular plan */}
              {plan.popular && (
                <div className="absolute -inset-px bg-gradient-to-b from-primary/20 via-transparent to-primary/10 rounded-lg pointer-events-none" />
              )}

              <CardHeader className={cn("text-center pb-4 pt-6", plan.popular && "pt-12 sm:pt-12")}>
                <div className="mx-auto mb-3 sm:mb-4 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <plan.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-3 sm:mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm sm:text-base">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0 pb-6">
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.href} className="block">
                  <Button
                    variant={plan.ctaVariant}
                    className={cn(
                      "w-full font-semibold min-h-[44px] sm:min-h-[40px]",
                      plan.popular && "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Line - Stack on mobile */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              No credit card required for free plan
            </span>
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Cancel anytime
            </span>
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              30-day money-back guarantee
            </span>
          </div>

          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group min-h-[44px]"
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
