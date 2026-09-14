import React from'react';
import{worldBuildings}from'./data/world';

const activityIds={bakery:'bakery',clinic:'clinic',design:'design',lab:'lab'};
const orderCounts={bakery:3,clinic:3,design:3,lab:3};
const scenery=['🌳','🌲','🌼','🌳','🌷','🌲','🌻','🌳'];

function pendingFor(id,world,completedLessons){const base=orderCounts[id]||0,done=Object.keys(world?.activities?.[activityIds[id]]?.completedOrders||{}).length;if(!base)return 0;const learned=Object.values(completedLessons||{}).filter(x=>x?.discovered).length;const bonus=Math.min(2,Math.floor(learned/4));return Math.max(0,base+bonus-done)}

export function GrowingWorldScene({world,completedLessons,onEnter,onChooseLot,selected}){const placed=world?.placements||{},entries=Object.entries(placed);return <div className="cityScene"><div className="citySky"><span className="sun">☀️</span><span className="cloud c1">☁️</span><span className="cloud c2">☁️</span></div><div className="cityHills">{scenery.map((x,i)=><span key={i}>{x}</span>)}</div><div className="cityRoad roadOne"/><div className="cityRoad roadTwo"/><div className="cityLots">{Array.from({length:12},(_,i)=>{const id=placed[i],b=worldBuildings.find(x=>x.id===id),pending=b?pendingFor(b.id,world,completedLessons):0;return <button key={i} className={`cityLot ${id?'builtLot':'emptyCityLot'} ${selected===i?'selectedCityLot':''}`} onClick={()=>id?onEnter(id):onChooseLot(i)}>{b?<><span className="buildingSprite">{b.emoji}</span><b>{b.name}</b>{pending>0&&activityIds[b.id]&&<span className="orderBadge">{pending} order{pending===1?'':'s'}</span>}<small>{activityIds[b.id]?'Tap to visit':'Growing soon'}</small></>:<><span className="lotGrass">🌱</span><small>{selected===i?'Build here':'Open lot'}</small></>}</button>})}</div><div className="cityFooter"><span>🏡</span><span>🚲</span><span>🌳</span><span>🚌</span><span>🌷</span><span>🏠</span></div></div>}
