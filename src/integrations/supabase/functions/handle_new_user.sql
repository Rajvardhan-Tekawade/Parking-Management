
-- Function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Extract role from metadata; if NULL, default to 'user'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');

  -- Ensure the role is either a 'user' or 'host'
  IF user_role NOT IN ('user', 'host') THEN
    user_role := 'user';
  END IF;

  -- Log values for debugging
  RAISE LOG 'Creating profile for user % with email % and role %', 
    NEW.id, NEW.email, user_role;

  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
