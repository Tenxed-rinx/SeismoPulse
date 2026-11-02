import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Globe,
  GitBranch,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  FolderCheck,
  Code
} from 'lucide-react';

interface VercelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelModal: React.FC<VercelModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const codeSnippets = [
    {
      title: 'Method 1: Deploy with Vercel CLI (Fastest — 60 Seconds)',
      cmd: `# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Login to your free Vercel account
vercel login

# 3. Deploy to production
vercel --prod`
    },
    {
      title: 'Method 2: Deploy via GitHub (Recommended for Continuous Delivery)',
      cmd: `# 1. Initialize Git repository
git init
git add .
git commit -m "SeismoPulse Studio: Big Data & Seismic Analytics"

# 2. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/seismopulse-studio.git
git branch -M main
git push -u origin main

# 3. Go to https://vercel.com/new and click "Import" on your repository!`
    },
    {
      title: 'Pre-configured vercel.json (Already included in root)',
      cmd: `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* Vercel Iconic Black & White Triangle */}
            <div className="w-8 h-8 rounded-lg bg-black border border-white/20 flex items-center justify-center shadow-inner">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 116 100">
                <path d="M57.5 0L115 100H0L57.5 0Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Deploy SeismoPulse Studio to Vercel</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  100% Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Step-by-step production deployment guide for Vite + React 19 SPA
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 bg-slate-50/50">
          {/* Quick Summary Banner */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-700 flex items-center gap-1.5">
              <FolderCheck className="w-4 h-4 text-amber-600" />
              <span>Project Build Configuration Verified</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This application is engineered as a zero-latency client-side React 19 SPA on Vite. A production <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">vercel.json</code> has already been generated in the project root with single-page URL rewrites. It deploys directly onto Vercel with zero extra server configuration required!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Framework</div>
                <div className="font-bold text-slate-900">Vite</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Build Command</div>
                <div className="font-bold text-emerald-700">npm run build</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Output Folder</div>
                <div className="font-bold text-amber-700">dist</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase">Node Engine</div>
                <div className="font-bold text-sky-700">18.x / 20.x</div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Deployment Methods */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>Choose Your Deployment Method:</span>
            </h3>

            {codeSnippets.map((snippet, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-200">
                  <span className="text-xs font-semibold text-slate-800">{snippet.title}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(snippet.cmd, idx)}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-2 py-1 rounded border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
                  <code>{snippet.cmd}</code>
                </pre>
              </div>
            ))}
          </div>

          {/* Vercel Environment Variables & Notes */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Environment Variables & Real-Time Feeds on Vercel</span>
            </h4>
            <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
              <li>
                <strong>USGS Feeds & Tectonic Plates:</strong> Real-time seismic feeds (<code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono">earthquake.usgs.gov</code>) are 100% public with permissive CORS and work out of the box on Vercel.
              </li>
              <li>
                <strong>Map Basemaps:</strong> Uses free, high-speed topographic Esri & OpenStreetMap tile servers with zero API key requirements or watermarks.
              </li>
              <li>
                <strong>Optional Gemini AI API:</strong> If you use the AI seismic simulation features, add your <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> in the Vercel Dashboard under <em>Settings &rarr; Environment Variables</em>.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 border-t border-slate-200 text-xs">
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-semibold"
          >
            <span>Open Vercel Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
