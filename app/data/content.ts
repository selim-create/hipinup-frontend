import records from "./articles.json";
import bodyRecords from "./bodies.json";
import { categories, categoryByKey, type Category } from "./navigation";

export type ArticleFormat = "standard" | "gallery" | "video" | "podcast" | "quote" | "list";
export type ContentMedia = {
  id: number;
  url: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};
export type ContentListItem = { text: string; html?: string };
export type ContentBlock =
  | { type: "paragraph"; text: string; html?: string }
  | { type: "heading"; level: number; text: string; anchor?: string; html?: string }
  | { type: "list"; ordered: boolean; items: ContentListItem[]; html?: string }
  | { type: "quote"; text: string; citation?: string; html?: string }
  | { type: "image"; media: ContentMedia; html?: string }
  | { type: "gallery"; items: ContentMedia[]; html?: string }
  | { type: "embed"; url: string; provider?: string; html?: string }
  | { type: "media"; mediaType: "video" | "audio"; id?: number; url: string; caption?: string; html?: string }
  | { type: "table"; html: string }
  | { type: "code"; text: string; html?: string }
  | { type: "separator" }
  | { type: "html"; text?: string; html?: string };

export type Article = {
  id?: number;
  key: string;
  title: string;
  originalTitle: string;
  path: string;
  date: string;
  tags: string[];
  image: string;
  imageSmall: string;
  excerpt: string;
  author: string;
  minutes: number;
  heroTitle?: string;
  format?: ArticleFormat;
  content?: string;
  contentBlocks?: ContentBlock[];
  contentBlockSpec?: number;
  category?: Category;
  categories?: Category[];
  formatData?: Record<string, unknown>;
  cardLabel?: string;
};
export type BodyBlock = {type:string; text:string};

export const articles: Article[] = records;
export const bodies: Record<string,BodyBlock[]> = bodyRecords;
export const articleByKey = (key:string) => articles.find(a=>a.key===key)!;
export const orderedArticles = [...articles].sort((a,b)=>b.date.localeCompare(a.date));
export const forCategory = (c:Category) => orderedArticles.filter(a=>a.tags.some(t=>t===c.key || c.tags?.includes(t)));
export const articleCategory = (a:Article) => a.category || a.categories?.[0] || categoryByKey(a.tags[0]) || categoryByKey("genel") || categories[0];
export const dateLabel = (date:string) => {
  const value = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T12:00:00Z` : date;
  return new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(value));
};
export const normalizePath = (path:string) => {
  let normalized = path;

  try {
    normalized = decodeURIComponent(path);
  } catch {
    // Next route params may already be decoded. Legacy WordPress slugs can
    // contain literal malformed percent sequences (for example "%e").
  }

  return normalized.replace(/\/+$/, "") || "/";
};

const mockArticleFormats: Record<string,ArticleFormat> = {
  "istanbula-reverans":"gallery",
  "tommy-t-wave":"video",
  "ben-bohmer":"podcast",
  "david-lynch":"quote",
  "tags-design":"list",
};

export const articleFormat = (article:Article):ArticleFormat => article.format || mockArticleFormats[article.key] || "standard";
