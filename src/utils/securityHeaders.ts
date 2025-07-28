/**
 * Security headers configuration for enhanced application security
 */

export const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://maps.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.openstreetmap.org https://nominatim.openstreetmap.org",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // XSS Protection
  'X-XSS-Protection': '1; mode=block',

  // Content type sniffing prevention
  'X-Content-Type-Options': 'nosniff',

  // HTTPS enforcement
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=()',
    'usb=()'
  ].join(', ')
};

// Apply security headers to the document
export const applySecurityHeaders = () => {
  // These would typically be set at the server level
  // For client-side applications, we can only apply some policies
  
  // Set CSP via meta tag if not already set
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = SECURITY_HEADERS['Content-Security-Policy'];
    document.head.appendChild(cspMeta);
  }

  // Disable certain browser features
  if ('permissions' in navigator) {
    // Request minimal permissions
  }
};

// Security configuration for Vite
export const VITE_SECURITY_CONFIG = {
  build: {
    rollupOptions: {
      output: {
        // Prevent code splitting that could expose internal structure
        manualChunks: undefined,
      }
    }
  },
  server: {
    headers: SECURITY_HEADERS
  }
};