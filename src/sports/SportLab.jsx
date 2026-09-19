import React from'react';
import'./sportsShared.css';

export function SportControl({label,value,min,max,step=1,onChange,suffix=''}) {
  return <label className="sharedSportControl"><span>{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}/><b>{value}{suffix}</b></label>
}

export function ChoiceButtons({options,value,onChange}) {
  return <div className="sharedChoiceButtons">{options.map(o=>{const id=typeof o==='string'?o:o.id,label=typeof o==='string'?o:o.label;return <button key={id} className={value===id?'active':''} onClick={()=>onChange(id)}>{label}</button>})}</div>
}

export function StatRail({stats}) {
  return <aside className="sharedStatRail">{stats.map((s,i)=><div key={s.label} className={'sharedStat card'+i}><span>{s.icon}</span><div><small>{s.label}</small><b>{s.value}</b></div></div>)}</aside>
}

export function SportLab({
  icon,title,subtitle,badge='⭐ Play. Learn. Improve.',promptTitle,promptText,
  scene,stats,controls,choices,actionLabel,onAction,feedback,success=false,children
}) {
  return <section className="sharedSportLab">
    <header className="sharedSportHeader">
      <div className="sharedSportBrand"><span>{icon}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>
      <div className="sharedSportBadge">{badge}</div>
    </header>
    <div className="sharedSportGrid">
      <div className="sharedSceneCard">
        <div className="sharedSportPrompt"><b>{promptTitle}</b><span>{promptText}</span></div>
        {scene}
      </div>
      <StatRail stats={stats}/>
    </div>
    <div className="sharedSportControls">
      {controls}
      {choices}
      <button className="sharedSportAction" onClick={onAction}>{actionLabel}</button>
    </div>
    {feedback&&<div className={success?'sharedSportFeedback success':'sharedSportFeedback'}>{feedback}</div>}
    {children}
  </section>
}

export function AngleOverlay({x,y,angle,radius=62,label=true,className=''}) {
  const r=angle*Math.PI/180;
  const endX=x+Math.cos(r)*radius*1.5;
  const endY=y-Math.sin(r)*radius*1.5;
  const arcX=x+Math.cos(r)*radius;
  const arcY=y-Math.sin(r)*radius;
  const labelX=x+Math.cos(r/2)*(radius+20);
  const labelY=y-Math.sin(r/2)*(radius+20);
  return <g className={'sharedAngleOverlay '+className}>
    <line x1={x} y1={y} x2={x+radius*1.8} y2={y} className="sharedAngleBase"/>
    <line x1={x} y1={y} x2={endX} y2={endY} className="sharedAngleRay"/>
    <path d={'M '+(x+radius)+' '+y+' A '+radius+' '+radius+' 0 0 0 '+arcX+' '+arcY} className="sharedAngleArc"/>
    {label&&<text x={labelX} y={labelY} className="sharedAngleLabel">{Math.round(angle)}°</text>}
    <circle cx={x} cy={y} r="5" className="sharedAngleVertex"/>
  </g>
}
