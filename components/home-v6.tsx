import Image, { type ImageProps } from "next/image";
import Link from "./site-link";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  CirclePlay,
  Compass,
  TrendingUp,
} from "lucide-react";
import {
  articleByKey,
  articleCategory,
  dateLabel,
  type Article,
} from "@/app/data/content";
import { categoryByKey } from "@/app/data/navigation";
import type { HomepageData } from "@/lib/homepage-data";
import { Shell } from "./magazine";
import { AdSlot } from "./ad-slot";

const isApiImage = (src: ImageProps["src"]) => typeof src === "string" && /^https:\/\/api\.hipinup\.com\//i.test(src);

function HomeImage({alt="", ...props}: ImageProps) {
  return <Image {...props} alt={alt} unoptimized={props.unoptimized ?? isApiImage(props.src)}/>;
}

function Photo({article, priority=false, sizes="(max-width: 760px) 100vw, 50vw", className=""}:{article:Article;priority?:boolean;sizes?:string;className?:string}) {
  return <HomeImage className={className} src={article.image} alt={article.title} width={1280} height={854} sizes={sizes} loading={priority?"eager":"lazy"} fetchPriority={priority?"high":"auto"}/>;
}

function Meta({article}:{article:Article}) {
  return <div className="v6-meta"><time dateTime={article.date}>{dateLabel(article.date)}</time><span>•</span><span>{article.minutes} dk</span></div>;
}

function Eyebrow({children}:{children:React.ReactNode}) {
  return <span className="v6-eyebrow">{children}</span>;
}

function pick(items:Article[], index:number, fallbackKey:string) {
  return items[index] || articleByKey(fallbackKey);
}

function unique(items:Article[]) {
  const seen=new Set<string>();
  return items.filter(item=>item?.path&&!seen.has(item.path)&&(seen.add(item.path),true));
}

function without(items:Article[], ...articles:Article[]) {
  const blocked=new Set(articles.map(item=>item.path));
  return items.filter(item=>!blocked.has(item.path));
}

function splitHeadline(value:string) {
  const words=value.toLocaleUpperCase("tr").trim().split(/\s+/).filter(Boolean);
  if(words.length<=1) return [value.toLocaleUpperCase("tr")];
  let best=1;
  let bestDiff=Number.POSITIVE_INFINITY;
  for(let index=1;index<words.length;index++){
    const left=words.slice(0,index).join(" ").length;
    const right=words.slice(index).join(" ").length;
    const diff=Math.abs(left-right);
    if(diff<bestDiff){best=index;bestDiff=diff;}
  }
  return [words.slice(0,best).join(" "),words.slice(best).join(" ")];
}

function shortLabel(value:string,max=30){
  const clean=value.trim();
  return clean.length>max?`${clean.slice(0,max-1).trim()}…`:clean;
}

function LiveStrip({data}:{data:HomepageData}){
  const items=data.latest.slice(0,4);
  return <section className="v6-live" aria-label="Şu an Hipinup'ta"><div className="site-width v6-live-inner">
    <strong><span/>ŞU AN</strong>
    <div className="v6-live-list">{items.map((article,index)=><Link href={article.path} key={article.path}><b>0{index+1}</b><span>{article.title}</span></Link>)}</div>
    <small>HIZLI AKIŞ</small>
  </div></section>;
}

