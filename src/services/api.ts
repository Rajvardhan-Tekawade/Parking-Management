
import { supabase } from '@/integrations/supabase/client';
import { ParkingSpot, DatabaseParkingSpot, UserProfile, Vehicle, Reservation, Review } from '@/lib/types';
import { mapParkingSpot, mapUserProfile, mapVehicle, mapReservation, mapReview } from '@/lib/mappers';

// Helper function to get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return mapUserProfile(data);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

// Helper function to get vehicle by ID
export const getVehicleById = async (vehicleId: string): Promise<Vehicle | null> => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (error) {
      console.error('Error fetching vehicle:', error);
      return null;
    }

    return mapVehicle(data);
  } catch (error) {
    console.error('Error in getVehicleById:', error);
    return null;
  }
};

// Helper function to get reservation by ID
export const getReservationById = async (reservationId: string): Promise<Reservation | null> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();

    if (error) {
      console.error('Error fetching reservation:', error);
      return null;
    }

    return mapReservation(data);
  } catch (error) {
    console.error('Error in getReservationById:', error);
    return null;
  }
};

// Helper function to get review by ID
export const getReviewById = async (reviewId: string): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (error) {
      console.error('Error fetching review:', error);
      return null;
    }

    return mapReview(data);
  } catch (error) {
    console.error('Error in getReviewById:', error);
    return null;
  }
};

// Function to fetch parking spots
export const fetchParkingSpots = async (): Promise<ParkingSpot[]> => {
  try {
    const { data, error } = await supabase
      .from('parking_spots')
      .select('*, profiles:host_id(name)')
      .eq('available', true);

    if (error) {
      console.error('Error fetching parking spots:', error);
      throw error;
    }

    return data.map(item => {
      const completeItem = ensureSpotHasRequiredFields(item);
      return mapParkingSpot(completeItem, item.profiles?.name);
    }).filter(Boolean) as ParkingSpot[];
  } catch (error) {
    console.error('Error in fetchParkingSpots:', error);
    throw error;
  }
};

// Function to fetch parking spot by ID
export const fetchParkingSpotById = async (id: string): Promise<ParkingSpot | null> => {
  try {
    const { data, error } = await supabase
      .from('parking_spots')
      .select('*, profiles:host_id(name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching parking spot with id ${id}:`, error);
      return null;
    }
    
    const completeItem = ensureSpotHasRequiredFields(data);
    return mapParkingSpot(completeItem, data.profiles?.name);
  } catch (error) {
    console.error(`Error in fetchParkingSpotById with id ${id}:`, error);
    return null;
  }
};

// Function to create a new parking spot
export const createParkingSpot = async (spot: Omit<DatabaseParkingSpot, 'id' | 'created_at' | 'updated_at'>): Promise<ParkingSpot | null> => {
  try {
    // Make sure the spot has total_slots and used_slots
    const completeSpot = {
      ...spot,
      total_slots: spot.total_slots ?? 1,
      used_slots: spot.used_slots ?? 0
    };
    
    const { data, error } = await supabase
      .from('parking_spots')
      .insert([completeSpot])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating parking spot:', error);
      throw error;
    }
    
    return mapParkingSpot(data);
  } catch (error) {
    console.error('Error in createParkingSpot:', error);
    return null;
  }
};

// Function to update an existing parking spot
export const updateParkingSpot = async (id: string, updates: Partial<DatabaseParkingSpot>): Promise<ParkingSpot | null> => {
  try {
    // Ensure updates have the required fields if they're being modified
    const completeUpdates = {
      ...updates,
      total_slots: updates.total_slots !== undefined ? updates.total_slots : undefined,
      used_slots: updates.used_slots !== undefined ? updates.used_slots : undefined
    };
    
    const { data, error } = await supabase
      .from('parking_spots')
      .update(completeUpdates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating parking spot with id ${id}:`, error);
      throw error;
    }

    return mapParkingSpot(data);
  } catch (error) {
    console.error(`Error in updateParkingSpot with id ${id}:`, error);
    return null;
  }
};

// Function to delete a parking spot
export const deleteParkingSpot = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('parking_spots')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting parking spot with id ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteParkingSpot with id ${id}:`, error);
    return false;
  }
};

