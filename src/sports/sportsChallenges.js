export const SPORTS_CHALLENGES={
  baseball:{
    explore:'Move angle, force, and contact. Notice what changes.',
    challenge:'Land the ball near the 175-ft target.',
    mastery:'Reach the target with less than 75% force and a launch angle under 35°.',
    connection:'Angles also appear in the Cliffs and Geometry Woodshop.'
  },
  basketball:{
    explore:'Change the shot arc and watch how the hoop relationship changes.',
    challenge:'Make the selected shot.',
    mastery:'Make a free throw using 65% force or less.',
    connection:'The same angle idea appears in Baseball and the Cliffs.'
  },
  soccer:{
    explore:'Change kick angle, force, and contact style.',
    challenge:'Send the ball through the target zone.',
    mastery:'Hit the target using 70% force or less.',
    connection:'Direction + magnitude prepares you for vector thinking at the Shore.'
  },
  football:{
    explore:'Change throw angle, force, and receiver speed.',
    challenge:'Complete the pass to the moving receiver.',
    mastery:'Complete the pass while the receiver moves at 10 yd/s or faster.',
    connection:'This combines projectile motion with rate and prediction.'
  },
  golf:{
    explore:'Turn wind on and off and compare identical swings.',
    challenge:'Land on the green.',
    mastery:'Reach the green with non-zero wind and 80% force or less.',
    connection:'Wind + shot motion connects directly to vector addition.'
  },
  hockey:{
    explore:'Move the bank angle and compare incoming and reflected rays.',
    challenge:'Choose the bank angle that sends the puck toward the target.',
    mastery:'Hit the target while explaining why angle in equals angle out.',
    connection:'Reflection connects to geometry and spatial reasoning.'
  },
  track:{
    explore:'Change speed and watch time and graph slope change.',
    challenge:'Complete the selected distance and compare pace.',
    mastery:'Run 2 or more laps and predict how doubling speed affects total time.',
    connection:'This is the same rate relationship used in Science and Base Running.'
  }
};

export const challengeText=(sport,mode)=>SPORTS_CHALLENGES[sport]?.[mode]||'Explore the relationship.';
