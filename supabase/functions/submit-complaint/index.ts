// Supabase Edge Function: submit-complaint
// Validates complaint fields, generates unguessable tracking secret and returns credentials

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateReferenceId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  const arr = new Uint8Array(5);
  crypto.getRandomValues(arr);
  for (let i = 0; i < 5; i++) {
    rand += chars[arr[i] % chars.length];
  }
  const year = new Date().getFullYear();
  return `AQA-${year}-${rand}`;
}

function generateTrackingSecret(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const getChunk = (len: number) => {
    let res = '';
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    for (let i = 0; i < len; i++) {
      res += chars[arr[i] % chars.length];
    }
    return res;
  };
  return `TRK-${getChunk(4)}-${getChunk(4)}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { issueType, areaName, description, latitude, longitude, photoUrl, reporterContact } = body;

    if (!issueType || !areaName || !description) {
      return new Response(
        JSON.stringify({ error: 'Issue type, area, and description are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const referenceId = generateReferenceId();
    const trackingSecret = generateTrackingSecret();

    // Hash secret with SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(trackingSecret.trim().toUpperCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert complaint record
    const { data: newComplaint, error: insertError } = await supabase
      .from('complaints')
      .insert({
        reference_id: referenceId,
        tracking_secret_hash: hashHex,
        issue_type: issueType,
        area_name: areaName,
        description: description,
        latitude: latitude || null,
        longitude: longitude || null,
        photo_url: photoUrl || null,
        status: 'Pending',
        reporter_contact: reporterContact || null,
      })
      .select('id')
      .single();

    if (insertError || !newComplaint) {
      throw new Error(insertError?.message || 'Database insert failed.');
    }

    // Insert initial status history
    await supabase.from('complaint_status_history').insert({
      complaint_id: newComplaint.id,
      status: 'Pending',
      notes: 'Initial community report registered.',
      changed_by: 'Citizen Reporter',
    });

    return new Response(
      JSON.stringify({
        referenceId,
        trackingSecret,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
