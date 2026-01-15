import { Instagram, Youtube, Facebook, Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const productLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Design Styles", href: "#transformations" },
  { label: "AI Design Assistant", href: "/generate" },
  { label: "API Access", href: "#newsletter" },
];

const resourceLinks = [
  { label: "Blog", href: "#" },
  { label: "Design Inspiration", href: "/gallery" },
  { label: "Help Center", href: "#faq" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact Us", href: "/contact" },
];

const companyLinks = [
  { label: "About Us", href: "#about" },
  { label: "Careers", href: "#" },
  { label: "Press Kit", href: "#" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "#" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/interiorofai",
    icon: Instagram,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@interiorofai",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/interiorofai",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/interiorofai",
    icon: Facebook,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@interiorofai",
    icon: Youtube,
  },
];

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Handle mailto links
    if (href.startsWith("mailto:")) return;
    
    // Handle external links
    if (href.startsWith("http")) return;
    
    // Handle page routes (not anchors)
    if (href.startsWith("/") && !href.includes("#")) {
      e.preventDefault();
      navigate(href);
      return;
    }
    
    // Handle anchor links
    if (href.startsWith("#")) {
      e.preventDefault();
      const sectionId = href.replace("#", "");
      
      if (location.pathname === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate(`/${href}`);
      }
    }
  };

  const renderLink = (link: { label: string; href: string }, index: number) => {
    const isExternal = link.href.startsWith("http");
    const isMailto = link.href.startsWith("mailto:");
    
    return (
      <li key={index}>
        <a
          href={link.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={(e) => !isExternal && !isMailto && handleLinkClick(e, link.href)}
          className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
        >
          {link.label}
        </a>
      </li>
    );
  };

  return (
    <footer className="py-16 bg-charcoal border-t border-border">
      <div className="container mx-auto px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-5">
            <h3 className="text-2xl font-display font-bold">
              Interior <span className="text-gradient-gold">of AI</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AI-powered interior design tool for homeowners, designers, and agencies. Generate professional room makeovers in seconds.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground font-semibold mb-5">
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link, index) => renderLink(link, index))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground font-semibold mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => renderLink(link, index))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground font-semibold mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => renderLink(link, index))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">AvailableView LLC</p>
            <p>30 N Gould St STE R, Sheridan, WY 82801, USA</p>
            <p className="mt-2">
              <a href="mailto:hello@interiorofai.com" className="hover:text-primary transition-colors">hello@interiorofai.com</a>
              {" · "}
              <a href="mailto:support@interiorofai.com" className="hover:text-primary transition-colors">support@interiorofai.com</a>
            </p>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2022 AvailableView LLC. All rights reserved. Interior of AI is a registered trademark of AvailableView LLC. | Made with{" "}
            <Heart className="inline-block w-4 h-4 text-red-500 fill-red-500 mx-1" />
            for designers and dreamers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
