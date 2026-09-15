import type { Metadata } from "next";
import "./globals.css";
import "./hipinup-v4.css";
import "./hipinup-v5.css";
import "./hipinup-v51.css";
import "./hipinup-v52.css";
import "./hipinup-v6.css";
import "./hipinup-v61.css";
import "./hipinup-v62.css";
import "./hipinup-v63.css";
import "./hipinup-v64.css";
import "./hipinup-header-v1.css";
import "./hipinup-header-v11.css";
import "./hipinup-v65.css";
import "./hipinup-v66-style.css";
import "./hipinup-v67-escape.css";
import "./hipinup-v68-clusters.css";
import "./hipinup-v69-qa.css";
import "./hipinup-v70-finishing.css";
import "./hipinup-v71-style-gap.css";
import "./hipinup-v73-rhythm-ads.css";
import "./hipinup-v74-ad-architecture.css";

export const metadata: Metadata = {
  title: { default: "Hipinup — Hayatın içinden, kültürün peşinden", template: "%s | Hipinup" },
  description: "Popüler kültür, moda, seyahat, iyi yaşam ve şehirden hikâyeler. Hipinup ile keşfet.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
