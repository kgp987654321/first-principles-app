import React,{useMemo,useState}from'react';
import'./townMicroInteractions.css';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function Frame({icon,title,kicker,children,takeaway,discovered,onClose,onGoTo,goLabel}){
  return <div className="microBackdrop" role="dialog" aria-modal="true" aria-label={title}>
    <section className="microPanel">
      <header className="microHeader">
        <div className="microTitle"><span>{icon}</span><div><small>{kicker}</small><h2>{title}</h2></div></div>
        <button className="microClose" onClick={onClose} aria-label="Close discovery">×</button>
      </header>
      <div className="microBody">{children}</div>
      <footer className="microFooter">
        <div className={`microTakeaway ${discovered?'discovered':''}`}><span>{discovered?'✨':'💡'}</span><div><small>{discovered?'DISCOVERY MADE':'WHAT TO NOTICE'}</small><b>{takeaway}</b></div></div>
        <div className="microFooterActions">
          {onGoTo&&<button className="microSecondary" onClick={onGoTo}>{goLabel||'Keep exploring'} →</button>}
          <button className="microPrimary" onClick={onClose}>{discovered?'Back to town ✓':'Back to town'}</button>
        </div>
      </footer>
    </section>
  </div>;
}

function WindLab({onClose,onGoTo}){
  const [wind,setWind]=useState(2);
  const [changed,setChanged]=useState(false);
  const settings=[
    {v:1,label:'Calm',icon:'🍃'},
    {v:2,label:'Breeze',icon:'🌬️'},
    {v:3,label:'Gust',icon:'💨'}
  ];
  const rpm=wind*12;
  const relativePower=wind*wind;
  return <Frame icon="🌀" title="Wind Lab" kicker="ENERGY IN MOTION" takeaway="Faster-moving air can make a turbine spin faster and transfer much more energy." discovered={changed} onClose={onClose} onGoTo={onGoTo} goLabel="Visit Science Studio">
    <div className="microPrompt">Change the wind. What happens to the turbine?</div>
    <div className="windExperiment">
      <div className="windScene">
        <span className={`windStream wind${wind}`}>➜ ➜ ➜</span>
        <div className="microTurbine"><i className="microTower"/><i className="microRotor" style={{animationDuration:`${4.8-wind*1.15}s`}}>✣</i></div>
      </div>
      <div className="windReadout">
        <div><small>TURBINE SPEED</small><strong>{rpm} rpm</strong></div>
        <div><small>RELATIVE ENERGY</small><strong>{relativePower}×</strong></div>
      </div>
    </div>
    <div className="microChoiceRow">
      {settings.map(s=><button key={s.v} className={wind===s.v?'active':''} onClick={()=>{setWind(s.v);setChanged(true)}}><span>{s.icon}</span><b>{s.label}</b></button>)}
    </div>
  </Frame>;
}

function ForestTrail({onClose,onGoTo}){
  const [answer,setAnswer]=useState(null);
  const correct='●';
  const solved=answer===correct;
  return <Frame icon="🌲" title="Forest Pattern Trail" kicker="MAKE CONNECTIONS" takeaway={solved?'The pattern alternates triangle, circle, triangle, circle — so the next shape is a circle.':'Look for what repeats, changes, or alternates.'} discovered={solved} onClose={onClose} onGoTo={onGoTo} goLabel="Visit Pattern Pavilion">
    <div className="microPrompt">A trail marker is missing. Which shape belongs next?</div>
    <div className="patternTrail"><span>▲</span><i/><span>●</span><i/><span>▲</span><i/><span>●</span><i/><span className="mystery">?</span></div>
    <div className="microChoiceRow patternChoices">
      {['■','●','▲'].map(choice=><button key={choice} className={answer===choice?(choice===correct?'correct':'wrong'):''} onClick={()=>setAnswer(choice)}><span className="shapeChoice">{choice}</span></button>)}
    </div>
    {answer&&<div className={`microFeedback ${solved?'good':'try'}`}>{solved?'Exactly — you found the repeating rule!':'Not this one. Trace the pattern from the beginning.'}</div>}
  </Frame>;
}

