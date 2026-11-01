import {useMemo,useState,useEffect} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {sfx} from './audio.js';
import cfg from './config.js';
const r=(a,b)=>a+Math.random()*(b-a);
export const pick=a=>a[Math.floor(Math.random()*a.length)];
export const toast=m=>window.dispatchEvent(new CustomEvent('toast',{detail:m}));

export function Background({intense}){
  const stars=useMemo(()=>Array.from({length:45},()=>({x:r(0,100),y:r(0,70),s:r(1,3),d:r(0,3)})),[]);
  const bats=useMemo(()=>Array.from({length:4},()=>({y:r(5,40),t:r(14,26),d:r(0,10)})),[]);
  return <div className="fixed inset-0 -z-10 overflow-hidden" style={{background:`radial-gradient(ellipse at 50% 0%,${intense?'#4a2a7a':'#2b1d52'},#17132E 70%)`}}>
    {stars.map((s,i)=><span key={i} className="twinkle absolute rounded-full bg-white" style={{left:s.x+'%',top:s.y+'%',width:s.s,height:s.s,animationDelay:s.d+'s'}}/>)}
    <div className="absolute right-[10%] top-[8%] h-20 w-20 rounded-full sm:h-28 sm:w-28" style={{background:'radial-gradient(circle at 35% 35%,#fff8e1,#f5d98b)',boxShadow:'0 0 60px 20px rgba(245,217,139,.35)'}}/>
    {bats.map((b,i)=><span key={i} className="fly text-2xl" style={{top:b.y+'%',animationDuration:b.t+'s',animationDelay:b.d+'s'}}>🦇</span>)}
    <div className="fog absolute -bottom-10 -left-[20%] h-40 w-[140%] opacity-40" style={{background:'radial-gradient(ellipse,rgba(182,107,235,.5),transparent 70%)'}}/>
  </div>;
}
export function Floaters({items=['❤️','👻','🎃','✨'],n=14}){
  const f=useMemo(()=>Array.from({length:n},(_,i)=>({e:items[i%items.length],x:r(0,96),s:r(16,34),t:r(8,16),d:r(0,10)})),[n]);
  return <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">{f.map((h,i)=><span key={i} className="rise" style={{left:h.x+'%',fontSize:h.s,animationDuration:h.t+'s',animationDelay:h.d+'s'}}>{h.e}</span>)}</div>;
}
export function Ghost({size=140,heart,talk=true}){
  const [say,setSay]=useState('');
  const tap=()=>{sfx.ghost();if(talk){setSay(pick(cfg.ghostLines));setTimeout(()=>setSay(''),2200);}};
  return <div className="relative inline-block">
    <AnimatePresence>{say&&<motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="glass absolute -top-12 left-1/2 w-max max-w-[70vw] -translate-x-1/2 px-3 py-1 text-sm">{say}</motion.div>}</AnimatePresence>
    <motion.button aria-label="Friendly ghost" onClick={tap} animate={{y:[0,-12,0]}} transition={{repeat:Infinity,duration:3}} whileTap={{scale:.9}} style={{filter:'drop-shadow(0 0 18px rgba(182,107,235,.8))'}}>
      <svg viewBox="0 0 100 120" width={size}><path d="M10 112V50C10 20 30 5 50 5s40 15 40 45v62l-13-10-13 10-14-10-14 10-13-10z" fill="#fff"/>
        <circle cx="38" cy="45" r="6" fill="#17132E"/><circle cx="62" cy="45" r="6" fill="#17132E"/><circle cx="30" cy="58" r="5" fill="#F5C6D6"/><circle cx="70" cy="58" r="5" fill="#F5C6D6"/>
        <path d="M43 60q7 8 14 0" stroke="#17132E" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {heart&&<text x="50" y="98" textAnchor="middle" fontSize="28">❤️</text>}</svg>
    </motion.button></div>;
}
export function Pumpkin({size=56,className=''}){
  return <motion.button aria-label="Pumpkin" className={className} style={{fontSize:size}} whileTap={{scale:.8,rotate:-15}} whileHover={{scale:1.15}} onClick={()=>{sfx.pop();toast(pick(cfg.compliments));}}>🎃</motion.button>;
}
export function HiddenHeart({className=''}){
  const [on,setOn]=useState(false);
  return <motion.button aria-label="Hidden heart" className={'opacity-30 hover:opacity-100 '+className} animate={on?{scale:[1,2.5,1],rotate:[0,20,-20,0]}:{}} onClick={()=>{sfx.pop();setOn(true);toast(pick(cfg.secrets));setTimeout(()=>setOn(false),700);}}>💗</motion.button>;
}
export function Toast(){
  const [m,setM]=useState(null);
  useEffect(()=>{let t;const h=e=>{setM(e.detail);clearTimeout(t);t=setTimeout(()=>setM(null),2800);};window.addEventListener('toast',h);return()=>window.removeEventListener('toast',h);},[]);
  return <AnimatePresence>{m&&<motion.div key={m} role="status" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="glass fixed bottom-6 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 px-4 py-3 text-center">{m}</motion.div>}</AnimatePresence>;
}
export const Btn=({children,onClick,className='',...p})=><motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}} onClick={onClick} className={'rounded-full px-7 py-3 font-bold text-white '+className} {...p}>{children}</motion.button>;
export const grad='bg-gradient-to-r from-pumpkin via-pink-400 to-magic shadow-[0_0_25px_rgba(242,140,56,.6)]';