function Hero({data}:{data:HomepageData}){
  const lead=data.lead;
  const travel=data.travelFeature;
  const leadCategory=articleCategory(lead);
  const defaultLead=lead.key==="freesbee";
  const headline=defaultLead?["KALİFORNİYA","RUHUNU TAK!"]:splitHeadline(lead.title);
  const leadDeck=defaultLead?"Cesur çerçeveler. Özgür ruhlar. Freesbee’nin Kaliforniya enerjisi şimdi Türkiye’de.":lead.excerpt;
  const liveSide=without(data.latest,lead,travel);
  const side=[pick(liveSide,0,"tommy-t-wave"),pick(liveSide,1,"elif-ebru-sakar"),pick(liveSide,2,"david-lynch")];
  return <section className="site-width v65-hero">
    <article className="v65-lead">
      <div className="v65-lead-media">
        <Link href={lead.path} className="v65-lead-photo"><Photo article={lead} priority sizes="(max-width: 980px) 100vw, 68vw"/></Link>
        <Link href={defaultLead?categoryByKey("moda").path:leadCategory.path} className="v65-radar-tag">{defaultLead?"STİL RADARI":`${leadCategory.name.toLocaleUpperCase("tr")} SEÇKİSİ`} <ArrowUpRight size={18}/></Link>
        <span className="v65-side-rule">{defaultLead?"NO RULES. JUST STYLE.":"HİPİNUP EDITORIAL."}</span>
        <h1 className="v65-lead-title"><Link href={lead.path}>{headline.map((line,index)=><span key={`${line}-${index}`}>{line}</span>)}</Link></h1>
      </div>
      <div className="v65-lead-deck">
        <div><p>{leadDeck}</p><Meta article={lead}/></div>
        <Link href={lead.path} className="v65-round-link" aria-label="Hikâyeyi oku"><ArrowUpRight size={25}/></Link>
      </div>
    </article>

    <aside className="v65-flow">
      <header className="v65-flow-head"><span>BUNU<br/>DA BİL</span><h2>Akışta<br/><em>ne var?</em></h2><b>up!</b></header>
      <div className="v65-flow-list">{side.map((article,index)=><article className={`v65-flow-story story-${index+1}`} key={article.path}>
        <span className="v65-flow-number">0{index+1}</span>
        <Link href={article.path} className="v65-flow-photo"><HomeImage src={article.imageSmall} alt="" width={260} height={190} sizes="150px"/></Link>
        <div className="v65-flow-copy"><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3><Meta article={article}/></div>
        <ArrowUpRight className="v65-flow-arrow" size={17}/>
      </article>)}</div>
      <Link href={travel.path} className="v65-travel-card">
        <div><Eyebrow>SEYAHAT DOSYASI</Eyebrow><strong>Az eşya.<br/>Çok hikâye.</strong><span>Hafif seyahat et <ArrowUpRight size={15}/></span></div>
        <span className="v65-travel-photo"><HomeImage src={travel.imageSmall} alt="" width={320} height={220} sizes="180px"/></span>
      </Link>
    </aside>
  </section>;
}

function MustRead({data}:{data:HomepageData}){
  const list=data.mustRead;
  return <section className="site-width v65-must">
    <header><Eyebrow>HIZLI SEÇKİ</Eyebrow><h2>KAÇIRMA</h2></header>
    <div className="v65-must-list">{list.map((article,index)=><Link href={article.path} key={article.path}>
      <span className="v65-must-number">0{index+1}</span><div><Eyebrow>{articleCategory(article).name}</Eyebrow><strong>{article.title}</strong></div><ArrowUpRight size={17}/>
    </Link>)}</div>
  </section>;
}

function ReadersLike({data}:{data:HomepageData}){
  const source=data.latest.slice(6);
  const stories=[pick(source,0,"bodrum-boat"),pick(source,1,"elif-ebru-sakar"),pick(source,2,"tags-design")];
  return <section className="site-width v62-readers">
    <header className="v62-readers-head"><div><Eyebrow>PEOPLE MANTIĞI / HİPİNUP RİTMİ</Eyebrow><h2>Şu an okunuyor.</h2></div><p>Okurun ilgisini çeken hikâyeler, tek bakışta.</p></header>
    <div className="v62-readers-grid">{stories.map((article,index)=><article key={article.path} className={index===0?"featured":""}>
      <Link href={article.path} className="v62-readers-photo"><Photo article={article}/></Link>
      <div className="v62-readers-copy"><span>0{index+1}</span><div><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3><div className="v62-reader-foot"><span>{article.author}</span><Meta article={article}/></div></div></div>
    </article>)}</div>
    <div className="v70-readers-ad"><AdSlot format="banner"/></div>
  </section>;
}

