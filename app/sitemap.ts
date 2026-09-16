import type { MetadataRoute } from "next";
import { categories as fallbackCategories } from "@/app/data/navigation";
import { getArticles, getNavigation } from "@/lib/hipinup-api";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [navigation, firstPage] = await Promise.all([
    getNavigation(),
    getArticles({ page: 1, perPage: 50 }),
  ]);

  const liveCategories = navigation || fallbackCategories;
  const articles = firstPage ? [...firstPage.items] : [];

  if (firstPage && firstPage.pagination.totalPages > 1) {
    const remainingPages = Array.from(
      { length: firstPage.pagination.totalPages - 1 },
      (_, index) => index + 2,
    );
    const collections = await Promise.all(
      remainingPages.map((page) => getArticles({ page, perPage: 50 })),
    );

    for (const collection of collections) {
      if (collection) articles.push(...collection.items);
    }
  }

  const uniqueArticles = Array.from(
    new Map(articles.map((article) => [article.path, article])).values(),
  );
  const uniqueCategories = Array.from(
    new Map(liveCategories.map((category) => [category.path, category])).values(),
  );
  const latestArticleDate = uniqueArticles
    .map((article) => article.modified || article.date)
    .filter(Boolean)
    .sort()
    .at(-1);

  return [
    {
      url: `${SITE_URL}/`,
      ...(latestArticleDate ? { lastModified: latestArticleDate } : {}),
    },
    ...uniqueCategories.map((category) => ({
      url: absoluteUrl(category.path),
    })),
    ...uniqueArticles.map((article) => ({
      url: absoluteUrl(article.path),
      lastModified: article.modified || article.date,
    })),
  ];
}
