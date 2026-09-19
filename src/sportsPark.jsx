
import React,{useState}from'react';
import'./sportsPark.css';
import{SportLab,SportControl,ChoiceButtons}from'./sports/SportLab';
import{BasketballScene,SoccerScene,FootballScene,GolfScene,HockeyScene,TrackScene}from'./sports/SportScenes';
import{SPORTS_CHALLENGES,challengeText}from'./sports/sportsChallenges';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const rad=d=>d*Math.PI/180;

function Control({label,value,min,max,step=1,onChange,suffix=''}){return <label className="sportControl"><span>{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}/><b>{value}{suffix}</b></label>}


function BaseballHeroScene({angle,power,contact,range,result,onAngle,onPower,onContact,onSwing,mode,onModeChange,challengeCopy,connectionText,onTryAnother,playKey}){
  const launchAngle=clamp(angle+(contact==='low'?8:contact==='high'?-7:0),8,55);
  const distance=Math.round(95+range*1.15);
  const maxHeight=Math.round(18+Math.sin(rad(launchAngle))*power*.72);
  const startX=575,startY=488,targetDistance=175;
  const fieldY=d=>clamp(520-Math.sqrt(clamp(d,0,400)/400)*330,190,500);
  const endX=600,endY=fieldY(distance),targetX=600,targetY=fieldY(targetDistance);
  const apexX=startX+135;
  const apexY=clamp(Math.min(startY,endY)-(65+maxHeight*1.8),82,300);
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
    <div className="sportModeBar"><div className="sportModeButtons">{['explore','challenge','mastery'].map(m=><button key={m} className={mode===m?'active':''} onClick={()=>onModeChange(m)}>{m}</button>)}</div><div className="sportModePrompt"><b>{mode==='explore'?'Explore freely':mode==='challenge'?'Target challenge':'Mastery mission'}</b><span>{challengeCopy}</span></div></div>
    <div className="homeRunGrid">
      <div className="homeRunFieldCard">
        <div className="homeRunHint"><b>Take a swing!</b><span>Adjust the angle and force, then see how far you can hit it.</span></div>
        <svg key={playKey} viewBox="0 0 1200 620" className={'homeRunField '+(result?'play':'')} aria-label={'Baseball hit at '+launchAngle+' degrees'}>
          <rect x="0" y="0" width="1200" height="235" className="hrSky"/>
          <g className="hrClouds"><ellipse cx="190" cy="90" rx="54" ry="22"/><ellipse cx="245" cy="94" rx="40" ry="17"/><ellipse cx="226" cy="72" rx="37" ry="20"/><ellipse cx="962" cy="77" rx="54" ry="22"/><ellipse cx="1010" cy="82" rx="38" ry="16"/><ellipse cx="985" cy="59" rx="34" ry="18"/></g>
          <g className="hrTreeBand">{Array.from({length:18},(_,i)=><g key={i} transform={'translate('+(28+i*69)+' 183)'}><circle cx="0" cy="0" r="23"/><circle cx="18" cy="-8" r="20"/><circle cx="-17" cy="-7" r="19"/><rect x="-4" y="13" width="8" height="25"/></g>)}</g>
          <g className="hrLights"><g transform="translate(165 112)"><rect x="-5" width="10" height="100"/><rect x="-25" y="9" width="50" height="12"/>{[-18,-6,6,18].map(x=><circle key={x} cx={x} cy="15" r="5"/>)}</g><g transform="translate(780 112)"><rect x="-5" width="10" height="100"/><rect x="-25" y="9" width="50" height="12"/>{[-18,-6,6,18].map(x=><circle key={x} cx={x} cy="15" r="5"/>)}</g></g>
          <g className="hrScoreboard" transform="translate(915 82)"><rect width="188" height="112" rx="8"/><rect x="9" y="9" width="170" height="94" rx="4"/><text x="22" y="43">BIG SWINGS</text><text x="22" y="71">BRIGHT MINDS</text><circle cx="147" cy="49" r="14"/><path d="M139 38 C145 44 145 55 139 61 M155 38 C149 44 149 55 155 61"/></g>
          <path d="M 25 239 Q 600 137 1175 239 L1175 520 L25 520 Z" className="hrGrassOuter"/>
          <path d="M 25 239 Q 600 152 1175 239" className="hrFence"/>
          <text x="570" y="188" className="hr400">400</text>
          {Array.from({length:9},(_,i)=><path key={i} d={'M '+(70+i*130)+' 240 Q '+(95+i*130)+' 390 '+(60+i*130)+' 520'} className={i%2?'hrStripe dark':'hrStripe'}/>)}
          <line x1="600" y1="520" x2="30" y2="242" className="hrFoul"/>
          <line x1="600" y1="520" x2="1170" y2="242" className="hrFoul"/>
          <polygon points="600,535 830,430 600,325 370,430" className="hrDirt"/>
          <polygon points="600,520 790,430 600,340 410,430" className="hrDiamond"/>
          <ellipse cx="600" cy="435" rx="55" ry="25" className="hrMound"/>
          <path d="M600 534 L621 518 L611 501 L589 501 L579 518 Z" className="hrHomePlate"/>
          <rect x="776" y="416" width="28" height="28" transform="rotate(45 790 430)" className="hrBase"/>
          <rect x="586" y="326" width="28" height="28" transform="rotate(45 600 340)" className="hrBase"/>
          <rect x="396" y="416" width="28" height="28" transform="rotate(45 410 430)" className="hrBase"/>
          <g className="hrBaseLabel"><g transform="translate(765 382)"><rect width="92" height="34" rx="10"/><text x="46" y="22">First Base</text></g><g transform="translate(548 289)"><rect width="104" height="34" rx="10"/><text x="52" y="22">Second Base</text></g><g transform="translate(342 382)"><rect width="100" height="34" rx="10"/><text x="50" y="22">Third Base</text></g></g>
          <g className="hrBatter" transform="translate(510 440)"><ellipse cx="30" cy="119" rx="40" ry="14"/><rect x="49" y="4" width="17" height="105" rx="7" transform="rotate(44 58 55)"/><circle cx="35" cy="27" r="24"/><rect x="18" y="45" width="34" height="60" rx="13"/><rect x="22" y="100" width="10" height="48" rx="4"/><rect x="40" y="100" width="10" height="48" rx="4"/></g>
          <line x1={startX} y1={startY} x2={startX+150} y2={startY} className="hrAngleBaseline"/>
          <path d={wedgePath} className="hrAngleArc"/>
          <line x1={startX} y1={startY} x2={startX+Math.cos(rad(launchAngle))*112} y2={startY-Math.sin(rad(launchAngle))*112} className="hrAngleRay"/>
          <path d={path} className="hrTrajectory"/>
          <g className="hrAngleTag" transform={'translate('+(startX+Math.cos(rad(launchAngle/2))*94-25)+' '+(startY-Math.sin(rad(launchAngle/2))*94-21)+')'}><rect width="60" height="40" rx="12"/><text x="30" y="27">{launchAngle}°</text></g><text x={startX-18} y={startY+32} className="hrAngleCaption">LAUNCH ANGLE · SIDE VIEW</text>
          <g className="hrTargetMarker" transform={'translate('+targetX+' '+targetY+')'}><ellipse cx="0" cy="0" rx="34" ry="13"/><line x1="34" y1="-72" x2="34" y2="0"/><path d="M34 -72 L92 -48 L34 -24 Z"/><text x="48" y="28">175 FT TARGET</text></g>
          {result&&<><g className="hrBallLanding" transform={'translate('+endX+' '+endY+')'}><circle cx="0" cy="0" r="14"/><path d="M-7 -10 C-2 -5,-2 5,-7 10 M7 -10 C2 -5,2 5,7 10"/></g>
          <g className="hrDistanceTag" transform={'translate('+(endX+48)+' '+(endY-16)+')'}><rect width="116" height="44" rx="12"/><text x="58" y="29">{distance} FT</text></g></>}
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
    {result&&<div className={result.hit?'homeRunFeedback success':'homeRunFeedback'}><b>{result.hit?'🎯 Mission hit!':result.type}</b><span>{result.hit?(mode==='explore'?'Notice how angle, force, and contact combine to shape the hit.':'You satisfied the mission constraints.'):result.range<72?'Try more range: increase force or move toward a middle launch angle.':'Too far: reduce force or move away from the middle launch angle.'}</span></div>}
    {result?.hit&&<div className="tryAnotherSport"><div><small>FLEXIBLE THINKING</small><b>Can you reach the same target another way?</b><span>Change angle and force together, then compare.</span></div><button onClick={onTryAnother}>Try another way →</button></div>}
    <div className="sportConnectionCue"><b>🔗 Same idea, new surface</b><span>{connectionText}</span></div>
  </div>
}

