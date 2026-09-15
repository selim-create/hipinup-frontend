import Image from "next/image";
import Link from "./site-link";
import {
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Camera,
  CirclePlay,
  Compass,
  Headphones,
  Quote,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  articleByKey,
  articleCategory,
  dateLabel,
  orderedArticles,
  type Article,
} from "@/app/data/content";
import { categoryByKey } from "@/app/data/navigation";
import { Shell } from "./magazine";
import { AdSlot } from "./ad-slot";

function Photo({
  article,
  priority = false,
  className = "",
  sizes = "(max-width: 760px) 100vw, 50vw",
}: {
  article: Article;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      className={className}
      src={article.image}
      alt={article.title}
      width={1280}
      height={854}
      sizes={sizes}
      priority={priority}
    />
  );
}

function Meta({ article }: { article: Article }) {
  return (
    <div className="v5-meta">
      <time dateTime={article.date}>{dateLabel(article.date)}</time>
      <span>·</span>
      <span>{article.minutes} dk</span>
    </div>
  );
}

function StoryCard({
  article,
  variant = "",
  index,
}: {
  article: Article;
  variant?: string;
  index?: number;
}) {
  const category = articleCategory(article);
  return (
    <article className={`v5-story ${variant}`}>
      <Link href={article.path} className="v5-story-media" tabIndex={-1} aria-hidden="true">
        <Photo article={article} />
        {index !== undefined && <span className="v5-card-number">0{index + 1}</span>}
        <span className="v5-story-arrow"><ArrowUpRight size={20} /></span>
      </Link>
      <div className="v5-story-copy">
        <Link href={category.path} className="v5-kicker">{category.name}</Link>
        <h3><Link href={article.path}>{article.title}</Link></h3>
        <Meta article={article} />
      </div>
    </article>
  );
}

