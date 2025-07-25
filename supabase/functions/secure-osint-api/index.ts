import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { service, endpoint, data } = await req.json()
    
    // Get API keys from secrets
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')
    const hunterApiKey = Deno.env.get('HUNTER_API_KEY')
    const numverifyApiKey = Deno.env.get('NUMVERIFY_API_KEY')
    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    const opencageApiKey = Deno.env.get('OPENCAGE_API_KEY')
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')

    if (!rapidApiKey || !hunterApiKey || !numverifyApiKey || !googleMapsApiKey || !opencageApiKey || !youtubeApiKey) {
      return new Response(
        JSON.stringify({ error: 'API keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let response
    let headers = {}

    switch (service) {
      case 'rapidapi':
        headers = {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': endpoint.split('/')[2],
          'Content-Type': 'application/json'
        }
        break
      case 'hunter':
        // Hunter.io API
        const hunterUrl = `${endpoint}?api_key=${hunterApiKey}&${new URLSearchParams(data).toString()}`
        response = await fetch(hunterUrl)
        break
      case 'numverify':
        // NumVerify API
        const numverifyUrl = `${endpoint}?access_key=${numverifyApiKey}&${new URLSearchParams(data).toString()}`
        response = await fetch(numverifyUrl)
        break
      case 'google':
        if (endpoint.includes('youtube')) {
          // YouTube API
          const youtubeUrl = `${endpoint}?key=${youtubeApiKey}&${new URLSearchParams(data).toString()}`
          response = await fetch(youtubeUrl)
        } else {
          // Google Maps API
          const mapsUrl = `${endpoint}?key=${googleMapsApiKey}&${new URLSearchParams(data).toString()}`
          response = await fetch(mapsUrl)
        }
        break
      case 'opencage':
        // OpenCage API
        const opencageUrl = `${endpoint}?key=${opencageApiKey}&${new URLSearchParams(data).toString()}`
        response = await fetch(opencageUrl)
        break
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown service' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // For RapidAPI, make the request with headers
    if (service === 'rapidapi') {
      response = await fetch(endpoint, {
        method: data.method || 'GET',
        headers,
        body: data.body ? JSON.stringify(data.body) : undefined
      })
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: 'API request failed', 
          status: response.status,
          statusText: response.statusText
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await response.json()
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})