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
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-background to-charcoal relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 ${getAnimationClasses(isVisible)}`}>
          <span className="text-primary uppercase tracking-widest text-sm font-medium">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-4 mb-4">
            Loved by <span className="text-gradient-gold">150,000+</span> Users
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what homeowners, designers, and professionals are saying about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass-card rounded-2xl p-6 hover-lift relative ${getAnimationClasses(isVisible)}`}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  loading="lazy"
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className={`flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-border ${getAnimationClasses(isVisible)}`} style={{ transitionDelay: isVisible ? '600ms' : '0ms' }}>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">12,847</div>
            <div className="text-sm text-muted-foreground">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">98%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
