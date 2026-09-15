import Image from "next/image";
import Link from "./site-link";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  CirclePlay,
  Compass,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  articleByKey,
  articleCategory,
  dateLabel,
  orderedArticles,
  type Article,
} from "@/app/data/content";
import { categoryByKey } from "@/app/data/navigation";
import { Shell } from "./magazine";
import { AdSlot } from "./ad-slot";

function Photo({article, priority=false, sizes="(max-width: 760px) 100vw, 50vw", className=""}:{article:Article;priority?:boolean;sizes?:string;className?:string}) {
  return <Image className={className} src={article.image} alt={article.title} width={1280} height={854} sizes={sizes} priority={priority}/>;
}

function Meta({article}:{article:Article}) {
  return <div className="v6-meta"><time dateTime={article.date}>{dateLabel(article.date)}</time><span>•</span><span>{article.minutes} dk</span></div>;
}

function Eyebrow({children}:{children:React.ReactNode}) {
  return <span className="v6-eyebrow">{children}</span>;
}

function LiveStrip(){
  const items=orderedArticles.slice(0,4);
  return <section className="v6-live" aria-label="Şu an Hipinup'ta"><div className="site-width v6-live-inner">
    <strong><span/>ŞU AN</strong>
    <div className="v6-live-list">{items.map((article,index)=><Link href={article.path} key={article.key}><b>0{index+1}</b><span>{article.title}</span></Link>)}</div>
    <small>HIZLI AKIŞ</small>
  </div></section>;
}

function Hero(){
  const lead=articleByKey("modern-travel");
  const side=[articleByKey("tommy-t-wave"),articleByKey("freesbee"),articleByKey("david-lynch")];
  return <section className="site-width v6-hero">
    <article className="v6-lead">
      <Link href={lead.path} className="v6-lead-photo"><Photo article={lead} priority sizes="(max-width: 980px) 100vw, 72vw"/></Link>
      <div className="v6-lead-copy">
        <div className="v6-lead-kicker"><Eyebrow>SEYAHAT / DOSYA</Eyebrow><span>01</span></div>
        <h1><Link href={lead.path}>{lead.title}</Link></h1>
        <div className="v6-lead-bottom"><p>{lead.excerpt}</p><div><Meta article={lead}/><Link href={lead.path} className="v6-read-link">Hikâyeyi oku <ArrowUpRight size={17}/></Link></div></div>
      </div>
    </article>
    <aside className="v6-hero-rail">
      <header><Eyebrow><Sparkles size={13}/> THE EDIT</Eyebrow><h2>Şimdi buna bak.</h2></header>
      {side.map((article,index)=><article className={`v6-rail-story ${index===0?"featured":""}`} key={article.key}>
        {index===0&&<Link href={article.path} className="v6-rail-photo"><Photo article={article}/></Link>}
        <div className="v6-rail-row"><span>0{index+1}</span><div><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3>{index===0&&<Meta article={article}/>}</div><ArrowUpRight size={17}/></div>
      </article>)}
      <div className="v6-rail-note">Editörün hızlı seçkisi. Gürültü yok, sadece iyi hikâyeler.</div>
    </aside>
  </section>;
}

function MustRead(){
  const feature=articleByKey("istanbula-reverans");
  const list=[articleByKey("tags-design"),articleByKey("bubas-bosphorus"),articleByKey("coffee")];
  return <section className="site-width v6-must">
    <header className="v6-section-head"><div><Eyebrow>HIZLI SEÇKİ</Eyebrow><h2>Kaçırma.</h2></div><p>Bugün bakmaya değer dört şey.</p></header>
    <div className="v6-must-grid">
      <article className="v6-must-feature"><Link href={feature.path} className="v6-must-photo"><Photo article={feature}/></Link><div><Eyebrow>{articleCategory(feature).name}</Eyebrow><h3><Link href={feature.path}>{feature.title}</Link></h3><p>{feature.excerpt}</p><Meta article={feature}/></div></article>
      <div className="v6-must-list">{list.map((article,index)=><Link href={article.path} key={article.key}><span>0{index+2}</span><div><Eyebrow>{articleCategory(article).name}</Eyebrow><strong>{article.title}</strong></div><ArrowUpRight size={17}/></Link>)}</div>
    </div>
  </section>;
}

