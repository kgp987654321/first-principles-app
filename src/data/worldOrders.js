export const worldOrderMeta={
  bakery:[
    {id:'pizza-three-fourths',label:'Three-fourths pizza'},
    {id:'half-cup',label:'Half-cup recipe'},
    {id:'share-cookies',label:'Share the cookies'},
    {id:'bakery-equivalence-cake',label:'Quarter-cake conversion',unlockAfter:'fraction-language-wheel',unlockLabel:'One amount, many languages'},
    {id:'bakery-ratio-batch',label:'Party cupcake ratio',unlockAfter:'ratio-recipe-3-2',unlockLabel:'Mix a 3 : 2 recipe'},
    {id:'bakery-oven-rate',label:'Oven timing rush',unlockAfter:'race-rate',unlockLabel:'Race the pace'},
    {id:'bakery-function-price',label:'Mystery cake price',unlockAfter:'mystery-machine',unlockLabel:'Crack the mystery machine'},
    {id:'bakery-best-deal',label:'Buy the best berry deal',unlockAfter:'unit-price',unlockLabel:'Which deal wins?'},
    {id:'bakery-catering-mission',label:'Catering mission',unlockAfter:'relationship-mission',unlockLabel:'Relationship mission'},
    {id:'bakery-chance-box',label:'Build the surprise pastry box',unlockAfter:'probability-bag',unlockLabel:'Build a 3-in-4 chance'},
    {id:'bakery-combo-menu',label:'Count the party-menu combinations',unlockAfter:'combination-lab',unlockLabel:'Count every combination'}
  ],
  clinic:[
    {id:'food-half',label:'Half a bowl'},
    {id:'weight-sort',label:'Choose the light supplies'},
    {id:'water-three-fourths',label:'Fill the water bowl'},
    {id:'clinic-scale-blanket',label:'Scale the pet blanket',unlockAfter:'scale-robot',unlockLabel:'Scale the robot'},
    {id:'clinic-walk-rate',label:'Walking pace',unlockAfter:'race-rate',unlockLabel:'Race the pace'},
    {id:'clinic-motion-cart',label:'Tune the recovery cart',unlockAfter:'momentum-crash',unlockLabel:'Match the momentum'}
  ],
  design:[
    {id:'stripe',label:'Finish the mural'},
    {id:'grow',label:'Growing tile design'},
    {id:'make',label:'Design your own repeat'},
    {id:'studio-slope-roof',label:'Design a roof slope',unlockAfter:'slope-mountain',unlockLabel:'Shape the slope'},
    {id:'studio-rule-sign',label:'Build a sign rule',unlockAfter:'build-function-rule',unlockLabel:'Build the rule'},
    {id:'studio-matrix-window',label:'Complete the pattern window',unlockAfter:'matrix-portal',unlockLabel:'Open the Pattern Portal'},
    {id:'studio-logic-lights',label:'Wire the gallery lights',unlockAfter:'logic-switches',unlockLabel:'Power the logic light'}
  ],
  lab:[
    {id:'half',label:'Half-full sample'},
    {id:'threequarters',label:'Three-quarter sample'},
    {id:'double',label:'Double the recipe'},
    {id:'lab-scale-reading',label:'Scale a reading',unlockAfter:'map-scale',unlockLabel:'Resize the map'},
    {id:'lab-machine-rule',label:'Machine rule test',unlockAfter:'mystery-machine',unlockLabel:'Crack the mystery machine'},
    {id:'lab-gravity-probe',label:'Calibrate the gravity probe',unlockAfter:'gravity-worlds',unlockLabel:'Test different gravity worlds'},
    {id:'lab-change-chart',label:'Tune the growth chart',unlockAfter:'change-graph',unlockLabel:'Make the graph climb'},
    {id:'lab-area-scan',label:'Approximate the curved sample',unlockAfter:'area-slices',unlockLabel:'Fill a curve with slices'}
  ]
};

export function orderUnlocked(order,completedLessons){return !order.unlockAfter||Boolean(completedLessons?.[order.unlockAfter]?.discovered)}
export function unlockedOrderMeta(buildingId,completedLessons){return (worldOrderMeta[buildingId]||[]).filter(o=>orderUnlocked(o,completedLessons))}
export function lockedOrderMeta(buildingId,completedLessons){return (worldOrderMeta[buildingId]||[]).filter(o=>!orderUnlocked(o,completedLessons))}
export function nextLockedOrder(buildingId,completedLessons){return lockedOrderMeta(buildingId,completedLessons)[0]||null}
export function pendingOrderCount(buildingId,world,completedLessons){const completed=world?.activities?.[buildingId]?.completedOrders||{};return unlockedOrderMeta(buildingId,completedLessons).filter(o=>!completed[o.id]).length}
