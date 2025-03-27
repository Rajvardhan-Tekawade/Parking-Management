
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Car, Lock, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SignInHost = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await signIn(email, password);
      if (result.error) {
        throw new Error(result.error.message || 'Failed to sign in');
      }
      
      // Check if user has the correct role, if not show an error
      if (result.profile && result.profile.role !== 'host') {
        setError('This account is registered as a user. Please use the user sign in page.');
        toast.error('Wrong account type. Please use user sign in.');
        return;
      }
      
      toast.success('Signed in successfully');
      navigate('/host/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Failed to sign in';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-primary text-xl font-bold">
            <Car size={32} />
            <span>SpaceDrive</span>
          </Link>
          <h1 className="mt-6 text-3xl font-extrabold">Host Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your credentials to access your host account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Host Sign In</CardTitle>
            <CardDescription>Sign in to manage your parking spaces</CardDescription>
          </CardHeader>
          
          {error && (
            <div className="px-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In as Host'}
              </Button>
              
              <div className="text-sm text-center text-muted-foreground">
                Need to sign in as a user?{' '}
                <Link to="/signin-user" className="font-medium text-primary hover:underline">
                  User Sign In
                </Link>
              </div>
              
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup-host" className="font-medium text-primary hover:underline">
                  Sign up as Host
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignInHost;