function EditorsDesk(){
  const feature=articleByKey("ozge-gurkan");
  const side=[articleByKey("ben-bohmer"),articleByKey("david-lynch"),articleByKey("elif-ebru-sakar")];
  return <section className="v6-editors"><div className="site-width">
    <header className="v6-editors-head"><div><Eyebrow>HİPİNUP EDIT / 01</Eyebrow><h2>Editör Masası</h2></div><p>Algoritmanın değil, merakın seçtiği hikâyeler.</p></header>
    <div className="v6-editors-grid"><article className="v6-editors-feature"><Link href={feature.path}><Photo article={feature}/></Link><div><Eyebrow>SANAT & KÜLTÜR</Eyebrow><h3><Link href={feature.path}>{feature.title}</Link></h3><p>{feature.excerpt}</p><Meta article={feature}/></div></article>
    <div className="v6-editors-side">{side.map((article,index)=><Link href={article.path} key={article.key}><span>0{index+1}</span><Image src={article.imageSmall} alt="" width={220} height={150}/><div><Eyebrow>{articleCategory(article).name}</Eyebrow><strong>{article.title}</strong></div></Link>)}</div></div>
  </div></section>;
}

function StyleSection(){
  const main=articleByKey("certain-denim");
  const side=[articleByKey("akay"),articleByKey("sustainable-fashion")];
  return <section className="site-width v6-style-section"><header className="v6-section-head"><div><Eyebrow>MODA & STİL</Eyebrow><h2>Tak. Tavrını.</h2></div><Link href={categoryByKey("moda").path}>Tüm stil hikâyeleri <ArrowRight size={17}/></Link></header>
    <div className="v6-style-grid"><article className="v6-style-main"><Link href={main.path}><Photo article={main}/></Link><div><Eyebrow>STYLE / 01</Eyebrow><h3><Link href={main.path}>{main.title}</Link></h3><p>{main.excerpt}</p></div></article>
    <div className="v6-style-side">{side.map(article=><article key={article.key}><Link href={article.path}><Photo article={article}/></Link><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3></article>)}</div></div>
  </section>;
}

function UpShots(){
  const shots=["bubas-bosphorus","coffee","smoothies","hurrem-sultan-hamami","freesbee"].map(articleByKey);
  return <section className="v6-shots"><div className="site-width"><header><div><Eyebrow><Camera size={13}/> FOTOĞRAFLA ANLAT</Eyebrow><h2>UP! Shots</h2></div><p>Bir bakışta içine çeken yerler, tatlar ve anlar.</p></header><div className="v6-shots-grid">{shots.map((article,index)=><Link href={article.path} key={article.key} className={index===0?"big":""}><Photo article={article}/><div><span>0{index+1}</span><strong>{article.title}</strong></div></Link>)}</div></div></section>;
}

function Escape(){
  const main=articleByKey("six-senses");
  const side=[articleByKey("bodrum-boat"),articleByKey("modern-travel")];
  return <section className="v6-escape"><div className="site-width"><header className="v6-section-head"><div><Eyebrow><Compass size={13}/> MOD: KAÇIŞ</Eyebrow><h2>Biraz offline olsan?</h2></div><Link href={categoryByKey("seyahat").path}>Rotayı değiştir <ArrowRight size={17}/></Link></header><div className="v6-escape-grid"><article><Link href={main.path}><Photo article={main}/></Link><Eyebrow>SEYAHAT / 01</Eyebrow><h3><Link href={main.path}>{main.title}</Link></h3><p>{main.excerpt}</p></article><div>{side.map(article=><article key={article.key}><Link href={article.path}><Photo article={article}/></Link><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3></article>)}</div></div></div></section>;
}

function VideoSection(){
  const videos=["tommy-t-wave","ben-bohmer","david-lynch"].map(articleByKey);
  return <section className="v6-video"><div className="site-width"><header><div><Eyebrow><CirclePlay size={13}/> WATCH</Eyebrow><h2>UP! Video</h2></div><p>Hızlı izle. Sesini aç. Hikâyenin içine gir.</p></header><div className="v6-video-grid">{videos.map((article,index)=><Link href={article.path} key={article.key} className={index===0?"featured":""}><Photo article={article}/><span className="v6-play"><CirclePlay size={index===0?46:34}/></span><div><Eyebrow>{articleCategory(article).name}</Eyebrow><strong>{article.title}</strong></div></Link>)}</div></div></section>;
}

