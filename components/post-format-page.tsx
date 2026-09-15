import Image from "next/image";
import Link from "./site-link";
import {
  ArrowUpRight,
  Asterisk,
  CirclePlay,
  Headphones,
  Images,
  ListOrdered,
  Quote,
  SkipForward,
} from "lucide-react";
import {
  articleByKey,
  articleCategory,
  articleFormat,
  bodies,
  dateLabel,
  orderedArticles,
  type Article,
  type ArticleFormat,
} from "@/app/data/content";
import { Shell, StoryCard, ArticlePage } from "./magazine";
import { ReaderActions } from "./reader-actions";
import { ReadingProgress } from "./reading-progress";
import { AdSlot } from "./ad-slot";

const formatLabels:Record<ArticleFormat,string>={
  standard:"Hikâye",
  gallery:"Foto Galeri",
  video:"UP! Video",
  podcast:"Podcast",
  quote:"Alıntı",
  list:"Liste",
};

function FormatIcon({format,size=18}:{format:ArticleFormat;size?:number}){
  if(format==="gallery") return <Images size={size}/>;
  if(format==="video") return <CirclePlay size={size}/>;
  if(format==="podcast") return <Headphones size={size}/>;
  if(format==="quote") return <Quote size={size}/>;
  if(format==="list") return <ListOrdered size={size}/>;
  return <Asterisk size={size}/>;
}

function FormatBadge({format}:{format:ArticleFormat}){
  return <span className="pf-format-badge"><FormatIcon format={format}/>{formatLabels[format]}</span>;
}

function FormatBreadcrumb({article}:{article:Article}){
  const category=articleCategory(article);
  return <nav className="pf-breadcrumb" aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><span>/</span><Link href={category.path}>{category.name}</Link><span>/</span><strong>{formatLabels[articleFormat(article)]}</strong></nav>;
}

function FormatHeader({article,format}:{article:Article;format:ArticleFormat}){
  const category=articleCategory(article);
  return <header className="pf-heading">
    <div className="pf-heading-top"><FormatBadge format={format}/><Link href={category.path}>{category.name}<ArrowUpRight size={16}/></Link></div>
    <h1>{article.title}</h1>
    <p>{article.excerpt}</p>
    <div className="pf-meta-row"><div><span className="pf-avatar">h.</span><span><strong>{article.author}</strong><small><time dateTime={article.date}>{dateLabel(article.date)}</time> · {article.minutes} dk</small></span></div><ReaderActions articleKey={article.key}/></div>
  </header>;
}

const galleryKeys=["istanbula-reverans","ozge-gurkan","bodrum-boat","akay","freesbee"];

function GalleryExperience({article}:{article:Article}){
  const shots=galleryKeys.map(articleByKey);
  return <>
    <section className="pf-gallery-lead site-width" aria-label="Foto galeri öne çıkan kareler">
      <figure className="pf-gallery-main"><Image src={article.image} alt={article.title} width={1280} height={854} priority sizes="(max-width:900px) 100vw, 70vw"/><figcaption><span>01 / 05</span>İstanbul’a başka bir gözle bak.</figcaption></figure>
      <div className="pf-gallery-stack">{shots.slice(1,3).map((shot,i)=><figure key={shot.key}><Image src={shot.imageSmall} alt="" width={640} height={430}/><span>0{i+2}</span></figure>)}</div>
      <div className="pf-gallery-sticker"><Images/><strong>5 KARE</strong><span>Tek hikâye.</span></div>
    </section>
    <section className="pf-gallery-grid site-width">{shots.map((shot,i)=><figure key={shot.key} className={i===2?"pf-gallery-wide":""}><Image src={shot.image} alt={i===0?article.title:"Hipinup foto galeri karesi"} width={1280} height={854}/><figcaption><b>{String(i+1).padStart(2,"0")}</b><span>{i===0?article.title:shot.title}</span></figcaption></figure>)}</section>
  </>;
}

function VideoExperience({article}:{article:Article}){
  return <section className="pf-video-stage">
    <Image src={article.image} alt={article.title} width={1600} height={900} priority sizes="100vw"/>
    <div className="pf-video-shade"/>
    <span className="pf-video-play" aria-hidden="true"><CirclePlay/></span>
    <div className="pf-video-caption"><span>UP! VIDEO / 08:24</span><strong>SESİ AÇ.<br/>HİKÂYEYE GİR.</strong></div>
    <span className="pf-video-corner">16:9 / HIPINUP CUT</span>
  </section>;
}

