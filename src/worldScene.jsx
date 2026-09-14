import React,{useEffect,useMemo,useState}from'react';
import{worldBuildings}from'./data/world';
import{pendingOrderCount,unlockedOrderMeta}from'./data/worldOrders';
import{NewBuildingInterior}from'./newBuildingInteriors';

const activityIds={bakery:1,clinic:1,design:1,lab:1};
const newInteriorIds=new Set(['transit','architect','observatory']);
const shopSides=['left','right','left','right','left','right','left'];
const customerLooks=['🐰','🦊','🐼','🐶','🐱','🦝','🐻'];
const customerNames=['Mia','Theo','Pip','Luna','Nico','Zoe','Finn'];
const requestCopy={
 bakery:['I’m getting ready for a party and the bakery needs help with my order.','Can you help the baker make exactly what I need?'],
 clinic:['My pet needs some help at the Animal Clinic.','Can you help the clinic figure out what my pet needs?'],
 design:['I need a design for something special in town.','Can you help the Pattern Studio finish it?'],
 lab:['The Measurement Lab has a job for me.','Can you help them get the amounts exactly right?']
};
const mastered=c=>Object.values(c||{}).filter(x=>x?.discovered||x?.transferred).length;

export function GrowingWorldScene({world,completedLessons,onEnter,onChooseLot}){
 const placed=world?.placements||{},mastery=mastered(completedLessons),[inside,setInside]=useState(null),[lane,setLane]=useState(0),[distance,setDistance]=useState(0),[dialogue,setDialogue]=useState(null),[accepted,setAccepted]=useState(null),[questOpen,setQuestOpen]=useState(false);
 const buildings=useMemo(()=>Object.entries(placed).map(([lot,id],idx)=>({lot:+lot,id,b:worldBuildings.find(x=>x.id===id),side:shopSides[idx%shopSides.length],d:18+idx*17})).filter(x=>x.b),[placed]);
 const customers=useMemo(()=>{let n=0;return buildings.flatMap((shop,shopIndex)=>{if(!activityIds[shop.id])return[];const pending=unlockedOrderMeta(shop.id,completedLessons).filter(o=>!world?.activities?.[shop.id]?.completedOrders?.[o.id]);return pending.slice(0,2).map((order,i)=>({id:`${shop.id}-${order.id}`,shopId:shop.id,shopName:shop.b.name,order,look:customerLooks[n%customerLooks.length],name:customerNames[n++%customerNames.length],d:shop.d-5-i*5,side:i%2?'right':'left'}))})},[buildings,world,completedLessons]);
 const visibleBuildings=buildings.map(x=>({...x,rel:x.d-distance})).filter(x=>x.rel>-7&&x.rel<82);
 const visibleCustomers=customers.map(x=>({...x,rel:x.d-distance})).filter(x=>x.rel>-5&&x.rel<55);
 const closestCustomer=[...visibleCustomers].sort((a,b)=>Math.abs(a.rel)-Math.abs(b.rel))[0];
 const closestBuilding=[...visibleBuildings].sort((a,b)=>Math.abs(a.rel)-Math.abs(b.rel))[0];
 const activeCustomer=closestCustomer&&Math.abs(closestCustomer.rel)<8?closestCustomer:null;
 const activeBuilding=closestBuilding&&Math.abs(closestBuilding.rel)<9?closestBuilding:null;
 const targetBuilding=accepted&&buildings.find(b=>b.id===accepted.shopId);
 const move=(side,forward)=>{setDialogue(null);setLane(v=>Math.max(-1,Math.min(1,v+side)));setDistance(v=>Math.max(0,Math.min(110,v+forward)))};
 useEffect(()=>{const key=e=>{if(['INPUT','BUTTON','TEXTAREA'].includes(e.target.tagName))return;const k=e.key.toLowerCase();if(k==='arrowleft'||k==='a')move(-1,0);if(k==='arrowright'||k==='d')move(1,0);if(k==='arrowup'||k==='w')move(0,4);if(k==='arrowdown'||k==='s')move(0,-4)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
 if(inside)return <NewBuildingInterior buildingId={inside} onExit={()=>setInside(null)}/>;
 const enter=id=>newInteriorIds.has(id)?setInside(id):onEnter(id);
 const talk=c=>setDialogue(c);
 const accept=c=>{setAccepted(c);setDialogue(null)};
 const jumpToTarget=()=>{if(!targetBuilding)return;setDistance(Math.max(0,targetBuilding.d-5));setLane(targetBuilding.side==='left'?-1:1)};
 return <div className="streetWorld">
  <div className="streetSky"><span className="streetSun">☀️</span><span className="streetCloud sc1">☁️</span><span className="streetCloud sc2">☁️</span><div className="streetHills h1"/><div className="streetHills h2"/></div>
  <div className="streetScene"><div className="streetRoad"><span className="roadLine r1"/><span className="roadLine r2"/><span className="roadLine r3"/><span className="roadLine r4"/></div><div className="sidewalk leftWalk"/><div className="sidewalk rightWalk"/>
   <div className="horizonSign">Learning Valley</div>
   {visibleBuildings.map((o,i)=>{const depth=Math.max(.32,1-o.rel/105),y=16+(1-depth)*31,x=o.side==='left'?8+depth*10:92-depth*10,near=activeBuilding?.lot===o.lot,target=accepted?.shopId===o.id;return <button key={`${o.lot}-${o.id}`} className={`streetBuilding ${o.side} ${near?'near':''} ${target?'destination':''}`} style={{left:`${x}%`,bottom:`${y}%`,transform:`translateX(-50%) scale(${depth})`,zIndex:Math.round(depth*80)}} onClick={()=>{setDistance(Math.max(0,o.d-4));setLane(o.side==='left'?-1:1)}}><span className={`streetBuildingArt building-${o.id}`}><i className="roof"/><i className="front"><b>{o.b.emoji}</b><em>▣</em></i></span><strong>{o.b.name}</strong>{target&&<small>YOUR DESTINATION</small>}</button>})}
   {visibleCustomers.map(c=>{const depth=Math.max(.42,1-c.rel/75),y=13+(1-depth)*30,x=c.side==='left'?31-depth*6:69+depth*6,near=activeCustomer?.id===c.id;return <button key={c.id} className={`streetCustomer ${near?'near':''}`} style={{left:`${x}%`,bottom:`${y}%`,transform:`translateX(-50%) scale(${depth})`,zIndex:Math.round(depth*90)}} onClick={()=>{setDistance(Math.max(0,c.d-2));setLane(c.side==='left'?-1:1);talk(c)}}><span className="npcShadow"/><span className="npcSprite">{c.look}</span>{near&&<span className="talkBubble">💬 Talk</span>}</button>})}
   <div className="streetPlayer"><span className="playerBack">🧒</span></div>
  </div>
  <div className="streetHud"><div><small>MY WORLD</small><b>Learning Valley</b></div><span>⭐ {mastery}</span></div>
  {accepted&&<div className="activeOrder"><span>{accepted.look}</span><div><small>ACTIVE ORDER · {accepted.name}</small><b>{accepted.order.label}</b><p>Head to {accepted.shopName}.</p></div><button onClick={jumpToTarget}>Show me →</button></div>}
  <div className="streetControls"><button onClick={()=>move(0,5)}>▲</button><div><button onClick={()=>move(-1,0)}>◀</button><button onClick={()=>move(0,-5)}>▼</button><button onClick={()=>move(1,0)}>▶</button></div><small>Walk</small></div>
  {(activeCustomer||activeBuilding)&&!dialogue&&<div className="contextAction">{activeCustomer?<><span>{activeCustomer.look}</span><div><small>NEARBY</small><b>{activeCustomer.name}</b><p>Looks like they need some help.</p></div><button onClick={()=>talk(activeCustomer)}>Talk</button></>:<><span>{activeBuilding.b.emoji}</span><div><small>YOU’RE HERE</small><b>{activeBuilding.b.name}</b><p>{accepted?.shopId===activeBuilding.id?'This is where your customer needs help.':'Step inside and see what is happening.'}</p></div><button onClick={()=>enter(activeBuilding.id)}>Go inside →</button></>}</div>}
  {dialogue&&<div className="npcDialogue"><button className="closeDialogue" onClick={()=>setDialogue(null)}>×</button><div className="dialogueNpc"><span>{dialogue.look}</span><b>{dialogue.name}</b></div><div className="dialogueText"><small>CUSTOMER REQUEST</small><h2>{dialogue.order.label}</h2><p>“{requestCopy[dialogue.shopId]?.[0]||'I need some help in town.'} {requestCopy[dialogue.shopId]?.[1]||'Can you help me?'}”</p><div className="dialogueDestination"><span>{dialogue.shopName}</span><strong>{dialogue.order.label}</strong></div><button className="acceptOrder" onClick={()=>accept(dialogue)}>I’ll help! →</button></div></div>}
  <button className="streetQuestButton" onClick={()=>setQuestOpen(true)}>📋 <span>{customers.length}</span></button>
  {questOpen&&<div className="worldModal"><button onClick={()=>setQuestOpen(false)}>×</button><small>TOWN REQUESTS</small><h2>People around town need help</h2><p>Orders now belong to customers you can meet in the world.</p><div className="worldQuestRows">{customers.slice(0,6).map(c=><button key={c.id} onClick={()=>{setQuestOpen(false);setDistance(Math.max(0,c.d-2));talk(c)}}><span>{c.look}</span><b>{c.name} · {c.order.label}</b><em>Find them →</em></button>)}</div></div>}
  <div className="streetHint">Walk forward to explore · approach people to discover requests · WASD/arrows also work</div>
 </div>
}
