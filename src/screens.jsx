import {useState,useEffect,useMemo} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {Music} from 'lucide-react';
import cfg from './config.js';
import {sfx} from './audio.js';
import {Ghost,Pumpkin,HiddenHeart,Floaters,Btn,grad,pick} from './ui.jsx';
const Wrap=({children,className=''})=><div className={'relative flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-5 py-10 text-center '+className}>{children}</div>;
const rnd=(a,b)=>a+Math.random()*(b-a);

export function Welcome({next}){
  return <Wrap>
    <svg viewBox="0 0 200 110" className="w-64 sm:w-80" style={{filter:'drop-shadow(0 0 14px #B66BEB)'}}>
      <rect x="30" y="50" width="140" height="60" fill="#0d0a1f"/><rect x="20" y="30" width="30" height="80" fill="#0d0a1f"/><path d="M15 32L35 5l20 27z" fill="#0d0a1f"/><path d="M60 52l40-30 40 30z" fill="#0d0a1f"/>
      {[[70,65],[120,65],[35,50],[135,88]].map(([x,y],i)=><rect key={i} x={x} y={y} width="12" height="16" rx="6" fill="#F28C38" className="twinkle" style={{animationDelay:i*.7+'s'}}/>)}
      <path d="M92 110V92a8 8 0 0116 0v18z" fill="#F28C38" opacity=".6"/></svg>
    <div className="flex items-end gap-4"><Pumpkin/><Ghost size={90}/><Pumpkin/></div>
    <h1 className="script text-5xl font-bold sm:text-7xl" style={{textShadow:'0 0 25px #B66BEB'}}>{cfg.title}</h1>
    <p className="text-rose sm:text-xl">{cfg.subtitle}</p>
    <Btn onClick={next} className={grad+' text-lg'} animate={{y:[0,-6,0]}} transition={{repeat:Infinity,duration:2}}>Enter the Haunted House 🏚️</Btn>
    <HiddenHeart className="absolute bottom-6 right-6"/>
  </Wrap>;
}

export function Scanner({next}){
  const [p,setP]=useState(0);
  useEffect(()=>{const i=setInterval(()=>setP(v=>Math.min(100,v+1)),45);return()=>clearInterval(i);},[]);
  useEffect(()=>{if(p===100){sfx.win();const t=setTimeout(next,900);return()=>clearTimeout(t);}},[p]);
  const idx=Math.min(3,Math.floor(p/26));const msg=cfg.scanMessages[idx];
  const H="M100 165C20 110 10 50 55 35C80 27 98 45 100 60C102 45 120 27 145 35C190 50 180 110 100 165Z";
  return <Wrap>
    <div className="relative flex h-64 w-64 items-center justify-center">
      <motion.div className="absolute inset-0 rounded-full border-2 border-dashed border-magic/50" animate={{rotate:360}} transition={{repeat:Infinity,duration:14,ease:'linear'}}/>
      <motion.div className="absolute inset-4 rounded-full border border-rose/30" animate={{rotate:-360}} transition={{repeat:Infinity,duration:22,ease:'linear'}}><span className="absolute -top-2 left-1/2 text-lg">✨</span><span className="absolute -bottom-2 left-1/2 text-lg">🦇</span></motion.div>
      <motion.svg viewBox="0 0 200 180" className="w-44 overflow-visible" animate={{scale:[1,1.07,1,1.04,1]}} transition={{repeat:Infinity,duration:1.1}} style={{filter:'drop-shadow(0 0 16px rgba(255,77,136,.8))'}}>
        <defs><clipPath id="hc"><path d={H}/></clipPath>
          <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff7aa8"/><stop offset="1" stopColor="#B66BEB"/></linearGradient></defs>
        <path d={H} fill="rgba(255,255,255,.06)" stroke="#F5C6D6" strokeWidth="2.5" strokeLinejoin="round"/>
        <g clipPath="url(#hc)"><rect x="0" width="200" height="200" y={170-p*1.45} fill="url(#hg)"/>
          <motion.rect x="0" width="200" height="4" fill="#fff" animate={{y:[20,165,20]}} transition={{repeat:Infinity,duration:2,ease:'easeInOut'}} style={{filter:'drop-shadow(0 0 6px #fff)'}}/></g>
      </motion.svg>
    </div>
    <div className="text-6xl font-bold tabular-nums text-pumpkin" style={{textShadow:'0 0 20px rgba(242,140,56,.7)'}}>{p}%</div>
    <div className="glass h-3 w-64 overflow-hidden"><div className={'h-full '+grad} style={{width:p+'%'}}/></div>
    <div className="h-8" aria-live="polite"><AnimatePresence mode="wait"><motion.p key={idx} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="text-rose">{msg}</motion.p></AnimatePresence></div>
  </Wrap>;
}

