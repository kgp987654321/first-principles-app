import React from'react';
import{ProbabilityBagGame,FairSpinnerGame,CombinationsGame,MatrixGame,AnalogyGame,LogicSwitchGame,ConstraintGame,TrialsGame,VectorGame,MomentumGame,TorqueGame,EnergyGame,GravityGame,OrbitGame,GraphChangeGame,AreaSlicesGame}from'./adventure4Games';
const routes={
'probability-bag':ProbabilityBagGame,'fair-spinner':FairSpinnerGame,combinations:CombinationsGame,matrix:MatrixGame,analogy:AnalogyGame,'logic-switch':LogicSwitchGame,constraint:ConstraintGame,trials:TrialsGame,vector:VectorGame,momentum:MomentumGame,torque:TorqueGame,energy:EnergyGame,gravity:GravityGame,orbit:OrbitGame,'graph-change':GraphChangeGame,'area-slices':AreaSlicesGame
};
export function ExpandedGame({lesson,onSolved}){const Game=routes[lesson.expandedMechanic||lesson.mechanic];return Game?<Game lesson={lesson} onSolved={onSolved}/>:null}
export function isExpandedMechanic(mechanic){return Boolean(routes[mechanic])}
