/**
 * Admin User Setup Script
 * 
 * SECURITY NOTE: This script should only be run in development environments.
 * Never commit actual credentials to version control.
 * 
 * Usage:
 * 1. Ensure .env.local exists with proper SUPABASE_SERVICE_ROLE_KEY
 * 2. Run: npx tsx scripts/db/maintenance/admin-user-setup.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing required environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

async function setupAdminUser(email: string = 'admin@example.com', name: string = 'Admin User') {
  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
  
  try {
    console.log('Setting up admin user...');
    
    // Get or create the user
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }
    
    let targetUser = users.users.find(u => u.email === email);
    
    if (!targetUser) {
      console.log(`Creating new user: ${email}`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: 'temp-password-change-immediately',
        email_confirm: true,
      });
      
      if (createError) {
        console.error('Error creating user:', createError);
        return;
      }
      targetUser = newUser.user;
    }
    
    if (!targetUser) {
      console.error('Failed to create or find user');
      return;
    }
    
    console.log('Found/created user:', targetUser.id);
    
    // Check/create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUser.id)
      .single();
      
    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      console.log('Creating admin profile...');
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: targetUser.id,
          email: targetUser.email,
          role: 'admin',
          name: name
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating profile:', createError);
        return;
      }
      console.log('Admin profile created successfully:', newProfile);
    } else if (profileError) {
      console.error('Profile fetch error:', profileError);
      return;
    } else {
      // Profile exists, ensure admin role
      console.log('Updating existing profile to admin role...');
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', targetUser.id)
        .select()
        .single();
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
        return;
      }
      console.log('Profile updated to admin:', updatedProfile);
    }
    
    console.log('✅ Admin user setup completed successfully');
    
  } catch (error) {
    console.error('❌ Admin user setup failed:', error);
    process.exit(1);
  }
}

// Run the script
const email = process.argv[2] || 'admin@example.com';
const name = process.argv[3] || 'Admin User';

setupAdminUser(email, name).then(() => {
  process.exit(0);
});