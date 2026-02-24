import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export async function addBookmark(userId, manga) {
  const id = `${userId}_${manga.slug}`;
  await setDoc(doc(db, 'bookmarks', id), {
    userId,
    mangaSlug:       manga.slug,
    title:           manga.title,
    coverImage:      manga.coverImage   || '',
    type:            manga.type         || '',
    status:          manga.status       || '',
    rating:          manga.rating       || 0,
    lastChapter:     manga.last_chapter     || '',
    lastChapterSlug: manga.last_chapter_slug || '',
    createdAt:       serverTimestamp(),
  });
}

export async function removeBookmark(userId, mangaSlug) {
  const id = `${userId}_${mangaSlug}`;
  await deleteDoc(doc(db, 'bookmarks', id));
}

export async function isBookmarked(userId, mangaSlug) {
  const id   = `${userId}_${mangaSlug}`;
  const snap = await getDoc(doc(db, 'bookmarks', id));
  return snap.exists();
}

export async function getUserBookmarks(userId) {
  const q    = query(
    collection(db, 'bookmarks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function toggleBookmark(userId, manga) {
  const already = await isBookmarked(userId, manga.slug);
  if (already) {
    await removeBookmark(userId, manga.slug);
    return false;
  } else {
    await addBookmark(userId, manga);
    return true;
  }
}
