
import { useEffect, useState } from 'react';
import { ParkingSpot } from '@/lib/types';
import { cn } from '@/lib/utils';
import Map from '@/components/map/Map';

interface MapPlaceholderProps {
  className?: string;
  spots?: ParkingSpot[];
  highlightedSpotId?: string;
  onSelectSpot?: (spotId: string) => void;
  canSetLocation?: boolean;
  onLocationSet?: (lat: number, lng: number) => void;
  defaultLocation?: [number, number];
}

const MapPlaceholder = ({ 
  className, 
  spots = [], 
  highlightedSpotId,
  onSelectSpot,
  canSetLocation = false,
  onLocationSet,
  defaultLocation
}: MapPlaceholderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading with a slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 transition-all",
      !isLoaded && "animate-pulse",
      className
    )}>
      {isLoaded ? (
        <Map 
          spots={spots}
          selectedSpotId={highlightedSpotId}
          onSelectSpot={onSelectSpot}
          height="100%"
          canSetLocation={canSetLocation}
          onLocationSet={onLocationSet}
          defaultLocation={defaultLocation}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default MapPlaceholder;
