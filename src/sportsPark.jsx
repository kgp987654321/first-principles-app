
import React,{useState}from'react';
import'./sportsPark.css';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const rad=d=>d*Math.PI/180;
const pct=n=>Math.round(n);

function TrajectoryField({angle=45,power=70,target=72,label='TARGET',wind=0}){
  const range=clamp(Math.sin(2*rad(angle))*(power/100)*100+wind,5,100);
  const height=clamp(Math.sin(rad(angle))**2*(power/100)*100,4,96);
  const end=10+range*.78;
  const peak=82-height*.58;
  const mid=(10+end)/2;
  const targetX=10+target*.78;
  const rayX=10+Math.cos(rad(angle))*14;
  const rayY=82-Math.sin(rad(angle))*14;
  const arcX=10+Math.cos(rad(angle))*9;
  const arcY=82-Math.sin(rad(angle))*9;
  const labelX=12+Math.cos(rad(angle/2))*12;
  const labelY=80-Math.sin(rad(angle/2))*12;
  return <div className="sportTrajectory">
    <svg viewBox="0 0 100 100" role="img" aria-label={'Trajectory at '+angle+' degrees'}>
      <line x1="5" y1="82" x2="95" y2="82" className="sportGround"/>
      <line x1="10" y1="82" x2="24" y2="82" className="sportBaseRay"/>
      <line x1="10" y1="82" x2={rayX} y2={rayY} className="sportAngleRay"/>
      <path d={'M 19 82 A 9 9 0 0 0 '+arcX+' '+arcY} className="sportAngleArc"/>
      <text x={labelX} y={labelY} className="sportAngleText">{angle}°</text>
      <line x1={targetX} y1="57" x2={targetX} y2="82" className="sportTargetPole"/>
      <path d={'M '+targetX+' 57 L '+(targetX+8)+' 61 L '+targetX+' 65 Z'} className="sportTargetFlag"/>
      <text x={targetX} y="92" textAnchor="middle" className="sportTargetText">{label}</text>
      <path d={'M 10 82 Q '+mid+' '+peak+' '+end+' 82'} className="sportArc"/>
      <circle cx={end} cy="82" r="2.5" className="sportBall"/>
    </svg>
    <div className="sportTrajectoryStats"><span><small>ANGLE</small><b>{angle}°</b></span><span><small>POWER</small><b>{power}%</b></span><span><small>DISTANCE</small><b>{pct(range)}</b></span><span><small>HEIGHT</small><b>{pct(height)}</b></span></div>
  </div>
}

function Control({label,value,min,max,step=1,onChange,suffix=''}){return <label className="sportControl"><span>{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}/><b>{value}{suffix}</b></label>}

function Baseball({record,onRecord}){
  const[angle,setAngle]=useState(30),[power,setPower]=useState(70),[contact,setContact]=useState('center'),[result,setResult]=useState(null),target=72;
  const launchAngle=clamp(angle+(contact==='low'?8:contact==='high'?-7:0),8,55);
  const range=clamp(Math.sin(2*rad(launchAngle))*(power/100)*100,0,100),miss=Math.abs(range-target);
  const swing=()=>{const hit=miss<=7,type=launchAngle<15?'grounder':launchAngle<28?'line drive':launchAngle<42?'fly ball':'high fly';setResult({hit,miss,type,range});if(hit)onRecord('baseball',Math.max(record||0,Math.round(100-miss)))};
  return <div className="sportStation"><div className="sportMission"><small>BATTING LAB</small><h2>Land near the 175-ft target</h2><p>Adjust bat angle, swing force, and contact point. The ball’s launch angle controls the trajectory.</p></div><TrajectoryField angle={launchAngle} power={power} target={target} label="175 FT"/><div className="sportControls"><Control label="Bat angle" value={angle} min={5} max={50} onChange={setAngle} suffix="°"/><Control label="Swing force" value={power} min={20} max={100} step={5} onChange={setPower} suffix="%"/><div className="sportChoiceRow">{['low','center','high'].map(x=><button key={x} className={contact===x?'active':''} onClick={()=>setContact(x)}>{x} contact</button>)}</div></div><button className="sportAction" onClick={swing}>⚾ Swing</button>{result&&<div className={result.hit?'sportFeedback success':'sportFeedback'}><b>{result.hit?'🎯 Target hit!':result.type}</b><span>{result.hit?'You balanced angle and force.':result.range<target?'Try more range: adjust force or move toward a middle launch angle.':'Too far: reduce force or move away from the middle angle.'}</span></div>}<BaseballStations/></div>
}

