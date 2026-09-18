import React,{useMemo,useState}from'react';
import'./miniSudoku.css';

const MINI_PUZZLES=[
 {grid:[[1,0,0,4],[0,4,1,0],[0,1,4,0],[4,0,0,1]],solution:[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]},
 {grid:[[0,2,0,4],[3,0,1,0],[0,1,0,3],[4,0,2,0]],solution:[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]},
 {grid:[[1,0,3,0],[0,4,0,2],[2,0,4,0],[0,3,0,1]],solution:[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]},
 {grid:[[0,0,3,4],[3,4,0,0],[0,0,4,3],[4,3,0,0]],solution:[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]}
];

const HARD_PUZZLES=[
 {grid:[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]],solution:[[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]]},
 {grid:[[0,0,0,2,6,0,7,0,1],[6,8,0,0,7,0,0,9,0],[1,9,0,0,0,4,5,0,0],[8,2,0,1,0,0,0,4,0],[0,0,4,6,0,2,9,0,0],[0,5,0,0,0,3,0,2,8],[0,0,9,3,0,0,0,7,4],[0,4,0,0,5,0,0,3,6],[7,0,3,0,1,8,0,0,0]],solution:[[4,3,5,2,6,9,7,8,1],[6,8,2,5,7,1,4,9,3],[1,9,7,8,3,4,5,6,2],[8,2,6,1,9,5,3,4,7],[3,7,4,6,8,2,9,1,5],[9,5,1,7,4,3,6,2,8],[5,1,9,3,2,6,8,7,4],[2,4,8,9,5,7,1,3,6],[7,6,3,4,1,8,2,5,9]]}
];

const EASY_KEY='first-principles-sudoku-bonus';
const HARD_KEY='first-principles-sudoku-hard-bonus';
const PENDING_KEY='first-principles-pending-coins';
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const hash=s=>[...s].reduce((a,c)=>a+c.charCodeAt(0),0);
const earned=key=>{try{return localStorage.getItem(key)===today()}catch{return false}};
const addPendingCoins=amount=>{try{const current=Math.max(0,Number(localStorage.getItem(PENDING_KEY)||0));localStorage.setItem(PENDING_KEY,String(current+amount))}catch{}};

function MiniBoard({puzzle,won,onSolved}){
 const[board,setBoard]=useState(()=>puzzle.grid.map(r=>[...r])),[message,setMessage]=useState('Fill every row, column, and 2×2 box with 1, 2, 3, and 4.');
 const cycle=(r,c)=>{if(puzzle.grid[r][c]||won)return;setBoard(b=>b.map((row,ri)=>row.map((v,ci)=>ri===r&&ci===c?(v%4)+1:v)));setMessage('Keep going — each number appears once in every row, column, and 2×2 box.')};
 const check=()=>{const ok=board.every((row,r)=>row.every((v,c)=>v===puzzle.solution[r][c]));if(!ok){setMessage('Not quite yet. Check rows, columns, and the four 2×2 boxes.');return}setMessage('Mini Sudoku solved! Your harder 9×9 challenge is unlocked.');onSolved()};
 const reset=()=>{setBoard(puzzle.grid.map(r=>[...r]));setMessage('Puzzle reset. Tap empty squares to cycle through 1–4.')};
 return <><div className="sudokuGrid">{board.map((row,r)=>row.map((v,c)=><button key={`${r}-${c}`} className={`${puzzle.grid[r][c]?'given':'play'} ${(r===1?'boxBottom ':'')+(c===1?'boxRight':'')}`} onClick={()=>cycle(r,c)} disabled={Boolean(puzzle.grid[r][c])||won}>{v||''}</button>))}</div><div className="sudokuInstructions"><b>Warm-up: 4×4</b><p>Use 1–4 exactly once in every row, column, and 2×2 box.</p><p className={won?'sudokuMessage won':'sudokuMessage'}>{won?'Warm-up complete ✓ The 9×9 challenge is ready.':message}</p><div className="sudokuActions"><button className="secondary" onClick={reset} disabled={won}>Reset</button><button className="primary" onClick={check} disabled={won}>{won?'Solved ✓':'Check puzzle'}</button></div></div></>
}