function ShoreCurrent({onClose,onGoTo}){
  const [boat,setBoat]=useState(3);
  const [current,setCurrent]=useState(1);
  const [changed,setChanged]=useState(false);
  const ground=clamp(boat+current,0,7);
  const direction=current<0?'against you':current>0?'with you':'still';
  return <Frame icon="⛵" title="Shore Current Lab" kicker="SPEED + DIRECTION" takeaway="Your speed over the shore combines your boat's speed with the water's current." discovered={changed} onClose={onClose} onGoTo={onGoTo} goLabel="Visit Science Studio">
    <div className="microPrompt">Change the boat speed and river current. Watch the speed over the shore.</div>
    <div className="shoreScene">
      <div className="shoreWater"><span className="currentArrows">{current<0?'← ← ←':current>0?'→ → →':'· · ·'}</span><span className="microBoat" style={{left:`${12+ground*10}%`}}>⛵</span></div>
      <div className="shoreEquation"><span>{boat}</span><b>+</b><span>{current>0?'+':''}{current}</span><b>=</b><strong>{ground}</strong><small>speed over shore</small></div>
    </div>
    <div className="sliderGroup">
      <label><span>Boat speed <b>{boat}</b></span><input type="range" min="1" max="5" value={boat} onChange={e=>{setBoat(Number(e.target.value));setChanged(true)}}/></label>
      <label><span>Current <b>{current>0?'+':''}{current}</b> <em>({direction})</em></span><input type="range" min="-2" max="2" value={current} onChange={e=>{setCurrent(Number(e.target.value));setChanged(true)}}/></label>
    </div>
  </Frame>;
}

function CliffsLaunch({onClose,onGoTo}){
  const [angle,setAngle]=useState(45);
  const [tries,setTries]=useState(new Set([45]));
  const radians=angle*Math.PI/180;
  const range=Math.sin(2*radians);
  const height=Math.sin(radians)**2;
  const endX=80+range*250;
  const peakY=150-height*105;
  const path=`M 55 155 Q ${(55+endX)/2} ${peakY} ${endX} 155`;
  const discovered=tries.size>=2;
  const choose=a=>{setAngle(a);setTries(prev=>new Set([...prev,a]))};
  return <Frame icon="⛰️" title="Cliff Launch Lab" kicker="ANGLES + TRAJECTORY" takeaway="With the same launch speed, a middle angle can balance height and forward distance." discovered={discovered} onClose={onClose} onGoTo={onGoTo} goLabel="Visit Think Tank">
    <div className="microPrompt">Try different launch angles. Which one travels farthest?</div>
    <div className="launchScene">
      <svg viewBox="0 0 380 190" aria-label="Launch trajectory">
        <path className="launchGround" d="M20 157 H360"/>
        <path className="launchCliff" d="M25 157 L55 105 L80 157 Z"/>
        <path className="launchArc" d={path}/>
        <circle className="launchBall" cx={endX} cy="155" r="7"/>
      </svg>
      <div className="launchReadout"><span><small>ANGLE</small><b>{angle}°</b></span><span><small>RELATIVE RANGE</small><b>{Math.round(range*100)}%</b></span><span><small>HEIGHT</small><b>{Math.round(height*100)}%</b></span></div>
    </div>
    <div className="microChoiceRow">
      {[25,45,65].map(a=><button key={a} className={angle===a?'active':''} onClick={()=>choose(a)}><b>{a}°</b><small>{a===25?'Low':a===45?'Middle':'High'}</small></button>)}
    </div>
  </Frame>;
}

export function TownMicroExperience({id,onClose,onGoTo}){
  const props={onClose,onGoTo};
  if(id==='windlab')return <WindLab {...props}/>;
  if(id==='forest')return <ForestTrail {...props}/>;
  if(id==='shore')return <ShoreCurrent {...props}/>;
  if(id==='cliffs')return <CliffsLaunch {...props}/>;
  return null;
}
