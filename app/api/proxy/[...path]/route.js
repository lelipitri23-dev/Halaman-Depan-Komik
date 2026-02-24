/**
 * API Proxy Route — /app/api/proxy/[...path]/route.js
 *
 * Semua request dari browser diarahkan ke:
 *   /api/proxy/manga        → https://v1.komikcast.help/api/manga
 *   /api/proxy/read/slug/ch → https://v1.komikcast.help/api/read/slug/ch
 *   dst.
 *
 * Ini menghindari CORS error karena request datang dari server Next.js,
 * bukan langsung dari browser.
 */

const BACKEND = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export async function GET(request, { params }) {
  const path = params.path?.join('/') || '';
  const { search } = new URL(request.url);

  const targetUrl = `${BACKEND}/${path}${search}`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; KomikVerse/1.0)',
        // Forward cookies jika ada
        ...(request.headers.get('cookie')
          ? { cookie: request.headers.get('cookie') }
          : {}),
      },
      cache: 'no-store',
    });

    const data = await res.json();

    return Response.json(data, {
      status: res.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
