
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SpotDetail from "./pages/SpotDetail";
import NotFound from "./pages/NotFound";

// Auth pages
import SignInUser from "./pages/auth/SignInUser";
import SignInHost from "./pages/auth/SignInHost";
import SignUpUser from "./pages/auth/SignUpUser";
import SignUpHost from "./pages/auth/SignUpHost";

// Dashboard pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import HostDashboard from "./pages/dashboard/HostDashboard";
import BookingManagement from "./pages/dashboard/BookingManagement";
import SearchResults from "./pages/SearchResults";
import ParkingSpotForm from "./pages/dashboard/ParkingSpotForm";
import ReportsPage from "./pages/dashboard/ReportsPage";
import HostSpots from "./pages/dashboard/HostSpots";

// Create a client with retry configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1,
      retryDelay: 1000
    }
  }
});

// Protected route component for user role
const UserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin-user" />;
  }
  
  // Ensure user has correct role
  if (user?.role !== 'user') {
    return <Navigate to="/signin-user" />;
  }
  
  return <>{children}</>;
};

// Protected route component for host role
const HostProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin-host" />;
  }
  
  // Ensure user has correct role
  if (user?.role !== 'host') {
    return <Navigate to="/signin-host" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/spot/:id" element={<SpotDetail />} />
              <Route path="/search" element={<SearchResults />} />
              
              {/* Auth Routes */}
              <Route path="/signin-user" element={<SignInUser />} />
              <Route path="/signin-host" element={<SignInHost />} />
              <Route path="/signup-user" element={<SignUpUser />} />
              <Route path="/signup-host" element={<SignUpHost />} />
              
              {/* Legacy routes - redirect to new paths */}
              <Route path="/signin" element={<Navigate to="/signin-user" />} />
              <Route path="/signup" element={<Navigate to="/signup-user" />} />
              
              {/* User Protected Routes */}
              <Route path="/dashboard" element={
                <UserProtectedRoute>
                  <UserDashboard />
                </UserProtectedRoute>
              } />
              <Route path="/bookings" element={
                <UserProtectedRoute>
                  <BookingManagement />
                </UserProtectedRoute>
              } />
              <Route path="/reports" element={
                <UserProtectedRoute>
                  <ReportsPage />
                </UserProtectedRoute>
              } />
              
              {/* Host Protected Routes */}
              <Route path="/host/dashboard" element={
                <HostProtectedRoute>
                  <HostDashboard />
                </HostProtectedRoute>
              } />
              <Route path="/host/spots" element={
                <HostProtectedRoute>
                  <HostSpots />
                </HostProtectedRoute>
              } />
              <Route path="/host/spots/new" element={
                <HostProtectedRoute>
                  <ParkingSpotForm />
                </HostProtectedRoute>
              } />
              <Route path="/host/spots/edit/:id" element={
                <HostProtectedRoute>
                  <ParkingSpotForm />
                </HostProtectedRoute>
              } />
              <Route path="/host/bookings" element={
                <HostProtectedRoute>
                  <BookingManagement isHostView={true} />
                </HostProtectedRoute>
              } />
              <Route path="/host/reports" element={
                <HostProtectedRoute>
                  <ReportsPage isHostView={true} />
                </HostProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
