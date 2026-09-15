import { SearchPage } from "@/components/magazine";
import { HomePageV6 } from "@/components/home-v6";

export default async function Page({searchParams}:{searchParams:Promise<{s?:string}>}) {
 const q=await searchParams;
 return q.s?.trim()?<SearchPage query={q.s.trim()}/>:<HomePageV6/>;
}
