import Image from "next/image";
import Link from "./site-link";
import {
  Asterisk,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";
import { articleCategory, dateLabel, orderedArticles, type Article } from "@/app/data/content";
import { categories as mockCategories, categoryByKey, type Category } from "@/app/data/navigation";
import type { ApiPagination } from "@/lib/hipinup-api";
import { Shell, StoryCard } from "./magazine";
import { AdSlot } from "./ad-slot";
import { NewsletterForm, ReaderActions } from "./reader-actions";
import { ReadingProgress } from "./reading-progress";
import { Wave, Squiggle } from "./wave";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

type LiveBlock = { type: "h2" | "h3" | "p" | "li" | "blockquote"; text: string };

function categoryFrom(key: string | undefined, navigation: Category[]) {
  if (!key) return undefined;
  return navigation.find((item) => item.key === key) || categoryByKey(key);
}

function Breadcrumb({ category, navigation, article = false }: { category: Category; navigation: Category[]; article?: boolean }) {
  const parent = categoryFrom(category.parent, navigation);
  return <nav className="breadcrumb" aria-label="İçerik yolu">
    <Link href="/">Ana sayfa</Link>
    <ChevronRight size={13}/>
    {parent && <><Link href={parent.path}>{parent.name}</Link><ChevronRight size={13}/></>}
    {article ? <Link href={category.path}>{category.name}</Link> : <span aria-current="page">{category.name}</span>}
  </nav>;
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#8217;|&#x2019;/gi, "’")
    .replace(/&#8220;|&#x201c;/gi, "“")
    .replace(/&#8221;|&#x201d;/gi, "”");
}

function textFromHtml(value: string) {
  return decodeEntities(value.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function blocksFromHtml(html = ""): LiveBlock[] {
  const blocks: LiveBlock[] = [];
  const matcher = /<(h2|h3|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(html))) {
    const text = textFromHtml(match[2]);
    if (text) blocks.push({ type: match[1].toLowerCase() as LiveBlock["type"], text });
  }

  return blocks;
}

function liveTagCategory(article: Article, key: string) {
  return article.categories?.find((category) => category.key === key) || categoryByKey(key);
}

export function LiveCategoryPage({
  category,
  items,
  pagination,
  navigation,
}: {
  category: Category;
  items: Article[];
  pagination: ApiPagination;
  navigation: Category[];
}) {
  const current = Math.max(1, pagination.page);
  const count = Math.max(1, pagination.totalPages);
  const siblings = navigation.filter((item) => item.parent === category.key || (category.parent && item.parent === category.parent));
  const fallbackPills = navigation.filter((item) => ["yasam", "ajanda", "populer"].includes(item.key));
  const discovery = orderedArticles.filter((article) => !items.some((item) => item.key === article.key)).slice(0, 3);
  const categoryIndex = Math.max(0, navigation.findIndex((item) => item.key === category.key));

  return <Shell><main id="icerik" className="category-main" data-channel={category.key}>
    <section className="category-banner"><div className="site-width">
      <Breadcrumb category={category} navigation={navigation}/>
      <div className="category-title-row"><div><span className="eyebrow">HİPİNUP DOSYALARI / {String((categoryIndex % 9) + 1).padStart(2, "0")}</span><h1>{category.name}<span>!</span></h1></div><div className="category-description"><Squiggle/><p>{category.description}</p></div></div>
      <nav className="category-pills" aria-label={`${category.name} konuları`}>{(siblings.length ? siblings : fallbackPills).map((item) => <Link aria-current={item.key === category.key ? "page" : undefined} key={item.key} href={item.path}>{item.name}<ArrowUpRight size={15}/></Link>)}</nav>
    </div><Wave className="category-wave"/></section>

    <div className="site-width">{items.length > 0 ? <>
      <div className="archive-count"><span><Asterisk size={17}/> {pagination.total} HİKÂYE, BOLCA KEŞİF</span><span>Arşivden · Yayın tarihine göre</span></div>
      {current === 1 && items.length > 1 ? <div className="category-feature-grid"><StoryCard article={items[0]} variant="feature" priority/><div className="category-side"><span className="hand-note">Bunları da kaçırma.</span>{items.slice(1, 3).map((article, index) => <StoryCard article={article} key={article.key} variant="archive-side" index={index + 1} priority/>)}</div></div> : null}
      <div className="archive-grid">{(current === 1 && items.length > 1 ? items.slice(3) : items).map((article, index) => <StoryCard key={article.key} article={article} index={index}/>)}</div>
      {count > 1 && <Pagination aria-label="Arşiv sayfaları" className="archive-pagination"><PaginationContent>
        {current > 1 && <PaginationItem><PaginationLink size="default" href={`${category.path}?page=${current - 1}`}><ChevronLeft size={17}/> Önceki</PaginationLink></PaginationItem>}
        {Array.from({ length: Math.min(count, 9) }, (_, index) => {
          const page = index + 1;
          return <PaginationItem key={page}><PaginationLink isActive={current === page} href={`${category.path}?page=${page}`}>{page}</PaginationLink></PaginationItem>;
        })}
        {current < count && <PaginationItem><PaginationLink size="default" href={`${category.path}?page=${current + 1}`}>Sonraki <ChevronRight size={17}/></PaginationLink></PaginationItem>}
      </PaginationContent></Pagination>}
    </> : <div className="archive-empty"><span className="empty-symbol">up!</span><h2>YENİ HİKÂYELERE<br/>YER AÇIYORUZ.</h2><p>Bu seçkide henüz bir yazı yok. Merakını başka bir yöne çevirebilirsin.</p><Link className="blue-button" href="/konu/yasam/">Yaşamı keşfet <ArrowUpRight size={18}/></Link></div>}

      <AdSlot format="leaderboard" className="archive-ad"/>
      <section className="archive-discovery"><div className="section-heading"><div><h2>DAHA<em>NELER VAR.</em></h2></div></div><div className="three-grid">{discovery.map((article) => <StoryCard article={article} key={article.key}/>)}</div></section>
    </div>
  </main></Shell>;
}

export function LiveArticlePage({ article, related, navigation }: { article: Article; related: Article[]; navigation: Category[] }) {
  const category = articleCategory(article);
  const blocks = blocksFromHtml(article.content);
  const headings = blocks.map((block, index) => ({ block, index })).filter(({ block }) => block.type === "h2" || block.type === "h3");
  const fallbackRelated = orderedArticles.filter((item) => item.key !== article.key).slice(0, 3);
  const more = related.length ? related : fallbackRelated;
  const adAfter = blocks.length >= 8 ? Math.min(9, Math.floor(blocks.length * 0.42)) : -1;
  const image = article.image || article.imageSmall || "/images/freesbee-small.webp";

  return <Shell><main id="icerik" className="article-main" data-channel={category.key}>
    <section className="article-cover"><div className="site-width">
      <Breadcrumb category={category} navigation={navigation} article/>
      <div className="article-cover-grid"><header className="article-heading">
        <Link className="article-category" href={category.path}>{category.name}<ArrowUpRight size={17}/></Link>
        <h1>{article.title}</h1>
        <p className="article-deck">{article.excerpt}</p>
        <div className="article-byline"><div className="author-avatar">h.</div><div><strong>{article.author}</strong><span><time dateTime={article.date}>{dateLabel(article.date)}</time> · {article.minutes} dk okuma</span></div></div>
        <ReaderActions articleKey={article.key}/>
      </header><figure className={`article-cover-photo article-photo-${article.key}`}><Image src={image} alt={article.title} width={1280} height={854} priority sizes="(max-width: 760px) 100vw, 54vw"/><span className="article-photo-stamp" aria-hidden="true">MERAK<br/>ETMEYE<br/>DEVAM.</span><figcaption>HİPİNUP / {category.name.toLocaleUpperCase("tr")}</figcaption></figure></div>
    </div><Wave className="article-cover-wave"/></section>

    <ReadingProgress title={article.title}/>
    <div className="site-width"><div className="article-layout">
      <aside className="article-toc"><div className="sticky-toc"><span className="eyebrow">HİKÂYEYE DAL</span><h2>Bu<br/><em>yazıda.</em></h2><Squiggle/>{headings.length ? headings.slice(0, 7).map(({ block, index }, number) => <a href={`#bolum-${index}`} key={index}><span>{String(number + 1).padStart(2, "0")}</span>{block.text}</a>) : <a href="#yazi"><span>01</span>Hikâyeyi oku</a>}<Link className="back-category" href={category.path}>{category.name} dosyası <ArrowUpRight size={18}/></Link></div></aside>

      <article id="yazi" className="article-body">
        <aside className="story-brief"><span className="brief-tag"><Asterisk size={19}/> HİKÂYENİN ÖZÜ</span><p>{article.excerpt}</p></aside>
        {blocks.length ? blocks.map((block, index) => {
          const headingNumber = headings.findIndex((item) => item.index === index);
          return <div className="article-flow-block" key={`${block.type}-${index}`}>
            {block.type === "h2" || block.type === "h3" ? <h2 id={`bolum-${index}`}><span>{String(headingNumber + 1).padStart(2, "0")}</span>{block.text}</h2> : block.type === "li" ? <p className="article-list-item">{block.text}</p> : block.type === "blockquote" ? <blockquote className="live-blockquote">{block.text}</blockquote> : <p className={index === 0 ? "opening-paragraph" : undefined}>{block.text}</p>}
            {index === Math.min(6, blocks.length - 1) && <aside className="article-pullout"><span className="pullout-mark" aria-hidden="true">“</span><p>{article.excerpt}</p><Squiggle/></aside>}
            {index === adAfter && <AdSlot format="rectangle" className="article-inline-ad"/>}
          </div>;
        }) : <div className="archive-excerpt"><p>{article.excerpt}</p></div>}

        <div className="article-end"><span>HİKÂYE BİTTİ.<br/><em>Merak devam.</em></span><Asterisk aria-hidden="true"/></div>
        <div className="article-tags">{article.tags.map((key) => {
          const tagCategory = liveTagCategory(article, key);
          return tagCategory ? <Link key={key} href={tagCategory.path}>#{tagCategory.name}</Link> : <span key={key}>#{key}</span>;
        })}</div>
        <div className="article-editor"><div className="author-avatar">h.</div><div><strong>{article.author}</strong><p>Hayatın içinden, kültürün peşinden.</p></div></div>
      </article>

      <aside className="article-sidebar"><AdSlot format="halfpage" className="article-rail-ad"/><div className="sidebar-heading">BİR DE<br/><span>BUNA BAK.</span></div>{more.slice(0, 2).map((item) => <StoryCard key={item.key} article={item}/>)}<a href="#bulten" className="sidebar-newsletter"><Mail size={27}/><h3>FEED’DE<br/><em>KAYBOLMA.</em></h3><p>İyi hikâyeleri senin için toparlıyoruz.</p><span>Bülteni keşfet <ArrowUpRight size={18}/></span></a></aside>
    </div>

      <section className="related-section"><div className="related-heading"><span className="eyebrow">DAHA YENİ BAŞLADIK.</span><h2>BİR HİKÂYE<br/><em>DAHA?</em></h2><Link href={category.path} className="round-link" aria-label={`${category.name} dosyasını aç`}><ArrowUpRight size={32}/></Link></div><div className="three-grid">{more.slice(0, 3).map((item, index) => <StoryCard key={item.key} article={item} index={index}/>)}</div></section>
    </div>
  </main></Shell>;
}

export function LiveApiStatusNote() {
  return <div className="live-api-status"><span>CORE</span><strong>Gerçek WordPress verisi</strong><NewsletterForm/></div>;
}
