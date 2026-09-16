import Image from "next/image";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { articleCategory, dateLabel, type Article } from "@/app/data/content";
import type { ApiPagination } from "@/lib/hipinup-api";
import Link from "./site-link";
import { Shell } from "./magazine";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

function isApiImage(src: string) {
  return /^https:\/\/api\.hipinup\.com\//i.test(src);
}

function SearchResultCard({ article }: { article: Article }) {
  const category = articleCategory(article);

  return <article className="story-card" data-category={category.key}>
    <Link href={article.path} className="story-image" tabIndex={-1} aria-hidden="true">
      <Image
        src={article.image}
        alt={article.title}
        width={1280}
        height={854}
        sizes="(max-width: 700px) 100vw, 33vw"
        loading="lazy"
        unoptimized={isApiImage(article.image)}
      />
      <span className="image-arrow"><ArrowUpRight size={23}/></span>
    </Link>
    <div className="story-copy">
      <Link className="eyebrow" href={category.path}>{category.name}</Link>
      <h3><Link href={article.path}>{article.title}</Link></h3>
      <div className="story-meta">
        <time dateTime={article.date}>{dateLabel(article.date)}</time><span>·</span><span>{article.minutes} dk</span>
      </div>
    </div>
  </article>;
}

function searchHref(query: string, page: number) {
  const params = new URLSearchParams({ s: query });
  if (page > 1) params.set("page", String(page));
  return `/?${params.toString()}`;
}

function visiblePages(current: number, total: number) {
  if (total <= 9) return Array.from({ length: total }, (_, index) => index + 1);
  const start = Math.max(1, Math.min(current - 4, total - 8));
  return Array.from({ length: 9 }, (_, index) => start + index);
}

export function LiveSearchPage({
  query,
  results,
  pagination,
}: {
  query: string;
  results: Article[];
  pagination: ApiPagination;
}) {
  const current = Math.max(1, pagination.page);
  const totalPages = Math.max(1, pagination.totalPages);

  return (
    <Shell>
      <main id="icerik" className="site-width search-page">
        <span className="eyebrow">MERAKININ PEŞİNDEN.</span>
        <h1>“{query}”</h1>
        <p>{pagination.total} hikâye bulundu.</p>

        <form action="/" className="page-search">
          <input
            type="search"
            name="s"
            defaultValue={query}
            aria-label="Aranacak kelime"
            placeholder="Neyi merak ediyorsun?"
          />
          <button className="blue-button" type="submit">
            Ara <ArrowRight size={18} />
          </button>
        </form>

        {results.length ? (
          <>
            <div className="three-grid">
              {results.map((article) => <SearchResultCard article={article} key={article.key}/>) }
            </div>

            {totalPages > 1 && <Pagination aria-label="Arama sonucu sayfaları" className="archive-pagination">
              <PaginationContent>
                {current > 1 && <PaginationItem>
                  <PaginationLink size="default" href={searchHref(query, current - 1)}><ChevronLeft size={17}/> Önceki</PaginationLink>
                </PaginationItem>}

                {visiblePages(current, totalPages).map((page) => <PaginationItem key={page}>
                  <PaginationLink isActive={current === page} href={searchHref(query, page)}>{page}</PaginationLink>
                </PaginationItem>)}

                {current < totalPages && <PaginationItem>
                  <PaginationLink size="default" href={searchHref(query, current + 1)}>Sonraki <ChevronRight size={17}/></PaginationLink>
                </PaginationItem>}
              </PaginationContent>
            </Pagination>}
          </>
        ) : (
          <div className="archive-empty">
            <h2>
              BAŞKA BİR KELİME
              <br />
              DENEYELİM.
            </h2>
            <p>“Moda”, “seyahat” veya “İstanbul” ile keşfe başlayabilirsin.</p>
            <Link className="all-link" href="/">
              Ana sayfaya dön <ArrowUpRight size={18} />
            </Link>
          </div>
        )}
      </main>
    </Shell>
  );
}
