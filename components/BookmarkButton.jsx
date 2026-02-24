'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toggleBookmark, isBookmarked } from '@/lib/bookmarks';
import { trackBookmarkAdd, trackBookmarkRemove } from '@/lib/analytics';

export default function BookmarkButton({ manga }) {
  const { user }  = useAuth();
  const router    = useRouter();
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(false); // mulai false, jangan block render
  const [pulse,   setPulse]   = useState(false);
  const [checked, setChecked] = useState(false); // sudah cek status bookmark?

  // Cek status bookmark setelah user tersedia
  useEffect(() => {
    if (!user || !manga?.slug) {
      setChecked(true);
      return;
    }
    let cancelled = false;
    isBookmarked(user.uid, manga.slug)
      .then((val) => { if (!cancelled) { setSaved(val); setChecked(true); } })
      .catch((err) => {
        console.warn('[Bookmark] Cek status gagal:', err.message);
        if (!cancelled) setChecked(true); // tetap render meski gagal cek
      });
    return () => { cancelled = true; };
  }, [user, manga?.slug]);

  const handleToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const nowSaved = await toggleBookmark(user.uid, {
        slug:              manga.slug,
        title:             manga.title,
        coverImage:        manga.coverImage  || '',
        type:              manga.type        || '',
        status:            manga.status      || '',
        rating:            manga.rating      || 0,
        last_chapter:      manga.chapters?.[0]?.title || '',
        last_chapter_slug: manga.chapters?.[0]?.slug  || '',
      });
      setSaved(nowSaved);
      if (nowSaved) {
        trackBookmarkAdd(manga);
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      } else {
        trackBookmarkRemove(manga.slug);
      }
    } catch (err) {
      console.error('[Bookmark] Toggle gagal:', err.message);
      // Tampilkan pesan jika permissions error
      if (err.code === 'permission-denied' || err.message?.includes('permissions')) {
        alert('Gagal menyimpan bookmark. Pastikan kamu sudah login dan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Jangan render apapun selagi belum diketahui status user
  // Ini cegah hydration mismatch
  if (!checked && user) return (
    <div className="h-12 w-32 rounded-xl bg-bg-elevated border border-border animate-pulse" />
  );

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={saved ? 'Hapus bookmark' : 'Tambah bookmark'}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-bold text-sm transition-all duration-300 disabled:opacity-50 select-none ${
        saved
          ? 'bg-accent-red/15 border-accent-red text-accent-red'
          : 'bg-bg-elevated border-border text-text-secondary hover:border-accent-red hover:text-accent-red'
      } ${pulse ? 'scale-110' : 'scale-100'}`}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75"/>
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4 transition-all duration-300"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      )}
      {saved ? 'Disimpan' : 'Simpan'}
    </button>
  );
}
