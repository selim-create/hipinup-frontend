import { ArrowUpRight } from "lucide-react";

type AdFormat =
  | "leaderboard"
  | "banner"
  | "billboard"
  | "rectangle"
  | "halfpage"
  | "skyscraper"
  | "wideSkyscraper"
  | "mobileBanner"
  | "mobileMini";

const formats: Record<AdFormat, { desktop: string; mobile: string }> = {
  leaderboard: { desktop: "970 × 90", mobile: "320 × 100" },
  banner: { desktop: "728 × 90", mobile: "320 × 100" },
  billboard: { desktop: "970 × 250", mobile: "300 × 250" },
  rectangle: { desktop: "300 × 250", mobile: "300 × 250" },
  halfpage: { desktop: "300 × 600", mobile: "300 × 600" },
  skyscraper: { desktop: "120 × 600", mobile: "120 × 600" },
  wideSkyscraper: { desktop: "160 × 600", mobile: "160 × 600" },
  mobileBanner: { desktop: "320 × 100", mobile: "320 × 100" },
  mobileMini: { desktop: "320 × 50", mobile: "320 × 50" },
};

/** Reserved layout dimensions, with a house campaign in place of an ad-network tag. */
export function AdSlot({ format, className = "" }: { format: AdFormat; className?: string }) {
  const size = formats[format];
  const compact = ["leaderboard", "banner", "mobileBanner", "mobileMini"].includes(format);
  const narrow = format === "skyscraper" || format === "wideSkyscraper";
  const mini = format === "mobileMini";

  return (
    <aside className={`ad-slot ad-${format} ${className}`} data-ad-format={format} aria-label={`${size.desktop} örnek reklam alanı`}>
      <div className="ad-caption">
        <span>REKLAM <i>/</i> ÖRNEK KAMPANYA</span>
        <span className="ad-size-desktop">{size.desktop}</span>
        <span className="ad-size-mobile">{size.mobile}</span>
      </div>
      <a className="ad-creative" href="https://hipmedya.com/" target="_blank" rel="noreferrer" aria-label="Hip Creative tanıtımı: Hip Medya web sitesini aç">
        <div className="ad-agency"><strong>hip<span>.</span></strong><span>creative</span></div>
        <div className="ad-message">
          {!compact && !narrow && <span className="ad-kicker">FİKRİ OLANLARA.</span>}
          <p>
            {mini ? <><em>BÜYÜK ETKİ.</em></> : narrow ? <>İYİ<br/><em>FİKİR.</em></> : compact ? <>İyi fikir. <em>Büyük etki.</em></> : <>İYİ FİKİR.<br/><em>BÜYÜK<br className="ad-tall-break"/> ETKİ.</em></>}
          </p>
          {!compact && !narrow && <span className="ad-services">Strateji. Tasarım. Performans.</span>}
        </div>
        <span className="ad-action">{narrow || mini ? <ArrowUpRight size={18}/> : <>Birlikte üretelim <ArrowUpRight size={18}/></>}</span>
        <span className="ad-orbit" aria-hidden="true"/>
      </a>
    </aside>
  );
}
