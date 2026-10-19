// Supabase Edge Function: track-complaint
// Validates Reference ID + Tracking Secret and returns sanitized public details

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { referenceId, trackingSecret } = await req.json();

    if (!referenceId || !trackingSecret) {
      return new Response(
        JSON.stringify({ error: 'Both referenceId and trackingSecret are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash tracking secret using Web Crypto
    const encoder = new TextEncoder();
    const data = encoder.encode(trackingSecret.trim().toUpperCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call secure Postgres RPC
    const { data: complaintData, error } = await supabase.rpc('track_complaint_secure', {
      p_reference_id: referenceId.trim().toUpperCase(),
      p_secret_hash: hashHex,
    });

    if (error || !complaintData) {
      return new Response(
        JSON.stringify({ error: 'Complaint not found or invalid credentials.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(complaintData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
