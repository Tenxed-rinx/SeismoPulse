import React from 'react';
import {
  X,
  Activity,
  Map,
  BarChart3,
  Database,
  Zap,
  ShieldCheck,
  History,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: 'map' | 'powerbi' | 'mongo' | 'predict' | 'safety' | 'history') => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onNavigateToTab }) => {
  if (!isOpen) return null;

  const features = [
    {
      tab: 'map' as const,
      icon: <Map className="w-4 h-4 text-amber-400" />,
      title: '1. Live Earthquake Map',
      simpleExplain: 'Interactive world map showing real-time earthquakes as they happen, along with major tectonic fault lines (like the Pacific Ring of Fire) and satellite terrain.'
    },
    {
      tab: 'powerbi' as const,
      icon: <BarChart3 className="w-4 h-4 text-cyan-400" />,
      title: '2. Power BI Analytics Studio',
      simpleExplain: 'Executive dashboard with interactive charts. Clicking any magnitude or depth slice automatically updates every other graph to reveal earthquake patterns.'
    },
    {
      tab: 'mongo' as const,
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      title: '3. Database Query Lab (MongoDB)',
      simpleExplain: 'A hands-on database console where users can run real MongoDB queries ($match, $group, $sort) on live earthquake records with instant benchmark speeds.'
    },
    {
      tab: 'predict' as const,
      icon: <Zap className="w-4 h-4 text-amber-300" />,
      title: '4. AI Prediction & Impact Simulator',
      simpleExplain: 'Calculates how many aftershocks will hit over the next 30 days (Omori’s Law), how violent ground shaking will feel, and whether a tsunami warning is needed.'
    },
    {
      tab: 'safety' as const,
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
      title: '5. Safety Quiz & Emergency Helplines',
      simpleExplain: 'Educational module with a scored 10-question survival quiz, a checklist for packing an emergency go-bag, and 1-tap phone numbers for disaster rescue teams.'
    },
    {
      tab: 'history' as const,
      icon: <History className="w-4 h-4 text-indigo-400" />,
      title: '6. Past Disaster History',
      simpleExplain: 'A retrospective library of humanity’s biggest recorded earthquakes (like 1960 Chile and 2011 Japan) explaining why buildings failed and how modern codes save lives.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 text-slate-800 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-bold shadow-xs">
            <Activity className="w-5 h-5 stroke-[2.5] text-white" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
              Project Overview & Guide
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              What is SeismoPulse Studio?
            </h2>
          </div>
        </div>

        {/* Plain-English Pitch / Mission */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>In Plain English: What this app does</span>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            <strong>SeismoPulse Studio</strong> is an all-in-one earthquake intelligence platform that turns complex geophysics data into intuitive maps, business analytics, and life-saving safety tools.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            It streams live tremor data from the USGS, connects to real-world database queries (MongoDB) and Power BI dashboards, simulates aftershock risks, and teaches people how to stay safe during an earthquake.
          </p>
        </div>

        {/* Feature-by-Feature Explainer */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            6 Main Features & How to Demonstrate Them
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feat) => (
              <div
                key={feat.tab}
                className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 hover:border-slate-300 hover:bg-slate-50/50 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {feat.icon}
                    <span className="text-xs font-bold text-slate-900">{feat.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToTab(feat.tab);
                      onClose();
                    }}
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold cursor-pointer underline"
                  >
                    Open View →
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.simpleExplain}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick 30-Second Presentation Pitch for Interviewers / Teachers */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>How to Explain this Project in 30 Seconds to Others:</span>
          </div>
          <p className="text-xs text-amber-900 italic leading-relaxed">
            "I built an industry-level earthquake platform that bridges data engineering and disaster response. It visualizes live earthquakes on an interactive map with tectonic fault lines, provides a Microsoft Power BI-style analytics suite to spot seismic trends, lets users run real MongoDB aggregation pipelines against earthquake documents, predicts aftershock sequences using seismology physics formulas, and includes a full educational safety center with quizzes and international emergency helplines."
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          Got it! Explore the Platform
        </button>
      </div>
    </div>
  );
};
