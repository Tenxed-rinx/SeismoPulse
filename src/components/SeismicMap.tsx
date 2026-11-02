import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Earthquake, FilterState, MapTileLayer } from '../types/seismic';
import { TECTONIC_PLATES_GEOJSON, RING_OF_FIRE_VOLCANOES } from '../data/tectonicPlates';
import {
  Layers,
  Search,
  SlidersHorizontal,
  Flame,
  Radio,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Compass,
  Zap,
  Info,
  Maximize2,
  Crosshair,
  MapPin,
  Mountain,
  Eye,
  RefreshCw,
  Sparkles,
  Globe2,
  Check,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface SeismicMapProps {
  earthquakes: Earthquake[];
  selectedQuake: Earthquake | null;
  onSelectQuake: (quake: Earthquake | null) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  activeFeed: string;
  onChangeFeed: (feedKey: string) => void;
  isLoading: boolean;
  onSendToPredictor?: (quake: Earthquake) => void;
  isActive?: boolean;
}

export const SeismicMap: React.FC<SeismicMapProps> = ({
  earthquakes,
  selectedQuake,
  onSelectQuake,
  filters,
  setFilters,
  activeFeed,
  onChangeFeed,
  isLoading,
  onSendToPredictor,
  isActive = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tectonicLayerRef = useRef<L.GeoJSON | null>(null);
  const volcanoesLayerRef = useRef<L.LayerGroup | null>(null);
  const shakeRadiusLayerRef = useRef<L.LayerGroup | null>(null);

  // Default to Light Topo (Topographic terrain contours, zero watermarks, no API keys)
  const [tileLayer, setTileLayer] = useState<MapTileLayer>('topo');
  const [showTectonicPlates, setShowTectonicPlates] = useState<boolean>(true);
  const [showVolcanoes, setShowVolcanoes] = useState<boolean>(true);
  const [showShakeRadius, setShowShakeRadius] = useState<boolean>(true);

  // Region Jump Coordinates
  const REGION_PRESETS: { name: string; center: [number, number]; zoom: number }[] = [
    { name: 'Global Overview', center: [20, 10], zoom: 2.2 },
    { name: 'Pacific Ring of Fire', center: [15, 160], zoom: 3 },
    { name: 'Japan & East Asia', center: [36, 138], zoom: 5 },
    { name: 'California & Cascadia', center: [37.5, -120], zoom: 5 },
    { name: 'Mediterranean & Turkey', center: [37, 30], zoom: 5 },
    { name: 'Chile & Peru Trench', center: [-25, -70], zoom: 4.5 },
    { name: 'Indonesia & Sunda Arc', center: [-2, 115], zoom: 4.5 },
    { name: 'Himalayan Fault Belt', center: [29, 85], zoom: 5 }
  ];

  // Tile layer configuration (100% Free, NO API keys, NO watermarks!)
  const getTileConfig = (layerType: MapTileLayer): { url: string; options: L.TileLayerOptions } => {
    switch (layerType) {
      case 'topo':
        // Esri World Topo Map: Industry-standard light topographic map with hillshading & elevations
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          options: {
            attribution: 'Tiles &copy; Esri &mdash; USGS, NOAA, DeLorme',
            maxZoom: 18
          }
        };
      case 'street':
        // OpenStreetMap Standard: Crisp, reliable global street mapping
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          options: {
            attribution: '&copy; OpenStreetMap contributors',
            subdomains: ['a', 'b', 'c'],
            maxZoom: 19
          }
        };
      case 'terrain':
        // Esri World Imagery (High-res satellite terrain)
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          options: {
            attribution: '&copy; Esri World Imagery &mdash; Earthstar Geographics',
            maxZoom: 18
          }
        };
      case 'gray':
        // Esri World Light Gray Canvas: Clean neutral map for seismic overlays
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          options: {
            attribution: 'Tiles &copy; Esri &mdash; DeLorme, NAVTEQ',
            maxZoom: 16
          }
        };
      case 'dark':
      default:
        // Esri World Dark Gray Canvas: 100% Free, NO API KEY watermark, pristine dark canvas
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          options: {
            attribution: 'Tiles &copy; Esri &mdash; DeLorme, NAVTEQ',
            maxZoom: 16
          }
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 10],
      zoom: 2.2,
      minZoom: 1.8,
      maxZoom: 18,
      zoomControl: false,
      worldCopyJump: true,
      doubleClickZoom: false // disable default zoom-in on double click
    });

    // Custom user requirement: double click on the map zooms out
    map.on('dblclick', (e) => {
      // Zoom out smoothly
      map.zoomOut();
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer: Esri World Topo Map (Light Topo, zero watermarks)
    const tileConfig = getTileConfig('topo');
    const baseTile = L.tileLayer(tileConfig.url, tileConfig.options).addTo(map);
    currentTileLayerRef.current = baseTile;

    // Layer Groups
    shakeRadiusLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    volcanoesLayerRef.current = L.layerGroup().addTo(map);

    // Tectonic Plates GeoJSON Layer
    const tectonicGeoJson = L.geoJSON(TECTONIC_PLATES_GEOJSON as any, {
      style: (feature) => {
        const type = feature?.properties?.Type;
        let color = '#0284C7';
        if (type === 'Convergent') color = '#DC2626'; // Red for subduction trenches
        if (type === 'Transform') color = '#D97706'; // Amber for transform faults
        if (type === 'Divergent') color = '#059669'; // Emerald for spreading rifts
        return {
          color: color,
          weight: 2.5,
          opacity: 0.95,
          dashArray: '5, 5',
          lineCap: 'round',
          lineJoin: 'round'
        };
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.PlateName) {
          layer.bindTooltip(
            `<div class="text-xs font-bold text-slate-900">${feature.properties.PlateName}</div><div class="text-[11px] text-sky-700 font-semibold">Type: ${feature.properties.Type} Fault Boundary</div>`,
            { sticky: true, className: 'leaflet-popup-content-wrapper' }
          );
        }
      }
    });

    tectonicGeoJson.addTo(map);
    tectonicLayerRef.current = tectonicGeoJson;

    mapInstanceRef.current = map;

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate size on tab change or mount
  useEffect(() => {
    if (isActive && mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 60);
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 250);
    }
  }, [isActive]);

  // Tile layer switch
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (currentTileLayerRef.current && map.hasLayer(currentTileLayerRef.current)) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const { url, options } = getTileConfig(tileLayer);
    const newLayer = L.tileLayer(url, options);
    newLayer.addTo(map);
    newLayer.bringToBack();
    currentTileLayerRef.current = newLayer;

    setTimeout(() => map.invalidateSize(), 50);
  }, [tileLayer]);

  // Tectonic Layer toggle
  useEffect(() => {
    if (!mapInstanceRef.current || !tectonicLayerRef.current) return;
    if (showTectonicPlates) {
      if (!mapInstanceRef.current.hasLayer(tectonicLayerRef.current)) {
        tectonicLayerRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      if (mapInstanceRef.current.hasLayer(tectonicLayerRef.current)) {
        mapInstanceRef.current.removeLayer(tectonicLayerRef.current);
      }
    }
  }, [showTectonicPlates]);

  // Render Volcanoes
  useEffect(() => {
    if (!mapInstanceRef.current || !volcanoesLayerRef.current) return;
    const vGroup = volcanoesLayerRef.current;
    vGroup.clearLayers();

    if (!showVolcanoes) return;

    RING_OF_FIRE_VOLCANOES.forEach((vol) => {
      const vMarker = L.circleMarker([vol.coordinates[0], vol.coordinates[1]], {
        radius: 5.5,
        fillColor: '#DB2777',
        color: '#FFFFFF',
        weight: 1.8,
        opacity: 0.95,
        fillOpacity: 0.9
      });

      const tooltipContent = `
        <div class="text-xs font-bold text-pink-700 flex items-center gap-1">
          <span>🌋 ${vol.name}</span>
        </div>
        <div class="text-[11px] text-slate-700 font-medium">${vol.country} · ${vol.elevationM} m elevation</div>
        <div class="text-[10px] text-slate-500">${vol.type} Stratovolcano</div>
      `;
      vMarker.bindTooltip(tooltipContent, { direction: 'top', offset: [0, -6] });
      vGroup.addLayer(vMarker);
    });
  }, [showVolcanoes]);

  // Filter Earthquakes
  const filteredQuakes = earthquakes.filter((eq) => {
    if (eq.magnitude < filters.minMagnitude || eq.magnitude > filters.maxMagnitude) return false;
    if (eq.depth > filters.maxDepth) return false;
    if (filters.tsunamiOnly && eq.tsunami !== 1) return false;
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchPlace = eq.place.toLowerCase().includes(q);
      const matchId = eq.id.toLowerCase().includes(q);
      if (!matchPlace && !matchId) return false;
    }
    return true;
  });

  // Render Earthquake Epicenters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    filteredQuakes.forEach((eq) => {
      let fillColor = '#059669'; // M < 3.0: Vivid Emerald
      if (eq.magnitude >= 7.5) fillColor = '#9333EA'; // M >= 7.5: Royal Purple
      else if (eq.magnitude >= 6.0) fillColor = '#E11D48'; // M >= 6.0: Crimson
      else if (eq.magnitude >= 4.5) fillColor = '#EA580C'; // M >= 4.5: Deep Orange
      else if (eq.magnitude >= 3.0) fillColor = '#D97706'; // M >= 3.0: Rich Amber

      const radius = Math.max(4, Math.pow(eq.magnitude, 1.45) * 1.35);
      const isSelected = selectedQuake?.id === eq.id;

      const circle = L.circleMarker([eq.latitude, eq.longitude], {
        radius: isSelected ? radius + 5 : radius,
        fillColor: fillColor,
        color: isSelected ? '#0F172A' : '#FFFFFF',
        weight: isSelected ? 2.5 : 1.2,
        opacity: 0.95,
        fillOpacity: isSelected ? 0.95 : 0.82
      });

      const popupHtml = `
        <div class="space-y-1.5 p-1 text-slate-900">
          <div class="flex items-center justify-between gap-4">
            <span class="text-xs font-bold px-1.5 py-0.5 rounded shadow-xs ${
              eq.magnitude >= 7.0
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : eq.magnitude >= 6.0
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : eq.magnitude >= 4.5
                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }">
              M ${eq.magnitude.toFixed(1)} ${eq.magType.toUpperCase()}
            </span>
            <span class="text-[11px] font-mono text-sky-700 font-bold">${eq.depth.toFixed(1)} km depth</span>
          </div>
          <div class="text-xs font-bold leading-tight text-slate-900">${eq.place}</div>
          <div class="text-[11px] text-slate-500 font-mono">${eq.formattedTime}</div>
          <div class="pt-1 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <span class="text-slate-700 font-mono font-medium">Energy: ${(eq.energyJoules / 1e12).toFixed(2)} TJ</span>
            ${eq.tsunami === 1 ? '<span class="text-rose-600 font-bold">🌊 Tsunami Alert</span>' : ''}
          </div>
        </div>
      `;

      circle.bindTooltip(popupHtml, { direction: 'top', offset: [0, -radius] });
      circle.on('click', () => onSelectQuake(eq));
      markersGroup.addLayer(circle);
    });
  }, [filteredQuakes, selectedQuake]);

  // Render Isoseismal Shake Radius
  useEffect(() => {
    if (!mapInstanceRef.current || !shakeRadiusLayerRef.current) return;
    const sGroup = shakeRadiusLayerRef.current;
    sGroup.clearLayers();

    if (!selectedQuake || !showShakeRadius) return;

    const lat = selectedQuake.latitude;
    const lng = selectedQuake.longitude;
    const mag = selectedQuake.magnitude;

    const severeRadiusM = Math.max(10000, Math.pow(10, 0.45 * mag) * 1200);
    const strongRadiusM = severeRadiusM * 2.2;
    const lightRadiusM = severeRadiusM * 4.5;

    const outerCircle = L.circle([lat, lng], {
      radius: lightRadiusM,
      color: '#0284C7',
      weight: 1.2,
      dashArray: '4, 4',
      fillColor: '#0284C7',
      fillOpacity: 0.08
    });

    const midCircle = L.circle([lat, lng], {
      radius: strongRadiusM,
      color: '#D97706',
      weight: 1.5,
      dashArray: '3, 3',
      fillColor: '#D97706',
      fillOpacity: 0.12
    });

    const innerCircle = L.circle([lat, lng], {
      radius: severeRadiusM,
      color: '#E11D48',
      weight: 2,
      fillColor: '#E11D48',
      fillOpacity: 0.22
    });

    sGroup.addLayer(outerCircle);
    sGroup.addLayer(midCircle);
    sGroup.addLayer(innerCircle);
  }, [selectedQuake, showShakeRadius]);

  // Pan to selected quake
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedQuake) return;
    mapInstanceRef.current.flyTo([selectedQuake.latitude, selectedQuake.longitude], 6, {
      duration: 1.2
    });
  }, [selectedQuake]);

  const handleJumpToRegion = (preset: { center: [number, number]; zoom: number }) => {
    mapInstanceRef.current?.flyTo(preset.center, preset.zoom, { duration: 1.5 });
  };

  const handleResetGlobalView = () => {
    mapInstanceRef.current?.flyTo([20, 10], 2.2, { duration: 1.2 });
  };

  // Top summary KPIs
  const maxQuake = earthquakes.reduce<Earthquake | null>((prev, cur) => {
    if (!prev || cur.magnitude > prev.magnitude) return cur;
    return prev;
  }, null);

  const avgDepth = earthquakes.length > 0
    ? (earthquakes.reduce((sum, e) => sum + e.depth, 0) / earthquakes.length).toFixed(1)
    : '0';

  const tsunamiAlertsCount = earthquakes.filter((e) => e.tsunami === 1).length;

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-4">
      {/* Top Header & Telemetry Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Real-Time Seismic Cartography Console</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Interactive Earthquakes, Tectonic Faults & Volcanic Belts
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Visualizing live seismicity across watermark-free topographic and satellite maps with ground-motion radius zones.
          </p>
        </div>

        {/* Global Controls: Horizon Feed & Region Jumper */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Horizon Feed Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs shadow-2xs">
            <span className="text-slate-600 font-bold font-mono">Feed:</span>
            <select
              value={activeFeed}
              onChange={(e) => onChangeFeed(e.target.value)}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
            >
              <option value="all_time">★ All-Time Global Catalog (1,500+ Quakes)</option>
              <option value="month_25">Past 30 Days (M2.5+ Global)</option>
              <option value="month_45">Past 30 Days (M4.5+ Heavy)</option>
              <option value="month_significant">Past 30 Days (Significant)</option>
              <option value="week_25">Past 7 Days (M2.5+)</option>
              <option value="day_all">Past 24 Hours (All Quakes)</option>
              <option value="hour">Past Hour (Real-Time)</option>
            </select>
          </div>

          {/* Region Quick Jump */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-600 font-bold font-mono">Jump:</span>
            <select
              onChange={(e) => {
                const p = REGION_PRESETS.find((r) => r.name === e.target.value);
                if (p) handleJumpToRegion(p);
              }}
              defaultValue="Global Overview"
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
            >
              {REGION_PRESETS.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-0.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Total Quakes in Catalog</div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {earthquakes.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium font-mono">
            {filteredQuakes.length} visible in filter
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-0.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-700 font-semibold">Strongest Event</div>
          <div className="text-2xl font-extrabold font-mono text-amber-700 tabular-nums">
            M {maxQuake ? maxQuake.magnitude.toFixed(1) : '0.0'}
          </div>
          <div className="text-[11px] text-slate-500 truncate" title={maxQuake?.place}>
            {maxQuake ? maxQuake.place : 'None recorded'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-0.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-sky-700 font-semibold">Avg Hypocentral Depth</div>
          <div className="text-2xl font-extrabold font-mono text-sky-800 tabular-nums">
            {avgDepth} <span className="text-xs text-slate-500 font-normal">km</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Sub-crustal focal focus</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-0.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-semibold">Tsunami Warning Flags</div>
          <div className="text-2xl font-extrabold font-mono text-rose-600 tabular-nums">
            {tsunamiAlertsCount}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Oceanic displacement alerts</div>
        </div>
      </div>

      {/* Main Responsive Dashboard Workspace: Framed Map Viewport + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Framed Map Viewport Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Card Toolbar */}
          <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Basemap Style Switcher */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
              <button
                type="button"
                onClick={() => setTileLayer('topo')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tileLayer === 'topo'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🏔️ Light Topo
              </button>
              <button
                type="button"
                onClick={() => setTileLayer('street')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tileLayer === 'street'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🏙️ Street (OSM)
              </button>
              <button
                type="button"
                onClick={() => setTileLayer('terrain')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tileLayer === 'terrain'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🛰️ Satellite
              </button>
              <button
                type="button"
                onClick={() => setTileLayer('dark')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tileLayer === 'dark'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                🌑 Dark Canvas
              </button>
              <button
                type="button"
                onClick={() => setTileLayer('gray')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tileLayer === 'gray'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                ⬜ Light Gray
              </button>
            </div>

            {/* Layer Toggles & Action */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTectonicPlates(!showTectonicPlates)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  showTectonicPlates
                    ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-xs'
                    : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                <span>Fault Lines</span>
              </button>

              <button
                type="button"
                onClick={() => setShowVolcanoes(!showVolcanoes)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  showVolcanoes
                    ? 'bg-pink-50 border-pink-300 text-pink-800 shadow-xs'
                    : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mountain className="w-3.5 h-3.5 text-pink-600" />
                <span>Volcanoes</span>
              </button>

              <button
                type="button"
                onClick={() => setShowShakeRadius(!showShakeRadius)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  showShakeRadius
                    ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                    : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-rose-600" />
                <span>Shake Radii</span>
              </button>

              <button
                type="button"
                onClick={handleResetGlobalView}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Fit Global Extent"
              >
                <Globe2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Reset View</span>
              </button>
            </div>
          </div>

          {/* Framed Map Viewport - Prominent, Contained, DOES NOT cover entire background */}
          <div className="relative w-full h-[540px] md:h-[620px] bg-slate-100">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Quick Loading Indicator */}
            {isLoading && (
              <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2 text-xs text-slate-700 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Syncing USGS seismic stream...</span>
              </div>
            )}
          </div>

          {/* Map Card Footer Bar: Magnitude Scale & Fault Guide */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            {/* Magnitude Scale */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono font-bold">
              <span className="text-slate-500 font-normal">Richter Scale:</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> &lt;M3.0
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> M3.0–4.5
              </span>
              <span className="flex items-center gap-1 text-orange-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" /> M4.5–6.0
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" /> M6.0–7.5
              </span>
              <span className="flex items-center gap-1 text-purple-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9333EA]" /> M7.5+ Mega
              </span>
            </div>

            {/* Tectonic Plates Legend */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#DC2626] border-b border-dashed" /> Subduction
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#D97706] border-b border-dashed" /> Transform
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#059669] border-b border-dashed" /> Spreading
              </span>
              <span className="hidden md:inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                <span>🖱️ Double-click to zoom out</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Inspector Dossier + Interactive Seismic Ledger (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Epicenter Deep Dossier (Appears when marker or row clicked) */}
          {selectedQuake ? (
            <div className="bg-white rounded-2xl border border-amber-300 shadow-sm p-4 space-y-3.5">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Selected Epicenter</span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                    {selectedQuake.place}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectQuake(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
                  title="Deselect"
                >
                  ✕
                </button>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Magnitude</div>
                  <div className="text-xl font-bold text-amber-700">
                    M {selectedQuake.magnitude.toFixed(1)}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">{selectedQuake.magType.toUpperCase()}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Hypocenter</div>
                  <div className="text-xl font-bold text-sky-700">
                    {selectedQuake.depth.toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">km</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Energy Yield</div>
                  <div className="text-sm font-bold text-slate-900">
                    {(selectedQuake.energyJoules / 1e12).toFixed(2)}{' '}
                    <span className="text-[10px] text-slate-500 font-normal">TJ</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    ~{selectedQuake.tntEquivalentTons.toFixed(0)} tons TNT
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Mercalli Shaking</div>
                  <div className="text-sm font-bold text-amber-700">
                    MMI {selectedQuake.mmi ?? 'N/A'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {selectedQuake.felt ? `${selectedQuake.felt} felt reports` : 'Seismograph only'}
                  </div>
                </div>
              </div>

              {/* Coordinates & Tsunami Warning */}
              <div className="space-y-1 text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span>Coordinates:</span>
                  <span className="text-slate-900 font-semibold">
                    {selectedQuake.latitude.toFixed(4)}°, {selectedQuake.longitude.toFixed(4)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time (UTC):</span>
                  <span className="text-slate-900">{selectedQuake.formattedTime}</span>
                </div>
                {selectedQuake.tsunami === 1 && (
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold pt-1 border-t border-slate-200">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Oceanic Tsunami Alert Triggered</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-0.5">
                {onSendToPredictor && (
                  <button
                    type="button"
                    onClick={() => onSendToPredictor(selectedQuake)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Simulate Aftershock Hazard & PGA Shaking</span>
                  </button>
                )}

                <a
                  href={selectedQuake.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-300 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Official USGS Event Dossier</span>
                </a>
              </div>
            </div>
          ) : null}

          {/* Interactive Seismic Ledger & Filter Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden text-slate-800">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Seismic Event Ledger</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 tabular-nums bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {filteredQuakes.length} quakes
              </span>
            </div>

            {/* Search & Sliders */}
            <div className="p-3.5 border-b border-slate-200 space-y-3 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search location, fault or country..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              {/* Min Magnitude Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-600 mb-1">
                  <span>Minimum Magnitude:</span>
                  <span className="text-amber-700 font-bold tabular-nums">M {filters.minMagnitude.toFixed(1)}+</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="8.5"
                  step="0.1"
                  value={filters.minMagnitude}
                  onChange={(e) => setFilters((prev) => ({ ...prev, minMagnitude: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              {/* Max Depth Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-600 mb-1">
                  <span>Max Hypocenter Depth:</span>
                  <span className="text-sky-700 font-bold tabular-nums">{filters.maxDepth} km</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="700"
                  step="10"
                  value={filters.maxDepth}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxDepth: parseInt(e.target.value, 10) }))}
                  className="w-full accent-sky-500 h-1.5 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              {/* Tsunami Only Filter Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={filters.tsunamiOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, tsunamiOnly: e.target.checked }))}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 bg-white cursor-pointer"
                />
                <span className="text-rose-700 font-semibold">Tsunami Threat Alerts Only</span>
              </label>
            </div>

            {/* Scrollable List of Earthquakes */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Loading global earthquakes...</span>
                </div>
              ) : filteredQuakes.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">No earthquakes match these filter criteria.</div>
              ) : (
                filteredQuakes.slice(0, 80).map((eq) => {
                  const isSelected = selectedQuake?.id === eq.id;
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => onSelectQuake(eq)}
                      className={`w-full text-left p-3 transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/80 border-l-4 border-amber-500'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{eq.place}</div>
                        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                          <span>{eq.formattedTime.substring(0, 16)}</span>
                          <span>·</span>
                          <span className="text-sky-700 font-semibold">{eq.depth.toFixed(1)} km</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono font-bold shadow-2xs ${
                            eq.magnitude >= 7.5
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : eq.magnitude >= 6.0
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : eq.magnitude >= 4.5
                              ? 'bg-orange-100 text-orange-800 border border-orange-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          M {eq.magnitude.toFixed(1)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
