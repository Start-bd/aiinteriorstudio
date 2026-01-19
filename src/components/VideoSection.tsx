import { Play } from "lucide-react";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/useScrollAnimation";

interface VideoSectionProps {
  videoId?: string; // YouTube video ID
  title?: string;
  subtitle?: string;
}

const VideoSection = ({ 
  videoId = "dQw4w9WgXcQ", // Placeholder - replace with actual video ID
  title = "See How It Works",
  subtitle = "Watch how Interior of AI transforms spaces in seconds"
}: VideoSectionProps) => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-12 ${getAnimationClasses(isVisible)}`}>
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Video
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-4 mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div 
          className={`max-w-4xl mx-auto ${getAnimationClasses(isVisible)}`}
          style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-secondary">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title="Interior of AI Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
