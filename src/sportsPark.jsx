
import React,{useState}from'react';
import'./sportsPark.css';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const rad=d=>d*Math.PI/180;
const pct=n=>Math.round(n);

function TrajectoryField({angle=45,power=70,target=72,label='TARGET',wind=0,theme='baseball'}){
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
  return <div className={'sportTrajectory '+theme+'Trajectory'}>
    <svg viewBox="0 0 100 100" role="img" aria-label={theme+' trajectory at '+angle+' degrees'}>
      {theme==='baseball'&&<>
        <path d="M 8 82 Q 50 27 92 82 Z" className="baseballOutfield"/>
        <path d="M 10 82 L 31 61 L 52 82 L 31 96 Z" className="baseballInfield"/>
        <rect x="8.5" y="80.5" width="3" height="3" transform="rotate(45 10 82)" className="baseballBase"/>
        <rect x="29.5" y="59.5" width="3" height="3" transform="rotate(45 31 61)" className="baseballBase"/>
        <rect x="50.5" y="80.5" width="3" height="3" transform="rotate(45 52 82)" className="baseballBase"/>
        <path d="M 7 77 Q 50 18 93 77" className="baseballFence"/>
        <text x="87" y="18" className="sceneTinyLabel">SCORE</text>
      </>}
      {theme==='basketball'&&<>
        <rect x="5" y="42" width="90" height="43" rx="3" className="basketCourt"/>
        <path d="M 50 42 V 85 M 50 64 A 11 11 0 1 1 49.9 64" className="courtLine"/>
        <path d="M 18 42 V 65 A 15 15 0 0 0 33 80 M 82 42 V 65 A 15 15 0 0 1 67 80" className="courtLine"/>
        <rect x={targetX-2} y="49" width="10" height="6" className="backboard"/>
        <ellipse cx={targetX} cy="58" rx="3.4" ry="1.2" className="basketRim"/>
      </>}
      {theme==='football'&&<>
        <rect x="5" y="42" width="90" height="43" rx="3" className="footballField"/>
        {[15,25,35,45,55,65,75,85].map(x=><line key={x} x1={x} y1="43" x2={x} y2="84" className="yardLine"/>)}
        <line x1="8" y1="42" x2="8" y2="85" className="endZoneLine"/>
        <line x1="92" y1="42" x2="92" y2="85" className="endZoneLine"/>
        <path d="M 89 46 V 59 M 85 46 V 52 H 93 V 46" className="goalPost"/>
        <circle cx={targetX} cy="67" r="3.5" className="receiverMarker"/>
        <text x={targetX} y="68.2" textAnchor="middle" className="receiverText">R</text>
      </>}
      {theme==='golf'&&<>
        <path d="M 5 84 C 18 65 31 66 43 55 C 56 43 72 43 95 58 L95 84 Z" className="golfRough"/>
        <path d="M 10 82 C 28 70 34 63 47 58 C 61 52 71 55 91 63" className="golfFairway"/>
        <ellipse cx={targetX} cy="68" rx="11" ry="6" className="golfGreen"/>
        <ellipse cx={targetX-14} cy="72" rx="5" ry="2.5" className="golfBunker"/>
        <line x1={targetX} y1="55" x2={targetX} y2="69" className="golfFlagPole"/>
        <path d={'M '+targetX+' 55 L '+(targetX+7)+' 58 L '+targetX+' 61 Z'} className="golfFlag"/>
      </>}
      <line x1="5" y1="82" x2="95" y2="82" className="sportGround"/>
      <line x1="10" y1="82" x2="24" y2="82" className="sportBaseRay"/>
      <line x1="10" y1="82" x2={rayX} y2={rayY} className="sportAngleRay"/>
      <path d={'M 19 82 A 9 9 0 0 0 '+arcX+' '+arcY} className="sportAngleArc"/>
      <text x={labelX} y={labelY} className="sportAngleText">{angle}°</text>
      {theme==='baseball'&&<><line x1={targetX} y1="57" x2={targetX} y2="82" className="sportTargetPole"/><path d={'M '+targetX+' 57 L '+(targetX+8)+' 61 L '+targetX+' 65 Z'} className="sportTargetFlag"/></>}
      {theme!=='basketball'&&theme!=='football'&&theme!=='golf'&&<text x={targetX} y="92" textAnchor="middle" className="sportTargetText">{label}</text>}
      <path d={'M 10 82 Q '+mid+' '+peak+' '+end+' 82'} className="sportArc"/>
      <circle cx={end} cy="82" r="2.5" className={'sportBall '+theme+'Ball'}/>
    </svg>
    <div className="sportTrajectoryStats"><span><small>ANGLE</small><b>{angle}°</b></span><span><small>POWER</small><b>{power}%</b></span><span><small>DISTANCE</small><b>{pct(range)}</b></span><span><small>HEIGHT</small><b>{pct(height)}</b></span></div>
  </div>
}

