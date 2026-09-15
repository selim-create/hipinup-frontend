import Image from "next/image";
import Link from "next/link";

export function Brand({small=false,light=false}:{small?:boolean;light?:boolean}) {
 return <Link href="/" aria-label="Hipinup ana sayfa" className={`brand hipinup-brand ${small?'brand-small':''} ${light?'brand-light':''}`}>
  <Image src="/brand/hipinup.svg" alt="Hipinup" width={2048} height={595} className="brand-image" priority={!small}/>
 </Link>;
}
