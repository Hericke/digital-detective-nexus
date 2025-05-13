
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Hostinger API token from secrets
    const HOSTINGER_TOKEN = Deno.env.get('HOSTINGER_TOKEN');
    
    if (!HOSTINGER_TOKEN) {
      throw new Error("Hostinger API token not found in environment variables");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { action } = await req.json();

    // Different actions to handle Hostinger API
    if (action === 'get-vms') {
      const response = await fetch(
        "https://developers.hostinger.com/api/vps/v1/virtual-machines",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${HOSTINGER_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Hostinger API error: ${response.status}`);
      }
      
      const data = await response.json();
      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // Add more actions as needed for deployment

    return new Response(JSON.stringify({ success: false, error: "Invalid action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
    
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
