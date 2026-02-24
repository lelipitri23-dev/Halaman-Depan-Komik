import Link from 'next/link';
import Image from 'next/image';

export default function MangaCard({ manga, size = 'md' }) {
  if (!manga) return null;

  return (
    <Link
      href={`/manga/${manga.slug}`}
      className="group block rounded-xl overflow-hidden bg-bg-card border border-border hover:border-accent-red transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 flex flex-col"
    >
      {/* ── Cover Image — fixed aspect ratio, never stretches ── */}
      <div className="relative w-full aspect-[2/3] overflow-hidden flex-shrink-0">
        {manga.coverImage ? (
          <Image
            src={manga.coverImage}
            alt={manga.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-text-muted">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8 7h8M8 12h8M8 17h5" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-card pointer-events-none" />

        {/* Type badge — top left */}
        <div className="absolute top-1.5 left-1.5">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider leading-none ${manga.type?.toLowerCase() === 'manhua'
              ? 'bg-orange-500/90 text-white'
              : 'bg-blue-600/90 text-white'
            }`}>
            {manga.type || 'Manga'}
          </span>
        </div>

        {/* Status badge — top right */}
        {manga.status && (
          <div className="absolute top-1.5 right-1.5">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider leading-none ${manga.status?.toLowerCase() === 'ongoing'
                ? 'bg-green-600/90 text-white'
                : 'bg-gray-600/90 text-white'
              }`}>
              {manga.status?.toLowerCase() === 'ongoing' ? 'ON' : 'END'}
            </span>
          </div>
        )}

        {/* Last chapter — pinned bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-1.5 pt-5 bg-gradient-to-t from-black/85 to-transparent">
          <p className="text-white/90 text-[10px] font-semibold truncate leading-none">
            {manga.last_chapter || ''}
          </p>
        </div>
      </div>

      {/* ── Info bar — FIXED height 56px, never changes ── */}
      <div className="p-2 flex-shrink-0" style={{ height: '56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        {/* Title: clamped to exactly 2 lines */}
        <p
          className="text-[11px] font-bold text-text-primary leading-tight"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {manga.title}
        </p>

        {/* Stats row: rating + views */}
        <div className="flex items-center">
          {manga.rating > 0 && (
            <div className="flex items-center gap-0.5">
              <svg viewBox="0 0 24 24" fill="#ffd700" className="w-2.5 h-2.5 flex-shrink-0">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-[10px] text-text-secondary font-semibold">{manga.rating?.toFixed(1)}</span>
            </div>
          )}
          {manga.views > 0 && (
            <div className="flex items-center gap-0.5 ml-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5 text-text-muted flex-shrink-0">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-[10px] text-text-muted">{formatViews(manga.views)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatViews(n) {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}