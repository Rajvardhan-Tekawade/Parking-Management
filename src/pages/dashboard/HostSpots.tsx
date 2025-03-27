import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Car, MapPin, Star, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ParkingSpot } from '@/lib/types';
import { mapParkingSpot } from '@/lib/mappers';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Add this import for the ensureSpotHasRequiredFields function
import { ensureSpotHasRequiredFields } from '@/lib/mappers';

const HostSpots = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [spotToDelete, setSpotToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchParkingSpots();
    }
  }, [user]);

  const fetchParkingSpots = async () => {
    if (!user) {
      setError("You must be logged in to view your parking spots");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching parking spots for host ID:", user.id);
      
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .eq('host_id', user.id);
      
      if (error) {
        console.error('Error fetching parking spots:', error);
        setError(`Failed to load your parking spots: ${error.message}`);
        toast.error('Failed to load your parking spots');
        return;
      }
      
      if (!data || data.length === 0) {
        console.log("No parking spots found for this host");
        setParkingSpots([]);
        return;
      }
      
      console.log("Parking spots fetched:", data);
      // Update to properly handle the required fields
      const spots = data.map((spot) => {
        const completeSpot = ensureSpotHasRequiredFields(spot);
        return mapParkingSpot(completeSpot, user.name);
      }).filter(Boolean) as ParkingSpot[];
      
      setParkingSpots(spots);
    } catch (error) {
      console.error('Error in fetchParkingSpots:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load your parking spots: ${errorMessage}`);
      toast.error('Failed to load your parking spots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!spotToDelete) return;
    
    setIsDeleting(true);
    try {
      // Check if there are any active reservations
      const { data: reservations, error: reservationError } = await supabase
        .from('reservations')
        .select('id')
        .eq('spot_id', spotToDelete)
        .in('status', ['active', 'pending']);
      
      if (reservationError) {
        console.error('Error checking reservations:', reservationError);
        toast.error('Failed to check for active reservations');
        throw reservationError;
      }
      
      if (reservations && reservations.length > 0) {
        toast.error('Cannot delete a parking spot with active reservations');
        return;
      }
      
      // Delete the parking spot
      const { error } = await supabase
        .from('parking_spots')
        .delete()
        .eq('id', spotToDelete);
      
      if (error) {
        console.error('Error deleting parking spot:', error);
        toast.error(`Failed to delete parking spot: ${error.message}`);
        throw error;
      }
      
      setParkingSpots(prevSpots => prevSpots.filter(spot => spot.id !== spotToDelete));
      toast.success('Parking spot deleted successfully');
      setSpotToDelete(null);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to delete parking spot: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const getAvailabilityStatus = (spot: ParkingSpot) => {
    if (!spot.available) return { label: 'Unavailable', variant: 'destructive' as const };
    
    const availableSlots = spot.totalSlots - spot.usedSlots;
    
    if (availableSlots <= 0) {
      return { label: 'Full', variant: 'destructive' as const };
    } else if (availableSlots === spot.totalSlots) {
      return { label: 'Empty', variant: 'success' as const };
    } else {
      return { 
        label: `${availableSlots}/${spot.totalSlots} free`, 
        variant: 'success' as const 
      };
    }
  };

  const retryFetch = () => {
    fetchParkingSpots();
  };

  return (
    <DashboardLayout pageTitle="Your Parking Spots">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Your Parking Spots</h2>
          <Button onClick={() => navigate('/host/spots/new')}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Spot
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Your Parking Spots</CardTitle>
            <CardDescription>
              View, edit, or delete your listed parking spots
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
                <h3 className="mt-4 text-lg font-medium">Error loading parking spots</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {error}
                </p>
                <Button onClick={retryFetch} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : parkingSpots.length === 0 ? (
              <div className="text-center p-8">
                <Car className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                <h3 className="mt-4 text-lg font-medium">No parking spots found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't created any parking spots yet.
                </p>
                <Button onClick={() => navigate('/host/spots/new')} className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Spot
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parkingSpots.map((spot) => {
                      const availability = getAvailabilityStatus(spot);
                      return (
                        <TableRow key={spot.id}>
                          <TableCell className="font-medium">{truncateText(spot.name, 30)}</TableCell>
                          <TableCell className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            {truncateText(spot.address, 25)}
                          </TableCell>
                          <TableCell>${spot.price}/{spot.priceUnit}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                              {spot.rating.toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={availability.variant}>
                              {availability.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/host/spots/edit/${spot.id}`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSpotToDelete(spot.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete "{spot.name}"? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="flex space-x-2 justify-end">
                                    <Button
                                      variant="outline"
                                      onClick={() => setSpotToDelete(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={handleDelete}
                                      disabled={isDeleting}
                                    >
                                      {isDeleting ? 'Deleting...' : 'Delete'}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HostSpots;
