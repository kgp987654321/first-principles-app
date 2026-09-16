import { migrateV1Progress } from './progressMigration';

const KEY = 'first-principles-progress-v2';
const LEGACY_KEY = 'first-principles-progress-v1';
const PENDING_COINS_KEY = 'first-principles-pending-coins';

export const defaultProgress = {theme:'building',coins:0,mastery:0,lessonIndex:0,completedLessons:{},world:{placements:{}}};

function normalize(progress){
  const completedLessons=Object.fromEntries(Object.entries(progress?.completedLessons||{}).map(([id,lessonProgress])=>{const cleanProgress={...(lessonProgress||{})};cleanProgress.supportLevel=cleanProgress.transferred?'expert':cleanProgress.discovered?'challenge':'guided';return[id,cleanProgress]}));
  return {...defaultProgress,...progress,lessonIndex:Number.isInteger(progress?.lessonIndex)?Math.max(0,progress.lessonIndex):0,completedLessons,world:{...defaultProgress.world,...(progress?.world||{})}};
}
function claimPendingCoins(progress){
  const normalized=normalize(progress);
  const pending=Math.max(0,Number(localStorage.getItem(PENDING_COINS_KEY)||0));
  if(!pending)return normalized;
  const rewarded={...normalized,coins:normalized.coins+pending};
  localStorage.removeItem(PENDING_COINS_KEY);
  localStorage.setItem(KEY,JSON.stringify(rewarded));
  return rewarded;
}
export function loadProgress(){
  try{
    const raw=localStorage.getItem(KEY);
    if(raw)return claimPendingCoins(JSON.parse(raw));
    const legacyRaw=localStorage.getItem(LEGACY_KEY);
    if(legacyRaw){const migrated=claimPendingCoins(migrateV1Progress(JSON.parse(legacyRaw)));localStorage.setItem(KEY,JSON.stringify(migrated));return migrated}
    return claimPendingCoins(defaultProgress);
  }catch{return defaultProgress}
}
export function saveProgress(progress){try{localStorage.setItem(KEY,JSON.stringify(normalize(progress)))}catch{/* Learning remains usable if storage is unavailable. */}}
