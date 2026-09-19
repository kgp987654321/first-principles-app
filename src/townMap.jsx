import React,{useEffect,useMemo,useState}from'react';
import'./townMap.css';
import'./townMapRefinement.css';
import'./townMapArtPass.css';
import'./townMapRoads.css';
import'./townMapTerrainPass.css';
import'./townMapAtmosphere.css';
import'./townMapMotion.css';
import{worldBuildings,buildingUnlocked}from'./data/world';
import{GrowingWorldScene as StreetWorld}from'./worldSceneConcept';
import{NewBuildingInterior}from'./newBuildingInteriors';
import{TownMicroExperience}from'./townMicroInteractions';

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
  {id:'numbers',name:'Fraction Bakery',emoji:'🥐',x:27,y:42,buildingId:'bakery',entry:'bakery',core:true,min:0,topic:'Recipes · fractions · ratios',blurb:'Run the test kitchen with measuring cups, recipe scaling, equivalence, and ratio thinking.'},
  {id:'geometry',name:'Geometry Woodshop',emoji:'🪚',x:18,y:68,buildingId:'architect',interior:true,core:true,min:0,topic:'Measure · cut · build',blurb:'Use rulers, measured cuts, symmetry, scale, area, and shape to build real projects.'},
  {id:'builders',name:"Builders’ Yard",emoji:'🏗️',x:43,y:35,buildingId:'bridge',interior:true,micro:'buildersyard',core:true,min:0,topic:'Create · experiment · solve',blurb:'Use measurement, structure, forces, and scaling to make things that work.'},
  {id:'patterns',name:'Pattern Studio',emoji:'🎨',x:63,y:42,buildingId:'design',entry:'design',core:true,min:0,topic:'Design · predict · generalize',blurb:'Complete customer design commissions by finding, extending, and creating visual rules.'},
  {id:'think',name:'The Think Tank',emoji:'🧠',x:82,y:45,buildingId:'think',interior:true,core:true,min:0,topic:'Logic · analogy · flexible reasoning',blurb:'Enter the puzzle lounge to solve analogies, classifications, constraints, and multi-step logic.'},
  {id:'science',name:'Science Studio',emoji:'🧪',x:70,y:64.5,buildingId:'lab',entry:'lab',core:true,min:0,topic:'Forces · motion · energy',blurb:'Use experiments to discover measurement, motion, change, and physical relationships.'},
  {id:'garden',name:'The Garden',emoji:'🌱',x:88.5,y:66.5,buildingId:'clinic',entry:'clinic',micro:'gardenlab',core:true,min:0,topic:'Grow your ideas',blurb:'Apply number sense, sorting, comparison, and patterns in living systems.'},
  {id:'observatory',name:'The Observatory',emoji:'🔭',x:88,y:23,buildingId:'observatory',interior:true,micro:'observatorylab',min:10,topic:'Patterns beyond',blurb:'A high-level destination for multi-step reasoning, space, scale, and prediction.'}
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
    {id==='numbers'&&<><i className="detail awning"/><i className="detail numberStack">½<br/>%</i><i className="detail numberTower">1<br/>2<br/>3</i><i className="detail abacus"><b/><b/><b/><b/></i></>}
    {id==='geometry'&&<><i className="detail triangleTower"/><i className="detail draftingArm"/><i className="detail geometryCompass"><b/><b/></i><i className="detail geometryRuler"/><i className="detail shapeTotem"><b/><b/><b/></i></>}
    {id==='builders'&&<><i className="detail cranePole"/><i className="detail craneArm"/><i className="detail craneHook"/><i className="detail craneCab"/><i className="detail scaffold"><b/><b/><b/></i><i className="detail beamStack"/></>}
    {id==='patterns'&&<><i className="detail pavilionWing left"/><i className="detail pavilionWing right"/><i className="detail patternFlag">◆</i><i className="detail patternCanopy"/><i className="detail patternTiles"><b/><b/><b/><b/></i><i className="detail patternLantern l1"/><i className="detail patternLantern l2"/></>}
    {id==='think'&&<><i className="detail thinkDome"/><i className="detail thinkSpark">✦</i><i className="detail logicWing left"><b/><b/><b/></i><i className="detail logicWing right"><b/><b/><b/></i><i className="detail ideaMast"/><i className="detail puzzleMark">?</i></>}
    {id==='science'&&<><i className="detail labTube t1"/><i className="detail labTube t2"/><i className="detail antenna"/><i className="detail scienceDome"/><i className="detail energyCoil"><b/><b/><b/></i><i className="detail weatherVane"/></>}
    {id==='garden'&&<><i className="detail greenhouse"/><i className="detail sprout">🌿</i><i className="detail gardenTrellis"><b/><b/><b/></i><i className="detail gardenBed bed1"/><i className="detail gardenBed bed2"/><i className="detail gardenFlower f1">✿</i><i className="detail gardenFlower f2">✿</i></>}
    {id==='observatory'&&<><i className="detail observatoryDome"/><i className="detail observatorySlit"/><i className="detail telescope"/><i className="detail telescopeStand"/><i className="detail starPulse">✦</i><i className="detail starMarker sA">✦</i><i className="detail starMarker sB">•</i></>}
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



