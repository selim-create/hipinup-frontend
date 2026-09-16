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
} from "lucide-react";
import {
  articleCategory,
  articleFormat,
  dateLabel,
  type Article,
  type ArticleFormat,
  type ContentBlock,
  type ContentMedia,
} from "@/app/data/content";
import { cleanPlainText } from "@/lib/plain-text";
import { Shell, StoryCard, ArticlePage } from "./magazine";
import { ReaderActions } from "./reader-actions";
import { ReadingProgress } from "./reading-progress";
import { AdSlot } from "./ad-slot";

const formatLabels: Record<ArticleFormat, string> = {
  standard: "Hikâye",
  gallery: "Foto Galeri",
  video: "UP! Video",
  podcast: "Podcast",
  quote: "Alıntı",
  list: "Liste",
};

type FormatImage = ContentMedia & { urlSmall?: string };
type FormatListItem = {
  number: number;
  title: string;
  body: string;
  image: FormatImage | null;
};
type MediaSource = {
  url: string;
  duration: string;
  mimeType: string;
  title: string;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function articleFormatData(article: Article): UnknownRecord {
  return isRecord(article.formatData) ? article.formatData : {};
}

function formatImage(value: unknown): FormatImage | null {
  if (!isRecord(value)) return null;
  const url = stringValue(value.url);
  if (!url) return null;
  return {
    id: numberValue(value.id),
    url,
    urlSmall: stringValue(value.urlSmall) || undefined,
    width: Math.max(1, numberValue(value.width, 1280)),
    height: Math.max(1, numberValue(value.height, 854)),
    alt: cleanPlainText(stringValue(value.alt)),
    caption: cleanPlainText(stringValue(value.caption)),
  };
}

function fallbackImage(article: Article): FormatImage {
  return {
    id: article.id || 0,
    url: article.image || article.imageSmall,
    urlSmall: article.imageSmall || article.image,
    width: 1280,
    height: 854,
    alt: article.title,
    caption: "",
  };
}

function galleryItems(article: Article) {
  const data = articleFormatData(article);
  const source = Array.isArray(data.items) ? data.items : [];
  const items = source.map(formatImage).filter((item): item is FormatImage => Boolean(item));
  return items.length ? items : [fallbackImage(article)];
}

function mediaSource(article: Article): MediaSource {
  const data = articleFormatData(article);
  const media = isRecord(data.media) ? data.media : {};
  return {
    url: stringValue(media.url) || stringValue(data.url),
    duration: stringValue(media.duration) || stringValue(data.duration),
    mimeType: stringValue(media.mimeType),
    title: cleanPlainText(stringValue(media.title)),
  };
}

function quoteData(article: Article) {
  const data = articleFormatData(article);
  return {
    text: cleanPlainText(stringValue(data.text)) || article.excerpt,
    attribution: cleanPlainText(stringValue(data.attribution)) || article.author,
  };
}

function podcastEpisode(article: Article) {
  return cleanPlainText(stringValue(articleFormatData(article).episode));
}

function listItems(article: Article): FormatListItem[] {
  const data = articleFormatData(article);
  const source = Array.isArray(data.items) ? data.items : [];
  return source.flatMap((value, index) => {
    if (!isRecord(value)) return [];
    const title = cleanPlainText(stringValue(value.title));
    const body = cleanPlainText(stringValue(value.body));
    const image = formatImage(value.image);
    if (!title && !body && !image) return [];
    return [{
      number: Math.max(1, numberValue(value.number, index + 1)),
      title,
      body,
      image,
    }];
  });
}

function FormatIcon({ format, size = 18 }: { format: ArticleFormat; size?: number }) {
  if (format === "gallery") return <Images size={size}/>;
  if (format === "video") return <CirclePlay size={size}/>;
  if (format === "podcast") return <Headphones size={size}/>;
  if (format === "quote") return <Quote size={size}/>;
  if (format === "list") return <ListOrdered size={size}/>;
  return <Asterisk size={size}/>;
}

function FormatBadge({ format }: { format: ArticleFormat }) {
  return <span className="pf-format-badge"><FormatIcon format={format}/>{formatLabels[format]}</span>;
}

function FormatBreadcrumb({ article }: { article: Article }) {
  const category = articleCategory(article);
  return <nav className="pf-breadcrumb" aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><span>/</span><Link href={category.path}>{category.name}</Link><span>/</span><strong>{formatLabels[articleFormat(article)]}</strong></nav>;
}

function FormatHeader({ article, format }: { article: Article; format: ArticleFormat }) {
  const category = articleCategory(article);
  return <header className="pf-heading">
    <div className="pf-heading-top"><FormatBadge format={format}/><Link href={category.path}>{category.name}<ArrowUpRight size={16}/></Link></div>
    <h1>{article.title}</h1>
    {article.excerpt && <p>{article.excerpt}</p>}
    <div className="pf-meta-row"><div><span className="pf-avatar">h.</span><span><strong>{article.author}</strong><small><time dateTime={article.date}>{dateLabel(article.date)}</time> · {article.minutes} dk</small></span></div><ReaderActions articleKey={article.key}/></div>
  </header>;
}

function FormatImageView({ media, priority = false, sizes = "(max-width:900px) 100vw, 70vw" }: { media: FormatImage; priority?: boolean; sizes?: string }) {
  return <Image src={media.url} alt={media.alt || ""} width={media.width || 1280} height={media.height || 854} priority={priority} sizes={sizes}/>;
}

function GalleryExperience({ article }: { article: Article }) {
  const shots = galleryItems(article);
  const lead = shots[0];
  const count = shots.length;
  const leadCaption = lead.caption || article.excerpt || article.title;
  return <>
    <section className="pf-gallery-lead site-width" aria-label="Foto galeri öne çıkan kareler">
      <figure className="pf-gallery-main"><FormatImageView media={lead} priority/><figcaption><span>01 / {String(count).padStart(2, "0")}</span>{leadCaption}</figcaption></figure>
      {shots.length > 1 && <div className="pf-gallery-stack">{shots.slice(1, 3).map((shot, index) => <figure key={`${shot.id || shot.url}-${index}`}><FormatImageView media={{ ...shot, url: shot.urlSmall || shot.url }} sizes="(max-width:900px) 50vw, 25vw"/><span>{String(index + 2).padStart(2, "0")}</span></figure>)}</div>}
      <div className="pf-gallery-sticker"><Images/><strong>{count} KARE</strong><span>Tek hikâye.</span></div>
    </section>
    <section className="pf-gallery-grid site-width">{shots.map((shot, index) => <figure key={`${shot.id || shot.url}-grid-${index}`} className={index === 2 ? "pf-gallery-wide" : ""}><FormatImageView media={shot} sizes="(max-width:760px) 100vw, 50vw"/><figcaption><b>{String(index + 1).padStart(2, "0")}</b><span>{shot.caption || shot.alt || (index === 0 ? article.title : `Kare ${index + 1}`)}</span></figcaption></figure>)}</section>
  </>;
}

function videoEmbedUrl(url: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const id = parsed.searchParams.get("v") || ((parts[0] === "shorts" || parts[0] === "embed") ? parts[1] : "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
      return id ? `https://player.vimeo.com/video/${id}` : "";
    }
  } catch {
    return "";
  }
  return "";
}

