import {
  DatabaseParkingSpot,
  DatabaseReservation,
  DatabaseUserProfile,
  DatabaseVehicle,
  DatabaseReport,
  DatabaseReview,
  ParkingSpot,
  Reservation,
  UserProfile,
  Vehicle,
  Report,
  Review
} from './types';

// Helper functions for type validation with better error handling
const validateReservationStatus = (status: string): 'active' | 'completed' | 'cancelled' => {
  if (status === 'active' || status === 'completed' || status === 'cancelled') {
    return status;
  }
  console.warn(`Invalid reservation status: ${status}, defaulting to 'active'`);
  return 'active';
};

const validateUserRole = (role: string): 'user' | 'host' => {
  if (role === 'user' || role === 'host') {
    return role;
  }
  console.warn(`Invalid user role: ${role}, defaulting to 'user'`);
  return 'user';
};

const validateReportType = (type: string): 'booking' | 'revenue' | 'usage' => {
  if (type === 'booking' || type === 'revenue' || type === 'usage') {
    return type;
  }
  console.warn(`Invalid report type: ${type}, defaulting to 'booking'`);
  return 'booking';
};

export const mapParkingSpot = (dbSpot: DatabaseParkingSpot | null, hostName?: string): ParkingSpot | null => {
  if (!dbSpot) {
    console.error("Error: Trying to map undefined or null parking spot");
    return null;
  }
  
  try {
    // Ensure we're handling all properties correctly
    console.log("Mapping parking spot from database:", dbSpot);
    
    return {
      id: dbSpot.id,
      name: dbSpot.name || '',
      address: dbSpot.address || '',
      price: dbSpot.price || 0,
      priceUnit: dbSpot.price_unit || 'hour',
      available: typeof dbSpot.available === 'boolean' ? dbSpot.available : true,
      image: dbSpot.image || '',
      rating: typeof dbSpot.rating === 'number' ? dbSpot.rating : 0,
      latitude: dbSpot.latitude || 0,
      longitude: dbSpot.longitude || 0,
      amenities: Array.isArray(dbSpot.amenities) ? dbSpot.amenities : [],
      hostId: dbSpot.host_id,
      hostName: hostName || undefined,
      description: dbSpot.description || '',
      totalSlots: dbSpot.total_slots || 1,
      usedSlots: dbSpot.used_slots || 0,
      createdAt: dbSpot.created_at,
      updatedAt: dbSpot.updated_at
    };
  } catch (error) {
    console.error("Error mapping parking spot:", error, dbSpot);
    return null;
  }
};

export const mapReservation = (dbReservation: DatabaseReservation | null): Reservation | null => {
  if (!dbReservation) {
    console.error("Error: Trying to map undefined or null reservation");
    return null;
  }
  
  try {
    return {
      id: dbReservation.id,
      spotId: dbReservation.spot_id,
      userId: dbReservation.user_id,
      vehicleId: dbReservation.vehicle_id,
      startTime: dbReservation.start_time,
      endTime: dbReservation.end_time,
      status: validateReservationStatus(dbReservation.status),
      totalCost: dbReservation.total_cost,
      createdAt: dbReservation.created_at
    };
  } catch (error) {
    console.error("Error mapping reservation:", error, dbReservation);
    return null;
  }
};

export const mapUserProfile = (dbProfile: DatabaseUserProfile | null): UserProfile | null => {
  if (!dbProfile) {
    console.error("Error: Trying to map undefined or null profile");
    return null;
  }
  
  try {
    return {
      id: dbProfile.id,
      name: dbProfile.name || '',
      email: dbProfile.email || '',
      role: validateUserRole(dbProfile.role || 'user'),
      profileImage: dbProfile.profile_image || undefined,
      phone: dbProfile.phone || undefined,
      createdAt: dbProfile.created_at
    };
  } catch (error) {
    console.error("Error mapping user profile:", error, dbProfile);
    return null;
  }
};

export const mapVehicle = (dbVehicle: DatabaseVehicle | null): Vehicle | null => {
  if (!dbVehicle) {
    console.error("Error: Trying to map undefined or null vehicle");
    return null;
  }
  
  try {
    return {
      id: dbVehicle.id,
      userId: dbVehicle.user_id,
      licensePlate: dbVehicle.license_plate || '',
      make: dbVehicle.make || '',
      model: dbVehicle.model || '',
      year: dbVehicle.year || 0,
      color: dbVehicle.color || ''
    };
  } catch (error) {
    console.error("Error mapping vehicle:", error, dbVehicle);
    return null;
  }
};

export const mapReport = (dbReport: DatabaseReport | null): Report | null => {
  if (!dbReport) {
    console.error("Error: Trying to map undefined or null report");
    return null;
  }
  
  try {
    // Check if date_range is a string or object and handle accordingly
    let dateRange = { from: '', to: '' };
    
    try {
      if (typeof dbReport.date_range === 'string') {
        // If it's a JSON string, parse it
        const parsed = JSON.parse(dbReport.date_range as string);
        dateRange = {
          from: parsed.from || '',
          to: parsed.to || ''
        };
      } else if (typeof dbReport.date_range === 'object' && dbReport.date_range !== null) {
        // If it's already an object with from/to properties
        const range = dbReport.date_range as any;
        dateRange = {
          from: range.from || '',
          to: range.to || ''
        };
      }
    } catch (error) {
      console.error('Error parsing date_range in report:', error);
    }

    return {
      id: dbReport.id,
      userId: dbReport.user_id,
      type: validateReportType(dbReport.type || 'booking'),
      dateRange,
      createdAt: dbReport.created_at,
      downloadUrl: dbReport.download_url || ''
    };
  } catch (error) {
    console.error("Error mapping report:", error, dbReport);
    return null;
  }
};

export const mapReview = (dbReview: DatabaseReview | null): Review | null => {
  if (!dbReview) {
    console.error("Error: Trying to map undefined or null review");
    return null;
  }
  
  try {
    return {
      id: dbReview.id,
      spotId: dbReview.spot_id,
      userId: dbReview.user_id,
      reservationId: dbReview.reservation_id || undefined,
      rating: dbReview.rating,
      comment: dbReview.comment || '',
      createdAt: dbReview.created_at
    };
  } catch (error) {
    console.error("Error mapping review:", error, dbReview);
    return null;
  }
};

// Add the ensureSpotHasRequiredFields function for export
export const ensureSpotHasRequiredFields = (spot: any): DatabaseParkingSpot => {
  // Add default values for missing fields
  return {
    ...spot,
    total_slots: spot.total_slots ?? 1,
    used_slots: spot.used_slots ?? 0
  };
};
