import { SearchPage } from "@/components/magazine";
import { HomePageV6 } from "@/components/home-v6";
import { getHomepageData } from "@/lib/homepage-data";

export default async function Page({searchParams}:{searchParams:Promise<{s?:string}>}) {
 const q=await searchParams;
 if(q.s?.trim()) return <SearchPage query={q.s.trim()}/>;
 const data=await getHomepageData();
 return <HomePageV6 data={data}/>;
}
