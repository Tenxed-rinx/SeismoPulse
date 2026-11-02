import { Earthquake } from '../types/seismic';
import { HISTORICAL_QUAKES } from '../data/historicalData';

// Energy calculation based on Richter & Gutenberg empirical formula
// log10(E) = 4.8 + 1.5 * M (E in Joules)
export function calculateSeismicEnergyJoules(magnitude: number): number {
  if (magnitude <= 0) return 0;
  return Math.pow(10, 4.8 + 1.5 * magnitude);
}

export function calculateTntEquivalentTons(joules: number): number {
  // 1 ton TNT = 4.184 x 10^9 Joules
  return joules / 4.184e9;
}

export function getDepthCategory(depthKm: number): 'shallow' | 'intermediate' | 'deep' | 'ultra-deep' {
  if (depthKm < 30) return 'shallow';
  if (depthKm < 70) return 'intermediate';
  if (depthKm < 300) return 'deep';
  return 'ultra-deep';
}

export function estimateMMI(magnitude: number, depthKm: number): number {
  // Estimated epicentral intensity based on Wald et al.
  const hypoDist = Math.max(depthKm, 5);
  const mmi = 2.2 + 1.3 * magnitude - 1.5 * Math.log10(hypoDist);
  return Math.min(Math.max(Math.round(mmi * 10) / 10, 1), 12);
}