function EditorsDesk({data}:{data:HomepageData}){
  const feature=data.editorsFeature;
  const side=data.editorsSide;
  return <section className="v6-editors"><div className="site-width">
    <header className="v6-editors-head"><div className="v62-editors-title"><Eyebrow>HİPİNUP EDIT / 01</Eyebrow><h2>Editör Masası</h2><div className="v62-curator"><span>up!</span><div><strong>Hipinup Edit</strong><small>Haftanın editör seçkisi</small></div></div></div><p>Algoritmanın değil, merakın seçtiği hikâyeler.</p></header>
    <div className="v6-editors-grid"><article className="v6-editors-feature"><Link href={feature.path}><Photo article={feature}/></Link><div><Eyebrow>{articleCategory(feature).name.toLocaleUpperCase("tr")}</Eyebrow><h3><Link href={feature.path}>{feature.title}</Link></h3><p>{feature.excerpt}</p><Meta article={feature}/></div></article>
    <div className="v6-editors-side">{side.map((article,index)=><Link href={article.path} key={article.path}><span>0{index+1}</span><HomeImage src={article.imageSmall} alt="" width={220} height={150}/><div><Eyebrow>{articleCategory(article).name}</Eyebrow><strong>{article.title}</strong></div></Link>)}</div></div>
  </div></section>;
}

function StyleSection({data}:{data:HomepageData}){
  const main=pick(data.moda,0,"certain-denim");
  const side=[pick(data.moda,1,"akay"),pick(data.moda,2,"sustainable-fashion")];
  return <section className="site-width v6-style-section"><header className="v6-section-head"><div><Eyebrow>MODA & STİL</Eyebrow><h2>Tak. Tavrını.</h2></div><Link href={categoryByKey("moda").path}>Tüm stil hikâyeleri <ArrowRight size={17}/></Link></header>
    <div className="v6-style-grid"><article className="v6-style-main"><Link href={main.path}><Photo article={main}/></Link><div><Eyebrow>STYLE / 01</Eyebrow><h3><Link href={main.path}>{main.title}</Link></h3><p>{main.excerpt}</p></div></article>
    <div className="v6-style-side">{side.map(article=><article key={article.path}><Link href={article.path}><Photo article={article}/></Link><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3></article>)}</div></div>
  </section>;
}

function UpShots({data}:{data:HomepageData}){
  const source=data.latest.slice(9);
  const fallbacks=["bubas-bosphorus","coffee","smoothies","hurrem-sultan-hamami","freesbee"];
  const shots=fallbacks.map((fallback,index)=>pick(source,index,fallback));
  return <section className="v6-shots"><div className="site-width"><header><div><Eyebrow><Camera size={13}/> BUGÜNÜN KARELERİ</Eyebrow><h2>Shots</h2></div><p>People’ın Star Tracks hızında; Hipinup’ın kendi fotoğraf diliyle.</p></header><div className="v6-shots-grid">{shots.map((article,index)=><Link href={article.path} key={article.path} className={index===0?"big":""}><Photo article={article} sizes="(max-width: 760px) 100vw, 25vw"/><div><span>0{index+1}</span><strong>{article.title}</strong></div></Link>)}</div></div></section>;
}

