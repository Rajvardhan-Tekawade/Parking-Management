
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeftIcon, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type FormData = z.infer<typeof formSchema>;

const SignUpHost = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    console.log("Form data for host signup:", data);
    
    try {
      // Sign up with explicit host role
      const result = await signUp(data.email, data.password, data.name, 'host');
      
      if (result.error) {
        setError(result.error.message);
        throw new Error(result.error.message);
      }
      
      // Show success message
      toast.success('Host account created! Please sign in with your credentials.');
      
      // Redirect to sign in page
      navigate('/signin-host');
      
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      const errorMessage = error.message || 'An error occurred during sign up';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center text-gray-500 hover:text-gray-700"
          onClick={() => navigate('/')}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Host Account</CardTitle>
            <CardDescription className="text-center">
              Sign up to list and manage your parking spaces
            </CardDescription>
          </CardHeader>
          
          {error && (
            <div className="px-6 mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name or Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe or Acme Parking" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up as Host'
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Looking for parking instead?{' '}
                <Link to="/signup-user" className="font-medium text-primary hover:underline">
                  Sign up as a User
                </Link>
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin-host" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUpHost;
