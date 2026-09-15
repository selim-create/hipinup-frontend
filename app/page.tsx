import { HomePage, SearchPage } from "@/components/magazine";
export default async function Page({searchParams}:{searchParams:Promise<{s?:string}>}) { const q=await searchParams;return q.s?.trim()?<SearchPage query={q.s.trim()}/>:<HomePage/>; }
