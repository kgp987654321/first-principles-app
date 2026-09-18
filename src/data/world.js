export const worldBuildings = [
  {id:'bakery',name:'Fraction Bakery',emoji:'🥐',cost:120,requires:['fraction-three-fourths'],description:'Unlocked by mastering part-to-whole thinking.'},
  {id:'clinic',name:'Animal Clinic',emoji:'🐾',cost:140,requires:['match-one-half'],description:'Built from equivalence and classification mastery.'},
  {id:'design',name:'Pattern Studio',emoji:'🎨',cost:130,requires:['pattern-every-other'],description:'A studio for repeating rules and visual patterns.'},
  {id:'lab',name:'Measurement Lab',emoji:'🧪',cost:150,requires:['pour-three-fourths'],description:'Where fractions become real measurements.'},
  {id:'transit',name:'Number Line Transit',emoji:'🚉',cost:170,requires:['launch-negative-two'],description:'Unlocked by understanding positive and negative direction.'},
  {id:'architect',name:'Architecture Studio',emoji:'🏛️',cost:190,requires:['fold-one-hole'],description:'Spatial reasoning and symmetry made visible.'},
  {id:'observatory',name:'Sky Observatory',emoji:'🔭',cost:240,requires:['fold-two-folds','launch-positive-three'],description:'A landmark for multi-step spatial and quantitative reasoning.'},
  {id:'market',name:'Market Square',emoji:'🛍️',cost:220,requires:['unit-price'],description:'Compare rates, prices, and quantities to run the town market.'},
  {id:'bridge',name:'Bridge Works',emoji:'🌉',cost:280,requires:['bridge-torque'],description:'Use forces, balance, and structure to connect new parts of town.'},
  {id:'carnival',name:'Logic Carnival',emoji:'🎡',cost:300,requires:['carnival-mission'],description:'Probability, combinations, and logic power the games.'},
  {id:'spaceport',name:'Valley Spaceport',emoji:'🚀',cost:360,requires:['spaceport-mission'],description:'The final district for vectors, gravity, orbits, and exploration.'}
];

export const worldLots = Array.from({length:12},(_,i)=>i);

export function buildingUnlocked(building, completedLessons){
  return building.requires.every(id=>completedLessons?.[id]?.transferred || completedLessons?.[id]?.discovered);
}
