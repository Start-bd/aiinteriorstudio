import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, X, Sparkles, Shield, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [hasShown, setHasShown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if popup was already shown in this session
    const alreadyShown = sessionStorage.getItem("exitIntentShown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when cursor moves toward the top of the viewport
      if (e.clientY <= 10 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    // Add delay before enabling exit intent
    const timeout = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000); // 5 second delay

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSaving) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim(), source: "exit_intent" });
    setIsSaving(false);

    if (error && error.code !== "23505") {
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("exitIntentSubscribed", "true");
    setIsOpen(false);
    toast({
      title: "You're on the list!",
      description: "Create your free account to start with 3 design credits.",
    });
    navigate(`/auth?mode=signup&email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-charcoal to-background border-primary/20">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-display font-bold">
            Wait! Get <span className="text-gradient-gold">3 Free Credits</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Don't leave empty-handed. Join our list and create a free account — every free
            account starts with 3 design credits to transform any room.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="relative">
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
          <Button type="submit" variant="gold" size="xl" className="w-full" disabled={isSaving}>
            <Sparkles className="w-5 h-5 mr-2" />
            {isSaving ? "Just a moment..." : "Claim My Free Credits"}
          </Button>
        </form>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            No spam ever
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-primary">✓</span>
            Unsubscribe anytime
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-primary">✓</span>
            Free to join
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