function Culture(){
  const main=articleByKey("istanbula-reverans");
  const side=[articleByKey("ozge-gurkan"),articleByKey("ben-bohmer")];
  return <section className="site-width v6-culture"><header className="v6-section-head"><div><Eyebrow>KÜLTÜR & SANAT</Eyebrow><h2>Bunu konuşalım.</h2></div><Link href={categoryByKey("sanat").path}>Kültüre git <ArrowRight size={17}/></Link></header><div className="v6-culture-grid"><article className="v6-culture-main"><Link href={main.path}><Photo article={main}/></Link><div><Eyebrow>ŞEHİR / SANAT</Eyebrow><h3><Link href={main.path}>{main.title}</Link></h3><p>{main.excerpt}</p></div></article><div className="v6-culture-side">{side.map(article=><article key={article.key}><Link href={article.path}><Photo article={article}/></Link><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3></article>)}</div></div></section>;
}

function Radar(){
  const topics=[["Moda & Stil","moda"],["Celebrity","celebrity"],["Yeni Mekanlar","mekan"],["Wellness","wellness"],["Şehrin Sanatı","sanat"],["Kaçış Rotaları","seyahat"]] as const;
  return <section className="v6-radar"><div className="site-width"><header><div><Eyebrow><TrendingUp size={13}/> RADARDA</Eyebrow><h2>Şimdi ne konuşuyoruz?</h2></div><p>Trend değil; ilgimizi çeken şeyler.</p></header><div>{topics.map(([label,key],index)=><Link href={categoryByKey(key).path} key={key}><span>0{index+1}</span><strong>{label}</strong><ArrowUpRight size={18}/></Link>)}</div></div></section>;
}

function FeelGood(){
  const cards=[articleByKey("smoothies"),articleByKey("coffee"),articleByKey("hurrem-sultan-hamami")];
  return <section className="site-width v6-feel"><header className="v6-section-head"><div><Eyebrow>WELLNESS</Eyebrow><h2>Modunu yükselt.</h2></div><Link href={categoryByKey("wellness").path}>Bir mola ver <ArrowRight size={17}/></Link></header><div className="v6-feel-grid">{cards.map((article,index)=><article key={article.key} className={index===0?"featured":""}><Link href={article.path}><Photo article={article}/></Link><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3></article>)}</div></section>;
}

function LastThing(){
  const article=articleByKey("sustainable-fashion");
  return <section className="v6-last"><div className="site-width v6-last-grid"><Link href={article.path} className="v6-last-photo"><Photo article={article}/></Link><div><Eyebrow>ONE LAST THING</Eyebrow><h2>Daha az.<br/>Daha iyi.</h2><p>{article.excerpt}</p><Meta article={article}/><Link href={article.path} className="v6-read-link light">Hikâyeyi oku <ArrowUpRight size={17}/></Link></div></div></section>;
}

function Explore(){
  const keys=["celebrity","moda","seyahat","sanat","wellness","mekan"];
  return <section className="v6-explore"><div className="site-width"><strong>Merakın nereye gidiyor?</strong><nav>{keys.map(key=><Link href={categoryByKey(key).path} key={key}>{categoryByKey(key).name}<ArrowUpRight size={15}/></Link>)}</nav></div></section>;
}

export function HomePageV6(){
  return <Shell><main id="icerik" className="v6-home">
    <LiveStrip/>
    <Hero/>
    <MustRead/>
    <div className="site-width v6-ad"><AdSlot format="leaderboard"/></div>
    <EditorsDesk/>
    <StyleSection/>
    <UpShots/>
    <div className="v6-ad-break"><div className="site-width"><AdSlot format="billboard"/></div></div>
    <Escape/>
    <VideoSection/>
    <Culture/>
    <Radar/>
    <FeelGood/>
    <LastThing/>
    <Explore/>
  </main></Shell>;
}
