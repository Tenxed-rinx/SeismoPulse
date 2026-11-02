/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { SeismicMap } from './components/SeismicMap';
import { PowerBIDashboard } from './components/PowerBIDashboard';
import { MongoStudio } from './components/MongoStudio';
import { PredictiveTools } from './components/PredictiveTools';
import { SafetyAndQuiz } from './components/SafetyAndQuiz';
import { HistoricalArchive } from './components/HistoricalArchive';
import { EmergencyModal } from './components/EmergencyModal';
import { AboutModal } from './components/AboutModal';
import { ReportModal } from './components/ReportModal';
import { VercelModal } from './components/VercelModal';
import { Earthquake, FilterState } from './types/seismic';
import { fetchLiveEarthquakes, ALL_TIME_SEED } from './services/usgsService';
import { Radio } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'powerbi' | 'mongo' | 'predict' | 'safety' | 'history'>('map');
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>(ALL_TIME_SEED);
  const [selectedQuake, setSelectedQuake] = useState<Earthquake | null>(null);
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('live');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFeed, setActiveFeed] = useState<string>('all_time');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState<boolean>(false);

  // Global filters
  const [filters, setFilters] = useState<FilterState>({
    minMagnitude: 1.0,
    maxMagnitude: 10.0,
    maxDepth: 700,
    timeRange: 'month',
    searchQuery: '',
    region: 'all',
    tsunamiOnly: false
  });

  // Fetch live earthquakes on mount or feed change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchLiveEarthquakes(activeFeed).then((result) => {
      if (!isMounted) return;
      setEarthquakes(result.earthquakes);
      setDataSource(result.source);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [activeFeed]);

  const handleSendToPredictor = (quake: Earthquake) => {
    setSelectedQuake(quake);
    setActiveTab('predict');
  };

  const handleSelectFromBI = (quake: Earthquake) => {
    setSelectedQuake(quake);
    setActiveTab('map');
  };

  // Plain-English descriptions for each screen
  const getTabDescription = () => {
    switch (activeTab) {
      case 'map':
        return {
          title: 'Interactive 3D Earthquake Map',
          summary: 'Track real-time global earthquakes from USGS satellites, view major tectonic fault lines, and filter by strength or depth.'
        };
      case 'powerbi':
        return {
          title: 'Power BI Analytics Dashboard',
          summary: 'Interactive business intelligence charts. Click any magnitude bar or depth category to instantly filter all trends and charts.'
        };
      case 'mongo':
        return {
          title: 'MongoDB Database Query Lab',
          summary: 'Hands-on database workbench: test real MongoDB aggregation pipelines ($match, $group, $sort) on live earthquake records.'
        };
      case 'predict':
        return {
          title: 'AI Prediction & Impact Simulator',
          summary: 'Calculate aftershock decay over 30 days (Omori’s Law), estimate ground shaking force (PGA), and evaluate tsunami wave risk.'
        };
      case 'safety':
        return {
          title: 'Disaster Safety, Quiz & Emergency Lines',
          summary: 'Test your survival knowledge with a scored 10-question quiz, check off your 72-hour go-bag, and find direct rescue numbers.'
        };
      case 'history':
        return {
          title: 'Past Catastrophe Case Studies',
          summary: 'Explore history’s most powerful earthquakes (1960 Chile, 2011 Japan, 2023 Turkey) and the engineering lessons that save lives.'
        };
    }
  };

  const currentDesc = getTabDescription();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1-Row Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenVercelModal={() => setIsVercelModalOpen(true)}
        dataSource={dataSource}
        quakeCount={earthquakes.length}
      />

      {/* Intuitive Plain-English Secondary Explanation Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-700 font-bold uppercase tracking-wider font-mono shrink-0">
            {currentDesc.title}:
          </span>
          <span className="text-slate-600 font-medium truncate">
            {currentDesc.summary}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px] shrink-0">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span className="font-semibold text-slate-700">Feed: {activeFeed === 'all_time' ? 'All-Time Global Catalog' : activeFeed}</span>
          </span>
          <span>·</span>
          <span className="font-semibold text-slate-700">{earthquakes.length} Quakes</span>
        </div>
      </div>

      {/* Main Viewport Container */}
      <main className="flex-1 w-full relative">
        {/* SeismicMap is kept alive in DOM to maintain map state and WebGL tiles without reloads */}
        <div className={activeTab === 'map' ? 'w-full h-full relative' : 'hidden'}>
          <SeismicMap
            earthquakes={earthquakes}
            selectedQuake={selectedQuake}
            onSelectQuake={setSelectedQuake}
            filters={filters}
            setFilters={setFilters}
            activeFeed={activeFeed}
            onChangeFeed={setActiveFeed}
            isLoading={isLoading}
            onSendToPredictor={handleSendToPredictor}
            isActive={activeTab === 'map'}
          />
        </div>

        {activeTab === 'powerbi' && (
          <PowerBIDashboard
            earthquakes={earthquakes}
            onSelectQuake={handleSelectFromBI}
          />
        )}

        {activeTab === 'mongo' && (
          <MongoStudio earthquakes={earthquakes} />
        )}

        {activeTab === 'predict' && (
          <PredictiveTools initialQuake={selectedQuake} />
        )}

        {activeTab === 'safety' && (
          <SafetyAndQuiz />
        )}

        {activeTab === 'history' && (
          <HistoricalArchive />
        )}
      </main>

      {/* Quick Emergency Dispatch Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Project Overview & Presentation Pitch Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onNavigateToTab={setActiveTab}
      />

      {/* BDM Academic Project Report & Doc Viewer Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Production Vercel Deployment Modal */}
      <VercelModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
      />
    </div>
  );
}
