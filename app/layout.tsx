import type { Metadata } from "next";
import "./globals.css";
import "./hipinup-home-stack-v140.css";
import "./hipinup-footer-v80.css";
import "./hipinup-category-v81.css";
import "./hipinup-article-v90.css";
import "./hipinup-discovery-v100.css";
import "./hipinup-responsive-v110.css";
import "./hipinup-formats-v120.css";
import "./hipinup-formats-v121-polish.css";

export const metadata: Metadata = {
  title: { default: "Hipinup — Hayatın içinden, kültürün peşinden", template: "%s | Hipinup" },
  description: "Popüler kültür, moda, seyahat, iyi yaşam ve şehirden hikâyeler. Hipinup ile keşfet.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