export function formatTimeAgo(timestampMs: number): string {
  const diffSec = Math.floor((Date.now() - timestampMs) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

// Convert raw USGS GeoJSON Feature to normalized Earthquake interface
export function normalizeUsgsFeature(feature: any): Earthquake {
  const coords = feature.geometry?.coordinates || [0, 0, 10];
  const lon = Number(coords[0]);
  const lat = Number(coords[1]);
  const depth = Number(coords[2] || 10);
  const mag = Number(feature.properties?.mag || 0);
  const energy = calculateSeismicEnergyJoules(mag);

  return {
    id: feature.id || `eq-${Math.random().toString(36).substring(2, 9)}`,
    title: feature.properties?.title || `M ${mag.toFixed(1)} - Earthquake`,
    place: feature.properties?.place || 'Unspecified Seismic Region',
    magnitude: mag,
    magType: feature.properties?.magType || 'mw',
    time: Number(feature.properties?.time || Date.now()),
    updated: Number(feature.properties?.updated || Date.now()),
    url: feature.properties?.url || 'https://earthquake.usgs.gov',
    detail: feature.properties?.detail || '',
    felt: feature.properties?.felt ?? null,
    cdi: feature.properties?.cdi ?? null,
    mmi: feature.properties?.mmi ?? estimateMMI(mag, depth),
    alert: feature.properties?.alert ?? null,
    status: feature.properties?.status || 'reviewed',
    tsunami: Number(feature.properties?.tsunami || 0),
    sig: Number(feature.properties?.sig || 0),
    net: feature.properties?.net || 'us',
    code: feature.properties?.code || '',
    coordinates: [lon, lat, depth],
    latitude: lat,
    longitude: lon,
    depth: depth,
    energyJoules: energy,
    tntEquivalentTons: calculateTntEquivalentTons(energy),
    depthCategory: getDepthCategory(depth),
    formattedTime: new Date(feature.properties?.time || Date.now()).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  };
}

export const USGS_FEEDS: Record<string, string> = {
  all_time: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson',
  month_25: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson',
  month_45: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson',
  month_significant: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson',
  week_25: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson',
  day_all: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
  hour: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson'
};

const now = Date.now();
const hour = 3600 * 1000;

// Convert historical records into Earthquake type for the All-Time database
export const HISTORICAL_EARTHQUAKES_AS_EQ: Earthquake[] = HISTORICAL_QUAKES.map((hq) => {
  const energy = calculateSeismicEnergyJoules(hq.magnitude);
  // Estimate epoch timestamp from year
  const approxTime = new Date(`${hq.year}-06-15T00:00:00Z`).getTime();
  return {
    id: `hist-${hq.id}`,
    title: `M ${hq.magnitude.toFixed(1)} - ${hq.name}`,
    place: `${hq.location}, ${hq.country}`,
    magnitude: hq.magnitude,
    magType: 'mw',
    time: approxTime,
    updated: approxTime,
    url: 'https://earthquake.usgs.gov/earthquakes/search/',
    detail: hq.summary,
    felt: 50000,
    cdi: 9.0,
    mmi: hq.magnitude >= 9.0 ? 11.5 : hq.magnitude >= 7.8 ? 9.5 : 8.5,
    alert: 'red',
    status: 'historical-reviewed',
    tsunami: hq.tsunamiGenerated ? 1 : 0,
    sig: Math.round(hq.magnitude * 150),
    net: 'historic',
    code: hq.id,
    coordinates: [hq.coordinates[1], hq.coordinates[0], hq.depthKm],
    latitude: hq.coordinates[0],
    longitude: hq.coordinates[1],
    depth: hq.depthKm,
    energyJoules: energy,
    tntEquivalentTons: calculateTntEquivalentTons(energy),
    depthCategory: getDepthCategory(hq.depthKm),
    formattedTime: `${hq.date} (Historical Record)`
  };
});

// Additional major historical benchmarks
const EXTRA_ALL_TIME_QUAKES: Earthquake[] = [
  {
    id: 'hist-chile-2010',
    title: 'M 8.8 - 2010 Maule Chile Earthquake',
    place: 'Offshore Maule Region, Chile',
    magnitude: 8.8,
    magType: 'mww',
    time: new Date('2010-02-27T06:34:00Z').getTime(),
    updated: new Date('2010-02-27T06:34:00Z').getTime(),
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/official20100227063411530_30',
    detail: '',
    felt: 25000,
    cdi: 8.9,
    mmi: 9.0,
    alert: 'red',
    status: 'reviewed',
    tsunami: 1,
    sig: 980,
    net: 'us',
    code: 'official20100227063411530_30',
    coordinates: [-72.73, -35.85, 35.0],
    latitude: -35.85,
    longitude: -72.73,
    depth: 35.0,
    energyJoules: calculateSeismicEnergyJoules(8.8),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(8.8)),
    depthCategory: 'intermediate',
    formattedTime: '2010-02-27 06:34:00 UTC'
  },
  {
    id: 'hist-sichuan-2008',
    title: 'M 7.9 - 2008 Great Sichuan Earthquake',
    place: 'Wenchuan County, Sichuan, China',
    magnitude: 7.9,
    magType: 'mww',
    time: new Date('2008-05-12T06:28:00Z').getTime(),
    updated: new Date('2008-05-12T06:28:00Z').getTime(),
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/usp000g7x6',
    detail: '',
    felt: 8500,
    cdi: 8.5,
    mmi: 9.5,
    alert: 'red',
    status: 'reviewed',
    tsunami: 0,
    sig: 920,
    net: 'us',
    code: 'usp000g7x6',
    coordinates: [103.32, 30.99, 19.0],
    latitude: 30.99,
    longitude: 103.32,
    depth: 19.0,
    energyJoules: calculateSeismicEnergyJoules(7.9),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(7.9)),
    depthCategory: 'shallow',
    formattedTime: '2008-05-12 06:28:00 UTC'
  },
  {
    id: 'hist-kobe-1995',
    title: 'M 6.9 - 1995 Great Hanshin (Kobe) Earthquake',
    place: 'Awaji Island & Kobe, Hyogo, Japan',
    magnitude: 6.9,
    magType: 'mw',
    time: new Date('1995-01-16T20:46:00Z').getTime(),
    updated: new Date('1995-01-16T20:46:00Z').getTime(),
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/usp0006r69',
    detail: '',
    felt: 15000,
    cdi: 8.4,
    mmi: 9.0,
    alert: 'red',
    status: 'reviewed',
    tsunami: 0,
    sig: 820,
    net: 'us',
    code: 'usp0006r69',
    coordinates: [135.03, 34.58, 17.6],
    latitude: 34.58,
    longitude: 135.03,
    depth: 17.6,
    energyJoules: calculateSeismicEnergyJoules(6.9),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(6.9)),
    depthCategory: 'shallow',
    formattedTime: '1995-01-16 20:46:00 UTC'
  },
  {
    id: 'hist-mexico-1985',
    title: 'M 8.0 - 1985 Michoacán & Mexico City Earthquake',
    place: 'Offshore Michoacán & Mexico City, Mexico',
    magnitude: 8.0,
    magType: 'mw',
    time: new Date('1985-09-19T13:17:00Z').getTime(),
    updated: new Date('1985-09-19T13:17:00Z').getTime(),
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/usp0002hp6',
    detail: '',
    felt: 12000,
    cdi: 8.8,
    mmi: 9.0,
    alert: 'red',
    status: 'reviewed',
    tsunami: 1,
    sig: 940,
    net: 'us',
    code: 'usp0002hp6',
    coordinates: [-102.53, 18.19, 27.9],
    latitude: 18.19,
    longitude: -102.53,
    depth: 27.9,
    energyJoules: calculateSeismicEnergyJoules(8.0),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(8.0)),
    depthCategory: 'shallow',
    formattedTime: '1985-09-19 13:17:00 UTC'
  }
];

