import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    question: "What is AI interior design?",
    answer:
      "AI interior design uses artificial intelligence to analyze your room photo and generate professional redesign concepts in different styles — all in seconds. No design experience needed.",
  },
  {
    question: "Do I need design experience?",
    answer:
      "No! Interior of AI is built for everyone. Just upload a photo, pick a style, and let the AI do the work. It's that simple.",
  },
  {
    question: "Can I use the designs commercially?",
    answer:
      "Free users get watermarked designs for personal use. Pro users get HD, watermark-free designs with full commercial rights for client projects, listings, and marketing.",
  },
  {
    question: "What room types are supported?",
    answer:
      "Living rooms, bedrooms, kitchens, bathrooms, offices, dining rooms, entryways, outdoor spaces, and more. If it's a space, we can redesign it.",
  },
  {
    question: "How accurate are the designs?",
    answer:
      "Our AI generates photorealistic designs based on real interior design principles. You can refine results by providing more details or trying different styles.",
  },
  {
    question: "What file formats can I download?",
    answer:
      "Pro users can download designs in JPG and PNG formats in HD quality (up to 4K resolution).",
  },
  {
    question: "How many designs can I create?",
    answer:
      "Free users get 10 designs per month. Pro users get 100 designs per month. Enterprise users get unlimited designs.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes! We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.",
  },
];

export const FAQSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();
  
  return (
    <section ref={sectionRef} id="faq" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 ${getAnimationClasses(isVisible)}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Got Questions?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Interior of AI
          </p>
        </div>

        <div className={`max-w-3xl mx-auto ${getAnimationClasses(isVisible)}`} style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
          <Accordion 
            type="multiple" 
            defaultValue={["item-0", "item-1"]} 
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border-border rounded-xl px-6 data-[state=open]:ring-1 data-[state=open]:ring-primary/20 transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-lg font-medium hover:text-primary transition-colors py-6 [&[data-state=open]>svg]:rotate-180">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12 space-y-4">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
          >
            View All FAQs
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a
              href="mailto:hello@interiorofai.com"
              className="text-primary hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
