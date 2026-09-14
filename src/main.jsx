import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Volume2, Star, Coins, Building2, Lightbulb, Flame, Gamepad2, RotateCcw, ArrowRight, Minus, Plus} from 'lucide-react';
import './styles.css';
import {lessons, themes} from './data/lessons';
import {loadProgress, saveProgress} from './storage';

function speak(text){
  if('speechSynthesis' in window){
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.rate=.9;
    speechSynthesis.speak(u);
  }
}

function SelectPartsGame({lesson, theme, onSolved, transferred}){
  const [cells,setCells]=useState(Array(lesson.totalParts).fill(false));
  const [feedback,setFeedback]=useState('Tap the sections you want to fill.');
  const selected=useMemo(()=>cells.filter(Boolean).length,[cells]);
  const toggle=i=>setCells(v=>v.map((x,j)=>j===i?!x:x));
  const check=()=>{
    if(selected===lesson.targetSelected){
      setFeedback(lesson.explanation);
      onSolved(false);
    } else if(selected<lesson.targetSelected){
      setFeedback(`You have ${selected} of ${lesson.totalParts}. Add ${lesson.targetSelected-selected} more.`);
    } else {
      setFeedback(`You selected ${selected}. Leave exactly ${lesson.totalParts-lesson.targetSelected} part empty.`);
    }
  };
  const reset=()=>{setCells(Array(lesson.totalParts).fill(false));setFeedback('Tap the sections you want to fill.');};
  return <>
    <div className="cells">{cells.map((on,i)=><button key={i} aria-pressed={on} onClick={()=>toggle(i)} className={on?'filled':''}>{themes[theme].emoji}</button>)}</div>
    <button className="primary" onClick={check}>Check my build</button>
    <p className="feedback">{feedback}</p>
    <div className="gameActions"><button className="secondary" onClick={()=>setFeedback('Hint: split the whole into equal parts, then count how many should be filled.')}><Lightbulb size={18}/> Hint</button><button className="secondary" onClick={reset}><RotateCcw size={18}/> Reset</button></div>
    {transferred&&<p className="successNote">Transfer mastered in another context.</p>}
  </>;
}

function PatternChoiceGame({lesson, theme, onSolved}){
  const [feedback,setFeedback]=useState('Look for the rule, then tap what comes next.');
  const sequence=lesson.sequenceByTheme[theme];
  const choices=lesson.choicesByTheme[theme];
  const choose=index=>{
    if(index===lesson.correctIndex){setFeedback(lesson.explanation);onSolved(false);} else setFeedback('That does not continue the repeating rule. Look at positions 1 and 3, then 2 and 4.');
  };
  return <>
    <div className="sequence" aria-label="Visual pattern">{sequence.map((item,i)=><span key={i}>{item}</span>)}<span className="mystery">?</span></div>
    <div className="choices">{choices.map((item,i)=><button key={i} onClick={()=>choose(i)}>{item}</button>)}</div>
    <p className="feedback">{feedback}</p>
  </>;
}

function MatchSetGame({lesson,onSolved}){
  const [selected,setSelected]=useState([]);
  const [feedback,setFeedback]=useState('Tap every tile that belongs in the match.');
  const toggle=i=>setSelected(v=>v.includes(i)?v.filter(x=>x!==i):[...v,i]);
  const check=()=>{
    const correct=lesson.tiles.map((x,i)=>x.correct?i:null).filter(x=>x!==null);
    const exact=selected.length===correct.length && correct.every(i=>selected.includes(i));
    if(exact){setFeedback(lesson.explanation);onSolved(false);return;}
    const wrong=selected.filter(i=>!lesson.tiles[i].correct).length;
    if(wrong>0) setFeedback('One or more selected tiles do not represent the same amount. Try comparing each tile to the target.');
    else setFeedback('Good start. There are still matching representations hiding on the board.');
  };
  const reset=()=>{setSelected([]);setFeedback('Tap every tile that belongs in the match.');};
  return <>
    <div className="matchBoard" role="group" aria-label="Matching tiles">{lesson.tiles.map((tile,i)=><button key={i} aria-pressed={selected.includes(i)} className={selected.includes(i)?'matchTile selected':'matchTile'} onClick={()=>toggle(i)}>{tile.label}</button>)}</div>
    <button className="primary" onClick={check}>Lock in my matches</button>
    <p className="feedback">{feedback}</p>
    <div className="gameActions"><button className="secondary" onClick={()=>setFeedback('Hint: imagine each value as part of a 100-square grid. Which ones shade the same amount?')}><Lightbulb size={18}/> Visual hint</button><button className="secondary" onClick={reset}><RotateCcw size={18}/> Reset</button></div>
  </>;
}

