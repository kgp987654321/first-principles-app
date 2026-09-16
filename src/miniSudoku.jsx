import React,{useMemo,useState}from'react';
import'./miniSudoku.css';

const PUZZLES=[
 {grid:[[1,0,0,4],[0,4,1,0],[0,1,4,0],[4,0,0,1]],solution:[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]},
 {grid:[[0,2,0,4],[3,0,1,0],[0,1,0,3],[4,0,2,0]],solution:[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]},
 {grid:[[1,0,3,0],[0,4,0,2],[2,0,4,0],[0,3,0,1]],solution:[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]},
 {grid:[[0,0,3,4],[3,4,0,0],[0,0,4,3],[4,3,0,0]],solution:[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]}
];
const hash=s=>[...s].reduce((a,c)=>a+c.charCodeAt(0),0);

export function MiniSudoku({lessonId,complete,onSolved}){
 const puzzle=useMemo(()=>PUZZLES[hash(lessonId)%PUZZLES.length],[lessonId]);
 const [board,setBoard]=useState(()=>puzzle.grid.map(r=>[...r]));
 const [message,setMessage]=useState(complete?'Bonus already earned for this lesson.':'Fill every row, column, and 2×2 box with 1, 2, 3, and 4.');
 const [won,setWon]=useState(complete);
 const cycle=(r,c)=>{if(puzzle.grid[r][c]||won)return;setBoard(b=>b.map((row,ri)=>row.map((v,ci)=>ri===r&&ci===c?(v%4)+1:v)));setMessage('Keep going — each number appears once in every row, column, and 2×2 box.')};
 const check=()=>{const ok=board.every((row,r)=>row.every((v,c)=>v===puzzle.solution[r][c]));if(ok){setWon(true);setMessage('Sudoku solved! +50 coins');onSolved?.()}else setMessage('Not quite yet. Check rows, columns, and the four 2×2 boxes.')};
 const reset=()=>{if(won)return;setBoard(puzzle.grid.map(r=>[...r]));setMessage('Puzzle reset. Tap empty squares to cycle through 1–4.')};
 return <section className="panel miniSudoku"><div className="sudokuHeading"><div><small>OPTIONAL BONUS PUZZLE</small><h2>Mini Sudoku</h2><p>A quick 4×4 logic puzzle — smaller than a regular Sudoku.</p></div><div className="sudokuReward">🪙 +50</div></div><div className="sudokuBody"><div className="sudokuGrid">{board.map((row,r)=>row.map((v,c)=><button key={`${r}-${c}`} className={`${puzzle.grid[r][c]?'given':'play'} ${(r===1?'boxBottom ':'')+(c===1?'boxRight':'')}`} onClick={()=>cycle(r,c)} disabled={Boolean(puzzle.grid[r][c])||won}>{v||''}</button>))}</div><div className="sudokuInstructions"><b>How to play</b><p>Use the numbers 1–4 exactly once in every row, every column, and each 2×2 box.</p><p className={won?'sudokuMessage won':'sudokuMessage'}>{message}</p><div className="sudokuActions"><button className="secondary" onClick={reset} disabled={won}>Reset</button><button className="primary" onClick={check} disabled={won}>{won?'Bonus earned ✓':'Check puzzle'}</button></div></div></div></section>
}
