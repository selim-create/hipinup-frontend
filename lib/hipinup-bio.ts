/**
 * The bio page's data (hipinup.com/bio): what Hipinup shared on Instagram and its social accounts.
 * hip.space sends the list to Hip Space Bridge on api.hipinup.com; this reads it from there.
 */

const DEFAULT_BIO_URL = "https://api.hipinup.com/wp-json/hip-press/v1/bio";
const BIO_URL = (process.env.HIPINUP_BIO_URL || DEFAULT_BIO_URL).trim();
const REVALIDATE_SECONDS = 60;

export type BioItem = {
  id: string;
  title: string;
  /** Where the tile goes: a path on hipinup.com (with the bio's UTM tags) or a full address. */
  href: string;
  image: string | null;
  width: number | null;
  height: number | null;
  sharedAt: string;
};

export type BioSocial = { platform: string; label: string; handle: string; url: string };

export type BioData = { items: BioItem[]; socials: BioSocial[] };

const SITE_HOSTS = new Set(["hipinup.com", "www.hipinup.com"]);

/** The article's address for a tap on the bio page: on hipinup.com, as a path with utm_source=instagram&utm_medium=bio. */
export function bioHref(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    parsed.searchParams.set("utm_source", "instagram");
    parsed.searchParams.set("utm_medium", "bio");
    return SITE_HOSTS.has(parsed.hostname) ? `${parsed.pathname}${parsed.search}` : parsed.toString();
  } catch {
    return null;
  }
}

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const size = (value: unknown) => (typeof value === "number" && value > 0 ? value : null);

export async function getBio(): Promise<BioData | null> {
  try {
    const response = await fetch(BIO_URL, { headers: { Accept: "application/json" }, next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) return null;
    const raw = (await response.json()) as { items?: unknown; socials?: unknown };
    const items: BioItem[] = [];
    for (const entry of Array.isArray(raw.items) ? raw.items : []) {
      const item = (entry ?? {}) as Record<string, unknown>;
      const href = bioHref(text(item.url));
      const title = text(item.title);
      if (!href || !title) continue;
      const image = text(item.image);
      items.push({
        id: text(item.id) || href,
        title,
        href,
        image: image.startsWith("https://") ? image : null,
        width: size(item.width),
        height: size(item.height),
        sharedAt: text(item.sharedAt),
      });
    }
    const socials: BioSocial[] = [];
    for (const entry of Array.isArray(raw.socials) ? raw.socials : []) {
      const social = (entry ?? {}) as Record<string, unknown>;
      const url = text(social.url);
      if (!url.startsWith("https://")) continue;
      socials.push({ platform: text(social.platform), label: text(social.label) || text(social.platform), handle: text(social.handle).replace(/^@/, ""), url });
    }
    return { items, socials };
  } catch {
    return null;
  }
}