function BaseballStations(){
  const[pitchAngle,setPitchAngle]=useState(7),[pitchSpeed,setPitchSpeed]=useState(65),[runSpeed,setRunSpeed]=useState(15),[hits,setHits]=useState(3),atBats=10;
  const pitchY=50+(pitchAngle-7)*3-(pitchSpeed-65)*.15,runTime=(90/runSpeed).toFixed(1),avg=(hits/atBats).toFixed(3),percent=Math.round(hits/atBats*100);
  return <div className="sportMiniGrid">
    <article><small>PITCHING MOUND</small><h3>Hit the strike zone</h3><Control label="Release angle" value={pitchAngle} min={2} max={12} onChange={setPitchAngle} suffix="°"/><Control label="Pitch speed" value={pitchSpeed} min={40} max={90} step={5} onChange={setPitchSpeed} suffix=" mph"/><div className="strikeZone"><i style={{top:clamp(pitchY,10,90)+'%'}}/></div><p>{Math.abs(pitchY-50)<10?'Strike! The pitch crosses near the center.':'Adjust angle or speed to move the pitch.'}</p></article>
    <article><small>BASE RUNNING</small><h3>Rate × time</h3><Control label="Running speed" value={runSpeed} min={8} max={22} onChange={setRunSpeed} suffix=" ft/s"/><div className="basePath"><span style={{left:clamp(runSpeed/22*82,8,82)+'%'}}>🏃</span></div><strong>{runTime} sec to first base</strong><p>90 ft ÷ {runSpeed} ft/s = {runTime} seconds.</p></article>
    <article><small>DIAMOND GEOMETRY</small><h3>A square hidden in the field</h3><div className="diamondModel"><i/><b>90 ft</b></div><p>Perimeter = 360 ft. Home-to-second diagonal ≈ 127 ft.</p></article>
    <article><small>DUGOUT STATS</small><h3>One result, four representations</h3><div className="hitStepper"><button onClick={()=>setHits(v=>Math.max(0,v-1))}>−</button><b>{hits} hits</b><button onClick={()=>setHits(v=>Math.min(atBats,v+1))}>+</button></div><div className="statConnections"><span>{hits}/{atBats}</span><span>{avg}</span><span>{percent}%</span></div><p>Fraction → decimal → percent.</p></article>
  </div>
}

function Basketball({record,onRecord}){
  const[angle,setAngle]=useState(48),[power,setPower]=useState(62),[result,setResult]=useState(null),target=68;
  const range=clamp(Math.sin(2*rad(angle))*(power/100)*105,0,100),miss=Math.abs(range-target);
  const shoot=()=>{const hit=miss<6;setResult(hit);if(hit)onRecord('basketball',Math.max(record||0,Math.round(100-miss)))};
  return <div className="sportStation"><div className="sportMission"><small>BASKETBALL COURT</small><h2>Tune the shot arc</h2><p>Angle and force work together. Try to land the shot at the hoop target.</p></div><TrajectoryField angle={angle} power={power} target={target} label="HOOP"/><div className="sportControls"><Control label="Shot angle" value={angle} min={30} max={70} onChange={setAngle} suffix="°"/><Control label="Shot force" value={power} min={30} max={90} onChange={setPower} suffix="%"/></div><button className="sportAction" onClick={shoot}>🏀 Shoot</button>{result!==null&&<div className={result?'sportFeedback success':'sportFeedback'}>{result?'Swish!':'Adjust angle and force together.'}</div>}</div>
}