const scenicSpots=[
  {id:'forest',name:'The Forest',x:7,y:40,icon:'🌲',topic:'Make connections',blurb:'A quiet place to connect ideas, compare patterns, and notice relationships.',cta:'Follow the pattern trail',relatedId:'patterns'},
  {id:'cliffs',name:'The Cliffs',x:8,y:20,icon:'⛰️',topic:'Greater challenges',blurb:'Steeper challenges live here — stretch problems, multi-step puzzles, and advanced thinking.',cta:'Try a thinking challenge',relatedId:'think'},
  {id:'shore',name:'The Shore',x:12,y:80,icon:'⛵',topic:'Reflect · explore · play',blurb:'A reflective place for playful practice, review, and free exploration.',cta:'Explore motion by the water',relatedId:'science'},
  {id:'windlab',name:'Wind Lab',x:24,y:30,icon:'🌀',topic:'Energy in motion',blurb:'See motion, force, and energy in action through spinning systems and experiments.',cta:'Visit Science Studio',relatedId:'science'}
];

const mainRoads=[
  {id:'plaza-numbers',d:'M 49 56 C 42 53, 34 47, 27 42',to:'numbers'},
  {id:'plaza-builders',d:'M 49 56 C 47 49, 46 41, 43 35',to:'builders'},
  {id:'plaza-patterns',d:'M 49 56 C 54 51, 58 46, 63 42',to:'patterns'},
  {id:'patterns-think',d:'M 63 42 C 69 40, 76 41, 82 45',to:'think'},
  {id:'plaza-science',d:'M 49 56 C 57 58, 63 61, 70 64.5',to:'science'}
];

const secondaryRoads=[
  {id:'numbers-geometry',d:'M 27 42 C 23 51, 20 60, 18 68',to:'geometry'},
  {id:'science-garden',d:'M 70 64.5 C 77 66, 83 66.5, 88.5 66.5',to:'garden'},
  {id:'patterns-observatory',d:'M 63 42 C 72 36, 81 29, 88 23',to:'observatory'}
];

const footpaths=[
  {id:'numbers',x:28,y:45,rotate:-18},
  {id:'builders',x:44,y:38,rotate:76},
  {id:'patterns',x:63,y:45,rotate:82},
  {id:'think',x:78,y:45,rotate:4},
  {id:'science',x:68,y:61.5,rotate:26},
  {id:'geometry',x:19,y:64,rotate:72},
  {id:'garden',x:84.5,y:65.5,rotate:2},
  {id:'observatory',x:85,y:27,rotate:-40}
];

const districtPads=[
  {id:'numbers',x:27,y:43},
  {id:'builders',x:43,y:36},
  {id:'patterns',x:63,y:43},
  {id:'think',x:82,y:46},
  {id:'science',x:70,y:65.5},
  {id:'geometry',x:18,y:69},
  {id:'garden',x:88.5,y:67.5},
  {id:'observatory',x:88,y:24}
];

const roadProps=[
  {id:'lamp-west',type:'lamp',x:36,y:49},
  {id:'lamp-east',type:'lamp',x:57,y:51},
  {id:'sign-center',type:'sign',x:45,y:53},
  {id:'bench-center',type:'bench',x:53,y:57},
  {id:'shrub-west',type:'shrub',x:32,y:54},
  {id:'shrub-south',type:'shrub',x:60,y:60},
  {id:'rock-ridge',type:'rock',x:74,y:34},
  {id:'flowers-garden',type:'flowers',x:83,y:67}
];

