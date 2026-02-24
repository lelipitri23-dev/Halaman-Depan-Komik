'use client'; // Wajib ada karena pakai useState & useAuth

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserBookmarks, removeBookmark } from '@/lib/bookmarks';
import Navbar from '@/components/Navbar';

export default function BookmarkList() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/login'); return; }
    fetchBookmarks();
  }, [user, authLoading]);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const data = await getUserBookmarks(user.uid);
      setBookmarks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (mangaSlug) => {
    setRemoving(mangaSlug);
    try {
      await removeBookmark(user.uid, mangaSlug);
      setBookmarks((prev) => prev.filter((b) => b.mangaSlug !== mangaSlug));
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent-red/30 border-t-accent-red rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="pt-14 pb-safe max-w-2xl mx-auto">
        {/* Header */}
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-text-primary tracking-widest">BOOKMARK</h1>
            <p className="text-text-muted text-xs mt-0.5">{bookmarks.length} komik tersimpan</p>
          </div>
          {/* User avatar */}
          <div className="flex items-center gap-2">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-border" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent-red flex items-center justify-center text-white text-xs font-bold">
                {user?.displayName?.[0] || user?.email?.[0] || '?'}
              </div>
            )}
            <span className="text-text-secondary text-xs font-semibold truncate max-w-[80px]">
              {user?.displayName || user?.email?.split('@')[0]}
            </span>
          </div>
        </div>

        {/* Empty state */}
        {bookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
            <span className="text-6xl">🔖</span>
            <p className="font-display text-xl text-text-secondary tracking-wider">BELUM ADA BOOKMARK</p>
            <p className="text-text-muted text-sm">Tap tombol "Simpan" di halaman detail manga untuk menyimpannya di sini.</p>
            <Link
              href="/manga"
              className="mt-2 px-6 py-3 bg-accent-red text-white font-bold rounded-xl text-sm hover:bg-accent-redDark transition-colors"
            >
              Jelajahi Komik
            </Link>
          </div>
        )}

        {/* Bookmark list */}
        {bookmarks.length > 0 && (
          <div className="px-4 space-y-3">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="flex gap-3 bg-bg-card border border-border rounded-2xl p-3 hover:border-accent-red/40 transition-colors"
              >
                {/* Cover */}
                <Link href={`/manga/${b.mangaSlug}`} className="flex-none">
                  <div className="w-16 h-22 rounded-xl overflow-hidden bg-bg-elevated" style={{ width: 64, height: 90 }}>
                    {b.coverImage ? (
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-text-muted">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M8 7h8M8 12h8M8 17h5" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <Link href={`/manga/${b.mangaSlug}`}>
                      <h3 className="font-bold text-text-primary text-sm line-clamp-2 leading-tight hover:text-accent-red transition-colors">
                        {b.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {b.type && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${b.type?.toLowerCase() === 'manhwa'
                            ? 'bg-blue-900/50 border-blue-700 text-blue-300'
                            : b.type?.toLowerCase() === 'manhua'
                              ? 'bg-orange-900/50 border-orange-700 text-orange-300'
                              : 'bg-blue-900/50 border-blue-700 text-blue-300'
                          }`}>
                          {b.type}
                        </span>
                      )}
                      {b.status && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${b.status?.toLowerCase() === 'ongoing'
                            ? 'bg-green-900/50 border-green-700 text-green-300'
                            : 'bg-gray-800 border-gray-600 text-gray-400'
                          }`}>
                          {b.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Last chapter + read button */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="min-w-0">
                      {b.lastChapter && (
                        <p className="text-text-muted text-[11px] truncate">{b.lastChapter}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {/* Read latest */}
                      {b.lastChapterSlug && (
                        <Link
                          href={`/read/${b.mangaSlug}/${b.lastChapterSlug}`}
                          className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-accent-red text-white hover:bg-accent-redDark transition-colors"
                        >
                          Baca
                        </Link>
                      )}
                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(b.mangaSlug)}
                        disabled={removing === b.mangaSlug}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-muted hover:border-red-500 hover:text-red-400 transition-colors disabled:opacity-40"
                        aria-label="Hapus bookmark"
                      >
                        {removing === b.mangaSlug ? (
                          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="h-6" />
      </main>
    </div>
  );
}