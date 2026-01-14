import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";
import { useEffect } from "react";

// Curator.io Feed ID - Replace with your actual feed ID from curator.io
const CURATOR_FEED_ID = "your-feed-id-here";

const InstagramSection = () => {
  useEffect(() => {
    // Load Curator.io script dynamically
    const script = document.createElement("script");
    script.src = "https://cdn.curator.io/published/your-feed-id-here.js";
    script.async = true;
    script.defer = true;
    
    // Only load if feed ID is configured
    if (CURATOR_FEED_ID !== "your-feed-id-here") {
      script.src = `https://cdn.curator.io/published/${CURATOR_FEED_ID}.js`;
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        `script[src*="cdn.curator.io"]`
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 mb-6">
            <Instagram className="w-4 h-4" />
            <span className="text-sm font-medium">@interiorofai</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Join <span className="text-gradient-gold">431K Followers</span> on Instagram
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See daily design inspiration and real user transformations
          </p>
        </div>

        {/* Curator.io Feed Container */}
        <div className="max-w-5xl mx-auto mb-10">
          {CURATOR_FEED_ID === "your-feed-id-here" ? (
            // Placeholder when feed is not configured
            <div className="bg-muted/50 rounded-xl p-12 text-center border border-dashed border-muted-foreground/30">
              <Instagram className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Instagram Feed Coming Soon</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                To display live Instagram posts, configure your Curator.io feed ID in the component.
              </p>
              <div className="text-xs text-muted-foreground/70 bg-muted/50 rounded-lg p-4 max-w-lg mx-auto">
                <p className="font-mono">1. Create a free account at curator.io</p>
                <p className="font-mono">2. Connect your Instagram @interiorofai</p>
                <p className="font-mono">3. Copy your feed ID and update CURATOR_FEED_ID</p>
              </div>
            </div>
          ) : (
            // Curator.io feed embed
            <div 
              id="curator-feed-default-feed-layout"
              className="min-h-[400px]"
            >
              <a 
                href="https://curator.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="crt-logo crt-tag"
              >
                Powered by Curator.io
              </a>
            </div>
          )}
        </div>

        {/* Follow CTA */}
        <div className="text-center space-y-6">
          <a
            href="https://www.instagram.com/interiorofai/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                @interiorofai
              </div>
              <div className="text-sm text-muted-foreground">
                Follow us on Instagram →
              </div>
            </div>
          </a>

          <div className="pt-4">
            <a
              href="https://www.instagram.com/interiorofai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 hover:from-pink-600 hover:via-purple-600 hover:to-orange-500 text-white font-semibold px-8"
              >
                <Instagram className="mr-2 h-5 w-5" />
                Follow @interiorofai
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
