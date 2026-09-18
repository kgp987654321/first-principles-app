import React,{useMemo,useState}from'react';
import'./townMap.css';
import'./townMapRefinement.css';
import{worldBuildings,buildingUnlocked}from'./data/world';
import{GrowingWorldScene as StreetWorld}from'./worldSceneConcept';
import{NewBuildingInterior}from'./newBuildingInteriors';

const masteredCount=completed=>Object.values(completed||{}).filter(v=>v?.discovered||v?.transferred).length;
const hasMastered=(completed,id)=>Boolean(completed?.[id]?.discovered||completed?.[id]?.transferred);

const destinationConcepts={
  numbers:['fraction-three-fourths','match-one-half','match-three-fourths','fraction-language-wheel','ratio-recipe-3-2','equivalence-five-eighths','unit-price'],
  geometry:['fold-one-hole','fold-two-folds','map-scale','slope-mountain','slope-family','area-slices'],
  builders:['scale-robot','constraint-builder','momentum-crash','bridge-torque','roller-energy'],
  patterns:['pattern-every-other','matrix-portal','number-train','prediction-trials'],
  think:['mystery-machine','build-function-rule','reverse-machine','multi-step-rule','analogy-machine','logic-switches','systems-mission'],
  science:['race-rate','speed-track','vector-spaceship','momentum-crash','roller-energy','gravity-worlds','change-graph'],
  garden:['match-one-half','match-three-fourths','system-recipe-4-3','deal-hidden-unit','equivalence-five-eighths'],
  observatory:['vector-spaceship','gravity-worlds','orbit-puzzle','spaceport-mission']
};

const destinations=[
  {id:'numbers',name:'Numbers Lab',emoji:'🔢',x:27,y:42,buildingId:'bakery',entry:'bakery',core:true,min:0,topic:'Fractions · decimals · ratios',blurb:'Experiment with quantity, equivalence, scaling, and number relationships.'},
  {id:'geometry',name:'Geometry Workshop',emoji:'📐',x:18,y:68,buildingId:'architect',interior:true,core:true,min:0,topic:'Shapes · space · design',blurb:'Build spatial intuition through symmetry, folding, angles, area, and design.'},
  {id:'builders',name:"Builders’ Yard",emoji:'🏗️',x:43,y:35,buildingId:'bridge',interior:true,core:true,min:0,topic:'Create · experiment · solve',blurb:'Use measurement, structure, forces, and scaling to make things that work.'},
  {id:'patterns',name:'Pattern Pavilion',emoji:'🔷',x:63,y:42,buildingId:'design',entry:'design',core:true,min:0,topic:'Notice · predict · generalize',blurb:'Find hidden rules, visual patterns, sequences, and transformations.'},
  {id:'think',name:'The Think Tank',emoji:'🧠',x:82,y:45,core:true,min:0,topic:'Verbal · quantitative · nonverbal',blurb:'Practice analogy, classification, logic, constraints, and flexible reasoning.',lessons:true},
  {id:'science',name:'Science Studio',emoji:'🧪',x:70,y:68,buildingId:'lab',entry:'lab',core:true,min:0,topic:'Forces · motion · energy',blurb:'Use experiments to discover measurement, motion, change, and physical relationships.'},
  {id:'garden',name:'The Garden',emoji:'🌱',x:89,y:70,buildingId:'clinic',entry:'clinic',core:true,min:0,topic:'Grow your ideas',blurb:'Apply number sense, sorting, comparison, and patterns in living systems.'},
  {id:'observatory',name:'The Observatory',emoji:'🔭',x:88,y:23,buildingId:'observatory',interior:true,min:10,topic:'Patterns beyond',blurb:'A high-level destination for multi-step reasoning, space, scale, and prediction.'}
];

function destinationState(d,completedLessons,world,mastery){
  const builtIds=new Set(Object.values(world?.placements||{}));
  const building=d.buildingId?worldBuildings.find(b=>b.id===d.buildingId):null;
  const requirementOpen=!building||buildingUnlocked(building,completedLessons);
  const unlocked=d.core?true:(mastery>=d.min&&requirementOpen);
  const conceptWins=(destinationConcepts[d.id]||[]).filter(id=>hasMastered(completedLessons,id)).length;
  const placed=d.buildingId?builtIds.has(d.buildingId):conceptWins>=2;
  const built=d.core?true:(placed||conceptWins>=1);
  const level=!unlocked?0:conceptWins>=5?3:conceptWins>=2?2:1;
  return{unlocked,built,placed,level,building,conceptWins};
}

