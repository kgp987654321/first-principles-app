import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Volume2, Star, Coins, Building2, Lightbulb, Flame, Gamepad2, RotateCcw, ArrowRight} from 'lucide-react';
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

function LessonGame({lesson, theme, onSolved, transferred}){
  if(lesson.mechanic==='pattern-choice') return <PatternChoiceGame lesson={lesson} theme={theme} onSolved={onSolved}/>;
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
    if(!completion.discovered) return;
    markSolved(true);
  };

  const nextLesson=()=>setLessonIndex(i=>(i+1)%lessons.length);
  const prompt=lesson.promptByTheme[theme];

  return <main className="app">
    <header className="hero"><div><small>2–4 minute learning game</small><h1>See it. Touch it. Figure it out.</h1><p>Master ideas through play, then use them again in a new context.</p></div><button className="secondary" onClick={()=>speak(`${lesson.title}. ${prompt}`)}><Volume2 size={18}/> Read to me</button></header>

    <section className="stats"><div><Building2/> City Lv. {1+Math.floor(mastery/2)}</div><div><Coins/> {coins} coins</div><div><Star/> {mastery} mastery</div></section>

    <section className="panel"><div className="sectionTitle"><div><h2>Choose a theme</h2><p>Same skill, different world.</p></div></div><div className="themes">{Object.entries(themes).map(([k,v])=><button key={k} onClick={()=>setTheme(k)} className={theme===k?'active':''}>{v.emoji} {v.label}</button>)}</div></section>

    <section className="lessonNav panel"><div><small>Lesson {lessonIndex+1} of {lessons.length}</small><h2>{lesson.title}</h2><p>{lesson.concept} · {lesson.reasoningSkill} · CogAT: {lesson.cogatSkill}</p></div><button className="secondary" onClick={nextLesson}>Next lesson <ArrowRight size={18}/></button></section>

    <section className="gameGrid">
      <div className="panel"><small>Difficulty {lesson.difficulty} · {lesson.mechanic}</small><h2>{lesson.title}</h2><p>{prompt}</p><LessonGame lesson={lesson} theme={theme} onSolved={markSolved} transferred={completion.transferred}/>{completion.discovered&&<div className="successNote">Discovery mastered +{lesson.rewards.discover} coins</div>}</div>

      <div className="panel"><h2>Connect the idea</h2>{lesson.equivalents?<div className="equiv">{lesson.equivalents.map((x,i)=><div key={i}>{x.icon}<b>{x.label}</b></div>)}</div>:<div className="transferCard"><p>{lesson.transfer.prompt}</p><p><b>Same rule, new objects.</b> This is how transfer builds flexible reasoning.</p></div>}<button className="secondary full" onClick={doTransfer} disabled={!completion.discovered || completion.transferred}>{completion.transferred?'Transfer mastered':completion.discovered?'Master transfer challenge':'Discover the idea first'}</button>{completion.transferred&&<div className="reward">🎁 <b>{themes[theme].reward} unlocked!</b><span>Persistence + transfer bonus +{lesson.rewards.transfer}</span></div>}</div>
    </section>

    <section className="panel"><h2>Train your tutor</h2><div className="tune"><button onClick={()=>setTutorMessage('Got it — I’ll move faster and remove some scaffolding.')}>😴 Too easy</button><button onClick={()=>setTutorMessage('Challenge mode: I’ll add another rule or constraint.')}><Flame size={18}/> Make it harder</button><button onClick={()=>setTutorMessage('I’ll keep the idea but make the next step more visual.')} >😵 Too challenging</button><button onClick={()=>{const keys=Object.keys(themes);setTheme(keys[(keys.indexOf(theme)+1)%keys.length]);setTutorMessage('Same learning target, new theme.');}}><Gamepad2 size={18}/> Make it more fun</button><button onClick={()=>setTutorMessage(`Another way: ${lesson.intro}`)}><Lightbulb size={18}/> Show another way</button></div><p className="feedback">{tutorMessage}</p></section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