function RoadNetwork({selectedId}){
  return <svg className="roadNetwork" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <g className="mainRoadGroup">
      {mainRoads.map(road=><g key={road.id} className={`roadSegment ${road.to===selectedId?'selectedRoad':''}`}>
        <path className="roadShadow" d={road.d}/>
        <path className="roadEdge" d={road.d}/>
        <path className="roadSurface" d={road.d}/>
        <path className="roadHighlight" d={road.d}/>
      </g>)}
    </g>
    <g className="secondaryRoadGroup">
      {secondaryRoads.map(road=><g key={road.id} className={`secondarySegment ${road.to===selectedId?'selectedRoad':''}`}>
        <path className="secondaryShadow" d={road.d}/>
        <path className="secondaryEdge" d={road.d}/>
        <path className="secondarySurface" d={road.d}/>
      </g>)}
    </g>
  </svg>;
}

function DistrictGrounds(){
  return <>{districtPads.map(pad=><div
    key={pad.id}
    className={`districtGround ${pad.id}Pad`}
    style={{left:`${pad.x}%`,top:`${pad.y}%`}}
  />)}</>;
}

function Footpaths(){
  return <>{footpaths.map(path=><i
    key={path.id}
    className={`buildingFootpath footpath-${path.id}`}
    style={{left:`${path.x}%`,top:`${path.y}%`,transform:`rotate(${path.rotate}deg)`}}
  />)}</>;
}

function RoadBridges(){
  return <>
    <div className="roadBridge eastBridge"><i/><i/><i/><i/><i/></div>
    <div className="roadBridge scienceBridge"><i/><i/><i/><i/><i/></div>
  </>;
}

function RoadsideProps(){
  return <>{roadProps.map(prop=><span
    key={prop.id}
    className={`roadProp prop-${prop.type}`}
    style={{left:`${prop.x}%`,top:`${prop.y}%`}}
    aria-hidden="true"
  />)}</>;
}


function TerrainDetails(){
  return <>
    <div className="terrainPatch meadowWest"><i/><i/><i/></div>
    <div className="terrainPatch meadowEast"><i/><i/><i/><i/></div>
    <div className="terrainPatch meadowSouth"><i/><i/><i/></div>
    <div className="riverBank bankWest"><i/><i/><i/><i/></div>
    <div className="riverBank bankEast"><i/><i/><i/></div>
    <div className="riverBank bankSouth"><i/><i/><i/><i/></div>
    <div className="rockCluster rocksNorth"><i/><i/><i/></div>
    <div className="rockCluster rocksSouth"><i/><i/></div>
    <div className="flowerPatch flowersWest"><i/><i/><i/><i/><i/></div>
    <div className="flowerPatch flowersEast"><i/><i/><i/><i/></div>
    <div className="treeCluster treesMidWest"><i/><i/><i/></div>
    <div className="treeCluster treesMidEast"><i/><i/><i/><i/></div>
    <div className="shoreReeds reedsA"><i/><i/><i/><i/><i/></div>
    <div className="shoreReeds reedsB"><i/><i/><i/><i/></div>
  </>;
}


function AtmosphereLayers(){
  return <>
    <div className="distanceHaze hazeLeft"/>
    <div className="distanceHaze hazeCenter"/>
    <div className="distanceHaze hazeRight"/>
    <div className="sunlightWash"/>
    <div className="terrainTextureLayer"/>
    <div className="waterEdgeDetail waterEdgeA"/>
    <div className="waterEdgeDetail waterEdgeB"/>
    <div className="foregroundCanopy canopyLeft"><i/><i/><i/></div>
    <div className="foregroundCanopy canopyRight"><i/><i/><i/></div>
    <div className="foregroundGrass grassLeft"><i/><i/><i/><i/></div>
    <div className="foregroundGrass grassRight"><i/><i/><i/><i/><i/></div>
  </>;
}