// Function to fetch user's vehicles
export const fetchUserVehicles = async (userId: string): Promise<Vehicle[]> => {
    try {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching user vehicles:', error);
            throw error;
        }

        return data.map(mapVehicle).filter(Boolean) as Vehicle[];
    } catch (error) {
        console.error('Error in fetchUserVehicles:', error);
        return [];
    }
};

// Function to create a new vehicle
export const createVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle | null> => {
    try {
        // Convert the Vehicle type to the expected database format
        const dbVehicle = {
            user_id: vehicle.userId,
            license_plate: vehicle.licensePlate,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            color: vehicle.color
        };
        
        const { data, error } = await supabase
            .from('vehicles')
            .insert([dbVehicle])
            .select('*')
            .single();

        if (error) {
            console.error('Error creating vehicle:', error);
            throw error;
        }

        return mapVehicle(data);
    } catch (error) {
        console.error('Error in createVehicle:', error);
        return null;
    }
};

// Function to update an existing vehicle
export const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<Vehicle | null> => {
    try {
        const { data, error } = await supabase
            .from('vehicles')
            .update(updates)
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            console.error(`Error updating vehicle with id ${id}:`, error);
            throw error;
        }

        return mapVehicle(data);
    } catch (error) {
        console.error(`Error in updateVehicle with id ${id}:`, error);
        return null;
    }
};

// Function to delete a vehicle
export const deleteVehicle = async (id: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('vehicles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting vehicle with id ${id}:`, error);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Error in deleteVehicle with id ${id}:`, error);
        return false;
    }
};

// Function to create a new reservation
export const createReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation | null> => {
  try {
    // Convert the Reservation type to the expected database format
    const dbReservation = {
      spot_id: reservation.spotId,
      user_id: reservation.userId,
      vehicle_id: reservation.vehicleId,
      start_time: reservation.startTime,
      end_time: reservation.endTime,
      status: reservation.status,
      total_cost: reservation.totalCost
    };
    
    const { data, error } = await supabase
      .from('reservations')
      .insert([dbReservation])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }

    return mapReservation(data);
  } catch (error) {
    console.error('Error in createReservation:', error);
    return null;
  }
};

// Function to update an existing reservation
export const updateReservation = async (id: string, updates: Partial<Reservation>): Promise<Reservation | null> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating reservation with id ${id}:`, error);
      throw error;
    }

    return mapReservation(data);
  } catch (error) {
    console.error(`Error in updateReservation with id ${id}:`, error);
    return null;
  }
};

// Function to delete a reservation
export const deleteReservation = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting reservation with id ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteReservation with id ${id}:`, error);
    return false;
  }
};

// Function to create a new review
export const createReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<Review | null> => {
  try {
    // Convert the Review type to the expected database format
    const dbReview = {
      spot_id: review.spotId,
      user_id: review.userId,
      reservation_id: review.reservationId,
      rating: review.rating,
      comment: review.comment
    };
    
    const { data, error } = await supabase
      .from('reviews')
      .insert([dbReview])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating review:', error);
      throw error;
    }

    return mapReview(data);
  } catch (error) {
    console.error('Error in createReview:', error);
    return null;
  }
};

// Function to update an existing review
export const updateReview = async (id: string, updates: Partial<Review>): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating review with id ${id}:`, error);
      throw error;
    }

    return mapReview(data);
  } catch (error) {
    console.error(`Error in updateReview with id ${id}:`, error);
    return null;
  }
};

// Function to delete a review
export const deleteReview = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting review with id ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteReview with id ${id}:`, error);
    return false;
  }
};

// For functions that handle DatabaseParkingSpot, add handling for total_slots and used_slots fields
// I'll create a helper function to ensure all spot objects have the required fields

const ensureSpotHasRequiredFields = (spot: any): DatabaseParkingSpot => {
  // Add default values for missing fields
  return {
    ...spot,
    total_slots: spot.total_slots ?? 1,
    used_slots: spot.used_slots ?? 0
  };
};