function Escape({data}:{data:HomepageData}){
  const main=data.travelFeature;
  const orbit=data.travelOrbit;
  const defaultMain=main.key==="modern-travel";
  const defaultOrbit=orbit.key==="bodrum-boat";
  const source=without(data.seyahat,main,orbit);
  const picks=[pick(source,0,"six-senses"),pick(source,1,"bubas-bosphorus"),pick(source,2,"hurrem-sultan-hamami")];
  return <section className="v67-escape"><div className="site-width v67-escape-inner">
    <header className="v67-escape-mast">
      <div className="v67-escape-mast-title"><Eyebrow><Compass size={13}/> ESCAPE EDIT</Eyebrow><h2>MOD: KAÇIŞ</h2></div>
      <p>Yeni rotalar, uzun kahvaltılar ve “iyi ki gelmişim” dedirten yerler. Şehrin sesini biraz kısmak isteyenlere.</p>
      <Link href={categoryByKey("seyahat").path} className="v67-escape-all">Tümünü gör <ArrowUpRight size={19}/></Link>
    </header>
    <div className="v67-wave" aria-hidden="true"/>

    <div className="v67-escape-stage">
      <div className="v67-escape-copy">
        <Eyebrow><Compass size={13}/> MOD: KAÇIŞ / 01</Eyebrow>
        <h3><span>BİRAZ</span><mark>OFFLINE</mark><span>OLSAN?</span></h3>
        <p>Yeni rotalar. Uzun kahvaltılar. “iyi ki gelmişim” dedirten yerler.</p>
        <Link href={categoryByKey("seyahat").path} className="v67-escape-cta">Rotayı değiştir <ArrowUpRight size={20}/></Link>
        <em className="v67-escape-note">→ Şehirden çıkış bu tarafta.</em>
      </div>

      <article className="v67-postcard">
        <Link href={main.path} className="v67-postcard-media"><Photo article={main} sizes="(max-width: 900px) 90vw, 58vw"/></Link>
        <span className="v67-postcard-tag">{defaultMain?"KOS’TAN BİR NOT":`${articleCategory(main).name.toLocaleUpperCase("tr")} / HİPİNUP`}</span>
        <div className="v67-postcard-caption"><Eyebrow>SEYAHAT DOSYASI</Eyebrow><h4><Link href={main.path}>{defaultMain?<><span>Modern seyahatin</span><br/><span>yeni lüksü: özgürlük.</span></>:main.title}</Link></h4><Meta article={main}/></div>
      </article>

      <Link href={orbit.path} className="v67-orbit" aria-label={orbit.title}>
        <span className="v67-orbit-image"><HomeImage src={orbit.image} alt="" width={520} height={520} sizes="220px"/></span>
        <strong>{defaultOrbit?<><span>MAVİNİN</span><br/><span>PEŞİNDE</span></>:shortLabel(orbit.title).toLocaleUpperCase("tr")}</strong><ArrowUpRight size={21}/>
      </Link>

      <div className="v67-escape-sticker" aria-label="Daha az yük, daha çok hayat"><small>DAHA AZ YÜK</small><strong>DAHA<br/>ÇOK<br/>HAYAT</strong></div>
    </div>

    <div className="v67-escape-picks">{picks.map((article,index)=><article className="v67-escape-pick" key={article.path}>
      <Link href={article.path} className="v67-escape-pick-media"><Photo article={article} sizes="(max-width:680px) 140px, 33vw"/></Link>
      <div className="v67-escape-pick-copy"><span>0{index+1}</span><div><Eyebrow>{articleCategory(article).name}</Eyebrow><strong><Link href={article.path}>{article.title}</Link></strong></div><ArrowUpRight size={18}/></div>
    </article>)}</div>
  </div></section>;
}

function VideoSection({data}:{data:HomepageData}){
  const videos=[pick(data.video,0,"tommy-t-wave"),pick(data.video,1,"ben-bohmer"),pick(data.video,2,"david-lynch")];
  return <section className="v6-video"><div className="site-width"><header><div><Eyebrow><CirclePlay size={13}/> WATCH</Eyebrow><h2>UP! Video</h2></div><p>Hızlı izle. Sesini aç. Hikâyenin içine gir.</p></header><div className="v6-video-grid">{videos.map((article,index)=><Link href={article.path} key={article.path} className={index===0?"featured":""}><Photo article={article}/><span className="v6-play"><CirclePlay size={index===0?46:34}/></span><div><Eyebrow>{articleCategory(article).name}</Eyebrow><strong>{article.title}</strong></div></Link>)}</div></div></section>;
}

function Culture({data}:{data:HomepageData}){
  const main=pick(data.sanat,0,"istanbula-reverans");
  const side=[pick(data.sanat,1,"ozge-gurkan"),pick(data.sanat,2,"ben-bohmer")];
  return <section className="site-width v6-culture"><header className="v6-section-head"><div><Eyebrow>KÜLTÜR & SANAT</Eyebrow><h2>Bunu konuşalım.</h2></div><Link href={categoryByKey("sanat").path}>Kültüre git <ArrowRight size={17}/></Link></header><div className="v6-culture-grid"><article className="v6-culture-main"><Link href={main.path}><Photo article={main}/></Link><div><Eyebrow>ŞEHİR / SANAT</Eyebrow><h3><Link href={main.path}>{main.title}</Link></h3><p>{main.excerpt}</p></div></article><div className="v6-culture-side">{side.map(article=><article key={article.path}><Link href={article.path}><Photo article={article}/></Link><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3></article>)}</div></div></section>;
}

