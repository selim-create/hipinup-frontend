"use client";
import { useEffect, useState, type FormEvent } from "react";
import { Bookmark, Check, Link as LinkIcon, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export function NewsletterForm() {
 const [consent,setConsent]=useState(false);
 const [complete,setComplete]=useState(false);
 function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(consent)setComplete(true)}
 return <form onSubmit={submit} className="newsletter-form">
   {complete?<div role="status" className="newsletter-result"><Check size={25}/><div><strong>Önizleme tamamlandı.</strong><p>Bu bir tasarım demosu; e-posta adresin kaydedilmedi.</p><button type="button" onClick={()=>setComplete(false)}>Forma geri dön</button></div></div>:<><div className="email-field"><input required type="email" name="email" autoComplete="email" placeholder="E-posta adresin" aria-label="E-posta adresin"/><button type="submit" aria-label="Bülten formunu dene"><ArrowRight size={23}/></button></div><div className="consent-row"><Checkbox id="newsletter-consent" checked={consent} onCheckedChange={v=>setConsent(v===true)} required/><label htmlFor="newsletter-consent"><a href="https://hipinup.com/uyelik-aydinlatma-metni/" target="_blank" rel="noreferrer">Aydınlatma metnini</a> okudum. Hipinup bültenini almak istiyorum.</label></div><small className="demo-note">Tasarım önizlemesi. Abonelik kaydı oluşturulmaz.</small></>}
 </form>;
}

export function ReaderActions({articleKey}:{articleKey:string}) {
 const [saved,setSaved]=useState(false);const [copied,setCopied]=useState(false);const [notice,setNotice]=useState("");
 useEffect(()=>{
  const frame=requestAnimationFrame(()=>{
   try{setSaved(JSON.parse(localStorage.getItem('hipinup-saved')||'[]').includes(articleKey))}catch{}
  });
  return()=>cancelAnimationFrame(frame);
 },[articleKey]);
 const toggle=()=>{try{const items:string[]=JSON.parse(localStorage.getItem('hipinup-saved')||'[]');const next=saved?items.filter(x=>x!==articleKey):[...items,articleKey];localStorage.setItem('hipinup-saved',JSON.stringify(next));setSaved(!saved);setNotice(saved?'Yazı kayıtlılarından çıkarıldı.':'Yazı bu tarayıcıda kaydedildi.')}catch{setNotice('Bu tarayıcıda kayıt yapılamıyor.')}};
 const copy=async()=>{try{await navigator.clipboard.writeText(window.location.href);setCopied(true);setNotice('Bağlantı kopyalandı.')}catch{setNotice('Bağlantıyı adres çubuğundan kopyalayabilirsin.')}};
 return <div className="reader-actions"><div><button onClick={toggle} aria-pressed={saved}>{saved?<Check size={17}/>:<Bookmark size={17}/>} {saved?'Kaydedildi':'Sonra oku'}</button><button onClick={copy}>{copied?<Check size={17}/>:<LinkIcon size={17}/>} {copied?'Kopyalandı':'Bağlantıyı kopyala'}</button></div><span role="status">{notice}</span></div>;
}