function PulseBar() {
  const pulse = orderedArticles.slice(0, 5);
  return (
    <section className="v5-pulse" aria-label="Şu an Hipinup'ta">
      <div className="site-width v5-pulse-inner">
        <div className="v5-pulse-label"><span className="v5-live-dot" /> ŞU AN</div>
        <div className="v5-pulse-track">
          {pulse.map((article, index) => (
            <Link href={article.path} key={article.key} className="v5-pulse-item">
              <span>0{index + 1}</span>
              <strong>{article.title}</strong>
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const lead = articleByKey("modern-travel");
  const sideA = articleByKey("tommy-t-wave");
  const sideB = articleByKey("freesbee");
  return (
    <section className="site-width v5-hero" aria-label="Öne çıkanlar">
      <article className="v5-hero-lead">
        <Link href={lead.path} className="v5-hero-image">
          <Photo article={lead} priority sizes="(max-width: 900px) 100vw, 68vw" />
          <span className="v5-hero-label"><Compass size={16} /> YENİ NESİL SEYAHAT</span>
          <span className="v5-hero-sticker">ÇIK.<br/>KAYBOL.<br/>BUL.</span>
        </Link>
        <div className="v5-hero-copy">
          <div>
            <span className="v5-kicker">DOSYA / SEYAHAT</span>
            <h1>AZ YÜK.<br/><em>ÇOK HAYAT.</em></h1>
          </div>
          <div className="v5-hero-summary">
            <p>{lead.excerpt}</p>
            <Meta article={lead} />
            <Link href={lead.path} className="v5-round-link" aria-label="Haberi oku"><ArrowUpRight size={24}/></Link>
          </div>
        </div>
      </article>
      <aside className="v5-hero-side">
        <div className="v5-side-heading"><Sparkles size={17}/><span>BUNU DA BİL</span><strong>Feed’in dışına çık.</strong></div>
        <StoryCard article={sideA} variant="v5-side-card v5-side-card-blue" index={0}/>
        <StoryCard article={sideB} variant="v5-side-card v5-side-card-yellow" index={1}/>
      </aside>
    </section>
  );
}

function DontMiss() {
  const picks = ["tags-design", "bubas-bosphorus", "istanbula-reverans", "coffee"].map(articleByKey);
  return (
    <section className="site-width v5-dont-miss">
      <div className="v5-section-intro">
        <span className="v5-kicker">HIZLI SEÇKİ / 04</span>
        <h2>KAÇIRMA<span>!</span></h2>
        <p>Dört hızlı giriş. Dört ayrı ruh hali.</p>
      </div>
      <div className="v5-dont-list">
        {picks.map((article, index) => (
          <Link href={article.path} key={article.key} className="v5-dont-row">
            <span className="v5-dont-number">0{index + 1}</span>
            <div>
              <span className="v5-kicker">{articleCategory(article).name}</span>
              <h3>{article.title}</h3>
            </div>
            <ArrowUpRight size={23}/>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CultureMarquee() {
  return (
    <div className="v5-marquee" aria-label="Hipinup kültür akışı">
      <div className="v5-marquee-track">
        {[0, 1].map(copy => (
          <div key={copy} aria-hidden={copy === 1}>
            <span>POP KÜLTÜR</span><Asterisk/>
            <span className="outline">GERÇEK HAYAT</span><Asterisk/>
            <span>YENİ TAKINTILAR</span><Asterisk/>
            <span className="outline">BİRAZ HİPİNUP</span><Asterisk/>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorsDesk() {
  const feature = articleByKey("istanbula-reverans");
  const picks = ["ben-bohmer", "ozge-gurkan", "david-lynch"].map(articleByKey);
  return (
    <section className="v5-editors-section">
      <div className="site-width v5-editors-grid">
        <header className="v5-editors-header">
          <span className="v5-kicker">HİPİNUP EDIT / 01</span>
          <h2>EDİTÖR<br/><em>MASASI.</em></h2>
          <Quote size={42}/>
          <p>Algoritmanın değil, merakın seçtiği şeyler. Bu hafta dönüp tekrar baktığımız üç hikâye ve tek büyük dosya.</p>
        </header>
        <article className="v5-editors-feature">
          <Link href={feature.path} className="v5-editors-photo"><Photo article={feature}/><span>HAFTANIN BAKIŞI</span></Link>
          <div><span className="v5-kicker">SANAT & FOTOĞRAF</span><h3><Link href={feature.path}>{feature.title}</Link></h3><Meta article={feature}/></div>
        </article>
        <div className="v5-editors-picks">
          {picks.map((article, index) => (
            <Link href={article.path} key={article.key} className="v5-editor-pick">
              <span>0{index + 1}</span>
              <Image src={article.imageSmall} alt="" width={150} height={100}/>
              <div><small>{articleCategory(article).name}</small><strong>{article.title}</strong></div>
              <ArrowUpRight size={17}/>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function StyleSpread() {
  const big = articleByKey("certain-denim");
  const arch = articleByKey("akay");
  const small = articleByKey("sustainable-fashion");
  return (
    <section className="site-width v5-style">
      <div className="v5-style-heading">
        <div><span className="v5-kicker">MODA & STİL / KENDİN GİBİ GİYİN</span><h2>TAK.<br/><span>TAVRINI.</span></h2></div>
        <Link href={categoryByKey("moda").path}>Stil dosyasını aç <ArrowUpRight size={19}/></Link>
      </div>
      <div className="v5-style-grid">
        <StoryCard article={big} variant="v5-fashion-big" index={0}/>
        <div className="v5-style-manifesto"><span>NO RULES</span><strong>JUST<br/>STYLE.</strong><p>Trendler geçer.<br/>Tavrın kalır.</p></div>
        <StoryCard article={arch} variant="v5-fashion-arch" index={1}/>
        <StoryCard article={small} variant="v5-fashion-small" index={2}/>
      </div>
    </section>
  );
}

function UpShots() {
  const shots = ["bubas-bosphorus", "coffee", "smoothies", "hurrem-sultan-hamami", "bodrum-boat", "six-senses"].map(articleByKey);
  return (
    <section className="v5-shots">
      <div className="site-width">
        <div className="v5-shots-heading">
          <div><span className="v5-kicker"><Camera size={14}/> FOTOĞRAFLA ANLAT</span><h2>UP! <em>SHOTS</em></h2></div>
          <p>Uzun uzun anlatmadan. Bir bakışta içine çeken yerler, tatlar ve anlar.</p>
        </div>
        <div className="v5-shots-grid">
          {shots.map((article, index) => (
            <Link href={article.path} key={article.key} className={`v5-shot v5-shot-${index + 1}`}>
              <Photo article={article}/>
              <span className="v5-shot-index">0{index + 1}</span>
              <div><small>{articleCategory(article).name}</small><strong>{article.title}</strong></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Escape() {
  const travel = articleByKey("modern-travel");
  const boat = articleByKey("bodrum-boat");
  const six = articleByKey("six-senses");
  return (
    <section className="v5-escape">
      <div className="site-width v5-escape-grid">
        <header><span className="v5-kicker"><Compass size={14}/> MOD: KAÇIŞ</span><h2>BİRAZ<br/><em>OFFLINE</em><br/>OLSAN?</h2><p>Yeni rotalar. Uzun kahvaltılar. Daha az bildirim.</p><Link href={categoryByKey("seyahat").path}>Rotayı değiştir <ArrowRight size={18}/></Link></header>
        <Link href={travel.path} className="v5-escape-main"><Photo article={travel}/><span>KOS’TAN BİR NOT</span><strong>Modern seyahatin yeni lüksü: <em>özgürlük.</em></strong></Link>
        <Link href={boat.path} className="v5-escape-circle"><Photo article={boat}/><span>MAVİNİN<br/>PEŞİNDEN</span></Link>
        <StoryCard article={six} variant="v5-escape-small"/>
      </div>
    </section>
  );
}

function UpVideo() {
  const videos = ["tommy-t-wave", "ben-bohmer", "david-lynch"].map(articleByKey);
  return (
    <section className="v5-video">
      <div className="site-width">
        <div className="v5-video-heading">
          <div><span className="v5-kicker"><CirclePlay size={15}/> FORMAT ÖNİZLEMESİ</span><h2>UP! <span>VIDEO</span></h2></div>
          <p>Hızlı izle. Sesini aç. Hikâyenin içine gir.</p>
        </div>
        <div className="v5-video-grid">
          {videos.map((article, index) => (
            <Link href={article.path} key={article.key} className={`v5-video-card ${index === 0 ? "featured" : ""}`}>
              <Photo article={article}/>
              <span className="v5-play"><CirclePlay size={index === 0 ? 48 : 38}/></span>
              <div><small>{articleCategory(article).name} / WATCH</small><strong>{article.title}</strong></div>
            </Link>
          ))}
        </div>
        <span className="v5-video-note">* Video modülü tasarım prototipidir; kartlar mevcut arşiv içeriklerine gider.</span>
      </div>
    </section>
  );
}

function TalkCulture() {
  const feature = articleByKey("istanbula-reverans");
  return (
    <section className="site-width v5-culture">
      <div className="v5-culture-heading"><span className="v5-kicker">KÜLTÜRÜN TAM ORTASINDAN</span><h2>BUNU<br/><em>KONUŞALIM.</em></h2><Headphones size={42}/></div>
      <Link href={feature.path} className="v5-culture-feature"><Photo article={feature}/><span className="v5-culture-poster">AYNI ŞEHİR.<br/><em>BİN HİKÂYE.</em></span><span className="v5-culture-side">BAKIŞINI DEĞİŞTİR.</span></Link>
      <div className="v5-culture-stack">
        <StoryCard article={articleByKey("ben-bohmer")} variant="v5-culture-card"/>
        <StoryCard article={articleByKey("ozge-gurkan")} variant="v5-culture-card"/>
      </div>
    </section>
  );
}

function TrendRadar() {
  const topics = [
    ["Moda & Stil", "moda"],
    ["Celebrity", "celebrity"],
    ["Yeni Mekanlar", "mekan"],
    ["Wellness", "wellness"],
    ["Şehrin Sanatı", "sanat"],
    ["Kaçış Rotaları", "seyahat"],
  ] as const;
  return (
    <section className="v5-trends">
      <div className="site-width v5-trends-inner">
        <div className="v5-trends-title"><TrendingUp size={25}/><span className="v5-kicker">RADARDA / ŞİMDİ</span><h2>YENİ<br/>TAKINTIN<br/>NE?</h2></div>
        <div className="v5-trend-links">
          {topics.map(([label, key], index) => (
            <Link href={categoryByKey(key).path} key={key}><span>0{index + 1}</span>{label}<ArrowUpRight size={22}/></Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeelGood() {
  return (
    <section className="site-width v5-feel">
      <header><span className="v5-kicker">KENDİNE İYİ GELEN ŞEYLER</span><h2>MODUNU <span>YÜKSELT.</span></h2><Link href={categoryByKey("wellness").path}>Bir mola ver <ArrowUpRight size={19}/></Link></header>
      <div className="v5-feel-grid">
        <StoryCard article={articleByKey("coffee")} variant="v5-feel-round"/>
        <StoryCard article={articleByKey("smoothies")} variant="v5-feel-tall"/>
        <StoryCard article={articleByKey("hurrem-sultan-hamami")} variant="v5-feel-arch"/>
      </div>
    </section>
  );
}

function OneLastThing() {
  const feature = articleByKey("sustainable-fashion");
  return (
    <section className="v5-last">
      <div className="site-width v5-last-grid">
        <Link href={feature.path} className="v5-last-image"><Photo article={feature}/><span className="v5-last-sticker">SON<br/>Bİ’<br/>ŞEY.</span></Link>
        <div className="v5-last-copy">
          <span className="v5-kicker">ONE LAST THING / HİPİNUP</span>
          <h2>DAHA AZ.<br/><em>DAHA İYİ.</em></h2>
          <p>{feature.excerpt}</p>
          <Meta article={feature}/>
          <Link href={feature.path}>Hikâyeyi aç <ArrowUpRight size={20}/></Link>
        </div>
      </div>
    </section>
  );
}

function TopicDock() {
  const keys = ["celebrity", "moda", "seyahat", "sanat", "wellness", "mekan"];
  return (
    <section className="site-width v5-topic-dock">
      <div><span className="v5-kicker">DEVAM ET</span><h2>MERAKINI<br/>SEÇ.</h2></div>
      <div>{keys.map((key, index) => <Link key={key} href={categoryByKey(key).path}><span>0{index + 1}</span>{categoryByKey(key).name}<ArrowUpRight size={21}/></Link>)}</div>
    </section>
  );
}

export function HomePageV5() {
  return (
    <Shell>
      <main id="icerik" className="v5-home">
        <PulseBar/>
        <div className="site-width v5-top-ad"><AdSlot format="leaderboard"/></div>
        <Hero/>
        <DontMiss/>
        <CultureMarquee/>
        <EditorsDesk/>
        <StyleSpread/>
        <UpShots/>
        <div className="v5-ad-break"><div className="site-width"><AdSlot format="billboard"/></div></div>
        <Escape/>
        <UpVideo/>
        <TalkCulture/>
        <TrendRadar/>
        <FeelGood/>
        <OneLastThing/>
        <TopicDock/>
      </main>
    </Shell>
  );
}
