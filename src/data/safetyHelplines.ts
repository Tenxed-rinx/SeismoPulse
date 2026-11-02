import { HelplineEntry, GoBagItem } from '../types/seismic';

export const GLOBAL_HELPLINES: HelplineEntry[] = [
  {
    country: 'United States',
    code: 'US',
    flag: '🇺🇸',
    emergencyNumber: '911',
    disasterAgency: 'FEMA (Federal Emergency Management Agency)',
    agencyPhone: '1-800-621-3362',
    website: 'https://www.fema.gov',
    smsEmergencyAvailable: true,
    notes: 'Text-to-911 is active across major US regions. Download FEMA mobile app for shelter locators.'
  },
  {
    country: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    emergencyNumber: '119',
    disasterAgency: 'JMA (Japan Meteorological Agency) & Fire & Disaster Management',
    agencyPhone: '03-3581-5311',
    website: 'https://www.jma.go.jp/jma/en/',
    smsEmergencyAvailable: true,
    notes: 'Dial 171 for NTT Disaster Emergency Message Dial. English audio broadcasts via NHK World.'
  },
  {
    country: 'Turkey',
    code: 'TR',
    flag: '🇹🇷',
    emergencyNumber: '112',
    disasterAgency: 'AFAD (Disaster and Emergency Management Presidency)',
    agencyPhone: '0312 258 23 23',
    website: 'https://en.afad.gov.tr',
    smsEmergencyAvailable: true,
    notes: 'AFAD Emergency Mobile App enables single-touch geolocation distress calls without phone carrier signal.'
  },
  {
    country: 'India',
    code: 'IN',
    flag: '🇮🇳',
    emergencyNumber: '112',
    disasterAgency: 'NDMA (National Disaster Management Authority)',
    agencyPhone: '011-26701700',
    website: 'https://ndma.gov.in',
    smsEmergencyAvailable: true,
    notes: 'National Emergency Response Support System (ERSS) provides single pan-India 112 emergency services.'
  },
  {
    country: 'Indonesia',
    code: 'ID',
    flag: '🇮🇩',
    emergencyNumber: '112',
    disasterAgency: 'BNPB (National Disaster Management Authority) & BMKG',
    agencyPhone: '021-29827793',
    website: 'https://bnpb.go.id',
    smsEmergencyAvailable: false,
    notes: 'BMKG WRS (Warning Receiver System) provides early tsunami siren alerts for coastal provinces.'
  },
  {
    country: 'Chile',
    code: 'CL',
    flag: '🇨🇱',
    emergencyNumber: '131',
    disasterAgency: 'SENAPRED (formerly ONEMI - National Disaster Prevention & Response)',
    agencyPhone: '+56 2 2252 4300',
    website: 'https://senapred.cl',
    smsEmergencyAvailable: true,
    notes: 'SAE (Emergency Early Alert System) broadcasts cell-broadcast evacuation alerts across all telecom carriers.'
  },
  {
    country: 'Mexico',
    code: 'MX',
    flag: '🇲🇽',
    emergencyNumber: '911',
    disasterAgency: 'CENAPRED & SASMEX (Mexican Seismic Alert System)',
    agencyPhone: '800-00-413-00',
    website: 'https://www.gob.mx/cenapred',
    smsEmergencyAvailable: true,
    notes: 'SASMEX seismic alert horn network broadcasts up to 60 seconds warning before severe tremor arrival.'
  },
  {
    country: 'New Zealand',
    code: 'NZ',
    flag: '🇳🇿',
    emergencyNumber: '111',
    disasterAgency: 'NEMA (National Emergency Management Agency) & GeoNet',
    agencyPhone: '+64 4 817 8555',
    website: 'https://www.civildefence.govt.nz',
    smsEmergencyAvailable: true,
    notes: 'Emergency Mobile Alert (EMA) system transmits acoustic alarms to all compatible handsets in danger zones.'
  },
  {
    country: 'Italy',
    code: 'IT',
    flag: '🇮🇹',
    emergencyNumber: '112',
    disasterAgency: 'Protezione Civile & INGV (National Institute of Geophysics)',
    agencyPhone: '800 840 840',
    website: 'https://www.protezionecivile.gov.it',
    smsEmergencyAvailable: true,
    notes: 'IT-alert mobile broadcast platform active for seismic collapse and tsunami hazard zones.'
  },
  {
    country: 'Greece',
    code: 'GR',
    flag: '🇬🇷',
    emergencyNumber: '112',
    disasterAgency: 'General Secretariat for Civil Protection (GSCP)',
    agencyPhone: '+30 213 1510 100',
    website: 'https://civilprotection.gov.gr',
    smsEmergencyAvailable: true,
    notes: 'Multilingual emergency dispatch center coordinates Hellenic rescue and Aegean tsunami monitoring.'
  },
  {
    country: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    emergencyNumber: '911',
    disasterAgency: 'Public Safety Canada & Natural Resources Canada',
    agencyPhone: '1-800-830-3118',
    website: 'https://www.publicsafety.gc.ca',
    smsEmergencyAvailable: true,
    notes: 'Alert Ready cellular broadcast system covers Cascadia subduction and St. Lawrence seismic corridors.'
  },
  {
    country: 'Philippines',
    code: 'PH',
    flag: '🇵🇭',
    emergencyNumber: '911',
    disasterAgency: 'NDRRMC & PHIVOLCS (Institute of Volcanology and Seismology)',
    agencyPhone: '(02) 8911-5061',
    website: 'https://www.phivolcs.dost.gov.ph',
    smsEmergencyAvailable: true,
    notes: 'Emergency Cell Broadcast System (ECBS) transmits automated warnings via local telecommunications.'
  }
];

