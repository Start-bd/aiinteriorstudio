import { Instagram, Mail, ArrowUpRight, MessageCircle } from "lucide-react";

const footerLinks = [
  { label: "Explore AI Interiors", href: "#ai-generator" },
  { label: "Home AI", href: "https://homeai.design", external: true },
  { label: "Luxury AI Design", href: "https://luxuryai.design", external: true },
  { label: "About", href: "#about" },
  { label: "House AI", href: "https://houseai.design", external: true },
  { label: "Contact", href: "#newsletter" },
];

const Footer = () => {
  return (
    <footer className="py-16 bg-charcoal border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold">
              Interior <span className="text-gradient-gold">of AI</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Exploring the future of interior design through artificial intelligence.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/interiorofai?igsh=bWFyb3VrZXA1ejQ4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@interiorofai.com"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/13074001973"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.slice(0, 4).map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-foreground hover:text-gold transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.slice(4).map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-foreground hover:text-gold transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Interior of AI © {new Date().getFullYear()} — Exploring the future of interior design through artificial intelligence.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="mailto:hello@interiorofai.com" className="hover:text-gold transition-colors">Contact</a>
            <a href="https://wa.me/13074001973" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
