import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, User, MapPin, Calendar, CreditCard, Star, ArrowRight, Search, Clock, Shield, Building } from "lucide-react";
import { ParkingSpot } from '@/lib/types';
import { cn } from '@/lib/utils';

// Add the missing properties to the sample spots
const RECENT_SPOTS: ParkingSpot[] = [
  {
    id: "1",
    name: "Downtown Secure Parking",
    address: "123 Main St, San Francisco, CA",
    price: 15,
    priceUnit: "hour",
    available: true,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    rating: 4.8,
    latitude: 0.5,
    longitude: 0.6,
    amenities: ["24/7 Access", "Security"],
    hostId: "host1",
    hostName: "John Smith",
    description: "Secure parking in the heart of downtown.",
    totalSlots: 20,
    usedSlots: 5
  },
  {
    id: "2",
    name: "City Center Garage",
    address: "456 Market St, San Francisco, CA",
    price: 12,
    priceUnit: "hour",
    available: true,
    image: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    rating: 4.5,
    latitude: 0.3,
    longitude: 0.4,
    amenities: ["EV Charging", "Indoor"],
    hostId: "host2",
    hostName: "Sarah Johnson",
    description: "Centrally located garage with EV stations.",
    totalSlots: 50,
    usedSlots: 25
  },
  {
    id: "3",
    name: "Waterfront Premium Parking",
    address: "789 Embarcadero, San Francisco, CA",
    price: 18,
    priceUnit: "hour",
    available: false,
    image: "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    rating: 4.9,
    latitude: 0.7,
    longitude: 0.2,
    amenities: ["Valet", "Security"],
    hostId: "host3",
    hostName: "Michael Brown",
    description: "Premium parking with valet service.",
    totalSlots: 30,
    usedSlots: 30
  }
];

const UserDashboard = () => {
  return (
    <DashboardLayout pageTitle="User Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Here's an overview of your account activity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
              <CardDescription>All time bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
              <CardDescription>Reservations in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Check your schedule</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Favorite Spots</CardTitle>
              <CardDescription>Your most visited parking locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-sm text-muted-foreground">Manage your favorites</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Account Balance</CardTitle>
              <CardDescription>Available funds for booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125.00</div>
              <Button variant="secondary" size="sm">Add Funds</Button>
            </CardContent>
          </Card>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
          <p className="text-muted-foreground">
            Your recent parking spot bookings and reservations.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECENT_SPOTS.map((spot) => (
              <Card key={spot.id}>
                <CardHeader>
                  <CardTitle>{spot.name}</CardTitle>
                  <CardDescription>{spot.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <MapPin className="mr-2 inline-block h-4 w-4" />
                    {spot.description}
                  </p>
                  <p>
                    <Clock className="mr-2 inline-block h-4 w-4" />
                    {spot.available ? "Available" : "Currently Unavailable"}
                  </p>
                  <p>
                    <CreditCard className="mr-2 inline-block h-4 w-4" />
                    ${spot.price}/{spot.priceUnit}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