function Baseball({record,onRecord,onChallenge,onDiscover}){
  const[angle,setAngle]=useState(30),[power,setPower]=useState(70),[contact,setContact]=useState('center'),[result,setResult]=useState(null),[mode,setMode]=useState('explore'),[playKey,setPlayKey]=useState(0),[attempt,setAttempt]=useState(0),target=72;
  const launchAngle=clamp(angle+(contact==='low'?8:contact==='high'?-7:0),8,55);
  const range=clamp(Math.sin(2*rad(launchAngle))*(power/100)*100,0,100),miss=Math.abs(range-target),basicHit=miss<=7,masteryHit=basicHit&&power<75&&launchAngle<35;
  const success=mode==='explore'?true:mode==='challenge'?basicHit:masteryHit;
  const swing=()=>{setAttempt(v=>v+1);setPlayKey(v=>v+1);const type=launchAngle<15?'grounder':launchAngle<28?'line drive':launchAngle<42?'fly ball':'high fly';setResult({hit:success,miss,type,range});onDiscover('angle');onDiscover('trajectory');if(success&&mode!=='explore')onChallenge('baseball:'+mode);if(basicHit)onRecord('baseball',Math.max(record||0,Math.round(100-miss)))};
  const tryAnother=()=>{setResult(null);setAngle(a=>clamp(a+(attempt%2?5:-4),5,50));setPower(p=>clamp(p+(attempt%2?-8:6),20,100))};
  return <div className="sportStation baseballStation">
    <BaseballHeroScene angle={angle} power={power} contact={contact} range={range} result={result}
      onAngle={v=>{setAngle(v);setResult(null)}} onPower={v=>{setPower(v);setResult(null)}} onContact={v=>{setContact(v);setResult(null)}} onSwing={swing}
      mode={mode} onModeChange={m=>{setMode(m);setResult(null)}} challengeCopy={challengeText('baseball',mode)} connectionText={SPORTS_CHALLENGES.baseball.connection} onTryAnother={tryAnother} playKey={playKey}/>
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

function Basketball({record,onRecord,onChallenge,onDiscover}){
  const shotPresets={
    short:{angle:58,power:45},
    free:{angle:52,power:63},
    three:{angle:47,power:82}
  };
  const[angle,setAngle]=useState(shotPresets.free.angle),[power,setPower]=useState(shotPresets.free.power),[spot,setSpot]=useState('free'),[result,setResult]=useState(null),[mode,setMode]=useState('explore'),[attempt,setAttempt]=useState(0);
  const targets={short:44,free:64,three:86},feet={short:8,free:15,three:23};
  const applyShotPreset=nextSpot=>{
    const preset=shotPresets[nextSpot];if(!preset)return;
    setSpot(nextSpot);setAngle(preset.angle);setPower(preset.power);setResult(null);setAttempt(v=>v+1);
  };
  const target=targets[spot];
  const range=clamp(Math.sin(2*rad(angle))*(power/100)*105,0,110);
  const miss=Math.abs(range-target);
  const apex=Math.round(4+Math.sin(rad(angle))*(power/100)*24);
  const vectorLength=Math.round(34+power*.9);
  const basicHit=miss<6,masteryHit=basicHit&&spot==='free'&&power<=65;
  const success=mode==='explore'?true:mode==='challenge'?basicHit:masteryHit;
  const shoot=()=>{setAttempt(v=>v+1);setResult(success);onDiscover('angle');if(success&&mode!=='explore')onChallenge('basketball:'+mode);if(basicHit)onRecord('basketball',Math.max(record||0,Math.round(100-miss)))};
  const resetTry=()=>{setResult(null);setAngle(a=>clamp(a+(attempt%2?5:-4),30,70));setPower(p=>clamp(p+(attempt%2?-6:5),30,90))};
  return <SportLab icon="🏀" title="Hoop Shot Math" subtitle="Explore how angle and push force change the path of a basketball." promptTitle="Take a shot!" promptText="Choose a court spot or adjust the sliders. More force lengthens the launch vector and carries the ball farther." scene={<BasketballScene key={attempt+'-'+spot} played={result!==null} angle={angle} power={power} range={range} shotType={spot} vectorLength={vectorLength}/>}
    stats={[{icon:'📐',label:'Release Angle',value:angle+'°'},{icon:'🔥',label:'Shot Force',value:power+'%'},{icon:'📍',label:'Distance',value:feet[spot]+' FT'},{icon:'⬆',label:'Apex',value:apex+' FT'}]}
    controls={<><SportControl label="Shot angle" value={angle} min={30} max={70} onChange={v=>{setAngle(v);setResult(null)}} suffix="°"/><SportControl label="Shot force" value={power} min={30} max={90} onChange={v=>{setPower(v);setResult(null)}} suffix="%"/></>}
    choices={<ChoiceButtons options={[
      {id:'short',label:'short range · 58° / 45%'},
      {id:'free',label:'free throw · 52° / 63%'},
      {id:'three',label:'three-point · 47° / 82%'}
    ]} value={spot} onChange={applyShotPreset}/>}
    actionLabel="🏀 Shoot!" onAction={shoot} feedback={result===null?null:(result?(mode==='explore'?'Watch the force arrow and arc together: stronger pushes make a longer vector and more range.':'Swish! Mission complete.'):(mode==='mastery'?'Make a free throw with 65% force or less.':'Missed the hoop. Compare your range with the selected court spot.'))} success={result===true}
    mode={mode} onModeChange={m=>{setMode(m);setResult(null)}} challengeText={challengeText('basketball',mode)} connectionText={SPORTS_CHALLENGES.basketball.connection} onTryAnother={resetTry}/>;
}
function Soccer({record,onRecord,onChallenge,onDiscover}){
  const[angle,setAngle]=useState(32),[power,setPower]=useState(74),[contact,setContact]=useState('center'),[result,setResult]=useState(null),[mode,setMode]=useState('explore'),[attempt,setAttempt]=useState(0);
  const contactShift=contact==='curve'?-6:contact==='chip'?6:0;
  const endpoint=(angle-32)*1.15+contactShift,miss=Math.abs(endpoint),height=Math.round(3+Math.sin(rad(angle))*power*.14),distance=Math.round(12+power*.16),basicHit=miss<5,masteryHit=basicHit&&power<=70;
  const success=mode==='explore'?true:mode==='challenge'?basicHit:masteryHit;
  const kick=()=>{setAttempt(v=>v+1);setResult(success);onDiscover('vector');if(success&&mode!=='explore')onChallenge('soccer:'+mode);if(basicHit)onRecord('soccer',Math.max(record||0,100-Math.round(miss*8)))};
  const resetTry=()=>{setResult(null);setAngle(a=>clamp(a+(attempt%2?4:-5),15,50));setPower(p=>clamp(p+(attempt%2?-8:6),30,100))};
  return <SportLab icon="⚽" title="Goal Kick Math" subtitle="Explore how angle and kick force change the path of a soccer ball." promptTitle="Take the kick!" promptText="Aim through the target zone. Change angle, force, and contact style." scene={<SoccerScene key={attempt} played={result!==null} angle={angle} power={power} end={endpoint} contact={contact}/>}
    stats={[{icon:'📐',label:'Kick Angle',value:angle+'°'},{icon:'🔥',label:'Kick Force',value:power+'%'},{icon:'📍',label:'Distance',value:distance+' FT'},{icon:'⬆',label:'Max Height',value:height+' FT'}]}
    controls={<><SportControl label="Kick angle" value={angle} min={15} max={50} onChange={v=>{setAngle(v);setResult(null)}} suffix="°"/><SportControl label="Kick force" value={power} min={30} max={100} onChange={v=>{setPower(v);setResult(null)}} suffix="%"/></>}
    choices={<ChoiceButtons options={[{id:'curve',label:'low curve'},{id:'center',label:'center strike'},{id:'chip',label:'high chip'}]} value={contact} onChange={v=>{setContact(v);setResult(null)}}/>}
    actionLabel="⚽ Kick!" onAction={kick} feedback={result===null?null:(result?(mode==='explore'?'Notice: angle and contact change direction while force changes how far the ball travels.':'Goal! Mission complete.'):(mode==='mastery'?'Hit the target using 70% force or less.':'Off target. Change direction or contact and try again.'))} success={result===true}
    mode={mode} onModeChange={m=>{setMode(m);setResult(null)}} challengeText={challengeText('soccer',mode)} connectionText={SPORTS_CHALLENGES.soccer.connection} onTryAnother={resetTry}/>;
}

function Football({record,onRecord,onChallenge,onDiscover}){
  const passPresets={
    short:{angle:25,power:54,receiver:5},
    spiral:{angle:38,power:68,receiver:8},
    lob:{angle:52,power:78,receiver:6}
  };
  const[angle,setAngle]=useState(passPresets.spiral.angle),[power,setPower]=useState(passPresets.spiral.power),[passType,setPassType]=useState('spiral'),[receiver,setReceiver]=useState(passPresets.spiral.receiver),[result,setResult]=useState(null),[mode,setMode]=useState('explore'),[attempt,setAttempt]=useState(0);
  const config=passType==='short'?{speed:.88,hang:.82,start:10,route:.64}:passType==='lob'?{speed:.92,hang:1.18,start:12,route:.58}:{speed:1,hang:1,start:18,route:.70};
  const velocity=(6+power*.18)*config.speed;
  const flightTime=Math.max(.45,(2*velocity*Math.sin(rad(angle))/10.72)*config.hang);
  const throwDist=clamp(velocity*Math.cos(rad(angle))*flightTime,6,48);
  const receiverDist=clamp(config.start+receiver*flightTime*config.route,7,48);
  const miss=Math.abs(throwDist-receiverDist),height=Math.round(4+(velocity*velocity*Math.sin(rad(angle))**2/(2*10.72))*3);
  const basicHit=miss<=3.5,masteryHit=basicHit&&receiver>=10;
  const success=mode==='explore'?true:mode==='challenge'?basicHit:masteryHit;
  const applyPassPreset=type=>{const p=passPresets[type];if(!p)return;setPassType(type);setAngle(p.angle);setPower(p.power);setReceiver(p.receiver);setResult(null);setAttempt(v=>v+1)};
  const pass=()=>{setAttempt(v=>v+1);setResult(success);onDiscover('prediction');onDiscover('rate');if(success&&mode!=='explore')onChallenge('football:'+mode);if(basicHit)onRecord('football',Math.max(record||0,100-Math.round(miss*8)))};
  const resetTry=()=>{setResult(null);setAngle(a=>clamp(a+(attempt%2?4:-3),20,60));setPower(p=>clamp(p+(attempt%2?-6:5),35,100))};
  const feedback=result===null?null:(result?(mode==='explore'?'The catch ring is the exact lead point used by the scoring model. Change receiver speed and watch it move.':'Caught! You led the receiver successfully.'):(throwDist<receiverDist?'Too short — add force, lower the hang time, or lead less.':'Too far — reduce force, increase the arc, or lead more.'));
  return <SportLab icon="🏈" title="Pass Arc Math" subtitle="Explore how angle, force, and receiver speed change a football pass." promptTitle="Lead the receiver!" promptText="The catch ring shows where the receiver will be when the ball arrives. Match the ball range to that moving target." scene={<FootballScene key={attempt+'-'+passType} played={result!==null} angle={angle} power={power} receiverDist={receiverDist} throwDist={throwDist} flightTime={flightTime}/>}
    stats={[{icon:'📐',label:'Throw Angle',value:angle+'°'},{icon:'🔥',label:'Throw Force',value:power+'%'},{icon:'⏱',label:'Flight Time',value:flightTime.toFixed(1)+' s'},{icon:'🎯',label:'Catch Lead',value:receiverDist.toFixed(1)+' YD'}]}
    controls={<><SportControl label="Throw angle" value={angle} min={20} max={60} onChange={v=>{setAngle(v);setResult(null)}} suffix="°"/><SportControl label="Throw force" value={power} min={35} max={100} onChange={v=>{setPower(v);setResult(null)}} suffix="%"/><SportControl label="Receiver speed" value={receiver} min={4} max={14} onChange={v=>{setReceiver(v);setResult(null)}} suffix=" yd/s"/></>}
    choices={<ChoiceButtons options={[{id:'short',label:'short pass · 25° / 54%'},{id:'spiral',label:'spiral · 38° / 68%'},{id:'lob',label:'lob · 52° / 78%'}]} value={passType} onChange={applyPassPreset}/>}
    actionLabel="🏈 Pass!" onAction={pass} feedback={feedback} success={result===true}
    mode={mode} onModeChange={m=>{setMode(m);setResult(null)}} challengeText={challengeText('football',mode)} connectionText={SPORTS_CHALLENGES.football.connection} onTryAnother={resetTry}/>;
}
function Golf({record,onRecord,onChallenge,onDiscover}){
  const[angle,setAngle]=useState(42),[power,setPower]=useState(72),[wind,setWind]=useState(0),[club,setClub]=useState('iron'),[result,setResult]=useState(null),[mode,setMode]=useState('explore'),[attempt,setAttempt]=useState(0),target=76;
  const clubFactor=club==='wedge'?.78:club==='driver'?1.12:1;
  const range=clamp(Math.sin(2*rad(angle))*(power/100)*100*clubFactor+wind,0,120),miss=Math.abs(range-target),basicHit=miss<7,masteryHit=basicHit&&wind!==0&&power<=80;
  const success=mode==='explore'?true:mode==='challenge'?basicHit:masteryHit;
  const swing=()=>{setAttempt(v=>v+1);setResult(success);onDiscover('vector');onDiscover('wind');if(success&&mode!=='explore')onChallenge('golf:'+mode);if(basicHit)onRecord('golf',Math.max(record||0,100-Math.round(miss)))};
  const resetTry=()=>{setResult(null);setAngle(a=>clamp(a+(attempt%2?6:-5),20,65));setPower(p=>clamp(p+(attempt%2?-8:6),30,100))};
  return <SportLab icon="⛳" title="Green Landing Math" subtitle="Explore how club angle, swing force, and wind combine." promptTitle="Land on the green!" promptText="Use the wind instead of ignoring it. Different inputs can reach the same green." scene={<GolfScene key={attempt} played={result!==null} angle={angle} power={power} wind={wind} range={range} target={target}/>}
    stats={[{icon:'📐',label:'Club Angle',value:angle+'°'},{icon:'🔥',label:'Swing Force',value:power+'%'},{icon:'📍',label:'Carry',value:Math.round(range*2.2)+' YD'},{icon:'💨',label:'Wind',value:(wind>0?'+':'')+wind}]}
    controls={<><SportControl label="Club angle" value={angle} min={20} max={65} onChange={v=>{setAngle(v);setResult(null)}} suffix="°"/><SportControl label="Swing force" value={power} min={30} max={100} onChange={v=>{setPower(v);setResult(null)}} suffix="%"/><SportControl label="Wind" value={wind} min={-15} max={15} onChange={v=>{setWind(v);setResult(null)}}/></>}
    choices={<ChoiceButtons options={[{id:'wedge',label:'wedge'},{id:'iron',label:'iron'},{id:'driver',label:'driver'}]} value={club} onChange={v=>{setClub(v);setResult(null)}}/>}
    actionLabel="⛳ Swing!" onAction={swing} feedback={result===null?null:(result?(mode==='explore'?'Compare this shot with the same controls under different wind.':'On the green! Mission complete.'):(mode==='mastery'?'Use non-zero wind and 80% force or less.':'Off the green. Change one variable at a time.'))} success={result===true}
    mode={mode} onModeChange={m=>{setMode(m);setResult(null)}} challengeText={challengeText('golf',mode)} connectionText={SPORTS_CHALLENGES.golf.connection} onTryAnother={resetTry}/>;
}

function Hockey({record,onRecord,onChallenge,onDiscover}){
  const[angle,setAngle]=useState(35),[force,setForce]=useState(65),[result,setResult]=useState(null),[mode,setMode]=useState('explore'),[attempt,setAttempt]=useState(0),target=68;
  const reflected=angle,miss=Math.abs(reflected-target),basicHit=miss<4;
  const success=mode==='explore'?true:basicHit;
  const shoot=()=>{setAttempt(v=>v+1);setResult(success);onDiscover('reflection');if(success&&mode!=='explore')onChallenge('hockey:'+mode);if(basicHit)onRecord('hockey',Math.max(record||0,100-Math.round(miss*5)))};
  return <SportLab icon="🏒" title="Bank Shot Math" subtitle="Explore reflection: the angle into the boards matches the angle out." promptTitle="Bank it in!" promptText="Aim at the boards so the reflected puck path reaches the goal." scene={<HockeyScene key={attempt} played={result!==null} angle={angle} reflected={reflected}/>}
    stats={[{icon:'↘',label:'Incoming Angle',value:angle+'°'},{icon:'↗',label:'Reflected Angle',value:reflected+'°'},{icon:'🔥',label:'Shot Force',value:force+'%'},{icon:'🎯',label:'Target',value:target+'°'}]}
    controls={<><SportControl label="Bank angle" value={angle} min={15} max={75} onChange={v=>{setAngle(v);setResult(null)}} suffix="°"/><SportControl label="Shot force" value={force} min={30} max={100} onChange={v=>{setForce(v);setResult(null)}} suffix="%"/></>}
    choices={<ChoiceButtons options={[{id:'normal',label:'normal line'},{id:'rays',label:'angle rays'},{id:'target',label:'target path'}]} value="rays" onChange={()=>{}}/>}
    actionLabel="🏒 Shoot!" onAction={shoot} feedback={result===null?null:(result?(mode==='explore'?'Angle in equals angle out when both are measured from the normal.':'Bank shot! Mission complete.'):'The reflection rule is right, but this angle misses the target.')} success={result===true}
    mode={mode} onModeChange={m=>{setMode(m);setResult(null)}} challengeText={challengeText('hockey',mode)} connectionText={SPORTS_CHALLENGES.hockey.connection} onTryAnother={()=>{setResult(null);setAngle(a=>clamp(70-a,15,75))}}/>;
}

function Track({record,onRecord,onChallenge,onDiscover}){
  const[speed,setSpeed]=useState(12),[laps,setLaps]=useState(2),[result,setResult]=useState(null),[mode,setMode]=useState('explore'),[attempt,setAttempt]=useState(0),lap=400,distance=laps*lap,time=distance/speed,pace=(400/speed).toFixed(1);
  const success=mode==='explore'?true:mode==='challenge'?laps>=1:(laps>=2&&speed>=12);
  const run=()=>{setAttempt(v=>v+1);setResult(success);onDiscover('rate');onDiscover('graph');if(success&&mode!=='explore')onChallenge('track:'+mode);onRecord('track',Math.max(record||0,Math.round(speed*10)))};
  return <SportLab icon="🏃" title="Pace & Graph Math" subtitle="Explore how speed changes time, pace, and the slope of a distance-time graph." promptTitle="Set your pace!" promptText="Change speed and laps. Watch the runner and graph respond together." scene={<TrackScene key={attempt} played={result!==null} speed={speed} laps={laps}/>}
    stats={[{icon:'⚡',label:'Speed',value:speed+' m/s'},{icon:'📍',label:'Distance',value:distance+' m'},{icon:'⏱',label:'Time',value:time.toFixed(1)+' s'},{icon:'📈',label:'400m Pace',value:pace+' s'}]}
    controls={<><SportControl label="Speed" value={speed} min={6} max={20} onChange={v=>{setSpeed(v);setResult(null)}} suffix=" m/s"/><SportControl label="Laps" value={laps} min={1} max={4} onChange={v=>{setLaps(v);setResult(null)}}/></>}
    choices={<ChoiceButtons options={[{id:'steady',label:'steady pace'},{id:'sprint',label:'sprint'},{id:'distance',label:'distance'}]} value="steady" onChange={()=>{}}/>}
    actionLabel="🏃 Run!" onAction={run} feedback={result===null?null:(result?(mode==='explore'?'Faster constant speed makes a steeper distance-time line.':'Run complete. Mission accomplished.'):'For mastery, use at least 2 laps and a speed of 12 m/s or more.')} success={result===true}
    mode={mode} onModeChange={m=>{setMode(m);setResult(null)}} challengeText={challengeText('track',mode)} connectionText={SPORTS_CHALLENGES.track.connection} onTryAnother={()=>{setResult(null);setSpeed(s=>clamp(s===12?18:12,6,20))}}/>;
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
  const[active,setActive]=useState('baseball'),records=activity.records||{},completedChallenges=activity.completedChallenges||[],discoveries=activity.discoveries||[];
  const parkTier=Math.min(4,1+Math.floor(completedChallenges.length/3));
  const save=(sport,score)=>onProgress&&onProgress({records:{...records,[sport]:Math.max(records[sport]||0,score)}});
  const saveChallenge=id=>{if(!completedChallenges.includes(id))onProgress&&onProgress({completedChallenges:[...completedChallenges,id]})};
  const saveDiscovery=id=>{if(!discoveries.includes(id))onProgress&&onProgress({discoveries:[...discoveries,id]})};
  const props={record:records[active]||0,onRecord:save,onChallenge:saveChallenge,onDiscover:saveDiscovery};
  return <main className={'sportsParkApp parkTier'+parkTier}>
    <header className="sportsHero"><div><small>ATHLETICS PARK · TIER {parkTier}</small><h1>Play the physics.</h1><p>Angles, force, rates, geometry, vectors, probability, and data—hidden inside sports.</p><span className="parkProgress">{discoveries.length} discoveries · {completedChallenges.length} challenges complete</span></div><button onClick={onExit}>← Back to My World</button></header>
    <section className="sportsNav">{sports.map(([id,emoji,name])=><button key={id} onClick={()=>setActive(id)} className={(active===id?'active ':'')+'nav-'+id}><span>{emoji}</span><b>{name}</b><small>{records[id]?'PR '+records[id]:'Explore'}</small></button>)}</section>
    <section className="parkGrowth" aria-label={'Athletics Park tier '+parkTier}>
      <span className="growthField">🏟️ Fields open</span>
      <span className={parkTier>=2?'earned':''}>💡 Stadium lights</span>
      <span className={parkTier>=3?'earned':''}>🎏 Team banners</span>
      <span className={parkTier>=3?'earned':''}>👏 Bigger crowd</span>
      <span className={parkTier>=4?'earned':''}>🏆 Mastery trophy</span>
    </section>
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
