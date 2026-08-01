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
      description: "We'll email you AI interior inspiration as new content goes out.",
    });
  };

  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-gold uppercase tracking-widest text-sm font-medium">Newsletter</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6">
            Join the AI Interior Movement
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Stay ahead of interior design trends powered by artificial intelligence.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <benefit.icon className="w-5 h-5 text-gold" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl"
                    required
                  />
                </div>
                <Button type="submit" variant="gold" size="xl" disabled={isSaving}>
                  {isSaving ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                No spam. Unsubscribe anytime.
              </p>
              
              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-border/30">
                {trustBadges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <badge.icon className="w-4 h-4 text-primary" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </form>
          ) : (
            <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">You're in!</h3>
              <p className="text-muted-foreground">
                Thanks for subscribing — we'll send AI design inspiration to {email}.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
