import { createClient } from '@supabase/supabase-js';

const supabase = createClient ("https://czflihgzksfynoqfilot.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZmxpaGd6a3NmeW5vcWZpbG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwNTczODksImV4cCI6MjAzNzYzMzM4OX0.2dKaAUrSVCJBvWJIn-y_WWVpeJJtYZxQs1VrZiuuA8M");


export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(data);
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
