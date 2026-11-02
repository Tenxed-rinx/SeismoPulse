import { TectonicPlateFeature } from '../types/seismic';

export interface VolcanoFeature {
  name: string;
  country: string;
  coordinates: [number, number]; // [lat, lng]
  elevationM: number;
  type: string;
}

// Major volcanic hotspots and Ring of Fire stratovolcanoes
export const RING_OF_FIRE_VOLCANOES: VolcanoFeature[] = [
  { name: 'Mount Fuji', country: 'Japan', coordinates: [35.3606, 138.7274], elevationM: 3776, type: 'Stratovolcano' },
  { name: 'Krakatoa', country: 'Indonesia', coordinates: [-6.102, 105.423], elevationM: 813, type: 'Caldera' },
  { name: 'Mount Merapi', country: 'Indonesia', coordinates: [-7.5407, 110.4457], elevationM: 2910, type: 'Stratovolcano' },
  { name: 'Mount Pinatubo', country: 'Philippines', coordinates: [15.13, 120.35], elevationM: 1486, type: 'Stratovolcano' },
  { name: 'Mount St. Helens', country: 'United States', coordinates: [46.1914, -122.1956], elevationM: 2549, type: 'Stratovolcano' },
  { name: 'Mount Rainier', country: 'United States', coordinates: [46.8523, -121.7603], elevationM: 4392, type: 'Stratovolcano' },
  { name: 'Popocatépetl', country: 'Mexico', coordinates: [19.0224, -98.6279], elevationM: 5426, type: 'Stratovolcano' },
  { name: 'Cotopaxi', country: 'Ecuador', coordinates: [-0.6806, -78.4378], elevationM: 5897, type: 'Stratovolcano' },
  { name: 'Villarrica', country: 'Chile', coordinates: [-39.42, -71.93], elevationM: 2847, type: 'Stratovolcano' },
  { name: 'Kilauea & Mauna Loa', country: 'United States (Hawaii)', coordinates: [19.421, -155.287], elevationM: 1222, type: 'Shield' },
  { name: 'Eyjafjallajökull', country: 'Iceland', coordinates: [63.63, -19.62], elevationM: 1666, type: 'Stratovolcano' },
  { name: 'Mount Etna', country: 'Italy', coordinates: [37.751, 14.9934], elevationM: 3357, type: 'Stratovolcano' },
  { name: 'Santorini Caldera', country: 'Greece', coordinates: [36.404, 25.396], elevationM: 367, type: 'Caldera' },
  { name: 'White Island (Whakaari)', country: 'New Zealand', coordinates: [-37.52, 177.18], elevationM: 321, type: 'Stratovolcano' },
  { name: 'Mount Ruapehu', country: 'New Zealand', coordinates: [-39.28, 175.57], elevationM: 2797, type: 'Stratovolcano' },
  { name: 'Mount Taal', country: 'Philippines', coordinates: [14.002, 120.993], elevationM: 311, type: 'Caldera' },
  { name: 'Klyuchevskaya Sopka', country: 'Russia (Kamchatka)', coordinates: [56.057, 160.642], elevationM: 4750, type: 'Stratovolcano' }
];

