import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, Sparkles, Lightbulb, Zap, Shield, Lock, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const benefits = [
  { icon: Sparkles, text: "AI interior inspiration" },
  { icon: Lightbulb, text: "Future home design concepts" },
  { icon: Zap, text: "Tool recommendations & updates" },
];

const trustBadges = [
  { icon: Shield, text: "100% Secure" },
  { icon: Lock, text: "Privacy Protected" },
  { icon: CreditCard, text: "No Card Required" },
];

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSaving) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim(), source: "newsletter" });
    setIsSaving(false);

    // 23505 = already subscribed, treat as success
    if (error && error.code !== "23505") {
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "You're on the list!",
      description: "We'll send you AI design inspiration as new content goes out.",
    });
  };

  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(25,10%,6%)] to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] max-w-6xl bg-gold/2 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-gold/1 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-gold uppercase tracking-[0.2em] text-xs sm:text-sm font-medium">
            Newsletter
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 mb-4 text-white">
            Join the AI Interior <span className="text-gradient-gold">Movement</span>
          </h2>
          <p className="text-white/40 text-lg mb-8 max-w-xl mx-auto">
            Stay ahead of interior design trends, powered by artificial intelligence.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 text-white/60"
              >
                <benefit.icon className="w-4 h-4 text-gold" />
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-[#141414] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-gold focus:ring-1 focus:ring-gold/30"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  disabled={isSaving}
                  className="min-h-[56px]"
                >
                  {isSaving ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <p className="text-xs text-white/30 mt-4">
                No spam. Unsubscribe anytime.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-white/5">
                {trustBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 text-xs text-white/40"
                  >
                    <badge.icon className="w-4 h-4 text-gold" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </form>
          ) : (
            <div className="glass-card rounded-2xl p-8 max-w-md mx-auto border-white/5">
              <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-white">You're in!</h3>
              <p className="text-white/60">
                Thanks for subscribing — we'll send AI design inspiration to{" "}
                <span className="text-white/80">{email}</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
