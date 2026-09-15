# Hipinup Frontend

A Next.js frontend prototype for Hipinup, a Turkish lifestyle and pop-culture publication. The visual direction uses expressive condensed typography, wavy section edges and asymmetrical photographic spreads. The identity uses sky blue `#20b1ea`, yellow `#fff100` and dark text for contrast.

The homepage alternates a photographic cover, a compact news feed, a fashion spread, layered travel postcards, culture posters and a wellness section. Article pages use a split cover, a short story brief, numbered sections, highlighted passages and reading progress. Mobile layouts rearrange these compositions instead of repeating a uniform card stack.

## Advertising mockups

Reusable `AdSlot` components display a clearly labeled Hip Creative house-campaign example. The desktop homepage has a 970 × 90 leaderboard and a 970 × 250 billboard. Category pages have a leaderboard. Article layouts reserve a 300 × 600 desktop rail and insert a 300 × 250 unit in longer stories. The leaderboard becomes 320 × 100 on mobile, and the billboard becomes 300 × 250; narrower screens shrink the available width. The article rail is hidden below 1001px so the reading column retains its width. These examples link to Hip Medya and contain no ad-network scripts or tracking.

## Included

- Homepage, category/archive, article, search and 404 templates.
- 23 category addresses preserved verbatim in `app/data/navigation.ts`.
- 18 existing article addresses, dates and archive photographs. Display headlines are mockup editorial variants; the requested travel article retains its full original headline and body.
- Category pagination, nested WordPress-style `/page/2/` compatibility, accessible desktop submenus and mobile directory.
- Search across the sample archive, browser-local saved article state and copy-link action.
- Explicit demo newsletter. No registration, email delivery, tracking or production backend connection.
- Self-hosted Barlow Condensed and DM Sans font files, optimized WebP photographs, and an additional campaign gallery in the Tommy Hilfiger article.
- Noindex metadata for the prototype. No changes are made to hipinup.com.

## Data boundary

`app/data/content.ts` provides typed mock article access; `articles.json` contains cards and metadata, `bodies.json` supplies readable article bodies. These can be replaced by a WordPress API data adapter in the later headless phase. The prototype does not connect to WordPress at runtime.

The current menu promotes Celebrity, Moda & Stil, Kültür & Sanat, Yaşam, Wellness, Seyahat and Popüler. The original `/konu/yasam/`, `/konu/ajanda/` and `/konu/populer/` parent archive paths remain. Menu labels do not redefine article permalinks.

The two grouped category paths without trailing slashes use plain anchors. Other requested article and category URLs retain their final slash. `skipTrailingSlashRedirect` remains enabled to preserve the archive’s URL conventions.

## Editorial notes

The archive is a visual sample, not a complete migration. Unrepresented categories use a real empty state. Three articles with unreviewed/error-containing source copy show an archive summary and link to the original instead of republishing that body. Image rights, source accuracy and business claims must be reviewed during content migration. See `ASSET-SOURCES.md` for exact origins.

## Development

The project uses React 19 and Next.js 16 with the App Router. Use pnpm and the existing lockfile:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

For a production check and server:

```bash
pnpm build
pnpm start
```

A production headless launch still requires a complete URL inventory, WordPress data/API integration, metadata and schema mapping, sitemap and redirects review, content/author mapping, newsletter integration and migration validation. This is a design prototype, not a completed production migration.
