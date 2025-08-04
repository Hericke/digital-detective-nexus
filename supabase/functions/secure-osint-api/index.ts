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
    const { service, endpoint, data, method = 'GET', headers: customHeaders = {} } = await req.json()
    
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
        
        // Support both new format (host/path) and old format (full endpoint)
        if (endpoint.includes('.p.rapidapi.com')) {
          apiUrl = `https://${endpoint}`
        } else {
          apiUrl = endpoint.startsWith('http') ? endpoint : `https://${endpoint}`
        }
        
        headers = {
          'X-RapidAPI-Key': rapidApiKey,
          'Content-Type': 'application/json',
          ...customHeaders
        }
        
        // Handle custom headers for RapidAPI services
        if (customHeaders['x-rapidapi-host']) {
          headers['X-RapidAPI-Host'] = customHeaders['x-rapidapi-host']
        } else {
          try {
            headers['X-RapidAPI-Host'] = new URL(apiUrl).hostname
          } catch {
            // If URL parsing fails, try to extract hostname from endpoint
            const hostMatch = endpoint.match(/([^\/]+\.p\.rapidapi\.com)/)
            if (hostMatch) {
              headers['X-RapidAPI-Host'] = hostMatch[1]
            }
          }
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
    let body: string | FormData | undefined
    
    if (method !== 'GET' && data) {
      // Handle different content types
      if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        body = new URLSearchParams(data).toString()
      } else if (headers['Content-Type'] === 'application/json') {
        body = JSON.stringify(data)
      } else {
        body = JSON.stringify(data)
      }
    }

    const response = await fetch(apiUrl, {
      method,
      headers,
      body,
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