import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Wave } from "@/components/wave";
import Link from "@/components/site-link";
import { getBio, type BioItem } from "@/lib/hipinup-bio";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

/**
 * hipinup.com/bio: the page behind the link in Hipinup's Instagram profile. The latest posts shared
 * on Instagram (each with its first slide, opening the article), then Hipinup's other accounts.
 * The list comes from hip.space through api.hipinup.com: only posts approved there are shown.
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

function Tile({ item, index }: { item: BioItem; index: number }) {
  const external = /^https?:\/\//.test(item.href);
  // The cover is the post's first slide: it carries the headline, so nothing is written on it.
  const body = item.image ? (
    <Image
      src={item.image}
      alt={item.title}
      width={item.width ?? 720}
      height={item.height ?? 900}
      sizes="(max-width: 600px) 50vw, 280px"
      unoptimized
      priority={index < 4}
    />
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

export default async function BioPage() {
  const bio = await getBio();
  const items = bio?.items ?? [];
  const socials = bio?.socials ?? [];

  return (
    <main className="bio-page">
      <header className="bio-head">
        <Link href="/?utm_source=instagram&utm_medium=bio" className="bio-brand" aria-label="Hipinup ana sayfa">
          <Image src="/brand/hipinup.svg" alt="Hipinup" width={2048} height={595} className="brand-image" priority />
        </Link>
        <p className="bio-tagline">Hayatın içinden, kültürün peşinden.</p>
        <Link href="/?utm_source=instagram&utm_medium=bio" className="bio-home">
          hipinup.com’a git <ArrowRight size={20} aria-hidden="true" />
        </Link>
        <Wave className="bio-wave" />
      </header>

      <section className="bio-section" aria-labelledby="bio-shared">
        <h1 id="bio-shared" className="bio-title">Instagram’da <span>paylaştıklarımız</span></h1>
        {items.length ? (
          <>
            <p className="bio-hint">Gördüğün gönderiye dokun, yazının tamamı açılsın.</p>
            <ul className="bio-grid">
              {items.map((item, index) => <Tile key={item.id} item={item} index={index} />)}
            </ul>
          </>
        ) : (
          <p className="bio-empty">İlk paylaşımlar birazdan burada. O zamana kadar <Link href="/?utm_source=instagram&utm_medium=bio">hipinup.com</Link>’a göz at.</p>
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