function Control({label,value,min,max,step=1,onChange,suffix=''}){return <label className="sportControl"><span>{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}/><b>{value}{suffix}</b></label>}


function BaseballHeroScene({angle,power,contact,range,result,onAngle,onPower,onContact,onSwing}){
  const launchAngle=clamp(angle+(contact==='low'?8:contact==='high'?-7:0),8,55);
  const distance=Math.round(95+range*1.15);
  const maxHeight=Math.round(18+Math.sin(rad(launchAngle))*power*.72);
  const startX=215,startY=515;
  const endX=clamp(250+range*7.1,410,1005);
  const endY=270;
  const apexX=startX+(endX-startX)*.5;
  const apexY=clamp(startY-(105+maxHeight*2.5),85,330);
  const path='M '+startX+' '+startY+' Q '+apexX+' '+apexY+' '+endX+' '+endY;
  const wedgeR=70;
  const wedgeX=startX+Math.cos(rad(launchAngle))*wedgeR;
  const wedgeY=startY-Math.sin(rad(launchAngle))*wedgeR;
  const wedgePath='M '+(startX+wedgeR)+' '+startY+' A '+wedgeR+' '+wedgeR+' 0 0 0 '+wedgeX+' '+wedgeY;
  return <div className="homeRunMath">
    <div className="homeRunTop">
      <div className="homeRunBrand"><span>⚾</span><div><h2>Home Run Math</h2><p>Explore how angle and swing force change the path of a baseball.</p></div></div>
      <div className="homeRunBadge">⭐ Hit farther. Learn bigger!</div>
    </div>
    <div className="homeRunGrid">
      <div className="homeRunFieldCard">
        <div className="homeRunHint"><b>Take a swing!</b><span>Adjust the angle and force, then see how far you can hit it.</span></div>
        <svg viewBox="0 0 1200 620" className="homeRunField" aria-label={'Baseball hit at '+launchAngle+' degrees'}>
          <rect x="0" y="0" width="1200" height="235" className="hrSky"/>
          <g className="hrClouds"><ellipse cx="190" cy="90" rx="54" ry="22"/><ellipse cx="245" cy="94" rx="40" ry="17"/><ellipse cx="226" cy="72" rx="37" ry="20"/><ellipse cx="962" cy="77" rx="54" ry="22"/><ellipse cx="1010" cy="82" rx="38" ry="16"/><ellipse cx="985" cy="59" rx="34" ry="18"/></g>
          <g className="hrTreeBand">{Array.from({length:18},(_,i)=><g key={i} transform={'translate('+(28+i*69)+' 183)'}><circle cx="0" cy="0" r="23"/><circle cx="18" cy="-8" r="20"/><circle cx="-17" cy="-7" r="19"/><rect x="-4" y="13" width="8" height="25"/></g>)}</g>
          <g className="hrLights"><g transform="translate(165 112)"><rect x="-5" width="10" height="100"/><rect x="-25" y="9" width="50" height="12"/>{[-18,-6,6,18].map(x=><circle key={x} cx={x} cy="15" r="5"/>)}</g><g transform="translate(780 112)"><rect x="-5" width="10" height="100"/><rect x="-25" y="9" width="50" height="12"/>{[-18,-6,6,18].map(x=><circle key={x} cx={x} cy="15" r="5"/>)}</g></g>
          <g className="hrScoreboard" transform="translate(915 82)"><rect width="188" height="112" rx="8"/><rect x="9" y="9" width="170" height="94" rx="4"/><text x="22" y="43">BIG SWINGS</text><text x="22" y="71">BRIGHT MINDS</text><circle cx="147" cy="49" r="14"/><path d="M139 38 C145 44 145 55 139 61 M155 38 C149 44 149 55 155 61"/></g>
          <path d="M 25 239 Q 600 137 1175 239 L1175 520 L25 520 Z" className="hrGrassOuter"/>
          <path d="M 25 239 Q 600 152 1175 239" className="hrFence"/>
          <text x="570" y="188" className="hr400">400</text>
          {Array.from({length:9},(_,i)=><path key={i} d={'M '+(70+i*130)+' 240 Q '+(95+i*130)+' 390 '+(60+i*130)+' 520'} className={i%2?'hrStripe dark':'hrStripe'}/>)}
          <line x1="215" y1="515" x2="30" y2="242" className="hrFoul"/>
          <line x1="215" y1="515" x2="1170" y2="242" className="hrFoul"/>
          <path d="M215 515 Q345 395 600 335 Q855 395 985 515 L835 515 Q600 442 365 515 Z" className="hrDirt"/>
          <polygon points="600,365 748,435 600,505 452,435" className="hrDiamond"/>
          <ellipse cx="600" cy="438" rx="55" ry="25" className="hrMound"/>
          <path d="M600 532 L621 514 L611 497 L589 497 L579 514 Z" className="hrHomePlate"/>
          <rect x="734" y="421" width="28" height="28" transform="rotate(45 748 435)" className="hrBase"/>
          <rect x="586" y="351" width="28" height="28" transform="rotate(45 600 365)" className="hrBase"/>
          <rect x="438" y="421" width="28" height="28" transform="rotate(45 452 435)" className="hrBase"/>
          <g className="hrBaseLabel"><g transform="translate(716 395)"><rect width="92" height="34" rx="10"/><text x="46" y="22">First Base</text></g><g transform="translate(548 314)"><rect width="104" height="34" rx="10"/><text x="52" y="22">Second Base</text></g><g transform="translate(165 392)"><rect width="100" height="34" rx="10"/><text x="50" y="22">Third Base</text></g></g>
          <g className="hrBatter" transform="translate(165 447)"><ellipse cx="30" cy="119" rx="40" ry="14"/><rect x="49" y="4" width="17" height="105" rx="7" transform="rotate(44 58 55)"/><circle cx="35" cy="27" r="24"/><rect x="18" y="45" width="34" height="60" rx="13"/><rect x="22" y="100" width="10" height="48" rx="4"/><rect x="40" y="100" width="10" height="48" rx="4"/></g>
          <line x1={startX} y1={startY} x2={startX+150} y2={startY} className="hrAngleBaseline"/>
          <path d={wedgePath} className="hrAngleArc"/>
          <line x1={startX} y1={startY} x2={startX+Math.cos(rad(launchAngle))*112} y2={startY-Math.sin(rad(launchAngle))*112} className="hrAngleRay"/>
          <path d={path} className="hrTrajectory"/>
          <g className="hrAngleTag" transform={'translate('+(startX+Math.cos(rad(launchAngle/2))*94-25)+' '+(startY-Math.sin(rad(launchAngle/2))*94-21)+')'}><rect width="60" height="40" rx="12"/><text x="30" y="27">{launchAngle}°</text></g>
          <g className="hrLanding" transform={'translate('+endX+' '+endY+')'}><circle cx="0" cy="0" r="14"/><path d="M-7 -10 C-2 -5,-2 5,-7 10 M7 -10 C2 -5,2 5,7 10"/><line x1="35" y1="-10" x2="35" y2="80"/><path d="M35 -10 L91 13 L35 36 Z"/><ellipse cx="35" cy="83" rx="33" ry="11"/></g>
          <g className="hrDistanceTag" transform={'translate('+(Math.min(endX+58,1030))+' '+(endY+27)+')'}><rect width="116" height="44" rx="12"/><text x="58" y="29">{distance} FT</text></g>
        </svg>
      </div>
      <aside className="homeRunStats">
        <div className="hrStat purple"><span>📐</span><div><small>Launch Angle</small><b>{launchAngle}°</b></div></div>
        <div className="hrStat orange"><span>🔥</span><div><small>Swing Force</small><b>{power}%</b></div></div>
        <div className="hrStat green"><span>📍</span><div><small>Distance</small><b>{distance} FT</b></div></div>
        <div className="hrStat blue"><span>⬆</span><div><small>Max Height</small><b>{maxHeight} FT</b></div></div>
      </aside>
    </div>
    <div className="homeRunControls">
      <label><span>Bat angle</span><input type="range" min="5" max="50" value={angle} onChange={e=>onAngle(+e.target.value)}/><b>{angle}°</b></label>
      <label><span>Swing force</span><input type="range" min="20" max="100" step="5" value={power} onChange={e=>onPower(+e.target.value)}/><b>{power}%</b></label>
      <div className="hrContact">{['low','center','high'].map(x=><button key={x} className={contact===x?'active':''} onClick={()=>onContact(x)}>{x} contact</button>)}</div>
      <button className="hrSwing" onClick={onSwing}>⚾ Swing!</button>
    </div>
    {result&&<div className={result.hit?'homeRunFeedback success':'homeRunFeedback'}><b>{result.hit?'🎯 Target hit!':result.type}</b><span>{result.hit?'You balanced angle and force.':result.range<72?'Try more range: increase force or move toward a middle launch angle.':'Too far: reduce force or move away from the middle launch angle.'}</span></div>}
  </div>
}

