
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/lib/types';
import { 
  fetchUserProfile,
  signInWithEmailAndPassword,
  signUpWithEmailAndPassword,
  signOutUser,
  updateUserRole as updateUserRoleService,
  createUserProfile
} from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isHost: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string, role?: 'user' | 'host') => Promise<any>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: 'user' | 'host') => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Only define useAuth once at the top level, not at the bottom again
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Track auth errors for debugging
  const [authErrors, setAuthErrors] = useState<string[]>([]);
  
  const addAuthError = (error: string) => {
    const timestamp = new Date().toISOString();
    const errorWithTimestamp = `${timestamp}: ${error}`;
    setAuthErrors(prev => [...prev, errorWithTimestamp]);
    console.error(`Auth Error: ${errorWithTimestamp}`);
  };
  
  // Function to create profile if missing
  const createProfileIfMissing = async (userId: string, userData: any) => {
    if (!userData.user_metadata) {
      console.log("No user metadata available for profile creation");
      return null;
    }
    
    try {
      console.log("Attempting to create missing profile from metadata:", userData.user_metadata);
      const role = userData.user_metadata.role === 'host' ? 'host' : 'user';
      const name = userData.user_metadata.name || userData.email?.split('@')[0] || 'User';
      
      return await createUserProfile(
        userId,
        userData.email || '',
        name,
        role
      );
    } catch (error: any) {
      console.error("Unexpected error in createProfileIfMissing:", error);
      addAuthError(`Unexpected error creating profile: ${error.message}`);
      return null;
    }
  };
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchCurrentUser = async () => {
      try {
        console.log("Checking for existing session...");
        const startTime = performance.now();
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        const sessionDuration = performance.now() - startTime;
        console.log(`Session fetch took ${sessionDuration.toFixed(2)}ms`);
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setUser(null);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        if (sessionData?.session?.user) {
          const authUser = sessionData.session.user;
          console.log("Found existing session for user:", authUser.id);
          console.log("User metadata:", authUser.user_metadata);
          
          // Try to get the profile with optimized retries
          let profile = null;
          profile = await fetchUserProfile(authUser.id);
          
          if (profile) {
            console.log("Loaded profile with role:", profile.role);
            if (isMounted) setUser(profile);
          } else {
            console.log("No profile found for authenticated user - attempting to create one");
            
            // Create profile from metadata as last resort
            const createdProfile = await createProfileIfMissing(authUser.id, authUser);
            if (createdProfile) {
              if (isMounted) setUser(createdProfile);
            } else {
              // If we still can't create a profile, log out the user
              console.warn("Could not create/find profile. Logging out user.");
              await supabase.auth.signOut();
              if (isMounted) setUser(null);
              toast.error("Your profile couldn't be loaded. Please sign in again.");
            }
          }
        } else {
          console.log("No active session found");
          if (isMounted) setUser(null);
        }
      } catch (error: any) {
        console.error("Error in auth effect:", error);
        addAuthError(`Auth initialization error: ${error.message}`);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    fetchCurrentUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (session?.user) {
        console.log("User metadata:", session.user.user_metadata);
      }
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          console.log("User signed in, fetching profile...");
          let profile = await fetchUserProfile(session.user.id);
          
          if (!profile) {
            console.log("Profile not found immediately after sign in, attempting to create one");
            profile = await createProfileIfMissing(session.user.id, session.user);
          }
          
          if (profile) {
            console.log("Profile loaded successfully:", profile);
            console.log("User role is:", profile.role);
            if (isMounted) setUser(profile);
          } else {
            console.error("Could not load or create profile after multiple attempts");
            toast.error("Could not load your profile. Please try logging in again.");
          }
        } catch (err: any) {
          console.error("Error handling sign in:", err);
          addAuthError(`Sign in error: ${err.message}`);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        if (isMounted) setUser(null);
      } else if (event === 'USER_UPDATED') {
        console.log("User updated, refreshing profile");
        if (session?.user) {
          const freshProfile = await fetchUserProfile(session.user.id);
          if (freshProfile && isMounted) {
            setUser(freshProfile);
          }
        }
      }
    });

    return () => {
      isMounted = false;
      console.log("Cleaning up auth listener");
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Starting sign in process...");
      const result = await signInWithEmailAndPassword(email, password);
      
      if (result.error) {
        console.log("Sign in error:", result.error);
        return { error: result.error };
      }
      
      if (result.profile) {
        console.log("Setting user profile after sign in:", result.profile);
        console.log("User role is:", result.profile.role);
        setUser(result.profile);
      } else {
        console.log("No profile returned from sign in");
        // We'll still return success since auth worked, but log this issue
        addAuthError("Sign in succeeded but no profile was returned");
      }
      
      return result;
    } catch (error: any) {
      console.error("Unexpected error during sign in:", error);
      addAuthError(`Sign in unexpected error: ${error.message}`);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const login = signIn;

  const signUp = async (email: string, password: string, name: string, role: 'user' | 'host' = 'user') => {
    setIsLoading(true);
    try {
      console.log("Starting sign up process with role:", role);
      const result = await signUpWithEmailAndPassword(email, password, name, role);
      console.log("Sign up result:", result);
      
      if (result.error) {
        addAuthError(`Sign up error: ${result.error.message}`);
      }
      
      return result;
    } catch (error: any) {
      console.error("Unexpected error during sign up:", error);
      addAuthError(`Sign up unexpected error: ${error.message}`);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setUser(null);
    } catch (error: any) {
      console.error("Error during sign out:", error);
      addAuthError(`Sign out error: ${error.message}`);
      toast.error("Failed to sign out properly");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = signOut;

  const handleUpdateUserRole = async (role: 'user' | 'host') => {
    if (!user) {
      toast.error("No user logged in");
      throw new Error("No user logged in");
    }
    
    setIsLoading(true);
    try {
      const updatedUser = await updateUserRoleService(user.id, role);
      setUser(updatedUser);
      console.log("User role updated to:", role);
      toast.success(`Role updated to ${role} successfully`);
    } catch (error: any) {
      console.error("Error updating user role:", error);
      addAuthError(`Role update error: ${error.message}`);
      toast.error("Failed to update user role");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Debug auth errors in development
  useEffect(() => {
    if (authErrors.length > 0) {
      console.log("Auth errors history:", authErrors);
    }
  }, [authErrors]);
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isHost: user?.role === 'host',
      isLoading,
      signIn,
      login,
      signUp,
      signOut,
      logout,
      updateUserRole: handleUpdateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Remove the duplicate export here
// export { useAuth };
