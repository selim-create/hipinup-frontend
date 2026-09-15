import Image from "next/image";
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
  orderedArticles,
  type Article,
} from "@/app/data/content";
import { categoryByKey } from "@/app/data/navigation";
import { Shell } from "./magazine";
import { AdSlot } from "./ad-slot";

function Photo({article, priority=false, sizes="(max-width: 760px) 100vw, 50vw", className=""}:{article:Article;priority?:boolean;sizes?:string;className?:string}) {
  return <Image className={className} src={article.image} alt={article.title} width={1280} height={854} sizes={sizes} priority={priority} loading={priority?"eager":"lazy"} fetchPriority={priority?"high":"auto"}/>;
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
  const lead=articleByKey("freesbee");
  const side=[articleByKey("tommy-t-wave"),articleByKey("elif-ebru-sakar"),articleByKey("david-lynch")];
  const promo=articleByKey("modern-travel");
  return <section className="site-width v7-hero">
    <article className="v7-hero-feature">
      <div className="v7-hero-media">
        <Link href={lead.path} className="v7-hero-image"><Photo article={lead} priority sizes="(max-width: 980px) 100vw, 68vw"/></Link>
        <Link href={categoryByKey("moda").path} className="v7-hero-chip">STİL RADARI <ArrowUpRight size={16}/></Link>
        <h1 className="v7-hero-title"><Link href={lead.path}><span>KALİFORNİYA</span><span>RUHUNU TAK!</span></Link></h1>
        <span className="v7-hero-vertical">NO RULES. JUST STYLE.</span>
      </div>
      <div className="v7-hero-foot">
        <div><p>{lead.excerpt}</p><Meta article={lead}/></div>
        <Link href={lead.path} className="v7-hero-arrow" aria-label="Hikâyeyi oku"><ArrowUpRight size={27}/></Link>
      </div>
    </article>

    <aside className="v7-flow">
      <header className="v7-flow-head">
        <span className="v7-flow-kicker">BUNU<br/>DA BİL</span>
        <h2>Akışta<br/><em>ne var?</em></h2>
        <span className="v7-up-badge">up!</span>
      </header>
      <div className="v7-flow-list">
        {side.map((article,index)=><Link href={article.path} className={`v7-flow-item shape-${index+1}`} key={article.key}>
          <div className="v7-flow-photo"><Image src={article.imageSmall} alt="" width={220} height={180}/><b>0{index+1}</b></div>
          <div className="v7-flow-copy"><Eyebrow>{articleCategory(article).name}</Eyebrow><strong>{article.title}</strong><Meta article={article}/></div>
          <ArrowUpRight className="v7-flow-arrow" size={17}/>
        </Link>)}
      </div>
      <Link href={promo.path} className="v7-promo">
        <div className="v7-promo-copy"><Eyebrow>SEYAHAT DOSYASI</Eyebrow><strong>Az eşya.<br/>Çok hikâye.</strong><span>Hafif seyahat et <ArrowUpRight size={15}/></span></div>
        <div className="v7-promo-photo"><Image src={promo.imageSmall} alt="" width={280} height={190}/></div>
      </Link>
    </aside>
  </section>;
}

function MustRead(){
  const list=[articleByKey("tags-design"),articleByKey("bubas-bosphorus"),articleByKey("istanbula-reverans")];
  return <section className="site-width v7-must">
    <div className="v7-must-title"><Eyebrow>HIZLI SEÇKİ</Eyebrow><h2>KAÇIRMA</h2><span/></div>
    <div className="v7-must-list">{list.map((article,index)=><Link href={article.path} key={article.key}>
      <b>0{index+1}</b><div><Eyebrow>{articleCategory(article).name}</Eyebrow><strong>{article.title}</strong></div><ArrowUpRight size={17}/>
    </Link>)}</div>
  </section>;
}

function ReadersLike(){
  const stories=[articleByKey("bodrum-boat"),articleByKey("elif-ebru-sakar"),articleByKey("tags-design")];
  return <section className="site-width v62-readers">
    <header className="v62-readers-head"><div><Eyebrow>PEOPLE MANTIĞI / HİPİNUP RİTMİ</Eyebrow><h2>Şu an okunuyor.</h2></div><p>Okurun ilgisini çeken hikâyeler, tek bakışta.</p></header>
    <div className="v62-readers-grid">{stories.map((article,index)=><article key={article.key} className={index===0?"featured":""}>
      <Link href={article.path} className="v62-readers-photo"><Photo article={article}/></Link>
      <div className="v62-readers-copy"><span>0{index+1}</span><div><Eyebrow>{articleCategory(article).name}</Eyebrow><h3><Link href={article.path}>{article.title}</Link></h3><div className="v62-reader-foot"><span>{article.author}</span><Meta article={article}/></div></div></div>
    </article>)}</div>
  </section>;
}

function EditorsDesk(){
  const feature=articleByKey("ozge-gurkan");
  const side=[articleByKey("ben-bohmer"),articleByKey("david-lynch"),articleByKey("elif-ebru-sakar")];
  return <section className="v6-editors"><div className="site-width">
    <header className="v6-editors-head"><div className="v62-editors-title"><Eyebrow>HİPİNUP EDIT / 01</Eyebrow><h2>Editör Masası</h2><div className="v62-curator"><span>up!</span><div><strong>Hipinup Edit</strong><small>Haftanın editör seçkisi</small></div></div></div><p>Algoritmanın değil, merakın seçtiği hikâyeler.</p></header>
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
  return <section className="v6-shots"><div className="site-width"><header><div><Eyebrow><Camera size={13}/> BUGÜNÜN KARELERİ</Eyebrow><h2>Shots</h2></div><p>People’ın Star Tracks hızında; Hipinup’ın kendi fotoğraf diliyle.</p></header><div className="v6-shots-grid">{shots.map((article,index)=><Link href={article.path} key={article.key} className={index===0?"big":""}><Photo article={article}/><div><span>0{index+1}</span><strong>{article.title}</strong></div></Link>)}</div></div></section>;
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
  return <section className="v6-radar"><div className="site-width"><header><div><Eyebrow><TrendingUp size={13}/> TRENDING TOPICS</Eyebrow><h2>Şimdi ne konuşuyoruz?</h2></div><p>Trend değil; ilgimizi çeken şeyler.</p></header><div>{topics.map(([label,key],index)=><Link href={categoryByKey(key).path} key={key}><span>0{index+1}</span><strong>{label}</strong><ArrowUpRight size={18}/></Link>)}</div></div></section>;
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
    <div className="site-width v7-top-ad"><AdSlot format="leaderboard"/></div>
    <Hero/>
    <MustRead/>
    <ReadersLike/>
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