function Baseball({record,onRecord}){
  const[angle,setAngle]=useState(30),[power,setPower]=useState(70),[contact,setContact]=useState('center'),[result,setResult]=useState(null),target=72;
  const launchAngle=clamp(angle+(contact==='low'?8:contact==='high'?-7:0),8,55);
  const range=clamp(Math.sin(2*rad(launchAngle))*(power/100)*100,0,100),miss=Math.abs(range-target);
  const swing=()=>{const hit=miss<=7,type=launchAngle<15?'grounder':launchAngle<28?'line drive':launchAngle<42?'fly ball':'high fly';setResult({hit,miss,type,range});if(hit)onRecord('baseball',Math.max(record||0,Math.round(100-miss)))};
  return <div className="sportStation baseballStation">
    <BaseballHeroScene angle={angle} power={power} contact={contact} range={range} result={result} onAngle={v=>{setAngle(v);setResult(null)}} onPower={v=>{setPower(v);setResult(null)}} onContact={v=>{setContact(v);setResult(null)}} onSwing={swing}/>
    <div className="baseballMoreLabs"><div><small>KEEP EXPLORING</small><h2>More baseball math</h2><p>Use the same field for pitching, rates, geometry, and statistics.</p></div></div>
    <BaseballStations/>
  </div>
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
  return <div className="sportStation"><div className="sportMission"><small>BASKETBALL COURT</small><h2>Tune the shot arc</h2><p>Angle and force work together. Try to land the shot at the hoop target.</p></div><TrajectoryField theme="basketball" angle={angle} power={power} target={target} label="HOOP"/><div className="sportControls"><Control label="Shot angle" value={angle} min={30} max={70} onChange={setAngle} suffix="°"/><Control label="Shot force" value={power} min={30} max={90} onChange={setPower} suffix="%"/></div><button className="sportAction" onClick={shoot}>🏀 Shoot</button>{result!==null&&<div className={result?'sportFeedback success':'sportFeedback'}>{result?'Swish!':'Adjust angle and force together.'}</div>}</div>
}

