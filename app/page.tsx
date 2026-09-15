import { SearchPage } from "@/components/magazine";
import { HomePageV5 } from "@/components/home-v5";

export default async function Page({searchParams}:{searchParams:Promise<{s?:string}>}) {
 const q=await searchParams;
 return q.s?.trim()?<SearchPage query={q.s.trim()}/>:<HomePageV5/>;
}
