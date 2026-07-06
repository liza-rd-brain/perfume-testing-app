// test-supabase.js
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

try {
  const { data, error } = await supabase
    .from('perfume-set-1')
    .select('*')
    .limit(5);

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Success! Data:', data);
  }
} catch (error) {
  console.error('❌ Exception:', error);
}