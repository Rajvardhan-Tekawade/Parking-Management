
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-12 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 text-primary">
              <Car className="w-6 h-6" />
              <span className="text-xl font-semibold tracking-tight">SpaceDrive</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Smart parking management made easy. Find, reserve, and manage parking spaces with our intuitive platform.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-medium mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/host">Become a Host</FooterLink>
              <FooterLink to="/dashboard">User Dashboard</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-medium mb-6">Services</h3>
            <ul className="space-y-4">
              <FooterLink to="/find-parking">Find Parking</FooterLink>
              <FooterLink to="/reserve">Reserve a Spot</FooterLink>
              <FooterLink to="/host-dashboard">Host Dashboard</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/support">Support</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-medium mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  123 Parking Avenue, San Francisco, CA 94103
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground text-sm">info@spacedrive.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SpaceDrive. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a
    href={href}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      {children}
    </Link>
  </li>
);

export default Footer;
