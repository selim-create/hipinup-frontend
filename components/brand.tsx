import Link from "next/link";

export function Brand({small=false,light=false}:{small?:boolean;light?:boolean}) {
 return <Link href="/" aria-label="Hipinup ana sayfa" className={`brand hipinup-brand ${small?'brand-small':''} ${light?'brand-light':''}`}>
  <span className="hipinup-wordmark" aria-hidden="true">
   <span className="hipinup-wordmark-main">hipin</span><span className="hipinup-wordmark-up">up</span><span className="hipinup-wordmark-dot"/>
  </span>
  <span className="sr-only">Hipinup</span>
 </Link>;
}
