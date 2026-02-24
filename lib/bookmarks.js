import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

// 1. TAMBAH BOOKMARK
// Menyimpan ke: users/{userId}/bookmarks/{slug}
export async function addBookmark(userId, manga) {
  // Kita gunakan manga.slug sebagai ID dokumen
  const bookmarkRef = doc(db, 'users', userId, 'bookmarks', manga.slug);

  await setDoc(bookmarkRef, {
    // userId tidak wajib disimpan lagi di dalam data karena sudah ada di nama folder,
    // tapi boleh disimpan jika ingin memudahkan export data nanti.
    userId,
    mangaSlug: manga.slug,
    title: manga.title,
    coverImage: manga.coverImage || '',
    type: manga.type || '',
    status: manga.status || '',
    rating: manga.rating || 0,
    lastChapter: manga.last_chapter || '',
    lastChapterSlug: manga.last_chapter_slug || '',
    createdAt: serverTimestamp(),
  });
}

// 2. HAPUS BOOKMARK
export async function removeBookmark(userId, mangaSlug) {
  const bookmarkRef = doc(db, 'users', userId, 'bookmarks', mangaSlug);
  await deleteDoc(bookmarkRef);
}

// 3. CEK STATUS (Apakah sudah dibookmark?)
export async function isBookmarked(userId, mangaSlug) {
  if (!userId || !mangaSlug) return false;
  const bookmarkRef = doc(db, 'users', userId, 'bookmarks', mangaSlug);
  const snap = await getDoc(bookmarkRef);
  return snap.exists();
}

// 4. AMBIL SEMUA BOOKMARK USER
export async function getUserBookmarks(userId) {
  // Query langsung ke folder user, jadi tidak perlu "where('userId', '==', ...)"
  const bookmarksRef = collection(db, 'users', userId, 'bookmarks');
  const q = query(bookmarksRef, orderBy('createdAt', 'desc'));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 5. TOGGLE (Simpan/Hapus Otomatis)
export async function toggleBookmark(userId, manga) {
  const already = await isBookmarked(userId, manga.slug);
  if (already) {
    await removeBookmark(userId, manga.slug);
    return false; // Sekarang tidak disimpan
  } else {
    await addBookmark(userId, manga);
    return true; // Sekarang disimpan
  }
}