function BuildingArt({id,state}){
  return <span className={`townBuildingArt art-${id} level${state.level}`}>
    <i className="contactShadow"/>
    <i className="isoBase"/>
    <i className="isoSide"/>
    <i className="isoFront"/>
    <i className="isoRoof"/>
    <i className="isoDoor"/>
    <i className="isoWindow win1"/><i className="isoWindow win2"/>
    <span className="artIcon">{destinations.find(d=>d.id===id)?.emoji}</span>
    {id==='numbers'&&<><i className="detail awning"/><i className="detail numberStack">½<br/>%</i></>}
    {id==='geometry'&&<><i className="detail triangleTower"/><i className="detail draftingArm"/></>}
    {id==='builders'&&<><i className="detail cranePole"/><i className="detail craneArm"/><i className="detail craneHook"/></>}
    {id==='patterns'&&<><i className="detail pavilionWing left"/><i className="detail pavilionWing right"/><i className="detail patternFlag">◆</i></>}
    {id==='think'&&<><i className="detail thinkDome"/><i className="detail thinkSpark">✦</i></>}
    {id==='science'&&<><i className="detail labTube t1"/><i className="detail labTube t2"/><i className="detail antenna"/></>}
    {id==='garden'&&<><i className="detail greenhouse"/><i className="detail sprout">🌿</i></>}
    {id==='observatory'&&<><i className="detail observatoryDome"/><i className="detail telescope"/><i className="detail starPulse">✦</i></>}
    {state.level>=2&&<i className="upgradePiece">★</i>}
    {state.level>=3&&<><i className="upgradeGlow"/><i className="upgradeBanner">MASTERED</i></>}
  </span>
}

function Landmark({d,state,selected,onSelect,onVisit}){
  return <button
    className={`townLandmark ${d.id} ${selected?'selected':''} ${state.unlocked?'unlocked':'locked'} ${state.built?'built':'foundation'} level${state.level}`}
    style={{left:`${d.x}%`,top:`${d.y}%`}}
    onClick={()=>selected&&state.unlocked?onVisit(d,state):onSelect(d.id)}
    aria-label={`${d.name}. ${state.unlocked?'Available':'Locked'}.`}
  >
    <BuildingArt id={d.id} state={state}/>
    <span className="townLabel"><strong>{d.name}</strong><small>{selected&&state.unlocked?'Tap again to enter · ':''}{d.topic}</small></span>
    {!state.unlocked&&<span className="townLock">🔒</span>}
    {state.unlocked&&state.conceptWins>0&&<span className="conceptBadge">{state.conceptWins} ideas</span>}
  </button>
}

function TownLife({mastery,completedLessons}){
  const bridgePowered=hasMastered(completedLessons,'bridge-torque');
  const windPowered=hasMastered(completedLessons,'roller-energy')||hasMastered(completedLessons,'bridge-torque');
  const spacePowered=hasMastered(completedLessons,'gravity-worlds')||hasMastered(completedLessons,'orbit-puzzle');
  const logicPowered=hasMastered(completedLessons,'logic-switches');
  return <>
    <div className="ambientTrees grove1">🌲🌳🌲🌳</div><div className="ambientTrees grove2">🌳🌲🌳</div>
    <span className="ambientBird birdA">🐦</span><span className="ambientBird birdB">🕊️</span>
    <span className="ambientWalker kid1">🧒</span><span className="ambientWalker kid2">👧</span>{mastery>=6&&<span className="ambientWalker dog">🐕</span>}
    <div className={`growthFeature windmill ${windPowered?'powered':''}`}><span className="windTower"/><span className="windBlades">✣</span><b>Wind Lab</b></div>
    {mastery>=8&&<div className="growthFeature orchard"><span>🌳🍎🌳</span><b>Idea Orchard</b></div>}
    {hasMastered(completedLessons,'roller-energy')&&<div className="growthFeature solar"><span>▰ ▰ ▰</span><b>Solar Garden</b></div>}
    {mastery>=14&&<div className="growthFeature dock"><span>⚓ 🚤</span><b>Discovery Dock</b></div>}
    {hasMastered(completedLessons,'carnival-mission')&&<div className="growthFeature festival"><span>🎈🎪🎡</span><b>Festival Green</b></div>}
    {hasMastered(completedLessons,'spaceport-mission')&&<div className="growthFeature rocket"><span>🚀</span><b>Launch Ridge</b></div>}
    {bridgePowered&&<div className="bridgeLights"><i/><i/><i/><i/><i/></div>}
    {spacePowered&&<div className="skyBeam"/>}
    {logicPowered&&<div className="townLightString"><i/><i/><i/><i/><i/><i/><i/></div>}
  </>
}

