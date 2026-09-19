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
        {route.slice(0,Math.min(stage+1,route.length)).map((p,i)=>i?<line key={i} className="forestSolvedTrail" x1={route[i-1][0]} y1={route[i-1][1]} x2={p[0]} y2={p[1]}/>:null)}
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
  const [angle,setAngle]=useState(35);
  const svgRef=useRef(null);
  const [dragging,setDragging]=useState(false);
  const [targetIndex,setTargetIndex]=useState(0);
  const [launched,setLaunched]=useState(false);
  const [attempts,setAttempts]=useState(0);
  const [best,setBest]=useState(null);
  const targets=[225,275,325];
  const targetX=targets[targetIndex];
  const radians=angle*Math.PI/180;
  const range=Math.sin(2*radians);
  const height=Math.sin(radians)**2;
  const startX=55,groundY=155,endX=80+range*250,peakY=150-height*105;
  const path=`M ${startX} ${groundY} Q ${(startX+endX)/2} ${peakY} ${endX} ${groundY}`;
  const error=Math.abs(endX-targetX);
  const hit=launched&&error<=10;
  const close=launched&&error>10&&error<=24;
  const discovered=best!==null&&best<=10;
  const angleRayLen=48;
  const rayX=startX+Math.cos(radians)*angleRayLen;
  const rayY=groundY-Math.sin(radians)*angleRayLen;
  const wedgeR=25;
  const wedgeX=startX+Math.cos(radians)*wedgeR;
  const wedgeY=groundY-Math.sin(radians)*wedgeR;
  const wedgePath=`M ${startX+wedgeR} ${groundY} A ${wedgeR} ${wedgeR} 0 0 0 ${wedgeX} ${wedgeY}`;
  const launch=()=>{setLaunched(true);setAttempts(v=>v+1);setBest(v=>v===null?error:Math.min(v,error))};
  const changeAngle=v=>{setAngle(v);setLaunched(false)};
  const angleFromPointer=e=>{const svg=svgRef.current;if(!svg)return;const rect=svg.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width*380,y=(e.clientY-rect.top)/rect.height*190,deg=Math.atan2(groundY-y,x-startX)*180/Math.PI;changeAngle(Math.round(clamp(deg,15,75)))};
  const startAngleDrag=e=>{setDragging(true);e.currentTarget.setPointerCapture?.(e.pointerId);angleFromPointer(e)};
  const moveAngleDrag=e=>{if(dragging)angleFromPointer(e)};
  const endAngleDrag=e=>{setDragging(false);e.currentTarget.releasePointerCapture?.(e.pointerId)};
  const nextTarget=()=>{setTargetIndex(i=>(i+1)%targets.length);setAngle(35);setLaunched(false);setBest(null);setAttempts(0)};
  const feedback=!launched?'Tune the angle, then launch.':hit?'Bullseye! You matched the target distance.':close?'Very close — make a small angle adjustment.':endX<targetX?'Too short — try an angle closer to the middle.':'Too far — change the angle away from the middle.';
  return <Frame icon="⛰️" title="Cliff Launch Lab" kicker="AIM WITH ANGLES" takeaway={hit?'You used the launch angle to control horizontal range. The angle is measured from the ground up to the launch direction.':'Changing the launch angle changes both height and forward distance.'} discovered={discovered} onClose={onClose} onGoTo={onGoTo} goLabel="Visit Think Tank">
    <div className="microPrompt">Land the launch ball as close to the flag as you can. Adjust the angle, then press Launch.</div>
    <div className="launchScene targetLaunchScene">
      <div className="targetLaunchStage">
        <svg ref={svgRef} viewBox="0 0 380 190" aria-label={"Launch angle "+angle+" degrees aimed at a target"} onPointerDown={startAngleDrag} onPointerMove={moveAngleDrag} onPointerUp={endAngleDrag} onPointerCancel={()=>setDragging(false)}>
          <path className="launchGround" d="M20 157 H360"/>
          <path className="launchCliff" d="M25 157 L55 105 L80 157 Z"/>
          
          <path className="protractorArc" d="M 90 155 A 35 35 0 0 0 55 120"/>
          {[15,30,45,60,75].map(a=>{const r=a*Math.PI/180,x1=startX+Math.cos(r)*31,y1=groundY-Math.sin(r)*31,x2=startX+Math.cos(r)*37,y2=groundY-Math.sin(r)*37;return <g key={a}><line className="protractorTick" x1={x1} y1={y1} x2={x2} y2={y2}/>{a===45&&<text className="protractorText" x={startX+Math.cos(r)*45} y={groundY-Math.sin(r)*45}>45°</text>}</g>})}
          <line className="angleBaseRay" x1={startX} y1={groundY} x2={startX+55} y2={groundY}/>
          <line className="angleLaunchRay" x1={startX} y1={groundY} x2={rayX} y2={rayY}/>
          <path className="angleWedgeArc" d={wedgePath}/>
          <text className="angleWedgeLabel" x={startX+Math.cos(radians/2)*34} y={groundY-Math.sin(radians/2)*34}>{angle}°</text>
          <circle className="angleVertex" cx={startX} cy={groundY} r="4"/>
          <circle className={dragging?"angleDragHandle dragging":"angleDragHandle"} cx={rayX} cy={rayY} r="9"/>
          <text className="angleDragHint" x={rayX+12} y={rayY-8}>DRAG</text>
          
          <g className="launchTarget" transform={`translate(${targetX} 0)`}>
            <line x1="0" y1="118" x2="0" y2="157"/>
            <path d="M0 119 L25 127 L0 135 Z"/>
            <circle cx="0" cy="157" r="13"/>
            <circle cx="0" cy="157" r="7"/>
            <circle cx="0" cy="157" r="2.5"/>
          </g>
          
          <path className="launchArc previewArc" d={path}/>
          {launched&&<circle className={hit?'launchBall bullseyeBall':'launchBall'} cx={endX} cy="155" r="7"/>}
          {!launched&&<circle className="launchAimGhost" cx={endX} cy="155" r="5"/>}
        </svg>
        <div className="angleMeasureCaption"><span>GROUND</span><b>↗ {angle}°</b><span>LAUNCH DIRECTION</span></div>
      </div>
      <div className="launchReadout">
        <span><small>ANGLE</small><b>{angle}°</b></span>
        <span><small>RELATIVE RANGE</small><b>{Math.round(range*100)}%</b></span>
        <span><small>HEIGHT</small><b>{Math.round(height*100)}%</b></span>
        <span className={hit?'targetScore hitScore':''}><small>{launched?'RESULT':'TARGET'}</small><b>{launched?(hit?'BULLSEYE':close?'CLOSE':'ADJUST'):'🎯'}</b></span>
      </div>
    </div>
    
    <div className="launchAngleControl dragAngleControl">
      <div className="angleSliderHeader"><span>Drag the blue handle on the launcher</span><b>{angle}°</b><span>15°–75°</span></div>
      <input aria-label="Fine tune launch angle" type="range" min="15" max="75" step="1" value={angle} onChange={e=>changeAngle(Number(e.target.value))}/>
      <small className="fineTuneLabel">You can also use this slider for fine adjustment.</small>
    </div>
    
    <div className="targetLaunchActions">
      <button className="launchNowButton" onClick={launch}>🚀 Launch!</button>
      <button className="newTargetButton" onClick={nextTarget}>🎯 New target</button>
    </div>
    <div className={'microFeedback '+(hit?'good':launched?'try':'')}>{feedback}{attempts>0&&<small> Attempts: {attempts}{best!==null?' · Best miss: '+Math.round(best)+' units':''}</small>}</div>
    {hit&&<div className="angleDiscovery"><b>✨ Angle discovery</b><span>The angle lives at the launcher — between the flat ground and the launch direction. Try the next target and see whether a different angle can hit it.</span></div>}
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
