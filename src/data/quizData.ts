import { QuizQuestion } from '../types/seismic';

export const SAFETY_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'When violent earthquake shaking begins while you are indoors, what is the single most effective action recommended by emergency response agencies worldwide?',
    options: [
      'Immediately run outside into the street before the building can collapse',
      'Drop to your hands and knees, Cover your head and neck under a sturdy table, and Hold On until shaking stops',
      'Stand firmly under a doorway frame or door lintel for arch support',
      'Rush toward the staircase or elevator to reach ground level'
    ],
    correctIndex: 1,
    explanation: 'Global disaster research confirms that running outside during shaking exposes you to falling facades, glass, and power lines—the #1 source of injury. "Drop, Cover, and Hold On" protects your vital organs from falling interior objects. Doorways in modern construction are not stronger than any other part of the building and do not protect against flying debris.',
    category: 'immediate-action'
  },
  {
    id: 2,
    question: 'If you are in bed when a sudden strong earthquake strikes in the middle of the night, what should you do?',
    options: [
      'Roll out of bed immediately and run into the hallway in the dark',
      'Stay in bed, turn face down to protect vital organs, and cover your head and neck with a firm pillow',
      'Jump out and stand against the nearest exterior window',
      'Crawl underneath the bed where space is tight'
    ],
    correctIndex: 1,
    explanation: 'Moving in the dark across a shaking room with broken glass on the floor leads to serious lacerations and head trauma. Remaining in bed, rolling face down, and shielding your skull and cervical spine with pillows provides immediate protection until shaking ceases.',
    category: 'indoor-outdoor'
  },
  {
    id: 3,
    question: 'Why has modern emergency science officially debunked the viral "Triangle of Life" theory (which claims people should curl up next to large furniture instead of under desks)?',
    options: [
      'Because desks are always unbreakable under any structural collapse',
      'Because heavy furniture slides and crushes people curling up next to it, while the vast majority of casualties are caused by non-structural falling objects, not complete building pancake collapse',
      'Because the theory only applies to timber frame buildings in Scandinavia',
      'Because curling next to furniture attracts electromagnetic field buildup'
    ],
    correctIndex: 1,
    explanation: 'Red Cross, USGS, and structural engineers found that in modern code-compliant structures, complete ceiling pancake collapse is very rare. The overwhelming majority of injuries (>95%) are caused by falling ceiling tiles, light fixtures, bookcases, and glass. Getting UNDER a sturdy table shields you from these missiles, whereas lying next to a heavy wardrobe puts you at risk of being crushed when the wardrobe tips over.',
    category: 'structural'
  },
  {
    id: 4,
    question: 'You are on an ocean beach or low-lying coastal roadway when you feel strong earthquake shaking lasting more than 20 seconds. What is your immediate protocol?',
    options: [
      'Wait for the official municipal siren or text alert before taking action',
      'Walk down to the shoreline to check if the tide is receding out to sea',
      'Immediately move inland to high ground (at least 30 meters above sea level) on foot without waiting for sirens',
      'Get into a car and drive slowly along the coastal highway'
    ],
    correctIndex: 2,
    explanation: 'Natural warnings are your fastest warning: strong or long shaking near the coast means a tsunami may arrive within minutes. The receding ocean is a telltale sign that the wave trough has already arrived. Move quickly uphill on foot, as coastal roads often become instantly gridlocked or ruptured.',
    category: 'tsunami'
  },
  {
    id: 5,
    question: 'Immediately after severe shaking stops, what is the crucial rule regarding your household utilities (natural gas, electrical switches, water)?',
    options: [
      'Light a match or lighter immediately to inspect dark basements for pipe cracks',
      'Turn on every light switch in the house to test if city grid power is operational',
      'Never use open flames or flip electrical switches; if you smell sulfur/rotten eggs (mercaptan) or hear hissing, turn off the main gas valve from the outside meter',
      'Flush all toilets repeatedly to clear pressure in the municipal sewer mains'
    ],
    correctIndex: 2,
    explanation: 'Flipping an electrical switch or lighting a candle can produce a tiny electric spark that ignites accumulated natural gas from sheared pipes, causing devastating post-quake fires. If gas leak odor is detected, turn off the meter valve using an adjustable non-sparking wrench and ventilate.',
    category: 'post-quake'
  },
  {
    id: 6,
    question: 'If you are driving an automobile on a freeway or city avenue when a strong tremor occurs, how should you respond?',
    options: [
      'Accelerate rapidly to cross over bridges, overpasses, and elevated flyovers as fast as possible',
      'Carefully pull over to the side of the road away from overpasses, power lines, and billboards; engage the parking brake and remain inside the vehicle',
      'Stop dead in the center traffic lane and run into an adjacent building',
      'Abandon the car with the doors locked and jump off the freeway shoulder'
    ],
    correctIndex: 1,
    explanation: 'Your vehicle provides structural protection against falling debris. Safely steer clear of overpasses, hanging signs, and electrical cables, pull to the shoulder, apply the handbrake, and stay inside. The car suspension absorbs much of the shaking, but sudden high-speed maneuvers cause rollovers.',
    category: 'indoor-outdoor'
  },
  {
    id: 7,
    question: 'In a modern high-rise office or apartment tower, what is the safest protocol during ground motion?',
    options: [
      'Rush to the elevator banks immediately to escape before power cuts out',
      'Drop, cover, and hold on; stay away from perimeter glass windows; never use elevators or sprint down crowded emergency stairwells during shaking',
      'Break open the nearest window to wave for aerial fire ladders',
      'Gather in the center of the rooftop helipad'
    ],
    correctIndex: 1,
    explanation: 'High-rise structures are engineered to sway elastically during earthquakes to dissipate energy. Elevators frequently jam in their shafts or shut down automatically. Stairwells experience intense dynamic shear motion and become death traps from panicked crowding. Stay sheltered under a workstation until motion settles.',
    category: 'structural'
  },
  {
    id: 8,
    question: 'What is the phenomenon known as "Soil Liquefaction" that causes severe building tilt and foundation failure during earthquakes?',
    options: [
      'Underground geothermal lava rising to melt basement concrete foundation pilings',
      'Water-saturated granular soil temporarily losing its shear strength and behaving like a dense liquid due to cyclic seismic stress',
      'Chemical breakdown of limestone bedrock triggered by sound waves',
      'Electrolytic dissolution of subterranean copper grounding wires'
    ],
    correctIndex: 1,
    explanation: 'When water-saturated, loosely packed sand or silt is subjected to cyclic shear waves, pore water pressure spikes, decoupling soil grains from each other. The ground temporarily turns into quicksand-like slurry, causing buildings to sink, tilt, or float buried fuel tanks to the surface (as seen in Marina District 1989 and Christchurch 2011).',
    category: 'structural'
  },
  {
    id: 9,
    question: 'If you are unfortunate enough to become trapped under debris after a structural collapse, which action gives you the greatest chance of survival and rescue?',
    options: [
      'Scream and yell continuously at top volume without stopping until help arrives',
      'Cover your mouth with cloth to avoid breathing dust; tap on a metal pipe or wall with a stone/whistle in bursts of three so rescuers can acoustic-triangulate your position',
      'Ignite a lighter to provide light and warmth while you inspect the rubble',
      'Violently kick and push any heavy concrete beams above you to dislodge them'
    ],
    correctIndex: 1,
    explanation: 'Screaming continuously exhausts your vocal cords, induces hyperventilation, and causes you to inhale lethal doses of concrete dust. Acoustic tapping on metal or solid masonry transmits vibrations across great distances with minimal oxygen expenditure. International search-and-rescue teams (USAR) pause equipment every hour for "Listening Periods" specifically to detect these acoustic rhythms.',
    category: 'post-quake'
  },
  {
    id: 10,
    question: 'What is the standard recommended potable water supply that an individual or household should store in their emergency readiness kit?',
    options: [
      '500 mL per person for a weekend',
      'At least 4 liters (1 gallon) per person per day, for a minimum of 3 to 7 days',
      'Only carbonated sodas because tap water goes bad in 48 hours',
      'Water is not necessary because city municipal water pipes never fracture during earthquakes'
    ],
    correctIndex: 1,
    explanation: 'Water mains fracture frequently during moderate-to-severe quakes, cutting municipal water supplies for days or weeks. Emergency agencies recommend storing a minimum of 4 liters per person per day (2 liters for hydration, 2 liters for sanitation and food preparation) for at least 72 hours, ideally 1 to 2 weeks.',
    category: 'indoor-outdoor'
  }
];
