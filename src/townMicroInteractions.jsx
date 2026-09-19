import React,{useMemo,useRef,useState}from'react';
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
  const steps=[
    {clue:['▲','●','▲','?'],answer:'●',from:[12,82],options:[{s:'●',x:29,y:70},{s:'■',x:23,y:52},{s:'▲',x:38,y:84}],explain:'Triangle, circle repeats — follow the circle marker.'},
    {clue:['■','■','●','■','■','?'],answer:'●',from:[29,70],options:[{s:'▲',x:42,y:55},{s:'●',x:47,y:73},{s:'■',x:39,y:88}],explain:'Two squares, then a circle — the next marker is circle.'},
    {clue:['●','▲','■','●','▲','?'],answer:'■',from:[47,73],options:[{s:'●',x:63,y:80},{s:'■',x:57,y:50},{s:'▲',x:69,y:65}],explain:'Circle, triangle, square repeats — follow the square.'},
    {clue:['◆','○','○','◆','○','?'],answer:'○',from:[57,50],options:[{s:'■',x:67,y:30},{s:'○',x:73,y:38},{s:'◆',x:76,y:56}],explain:'Diamond, circle, circle repeats — the next marker is circle.'}
  ];
  const route=[[12,82],[29,70],[47,73],[57,50],[73,38],[88,18]];
  const[stage,setStage]=useState(0),[wrong,setWrong]=useState(null),[attempts,setAttempts]=useState(0);
  const solved=stage>=steps.length,current=steps[Math.min(stage,steps.length-1)],position=solved?route[route.length-1]:route[stage];
  const choose=option=>{
    if(solved)return;
    setAttempts(v=>v+1);
    if(option.s===current.answer){setWrong(null);setStage(v=>v+1)}
    else setWrong(option.s);
  };
  return <Frame icon="🌲" title="Forest Pattern Maze" kicker="FOLLOW THE TRAIL MARKERS" takeaway={solved?'You navigated the maze by identifying each repeating rule, then following the matching trail marker.':'At each fork, find the pattern rule before choosing a trail.'} discovered={solved} onClose={onClose} onGoTo={onGoTo} goLabel="Visit Pattern Pavilion">
    <div className="microPrompt">{solved?'You made it to the lookout!':'Fork '+(stage+1)+' of '+steps.length+': which trail marker continues the pattern?'}</div>
    <div className="forestMazeMap">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="forestMainTrail" d="M12 82 L29 70 L47 73 L57 50 L73 38 L88 18"/>
        <path className="forestBranchTrail" d="M12 82 L23 52 M12 82 L38 84 M29 70 L42 55 M29 70 L39 88 M47 73 L63 80 M47 73 L69 65 M57 50 L67 30 M57 50 L76 56"/>
        {route.slice(0,solved?route.length:Math.min(stage+1,route.length)).map((p,i)=>i?<line key={i} className="forestSolvedTrail" x1={route[i-1][0]} y1={route[i-1][1]} x2={p[0]} y2={p[1]}/>:null)}
      </svg>
      <div className="forestTrees" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
      <div className="forestLookout">🏕️<span>LOOKOUT</span></div>
      <div className="forestExplorer" style={{left:position[0]+'%',top:position[1]+'%'}}>🧒</div>
      {!solved&&<>
        <div className="forestClueSign"><small>TRAIL SIGN</small><div>{current.clue.map((x,i)=><span key={i}>{x}</span>)}</div></div>
        {current.options.map((o,i)=><button key={o.s+i} className={'forestTrailChoice '+(wrong===o.s?'wrong':'')} style={{left:o.x+'%',top:o.y+'%'}} onClick={()=>choose(o)}><span>{o.s}</span><small>take trail</small></button>)}
      </>}
      {solved&&<div className="forestMazeWin"><span>✨</span><b>LOOKOUT REACHED!</b><small>{attempts} trail choices</small></div>}
    </div>
    {!solved&&<div className={'microFeedback '+(wrong?'try':'')}>{wrong?'That marker breaks the rule. Return to the sign and compare the smallest repeating unit.':current.explain}</div>}
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
  const svgRef=useRef(null);
  const levels=[
    {name:'Warm-up stack',solution:{angle:28,power:58},blocks:2},
    {name:'High arc crates',solution:{angle:42,power:70},blocks:3},
    {name:'Steep launch tower',solution:{angle:58,power:64},blocks:4}
  ];
  const anchorX=74,groundY=158,maxPull=72;
  const shotModel=(a,p)=>{
    const r=a*Math.PI/180;
    const range=Math.sin(2*r)*(p/100)*300;
    const height=Math.sin(r)*Math.sin(r)*(p/100)*225;
    const endX=anchorX+range;
    const peakY=groundY-height;
    const path='M '+anchorX+' '+groundY+' Q '+((anchorX+endX)/2)+' '+peakY+' '+endX+' '+groundY;
    return{endX,peakY,path,range,height};
  };
  const[level,setLevel]=useState(0),[angle,setAngle]=useState(34),[power,setPower]=useState(55),[dragging,setDragging]=useState(false),[launched,setLaunched]=useState(false),[shotKey,setShotKey]=useState(0),[attempts,setAttempts]=useState(0),[best,setBest]=useState(null);
  const current=levels[level],solutionShot=shotModel(current.solution.angle,current.solution.power),targetX=solutionShot.endX;
  const shot=shotModel(angle,power),error=Math.abs(shot.endX-targetX),hit=launched&&error<=14,close=launched&&error>14&&error<=30,discovered=best!==null&&best<=14;
  const pullLen=maxPull*(power/100),r=angle*Math.PI/180,pullX=anchorX-Math.cos(r)*pullLen,pullY=groundY+Math.sin(r)*pullLen;
  const updateFromPointer=e=>{
    const svg=svgRef.current;if(!svg)return{angle,power};
    const rect=svg.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width*380,y=(e.clientY-rect.top)/rect.height*200;
    const dx=Math.max(8,anchorX-x),dy=Math.max(3,y-groundY),dist=Math.min(maxPull,Math.hypot(dx,dy));
    const nextAngle=Math.round(clamp(Math.atan2(dy,dx)*180/Math.PI,15,72));
    const nextPower=Math.round(clamp(dist/maxPull*100,25,100));
    setAngle(nextAngle);setPower(nextPower);setLaunched(false);
    return{angle:nextAngle,power:nextPower};
  };
  const fire=(override)=>{
    const a=override?.angle??angle,p=override?.power??power,next=shotModel(a,p),miss=Math.abs(next.endX-targetX);
    setAngle(a);setPower(p);setLaunched(true);setShotKey(k=>k+1);setAttempts(v=>v+1);setBest(v=>v===null?miss:Math.min(v,miss));
  };
  const startDrag=e=>{e.preventDefault();setDragging(true);e.currentTarget.setPointerCapture?.(e.pointerId)};
  const moveDrag=e=>{if(dragging)updateFromPointer(e)};
  const endDrag=e=>{if(!dragging)return;const next=updateFromPointer(e);setDragging(false);e.currentTarget.releasePointerCapture?.(e.pointerId);fire(next)};
  const reset=()=>{setAngle(34);setPower(55);setLaunched(false);setBest(null);setAttempts(0)};
  const nextLevel=()=>{setLevel(i=>(i+1)%levels.length);reset()};
  const feedback=!launched?'Grab the ball, pull back and down, then release. Farther pull = more force.':hit?'SMASH! You knocked down the target.':close?'So close — make a small change to angle or pull-back distance.':shot.endX<targetX?'Too short — pull farther back or try a more efficient angle.':'Too far — use less force or a steeper/flatter angle.';
  return <Frame icon="⛰️" title="Cliff Launch Lab" kicker="PULL · AIM · RELEASE" takeaway={hit?'You controlled two variables at once: direction came from the pull angle, while pull-back distance controlled force.':'Angle changes direction and height. Pull-back distance changes force and range.'} discovered={discovered} onClose={onClose} onGoTo={onGoTo} goLabel="Visit Think Tank">
    <div className="microPrompt"><b>{current.name}</b> · Knock over the target stack. Every level was generated from a real angle + force solution.</div>
    <div className="angryLaunchShell">
      <div className="angryLaunchStage">
        <svg ref={svgRef} viewBox="0 0 380 200" onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={()=>setDragging(false)} aria-label={'Slingshot angle '+angle+' degrees and '+power+' percent force'}>
          <rect x="0" y="0" width="380" height="130" className="angrySky"/>
          <path d="M0 160 Q65 135 125 154 T250 151 T380 154 L380 200 L0 200 Z" className="angryGround"/>
          <circle cx="36" cy="42" r="16" className="angrySun"/>
          <path d="M18 92 Q45 72 69 94 T118 92" className="angryCloud"/>
          <path d="M40 158 L58 118 L68 158 Z" className="angryCliff"/>
          <g className="slingshot">
            <line x1="64" y1="160" x2="64" y2="116"/>
            <line x1="84" y1="160" x2="84" y2="116"/>
            <line x1="64" y1="118" x2={pullX} y2={pullY}/>
            <line x1="84" y1="118" x2={pullX} y2={pullY}/>
          </g>
          <path d={shot.path} className="angryPreview"/>
          <g className={'angryTarget '+(hit?'knocked':'')} transform={'translate('+targetX+' 0)'}>
            <rect x="-26" y="137" width="52" height="21" rx="3" className="targetPlatform"/>
            {Array.from({length:current.blocks},(_,i)=><rect key={i} x={-18+(i%2)*18} y={136-Math.floor(i/2)*20} width="17" height="18" rx="2" className="targetCrate"/>)}
            <circle cx="0" cy={current.blocks>2?96:116} r="11" className="targetCritter"/>
            <circle cx="-4" cy={current.blocks>2?93:113} r="1.6" className="targetEye"/>
            <circle cx="4" cy={current.blocks>2?93:113} r="1.6" className="targetEye"/>
          </g>
          <g className="pullBall" transform={'translate('+pullX+' '+pullY+')'} onPointerDown={startDrag}>
            <circle r="12"/>
            <circle cx="-4" cy="-3" r="2" className="pullEye"/>
            <path d="M-6 4 Q0 8 6 4" className="pullSmile"/>
          </g>
          {launched&&<circle key={shotKey} className={'flyingLaunchBall '+(hit?'hit':'')} r="10" cx={anchorX} cy={groundY}><animateMotion dur=".65s" path={shot.path} fill="freeze"/></circle>}
          <g className="angryAngleReadout"><path d={'M '+(anchorX+27)+' '+groundY+' A 27 27 0 0 0 '+(anchorX+Math.cos(r)*27)+' '+(groundY-Math.sin(r)*27)}/><text x={anchorX+30} y={groundY-12}>{angle}°</text></g>
        </svg>
        <div className="pullInstruction">{dragging?'Keep pulling… release to fire!':'👆 Grab the ball and pull it backward'}</div>
      </div>
      <aside className="angryLaunchHud">
        <span><small>ANGLE</small><b>{angle}°</b></span>
        <span><small>FORCE</small><b>{power}%</b></span>
        <span><small>ATTEMPTS</small><b>{attempts}</b></span>
        <span className={hit?'hudHit':''}><small>RESULT</small><b>{!launched?'READY':hit?'SMASH!':close?'CLOSE':'ADJUST'}</b></span>
      </aside>
    </div>
    <div className="angryFallbackControls">
      <label><span>Angle</span><input type="range" min="15" max="72" value={angle} onChange={e=>{setAngle(+e.target.value);setLaunched(false)}}/><b>{angle}°</b></label>
      <label><span>Force</span><input type="range" min="25" max="100" value={power} onChange={e=>{setPower(+e.target.value);setLaunched(false)}}/><b>{power}%</b></label>
    </div>
    <div className="targetLaunchActions">
      <button type="button" className="launchNowButton" onClick={()=>fire()}>🚀 Launch current setup</button>
      <button type="button" className="newTargetButton" onClick={nextLevel}>🎯 Next level</button>
    </div>
    <div className={'microFeedback '+(hit?'good':launched?'try':'')}>{feedback}{best!==null&&<small> Best miss: {Math.round(best)} units · This target is solvable at about {current.solution.angle}° and {current.solution.power}% force.</small>}</div>
    {hit&&<div className="angleDiscovery"><b>✨ You found a working vector</b><span>Try to hit the same stack again with a different combination. A higher arc can sometimes reach the same distance with different force.</span></div>}
  </Frame>;
}
function BuildersBalance({onClose,onGoTo}){
  const [slot,setSlot]=useState(2);
  const [tries,setTries]=useState(new Set([2]));
  const leftWeight=2,leftDistance=2,rightWeight=1;
  const leftMoment=leftWeight*leftDistance;
  const rightMoment=rightWeight*slot;
  const delta=rightMoment-leftMoment;
  const tilt=clamp(delta*4,-14,14);
  const balanced=delta===0;
  const choose=value=>{setSlot(value);setTries(prev=>new Set([...prev,value]))};
  return <Frame icon="🏗️" title="Builders’ Balance Yard" kicker="LOAD × DISTANCE" takeaway={balanced?'Balance depends on both weight and distance from the pivot. 2 × 2 balances 1 × 4.':'A lighter load can balance a heavier one if it is farther from the pivot.'} discovered={balanced} onClose={onClose} onGoTo={onGoTo} goLabel="Enter Builders’ Yard">
    <div className="microPrompt">A 2-unit crate sits 2 spaces from the pivot. Where should the 1-unit crate go to balance the beam?</div>
    <div className="balanceScene">
      <div className="balanceBeamWrap">
        <div className="balanceBeam" style={{transform:'rotate('+tilt+'deg)'}}>
          <span className="load leftLoad">📦<b>2</b></span>
          <span className="load rightLoad" style={{right:(10+(4-slot)*14)+'%'}}>📦<b>1</b></span>
          <i className="beamTick t1"/><i className="beamTick t2"/><i className="beamTick t3"/><i className="beamTick t4"/>
        </div>
        <div className="balancePivot">▲</div>
      </div>
      <div className="momentReadout">
        <span><small>LEFT MOMENT</small><b>{leftWeight} × {leftDistance} = {leftMoment}</b></span>
        <span className={balanced?'balanced':''}><small>RIGHT MOMENT</small><b>{rightWeight} × {slot} = {rightMoment}</b></span>
      </div>
    </div>
    <div className="microChoiceRow">
      {[1,2,4].map(v=><button key={v} className={slot===v?(balanced?'correct':'active'):''} onClick={()=>choose(v)}><b>{v} space{v>1?'s':''}</b><small>from pivot</small></button>)}
    </div>
    {tries.size>1&&<div className={'microFeedback '+(balanced?'good':'try')}>{balanced?'Balanced! Equal turning effects keep the beam level.':'Still tilted — compare the two multiplication results.'}</div>}
  </Frame>;
}

