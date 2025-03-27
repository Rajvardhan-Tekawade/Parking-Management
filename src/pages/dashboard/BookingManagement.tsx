
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import {
  ColumnDef,
  getCoreRowModel,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Booking } from '@/lib/types';

interface Props {
  isHostView?: boolean;
}

const BookingManagement = ({ isHostView = false }: Props) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('reservations')
          .select(`
            id, created_at, start_time, end_time, total_cost, status, spot_id, user_id,
            parking_spots ( name, address ),
            profiles ( name, email )
          `);
        
        if (isHostView && user) {
          // Fetch bookings for spots owned by the host
          query = query.eq('parking_spots.host_id', user.id);
        } else if (user) {
          // Fetch bookings made by the current user
          query = query.eq('user_id', user.id);
        }
        
        const { data, error } = await query;

        if (error) {
          console.error('Error fetching bookings:', error);
          toast.error('Failed to fetch bookings');
        } else {
          // Transform database reservation to app booking format
          const bookingsData = data.map(reservation => ({
            id: reservation.id,
            created_at: reservation.created_at,
            start_time: reservation.start_time,
            end_time: reservation.end_time,
            total_price: reservation.total_cost,
            status: reservation.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
            spot_id: reservation.spot_id,
            user_id: reservation.user_id,
            spot: {
              name: reservation.parking_spots?.name || 'Unknown',
              address: reservation.parking_spots?.address || 'Unknown'
            },
            user: {
              name: reservation.profiles?.name || 'Unknown',
              email: reservation.profiles?.email || 'Unknown'
            }
          }));
          
          setBookings(bookingsData);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, isHostView]);

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: 'id',
      header: 'Booking ID',
    },
    {
      accessorKey: 'spot.name',
      header: 'Spot Name',
    },
    {
      accessorKey: 'spot.address',
      header: 'Spot Address',
    },
    {
      accessorKey: 'user.name',
      header: 'User Name',
    },
    {
      accessorKey: 'user.email',
      header: 'User Email',
    },
    {
      accessorKey: 'start_time',
      header: 'Start Time',
      cell: ({ row }) => format(new Date(row.getValue('start_time')), 'MMM dd, yyyy h:mm a'),
    },
    {
      accessorKey: 'end_time',
      header: 'End Time',
      cell: ({ row }) => format(new Date(row.getValue('end_time')), 'MMM dd, yyyy h:mm a'),
    },
    {
      accessorKey: 'total_price',
      header: 'Total Price',
      cell: ({ row }) => `$${row.getValue('total_price')}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('status') === 'confirmed' ? 'success' : row.getValue('status') === 'cancelled' ? 'destructive' : 'secondary'}>
          {row.getValue('status')}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`/spot/${booking.spot_id}`)}>
                <Pencil className="mr-2 h-4 w-4" />
                View Spot
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel Booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  return (
    <DashboardLayout pageTitle="Booking Management">
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>
            Here you can manage your parking spot bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading bookings...</div>
          ) : (
            <DataTable columns={columns} data={bookings} />
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
};

export default BookingManagement;
