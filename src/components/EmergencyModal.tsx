import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, Shield, Copy, Check, X } from 'lucide-react';
import { GLOBAL_HELPLINES } from '../data/safetyHelplines';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentEntry = GLOBAL_HELPLINES.find((h) => h.code === selectedCountry) || GLOBAL_HELPLINES[0];

  const handleCopyTemplate = () => {
    const time = new Date().toISOString().substring(0, 19).replace('T', ' ') + ' UTC';
    const text = `URGENT SOS: Severe earthquake shaking in progress. Immediate rescue/medical required at current location. Timestamp: ${time}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-rose-200 rounded-2xl max-w-lg w-full p-6 text-slate-800 space-y-5 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-rose-700 font-bold">
              Rapid Emergency Dispatch
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Immediate Seismic Assistance Line
            </h2>
          </div>
        </div>

        {/* Country Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-600 font-medium">Select Operating Country:</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-rose-500 shadow-xs cursor-pointer"
          >
            {GLOBAL_HELPLINES.map((h) => (
              <option key={h.code} value={h.code}>
                {h.flag} {h.country} (Emergency: {h.emergencyNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Big Action Box */}
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-4 text-center space-y-2">
          <div className="text-xs font-mono text-rose-700 uppercase font-bold">National Emergency Hotline</div>
          <div className="text-4xl font-extrabold font-mono text-rose-600 tracking-wider">
            {currentEntry.emergencyNumber}
          </div>
          <div className="text-xs text-slate-800 font-medium">{currentEntry.disasterAgency}</div>
          <div className="text-[11px] font-mono text-slate-500">Dispatch Desk: {currentEntry.agencyPhone}</div>
        </div>

        {/* SOS SMS Action */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Quick Text Distress Message</span>
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="text-amber-700 hover:text-amber-800 font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied to Clipboard' : 'Copy SOS'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-700 font-mono leading-relaxed bg-white p-2.5 rounded border border-slate-200 shadow-inner">
            URGENT SOS: Severe earthquake shaking in progress. Immediate rescue required at current GPS.
          </p>
        </div>

        {/* Life-Safety Rule */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <Shield className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            <strong>Reminder:</strong> If you are experiencing shaking right now, <strong>DROP, COVER, AND HOLD ON</strong> immediately. Do not attempt to run outside while ground motion is active.
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          Return to Seismic Console
        </button>
      </div>
    </div>
  );
};
