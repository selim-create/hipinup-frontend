"use client";

import { useEffect, useId, useMemo, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { HipAdSize, HipAdSlotConfig } from "@/lib/hip-ads-types";
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

export type AdPlacement =
  | "topMasthead"
  | "contentLeaderboard"
  | "inBanner"
  | "homeBillboard"
  | "desktopRailLeft"
  | "desktopRailRight"
  | "homePopRectangle"
  | "homeLifeRectangle"
  | "articleInlineRectangle"
  | "halfpageRail"
  | "mobileMasthead"
  | "mobileSticky";

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
  skyscraper: ["hipinup_160x600_wideskyscraper_right"],
  wideSkyscraper: ["hipinup_160x600_wideskyscraper_left"],
  mobileBanner: ["hipinup_320x100_mobilemasthead"],
  mobileMini: ["hipinup_320x50_mobilesticky"],
};

type PlacementProfile = {
  slotKey: string;
  sizes: HipAdSize[];
};

const placementProfiles: Record<AdPlacement, PlacementProfile> = {
  topMasthead: {
    slotKey: "hipinup_970x250_masthead",
    sizes: [[1000, 90], [970, 90]],
  },
  contentLeaderboard: {
    slotKey: "hipinup_728x90_leaderboard",
    sizes: [[728, 90]],
  },
  inBanner: {
    slotKey: "hipinup_728x90_inbanner",
    sizes: [[728, 90]],
  },
  homeBillboard: {
    slotKey: "hipinup_970x250_masthead",
    sizes: [[970, 250]],
  },
  desktopRailLeft: {
    slotKey: "hipinup_160x600_wideskyscraper_left",
    sizes: [[160, 600], [120, 600]],
  },
  desktopRailRight: {
    slotKey: "hipinup_160x600_wideskyscraper_right",
    sizes: [[160, 600], [120, 600]],
  },
  homePopRectangle: {
    slotKey: "hipinup_300x250_mediumrectangle",
    sizes: [[300, 250]],
  },
  homeLifeRectangle: {
    slotKey: "hipinup_300x250_mediumrectangle_2",
    sizes: [[300, 250]],
  },
  articleInlineRectangle: {
    slotKey: "hipinup_300x250_mediumrectangle_3",
    sizes: [[300, 250]],
  },
  halfpageRail: {
    slotKey: "hipinup_com_300x600",
    sizes: [[300, 600]],
  },
  mobileMasthead: {
    slotKey: "hipinup_320x100_mobilemasthead",
    sizes: [[320, 100]],
  },
  mobileSticky: {
    slotKey: "hipinup_320x50_mobilesticky",
    sizes: [[320, 50]],
  },
};

type AdSlotProps = {
  format: AdFormat;
  className?: string;
  placement?: AdPlacement;
  slotKey?: string;
  placementKey?: string;
  houseFallback?: boolean;
};

function sameSize(left: HipAdSize, right: HipAdSize) {
  return left[0] === right[0] && left[1] === right[1];
}

function restrictSlotSizes(slot: HipAdSlotConfig, allowedSizes: HipAdSize[]) {
  const sizes = slot.sizes.filter((size) => allowedSizes.some((allowed) => sameSize(size, allowed)));
  if (!sizes.length) return null;

  const sizeMappings = slot.sizeMappings
    .map((mapping) => ({
      ...mapping,
      sizes: mapping.sizes.filter((size) => sizes.some((allowed) => sameSize(size, allowed))),
    }))
    .filter((mapping) => mapping.sizes.length > 0);

  const minHeight = Math.max(...sizes.map((size) => size[1]));
  return {
    ...slot,
    sizes,
    sizeMappings,
    minHeight,
    responsiveMinHeight: {
      desktop: minHeight,
      tablet: minHeight,
      mobile: minHeight,
    },
  } satisfies HipAdSlotConfig;
}

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
  placement,
  slotKey,
  placementKey,
  houseFallback = true,
}: AdSlotProps) {
  const { resolveSlot, registerSlot } = useHipAdsRuntime();
  const reactId = useId();
  const instanceId = useMemo(() => `hip-ad-instance-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`, [reactId]);
  const profile = placement ? placementProfiles[placement] : null;
  const resolvedSlot = resolveSlot(defaultSlotKeys[format], slotKey || profile?.slotKey, placementKey);
  const slot = useMemo(
    () => resolvedSlot && profile ? restrictSlotSizes(resolvedSlot, profile.sizes) : resolvedSlot,
    [profile, resolvedSlot],
  );
  const divId = slot ? `${instanceId}-${slot.key}` : instanceId;

  useEffect(() => {
    if (!slot) return;
    return registerSlot({ instanceId, divId, slot });
  }, [divId, instanceId, registerSlot, slot]);

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
      data-ad-layout-placement={placement || undefined}
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
