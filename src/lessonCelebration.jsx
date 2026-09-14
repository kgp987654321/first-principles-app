import React,{useState}from'react';
import{Building2,Gamepad2,RotateCcw,Star}from'lucide-react';

export function LessonCelebration({mastery,coins,onWorld,onBrainBreak,onRestart}){
  return <main className="app celebrationPage">
    <section className="celebrationHero panel">
      <div className="celebrationBurst">🎉</div>
      <small>Learning adventure complete</small>
      <h1>You made it through all 10!</h1>
      <p>You explored fractions, patterns, number lines, measurement, and spatial thinking. Now choose what happens next.</p>
      <div className="celebrationStats"><span><Star/> {mastery} mastery</span><span>🪙 {coins} coins</span></div>
    </section>
    <section className="celebrationChoices">
      <button className="celebrationChoice worldChoice" onClick={onWorld}><Building2/><div><small>Use what you earned</small><h2>Go to My World</h2><p>Build something, visit your bakery, and see what your learning unlocked.</p></div><b>Enter world →</b></button>
      <button className="celebrationChoice breakChoice" onClick={onBrainBreak}><Gamepad2/><div><small>Take a brain break</small><h2>60-second Pattern Pop</h2><p>A tiny no-pressure visual game. No lesson score. Just play.</p></div><b>Play →</b></button>
      <button className="celebrationChoice" onClick={onRestart}><RotateCcw/><div><small>Keep exploring</small><h2>Replay the adventure</h2><p>Return to lesson 1 without losing anything you have earned.</p></div><b>Start again →</b></button>
    </section>
  </main>
}

export function BrainBreak({onDone}){
  const [popped,setPopped]=useState([]);
  const shapes=['⭐','🔵','⭐','🟣','🔵','⭐','🟣','🔵','⭐'];
  const tap=i=>setPopped(v=>v.includes(i)?v:[...v,i]);
  const complete=popped.length>=6;
  return <main className="app celebrationPage"><section className="panel brainBreak"><small>Brain break</small><h1>Pattern Pop</h1><p>Pop any six shapes. Can you notice a pattern while you play?</p><div className="popBoard">{shapes.map((s,i)=><button key={i} className={popped.includes(i)?'popped':''} onClick={()=>tap(i)}>{popped.includes(i)?'✨':s}</button>)}</div><div className="breakProgress">{Math.min(popped.length,6)} / 6 pops</div>{complete&&<div className="successNote">Brain refreshed! No points needed — breaks are part of learning.</div>}<button className="primary" onClick={onDone}>{complete?'I’m ready!':'Back when I’m ready'}</button></section></main>
}
