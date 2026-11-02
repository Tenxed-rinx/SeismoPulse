import React, { useState } from 'react';
import { HISTORICAL_QUAKES } from '../data/historicalData';
import { HistoricalQuake } from '../types/seismic';
import {
  History,
  Activity,
  Layers,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface HistoricalArchiveProps {
  onFlyToCoordinates?: (lat: number, lng: number) => void;
}

export const HistoricalArchive: React.FC<HistoricalArchiveProps> = ({ onFlyToCoordinates }) => {
  const [selectedQuake, setSelectedQuake] = useState<HistoricalQuake>(HISTORICAL_QUAKES[0]);

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 p-6 text-slate-800 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-2">
            <History className="w-4 h-4" />
            <span>Paleoseismology & Disaster Archives</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Historical Disaster Case Studies & Structural Lessons
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Explore history’s most powerful earthquakes, analyze how fault lines ruptured, and review the building code breakthroughs that protect modern cities.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          Showing 8 Benchmark Catastrophes (1906 – Present)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Catalog Selection List (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold mb-1">
            Historical Events Catalog
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[720px] pr-1">
            {HISTORICAL_QUAKES.map((hq) => {
              const isSelected = selectedQuake.id === hq.id;
              return (
                <button
                  key={hq.id}
                  type="button"
                  onClick={() => setSelectedQuake(hq)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 font-medium">{hq.year} · {hq.country}</span>
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border ${
                        hq.magnitude >= 9.0
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      M {hq.magnitude.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">{hq.name}</h3>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    {hq.fatalities} fatalities · {hq.damageUsd}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Analytical Dossier (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          {/* Title & Metadata Header */}
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
                {selectedQuake.date} · {selectedQuake.location}
              </span>
              <span className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                Epicenter: {selectedQuake.coordinates[0]}°, {selectedQuake.coordinates[1]}°
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{selectedQuake.name}</h2>
            <div className="text-xs text-slate-600 font-mono">
              Fault Mechanism: <span className="text-slate-900 font-semibold">{selectedQuake.faultMechanism}</span>
            </div>
          </div>

          {/* KPI Strip for Selected Quake */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Moment Magnitude</div>
              <div className="text-2xl font-bold text-amber-700 tabular-nums">M {selectedQuake.magnitude}</div>
              <div className="text-[10px] text-slate-500">Hypocenter: {selectedQuake.depthKm} km</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Rupture Length</div>
              <div className="text-2xl font-bold text-cyan-700 tabular-nums">{selectedQuake.ruptureLengthKm} km</div>
              <div className="text-[10px] text-slate-500">Contiguous slip</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Human Casualties</div>
              <div className="text-lg font-bold text-rose-600 truncate">{selectedQuake.fatalities}</div>
              <div className="text-[10px] text-slate-500">Confirmed fatalities</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Economic Loss</div>
              <div className="text-lg font-bold text-slate-800 truncate">{selectedQuake.damageUsd}</div>
              <div className="text-[10px] text-slate-500">Damage estimate</div>
            </div>
          </div>

          {/* Geological Summary */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span>Geodynamic Rupture Summary</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {selectedQuake.summary}
            </p>
          </div>

          {/* Engineering & Public Policy Lessons Learned */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Civil Engineering & Mitigation Breakthroughs</span>
            </div>
            <div className="space-y-2">
              {selectedQuake.lessonsLearned.map((lesson, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0 font-mono font-bold text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{lesson}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tsunami Status Badge */}
          {selectedQuake.tsunamiGenerated && (
            <div className="p-3.5 bg-cyan-50 border border-cyan-200 rounded-lg flex items-center gap-3 text-xs text-cyan-900 shadow-xs">
              <span className="text-xl">🌊</span>
              <div>
                <strong>Trans-Oceanic Tsunami Generated:</strong> This rupture triggered major seafloor displacement, sending destructive tsunami wave trains across the oceanic basin.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
