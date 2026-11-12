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
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/useScrollAnimation";

// Import transformation images
import livingRoomBefore from "@/assets/transformations/living-room-before.jpg";
import livingRoomAfter from "@/assets/transformations/living-room-after.jpg";
import bedroomBefore from "@/assets/transformations/bedroom-before.jpg";
import bedroomAfter from "@/assets/transformations/bedroom-after.jpg";
import kitchenBefore from "@/assets/transformations/kitchen-before.jpg";
import kitchenAfter from "@/assets/transformations/kitchen-after.jpg";
import officeBefore from "@/assets/transformations/office-before.jpg";
import officeAfter from "@/assets/transformations/office-after.jpg";
import bathroomBefore from "@/assets/transformations/bathroom-before.jpg";
import bathroomAfter from "@/assets/transformations/bathroom-after.jpg";
import diningBefore from "@/assets/transformations/dining-before.jpg";
import diningAfter from "@/assets/transformations/dining-after.jpg";

const transformations = [
  {
    before: livingRoomBefore,
    after: livingRoomAfter,
    roomType: "Living Room",
    style: "Modern",
  },
  {
    before: bedroomBefore,
    after: bedroomAfter,
    roomType: "Bedroom",
    style: "Scandinavian",
  },
  {
    before: kitchenBefore,
    after: kitchenAfter,
    roomType: "Kitchen",
    style: "Luxury",
  },
  {
    before: officeBefore,
    after: officeAfter,
    roomType: "Office",
    style: "Minimalist",
  },
  {
    before: bathroomBefore,
    after: bathroomAfter,
    roomType: "Bathroom",
    style: "Spa-like",
  },
  {
    before: diningBefore,
    after: diningAfter,
    roomType: "Dining Room",
    style: "Contemporary",
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds per slide

const TransformationsSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  // Handle carousel selection changes
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setProgress(0); // Reset progress on slide change
    });
  }, [api]);

  // Autoplay with progress
  useEffect(() => {
    if (!api || isPaused) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          api.scrollNext();
          return 0;
        }
        return prev + (100 / (AUTOPLAY_INTERVAL / 50)); // Update every 50ms
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [api, isPaused]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    setProgress(0);
  }, []);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
    setProgress(0);
  }, [api]);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-gold/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gold/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(25,10%,6%)] to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-14 ${getAnimationClasses(isVisible)}`}>
          <span className="text-gold uppercase tracking-[0.2em] text-xs sm:text-sm font-medium">
            Transformations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 mb-4 text-white">
            Real Transformations by <span className="text-gradient-gold">Our Users</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            See what's possible with Interior of AI — before and after, in your style.
          </p>
        </div>

        {/* Carousel */}
        <div
          className={`max-w-6xl mx-auto mb-8 rounded-2xl overflow-hidden ${getAnimationClasses(isVisible)}`
          }
          style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {transformations.map((transformation, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/2">
                  <div className="p-1">
                    <div className="relative rounded-xl overflow-hidden shadow-gold">
                      <BeforeAfterSlider
                        beforeImage={transformation.before}
                        afterImage={transformation.after}
                        beforeLabel="Before"
                        afterLabel="After"
                      />
                      {/* Labels */}
                      <div className="absolute bottom-12 left-3 right-3 flex justify-between items-center pointer-events-none">
                        <span className="bg-[#141414] border border-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-3.5 py-1.5 rounded-full">
                          {transformation.roomType}
                        </span>
                        <span className="bg-gold/20 backdrop-blur-sm text-gold text-xs font-medium px-3.5 py-1.5 rounded-full">
                          {transformation.style}
                        </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-[#141414]/90 backdrop-blur-sm border-white/10 hover:bg-[#141414] text-white/80" />
            <CarouselNext className="hidden md:flex -right-12 bg-[#141414]/90 backdrop-blur-sm border-white/10 hover:bg-[#141414] text-white/80" />
          </Carousel>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "relative h-1.5 rounded-full overflow-hidden transition-all duration-300",
                  index === current ? "w-10 bg-gold" : "w-1.5 bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === current && (
                  <div
                    className="absolute inset-y-0 left-0 bg-gold-dark rounded-full transition-all duration-50"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Navigation Hint */}
          <div className="flex justify-center mt-4 md:hidden">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <ChevronLeft className="w-4 h-4" />
              <span>Swipe to explore</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link to="/gallery">
            <Button
              variant="gold"
              size="lg"
              className="text-lg px-8 py-5 font-semibold"
            >
              See More Examples
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TransformationsSection;
