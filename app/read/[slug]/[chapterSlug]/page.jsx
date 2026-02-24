/**
 * Reader Page — Server Component
 *
 * Bertanggung jawab untuk:
 * - generateMetadata (title, description, OG, Twitter, canonical)
 * - JSON-LD structured data (BreadcrumbList + Article)
 * - Render ReaderClient (client component) untuk interaktivitas
 */

import ReaderClient from './ReaderClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://komikcast.art';
const SITE_NAME = 'Komikcast';
const BACKEND = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

// Fetch data di server untuk SEO
async function getChapterData(slug, chapterSlug) {
  try {
    const res = await fetch(`${BACKEND}/read/${slug}/${chapterSlug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

// =====================
// SEO METADATA
// =====================
export async function generateMetadata({ params }) {
  const { slug, chapterSlug } = params;
  const data = await getChapterData(slug, chapterSlug);

  if (!data) {
    return {
      title: `Baca Komik | ${SITE_NAME}`,
      description: `Baca chapter komik online gratis di ${SITE_NAME}.`,
      robots: { index: false, follow: true },
    };
  }

  const { manga, chapter } = data;
  const title = `${manga.title} ${chapter.title}`;
  const description = `Baca ${manga.title} ${chapter.title} bahasa Indonesia secara gratis dan lengkap di ${SITE_NAME}. Baca online tanpa download!`;
  const canonicalUrl = `${SITE_URL}/read/${slug}/${chapterSlug}`;
  const coverImage = manga.coverImage || `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    keywords: [
      `baca ${manga.title}`,
      `${manga.title} ${chapter.title}`,
      `${manga.title} bahasa indonesia`,
      'baca komik online',
      'manga gratis',
      'manhwa gratis',
      SITE_NAME,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'article',
      locale: 'id_ID',
      images: [
        {
          url: coverImage,
          width: 460,
          height: 650,
          alt: `Cover ${manga.title}`,
        },
      ],
      publishedTime: chapter.createdAt || new Date().toISOString(),
      section: 'Komik',
      tags: [manga.title, chapter.title, 'komik', 'manga'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverImage],
      site: '@Komikcast',
    },
    robots: {
      index: true,
      follow: true,
      noarchive: true,
      'max-image-preview': 'large',
      'max-snippet': 160,
    },
  };
}

// =====================
// PAGE COMPONENT
// =====================
export default async function ReaderPage({ params }) {
  const { slug, chapterSlug } = params;
  const data = await getChapterData(slug, chapterSlug);

  const manga = data?.manga;
  const chapter = data?.chapter;
  const canonicalUrl = `${SITE_URL}/read/${slug}/${chapterSlug}`;
  const mangaUrl = `${SITE_URL}/manga/${slug}`;

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: manga?.title || 'Manga',
        item: mangaUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: chapter?.title || chapterSlug,
        item: canonicalUrl,
      },
    ],
  };

  // JSON-LD: Article
  const articleJsonLd = manga && chapter ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${manga.title} - ${chapter.title}`,
    description: `Baca ${manga.title} ${chapter.title} bahasa Indonesia gratis di ${SITE_NAME}.`,
    image: manga.coverImage || '',
    datePublished: chapter.createdAt || new Date().toISOString(),
    dateModified: chapter.createdAt || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    isPartOf: {
      '@type': 'Book',
      name: manga.title,
      url: mangaUrl,
    },
  } : null;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}

      {/* Client Component: semua interaksi reader ada di sini */}
      <ReaderClient />
    </>
  );
}
