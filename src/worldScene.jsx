import React from'react';
import{worldBuildings}from'./data/world';
import{pendingOrderCount}from'./data/worldOrders';

const activityIds={bakery:'bakery',clinic:'clinic',design:'design',lab:'lab'};
const scenery=['🌳','🌲','🌼','🌳','🌷','🌲','🌻','🌳'];

export function GrowingWorldScene({world,completedLessons,onEnter,onChooseLot,selected}){const placed=world?.placements||{};return <div className="cityScene"><div className="citySky"><span className="sun">☀️</span><span className="cloud c1">☁️</span><span className="cloud c2">☁️</span></div><div className="cityHills">{scenery.map((x,i)=><span key={i}>{x}</span>)}</div><div className="cityRoad roadOne"/><div className="cityRoad roadTwo"/><div className="cityLots">{Array.from({length:12},(_,i)=>{const id=placed[i],b=worldBuildings.find(x=>x.id===id),pending=b&&activityIds[b.id]?pendingOrderCount(b.id,world,completedLessons):0;return <button key={i} className={`cityLot ${id?'builtLot':'emptyCityLot'} ${selected===i?'selectedCityLot':''}`} onClick={()=>id?onEnter(id):onChooseLot(i)}>{b?<><span className="buildingSprite">{b.emoji}</span><b>{b.name}</b>{pending>0&&<span className="orderBadge">{pending} order{pending===1?'':'s'}</span>}<small>{activityIds[b.id]?(pending>0?'Orders waiting · tap to visit':'All caught up · tap to visit'):'Growing soon'}</small></>:<><span className="lotGrass">🌱</span><small>{selected===i?'Build here':'Open lot'}</small></>}</button>})}</div><div className="cityFooter"><span>🏡</span><span>🚲</span><span>🌳</span><span>🚌</span><span>🌷</span><span>🏠</span></div></div>}
