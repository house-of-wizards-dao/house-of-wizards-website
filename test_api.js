const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ctyeiwzxltrqyrbcbrii.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0eWVpd3p4bHRycXlyYmNicmlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTMyMjE0MiwiZXhwIjoyMDcwODk4MTQyfQ.WFthRx0xXwRNNccXEeagvSMgxc14NZ8KviKpGILglq4';

async function testAPI() {
  // Create a test user and get their auth token
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // First, let's try creating a test user with admin role
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test-admin@example.com',
      password: 'testpassword123',
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    });
    
    if (authError && !authError.message.includes('already been registered')) {
      console.error('Auth error:', authError);
      return;
    }
    
    // Get the user's session token
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: 'test-admin@example.com',
      password: 'testpassword123'
    });
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return;
    }
    
    const accessToken = sessionData.session.access_token;
    console.log('Got access token:', accessToken.substring(0, 20) + '...');
    
    // Now test the API endpoint
    const response = await fetch('http://localhost:3000/api/admin/auctions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    const responseData = await response.text();
    console.log('Response data:', responseData);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAPI();
