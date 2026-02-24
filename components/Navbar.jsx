'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TagsIcon } from 'lucide-react';

// ─── Icons ────────────────────────────────────────────────
function HomeIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function SearchIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function GridIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function BookmarkIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}

// ─── User Menu Dropdown ───────────────────────────────────
function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-accent-red flex items-center justify-center text-white text-sm font-bold bg-accent-red/20"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span>{user.displayName?.[0] || user.email?.[0] || '?'}</span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute right-0 top-11 z-50 w-52 bg-bg-card border border-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-slide-up">
            {/* User info */}
            <div className="px-4 py-3 border-b border-border">
              <p className="font-bold text-text-primary text-sm truncate">
                {user.displayName || 'Pengguna'}
              </p>
              <p className="text-text-muted text-xs truncate">{user.email}</p>
            </div>
            {/* Menu items */}
            <Link
              href="/bookmarks"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              Bookmark Saya
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Keluar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  if (pathname.startsWith('/read/')) return null;
  if (pathname.startsWith('/login')) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/manga?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ('');
    }
  };

  const NAV_ITEMS = [
    { href: '/', icon: HomeIcon, label: 'Home' },
    { href: '/manga', icon: GridIcon, label: 'All' },
    { href: '/genres', icon: TagsIcon, label: 'Genre' },
    { href: '/bookmarks', icon: BookmarkIcon, label: 'Simpan' },
  ];

  return (
    <>
      {/* ── Top Bar ─────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="font-display text-2xl text-accent-red tracking-wider">KOMIK</span>
            <span className="font-display text-2xl text-text-primary tracking-wider">CAST</span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg-elevated border border-border text-text-secondary hover:border-accent-red hover:text-accent-red transition-colors"
              aria-label="Cari komik"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Auth */}
            {user ? (
              <UserMenu user={user} logout={logout} />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent-red text-white text-xs font-bold hover:bg-accent-redDark transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Search Modal ─────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <form
            className="w-full max-w-lg animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSearch}
          >
            <div className="flex items-center gap-3 bg-bg-card border border-border rounded-2xl px-4 py-3 shadow-2xl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-text-muted flex-shrink-0">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                autoFocus
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Cari manga, manhwa, manhua..."
                className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-base"
              />
              {searchQ && (
                <button type="button" onClick={() => setSearchQ('')} className="text-text-muted hover:text-text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-text-muted text-xs text-center mt-3">Tekan Enter untuk mencari • Tap di luar untuk tutup</p>
          </form>
        </div>
      )}

      {/* ── Bottom Navigation ────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border">
        <div
          className="max-w-2xl mx-auto flex items-center justify-around h-16"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            const needsAuth = href === '/bookmarks';
            return (
              <Link
                key={href}
                href={needsAuth && !user ? '/login' : href}
                className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors duration-200 relative ${active ? 'text-accent-red' : 'text-text-muted hover:text-text-secondary'
                  }`}
              >
                <Icon active={active} />
                <span className={`text-[10px] font-semibold ${active ? 'text-accent-red' : 'text-text-muted'}`}>
                  {label}
                </span>
                {/* Dot indicator jika belum login dan buka bookmark */}
                {needsAuth && !user && (
                  <span className="absolute top-0.5 right-2 w-1.5 h-1.5 rounded-full bg-accent-red" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
