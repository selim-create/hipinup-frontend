import { ArrowUpRight } from "lucide-react";
import { resolveSocialEmbed } from "@/lib/social-embeds";

type SocialEmbedProps = {
  url: string;
  provider?: string;
};

const iframeAllow = [
  "accelerometer",
  "autoplay",
  "clipboard-write",
  "encrypted-media",
  "fullscreen",
  "gyroscope",
  "picture-in-picture",
  "web-share",
].join("; ");

export function SocialEmbed({ url, provider = "" }: SocialEmbedProps) {
  const embed = resolveSocialEmbed(url, provider);
  if (!embed) return null;

  if (!embed.embedUrl) {
    return (
      <aside className="social-embed social-embed--fallback">
        <div className="social-embed__meta">
          <span>{embed.label}</span>
          <small>Harici içerik</small>
        </div>
        <a href={embed.originalUrl} target="_blank" rel="noreferrer">
          İçeriği aç
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </aside>
    );
  }

  return (
    <figure className={`social-embed social-embed--${embed.provider} social-embed--${embed.layout}`}>
      <figcaption className="social-embed__meta">
        <span>{embed.label}</span>
        <a href={embed.originalUrl} target="_blank" rel="noreferrer" aria-label={`${embed.label} içeriğini kaynağında aç`}>
          Kaynak
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </figcaption>
      <div className="social-embed__viewport">
        <iframe
          src={embed.embedUrl}
          title={`${embed.label} gömülü içeriği`}
          loading="lazy"
          allow={iframeAllow}
          allowFullScreen={embed.allowFullScreen}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </figure>
  );
}
