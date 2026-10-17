import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Wave } from "@/components/wave";
import Link from "@/components/site-link";
import { getArticles } from "@/lib/hipinup-api";
import { bioHref, getBio, type BioItem } from "@/lib/hipinup-bio";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

/**
 * hipinup.com/bio: the page behind the link in Hipinup's Instagram profile. The latest posts shared
 * on Instagram (each with its first slide, opening the article), then Hipinup's other accounts.
 * The list comes from hip.space through api.hipinup.com; without it the latest articles show.
 */

export const revalidate = 60;

const description = "Instagram’da paylaştıklarımızın yazıları ve Hipinup’ın bütün hesapları.";

export const metadata: Metadata = {
  title: "Bio",
  description,
  alternates: { canonical: absoluteUrl("/bio/") },
  // A page of links: kept out of search, its links still followed.
  robots: { index: false, follow: true },
  openGraph: { type: "website", locale: "tr_TR", url: absoluteUrl("/bio/"), siteName: SITE_NAME, title: `Bio | ${SITE_NAME}`, description },
};

function Tile({ item, index, caption }: { item: BioItem; index: number; caption: boolean }) {
  const external = /^https?:\/\//.test(item.href);
  // The cover carries the headline; the latest articles' photos do not, so it is written on them.
  const body = item.image ? (
    <>
      <Image
        src={item.image}
        alt={caption ? "" : item.title}
        width={item.width ?? 720}
        height={item.height ?? 900}
        sizes="(max-width: 600px) 50vw, 280px"
        unoptimized
        priority={index < 4}
      />
      {caption ? <span className="bio-tile-caption">{item.title}</span> : null}
    </>
  ) : (
    <span className="bio-tile-text">{item.title}</span>
  );
  return (
    <li>
      {external ? (
        <a className="bio-tile" href={item.href}>{body}</a>
      ) : (
        <Link className="bio-tile" href={item.href}>{body}</Link>
      )}
    </li>
  );
}

/** Without hip.space's list: the latest articles, so the page is never empty. */
async function latestArticles(): Promise<BioItem[]> {
  const latest = await getArticles({ perPage: 6 });
  return (latest?.items ?? []).flatMap((article) => {
    const href = bioHref(absoluteUrl(article.path));
    return href ? [{ id: article.key, title: article.title, href, image: article.imageSmall || article.image || null, width: null, height: null, sharedAt: article.date }] : [];
  });
}

export default async function BioPage() {
  const bio = await getBio();
  const shared = bio?.items ?? [];
  const items = shared.length ? shared : await latestArticles();
  const socials = bio?.socials ?? [];

  return (
    <main className="bio-page">
      <header className="bio-head">
        <Link href="/?utm_source=instagram&utm_medium=bio" className="bio-brand" aria-label="Hipinup ana sayfa">
          <Image src="/brand/hipinup.svg" alt="Hipinup" width={2048} height={595} priority />
        </Link>
        <p className="bio-tagline">Hayatın içinden, kültürün peşinden.</p>
        <Link href="/?utm_source=instagram&utm_medium=bio" className="bio-home">
          hipinup.com’a git <ArrowRight size={20} aria-hidden="true" />
        </Link>
        <Wave className="bio-wave" />
      </header>

      <section className="bio-section" aria-labelledby="bio-shared">
        <h1 id="bio-shared" className="bio-title">
          {shared.length ? <>Instagram’da <span>paylaştıklarımız</span></> : <>Son <span>yazılar</span></>}
        </h1>
        <p className="bio-hint">{shared.length ? "Gördüğün gönderiye dokun, yazının tamamı açılsın." : "Hipinup’ta bugün okunanlar."}</p>
        {items.length ? (
          <ul className={`bio-grid${shared.length ? "" : " bio-grid-latest"}`}>
            {items.map((item, index) => <Tile key={item.id} item={item} index={index} caption={!shared.length} />)}
          </ul>
        ) : (
          <p className="bio-empty">Şu an liste açılamadı. <Link href="/">Ana sayfaya</Link> göz at.</p>
        )}
      </section>

      {socials.length ? (
        <section className="bio-section bio-accounts" aria-labelledby="bio-follow">
          <h2 id="bio-follow" className="bio-title">Bizi <span>takip et</span></h2>
          <ul className="bio-socials">
            {socials.map((social) => (
              <li key={social.url}>
                <a href={social.url} target="_blank" rel="noopener noreferrer me">
                  <strong>{social.label}</strong>
                  {social.handle ? <span>@{social.handle}</span> : null}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="bio-foot">
        <a href="https://hipmedya.com/" target="_blank" rel="noreferrer">Bir <strong>hip.</strong> medya yayını</a>
      </footer>
    </main>
  );
}