function HardBoard({puzzle,won,onSolved}){
 const[board,setBoard]=useState(()=>puzzle.grid.map(r=>[...r])),[selected,setSelected]=useState(null),[message,setMessage]=useState(won?'Today’s 9×9 bonus is complete. You can still look over the solved challenge.':'Select an empty square, then choose a number 1–9.');
 const setNumber=n=>{if(!selected||won)return;const[r,c]=selected;if(puzzle.grid[r][c])return;setBoard(b=>b.map((row,ri)=>row.map((v,ci)=>ri===r&&ci===c?n:v)));setMessage('Keep going. Each row, column, and 3×3 box must use 1–9 exactly once.')};
 const erase=()=>{if(!selected||won)return;const[r,c]=selected;if(puzzle.grid[r][c])return;setBoard(b=>b.map((row,ri)=>row.map((v,ci)=>ri===r&&ci===c?0:v)))};
 const check=()=>{const ok=board.every((row,r)=>row.every((v,c)=>v===puzzle.solution[r][c]));if(!ok){setMessage('Not quite yet. Check for duplicates or missing numbers in each row, column, and 3×3 box.');return}setMessage('Full 9×9 Sudoku solved! +100 coins earned.');onSolved()};
 const reset=()=>{if(won)return;setBoard(puzzle.grid.map(r=>[...r]));setSelected(null);setMessage('Puzzle reset. Select a square, then use the number pad.')};
 return <div className="hardSudokuWrap"><div className="hardSudokuGrid">{board.map((row,r)=>row.map((v,c)=>{const given=Boolean(puzzle.grid[r][c]),sel=selected?.[0]===r&&selected?.[1]===c;return <button key={`${r}-${c}`} className={`${given?'given':'play'} ${sel?'selected':''} ${r===2||r===5?'boxBottom':''} ${c===2||c===5?'boxRight':''}`} onClick={()=>!given&&!won&&setSelected([r,c])}>{v||''}</button>}))}</div><div className="hardSudokuControls"><div><small>HARD MODE</small><h3>Full 9×9 Sudoku</h3><p>Use 1–9 exactly once in every row, every column, and each 3×3 box.</p></div><div className="sudokuPad">{[1,2,3,4,5,6,7,8,9].map(n=><button key={n} onClick={()=>setNumber(n)} disabled={won}>{n}</button>)}</div><button className="secondary erase" onClick={erase} disabled={won}>Erase selected square</button><p className={won?'sudokuMessage won':'sudokuMessage'}>{message}</p><div className="sudokuActions"><button className="secondary" onClick={reset} disabled={won}>Reset</button><button className="primary" onClick={check} disabled={won}>{won?'Hard bonus earned ✓':'Check 9×9'}</button></div></div></div>
}

export function MiniSudoku(){
 const day=today(),mini=useMemo(()=>MINI_PUZZLES[hash(day)%MINI_PUZZLES.length],[day]),hard=useMemo(()=>HARD_PUZZLES[hash(day+'hard')%HARD_PUZZLES.length],[day]),[easyWon,setEasyWon]=useState(()=>earned(EASY_KEY)),[hardWon,setHardWon]=useState(()=>earned(HARD_KEY)),[mode,setMode]=useState(()=>earned(EASY_KEY)?'hard':'mini');
 const solveEasy=()=>{if(!easyWon){try{localStorage.setItem(EASY_KEY,day)}catch{}addPendingCoins(50);setEasyWon(true)}setMode('hard')};
 const solveHard=()=>{if(!hardWon){try{localStorage.setItem(HARD_KEY,day)}catch{}addPendingCoins(100);setHardWon(true)}};
 return <section className="panel miniSudoku"><div className="sudokuHeading"><div><small>DAILY LOGIC BONUS</small><h2>Sudoku Challenge</h2><p>Start with the 4×4 warm-up, then unlock a full 9×9 Sudoku the same day.</p></div><div className="sudokuReward">{mode==='hard'?'🪙 +100':'🪙 +50'}</div></div><div className="sudokuModeTabs"><button className={mode==='mini'?'active':''} onClick={()=>setMode('mini')}>4×4 Warm-up {easyWon?'✓':''}</button><button className={mode==='hard'?'active':''} onClick={()=>easyWon&&setMode('hard')} disabled={!easyWon}>9×9 Harder {hardWon?'✓':easyWon?'Unlocked':'Solve 4×4 first'}</button></div><div className="sudokuBody">{mode==='mini'?<MiniBoard key={day} puzzle={mini} won={easyWon} onSolved={solveEasy}/>:<HardBoard key={day+'hard'} puzzle={hard} won={hardWon} onSolved={solveHard}/>}</div></section>
}
