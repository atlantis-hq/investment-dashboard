// Frontend client for /api/portfolio.
// Returns { ok: true, data } on success, { ok: false } on failure (caller falls
// back to the static portfolio.js bundle).

export async function fetchPortfolio() {
  try {
    const res = await fetch('/api/portfolio', { headers: { accept: 'application/json' } });
    if (!res.ok) return { ok: false, status: res.status };
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err };
  }
}