function GardenRatio({onClose,onGoTo}){
  const [answer,setAnswer]=useState(null);
  const correct=6;
  const solved=answer===correct;
  const flowers=n=>Array.from({length:n},(_,i)=><i key={i}>✿</i>);
  return <Frame icon="🌱" title="Garden Ratio Beds" kicker="SCALE A PATTERN" takeaway={solved?'Doubling 2 sunflowers to 4 means doubling 3 daisies to 6. The 2:3 ratio stays the same.':'When one part of a ratio scales, the other part must scale by the same factor.'} discovered={solved} onClose={onClose} onGoTo={onGoTo} goLabel="Enter Learning Greenhouse">
    <div className="microPrompt">The first bed has 2 sunflowers for every 3 daisies. The second bed has 4 sunflowers. How many daisies keep the same ratio?</div>
    <div className="gardenRatioScene">
      <div className="ratioBed">
        <small>BED 1</small>
        <div className="flowerRow sunflowers">{flowers(2)}</div>
        <div className="flowerRow daisies">{flowers(3)}</div>
        <b>2 : 3</b>
      </div>
      <div className="ratioArrow">×2 →</div>
      <div className="ratioBed target">
        <small>BED 2</small>
        <div className="flowerRow sunflowers">{flowers(4)}</div>
        <div className="flowerRow daisies">{answer?flowers(answer):<span className="flowerMystery">?</span>}</div>
        <b>4 : {answer||'?'}</b>
      </div>
    </div>
    <div className="microChoiceRow">
      {[5,6,8].map(v=><button key={v} className={answer===v?(v===correct?'correct':'wrong'):''} onClick={()=>setAnswer(v)}><b>{v} daisies</b></button>)}
    </div>
    {answer&&<div className={'microFeedback '+(solved?'good':'try')}>{solved?'Exactly — both parts doubled.':'That changes the ratio. What happened to 2 when it became 4?'}</div>}
  </Frame>;
}