function PourGame({lesson,onSolved}){
  const [amount,setAmount]=useState(0);
  const [feedback,setFeedback]=useState('Add or remove equal scoops until the fill level matches the target.');
  const add=()=>setAmount(v=>Math.min(1,Number((v+lesson.step).toFixed(2))));
  const remove=()=>setAmount(v=>Math.max(0,Number((v-lesson.step).toFixed(2))));
  const check=()=>{
    if(Math.abs(amount-lesson.target)<.001){setFeedback(lesson.explanation);onSolved(false);}
    else if(amount<lesson.target) setFeedback(`Not full enough yet. You are at ${Math.round(amount*100)}%. Add another equal scoop.`);
    else setFeedback(`A little too full. You are at ${Math.round(amount*100)}%. Remove one equal scoop.`);
  };
  return <>
    <div className="pourStage">
      <div className="beaker" aria-label={`Container is ${Math.round(amount*100)} percent full`}><div className="liquid" style={{height:`${amount*100}%`}}></div><div className="beakerLabel">{amount===0?'empty':`${Math.round(amount*100)}%`}</div></div>
      <div className="pourReadout"><strong>{amount===0?'0':amount===.25?'1/4':amount===.5?'1/2':amount===.75?'3/4':'1'} full</strong><span>{amount.toFixed(2)}</span></div>
    </div>
    <div className="pourControls"><button onClick={remove} disabled={amount===0}><Minus size={20}/> Remove 1/4</button><button onClick={add} disabled={amount===1}><Plus size={20}/> Add 1/4</button></div>
    <button className="primary" onClick={check}>Check the measurement</button>
    <p className="feedback">{feedback}</p>
    <div className="gameActions"><button className="secondary" onClick={()=>setFeedback(`Target: ${Math.round(lesson.target*100)}%. Watch how each quarter changes the fill level.`)}><Lightbulb size={18}/> Hint</button><button className="secondary" onClick={()=>setAmount(0)}><RotateCcw size={18}/> Empty it</button></div>
  </>;
}

function LessonGame({lesson, theme, onSolved, transferred}){
  if(lesson.mechanic==='pattern-choice') return <PatternChoiceGame lesson={lesson} theme={theme} onSolved={onSolved}/>;
  if(lesson.mechanic==='match-set') return <MatchSetGame lesson={lesson} onSolved={onSolved}/>;
  if(lesson.mechanic==='pour') return <PourGame lesson={lesson} onSolved={onSolved}/>;
  return <SelectPartsGame lesson={lesson} theme={theme} onSolved={onSolved} transferred={transferred}/>;
}

