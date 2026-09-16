import type { Article } from "@/app/data/content";
import type { Category } from "@/app/data/navigation";

export const SITE_NAME = "Hipinup";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hipinup.com").replace(/\/+$/, "");
export const SITE_DESCRIPTION = "Popüler kültür, moda, seyahat, iyi yaşam ve şehirden hikâyeler. Hipinup ile keşfet.";
export const GA_MEASUREMENT_ID = "G-LYHB2KZBD0";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;

export function isIndexableEnvironment(): boolean {
  return process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
}

export function isAnalyticsEnabled(): boolean {
  return process.env.VERCEL_ENV === "production";
}

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, `${SITE_URL}/`).toString();
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: absoluteUrl("/brand/hipinup.svg"),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "tr-TR",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

function categoryTrail(category?: Category) {
  if (!category) return [];
  const ancestors = category.ancestors || [];
  return [
    ...ancestors.map((item) => ({ name: item.name, path: item.path })),
    { name: category.name, path: category.path },
  ];
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: `${SITE_URL}/`,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    ],
  };
}

export function articleJsonLd(article: Article) {
  const category = article.category || article.categories?.[0];
  const image = article.image ? absoluteUrl(article.image) : DEFAULT_OG_IMAGE;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(article.path)}#article`,
    mainEntityOfPage: absoluteUrl(article.path),
    headline: article.title,
    description: article.excerpt,
    image: [image],
    datePublished: article.date,
    dateModified: article.modified || article.date,
    inLanguage: "tr-TR",
    articleSection: category?.name,
    author: {
      "@type": "Person",
      name: article.author || SITE_NAME,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function articleBreadcrumbJsonLd(article: Article) {
  const category = article.category || article.categories?.[0];
  return breadcrumbJsonLd([
    ...categoryTrail(category),
    { name: article.title, path: article.path },
  ]);
}

export function categoryBreadcrumbJsonLd(category: Category) {
  return breadcrumbJsonLd(categoryTrail(category));
}

export function categoryJsonLd(category: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(category.path)}#collection`,
    url: absoluteUrl(category.path),
    name: category.name,
    description: category.description,
    inLanguage: "tr-TR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}
