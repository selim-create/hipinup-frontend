import Link from "next/link";
export function Brand({small=false,light=false}:{small?:boolean;light?:boolean}) {
 return <Link href="/" aria-label="Hipinup ana sayfa" className={`brand ${small?'brand-small':''} ${light?'brand-light':''}`}><img src="/images/hipinup-wordmark.png" alt="Hipinup" width={2172} height={724} className="brand-image" decoding="async"/></Link>;
}
