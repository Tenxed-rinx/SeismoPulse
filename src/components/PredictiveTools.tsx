import React, { useState, useMemo } from 'react';
import { Earthquake } from '../types/seismic';
import {
  Activity,
  Zap,
  TrendingDown,
  ShieldAlert,
  Sliders,
  AlertTriangle,
  Flame,
  Info,
  Waves
} from 'lucide-react';

interface PredictiveToolsProps {
  initialQuake?: Earthquake | null;
}

export const PredictiveTools: React.FC<PredictiveToolsProps> = ({ initialQuake }) => {
  // Simulator Parameters
  const [mainshockMag, setMainshockMag] = useState<number>(initialQuake?.magnitude ?? 7.2);
  const [hypoDepthKm, setHypoDepthKm] = useState<number>(initialQuake?.depth ?? 18);
  const [distanceKm, setDistanceKm] = useState<number>(45);
  const [soilType, setSoilType] = useState<'rock' | 'stiff-soil' | 'soft-sediment'>('stiff-soil');
  const [faultType, setFaultType] = useState<'megathrust' | 'strike-slip' | 'normal'>('megathrust');

  // Sync if initialQuake changes
  React.useEffect(() => {
    if (initialQuake) {
      setMainshockMag(initialQuake.magnitude);
      setHypoDepthKm(initialQuake.depth);
    }
  }, [initialQuake]);

  // 1. Omori-Utsu Law Aftershock Decay Calculation: n(t) = K / (t + c)^p
  // where K scales exponentially with mainshock magnitude: K ~ 10^(0.9 * (M - 5.0))
  const omoriStats = useMemo(() => {
    const p = 1.05; // typical decay exponent ~ 1.0 to 1.2
    const c = 0.08; // onset parameter (days)
    const K = Math.max(0.5, Math.pow(10, 0.88 * (mainshockMag - 4.5)));

    const days: { day: number; dailyRate: number; cumulative: number }[] = [];
    let cumulative = 0;

    for (let t = 1; t <= 30; t++) {
      const dailyRate = K / Math.pow(t + c, p);
      cumulative += dailyRate;
      days.push({
        day: t,
        dailyRate: Math.round(dailyRate * 10) / 10,
        cumulative: Math.round(cumulative)
      });
    }

    // Båth's Law: largest expected aftershock is ~ 1.2 magnitude units below mainshock
    const largestAftershock = Math.max(1.0, mainshockMag - 1.2);

    return {
      days,
      totalExpected30d: Math.round(cumulative),
      day1Rate: Math.round(days[0].dailyRate),
      largestAftershock: Math.round(largestAftershock * 10) / 10
    };
  }, [mainshockMag]);

  // 2. Ground Motion Prediction Equation (GMPE) for Peak Ground Acceleration (PGA)
  // Simplified Campbell & Bozorgnia formulation
  const pgaStats = useMemo(() => {
    // Hypocentral distance
    const rHypo = Math.sqrt(distanceKm * distanceKm + hypoDepthKm * hypoDepthKm);

    // Site amplification factor
    let siteFactor = 1.0;
    if (soilType === 'soft-sediment') siteFactor = 1.65; // High amplification in basin sediments
    if (soilType === 'stiff-soil') siteFactor = 1.2;
    if (soilType === 'rock') siteFactor = 0.85;

    // ln(PGA in g) approx
    const lnPGA = -1.2 + 0.58 * mainshockMag - 1.15 * Math.log(rHypo + 0.05 * Math.exp(0.5 * mainshockMag));
    const pga_g = Math.min(Math.max(Math.exp(lnPGA) * siteFactor, 0.001), 2.5);
    const pga_percent = pga_g * 100;

    // Modified Mercalli Intensity estimated from PGA (Wald et al.)
    let mmi = 1;
    let mmiRoman = 'I';
    let damageDesc = 'Imperceptible; only detected by seismographs.';

    if (pga_percent >= 0.17 && pga_percent < 1.4) {
      mmi = 2;
      mmiRoman = 'II - III';
      damageDesc = 'Felt by people at rest on upper floors. Hanging objects swing gently.';
    } else if (pga_percent >= 1.4 && pga_percent < 3.9) {
      mmi = 4;
      mmiRoman = 'IV';
      damageDesc = 'Felt indoors. Windows rattle; parked cars rock noticeably.';
    } else if (pga_percent >= 3.9 && pga_percent < 9.2) {
      mmi = 5;
      mmiRoman = 'V';
      damageDesc = 'Felt by nearly everyone. Plaster cracks; unstable objects overturned.';
    } else if (pga_percent >= 9.2 && pga_percent < 18) {
      mmi = 6;
      mmiRoman = 'VI';
      damageDesc = 'Felt by all; some frightened. Heavy furniture moves; slight plaster damage.';
    } else if (pga_percent >= 18 && pga_percent < 34) {
      mmi = 7;
      mmiRoman = 'VII';
      damageDesc = 'Moderate damage in ordinary structures; considerable in poorly built buildings.';
    } else if (pga_percent >= 34 && pga_percent < 65) {
      mmi = 8;
      mmiRoman = 'VIII';
      damageDesc = 'Damage slight in specially designed structures; considerable in ordinary buildings.';
    } else if (pga_percent >= 65 && pga_percent < 124) {
      mmi = 9;
      mmiRoman = 'IX';
      damageDesc = 'Severe damage in substantial buildings. Underground pipes break; ground cracked.';
    } else if (pga_percent >= 124) {
      mmi = 10;
      mmiRoman = 'X+';
      damageDesc = 'Catastrophic destruction. Masonry destroyed; bridges collapsed; rails bent.';
    }

    return {
      pga_g: Math.round(pga_g * 1000) / 1000,
      pga_percent: Math.round(pga_percent * 10) / 10,
      rHypo: Math.round(rHypo * 10) / 10,
      mmi,
      mmiRoman,
      damageDesc
    };
  }, [mainshockMag, hypoDepthKm, distanceKm, soilType]);

  // 3. Tsunami Threat Matrix
  const tsunamiAssessment = useMemo(() => {
    let score = 0;
    // Magnitude factor
    if (mainshockMag >= 8.0) score += 5;
    else if (mainshockMag >= 7.5) score += 4;
    else if (mainshockMag >= 7.0) score += 3;
    else if (mainshockMag >= 6.5) score += 1;

    // Depth factor
    if (hypoDepthKm <= 20) score += 4;
    else if (hypoDepthKm <= 40) score += 3;
    else if (hypoDepthKm <= 70) score += 1;

    // Fault mechanism factor
    if (faultType === 'megathrust') score += 3; // Vertical displacement
    else if (faultType === 'normal') score += 2;
    else if (faultType === 'strike-slip') score += 0; // Horizontal shearing rarely triggers major waves

    let threatLevel: 'NONE' | 'WATCH' | 'ADVISORY' | 'WARNING';
    let badgeColor = 'text-slate-400 bg-slate-800';
    let actionRecommendation = 'No tsunami threat anticipated.';

    if (score >= 9) {
      threatLevel = 'WARNING';
      badgeColor = 'text-rose-400 bg-rose-500/20 border-rose-500/40';
      actionRecommendation = 'URGENT: Major destructive tsunami waves probable. Immediate vertical or inland coastal evacuation recommended.';
    } else if (score >= 6) {
      threatLevel = 'ADVISORY';
      badgeColor = 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      actionRecommendation = 'Strong localized ocean currents and beach surges likely. Evacuate beaches, marinas, and harbor facilities.';
    } else if (score >= 4) {
      threatLevel = 'WATCH';
      badgeColor = 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40';
      actionRecommendation = 'Potential threat under assessment. Await oceanographic DART buoy confirmation.';
    } else {
      threatLevel = 'NONE';
      badgeColor = 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
    }

    return { score, threatLevel, badgeColor, actionRecommendation };
  }, [mainshockMag, hypoDepthKm, faultType]);

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 p-6 text-slate-800 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Ribbon */}
      <div className="pb-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>AI Prediction & Impact Simulator</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Aftershock Decay & Ground Shaking Damage Simulator
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Predict how many aftershocks will hit over the next 30 days (Omori’s Law), calculate how hard the ground will shake (PGA), and evaluate tsunami alerts.
          </p>
        </div>

        {initialQuake && (
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 shadow-xs">
            Simulating from: <span className="text-amber-700 font-bold">{initialQuake.place}</span>
          </div>
        )}
      </div>

      {/* Parameter Control Console */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-amber-600" />
          <span>Simulation Parameters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Magnitude Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-700 font-semibold">
              <span>Mainshock Magnitude:</span>
              <span className="text-amber-700 font-bold tabular-nums">M {mainshockMag.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="9.5"
              step="0.1"
              value={mainshockMag}
              onChange={(e) => setMainshockMag(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
          </div>

          {/* Focal Depth Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-700 font-semibold">
              <span>Focal Depth:</span>
              <span className="text-cyan-700 font-bold tabular-nums">{hypoDepthKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="1"
              value={hypoDepthKm}
              onChange={(e) => setHypoDepthKm(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
          </div>

          {/* Distance to Site Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-700 font-semibold">
              <span>Site Distance (R):</span>
              <span className="text-slate-900 font-bold tabular-nums">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value, 10))}
              className="w-full accent-slate-500 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
          </div>

          {/* Local Soil Type */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-slate-700 font-semibold">Geotechnical Foundation:</div>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-amber-500 shadow-xs cursor-pointer font-medium"
            >
              <option value="rock">Crystalline Hard Rock (Vs30 &gt; 760 m/s)</option>
              <option value="stiff-soil">Stiff Soil / Dense Clay (Vs30 360-760 m/s)</option>
              <option value="soft-sediment">Soft Alluvial Basin (Vs30 &lt; 360 m/s)</option>
            </select>
          </div>

          {/* Fault Mechanism */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-slate-700 font-semibold">Fault Mechanism:</div>
            <select
              value={faultType}
              onChange={(e) => setFaultType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-amber-500 shadow-xs cursor-pointer font-medium"
            >
              <option value="megathrust">Megathrust Subduction (Reverse Dip-Slip)</option>
              <option value="strike-slip">Transform (Lateral Strike-Slip)</option>
              <option value="normal">Extensional (Normal Fault)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Model Output Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model 1: Omori-Utsu Aftershock Decay Curve */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
                Omori-Utsu Law Aftershock Sequence
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                30-Day Aftershock Rate Decay & Cumulative Hazard
              </h2>
            </div>
            <div className="text-right text-xs font-mono">
              <span className="text-slate-500">Total 30d Expected:</span>{' '}
              <span className="text-amber-700 font-bold tabular-nums">~{omoriStats.totalExpected30d} quakes</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Day 1 Rate</div>
              <div className="text-lg font-bold text-rose-600 tabular-nums">~{omoriStats.day1Rate} / day</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Båth's Law Largest Event</div>
              <div className="text-lg font-bold text-amber-700 tabular-nums">M {omoriStats.largestAftershock}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Decay Coefficient (p)</div>
              <div className="text-lg font-bold text-slate-800">1.05</div>
            </div>
          </div>

          {/* SVG Decay Chart */}
          <div className="h-60 w-full bg-slate-50/80 rounded-lg border border-slate-200 p-4 flex flex-col justify-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 450 160">
              <line x1="35" y1="10" x2="35" y2="130" stroke="#94A3B8" strokeWidth="1" />
              <line x1="35" y1="130" x2="430" y2="130" stroke="#94A3B8" strokeWidth="1" />

              {/* Ticks */}
              {[1, 5, 10, 15, 20, 25, 30].map((d) => {
                const x = 35 + ((d - 1) / 29) * 385;
                return (
                  <g key={d}>
                    <line x1={x} y1="130" x2={x} y2="134" stroke="#94A3B8" />
                    <text x={x} y="146" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
                      D{d}
                    </text>
                  </g>
                );
              })}

              {/* Decay Curve Points */}
              {(() => {
                const maxRate = Math.max(omoriStats.day1Rate, 1);
                const pts = omoriStats.days.map((item) => {
                  const x = 35 + ((item.day - 1) / 29) * 385;
                  const y = 130 - (item.dailyRate / maxRate) * 110;
                  return `${x},${y}`;
                });

                return (
                  <>
                    <polyline
                      points={`35,130 ${pts.join(' ')} 420,130`}
                      fill="rgba(245, 158, 11, 0.08)"
                    />
                    <polyline
                      points={pts.join(' ')}
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="2.5"
                    />
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Model 2: Peak Ground Acceleration (PGA) & Mercalli Intensity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              Peak Ground Acceleration (PGA)
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Ground Motion & Damage Potential
            </h2>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-mono font-medium">Estimated Surface Acceleration</div>
            <div className="text-3xl font-extrabold font-mono text-cyan-700 tabular-nums">
              {pgaStats.pga_percent}% g
            </div>
            <div className="text-xs font-mono text-slate-500">
              ({pgaStats.pga_g} g acceleration at {distanceKm} km epicentral distance)
            </div>
          </div>

          {/* Intensity & Structural Damage Callout */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-600 font-medium">Modified Mercalli:</span>
              <span className="text-amber-800 font-bold text-sm bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Intensity {pgaStats.mmiRoman}</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans">{pgaStats.damageDesc}</p>
          </div>

          {/* Tsunami Assessment Card */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-cyan-600" />
                <span>Tsunami Hazard</span>
              </span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${tsunamiAssessment.badgeColor}`}>
                {tsunamiAssessment.threatLevel}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{tsunamiAssessment.actionRecommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
