export type HipAdSize = [number, number];

export type HipAdTargeting = Record<string, string | string[]>;

export type HipAdSizeMapping = {
  viewport: HipAdSize;
  sizes: HipAdSize[];
};

export type HipAdRefresh = {
  enabled: boolean;
  trigger: "time" | "event" | "user_action";
  interval: number;
  max_refreshes: number;
  require_visible: boolean;
  pause_when_hidden: boolean;
};

export type HipAdSlotConfig = {
  id: number;
  key: string;
  name: string;
  slotId: string;
  legacySlotId?: string;
  inventoryId?: string;
  adUnitPath: string;
  placement: string;
  placementKey: string;
  placementGroup: "header" | "content" | "sidebar" | "footer" | "overlay" | "other";
  device: "all" | "desktop" | "tablet" | "mobile";
  priority: number;
  sizes: HipAdSize[];
  sizeMappings: HipAdSizeMapping[];
  targeting: HipAdTargeting | [];
  pageTypes: string[];
  categories: string[];
  lazyLoad: boolean;
  collapseEmpty: boolean;
  minHeight: number;
  responsiveMinHeight: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  schedule: {
    start: string;
    end: string;
  };
  refresh: HipAdRefresh;
};

export type HipAdsConfig = {
  schemaVersion: number;
  adsEnabled: boolean;
  networkCode: string;
  propertyCode: string;
  siteName?: string;
  gpt: {
    singleRequest: boolean;
    collapseEmpty: boolean;
    lazyLoad: null | {
      fetchMarginPercent: number;
      renderMarginPercent: number;
      mobileScaling: number;
    };
  };
  globalTargeting: HipAdTargeting | [];
  cacheTtl: number;
  debug: boolean;
  slots: HipAdSlotConfig[];
  generatedAt?: string;
  cacheVersion?: number;
};
