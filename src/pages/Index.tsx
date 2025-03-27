import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SpotCard from '@/components/ui/SpotCard';
import MapPlaceholder from '@/components/ui/MapPlaceholder';
import { Car, User, MapPin, Calendar, CreditCard, Star, ArrowRight, Search, Clock, Shield, Building } from "lucide-react";
import { ParkingSpot } from '@/lib/types';
import { cn } from '@/lib/utils';

// Sample parking spots data
const SAMPLE_SPOTS: ParkingSpot[] = [
  {
    id: "1",
    name: "Downtown Secure Parking",
    address: "123 Main St, San Francisco, CA",
    price: 15,
    priceUnit: "hour",
    available: true,
    image: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    rating: 4.8,
    latitude: 0.5,
    longitude: 0.6,
    amenities: ["24/7 Access", "Security Camera", "Covered"],
    hostId: "host1",
    hostName: "John Smith",
    description: "Secure parking in the heart of downtown with 24/7 access and security monitoring.",
    totalSlots: 20,
    usedSlots: 5
  },
  {
    id: "2",
    name: "City Center Garage",
    address: "456 Market St, San Francisco, CA",
    price: 12,
    priceUnit: "hour",
    available: true,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    rating: 4.5,
    latitude: 0.3,
    longitude: 0.4,
    amenities: ["EV Charging", "Wheelchair Access", "Indoor"],
    hostId: "host2",
    hostName: "Sarah Johnson",
    description: "Centrally located garage with EV charging stations and easy access to public transit.",
    totalSlots: 50,
    usedSlots: 25
  },
  {
    id: "3",
    name: "Waterfront Premium Parking",
    address: "789 Embarcadero, San Francisco, CA",
    price: 18,
    priceUnit: "hour",
    available: false,
    image: "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    rating: 4.9,
    latitude: 0.7,
    longitude: 0.2,
    amenities: ["Valet", "Car Wash", "Security"],
    hostId: "host3",
    hostName: "Michael Brown",
    description: "Premium parking with valet service and optional car wash, located along the scenic waterfront.",
    totalSlots: 30,
    usedSlots: 30
  }
];