function Soccer({record,onRecord}){
  const[angle,setAngle]=useState(12),[power,setPower]=useState(65),[last,setLast]=useState(null);
  const end=Math.tan(rad(angle))*35*(power/65),miss=Math.abs(end);
  const kick=()=>{const hit=miss<4;setLast(hit);if(hit)onRecord('soccer',Math.max(record||0,100-Math.round(miss*10)))};
  return <div className="sportStation"><div className="sportMission"><small>SOCCER FIELD</small><h2>Pass through the target gate</h2><p>Direction and force act like a simple vector: change either one and the endpoint moves.</p></div><div className="soccerField"><i className="soccerMidline"/><i className="soccerCenterCircle"/><i className="soccerPenaltyBox"/><span className="soccerGoal">🥅</span><span className="soccerCone leftCone">▲</span><span className="soccerCone rightCone">▲</span><span className="soccerBall" style={{left:(50+clamp(end,-35,35))+'%'}}>⚽</span><span className="soccerKickLine" style={{transform:'rotate('+angle+'deg)'}}/></div><div className="sportControls"><Control label="Kick angle" value={angle} min={-25} max={25} onChange={setAngle} suffix="°"/><Control label="Kick power" value={power} min={30} max={100} onChange={setPower} suffix="%"/></div><button className="sportAction" onClick={kick}>⚽ Kick</button>{last!==null&&<div className={last?'sportFeedback success':'sportFeedback'}>{last?'Pass completed!':'Adjust the direction toward the target.'}</div>}</div>
}

