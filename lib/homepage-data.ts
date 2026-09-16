import { articleByKey, forCategory, orderedArticles, type Article } from "@/app/data/content";
import { categoryByKey } from "@/app/data/navigation";
import { getArticles, resolveContent } from "./hipinup-api";

export type HomepageData = {
  latest: Article[];
  moda: Article[];
  seyahat: Article[];
  ajanda: Article[];
  sanat: Article[];
  populer: Article[];
  celebrity: Article[];
  yasam: Article[];
  wellness: Article[];
  video: Article[];
  lead: Article;
  travelFeature: Article;
  travelOrbit: Article;
};

const uniqueByPath = (items: Article[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item?.path || seen.has(item.path)) return false;
    seen.add(item.path);
    return true;
  });
};

const mockForCategory = (key: string, limit: number) => {
  const category = categoryByKey(key);
  return category ? forCategory(category).slice(0, limit) : orderedArticles.slice(0, limit);
};

const itemsOrFallback = (
  response: Awaited<ReturnType<typeof getArticles>>,
  category: string | null,
  limit: number,
) => {
  const live = response?.items?.length ? response.items : [];
  if (live.length) return uniqueByPath(live).slice(0, limit);
  return category ? mockForCategory(category, limit) : orderedArticles.slice(0, limit);
};

async function resolveMockArticle(key: string) {
  const fallback = articleByKey(key);
  const resolved = await resolveContent(fallback.path);
  return resolved?.type === "article" ? resolved.data : fallback;
}

export async function getHomepageData(): Promise<HomepageData> {
  const [
    latest,
    moda,
    seyahat,
    ajanda,
    sanat,
    populer,
    celebrity,
    yasam,
    wellness,
    video,
    lead,
    travelFeature,
    travelOrbit,
  ] = await Promise.all([
    getArticles({ perPage: 18 }),
    getArticles({ category: "moda", perPage: 10 }),
    getArticles({ category: "seyahat", perPage: 10 }),
    getArticles({ category: "ajanda", perPage: 10 }),
    getArticles({ category: "sanat", perPage: 10 }),
    getArticles({ category: "populer", perPage: 10 }),
    getArticles({ category: "celebrity", perPage: 10 }),
    getArticles({ category: "yasam", perPage: 10 }),
    getArticles({ category: "wellness", perPage: 10 }),
    getArticles({ format: "video", perPage: 6 }),
    resolveMockArticle("freesbee"),
    resolveMockArticle("modern-travel"),
    resolveMockArticle("bodrum-boat"),
  ]);

  return {
    latest: itemsOrFallback(latest, null, 18),
    moda: itemsOrFallback(moda, "moda", 10),
    seyahat: itemsOrFallback(seyahat, "seyahat", 10),
    ajanda: itemsOrFallback(ajanda, "ajanda", 10),
    sanat: itemsOrFallback(sanat, "sanat", 10),
    populer: itemsOrFallback(populer, "populer", 10),
    celebrity: itemsOrFallback(celebrity, "celebrity", 10),
    yasam: itemsOrFallback(yasam, "yasam", 10),
    wellness: itemsOrFallback(wellness, "wellness", 10),
    video: itemsOrFallback(video, null, 6),
    lead,
    travelFeature,
    travelOrbit,
  };
}
