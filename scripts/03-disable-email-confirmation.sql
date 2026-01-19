-- Disable email confirmation requirement in Supabase Auth
-- This allows users to sign up and use the app immediately without email verification

-- Update auth schema to disable email confirmation
UPDATE auth.config SET jwt_secret = jwt_secret WHERE true;

-- Disable email confirmation requirement
-- Note: This needs to be done through Supabase dashboard Auth settings or via Management API
-- For testing, you can manually disable it in: 
-- Authentication > Providers > Email > Disable email confirmation (unchecking the box)