export const SEED_EARTHQUAKES: Earthquake[] = [
  {
    id: 'us7000m9b4',
    title: 'M 7.1 - 128 km ESE of Kimbe, Papua New Guinea',
    place: '128 km ESE of Kimbe, Papua New Guinea',
    magnitude: 7.1,
    magType: 'mww',
    time: now - 3 * hour,
    updated: now - 2 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m9b4',
    detail: '',
    felt: 184,
    cdi: 7.2,
    mmi: 7.4,
    alert: 'yellow',
    status: 'reviewed',
    tsunami: 1,
    sig: 785,
    net: 'us',
    code: '7000m9b4',
    coordinates: [151.342, -5.871, 48.2],
    latitude: -5.871,
    longitude: 151.342,
    depth: 48.2,
    energyJoules: calculateSeismicEnergyJoules(7.1),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(7.1)),
    depthCategory: 'intermediate',
    formattedTime: new Date(now - 3 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'us7000m8v1',
    title: 'M 6.4 - 72 km NNE of Hualien City, Taiwan',
    place: '72 km NNE of Hualien City, Taiwan',
    magnitude: 6.4,
    magType: 'mww',
    time: now - 7 * hour,
    updated: now - 5 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m8v1',
    detail: '',
    felt: 620,
    cdi: 6.8,
    mmi: 6.9,
    alert: 'yellow',
    status: 'reviewed',
    tsunami: 0,
    sig: 650,
    net: 'us',
    code: '7000m8v1',
    coordinates: [121.94, 24.56, 14.5],
    latitude: 24.56,
    longitude: 121.94,
    depth: 14.5,
    energyJoules: calculateSeismicEnergyJoules(6.4),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(6.4)),
    depthCategory: 'shallow',
    formattedTime: new Date(now - 7 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'us7000m7ka',
    title: 'M 5.8 - 45 km S of Severo-Kurilsk, Russia',
    place: '45 km S of Severo-Kurilsk, Russia',
    magnitude: 5.8,
    magType: 'mwb',
    time: now - 11 * hour,
    updated: now - 9 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m7ka',
    detail: '',
    felt: 12,
    cdi: 4.1,
    mmi: 5.2,
    alert: 'green',
    status: 'reviewed',
    tsunami: 0,
    sig: 512,
    net: 'us',
    code: '7000m7ka',
    coordinates: [156.12, 50.28, 62.0],
    latitude: 50.28,
    longitude: 156.12,
    depth: 62.0,
    energyJoules: calculateSeismicEnergyJoules(5.8),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(5.8)),
    depthCategory: 'intermediate',
    formattedTime: new Date(now - 11 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'nc7498124',
    title: 'M 4.2 - 11 km N of The Geysers, California',
    place: '11 km N of The Geysers, California',
    magnitude: 4.2,
    magType: 'md',
    time: now - 45 * 60 * 1000,
    updated: now - 20 * 60 * 1000,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/nc7498124',
    detail: '',
    felt: 1450,
    cdi: 4.5,
    mmi: 4.6,
    alert: null,
    status: 'automatic',
    tsunami: 0,
    sig: 275,
    net: 'nc',
    code: '7498124',
    coordinates: [-122.75, 38.87, 3.2],
    latitude: 38.87,
    longitude: -122.75,
    depth: 3.2,
    energyJoules: calculateSeismicEnergyJoules(4.2),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(4.2)),
    depthCategory: 'shallow',
    formattedTime: new Date(now - 45 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'us7000m6x8',
    title: 'M 6.1 - 95 km W of San Antonio de los Cobres, Argentina',
    place: '95 km W of San Antonio de los Cobres, Argentina',
    magnitude: 6.1,
    magType: 'mww',
    time: now - 18 * hour,
    updated: now - 15 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m6x8',
    detail: '',
    felt: 85,
    cdi: 3.5,
    mmi: 4.2,
    alert: 'green',
    status: 'reviewed',
    tsunami: 0,
    sig: 574,
    net: 'us',
    code: '7000m6x8',
    coordinates: [-67.24, -24.21, 215.0],
    latitude: -24.21,
    longitude: -67.24,
    depth: 215.0,
    energyJoules: calculateSeismicEnergyJoules(6.1),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(6.1)),
    depthCategory: 'deep',
    formattedTime: new Date(now - 18 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'us7000m5yt',
    title: 'M 5.3 - 38 km SW of Reykjanesbær, Iceland',
    place: '38 km SW of Reykjanesbær, Iceland',
    magnitude: 5.3,
    magType: 'mb',
    time: now - 22 * hour,
    updated: now - 20 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m5yt',
    detail: '',
    felt: 340,
    cdi: 5.1,
    mmi: 5.3,
    alert: 'green',
    status: 'reviewed',
    tsunami: 0,
    sig: 432,
    net: 'us',
    code: '7000m5yt',
    coordinates: [-22.84, 63.85, 6.0],
    latitude: 63.85,
    longitude: -22.84,
    depth: 6.0,
    energyJoules: calculateSeismicEnergyJoules(5.3),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(5.3)),
    depthCategory: 'shallow',
    formattedTime: new Date(now - 22 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'us7000m4zz',
    title: 'M 6.7 - 145 km S of Severo-Kurilsk, Kuril Islands',
    place: '145 km S of Severo-Kurilsk, Kuril Islands',
    magnitude: 6.7,
    magType: 'mww',
    time: now - 26 * hour,
    updated: now - 24 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m4zz',
    detail: '',
    felt: 95,
    cdi: 4.8,
    mmi: 6.1,
    alert: 'yellow',
    status: 'reviewed',
    tsunami: 1,
    sig: 710,
    net: 'us',
    code: '7000m4zz',
    coordinates: [156.45, 49.32, 55.4],
    latitude: 49.32,
    longitude: 156.45,
    depth: 55.4,
    energyJoules: calculateSeismicEnergyJoules(6.7),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(6.7)),
    depthCategory: 'intermediate',
    formattedTime: new Date(now - 26 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'us7000m3ab',
    title: 'M 5.1 - 18 km NNE of Kahramanmaraş, Turkey',
    place: '18 km NNE of Kahramanmaraş, Turkey',
    magnitude: 5.1,
    magType: 'mb',
    time: now - 29 * hour,
    updated: now - 27 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m3ab',
    detail: '',
    felt: 410,
    cdi: 5.4,
    mmi: 5.7,
    alert: 'green',
    status: 'reviewed',
    tsunami: 0,
    sig: 405,
    net: 'us',
    code: '7000m3ab',
    coordinates: [37.02, 37.74, 9.8],
    latitude: 37.74,
    longitude: 37.02,
    depth: 9.8,
    energyJoules: calculateSeismicEnergyJoules(5.1),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(5.1)),
    depthCategory: 'shallow',
    formattedTime: new Date(now - 29 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'us7000m2cd',
    title: 'M 5.9 - 68 km WSW of Pelabuhanratu, Indonesia',
    place: '68 km WSW of Pelabuhanratu, Indonesia',
    magnitude: 5.9,
    magType: 'mww',
    time: now - 34 * hour,
    updated: now - 32 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m2cd',
    detail: '',
    felt: 280,
    cdi: 5.2,
    mmi: 5.5,
    alert: 'green',
    status: 'reviewed',
    tsunami: 0,
    sig: 535,
    net: 'us',
    code: '7000m2cd',
    coordinates: [106.01, -7.21, 68.0],
    latitude: -7.21,
    longitude: 106.01,
    depth: 68.0,
    energyJoules: calculateSeismicEnergyJoules(5.9),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(5.9)),
    depthCategory: 'intermediate',
    formattedTime: new Date(now - 34 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'us7000m1ef',
    title: 'M 4.7 - 82 km S of Kermadec Islands, New Zealand',
    place: '82 km S of Kermadec Islands, New Zealand',
    magnitude: 4.7,
    magType: 'mb',
    time: now - 40 * hour,
    updated: now - 38 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m1ef',
    detail: '',
    felt: 4,
    cdi: 2.1,
    mmi: 3.8,
    alert: null,
    status: 'reviewed',
    tsunami: 0,
    sig: 341,
    net: 'us',
    code: '7000m1ef',
    coordinates: [-178.4, -30.8, 385.0],
    latitude: -30.8,
    longitude: -178.4,
    depth: 385.0,
    energyJoules: calculateSeismicEnergyJoules(4.7),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(4.7)),
    depthCategory: 'ultra-deep',
    formattedTime: new Date(now - 40 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'us7000m0gh',
    title: 'M 5.6 - 28 km E of Miyako, Japan',
    place: '28 km E of Miyako, Japan',
    magnitude: 5.6,
    magType: 'mwb',
    time: now - 44 * hour,
    updated: now - 42 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000m0gh',
    detail: '',
    felt: 190,
    cdi: 4.7,
    mmi: 5.0,
    alert: 'green',
    status: 'reviewed',
    tsunami: 0,
    sig: 480,
    net: 'us',
    code: '7000m0gh',
    coordinates: [142.22, 39.63, 44.0],
    latitude: 39.63,
    longitude: 142.22,
    depth: 44.0,
    energyJoules: calculateSeismicEnergyJoules(5.6),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(5.6)),
    depthCategory: 'intermediate',
    formattedTime: new Date(now - 44 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  },
  {
    id: 'us6000jz99',
    title: 'M 4.9 - 14 km WSW of Guánica, Puerto Rico',
    place: '14 km WSW of Guánica, Puerto Rico',
    magnitude: 4.9,
    magType: 'md',
    time: now - 48 * hour,
    updated: now - 46 * hour,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us6000jz99',
    detail: '',
    felt: 720,
    cdi: 5.5,
    mmi: 5.6,
    alert: 'green',
    status: 'reviewed',
    tsunami: 0,
    sig: 375,
    net: 'pr',
    code: '6000jz99',
    coordinates: [-67.04, 17.93, 11.2],
    latitude: 17.93,
    longitude: -67.04,
    depth: 11.2,
    energyJoules: calculateSeismicEnergyJoules(4.9),
    tntEquivalentTons: calculateTntEquivalentTons(calculateSeismicEnergyJoules(4.9)),
    depthCategory: 'shallow',
    formattedTime: new Date(now - 48 * hour).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  }
];

