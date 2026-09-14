import React,{useMemo,useState}from'react';
import{Building2,Gamepad2,RotateCcw,Star,Shuffle,ArrowRight}from'lucide-react';
import'./brainBreak.css';

export function AdventureCheckpoint({mastery,coins,onWorld,onBrainBreak,onContinue}){
  return <main className="app celebrationPage">
    <section className="celebrationHero panel">
      <div className="celebrationBurst">🏆</div>
      <small>Adventure 1 complete</small>
      <h1>Foundations mastered!</h1>
      <p>You explored fractions, patterns, early algebra, coordinates, logic, and spatial reasoning. Your world has new things waiting — or you can continue into Relationships & Scaling.</p>
      <div className="celebrationStats"><span><Star/> {mastery} mastery</span><span>🪙 {coins} coins</span></div>
    </section>
    <section className="celebrationChoices">
      <button className="celebrationChoice worldChoice" onClick={onWorld}><Building2/><div><small>See what changed</small><h2>Visit My World</h2><p>Check new buildings, pending orders, and spend what you earned.</p></div><b>Enter world →</b></button>
      <button className="celebrationChoice breakChoice" onClick={onBrainBreak}><Gamepad2/><div><small>Take a brain break</small><h2>Gem Mix</h2><p>Play a quick match-three game before the next adventure.</p></div><b>Play →</b></button>
      <button className="celebrationChoice continueChoice" onClick={onContinue}><ArrowRight/><div><small>Adventure 2</small><h2>Relationships & Scaling</h2><p>Ratios, scale, rates, functions, slope, unit rates, and multi-step missions.</p></div><b>Start lesson 11 →</b></button>
    </section>
  </main>
}

export function LessonCelebration({mastery,coins,onWorld,onBrainBreak,onRestart}){
  return <main className="app celebrationPage">
    <section className="celebrationHero panel">
      <div className="celebrationBurst">🎉</div>
      <small>Two adventures complete</small>
      <h1>You made it through all 20!</h1>
      <p>You built foundations, then used them in ratios, scaling, rates, functions, slope, and relationship missions. Now choose what happens next.</p>
      <div className="celebrationStats"><span><Star/> {mastery} mastery</span><span>🪙 {coins} coins</span></div>
    </section>
    <section className="celebrationChoices">
      <button className="celebrationChoice worldChoice" onClick={onWorld}><Building2/><div><small>Use what you earned</small><h2>Go to My World</h2><p>See how the city changed and tackle the new orders your learning created.</p></div><b>Enter world →</b></button>
      <button className="celebrationChoice breakChoice" onClick={onBrainBreak}><Gamepad2/><div><small>Take a brain break</small><h2>Gem Mix</h2><p>Swap colorful gems to make 3-in-a-row. No lesson score — just play.</p></div><b>Play →</b></button>
      <button className="celebrationChoice" onClick={onRestart}><RotateCcw/><div><small>Keep exploring</small><h2>Replay from Adventure 1</h2><p>Return to lesson 1 without losing anything you have earned.</p></div><b>Start again →</b></button>
    </section>
  </main>
}

const SIZE=6;
const GEMS=['🔴','🟠','🟡','🟢','🔵','🟣'];
const START=['🔴','🔵','🟢','🟣','🟡','🟠','🟡','🔴','🔵','🟢','🟣','🟡','🟠','🟢','🔴','🔵','🟢','🟣','🟣','🟠','🟡','🔴','🔵','🟢','🔵','🟣','🟠','🟡','🔴','🔵','🟢','🔵','🟣','🟠','🟡','🔴'];
function randomGem(){return GEMS[Math.floor(Math.random()*GEMS.length)]}
function adjacent(a,b){const ar=Math.floor(a/SIZE),ac=a%SIZE,br=Math.floor(b/SIZE),bc=b%SIZE;return Math.abs(ar-br)+Math.abs(ac-bc)===1}
function findMatches(board){const hit=new Set();for(let r=0;r<SIZE;r++){let start=0;for(let c=1;c<=SIZE;c++){const same=c<SIZE&&board[r*SIZE+c]===board[r*SIZE+start];if(!same){if(c-start>=3)for(let x=start;x<c;x++)hit.add(r*SIZE+x);start=c}}}for(let c=0;c<SIZE;c++){let start=0;for(let r=1;r<=SIZE;r++){const same=r<SIZE&&board[r*SIZE+c]===board[start*SIZE+c];if(!same){if(r-start>=3)for(let y=start;y<r;y++)hit.add(y*SIZE+c);start=r}}}return [...hit]}
function refill(board,matches){const next=[...board];matches.forEach(i=>next[i]=null);for(let c=0;c<SIZE;c++){const kept=[];for(let r=SIZE-1;r>=0;r--){const v=next[r*SIZE+c];if(v)kept.push(v)}for(let r=SIZE-1,k=0;r>=0;r--){next[r*SIZE+c]=k<kept.length?kept[k++]:randomGem()}}return next}
function shuffleBoard(){return Array.from({length:SIZE*SIZE},()=>randomGem())}

export function BrainBreak({onDone}){const[board,setBoard]=useState(START),[selected,setSelected]=useState(null),[score,setScore]=useState(0),[clears,setClears]=useState(0),[message,setMessage]=useState('Tap one gem, then an adjacent gem to swap them.'),[flash,setFlash]=useState([]);const relaxed=clears>=5;const choose=i=>{if(selected===null){setSelected(i);setMessage('Now tap a gem next to it.');return}if(i===selected){setSelected(null);return}if(!adjacent(selected,i)){setSelected(i);setMessage('Pick an adjacent gem to swap.');return}const swapped=[...board];[swapped[selected],swapped[i]]=[swapped[i],swapped[selected]];const matches=findMatches(swapped);if(matches.length<3){setSelected(null);setMessage('No match there — try another swap!');return}setFlash(matches);const earned=matches.length*10;setScore(s=>s+earned);setClears(c=>c+1);setMessage(matches.length>=4?`Big match! +${earned} break-score ✨`:`Match! +${earned} break-score`);setBoard(refill(swapped,matches));setSelected(null);setTimeout(()=>setFlash([]),280)};const reset=()=>{setBoard(shuffleBoard());setSelected(null);setFlash([]);setMessage('Fresh board! Make a match of 3 or more.')};const status=useMemo(()=>relaxed?'Brain break complete — keep playing or head back when you want.':`${clears} of 5 matches for a full brain break`,[clears,relaxed]);return <main className="app celebrationPage"><section className="panel brainBreak candyBreak"><div className="candyTop"><div><small>Brain break</small><h1>Gem Mix</h1><p>Swap adjacent gems. Match 3 or more to clear them and make new gems tumble in.</p></div><div className="candyScore"><b>{score}</b><span>break-score</span></div></div><div className="candyHud"><span>✨ {status}</span><button className="secondary" onClick={reset}><Shuffle size={18}/> Shuffle</button></div><div className="gemBoard">{board.map((gem,i)=><button key={i} className={`${selected===i?'gem selectedGem':''} ${flash.includes(i)?'gem matchedGem':'gem'}`} onClick={()=>choose(i)}>{gem}</button>)}</div><p className="feedback candyMessage">{message}</p>{relaxed&&<div className="successNote">Nice reset! This score is just for fun — it does not change coins or mastery.</div>}<button className="primary" onClick={onDone}>{relaxed?'Back to the adventure':'Leave brain break'}</button></section></main>}
