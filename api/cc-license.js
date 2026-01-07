// api/cc-license.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  const { subdomain } = req.query;

  if (!subdomain) {
    return res.status(400).json({ licensed: false, reason: 'Missing subdomain' });
  }

  // Adjust table / column names to match your Supabase
  const { data, error } = await supabase
    .from('tenants')
    .select('is_active, cc_optimizer_enabled')
    .eq('subdomain', subdomain)
    .single();

  if (error || !data) {
    return res.status(200).json({ licensed: false, reason: 'Subdomain not found' });
  }

  const licensed = !!data.is_active && !!data.cc_optimizer_enabled;
  return res.status(200).json({ licensed });
}
