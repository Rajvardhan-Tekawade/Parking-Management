
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ParkingSpot } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface MapProps {
  spots?: ParkingSpot[];
  selectedSpotId?: string;
  onSelectSpot?: (spotId: string) => void;
  width?: string;
  height?: string;
  interactive?: boolean;
  canSetLocation?: boolean;
  onLocationSet?: (lat: number, lng: number) => void;
  defaultLocation?: [number, number];
  defaultZoom?: number;
}

// Component to handle map center updates and user location
const MapController = ({ defaultLocation }: { defaultLocation?: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (defaultLocation) {
      map.setView(defaultLocation, map.getZoom());
    } else {
      // Use browser geolocation if available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
        },
        () => {
          // Default location if geolocation fails (San Francisco)
          map.setView([37.7749, -122.4194], 13);
        }
      );
    }
  }, [map, defaultLocation]);

  return null;
};

// Component to handle location setting
const LocationSetter = ({ onLocationSet }: { onLocationSet?: (lat: number, lng: number) => void }) => {
  const map = useMapEvents({
    click: (e) => {
      if (onLocationSet) {
        onLocationSet(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
};

const Map = ({
  spots = [],
  selectedSpotId,
  onSelectSpot,
  width = '100%',
  height = '400px',
  interactive = true,
  canSetLocation = false,
  onLocationSet,
  defaultLocation,
  defaultZoom = 13
}: MapProps) => {
  const [activeSpot, setActiveSpot] = useState<string | undefined>(selectedSpotId);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(
    defaultLocation ? defaultLocation : null
  );

  useEffect(() => {
    setActiveSpot(selectedSpotId);
  }, [selectedSpotId]);

  // Handle selecting a spot marker
  const handleSpotSelect = (spotId: string) => {
    setActiveSpot(spotId);
    if (onSelectSpot) {
      onSelectSpot(spotId);
    }
  };

  // Handle setting a location on the map
  const handleLocationSet = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    if (onLocationSet) {
      onLocationSet(lat, lng);
    }
  };

  // Create a custom marker icon
  const createMarkerIcon = (isSelected: boolean) => {
    return new Icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      className: isSelected ? 'selected-marker' : ''
    });
  };

  return (
    <div style={{ width, height }}>
      <style>
        {`
          .selected-marker {
            filter: hue-rotate(120deg);
            transform: scale(1.2);
            z-index: 1000 !important;
          }
          .leaflet-container {
            width: 100%;
            height: 100%;
            border-radius: 0.5rem;
          }
          .custom-popup .leaflet-popup-content-wrapper {
            border-radius: 0.5rem;
            padding: 0;
            overflow: hidden;
          }
          .custom-popup .leaflet-popup-content {
            margin: 0;
            width: 280px !important;
          }
          .spot-popup {
            font-family: inherit;
          }
          .spot-popup-image {
            height: 140px;
            overflow: hidden;
          }
          .spot-popup-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .spot-popup-content {
            padding: 0.75rem;
          }
          .spot-popup-price {
            position: absolute; 
            top: 0.5rem;
            right: 0.5rem;
            background-color: rgba(255, 255, 255, 0.9);
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            font-weight: 600;
            font-size: 0.875rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .spot-popup-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0.75rem;
            border-top: 1px solid rgba(0,0,0,0.1);
            background: rgba(0,0,0,0.02);
          }
        `}
      </style>
      <MapContainer
        center={defaultLocation || [37.7749, -122.4194]}
        zoom={defaultZoom}
        scrollWheelZoom={interactive}
        zoomControl={interactive}
        dragging={interactive}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController defaultLocation={defaultLocation} />
        
        {canSetLocation && (
          <LocationSetter onLocationSet={handleLocationSet} />
        )}
        
        {/* User's selected location */}
        {selectedLocation && (
          <Marker 
            position={selectedLocation}
            icon={new Icon({
              iconUrl: icon,
              shadowUrl: iconShadow,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              className: 'selected-location-marker'
            })}
          >
            <Popup>Selected Location</Popup>
          </Marker>
        )}
        
        {/* Parking spots */}
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
            icon={createMarkerIcon(spot.id === activeSpot)}
            eventHandlers={{
              click: () => handleSpotSelect(spot.id),
            }}
          >
            <Popup className="custom-popup">
              <div className="spot-popup">
                <div className="spot-popup-image">
                  <img src={spot.image} alt={spot.name} />
                  <div className="spot-popup-price">${spot.price}/{spot.priceUnit}</div>
                </div>
                <div className="spot-popup-content">
                  <h3 className="font-medium text-lg">{spot.name}</h3>
                  <p className="text-sm text-muted-foreground">{spot.address}</p>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24" stroke="none">
                        <path d="M12 2L14.2 8.2H20.5L15.4 12.3L17 18.5L12 14.5L7 18.5L8.6 12.3L3.5 8.2H9.8L12 2Z"/>
                      </svg>
                      <span className="ml-1 text-sm">{spot.rating.toFixed(1)}</span>
                    </div>
                    <div className="ml-3 text-sm font-medium">
                      {spot.available ? (
                        <span className="text-green-600">Available</span>
                      ) : (
                        <span className="text-red-600">Unavailable</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="spot-popup-footer">
                  <div className="text-sm text-muted-foreground">
                    Host: {spot.hostName || 'Unknown'}
                  </div>
                  <Button size="sm" asChild>
                    <Link to={`/spot/${spot.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
