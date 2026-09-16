import { articleByKey, forCategory, orderedArticles, type Article } from "@/app/data/content";
import { categoryByKey } from "@/app/data/navigation";
import { getArticles, getHomepageEditorial, resolveContent } from "./hipinup-api";

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
  mustRead: Article[];
  editorsFeature: Article;
  editorsSide: Article[];
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

const atOr = (items: Article[], index: number, fallbackKey: string) => items[index] || articleByKey(fallbackKey);

export async function getHomepageData(): Promise<HomepageData> {
  const [
    editorial,
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
    leadFallback,
    travelFeatureFallback,
    travelOrbitFallback,
  ] = await Promise.all([
    getHomepageEditorial(),
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

  const latestItems = itemsOrFallback(latest, null, 18);
  const modaItems = itemsOrFallback(moda, "moda", 10);
  const seyahatItems = itemsOrFallback(seyahat, "seyahat", 10);
  const ajandaItems = itemsOrFallback(ajanda, "ajanda", 10);
  const sanatItems = itemsOrFallback(sanat, "sanat", 10);
  const populerItems = itemsOrFallback(populer, "populer", 10);
  const celebrityItems = itemsOrFallback(celebrity, "celebrity", 10);
  const yasamItems = itemsOrFallback(yasam, "yasam", 10);
  const wellnessItems = itemsOrFallback(wellness, "wellness", 10);
  const slots = editorial?.slots;

  const mustSource = latestItems.slice(3);
  const mustRead = [
    slots?.mustRead1 || atOr(mustSource, 0, "tags-design"),
    slots?.mustRead2 || atOr(mustSource, 1, "bubas-bosphorus"),
    slots?.mustRead3 || atOr(mustSource, 2, "istanbula-reverans"),
  ];

  const editorsSource = uniqueByPath([...sanatItems, ...ajandaItems]);
  const editorsFeature = slots?.editorsFeature || atOr(editorsSource, 0, "ozge-gurkan");
  const editorsSide = [
    slots?.editorsSide1 || atOr(editorsSource, 1, "ben-bohmer"),
    slots?.editorsSide2 || atOr(editorsSource, 2, "david-lynch"),
    slots?.editorsSide3 || atOr(editorsSource, 3, "elif-ebru-sakar"),
    slots?.editorsSide4 || atOr(editorsSource, 4, "six-senses"),
  ];

  const videoFallback = [
    articleByKey("tommy-t-wave"),
    articleByKey("ben-bohmer"),
    articleByKey("david-lynch"),
  ];

  return {
    latest: latestItems,
    moda: modaItems,
    seyahat: seyahatItems,
    ajanda: ajandaItems,
    sanat: sanatItems,
    populer: populerItems,
    celebrity: celebrityItems,
    yasam: yasamItems,
    wellness: wellnessItems,
    video: video?.items?.length ? uniqueByPath(video.items).slice(0, 6) : videoFallback,
    lead: slots?.heroLead || leadFallback,
    mustRead,
    editorsFeature,
    editorsSide,
    travelFeature: slots?.travelFeature || travelFeatureFallback,
    travelOrbit: slots?.travelOrbit || travelOrbitFallback,
  };
}
