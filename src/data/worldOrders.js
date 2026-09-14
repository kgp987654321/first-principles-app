export const worldOrderMeta={
  bakery:[
    {id:'pizza-three-fourths'},
    {id:'half-cup'},
    {id:'share-cookies'},
    {id:'bakery-ratio-batch',unlockAfter:'ratio-recipe-3-2'},
    {id:'bakery-best-deal',unlockAfter:'unit-price'}
  ],
  clinic:[
    {id:'food-half'},
    {id:'weight-sort'},
    {id:'water-three-fourths'},
    {id:'clinic-scale-blanket',unlockAfter:'scale-robot'},
    {id:'clinic-walk-rate',unlockAfter:'race-rate'}
  ],
  design:[
    {id:'stripe'},
    {id:'grow'},
    {id:'make'},
    {id:'studio-slope-roof',unlockAfter:'slope-mountain'},
    {id:'studio-rule-sign',unlockAfter:'build-function-rule'}
  ],
  lab:[
    {id:'half'},
    {id:'threequarters'},
    {id:'double'},
    {id:'lab-scale-reading',unlockAfter:'map-scale'},
    {id:'lab-machine-rule',unlockAfter:'mystery-machine'}
  ]
};

export function orderUnlocked(order,completedLessons){return !order.unlockAfter||Boolean(completedLessons?.[order.unlockAfter]?.discovered)}
export function unlockedOrderMeta(buildingId,completedLessons){return (worldOrderMeta[buildingId]||[]).filter(o=>orderUnlocked(o,completedLessons))}
export function pendingOrderCount(buildingId,world,completedLessons){const completed=world?.activities?.[buildingId]?.completedOrders||{};return unlockedOrderMeta(buildingId,completedLessons).filter(o=>!completed[o.id]).length}
