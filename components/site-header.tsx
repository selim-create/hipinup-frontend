"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "./site-link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Search, Menu, X, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { categories, categoryByKey, type Category } from "@/app/data/navigation";
import type { Article } from "@/app/data/content";
import { Brand } from "./brand";

const MAIN_NAV_KEYS = ["celebrity", "moda", "ajanda", "yasam", "wellness", "seyahat", "populer"] as const;
const SHEET_GROUP_KEYS = ["yasam", "ajanda", "populer"] as const;

function fallbackSearch(articles: Article[], query: string) {
  const normalized = query.toLocaleLowerCase("tr");
  return articles
    .filter((article) => `${article.title} ${article.excerpt}`.toLocaleLowerCase("tr").includes(normalized))
    .slice(0, 5);
}

function articleCategory(article: Article, navigation: Category[]) {
  return article.category
    || article.categories?.[0]
    || navigation.find((category) => article.tags.includes(category.key))
    || categories.find((category) => article.tags.includes(category.key));
}

export function Header({articles}:{articles:Article[]}) {
 const [menu,setMenu]=useState(false);
 const [search,setSearch]=useState(false);
 const [query,setQuery]=useState("");
 const [scrolled,setScrolled]=useState(false);
 const [liveCategories,setLiveCategories]=useState<Category[]>(categories);
 const [results,setResults]=useState<Article[]>(()=>articles.slice(0,5));
 const [searchLoading,setSearchLoading]=useState(false);
 const path=usePathname();

 useEffect(()=>{
  const frame=requestAnimationFrame(()=>{setMenu(false);setSearch(false)});
  return()=>cancelAnimationFrame(frame);
 },[path]);

 useEffect(()=>{
  let frame=0;
  const update=()=>{
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>setScrolled(window.scrollY>120));
  };
  update();
  window.addEventListener("scroll",update,{passive:true});
  return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",update)};
 },[]);

 useEffect(()=>{
  const controller=new AbortController();
  fetch("/api/hipinup/navigation",{signal:controller.signal,headers:{Accept:"application/json"}})
   .then(response=>response.ok?response.json():null)
   .then((items:Category[]|null)=>{if(items?.length)setLiveCategories(items)})
   .catch(()=>{});
  return()=>controller.abort();
 },[]);

 useEffect(()=>{
  if(!search)return;
  const controller=new AbortController();
  const timer=window.setTimeout(async()=>{
   setSearchLoading(true);
   try{
    const response=await fetch(`/api/hipinup/search?q=${encodeURIComponent(query.trim())}`,{signal:controller.signal,headers:{Accept:"application/json"}});
    if(!response.ok)throw new Error("search_failed");
    const payload=await response.json() as {items?:Article[]};
    setResults(payload.items?.slice(0,5) || []);
   }catch(error){
    if(!(error instanceof DOMException&&error.name==="AbortError"))setResults(fallbackSearch(articles,query));
   }finally{
    if(!controller.signal.aborted)setSearchLoading(false);
   }
  },query.trim()?220:0);
  return()=>{window.clearTimeout(timer);controller.abort()};
 },[articles,query,search]);

 const mainNav=useMemo(()=>MAIN_NAV_KEYS.map(key=>liveCategories.find(item=>item.key===key)||categoryByKey(key)).filter(Boolean),[liveCategories]);
 const categoryFor=(key:string)=>liveCategories.find(item=>item.key===key)||categories.find(item=>item.key===key);

 return <>
  <a className="skip-link" href="#icerik">İçeriğe geç</a>

  <header className="masthead site-width hip-header-masthead">
   <div className="masthead-note">
    <strong>Hayatı yakala.</strong>
    <span>POP KÜLTÜR · STİL · İYİ YAŞAM</span>
   </div>
   <button onClick={()=>setMenu(true)} className="icon-button mobile-menu" aria-label="Menüyü aç"><Menu/></button>
   <Brand/>
   <div className="masthead-actions">
    <button onClick={()=>setSearch(true)} className="search-button" aria-label="Hipinup’ta ara"><Search size={20}/><span>Ara</span></button>
    <a href="#bulten" className="newsletter-button"><span>Bi’ doz Hipinup</span><ArrowUpRight size={23}/></a>
   </div>
  </header>

  <div className={`navigation-shell hip-navigation-shell ${scrolled?'is-scrolled':''}`}>
   <nav className="site-width primary-navigation" aria-label="Ana menü">
    <div className="sticky-brand-reveal" aria-hidden={!scrolled}><Brand small/></div>
    <button className="icon-button desktop-menu" onClick={()=>setMenu(true)} aria-label="Tüm kategorileri aç"><Menu size={21}/></button>
    <NavigationMenu className="nav-root" viewport={false} delayDuration={100}><NavigationMenuList className="nav-list">
     {mainNav.map(c=>{const children=liveCategories.filter(s=>s.parent===c.key);return <NavigationMenuItem key={c.key} className="nav-item"><div className="nav-label"><Link className={path?.replace(/\/$/,'')===c.path.replace(/\/$/,'')?'active':''} href={c.path}>{c.name}</Link>{children.length>0&&<NavigationMenuTrigger className="nav-expand" aria-label={`${c.name} alt kategorileri`}><span className="sr-only">Alt kategoriler</span></NavigationMenuTrigger>}</div>{children.length>0&&<NavigationMenuContent className="nav-dropdown"><span className="eyebrow">{c.name.toLocaleUpperCase('tr')} DÜNYASINI KEŞFET</span><div className="nav-dropdown-links">{children.map(s=><Link key={s.key} href={s.path}>{s.name}<ArrowUpRight size={16}/></Link>)}</div><Link className="dropdown-all" href={c.path}>Tüm {c.name} içerikleri <ArrowRight size={17}/></Link></NavigationMenuContent>}</NavigationMenuItem>})}
    </NavigationMenuList></NavigationMenu>
    <div className="sticky-nav-actions">
     <button onClick={()=>setSearch(true)} className="sticky-search-button" aria-label="Hipinup’ta ara"><Search size={19}/></button>
     <button onClick={()=>setMenu(true)} className="explore-button">Keşfet <Plus size={17}/></button>
    </div>
   </nav>
  </div>

  <Sheet open={menu} onOpenChange={setMenu}><SheetContent side="left" className="menu-sheet" showCloseButton={false}>
    <div className="sheet-top"><Brand small/><SheetClose className="icon-button" aria-label="Menüyü kapat"><X/></SheetClose></div>
    <SheetTitle className="menu-title">Merakının peşinden git.</SheetTitle><SheetDescription className="menu-description">Hipinup dünyasında keşfedecek çok şey var.</SheetDescription>
    <div className="all-categories">{SHEET_GROUP_KEYS.map(key=>{const group=categoryFor(key);if(!group)return null;return <div key={key}><Link className="category-group-title" href={group.path}>{group.name}<ArrowUpRight size={20}/></Link>{liveCategories.filter(c=>c.parent===key||(key==='yasam'&&c.key==='moda')).map(c=><Link href={c.path} key={c.key}>{c.name}</Link>)}</div>})}</div>
    <a href="#bulten" onClick={()=>setMenu(false)} className="sheet-newsletter">Haftanın iyi gelenleri, e-postanda.<ArrowUpRight/></a>
  </SheetContent></Sheet>

  <Dialog open={search} onOpenChange={setSearch}><DialogContent className="search-dialog" showCloseButton={false}>
   <div className="search-dialog-top"><DialogTitle>Bugün neyi merak ediyorsun?</DialogTitle><DialogClose className="icon-button" aria-label="Aramayı kapat"><X/></DialogClose></div>
   <DialogDescription>İsimleri, konuları ve Hipinup hikâyelerini keşfet.</DialogDescription>
   <form action="/" method="get" onSubmit={()=>setSearch(false)} className="search-form"><Search/><input autoFocus name="s" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Moda, seyahat, müzik..." aria-label="Aranacak kelime"/><button aria-label="Ara" type="submit"><ArrowRight/></button></form>
   <span className="eyebrow">{query?'ARAMA SONUÇLARI':'KEŞFE BAŞLA'}</span>
   <div className="search-results">{searchLoading?<p className="empty-search">Hikâyeler aranıyor...</p>:results.length?results.map(a=>{const category=articleCategory(a,liveCategories);const src=a.imageSmall||a.image||"/images/freesbee-small.webp";return <Link href={a.path} key={a.key} onClick={()=>setSearch(false)}><Image src={src} alt="" width={92} height={70} sizes="92px" unoptimized={/^https:\/\/api\.hipinup\.com\//i.test(src)} onError={event=>{event.currentTarget.src="/images/freesbee-small.webp";event.currentTarget.srcset=""}}/><span><small>{category?.name||"Hipinup"}</small>{a.title}</span><ArrowUpRight size={19}/></Link>}):<p className="empty-search">Bu kelimeyle bir hikâye bulamadık. Başka bir kelime deneyebilirsin.</p>}</div>
  </DialogContent></Dialog>
 </>;
}
