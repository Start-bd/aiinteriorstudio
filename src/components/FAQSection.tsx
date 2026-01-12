import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is AI interior design?",
    answer:
      "AI interior design uses artificial intelligence to generate stunning, photorealistic room visualizations based on your preferences. Simply describe your ideal space—style, colors, room type—and our AI creates beautiful design concepts in seconds, helping you visualize possibilities before committing to any changes.",
  },
  {
    question: "How many credits do I need per design?",
    answer:
      "Each AI-generated design uses 1 credit. Free users start with 3 credits to explore the platform. Our subscription plans offer monthly credit allowances, and you can also purchase credit packs that never expire for maximum flexibility.",
  },
  {
    question: "What styles and room types are available?",
    answer:
      "We offer 20+ design styles including Modern, Minimalist, Scandinavian, Industrial, Bohemian, Art Deco, Japanese, Mediterranean, and many more. Room types include living rooms, bedrooms, kitchens, bathrooms, home offices, dining rooms, and outdoor spaces.",
  },
  {
    question: "Can I use the generated designs commercially?",
    answer:
      "Yes! All designs generated with your account are yours to use. Pro and Business subscribers get full commercial usage rights, perfect for interior designers, real estate agents, and design professionals looking to present concepts to clients.",
  },
  {
    question: "How do collections and sharing work?",
    answer:
      "You can organize your favorite designs into collections, making it easy to compare options or share mood boards. Collections can be made public with a shareable link, or kept private. You can also export collections as PDFs or ZIP files for presentations.",
  },
  {
    question: "What's the difference between subscription plans?",
    answer:
      "Free users get 3 credits to start. Basic ($9/mo) includes 50 credits and all styles. Pro ($29/mo) offers 200 credits, priority generation, and commercial rights. Business ($79/mo) provides 500 credits, team features, and dedicated support. All paid plans include yearly discounts of 20%.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely! You can cancel your subscription at any time from your profile settings. You'll continue to have access to your plan's features until the end of your current billing period. Any unused credits from credit packs remain available even after cancellation.",
  },
  {
    question: "How realistic are the AI-generated designs?",
    answer:
      "Our AI produces photorealistic interior visualizations that look like professional photography. While they're AI-generated concepts rather than real photos, they're excellent for inspiration, client presentations, and visualizing design possibilities before making real-world decisions.",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Got Questions?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about AI interior design and our platform
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border-border rounded-xl px-6 data-[state=open]:ring-1 data-[state=open]:ring-primary/20 transition-all"
              >
                <AccordionTrigger className="text-left text-lg font-medium hover:text-primary transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
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
