import React,{useEffect,useMemo,useRef,useState}from'react';
import'./pinballLab.css';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const board={w:360,h:520,r:9};
const bumpers=[
  {x:88,y:135,r:27,label:'ANGLE',points:15},
  {x:235,y:118,r:30,label:'FORCE',points:20},
  {x:165,y:250,r:32,label:'VECTOR',points:25},
  {x:285,y:285,r:25,label:'BOUNCE',points:15}
];

function targetsFor(lesson){
  const m=lesson.expandedMechanic||lesson.mechanic;
  if(m==='slope'){
    const rise=lesson.riseTarget??2,run=lesson.runTarget??4;
    return{angle:Math.round(Math.atan(rise/run)*180/Math.PI),force:8,idea:'Slope becomes a launch angle: rise/run controls steepness.'};
  }
  if(m==='vector'){
    const x=lesson.targetX??4,y=lesson.targetY??3;
    return{angle:Math.round(Math.atan(y/x)*180/Math.PI),force:8,idea:'A launch vector combines an across push and an upward push.'};
  }
  if(m==='energy')return{angle:45,force:clamp(Math.round((lesson.targetSpeed??8)/1.1),5,11),idea:'More launch force gives the ball more kinetic energy.'};
  if(m==='momentum')return{angle:40,force:clamp(Math.round(Math.sqrt(lesson.target??12)*2),5,11),idea:'A faster moving ball carries more momentum into a collision.'};
  if(m==='gravity')return{angle:50,force:clamp(Math.round((lesson.power??10)*.8),5,11),idea:'Gravity bends the path downward while the launch pushes forward.'};
  if(m==='launch')return{angle:45,force:8,idea:'Angle sets direction; force sets how strongly the ball starts moving.'};
  return{angle:45,force:8,idea:'Geometry sets direction. Force changes motion.'};
}