function Football({record,onRecord}){
  const[angle,setAngle]=useState(38),[power,setPower]=useState(70),[receiver,setReceiver]=useState(8),[last,setLast]=useState(false);
  const throwDist=Math.sin(2*rad(angle))*power*.75,receiverDist=receiver*4,miss=Math.abs(throwDist-receiverDist);
  const pass=()=>{const hit=miss<5;setLast(hit);if(hit)onRecord('football',Math.max(record||0,100-Math.round(miss*3)))};
  return <div className="sportStation"><div className="sportMission"><small>FOOTBALL FIELD</small><h2>Lead the moving receiver</h2><p>Throw where the receiver will be—not where they are now.</p></div><TrajectoryField theme="football" angle={angle} power={power} target={clamp(receiverDist,20,90)} label="RECEIVER"/><div className="sportControls"><Control label="Throw angle" value={angle} min={20} max={60} onChange={setAngle} suffix="°"/><Control label="Throw power" value={power} min={35} max={100} onChange={setPower} suffix="%"/><Control label="Receiver speed" value={receiver} min={4} max={14} onChange={setReceiver} suffix=" yd/s"/></div><button className="sportAction" onClick={pass}>🏈 Throw</button><div className={last?'sportFeedback success':'sportFeedback'}>Throw: {throwDist.toFixed(0)} yd · Target: {receiverDist} yd</div></div>
}

