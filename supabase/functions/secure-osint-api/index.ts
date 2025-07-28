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
    const { service, endpoint, data, method = 'GET' } = await req.json()
    
    // Get API keys from secrets
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')
    const hunterApiKey = Deno.env.get('HUNTER_API_KEY')
    const numverifyApiKey = Deno.env.get('NUMVERIFY_API_KEY')
    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    const opencageApiKey = Deno.env.get('OPENCAGE_API_KEY')
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')
    const facebookApiKey = Deno.env.get('FACEBOOK_API_KEY')

    let apiUrl: string
    let headers: Record<string, string> = {}

    switch (service) {
      case 'rapidapi':
        if (!rapidApiKey) {
          throw new Error('RapidAPI key not configured')
        }
        
        apiUrl = endpoint
        headers = {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': new URL(endpoint).hostname,
          'Content-Type': 'application/json'
        }
        break
        
      case 'hunter':
        if (!hunterApiKey) {
          throw new Error('Hunter.io API key not configured')
        }
        
        const hunterParams = new URLSearchParams({
          ...data,
          api_key: hunterApiKey
        })
        apiUrl = `${endpoint}?${hunterParams}`
        break
        
      case 'numverify':
        if (!numverifyApiKey) {
          throw new Error('NumVerify API key not configured')
        }
        
        const numverifyParams = new URLSearchParams({
          ...data,
          access_key: numverifyApiKey
        })
        apiUrl = `${endpoint}?${numverifyParams}`
        break
        
      case 'google':
        if (!googleMapsApiKey) {
          throw new Error('Google API key not configured')
        }
        
        const googleParams = new URLSearchParams({
          ...data,
          key: googleMapsApiKey
        })
        apiUrl = `${endpoint}?${googleParams}`
        break

      case 'youtube':
        if (!youtubeApiKey) {
          throw new Error('YouTube API key not configured')
        }
        
        const youtubeParams = new URLSearchParams({
          ...data,
          key: youtubeApiKey
        })
        apiUrl = `${endpoint}?${youtubeParams}`
        break

      case 'facebook':
        if (!facebookApiKey) {
          throw new Error('Facebook API key not configured')
        }
        
        const facebookParams = new URLSearchParams({
          ...data,
          access_token: facebookApiKey
        })
        apiUrl = `${endpoint}?${facebookParams}`
        break
        
      case 'opencage':
        if (!opencageApiKey) {
          throw new Error('OpenCage API key not configured')
        }
        
        const opencageParams = new URLSearchParams({
          ...data,
          key: opencageApiKey
        })
        apiUrl = `${endpoint}?${opencageParams}`
        break
        
      default:
        throw new Error(`Unsupported service: ${service}`)
    }

    // Make the API request
    const response = await fetch(apiUrl, {
      method,
      headers,
      body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: 'API request failed',
          source: service,
          retryable: response.status === 429 || response.status >= 500
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const result = await response.json()
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Service temporarily unavailable',
        source: 'Secure OSINT API',
        retryable: true
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})