function PodcastExperience({article}:{article:Article}){
  return <section className="pf-podcast-stage site-width">
    <figure><Image src={article.image} alt={article.title} width={800} height={800} priority/><span><Headphones/> HIPINUP PODCAST</span></figure>
    <div className="pf-podcast-player">
      <span className="pf-episode">EP. 04 · 28:16</span>
      <h2>Biraz ses.<br/><em>Biraz hikâye.</em></h2>
      <div className="pf-player-line"><span className="pf-player-button"><CirclePlay/></span><div className="pf-waveform" aria-hidden="true">{Array.from({length:38},(_,i)=><i key={i} style={{height:`${18+((i*13)%43)}%`}}/>)}</div><time>28:16</time></div>
      <div className="pf-player-actions"><span>00:00</span><span>1×</span><span><SkipForward size={17}/> Sonraki bölüm</span></div>
    </div>
  </section>;
}

function QuoteExperience({article}:{article:Article}){
  return <section className="pf-quote-stage site-width">
    <div className="pf-quote-copy"><Quote aria-hidden="true"/><blockquote>{article.excerpt}</blockquote><span>— {article.author}</span></div>
    <figure><Image src={article.image} alt={article.title} width={900} height={1100} priority/><figcaption>ALINTI / HİPİNUP ARŞİVİ</figcaption></figure>
    <span className="pf-quote-note">Kaydet.<br/>Sonra yine oku.</span>
  </section>;
}

function ListExperience({article}:{article:Article}){
  return <section className="pf-list-stage site-width"><div className="pf-list-poster"><Image src={article.image} alt={article.title} width={1280} height={850} priority/><span>01—05</span></div><div className="pf-list-intro"><ListOrdered/><strong>5 ŞEY.</strong><p>Kaydetmelik, dönüp tekrar bakmalık bir Hipinup listesi.</p></div></section>;
}

function StandardBody({article,format}:{article:Article;format:ArticleFormat}){
  const blocks=(bodies[article.key]||[]).filter(b=>b.text.trim());
  const paragraphs=blocks.filter(b=>b.type!=="h2"&&b.type!=="h3");
  if(format==="list"){
    const fallback=[article.excerpt,"Malzemeyi ve dokuyu yakından incele.","Küçük detayların mekânın havasını nasıl değiştirdiğine bak.","Kendi stiline uyan parçaları kaydet.","Listeyi sonra yeniden açmak için paylaş."];
    const source=paragraphs.map(b=>b.text);
    const items=[...source,...fallback].filter((text,i,arr)=>arr.indexOf(text)===i).slice(0,5);
    return <section className="pf-list-body site-width"><header><span>LİSTE / {String(items.length).padStart(2,"0")}</span><h2>KISA KISA.<br/><em>İYİ İYİ.</em></h2></header><div>{items.map((text,i)=><article key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{text}</p><ArrowUpRight size={24}/></article>)}</div></section>;
  }
  return <section className={`pf-story-body site-width pf-story-${format}`}>
    <div className="pf-story-copy"><span className="pf-story-kicker"><Asterisk/> HİKÂYENİN DEVAMI</span>{blocks.length?blocks.map((block,i)=>block.type==="h2"||block.type==="h3"?<h2 key={i}>{block.text}</h2>:<p key={i}>{block.text}</p>):<p>{article.excerpt}</p>}</div>
    <aside><AdSlot format="rectangle"/><div className="pf-save-note">OKU.<br/><span>KAYDET.</span><br/>PAYLAŞ.</div></aside>
  </section>;
}

function FormatRelated({article}:{article:Article}){
  const related=orderedArticles.filter(a=>a.key!==article.key).slice(0,3);
  return <section className="pf-related"><div className="site-width"><header><span>BİR SONRAKİ?</span><h2>MERAK<br/><em>DEVAM.</em></h2></header><div className="three-grid">{related.map((a,i)=><StoryCard article={a} key={a.key} index={i}/>)}</div></div></section>;
}

export function PostFormatPage({article}:{article:Article}){
  const format=articleFormat(article);
  if(format==="standard") return <ArticlePage article={article}/>;
  return <Shell><main id="icerik" className={`pf-single pf-${format}`} data-format={format}>
    <section className="pf-hero"><div className="site-width"><FormatBreadcrumb article={article}/><FormatHeader article={article} format={format}/></div>
      {format==="gallery"&&<GalleryExperience article={article}/>} 
      {format==="video"&&<div className="site-width"><VideoExperience article={article}/></div>}
      {format==="podcast"&&<PodcastExperience article={article}/>} 
      {format==="quote"&&<QuoteExperience article={article}/>} 
      {format==="list"&&<ListExperience article={article}/>} 
    </section>
    <ReadingProgress title={article.title}/>
    <StandardBody article={article} format={format}/>
    <FormatRelated article={article}/>
  </main></Shell>;
}
