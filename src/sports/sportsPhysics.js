export const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export const rad=d=>d*Math.PI/180;
export const pct=n=>Math.round(n);

export function projectile({angle=45,power=70,wind=0,distanceScale=1,heightScale=1}={}){
  const range=clamp(Math.sin(2*rad(angle))*(power/100)*100*distanceScale+wind,0,120);
  const height=clamp(Math.sin(rad(angle))**2*(power/100)*100*heightScale,0,120);
  return{range,height};
}

export function quadraticPath({startX,startY,endX,endY,apexY}){
  const midX=startX+(endX-startX)/2;
  return'M '+startX+' '+startY+' Q '+midX+' '+apexY+' '+endX+' '+endY;
}

export function angleArc({x,y,angle,radius=42}){
  const endX=x+Math.cos(rad(angle))*radius;
  const endY=y-Math.sin(rad(angle))*radius;
  return'M '+(x+radius)+' '+y+' A '+radius+' '+radius+' 0 0 0 '+endX+' '+endY;
}

export function scoreFromMiss(miss,scale=2){
  return Math.max(0,100-Math.round(miss*scale));
}
