import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Article } from "@/app/data/content";
import Link from "./site-link";
import { Shell, StoryCard } from "./magazine";

export function LiveSearchPage({
  query,
  results,
  total,
}: {
  query: string;
  results: Article[];
  total: number;
}) {
  return (
    <Shell>
      <main id="icerik" className="site-width search-page">
        <span className="eyebrow">MERAKININ PEŞİNDEN.</span>
        <h1>“{query}”</h1>
        <p>{total} hikâye bulundu.</p>

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
          <div className="three-grid">
            {results.map((article) => (
              <StoryCard article={article} key={article.key} />
            ))}
          </div>
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