function Radar(){
  const topics=[["Moda & Stil","moda"],["Celebrity","celebrity"],["Yeni Mekanlar","mekan"],["Wellness","wellness"],["Şehrin Sanatı","sanat"],["Kaçış Rotaları","seyahat"]] as const;
  return <section className="v6-radar"><div className="site-width"><header><div><Eyebrow><TrendingUp size={13}/> TRENDING TOPICS</Eyebrow><h2>Şimdi ne konuşuyoruz?</h2></div><p>Trend değil; ilgimizi çeken şeyler.</p></header><div>{topics.map(([label,key],index)=><Link href={categoryByKey(key).path} key={key}><span>0{index+1}</span><strong>{label}</strong><ArrowUpRight size={18}/></Link>)}</div></div></section>;
}

function PopCultureCluster({data}:{data:HomepageData}){
  const source=data.populer;
  const mini=[pick(source,0,"tommy-t-wave"),pick(source,1,"freesbee")];
  const feature=pick(source,2,"david-lynch");
  const highlight=pick(source,3,"ozge-gurkan");
  const rail=[pick(source,4,"ben-bohmer"),pick(source,5,"elif-ebru-sakar"),pick(source,6,"istanbula-reverans"),pick(source,7,"akay")];
  return <section className="v68-cluster v68-pop"><div className="site-width">
    <header className="v68-cluster-head"><h2>POP KÜLTÜR</h2><p>Müzik, sinema, internet ve konuştuğumuz her şey. Hızlı, canlı, filtresiz.</p><Link href={categoryByKey("populer").path}>Tümünü gör <ArrowUpRight size={17}/></Link></header>
    <div className="v68-pop-body">
      <div className="v68-pop-left">{mini.map(article=><article className="v68-pop-mini" key={article.path}><Link href={article.path}><HomeImage src={article.imageSmall} alt="" width={320} height={320}/></Link><h3><Link href={article.path}>{article.title}</Link></h3></article>)}<Link href={highlight.path} className="v68-pop-highlight"><mark>{highlight.title}</mark> <ArrowUpRight size={16}/></Link></div>
      <article className="v68-pop-feature"><Link href={feature.path}><Photo article={feature}/></Link><Eyebrow>SİNEMA / DOSYA</Eyebrow><h3><Link href={feature.path}>{feature.title}</Link></h3><Meta article={feature}/></article>
      <div className="v68-pop-rail">{rail.map(article=><Link href={article.path} key={article.path}><Eyebrow>{articleCategory(article).name}</Eyebrow><strong>{article.title}</strong><Meta article={article}/></Link>)}<AdSlot format="rectangle" className="v74-pop-ad"/></div>
    </div>
  </div></section>;
}

function CelebrityCluster({data}:{data:HomepageData}){
  const source=data.celebrity;
  const feature=pick(source,0,"tommy-t-wave");
  const callout=pick(source,1,"elif-ebru-sakar");
  const textStory=pick(source,2,"ben-bohmer");
  const cards=[pick(source,3,"david-lynch"),pick(source,4,"ozge-gurkan")];
  return <section className="v68-cluster v68-celeb"><div className="site-width">
    <header className="v68-cluster-head"><h2>CELEBRITY</h2><p>Sahnenin önü, arkası ve insanların gerçekten konuştuğu anlar.</p><Link href={categoryByKey("celebrity").path}>Tümünü gör <ArrowUpRight size={17}/></Link></header>
    <div className="v68-celeb-body">
      <article className="v68-celeb-feature"><Link href={feature.path}><Photo article={feature}/></Link><Eyebrow>STYLE / PEOPLE</Eyebrow><h3><Link href={feature.path}>{feature.title}</Link></h3><Meta article={feature}/></article>
      <div className="v68-celeb-right">
        <Link href={callout.path} className="v68-celeb-callout"><Eyebrow>MÜZİK / YÜZ YÜZE</Eyebrow><strong>{callout.title}</strong><span className="v68-celeb-pointer"/><span className="v68-celeb-avatar"><HomeImage src={callout.imageSmall} alt="" width={180} height={180}/></span></Link>
        <Link href={textStory.path} className="v68-celeb-text">{textStory.title}</Link>
        <div className="v68-celeb-cards">{cards.map(article=><article className="v68-celeb-card" key={article.path}><Link href={article.path}><Photo article={article}/></Link><Eyebrow>{articleCategory(article).name}</Eyebrow><h4><Link href={article.path}>{article.title}</Link></h4></article>)}</div>
        <div className="v69-celeb-motto"><span>GÖZ ÖNÜNDE.</span><strong>EZBER DIŞINDA.</strong><em>up!</em></div>
      </div>
    </div>
  </div></section>;
}

