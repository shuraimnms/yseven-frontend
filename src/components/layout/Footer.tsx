import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone, Shield, FileCheck } from "lucide-react";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { 
    siteTitle, 
    supportEmail, 
    supportPhone, 
    officeAddress, 
    socialMedia 
  } = useGlobalSettings();

  // Provide fallback values to prevent undefined errors
  const safeSocialMedia = socialMedia || {
    facebook: 'https://facebook.com/y7sauces',
    instagram: 'https://instagram.com/y7sauces',
    twitter: 'https://twitter.com/y7sauces',
    youtube: 'https://youtube.com/@y7sauces'
  };

  const footerLinks = {
    shop: [
      { name: "All Products", href: "/products" },
      { name: "Classic Range", href: "/products?category=classic" },
      { name: "Spicy Range", href: "/products?category=spicy" },
      { name: "Best Sellers", href: "/products?filter=bestseller" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Partnerships", href: "/partnerships" },
    ],
    support: [
      { name: "Contact Us", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Bulk Orders", href: "/bulk-orders" },
      { name: "Export Services", href: "/export" },
      { name: "Certifications", href: "/certifications" },
      { name: "Quality & Safety", href: "/quality" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Refund Policy", href: "/refund" },
      { name: "Shipping Policy", href: "/shipping" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: safeSocialMedia.instagram, label: "Instagram" },
    { icon: Facebook, href: safeSocialMedia.facebook, label: "Facebook" },
    { icon: Twitter, href: safeSocialMedia.twitter, label: "Twitter" },
    { icon: Youtube, href: safeSocialMedia.youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-charcoal border-t border-gold/10">
      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-4xl font-display font-bold text-gradient-gold">Y7</span>
            </Link>
            <p className="text-cream/60 text-sm leading-relaxed mb-6 max-w-xs">
              Premium sauces crafted for bold kitchens worldwide. One Brand. Endless Flavor.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-cream/60 hover:text-gold hover:border-gold transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display text-gold text-sm tracking-luxury uppercase mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-cream/60 text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-gold text-sm tracking-luxury uppercase mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-cream/60 text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-gold text-sm tracking-luxury uppercase mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-cream/60 text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-gold text-sm tracking-luxury uppercase mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-cream/60 text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 pt-8 border-t border-gold/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-wrap gap-8 text-sm text-cream/60">
              <a href={`mailto:${supportEmail}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail className="w-4 h-4" />
                {supportEmail}
              </a>
              <a href={`tel:${supportPhone}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="w-4 h-4" />
                {supportPhone}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {officeAddress.split(',')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* APEDA Trust Strip */}
      <div className="border-t border-green-500/20 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="container mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-semibold text-sm">Trusted & Registered Exporter</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-cream/60">
              <div className="flex items-center gap-1">
                <FileCheck className="w-4 h-4 text-green-500" />
                <span>APEDA Registered Manufacturer Exporter</span>
              </div>
              <span>IEC: BQEPS7979D</span>
              <span>RCMC No: RCMC/APEDA/24897/2025-2026</span>
              <span className="text-green-500">Government of India Recognized Exporter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/10 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-cream/40">
            <p>© {currentYear} {siteTitle}. All rights reserved.</p>
            <p className="tracking-wide">Crafted with passion for flavor perfection</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
