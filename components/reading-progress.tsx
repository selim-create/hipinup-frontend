"use client";
import {useEffect,useState} from "react";
import {Progress} from "@/components/ui/progress";
import {ArrowUp} from "lucide-react";
export function ReadingProgress({title}:{title:string}) {
 const [value,setValue]=useState(0);
 useEffect(()=>{
  let frame=0;
  const measure=()=>{const article=document.getElementById('yazi');if(!article)return;const rect=article.getBoundingClientRect();const length=Math.max(1,rect.height-window.innerHeight*.5);setValue(Math.round(Math.max(0,Math.min(100,(-rect.top+180)/length))));frame=0;};
  const update=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  measure();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);if(frame)cancelAnimationFrame(frame);};
 },[]);
 return <div className="reading-strip"><div className="site-width"><span className="reading-label">OKUYORSUN</span><span className="reading-title">{title}</span><a href="#top" aria-label="Yazının başına dön"><ArrowUp size={16}/></a></div><Progress value={value} aria-label="Okuma ilerlemesi" className="reading-progress"/></div>;
}
