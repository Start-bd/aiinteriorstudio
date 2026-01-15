import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPreviewSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <span className="text-gold uppercase tracking-widest text-sm font-medium">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-6">
                Democratizing Professional Interior Design
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Interior of AI, a product of <span className="text-foreground font-medium">AvailableView LLC</span>, 
                combines advanced machine learning with design expertise to deliver instant, photorealistic room makeovers. 
                We've helped over 150,000 users transform 2.5M+ rooms using cutting-edge AI technology.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                With a community of <span className="text-foreground font-medium">431K+ followers on Instagram</span> and 
                users in 180+ countries, we're leading the AI interior design revolution.
              </p>
              <Link to="/#about">
                <Button variant="gold-outline" className="group">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreviewSection;
