import React,{useState}from'react';
import'./worldHubs.css';

const venueMeta={
clinic:{sign:'🐾 ANIMAL CLINIC 🩺',empty:'The clinic is quiet right now.',decor:'clinicDecor',verb:'patients helped'},
studio:{sign:'🎨 PATTERN STUDIO ✂️',empty:'No design requests are waiting.',decor:'studioDecor',verb:'projects finished'},
lab:{sign:'🧪 SCIENCE STUDIO 🔬',empty:'No experiments are waiting.',decor:'labDecor',verb:'experiments completed'},
garden:{sign:'🌱 LEARNING GREENHOUSE 🌻',empty:'No garden jobs are waiting.',decor:'gardenDecor',verb:'garden jobs completed'}
};
const unlocked=(o,completed)=>!o.unlockAfter||Boolean(completed?.[o.unlockAfter]?.discovered);

function HubShell({kind,title,subtitle,emoji,orders,activity,onProgress,onExit,completedLessons={},children}){const available=orders.filter(o=>unlocked(o,completedLessons)),completed=activity?.completedOrders||{},waiting=available.filter(o=>!completed[o.id]),done=available.length-waiting.length,[selectedId,setSelectedId]=useState(waiting[0]?.id||available[0]?.id),order=available.find(o=>o.id===selectedId)||waiting[0]||available[0],meta=venueMeta[kind];const finish=id=>{if(!completed[id])onProgress({completedOrders:{...completed,[id]:true}})};const allDone=waiting.length===0;return <main className={`app hubApp ${kind}HubApp`}><header className={`hero hubHero ${kind}Hero`}><div><small>{title}</small><h1>{emoji} {subtitle}</h1><p>Requests become real missions as your skills grow. Later jobs combine several ideas before they are complete.</p></div><button className="secondary" onClick={onExit}>← Back to My World</button></header><section className="bakeryStatus panel"><div><span className="hubStatusIcon">{kind==='clinic'?'🐾':kind==='studio'?'🎨':'🧪'}</span><b>{waiting.length} waiting · {done} complete</b></div><div className="bakeryUpgrade"><span>{allDone?'🏆':'✨'}</span><div><b>{allDone?'Everything is caught up!':'New work is waiting'}</b><small>{allDone?'Return after more learning to see what changes.':'Higher-level requests use several connected decisions — not one quick answer.'}</small></div></div></section><section className={`bakeryLayout ${kind}Layout`}><aside className={`panel hubVenue ${kind}Venue`}><div className="venueSign">{meta.sign}</div><div className="venueScene"><div className="venueWindowTop">{waiting.length?<div className="venueWaiting">{waiting.map(o=><button key={o.id} className={`venueCustomer ${order?.id===o.id?'active':''}`} onClick={()=>setSelectedId(o.id)}><span>{o.avatar}</span><div><b>{o.customer}</b><small>{o.title}</small>{o.level&&<em>Level {o.level}{o.level>=2?' · mission':''}</em>}</div></button>)}</div>:<div className="venueEmpty"><span>{kind==='clinic'?'🪟':kind==='studio'?'🖼️':'🔬'}</span><b>{meta.empty}</b><small>Head back to lessons. New requests will arrive as new skills are mastered.</small></div>}</div><div className={`venueCounter ${meta.decor}`}/></div><div className="venueTally">✅ {done} {meta.verb}</div></aside><section className={`panel bakeryCounter hubWorkArea ${kind}WorkArea`}>{kind==='studio'&&<div className="studioRoomDecor" aria-hidden="true"><div className="studioWindow"><i/><i/><i/></div><div className="studioShelf"><span>🧵</span><span>🧶</span><span>📐</span><span>🖌️</span></div><div className="studioSwatches"><i/><i/><i/><i/><i/></div><div className="studioPinboard"><span>NEW</span><b>COLOR</b><em>SHAPE</em></div><div className="studioLamp">💡</div><div className="studioFloorShadow"/></div>}{order?<><div className={`customerBubble ${kind==='studio'?'studioBrief':''}`}><span>{order.avatar}</span><div><small>{order.customer}'s request {order.level?`· Level ${order.level}`:''}</small><h2>{order.title}</h2><p>{order.prompt}</p></div></div>{children(order,finish)}{completed[order.id]&&<div className="successNote">Request complete! Choose another waiting request.</div>}</>:<div className="emptyBakery"><span>{emoji}</span><h2>Everything is complete.</h2><p>New work will appear here as more concepts are mastered.</p></div>}</section></section></main>}

function Mission({order,onDone}){const[stage,setStage]=useState(0),[value,setValue]=useState(0),[message,setMessage]=useState('Complete control 1 to begin the mission.'),[helpOpen,setHelpOpen]=useState(false),[helpStep,setHelpStep]=useState(0),control=order.controls[stage],finished=stage>=order.controls.length;const walkthrough=[{title:'1. What do we know?',text:control.prompt},{title:'2. What idea should I use?',text:control.hint||'Look for the relationship between the numbers in the request.'},{title:'3. Put it together',text:`Set this control to ${control.target} ${control.unit}. Then lock the control and move to the next part.`}];const check=()=>{if(value!==control.target){setMessage(control.hint||'That control is not ready. Use the information in the mission and adjust it.');return}if(stage===order.controls.length-1){setMessage(order.success);onDone(order.id);return}setStage(s=>s+1);setValue(0);setHelpOpen(false);setHelpStep(0);setMessage(`${control.label} locked! The next control is live.`)};if(finished)return null;return <div className="worldMission"><div className="missionProgress">{order.controls.map((c,i)=><div key={c.label} className={`missionNode ${i<stage?'done':i===stage?'active':''}`}><span>{i<stage?'✓':c.icon}</span><b>{c.label}</b><small>{i<stage?'Locked':i===stage?'Active':'Waiting'}</small></div>)}</div><div className="missionScene"><div className="missionSceneArt">{control.art}</div><div className="missionBrief"><small>CONTROL {stage+1} OF {order.controls.length}</small><h3>{control.icon} {control.label}</h3><p>{control.prompt}</p></div><div className="missionDial"><button onClick={()=>setValue(v=>Math.max(0,v-1))}>−</button><div><strong>{value}</strong><small>{control.unit}</small></div><button onClick={()=>setValue(v=>Math.min(control.max||40,v+1))}>+</button></div><div className="missionMeter"><i style={{width:`${Math.min(100,(value/(control.max||40))*100)}%`}}/></div></div>{helpOpen&&<div className="walkthroughCard"><div className="walkthroughCoach">🧠</div><div className="walkthroughBody"><small>QUICK WALKTHROUGH · STEP {helpStep+1} OF {walkthrough.length}</small><h4>{walkthrough[helpStep].title}</h4><p>{walkthrough[helpStep].text}</p><div className="walkthroughActions"><button className="secondary" onClick={()=>{setHelpOpen(false);setHelpStep(0)}}>I can try now</button>{helpStep<walkthrough.length-1&&<button className="walkthroughNext" onClick={()=>setHelpStep(s=>s+1)}>Show next step →</button>}</div></div></div>}<div className="missionActions"><button className="stuckButton" onClick={()=>{setHelpOpen(true);setHelpStep(0)}}>🛟 I’m stuck — walk me through it</button><button className="primary missionLock" onClick={check}>{stage===order.controls.length-1?'Complete mission':'Lock control'}</button></div><p className="feedback">{message}</p></div>}

const CLINIC=[
{id:'food-half',customer:'Biscuit',avatar:'🐶',title:'Half a bowl',prompt:'Biscuit needs exactly half of the 8 food scoops.',type:'count',target:4,max:8,level:1},
{id:'weight-sort',customer:'Mochi',avatar:'🐱',title:'Choose the light supplies',prompt:'Tap every supply that weighs less than 5 kg.',type:'sort',level:1},
{id:'water-three-fourths',customer:'Pip',avatar:'🐰',title:'Fill the water bowl to five-sixths',prompt:'Pip needs the bowl exactly 5/6 full.',type:'fill',target:5,total:6,fraction:'5/6',level:1},
{id:'clinic-scale-blanket',unlockAfter:'scale-robot',customer:'Finn',avatar:'🦊',title:'Build Finn a bigger blanket',prompt:'Finn outgrew a 2 × 3 blanket. Build a new one at double scale, then check how much fabric it needs.',type:'mission',level:2,controls:[{label:'Width',icon:'↔️',art:'🦊 🟦🟦',prompt:'The old blanket is 2 squares wide. Double the width.',target:4,max:8,unit:'squares',hint:'Double means two copies of the old width.'},{label:'Length',icon:'↕️',art:'🟦\n🟦\n🟦',prompt:'The old blanket is 3 squares long. Double the length.',target:6,max:10,unit:'squares',hint:'Two groups of 3 make the new length.'},{label:'Fabric',icon:'🧵',art:'▦',prompt:'Your new blanket is 4 × 6. How many square pieces of fabric cover it?',target:24,max:30,unit:'squares',hint:'Think rows × squares in each row.'}],success:'Finn’s 4 × 6 blanket is ready — scaling both dimensions made 24 square pieces of fabric!'},
{id:'clinic-walk-rate',unlockAfter:'race-rate',customer:'Mochi',avatar:'🐱',title:'Plan Mochi’s recovery walk',prompt:'Mochi walks at a steady pace. Set her pace, predict the route, then plan the full out-and-back walk.',type:'mission',level:3,controls:[{label:'Find pace',icon:'🐾',art:'🐱 · · · · · ·',prompt:'Mochi walks 6 spaces in 3 seconds. How many spaces each second?',target:2,max:6,unit:'spaces/sec',hint:'Split 6 spaces equally across 3 seconds.'},{label:'Reach park',icon:'🌳',art:'🐱 ───── 🌳',prompt:'At 2 spaces each second, how far in 5 seconds?',target:10,max:15,unit:'spaces',hint:'Five seconds means five groups of the pace.'},{label:'Round trip',icon:'🏠',art:'🏠 ← 🐱 → 🌳',prompt:'The park is 10 spaces away. How many spaces for there AND back?',target:20,max:25,unit:'spaces',hint:'The return trip is the same distance again.'}],success:'Walk planned! You used a rate to predict a route and a round trip.'},
{id:'clinic-motion-cart',unlockAfter:'momentum-crash',customer:'Biscuit',avatar:'🐶',title:'Tune the recovery cart',prompt:'The clinic cart must carry supplies smoothly. Use mass and speed thinking to set a safe motion target.',type:'mission',level:4,controls:[{label:'Light cart',icon:'🛒',art:'2 mass × 4 speed',prompt:'What motion score comes from mass 2 and speed 4?',target:8,max:16,unit:'motion',hint:'Multiply mass by speed.'},{label:'Heavier load',icon:'📦',art:'4 mass × 3 speed',prompt:'Now the cart carries more supplies. What motion score is 4 × 3?',target:12,max:20,unit:'motion',hint:'Both mass and speed contribute.'},{label:'Match target',icon:'🎯',art:'3 mass × ? speed',prompt:'Mass is 3. What speed gives motion score 15?',target:5,max:10,unit:'speed',hint:'Find the number that makes 3 × speed = 15.'}],success:'Cart tuned! You used the same mass-speed relationship in three different ways.'}
];
function ClinicTask({order,onDone}){const[n,setN]=useState(0),[picked,setPicked]=useState([]),[msg,setMsg]=useState('Help the patient.');if(order.type==='mission')return <Mission order={order} onDone={onDone}/>;if(order.type==='sort'){const items=[['🪶 1 kg',true],['🥕 2 kg',true],['🧺 6 kg',false],['📦 8 kg',false]];const check=()=>{const ok=picked.length===2&&picked.includes(0)&&picked.includes(1);ok?(setMsg('Yes — both selected supplies are under 5 kg.'),onDone(order.id)):setMsg('Look at each weight. Select every supply that is less than 5 kg.')};return <><div className="hubTiles">{items.map((x,i)=><button key={i} className={picked.includes(i)?'chosen':''} onClick={()=>setPicked(v=>v.includes(i)?v.filter(k=>k!==i):[...v,i])}>{x[0]}</button>)}</div><button className="primary" onClick={check}>Check my choices</button><p className="feedback">{msg}</p></>};const target=order.target,max=order.type==='fill'?(order.total||4):order.max,icon=order.type==='fill'?'💧':'🥣';const check=()=>n===target?(setMsg(order.type==='fill'?`${target} of ${max} parts is ${order.fraction||target+'/'+max}.`:`${target} of ${max} is the requested amount.`),onDone(order.id)):setMsg(`You have ${n}. Try again.`);return <><div className="hubCounter"><button onClick={()=>setN(v=>Math.max(0,v-1))}>−</button><div><span>{icon.repeat(n)||'—'}</span><b>{n} of {max}</b></div><button onClick={()=>setN(v=>Math.min(max,v+1))}>+</button></div><button className="primary" onClick={check}>Check care request</button><p className="feedback">{msg}</p></>}
export function AnimalClinic(props){return <HubShell {...props} kind="clinic" title="Animal Clinic" subtitle="Care for animals with numbers." emoji="🐾" orders={CLINIC}>{(o,f)=><ClinicTask key={o.id} order={o} onDone={f}/>}</HubShell>}

const STUDIO=[
{id:'stripe',customer:'Ari',avatar:'🧑‍🎨',title:'Finish the mural',prompt:'Decode three visual rules to finish Ari’s mural.',type:'patternmission',level:1,stages:[
 {seq:['🔴','🔵','🔴','🔵'],choices:['🔴','🔵','🟡'],answer:0,explain:'The repeat is A-B, so red comes next.'},
 {seq:['🔴','🔴','🔵','🔵','🔴','🔴'],choices:['🔵','🔴','🟡'],answer:0,explain:'The repeat is A-A-B-B, so blue starts the second half.'},
 {seq:['🔺','🔵','🟨','🔺','🔵'],choices:['🟨','🔺','🔵'],answer:0,explain:'The repeat unit has three parts: triangle, blue, yellow.'}
]},
{id:'grow',customer:'Zoe',avatar:'👧',title:'Growing tile design',prompt:'Predict how Zoe’s design grows across three different rules.',type:'patternmission',level:1,stages:[
 {seq:['1','2','3'],choices:['4','5','6'],answer:0,explain:'This pattern adds 1 each step.'},
 {seq:['2','4','6'],choices:['7','8','10'],answer:1,explain:'This pattern adds 2 each step.'},
 {seq:['1','2','4'],choices:['6','8','9'],answer:1,explain:'This pattern doubles each step.'}
]},
{id:'make',customer:'Kai',avatar:'🧒',title:'Design a repeat system',prompt:'Build and transfer a repeating rule across new symbols.',type:'patternmission',level:1,stages:[
 {seq:['🔶','🔷','🔶'],choices:['🔷','🔶','🟢'],answer:0,explain:'A-B-A-B continues with blue.'},
 {seq:['⭐','⭐','🌙','⭐','⭐'],choices:['🌙','⭐','☀️'],answer:0,explain:'The repeat is A-A-B.'},
 {seq:['A','B','C','A','B'],choices:['C','A','B'],answer:0,explain:'The symbols changed, but A-B-C is still the rule.'}
]},
{id:'studio-slope-roof',unlockAfter:'slope-mountain',customer:'Ari',avatar:'🧑‍🎨',title:'Engineer the festival roof',prompt:'The festival stage needs a roof with the same safe steepness all the way across. Tune three connected dimensions.',type:'mission',level:3,controls:[{label:'Simplify slope',icon:'📐',art:'／',prompt:'The reference roof rises 3 for every 6 across. What is the rise for every 2 across?',target:1,max:5,unit:'rise',hint:'3 over 6 has the same steepness as 1 over 2.'},{label:'Scale roof',icon:'🏠',art:'🏠',prompt:'A wider roof runs 8 across at the same steepness. How high should it rise?',target:4,max:10,unit:'rise',hint:'The roof rises 1 for every 2 across.'},{label:'Double span',icon:'🏗️',art:'🏠──🏠',prompt:'Double the 8-wide roof to a run of 16. Keep the same slope. What rise?',target:8,max:18,unit:'rise',hint:'When the run doubles, the rise doubles too.'}],success:'Roof approved — all three sizes preserve exactly the same slope.'},
{id:'studio-rule-sign',unlockAfter:'build-function-rule',customer:'Zoe',avatar:'👧',title:'Program the light-up sign',prompt:'The sign uses one hidden rule for every number. Decode it, then program two new panels.',type:'mission',level:3,controls:[{label:'Decode +',icon:'⚙️',art:'2 → 5   4 → 9',prompt:'The machine doubles the input, then adds how many?',target:1,max:6,unit:'added',hint:'Double 2 gives 4. What gets from 4 to 5?'},{label:'Panel 6',icon:'💡',art:'6 → ?',prompt:'Use the same rule: double 6, then add 1.',target:13,max:20,unit:'output',hint:'First make 12, then apply the final +1.'},{label:'Panel 10',icon:'✨',art:'10 → ?',prompt:'Prove the rule works again for input 10.',target:21,max:25,unit:'output',hint:'Double 10, then add the same 1.'}],success:'Sign programmed! You used one function rule consistently across new inputs.'},
{id:'studio-matrix-window',unlockAfter:'matrix-portal',customer:'Kai',avatar:'🧒',title:'Complete the pattern window',prompt:'The new gallery window uses a two-row matrix rule. Decode it before the glass is installed.',type:'mission',level:4,controls:[{label:'Blue row',icon:'🔵',art:'1 blue → 2 blue',prompt:'The first row doubles from 1 tile to how many tiles?',target:2,max:6,unit:'tiles',hint:'The second position doubles the first.'},{label:'Gold row',icon:'🟡',art:'1 gold → ?',prompt:'Apply exactly the same row rule to one gold tile.',target:2,max:6,unit:'tiles',hint:'Do not change the rule when the color changes.'},{label:'Large panel',icon:'🪟',art:'3 shapes → ?',prompt:'A new panel starts with 3 shapes. If the same rule doubles them, how many?',target:6,max:10,unit:'shapes',hint:'Three doubled makes six.'}],success:'Window complete! You transferred one matrix relationship across colors and quantities.'},
{id:'studio-logic-lights',unlockAfter:'logic-switches',customer:'Ari',avatar:'🧑‍🎨',title:'Wire the gallery lights',prompt:'The exhibit lights follow logic rules. Program three circuits before opening night.',type:'mission',level:4,controls:[{label:'AND circuit',icon:'💡',art:'ON AND ON',prompt:'Two switches are ON in an AND circuit. Is the lamp ON? Set 1 for yes, 0 for no.',target:1,max:1,unit:'ON?',hint:'AND needs both switches ON.'},{label:'Broken AND',icon:'🔌',art:'ON AND OFF',prompt:'One switch is OFF. Set the AND output: 1 for ON, 0 for OFF.',target:0,max:1,unit:'ON?',hint:'If either input is OFF, AND is OFF.'},{label:'OR circuit',icon:'✨',art:'ON OR OFF',prompt:'Now use OR. One switch is ON. Set the output.',target:1,max:1,unit:'ON?',hint:'OR needs at least one switch ON.'}],success:'Gallery lights programmed — you used AND and OR as real control rules.'}
];
function StudioTask({order,onDone}){
 const[msg,setMsg]=useState('Find the design rule.'),[made,setMade]=useState([]),[stage,setStage]=useState(0);
 if(order.type==='mission')return <Mission order={order} onDone={onDone}/>;
 if(order.type==='patternmission'){
   const current=order.stages[stage],finished=stage>=order.stages.length;
   if(finished)return <div className="patternMissionComplete"><span>✨</span><h3>Commission complete!</h3><p>You found the rule, changed representations, and transferred it to a new pattern.</p></div>;
   const choose=i=>{
     if(i!==current.answer){setMsg('That changes the rule. Compare the smallest repeat or growth step again.');return}
     setMsg(current.explain);
     if(stage===order.stages.length-1){onDone(order.id);setStage(s=>s+1)}
     else setTimeout(()=>{setStage(s=>s+1);setMsg('Great. Now transfer the rule to the next design.')},300);
   };
   return <div className="patternMissionTask"><div className="patternMissionProgress">{order.stages.map((_,i)=><span key={i} className={i<stage?'done':i===stage?'active':''}>{i<stage?'✓':i+1}</span>)}</div><div className="studioSequence">{current.seq.map((x,i)=><span key={i}>{x}</span>)}<span>?</span></div><div className="hubTiles">{current.choices.map((x,i)=><button key={i} onClick={()=>choose(i)}>{x}</button>)}</div><p className="feedback">{msg}</p></div>;
 }
 if(order.type==='sequence')return <><div className="studioSequence">{order.seq.map((x,i)=><span key={i}>{x}</span>)}<span>?</span></div><div className="hubTiles">{order.choices.map(x=><button key={x} onClick={()=>x===order.answer?(setMsg('You found the rule and transferred it to the studio job!'),onDone(order.id)):setMsg('That changes the relationship. Compare the examples again.')}>{x}</button>)}</div><p className="feedback">{msg}</p></>;
 const add=x=>setMade(v=>v.length<4?[...v,x]:v),check=()=>made.join('')==='🔶🔷🔶🔷'?(setMsg('You created your own repeating rule!'),onDone(order.id)):setMsg('Try making orange, blue, orange, blue.');
 return <><div className="studioSequence">{made.map((x,i)=><span key={i}>{x}</span>)}{Array.from({length:4-made.length},(_,i)=><span key={'e'+i}>?</span>)}</div><div className="hubTiles"><button onClick={()=>add('🔶')}>🔶</button><button onClick={()=>add('🔷')}>🔷</button><button onClick={()=>setMade([])}>Reset</button></div><button className="primary" onClick={check}>Show my design</button><p className="feedback">{msg}</p></>
}
export function PatternStudio(props){return <HubShell {...props} kind="studio" title="Pattern Studio" subtitle="Create designs from hidden rules." emoji="🎨" orders={STUDIO}>{(o,f)=><StudioTask key={o.id} order={o} onDone={f}/>}</HubShell>}

const LAB=[
{id:'half',customer:'Dr. Nova',avatar:'🥼',title:'Half-full sample',prompt:'Fill the sample tube to 1/2.',target:2,total:4,fraction:'1/2',type:'measure',level:1},
{id:'threequarters',customer:'Dr. Nova',avatar:'🥼',title:'Three-quarter sample',prompt:'Fill the sample tube to 3/4.',target:3,total:4,fraction:'3/4',type:'measure',level:1},
 {id:'third-sample',customer:'Dr. Nova',avatar:'🥼',title:'One-third sample',prompt:'Fill the sample tube to 1/3.',target:2,total:6,fraction:'1/3',type:'measure',level:1},
 {id:'two-thirds-sample',customer:'Dr. Nova',avatar:'🥼',title:'Two-thirds sample',prompt:'Fill the sample tube to 2/3.',target:4,total:6,fraction:'2/3',type:'measure',level:1},
 {id:'three-fifths-sample',unlockAfter:'fraction-language-wheel',customer:'Dr. Nova',avatar:'🥼',title:'Three-fifths sample',prompt:'Fill the sample tube to 3/5.',target:3,total:5,fraction:'3/5',type:'measure',level:2},
 {id:'five-sixths-sample',unlockAfter:'equivalence-five-eighths',customer:'Dr. Nova',avatar:'🥼',title:'Five-sixths sample',prompt:'Fill the sample tube to 5/6.',target:5,total:6,fraction:'5/6',type:'measure',level:3},
 {id:'seven-eighths-sample',unlockAfter:'equivalence-five-eighths',customer:'Dr. Nova',avatar:'🥼',title:'Seven-eighths sample',prompt:'Fill the sample tube to 7/8.',target:7,total:8,fraction:'7/8',type:'measure',level:3},
{id:'double',customer:'Rex',avatar:'🤖',title:'Double the recipe',prompt:'A test needs 2 scoops. Make a double batch.',target:4,total:6,type:'measure',level:1},
{id:'ramp-motion',customer:'Rex',avatar:'🤖',title:'Ramp speed test',prompt:'Change ramp height and friction, then compare how far the cart travels.',type:'ramp',level:1},
{id:'lab-scale-reading',unlockAfter:'map-scale',customer:'Dr. Nova',avatar:'🥼',title:'Calibrate the scale scanner',prompt:'The scanner turns model units into real units. Calibrate it, then predict two readings.',type:'mission',level:2,controls:[{label:'Find scale',icon:'🔎',art:'3 model → 12 real',prompt:'How many real units does each 1 model unit represent?',target:4,max:8,unit:'× scale',hint:'Split 12 real units into 3 equal model units.'},{label:'Read 5',icon:'📡',art:'5 model → ?',prompt:'Use the scale factor on a model reading of 5.',target:20,max:25,unit:'real units',hint:'Five groups of 4.'},{label:'Verify 7',icon:'✅',art:'7 model → ?',prompt:'Verify the calibration with a model reading of 7.',target:28,max:32,unit:'real units',hint:'Seven groups of the same scale factor.'}],success:'Scanner calibrated — the ×4 relationship held for every reading.'},
{id:'lab-machine-rule',unlockAfter:'mystery-machine',customer:'Rex',avatar:'🤖',title:'Repair Rex’s number machine',prompt:'Rex’s machine must follow one rule every time. Diagnose the rule and run two test inputs.',type:'mission',level:3,controls:[{label:'Find offset',icon:'⚙️',art:'1→3   2→5   3→7',prompt:'The machine doubles each input, then adds how many?',target:1,max:5,unit:'added',hint:'Double 1 is 2. What turns 2 into 3?'},{label:'Test 6',icon:'🧪',art:'6 → ?',prompt:'Run input 6 through double, then +1.',target:13,max:18,unit:'output',hint:'Double 6 first.'},{label:'Stress test',icon:'🤖',art:'10 → ?',prompt:'One last test: what should input 10 produce?',target:21,max:25,unit:'output',hint:'Use exactly the same rule — no guessing.'}],success:'Rex is repaired! The same rule survived every test.'},
{id:'lab-gravity-probe',unlockAfter:'gravity-worlds',customer:'Dr. Nova',avatar:'🥼',title:'Calibrate the gravity probe',prompt:'A probe travels differently on different worlds. Use the relationship between gravity and flight distance.',type:'mission',level:4,controls:[{label:'Earth test',icon:'🌍',art:'🚀 ───── 🎯',prompt:'The reference flight lands 6 spaces away. Set the recorded distance.',target:6,max:12,unit:'spaces',hint:'Use the observed landing point.'},{label:'Weaker gravity',icon:'🌙',art:'🚀 ───────── 🎯',prompt:'Weaker gravity lets the same launch travel farther. Set a new distance of 9.',target:9,max:14,unit:'spaces',hint:'Weaker pull means a longer flight.'},{label:'Stronger gravity',icon:'🪐',art:'🚀 ─── 🎯',prompt:'Stronger gravity shortens the same launch to 4 spaces. Record it.',target:4,max:12,unit:'spaces',hint:'Stronger pull brings the probe down sooner.'}],success:'Gravity probe calibrated — you connected stronger pull with shorter flight and weaker pull with longer flight.'},
{id:'lab-change-chart',unlockAfter:'change-graph',customer:'Rex',avatar:'🤖',title:'Tune the growth chart',prompt:'Rex needs a chart that changes at a constant rate. Build three readings from the same rule.',type:'mission',level:4,controls:[{label:'Rate',icon:'📈',art:'0, 3, 6, 9...',prompt:'How much does the value increase each step?',target:3,max:8,unit:'per step',hint:'Compare neighboring values.'},{label:'Step 4',icon:'4️⃣',art:'3 × 4',prompt:'At a rate of 3 per step, what value appears after 4 steps?',target:12,max:18,unit:'value',hint:'Four groups of 3.'},{label:'Step 6',icon:'6️⃣',art:'3 × 6',prompt:'Keep the same rate. What value appears after 6 steps?',target:18,max:24,unit:'value',hint:'The rule does not change as the graph extends.'}],success:'Chart tuned — one constant rate generated every point.'},
{id:'lab-area-scan',unlockAfter:'area-slices',customer:'Dr. Nova',avatar:'🥼',title:'Approximate the curved sample',prompt:'The scanner estimates a curved region by adding thin slices. Refine the scan in stages.',type:'mission',level:5,controls:[{label:'Coarse scan',icon:'▥',art:'▮ ▮ ▮ ▮',prompt:'Start with 4 broad slices. Set the slice count.',target:4,max:16,unit:'slices',hint:'This first scan is intentionally rough.'},{label:'Better scan',icon:'▦',art:'▯▯▯▯▯▯▯▯',prompt:'Double the slice count for a closer fit.',target:8,max:16,unit:'slices',hint:'More slices means each slice is thinner.'},{label:'Fine scan',icon:'📊',art:'||||||||||||||||',prompt:'Double once more for the finest scan.',target:16,max:16,unit:'slices',hint:'As the slices get thinner, the total fits the curved edge more closely.'}],success:'Curved sample scanned — you experienced the core intuition of area by accumulation.'}
];

function ScienceTubeExperiment({order,onDone}){
  const[n,setN]=useState(0),[message,setMessage]=useState('Set the liquid level, then run the test.');
  const ratio=n+'/'+order.total,targetLabel=order.fraction||order.target+'/'+order.total,percent=n/order.total*100;
  const levels=Array.from({length:order.total+1},(_,i)=>i);
  const check=()=>n===order.target?(setMessage('✓ Sample confirmed at '+targetLabel+'.'),onDone(order.id)):setMessage('The sample is '+ratio+'. Adjust it to '+targetLabel+'.');
  return <div className="scienceExperiment">
    <div className="scienceExperimentTop"><div><small>ACTIVE APPARATUS</small><h3>Graduated Sample Station</h3><p>Use the marked levels instead of guessing by eye.</p></div><div className="scienceGoal"><small>TARGET</small><b>{targetLabel}</b></div></div>
    <div className="scienceApparatusGrid">
      <div className="scienceTubeStage">
        <div className="sciencePipette">🧪</div>
        <div className="scienceCylinder">
          <div className="scienceLiquid" style={{height:percent+'%'}}/>
          {levels.slice(1,-1).map(i=><i key={i} style={{bottom:(i/order.total*100)+'%'}}><span>{i}/{order.total}</span></i>)}
        </div>
        <div className="scienceLiveBadge"><small>LIVE READING</small><strong>{ratio}</strong><span>{Math.round(percent)}% full</span></div>
      </div>
      <div className="scienceControlPanel">
        <small>SET THE LEVEL</small>
        <div className="scienceLevelButtons">{levels.map(i=><button key={i} className={n===i?'active':''} onClick={()=>setN(i)}>{i===0?'Empty':i+'/'+order.total}</button>)}</div>
        <div className="scienceStepper"><button onClick={()=>setN(v=>Math.max(0,v-1))}>−</button><b>{ratio}</b><button onClick={()=>setN(v=>Math.min(order.total,v+1))}>+</button></div>
        <button className="primary scienceRun" onClick={check}>Run sample test</button>
        <p className="scienceObservation">{message}</p>
      </div>
    </div>
  </div>
}

function ScienceBatchExperiment({order,onDone}){
  const[n,setN]=useState(0),[message,setMessage]=useState('The base test uses 2 scoops. Build a double batch.');
  const check=()=>n===order.target?(setMessage('✓ Double batch confirmed: 2 + 2 = 4 scoops.'),onDone(order.id)):setMessage('A double batch needs two copies of 2 scoops.');
  return <div className="scienceExperiment">
    <div className="scienceExperimentTop"><div><small>ACTIVE APPARATUS</small><h3>Batch Mixing Bench</h3><p>Build the amount physically, then connect it to multiplication.</p></div><div className="scienceGoal"><small>BASE RECIPE</small><b>2 scoops</b></div></div>
    <div className="scienceApparatusGrid">
      <div className="scienceMixerStage">
        <div className="scienceBeaker"><span>{Array.from({length:n},(_,i)=><i key={i}>●</i>)}</span><b>{n} scoops</b></div>
        <div className="scienceRecipeEquation"><span>2 scoops</span><b>× 2</b><strong>= {n}</strong></div>
      </div>
      <div className="scienceControlPanel"><small>ADD OR REMOVE SCOOPS</small><div className="scienceStepper"><button onClick={()=>setN(v=>Math.max(0,v-1))}>−</button><b>{n}</b><button onClick={()=>setN(v=>Math.min(order.total,v+1))}>+</button></div><button className="primary scienceRun" onClick={check}>Test the batch</button><p className="scienceObservation">{message}</p></div>
    </div>
  </div>
}

function ScienceRampExperiment({order,onDone}){
  const[height,setHeight]=useState(3),[friction,setFriction]=useState(4),[stage,setStage]=useState(0),[runs,setRuns]=useState([]),[message,setMessage]=useState('Run the low-ramp test first.');
  const speed=Math.max(1,Number((height*1.35-friction*.55).toFixed(1))),distance=Math.max(1,Number((speed*3).toFixed(1)));
  const expected=stage===0?{height:3,friction:4}:{height:8,friction:1};
  const run=()=>{
    const ok=height===expected.height&&friction===expected.friction;
    if(!ok){setMessage(stage===0?'Set height 3 and friction 4 for the baseline run.':'Now set height 8 and friction 1 for the comparison run.');return}
    const next=[...runs,{height,friction,speed,distance}];setRuns(next);
    if(stage===0){setStage(1);setHeight(8);setFriction(1);setMessage('Baseline recorded. Now make the ramp higher and the track smoother.')}
    else{setStage(2);setMessage('✓ Higher ramp + lower friction produced more speed and distance.');onDone(order.id)}
  };
  return <div className="scienceExperiment">
    <div className="scienceExperimentTop"><div><small>LIVE EXPERIMENT · {Math.min(stage+1,2)}/2</small><h3>Ramp & Motion Lab</h3><p>{stage===0?'Record a low-energy baseline.':'Compare it with a higher, smoother ramp.'}</p></div><div className="scienceGoal"><small>CURRENT GOAL</small><b>H {expected.height} · F {expected.friction}</b></div></div>
    <div className="scienceRampSceneV2">
      <div className="scienceSky"/>
      <div className="scienceRampV2" style={{height:(58+height*12)+'px'}}/>
      <div className="scienceTrackV2"/>
      <span className="scienceCartV2" style={{left:Math.min(88,18+distance*3.3)+'%'}}>🛒</span>
      <div className="scienceDistanceFlag" style={{left:Math.min(90,18+distance*3.3)+'%'}}><i/><span>{distance} m</span></div>
    </div>
    <div className="scienceRampDashboard">
      <div className="scienceControlPanel scienceRampControlsV2"><label>Ramp height <input type="range" min="1" max="10" value={height} onChange={e=>setHeight(+e.target.value)}/><b>{height}</b></label><label>Friction <input type="range" min="0" max="6" value={friction} onChange={e=>setFriction(+e.target.value)}/><b>{friction}</b></label><button onClick={()=>{setHeight(expected.height);setFriction(expected.friction)}}>Set requested conditions</button><button className="primary" onClick={run} disabled={stage>=2}>▶ Run cart</button></div>
      <div className="scienceReadoutStack"><span><small>SPEED</small><b>{speed}</b><em>m/s</em></span><span><small>DISTANCE</small><b>{distance}</b><em>m</em></span><span><small>OBSERVATION</small><b>{height>5?'More starting height':'Lower starting height'}</b><em>{friction<=2?'low friction':'more friction'}</em></span></div>
    </div>
    {runs.length>0&&<div className="scienceRunTable"><b>LAB NOTEBOOK</b>{runs.map((r,i)=><span key={i}>Run {i+1}: height {r.height} · friction {r.friction} → speed {r.speed}, distance {r.distance}</span>)}</div>}
    <p className="scienceObservation">{message}</p>
  </div>
}

function ScienceMissionApparatus({order,stage,value}){
  const control=order.controls[stage];
  if(order.id==='lab-scale-reading')return <div className="scienceMachine scienceScaleMachine"><small>SCALE SCANNER</small><div className="scienceScaleRows"><span>MODEL</span><b>{stage===0?3:stage===1?5:7}</b><i>×</i><strong>{stage===0?'?':4}</strong><i>=</i><em>{value||'?'}</em></div><div className="scienceScannerBeam"/></div>;
  if(order.id==='lab-machine-rule')return <div className="scienceMachine scienceNumberMachine"><small>NUMBER MACHINE</small><div className="scienceMachineFlow"><span>{stage===0?'1, 2, 3':stage===1?6:10}</span><i>×2 + {stage===0?value:1}</i><strong>{stage===0?'3, 5, 7':value||'?'}</strong></div><div className="scienceGears">⚙️ ⚙️</div></div>;
  if(order.id==='lab-gravity-probe'){const planet=stage===0?'🌍':stage===1?'🌙':'🪐';return <div className="scienceMachine scienceGravityMachine"><small>GRAVITY PROBE</small><span className="sciencePlanet">{planet}</span><div className="scienceProbeArc" style={{width:(28+value*5)+'%'}}/><span className="scienceRocket">🚀</span><strong>{value} spaces</strong></div>}
  if(order.id==='lab-change-chart')return <div className="scienceMachine scienceGraphMachine"><small>GROWTH CHART</small><svg viewBox="0 0 300 180"><line x1="30" y1="150" x2="280" y2="150"/><line x1="30" y1="150" x2="30" y2="20"/><polyline points={'30,150 95,'+(150-Math.min(110,value*4))+' 165,'+(150-Math.min(110,value*6))+' 250,'+(150-Math.min(110,value*8))}/></svg><strong>{control.label}: {value}</strong></div>;
  if(order.id==='lab-area-scan'){const slices=Math.max(1,value);return <div className="scienceMachine scienceAreaMachine"><small>CURVED SAMPLE SCANNER</small><div className="scienceScanCurve">{Array.from({length:Math.min(16,slices)},(_,i)=><i key={i} style={{height:(25+Math.sin((i+1)/(Math.min(16,slices)+1)*Math.PI)*90)+'px'}}/>)}</div><strong>{value} slices</strong></div>}
  return <div className="scienceMachine"><small>ACTIVE INSTRUMENT</small><strong>{control.art}</strong></div>
}

function ScienceAdvancedMission({order,onDone}){
  const[stage,setStage]=useState(0),[value,setValue]=useState(0),[message,setMessage]=useState('Set the instrument, then record the result.'),[help,setHelp]=useState(false);
  const control=order.controls[stage];
  const check=()=>{
    if(value!==control.target){setMessage(control.hint||'That reading does not match the evidence.');return}
    if(stage===order.controls.length-1){setMessage('✓ '+order.success);onDone(order.id);return}
    setStage(s=>s+1);setValue(0);setHelp(false);setMessage('Reading recorded. The next instrument setting is ready.');
  };
  return <div className="scienceExperiment scienceAdvancedExperiment">
    <div className="scienceExperimentTop"><div><small>EXPERIMENT {stage+1} OF {order.controls.length}</small><h3>{control.icon} {control.label}</h3><p>{control.prompt}</p></div><div className="scienceGoal"><small>UNIT</small><b>{control.unit}</b></div></div>
    <div className="scienceMissionProgress">{order.controls.map((x,i)=><span key={x.label} className={i<stage?'done':i===stage?'active':''}>{i<stage?'✓':i+1}<small>{x.label}</small></span>)}</div>
    <div className="scienceApparatusGrid">
      <ScienceMissionApparatus order={order} stage={stage} value={value}/>
      <div className="scienceControlPanel">
        <small>INSTRUMENT CONTROL</small>
        <div className="scienceDial"><button onClick={()=>setValue(v=>Math.max(0,v-1))}>−</button><div><b>{value}</b><span>{control.unit}</span></div><button onClick={()=>setValue(v=>Math.min(control.max||40,v+1))}>+</button></div>
        <input className="scienceRange" type="range" min="0" max={control.max||40} value={value} onChange={e=>setValue(+e.target.value)}/>
        <div className="scienceMissionButtons"><button onClick={()=>setHelp(v=>!v)}>💡 Hint</button><button className="primary" onClick={check}>{stage===order.controls.length-1?'Complete experiment':'Record reading'}</button></div>
        {help&&<div className="scienceHint">{control.hint}</div>}
        <p className="scienceObservation">{message}</p>
      </div>
    </div>
  </div>
}

function ScienceExperiment({order,onDone}){
  if(order.type==='ramp')return <ScienceRampExperiment order={order} onDone={onDone}/>;
  if(order.type==='mission')return <ScienceAdvancedMission order={order} onDone={onDone}/>;
  if(order.id==='double')return <ScienceBatchExperiment order={order} onDone={onDone}/>;
  return <ScienceTubeExperiment order={order} onDone={onDone}/>;
}

export function MeasurementLab({activity,onProgress,onExit,completedLessons={}}){
  const available=LAB.filter(o=>unlocked(o,completedLessons)),completed=activity?.completedOrders||{},waiting=available.filter(o=>!completed[o.id]),done=available.length-waiting.length;
  const[selectedId,setSelectedId]=useState(waiting[0]?.id||available[0]?.id),order=available.find(o=>o.id===selectedId)||waiting[0]||available[0];
  const finish=id=>{if(!completed[id])onProgress({completedOrders:{...completed,[id]:true}})};
  return <main className="app hubApp labHubApp scienceStudioApp">
    <header className="hero hubHero labHero scienceHero"><div><small>SCIENCE STUDIO</small><h1>🧪 Run the experiment.</h1><p>Change variables, read instruments, record evidence, and discover relationships by testing them.</p></div><button className="secondary" onClick={onExit}>← Back to My World</button></header>
    <section className="scienceStatus panel"><div><span>🔬</span><b>{waiting.length} experiments waiting</b><small>{done} complete</small></div><div className="scienceStatusRule"><span>1</span> Change one thing <i>→</i><span>2</span> Observe <i>→</i><span>3</span> Explain</div></section>
    <section className="scienceStudioLayout">
      <aside className="scienceNotebook panel">
        <div className="scienceNotebookHead"><small>LAB NOTEBOOK</small><h2>Experiment Queue</h2><p>Choose a card to bring that apparatus to the main bench.</p></div>
        <div className="scienceExperimentQueue">{available.map(o=><button key={o.id} className={(order?.id===o.id?'active ':'')+(completed[o.id]?'complete':'')} onClick={()=>setSelectedId(o.id)}><span>{completed[o.id]?'✓':o.type==='ramp'?'🛒':o.type==='mission'?'⚙️':'🧪'}</span><div><small>{o.level?'LEVEL '+o.level:'EXPERIMENT'}</small><b>{o.title}</b><em>{completed[o.id]?'Recorded':unlocked(o,completedLessons)?'Ready':'Locked'}</em></div></button>)}</div>
        <div className="scienceNotebookShelf"><span>🧪</span><span>⚗️</span><span>🔬</span><span>📏</span><span>🧫</span></div>
        <div className="scienceNotebookTally">✅ {done} / {available.length} recorded</div>
      </aside>
      <section className="scienceMainBench panel">
        <div className="scienceRoomDecor" aria-hidden="true"><div className="scienceWindow"><i/><i/></div><div className="scienceWallShelf"><span>🧪</span><span>🧫</span><span>⚗️</span><span>🔬</span></div><div className="scienceSafety">🥽 SAFETY FIRST</div><div className="scienceClock">◷</div></div>
        {order?<><div className="scienceBrief"><span>{order.avatar}</span><div><small>{order.customer}'S LAB REQUEST · LEVEL {order.level||1}</small><h2>{order.title}</h2><p>{order.prompt}</p></div>{completed[order.id]&&<b className="scienceRecorded">✓ RECORDED</b>}</div><ScienceExperiment key={order.id} order={order} onDone={finish}/>{completed[order.id]&&<div className="successNote">Experiment recorded. Choose another card from the lab notebook.</div>}</>:<div className="emptyBakery"><span>🔬</span><h2>Everything is recorded.</h2><p>New experiments will unlock as more ideas are mastered.</p></div>}
      </section>
    </section>
  </main>
}

const GARDEN=[
 {id:'garden-half-bed',customer:'Mira',avatar:'👩‍🌾',title:'Plant one-half of the bed',prompt:'Eight planting spots are ready. Plant exactly 1/2.',type:'bed',target:4,total:8,fraction:'1/2',level:1},
 {id:'garden-two-fifths-bed',customer:'Mira',avatar:'👩‍🌾',title:'Plant two-fifths of the bed',prompt:'Ten planting spots are ready. Plant exactly 2/5.',type:'bed',target:4,total:10,fraction:'2/5',level:1},
 {id:'garden-three-fifths-bed',customer:'Sprout',avatar:'🌱',title:'Plant three-fifths of the bed',prompt:'Ten planting spots are ready. Plant exactly 3/5.',type:'bed',target:6,total:10,fraction:'3/5',level:2},
 {id:'garden-two-thirds-bed',customer:'Mira',avatar:'👩‍🌾',title:'Plant two-thirds of the bed',prompt:'Twelve planting spots are ready. Plant exactly 2/3.',type:'bed',target:8,total:12,fraction:'2/3',level:2},
 {id:'garden-five-sixths-bed',customer:'Sprout',avatar:'🌱',title:'Plant five-sixths of the bed',prompt:'Twelve planting spots are ready. Plant exactly 5/6.',type:'bed',target:10,total:12,fraction:'5/6',level:3},
 {id:'garden-seven-eighths-bed',customer:'Mira',avatar:'👩‍🌾',title:'Plant seven-eighths of the bed',prompt:'Sixteen planting spots are ready. Plant exactly 7/8.',type:'bed',target:14,total:16,fraction:'7/8',level:3},
 {id:'garden-ratio-row',customer:'Mira',avatar:'👩‍🌾',title:'Balance the pollinator row',prompt:'Plant 2 flowers for every 1 herb.',type:'ratio',level:1},
 {id:'garden-pattern-path',customer:'Sprout',avatar:'🌱',title:'Finish the garden path',prompt:'Continue the leaf-flower-leaf-flower pattern.',type:'pattern',level:1}
];
function GardenTask({order,onDone}){
 const[n,setN]=useState(0),[a,setA]=useState(2),[b,setB]=useState(1),[seq,setSeq]=useState([]),[msg,setMsg]=useState('Use the greenhouse tools and watch the relationship.');
 if(order.type==='bed'){const check=()=>n===order.target?(setMsg(`Exactly ${order.target} of ${order.total} spots are planted — ${order.fraction||order.target+'/'+order.total}.`),onDone(order.id)):setMsg(`You planted ${n} of ${order.total}. Adjust until the bed shows ${order.fraction||order.target+'/'+order.total}.`);return <><div className="gardenBedTool">{Array.from({length:order.total},(_,i)=><button key={i} className={i<n?'planted':''} onClick={()=>setN(i+1)}>{i<n?'🌱':'·'}</button>)}</div><div className="measureActions"><button onClick={()=>setN(0)}>↻ Reset</button><button className="primary" onClick={check}>Check bed</button></div><p className="feedback">{msg}</p></>}
 if(order.type==='ratio'){const ok=a===2*b,check=()=>ok?(setMsg('The 2-to-1 planting relationship is preserved.'),onDone(order.id)):setMsg('Both groups must scale together as 2 flowers for every 1 herb.');return <><div className="gardenRatioTool"><div><span>{'🌼'.repeat(a)}</span><b>{a} flowers</b><div className="stepper"><button onClick={()=>setA(v=>Math.max(0,v-1))}>−</button><button onClick={()=>setA(v=>Math.min(8,v+1))}>+</button></div></div><div><span>{'🌿'.repeat(b)}</span><b>{b} herbs</b><div className="stepper"><button onClick={()=>setB(v=>Math.max(0,v-1))}>−</button><button onClick={()=>setB(v=>Math.min(4,v+1))}>+</button></div></div></div><button className="primary" onClick={check}>Check planting ratio</button><p className="feedback">{msg}</p></>}
 const add=x=>setSeq(v=>v.length<6?[...v,x]:v),correct=seq.join('')==='🌿🌸🌿🌸🌿🌸',check=()=>correct?(setMsg('The path repeats leaf-flower all the way through.'),onDone(order.id)):setMsg('Look for the smallest repeating unit: leaf, flower.');
 return <><div className="gardenPatternPath">{Array.from({length:6},(_,i)=><span key={i}>{seq[i]||'?'}</span>)}</div><div className="hubTiles"><button onClick={()=>add('🌿')}>🌿</button><button onClick={()=>add('🌸')}>🌸</button><button onClick={()=>setSeq([])}>↻ Reset</button></div><button className="primary" onClick={check}>Check path</button><p className="feedback">{msg}</p></>
}
export function GardenHub(props){return <HubShell {...props} kind="garden" title="Learning Greenhouse" subtitle="Grow patterns, fractions, ratios, and living systems." emoji="🌱" orders={GARDEN}>{(o,f)=><GardenTask key={o.id} order={o} onDone={f}/>}</HubShell>}