function VideoExperience({ article }: { article: Article }) {
  const source = mediaSource(article);
  const embedUrl = videoEmbedUrl(source.url);
  return <section className="pf-video-stage">
    {source.url ? (embedUrl
      ? <iframe className="pf-video-media" src={embedUrl} title={article.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
      : <video className="pf-video-media" src={source.url} poster={article.image} controls preload="metadata" playsInline/>)
      : <><Image src={article.image} alt={article.title} width={1600} height={900} priority sizes="100vw"/><span className="pf-video-play" aria-hidden="true"><CirclePlay/></span></>}
    <div className="pf-video-shade" aria-hidden="true"/>
    <div className="pf-video-caption"><span>UP! VIDEO{source.duration ? ` / ${source.duration}` : ""}</span><strong>{article.cardLabel || "HİKÂYEYİ İZLE."}</strong></div>
    <span className="pf-video-corner">{source.mimeType ? source.mimeType.toUpperCase() : "HIPINUP VIDEO"}</span>
  </section>;
}

function PodcastExperience({ article }: { article: Article }) {
  const source = mediaSource(article);
  const episode = podcastEpisode(article);
  return <section className="pf-podcast-stage site-width">
    <figure><Image src={article.image} alt={article.title} width={800} height={800} priority/><span><Headphones/> HIPINUP PODCAST</span></figure>
    <div className="pf-podcast-player">
      <span className="pf-episode">{episode || "HIPINUP PODCAST"}{source.duration ? ` · ${source.duration}` : ""}</span>
      <h2>{article.title}</h2>
      <div className="pf-player-line"><div className="pf-waveform" aria-hidden="true">{Array.from({ length: 38 }, (_, index) => <i key={index} style={{ height: `${18 + ((index * 13) % 43)}%` }}/>)}</div>{source.duration && <time>{source.duration}</time>}</div>
      {source.url ? <audio className="pf-podcast-audio" controls preload="metadata" src={source.url}>Tarayıcınız ses oynatmayı desteklemiyor.</audio> : <p className="pf-media-missing">Bu bölüm için henüz bir ses kaynağı eklenmemiş.</p>}
    </div>
  </section>;
}

function QuoteExperience({ article }: { article: Article }) {
  const quote = quoteData(article);
  return <section className="pf-quote-stage site-width">
    <div className="pf-quote-copy"><Quote aria-hidden="true"/><blockquote>{quote.text}</blockquote><span>— {quote.attribution}</span></div>
    <figure><Image src={article.image} alt={article.title} width={900} height={1100} priority/><figcaption>ALINTI / HİPİNUP</figcaption></figure>
    <span className="pf-quote-note">Kaydet.<br/>Sonra yine oku.</span>
  </section>;
}

function ListExperience({ article, items }: { article: Article; items: FormatListItem[] }) {
  const count = items.length;
  const poster = items.find((item) => item.image)?.image || fallbackImage(article);
  return <section className="pf-list-stage site-width"><div className="pf-list-poster"><FormatImageView media={poster} priority sizes="(max-width:760px) 100vw, 65vw"/><span>{count ? `01—${String(count).padStart(2, "0")}` : "LİSTE"}</span></div><div className="pf-list-intro"><ListOrdered/><strong>{count} MADDE.</strong><p>{article.excerpt}</p></div></section>;
}

function FormatStoryBlock({ block, index }: { block: ContentBlock; index: number }) {
  if (block.type === "heading") return <h2 key={index}>{block.text}</h2>;
  if (block.type === "paragraph") return <p key={index}>{block.text}</p>;
  if (block.type === "list") {
    const ListTag = block.ordered ? "ol" : "ul";
    return <ListTag className="pf-story-list" key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{item.text}</li>)}</ListTag>;
  }
  if (block.type === "quote") return <blockquote className="pf-story-quote" key={index}><p>{block.text}</p>{block.citation && <cite>{block.citation}</cite>}</blockquote>;
  if (block.type === "image") {
    const media = { ...block.media } as FormatImage;
    return <figure className="pf-story-image" key={index}><FormatImageView media={media} sizes="(max-width:760px) 100vw, 760px"/>{media.caption && <figcaption>{media.caption}</figcaption>}</figure>;
  }
  if (block.type === "gallery") return <div className="pf-story-gallery" key={index}>{block.items.map((media, itemIndex) => <figure key={`${media.id || media.url}-${itemIndex}`}><FormatImageView media={{ ...media } as FormatImage} sizes="(max-width:760px) 50vw, 380px"/>{media.caption && <figcaption>{media.caption}</figcaption>}</figure>)}</div>;
  if (block.type === "embed") return block.url ? <p className="pf-story-embed" key={index}><a href={block.url} target="_blank" rel="noreferrer">Gömülü içeriği aç <ArrowUpRight size={18}/></a></p> : null;
  if (block.type === "media") return <figure className="pf-story-media" key={index}>{block.mediaType === "audio" ? <audio controls preload="metadata" src={block.url}/> : <video controls preload="metadata" src={block.url}/>} {block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
  if (block.type === "table") return <div className="pf-story-table" key={index} dangerouslySetInnerHTML={{ __html: block.html }}/>;
  if (block.type === "code") return <pre className="pf-story-code" key={index}><code>{block.text}</code></pre>;
  if (block.type === "separator") return <hr className="pf-story-separator" key={index}/>;
  if (block.type === "html") return block.html ? <div className="pf-story-html" key={index} dangerouslySetInnerHTML={{ __html: block.html }}/> : block.text ? <p key={index}>{block.text}</p> : null;
  return null;
}

