import React from'react';
import{AngleOverlay}from'./SportLab';
import{clamp,rad,quadraticPath}from'./sportsPhysics';

export function BasketballScene({angle,power,range=65,shotType='free',played=false,vectorLength=90}) {
  const shotStart={short:820,free:735,three:500};
  const targetRange={short:44,free:64,three:86};
  const startX=shotStart[shotType]||735,startY=505,hoopX=989,hoopY=260;
  const apexY=clamp(465-Math.sin(rad(angle))*power*4.7,115,330);
  const resultX=clamp(hoopX+(range-targetRange[shotType])*6,805,1090);
  const path=quadraticPath({startX,startY,endX:resultX,endY:hoopY,apexY});
  const ballX=played?resultX:startX,ballY=played?hoopY:startY;
  const playerX=startX-50,r=rad(angle),forceLen=clamp(vectorLength,55,120);
  const forceX=startX+Math.cos(r)*forceLen,forceY=startY-Math.sin(r)*forceLen;
  return <svg viewBox="0 0 1200 620" className={'sportSceneSvg basketballScene '+(played?'played':'')} aria-label={'Basketball shot at '+angle+' degrees with '+power+' percent force'}>
    <rect width="1200" height="620" className="bbSky"/>
    <rect y="280" width="1200" height="340" className="bbCourt"/>
    <rect x="70" y="305" width="1060" height="275" rx="8" className="bbCourtLines"/>
    <path d="M150 580 A400 400 0 0 1 850 580" className="bbThree"/>
    <rect x="760" y="330" width="205" height="250" className="bbPaint"/>
    <circle cx="862" cy="425" r="68" className="bbFreeCircle"/>
    <line x1="862" y1="330" x2="862" y2="580" className="bbLane"/>
    <g className="bbHoop"><rect x="925" y="180" width="120" height="85" rx="4"/><rect x="970" y="215" width="38" height="28"/><ellipse cx="989" cy="260" rx="28" ry="8"/><path d="M964 263 L974 312 M1014 263 L1004 312 M974 312 Q989 325 1004 312"/></g>
    <g className="bbPlayer" transform={'translate('+playerX+' 400)'}><circle cx="35" cy="30" r="25"/><rect x="18" y="52" width="35" height="78" rx="12"/><rect x="15" y="126" width="12" height="54" rx="6"/><rect x="43" y="126" width="12" height="54" rx="6"/><line x1="32" y1="65" x2="68" y2="22"/><line x1="46" y1="66" x2="72" y2="24"/></g>
    <AngleOverlay x={startX} y={startY} angle={angle} radius={50}/>
    <g className="bbForceVector">
      <line x1={startX} y1={startY} x2={forceX} y2={forceY}/>
      <circle cx={forceX} cy={forceY} r="8"/>
      <text x={forceX+12} y={forceY-7}>{power}% FORCE</text>
    </g>
    <path d={path} className="sportFlightPath"/>
    <circle cx={ballX} cy={ballY} r="16" className="bbBall"/>
    <text x="1000" y="355" className="sceneMarker">HOOP</text>
    <text x={startX} y="574" textAnchor="middle" className="sceneMarker">{shotType==='three'?'3-POINT':shotType==='short'?'SHORT RANGE':'FREE THROW'}</text>
  </svg>;
}
export function SoccerScene({angle,power,end=0,contact='center',played=false}) {
  const startX=310,startY=520,goalX=870,goalY=250;
  const targetX=clamp(goalX+end*4,760,1010),targetY=clamp(goalY-Math.abs(angle)*2.5,150,320);
  const apexY=clamp(440-Math.abs(angle)*6-power*1.2,150,360);
  const path=quadraticPath({startX,startY,endX:targetX,endY:targetY,apexY});
  const ballX=played?targetX:startX,ballY=played?targetY:startY;
  return <svg viewBox="0 0 1200 620" className={'sportSceneSvg soccerScene '+(played?'played':'')}  aria-label={'Soccer kick at '+angle+' degrees'}>
    <rect width="1200" height="620" className="scSky"/>
    <rect y="250" width="1200" height="370" className="scField"/>
    <rect x="65" y="285" width="1070" height="300" className="scBoundary"/>
    <line x1="600" y1="285" x2="600" y2="585" className="scLine"/>
    <circle cx="600" cy="435" r="74" className="scLine"/>
    <rect x="765" y="290" width="300" height="165" className="scBox"/>
    <rect x="830" y="290" width="170" height="80" className="scBox"/>
    <g className="scGoal"><rect x="835" y="175" width="215" height="140"/><line x1="835" y1="175" x2="1050" y2="315"/><line x1="1050" y1="175" x2="835" y2="315"/><line x1="890" y1="175" x2="890" y2="315"/><line x1="945" y1="175" x2="945" y2="315"/><line x1="1000" y1="175" x2="1000" y2="315"/></g>
    <g className="scPlayer" transform="translate(235 420)"><circle cx="38" cy="24" r="24"/><rect x="22" y="48" width="35" height="74" rx="12"/><line x1="35" y1="120" x2="5" y2="175"/><line x1="44" y1="120" x2="82" y2="165"/></g>
    <AngleOverlay x={startX} y={startY} angle={Math.max(5,Math.abs(angle))} radius={58}/>
    <path d={path} className="sportFlightPath"/>
    <circle cx={ballX} cy={ballY} r="15" className="scBall"/>
    <circle cx="944" cy="244" r="36" className="scTarget"/>
    <text x="944" y="249" className="scTargetText">TARGET</text>
    <text x="88" y="330" className="sceneMarker">{contact.toUpperCase()} STRIKE</text>
  </svg>;
}

