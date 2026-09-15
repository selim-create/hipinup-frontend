import records from "./articles.json";
import bodyRecords from "./bodies.json";
import { categoryByKey, type Category } from "./navigation";
export type ArticleFormat = "standard" | "gallery" | "video" | "podcast" | "quote" | "list";
export type Article = {key:string; title:string; originalTitle:string; path:string; date:string; tags:string[]; image:string; imageSmall:string; excerpt:string; author:string; minutes:number; format?:ArticleFormat};
export type BodyBlock = {type:string; text:string};
export const articles: Article[] = records;
export const bodies: Record<string,BodyBlock[]> = bodyRecords;
export const articleByKey = (key:string) => articles.find(a=>a.key===key)!;
export const orderedArticles = [...articles].sort((a,b)=>b.date.localeCompare(a.date));
export const forCategory = (c:Category) => orderedArticles.filter(a=>a.tags.some(t=>t===c.key || c.tags?.includes(t)));
export const articleCategory = (a:Article) => categoryByKey(a.tags[0]);
export const dateLabel = (date:string) => new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(date+"T12:00:00Z"));
export const normalizePath = (path:string) => decodeURIComponent(path).replace(/\/+$/, "") || "/";

const mockArticleFormats: Record<string,ArticleFormat> = {
  "istanbula-reverans":"gallery",
  "tommy-t-wave":"video",
  "ben-bohmer":"podcast",
  "david-lynch":"quote",
  "tags-design":"list",
};

export const articleFormat = (article:Article):ArticleFormat => article.format || mockArticleFormats[article.key] || "standard";