function RealLifeCluster({data}:{data:HomepageData}){
  const source=unique([...data.wellness,...data.yasam]);
  const list=[pick(source,0,"coffee"),pick(source,1,"smoothies"),pick(source,2,"tags-design")];
  const cards=[pick(source,3,"hurrem-sultan-hamami"),pick(source,4,"bubas-bosphorus")];
  const spotlight=pick(source,5,"sustainable-fashion");
  return <section className="v68-cluster v68-life"><div className="site-width">
    <header className="v68-cluster-head"><h2>HAYATIN İÇİNDEN</h2><p>Sıradan günlerin içindeki iyi fikirler, küçük dönüşümler ve gerçek yaşam detayları.</p><Link href={categoryByKey("yasam").path}>Tümünü gör <ArrowUpRight size={17}/></Link></header>
    <div className="v68-life-grid">
      <div className="v69-life-left"><div className="v68-life-list">{list.map((article,index)=><Link href={article.path} key={article.path}><b>{index+1}</b><strong>{article.title}</strong></Link>)}</div><AdSlot format="rectangle" className="v69-life-ad"/></div>
      {cards.map(article=><article className="v68-life-card" key={article.path}><Link href={article.path}><Photo article={article}/></Link><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3></article>)}
      <AdSlot format="halfpage" className="v74-life-halfpage"/>
      <article className="v68-life-spotlight v69-life-teaser"><Link href={spotlight.path}><Photo article={spotlight}/></Link><div className="v68-life-spotlight-copy"><Eyebrow>HAFTANIN NOTU</Eyebrow><h3>{spotlight.title}</h3><Link href={spotlight.path}>Hikâyeyi aç <ArrowUpRight size={17}/></Link></div></article>
    </div>
  </div></section>;
}

function DesktopRailAds(){
  return <section className="v73-rail-ads" aria-label="Desktop reklam alanları"><div className="site-width v73-rail-ads-inner">
    <AdSlot format="wideSkyscraper"/>
    <AdSlot format="skyscraper"/>
  </div></section>;
}

function Explore(){
  const keys=["celebrity","moda","seyahat","sanat","wellness","mekan"];
  return <section className="v6-explore"><div className="site-width"><strong>Merakın nereye gidiyor?</strong><nav>{keys.map(key=><Link href={categoryByKey(key).path} key={key}>{categoryByKey(key).name}<ArrowUpRight size={15}/></Link>)}</nav></div></section>;
}

export function HomePageV6({data}:{data:HomepageData}){
  return <Shell><main id="icerik" className="v6-home">
    <LiveStrip data={data}/>
    <DesktopRailAds/>
    <div className="site-width v65-top-ad"><AdSlot format="leaderboard"/></div>
    <Hero data={data}/>
    <MustRead data={data}/>
    <ReadersLike data={data}/>
    <div className="v74-mobile-after-readers"><AdSlot format="mobileBanner"/></div>
    <EditorsDesk data={data}/>
    <StyleSection data={data}/>
    <UpShots data={data}/>
    <div className="v6-ad-break"><div className="site-width"><AdSlot format="billboard"/></div></div>
    <Escape data={data}/>
    <VideoSection data={data}/>
    <Culture data={data}/>
    <Radar/>
    <div className="v74-mobile-after-radar"><AdSlot format="mobileMini"/></div>
    <PopCultureCluster data={data}/>
    <CelebrityCluster data={data}/>
    <RealLifeCluster data={data}/>
    <Explore/>
  </main></Shell>;
}
