// Credentials from env var (JSON: {"user":"pass",...}) with hardcoded fallback
let USERS;
try {
  USERS = JSON.parse(process.env.DASHBOARD_USERS || '{}');
} catch {
  USERS = {};
}
// Fallback if env var not set
if (!Object.keys(USERS).length) {
  USERS = { asier: '137230', igor: '137230' };
}

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://docs.google.com https://*.supabase.co;",
};

export default function middleware(request) {
  // Auth temporarily disabled — public access
  return undefined;
}

export const config = {
  matcher: '/(.*)',
};
