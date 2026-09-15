"use client";
import { useEffect, useState } from "react";
import Link from "./site-link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Search, Menu, X, Plus, Mail } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { categories, categoryByKey, mainNav } from "@/app/data/navigation";
import type { Article } from "@/app/data/content";
import { Brand } from "./brand";

export function Header({articles}:{articles:Article[]}) {
 const [menu,setMenu]=useState(false);
 const [search,setSearch]=useState(false);
 const [query,setQuery]=useState("");
 const path=usePathname();
 useEffect(()=>{setMenu(false);setSearch(false)},[path]);
 const results=articles.filter(a=>(a.title+' '+a.excerpt).toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))).slice(0,5);
 return <>
  <a className="skip-link" href="#icerik">İçeriğe geç</a>
  <div className="utility"><div className="site-width"><span>POP KÜLTÜR. GERÇEK HAYAT. BOLCA MERAK.</span><span className="utility-right">ARŞİVDEN SEÇTİKLERİMİZ <span className="utility-divider">/</span> BİR HIP MEDYA YAYINI</span></div></div>
  <header className="masthead site-width">
   <div className="masthead-note"><span>YAŞA. KEŞFET. PAYLAŞ.</span><strong>Hayatı yakala.</strong></div>
   <button onClick={()=>setMenu(true)} className="icon-button mobile-menu" aria-label="Menüyü aç"><Menu/></button>
   <Brand/>
   <div className="masthead-actions"><button onClick={()=>setSearch(true)} className="search-button" aria-label="Hipinup’ta ara"><Search size={21}/><span>Ara & keşfet</span></button><a href="#bulten" className="newsletter-button"><Mail size={16}/><span>Bi’ doz Hipinup</span><ArrowUpRight size={17}/></a></div>
  </header>
  <div className="navigation-shell"><nav className="site-width primary-navigation" aria-label="Ana menü">
   <button className="icon-button desktop-menu" onClick={()=>setMenu(true)} aria-label="Tüm kategorileri aç"><Menu size={21}/></button>
   <NavigationMenu className="nav-root" viewport={false} delayDuration={100}><NavigationMenuList className="nav-list">
    {mainNav.map(c=>{const children=categories.filter(s=>s.parent===c.key);return <NavigationMenuItem key={c.key} className="nav-item"><div className="nav-label"><Link className={path?.replace(/\/$/,'')===c.path.replace(/\/$/,'')?'active':''} href={c.path}>{c.name}</Link>{children.length>0&&<NavigationMenuTrigger className="nav-expand" aria-label={`${c.name} alt kategorileri`}><span className="sr-only">Alt kategoriler</span></NavigationMenuTrigger>}</div>{children.length>0&&<NavigationMenuContent className="nav-dropdown"><span className="eyebrow">{c.name.toLocaleUpperCase('tr')} DÜNYASINI KEŞFET</span><div className="nav-dropdown-links">{children.map(s=><Link key={s.key} href={s.path}>{s.name}<ArrowUpRight size={16}/></Link>)}</div><Link className="dropdown-all" href={c.path}>Tüm {c.name} içerikleri <ArrowRight size={17}/></Link></NavigationMenuContent>}</NavigationMenuItem>})}
   </NavigationMenuList></NavigationMenu>
   <button onClick={()=>setMenu(true)} className="explore-button">Keşfet <Plus size={17}/></button>
  </nav></div>
  <Sheet open={menu} onOpenChange={setMenu}><SheetContent side="left" className="menu-sheet" showCloseButton={false}>
    <div className="sheet-top"><Brand small/><SheetClose className="icon-button" aria-label="Menüyü kapat"><X/></SheetClose></div>
    <SheetTitle className="menu-title">Merakının peşinden git.</SheetTitle><SheetDescription className="menu-description">Hipinup dünyasında keşfedecek çok şey var.</SheetDescription>
    <div className="all-categories">{['yasam','ajanda','populer'].map(key=><div key={key}><Link className="category-group-title" href={categoryByKey(key).path}>{categoryByKey(key).name}<ArrowUpRight size={20}/></Link>{categories.filter(c=>c.parent===key||key==='yasam'&&c.key==='moda').map(c=><Link href={c.path} key={c.key}>{c.name}</Link>)}</div>)}</div>
    <a href="#bulten" onClick={()=>setMenu(false)} className="sheet-newsletter">Haftanın iyi gelenleri, e-postanda.<ArrowUpRight/></a>
  </SheetContent></Sheet>
  <Dialog open={search} onOpenChange={setSearch}><DialogContent className="search-dialog" showCloseButton={false}>
   <div className="search-dialog-top"><DialogTitle>Bugün neyi merak ediyorsun?</DialogTitle><DialogClose className="icon-button" aria-label="Aramayı kapat"><X/></DialogClose></div>
   <DialogDescription>İsimleri, konuları ve Hipinup hikâyelerini keşfet.</DialogDescription>
   <form action="/" method="get" onSubmit={()=>setSearch(false)} className="search-form"><Search/><input autoFocus name="s" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Moda, seyahat, müzik..." aria-label="Aranacak kelime"/><button aria-label="Ara" type="submit"><ArrowRight/></button></form>
   <span className="eyebrow">{query?'ARAMA SONUÇLARI':'KEŞFE BAŞLA'}</span>
   <div className="search-results">{results.length?results.map(a=><Link href={a.path} key={a.key} onClick={()=>setSearch(false)}><img src={a.imageSmall} alt="" width={92} height={70}/><span><small>{categoryByKey(a.tags[0]).name}</small>{a.title}</span><ArrowUpRight size={19}/></Link>):<p className="empty-search">Bu kelimeyle bir hikâye bulamadık. Başka bir kelime deneyebilirsin.</p>}</div>
  </DialogContent></Dialog>
 </>;
}
