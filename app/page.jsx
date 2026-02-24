import { getHomeData } from '@/lib/api';
import Navbar from '@/components/Navbar';
import TrendingSlider from '@/components/TrendingSlider';
import MangaSection from '@/components/MangaSection';

export const revalidate = 300; // revalidate every 5 min

export const metadata = {
  title: 'Komikcast - Baca Manga, Manhwa & Manhua Gratis',
  description: 'Baca komik manga, manhwa, dan manhua terlengkap secara gratis. Update chapter terbaru setiap hari di Komikcast!',
};

export default async function HomePage() {
  const res = await getHomeData();
  const data = res?.data || {};

  const { recents = [], trending = [], manhwas = [], mangas = [], manhuas = [] } = data;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Main content */}
      <main className="pt-14 pb-safe max-w-2xl mx-auto">
        {/* Trending Hero Slider */}
        <TrendingSlider trending={trending} />

        {/* Quick type filters */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {[
            { label: 'Terbaru', href: '/manga?order=latest' },
            { label: 'Populer', href: '/manga?order=popular' },
            { label: 'Manga', href: '/manga?type=manga' },
            { label: 'Manhwa', href: '/manga?type=manhwa' },
            { label: 'Manhua', href: '/manga?type=manhua' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex-none text-xs font-bold px-3 py-1.5 rounded-full bg-bg-elevated border border-border text-text-secondary hover:border-accent-red hover:text-accent-red transition-colors whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Recent Updates */}
        <MangaSection
          title="UPDATE TERBARU"
          mangas={recents}
          href="/manga?order=latest"
          accent
        />

        {/* Manhwa */}
        {manhwas.length > 0 && (
          <MangaSection
            title="MANHWA"
            mangas={manhwas}
            href="/manga?type=manhwa"
          />
        )}

        {/* Manga */}
        {mangas.length > 0 && (
          <MangaSection
            title="MANGA"
            mangas={mangas}
            href="/manga?type=manga"
          />
        )}

        {/* Manhua */}
        {manhuas.length > 0 && (
          <MangaSection
            title="MANHUA"
            mangas={manhuas}
            href="/manga?type=manhua"
          />
        )}

        {/* Footer */}
        <footer className="px-4 pt-6 pb-2 border-t border-border mt-4">
          <p className="text-center text-text-muted text-xs">
            © 2025 Komikcast · Baca komik gratis setiap hari
          </p>
        </footer>
      </main>
    </div>
  );
}
