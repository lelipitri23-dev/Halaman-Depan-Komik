import { getMangaList, getGenres } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import BrowseControl from '@/components/BrowseControl';

export const revalidate = 120;

export async function generateMetadata({ searchParams }) {
  const q = searchParams?.q;
  const type = searchParams?.type;
  const genre = searchParams?.genre;
  let title = 'Daftar Komik';
  if (q) title = `Cari: ${q}`;
  else if (type) title = `${type.charAt(0).toUpperCase() + type.slice(1)} Terbaru`;
  else if (genre) title = `Genre: ${genre}`;
  return {
    title,
    description: `${title} - Temukan ribuan judul manga di Komikcast.`,
  };
}

export default async function BrowsePage({ searchParams }) {
  const params = {
    page: Number(searchParams?.page) || 1,
    q: searchParams?.q || '',
    status: searchParams?.status || 'all',
    type: searchParams?.type || 'all',
    genre: searchParams?.genre || 'all',
    order: searchParams?.order || 'latest',
    limit: 24,
  };

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v && v !== 'all' && v !== '' && v !== 1)
  );

  const buildHref = (newParams) => {
    const isPagination = Object.keys(newParams).includes('page');
    const finalParams = { ...cleanParams, ...newParams, page: isPagination ? newParams.page : 1 };
    
    if (finalParams.type === 'all') delete finalParams.type;
    if (finalParams.status === 'all') delete finalParams.status;
    if (finalParams.genre === 'all') delete finalParams.genre;
    if (finalParams.order === 'latest') delete finalParams.order;
    if (finalParams.page === 1) delete finalParams.page;
    return `/manga?${new URLSearchParams(finalParams).toString()}`;
  };

  // Fetch Data
  const [mangaRes, genreRes] = await Promise.all([
    getMangaList({ ...params }),
    getGenres(),
  ]);

  const mangas = mangaRes?.data || [];
  const pagination = mangaRes?.pagination || {};
  const genres = genreRes?.data || [];

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <Navbar />

      <main className="pt-24 max-w-5xl mx-auto px-4">
        {/* PASS DATA KE CLIENT COMPONENT
          BrowseControl sekarang menangani:
          1. Filter Logic
          2. Toggle Grid/List
          3. Rendering Komik (Mapping data)
        */}
        <BrowseControl 
          genres={genres} 
          totalItems={pagination.totalItems || 0}
          q={params.q}
          mangas={mangas} // <-- Data komik dikirim ke sini
        />

        {/* ─── Pagination Tetap di Server Component ──────────────── */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-10 mt-4">
            <Link
              href={pagination.currentPage > 1 ? buildHref({ page: pagination.currentPage - 1 }) : '#'}
              aria-disabled={pagination.currentPage <= 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                pagination.currentPage > 1
                  ? 'bg-bg-elevated border-border text-text-primary hover:border-accent-red hover:text-accent-red hover:-translate-x-1'
                  : 'bg-transparent border-transparent text-text-muted opacity-50 cursor-not-allowed'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Prev
            </Link>

            <div className="flex flex-col items-center">
              <span className="text-text-primary font-bold text-sm">
                Halaman {pagination.currentPage}
              </span>
              <span className="text-text-muted text-[10px]">
                dari {pagination.totalPages}
              </span>
            </div>

            <Link
              href={pagination.currentPage < pagination.totalPages ? buildHref({ page: pagination.currentPage + 1 }) : '#'}
              aria-disabled={pagination.currentPage >= pagination.totalPages}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                pagination.currentPage < pagination.totalPages
                  ? 'bg-bg-elevated border-border text-text-primary hover:border-accent-red hover:text-accent-red hover:translate-x-1'
                  : 'bg-transparent border-transparent text-text-muted opacity-50 cursor-not-allowed'
              }`}
            >
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}