function ObservatoryOrbit({onClose,onGoTo}){
  const [radius,setRadius]=useState(2);
  const [changed,setChanged]=useState(false);
  const speed=Number((3.6/Math.sqrt(radius)).toFixed(1));
  const period=Number((radius**1.5).toFixed(1));
  const orbitSize=55+radius*27;
  return <Frame icon="🔭" title="Observatory Orbit Lab" kicker="DISTANCE + ORBIT" takeaway="Farther orbits are larger and take longer to complete; near orbits move around the planet more quickly." discovered={changed} onClose={onClose} onGoTo={onGoTo} goLabel="Enter Observatory">
    <div className="microPrompt">Move the satellite farther from the planet. What happens to its orbital speed and trip time?</div>
    <div className="orbitScene">
      <div className="orbitSystem">
        <div className="planet">🌍</div>
        <div className="orbitRing" style={{width:orbitSize+'px',height:orbitSize+'px'}}>
          <span className="satellite" style={{animationDuration:(1.8+radius*1.25)+'s'}}>🛰️</span>
        </div>
      </div>
      <div className="orbitReadout">
        <span><small>ORBIT DISTANCE</small><b>{radius}×</b></span>
        <span><small>RELATIVE SPEED</small><b>{speed}×</b></span>
        <span><small>TRIP TIME</small><b>{period}×</b></span>
      </div>
    </div>
    <div className="microChoiceRow">
      {[1,2,3].map(v=><button key={v} className={radius===v?'active':''} onClick={()=>{setRadius(v);setChanged(true)}}><span>{v===1?'◉':v===2?'◎':'◌'}</span><b>{v===1?'Near':v===2?'Middle':'Far'}</b></button>)}
    </div>
  </Frame>;
}

export function TownMicroExperience({id,onClose,onGoTo}){
  const props={onClose,onGoTo};
  if(id==='windlab')return <WindLab {...props}/>;
  if(id==='forest')return <ForestTrail {...props}/>;
  if(id==='shore')return <ShoreCurrent {...props}/>;
  if(id==='cliffs')return <CliffsLaunch {...props}/>;
  if(id==='buildersyard')return <BuildersBalance {...props}/>;
  if(id==='gardenlab')return <GardenRatio {...props}/>;
  if(id==='observatorylab')return <ObservatoryOrbit {...props}/>;
  return null;
}
