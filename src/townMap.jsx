import React,{useMemo,useState}from'react';
import'./townMap.css';
import{worldBuildings,buildingUnlocked}from'./data/world';
import{GrowingWorldScene as StreetWorld}from'./worldSceneConcept';
import{NewBuildingInterior}from'./newBuildingInteriors';

const masteredCount=completed=>Object.values(completed||{}).filter(v=>v?.discovered||v?.transferred).length;

const destinations=[
  {id:'numbers',name:'Numbers Lab',icon:'◔',emoji:'🔢',x:29,y:42,buildingId:'bakery',entry:'bakery',min:0,topic:'Fractions · decimals · ratios',blurb:'Experiment with quantity, equivalence, scaling, and number relationships.'},
  {id:'geometry',name:'Geometry Workshop',icon:'△',emoji:'📐',x:19,y:68,buildingId:'architect',interior:true,min:3,topic:'Shapes · space · design',blurb:'Build spatial intuition through symmetry, folding, angles, area, and design.'},
  {id:'builders',name:"Builders’ Yard",icon:'⚒',emoji:'🏗️',x:44,y:35,buildingId:'bridge',interior:true,min:6,topic:'Create · experiment · solve',blurb:'Use measurement, structure, forces, and scaling to make things that work.'},
  {id:'patterns',name:'Pattern Pavilion',icon:'✦',emoji:'🔷',x:64,y:43,buildingId:'design',entry:'design',min:0,topic:'Notice · predict · generalize',blurb:'Find hidden rules, visual patterns, sequences, and transformations.'},
  {id:'think',name:'The Think Tank',icon:'◎',emoji:'🧠',x:82,y:45,min:0,topic:'Verbal · quantitative · nonverbal',blurb:'Practice analogy, classification, logic, constraints, and flexible reasoning.',lessons:true},
  {id:'science',name:'Science Studio',icon:'⚛',emoji:'🧪',x:71,y:68,buildingId:'lab',entry:'lab',min:0,topic:'Forces · motion · energy',blurb:'Use experiments to discover measurement, motion, change, and physical relationships.'},
  {id:'garden',name:'The Garden',icon:'❧',emoji:'🌱',x:89,y:70,buildingId:'clinic',entry:'clinic',min:2,topic:'Grow your ideas',blurb:'Apply number sense, sorting, comparison, and patterns in living systems.'},
  {id:'observatory',name:'The Observatory',icon:'☄',emoji:'🔭',x:88,y:24,buildingId:'observatory',interior:true,min:10,topic:'Patterns beyond',blurb:'A high-level destination for multi-step reasoning, space, scale, and prediction.'}
];

function destinationState(d,completedLessons,world,mastery){
  const builtIds=new Set(Object.values(world?.placements||{}));
  const building=d.buildingId?worldBuildings.find(b=>b.id===d.buildingId):null;
  const requirementOpen=!building||buildingUnlocked(building,completedLessons);
  const unlocked=mastery>=d.min&&requirementOpen;
  const built=d.buildingId?builtIds.has(d.buildingId):mastery>=Math.max(1,d.min+4);
  const level=built?(mastery>=d.min+18?3:mastery>=d.min+8?2:1):0;
  return{unlocked,built,level,building};
}

function Landmark({d,state,selected,onSelect}){
  return <button
    className={`townLandmark ${d.id} ${selected?'selected':''} ${state.unlocked?'unlocked':'locked'} ${state.built?'built':'foundation'} level${state.level}`}
    style={{left:`${d.x}%`,top:`${d.y}%`}}
    onClick={()=>onSelect(d.id)}
    aria-label={`${d.name}. ${state.unlocked?'Available':'Locked'}.`}
  >
    <span className="townBuilding">
      <i className="townRoof"/>
      <i className="townFacade"/>
      <i className="townDoor"/>
      <i className="townWindow w1"/>
      <i className="townWindow w2"/>
      <b>{d.emoji}</b>
      {state.level>1&&<em>★</em>}
    </span>
    <span className="townLabel"><strong>{d.name}</strong><small>{d.topic}</small></span>
    {!state.unlocked&&<span className="townLock">🔒</span>}
  </button>
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

  const visit=()=>{
    if(!state.unlocked){onBack?.();return}
    if(selected.lessons){onBack?.();return}
    if(selected.interior){setInside(selected.buildingId);return}
    if(selected.entry){onEnter?.(selected.entry);return}
  };

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
        <div className="townWaterfall">≈<span>≈</span><i>≈</i></div>
        <div className="townRiver riverA"/><div className="townRiver riverB"/>
        <div className="townRoad roadA"/><div className="townRoad roadB"/><div className="townRoad roadC"/>
        <div className="townPlaza"><span className="townFountain">🌐</span><b>A BRIGHTER TOMORROW<br/>BUILDS FROM FIRST PRINCIPLES</b></div>
        <div className="townBridge"><i/><i/><i/><b>CURIOSITY CONNECTS US</b></div>
        <div className="townShore"><span>⛵</span><b>The Shore</b><small>Reflect · explore · play</small></div>
        <div className="townForest"><span>🌲🌳🌲</span><b>The Forest</b><small>Make connections</small></div>
        <div className="townCliffs"><span>⛰️</span><b>The Cliffs</b><small>Greater challenges</small></div>
        <div className="townSign"><b>Explore</b><b>Build</b><b>Discover</b><b>Grow</b><b>Belong</b></div>

        {mastery>=4&&<div className="growthFeature windmill">🌬️<span>Wind Lab</span></div>}
        {mastery>=8&&<div className="growthFeature orchard">🌳🍎🌳<span>Idea Orchard</span></div>}
        {mastery>=14&&<div className="growthFeature solar">☀️▦▦<span>Solar Garden</span></div>}
        {mastery>=20&&<div className="growthFeature dock">⚓🚤<span>Discovery Dock</span></div>}
        {mastery>=30&&<div className="growthFeature festival">🎈🎪<span>Festival Green</span></div>}
        {mastery>=40&&<div className="growthFeature rocket">🚀<span>Launch Ridge</span></div>}

        {destinations.map(d=><Landmark key={d.id} d={d} state={states[d.id]} selected={selectedId===d.id} onSelect={setSelectedId}/>)}
      </div>
    </div>

    <aside className="townInfoCard">
      <div className="townInfoIcon">{selected.emoji}</div>
      <div className="townInfoCopy">
        <small>{state.built?`TOWN LANDMARK · LEVEL ${Math.max(1,state.level)}`:state.unlocked?'LEARNING OUTPOST':'FUTURE LANDMARK'}</small>
        <h2>{selected.name}</h2>
        <p>{selected.blurb}</p>
        <div className="townTags"><span>{selected.topic}</span>{state.built&&<span>Built in your town ✓</span>}</div>
      </div>
      <div className="townInfoAction">
        {!state.unlocked?<><b>Unlock at mastery {selected.min || 1}</b><button onClick={onBack}>Keep learning →</button></>:<><b>{state.built?'Your learning has changed this place.':'Ready to explore.'}</b><button onClick={visit}>{selected.lessons?'Practice reasoning →':'Enter →'}</button></>}
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
