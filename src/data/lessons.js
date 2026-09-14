export const themes = {
  building: { label: 'Block Building', emoji: '🧱', reward: 'Builder Cottage' },
  animals: { label: 'Animal Care', emoji: '🐾', reward: 'Animal Clinic' },
  princess: { label: 'Princess', emoji: '💎', reward: 'Castle Tower' },
  cars: { label: 'Cars', emoji: '🏁', reward: 'Race Garage' },
  space: { label: 'Space', emoji: '🚀', reward: 'Space Lab' },
};

const prompts = (building, animals, princess, cars, space) => ({ building, animals, princess, cars, space });
const reward = (discover = 90, transfer = 140) => ({ discover, transfer });

export const lessons = [
  {
    id: 'fraction-three-fourths', title: 'Fill exactly 3/4', concept: 'Part-to-whole', reasoningSkill: 'Part-to-whole reasoning', cogatSkill: 'Quantitative relationships', difficulty: 1, mechanic: 'select-parts', scaffolding: 'visual', targetSelected: 3, totalParts: 4,
    intro: 'Fill three equal parts out of four total parts.',
    promptByTheme: prompts('Build the wall so exactly 3 of the 4 sections are filled.','Prepare exactly 3 of the 4 animal-care stations.','Decorate exactly 3 of the 4 royal carriage panels.','Prepare exactly 3 of the 4 pit stations.','Power exactly 3 of the 4 spacecraft cells.'),
    equivalents: [{icon:'🍕',label:'3 of 4'},{icon:'🥄',label:'¾ tsp'},{icon:'🔢',label:'0.75'},{icon:'💯',label:'75%'}],
    explanation: 'Three out of four equal parts is three fourths. It is also 0.75 and 75 percent.',
    transferChallenge: { mechanic:'pour', title:'Prove it another way', prompt:'Now make the same amount in a measuring container.', target:.75, step:.25, explanation:'Exactly right. You transferred 3/4 into measurement: 3/4 = 0.75 = 75%.' },
    rewards: reward(75,125)
  },
  {
    id:'pattern-every-other', title:'Finish the pattern', concept:'Pattern recognition', reasoningSkill:'Pattern recognition', cogatSkill:'Number and figure series', difficulty:1, mechanic:'pattern-choice', scaffolding:'visual', intro:'Look for what repeats, then continue it.',
    promptByTheme:prompts('The builders alternate stone and wood. What comes next?','The care stations alternate dog and cat. What comes next?','The royal path alternates crown and gem. What comes next?','The pit lane alternates race car and flag. What comes next?','The signal alternates rocket and star. What comes next?'),
    sequenceByTheme:{building:['🧱','🪵','🧱','🪵'],animals:['🐶','🐱','🐶','🐱'],princess:['👑','💎','👑','💎'],cars:['🏎️','🏁','🏎️','🏁'],space:['🚀','⭐','🚀','⭐']},
    choicesByTheme:{building:['🧱','🪵','🔩'],animals:['🐶','🐱','🐰'],princess:['👑','💎','🏰'],cars:['🏎️','🏁','🔧'],space:['🚀','⭐','🪐']}, correctIndex:0,
    explanation:'The pattern repeats A, B, A, B. The A item comes next again.',
    transferChallenge:{ mechanic:'pattern-choice', title:'Same rule, new objects', prompt:'The pictures changed. Does the same A-B-A-B rule still work?', sequence:['🔺','🔵','🔺','🔵'], choices:['🔺','🔵','🟩'], correctIndex:0, explanation:'Yes. The objects changed, but the repeating rule stayed A-B-A-B.' },
    rewards:reward(75,125)
  },
  {
    id:'match-one-half', title:'Match one half', concept:'Equivalent representations', reasoningSkill:'Classification and equivalence', cogatSkill:'Figure and quantitative classification', difficulty:1, mechanic:'match-set', scaffolding:'visual', intro:'Find every tile that means the same amount as one half.',
    promptByTheme:prompts('Find every blueprint tile that represents half of a whole.','Find every feeding label that represents half of a full serving.','Find every royal gem card that represents half of the treasure.','Find every fuel gauge card that represents half a tank.','Find every power-cell card that represents half charge.'),
    tiles:[{label:'1/2',correct:true},{label:'0.5',correct:true},{label:'50%',correct:true},{label:'2/4',correct:true},{label:'1/4',correct:false},{label:'0.25',correct:false},{label:'75%',correct:false},{label:'3/4',correct:false}],
    explanation:'One half, 0.5, 50 percent, and two fourths all describe the same amount.',
    transferChallenge:{ mechanic:'pour', title:'Make half without symbols', prompt:'Instead of matching symbols, fill the container to one half.', target:.5, step:.25, explanation:'You made one half physically. Two quarters make one half.' },
    rewards:reward()
  },
  {
    id:'match-three-fourths', title:'Find all the 3/4 matches', concept:'Fractions, decimals, and percentages', reasoningSkill:'Analogical and quantitative relationships', cogatSkill:'Quantitative classification', difficulty:2, mechanic:'match-set', scaffolding:'reduced', intro:'Different symbols can describe the exact same quantity.',
    promptByTheme:prompts('Select every material label equal to three fourths.','Select every care meter equal to three fourths full.','Select every treasure label equal to three fourths.','Select every fuel reading equal to three fourths.','Select every battery reading equal to three fourths.'),
    tiles:[{label:'3/4',correct:true},{label:'0.75',correct:true},{label:'75%',correct:true},{label:'6/8',correct:true},{label:'0.3',correct:false},{label:'25%',correct:false},{label:'2/3',correct:false},{label:'0.8',correct:false}],
    explanation:'Three fourths equals 0.75, 75 percent, and six eighths.',
    transferChallenge:{ mechanic:'select-parts', title:'Build 3/4 instead of matching it', prompt:'Now show three fourths by filling parts of a whole.', totalParts:4, targetSelected:3, explanation:'Three of four equal parts is the same quantity you just matched symbolically.' },
    rewards:reward(100,150)
  },
  {
    id:'pour-three-fourths', title:'Pour 3/4 of the cup', concept:'Measurement and fractions', reasoningSkill:'Part-to-whole and estimation', cogatSkill:'Quantitative relationships', difficulty:1, mechanic:'pour', scaffolding:'visual', intro:'Change the fill level until the container is three fourths full.',
    promptByTheme:prompts('Mix exactly 3/4 cup of water for the building material.','Measure exactly 3/4 cup for the pretend animal-care recipe.','Pour exactly 3/4 cup into the make-believe potion.','Fill the practice fluid container to exactly 3/4.','Fill the spacecraft training tank to exactly 3/4.'), target:.75, step:.25,
    explanation:'Three quarter-cup steps fill three of four equal parts: 3/4 = 0.75 = 75%.',
    transferChallenge:{ mechanic:'select-parts', title:'Turn the measurement back into a fraction', prompt:'Build the same amount using four equal blocks.', totalParts:4, targetSelected:3, explanation:'The container and the four-part model show the same relationship.' },
    rewards:reward()
  },
  {
    id:'pour-one-half', title:'Make exactly one half', concept:'Fractions as measurement', reasoningSkill:'Quantity relationships', cogatSkill:'Quantitative reasoning', difficulty:1, mechanic:'pour', scaffolding:'visual', intro:'Build one half from quarter-sized steps.',
    promptByTheme:prompts('Measure half a container for the pretend concrete mix.','Measure half a cup for the pretend feeding mix.','Make the potion bottle exactly half full.','Set the training tank to exactly half full.','Set the power coolant tank to exactly half full.'), target:.5, step:.25,
    explanation:'Two quarter steps make one half: 1/4 + 1/4 = 2/4 = 1/2.',
    transferChallenge:{ mechanic:'select-parts', title:'Build one half another way', prompt:'Show one half using four equal tiles.', totalParts:4, targetSelected:2, explanation:'Two of four equal parts is 2/4, which simplifies to 1/2.' },
    rewards:reward(85,135)
  },
  {
    id:'launch-negative-two', title:'Launch to −2', concept:'Negative numbers and number lines', reasoningSkill:'Spatial quantity reasoning', cogatSkill:'Quantitative relationships', difficulty:2, mechanic:'launch', scaffolding:'visual', intro:'Numbers continue below zero. Aim on the number line, then launch.',
    promptByTheme:prompts('Launch the supply crate to level −2 underground.','Send the rescue drone to marker −2 on the trail.','Launch the magic key to dungeon level −2.','Send the race marker to position −2 behind the start line.','Fire the navigation probe to coordinate −2.'), min:-5, max:5, target:-2, start:0,
    explanation:'Negative two is two equal steps to the left of zero.',
    transferChallenge:{ mechanic:'match-set', title:'Find real-world −2 examples', prompt:'Choose every situation that represents negative two.', tiles:[{label:'−2°C',correct:true},{label:'Floor −2',correct:true},{label:'2 steps left of 0',correct:true},{label:'+2°C',correct:false},{label:'Floor +2',correct:false},{label:'2 steps right of 0',correct:false}], explanation:'All three correct examples mean two units below, behind, or left of zero.' },
    rewards:reward(110,160)
  },
  {
    id:'launch-positive-three', title:'Launch 3 steps from zero', concept:'Number-line distance', reasoningSkill:'Magnitude and direction', cogatSkill:'Quantitative reasoning', difficulty:1, mechanic:'launch', scaffolding:'visual', intro:'Aim by distance and direction, not by guessing.',
    promptByTheme:prompts('Launch the block cart to +3.','Move the animal-care cart to marker +3.','Send the jewel cart to tower marker +3.','Launch the race car to +3.','Send the rover to coordinate +3.'), min:-5, max:5, target:3, start:0,
    explanation:'Positive three is three equal steps to the right of zero.',
    transferChallenge:{ mechanic:'match-set', title:'Recognize +3 without a number line', prompt:'Choose every situation that represents positive three.', tiles:[{label:'+3°C',correct:true},{label:'3 steps right of 0',correct:true},{label:'Floor +3',correct:true},{label:'−3°C',correct:false},{label:'3 steps left of 0',correct:false},{label:'Floor −3',correct:false}], explanation:'Positive three always means three units in the positive direction from zero.' },
    rewards:reward()
  },
  {
    id:'fold-one-hole', title:'Predict the unfolded holes', concept:'Symmetry from folding', reasoningSkill:'Spatial transformation', cogatSkill:'Paper Folding', difficulty:1, mechanic:'fold', scaffolding:'animated', intro:'Fold the paper, punch one hole, then predict what appears when it opens.',
    promptByTheme:prompts('Fold the blueprint in half and predict the matching holes.','Fold the care chart in half and predict the matching marks.','Fold the royal banner in half and predict the jewel holes.','Fold the race flag in half and predict the matching holes.','Fold the solar map in half and predict the matching holes.'), foldAxis:'vertical', punch:{x:25,y:35},
    options:[{label:'One hole',holes:[{x:25,y:35}]},{label:'Two mirrored holes',holes:[{x:25,y:35},{x:75,y:35}]},{label:'Four corner holes',holes:[{x:25,y:25},{x:75,y:25},{x:25,y:75},{x:75,y:75}]}], correctIndex:1,
    explanation:'A vertical fold mirrors the punched hole across the center line, so one punch becomes two symmetric holes.',
    transferChallenge:{ mechanic:'fold', title:'Transfer the reflection to a new fold', prompt:'Now the paper folds horizontally. Predict the holes.', foldAxis:'horizontal', options:[{label:'One hole',holes:[{x:30,y:25}]},{label:'Two mirrored holes',holes:[{x:30,y:25},{x:30,y:75}]},{label:'Four holes',holes:[{x:25,y:25},{x:75,y:25},{x:25,y:75},{x:75,y:75}]}], correctIndex:1, explanation:'A horizontal fold mirrors across the horizontal center line. Same reflection idea, new direction.' },
    rewards:reward(110,170)
  },
  {
    id:'fold-two-folds', title:'Two folds, one punch', concept:'Composition of reflections', reasoningSkill:'Multi-step spatial transformation', cogatSkill:'Paper Folding', difficulty:2, mechanic:'fold', scaffolding:'reduced', intro:'Each fold creates another symmetry. Predict how one punch multiplies when the paper opens.',
    promptByTheme:prompts('Fold the square blueprint twice, punch once, and predict the open sheet.','Fold the square care card twice and predict the marks.','Fold the royal square twice and predict the jewel pattern.','Fold the square race flag twice and predict the holes.','Fold the square star map twice and predict the holes.'), foldAxis:'both', punch:{x:25,y:25},
    options:[{label:'Two holes',holes:[{x:25,y:25},{x:75,y:25}]},{label:'Four symmetric holes',holes:[{x:25,y:25},{x:75,y:25},{x:25,y:75},{x:75,y:75}]},{label:'One center hole',holes:[{x:50,y:50}]}], correctIndex:1,
    explanation:'Two perpendicular folds reflect the punch across both center lines, creating four symmetric positions.',
    transferChallenge:{ mechanic:'fold', title:'Do it again with the punch moved', prompt:'The folds stay the same, but the punch is in a different spot. Predict the unfolded result.', foldAxis:'both', options:[{label:'Two holes',holes:[{x:20,y:35},{x:80,y:35}]},{label:'Four symmetric holes',holes:[{x:20,y:35},{x:80,y:35},{x:20,y:65},{x:80,y:65}]},{label:'One center hole',holes:[{x:50,y:50}]}], correctIndex:1, explanation:'The exact position changed, but two perpendicular reflections still create four symmetric points.' },
    rewards:reward(125,185)
  }
];
