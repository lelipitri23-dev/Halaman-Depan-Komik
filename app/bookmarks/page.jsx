import BookmarkList from '@/components/BookmarkList'; // Sesuaikan path import

export const metadata = {
  title: 'Bookmark Saya',
  description: 'Daftar komik favorit yang disimpan.',
  robots: {
    index: false, // JANGAN INDEX
    follow: false, // JANGAN FOLLOW
  },
};

export default function BookmarksPage() {
  return <BookmarkList />;
}