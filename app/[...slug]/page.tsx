import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, normalizePath } from "@/app/data/content";
import { categories } from "@/app/data/navigation";
import { CategoryPage } from "@/components/magazine";
import { PostFormatPage } from "@/components/post-format-page";
type Props = {params:Promise<{slug:string[]}>;searchParams:Promise<{page?:string}>};
function resolve(slug:string[]) {const raw="/"+slug.join("/");const match=raw.match(/^(.*)\/page\/(\d+)\/?$/);const path=normalizePath(match?match[1]:raw);return {article:!match?articles.find(a=>normalizePath(a.path)===path):undefined,category:categories.find(c=>normalizePath(c.path)===path),page:match?Number(match[2]):undefined}}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {article,category}=resolve((await params).slug);return {title:article?.title||category?.name||"Sayfa bulunamadı",description:article?.excerpt||category?.description}}
export default async function Page({params,searchParams}:Props){const {article,category,page}=resolve((await params).slug);if(article)return <PostFormatPage article={article}/>;if(category){const p=page||Number((await searchParams).page||1);return <CategoryPage category={category} page={Number.isFinite(p)?Math.floor(p):1}/>;}notFound();}
