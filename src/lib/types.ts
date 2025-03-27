
export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  price: number;
  priceUnit: string;
  available: boolean;
  image: string;
  rating: number;
  latitude: number;
  longitude: number;
  amenities: string[];
  hostId: string;
  hostName?: string;
  description: string;
  totalSlots: number;
  usedSlots: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  spot_id: string;
  user_id: string;
  created_at: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  spot: {
    name: string;
    address: string;
  };
  user: {
    name: string;
    email: string;
  };
}

export interface Reservation {
  id: string;
  spotId: string;
  userId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  totalCost: number;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'host';
  profileImage?: string;
  phone?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
}

export interface StatisticItem {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

export interface Report {
  id: string;
  userId: string;
  type: 'booking' | 'revenue' | 'usage';
  dateRange: {
    from: string;
    to: string;
  };
  createdAt: string;
  downloadUrl: string;
}

export interface Review {
  id: string;
  spotId: string;
  userId: string;
  reservationId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName?: string;
}

export interface Receipt {
  id: string;
  reservationId: string;
  userId: string;
  spotId: string;
  spotName: string;
  startTime: string;
  endTime: string;
  duration: string;
  cost: number;
  status: 'reserved' | 'active' | 'completed';
  createdAt: string;
}

export interface DatabaseParkingSpot {
  id: string;
  name: string;
  address: string;
  price: number;
  price_unit: string;
  available: boolean;
  image: string;
  rating: number;
  latitude: number;
  longitude: number;
  amenities: string[];
  host_id: string;
  description: string;
  total_slots: number;
  used_slots: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseReservation {
  id: string;
  spot_id: string;
  user_id: string;
  vehicle_id: string;
  start_time: string;
  end_time: string;
  status: string;
  total_cost: number;
  created_at: string;
}

export interface DatabaseUserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_image?: string;
  phone?: string;
  created_at: string;
}

export interface DatabaseVehicle {
  id: string;
  user_id: string;
  license_plate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  created_at: string;
}

export interface DatabaseReport {
  id: string;
  user_id: string;
  type: string;
  date_range: {
    from: string;
    to: string;
  } | string | any; // Add more flexibility to handle potential JSON stringification
  created_at: string;
  download_url: string | null;
}

export interface DatabaseReview {
  id: string;
  spot_id: string;
  user_id: string;
  reservation_id?: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Schema interface for the ParkingSpotForm
export interface ParkingSpotFormData {
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  pricePerHour: number;
  images?: string;
  isCovered: boolean;
  isLit: boolean;
  isCameraSurveilled: boolean;
  hasEVCharger: boolean;
  has24HourAccess?: boolean;
  hasSecurity?: boolean;
  hasCarWash?: boolean;
  isHandicapAccessible?: boolean;
  amenities?: string[];
  latitude?: number;
  longitude?: number;
  totalSlots?: number;
}

// Review form data
export interface ReviewFormData {
  rating: number;
  comment: string;
  reservationId?: string;
}
