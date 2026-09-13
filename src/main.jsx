import React, {useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Volume2, Star, Coins, Building2, Lightbulb, Flame, Gamepad2, RotateCcw} from 'lucide-react';
import './styles.css';

const themes={
  building:{label:'Block Building',emoji:'🧱',story:'Build the wall so exactly 3 of 4 sections are filled.',reward:'Builder Cottage'},
  animals:{label:'Animal Care',emoji:'🐾',story:'Prepare exactly 3 of the 4 animal-care stations.',reward:'Animal Clinic'},
  princess:{label:'Princess',emoji:'💎',story:'Decorate exactly 3 of the 4 royal carriage panels.',reward:'Castle Tower'},
  cars:{label:'Cars',emoji:'🏁',story:'Prepare exactly 3 of the 4 pit stations.',reward:'Race Garage'},
  space:{label:'Space',emoji:'🚀',story:'Power exactly 3 of the 4 spacecraft cells.',reward:'Space Lab'}
};

function speak(text){ if('speechSynthesis' in window){ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.rate=.9; speechSynthesis.speak(u); } }

function App(){
 const [theme,setTheme]=useState('building');
 const [cells,setCells]=useState([false,false,false,false]);
 const [coins,setCoins]=useState(0);
 const [mastery,setMastery]=useState(0);
 const [feedback,setFeedback]=useState('Tap the sections you want to fill.');
 const [solved,setSolved]=useState(false);
 const [reward,setReward]=useState(null);
 const selected=useMemo(()=>cells.filter(Boolean).length,[cells]);
 const t=themes[theme];
 const toggle=i=>setCells(v=>v.map((x,j)=>j===i?!x:x));
 const check=()=>{
   if(selected===3){
     if(!solved){setSolved(true);setCoins(c=>c+75);setMastery(m=>m+1);setFeedback('You found 3/4! That is also 0.75 and 75%. +75 coins');}
     else setFeedback('You still have it. Try the same idea in a new way.');
   } else if(selected<3) setFeedback(`You have ${selected} of 4. Add ${3-selected} more.`);
   else setFeedback('All 4 are filled. Leave exactly 1 section empty.');
 };
 const transfer=()=>{setCoins(c=>c+125);setMastery(m=>m+1);setReward(t.reward);setFeedback('Transfer mastered! Same idea, new context. +125 coins');};
 const reset=()=>{setCells([false,false,false,false]);setSolved(false);setReward(null);setFeedback('Tap the sections you want to fill.');};
 return <main className="app">
  <header className="hero"><div><small>2–4 minute learning game</small><h1>See it. Touch it. Figure it out.</h1><p>Master ideas through play, then use them again in a new context.</p></div><button className="secondary" onClick={()=>speak(`Fill exactly three fourths. ${t.story}`)}><Volume2 size={18}/> Read to me</button></header>
  <section className="stats"><div><Building2/> City Lv. {1+Math.floor(mastery/2)}</div><div><Coins/> {coins} coins</div><div><Star/> {mastery} mastery</div></section>
  <section className="panel"><h2>Choose a theme</h2><div className="themes">{Object.entries(themes).map(([k,v])=><button key={k} onClick={()=>setTheme(k)} className={theme===k?'active':''}>{v.emoji} {v.label}</button>)}</div></section>
  <section className="gameGrid">
   <div className="panel"><small>Concept: part-to-whole</small><h2>Fill exactly 3/4</h2><p>{t.story}</p><div className="cells">{cells.map((on,i)=><button key={i} aria-pressed={on} onClick={()=>toggle(i)} className={on?'filled':''}>{t.emoji}</button>)}</div><button className="primary" onClick={check}>Check my build</button><p className="feedback">{feedback}</p></div>
   <div className="panel"><h2>Same idea, different forms</h2><div className="equiv"><div>🍕<b>3 of 4</b></div><div>🥄<b>¾ tsp</b></div><div>🔢<b>0.75</b></div><div>💯<b>75%</b></div></div><button className="secondary full" onClick={transfer} disabled={!solved}>Try the same idea a new way</button>{reward&&<div className="reward">🎁 <b>{reward} unlocked!</b><span>Persistence + transfer bonus</span></div>}</div>
  </section>
  <section className="panel"><h2>Train your tutor</h2><div className="tune"><button onClick={()=>setFeedback('Got it — next challenge will move faster and use less scaffolding.')}>😴 Too easy</button><button onClick={()=>setFeedback('Challenge mode: next problem will combine two ideas.')}><Flame size={18}/> Make it harder</button><button onClick={()=>setFeedback('I’ll keep the concept but make the next step more visual.')}>😵 Too challenging</button><button onClick={()=>setTheme(theme==='cars'?'animals':'cars')}><Gamepad2 size={18}/> Make it more fun</button><button onClick={()=>setFeedback('Hint: 3/4 means three equal parts selected out of four total parts.')}><Lightbulb size={18}/> Show another way</button><button onClick={reset}><RotateCcw size={18}/> Reset lesson</button></div></section>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);
