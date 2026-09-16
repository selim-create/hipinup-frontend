"use client";

import { useEffect, useId, useMemo, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { useHipAdsRuntime } from "./ad-runtime";

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

const defaultSlotKeys: Record<AdFormat, string[]> = {
  leaderboard: ["hipinup_728x90_leaderboard", "hipinup_728x90_inbanner"],
  banner: ["hipinup_728x90_inbanner", "hipinup_728x90_leaderboard"],
  billboard: ["hipinup_970x250_masthead"],
  rectangle: [
    "hipinup_300x250_mediumrectangle",
    "hipinup_300x250_mediumrectangle_2",
    "hipinup_300x250_mediumrectangle_3",
  ],
  halfpage: ["hipinup_com_300x600"],
  skyscraper: ["hipinup_160x600_wideskyscraper_left", "hipinup_160x600_wideskyscraper_right"],
  wideSkyscraper: ["hipinup_160x600_wideskyscraper_left", "hipinup_160x600_wideskyscraper_right"],
  mobileBanner: ["hipinup_320x100_mobilemasthead"],
  mobileMini: ["hipinup_320x50_mobilesticky"],
};

type AdSlotProps = {
  format: AdFormat;
  className?: string;
  slotKey?: string;
  placementKey?: string;
  houseFallback?: boolean;
};

function HouseCreative({ format, className = "" }: Pick<AdSlotProps, "format" | "className">) {
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

export function AdSlot({
  format,
  className = "",
  slotKey,
  placementKey,
  houseFallback = true,
}: AdSlotProps) {
  const runtime = useHipAdsRuntime();
  const reactId = useId();
  const instanceId = useMemo(() => `hip-ad-instance-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`, [reactId]);
  const slot = runtime.resolveSlot(defaultSlotKeys[format], slotKey, placementKey);
  const divId = slot ? `${instanceId}-${slot.key}` : instanceId;

  useEffect(() => {
    if (!slot) return;
    return runtime.registerSlot({ instanceId, divId, slot });
  }, [divId, instanceId, runtime, slot]);

  if (!slot) {
    return houseFallback ? <HouseCreative format={format} className={className}/> : null;
  }

  const minHeight = slot.responsiveMinHeight || { desktop: slot.minHeight, tablet: slot.minHeight, mobile: slot.minHeight };
  const style = {
    "--hip-ad-min-desktop": `${Math.max(0, minHeight.desktop || 0)}px`,
    "--hip-ad-min-tablet": `${Math.max(0, minHeight.tablet || 0)}px`,
    "--hip-ad-min-mobile": `${Math.max(0, minHeight.mobile || 0)}px`,
  } as CSSProperties;

  return (
    <aside
      className={`ad-slot ad-${format} hip-gpt-slot ${className}`}
      data-ad-format={format}
      data-ad-slot-key={slot.key}
      data-ad-placement={slot.placementKey}
      style={style}
      aria-label="Reklam"
    >
      <div className="hip-gpt-label">REKLAM</div>
      <div id={divId} className="hip-gpt-container"/>
    </aside>
  );
}