const Index = () => {
  const [selectedSpotId, setSelectedSpotId] = useState<string | undefined>(undefined);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute inset-0 bg-gradient-radial from-blue-50/70 to-background" />
          <div className="absolute inset-0 bg-noise opacity-[0.02]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-conic from-blue-100/40 via-blue-50/20 to-transparent opacity-60 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl animate-slide-up">
              <div className="inline-block bg-secondary px-4 py-1.5 rounded-full">
                <span className="text-xs font-medium text-primary">Smart Parking Solutions</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Find and Reserve Your <span className="text-primary">Perfect Parking Spot</span>
              </h1>
              
              <p className="text-lg text-muted-foreground">
                SpaceDrive makes parking easy. Discover, book, and manage parking spaces with our intuitive platform.
              </p>
              
              {/* Search Box */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter location..."
                    className="pl-10 h-12 rounded-lg border border-input bg-white/70 backdrop-blur-sm"
                  />
                </div>
                <Button size="lg" className="h-12 px-8 shrink-0">
                  <Search className="mr-2 h-4 w-4" /> Find Parking
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-radial from-blue-100/20 to-transparent rounded-full blur-2xl opacity-70" />
              <MapPlaceholder 
                className="rounded-2xl shadow-soft-lg border-2 border-white/80 dark:border-gray-800/80 backdrop-blur-sm animate-scale-in"
                spots={SAMPLE_SPOTS} 
                highlightedSpotId={selectedSpotId}
                onSelectSpot={setSelectedSpotId}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Parking Made Simple
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the key features that make SpaceDrive the smart choice for all your parking needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-6 h-6" />}
              title="Find Nearby Spots"
              description="Easily locate available parking spaces near your destination with our interactive map."
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Reserve in Advance"
              description="Book your parking space ahead of time to ensure availability when you arrive."
            />
            <FeatureCard
              icon={<CreditCard className="w-6 h-6" />}
              title="Seamless Payments"
              description="Enjoy hassle-free payments with our secure and convenient payment system."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Flexible Duration"
              description="Choose the exact duration you need, from hourly to monthly parking options."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Secure Parking"
              description="Rest easy knowing your vehicle is parked in a safe and monitored location."
            />
            <FeatureCard
              icon={<Building className="w-6 h-6" />}
              title="Host Your Space"
              description="Turn your unused parking space into income by becoming a SpaceDrive host."
            />
          </div>
        </div>
      </section>
      
      {/* Featured Spots Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Featured Parking Spots
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explore our selection of premium parking locations handpicked for their convenience and quality.
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" asChild>
              <Link to="/spots">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {SAMPLE_SPOTS.map((spot, index) => (
              <SpotCard 
                key={spot.id} 
                spot={spot} 
                featured={index === 0}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Are You a Property Owner?
              </h2>
              <p className="text-lg text-muted-foreground">
                Turn your unused parking spaces into income. Join SpaceDrive as a host and start monetizing your property today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/host">
                    <User className="mr-2 h-5 w-5" /> Become a Host
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/host-info">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Card className="overflow-hidden border-0 shadow-soft-lg rounded-2xl animate-scale-in">
                <CardHeader className="bg-primary text-primary-foreground p-6">
                  <CardTitle className="text-2xl">Host Benefits</CardTitle>
                  <CardDescription className="text-primary-foreground/90">
                    Why you should list your parking space with us
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <BenefitItem>
                      Generate passive income from your unused spaces
                    </BenefitItem>
                    <BenefitItem>
                      Complete control over availability and pricing
                    </BenefitItem>
                    <BenefitItem>
                      Secure payment processing and insurance coverage
                    </BenefitItem>
                    <BenefitItem>
                      Detailed analytics to maximize your revenue
                    </BenefitItem>
                    <BenefitItem>
                      24/7 customer support for you and your customers
                    </BenefitItem>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it. Here's what people are saying about SpaceDrive.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Finding parking used to be a nightmare. With SpaceDrive, I can reserve my spot before I even leave home. Game changer!"
              author="Emma T."
              role="Regular User"
              rating={5}
              className="md:translate-y-8 animate-fade-in"
            />
            <TestimonialCard
              quote="As a business owner, renting out our extra parking spaces has created a new revenue stream that we never considered before."
              author="David M."
              role="Business Host"
              rating={5}
              className="animate-fade-in"
            />
            <TestimonialCard
              quote="The interface is intuitive and beautiful. I love how easy it is to find and book parking near my office."
              author="Sophie K."
              role="Daily Commuter"
              rating={4.5}
              className="md:translate-y-8 animate-fade-in"
            />
          </div>
        </div>
      </section>
      
      {/* Download App Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Get the SpaceDrive App
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Take SpaceDrive with you on the go. Our mobile app makes finding and reserving parking even easier.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="h-14 px-6" asChild>
                  <a href="#" className="flex items-center">
                    <AppleIcon className="mr-2 h-6 w-6" />
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-base font-medium">App Store</div>
                    </div>
                  </a>
                </Button>
                <Button className="h-14 px-6" asChild>
                  <a href="#" className="flex items-center">
                    <GooglePlayIcon className="mr-2 h-6 w-6" />
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="text-base font-medium">Google Play</div>
                    </div>
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-float">
              <div className="absolute -inset-8 bg-gradient-radial from-blue-100/30 to-transparent rounded-full blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1511316652-1a3d24c9e8b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
                alt="SpaceDrive Mobile App"
                className="relative w-full max-w-xs mx-auto rounded-2xl shadow-soft-lg border-2 border-white dark:border-gray-800"
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="glass-card border-0 p-6 h-full hover:translate-y-[-5px] transition-all duration-300 animate-fade-in">
    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
      <div className="text-primary">{icon}</div>
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </Card>
);

const BenefitItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <div className="p-1 bg-primary/10 rounded-full mt-0.5">
      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span>{children}</span>
  </li>
);

const TestimonialCard = ({ quote, author, role, rating, className }: { 
  quote: string; 
  author: string; 
  role: string; 
  rating: number;
  className?: string;
}) => (
  <Card className={cn("p-6 glass-card border-0", className)}>
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={cn(
            "w-4 h-4", 
            i < Math.floor(rating) 
              ? "text-yellow-500 fill-yellow-500" 
              : i < rating 
                ? "text-yellow-500 fill-yellow-500 opacity-70" 
                : "text-gray-300 dark:text-gray-600"
          )} 
        />
      ))}
    </div>
    <p className="text-lg mb-6 italic">"{quote}"</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </Card>
);

// App Store Icons
const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const GooglePlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.536-3.536l-2.302 2.302-8.635-8.635 10.937 6.333zm2.07.807a1 1 0 0 1 0 1.82l-2.536 1.465-2.773-2.772 2.773-2.772 2.536 1.465z" />
  </svg>
);

export default Index;
