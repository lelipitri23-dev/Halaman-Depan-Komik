import Link from 'next/link';
import Image from 'next/image';

export default function MangaListItem({ manga }) {
  if (!manga) return null;

  return (
    <Link 
      href={`/manga/${manga.slug}`}
      className="flex gap-4 p-3 rounded-xl bg-bg-card border border-border hover:border-accent-red hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-300 group"
    >
      {/* ── Cover Image ── */}
      <div className="flex-none w-[70px] sm:w-[85px] relative aspect-[2/3] rounded-lg overflow-hidden bg-bg-elevated">
        {manga.coverImage ? (
          <Image
            src={manga.coverImage}
            alt={manga.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 70px, 85px"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8 7h8M8 12h8M8 17h5" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Content Info ── */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        
        {/* Title */}
        <h3 className="font-bold text-text-primary text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-accent-red transition-colors leading-tight">
          {manga.title}
        </h3>

        {/* Badges & Rating */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          
          {/* Type Badge (Logic sama dengan MangaCard) */}
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white uppercase tracking-wider leading-none ${
             manga.type?.toLowerCase() === 'manhua' ? 'bg-orange-500/90' :
             'bg-blue-600/90'
          }`}>
            {manga.type || 'Manga'}
          </span>
          
          {/* Status Badge */}
          {manga.status && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white uppercase tracking-wider leading-none ${
               manga.status?.toLowerCase() === 'ongoing' ? 'bg-green-600/90' : 'bg-gray-600/90'
            }`}>
               {manga.status?.toLowerCase() === 'ongoing' ? 'ON' : 'END'}
            </span>
          )}

          {/* Rating */}
          {manga.rating > 0 && (
            <div className="flex items-center gap-0.5 text-[10px] text-text-secondary font-semibold ml-auto sm:ml-0">
              <svg viewBox="0 0 24 24" fill="#ffd700" className="w-3 h-3">
                 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{manga.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Chapter & Views */}
        <div className="flex items-center justify-between mt-auto pt-1 border-t border-border/50">
           {/* Last Chapter (Sesuai data MangaCard: last_chapter) */}
           <div className="text-xs text-text-muted font-medium flex items-center gap-2">
              <span className="truncate max-w-[140px]">{manga.last_chapter || 'Chapter ?'}</span>
           </div>

           {/* Views */}
           {manga.views > 0 && (
             <div className="flex items-center gap-1 text-[10px] text-text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                   <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                   <circle cx="12" cy="12" r="3" />
                </svg>
                <span>{formatViews(manga.views)}</span>
             </div>
           )}
        </div>
      </div>
    </Link>
  );
}

// Helper format angka (Sama dengan MangaCard)
function formatViews(n) {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}