"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  HipAdSize,
  HipAdSlotConfig,
  HipAdsConfig,
  HipAdTargeting,
} from "@/lib/hip-ads-types";

const GPT_SRC = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";

export type GptSlotHandle = {
  addService: (service: GptPubAdsService) => GptSlotHandle;
  defineSizeMapping: (mapping: unknown) => GptSlotHandle;
  setConfig: (config: {
    targeting?: HipAdTargeting | null;
    collapseDiv?: "ON_NO_FILL" | "BEFORE_FETCH" | "DISABLED" | null;
  }) => GptSlotHandle;
};

type GptSlotRenderEndedEvent = {
  slot: GptSlotHandle;
  isEmpty: boolean;
};

export type GptPubAdsService = {
  refresh: (slots?: GptSlotHandle[]) => void;
  addEventListener: (
    type: "slotRenderEnded",
    listener: (event: GptSlotRenderEndedEvent) => void,
  ) => void;
  removeEventListener?: (
    type: "slotRenderEnded",
    listener: (event: GptSlotRenderEndedEvent) => void,
  ) => void;
};

type GptSizeMappingBuilder = {
  addSize: (viewport: HipAdSize, sizes: HipAdSize[] | HipAdSize) => GptSizeMappingBuilder;
  build: () => unknown | null;
};

export type GptApi = {
  cmd: { push: (callback: () => void) => number };
  setConfig: (config: {
    singleRequest?: boolean;
    lazyLoad?: null | {
      fetchMarginPercent: number;
      renderMarginPercent: number;
      mobileScaling: number;
    };
    collapseDiv?: "ON_NO_FILL" | "BEFORE_FETCH" | "DISABLED" | null;
    targeting?: HipAdTargeting | null;
  }) => void;
  enableServices: () => void;
  defineSlot: (adUnitPath: string, sizes: HipAdSize[] | HipAdSize, divId: string) => GptSlotHandle | null;
  display: (divId: string) => void;
  destroySlots: (slots?: GptSlotHandle[]) => boolean;
  pubads: () => GptPubAdsService;
  sizeMapping: () => GptSizeMappingBuilder;
};

declare global {
  interface Window {
    googletag?: GptApi;
  }
}

type RuntimeContext = {
  config: HipAdsConfig;
  enabled: boolean;
  ready: boolean;
  resolveSlot: (candidateKeys: string[], slotKey?: string, placementKey?: string) => HipAdSlotConfig | null;
};

const AdRuntimeContext = createContext<RuntimeContext | null>(null);

function normalizeTargeting(value: HipAdTargeting | []) {
  return Array.isArray(value) ? {} : value;
}

export function getGoogletag() {
  if (typeof window === "undefined") return null;

  if (!window.googletag) {
    window.googletag = { cmd: [] } as unknown as GptApi;
  }

  return window.googletag;
}

export function HipAdsProvider({
  children,
  config,
  runtimeEnabled,
}: {
  children: ReactNode;
  config: HipAdsConfig;
  runtimeEnabled: boolean;
}) {
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);
  const enabled = Boolean(
    runtimeEnabled && config.adsEnabled && config.networkCode && config.slots.length,
  );

  const boot = useCallback(() => {
    if (!enabled || initialized.current) return;

    const googletag = getGoogletag();
    if (!googletag) return;

    initialized.current = true;
    googletag.cmd.push(() => {
      googletag.setConfig({
        singleRequest: config.gpt.singleRequest,
        collapseDiv: config.gpt.collapseEmpty ? "ON_NO_FILL" : "DISABLED",
        lazyLoad: config.gpt.lazyLoad,
        targeting: normalizeTargeting(config.globalTargeting),
      });
      googletag.enableServices();
      setReady(true);
    });
  }, [config, enabled]);

  const resolveSlot = useCallback(
    (candidateKeys: string[], slotKey?: string, placementKey?: string) => {
      if (!enabled) return null;

      if (slotKey) {
        const exact = config.slots.find((slot) => slot.key === slotKey || slot.slotId === slotKey);
        if (exact) return exact;
      }

      if (placementKey) {
        const placement = config.slots.find(
          (slot) => slot.placementKey === placementKey || slot.placement === placementKey,
        );
        if (placement) return placement;
      }

      for (const key of candidateKeys) {
        const match = config.slots.find((slot) => slot.key === key || slot.slotId === key);
        if (match) return match;
      }

      return null;
    },
    [config.slots, enabled],
  );

  const value = useMemo<RuntimeContext>(
    () => ({ config, enabled, ready, resolveSlot }),
    [config, enabled, ready, resolveSlot],
  );

  return (
    <AdRuntimeContext.Provider value={value}>
      {enabled && (
        <Script
          id="hipinup-gpt"
          src={GPT_SRC}
          strategy="afterInteractive"
          onLoad={boot}
          onReady={boot}
        />
      )}
      {children}
    </AdRuntimeContext.Provider>
  );
}

export function useHipAdsRuntime() {
  const context = useContext(AdRuntimeContext);
  if (!context) {
    throw new Error("useHipAdsRuntime must be used inside HipAdsProvider");
  }
  return context;
}

export function requestHipAdRefresh(
  slotKey: string,
  trigger: "event" | "user_action" = "user_action",
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("hipads:refresh", {
      detail: { slotKey, trigger },
    }),
  );
}