export function FootballScene({angle,power,receiverDist=30,throwDist=30,flightTime=1.8,played=false}) {
  const startX=260,startY=520,scale=17;
  const targetX=clamp(startX+receiverDist*scale,445,1065),targetY=360;
  const ballX=clamp(startX+throwDist*scale,360,1080);
  const apexY=clamp(445-Math.sin(rad(angle))*power*4.2,120,350);
  const path=quadraticPath({startX,startY,endX:ballX,endY:targetY,apexY});
  const displayBallX=played?ballX:startX,displayBallY=played?targetY:startY;
  const leadWidth=54;
  return <svg viewBox="0 0 1200 620" className={'sportSceneSvg footballScene '+(played?'played':'')} aria-label={'Football pass at '+angle+' degrees, target lead '+receiverDist.toFixed(1)+' yards'}>
    <rect width="1200" height="620" className="fbSky"/>
    <rect y="250" width="1200" height="370" className="fbField"/>
    {Array.from({length:11},(_,i)=><line key={i} x1={90+i*100} y1="270" x2={90+i*100} y2="590" className="fbYard"/>)}
    {['10','20','30','40','50','40','30','20','10'].map((n,i)=><text key={i} x={190+i*100} y="555" className="fbNumber">{n}</text>)}
    <rect x="25" y="270" width="100" height="320" className="fbEndZone"/><rect x="1075" y="270" width="100" height="320" className="fbEndZone"/>
    <g className="fbGoal"><line x1="1000" y1="215" x2="1000" y2="350"/><line x1="955" y1="240" x2="1045" y2="240"/><line x1="955" y1="240" x2="955" y2="185"/><line x1="1045" y1="240" x2="1045" y2="185"/></g>
    <g className="fbQuarterback" transform="translate(195 410)"><circle cx="38" cy="24" r="24"/><rect x="20" y="50" width="36" height="78" rx="12"/><line x1="23" y1="126" x2="5" y2="182"/><line x1="50" y1="126" x2="76" y2="178"/><line x1="30" y1="66" x2="0" y2="78"/></g>
    <g className="fbReceiver" transform={'translate('+(targetX-28)+' 350)'}><circle cx="28" cy="20" r="19"/><rect x="15" y="40" width="28" height="62" rx="10"/><line x1="18" y1="100" x2="2" y2="145"/><line x1="39" y1="100" x2="56" y2="142"/></g>
    <g className="fbCatchZone">
      <rect x={targetX-leadWidth/2} y="438" width={leadWidth} height="75" rx="20"/>
      <circle cx={targetX} cy="475" r="27"/>
      <text x={targetX} y="479">CATCH</text>
      <text x={targetX} y="530">{receiverDist.toFixed(1)} YD LEAD</text>
    </g>
    <AngleOverlay x={startX} y={startY} angle={angle} radius={60}/>
    <path d={path} className="sportFlightPath"/>
    <ellipse cx={displayBallX} cy={displayBallY} rx="19" ry="11" className="fbBall"/>
    <text x="82" y="314" className="sceneMarker">FLIGHT {flightTime.toFixed(1)} s</text>
    <line x1={ballX} y1="410" x2={targetX} y2="410" className="fbMissGuide"/>
    <text x={(ballX+targetX)/2} y="400" className="fbMissText">{Math.abs(throwDist-receiverDist).toFixed(1)} YD GAP</text>
  </svg>;
}
export function GolfScene({angle,power,wind=0,range=70,target=76,played=false}) {
  const startX=230,startY=520,endX=clamp(250+range*10,430,1070),endY=360;
  const apexY=clamp(430-Math.sin(rad(angle))*power*4.2,105,330);
  const path=quadraticPath({startX,startY,endX,endY,apexY});
  const ballX=played?endX:startX,ballY=played?endY:startY;
  return <svg viewBox="0 0 1200 620" className={'sportSceneSvg golfScene '+(played?'played':'')}  aria-label={'Golf shot at '+angle+' degrees'}>
    <rect width="1200" height="620" className="gfSky"/>
    <path d="M0 350 C180 300 320 360 470 315 C650 260 820 305 1200 260 L1200 620 L0 620 Z" className="gfRough"/>
    <path d="M150 545 C330 470 470 420 635 380 C780 345 900 360 1100 320" className="gfFairway"/>
    <ellipse cx="980" cy="355" rx="135" ry="70" className="gfGreen"/>
    <ellipse cx="820" cy="410" rx="58" ry="28" className="gfBunker"/>
    <line x1="980" y1="265" x2="980" y2="360" className="gfFlagPole"/><path d="M980 265 L1045 288 L980 310 Z" className="gfFlag"/>
    <g className="gfGolfer" transform="translate(160 420)"><circle cx="35" cy="25" r="22"/><rect x="20" y="48" width="32" height="70" rx="11"/><line x1="26" y1="116" x2="12" y2="165"/><line x1="45" y1="116" x2="58" y2="165"/><line x1="52" y1="60" x2="87" y2="105"/></g>
    <AngleOverlay x={startX} y={startY} angle={angle} radius={60}/>
    <path d={path} className="sportFlightPath"/>
    <circle cx={ballX} cy={ballY} r="9" className="gfBall"/>
    <text x="850" y="140" className="gfWind">{wind===0?'CALM':wind>0?'WIND → '+wind:'WIND ← '+Math.abs(wind)}</text>
    <text x="980" y="390" className="sceneMarker">GREEN</text>
  </svg>;
}

