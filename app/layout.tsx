import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { StructuredData } from "@/components/structured-data";
import { HipAdsProvider } from "@/components/ad-runtime";
import { getHipAdsConfig, isHipAdsRuntimeEnabled } from "@/lib/hip-ads";
import {
  DEFAULT_OG_IMAGE,
  GA_MEASUREMENT_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  isAnalyticsEnabled,
  isIndexableEnvironment,
  siteJsonLd,
} from "@/lib/seo";
import "./globals.css";
import "./hipinup-home-stack-v140.css";
import "./hipinup-footer-v80.css";
import "./hipinup-category-v81.css";
import "./hipinup-article-v90.css";
import "./hipinup-article-sticky-v91.css";
import "./hipinup-live-blocks-v160.css";
import "./hipinup-discovery-v100.css";
import "./hipinup-responsive-v110.css";
import "./hipinup-formats-v120.css";
import "./hipinup-formats-v121-polish.css";
import "./hipinup-image-loading-v211.css";
import "./hipinup-interactions-v220.css";
import "./hipinup-ads-v230.css";

const indexable = isIndexableEnvironment();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: "Hipinup — Hayatın içinden, kültürün peşinden", template: "%s | Hipinup" },
  description: SITE_DESCRIPTION,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: SITE_NAME,
    title: "Hipinup — Hayatın içinden, kültürün peşinden",
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hipinup — Hayatın içinden, kültürün peşinden",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: indexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const analyticsEnabled = isAnalyticsEnabled();
  const [adConfig, adsRuntimeEnabled] = await Promise.all([
    getHipAdsConfig(),
    Promise.resolve(isHipAdsRuntimeEnabled()),
  ]);

  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>
        <HipAdsProvider config={adConfig} runtimeEnabled={adsRuntimeEnabled}>
          <StructuredData data={siteJsonLd()} />
          {children}
          {analyticsEnabled && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
              />
              <Script id="hipinup-ga4" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
              </Script>
            </>
          )}
        </HipAdsProvider>
      </body>
    </html>
  );
}
