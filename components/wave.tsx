export function Wave({className=""}:{className?:string}) {
 return <svg className={`wave ${className}`} viewBox="0 0 1440 42" preserveAspectRatio="none" aria-hidden="true"><path d="M0 24 Q60 -5 120 24 T240 24 T360 24 T480 24 T600 24 T720 24 T840 24 T960 24 T1080 24 T1200 24 T1320 24 T1440 24 V42 H0 Z" fill="currentColor"/></svg>;
}
export function Squiggle({className=""}:{className?:string}) {
 return <svg className={`squiggle ${className}`} viewBox="0 0 220 24" fill="none" aria-hidden="true"><path d="M4 13Q20 -2 36 13T68 13T100 13T132 13T164 13T196 13T218 13" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/></svg>;
}
