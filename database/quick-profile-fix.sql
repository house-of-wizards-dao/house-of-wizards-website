-- Quick Profile Fix - Run this in Supabase SQL Editor if profiles table is empty
-- This will ensure the profile creation trigger works correctly

-- First, check what we have
DO $$
BEGIN
    RAISE NOTICE 'Checking current database state...';
END $$;

-- Check if profiles table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') 
        THEN 'Profiles table EXISTS' 
        ELSE 'Profiles table MISSING - need to run step1-main-schema.sql first' 
    END as table_status;

-- Check if trigger function exists  
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'handle_new_user') 
        THEN 'Trigger function EXISTS' 
        ELSE 'Trigger function MISSING' 
    END as function_status;

-- Check if trigger exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') 
        THEN 'Trigger EXISTS' 
        ELSE 'Trigger MISSING' 
    END as trigger_status;

-- Check if any users exist in auth.users
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM auth.users) 
        THEN CONCAT('Found ', (SELECT COUNT(*) FROM auth.users), ' users in auth.users')
        ELSE 'No users found in auth.users'
    END as users_status;

-- Check if any profiles exist
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') 
        THEN (
            CASE 
                WHEN EXISTS (SELECT 1 FROM profiles) 
                THEN CONCAT('Found ', (SELECT COUNT(*) FROM profiles), ' profiles in profiles table')
                ELSE 'Profiles table is EMPTY'
            END
        )
        ELSE 'Profiles table does not exist'
    END as profiles_status;

-- If everything exists but profiles are empty, create profiles for existing users
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Only run if profiles table exists and is empty, but auth.users has users
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') 
       AND NOT EXISTS (SELECT 1 FROM profiles)
       AND EXISTS (SELECT 1 FROM auth.users) THEN
        
        RAISE NOTICE 'Creating missing profiles for existing users...';
        
        -- Create profiles for all existing auth users
        FOR user_record IN SELECT id, email, raw_user_meta_data, created_at FROM auth.users LOOP
            INSERT INTO profiles (id, name, email, role, created_at)
            VALUES (
                user_record.id,
                COALESCE(user_record.raw_user_meta_data->>'name', user_record.email),
                user_record.email,
                'user',
                user_record.created_at
            )
            ON CONFLICT (id) DO NOTHING;
            
            RAISE NOTICE 'Created profile for user: %', user_record.email;
        END LOOP;
        
        RAISE NOTICE 'Profile creation complete!';
    ELSE
        RAISE NOTICE 'No action needed - either no users exist or profiles already exist';
    END IF;
END $$;

-- Verify the trigger is working by showing final counts
DO $$
BEGIN
    RAISE NOTICE 'Final verification:';
    RAISE NOTICE 'Users in auth.users: %', (SELECT COUNT(*) FROM auth.users);
    RAISE NOTICE 'Profiles created: %', (SELECT COUNT(*) FROM profiles);
    
    IF (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM profiles) THEN
        RAISE NOTICE 'SUCCESS: User and profile counts match!';
    ELSE
        RAISE NOTICE 'WARNING: Mismatch between users and profiles - trigger may not be working';
    END IF;
END $$;