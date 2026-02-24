import { getGenres } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const revalidate = 600;

export const metadata = {
  title: 'Daftar Genre Komik',
  description: 'Jelajahi komik berdasarkan genre. Action, Romance, Fantasy, Horror, dan ratusan genre lainnya tersedia di Komikcast.',
};

const GENRE_EMOJIS = {
  action: '⚔️', adventure: '🗺️', comedy: '😂', drama: '🎭', fantasy: '🧙',
  horror: '👻', mystery: '🔍', romance: '❤️', 'sci-fi': '🚀', slice: '☕',
  sports: '⚽', supernatural: '✨', thriller: '😱', historical: '🏯',
  school: '📚', martial: '🥊', magic: '🪄', psychological: '🧠',
  mecha: '🤖', music: '🎵', cooking: '👨‍🍳', game: '🎮',
};

function getEmoji(name) {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(GENRE_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '📖';
}

export default async function GenresPage() {
  const res = await getGenres();
  const genres = res?.data || [];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      <main className="pt-14 pb-safe max-w-2xl mx-auto">
        <div className="px-4 py-4">
          <h1 className="font-display text-2xl text-text-primary tracking-widest">GENRE</h1>
          <p className="text-text-muted text-xs mt-0.5">{genres.length} genre tersedia</p>
        </div>

        {genres.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 px-4">
            {genres.map((genre) => {
              const emoji = getEmoji(genre.name);
              return (
                <Link
                  key={genre.name}
                  href={`/manga?genre=${encodeURIComponent(genre.name)}`}
                  className="group flex items-center gap-3 p-3.5 rounded-xl bg-bg-card border border-border hover:border-accent-red transition-all duration-200 hover:shadow-lg hover:shadow-accent-red/10 hover:-translate-y-0.5"
                >
                  <span className="text-2xl flex-shrink-0">{emoji}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-text-primary capitalize text-sm truncate group-hover:text-accent-red transition-colors">
                      {genre.name}
                    </p>
                    <p className="text-text-muted text-xs">{genre.count} judul</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-text-muted group-hover:text-accent-red ml-auto flex-shrink-0 transition-colors">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
            <span className="text-5xl">📚</span>
            <p className="font-display text-xl text-text-secondary tracking-wider">BELUM ADA GENRE</p>
          </div>
        )}

        <div className="h-6" />
      </main>
    </div>
  );
}