export const INITIAL_GOBAG_ITEMS: GoBagItem[] = [
  {
    id: 'gb-1',
    label: 'Potable Water (4 Liters / Person)',
    category: 'water-food',
    description: 'Minimum 3-day supply in sturdy containers; includes chlorine purification drops.',
    completed: true
  },
  {
    id: 'gb-2',
    label: 'Non-Perishable Energy Rations',
    category: 'water-food',
    description: 'High-calorie energy bars, nuts, dried fruits, canned meals with manual can opener.',
    completed: true
  },
  {
    id: 'gb-3',
    label: 'Trauma & First Aid Kit',
    category: 'medical',
    description: 'Pressure bandages, antiseptic swabs, medical tape, sterile gauze, burn gel, scissors.',
    completed: false
  },
  {
    id: 'gb-4',
    label: 'Prescription Medications & Medical History',
    category: 'medical',
    description: '7-day supply of critical daily prescriptions plus copies of physician notes.',
    completed: false
  },
  {
    id: 'gb-5',
    label: 'High-Decibel Emergency Whistle',
    category: 'tools',
    description: 'Signaling tool for search-and-rescue teams if trapped under structural debris.',
    completed: true
  },
  {
    id: 'gb-6',
    label: 'Hand-Crank NOAA / AM/FM Radio & Solar Flashlight',
    category: 'tools',
    description: 'Battery-independent emergency broadcast receiver and torch with USB charging dynamos.',
    completed: false
  },
  {
    id: 'gb-7',
    label: 'Multi-Tool & Gas/Water Shutoff Wrench',
    category: 'tools',
    description: 'Non-sparking utility wrench to quickly turn off residential main gas valves and water lines.',
    completed: false
  },
  {
    id: 'gb-8',
    label: 'Waterproof Document Pouch',
    category: 'documents',
    description: 'Passports, IDs, insurance policies, property deeds, emergency contact list, and cash in small bills.',
    completed: true
  },
  {
    id: 'gb-9',
    label: 'N95 / FFP2 Particulate Dust Masks',
    category: 'comfort',
    description: 'Protects lungs against toxic silica, pulverized concrete, and drywall particulate dust.',
    completed: false
  },
  {
    id: 'gb-10',
    label: 'Heavy-Duty Work Gloves & Mylar Thermal Blanket',
    category: 'comfort',
    description: 'Puncture-resistant leather gloves for broken glass clearance and heat-retaining space blanket.',
    completed: true
  }
];