export function PinballLab({lesson}){
  const target=useMemo(()=>targetsFor(lesson),[lesson]);
  const[angle,setAngle]=useState(target.angle);
  const[force,setForce]=useState(6);
  const[score,setScore]=useState(0);
  const[hits,setHits]=useState(0);
  const[missionWon,setMissionWon]=useState(false);
  const[message,setMessage]=useState('Tune the launch, then send the ball into the machine.');
  const[running,setRunning]=useState(false);
  const[leftFlip,setLeftFlip]=useState(false);
  const[rightFlip,setRightFlip]=useState(false);
  const ballEl=useRef(null);
  const raf=useRef(null);
  const state=useRef({x:326,y:460,vx:0,vy:0,last:0,cooldowns:new Map(),running:false});
  const angleRad=angle*Math.PI/180;
  const across=(force*Math.cos(angleRad)).toFixed(1);
  const up=(force*Math.sin(angleRad)).toFixed(1);

  const paint=()=>{
    const b=state.current;
    if(ballEl.current){
      ballEl.current.setAttribute('cx',String(b.x));
      ballEl.current.setAttribute('cy',String(b.y));
    }
  };

  const resetBall=(note='Ready for another launch.')=>{
    const b=state.current;
    b.x=326;b.y=460;b.vx=0;b.vy=0;b.running=false;b.last=0;b.cooldowns=new Map();
    setRunning(false);setMessage(note);paint();
  };

  const launch=()=>{
    const b=state.current;
    if(b.running)return;
    const rad=angle*Math.PI/180;
    b.x=326;b.y=460;
    b.vx=-Math.cos(rad)*force*.92;
    b.vy=-Math.sin(rad)*force*.92;
    b.running=true;b.last=0;b.cooldowns=new Map();
    setRunning(true);
    setMessage('Ball live! Use the flippers near the bottom.');
    const goodAngle=Math.abs(angle-target.angle)<=2;
    const goodForce=Math.abs(force-target.force)<=1;
    if(goodAngle&&goodForce)setMissionWon(true);
  };

  const flip=(side)=>{
    const b=state.current;
    const left=side==='left';
    left?setLeftFlip(true):setRightFlip(true);
    setTimeout(()=>left?setLeftFlip(false):setRightFlip(false),140);
    if(!b.running)return;
    const inZone=b.y>365&&b.y<485&&(left?b.x<205:b.x>155);
    if(inZone){
      b.vy=-7.2-force*.18;
      b.vx+=(left?1.7:-1.7);
      setMessage(left?'Left flipper adds an upward-right impulse.':'Right flipper adds an upward-left impulse.');
    }
  };

  useEffect(()=>{
    const tick=t=>{
      const b=state.current;
      if(b.running){
        const dt=b.last?clamp((t-b.last)/16.67,.5,1.8):1;
        b.last=t;
        b.vy+=.155*dt;
        b.x+=b.vx*dt;b.y+=b.vy*dt;

        if(b.x<board.r){b.x=board.r;b.vx=Math.abs(b.vx)*.86}
        if(b.x>board.w-board.r){b.x=board.w-board.r;b.vx=-Math.abs(b.vx)*.86}
        if(b.y<board.r){b.y=board.r;b.vy=Math.abs(b.vy)*.86}

        for(const bumper of bumpers){
          const dx=b.x-bumper.x,dy=b.y-bumper.y,d=Math.hypot(dx,dy),touch=board.r+bumper.r;
          if(d<touch&&d>0){
            const nx=dx/d,ny=dy/d,dot=b.vx*nx+b.vy*ny;
            if(dot<0){
              b.x=bumper.x+nx*touch;b.y=bumper.y+ny*touch;
              b.vx=(b.vx-2*dot*nx)*1.03;
              b.vy=(b.vy-2*dot*ny)*1.03;
              const last=b.cooldowns.get(bumper.label)||0;
              if(t-last>260){
                b.cooldowns.set(bumper.label,t);
                setScore(s=>s+bumper.points);
                setHits(h=>h+1);
                setMessage(`${bumper.label} bumper! The ball reflected away from the surface normal.`);
              }
            }
          }
        }

        if(b.y>board.h+18)resetBall('Ball drained. Change the geometry or force and try another shot.');
        paint();
      }
      raf.current=requestAnimationFrame(tick);
    };
    raf.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf.current);
  },[]);

  const resetGame=()=>{setScore(0);setHits(0);setMissionWon(false);setAngle(target.angle);setForce(6);resetBall('Fresh machine. Tune your next shot.')};

  return <section className="pinballLab">
    <div className="pinballIntro">
      <div><small>PINBALL LAB · GEOMETRY + FORCES</small><h3>Learn it. Test it. Play it.</h3><p>{target.idea}</p></div>
      <div className="pinballScore"><b>{score}</b><small>POINTS</small><span>{hits} bumper hits</span></div>
    </div>

    <div className="pinballLearn">
      <div className="pinballVectorPreview">
        <svg viewBox="0 0 220 145" aria-label={`Launch vector at ${angle} degrees with force ${force}`}>
          <line x1="26" y1="120" x2="202" y2="120" className="pvAxis"/>
          <line x1="26" y1="120" x2="26" y2="18" className="pvAxis"/>
          <line x1="38" y1="110" x2={38+Math.cos(angleRad)*120} y2={110-Math.sin(angleRad)*120} className="pvArrow"/>
          <line x1="38" y1="110" x2={38+Math.cos(angleRad)*120} y2="110" className="pvAcross"/>
          <line x1={38+Math.cos(angleRad)*120} y1="110" x2={38+Math.cos(angleRad)*120} y2={110-Math.sin(angleRad)*120} className="pvUp"/>
          <text x="92" y="136">across {across}</text><text x="148" y="64">up {up}</text>
        </svg>
      </div>
      <div className="pinballTuning">
        <label><span>ANGLE <b>{angle}°</b></span><input type="range" min="15" max="75" value={angle} onChange={e=>setAngle(+e.target.value)} disabled={running}/></label>
        <label><span>FORCE <b>{force}</b></span><input type="range" min="4" max="12" value={force} onChange={e=>setForce(+e.target.value)} disabled={running}/></label>
        <div className={missionWon?'pinballMission won':'pinballMission'}><small>TEST MISSION</small><b>Set about {target.angle}° and force {target.force}</b><span>{missionWon?'✓ Setup mastered':'Launch from the target setup to prove it.'}</span></div>
      </div>
    </div>

    <div className="pinballMachineWrap">
      <svg className="pinballMachine" viewBox="0 0 360 520" role="img" aria-label="Interactive pinball machine">
        <defs><linearGradient id="boardGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eef7ff"/><stop offset="1" stopColor="#f7f3ff"/></linearGradient></defs>
        <rect x="4" y="4" width="352" height="512" rx="26" className="pinballCabinet"/>
        <path d="M315 490 L315 72 Q315 38 340 28" className="shooterLane"/>
        <path d="M38 360 Q92 318 128 360" className="pinballRail"/>
        <path d="M225 350 Q275 312 312 350" className="pinballRail"/>
        {bumpers.map((b,i)=><g key={b.label} className="pinBumper"><circle cx={b.x} cy={b.y} r={b.r}/><circle cx={b.x} cy={b.y} r={b.r-7}/><text x={b.x} y={b.y+4}>{b.points}</text></g>)}
        <g className={leftFlip?'flipper active left':'flipper left'}><line x1="78" y1="438" x2="155" y2="454"/></g>
        <g className={rightFlip?'flipper active right':'flipper right'}><line x1="282" y1="438" x2="205" y2="454"/></g>
        <circle ref={ballEl} cx="326" cy="460" r={board.r} className="pinballBall"/>
        <text x="180" y="42" className="pinballBoardTitle">FIRST PRINCIPLES PINBALL</text>
      </svg>
      <div className="pinballLiveReadout">{message}</div>
    </div>

    <div className="pinballButtons">
      <button className={leftFlip?'flipperButton active':''} onPointerDown={()=>flip('left')}>◀ LEFT FLIPPER</button>
      <button className="launchButton" onClick={launch} disabled={running}>{running?'BALL LIVE':'LAUNCH'}</button>
      <button className={rightFlip?'flipperButton active':''} onPointerDown={()=>flip('right')}>RIGHT FLIPPER ▶</button>
    </div>
    <div className="pinballFooter"><span><b>Angle</b> changes direction</span><span><b>Force</b> changes starting speed</span><span><b>Bounces</b> reflect off surfaces</span><button onClick={resetGame}>↻ Reset machine</button></div>
  </section>
}
