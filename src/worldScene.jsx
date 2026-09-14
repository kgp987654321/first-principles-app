import React,{useState}from'react';
import{worldBuildings}from'./data/world';
import{pendingOrderCount}from'./data/worldOrders';

const activityIds={bakery:'bakery',clinic:'clinic',design:'design',lab:'lab'};
const allResidents=[
  {emoji:'🐶',name:'Biscuit',x:18,y:58,requires:0},
  {emoji:'🐱',name:'Mochi',x:76,y:55,requires:2},
  {emoji:'🐰',name:'Pip',x:64,y:78,requires:5},
  {emoji:'🦊',name:'Finn',x:29,y:73,requires:8},
  {emoji:'🐼',name:'Poppy',x:73,y:34,requires:12},
  {emoji:'🦉',name:'Nova',x:47,y:28,requires:16},
  {emoji:'🦝',name:'Remy',x:86,y:77,requires:20}
];
const flowers=['🌼','🌷','🌻','🌸','🌼','🌷','🌸'];
const lots=[
  {x:18,y:36},{x:41,y:34},{x:64,y:37},{x:82,y:42},
  {x:20,y:58},{x:43,y:61},{x:66,y:60},{x:84,y:65},
  {x:18,y:80},{x:40,y:82},{x:62,y:81},{x:82,y:84}
];
const masteredCount=completed=>Object.values(completed||{}).filter(x=>x?.discovered||x?.transferred).length;
const buildingLevel=(id,world)=>{const done=Object.keys(world?.activities?.[id]?.completedOrders||{}).length;return done>=6?3:done>=3?2:1};
const upgradeMark=level=>level===3?'✨':level===2?'⭐':'';

export function GrowingWorldScene({world,completedLessons,onEnter,onChooseLot,selected}){
  const placed=world?.placements||{};
  const mastery=masteredCount(completedLessons);
  const residents=allResidents.filter(r=>mastery>=r.requires);
  const [player,setPlayer]=useState({x:50,y:78});
  const movePlayer=e=>{if(e.target.closest('button'))return;const r=e.currentTarget.getBoundingClientRect();const x=Math.max(5,Math.min(95,((e.clientX-r.left)/r.width)*100));const y=Math.max(28,Math.min(92,((e.clientY-r.top)/r.height)*100));setPlayer({x,y})};
  const tier=mastery>=20?4:mastery>=15?3:mastery>=10?2:mastery>=5?1:0;
  return <div className={`cityScene cozyTown townTier${tier}`} onClick={movePlayer} aria-label="Learning Valley town. Tap the grass to move your character.">
    <div className="citySky"><span className="sun">☀️</span><span className="cloud c1">☁️</span><span className="cloud c2">☁️</span><span className="cloud c3">☁️</span>{tier>=4&&<><span className="firework f1">🎆</span><span className="firework f2">🎇</span></>}</div>
    <div className="farHills"><span>🌲</span><span>🌳</span><span>🌲</span><span>🌳</span><span>🌲</span></div>
    <div className="river"><span className="riverSparkle s1">✦</span><span className="riverSparkle s2">✦</span><span className="riverSparkle s3">✦</span></div>
    <div className="bridge">🪵</div>
    <div className="townSquare"><span className="squareTree">🌳</span><span className="squareBench">🪑</span>{tier>=2&&<span className="squareFountain">⛲</span>}<b>Learning Square</b></div>
    {mastery>=8&&<div className="districtSign creekside">🌊 Creekside</div>}
    {mastery>=14&&<div className="districtSign hilltop">🌲 Hilltop</div>}
    <div className="path pathA"/><div className="path pathB"/><div className="path pathC"/>
    <div className="natureCluster n1">🌳🌼</div><div className="natureCluster n2">🌲🌷</div><div className="natureCluster n3">🌳🌻</div><div className="natureCluster n4">🌲🌸</div>
    <div className="flowerTrail">{flowers.map((f,i)=><span key={i}>{f}</span>)}</div>
    {tier>=1&&<div className="milestoneDecor balloons">🎈 🎈</div>}
    {tier>=3&&<div className="milestoneDecor lanterns">🏮 ✨ 🏮 ✨ 🏮</div>}
    <div className="mapLots">{lots.map((pos,i)=>{const id=placed[i],b=worldBuildings.find(x=>x.id===id),pending=b&&activityIds[b.id]?pendingOrderCount(b.id,world,completedLessons):0,level=b?buildingLevel(b.id,world):1;return <button key={i} style={{left:`${pos.x}%`,top:`${pos.y}%`}} className={`mapLot ${id?'mapBuilding':'mapOpenLot'} buildingLevel${level} ${selected===i?'selectedMapLot':''}`} onClick={()=>id?onEnter(id):onChooseLot(i)}>{b?<><span className="buildingSprite">{b.emoji}<i>{upgradeMark(level)}</i></span><span className="buildingLabel">{b.name}{level>1?` · Lv.${level}`:''}</span>{pending>0&&<span className="orderBadge">{pending}</span>}<small>{activityIds[b.id]?(pending>0?'orders waiting':level===3?'landmark shop':'visit'):'growing soon'}</small></>:<><span className="lotGrass">🌱</span><small>{selected===i?'build here':'open lot'}</small></>}</button>})}</div>
    {residents.map((r,i)=><div key={r.name} className={`townResident resident${i+1}`} style={{left:`${r.x}%`,top:`${r.y}%`}}><span>{r.emoji}</span><small>{r.name}</small></div>)}
    {mastery>=5&&mastery<10&&<div className="worldEvent eventOne">🌸 Flower Festival!</div>}
    {mastery>=10&&mastery<15&&<div className="worldEvent eventTwo">🛍️ Market Day!</div>}
    {mastery>=15&&mastery<20&&<div className="worldEvent eventThree">🏮 Lantern Night!</div>}
    {mastery>=20&&<div className="worldEvent eventFour">🎉 Learning Valley Celebration!</div>}
    <div className="playerAvatar" style={{left:`${player.x}%`,top:`${player.y}%`}}><span>🧒</span><small>You</small></div>
    <div className="townProgress"><b>Town growth</b><span>{mastery} ideas mastered · {residents.length} residents</span></div>
    <div className="townHint">Tap the grass to walk around • Tap a building on the map to visit</div>
  </div>
}
