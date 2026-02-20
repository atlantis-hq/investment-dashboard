const USERS = {
  asier: '137230',
  igor: '137230',
};

export default function middleware(request) {
  const auth = request.headers.get('authorization');

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic') {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(':');
      if (USERS[user] && USERS[user] === pass) {
        return undefined;
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Bentor Capital Dashboard"',
    },
  });
}

export const config = {
  matcher: '/(.*)',
};
