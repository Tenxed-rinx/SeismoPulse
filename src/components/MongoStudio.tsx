import React, { useState, useMemo } from 'react';
import { Earthquake, MongoPipelineStage } from '../types/seismic';
import {
  Database,
  Play,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Cpu,
  Layers,
  ChevronDown,
  Sparkles,
  Search,
  Plus,
  Trash2
} from 'lucide-react';

interface MongoStudioProps {
  earthquakes: Earthquake[];
}

const PRESET_PIPELINES: { name: string; description: string; stages: MongoPipelineStage[] }[] = [
  {
    name: 'Top Magnitude Seismic Events ($match, $sort, $limit)',
    description: 'Filter events with M >= 5.0, sort descending by energy release, and return top 8.',
    stages: [
      {
        id: 'st-1',
        operator: '$match',
        rawJson: JSON.stringify({ magnitude: { $gte: 5.0 } }, null, 2),
        description: 'Match earthquakes with magnitude >= 5.0',
        enabled: true
      },
      {
        id: 'st-2',
        operator: '$sort',
        rawJson: JSON.stringify({ magnitude: -1, energyJoules: -1 }, null, 2),
        description: 'Sort descending by magnitude and energy',
        enabled: true
      },
      {
        id: 'st-3',
        operator: '$limit',
        rawJson: JSON.stringify(8, null, 2),
        description: 'Limit output to 8 documents',
        enabled: true
      }
    ]
  },
  {
    name: 'Depth Stratum Aggregation ($group & $avg)',
    description: 'Group all events by depth tier (crustal vs mantle) and compute average magnitude and total energy.',
    stages: [
      {
        id: 'st-1',
        operator: '$group',
        rawJson: JSON.stringify(
          {
            _id: '$depthCategory',
            totalEvents: { $sum: 1 },
            avgMagnitude: { $avg: '$magnitude' },
            maxMagnitude: { $max: '$magnitude' },
            totalEnergyJoules: { $sum: '$energyJoules' }
          },
          null,
          2
        ),
        description: 'Group by depthCategory and compute statistical aggregations',
        enabled: true
      },
      {
        id: 'st-2',
        operator: '$sort',
        rawJson: JSON.stringify({ totalEvents: -1 }, null, 2),
        description: 'Sort by frequency descending',
        enabled: true
      }
    ]
  },
  {
    name: 'Tsunami Risk Projection ($match & $project)',
    description: 'Filter shallow oceanic events (<50 km depth) with high magnitude, projecting disaster readiness metrics.',
    stages: [
      {
        id: 'st-1',
        operator: '$match',
        rawJson: JSON.stringify({ depth: { $lte: 50 }, magnitude: { $gte: 4.5 } }, null, 2),
        description: 'Shallow hypocenter threshold (<50km) and M >= 4.5',
        enabled: true
      },
      {
        id: 'st-2',
        operator: '$project',
        rawJson: JSON.stringify(
          {
            catalogId: '$id',
            place: '$place',
            magnitude: '$magnitude',
            depthKm: '$depth',
            tsunamiAlert: '$tsunami',
            tntTons: '$tntEquivalentTons'
          },
          null,
          2
        ),
        description: 'Project essential telemetry fields',
        enabled: true
      },
      {
        id: 'st-3',
        operator: '$limit',
        rawJson: JSON.stringify(10, null, 2),
        description: 'Limit to 10 sample hazard records',
        enabled: true
      }
    ]
  }
];

