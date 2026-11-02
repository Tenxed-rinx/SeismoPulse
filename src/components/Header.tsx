import React from 'react';
import {
  Activity,
  Map,
  BarChart3,
  Database,
  Zap,
  ShieldCheck,
  History,
  PhoneCall,
  HelpCircle,
  FileText
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'powerbi' | 'mongo' | 'predict' | 'safety' | 'history';
  setActiveTab: (tab: 'map' | 'powerbi' | 'mongo' | 'predict' | 'safety' | 'history') => void;
  onOpenEmergencyModal: () => void;
  onOpenAboutModal: () => void;
  onOpenReportModal: () => void;
  onOpenVercelModal: () => void;
  dataSource: 'live' | 'fallback';
  quakeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergencyModal,
  onOpenAboutModal,
  onOpenReportModal,
  onOpenVercelModal,
  dataSource,
  quakeCount
}) => {
  const navItems: {
    id: 'map' | 'powerbi' | 'mongo' | 'predict' | 'safety' | 'history';
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'map',
      label: 'Live Map',
      description: 'Real-time earthquakes & faults',
      icon: <Map className="w-4 h-4" />
    },
    {
      id: 'powerbi',
      label: 'Power BI Analytics',
      description: 'Interactive charts & trends',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'mongo',
      label: 'MongoDB Queries',
      description: 'Database aggregation runner',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'predict',
      label: 'AI Prediction',
      description: 'Aftershocks & shaking force',
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'safety',
      label: 'Safety & Quiz',
      description: 'Survival guide & emergency lines',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      id: 'history',
      label: 'Past Disasters',
      description: 'Historical catastrophe archive',
      icon: <History className="w-4 h-4" />
    }
  ];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => setActiveTab('map')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer group"
          title="Return to Earthquake Map"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 leading-tight">
              SeismoPulse <span className="font-semibold text-amber-600">Studio</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
              Global Earthquake Analysis & Safety
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto py-1 px-1 max-w-full text-xs font-semibold text-slate-600 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                title={item.description}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-amber-700 bg-amber-50 font-bold border-b-2 border-amber-600 shadow-xs'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-amber-600' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Project Guide & Emergency Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* "Project Report (Doc)" Button */}
          <button
            type="button"
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            title="Open BDM Academic Project Report (Aditya Pratap, Aryan Thakur, Nishant Harkut, Aditya Varshney)"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Project Report (Doc)</span>
            <span className="sm:hidden">Report</span>
          </button>

          {/* "Deploy to Vercel" Button */}
          <button
            type="button"
            onClick={onOpenVercelModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            title="Production Vercel deployment guide & settings"
          >
            <svg className="w-3.5 h-3.5 fill-black" viewBox="0 0 116 100">
              <path d="M57.5 0L115 100H0L57.5 0Z" />
            </svg>
            <span className="hidden lg:inline">Deploy to Vercel</span>
            <span className="lg:hidden hidden sm:inline">Vercel</span>
          </button>

          {/* "Project Guide" Button */}
          <button
            type="button"
            onClick={onOpenAboutModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            title="Open project explanation & 30-second presentation pitch"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Project Guide</span>
          </button>

          {/* Emergency Hotline Button */}
          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold tracking-wide text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Emergency Help</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