export function HockeyScene({angle,reflected,played=false}) {
  const hitX=600,hitY=150,ray=510;
  const dx=Math.sin(rad(angle))*ray,dy=Math.cos(rad(angle))*ray;
  const startX=clamp(hitX-dx,95,520),startY=clamp(hitY+dy,230,530);
  const endX=clamp(hitX+Math.sin(rad(reflected))*ray,680,1100),endY=clamp(hitY+Math.cos(rad(reflected))*ray,230,530);
  const playerX=clamp(startX-55,70,500),playerY=clamp(startY-105,210,410);
  return <svg viewBox="0 0 1200 620" className={'sportSceneSvg hockeyScene '+(played?'played':'')} aria-label={'Hockey bank angle '+angle+' degrees'}>
    <rect width="1200" height="620" className="hkIce"/>
    <rect x="60" y="120" width="1080" height="440" rx="100" className="hkRink"/>
    <line x1="600" y1="120" x2="600" y2="560" className="hkRed"/>
    <line x1="390" y1="120" x2="390" y2="560" className="hkBlue"/><line x1="810" y1="120" x2="810" y2="560" className="hkBlue"/>
    {[260,940].map(x=><React.Fragment key={x}><circle cx={x} cy="250" r="55" className="hkCircle"/><circle cx={x} cy="430" r="55" className="hkCircle"/></React.Fragment>)}
    <rect x="1025" y="285" width="85" height="110" rx="12" className="hkGoal"/>
    <g className="hkPlayer" transform={'translate('+playerX+' '+playerY+')'}><circle cx="35" cy="24" r="22"/><rect x="18" y="46" width="36" height="70" rx="11"/><line x1="30" y1="113" x2="8" y2="160"/><line x1="46" y1="113" x2="70" y2="158"/><line x1="48" y1="65" x2="90" y2="115"/></g>
    <line x1={startX} y1={startY} x2={hitX} y2={hitY} className="hkIncoming"/>
    <line x1={hitX} y1={hitY} x2={endX} y2={endY} className="hkOutgoing"/>
    <line x1={hitX} y1="105" x2={hitX} y2="245" className="hkNormal"/>
    <circle cx={played?endX:startX} cy={played?endY:startY} r="12" className="hkPuck"/>
    <circle cx={hitX} cy={hitY} r="8" className="hkImpact"/>
    <text x={505} y="105" className="hkAngleText">{angle}° in</text><text x={650} y="105" className="hkAngleText">{reflected}° out</text>
  </svg>;
}

export function TrackScene({speed,laps,played=false}) {
  const progress=clamp((speed-6)/14,0,1);
  return <svg viewBox="0 0 1200 620" className={'sportSceneSvg trackScene '+(played?'played':'')}  aria-label={'Track speed '+speed+' meters per second'}>
    <rect width="1200" height="620" className="trSky"/>
    <rect y="250" width="1200" height="370" className="trGrass"/>
    <ellipse cx="520" cy="425" rx="420" ry="150" className="trOuter"/>
    <ellipse cx="520" cy="425" rx="330" ry="90" className="trInner"/>
    {[0,1,2,3].map(i=><ellipse key={i} cx="520" cy="425" rx={395-i*22} ry={135-i*11} className="trLane"/>)}
    <line x1="890" y1="320" x2="890" y2="530" className="trFinish"/>
    <text x="900" y="315" className="sceneMarker">FINISH</text>
    <g className="trRunner" transform={'translate('+(160+progress*720)+' '+(420-progress*45)+')'}><circle cx="22" cy="18" r="18"/><line x1="22" y1="36" x2="22" y2="80"/><line x1="22" y1="52" x2="0" y2="70"/><line x1="22" y1="52" x2="48" y2="40"/><line x1="22" y1="80" x2="2" y2="112"/><line x1="22" y1="80" x2="50" y2="105"/></g>
    <g className="trGraph" transform="translate(760 90)"><rect width="360" height="180" rx="18"/><line x1="48" y1="140" x2="320" y2="140"/><line x1="48" y1="140" x2="48" y2="30"/><line x1="48" y1="140" x2={300} y2={140-speed*4.5}/><text x="70" y="35">DISTANCE vs TIME</text><text x="280" y="165">{laps} laps</text></g>
  </svg>;
}
