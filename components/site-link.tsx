"use client";
import NextLink from "next/link";
import type { ComponentProps } from "react";
const exactLegacyPaths = new Set([
  "/saglikli-yasam,beslenme-ve-diyet,aile,psikoloji",
  "/astroloji,astroloji-gundemi,burclar",
]);
/** Preserve legacy comma-separated paths that intentionally have no final slash. */
export default function SiteLink({href,children,...props}:ComponentProps<typeof NextLink>) {
 if (typeof href === "string" && exactLegacyPaths.has(href)) return <a href={href} {...props}>{children}</a>;
 return <NextLink href={href} {...props}>{children}</NextLink>;
}
