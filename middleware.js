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
  const auth = request.headers.get('authorization');

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic') {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(':');
      if (USERS[user] && USERS[user] === pass) {
        // Authenticated — add security headers
        const response = new Response(null, { status: 200 });
        // We can't modify the actual response in edge middleware this way,
        // so we use next() pattern — return undefined to pass through
        // Security headers are added via vercel.json instead
        return undefined;
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Bentor Capital Dashboard"',
      ...SECURITY_HEADERS,
    },
  });
}

export const config = {
  matcher: '/(.*)',
};
