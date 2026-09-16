import { SearchPage } from "@/components/magazine";
import { HomePageV6 } from "@/components/home-v6";
import { LiveSearchPage } from "@/components/live-search-page";
import { getHomepageData } from "@/lib/homepage-data";
import { getArticles } from "@/lib/hipinup-api";

export default async function Page({searchParams}:{searchParams:Promise<{s?:string}>}) {
 const q=await searchParams;
 const query=q.s?.trim();

 if(query){
  const live=await getArticles({search:query,perPage:50});
  if(live) return <LiveSearchPage query={query} results={live.items} total={live.pagination.total}/>;
  return <SearchPage query={query}/>;
 }

 const data=await getHomepageData();
 return <HomePageV6 data={data}/>;
}