function ScenicSpot({spot,selected,onSelect}){
  return <button
    className={`scenicSpot spot-${spot.id} ${selected?'selected':''}`}
    style={{left:`${spot.x}%`,top:`${spot.y}%`}}
    onClick={()=>onSelect(spot.id)}
    aria-label={`${spot.name}. ${spot.topic}.`}
  >
    <span className="spotIcon">{spot.icon}</span>
    <span className="spotLabel"><strong>{spot.name}</strong><small>{spot.topic}</small></span>
  </button>;
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
  const [selectedPoiId,setSelectedPoiId]=useState(null);
  const [inside,setInside]=useState(null);
  const [microId,setMicroId]=useState(null);
  const states=useMemo(()=>Object.fromEntries(destinations.map(d=>[d.id,destinationState(d,completedLessons,world,mastery)])),[completedLessons,world,mastery]);
  const selected=selectedId?destinations.find(d=>d.id===selectedId):null;
  const state=selected?states[selected.id]:null;
  const selectedPoi=scenicSpots.find(s=>s.id===selectedPoiId)||null;

  const visitDestination=(destination,destinationState)=>{
    if(!destinationState.unlocked){onBack?.();return}
    if(destination.interior){setInside(destination.buildingId);return}
    if(destination.entry){onEnter?.(destination.entry);return}
  };
  const visit=()=>selected&&state?visitDestination(selected,state):null;
  const selectDestination=id=>{setSelectedPoiId(null);setSelectedId(id)};
  const selectPoi=id=>{setSelectedId(null);setSelectedPoiId(id)};
  const followPoi=()=>{if(selectedPoi)setMicroId(selectedPoi.id)};
  const tryOutside=()=>{if(selected?.micro)setMicroId(selected.micro)};
  const goFromMicro=()=>{
    const spot=scenicSpots.find(s=>s.id===microId);
    const destination=destinations.find(d=>d.micro===microId);
    setMicroId(null);
    if(spot?.relatedId){selectDestination(spot.relatedId);return}
    if(destination){selectDestination(destination.id);setTimeout(()=>visitDestination(destination,states[destination.id]),0)}
  };

  useEffect(()=>{
    const ordered=destinations.map(d=>d.id);
    const handleKey=e=>{
      if(inside||microId||mode!=='map')return;
      if(e.key==='Escape'){setSelectedPoiId(null);setSelectedId('numbers');return}
      if(e.key==='Enter'&&selected&&state?.unlocked){visitDestination(selected,state);return}
      if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key))return;
      e.preventDefault();
      const currentIndex=Math.max(0,ordered.indexOf(selectedId));
      const step=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:-1;
      const nextIndex=(currentIndex+step+ordered.length)%ordered.length;
      selectDestination(ordered[nextIndex]);
    };
    window.addEventListener('keydown',handleKey);
    return()=>window.removeEventListener('keydown',handleKey);
  },[inside,microId,mode,selectedId,selected,state]);

  if(inside)return <NewBuildingInterior buildingId={inside} onExit={()=>setInside(null)}/>;
  if(microId)return <TownMicroExperience id={microId} onClose={()=>setMicroId(null)} onGoTo={goFromMicro}/>;
  if(mode==='street')return <div className="streetWorldShell"><button className="mapReturnButton" onClick={()=>setMode('map')}>🗺️ Town map</button><StreetWorld {...props}/></div>;

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
      <div className={`townMapCanvas ${(selectedId||selectedPoiId)?'hasSelection':''}`}>
        <div className="townSun"/>
        <div className="townCloud cloud1">☁</div><div className="townCloud cloud2">☁</div><div className="townCloud cloud3">☁</div>
        <div className="mountainRange far"/><div className="mountainRange near"/>
        <div className="snowCap cap1"/><div className="snowCap cap2"/><div className="snowCap cap3"/>
        <AtmosphereLayers/>
        <div className="townWaterfall"><i/><i/><i/></div>
        <div className="townRiver riverA"><span className="riverShine s1"/><span className="riverShine s2"/><span className="riverShine s3"/></div>
        <div className="townRiver riverB"><span className="riverShine s4"/><span className="riverShine s5"/></div>
        <DistrictGrounds/>
        <TerrainDetails/>
        <RoadNetwork selectedId={selectedId}/>
        <RoadBridges/>
        <Footpaths/>
        <RoadsideProps/>
        <div className="townPlaza"><span className="townFountain"><i/><i/><i/></span><b>A BRIGHTER TOMORROW<br/>BUILDS FROM FIRST PRINCIPLES</b></div>

        <div className="townSign"><b>Explore</b><b>Build</b><b>Discover</b><b>Grow</b><b>Belong</b></div>
        <div className="districtDecor districtNumbers"><i className="districtPad"/><span className="countingStones"><b>1</b><b>2</b><b>3</b><b>4</b></span><span className="numberRuler">0 · 1 · 2 · 3 · 4</span></div>
        <div className="districtDecor districtBuilders"><i className="districtPad"/><span className="yardBeam"/><span className="yardCrate"/><span className="yardCone">▲</span></div>
        <div className="districtDecor districtScience"><i className="districtPad"/><span className="scienceProp p1"/><span className="scienceProp p2"/><span className="scienceWind">✣</span></div>
        <div className="districtDecor districtObservatory"><i className="districtPad ridge"/><span className="ridgeRock r1"/><span className="ridgeRock r2"/><span className="ridgeStars">✦ · ✦</span></div>
        <div className="districtDecor districtGeometry"><i className="districtPad"/><span className="geometryTile t1">△</span><span className="geometryTile t2">□</span><span className="geometryTile t3">○</span></div>
        <div className="districtDecor districtPatterns"><i className="districtPad"/><span className="patternCourt"><b/><b/><b/><b/><b/><b/></span></div>
        <div className="districtDecor districtThink"><i className="districtPad"/><span className="logicPost lp1"/><span className="logicPost lp2"/><span className="logicPost lp3"/><span className="ideaBench"/></div>
        <div className="districtDecor districtGarden"><i className="districtPad"/><span className="plantingRow pr1"/><span className="plantingRow pr2"/><span className="plantingRow pr3"/><span className="gardenGate"/></div>
        <TownLife mastery={mastery} completedLessons={completedLessons}/>
        {scenicSpots.map(spot=><ScenicSpot key={spot.id} spot={spot} selected={selectedPoiId===spot.id} onSelect={selectPoi}/>)}
        {destinations.map(d=><Landmark key={d.id} d={d} state={states[d.id]} selected={selectedId===d.id} onSelect={selectDestination} onVisit={visitDestination}/>)}
      </div>
    </div>

    {selectedPoi?<aside className="townInfoCard scenicCard">
      <div className="townInfoIcon">{selectedPoi.icon}</div>
      <div className="townInfoCopy">
        <small>DISCOVERY SPOT</small>
        <h2>{selectedPoi.name}</h2>
        <p>{selectedPoi.blurb}</p>
        <div className="townTags"><span>{selectedPoi.topic}</span><span>Bonus area</span></div>
      </div>
      <div className="townInfoAction">
        <b>A small place with a big idea.</b>
        <button onClick={followPoi}>Try it here →</button>
      </div>
    </aside>:selected&&state?<aside className="townInfoCard">
      <div className="townInfoIcon">{selected.emoji}</div>
      <div className="townInfoCopy">
        <small>{state.built?`TOWN LANDMARK · LEVEL ${Math.max(1,state.level)}`:state.unlocked?'LEARNING OUTPOST':'FUTURE LANDMARK'}</small>
        <h2>{selected.name}</h2>
        <p>{selected.blurb}</p>
        <div className="townTags"><span>{selected.topic}</span><span>{state.conceptWins} connected ideas</span>{state.placed&&<span>Built with coins ✓</span>}</div>
      </div>
      <div className="townInfoAction">
        {!state.unlocked?<><b>Keep discovering ideas to open this district.</b><button onClick={onBack}>Keep learning →</button></>:<><b>{state.level>=3?'This landmark is thriving.':state.conceptWins?'Your learning is upgrading this place.':'Ready for its first discovery.'}</b><div className="townActionButtons">{selected.micro&&<button className="townTryButton" onClick={tryOutside}>✨ Try outside</button>}<button onClick={visit}>{selected.lessons?'Practice reasoning →':'Enter →'}</button></div></>}
      </div>
    </aside>:null}

    <div className="townProgress">
      <span>🏘️ Town Tier {tier}</span>
      <div><i style={{width:`${nextTierProgress}%`}}/></div>
      <small>{tier>=5?'Learning Valley is fully open':`${Math.max(0,nextTierAt-mastery)} more mastered ideas to the next town tier`}</small>
    </div>
    <div className="townMotto">“Small ideas build a brighter world.”</div>
  </div>
}
