
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Car, Menu, X, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if the current route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Track scrolling for transparent header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled
          ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-soft py-3'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary"
          >
            <Car className="w-8 h-8" />
            <span className="text-xl font-semibold tracking-tight animate-fade-in">
              SpaceDrive
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" active={isActive('/')}>
              Home
            </NavLink>
            <NavLink to="/dashboard" active={isActive('/dashboard')}>
              Dashboard
            </NavLink>
            <NavLink to="/host" active={isActive('/host')}>
              For Hosts
            </NavLink>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  More <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 animate-scale-in">
                <DropdownMenuItem asChild>
                  <Link to="/about" className="w-full">About Us</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="w-full">Contact</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/faq" className="w-full">FAQ</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button size="sm" className="animate-pulse-soft" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-soft p-4 animate-slide-down">
            <nav className="flex flex-col space-y-4 py-2">
              <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink to="/host" onClick={() => setIsMobileMenuOpen(false)}>
                For Hosts
              </MobileNavLink>
              <MobileNavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                About Us
              </MobileNavLink>
              <MobileNavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </MobileNavLink>
            </nav>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={cn(
      'text-sm font-medium transition-colors hover:text-primary',
      active ? 'text-primary' : 'text-foreground/80'
    )}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) => (
  <Link
    to={to}
    className="block py-2 text-foreground/80 hover:text-primary transition-colors"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Header;
