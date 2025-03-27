
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Car, 
  CreditCard, 
  Star, 
  Shield, 
  Wifi, 
  Droplets, 
  Zap, 
  Camera, 
  ArrowLeft 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MapPlaceholder from '@/components/ui/MapPlaceholder';
import { ParkingSpot } from '@/lib/types';
import { cn } from '@/lib/utils';

// Sample spot data - this would be fetched from Supabase in the actual implementation
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
    amenities: ["24/7 Access", "Security Camera", "Covered", "EV Charging", "Valet Service", "Car Wash"],
    hostId: "host1",
    hostName: "John Smith",
    description: "Secure parking in the heart of downtown with 24/7 access and security monitoring. Perfect for daily commuters or visitors to downtown attractions. Multiple entry and exit points for convenience.",
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

const SpotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [spot, setSpot] = useState<ParkingSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call to Supabase
    const fetchSpot = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const foundSpot = SAMPLE_SPOTS.find(s => s.id === id);
        if (foundSpot) {
          setSpot(foundSpot);
        }
        setLoading(false);
      }, 500);
    };

    fetchSpot();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Parking Spot Not Found</h1>
        <p className="text-muted-foreground mb-6">The parking spot you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to search results
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Spot images and title */}
          <div>
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">
              <img 
                src={spot.image} 
                alt={spot.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{spot.name}</h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{spot.address}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span>{spot.rating.toFixed(1)} (124 reviews)</span>
              </div>
              <Badge variant={spot.available ? "success" : "destructive"} className="ml-auto">
                {spot.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            
            <div className="text-xl font-semibold">
              ${spot.price}/{spot.priceUnit}
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">About this parking space</h2>
            <p className="text-muted-foreground">
              {spot.description}
            </p>
          </div>
          
          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {spot.amenities.includes("24/7 Access") && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>24/7 Access</span>
                </div>
              )}
              {spot.amenities.includes("Security Camera") && (
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  <span>Security Camera</span>
                </div>
              )}
              {spot.amenities.includes("Covered") && (
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary" />
                  <span>Covered</span>
                </div>
              )}
              {spot.amenities.includes("EV Charging") && (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>EV Charging</span>
                </div>
              )}
              {spot.amenities.includes("Wifi") && (
                <div className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-primary" />
                  <span>Free Wifi</span>
                </div>
              )}
              {spot.amenities.includes("Security") && (
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Security</span>
                </div>
              )}
              {spot.amenities.map(amenity => 
                !["24/7 Access", "Security Camera", "Covered", "EV Charging", "Wifi", "Security"].includes(amenity) && (
                  <div key={amenity} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span>{amenity}</span>
                  </div>
                )
              )}
            </div>
          </div>
          
          {/* Map */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="rounded-xl overflow-hidden border">
              <MapPlaceholder 
                spots={[spot]}
                highlightedSpotId={spot.id}
                className="h-[300px]"
              />
            </div>
          </div>
          
          {/* Host information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Hosted by</h2>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${spot.hostName}&background=random`} />
                <AvatarFallback>{spot.hostName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{spot.hostName}</div>
                <div className="text-sm text-muted-foreground">Hosting since January 2023</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Reserve this spot</CardTitle>
              <CardDescription>Choose your time slot and book instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium mb-2">Price</div>
                <div className="text-2xl font-bold">${spot.price}/{spot.priceUnit}</div>
              </div>
              
              <Separator />
              
              <div>
                <div className="font-medium mb-2">Select dates</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Start date
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    End date
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-2">Select time</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Start time
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    End time
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-2">Vehicle</div>
                <Button variant="outline" className="w-full justify-start">
                  <Car className="mr-2 h-4 w-4" />
                  Select vehicle
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full mb-3" size="lg" disabled={!spot.available}>
                <CreditCard className="mr-2 h-4 w-4" />
                {spot.available ? "Book Now" : "Currently Unavailable"}
              </Button>
              
              <div className="text-xs text-center text-muted-foreground">
                You won't be charged yet. Payment will be processed upon confirmation.
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpotDetail;
