import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AboutPreviewSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <span className="text-gold uppercase tracking-widest text-sm font-medium">Our Philosophy</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-6">
                Redefining How Spaces Are Designed
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Interior of AI is an independent AI-focused media brand exploring the intersection of 
                interior design, technology, and artificial intelligence. We believe AI will not replace 
                creativity — it will <span className="text-foreground font-medium">expand it</span>. 
                Our platform exists to inspire designers, homeowners, creators, and brands to imagine 
                what's possible when AI meets living spaces.
              </p>
              <Button variant="gold-outline" className="group">
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreviewSection;
