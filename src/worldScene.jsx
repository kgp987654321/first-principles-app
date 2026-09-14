import React,{useState}from'react';
import{worldBuildings}from'./data/world';
import{pendingOrderCount}from'./data/worldOrders';

const activityIds={bakery:'bakery',clinic:'clinic',design:'design',lab:'lab'};
const residents=[{emoji:'🐶',name:'Biscuit',x:18,y:58},{emoji:'🐱',name:'Mochi',x:76,y:55},{emoji:'🐰',name:'Pip',x:64,y:78}];
const flowers=['🌼','🌷','🌻','🌸','🌼','🌷','🌸'];

export function GrowingWorldScene({world,completedLessons,onEnter,onChooseLot,selected}){
  const placed=world?.placements||{};
  const [player,setPlayer]=useState({x:50,y:78});
  const movePlayer=e=>{if(e.target.closest('button'))return;const r=e.currentTarget.getBoundingClientRect();const x=Math.max(5,Math.min(95,((e.clientX-r.left)/r.width)*100));const y=Math.max(28,Math.min(92,((e.clientY-r.top)/r.height)*100));setPlayer({x,y})};
  return <div className="cityScene cozyTown" onClick={movePlayer} aria-label="Learning Valley town. Tap the grass to move your character.">
    <div className="citySky"><span className="sun">☀️</span><span className="cloud c1">☁️</span><span className="cloud c2">☁️</span><span className="cloud c3">☁️</span></div>
    <div className="farHills"><span>🌲</span><span>🌳</span><span>🌲</span><span>🌳</span><span>🌲</span></div>
    <div className="river"><span className="riverSparkle s1">✦</span><span className="riverSparkle s2">✦</span><span className="riverSparkle s3">✦</span></div>
    <div className="bridge">🪵</div>
    <div className="townSquare"><span className="squareTree">🌳</span><span className="squareBench">🪑</span><b>Learning Square</b></div>
    <div className="path pathA"/><div className="path pathB"/><div className="path pathC"/>
    <div className="natureCluster n1">🌳🌼</div><div className="natureCluster n2">🌲🌷</div><div className="natureCluster n3">🌳🌻</div><div className="natureCluster n4">🌲🌸</div>
    <div className="flowerTrail">{flowers.map((f,i)=><span key={i}>{f}</span>)}</div>
    <div className="cityLots">{Array.from({length:12},(_,i)=>{const id=placed[i],b=worldBuildings.find(x=>x.id===id),pending=b&&activityIds[b.id]?pendingOrderCount(b.id,world,completedLessons):0;return <button key={i} className={`cityLot ${id?'builtLot':'emptyCityLot'} ${selected===i?'selectedCityLot':''}`} onClick={()=>id?onEnter(id):onChooseLot(i)}>{b?<><span className="buildingSprite">{b.emoji}</span><b>{b.name}</b>{pending>0&&<span className="orderBadge">{pending}</span>}<small>{activityIds[b.id]?(pending>0?'Orders waiting':'Come visit'):'Growing soon'}</small></>:<><span className="lotGrass">🌱</span><small>{selected===i?'Build here':'Open lot'}</small></>}</button>})}</div>
    {residents.map((r,i)=><div key={r.name} className={`townResident resident${i+1}`} style={{left:`${r.x}%`,top:`${r.y}%`}}><span>{r.emoji}</span><small>{r.name}</small></div>)}
    <div className="playerAvatar" style={{left:`${player.x}%`,top:`${player.y}%`}}><span>🧒</span><small>You</small></div>
    <div className="townHint">Tap the grass to walk around • Tap a building to visit</div>
  </div>
}
