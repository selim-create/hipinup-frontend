import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleFormat, articles, normalizePath } from "@/app/data/content";
import { categories } from "@/app/data/navigation";
import { getArticles, getNavigation, getRelatedArticles, resolveContent } from "@/lib/hipinup-api";
import { CategoryPage } from "@/components/magazine";
import { PostFormatPage } from "@/components/post-format-page";
import { LiveArticlePage, LiveCategoryPage } from "@/components/live-content";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = routeParts((await params).slug);
  const live = await resolveContent(path);

  if (live?.type === "article") {
    return { title: live.data.title, description: live.data.excerpt };
  }

  if (live?.type === "category") {
    return { title: live.data.name, description: live.data.description };
  }

  const { article, category } = resolveMock(path);
  return {
    title: article?.title || category?.name || "Sayfa bulunamadı",
    description: article?.excerpt || category?.description,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { path, page: pathPage } = routeParts((await params).slug);
  const queryPage = Number((await searchParams).page || 1);
  const page = pathPage || (Number.isFinite(queryPage) ? Math.max(1, Math.floor(queryPage)) : 1);
  const live = await resolveContent(path);

  if (live?.type === "article") {
    if (articleFormat(live.data) !== "standard") {
      const related = await getRelatedArticles(live.data, 3);
      return <PostFormatPage article={live.data} related={related}/>;
    }

    const [related, navigation] = await Promise.all([
      getRelatedArticles(live.data, 3),
      getNavigation(),
    ]);
    return <LiveArticlePage article={live.data} related={related} navigation={navigation || categories}/>;
  }

  if (live?.type === "category") {
    const [collection, navigation] = await Promise.all([
      getArticles({ category: live.data.key, page, perPage: 6 }),
      getNavigation(),
    ]);

    if (collection) {
      return <LiveCategoryPage category={live.data} items={collection.items} pagination={collection.pagination} navigation={navigation || categories}/>;
    }
  }

  const { article, category } = resolveMock(path);
  if (article) {
    const related = articles.filter((item) => item.key !== article.key).slice(0, 3);
    return <PostFormatPage article={article} related={related}/>;
  }
  if (category) return <CategoryPage category={category} page={page}/>;
  notFound();
}
