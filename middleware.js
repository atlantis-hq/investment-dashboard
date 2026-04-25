// Basic auth gate for the entire dashboard (incl. /api/*).
// Credentials from DASHBOARD_USERS env (JSON {"user":"pass",...}) with a
// hardcoded fallback. To go public, set DASHBOARD_USERS='{"_disabled":""}' and
// the middleware will short-circuit; to bypass auth temporarily, comment out
// the body. Don't forget /api/portfolio bypass works only via the same auth.

let USERS;
try {
  USERS = JSON.parse(process.env.DASHBOARD_USERS || '{}');
} catch {
  USERS = {};
}
if (!Object.keys(USERS).length) {
  USERS = { asier: '137230', igor: '137230' };
}
const AUTH_DISABLED = USERS._disabled !== undefined;

function timingSafeEqStr(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export default function middleware(request) {
  if (AUTH_DISABLED) return undefined;

  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Basic ')) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'www-authenticate': 'Basic realm="bentor-dashboard", charset="UTF-8"',
        'cache-control': 'no-store',
      },
    });
  }

  let user = '', pass = '';
  try {
    const decoded = atob(auth.slice(6));
    const idx = decoded.indexOf(':');
    user = decoded.slice(0, idx);
    pass = decoded.slice(idx + 1);
  } catch {
    return new Response('Bad credentials', { status: 400 });
  }

  const expected = USERS[user];
  if (!expected || !timingSafeEqStr(pass, expected)) {
    return new Response('Forbidden', {
      status: 401,
      headers: {
        'www-authenticate': 'Basic realm="bentor-dashboard", charset="UTF-8"',
        'cache-control': 'no-store',
      },
    });
  }

  return undefined;
}

export const config = {
  matcher: '/((?!_next/static|favicon\\.ico|robots\\.txt).*)',
};
