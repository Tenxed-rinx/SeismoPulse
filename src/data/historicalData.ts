import { HistoricalQuake } from '../types/seismic';

export const HISTORICAL_QUAKES: HistoricalQuake[] = [
  {
    id: 'valdivia-1960',
    name: '1960 Great Chilean Earthquake (Valdivia)',
    year: 1960,
    date: 'May 22, 1960',
    location: 'Valdivia, Biobío & Araucanía Regions',
    country: 'Chile',
    magnitude: 9.5,
    depthKm: 25,
    fatalities: '1,655 to 6,000',
    damageUsd: '$3.5 Billion (2024 equivalent)',
    ruptureLengthKm: 1000,
    faultMechanism: 'Megathrust Subduction (Nazca under South American plate)',
    summary: 'The most powerful earthquake ever recorded in modern instrumented history. The rupture spanned nearly 1,000 kilometers along the southern Chilean coast, triggering trans-oceanic tsunami waves exceeding 25 meters that caused devastating casualties in Hawaii, Japan, and the Philippines 10,000 km away.',
    lessonsLearned: [
      'Pioneered global tsunami warning coordination through UNESCO and NOAA.',
      'Demonstrated that subduction zones can rupture across immense contiguous megathrust segments.',
      'Spurred Chile to formulate mandatory reinforced concrete shear-wall building codes that save thousands of lives today.'
    ],
    tsunamiGenerated: true,
    coordinates: [-38.29, -73.05]
  },
  {
    id: 'prince-william-1964',
    name: '1964 Great Alaska Earthquake',
    year: 1964,
    date: 'March 27, 1964',
    location: 'Prince William Sound, Anchorage',
    country: 'United States',
    magnitude: 9.2,
    depthKm: 25,
    fatalities: '131',
    damageUsd: '$2.3 Billion (2024 equivalent)',
    ruptureLengthKm: 800,
    faultMechanism: 'Megathrust Subduction (Pacific plate under North American)',
    summary: 'The second strongest instrumented earthquake and the largest in US history. Violent ground shaking lasted nearly four and a half minutes, causing massive soil liquefaction in Turnagain Heights (Anchorage) and triggering underwater landslides that decimated coastal communities.',
    lessonsLearned: [
      'Led directly to the establishment of the USGS National Earthquake Information Center (NEIC).',
      'First definitive physical validation of the modern Plate Tectonics Theory by George Plafker.',
      'Identified soil liquefaction and cyclic mobility as critical failure modes in saturated clays and sands.'
    ],
    tsunamiGenerated: true,
    coordinates: [61.02, -147.65]
  },
  {
    id: 'sumatra-2004',
    name: '2004 Indian Ocean Earthquake & Boxing Day Tsunami',
    year: 2004,
    date: 'December 26, 2004',
    location: 'Off the west coast of northern Sumatra',
    country: 'Indonesia (affected 14 countries)',
    magnitude: 9.1,
    depthKm: 30,
    fatalities: '227,898',
    damageUsd: '$15 Billion',
    ruptureLengthKm: 1300,
    faultMechanism: 'Megathrust Subduction (Indo-Australian under Burma microplate)',
    summary: 'One of the deadliest natural disasters in human history. The earthquake caused a vertical seabed displacement of several meters across a 1,300 km rupture line, displacing an estimated 30 cubic kilometers of ocean water and generating devastating tsunami waves across the entire Indian Ocean rim.',
    lessonsLearned: [
      'Created the Indian Ocean Tsunami Warning and Mitigation System (IOTWMS) with DART ocean buoys.',
      'Emphasized that natural warning signs (abnormal ocean receding) must be recognized immediately by coastal populations.',
      'Sparked comprehensive international disaster management frameworks and cross-border seismic telemetry sharing.'
    ],
    tsunamiGenerated: true,
    coordinates: [3.316, 95.854]
  },
  {
    id: 'tohoku-2011',
    name: '2011 Great East Japan Earthquake & Tsunami',
    year: 2011,
    date: 'March 11, 2011',
    location: 'Off the Pacific coast of Tohoku, Honshu',
    country: 'Japan',
    magnitude: 9.1,
    depthKm: 29,
    fatalities: '19,759',
    damageUsd: '$360 Billion (Costliest natural disaster in history)',
    ruptureLengthKm: 500,
    faultMechanism: 'Megathrust Subduction (Pacific plate under Okhotsk/North American plate)',
    summary: 'The most powerful earthquake recorded in Japan. The seafloor shifted 50 meters horizontally and 7 meters vertically. The resulting tsunami overtopped sea walls up to 10 meters high, devastating coastal cities and triggering the Fukushima Daiichi nuclear accident.',
    lessonsLearned: [
      'Proved that earthquake early warning systems (EEW) via smartphones and train automated braking saved tens of thousands of lives.',
      'Exposed flaws in designing coastal defenses solely around recent historical records rather than millennia-scale paleoseismology.',
      'Led to unprecedented nuclear safety overhaul and decentralized community tsunami vertical evacuation towers.'
    ],
    tsunamiGenerated: true,
    coordinates: [38.297, 142.372]
  },
  {
    id: 'kahramanmaras-2023',
    name: '2023 Turkey–Syria Earthquake Doublet',
    year: 2023,
    date: 'February 6, 2023',
    location: 'Kahramanmaraş, Gaziantep, Hatay & NW Syria',
    country: 'Turkey & Syria',
    magnitude: 7.8,
    depthKm: 10,
    fatalities: '59,259',
    damageUsd: '$104 Billion',
    ruptureLengthKm: 350,
    faultMechanism: 'Left-lateral Strike-Slip (East Anatolian Fault Zone)',
    summary: 'A rare and violent seismic doublet. A magnitude 7.8 mainshock was followed just nine hours later by an energetic magnitude 7.5 aftershock on an adjacent branch fault. The shallow 10 km depth and extreme peak ground acceleration (exceeding 2.0g in spots) caused widespread "pancake" collapse of multi-story residential buildings.',
    lessonsLearned: [
      'Showcased the severe vulnerability of soft-story ground-level retail spaces and non-ductile reinforced concrete framing.',
      'Demonstrated that fault stress transfer can immediately trigger nearby major fault segments.',
      'Stressed the imperative for uncompromised building code enforcement and mandatory seismic retrofitting.'
    ],
    tsunamiGenerated: false,
    coordinates: [37.174, 37.032]
  },
  {
    id: 'haiti-2010',
    name: '2010 Haiti Earthquake',
    year: 2010,
    date: 'January 12, 2010',
    location: 'Léogâne, 25 km west of Port-au-Prince',
    country: 'Haiti',
    magnitude: 7.0,
    depthKm: 13,
    fatalities: '100,000 to 220,000',
    damageUsd: '$8.5 Billion (120% of Haiti GDP)',
    ruptureLengthKm: 50,
    faultMechanism: 'Blind Thrust & Strike-Slip (Enriquillo-Plantain Garden Fault zone)',
    summary: 'Despite an intermediate magnitude of 7.0, this event was catastrophic due to its extremely shallow hypocenter (13 km), proximity to the dense, unreinforced masonry structures of Port-au-Prince, and total lack of earthquake-resistant design standards.',
    lessonsLearned: [
      'Proved that earthquake casualties are primarily structural engineering failures rather than seismic intensity alone.',
      'Highlighted the need for lightweight construction materials, confined masonry, and community-level building inspection.',
      'Led to humanitarian satellite-based rapid damage mapping protocols.'
    ],
    tsunamiGenerated: false,
    coordinates: [18.457, -72.533]
  },
  {
    id: 'san-francisco-1906',
    name: '1906 Great San Francisco Earthquake & Conflagration',
    year: 1906,
    date: 'April 18, 1906',
    location: 'San Francisco Bay Area, Northern California',
    country: 'United States',
    magnitude: 7.9,
    depthKm: 8,
    fatalities: '3,000+',
    damageUsd: '$524 Million (1906 USD, over $15B today)',
    ruptureLengthKm: 470,
    faultMechanism: 'Right-lateral Strike-Slip (San Andreas Fault)',
    summary: 'Ruptured 470 kilometers of the San Andreas Fault with offsets up to 6 meters. While shaking caused severe damage, broken gas mains ignited widespread fires that burned unchecked for three days because water mains were fractured, destroying 80% of the city.',
    lessonsLearned: [
      'Led Harry Fielding Reid to formulate the Elastic Rebound Theory—the foundation of modern seismology.',
      'Prompted the construction of dedicated auxiliary high-pressure saltwater emergency pumping networks.',
      'Transformed municipal gas and utility shutoff valve engineering.'
    ],
    tsunamiGenerated: false,
    coordinates: [37.75, -122.55]
  },
  {
    id: 'gorkha-2015',
    name: '2015 Gorkha Nepal Earthquake',
    year: 2015,
    date: 'April 25, 2015',
    location: 'Gorkha District, Central Nepal',
    country: 'Nepal',
    magnitude: 7.8,
    depthKm: 8.2,
    fatalities: '8,964',
    damageUsd: '$10 Billion',
    ruptureLengthKm: 120,
    faultMechanism: 'Continental Collision Thrust (Main Himalayan Thrust)',
    summary: 'Resulted from the ongoing continental collision of the Indian Plate pushing northward into the Eurasian Plate at ~45 mm/year. The rupture propagated eastward toward Kathmandu, collapsing ancient UNESCO World Heritage brick monuments and triggering a deadly avalanche on Mount Everest.',
    lessonsLearned: [
      'Demonstrated high resonant amplification in deep sedimentary valley basins like Kathmandu.',
      'Prompted reconstruction guidelines combining traditional stone/timber tie-beams with modern seismic band reinforcement.',
      'Accelerated drone photogrammetry for post-disaster search, rescue, and terrain slope stability analysis.'
    ],
    tsunamiGenerated: false,
    coordinates: [28.23, 84.731]
  }
];
