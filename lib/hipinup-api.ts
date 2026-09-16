import type { Article, ArticleFormat, ContentBlock } from "@/app/data/content";
import { categories as mockCategories, type Category, type CategoryAncestor } from "@/app/data/navigation";
import { cleanPlainText } from "./plain-text";

const DEFAULT_API_URL = "https://api.hipinup.com/wp-json/hipinup/v1";
const API_URL = (process.env.HIPINUP_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");
const REVALIDATE_SECONDS = 60;
const FALLBACK_IMAGE = "/images/freesbee-small.webp";
const CORE_CONTRACT = "2";

type ApiAncestor = {
  id: number;
  key: string;
  slug?: string;
  name: string;
  path: string;
};

type ApiTerm = {
  id: number;
  key: string;
  slug: string;
  name: string;
  path: string;
  parent: string | null;
  parentId?: number;
  description?: string;
  count?: number;
  ancestors?: ApiAncestor[];
};

type ApiArticle = {
  id: number;
  key: string;
  slug: string;
  path: string;
  title: string;
  excerpt: string;
  date: string;
  modified?: string;
  author: string;
  minutes: number;
  heroTitle?: string;
  format?: ArticleFormat;
  cardLabel?: string;
  image: string;
  imageSmall: string;
  tags?: string[];
  categories?: ApiTerm[];
  primaryCategory?: ApiTerm | null;
  formatData?: Record<string, unknown>;
  content?: string;
  contentBlocks?: ContentBlock[];
  contentBlockSpec?: number;
};

export type ApiPagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type ArticleCollection = {
  items: Article[];
  pagination: ApiPagination;
};

export type HomepageEditorialSlots = {
  heroLead: Article | null;
  mustRead1: Article | null;
  mustRead2: Article | null;
  mustRead3: Article | null;
  editorsFeature: Article | null;
  editorsSide1: Article | null;
  editorsSide2: Article | null;
  editorsSide3: Article | null;
  editorsSide4: Article | null;
  travelFeature: Article | null;
  travelOrbit: Article | null;
};

export type HomepageEditorial = {
  version: number;
  configured: number;
  slots: HomepageEditorialSlots;
};

export type ResolvedContent =
  | { type: "article"; data: Article }
  | { type: "category"; data: Category };

const fallbackDescription = (name: string) => `${name} dünyasından yeni hikâyeler, keşifler ve Hipinup seçkileri.`;

function toAncestor(item: ApiAncestor): CategoryAncestor {
  return {
    id: item.id,
    key: item.key,
    slug: item.slug,
    name: cleanPlainText(item.name),
    path: item.path,
  };
}

function toCategory(term: ApiTerm): Category {
  const fallback = mockCategories.find((item) => item.key === term.key);
  const name = cleanPlainText(term.name || fallback?.name || term.key);
  return {
    id: term.id,
    key: term.key,
    name,
    path: term.path || fallback?.path || `/konu/${term.key}/`,
    description: cleanPlainText(term.description || fallback?.description || fallbackDescription(name)),
    parent: term.parent || fallback?.parent,
    parentId: term.parentId,
    count: term.count,
    ancestors: term.ancestors?.map(toAncestor),
    tags: fallback?.tags,
  };
}

function toArticle(record: ApiArticle, compactMedia = false): Article {
  const apiCategories = (record.categories || []).map(toCategory);
  const primary = record.primaryCategory ? toCategory(record.primaryCategory) : apiCategories[0];
  const tags = record.tags?.length ? record.tags : primary ? [primary.key] : ["genel"];
  const imageSmall = record.imageSmall || record.image || FALLBACK_IMAGE;
  const image = compactMedia ? imageSmall : (record.image || imageSmall);
  const title = cleanPlainText(record.title);

  return {
    id: record.id,
    key: record.key,
    title,
    originalTitle: title,
    path: record.path,
    date: record.date,
    tags,
    image,
    imageSmall,
    excerpt: cleanPlainText(record.excerpt, { excerpt: true }),
    author: cleanPlainText(record.author),
    minutes: record.minutes,
    heroTitle: cleanPlainText(record.heroTitle || ""),
    format: record.format || "standard",
    content: record.content,
    contentBlocks: record.contentBlocks,
    contentBlockSpec: record.contentBlockSpec,
    category: primary,
    categories: apiCategories,
    formatData: record.formatData,
    cardLabel: cleanPlainText(record.cardLabel || ""),
  };
}

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function resolveContent(path: string): Promise<ResolvedContent | null> {
  const query = new URLSearchParams({ path });
  const response = await apiFetch<{ type: "article" | "category"; data: ApiArticle | ApiTerm }>(`/resolve?${query.toString()}`);
  if (!response) return null;

  if (response.type === "article") {
    return { type: "article", data: toArticle(response.data as ApiArticle) };
  }

  return { type: "category", data: toCategory(response.data as ApiTerm) };
}

export async function getArticles({
  category,
  page = 1,
  perPage = 6,
  search,
  format,
}: {
  category?: string;
  page?: number;
  perPage?: number;
  search?: string;
  format?: ArticleFormat;
} = {}): Promise<ArticleCollection | null> {
  const query = new URLSearchParams({
    page: String(Math.max(1, page)),
    per_page: String(Math.max(1, Math.min(50, perPage))),
  });

  if (category) query.set("category", category);
  if (search) query.set("search", search);
  if (format) query.set("format", format);

  const response = await apiFetch<{ items: ApiArticle[]; pagination: ApiPagination }>(`/articles?${query.toString()}`);
  if (!response) return null;

  return {
    items: response.items.map((record) => toArticle(record, true)),
    pagination: response.pagination,
  };
}

export async function getNavigation(): Promise<Category[] | null> {
  const response = await apiFetch<ApiTerm[]>(`/navigation?contract=${CORE_CONTRACT}`);
  return response ? response.map(toCategory) : null;
}

export async function getHomepageEditorial(): Promise<HomepageEditorial | null> {
  type ApiHomepageSlots = Record<keyof HomepageEditorialSlots, ApiArticle | null>;
  const response = await apiFetch<{ version: number; configured: number; slots: ApiHomepageSlots }>("/homepage");
  if (!response?.slots) return null;

  const mapSlot = (record: ApiArticle | null | undefined) => record ? toArticle(record) : null;

  return {
    version: response.version,
    configured: response.configured,
    slots: {
      heroLead: mapSlot(response.slots.heroLead),
      mustRead1: mapSlot(response.slots.mustRead1),
      mustRead2: mapSlot(response.slots.mustRead2),
      mustRead3: mapSlot(response.slots.mustRead3),
      editorsFeature: mapSlot(response.slots.editorsFeature),
      editorsSide1: mapSlot(response.slots.editorsSide1),
      editorsSide2: mapSlot(response.slots.editorsSide2),
      editorsSide3: mapSlot(response.slots.editorsSide3),
      editorsSide4: mapSlot(response.slots.editorsSide4),
      travelFeature: mapSlot(response.slots.travelFeature),
      travelOrbit: mapSlot(response.slots.travelOrbit),
    },
  };
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const category = article.category?.key || article.categories?.[0]?.key || article.tags[0];
  const response = await getArticles({ category, perPage: Math.max(limit + 1, 4) });
  if (!response) return [];
  return response.items.filter((item) => item.key !== article.key).slice(0, limit);
}
