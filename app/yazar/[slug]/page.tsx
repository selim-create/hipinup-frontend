import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { Shell, StoryCard } from "@/components/magazine";
import Link from "@/components/site-link";
import { getAuthor, getAuthorArticles } from "@/lib/hipinup-api";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

function pageNumber(value?: string) {
  const parsed = Number(value || 1);
  return Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);

  if (!author) {
    return {
      title: "Yazar bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  const canonical = absoluteUrl(author.path);
  const description = author.bio || author.tagline || `${author.name} yazıları ve Hipinup seçkileri.`;
  const image = author.avatar ? absoluteUrl(author.avatar) : DEFAULT_OG_IMAGE;

  return {
    title: author.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      locale: "tr_TR",
      url: canonical,
      siteName: SITE_NAME,
      title: author.name,
      description,
      images: [{ url: image, alt: author.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: author.name,
      description,
      images: [image],
    },
  };
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const page = pageNumber((await searchParams).page);
  const [author, collection] = await Promise.all([
    getAuthor(slug),
    getAuthorArticles(slug, page, 9),
  ]);

  if (!author) notFound();

  const items = collection?.items || [];
  const pagination = collection?.pagination || { page: 1, perPage: 9, total: 0, totalPages: 1 };
  if (page > Math.max(1, pagination.totalPages)) notFound();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteUrl(author.path)}#person`,
    name: author.name,
    url: absoluteUrl(author.path),
    ...(author.avatar ? { image: absoluteUrl(author.avatar) } : {}),
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    worksFor: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
  };

  return <Shell>
    <main id="icerik" className="author-page">
      <section className="author-hero">
        <div className="site-width author-hero-grid">
          <div className="author-portrait">
            {author.avatar
              ? <Image src={author.avatar} alt={author.name} width={560} height={560} priority sizes="(max-width: 700px) 58vw, 310px"/>
              : <div className="author-portrait-fallback">h.</div>}
            <span className="author-portrait-stamp" aria-hidden="true">YAZAR<br/>PROFİLİ</span>
          </div>
          <div className="author-intro">
            <span className="eyebrow"><Asterisk size={16}/> HİPİNUP YAZARLARI</span>
            <h1>{author.name}</h1>
            {author.role && <strong>{author.role}</strong>}
            {author.tagline && <p className="author-tagline">{author.tagline}</p>}
            {author.bio && <p className="author-bio">{author.bio}</p>}
            <a className="author-mail-link" href="#yazilar">Yazılarını oku <ArrowUpRight size={18}/></a>
          </div>
        </div>
      </section>

      <section className="site-width author-stories" id="yazilar">
        <header className="author-stories-head">
          <div>
            <span className="eyebrow">ARŞİV</span>
            <h2>{author.name.split(" ")[0]}’dan<br/><em>hikâyeler.</em></h2>
          </div>
          <span>{pagination.total} yazı</span>
        </header>

        {items.length ? <div className="three-grid">{items.map((article, index) => <StoryCard article={article} key={article.key} index={index}/>)}</div> : <div className="archive-empty"><span className="empty-symbol">up!</span><h2>İLK YAZILAR<br/>YOLDA.</h2><p>{author.name} imzalı yayınlanmış bir içerik henüz bulunmuyor.</p></div>}

        {pagination.totalPages > 1 && <nav className="author-pagination" aria-label="Yazar arşivi sayfaları">
          {page > 1 && <Link href={`${author.path}?page=${page - 1}`}>← Önceki</Link>}
          <span>{page} / {pagination.totalPages}</span>
          {page < pagination.totalPages && <Link href={`${author.path}?page=${page + 1}`}>Sonraki →</Link>}
        </nav>}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}/>
    </main>
  </Shell>;
}
