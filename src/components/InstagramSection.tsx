import { Button } from "@/components/ui/button";
import { Instagram, Camera, Heart } from "lucide-react";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const InstagramSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-charcoal relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <span className="text-gold uppercase tracking-widest text-sm font-medium">Community</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              Instagram-Powered
              <br />
              <span className="text-gradient-gold">Design Community</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Interior of AI started as a visual-first movement on Instagram and evolved into a 
              multi-platform AI design brand. Join millions who discover AI interior concepts daily.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">50M+</div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">1M+</div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
              </div>
            </div>

            <Button variant="gold" size="lg" className="mt-6 group">
              <Instagram className="mr-2 h-5 w-5" />
              Follow @interiorofai
            </Button>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-gold/5 rounded-3xl blur-2xl opacity-50" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden hover-lift">
                  <img src={gallery2} alt="Instagram post preview" className="w-full aspect-square object-cover" />
                </div>
                <div className="glass-card rounded-2xl p-4 text-center">
                  <div className="text-3xl font-display font-bold text-gradient-gold">180+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="glass-card rounded-2xl p-4 text-center">
                  <Instagram className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">@interiorofai</div>
                </div>
                <div className="rounded-2xl overflow-hidden hover-lift">
                  <img src={gallery6} alt="Instagram post preview" className="w-full aspect-square object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
