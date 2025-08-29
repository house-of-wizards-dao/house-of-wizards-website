import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkStorage() {
  try {
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }
    
    console.log('Available storage buckets:');
    buckets.forEach(bucket => {
      console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    
    // Check if 'files' bucket exists
    const filesBucket = buckets.find(b => b.name === 'files');
    if (filesBucket) {
      console.log('\n✅ "files" bucket exists and is', filesBucket.public ? 'public' : 'private');
    } else {
      console.log('\n❌ "files" bucket does not exist');
      
      // Create the bucket
      console.log('Creating "files" bucket...');
      const { data, error: createError } = await supabase.storage.createBucket('files', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error('Failed to create bucket:', createError);
      } else {
        console.log('✅ Created "files" bucket successfully');
      }
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkStorage();