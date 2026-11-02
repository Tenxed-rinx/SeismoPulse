export interface Earthquake {
  id: string;
  title: string;
  place: string;
  magnitude: number;
  magType: string;
  time: number;
  updated: number;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: string | null;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  coordinates: [number, number, number]; // [longitude, latitude, depth_km]
  latitude: number;
  longitude: number;
  depth: number;
  energyJoules: number;
  tntEquivalentTons: number;
  depthCategory: 'shallow' | 'intermediate' | 'deep' | 'ultra-deep';
  formattedTime: string;
}

export type MapTileLayer = 'topo' | 'street' | 'terrain' | 'dark' | 'gray';

export interface FilterState {
  minMagnitude: number;
  maxMagnitude: number;
  maxDepth: number;
  timeRange: 'hour' | 'day' | 'week' | 'month';
  searchQuery: string;
  region: string;
  tsunamiOnly: boolean;
}

export interface TectonicPlateFeature {
  type: 'Feature';
  properties: {
    PlateName: string;
    Code: string;
    Type: 'Divergent' | 'Convergent' | 'Transform' | 'Complex';
  };
  geometry: {
    type: 'LineString' | 'MultiLineString';
    coordinates: number[][] | number[][][];
  };
}

export interface HistoricalQuake {
  id: string;
  name: string;
  year: number;
  date: string;
  location: string;
  country: string;
  magnitude: number;
  depthKm: number;
  fatalities: string;
  damageUsd: string;
  ruptureLengthKm: number;
  faultMechanism: string;
  summary: string;
  lessonsLearned: string[];
  tsunamiGenerated: boolean;
  coordinates: [number, number]; // [lat, lng]
}

export interface HelplineEntry {
  country: string;
  code: string;
  flag: string;
  emergencyNumber: string;
  disasterAgency: string;
  agencyPhone: string;
  website: string;
  smsEmergencyAvailable: boolean;
  notes: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'immediate-action' | 'indoor-outdoor' | 'tsunami' | 'post-quake' | 'structural';
}

export interface GoBagItem {
  id: string;
  label: string;
  category: 'water-food' | 'medical' | 'tools' | 'documents' | 'comfort';
  description: string;
  completed: boolean;
}

export interface MongoPipelineStage {
  id: string;
  operator: '$match' | '$group' | '$project' | '$sort' | '$limit' | '$bucket' | '$count';
  rawJson: string;
  description: string;
  enabled: boolean;
}
