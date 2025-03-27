
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ParkingSpot } from '@/lib/types';
import { MapPin, Search, Filter, ArrowUpDown } from 'lucide-react';
import SpotCard from '@/components/ui/SpotCard';
import MapPlaceholder from '@/components/ui/MapPlaceholder';

// Sample data
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
    amenities: ["24/7 Access", "Security Camera", "Covered", "EV Charging"],
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
    available: true,
    image: "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    rating: 4.9,
    latitude: 0.7,
    longitude: 0.2,
    amenities: ["Valet", "Car Wash", "Security"],
    hostId: "host3",
    hostName: "Michael Brown",
    description: "Premium parking with valet service and optional car wash, located along the scenic waterfront.",
    totalSlots: 30,
    usedSlots: 20
  },
  {
    id: "4",
    name: "Airport Long-Term Parking",
    address: "101 Airport Blvd, San Francisco, CA",
    price: 25,
    priceUnit: "day",
    available: true,
    image: "https://images.unsplash.com/photo-1567365609463-add94a2922f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    rating: 4.2,
    latitude: 0.9,
    longitude: 0.1,
    amenities: ["Shuttle Service", "24/7 Access", "Security"],
    hostId: "host4",
    hostName: "Jennifer Lee",
    description: "Convenient long-term parking near the airport with complimentary shuttle service every 15 minutes.",
    totalSlots: 200,
    usedSlots: 120
  },
  {
    id: "5",
    name: "Shopping Mall Covered Parking",
    address: "555 Retail Row, San Francisco, CA",
    price: 8,
    priceUnit: "hour",
    available: true,
    image: "https://images.unsplash.com/photo-1611617403104-fed224957216?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    rating: 4.0,
    latitude: 0.4,
    longitude: 0.8,
    amenities: ["Indoor", "Security Camera", "EV Charging"],
    hostId: "host5",
    hostName: "Robert Wilson",
    description: "Covered parking at the heart of the shopping district with easy access to stores and restaurants.",
    totalSlots: 150,
    usedSlots: 75
  }
];

// Available filters
const AMENITIES_FILTERS = [
  "24/7 Access",
  "Security Camera",
  "Covered",
  "EV Charging",
  "Valet",
  "Car Wash",
  "Wheelchair Access",
  "Indoor",
  "Shuttle Service"
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [sortOption, setSortOption] = useState('price-asc');
  
  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      // Wait for "data" to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to Supabase
      setSpots(SAMPLE_SPOTS);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Apply filters
  useEffect(() => {
    if (!spots.length) return;
    
    let results = [...spots];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        spot => 
          spot.name.toLowerCase().includes(query) || 
          spot.address.toLowerCase().includes(query) ||
          spot.description.toLowerCase().includes(query)
      );
    }
    
    // Apply amenities filter
    if (selectedAmenities.length > 0) {
      results = results.filter(spot => 
        selectedAmenities.every(amenity => spot.amenities.includes(amenity))
      );
    }
    
    // Apply price range filter
    results = results.filter(
      spot => spot.price >= priceRange.min && spot.price <= priceRange.max
    );
    
    // Apply sorting
    results = sortSpots(results, sortOption);
    
    setFilteredSpots(results);
  }, [spots, searchQuery, selectedAmenities, priceRange, sortOption]);
  
  // Handle amenity toggle
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  // Sort function
  const sortSpots = (spotsToSort: ParkingSpot[], option: string) => {
    const sorted = [...spotsToSort];
    
    switch (option) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  };
  
  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Parking</h1>
      
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by location, address or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </form>
      
      {/* Filters section */}
      {showFilters && (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-3">Filter Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price range */}
            <div>
              <h4 className="text-sm font-medium mb-2">Price Range (per hour)</h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-20"
                />
                <span>to</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-20"
                />
              </div>
            </div>
            
            {/* Sorting */}
            <div>
              <h4 className="text-sm font-medium mb-2">Sort By</h4>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Amenities */}
            <div>
              <h4 className="text-sm font-medium mb-2">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES_FILTERS.slice(0, 6).map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`amenity-${amenity}`} 
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <label htmlFor={`amenity-${amenity}`} className="text-sm">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-2">
            <Button 
              variant="ghost" 
              onClick={() => {
                setSearchQuery('');
                setSelectedAmenities([]);
                setPriceRange({ min: 0, max: 100 });
                setSortOption('price-asc');
              }}
            >
              Reset Filters
            </Button>
            <Button onClick={() => setShowFilters(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
      
      {/* Results stats */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-muted-foreground">
          {isLoading 
            ? 'Loading results...' 
            : `Showing ${filteredSpots.length} results`
          }
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Results display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Results list */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredSpots.length === 0 ? (
            <div className="bg-muted rounded-lg p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No parking spots found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAmenities([]);
                  setPriceRange({ min: 0, max: 100 });
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          )}
        </div>
        
        {/* Right column - Map */}
        <div className="hidden lg:block">
          <div className="sticky top-4">
            <MapPlaceholder className="w-full h-[calc(100vh-120px)] bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
