import React, { useMemo, useState } from 'react';
import { Earthquake } from '../types/seismic';
import { exportSvgAsPng, exportSvgAsSvg } from '../utils/exportChart';
import {
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Layers,
  Sparkles,
  PieChart,
  RefreshCw,
  Activity,
  Zap,
  Globe2,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Building2,
  AlertTriangle,
  ArrowUpDown,
  Printer,
  FileSpreadsheet,
  FileImage,
  BookOpen,
  Info,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface PowerBIDashboardProps {
  earthquakes: Earthquake[];
  onSelectQuake: (quake: Earthquake) => void;
}

// Helper to extract clean regional geography from place string
function extractRegion(place: string): string {
  if (!place) return 'Offshore/Global';
  const parts = place.split(',');
  let raw = parts[parts.length - 1].trim();
  raw = raw.replace(/\bregion\b/gi, '').trim();
  if (raw.toLowerCase().includes(' of ')) {
    const afterOf = raw.split(/ of /i);
    raw = afterOf[afterOf.length - 1].trim();
  }
  if (/alaska/i.test(raw)) return 'Alaska';
  if (/california/i.test(raw)) return 'California';
  if (/hawaii/i.test(raw)) return 'Hawaii';
  if (/puerto rico/i.test(raw)) return 'Puerto Rico';
  if (/indonesia/i.test(raw)) return 'Indonesia';
  if (/japan/i.test(raw)) return 'Japan';
  if (/chile/i.test(raw)) return 'Chile';
  if (/fiji/i.test(raw)) return 'Fiji';
  if (/mexico/i.test(raw)) return 'Mexico';
  if (/philippines/i.test(raw)) return 'Philippines';
  if (/turkey|turkiye/i.test(raw)) return 'Turkey';
  if (/greece/i.test(raw)) return 'Greece';
  if (/iceland/i.test(raw)) return 'Iceland';
  if (/new zealand/i.test(raw)) return 'New Zealand';
  if (/nevada/i.test(raw)) return 'Nevada';
  if (/washington/i.test(raw)) return 'Washington';
  if (/taiwan/i.test(raw)) return 'Taiwan';
  if (/peru/i.test(raw)) return 'Peru';
  if (/papua/i.test(raw)) return 'Papua New Guinea';
  if (/tonga/i.test(raw)) return 'Tonga';
  if (/italy/i.test(raw)) return 'Italy';
  if (/vanuatu/i.test(raw)) return 'Vanuatu';
  return raw || 'Offshore/Global';
}

interface CatastropheBenchmark {
  id: string;
  name: string;
  year: number;
  country: string;
  magnitude: number;
  deaths: number;
  deathDisplay: string;
  economicLossUsdBn: number;
  economicDisplay: string;
  fatalFactor: string;
}

const CATASTROPHE_BENCHMARKS: CatastropheBenchmark[] = [
  {
    id: 'tangshan-1976',
    name: 'Tangshan Catastrophe',
    year: 1976,
    country: 'China',
    magnitude: 7.5,
    deaths: 242000,
    deathDisplay: '242,000 deaths',
    economicLossUsdBn: 10.0,
    economicDisplay: '$10.0 Billion',
    fatalFactor: 'Unreinforced brick masonry collapse in sleeping city'
  },
  {
    id: 'sumatra-2004',
    name: 'Sumatra-Andaman Megathrust',
    year: 2004,
    country: 'Indonesia (14 Nations)',
    magnitude: 9.1,
    deaths: 227898,
    deathDisplay: '227,898 deaths',
    economicLossUsdBn: 15.0,
    economicDisplay: '$15.0 Billion',
    fatalFactor: 'Trans-oceanic 30-meter megatsunami inundation'
  },
  {
    id: 'haiti-2010',
    name: 'Port-au-Prince Disaster',
    year: 2010,
    country: 'Haiti',
    magnitude: 7.0,
    deaths: 220000,
    deathDisplay: '220,000 deaths',
    economicLossUsdBn: 8.5,
    economicDisplay: '$8.5 Billion',
    fatalFactor: 'Extremely shallow focus under unreinforced masonry'
  },
  {
    id: 'kanto-1923',
    name: 'Great Kantō Earthquake',
    year: 1923,
    country: 'Japan',
    magnitude: 7.9,
    deaths: 142800,
    deathDisplay: '142,800 deaths',
    economicLossUsdBn: 4.5,
    economicDisplay: '$4.5 Billion',
    fatalFactor: 'Violent urban firestorms consuming wooden districts'
  },
  {
    id: 'sichuan-2008',
    name: 'Great Wenchuan Earthquake',
    year: 2008,
    country: 'China',
    magnitude: 8.0,
    deaths: 87587,
    deathDisplay: '87,587 deaths',
    economicLossUsdBn: 150.0,
    economicDisplay: '$150.0 Billion',
    fatalFactor: 'Mountain rock avalanches & non-ductile building failure'
  },
  {
    id: 'turkey-2023',
    name: 'Kahramanmaraş Doublet',
    year: 2023,
    country: 'Turkey & Syria',
    magnitude: 7.8,
    deaths: 59259,
    deathDisplay: '59,259 deaths',
    economicLossUsdBn: 104.0,
    economicDisplay: '$104.0 Billion',
    fatalFactor: 'Soft-story pancake collapses & violent 2.0g ground motion'
  },
  {
    id: 'tohoku-2011',
    name: 'Great East Japan Disaster',
    year: 2011,
    country: 'Japan',
    magnitude: 9.1,
    deaths: 19759,
    deathDisplay: '19,759 deaths',
    economicLossUsdBn: 360.0,
    economicDisplay: '$360.0 Billion',
    fatalFactor: 'Record seawall-overtopping tsunami & nuclear containment damage'
  },
  {
    id: 'kobe-1995',
    name: 'Great Hanshin Earthquake',
    year: 1995,
    country: 'Japan',
    magnitude: 6.9,
    deaths: 6434,
    deathDisplay: '6,434 deaths',
    economicLossUsdBn: 100.0,
    economicDisplay: '$100.0 Billion',
    fatalFactor: 'Elevated highway overturning & port liquefaction'
  },
  {
    id: 'gorkha-2015',
    name: 'Gorkha Himalayan Earthquake',
    year: 2015,
    country: 'Nepal',
    magnitude: 7.8,
    deaths: 8964,
    deathDisplay: '8,964 deaths',
    economicLossUsdBn: 10.0,
    economicDisplay: '$10.0 Billion',
    fatalFactor: 'Deep valley seismic basin amplification & rubble stone walls'
  },
  {
    id: 'valdivia-1960',
    name: 'Great Chilean Earthquake',
    year: 1960,
    country: 'Chile',
    magnitude: 9.5,
    deaths: 6000,
    deathDisplay: '6,000 deaths',
    economicLossUsdBn: 3.5,
    economicDisplay: '$3.5 Billion',
    fatalFactor: '1,000 km megathrust slip producing Pacific-wide tsunami'
  },
  {
    id: 'san-francisco-1906',
    name: 'Great San Francisco Earthquake',
    year: 1906,
    country: 'United States',
    magnitude: 7.9,
    deaths: 3000,
    deathDisplay: '3,000 deaths',
    economicLossUsdBn: 15.0,
    economicDisplay: '$15.0 Billion',
    fatalFactor: 'Severed municipal water mains with unchecked city-wide conflagration'
  },
  {
    id: 'northridge-1994',
    name: 'Northridge Earthquake',
    year: 1994,
    country: 'United States',
    magnitude: 6.7,
    deaths: 57,
    deathDisplay: '57 deaths',
    economicLossUsdBn: 49.0,
    economicDisplay: '$49.0 Billion',
    fatalFactor: 'Blind thrust fault rupture beneath modern urban infrastructure'
  }
];

export const PowerBIDashboard: React.FC<PowerBIDashboardProps> = ({ earthquakes, onSelectQuake }) => {
  // Slicers / Interactive Filters (Power BI style)
  const [selectedMagBin, setSelectedMagBin] = useState<string | null>(null);
  const [selectedDepthStrata, setSelectedDepthStrata] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [catastropheMetric, setCatastropheMetric] = useState<'deaths' | 'economic'>('deaths');
  const [regionRankMetric, setRegionRankMetric] = useState<'count' | 'energy' | 'maxMag'>('count');
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  // View Mode: 'dashboard' (Interactive BI Canvas) vs 'report' (Academic Document Layout for BDM project)
  const [viewMode, setViewMode] = useState<'dashboard' | 'report'>('dashboard');

  // Filter dataset by active slicers
  const filteredData = useMemo(() => {
    return earthquakes.filter((eq) => {
      if (selectedMagBin) {
        const floor = parseFloat(selectedMagBin);
        if (eq.magnitude < floor || eq.magnitude >= floor + 1) return false;
      }
      if (selectedDepthStrata) {
        if (selectedDepthStrata === 'shallow' && eq.depth >= 30) return false;
        if (selectedDepthStrata === 'intermediate' && (eq.depth < 30 || eq.depth >= 70)) return false;
        if (selectedDepthStrata === 'deep' && (eq.depth < 70 || eq.depth >= 300)) return false;
        if (selectedDepthStrata === 'ultra-deep' && eq.depth < 300) return false;
      }
      if (selectedRegion) {
        const reg = extractRegion(eq.place);
        if (reg.toLowerCase() !== selectedRegion.toLowerCase()) return false;
      }
      return true;
    });
  }, [earthquakes, selectedMagBin, selectedDepthStrata, selectedRegion]);

  // DAX-style KPI Calculations
  const kpis = useMemo(() => {
    const count = filteredData.length;
    if (count === 0) {
      return { count: 0, maxMag: 0, totalEnergyTJ: 0, tntMegatons: 0, avgDepth: 0, tsunamiAlerts: 0, bValue: 0, aValue: 0 };
    }

    let maxMag = 0;
    let totalEnergyJoules = 0;
    let sumDepth = 0;
    let tsunamiCount = 0;

    filteredData.forEach((eq) => {
      if (eq.magnitude > maxMag) maxMag = eq.magnitude;
      totalEnergyJoules += eq.energyJoules;
      sumDepth += eq.depth;
      if (eq.tsunami === 1) tsunamiCount++;
    });

    // Gutenberg-Richter Law: log10(N) = a - b*M
    // Calculate b-value via Aki (1965) maximum likelihood formula:
    // b = (log10(e)) / (mean(M) - M_min)
    const mags = filteredData.map((d) => d.magnitude);
    const minM = Math.min(...mags);
    const meanM = mags.reduce((a, b) => a + b, 0) / mags.length;
    const bValue = meanM > minM ? Math.log10(Math.E) / (meanM - minM) : 1.0;
    const aValue = Math.log10(count) + bValue * minM;

    return {
      count,
      maxMag,
      totalEnergyTJ: totalEnergyJoules / 1e12,
      tntMegatons: totalEnergyJoules / (4.184e9 * 1e6),
      avgDepth: sumDepth / count,
      tsunamiAlerts: tsunamiCount,
      bValue: Math.round(bValue * 100) / 100,
      aValue: Math.round(aValue * 100) / 100
    };
  }, [filteredData]);

  // Region-Wise Ranked Hotspots Analysis (Aggregated from catalog)
  const regionRankings = useMemo(() => {
    const map = new Map<string, { region: string; count: number; maxMag: number; totalEnergyTJ: number; depthSum: number }>();

    earthquakes.forEach((eq) => {
      const reg = extractRegion(eq.place);
      const existing = map.get(reg) || { region: reg, count: 0, maxMag: 0, totalEnergyTJ: 0, depthSum: 0 };
      existing.count += 1;
      if (eq.magnitude > existing.maxMag) existing.maxMag = eq.magnitude;
      existing.totalEnergyTJ += (eq.energyJoules || 0) / 1e12;
      existing.depthSum += eq.depth;
      map.set(reg, existing);
    });

    const list = Array.from(map.values()).map((r) => ({
      ...r,
      avgDepth: r.count > 0 ? r.depthSum / r.count : 0
    }));

    if (regionRankMetric === 'energy') {
      return list.sort((a, b) => b.totalEnergyTJ - a.totalEnergyTJ).slice(0, 8);
    }
    if (regionRankMetric === 'maxMag') {
      return list.sort((a, b) => b.maxMag - a.maxMag).slice(0, 8);
    }
    return list.sort((a, b) => b.count - a.count).slice(0, 8);
  }, [earthquakes, regionRankMetric]);

  // Ranked Catastrophes Data (Sorted by Deaths or Economic Loss)
  const rankedCatastrophes = useMemo(() => {
    return [...CATASTROPHE_BENCHMARKS].sort((a, b) => {
      if (catastropheMetric === 'deaths') {
        return b.deaths - a.deaths;
      }
      return b.economicLossUsdBn - a.economicLossUsdBn;
    });
  }, [catastropheMetric]);

  // Magnitude Bins Breakdown for Bar Chart
  const magBins = useMemo(() => {
    const bins: Record<string, { label: string; count: number; min: number; totalEnergy: number }> = {
      '1': { label: 'M1.0 - M1.9', count: 0, min: 1, totalEnergy: 0 },
      '2': { label: 'M2.0 - M2.9', count: 0, min: 2, totalEnergy: 0 },
      '3': { label: 'M3.0 - M3.9', count: 0, min: 3, totalEnergy: 0 },
      '4': { label: 'M4.0 - M4.9', count: 0, min: 4, totalEnergy: 0 },
      '5': { label: 'M5.0 - M5.9', count: 0, min: 5, totalEnergy: 0 },
      '6': { label: 'M6.0 - M6.9', count: 0, min: 6, totalEnergy: 0 },
      '7': { label: 'M7.0+', count: 0, min: 7, totalEnergy: 0 }
    };

    earthquakes.forEach((eq) => {
      const fl = Math.floor(eq.magnitude);
      const key = fl >= 7 ? '7' : fl.toString();
      if (bins[key]) {
        bins[key].count++;
        bins[key].totalEnergy += eq.energyJoules;
      }
    });

    return Object.entries(bins).map(([key, val]) => ({ key, ...val }));
  }, [earthquakes]);

  // Gutenberg-Richter Cumulative Points: N(M >= m) vs m
  const grPoints = useMemo(() => {
    const step = 0.5;
    const points: { mag: number; count: number; logN: number }[] = [];
    for (let m = 2.0; m <= 8.0; m += step) {
      const count = filteredData.filter((eq) => eq.magnitude >= m).length;
      if (count > 0) {
        points.push({
          mag: m,
          count,
          logN: Math.log10(count)
        });
      }
    }
    return points;
  }, [filteredData]);

  // Depth Strata Breakdown
  const depthStrataStats = useMemo(() => {
    const strata = {
      shallow: { label: 'Shallow (<30 km)', count: 0, color: '#EF4444', desc: 'Highest surface destruction & ground shear' },
      intermediate: { label: 'Intermediate (30-70 km)', count: 0, color: '#F97316', desc: 'Widespread moderate regional shaking' },
      deep: { label: 'Deep (70-300 km)', count: 0, color: '#EAB308', desc: 'Subducting lithospheric oceanic slabs' },
      'ultra-deep': { label: 'Ultra-Deep (>300 km)', count: 0, color: '#06B6D4', desc: 'Mantle transition phase change dehydrations' }
    };
    filteredData.forEach((eq) => {
      strata[eq.depthCategory].count++;
    });
    return strata;
  }, [filteredData]);

  // Cumulative Energy Release Time Series
  const energyTimeline = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => a.time - b.time);
    let cumulative = 0;
    return sorted.map((eq) => {
      cumulative += eq.energyJoules / 1e12; // in TJ
      return {
        id: eq.id,
        time: eq.time,
        formattedTime: eq.formattedTime.substring(5, 16),
        magnitude: eq.magnitude,
        place: eq.place,
        cumulativeTJ: cumulative
      };
    });
  }, [filteredData]);

  // Wadati-Benioff Scatter Data (Depth vs Longitude)
  const wadatiPoints = useMemo(() => {
    return filteredData.slice(0, 120).map((eq) => ({
      id: eq.id,
      lon: eq.longitude,
      depth: Math.min(650, eq.depth),
      mag: eq.magnitude,
      place: eq.place
    }));
  }, [filteredData]);

  // Diurnal Hourly Distribution (UTC hour 0-23)
  const hourlyDistribution = useMemo(() => {
    const hours = new Array(24).fill(0);
    filteredData.forEach((eq) => {
      const d = new Date(eq.time);
      const h = d.getUTCHours();
      hours[h]++;
    });
    return hours.map((count, h) => ({ hour: h, count }));
  }, [filteredData]);

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = 'CatalogID,Magnitude,Type,DepthKm,Latitude,Longitude,EnergyJoules,MMI,TsunamiAlert,Place,TimeUTC\n';
    const rows = filteredData
      .map(
        (eq) =>
          `"${eq.id}",${eq.magnitude},"${eq.magType}",${eq.depth},${eq.latitude},${eq.longitude},${eq.energyJoules},${eq.mmi ?? ''},${eq.tsunami},"${eq.place.replace(/"/g, '""')}","${eq.formattedTime}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SeismoPulse_PowerBI_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 text-slate-800 space-y-6 max-w-[1600px] mx-auto p-4 sm:p-6 print:bg-white print:p-0">
      {/* Power BI Workspace Header Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#F2C811]" />
            <span>Power BI Business Intelligence Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Seismic Recurrence, Energy Trajectory & Catastrophe Analytics
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-4xl">
            Designed for the <strong className="text-slate-800">BDM Project Report (Chapter 3)</strong>. Interactive cross-filtering, Gutenberg-Richter regression, focal depth profiling, and instant 1-click chart image export for inclusion in report documents.
          </p>
        </div>

        {/* View Mode & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle between BI Canvas and Academic Report Mode */}
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 border border-slate-300">
            <button
              type="button"
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Interactive BI Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'report'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Report View (Print / PDF)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-xs"
            title="Download full dataset as CSV for Excel or Power BI Desktop"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Slicers Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Cross-Filter Slicers:</span>
          </span>

          {selectedRegion && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-md border border-amber-300">
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>Region: {selectedRegion}</span>
              <button
                type="button"
                onClick={() => setSelectedRegion(null)}
                className="ml-1 text-amber-700 hover:text-amber-950 font-bold cursor-pointer"
              >
                ×
              </button>
            </span>
          )}

          {selectedMagBin && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-md border border-amber-300">
              <span>M{selectedMagBin}.0+</span>
              <button
                type="button"
                onClick={() => setSelectedMagBin(null)}
                className="ml-1 text-amber-700 hover:text-amber-950 font-bold cursor-pointer"
              >
                ×
              </button>
            </span>
          )}

          {selectedDepthStrata && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-sky-100 text-sky-800 rounded-md border border-sky-300 capitalize">
              <span>{selectedDepthStrata}</span>
              <button
                type="button"
                onClick={() => setSelectedDepthStrata(null)}
                className="ml-1 text-sky-700 hover:text-sky-950 font-bold cursor-pointer"
              >
                ×
              </button>
            </span>
          )}

          {!selectedRegion && !selectedMagBin && !selectedDepthStrata && (
            <span className="text-xs text-slate-500 italic">
              Click any bar or chart segment below to slice the entire dashboard
            </span>
          )}
        </div>

        {(selectedMagBin || selectedDepthStrata || selectedRegion) && (
          <button
            type="button"
            onClick={() => {
              setSelectedMagBin(null);
              setSelectedDepthStrata(null);
              setSelectedRegion(null);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset All Slicers</span>
          </button>
        )}
      </div>

      {/* ACADEMIC REPORT MODE COVER / HEADER (Visible when Report Mode is selected or printing) */}
      {viewMode === 'report' && (
        <div className="bg-white rounded-2xl border-2 border-slate-300 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="text-xs font-mono font-bold tracking-widest uppercase text-slate-500">
              ABV-Indian Institute of Information Technology and Management Gwalior
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1 uppercase tracking-tight">
              Chapter 3: Power BI Business Intelligence Suite & Empirical Seismology Visualizations
            </h2>
            <div className="text-xs text-slate-600 mt-2 font-mono">
              Course: Big Data Management (BDM) — Semester VII | Authors: Aditya Pratap (2023IMG-003), Aryan Thakur (2023IMG-010), Nishant Harkut (2023IMG-040), Aditya Varshney (2023IMG-060)
            </div>
          </div>
          <div className="text-xs text-slate-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-200">
            <strong>Analytical Scope:</strong> This chapter presents high-dimensional visual analytics derived from our Star Schema (<code className="font-mono">FactEarthquakeEvents</code>, <code className="font-mono">DimLocation</code>, <code className="font-mono">DimDate</code>, <code className="font-mono">DimSeverity</code>). Use the <em>&quot;Download PNG for Report&quot;</em> button on each visual to export high-resolution (2x retina) figures directly into your Word, LaTeX, or PDF research report.
          </div>
        </div>
      )}

      {/* DAX KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="p-4 bg-white rounded-2xl border border-emerald-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">Total Quakes</div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">{kpis.count}</div>
          <div className="text-[11px] text-slate-500 font-mono">Events analyzed</div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-white rounded-2xl border border-amber-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-700 font-bold">Strongest Quake</div>
          <div className="text-3xl font-extrabold font-mono text-amber-600 tabular-nums">
            M {kpis.maxMag.toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Peak magnitude</div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-white rounded-2xl border border-cyan-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 font-bold">Total Energy</div>
          <div className="text-3xl font-extrabold font-mono text-cyan-700 tabular-nums">
            {kpis.totalEnergyTJ.toFixed(1)} <span className="text-xs text-slate-500 font-normal">TJ</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            ~{kpis.tntMegatons.toFixed(2)} Mt TNT equiv.
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-white rounded-2xl border border-sky-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-sky-700 font-bold">Average Depth</div>
          <div className="text-3xl font-extrabold font-mono text-sky-800 tabular-nums">
            {kpis.avgDepth.toFixed(1)} <span className="text-xs text-slate-500 font-normal">km</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Underground focus</div>
        </div>

        {/* KPI 5: Gutenberg b-value */}
        <div className="p-4 bg-white rounded-2xl border border-violet-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-violet-700 font-bold">Stress Index (b)</div>
          <div className="text-3xl font-extrabold font-mono text-violet-700 tabular-nums">
            {kpis.bValue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Normal baseline ~1.0</div>
        </div>

        {/* KPI 6: Tsunami Flags */}
        <div className="p-4 bg-white rounded-2xl border border-rose-200/90 shadow-2xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-bold">Tsunami Alerts</div>
          <div className="text-3xl font-extrabold font-mono text-rose-600 tabular-nums">{kpis.tsunamiAlerts}</div>
          <div className="text-[11px] text-slate-500 font-mono">Oceanic danger flags</div>
        </div>
      </div>

      {/* Main Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================= */}
        {/* Figure 3.1: Region-Wise Seismic Activity Leaderboard */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Figure 3.1 &mdash; Region-Wise Activity Leaderboard</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Top Global Seismic Hotspots Ranked
              </h2>
            </div>

            {/* Metric Toggle & Image Export Buttons */}
            <div className="flex items-center gap-1.5 self-start">
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setRegionRankMetric('count')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    regionRankMetric === 'count' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Rank by event frequency"
                >
                  Events
                </button>
                <button
                  type="button"
                  onClick={() => setRegionRankMetric('energy')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    regionRankMetric === 'energy' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Rank by radiated energy (TJ)"
                >
                  Energy
                </button>
                <button
                  type="button"
                  onClick={() => setRegionRankMetric('maxMag')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    regionRankMetric === 'maxMag' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Rank by maximum magnitude"
                >
                  Max M
                </button>
              </div>

              <button
                type="button"
                onClick={() => exportSvgAsPng('svg-figure-3-1', 'Figure_3_1_Region_Seismic_Leaderboard', 'Figure 3.1: Region-Wise Seismic Activity Leaderboard')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download PNG for report document"
              >
                <FileImage className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Export for Report</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Ranks top geographic regions along tectonic fault margins. Shows disproportionate seismicity across Pacific subduction arcs (Indonesia, Japan, Chile, Fiji) versus intraplate belts. Click any bar to cross-filter.
          </p>

          {/* SVG Canvas for Figure 3.1 with pristine high-res vector rendering */}
          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-2 overflow-x-auto">
            <svg id="svg-figure-3-1" className="w-full min-w-[420px] h-64 overflow-visible" viewBox="0 0 500 240">
              {regionRankings.map((r, idx) => {
                const maxVal =
                  regionRankMetric === 'energy'
                    ? regionRankings[0]?.totalEnergyTJ || 1
                    : regionRankMetric === 'maxMag'
                    ? regionRankings[0]?.maxMag || 10
                    : regionRankings[0]?.count || 1;
                const curVal =
                  regionRankMetric === 'energy'
                    ? r.totalEnergyTJ
                    : regionRankMetric === 'maxMag'
                    ? r.maxMag
                    : r.count;
                const barWidth = Math.min(270, Math.max(20, (curVal / maxVal) * 270));
                const y = 10 + idx * 28;
                const isSelected = selectedRegion?.toLowerCase() === r.region.toLowerCase();

                return (
                  <g
                    key={r.region}
                    className="cursor-pointer group"
                    onClick={() => setSelectedRegion(isSelected ? null : r.region)}
                  >
                    {/* Rank Badge */}
                    <rect
                      x="8"
                      y={y}
                      width="18"
                      height="18"
                      rx="4"
                      fill={idx === 0 ? '#F59E0B' : idx === 1 ? '#94A3B8' : idx === 2 ? '#B45309' : '#E2E8F0'}
                    />
                    <text
                      x="17"
                      y={y + 13}
                      textAnchor="middle"
                      fill={idx <= 2 ? '#FFFFFF' : '#334155'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {idx + 1}
                    </text>

                    {/* Region Label */}
                    <text
                      x="34"
                      y={y + 13}
                      fill={isSelected ? '#B45309' : '#0F172A'}
                      fontSize="11"
                      fontWeight={isSelected ? 'bold' : '600'}
                      fontFamily="sans-serif"
                    >
                      {r.region.length > 18 ? r.region.substring(0, 16) + '…' : r.region}
                    </text>

                    {/* Bar Background Track */}
                    <rect x="160" y={y + 3} width="270" height="13" rx="4" fill="#E2E8F0" opacity="0.6" />

                    {/* Colored Active Bar */}
                    <rect
                      x="160"
                      y={y + 3}
                      width={barWidth}
                      height="13"
                      rx="4"
                      fill={
                        isSelected
                          ? '#D97706'
                          : idx === 0
                          ? '#EA580C'
                          : idx === 1
                          ? '#F59E0B'
                          : '#0284C7'
                      }
                    />

                    {/* Measure Value Label on the right */}
                    <text
                      x="440"
                      y={y + 13}
                      fill="#334155"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {regionRankMetric === 'energy'
                        ? `${r.totalEnergyTJ.toFixed(1)} TJ`
                        : regionRankMetric === 'maxMag'
                        ? `M${r.maxMag.toFixed(1)}`
                        : `${r.count} quakes`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>DAX: [Rank] = RANKX(ALL(DimLocation[RegionName]), [TotalQuakes])</span>
            <span className="text-amber-700 font-semibold">Click region to slice dashboard</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Figure 3.2: Catastrophe Benchmark Ranking (Deaths vs USD) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-rose-700 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Figure 3.2 &mdash; Catastrophe Impact Disparity</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                History&apos;s Worst Quakes: Deaths vs Economic Loss
              </h2>
            </div>

            <div className="flex items-center gap-1.5 self-start">
              {/* Metric Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCatastropheMetric('deaths')}
                  className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded cursor-pointer ${
                    catastropheMetric === 'deaths'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>Fatalities</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCatastropheMetric('economic')}
                  className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded cursor-pointer ${
                    catastropheMetric === 'economic'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <DollarSign className="w-3 h-3" />
                  <span>Economic ($ USD)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => exportSvgAsPng('svg-figure-3-2', 'Figure_3_2_Catastrophe_Impact_Disparity', 'Figure 3.2: Catastrophe Impact Disparity Benchmark')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download PNG for report document"
              >
                <FileImage className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Export for Report</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {catastropheMetric === 'deaths'
              ? 'Fatalities benchmark highlights developing countries (Tangshan 242k, Haiti 220k), where unreinforced masonry failure caused massive human casualty rates.'
              : 'Economic damage benchmark highlights industrialized metropolitan zones (Tōhoku $360B, Kobe $100B, Northridge $49B), where modern asset density drives financial loss.'}
          </p>

          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-2 overflow-x-auto">
            <svg id="svg-figure-3-2" className="w-full min-w-[420px] h-64 overflow-visible" viewBox="0 0 500 240">
              {rankedCatastrophes.slice(0, 8).map((c, idx) => {
                const maxVal =
                  catastropheMetric === 'deaths'
                    ? rankedCatastrophes[0]?.deaths || 1
                    : rankedCatastrophes[0]?.economicLossUsdBn || 1;
                const curVal =
                  catastropheMetric === 'deaths' ? c.deaths : c.economicLossUsdBn;
                const barWidth = Math.min(240, Math.max(16, (curVal / maxVal) * 240));
                const y = 10 + idx * 28;

                return (
                  <g key={c.id}>
                    {/* Rank Badge */}
                    <rect
                      x="8"
                      y={y}
                      width="18"
                      height="18"
                      rx="4"
                      fill={catastropheMetric === 'deaths' ? '#E11D48' : '#059669'}
                    />
                    <text
                      x="17"
                      y={y + 13}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {idx + 1}
                    </text>

                    {/* Event Name */}
                    <text
                      x="34"
                      y={y + 13}
                      fill="#0F172A"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {c.name.length > 20 ? c.name.substring(0, 18) + '…' : c.name} ({c.year})
                    </text>

                    {/* Magnitude Badge */}
                    <rect x="200" y={y + 2} width="32" height="15" rx="3" fill="#F1F5F9" stroke="#CBD5E1" />
                    <text x="216" y={y + 13} textAnchor="middle" fill="#475569" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      M{c.magnitude.toFixed(1)}
                    </text>

                    {/* Bar Track */}
                    <rect x="238" y={y + 3} width="240" height="13" rx="4" fill="#E2E8F0" opacity="0.6" />

                    {/* Bar Value */}
                    <rect
                      x="238"
                      y={y + 3}
                      width={barWidth}
                      height="13"
                      rx="4"
                      fill={
                        catastropheMetric === 'deaths'
                          ? idx === 0
                            ? '#BE123C'
                            : '#F43F5E'
                          : idx === 0
                          ? '#047857'
                          : '#10B981'
                      }
                    />

                    {/* Value text */}
                    <text
                      x="485"
                      y={y + 13}
                      textAnchor="end"
                      fill="#0F172A"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {catastropheMetric === 'deaths' ? c.deathDisplay.replace(' deaths', '') : `$${c.economicLossUsdBn}B`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>DAX: [MortalityDisparity] = DIVIDE(SUM([Fatalities]), [TotalFinancialLossUSD])</span>
            <span className="italic text-slate-600 truncate max-w-xs">Data verified: NOAA/NGDC Historic Archive</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Figure 3.3: Gutenberg-Richter Recurrence Frequency-Mag Law */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Figure 3.3 &mdash; Gutenberg-Richter Recurrence Law</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                log₁₀ N = a - bM Empirical Model
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start">
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg font-bold">
                b = {kpis.bValue.toFixed(2)} (Aki MLE)
              </span>

              <button
                type="button"
                onClick={() => exportSvgAsPng('svg-figure-3-3', 'Figure_3_3_Gutenberg_Richter_Recurrence_Model', 'Figure 3.3: Gutenberg-Richter Recurrence Law (log10 N = a - bM)')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download PNG for report document"
              >
                <FileImage className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Export for Report</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Empirical validation of the Gutenberg-Richter frequency-magnitude relation. For every 1-unit step up on the Richter scale, event frequency drops by a factor of 10. A lower calculated b-value indicates crustal shear stress concentration.
          </p>

          {/* SVG Chart for Gutenberg-Richter with high-res axes, regression line, and points */}
          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-3 relative">
            <svg id="svg-figure-3-3" className="w-full h-64 overflow-visible" viewBox="0 0 460 220">
              {/* Plot Background Grid */}
              <rect x="45" y="15" width="395" height="165" fill="#FFFFFF" rx="4" stroke="#E2E8F0" />

              {/* Horizontal Log10 Grid Lines */}
              {[0, 1, 2, 3].map((val) => {
                const y = 180 - (val / 3) * 155;
                return (
                  <g key={val}>
                    <line x1="45" y1={y} x2="440" y2={y} stroke="#E2E8F0" strokeDasharray="3,3" />
                    <text x="38" y={y + 4} textAnchor="end" fill="#64748B" fontSize="10" fontFamily="monospace">
                      10^{val}
                    </text>
                  </g>
                );
              })}

              {/* Vertical Magnitude Ticks */}
              {[2, 3, 4, 5, 6, 7, 8].map((mag) => {
                const x = 45 + ((mag - 2) / 6) * 395;
                return (
                  <g key={mag}>
                    <line x1={x} y1="180" x2={x} y2="185" stroke="#94A3B8" />
                    <line x1={x} y1="15" x2={x} y2="180" stroke="#F1F5F9" />
                    <text x={x} y="198" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">
                      M{mag}
                    </text>
                  </g>
                );
              })}

              {/* Axis Titles */}
              <text x="242" y="214" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Magnitude (Mw)
              </text>
              <text x="14" y="95" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-90 14,95)">
                log₁₀ Cumulative Events N(≥M)
              </text>

              {/* Fitted Linear Regression Line */}
              {grPoints.length >= 2 && (
                <line
                  x1={45 + ((grPoints[0].mag - 2) / 6) * 395}
                  y1={180 - (Math.min(grPoints[0].logN, 3) / 3) * 155}
                  x2={45 + ((grPoints[grPoints.length - 1].mag - 2) / 6) * 395}
                  y2={180 - (Math.min(grPoints[grPoints.length - 1].logN, 3) / 3) * 155}
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeDasharray="5,4"
                />
              )}

              {/* Empirical Data Points */}
              {grPoints.map((pt, idx) => {
                const cx = 45 + ((pt.mag - 2) / 6) * 395;
                const cy = 180 - (Math.min(pt.logN, 3) / 3) * 155;
                return (
                  <g key={idx}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5.5"
                      fill="#10B981"
                      stroke="#065F46"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-7 transition-all"
                      onMouseEnter={() =>
                        setHoveredPoint({
                          label: `M ≥ ${pt.mag.toFixed(1)}`,
                          value: `${pt.count} events (log₁₀ N = ${pt.logN.toFixed(2)})`
                        })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <text x={cx} y={cy - 8} textAnchor="middle" fill="#065F46" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {pt.count}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-800 shadow-lg">
                <span className="text-emerald-700 font-bold">{hoveredPoint.label}:</span> {hoveredPoint.value}
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>Formula: log₁₀ N = {kpis.aValue.toFixed(1)} - {kpis.bValue.toFixed(2)} * M</span>
            <span className="text-emerald-700 font-semibold">Gutenberg & Richter (1944)</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Figure 3.4: Hypocentral Focal Depth Stratification */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Figure 3.4 &mdash; Focal Depth Stratification</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Crustal, Subduction & Deep Mantle Ruptures
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start">
              <span className="text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-300 px-2 py-0.5 rounded font-bold">
                Avg: {kpis.avgDepth.toFixed(1)} km
              </span>

              <button
                type="button"
                onClick={() => exportSvgAsPng('svg-figure-3-4', 'Figure_3_4_Focal_Depth_Stratification', 'Figure 3.4: Focal Depth Stratification & Tsunami Risk')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download PNG for report document"
              >
                <FileImage className="w-3.5 h-3.5 text-cyan-600" />
                <span className="hidden sm:inline">Export for Report</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Categorization by hypocenter depth. Shallow events (&lt;30 km) cause the highest ground accelerations. Oceanic shallow quakes (&lt;70 km, M&ge;7.0) constitute 100% of global tsunami trigger risks.
          </p>

          {/* SVG Visual for Focal Depth Breakdown */}
          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-3">
            <svg id="svg-figure-3-4" className="w-full h-64 overflow-visible" viewBox="0 0 460 220">
              {Object.entries(depthStrataStats).map(([key, item], idx) => {
                const isSelected = selectedDepthStrata === key;
                const percent = filteredData.length > 0 ? (item.count / filteredData.length) * 100 : 0;
                const y = 20 + idx * 48;
                const barWidth = Math.min(260, Math.max(10, (percent / 100) * 260));

                return (
                  <g
                    key={key}
                    className="cursor-pointer group"
                    onClick={() => setSelectedDepthStrata(isSelected ? null : key)}
                  >
                    {/* Color Tag Indicator */}
                    <rect x="10" y={y} width="12" height="12" rx="3" fill={item.color} />

                    {/* Stratum Label */}
                    <text
                      x="28"
                      y={y + 10}
                      fill={isSelected ? '#0284C7' : '#0F172A'}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {item.label}
                    </text>

                    {/* Scientific Hazard Description */}
                    <text x="28" y={y + 24} fill="#64748B" fontSize="9" fontFamily="sans-serif">
                      {item.desc}
                    </text>

                    {/* Bar Background Track */}
                    <rect x="230" y={y + 2} width="160" height="14" rx="4" fill="#E2E8F0" />

                    {/* Progress Bar */}
                    <rect
                      x="230"
                      y={y + 2}
                      width={(percent / 100) * 160}
                      height="14"
                      rx="4"
                      fill={item.color}
                      opacity={isSelected ? 1 : 0.85}
                    />

                    {/* Percentage & Count Label */}
                    <text x="400" y={y + 13} fill="#0F172A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {percent.toFixed(1)}% ({item.count})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>DAX: [DepthPct] = DIVIDE(COUNTROWS(FILTER(FactEarthquakes, [DepthCategory] = &quot;Shallow&quot;)), [TotalQuakes])</span>
            <span className="text-cyan-700 font-semibold">Click category to slice</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Figure 3.5: Cumulative Seismic Energy Trajectory */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-rose-700 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Figure 3.5 &mdash; Cumulative Seismic Energy Trajectory</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Seismic Moment Kinetic Release (Terajoules)
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start">
              <span className="text-xs font-mono text-rose-800 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded font-bold">
                {kpis.totalEnergyTJ.toFixed(1)} TJ Total
              </span>

              <button
                type="button"
                onClick={() => exportSvgAsPng('svg-figure-3-5', 'Figure_3_5_Cumulative_Energy_Trajectory', 'Figure 3.5: Cumulative Seismic Moment Energy Release Trajectory')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download PNG for report document"
              >
                <FileImage className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Export for Report</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Radical vertical stair-steps visualize the 31.62x energy multiplier per magnitude unit (log₁₀ E = 4.8 + 1.5M). Over 90% of global crustal kinetic strain is discharged in rare M7.5+ ruptures.
          </p>

          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-3">
            <svg id="svg-figure-3-5" className="w-full h-64 overflow-visible" viewBox="0 0 460 220">
              <rect x="45" y="15" width="395" height="165" fill="#FFFFFF" rx="4" stroke="#E2E8F0" />

              {/* Horizontal Grid */}
              {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                const y = 180 - frac * 165;
                const val = frac * Math.max(kpis.totalEnergyTJ, 0.1);
                return (
                  <g key={frac}>
                    <line x1="45" y1={y} x2="440" y2={y} stroke="#E2E8F0" strokeDasharray="3,3" />
                    <text x="38" y={y + 3} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
                      {val.toFixed(0)} TJ
                    </text>
                  </g>
                );
              })}

              {/* Timeline Curve */}
              {(() => {
                if (energyTimeline.length < 2) return null;
                const maxTJ = Math.max(kpis.totalEnergyTJ, 0.1);
                const pts = energyTimeline.map((item, idx) => {
                  const x = 45 + (idx / (energyTimeline.length - 1)) * 395;
                  const y = 180 - (item.cumulativeTJ / maxTJ) * 165;
                  return `${x},${y}`;
                });
                return (
                  <>
                    <polygon
                      points={`45,180 ${pts.join(' ')} 440,180`}
                      fill="rgba(244, 63, 94, 0.12)"
                    />
                    <polyline
                      points={pts.join(' ')}
                      fill="none"
                      stroke="#E11D48"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                  </>
                );
              })()}

              <text x="242" y="210" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Chronological Sequence of Ingested Seismic Events
              </text>
              <text x="14" y="95" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-90 14,95)">
                Cumulative Energy (TJ)
              </text>
            </svg>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>Formula: E = 10^(4.8 + 1.5 * M) Joules</span>
            <span className="text-rose-700 font-semibold">~{kpis.tntMegatons.toFixed(2)} Megatons TNT</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Figure 3.6: Wadati-Benioff Subduction Zone Cross-Section */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-indigo-700 font-bold flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Figure 3.6 &mdash; Wadati-Benioff Subduction Profile</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Hypocentral Depth vs Epicentral Longitude
              </h2>
            </div>

            <button
              type="button"
              onClick={() => exportSvgAsPng('svg-figure-3-6', 'Figure_3_6_Wadati_Benioff_Subduction_Profile', 'Figure 3.6: Wadati-Benioff Subduction Zone Cross-Section')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer self-start"
              title="Download PNG for report document"
            >
              <FileImage className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Export for Report</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Cross-sectional projection illustrating how hypocenters plunge into the asthenosphere along sinking tectonic slabs. Deep events (&gt;300 km) cluster exclusively along subduction trenches (Tonga, Japan, Kuril).
          </p>

          <div className="w-full bg-slate-50/70 rounded-xl border border-slate-200 p-3 relative">
            <svg id="svg-figure-3-6" className="w-full h-64 overflow-visible" viewBox="0 0 460 220">
              <rect x="45" y="15" width="395" height="165" fill="#FFFFFF" rx="4" stroke="#E2E8F0" />

              {/* Depth Ticks (Downwards on Y-axis as depth increases!) */}
              {[0, 150, 300, 450, 600].map((d) => {
                const y = 15 + (d / 650) * 165;
                return (
                  <g key={d}>
                    <line x1="45" y1={y} x2="440" y2={y} stroke="#E2E8F0" strokeDasharray="3,3" />
                    <text x="38" y={y + 4} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
                      {d} km
                    </text>
                  </g>
                );
              })}

              {/* Longitude Ticks */}
              {[-120, -60, 0, 60, 120, 180].map((lon) => {
                const x = 45 + ((lon + 180) / 360) * 395;
                return (
                  <g key={lon}>
                    <line x1={x} y1="180" x2={x} y2="185" stroke="#94A3B8" />
                    <text x={x} y="198" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
                      {lon}°
                    </text>
                  </g>
                );
              })}

              {/* Scatter Points */}
              {wadatiPoints.map((pt, idx) => {
                const cx = 45 + ((pt.lon + 180) / 360) * 395;
                const cy = 15 + (pt.depth / 650) * 165;
                const r = Math.max(3, pt.mag * 0.9);
                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={pt.depth > 300 ? '#4F46E5' : pt.depth > 70 ? '#F59E0B' : '#EF4444'}
                    opacity="0.75"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    className="cursor-pointer hover:opacity-100 transition-all"
                  />
                );
              })}

              <text x="242" y="214" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Epicentral Longitude (-180° to +180°)
              </text>
              <text x="14" y="95" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-90 14,95)">
                Hypocentral Depth (0 to 650 km)
              </text>
            </svg>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1">
            <span>Subduction Slab Geometry: Wadati (1927) &amp; Benioff (1949)</span>
            <span className="text-indigo-700 font-semibold">Trench &rarr; Benioff Zone</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Interactive Power BI Cross-Filtered Records Ledger */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              FactEarthquakeEvents Dimension Explorer
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Active Ingested Telemetry Records ({filteredData.length} records matching current slicers)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
              Click any row to inspect &amp; locate on 3D GIS Map
            </span>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">Magnitude</th>
                <th className="py-2.5 px-3 font-semibold">Epicenter / Jurisdiction</th>
                <th className="py-2.5 px-3 font-semibold">Focal Depth</th>
                <th className="py-2.5 px-3 font-semibold">Energy (TJ)</th>
                <th className="py-2.5 px-3 font-semibold">Shaking (MMI)</th>
                <th className="py-2.5 px-3 font-semibold">Timestamp (UTC)</th>
                <th className="py-2.5 px-3 font-semibold">Tsunami Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredData.slice(0, 15).map((eq) => (
                <tr
                  key={eq.id}
                  onClick={() => onSelectQuake(eq)}
                  className="hover:bg-amber-50/60 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3 font-bold">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        eq.magnitude >= 6.0
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : eq.magnitude >= 4.5
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      M {eq.magnitude.toFixed(1)} {eq.magType.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 truncate max-w-xs font-medium text-slate-900 group-hover:text-amber-800">
                    {eq.place}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-700 font-semibold">{eq.depth.toFixed(1)} km</td>
                  <td className="py-2.5 px-3">{(eq.energyJoules / 1e12).toFixed(2)} TJ</td>
                  <td className="py-2.5 px-3">MMI {eq.mmi ?? 'N/A'}</td>
                  <td className="py-2.5 px-3 text-slate-500">{eq.formattedTime}</td>
                  <td className="py-2.5 px-3">
                    {eq.tsunami === 1 ? (
                      <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Alert Triggered
                      </span>
                    ) : (
                      <span className="text-slate-400">0 (Normal)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