export const MongoStudio: React.FC<MongoStudioProps> = ({ earthquakes }) => {
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [stages, setStages] = useState<MongoPipelineStage[]>(PRESET_PIPELINES[0].stages);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'schema'>('pipeline');
  const [queryError, setQueryError] = useState<string | null>(null);

  // Load preset
  const handleSelectPreset = (index: number) => {
    setActivePresetIndex(index);
    setStages(PRESET_PIPELINES[index].stages);
    setQueryError(null);
  };

  // Pipeline Execution Engine (In-Browser MongoDB aggregation simulator)
  const { results, executionTimeMs, docsExamined } = useMemo(() => {
    const startTime = performance.now();
    let currentData = [...earthquakes];
    const docsExaminedCount = currentData.length;

    try {
      setQueryError(null);
      for (const stage of stages) {
        if (!stage.enabled) continue;
        const parsed = JSON.parse(stage.rawJson);

        if (stage.operator === '$match') {
          currentData = currentData.filter((doc) => {
            for (const [key, condition] of Object.entries(parsed)) {
              const val = (doc as any)[key];
              if (typeof condition === 'object' && condition !== null) {
                if ('$gte' in condition && !(val >= (condition as any).$gte)) return false;
                if ('$lte' in condition && !(val <= (condition as any).$lte)) return false;
                if ('$gt' in condition && !(val > (condition as any).$gt)) return false;
                if ('$lt' in condition && !(val < (condition as any).$lt)) return false;
                if ('$eq' in condition && !(val === (condition as any).$eq)) return false;
              } else {
                if (val !== condition) return false;
              }
            }
            return true;
          });
        } else if (stage.operator === '$sort') {
          currentData.sort((a, b) => {
            for (const [key, dir] of Object.entries(parsed)) {
              const aVal = (a as any)[key];
              const bVal = (b as any)[key];
              const order = Number(dir) === -1 ? -1 : 1;
              if (aVal < bVal) return -1 * order;
              if (aVal > bVal) return 1 * order;
            }
            return 0;
          });
        } else if (stage.operator === '$limit') {
          const limitCount = typeof parsed === 'number' ? parsed : 10;
          currentData = currentData.slice(0, limitCount);
        } else if (stage.operator === '$project') {
          currentData = currentData.map((doc) => {
            const projected: Record<string, any> = {};
            for (const [outKey, inField] of Object.entries(parsed)) {
              if (typeof inField === 'string' && inField.startsWith('$')) {
                const sourceProp = inField.substring(1);
                projected[outKey] = (doc as any)[sourceProp];
              } else if (inField === 1) {
                projected[outKey] = (doc as any)[outKey];
              } else {
                projected[outKey] = inField;
              }
            }
            return projected as any;
          });
        } else if (stage.operator === '$group') {
          const idField = parsed._id;
          const groups: Record<string, any[]> = {};

          currentData.forEach((doc) => {
            let groupKey = 'all';
            if (typeof idField === 'string' && idField.startsWith('$')) {
              groupKey = String((doc as any)[idField.substring(1)] ?? 'null');
            }
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(doc);
          });

          currentData = Object.entries(groups).map(([groupKey, groupDocs]) => {
            const out: Record<string, any> = { _id: groupKey };
            for (const [outKey, aggSpec] of Object.entries(parsed)) {
              if (outKey === '_id') continue;
              if (typeof aggSpec === 'object' && aggSpec !== null) {
                if ('$sum' in aggSpec) {
                  const sumExpr = (aggSpec as any).$sum;
                  if (typeof sumExpr === 'number') {
                    out[outKey] = groupDocs.length * sumExpr;
                  } else if (typeof sumExpr === 'string' && sumExpr.startsWith('$')) {
                    const prop = sumExpr.substring(1);
                    out[outKey] = groupDocs.reduce((acc, d) => acc + (Number(d[prop]) || 0), 0);
                  }
                } else if ('$avg' in aggSpec) {
                  const prop = String((aggSpec as any).$avg).substring(1);
                  const sum = groupDocs.reduce((acc, d) => acc + (Number(d[prop]) || 0), 0);
                  out[outKey] = Math.round((sum / groupDocs.length) * 100) / 100;
                } else if ('$max' in aggSpec) {
                  const prop = String((aggSpec as any).$max).substring(1);
                  out[outKey] = Math.max(...groupDocs.map((d) => Number(d[prop]) || 0));
                }
              }
            }
            return out as any;
          });
        }
      }
    } catch (e: any) {
      setQueryError(e.message || 'MQL Syntax Error');
    }

    const endTime = performance.now();
    return {
      results: currentData,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      docsExamined: docsExaminedCount
    };
  }, [earthquakes, stages]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleUpdateStageJson = (id: string, newJson: string) => {
    setStages((prev) =>
      prev.map((st) => (st.id === id ? { ...st, rawJson: newJson } : st))
    );
  };

  const handleToggleStage = (id: string) => {
    setStages((prev) =>
      prev.map((st) => (st.id === id ? { ...st, enabled: !st.enabled } : st))
    );
  };

  const handleAddStage = () => {
    const newStage: MongoPipelineStage = {
      id: `st-${Date.now()}`,
      operator: '$match',
      rawJson: JSON.stringify({ magnitude: { $gte: 4.0 } }, null, 2),
      description: 'Filter stage',
      enabled: true
    };
    setStages([...stages, newStage]);
  };

  const handleRemoveStage = (id: string) => {
    setStages((prev) => prev.filter((st) => st.id !== id));
  };

  // Sample Mongo document for schema tab
  const sampleDoc = useMemo(() => {
    if (earthquakes.length === 0) return null;
    const eq = earthquakes[0];
    return {
      _id: eq.id,
      title: eq.title,
      magnitude: eq.magnitude,
      magType: eq.magType,
      focalDepthKm: eq.depth,
      depthCategory: eq.depthCategory,
      location: {
        type: 'Point',
        coordinates: [eq.longitude, eq.latitude, eq.depth]
      },
      energyRelease: {
        joules: eq.energyJoules,
        tntTons: eq.tntEquivalentTons
      },
      intensity: {
        mmi: eq.mmi,
        feltReports: eq.felt
      },
      hazardFlags: {
        tsunami: eq.tsunami === 1,
        alertStatus: eq.alert ?? 'none'
      },
      timestamp: new Date(eq.time).toISOString()
    };
  }, [earthquakes]);

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 p-6 text-slate-800 space-y-6 max-w-[1600px] mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>MongoDB Database Query Lab</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Real-Time Earthquake Database & Aggregation Runner
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Simulate how enterprise databases filter and group thousands of seismic events in milliseconds using MongoDB query stages.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Query Pipeline Builder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            JSON Document Schema
          </button>
        </div>
      </div>

      {/* Preset Selector Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRESET_PIPELINES.map((preset, idx) => {
          const isActive = activePresetIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
              }`}
            >
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>{preset.name}</span>
                {isActive && <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{preset.description}</p>
            </button>
          );
        })}
      </div>

      {activeTab === 'pipeline' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Aggregation Stages Editor (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>db.seismic_events.aggregate([ ... ])</span>
              </div>
              <button
                type="button"
                onClick={handleAddStage}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Stage</span>
              </button>
            </div>

            <div className="space-y-3">
              {stages.map((stage, sIdx) => (
                <div
                  key={stage.id}
                  className={`bg-white rounded-xl border shadow-xs transition-all ${
                    stage.enabled ? 'border-slate-200' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/60 rounded-t-xl flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">#{sIdx + 1}</span>
                      <select
                        value={stage.operator}
                        onChange={(e) =>
                          setStages((prev) =>
                            prev.map((st) => (st.id === stage.id ? { ...st, operator: e.target.value as any } : st))
                          )
                        }
                        className="bg-white text-emerald-800 font-bold px-2 py-0.5 rounded border border-slate-300 outline-none shadow-xs cursor-pointer"
                      >
                        <option value="$match">$match</option>
                        <option value="$group">$group</option>
                        <option value="$sort">$sort</option>
                        <option value="$project">$project</option>
                        <option value="$limit">$limit</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={stage.enabled}
                          onChange={() => handleToggleStage(stage.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Enabled</span>
                      </label>
                      {stages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStage(stage.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3">
                    <textarea
                      rows={stage.operator === '$group' || stage.operator === '$project' ? 6 : 3}
                      value={stage.rawJson}
                      onChange={(e) => handleUpdateStageJson(stage.id, e.target.value)}
                      className="w-full bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:border-emerald-500 focus:outline-none resize-none shadow-inner"
                    />
                  </div>
                </div>
              ))}
            </div>

            {queryError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs font-mono text-rose-700">
                Execution Error: {queryError}
              </div>
            )}
          </div>

          {/* Right Column: Execution Output & Benchmark (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Execution Benchmark Telemetry Strip */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4 text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Execution:</span>
                  <span className="text-slate-900 font-bold tabular-nums">{executionTimeMs} ms</span>
                </span>
                <span>·</span>
                <span>
                  Examined: <span className="text-slate-900 font-bold tabular-nums">{docsExamined}</span>
                </span>
                <span>·</span>
                <span>
                  Returned: <span className="text-emerald-700 font-bold tabular-nums">{results.length}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            {/* Formatted JSON Output Display */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 h-[520px] overflow-y-auto shadow-inner">
              <pre className="font-mono text-xs text-emerald-400 whitespace-pre leading-relaxed">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* Schema & 2dsphere Geospatial Index Tab */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
                GeoJSON 2dsphere Collection Schema
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                db.seismic_events Document Structure
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every seismic tremor record is normalized with an RFC-7946 compliant GeoJSON <code>Point</code> geometry
              indexed with a <code>2dsphere</code> spatial index for millisecond spherical distance queries (<code>$nearSphere</code>).
            </p>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
              <div className="text-slate-400 mb-2">// Index definition</div>
              <div className="text-emerald-400">db.seismic_events.createIndex({ '{' } "location": "2dsphere" { '}' })</div>
              <div className="text-emerald-400 mt-1">db.seismic_events.createIndex({ '{' } "magnitude": -1, "timestamp": -1 { '}' })</div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 h-[440px] overflow-y-auto shadow-inner">
            <div className="text-xs font-mono text-slate-400 mb-2">// Sample BSON Document</div>
            <pre className="font-mono text-xs text-emerald-400 whitespace-pre">
              {JSON.stringify(sampleDoc, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
