import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleFormat, articles, normalizePath, type Article } from "@/app/data/content";
import { categories, type Category } from "@/app/data/navigation";
import { getArticles, getNavigation, getRelatedArticles, resolveContent } from "@/lib/hipinup-api";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  articleBreadcrumbJsonLd,
  articleJsonLd,
  categoryBreadcrumbJsonLd,
  categoryJsonLd,
} from "@/lib/seo";
import { CategoryPage } from "@/components/magazine";
import { PostFormatPage } from "@/components/post-format-page";
import { LiveArticlePage, LiveCategoryPage } from "@/components/live-content";
import { StructuredData } from "@/components/structured-data";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string }>;
};

function routeParts(slug: string[]) {
  const raw = "/" + slug.join("/");
  const match = raw.match(/^(.*)\/page\/(\d+)\/?$/);
  return {
    path: normalizePath(match ? match[1] : raw),
    page: match ? Number(match[2]) : undefined,
  };
}

function resolveMock(path: string) {
  return {
    article: articles.find((article) => normalizePath(article.path) === path),
    category: categories.find((category) => normalizePath(category.path) === path),
  };
}

function articleMetadata(article: Article): Metadata {
  const canonical = absoluteUrl(article.path);
  const image = article.image ? absoluteUrl(article.image) : DEFAULT_OG_IMAGE;
  const category = article.category || article.categories?.[0];

  return {
    title: article.title,
    description: article.excerpt,
    authors: article.author ? [{ name: article.author }] : undefined,
    alternates: { canonical },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      url: canonical,
      siteName: SITE_NAME,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      modifiedTime: article.modified || article.date,
      section: category?.name,
      authors: article.author ? [article.author] : undefined,
      images: [{ url: image, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [image],
    },
  };
}

function categoryMetadata(category: Category, page: number): Metadata {
  const title = page > 1 ? `${category.name} — Sayfa ${page}` : category.name;
  const canonicalPath = page > 1 ? `${category.path}?page=${page}` : category.path;
  const canonical = absoluteUrl(canonicalPath);
  const isEmpty = category.count === 0;

  return {
    title,
    description: category.description,
    alternates: { canonical },
    ...(isEmpty ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description: category.description,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: category.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { path, page: pathPage } = routeParts((await params).slug);
  const requestedPage = Number((await searchParams).page || 1);
  const page = pathPage || (Number.isFinite(requestedPage) ? Math.max(1, Math.floor(requestedPage)) : 1);
  const live = await resolveContent(path);

  if (live?.type === "article") return articleMetadata(live.data);
  if (live?.type === "category") return categoryMetadata(live.data, page);

  const { article, category } = resolveMock(path);
  if (article) return articleMetadata(article);
  if (category) return categoryMetadata(category, page);

  return {
    title: "Sayfa bulunamadı",
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { path, page: pathPage } = routeParts((await params).slug);
  const queryPage = Number((await searchParams).page || 1);
  const page = pathPage || (Number.isFinite(queryPage) ? Math.max(1, Math.floor(queryPage)) : 1);
  const live = await resolveContent(path);

  if (live?.type === "article") {
    const structuredData = (
      <>
        <StructuredData data={articleJsonLd(live.data)} />
        <StructuredData data={articleBreadcrumbJsonLd(live.data)} />
      </>
    );

    if (articleFormat(live.data) !== "standard") {
      const related = await getRelatedArticles(live.data, 3);
      return <>{structuredData}<PostFormatPage article={live.data} related={related}/></>;
    }

    const [related, navigation] = await Promise.all([
      getRelatedArticles(live.data, 3),
      getNavigation(),
    ]);
    return <>{structuredData}<LiveArticlePage article={live.data} related={related} navigation={navigation || categories}/></>;
  }

  if (live?.type === "category") {
    const [collection, navigation] = await Promise.all([
      getArticles({ category: live.data.key, page, perPage: 6 }),
      getNavigation(),
    ]);

    if (collection) {
      const maxPage = Math.max(1, collection.pagination.totalPages);
      if (page > maxPage) notFound();

      return (
        <>
          <StructuredData data={categoryJsonLd(live.data, page)} />
          <StructuredData data={categoryBreadcrumbJsonLd(live.data)} />
          <LiveCategoryPage category={live.data} items={collection.items} pagination={collection.pagination} navigation={navigation || categories}/>
        </>
      );
    }
  }

  const { article, category } = resolveMock(path);
  if (article) {
    const related = articles.filter((item) => item.key !== article.key).slice(0, 3);
    return (
      <>
        <StructuredData data={articleJsonLd(article)} />
        <StructuredData data={articleBreadcrumbJsonLd(article)} />
        <PostFormatPage article={article} related={related}/>
      </>
    );
  }
  if (category) {
    return (
      <>
        <StructuredData data={categoryJsonLd(category, page)} />
        <StructuredData data={categoryBreadcrumbJsonLd(category)} />
        <CategoryPage category={category} page={page}/>
      </>
    );
  }
  notFound();
}
