
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Car, Zap } from "lucide-react";
import { ParkingSpot } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SpotCardProps {
  spot: ParkingSpot;
  className?: string;
  featured?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const SpotCard = ({ spot, className, featured = false, style, onClick }: SpotCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-soft-lg group",
        featured ? "border-primary/20" : "border-transparent hover:border-primary/10",
        className
      )}
      style={style}
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <div className={cn(
          "absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse",
          isImageLoaded && "hidden"
        )} />
        
        <img
          src={spot.image || 'https://placehold.co/600x400?text=No+Image'}
          alt={spot.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
            !isImageLoaded && "opacity-0",
            isImageLoaded && "opacity-100"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm py-1 px-3 rounded-full shadow-soft text-sm font-medium">
          ${spot.price}/{spot.priceUnit}
        </div>
        
        {featured && (
          <div className="absolute top-3 left-3 bg-primary text-white py-1 px-3 rounded-full shadow-soft text-xs font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Featured
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm py-1 px-2 rounded-full shadow-soft">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-medium">{spot.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {spot.name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{spot.address}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {spot.amenities && spot.amenities.slice(0, 3).map((amenity, index) => (
            <span 
              key={index}
              className="text-xs py-1 px-2 bg-secondary rounded-full text-muted-foreground"
            >
              {amenity}
            </span>
          ))}
          {spot.amenities && spot.amenities.length > 3 && (
            <span className="text-xs py-1 px-2 bg-secondary rounded-full text-muted-foreground">
              +{spot.amenities.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className={cn(
              "font-medium",
              spot.available ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
            )}>
              {spot.available ? "Available Now" : "Unavailable"}
            </span>
          </div>
          
          <Button 
            size="sm" 
            className="group-hover:bg-primary group-hover:text-white transition-colors"
            variant={featured ? "default" : "outline"}
            asChild
          >
            <Link to={`/spot/${spot.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SpotCard;
