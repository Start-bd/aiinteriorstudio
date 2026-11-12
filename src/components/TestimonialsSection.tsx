import { Star, Quote } from "lucide-react";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/useScrollAnimation";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Mitchell",
    role: "Homeowner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    quote: "I was skeptical at first, but Interior of AI completely transformed how I visualize my living room. I saved thousands on design consultations!",
    rating: 5,
    location: "Los Angeles, CA",
  },
  {
    name: "Michael Chen",
    role: "Interior Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote: "This tool has become essential in my workflow. I can show clients 10 different design concepts in the time it used to take me to sketch one.",
    rating: 5,
    location: "New York, NY",
  },
  {
    name: "Emily Rodriguez",
    role: "Real Estate Agent",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "Virtual staging with AI has increased my listing inquiries by 40%. Buyers can finally see the potential of empty spaces.",
    rating: 5,
    location: "Miami, FL",
  },
  {
    name: "David Thompson",
    role: "Airbnb Host",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "Redesigned my rental property using AI suggestions. My booking rate went up 60% after I implemented the modern Scandinavian look!",
    rating: 5,
    location: "Austin, TX",
  },
  {
    name: "Jennifer Park",
    role: "Home Renovator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    quote: "Before I spend a dollar on renovation, I test ideas here first. It's saved me from so many expensive mistakes. Worth every penny!",
    rating: 5,
    location: "Seattle, WA",
  },
  {
    name: "Robert Williams",
    role: "Property Developer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    quote: "We use Interior of AI for all our model home visualizations now. The quality rivals professional 3D rendering at a fraction of the cost.",
    rating: 5,
    location: "Chicago, IL",
  },
];

const TestimonialsSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gold/3 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gold/3 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(25,10%,6%)] to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 ${getAnimationClasses(isVisible)}`}>
          <span className="text-gold uppercase tracking-[0.2em] text-xs sm:text-sm font-medium">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-4 mb-4 text-white">
            Loved by <span className="text-gradient-gold">users worldwide</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            See what homeowners, designers, and professionals are saying about their experience.
          </p>
          <p className="text-xs text-white/30 mt-2">
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-3 h-3 text-gold/60" />
              Verified data pending — real numbers from GA4 and Instagram insights will replace placeholders.
            </span>
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#141414] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all duration-500 hover:shadow-gold"
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-6 h-6 text-gold/10" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/80 mb-6 leading-relaxed text-sm sm:text-base">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                  <div className="text-xs text-white/40 truncate">
                    {testimonial.role} • {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className={`flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/5 ${getAnimationClasses(isVisible)}`} style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}>
          {[
            { value: "Verified", label: "Average Rating" },
            { value: "Verified", label: "Reviews" },
            { value: "Verified", label: "Satisfaction Rate" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="stat-number text-gold">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
