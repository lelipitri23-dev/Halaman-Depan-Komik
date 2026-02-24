import { getMangaList, getGenres } from '@/lib/api';
import Navbar from '@/components/Navbar';
import MangaCard from '@/components/MangaCard';
import Link from 'next/link';

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
    description: `${title} - Temukan ribuan judul manga, manhwa, dan manhua di Komikcast.`,
  };
}

const TYPES = ['all', 'manga', 'manhwa', 'manhua'];
const STATUSES = ['all', 'ongoing', 'completed'];
const ORDERS = [
  { value: 'latest', label: 'Terbaru' },
  { value: 'popular', label: 'Populer' },
  { value: 'az', label: 'A–Z' },
  { value: 'za', label: 'Z–A' },
];

export default async function BrowsePage({ searchParams }) {
  const params = {
    page: searchParams?.page || 1,
    q: searchParams?.q || '',
    status: searchParams?.status || 'all',
    type: searchParams?.type || 'all',
    genre: searchParams?.genre || 'all',
    order: searchParams?.order || 'latest',
    limit: 24,
  };

  // Remove empty params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v && v !== 'all' && v !== '')
  );

  const [mangaRes, genreRes] = await Promise.all([
    getMangaList({ ...params }),
    getGenres(),
  ]);

  const mangas = mangaRes?.data || [];
  const pagination = mangaRes?.pagination || {};
  const genres = genreRes?.data || [];

  const buildHref = (newParams) => {
    const merged = { ...cleanParams, ...newParams };
    const qs = new URLSearchParams(merged).toString();
    return `/manga?${qs}`;
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      <main className="pt-14 pb-safe max-w-2xl mx-auto">
        {/* Header */}
        <div className="px-4 py-4">
          <h1 className="font-display text-2xl text-text-primary tracking-widest">
            {params.q ? `HASIL: "${params.q}"` : 'KOLEKSI KOMIK'}
          </h1>
          <p className="text-text-muted text-xs mt-0.5">
            {pagination.totalItems || 0} judul ditemukan
          </p>
        </div>

        {/* Filters */}
        <div className="px-4 space-y-3 mb-4">
          {/* Type filter */}
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1.5">Tipe</p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {TYPES.map((t) => (
                <Link
                  key={t}
                  href={buildHref({ type: t, page: 1 })}
                  className={`flex-none text-xs font-bold px-3 py-1.5 rounded-full border transition-colors capitalize ${
                    (params.type === t) || (t === 'all' && (!params.type || params.type === 'all'))
                      ? 'bg-accent-red border-accent-red text-white'
                      : 'bg-bg-elevated border-border text-text-secondary hover:border-accent-red/50'
                  }`}
                >
                  {t === 'all' ? 'Semua' : t.charAt(0).toUpperCase() + t.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1.5">Status</p>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <Link
                  key={s}
                  href={buildHref({ status: s, page: 1 })}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors capitalize ${
                    params.status === s || (s === 'all' && (!params.status || params.status === 'all'))
                      ? 'bg-accent-red border-accent-red text-white'
                      : 'bg-bg-elevated border-border text-text-secondary hover:border-accent-red/50'
                  }`}
                >
                  {s === 'all' ? 'Semua' : s === 'ongoing' ? 'Ongoing' : 'Completed'}
                </Link>
              ))}
            </div>
          </div>

          {/* Order */}
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1.5">Urutkan</p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {ORDERS.map(({ value, label }) => (
                <Link
                  key={value}
                  href={buildHref({ order: value, page: 1 })}
                  className={`flex-none text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                    params.order === value || (!params.order && value === 'latest')
                      ? 'bg-accent-red border-accent-red text-white'
                      : 'bg-bg-elevated border-border text-text-secondary hover:border-accent-red/50'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1.5">Genre</p>
              <div className="flex gap-2 flex-wrap max-h-24 overflow-y-auto pb-1">
                <Link
                  href={buildHref({ genre: 'all', page: 1 })}
                  className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${
                    !params.genre || params.genre === 'all'
                      ? 'bg-accent-red border-accent-red text-white'
                      : 'bg-bg-elevated border-border text-text-secondary hover:border-accent-red/50'
                  }`}
                >
                  Semua
                </Link>
                {genres.slice(0, 30).map((g) => (
                  <Link
                    key={g.name}
                    href={buildHref({ genre: g.name, page: 1 })}
                    className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors capitalize ${
                      params.genre === g.name
                        ? 'bg-accent-red border-accent-red text-white'
                        : 'bg-bg-elevated border-border text-text-secondary hover:border-accent-red/50'
                    }`}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {mangas.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 px-4">
            {mangas.map((manga) => (
              <MangaCard key={manga._id || manga.slug} manga={manga} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <span className="text-5xl mb-4">😮</span>
            <p className="font-display text-xl text-text-secondary tracking-wider">TIDAK DITEMUKAN</p>
            <p className="text-text-muted text-sm mt-2">Coba filter atau kata kunci lain</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 px-4 py-6">
            {pagination.currentPage > 1 && (
              <Link
                href={buildHref({ page: pagination.currentPage - 1 })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bg-elevated border border-border text-text-secondary hover:border-accent-red hover:text-accent-red transition-colors text-sm font-semibold"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Prev
              </Link>
            )}
            <span className="text-text-muted text-sm font-semibold">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            {pagination.currentPage < pagination.totalPages && (
              <Link
                href={buildHref({ page: pagination.currentPage + 1 })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bg-elevated border border-border text-text-secondary hover:border-accent-red hover:text-accent-red transition-colors text-sm font-semibold"
              >
                Next
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
