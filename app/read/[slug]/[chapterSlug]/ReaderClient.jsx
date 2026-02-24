'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Settings, List, ArrowLeft, X, 
  ChevronLeft, ChevronRight, Home,
  Play, Pause, CircleAlert
} from 'lucide-react';
import { trackReadChapter, trackReadComplete } from '@/lib/analytics';

export default function ReaderClient() {
  const params = useParams();
  const router = useRouter();
  const { slug, chapterSlug } = params;
  
  // --- DATA STATE ---
  const [data, setData] = useState(null);
  const [chapterList, setChapterList] = useState([]); // State khusus list chapter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- UI STATE ---
  const [showUI, setShowUI] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [progress, setProgress] = useState(0);
  
  // --- READER SETTINGS ---
  const [imageWidth, setImageWidth] = useState(800); 
  const [fitToWidth, setFitToWidth] = useState(false);
  const [readingMode, setReadingMode] = useState('long-strip');
  
  // --- AUTO SCROLL ---
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  
  const lastScrollY = useRef(0);
  const scrollInterval = useRef(null);

  // 1. FETCH DATA (Reader + Chapter List)
  useEffect(() => {
    async function initReader() {
      setLoading(true);
      try {
        const proxyBase = `${window.location.origin}/api/proxy`;
        
        // A. Fetch Data Chapter (Gambar, Navigasi Next/Prev)
        const resRead = await fetch(`${proxyBase}/read/${slug}/${chapterSlug}`);
        const jsonRead = await resRead.json();
        
        if (!jsonRead.success) throw new Error(jsonRead.message);
        setData(jsonRead.data);
        trackReadChapter(jsonRead.data.manga, jsonRead.data.chapter.title);

        // B. Cek & Fetch List Chapter
        // Jika endpoint /read/ sudah membawa chapters, pakai itu.
        // Jika tidak, fetch manual ke endpoint /manga/ (Sesuai JSON yang Anda berikan)
        if (jsonRead.data.manga.chapters && jsonRead.data.manga.chapters.length > 0) {
           setChapterList(jsonRead.data.manga.chapters);
        } else {
           // Fetch terpisah untuk mendapatkan list lengkap
           try {
             const resManga = await fetch(`${proxyBase}/manga/${slug}`);
             const jsonManga = await resManga.json();
             if (jsonManga.success && jsonManga.data.info.chapters) {
               setChapterList(jsonManga.data.info.chapters);
             }
           } catch (err) {
             console.error("Gagal load chapter list:", err);
           }
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    initReader();
  }, [slug, chapterSlug]);

  // 2. AUTO SCROLL LOGIC
  useEffect(() => {
    if (isAutoScrolling) {
      const scrollStep = () => {
        window.scrollBy({ top: scrollSpeed, behavior: 'auto' });
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setIsAutoScrolling(false);
        }
      };
      scrollInterval.current = setInterval(scrollStep, 16);
    } else {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    }
    return () => { if (scrollInterval.current) clearInterval(scrollInterval.current); };
  }, [isAutoScrolling, scrollSpeed]);

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
    if (!isAutoScrolling) setShowUI(false);
  };

  // 3. SCROLL HANDLER
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const newProgress = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
    setProgress(newProgress);

    if (!isAutoScrolling) {
        if (scrollTop < lastScrollY.current - 10) { 
            setShowUI(true); 
        } else if (scrollTop > lastScrollY.current + 10 && !activeMenu) {
            setShowUI(false); 
        }
    }
    lastScrollY.current = scrollTop;
  }, [activeMenu, isAutoScrolling]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 4. UI HANDLERS
  const toggleMenu = (menu) => {
    if (activeMenu === menu) setActiveMenu(null);
    else {
        setActiveMenu(menu);
        setIsAutoScrolling(false);
        setShowUI(true);
    }
  };

  const handleContentClick = () => {
    if (activeMenu) setActiveMenu(null);
    else setShowUI(v => !v);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500 animate-pulse">Loading...</div>;
  if (error || !data) return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>;

  const { chapter, manga, navigation } = data;

  return (
    <div className="bg-[#080808] min-h-screen relative text-gray-200 font-sans">
      
      {/* CONTENT AREA */}
      <div className="min-h-screen w-full pb-32 pt-16 cursor-pointer" onClick={handleContentClick}>
        <div 
          className="mx-auto transition-[max-width] duration-300 ease-out"
          style={{ maxWidth: fitToWidth ? '100%' : `${imageWidth}px`, padding: fitToWidth ? '0' : '0 1rem' }}
        >
          {chapter.images?.map((img, idx) => (
            <img key={idx} src={img} alt={`Page ${idx + 1}`} className="w-full h-auto block mb-0 shadow-2xl" loading="lazy" />
          ))}
        </div>
      </div>

      {/* TOP HEADER */}
      <div className={`fixed top-0 left-0 right-0 h-14 bg-[#111]/90 backdrop-blur-md z-40 border-b border-white/5 flex items-center px-4 justify-between transition-transform duration-300 ${showUI ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <Link href={`/manga/${manga.slug}`} className="p-2 -ml-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="font-bold text-sm text-gray-100 line-clamp-1">{manga.title}</h1>
            <span className="text-xs text-gray-400 truncate max-w-[200px]">{chapter.title}</span>
          </div>
        </div>
        <div className="text-[10px] font-bold tracking-wider bg-white/10 text-gray-300 px-2 py-1 rounded-md">
          {progress}%
        </div>
      </div>

      {/* BOTTOM DOCK */}
      <div className={`fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 transition-transform duration-300 ${showUI ? 'translate-y-0' : 'translate-y-[150%]'}`}>
        <div className="bg-[#0f0f0f] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-full px-6 py-3 flex items-center gap-6 sm:gap-8 min-w-[320px] justify-between backdrop-blur-md">
          {/* Prev */}
          {navigation?.prev ? (
            <Link href={`/read/${slug}/${navigation.prev}`} className="text-gray-400 hover:text-white transition active:scale-95"><ChevronLeft size={24} /></Link>
          ) : (
            <span className="text-gray-700 cursor-not-allowed"><ChevronLeft size={24} /></span>
          )}
          {/* Settings */}
          <button onClick={() => toggleMenu('settings')} className={`transition active:scale-95 ${activeMenu === 'settings' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}><Settings size={22} /></button>
          {/* Auto Scroll */}
          <button onClick={toggleAutoScroll} className={`transition active:scale-95 ${isAutoScrolling ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}>{isAutoScrolling ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}</button>
          {/* Chapter List */}
          <button onClick={() => toggleMenu('chapters')} className={`transition active:scale-95 ${activeMenu === 'chapters' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}><List size={24} /></button>
          {/* Report */}
          <button className="text-gray-400 hover:text-red-400 transition active:scale-95"><CircleAlert size={22} /></button>
          {/* Next */}
          {navigation?.next ? (
            <Link href={`/read/${slug}/${navigation.next}`} className="text-gray-400 hover:text-white transition active:scale-95"><ChevronRight size={24} /></Link>
          ) : (
            <Link href={`/manga/${slug}`} className="text-gray-400 hover:text-green-400 transition active:scale-95"><Home size={22}/></Link>
          )}
        </div>
      </div>

      {/* SETTINGS MENU */}
      {activeMenu === 'settings' && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#151515] border border-white/10 rounded-2xl shadow-2xl z-40 p-5 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                <span className="text-sm font-bold text-gray-200">Reader Settings</span>
                <button onClick={() => setActiveMenu(null)}><X size={16} /></button>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-2 font-semibold"><span>IMAGE SIZE</span><span>{fitToWidth ? 'FIT' : `${Math.round(imageWidth/10)}%`}</span></div>
                    <div className="flex items-center gap-2">
                         <button onClick={() => setFitToWidth(!fitToWidth)} className={`text-[10px] font-bold px-2 py-1 rounded border ${fitToWidth ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-700 text-gray-400'}`}>FIT</button>
                         <input type="range" min="300" max="1200" value={imageWidth} disabled={fitToWidth} onChange={(e) => setImageWidth(Number(e.target.value))} className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-2 font-semibold"><span>AUTO SCROLL SPEED</span><span>{scrollSpeed}x</span></div>
                    <input type="range" min="1" max="10" value={scrollSpeed} onChange={(e) => setScrollSpeed(Number(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                </div>
            </div>
        </div>
      )}

      {/* CHAPTER LIST MENU (DYNAMIC) */}
      {activeMenu === 'chapters' && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#151515] border border-white/10 rounded-2xl shadow-2xl z-40 flex flex-col max-h-[50vh] animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-2xl">
            <h3 className="font-bold text-sm text-gray-200">Chapters ({chapterList.length})</h3>
            <button onClick={() => setActiveMenu(null)}><X size={18} className="text-gray-400" /></button>
          </div>
          
          <div className="p-2 overflow-y-auto custom-scrollbar grid grid-cols-5 gap-2">
            {chapterList.length > 0 ? (
               chapterList.map((ch) => {
                 // Ambil angka saja dari title "Chapter 106" -> "106"
                 const chNumber = ch.title.replace(/Chapter\s*/i, '').trim();
                 const isCurrent = ch.slug === chapterSlug;
                 
                 return (
                   <Link 
                     key={ch._id || ch.slug} 
                     href={`/read/${slug}/${ch.slug}`} 
                     className={`
                       h-10 flex items-center justify-center rounded-lg text-xs font-bold transition
                       ${isCurrent 
                         ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' 
                         : 'bg-[#222] text-gray-400 hover:bg-[#333] hover:text-white border border-transparent hover:border-gray-600'}
                     `}
                   >
                      {chNumber}
                   </Link>
                 );
               })
            ) : (
               <div className="col-span-5 text-center py-6 text-gray-500 text-xs">
                 <p>Memuat daftar chapter...</p>
               </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}