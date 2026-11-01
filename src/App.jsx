import {useState} from 'react';
import {motion,AnimatePresence,MotionConfig} from 'framer-motion';
import {Volume2,VolumeX} from 'lucide-react';
import {startMusic,setMuted,sfx} from './audio.js';
import {Background,Toast} from './ui.jsx';
import {Welcome,Scanner,Question,Celebration,Letter,Final,NoEnding} from './screens.jsx';
export default function App(){
  const [s,setS]=useState('welcome');const [mute,setMute]=useState(false);
  const go=n=>{sfx.click();setS(n);};
  const screens={
    welcome:<Welcome next={()=>{startMusic();go('scan');}}/>,
    scan:<Scanner next={()=>setS('ask')}/>,
    ask:<Question yes={()=>go('yes')} no={()=>go('no')}/>,
    yes:<Celebration next={()=>go('letter')}/>,
    letter:<Letter next={()=>go('final')}/>,
    final:<Final replay={()=>go('welcome')}/>,
    no:<NoEnding replay={()=>go('welcome')}/>,
  };
  return <MotionConfig reducedMotion="user">
    <Background intense={s==='yes'||s==='final'}/>
    <button aria-label={mute?'Unmute':'Mute'} onClick={()=>{setMute(!mute);setMuted(!mute);startMusic();}} className="glass fixed right-4 top-4 z-50 p-3">{mute?<VolumeX size={20}/>:<Volume2 size={20}/>}</button>
    <AnimatePresence mode="wait"><motion.main key={s} initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.03}} transition={{duration:.45}}>{screens[s]}</motion.main></AnimatePresence>
    <Toast/>
  </MotionConfig>;
}
