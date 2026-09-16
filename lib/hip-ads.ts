import type { HipAdsConfig } from "./hip-ads-types";

const DEFAULT_HIP_ADS_API_URL = "https://api.hipinup.com/wp-json/hip-ads/v1";
const HIP_ADS_API_URL = (process.env.HIP_ADS_API_URL || DEFAULT_HIP_ADS_API_URL).replace(/\/+$/, "");
const REVALIDATE_SECONDS = 60;

const disabledConfig: HipAdsConfig = {
  schemaVersion: 2,
  adsEnabled: false,
  networkCode: "",
  propertyCode: "hipinup",
  gpt: {
    singleRequest: true,
    collapseEmpty: true,
    lazyLoad: {
      fetchMarginPercent: 500,
      renderMarginPercent: 200,
      mobileScaling: 2,
    },
  },
  globalTargeting: {},
  cacheTtl: 300,
  debug: false,
  slots: [],
};

function asNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeConfig(input: unknown): HipAdsConfig {
  if (!input || typeof input !== "object") return disabledConfig;

  const value = input as Partial<HipAdsConfig>;
  if (value.schemaVersion !== 2) return disabledConfig;

  const gpt = value.gpt && typeof value.gpt === "object" ? value.gpt : disabledConfig.gpt;
  const lazyLoad = gpt.lazyLoad && typeof gpt.lazyLoad === "object"
    ? {
        fetchMarginPercent: asNumber(gpt.lazyLoad.fetchMarginPercent, 500),
        renderMarginPercent: asNumber(gpt.lazyLoad.renderMarginPercent, 200),
        mobileScaling: asNumber(gpt.lazyLoad.mobileScaling, 2),
      }
    : null;

  return {
    schemaVersion: 2,
    adsEnabled: Boolean(value.adsEnabled),
    networkCode: typeof value.networkCode === "string" ? value.networkCode : "",
    propertyCode: typeof value.propertyCode === "string" && value.propertyCode ? value.propertyCode : "hipinup",
    siteName: typeof value.siteName === "string" ? value.siteName : undefined,
    gpt: {
      singleRequest: Boolean(gpt.singleRequest),
      collapseEmpty: gpt.collapseEmpty !== false,
      lazyLoad,
    },
    globalTargeting:
      value.globalTargeting && !Array.isArray(value.globalTargeting) && typeof value.globalTargeting === "object"
        ? value.globalTargeting
        : {},
    cacheTtl: asNumber(value.cacheTtl, 300),
    debug: Boolean(value.debug),
    slots: Array.isArray(value.slots) ? value.slots : [],
    generatedAt: typeof value.generatedAt === "string" ? value.generatedAt : undefined,
    cacheVersion: typeof value.cacheVersion === "number" ? value.cacheVersion : undefined,
  };
}

export async function getHipAdsConfig(): Promise<HipAdsConfig> {
  try {
    const response = await fetch(`${HIP_ADS_API_URL}/config`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) return disabledConfig;
    return normalizeConfig(await response.json());
  } catch {
    return disabledConfig;
  }
}

export function isHipAdsRuntimeEnabled() {
  if (process.env.HIP_ADS_FORCE_RUNTIME === "1") return true;
  return process.env.VERCEL_ENV === "production";
}
