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
    
    // Extract headers from data if they exist (for compatibility with client code)
    const finalCustomHeaders = { ...customHeaders, ...(data?.headers || {}) }
    
    // Get API keys from secrets
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')
    const hunterApiKey = Deno.env.get('HUNTER_API_KEY')
    const numverifyApiKey = Deno.env.get('NUMVERIFY_API_KEY')
    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    const opencageApiKey = Deno.env.get('OPENCAGE_API_KEY')
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')
    const facebookApiKey = Deno.env.get('FACEBOOK_API_KEY')
    const censysApiKey = Deno.env.get('CENSYS_API_KEY')
    const censysOrgId = Deno.env.get('CENSYS_ORG_ID')
    const worldNewsApiKey = Deno.env.get('WORLDNEWS_API_KEY')

    let apiUrl: string
    let headers: Record<string, string> = {}

    switch (service) {
      case 'rapidapi':
        if (!rapidApiKey) {
          throw new Error('RapidAPI key not configured')
        }
        
        // Build the full URL for RapidAPI endpoints
        const hostFromHeaders = finalCustomHeaders['x-rapidapi-host'] || finalCustomHeaders['X-RapidAPI-Host']
        
        if (endpoint.startsWith('https://')) {
          apiUrl = endpoint
        } else if (hostFromHeaders) {
          // Remove leading slash if present
          const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
          apiUrl = `https://${hostFromHeaders}/${cleanEndpoint}`
        } else {
          throw new Error('RapidAPI host not specified in headers')
        }
        
        headers = {
          'X-RapidAPI-Key': rapidApiKey,
          'Content-Type': finalCustomHeaders['Content-Type'] || 'application/json',
          ...finalCustomHeaders
        }
        
        // Ensure RapidAPI host header is properly set
        if (finalCustomHeaders['x-rapidapi-host']) {
          headers['X-RapidAPI-Host'] = finalCustomHeaders['x-rapidapi-host']
          delete headers['x-rapidapi-host'] // Remove lowercase version
        } else if (finalCustomHeaders['X-RapidAPI-Host']) {
          headers['X-RapidAPI-Host'] = finalCustomHeaders['X-RapidAPI-Host']
        } else {
          try {
            headers['X-RapidAPI-Host'] = new URL(apiUrl).hostname
          } catch {
            console.error('Failed to extract RapidAPI host from URL:', apiUrl)
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

      case 'censys':
        if (!censysApiKey) {
          throw new Error('Censys API key not configured')
        }
        if (!censysOrgId) {
          throw new Error('Censys Organization ID not configured')
        }
        
        apiUrl = endpoint
        headers = {
          'Authorization': `Bearer ${censysApiKey}`,
          'X-Organization-ID': censysOrgId,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
        break

      case 'worldnews':
        if (!worldNewsApiKey) {
          throw new Error('WorldNews API key not configured')
        }
        
        // For GET requests, add params to URL
        if (method === 'GET' && data && Object.keys(data).length > 0) {
          const worldNewsParams = new URLSearchParams(data)
          apiUrl = `https://api.worldnewsapi.com/${endpoint}?${worldNewsParams}`
        } else {
          apiUrl = `https://api.worldnewsapi.com/${endpoint}`
        }
        
        headers = {
          'x-api-key': worldNewsApiKey,
          'Content-Type': 'application/json'
        }
        break
        
      default:
        throw new Error(`Unsupported service: ${service}`)
    }

    // Make the API request
    let body: string | FormData | undefined
    
    if (method !== 'GET' && data) {
      // Filter out headers from data to get actual payload
      const { headers: dataHeaders, ...payload } = data
      
      // Handle different content types
      if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        body = new URLSearchParams(payload).toString()
      } else if (headers['Content-Type'] === 'application/json') {
        body = JSON.stringify(payload)
      } else {
        body = JSON.stringify(payload)
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
    console.error('Secure OSINT API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Service temporarily unavailable',
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