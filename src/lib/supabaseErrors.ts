
/**
 * Helper functions for handling common Supabase errors
 */

export const getReadableError = (error: any): string => {
  if (!error) return 'Unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.error_description) return error.error_description;
  
  if (error.details) return error.details;
  
  return 'An error occurred with the database operation';
};

export const handleSupabaseError = (error: any, fallbackMessage: string): string => {
  console.error('Supabase error:', error);
  
  // Try to get a readable message
  const errorMessage = getReadableError(error);
  
  // Handle specific error codes
  if (error?.code === '23505') {
    return 'This record already exists';
  }
  
  if (error?.code === '23503') {
    return 'This operation failed because the record references non-existent data';
  }
  
  if (error?.code === 'PGRST116') {
    return 'You do not have permission to perform this action';
  }
  
  if (error?.code === '42501') {
    return 'You do not have permission to access this resource';
  }
  
  if (error?.code === '23514') {
    return 'The data violates a constraint - please check your inputs';
  }
  
  // Return either the extracted message or the fallback
  return errorMessage || fallbackMessage;
};

export const isAuthError = (error: any): boolean => {
  return (
    error?.message?.includes('not authenticated') ||
    error?.message?.includes('JWT expired') ||
    error?.code === '401' ||
    error?.status === 401
  );
};
