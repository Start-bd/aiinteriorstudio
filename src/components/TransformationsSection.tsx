import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Import gallery images for before/after demos
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const transformations = [
  {
    before: gallery1,
    after: gallery2,
    roomType: "Living Room",
    style: "Modern",
  },
  {
    before: gallery3,
    after: gallery4,
    roomType: "Bedroom",
    style: "Scandinavian",
  },
  {
    before: gallery5,
    after: gallery6,
    roomType: "Kitchen",
    style: "Luxury",
  },
  {
    before: gallery2,
    after: gallery1,
    roomType: "Office",
    style: "Minimalist",
  },
  {
    before: gallery4,
    after: gallery3,
    roomType: "Bathroom",
    style: "Spa-like",
  },
  {
    before: gallery6,
    after: gallery5,
    roomType: "Dining Room",
    style: "Contemporary",
  },
];

const TransformationsSection = () => {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Transformations
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-4 mb-6">
            Real Transformations by <span className="text-gradient-gold">Our Users</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what's possible with Interior of AI
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-5xl mx-auto mb-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {transformations.map((transformation, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/2">
                  <div className="p-1">
                    <div className="relative rounded-xl overflow-hidden shadow-xl">
                      <BeforeAfterSlider
                        beforeImage={transformation.before}
                        afterImage={transformation.after}
                        beforeLabel="Before"
                        afterLabel="After"
                      />
                      {/* Labels */}
                      <div className="absolute bottom-12 left-3 right-3 flex justify-between items-center pointer-events-none">
                        <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                          {transformation.roomType}
                        </span>
                        <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                          {transformation.style}
                        </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
            <CarouselNext className="hidden md:flex -right-12 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
          </Carousel>

          {/* Mobile Navigation Hint */}
          <div className="flex justify-center mt-6 md:hidden">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <ChevronLeft className="w-4 h-4" />
              <span>Swipe to explore</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link to="/gallery">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 font-semibold group border-primary/50 hover:border-primary hover:bg-primary/10">
              See More Examples
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TransformationsSection;
