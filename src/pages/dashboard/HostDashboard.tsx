
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/ui/StatCard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockRevenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 },
];

const mockBookingData = [
  { name: 'Mon', bookings: 10 },
  { name: 'Tue', bookings: 15 },
  { name: 'Wed', bookings: 12 },
  { name: 'Thu', bookings: 18 },
  { name: 'Fri', bookings: 25 },
  { name: 'Sat', bookings: 30 },
  { name: 'Sun', bookings: 20 },
];

const mockSpotPerformanceData = [
  { name: 'Downtown Spot A', value: 35 },
  { name: 'City Center B', value: 25 },
  { name: 'Suburb Spot C', value: 20 },
  { name: 'Airport Spot D', value: 15 },
  { name: 'Mall Spot E', value: 5 },
];

const HostDashboard = () => {
  const { user } = useAuth();
  const [activeSpots, setActiveSpots] = useState(5);
  const [totalBookings, setTotalBookings] = useState(128);
  const [totalRevenue, setTotalRevenue] = useState(2450);
  const [occupancyRate, setOccupancyRate] = useState(78);

  useEffect(() => {
    // In a real app, we would fetch this data from the API
    // For now, we're using mock data
  }, []);

  return (
    <DashboardLayout pageTitle="Host Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your parking spaces today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/host/spots/new">Add New Parking Space</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Active Spots" 
            value={activeSpots.toString()} 
            description="Total parking spaces" 
            trend="up" 
            trendValue="1" 
          />
          <StatCard 
            title="Total Bookings" 
            value={totalBookings.toString()} 
            description="All time bookings" 
            trend="up" 
            trendValue="12%" 
          />
          <StatCard 
            title="Total Revenue" 
            value={`$${totalRevenue}`} 
            description="All time earnings" 
            trend="up" 
            trendValue="8%" 
          />
          <StatCard 
            title="Occupancy Rate" 
            value={`${occupancyRate}%`} 
            description="Average across all spots" 
            trend="up" 
            trendValue="5%" 
          />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue for the past 7 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Spot Performance</CardTitle>
                  <CardDescription>Booking distribution across your spots</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockSpotPerformanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Booking Activity</CardTitle>
                <CardDescription>Number of bookings per day this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockBookingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="bookings" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Revenue analysis content will go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Booking analysis content will go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-medium">New booking received</p>
                <p className="text-sm text-muted-foreground">Downtown Spot A - July 15, 2023</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium">Payment received</p>
                <p className="text-sm text-muted-foreground">$45.00 - City Center B - July 14, 2023</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="font-medium">Booking completed</p>
                <p className="text-sm text-muted-foreground">Airport Spot D - July 13, 2023</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <p className="font-medium">New review received</p>
                <p className="text-sm text-muted-foreground">4.8/5 stars - Mall Spot E - July 12, 2023</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HostDashboard;
