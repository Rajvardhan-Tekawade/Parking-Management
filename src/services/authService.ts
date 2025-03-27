
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/lib/types';
import { mapUserProfile } from '@/lib/mappers';
import { toast } from 'sonner';

// Enhanced error logging with timestamps and context
const logError = (context: string, error: any): void => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error in ${context}:`, error);
};

// Improved helper function to handle Supabase errors with better context and retrying
const handleSupabaseError = (error: any, context: string): void => {
  logError(context, error);
  
  // Check for RLS policy errors
  if (error?.code === '42501' || error?.message?.includes('row-level security policy')) {
    console.error(`RLS policy violation in ${context}:`, error);
    toast.error(`Security policy error: ${error.message || 'Unable to access resource'}`);
    return;
  }
  
  // Handle other errors
  toast.error(error.message || `An error occurred during ${context}`);
};

// Optimized profile fetching with better retry logic and caching
const MAX_RETRIES = 3;
const RETRY_DELAY = 500; // Reduced from 800ms to improve perceived performance

// Cache for profiles to reduce redundant fetches
const profileCache = new Map<string, {profile: UserProfile, timestamp: number}>();
const CACHE_TTL = 60000; // 1 minute cache

export const fetchUserProfile = async (userId: string, retryCount = 0): Promise<UserProfile | null> => {
  if (!userId) {
    console.error("Attempted to fetch profile with null or empty userId");
    return null;
  }

  // Check cache first
  const cachedProfile = profileCache.get(userId);
  if (cachedProfile && (Date.now() - cachedProfile.timestamp < CACHE_TTL)) {
    console.log("Returning cached profile for user:", userId);
    return cachedProfile.profile;
  }
  
  try {
    console.log(`Fetching profile for user ID: ${userId} (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
    
    const startTime = performance.now();
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    const duration = performance.now() - startTime;
    
    console.log(`Profile fetch took ${duration.toFixed(2)}ms`);
      
    if (profileError) {
      logError("profile fetch", profileError);
      
      // If we have retries left and it's likely a timing issue, retry
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying profile fetch (${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchUserProfile(userId, retryCount + 1);
      }
      
      handleSupabaseError(profileError, 'profile fetch');
      return null;
    } else if (profileData) {
      console.log("Profile found:", profileData);
      const mappedProfile = mapUserProfile(profileData);
      
      if (mappedProfile) {
        // Update cache
        profileCache.set(userId, {
          profile: mappedProfile,
          timestamp: Date.now()
        });
      }
      
      return mappedProfile;
    } else {
      console.log("No profile found for user:", userId);
      return null;
    }
  } catch (error) {
    logError("fetchUserProfile unexpected", error);
    return null;
  }
};

// Clear cache entry when profile might be changed
export const invalidateProfileCache = (userId: string): void => {
  if (profileCache.has(userId)) {
    console.log(`Invalidating cached profile for user: ${userId}`);
    profileCache.delete(userId);
  }
};

export const createUserProfile = async (
  userId: string, 
  email: string, 
  name: string, 
  role: 'user' | 'host' = 'user'
): Promise<UserProfile | null> => {
  try {
    console.log(`Creating new profile for user ${userId} with role ${role}`);
    
    const profileData = {
      id: userId,
      email,
      name,
      role
    };
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert(profileData);
    
    if (insertError) {
      // Special handling for duplicate inserts which could happen due to race conditions
      if (insertError.code === '23505') { // Unique violation
        console.log("Profile already exists (duplicate key). This is likely a race condition - fetching existing profile.");
        return fetchUserProfile(userId);
      }
      
      handleSupabaseError(insertError, 'profile creation');
      return null;
    }
    
    // Fetch the newly created profile to ensure we have the correct data
    console.log("Profile created successfully, fetching fresh data");
    return fetchUserProfile(userId);
  } catch (error) {
    logError("createUserProfile", error);
    toast.error("Failed to create user profile. Please try again.");
    return null;
  }
};

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    console.log("Signing in with email:", email);
    const startTime = performance.now();
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    const authDuration = performance.now() - startTime;
    console.log(`Auth request took ${authDuration.toFixed(2)}ms`);
    
    if (error) {
      logError("sign in", error);
      toast.error(error.message || "Failed to sign in");
      return { error };
    }
    
    if (data.user) {
      console.log("Sign in successful for user:", data.user.id);
      
      // Attempt to fetch profile with optimized retry strategy
      let profile = await fetchUserProfile(data.user.id);
      
      if (!profile) {
        console.log("Profile not found immediately after sign in");
        
        // Check if we have metadata to create a profile
        if (data.user.user_metadata?.name) {
          console.log("Creating profile from metadata:", data.user.user_metadata);
          
          profile = await createUserProfile(
            data.user.id,
            data.user.email || email,
            data.user.user_metadata.name,
            data.user.user_metadata.role as 'user' | 'host' || 'user'
          );
          
          if (profile) {
            console.log("Profile created successfully from metadata");
          } else {
            console.error("Failed to create profile from metadata");
          }
        } else {
          // Last attempt with a short delay
          console.log("Waiting briefly for profile to be available...");
          await new Promise(resolve => setTimeout(resolve, 500));
          profile = await fetchUserProfile(data.user.id);
        }
      }
      
      return { data, profile };
    }
    
    return { data };
  } catch (error) {
    logError("signIn function", error);
    toast.error("An unexpected error occurred during sign in. Please try again.");
    return { error };
  }
};

export const signUpWithEmailAndPassword = async (
  email: string, 
  password: string, 
  name: string, 
  role: 'user' | 'host' = 'user'
) => {
  try {
    console.log("Starting signup process with email:", email, "and role:", role);
    
    // Sign up the user with metadata including role - ensure the role is explicitly set
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: role // Ensure role is passed to Supabase metadata
        }
      }
    });
    
    if (signUpError) {
      logError("sign up", signUpError);
      toast.error(signUpError.message || "Error during sign up");
      return { error: signUpError };
    }
    
    if (!userData.user) {
      console.error("No user returned from signup");
      toast.error("Failed to create account. Please try again.");
      return { error: { message: 'Failed to create user account' } };
    }
    
    console.log("User signup successful:", userData.user.id);
    console.log("User metadata after signup:", userData.user.user_metadata);
    
    // Create profile manually to ensure it exists - waiting briefly for auth to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Try to create profile for the new user
    const profile = await createUserProfile(userData.user.id, email, name, role);
    
    if (profile) {
      console.log("Profile created successfully for role:", role);
      toast.success("Account created successfully! Please sign in.");
      return { data: userData, profile };
    } else {
      // Profile creation failed but signup was successful
      console.log("User created but profile setup had issues");
      toast.success("Account created successfully but profile setup had issues. You may need to set up your profile later.");
      return { data: userData };
    }
  } catch (error: any) {
    logError("signUp function", error);
    toast.error(error.message || "An unexpected error occurred during sign up");
    return { error: { message: error.message || "An unexpected error occurred during sign up" } };
  }
};

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      logError("sign out", error);
      toast.error("Failed to sign out");
      throw error;
    }
    toast.success("Signed out successfully");
    return true;
  } catch (error) {
    logError("signOut function", error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: 'user' | 'host') => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      handleSupabaseError(error, 'role update');
      throw error;
    }
    
    // Invalidate cache for this user
    invalidateProfileCache(userId);
    
    const mappedProfile = mapUserProfile(data);
    if (!mappedProfile) {
      throw new Error("Failed to map updated profile");
    }
    
    return mappedProfile;
  } catch (error) {
    logError("updateUserRole", error);
    throw error;
  }
};