function FormatStoryBody({ article }: { article: Article }) {
  const blocks = article.contentBlocks || [];
  return <section className="pf-story-body site-width">
    <div className="pf-story-copy"><span className="pf-story-kicker"><Asterisk/> HİKÂYENİN DEVAMI</span>{blocks.length ? blocks.map((block, index) => <FormatStoryBlock block={block} index={index} key={index}/>) : article.content ? <div className="pf-story-html" dangerouslySetInnerHTML={{ __html: article.content }}/> : <p>{article.excerpt}</p>}</div>
    <aside><AdSlot format="rectangle"/><div className="pf-save-note">OKU.<br/><span>KAYDET.</span><br/>PAYLAŞ.</div></aside>
  </section>;
}

function ListBody({ article, items }: { article: Article; items: FormatListItem[] }) {
  if (!items.length) return <FormatStoryBody article={article}/>;
  return <section className="pf-list-body site-width"><header><span>LİSTE / {String(items.length).padStart(2, "0")}</span><h2>KISA KISA.<br/><em>İYİ İYİ.</em></h2></header><div>{items.map((item, index) => <article key={`${item.number}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div className="pf-list-item-copy">{item.title && <strong>{item.title}</strong>}{item.body && <p>{item.body}</p>}</div><figure className={`pf-list-item-media ${item.image ? "has-image" : ""}`}>{item.image && <FormatImageView media={item.image} sizes="120px"/>}</figure><ArrowUpRight size={24}/></article>)}</div></section>;
}

function FormatRelated({ related }: { related: Article[] }) {
  if (!related.length) return null;
  return <section className="pf-related"><div className="site-width"><header><span>BİR SONRAKİ?</span><h2>MERAK<br/><em>DEVAM.</em></h2></header><div className="three-grid">{related.map((article, index) => <StoryCard article={article} key={article.key} index={index}/>)}</div></div></section>;
}

export function PostFormatPage({ article, related = [] }: { article: Article; related?: Article[] }) {
  const format = articleFormat(article);
  if (format === "standard") return <ArticlePage article={article}/>;
  const items = format === "list" ? listItems(article) : [];
  return <Shell><main id="icerik" className={`pf-single pf-${format}`} data-format={format}>
    <section className="pf-hero"><div className="site-width"><FormatBreadcrumb article={article}/><FormatHeader article={article} format={format}/></div>
      {format === "gallery" && <GalleryExperience article={article}/>} 
      {format === "video" && <div className="site-width"><VideoExperience article={article}/></div>}
      {format === "podcast" && <PodcastExperience article={article}/>} 
      {format === "quote" && <QuoteExperience article={article}/>} 
      {format === "list" && <ListExperience article={article} items={items}/>} 
    </section>
    <ReadingProgress title={article.title}/>
    {format === "list" ? <ListBody article={article} items={items}/> : <FormatStoryBody article={article}/>} 
    <FormatRelated related={related}/>
  </main></Shell>;
}
