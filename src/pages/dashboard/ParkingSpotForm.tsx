import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import MapPlaceholder from '@/components/ui/MapPlaceholder';
import { ParkingSpotFormData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { X, Upload, MapPin, Plus } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  address: z.string().min(5, { message: 'Address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  country: z.string().min(2, { message: 'Country is required' }),
  pricePerHour: z.coerce.number().min(1, { message: 'Price must be at least 1' }),
  images: z.string().optional(),
  isCovered: z.boolean().default(false),
  isLit: z.boolean().default(false),
  isCameraSurveilled: z.boolean().default(false),
  hasEVCharger: z.boolean().default(false),
  has24HourAccess: z.boolean().default(false),
  hasSecurity: z.boolean().default(false),
  hasCarWash: z.boolean().default(false),
  isHandicapAccessible: z.boolean().default(false),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

const ParkingSpotForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [hasSetLocationOnMap, setHasSetLocationOnMap] = useState(false);
  const [locationMarker, setLocationMarker] = useState<[number, number] | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  const defaultLocation: [number, number] = [37.7749, -122.4194]; // Default: San Francisco

  const form = useForm<ParkingSpotFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      address: '',
      city: '',
      country: '',
      pricePerHour: 0,
      images: '',
      isCovered: false,
      isLit: false,
      isCameraSurveilled: false,
      hasEVCharger: false,
      has24HourAccess: false,
      hasSecurity: false,
      hasCarWash: false,
      isHandicapAccessible: false,
      latitude: undefined,
      longitude: undefined,
    }
  });

  useEffect(() => {
    if (id) {
      fetchParkingSpot(id);
    }
  }, [id]);

  const fetchParkingSpot = async (spotId: string) => {
    try {
      setIsFetching(true);
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .eq('id', spotId)
        .single();

      if (error) {
        console.error("Error fetching parking spot:", error);
        toast.error("Failed to fetch parking spot details: " + error.message);
        return;
      }

      if (data) {
        const addressParts = data.address.split(',');
        const initialData: ParkingSpotFormData = {
          title: data.name,
          description: data.description || '',
          address: addressParts[0]?.trim() || data.address,
          city: addressParts[1]?.trim() || '',
          country: addressParts[2]?.trim() || '',
          pricePerHour: data.price,
          images: data.image || '',
          isCovered: data.amenities?.includes('Covered') || false,
          isLit: data.amenities?.includes('Well Lit') || false,
          isCameraSurveilled: data.amenities?.includes('Camera Surveillance') || false,
          hasEVCharger: data.amenities?.includes('EV Charger') || false,
          has24HourAccess: data.amenities?.includes('24/7 Access') || false,
          hasSecurity: data.amenities?.includes('Security') || false,
          hasCarWash: data.amenities?.includes('Car Wash') || false,
          isHandicapAccessible: data.amenities?.includes('Handicap Accessible') || false,
          latitude: data.latitude,
          longitude: data.longitude,
        };

        // Set form values
        Object.entries(initialData).forEach(([key, value]) => {
          form.setValue(key as keyof ParkingSpotFormData, value);
        });

        // Set location marker if coordinates are available
        if (data.latitude && data.longitude) {
          setLocationMarker([data.latitude, data.longitude]);
          setHasSetLocationOnMap(true);
        }

        // Set selected amenities
        const standardAmenities = [
          'Covered', 'Well Lit', 'Camera Surveillance', 'EV Charger', 
          '24/7 Access', 'Security', 'Car Wash', 'Handicap Accessible'
        ];
        
        const filteredAmenities = data.amenities?.filter(amenity => 
          !standardAmenities.includes(amenity)
        ) || [];
        
        setSelectedAmenities(filteredAmenities);
      }
    } catch (error) {
      console.error("Error fetching parking spot:", error);
      toast.error("Failed to fetch parking spot details. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddCustomAmenity = () => {
    if (customAmenity && !selectedAmenities.includes(customAmenity)) {
      setSelectedAmenities([...selectedAmenities, customAmenity]);
      setCustomAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
  };

  const handleLocationSet = (lat: number, lng: number) => {
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
    setLocationMarker([lat, lng]);
    setHasSetLocationOnMap(true);
    toast.success("Location set successfully");
  };

  const onSubmit = async (values: ParkingSpotFormData) => {
    if (!user) {
      toast.error("You must be logged in to create a parking spot");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      // Validate location
      if (!values.latitude || !values.longitude) {
        toast.error("Please set the location on the map");
        setIsSubmitting(false);
        return;
      }
      
      const fullAddress = `${values.address}, ${values.city}, ${values.country}`;
      
      // Prepare amenities list
      const allAmenities = [...selectedAmenities];
      if (values.isCovered) allAmenities.push('Covered');
      if (values.isLit) allAmenities.push('Well Lit');
      if (values.isCameraSurveilled) allAmenities.push('Camera Surveillance');
      if (values.hasEVCharger) allAmenities.push('EV Charger');
      if (values.has24HourAccess) allAmenities.push('24/7 Access');
      if (values.hasSecurity) allAmenities.push('Security');
      if (values.hasCarWash) allAmenities.push('Car Wash');
      if (values.isHandicapAccessible) allAmenities.push('Handicap Accessible');
      
      const spotData = {
        name: values.title,
        description: values.description,
        address: fullAddress,
        price: values.pricePerHour,
        price_unit: 'hour',
        image: values.images,
        amenities: allAmenities,
        host_id: user.id,
        latitude: values.latitude || 0,
        longitude: values.longitude || 0,
        available: true,
        rating: id ? undefined : 0  // Only set rating for new spots, keep existing for updates
      };

      console.log("Submitting parking spot data:", spotData);

      let response;
      
      if (id) {
        // Update existing parking spot
        response = await supabase
          .from('parking_spots')
          .update(spotData)
          .eq('id', id);
      } else {
        // Insert new parking spot
        response = await supabase
          .from('parking_spots')
          .insert(spotData);
      }

      const { error } = response;
      
      if (error) {
        console.error("Supabase error submitting parking spot:", error);
        setFormError(`Failed to ${id ? 'update' : 'create'} parking spot: ${error.message}`);
        toast.error(`Failed to ${id ? 'update' : 'create'} parking spot: ${error.message}`);
        return;
      }

      toast.success(`Parking spot ${id ? 'updated' : 'created'} successfully!`);
      
      // Short delay before redirecting to let the toast appear
      setTimeout(() => {
        navigate('/host/spots');
      }, 1000);
    } catch (error) {
      console.error("Error submitting parking spot:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setFormError(`Failed to submit parking spot: ${errorMessage}`);
      toast.error(`Failed to submit parking spot: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout pageTitle={id ? "Edit Parking Spot" : "Add New Parking Spot"}>
        <div className="container mx-auto py-6 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle={id ? "Edit Parking Spot" : "Add New Parking Spot"}>
      <div className="container mx-auto py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{id ? "Edit Parking Spot" : "Create New Parking Spot"}</CardTitle>
                <CardDescription>
                  Fill in the details below to {id ? "update your" : "list your new"} parking spot.
                </CardDescription>
              </CardHeader>
              
              {formError && (
                <div className="mx-6 my-2 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{formError}</p>
                </div>
              )}
              
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spot Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Downtown Secure Parking" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your parking spot, e.g., 'Covered parking spot in a secure garage...'" 
                          {...field} 
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pricePerHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Per Hour ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field} 
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => {
                              // This would normally open a file picker
                              toast.info("Image upload functionality would be integrated with a storage provider");
                            }}
                          >
                            <Upload className="h-4 w-4" />
                            Upload
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Provide a URL to an image of your parking spot
                      </FormDescription>
                      {field.value && (
                        <div className="mt-2 relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={field.value} 
                            alt="Parking spot preview" 
                            className="w-full h-full object-cover"
                            onError={() => {
                              toast.error("Failed to load image. Please check the URL");
                            }}
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.0000001" 
                            readOnly={hasSetLocationOnMap}
                            placeholder="37.7749" 
                            {...field} 
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? undefined : parseFloat(value));
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Set by clicking on the map below
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.0000001"
                            readOnly={hasSetLocationOnMap}
                            placeholder="-122.4194" 
                            {...field} 
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? undefined : parseFloat(value));
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Set by clicking on the map below
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <CardTitle className="text-lg mb-4">Amenities</CardTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="isCovered"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Covered Parking</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isLit"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Well Lit</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isCameraSurveilled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Camera Surveillance</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasEVCharger"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>EV Charger</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="has24HourAccess"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>24/7 Access</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasSecurity"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Security</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hasCarWash"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Car Wash</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isHandicapAccessible"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Handicap Accessible</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <Label>Custom Amenities</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedAmenities.map((amenity, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="flex items-center gap-1 py-1 px-3"
                        >
                          {amenity}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 ml-1"
                            onClick={() => handleRemoveAmenity(amenity)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Input
                        value={customAmenity}
                        onChange={(e) => setCustomAmenity(e.target.value)}
                        placeholder="Add a custom amenity"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={handleAddCustomAmenity}
                        disabled={!customAmenity}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <CardTitle className="text-lg mb-4">Location on Map</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">
                    Click on the map to set the exact location of your parking spot.
                  </p>
                  <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                    <MapPlaceholder 
                      canSetLocation={true}
                      onLocationSet={handleLocationSet}
                      defaultLocation={locationMarker || defaultLocation}
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                    <p className="text-sm text-muted-foreground">
                      {hasSetLocationOnMap 
                        ? 'Location set successfully' 
                        : 'Click on the map to set the location'}
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate('/host/spots')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                      {id ? 'Updating...' : 'Creating...'}
                    </span> : 
                    id ? 'Update Parking Spot' : 'Create Parking Spot'
                  }
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default ParkingSpotForm;