export function Question({yes,no}){
  const [pos,setPos]=useState({x:0,y:0});const [n,setN]=useState(0);const [msg,setMsg]=useState('');const [ask,setAsk]=useState(false);const [sure,setSure]=useState(0);const [pile,setPile]=useState([]);
  const sadMsgs=["The little ghost will be a bit sad, but it's totally okay either way. 👻",'Are you REALLY sure? 🥺','The ghost is crying now... 😭','Pleeease? The ghosts are multiplying 👻👻','Just one more chance? 💜'];
  const back=()=>{sfx.pop();setAsk(false);setSure(0);setPile([]);};
  const sureClick=()=>{sfx.ghost();setSure(v=>v+1);setPile(p=>[...p,...[0,1].map(()=>({x:rnd(0,78),y:rnd(0,92),r:rnd(-25,25),s:rnd(.8,1.5)}))].slice(-80));};
  const spam=useMemo(()=>Array.from({length:40},()=>({x:rnd(2,88),y:rnd(8,88),r:rnd(-20,20),s:rnd(.8,1.3)})),[]);
  const dodge=()=>{sfx.ghost();setN(v=>v+1);setPos({x:rnd(-120,120),y:rnd(-30,30)});setMsg(pick(cfg.dodgeMessages));};
  return <Wrap>
    {spam.slice(0,n).map((p,i)=><motion.button key={i} aria-label="Yes" onClick={yes} initial={{scale:0,rotate:0}} animate={{scale:p.s,rotate:p.r}} transition={{type:'spring'}} className={grad+' fixed z-10 rounded-full px-4 py-2 text-sm font-bold'} style={{left:p.x+'%',top:p.y+'%'}}>YES ❤️</motion.button>)}
    <Ghost size={130} heart/>
    <p className="text-rose">Hey, I have something to ask you...</p>
    <h2 className="script text-4xl font-bold sm:text-6xl">{cfg.question}</h2>
    <div className="flex flex-col items-center gap-6">
      <motion.div className="relative z-20" animate={{scale:Math.min(1+n*.3,3.5)}} transition={{type:'spring'}} style={{margin:`${Math.min(n*.3,2.5)*26}px 0`}}>
        <Btn onClick={yes} className={grad+' text-xl'}>YES! ❤️</Btn>
      </motion.div>
      <motion.button animate={pos} transition={{type:'spring',stiffness:200,damping:15}} onMouseEnter={dodge} onClick={dodge} className="glass relative z-40 px-7 py-3 font-bold">NO 👻</motion.button>
    </div>
    <p className="h-6 text-pumpkin" aria-live="polite">{msg}</p>
    <button onClick={()=>{sfx.ghost();setAsk(true);}} className="z-30 text-sm text-white/70 underline">No, thank you</button>
    <AnimatePresence>{ask&&<motion.div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/60 px-5" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} role="alertdialog" aria-modal="true">
      {pile.map((p,k)=><motion.button key={k} onClick={back} initial={{scale:0}} animate={{scale:p.s,rotate:p.r}} transition={{type:'spring'}} className={grad+' absolute whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold'} style={{left:p.x+'%',top:p.y+'%'}}>Wait, go back 💜</motion.button>)}
      <motion.div className="glass relative flex w-full max-w-sm flex-col items-center gap-4 p-6" initial={{scale:.8,y:20}} animate={{scale:1,y:0}} exit={{scale:.8,opacity:0}}>
        <span className="text-5xl">🥺</span>
        <h3 className="script text-3xl font-bold">Are you sure?</h3>
        <p className="text-sm text-rose" aria-live="polite">{sadMsgs[sure%sadMsgs.length]}</p>
        <motion.button whileTap={{scale:.95}} onClick={back} className={grad+' w-full rounded-full px-6 py-3 font-bold text-white'} style={{fontSize:Math.min(1+sure*.08,1.7)+'rem'}}>Wait, go back 💜</motion.button>
        <Btn onClick={sureClick} className="glass w-full">Yes, I'm sure</Btn>
        {sure>=8&&<motion.button initial={{opacity:0}} animate={{opacity:1}} onClick={no} className="text-xs text-white/60 underline">I'd still like to decline</motion.button>}
      </motion.div>
    </motion.div>}</AnimatePresence>
  </Wrap>;
}

export function Celebration({next}){
  useEffect(()=>{sfx.win();},[]);
  const hearts=useMemo(()=>Array.from({length:36},(_,i)=>({a:i/36*Math.PI*2,d:rnd(120,320)})),[]);
  const conf=useMemo(()=>Array.from({length:36},()=>({x:rnd(0,100),c:pick(['#F28C38','#B66BEB','#F5C6D6','#fff']),t:rnd(3,6),d:rnd(0,4)})),[]);
  const fw=[[20,22],[78,18],[50,32]];
  return <Wrap className="overflow-hidden">
    <div className="pointer-events-none fixed inset-0" style={{background:'radial-gradient(circle,rgba(245,198,214,.25),transparent 65%)'}}/>
    {hearts.map((h,i)=><motion.span key={i} className="pointer-events-none fixed left-1/2 top-1/2 text-2xl" initial={{x:0,y:0,scale:0,opacity:1}} animate={{x:Math.cos(h.a)*h.d,y:Math.sin(h.a)*h.d,scale:[0,1.5,0],opacity:[1,1,0]}} transition={{duration:1.6}}>❤️</motion.span>)}
    {conf.map((c,i)=><motion.i key={i} className="pointer-events-none fixed top-0 h-3 w-2" style={{left:c.x+'%',background:c.c}} animate={{y:'105vh',rotate:720}} initial={{y:-20}} transition={{duration:c.t,delay:c.d,repeat:Infinity,ease:'linear'}}/>)}
    {fw.map(([x,y],k)=><div key={k} className="pointer-events-none fixed" style={{left:x+'%',top:y+'%'}}>{Array.from({length:12},(_,i)=><motion.span key={i} className="absolute h-2 w-2 rounded-full" style={{background:['#F28C38','#B66BEB','#F5C6D6'][k]}} animate={{x:[0,Math.cos(i/12*6.28)*70],y:[0,Math.sin(i/12*6.28)*70],opacity:[1,0]}} transition={{duration:1.4,delay:k*.8,repeat:Infinity,repeatDelay:1.5}}/>)}</div>)}
    <Floaters items={['❤️','👻','💖']} n={16}/>
    <Ghost size={110} heart/>
    <h2 className="script z-10 text-4xl font-bold sm:text-6xl" style={{textShadow:'0 0 25px #F5C6D6'}}>{cfg.yesMessage}</h2>
    <Btn onClick={next} className={grad+' z-10 text-lg'}>Open the secret letter 💌</Btn>
  </Wrap>;
}

export function Letter({next}){
  const [stage,setStage]=useState('closed');const [t,setT]=useState(0);
  const open=()=>{sfx.click();setStage('opening');setTimeout(()=>setStage('open'),900);};
  useEffect(()=>{if(stage!=='open')return;const i=setInterval(()=>setT(v=>v+1),35);return()=>clearInterval(i);},[stage]);
  const done=t>=cfg.letter.length;
  return <Wrap>
    <Floaters items={['💗','✨']} n={10}/>
    {stage!=='open'?<div className="flex flex-col items-center gap-4">
      <button onClick={open} aria-label="Open the envelope" className="relative h-44 w-72 rounded-xl bg-gradient-to-br from-rose to-pink-300 shadow-[0_0_40px_rgba(245,198,214,.5)]">
        <motion.div className="absolute left-0 top-0 h-24 w-full origin-top bg-pink-300" style={{clipPath:'polygon(0 0,100% 0,50% 100%)'}} animate={{rotateX:stage==='opening'?180:0}} transition={{duration:.8}}/>
        {stage==='closed'&&<motion.span className="absolute left-1/2 top-20 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-red-700 text-2xl shadow-lg" animate={{scale:[1,1.1,1]}} transition={{repeat:Infinity,duration:1.2}}>❤️</motion.span>}
      </button><p className="text-rose">Tap the seal to open</p></div>
    :<motion.div initial={{opacity:0,y:60,scale:.8}} animate={{opacity:1,y:0,scale:1}} className="glass w-full max-w-lg p-6 text-left sm:p-10">
      <p className="script text-3xl text-pumpkin">Dear {cfg.recipient},</p>
      <p className="script my-4 min-h-[11rem] text-2xl leading-relaxed text-rose sm:text-3xl">{cfg.letter.slice(0,t)}<span className="animate-pulse">|</span></p>
      <p className="script text-right text-2xl text-magic">— {cfg.sender}</p></motion.div>}
    {stage==='open'&&<Btn onClick={()=>next()} className={grad+(done?'':' opacity-70')}>{done?'Continue 🎃':'Skip ›'}</Btn>}
    <Pumpkin className="absolute bottom-4 left-4"/><HiddenHeart className="absolute right-6 top-6"/>
  </Wrap>;
}

export function Final({replay}){
  const [wish,setWish]=useState(false);
  const pts=[[100,165],[55,135],[25,95],[22,60],[55,35],[100,60],[145,35],[178,60],[175,95],[145,135]];
  const shoot=useMemo(()=>Array.from({length:7},()=>({x:rnd(0,60),y:rnd(0,30)})),[]);
  return <Wrap className="!gap-4">
    <Floaters items={['✨','💜']} n={8}/>
    {wish&&shoot.map((p,i)=><motion.span key={i} className="pointer-events-none fixed z-10 text-2xl" style={{left:p.x+'%',top:p.y+'%'}} initial={{opacity:0}} animate={{x:[0,260],y:[0,200],opacity:[0,1,0]}} transition={{duration:1.3,delay:i*.18}}>🌠</motion.span>)}
    <div className="relative w-64 sm:w-80">
      <svg viewBox="0 0 200 180" className="w-full overflow-visible" style={{filter:'drop-shadow(0 0 10px #F5C6D6)'}}>
        <motion.path d="M100 165C20 110 10 50 55 35C80 27 98 45 100 60C102 45 120 27 145 35C190 50 180 110 100 165Z" fill="rgba(245,198,214,.07)" stroke="#F5C6D6" strokeWidth="1.5" strokeLinejoin="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:4,ease:'easeInOut'}}/>
        {pts.map(([x,y],i)=><motion.circle key={i} cx={x} cy={y} r="3.5" fill="#fff" initial={{scale:0}} animate={{scale:[0,1.7,1]}} style={{transformBox:'fill-box',transformOrigin:'center'}} transition={{delay:i*.4,duration:.6}}/>)}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pt-4"><Ghost size={80} heart/></div>
    </div>
    <motion.h2 className="script text-4xl font-bold sm:text-5xl" style={{textShadow:'0 0 25px #F28C38'}} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:4.2,duration:1}}>{cfg.finalTitle}</motion.h2>
    <motion.p className="max-w-xs text-rose sm:max-w-md" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:5.2,duration:1}}>{cfg.closing}</motion.p>
    <motion.div className="flex min-h-[110px] flex-col items-center gap-3" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:6,duration:.8}}>
      {wish?<>
        <motion.p initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}} className="glass max-w-xs px-4 py-3 text-sm">{cfg.wishMessage}</motion.p>
        {cfg.song.url&&<motion.a href={cfg.song.url} target="_blank" rel="noreferrer" onClick={()=>sfx.pop()} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:.7}} whileTap={{scale:.95}} className="glass flex max-w-xs items-center gap-3 px-5 py-3 text-left text-sm"><Music size={22} className="shrink-0 text-magic"/><span>{cfg.song.label}{cfg.song.title&&<b className="block text-pumpkin">{cfg.song.title}</b>}</span></motion.a>}
        {cfg.reply.url&&<motion.a href={cfg.reply.url} target="_blank" rel="noreferrer" onClick={()=>sfx.win()} initial={{opacity:0,y:15}} animate={{opacity:1,y:0,scale:[1,1.06,1]}} transition={{delay:1.2,scale:{repeat:Infinity,duration:1.4}}} className={grad+' rounded-full px-7 py-3 font-bold'}>{cfg.reply.label}</motion.a>}
      </>
        :<Btn onClick={()=>{sfx.win();setWish(true);}} className={grad}>Make a wish ✨</Btn>}
      <Btn onClick={replay} className="glass text-sm">Replay 🔁</Btn>
    </motion.div>
    <Pumpkin size={36} className="absolute bottom-3 right-4"/>
  </Wrap>;
}
export function NoEnding({replay}){
  return <Wrap>
    <Floaters items={['🎃','⭐','🍬']} n={10}/>
    <Ghost size={110}/>
    <h2 className="script text-4xl font-bold sm:text-5xl">{cfg.noEnding.title}</h2>
    <p className="max-w-md text-rose">{cfg.noEnding.text}</p>
    <Btn onClick={replay} className="glass">Replay 🔁</Btn>
  </Wrap>;
}