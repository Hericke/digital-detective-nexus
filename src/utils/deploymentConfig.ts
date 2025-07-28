// Configuração para deployment em diferentes ambientes
export const deploymentConfig = {
  // Configuração para Hostinger
  hostinger: {
    buildCommand: "npm run build",
    outputDir: "dist",
    nodeVersion: "18.x",
    packageManager: "npm"
  },
  
  // Configuração para Vercel
  vercel: {
    buildCommand: "npm run build",
    outputDir: "dist",
    nodeVersion: "18.x"
  },
  
  // Configuração para Netlify
  netlify: {
    buildCommand: "npm run build",
    outputDir: "dist",
    nodeVersion: "18"
  }
};

// Headers de segurança para diferentes ambientes
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

// Configuração de build otimizada
export const buildOptimizations = {
  chunkSizeWarningLimit: 1000,
  sourcemap: false,
  minify: true,
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast'],
        maps: ['@react-google-maps/api'],
        supabase: ['@supabase/supabase-js']
      }
    }
  }
};