export const ALL_TIME_SEED: Earthquake[] = [
  ...HISTORICAL_EARTHQUAKES_AS_EQ,
  ...EXTRA_ALL_TIME_QUAKES,
  ...SEED_EARTHQUAKES
];

export async function fetchLiveEarthquakes(feedKey: string = 'all_time'): Promise<{ earthquakes: Earthquake[]; source: 'live' | 'fallback'; count: number }> {
  // If user requests All-Time
  if (feedKey === 'all_time') {
    try {
      const response = await fetch(USGS_FEEDS['all_time']);
      if (response.ok) {
        const data = await response.json();
        const liveSignificant = Array.isArray(data.features) ? data.features.map(normalizeUsgsFeature) : [];
        // Combine historical giants with live comprehensive events
        const mergedMap = new Map<string, Earthquake>();
        [...HISTORICAL_EARTHQUAKES_AS_EQ, ...EXTRA_ALL_TIME_QUAKES, ...liveSignificant, ...SEED_EARTHQUAKES].forEach((eq) => {
          mergedMap.set(eq.id, eq);
        });
        const allTimeList = Array.from(mergedMap.values());
        allTimeList.sort((a, b) => b.magnitude - a.magnitude); // Sort descending by magnitude for all-time
        return {
          earthquakes: allTimeList,
          source: 'live',
          count: allTimeList.length
        };
      }
    } catch {
      // fallback
    }
    return {
      earthquakes: ALL_TIME_SEED,
      source: 'fallback',
      count: ALL_TIME_SEED.length
    };
  }

  const feedUrl = USGS_FEEDS[feedKey] || USGS_FEEDS['week_25'];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(feedUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`USGS HTTP Error ${response.status}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data.features)) {
      const normalized = data.features.map(normalizeUsgsFeature);
      // Sort descending by time
      normalized.sort((a: Earthquake, b: Earthquake) => b.time - a.time);
      return {
        earthquakes: normalized,
        source: 'live',
        count: normalized.length
      };
    }
    throw new Error('Invalid GeoJSON feature structure');
  } catch (err) {
    console.warn('Falling back to local seismic seed catalog:', err);
    return {
      earthquakes: SEED_EARTHQUAKES,
      source: 'fallback',
      count: SEED_EARTHQUAKES.length
    };
  }
}
