
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log the 404 error but don't throw it to prevent crashing the app
    console.log('404 Error: User attempted to access non-existent route', window.location.pathname);
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          We couldn't find the page you're looking for. The page might have been removed, renamed, 
          or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
