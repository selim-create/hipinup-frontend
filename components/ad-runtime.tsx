"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

export type GptPubAdsService = {
  refresh: (slots?: GptSlotHandle[]) => void;
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

type RegisteredSlot = {
  instanceId: string;
  divId: string;
  slot: HipAdSlotConfig;
};

type RuntimeContext = {
  config: HipAdsConfig;
  enabled: boolean;
  resolveSlot: (candidateKeys: string[], slotKey?: string, placementKey?: string) => HipAdSlotConfig | null;
  registerSlot: (registration: RegisteredSlot) => () => void;
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

function defineRuntimeSlot(googletag: GptApi, registration: RegisteredSlot) {
  const { slot, divId } = registration;
  const gptSlot = googletag.defineSlot(slot.adUnitPath, slot.sizes, divId);
  if (!gptSlot) return null;

  if (slot.sizeMappings?.length) {
    const builder = googletag.sizeMapping();
    for (const item of slot.sizeMappings) {
      builder.addSize(item.viewport, item.sizes);
    }
    const mapping = builder.build();
    if (mapping) gptSlot.defineSizeMapping(mapping);
  }

  gptSlot.setConfig({
    targeting: normalizeTargeting(slot.targeting),
    collapseDiv: slot.collapseEmpty ? "ON_NO_FILL" : "DISABLED",
  });
  gptSlot.addService(googletag.pubads());
  return gptSlot;
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
  const registrations = useRef(new Map<string, RegisteredSlot>());
  const definedSlots = useRef(new Map<string, GptSlotHandle>());
  const servicesEnabled = useRef(false);
  const booted = useRef(false);
  const enabled = Boolean(
    runtimeEnabled && config.adsEnabled && config.networkCode && config.slots.length,
  );

  const destroyInstance = useCallback((instanceId: string) => {
    const defined = definedSlots.current.get(instanceId);
    if (!defined) return;

    const googletag = getGoogletag();
    if (googletag) {
      googletag.cmd.push(() => {
        googletag.destroySlots([defined]);
      });
    }
    definedSlots.current.delete(instanceId);
  }, []);

  const registerSlot = useCallback(
    (registration: RegisteredSlot) => {
      registrations.current.set(registration.instanceId, registration);

      if (servicesEnabled.current) {
        const googletag = getGoogletag();
        if (googletag) {
          googletag.cmd.push(() => {
            const previous = definedSlots.current.get(registration.instanceId);
            if (previous) {
              googletag.destroySlots([previous]);
              definedSlots.current.delete(registration.instanceId);
            }

            const defined = defineRuntimeSlot(googletag, registration);
            if (!defined) return;
            definedSlots.current.set(registration.instanceId, defined);
            googletag.display(registration.divId);
          });
        }
      }

      return () => {
        registrations.current.delete(registration.instanceId);
        destroyInstance(registration.instanceId);
      };
    },
    [destroyInstance],
  );

  const boot = useCallback(() => {
    if (!enabled || booted.current) return;

    const googletag = getGoogletag();
    if (!googletag) return;

    booted.current = true;
    googletag.cmd.push(() => {
      googletag.setConfig({
        singleRequest: config.gpt.singleRequest,
        collapseDiv: config.gpt.collapseEmpty ? "ON_NO_FILL" : "DISABLED",
        lazyLoad: config.gpt.lazyLoad,
        targeting: normalizeTargeting(config.globalTargeting),
      });

      for (const registration of registrations.current.values()) {
        const defined = defineRuntimeSlot(googletag, registration);
        if (defined) definedSlots.current.set(registration.instanceId, defined);
      }

      googletag.enableServices();
      servicesEnabled.current = true;

      for (const registration of registrations.current.values()) {
        if (definedSlots.current.has(registration.instanceId)) {
          googletag.display(registration.divId);
        }
      }
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

  useEffect(() => {
    if (enabled) return;
    const instanceIds = Array.from(definedSlots.current.keys());
    for (const instanceId of instanceIds) destroyInstance(instanceId);
    servicesEnabled.current = false;
    booted.current = false;
  }, [destroyInstance, enabled]);

  const value = useMemo<RuntimeContext>(
    () => ({ config, enabled, resolveSlot, registerSlot }),
    [config, enabled, registerSlot, resolveSlot],
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