// Comprehensive global tectonic plate boundary coordinates (GeoJSON FeatureCollection)
export const TECTONIC_PLATES_GEOJSON: { type: 'FeatureCollection'; features: TectonicPlateFeature[] } = {
  type: 'FeatureCollection',
  features: [
    // 1. Pacific Ring of Fire - Aleutians, Kamchatka, Kuril, Japan
    {
      type: 'Feature',
      properties: { PlateName: 'Aleutian Subduction Trench', Code: 'PAC-NOA', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-148, 59], [-154, 57], [-160, 54], [-168, 52], [-175, 51.5], [178, 51.5],
          [170, 52], [165, 53], [160, 53.5], [157, 51], [154, 48], [150, 45],
          [145, 42], [143, 38], [142, 34]
        ]
      }
    },
    // 2. Japan Trench & Nankai Trough
    {
      type: 'Feature',
      properties: { PlateName: 'Japan Trench & Nankai Megathrust', Code: 'PAC-EUR', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [144, 41], [143, 38], [142, 35], [139, 33], [136, 31], [133, 28],
          [130, 26], [126, 23], [122, 22], [121, 24], [122, 25.5]
        ]
      }
    },
    // 3. Mariana & Izu-Bonin Trench
    {
      type: 'Feature',
      properties: { PlateName: 'Mariana & Izu-Bonin Trench (Challenger Deep)', Code: 'PAC-PHS', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [141, 33], [142, 28], [143, 24], [144, 20], [145, 16], [147, 12],
          [145, 10], [142, 11], [138, 14], [135, 18], [132, 22], [128, 25]
        ]
      }
    },
    // 4. Philippine Trench & Halmahera
    {
      type: 'Feature',
      properties: { PlateName: 'Philippine Subduction Trench', Code: 'PHS-SUND', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [125, 18], [126, 15], [127, 12], [127.5, 9], [127, 6], [128, 2], [129, -1], [131, -4]
        ]
      }
    },
    // 5. Sunda Megathrust (Sumatra, Java, Sunda Arc)
    {
      type: 'Feature',
      properties: { PlateName: 'Sunda Megathrust (Sumatra - Java - Bali)', Code: 'IND-SUND', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [92, 15], [93, 11], [95, 6], [97, 2], [100, -1], [102, -3],
          [105, -6], [108, -8.5], [113, -9.5], [118, -10], [123, -10],
          [128, -8.5], [132, -6], [136, -4.5]
        ]
      }
    },
    // 6. Tonga-Kermadec & Hikurangi Subduction (New Zealand)
    {
      type: 'Feature',
      properties: { PlateName: 'Tonga-Kermadec Subduction Zone', Code: 'PAC-AUS', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-172, -15], [-173, -18], [-174, -22], [-176, -27], [-178, -32],
          [179, -36], [178, -38], [177, -40], [174, -42], [171, -44], [167, -46]
        ]
      }
    },
    // 7. Alpine Fault & Puysegur Trench (New Zealand)
    {
      type: 'Feature',
      properties: { PlateName: 'Alpine Fault Zone (New Zealand)', Code: 'NZ-ALP', Type: 'Transform' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [174, -41], [172.5, -42.5], [170, -43.8], [168, -45], [166, -46.5]
        ]
      }
    },
    // 8. San Andreas Fault System (California)
    {
      type: 'Feature',
      properties: { PlateName: 'San Andreas Fault System', Code: 'PAC-NAM', Type: 'Transform' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-124.8, 40.4], [-123.7, 39.0], [-122.8, 38.0], [-122.1, 37.5],
          [-120.9, 36.3], [-119.5, 35.1], [-118.2, 34.4], [-116.5, 33.7],
          [-115.5, 33.0], [-114.5, 31.8], [-112.5, 27.5], [-109.5, 23.5]
        ]
      }
    },
    // 9. Cascadia Megathrust (Pacific Northwest / Canada)
    {
      type: 'Feature',
      properties: { PlateName: 'Cascadia Subduction Megathrust', Code: 'JDF-NAM', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-128.5, 51.0], [-127.5, 48.8], [-126.0, 46.5], [-125.0, 44.5],
          [-124.6, 42.0], [-124.8, 40.4]
        ]
      }
    },
    // 10. Middle America Trench (Mexico & Central America)
    {
      type: 'Feature',
      properties: { PlateName: 'Middle America Trench (Cocos Subduction)', Code: 'COC-NAM', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-106, 20], [-103, 18], [-100, 16], [-96, 14.5], [-93, 13.5],
          [-90, 12.5], [-87, 10.5], [-84, 8.5], [-82, 7.5]
        ]
      }
    },
    // 11. Peru-Chile Megathrust (Nazca Subduction)
    {
      type: 'Feature',
      properties: { PlateName: 'Peru-Chile Megathrust (Atacama Trench)', Code: 'NAZ-SAM', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-80, 2], [-81, -2], [-81.5, -6], [-80, -10], [-77, -13],
          [-74, -16], [-71.5, -19], [-70.8, -24], [-71.2, -29], [-72.0, -34],
          [-73.5, -39], [-75.0, -44], [-75.5, -49], [-73.0, -54]
        ]
      }
    },
    // 12. Himalayan Frontal Collision Thrust (India - Eurasia)
    {
      type: 'Feature',
      properties: { PlateName: 'Main Himalayan Collision Thrust', Code: 'IND-EUR', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [71, 35], [74, 34], [77, 32], [81, 29.5], [85, 27.5],
          [89, 27], [93, 27.5], [96, 28], [97, 25], [95, 21], [93, 17]
        ]
      }
    },
    // 13. North Anatolian & East Anatolian Faults (Turkey)
    {
      type: 'Feature',
      properties: { PlateName: 'North Anatolian Fault (Turkey / Black Sea)', Code: 'ANA-EUR', Type: 'Transform' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [26.0, 40.4], [28.5, 40.7], [31.5, 40.8], [35.0, 40.8], [38.5, 40.1], [41.0, 39.7]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { PlateName: 'East Anatolian & Dead Sea Transform Fault', Code: 'ANA-ARA', Type: 'Transform' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [41.0, 39.7], [38.8, 38.4], [37.2, 37.2], [36.3, 36.0], [35.9, 33.5], [35.5, 31.5], [34.9, 28.5], [34.2, 26.0]
        ]
      }
    },
    // 14. Hellenic & Calabrian Arcs (Greece & Southern Italy)
    {
      type: 'Feature',
      properties: { PlateName: 'Hellenic Subduction Arc (Aegean Sea)', Code: 'AFR-EUR', Type: 'Convergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [20.5, 38.0], [21.5, 36.5], [23.5, 35.5], [26.0, 35.0], [28.0, 35.5], [29.5, 36.5]
        ]
      }
    },
    // 15. Mid-Atlantic Ridge (Spreading Center)
    {
      type: 'Feature',
      properties: { PlateName: 'Mid-Atlantic Spreading Ridge', Code: 'MAR', Type: 'Divergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-17, 72], [-18, 66], [-23, 62], [-29, 52], [-35, 42], [-38, 30],
          [-43, 16], [-37, 7], [-25, 0], [-16, -10], [-13, -22], [-15, -34],
          [-17, -46], [-18, -55]
        ]
      }
    },
    // 16. East African Rift System
    {
      type: 'Feature',
      properties: { PlateName: 'East African Continental Rift', Code: 'AFR-SOM', Type: 'Divergent' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [41.5, 12.0], [39.0, 8.5], [36.5, 3.5], [36.0, -1.0], [35.5, -5.5], [34.0, -10.0], [34.5, -15.5]
        ]
      }
    }
  ]
};
