// Backend URL — digunakan HANYA di server-side (SSR/ISR)
const BACKEND = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

// Proxy URL — digunakan di CLIENT-SIDE untuk menghindari CORS
// Request browser → Next.js server → API backend
const getProxyBase = () => {
  if (typeof window !== 'undefined') {
    // Client-side: pakai proxy Next.js
    return `${window.location.origin}/api/proxy`;
  }
  // Server-side: langsung ke backend
  return BACKEND;
};

async function fetchAPI(endpoint, options = {}) {
  const base = getProxyBase();
  // Endpoint sudah dimulai dengan '/', proxy path tidak boleh double slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  try {
    const res = await fetch(`${base}${cleanEndpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'API Error');
    return json;
  } catch (err) {
    console.error(`[API] ${endpoint}:`, err.message);
    return { data: null, pagination: null, error: err.message };
  }
}

// Home page data
export async function getHomeData() {
  return fetchAPI('/home');
}

// Manga list with filters
export async function getMangaList(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return fetchAPI(`/manga${qs ? '?' + qs : ''}`);
}

// Manga detail by slug
export async function getMangaDetail(slug) {
  return fetchAPI(`/manga/${slug}`);
}

// Read chapter
export async function getChapter(slug, chapterSlug) {
  return fetchAPI(`/read/${slug}/${chapterSlug}`);
}

// Genre list
export async function getGenres() {
  return fetchAPI('/genres');
}

// Sitemap: get all manga slugs
export async function getAllMangaSlugs() {
  const res = await fetchAPI('/manga?limit=1000');
  return res.data || [];
}