function Soccer({record,onRecord}){
  const[angle,setAngle]=useState(12),[power,setPower]=useState(65),[last,setLast]=useState(null);
  const end=Math.tan(rad(angle))*35*(power/65),miss=Math.abs(end);
  const kick=()=>{const hit=miss<4;setLast(hit);if(hit)onRecord('soccer',Math.max(record||0,100-Math.round(miss*10)))};
  return <div className="sportStation"><div className="sportMission"><small>SOCCER FIELD</small><h2>Pass through the target gate</h2><p>Direction and force act like a simple vector: change either one and the endpoint moves.</p></div><div className="soccerField"><span className="soccerGoal">🥅</span><span className="soccerBall" style={{left:(50+clamp(end,-35,35))+'%'}}>⚽</span></div><div className="sportControls"><Control label="Kick angle" value={angle} min={-25} max={25} onChange={setAngle} suffix="°"/><Control label="Kick power" value={power} min={30} max={100} onChange={setPower} suffix="%"/></div><button className="sportAction" onClick={kick}>⚽ Kick</button>{last!==null&&<div className={last?'sportFeedback success':'sportFeedback'}>{last?'Pass completed!':'Adjust the direction toward the target.'}</div>}</div>
}

function Football({record,onRecord}){
  const[angle,setAngle]=useState(38),[power,setPower]=useState(70),[receiver,setReceiver]=useState(8),[last,setLast]=useState(false);
  const throwDist=Math.sin(2*rad(angle))*power*.75,receiverDist=receiver*4,miss=Math.abs(throwDist-receiverDist);
  const pass=()=>{const hit=miss<5;setLast(hit);if(hit)onRecord('football',Math.max(record||0,100-Math.round(miss*3)))};
  return <div className="sportStation"><div className="sportMission"><small>FOOTBALL FIELD</small><h2>Lead the moving receiver</h2><p>Throw where the receiver will be—not where they are now.</p></div><TrajectoryField angle={angle} power={power} target={clamp(receiverDist,20,90)} label="RECEIVER"/><div className="sportControls"><Control label="Throw angle" value={angle} min={20} max={60} onChange={setAngle} suffix="°"/><Control label="Throw power" value={power} min={35} max={100} onChange={setPower} suffix="%"/><Control label="Receiver speed" value={receiver} min={4} max={14} onChange={setReceiver} suffix=" yd/s"/></div><button className="sportAction" onClick={pass}>🏈 Throw</button><div className={last?'sportFeedback success':'sportFeedback'}>Throw: {throwDist.toFixed(0)} yd · Target: {receiverDist} yd</div></div>
}

function Golf({record,onRecord}){
  const[angle,setAngle]=useState(42),[power,setPower]=useState(72),[wind,setWind]=useState(0),[last,setLast]=useState(false),target=76;
  const range=clamp(Math.sin(2*rad(angle))*(power/100)*100+wind,0,100),miss=Math.abs(range-target);
  const swing=()=>{const hit=miss<6;setLast(hit);if(hit)onRecord('golf',Math.max(record||0,100-Math.round(miss)))};
  return <div className="sportStation"><div className="sportMission"><small>GOLF RANGE</small><h2>Land on the green</h2><p>Angle + force + wind combine. Counter the wind or use it.</p></div><TrajectoryField angle={angle} power={power} target={target} label="GREEN" wind={wind}/><div className="sportControls"><Control label="Club angle" value={angle} min={20} max={65} onChange={setAngle} suffix="°"/><Control label="Swing force" value={power} min={30} max={100} onChange={setPower} suffix="%"/><Control label="Wind" value={wind} min={-15} max={15} onChange={setWind}/></div><button className="sportAction" onClick={swing}>⛳ Swing</button><div className={last?'sportFeedback success':'sportFeedback'}>{last?'On the green!':wind===0?'No wind.':wind>0?'Tailwind adds distance.':'Headwind removes distance.'}</div></div>
}

