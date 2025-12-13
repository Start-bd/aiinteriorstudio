import { Instagram, Mail, ArrowUpRight } from "lucide-react";

const footerLinks = [
  { label: "Explore AI Interiors", href: "#" },
  { label: "Home Decor AI", href: "#" },
  { label: "Luxury AI Design", href: "#" },
  { label: "About", href: "#" },
  { label: "Media Kit", href: "#" },
  { label: "Contact", href: "#" },
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
                href="https://instagram.com/interiorofai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@interiorofai.com"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
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
            <a href="#" className="hover:text-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
