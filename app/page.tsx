import { SearchPage } from "@/components/magazine";
import { HomePageV6 } from "@/components/home-v6";
import { LiveSearchPage } from "@/components/live-search-page";
import { getHomepageData } from "@/lib/homepage-data";
import { getArticles } from "@/lib/hipinup-api";

const SEARCH_PER_PAGE = 12;

export default async function Page({searchParams}:{searchParams:Promise<{s?:string;page?:string}>}) {
 const q=await searchParams;
 const query=q.s?.trim();
 const requestedPage=Number.parseInt(q.page || "1",10);
 const page=Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

 if(query){
  const live=await getArticles({search:query,page,perPage:SEARCH_PER_PAGE});
  if(live) return <LiveSearchPage query={query} results={live.items} pagination={live.pagination}/>;
  return <SearchPage query={query}/>;
 }

 const data=await getHomepageData();
 return <HomePageV6 data={data}/>;
}