function Hockey({record,onRecord}){
  const[angle,setAngle]=useState(35),[force,setForce]=useState(65),[last,setLast]=useState(false),reflected=90-angle,target=55,miss=Math.abs(reflected-target);
  const shoot=()=>{const hit=miss<5;setLast(hit);if(hit)onRecord('hockey',Math.max(record||0,100-Math.round(miss*4)))};
  return <div className="sportStation"><div className="sportMission"><small>HOCKEY RINK</small><h2>Bank the puck off the boards</h2><p>Change the incoming angle. The reflected path changes with it.</p></div><div className="hockeyReflection"><span className="rinkBoard"/><i className="incoming" style={{transform:'rotate('+(angle-45)+'deg)'}}/><i className="outgoing" style={{transform:'rotate('+(45-reflected)+'deg)'}}/><b>incoming {angle}° → reflected {reflected}°</b></div><div className="sportControls"><Control label="Bank angle" value={angle} min={15} max={75} onChange={setAngle} suffix="°"/><Control label="Shot force" value={force} min={30} max={100} onChange={setForce} suffix="%"/></div><button className="sportAction" onClick={shoot}>🏒 Shoot</button><div className={last?'sportFeedback success':'sportFeedback'}>Target reflection: {target}°. Notice how the angle changes the path.</div></div>
}

function Track({record,onRecord}){
  const[speed,setSpeed]=useState(12),[laps,setLaps]=useState(2),lap=400,distance=laps*lap,time=distance/speed;
  const run=()=>onRecord('track',Math.max(record||0,Math.round(speed*10)));
  return <div className="sportStation"><div className="sportMission"><small>TRACK</small><h2>See pace become a graph</h2><p>Change speed and laps. Distance, time, and the graph update together.</p></div><div className="trackVisual"><div className="trackOval"><span style={{left:(20+speed*3)%100+'%'}}>🏃</span></div><div className="trackGraph">{[1,2,3,4].map(x=><i key={x} style={{height:Math.min(100,speed*x*1.5)+'%'}}/>)}</div></div><div className="sportControls"><Control label="Speed" value={speed} min={6} max={20} onChange={setSpeed} suffix=" m/s"/><Control label="Laps" value={laps} min={1} max={4} onChange={setLaps}/></div><button className="sportAction" onClick={run}>🏃 Run</button><div className="sportFeedback"><b>{distance} m</b> at {speed} m/s takes <b>{time.toFixed(1)} sec</b>.</div></div>
}

const sports=[
  ['baseball','⚾','Baseball'],
  ['basketball','🏀','Basketball'],
  ['soccer','⚽','Soccer'],
  ['track','🏃','Track'],
  ['football','🏈','Football'],
  ['golf','⛳','Golf'],
  ['hockey','🏒','Hockey']
];

export function AthleticsPark({activity={},onProgress,onExit}){
  const[active,setActive]=useState('baseball'),records=activity.records||{};
  const save=(sport,score)=>onProgress&&onProgress({records:{...records,[sport]:Math.max(records[sport]||0,score)}});
  const props={record:records[active]||0,onRecord:save};
  return <main className="sportsParkApp">
    <header className="sportsHero"><div><small>ATHLETICS PARK</small><h1>Play the physics.</h1><p>Angles, force, rates, geometry, vectors, probability, and data—hidden inside sports.</p></div><button onClick={onExit}>← Back to My World</button></header>
    <section className="sportsNav">{sports.map(([id,emoji,name])=><button key={id} onClick={()=>setActive(id)} className={active===id?'active':''}><span>{emoji}</span><b>{name}</b><small>{records[id]?'PR '+records[id]:'Explore'}</small></button>)}</section>
    <section className="sportsPlayArea">
      {active==='baseball'&&<Baseball {...props}/>}
      {active==='basketball'&&<Basketball {...props}/>}
      {active==='soccer'&&<Soccer {...props}/>}
      {active==='track'&&<Track {...props}/>}
      {active==='football'&&<Football {...props}/>}
      {active==='golf'&&<Golf {...props}/>}
      {active==='hockey'&&<Hockey {...props}/>}
    </section>
    <section className="sportsConnectionBar"><b>Same idea, new surface.</b><span>Angles → Cliffs · Woodshop · Batting · Shooting</span><span>Rates → Science · Base running · Track</span><span>Vectors → Shore · Soccer · Golf · Football</span></section>
  </main>
}