export function TownWorld(props){
  const{world,completedLessons,onEnter,onBack,coins=0}=props;
  const mastery=masteredCount(completedLessons);
  const tier=Math.min(5,1+Math.floor(mastery/10));
  const [mode,setMode]=useState('map');
  const [selectedId,setSelectedId]=useState('numbers');
  const [inside,setInside]=useState(null);
  const states=useMemo(()=>Object.fromEntries(destinations.map(d=>[d.id,destinationState(d,completedLessons,world,mastery)])),[completedLessons,world,mastery]);
  const selected=destinations.find(d=>d.id===selectedId)||destinations[0];
  const state=states[selected.id];

  if(inside)return <NewBuildingInterior buildingId={inside} onExit={()=>setInside(null)}/>;
  if(mode==='street')return <div className="streetWorldShell"><button className="mapReturnButton" onClick={()=>setMode('map')}>🗺️ Town map</button><StreetWorld {...props}/></div>;

  const visitDestination=(destination,destinationState)=>{
    if(!destinationState.unlocked){onBack?.();return}
    if(destination.lessons){onBack?.();return}
    if(destination.interior){setInside(destination.buildingId);return}
    if(destination.entry){onEnter?.(destination.entry);return}
  };
  const visit=()=>visitDestination(selected,state);

  const nextTierAt=tier>=5?50:tier*10;
  const nextTierProgress=tier>=5?100:Math.max(0,Math.min(100,((mastery-(tier-1)*10)/10)*100));

  return <div className={`townMapWorld tier${tier}`}>
    <header className="townHud">
      <div className="townBrand"><span>🌱</span><div><strong>First Principles</strong><small>Learning Valley · Big ideas. Brighter you.</small></div></div>
      <div className="townHudActions">
        <button onClick={()=>setMode('street')}>🚶 Explore street</button>
        <div className="townPlayerStat"><span>🧒</span><div><small>EXPLORER</small><strong>Level {1+Math.floor(mastery/2)}</strong></div><b>⭐ {mastery}</b><b>🪙 {coins}</b></div>
      </div>
    </header>

    <div className="townMapScroller">
      <div className="townMapCanvas">
        <div className="townSun"/>
        <div className="townCloud cloud1">☁</div><div className="townCloud cloud2">☁</div><div className="townCloud cloud3">☁</div>
        <div className="mountainRange far"/><div className="mountainRange near"/>
        <div className="snowCap cap1"/><div className="snowCap cap2"/><div className="snowCap cap3"/>
        <div className="townWaterfall"><i/><i/><i/></div>
        <div className="townRiver riverA"><span className="riverShine s1"/><span className="riverShine s2"/><span className="riverShine s3"/></div>
        <div className="townRiver riverB"><span className="riverShine s4"/><span className="riverShine s5"/></div>
        <div className="townRoad roadA"/><div className="townRoad roadB"/><div className="townRoad roadC"/>
        <div className="townPlaza"><span className="townFountain"><i/><i/><i/></span><b>A BRIGHTER TOMORROW<br/>BUILDS FROM FIRST PRINCIPLES</b></div>
        <div className="townBridge"><i/><i/><i/><b>CURIOSITY CONNECTS US</b></div>
        <div className="townShore"><span>⛵</span><b>The Shore</b><small>Reflect · explore · play</small></div>
        <div className="townForest"><span>🌲🌳🌲</span><b>The Forest</b><small>Make connections</small></div>
        <div className="townCliffs"><span>⛰️</span><b>The Cliffs</b><small>Greater challenges</small></div>
        <div className="townSign"><b>Explore</b><b>Build</b><b>Discover</b><b>Grow</b><b>Belong</b></div>
        <TownLife mastery={mastery} completedLessons={completedLessons}/>
        {destinations.map(d=><Landmark key={d.id} d={d} state={states[d.id]} selected={selectedId===d.id} onSelect={setSelectedId} onVisit={visitDestination}/>)}
      </div>
    </div>

    <aside className="townInfoCard">
      <div className="townInfoIcon">{selected.emoji}</div>
      <div className="townInfoCopy">
        <small>{state.built?`TOWN LANDMARK · LEVEL ${Math.max(1,state.level)}`:state.unlocked?'LEARNING OUTPOST':'FUTURE LANDMARK'}</small>
        <h2>{selected.name}</h2>
        <p>{selected.blurb}</p>
        <div className="townTags"><span>{selected.topic}</span><span>{state.conceptWins} connected ideas</span>{state.placed&&<span>Built with coins ✓</span>}</div>
      </div>
      <div className="townInfoAction">
        {!state.unlocked?<><b>Keep discovering ideas to open this district.</b><button onClick={onBack}>Keep learning →</button></>:<><b>{state.level>=3?'This landmark is thriving.':state.conceptWins?'Your learning is upgrading this place.':'Ready for its first discovery.'}</b><button onClick={visit}>{selected.lessons?'Practice reasoning →':'Enter →'}</button></>}
      </div>
    </aside>

    <div className="townProgress">
      <span>🏘️ Town Tier {tier}</span>
      <div><i style={{width:`${nextTierProgress}%`}}/></div>
      <small>{tier>=5?'Learning Valley is fully open':`${Math.max(0,nextTierAt-mastery)} more mastered ideas to the next town tier`}</small>
    </div>
    <div className="townMotto">“Small ideas build a brighter world.”</div>
  </div>
}
