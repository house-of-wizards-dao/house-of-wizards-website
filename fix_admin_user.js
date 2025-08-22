const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ctyeiwzxltrqyrbcbrii.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0eWVpd3p4bHRycXlyYmNicmlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTMyMjE0MiwiZXhwIjoyMDcwODk4MTQyfQ.WFthRx0xXwRNNccXEeagvSMgxc14NZ8KviKpGILglq4';

async function fixAdminUser() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Get the test user
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('List users error:', listError);
      return;
    }
    
    const testUser = users.users.find(u => u.email === 'test-admin@example.com');
    if (!testUser) {
      console.log('Test user not found');
      return;
    }
    
    console.log('Found test user:', testUser.id);
    
    // Check profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', testUser.id)
      .single();
      
    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      console.log('Creating profile for user');
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: testUser.id,
          email: testUser.email,
          role: 'admin',
          name: 'Test Admin'
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating profile:', createError);
        return;
      }
      console.log('Profile created:', newProfile);
    } else if (profileError) {
      console.error('Profile fetch error:', profileError);
      return;
    } else {
      // Profile exists, update role
      console.log('Updating existing profile role');
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', testUser.id)
        .select()
        .single();
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
        return;
      }
      console.log('Profile updated:', updatedProfile);
    }
    
  } catch (error) {
    console.error('Fix admin user error:', error);
  }
}

fixAdminUser();
