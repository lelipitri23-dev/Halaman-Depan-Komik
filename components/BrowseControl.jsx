'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Grid, List, X } from 'lucide-react';
import MangaCard from './MangaCard'; // Pastikan import ini ada
import MangaListItem from './MangaListItem'; // Import komponen list baru

const TYPES = ['all', 'manga', 'manhwa', 'manhua'];
const STATUSES = ['all', 'ongoing', 'completed'];
const ORDERS = [
  { value: 'latest', label: 'Update' },
  { value: 'popular', label: 'Populer' },
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
];

export default function BrowseControl({ genres, totalItems, q, mangas }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State View Mode (Grid/List)
  const [viewMode, setViewMode] = useState('grid'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State Filter Local
  const [localFilter, setLocalFilter] = useState({
    type: searchParams.get('type') || 'all',
    status: searchParams.get('status') || 'all',
    order: searchParams.get('order') || 'latest',
    genre: searchParams.get('genre') || 'all',
  });

  // Sync dengan URL saat pertama load
  useEffect(() => {
    setLocalFilter({
      type: searchParams.get('type') || 'all',
      status: searchParams.get('status') || 'all',
      order: searchParams.get('order') || 'latest',
      genre: searchParams.get('genre') || 'all',
    });
  }, [searchParams]);

  const handleSelect = (key, value) => {
    setLocalFilter(prev => ({ ...prev, [key]: value }));
  };

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (localFilter.type !== 'all') params.set('type', localFilter.type); else params.delete('type');
    if (localFilter.status !== 'all') params.set('status', localFilter.status); else params.delete('status');
    if (localFilter.order !== 'latest') params.set('order', localFilter.order); else params.delete('order');
    if (localFilter.genre !== 'all') params.set('genre', localFilter.genre); else params.delete('genre');
    params.delete('page'); // Reset page
    router.push(`/manga?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const clearFilter = () => {
    setLocalFilter({ type: 'all', status: 'all', order: 'latest', genre: 'all' });
  };

  const OptionButton = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
        isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* ─── HEADER BAR ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-1">
            {q ? <span>Hasil: <span className="text-blue-500">"{q}"</span></span> : 'Daftar Komik'}
          </h1>
          <p className="text-gray-400 text-xs md:text-sm">
            {totalItems} judul ditemukan {localFilter.genre !== 'all' && `• ${localFilter.genre}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle View Buttons */}
          <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-gray-800">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid size={20} />
            </button>
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-all"
          >
            <Filter size={18} />
            <span className="text-sm font-bold">Filter</span>
          </button>
        </div>
      </div>

      {/* ─── CONTENT RENDERER (GRID / LIST) ─── */}
      {mangas.length > 0 ? (
        viewMode === 'grid' ? (
          // TAMPILAN GRID
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5 animate-fade-in">
            {mangas.map((manga) => (
              <MangaCard key={manga._id || manga.slug} manga={manga} />
            ))}
          </div>
        ) : (
          // TAMPILAN LIST
          <div className="flex flex-col gap-3 animate-fade-in">
            {mangas.map((manga) => (
              <MangaListItem key={manga._id || manga.slug} manga={manga} />
            ))}
          </div>
        )
      ) : (
        // EMPTY STATE
        <div className="flex flex-col items-center justify-center py-24 text-center px-4 border-2 border-dashed border-gray-800 rounded-3xl bg-gray-900/30">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-3xl">🔍</div>
          <h3 className="font-display text-lg text-white tracking-wide mb-1">Tidak ada komik ditemukan</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">Coba kurangi filter atau gunakan kata kunci lain.</p>
        </div>
      )}

      {/* ─── MODAL FILTER (Sama seperti sebelumnya) ─── */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0f1115] border border-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">Filter</h2>
              <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Filter Options (sama seperti kode sebelumnya) */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Urutkan</h3>
                <div className="flex flex-wrap gap-2">
                  {ORDERS.map((o) => (<OptionButton key={o.value} label={o.label} isActive={localFilter.order === o.value} onClick={() => handleSelect('order', o.value)} />))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (<OptionButton key={s} label={s === 'all' ? 'Semua' : s === 'ongoing' ? 'Ongoing' : 'Tamat'} isActive={localFilter.status === s} onClick={() => handleSelect('status', s)} />))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Tipe</h3>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (<OptionButton key={t} label={t === 'all' ? 'Semua' : t} isActive={localFilter.type === t} onClick={() => handleSelect('type', t)} />))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  <OptionButton label="All" isActive={localFilter.genre === 'all'} onClick={() => handleSelect('genre', 'all')} />
                  {genres.map((g) => (<OptionButton key={g.name} label={g.name} isActive={localFilter.genre === g.name} onClick={() => handleSelect('genre', g.name)} />))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 bg-[#0f1115] rounded-b-2xl flex gap-3">
              <button onClick={clearFilter} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 font-bold text-sm hover:bg-gray-800">Clear</button>
              <button onClick={applyFilter} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-900/20">Apply</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}