function App(){
  const initial=loadProgress();
  const [theme,setTheme]=useState(initial.theme);
  const [coins,setCoins]=useState(initial.coins);
  const [mastery,setMastery]=useState(initial.mastery);
  const [completedLessons,setCompletedLessons]=useState(initial.completedLessons || {});
  const [lessonIndex,setLessonIndex]=useState(0);
  const [tutorMessage,setTutorMessage]=useState('Your choices will shape the next challenge.');
  const lesson=lessons[lessonIndex];
  const completion=completedLessons[lesson.id] || {discovered:false, transferred:false};

  useEffect(()=>{saveProgress({theme,coins,mastery,completedLessons});},[theme,coins,mastery,completedLessons]);

  const markSolved=(isTransfer)=>{
    const current=completedLessons[lesson.id] || {discovered:false,transferred:false};
    if(isTransfer){
      if(current.transferred) return;
      setCoins(c=>c+lesson.rewards.transfer);
      setMastery(m=>m+1);
      setCompletedLessons(v=>({...v,[lesson.id]:{...current,transferred:true}}));
    } else {
      if(current.discovered) return;
      setCoins(c=>c+lesson.rewards.discover);
      setMastery(m=>m+1);
      setCompletedLessons(v=>({...v,[lesson.id]:{...current,discovered:true}}));
    }
  };

  const doTransfer=()=>{
    if(!completion.discovered || completion.transferred) return;
    markSolved(true);
  };

  const nextLesson=()=>setLessonIndex(i=>(i+1)%lessons.length);
  const prevLesson=()=>setLessonIndex(i=>(i-1+lessons.length)%lessons.length);
  const prompt=lesson.promptByTheme[theme];

  return <main className="app">
    <header className="hero"><div><small>2–4 minute learning game</small><h1>See it. Touch it. Figure it out.</h1><p>Master ideas through play, then use them again in a new context.</p></div><button className="secondary" onClick={()=>speak(`${lesson.title}. ${prompt}. ${lesson.intro}`)}><Volume2 size={18}/> Read to me</button></header>

    <section className="stats"><div><Building2/> City Lv. {1+Math.floor(mastery/2)}</div><div><Coins/> {coins} coins</div><div><Star/> {mastery} mastery</div></section>

    <section className="panel"><div className="sectionTitle"><div><h2>Choose a theme</h2><p>Same skill, different world.</p></div></div><div className="themes">{Object.entries(themes).map(([k,v])=><button key={k} onClick={()=>setTheme(k)} className={theme===k?'active':''}>{v.emoji} {v.label}</button>)}</div></section>

    <section className="lessonNav panel"><div><small>Lesson {lessonIndex+1} of {lessons.length}</small><h2>{lesson.title}</h2><p>{lesson.concept} · {lesson.reasoningSkill} · CogAT: {lesson.cogatSkill}</p></div><div className="navButtons"><button className="secondary" onClick={prevLesson}>Previous</button><button className="secondary" onClick={nextLesson}>Next <ArrowRight size={18}/></button></div></section>

    <section className="gameGrid">
      <div className="panel"><small>Difficulty {lesson.difficulty} · {lesson.mechanic}</small><h2>{lesson.title}</h2><p>{prompt}</p><LessonGame key={lesson.id} lesson={lesson} theme={theme} onSolved={markSolved} transferred={completion.transferred}/>{completion.discovered&&<div className="successNote">Discovery mastered +{lesson.rewards.discover} coins</div>}</div>

      <div className="panel"><h2>Connect the idea</h2>{lesson.equivalents?<div className="equiv">{lesson.equivalents.map((x,i)=><div key={i}>{x.icon}<b>{x.label}</b></div>)}</div>:<div className="transferCard"><p>{lesson.transfer.prompt}</p><p><b>Same structure, new context.</b> Flexible reasoning grows when the surface changes but the idea does not.</p></div>}<button className="secondary full" onClick={doTransfer} disabled={!completion.discovered || completion.transferred}>{completion.transferred?'Transfer bonus earned':completion.discovered?'I can explain the connection':'Discover the idea first'}</button>{completion.transferred&&<div className="reward">🎁 <b>{themes[theme].reward} unlocked!</b><span>Connection bonus +{lesson.rewards.transfer}</span></div>}</div>
    </section>

    <section className="panel"><h2>Train your tutor</h2><div className="tune"><button onClick={()=>setTutorMessage('Got it — I’ll move faster and remove some scaffolding.')}>😴 Too easy</button><button onClick={()=>setTutorMessage('Challenge mode: I’ll add another rule or constraint.')}><Flame size={18}/> Make it harder</button><button onClick={()=>setTutorMessage('I’ll keep the idea but make the next step more visual.')}>😵 Too challenging</button><button onClick={()=>{const keys=Object.keys(themes);setTheme(keys[(keys.indexOf(theme)+1)%keys.length]);setTutorMessage('Same learning target, new theme.');}}><Gamepad2 size={18}/> Make it more fun</button><button onClick={()=>setTutorMessage(`Another way: ${lesson.intro}`)}><Lightbulb size={18}/> Show another way</button></div><p className="feedback">{tutorMessage}</p></section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