function Golf({record,onRecord}){
  const[angle,setAngle]=useState(42),[power,setPower]=useState(72),[wind,setWind]=useState(0),[last,setLast]=useState(false),target=76;
  const range=clamp(Math.sin(2*rad(angle))*(power/100)*100+wind,0,100),miss=Math.abs(range-target);
  const swing=()=>{const hit=miss<6;setLast(hit);if(hit)onRecord('golf',Math.max(record||0,100-Math.round(miss)))};
  return <div className="sportStation"><div className="sportMission"><small>GOLF RANGE</small><h2>Land on the green</h2><p>Angle + force + wind combine. Counter the wind or use it.</p></div><TrajectoryField theme="golf" angle={angle} power={power} target={target} label="GREEN" wind={wind}/><div className="sportControls"><Control label="Club angle" value={angle} min={20} max={65} onChange={setAngle} suffix="°"/><Control label="Swing force" value={power} min={30} max={100} onChange={setPower} suffix="%"/><Control label="Wind" value={wind} min={-15} max={15} onChange={setWind}/></div><button className="sportAction" onClick={swing}>⛳ Swing</button><div className={last?'sportFeedback success':'sportFeedback'}>{last?'On the green!':wind===0?'No wind.':wind>0?'Tailwind adds distance.':'Headwind removes distance.'}</div></div>
}

function Hockey({record,onRecord}){
  const[angle,setAngle]=useState(35),[force,setForce]=useState(65),[last,setLast]=useState(false),reflected=90-angle,target=55,miss=Math.abs(reflected-target);
  const shoot=()=>{const hit=miss<5;setLast(hit);if(hit)onRecord('hockey',Math.max(record||0,100-Math.round(miss*4)))};
  return <div className="sportStation"><div className="sportMission"><small>HOCKEY RINK</small><h2>Bank the puck off the boards</h2><p>Change the incoming angle. The reflected path changes with it.</p></div><div className="hockeyReflection"><span className="rinkCenterLine"/><span className="rinkBlueLine leftBlue"/><span className="rinkBlueLine rightBlue"/><span className="rinkCircle c1"/><span className="rinkCircle c2"/><span className="hockeyGoal">🥅</span><span className="rinkBoard"/><i className="incoming" style={{transform:'rotate('+(angle-45)+'deg)'}}/><i className="outgoing" style={{transform:'rotate('+(45-reflected)+'deg)'}}/><span className="hockeyPuck">●</span><b>incoming {angle}° → reflected {reflected}°</b></div><div className="sportControls"><Control label="Bank angle" value={angle} min={15} max={75} onChange={setAngle} suffix="°"/><Control label="Shot force" value={force} min={30} max={100} onChange={setForce} suffix="%"/></div><button className="sportAction" onClick={shoot}>🏒 Shoot</button><div className={last?'sportFeedback success':'sportFeedback'}>Target reflection: {target}°. Notice how the angle changes the path.</div></div>
}

function Track({record,onRecord}){
  const[speed,setSpeed]=useState(12),[laps,setLaps]=useState(2),lap=400,distance=laps*lap,time=distance/speed;
  const run=()=>onRecord('track',Math.max(record||0,Math.round(speed*10)));
  return <div className="sportStation"><div className="sportMission"><small>TRACK</small><h2>See pace become a graph</h2><p>Change speed and laps. Distance, time, and the graph update together.</p></div><div className="trackVisual"><div className="trackOval"><i className="lane l1"/><i className="lane l2"/><i className="lane l3"/><span className="trackStart">START</span><span className="trackFinish">FINISH</span><span style={{left:(20+speed*3)%100+'%'}}>🏃</span></div><div className="trackGraph">{[1,2,3,4].map(x=><i key={x} style={{height:Math.min(100,speed*x*1.5)+'%'}}/>)}</div></div><div className="sportControls"><Control label="Speed" value={speed} min={6} max={20} onChange={setSpeed} suffix=" m/s"/><Control label="Laps" value={laps} min={1} max={4} onChange={setLaps}/></div><button className="sportAction" onClick={run}>🏃 Run</button><div className="sportFeedback"><b>{distance} m</b> at {speed} m/s takes <b>{time.toFixed(1)} sec</b>.</div></div>
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
    <section className="sportsNav">{sports.map(([id,emoji,name])=><button key={id} onClick={()=>setActive(id)} className={(active===id?'active ':'')+'nav-'+id}><span>{emoji}</span><b>{name}</b><small>{records[id]?'PR '+records[id]:'Explore'}</small></button>)}</section>
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
