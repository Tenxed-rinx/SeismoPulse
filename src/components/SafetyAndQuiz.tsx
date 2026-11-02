import React, { useState } from 'react';
import { SAFETY_QUIZ_QUESTIONS } from '../data/quizData';
import { GLOBAL_HELPLINES, INITIAL_GOBAG_ITEMS } from '../data/safetyHelplines';
import { GoBagItem, HelplineEntry } from '../types/seismic';
import {
  ShieldCheck,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  Copy,
  Check,
  AlertOctagon,
  Flame,
  Home,
  Car,
  Waves,
  Briefcase
} from 'lucide-react';

export const SafetyAndQuiz: React.FC = () => {
  // Sub-tabs: 'quiz' | 'helpline' | 'gobag' | 'protocol'
  const [subTab, setSubTab] = useState<'quiz' | 'helpline' | 'gobag' | 'protocol'>('quiz');

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Go-Bag State
  const [goBagItems, setGoBagItems] = useState<GoBagItem[]>(INITIAL_GOBAG_ITEMS);

  // Helpline Search State
  const [helplineSearch, setHelplineSearch] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [sosCopied, setSosCopied] = useState<boolean>(false);

  // Quiz navigation & scoring
  const currentQ = SAFETY_QUIZ_QUESTIONS[currentQuestionIndex];
  const userSelection = selectedAnswers[currentQ.id];

  const handleSelectOption = (index: number) => {
    if (showExplanation) return; // Locked once answered
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: index }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < SAFETY_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(selectedAnswers[SAFETY_QUIZ_QUESTIONS[currentQuestionIndex + 1]?.id] !== undefined);
    } else {
      setQuizSubmitted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowExplanation(selectedAnswers[SAFETY_QUIZ_QUESTIONS[currentQuestionIndex - 1]?.id] !== undefined);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setQuizSubmitted(false);
  };

  const totalScore = Object.entries(selectedAnswers).reduce((acc, [qId, ansIdx]) => {
    const q = SAFETY_QUIZ_QUESTIONS.find((item) => item.id === Number(qId));
    return acc + (q && q.correctIndex === ansIdx ? 1 : 0);
  }, 0);

  // Go-Bag toggle
  const handleToggleGoBagItem = (id: string) => {
    setGoBagItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedGoBagCount = goBagItems.filter((i) => i.completed).length;
  const goBagPercent = Math.round((completedGoBagCount / goBagItems.length) * 100);

  // Filter Helplines
  const filteredHelplines = GLOBAL_HELPLINES.filter((h) => {
    if (!helplineSearch.trim()) return true;
    const q = helplineSearch.toLowerCase();
    return (
      h.country.toLowerCase().includes(q) ||
      h.disasterAgency.toLowerCase().includes(q) ||
      h.emergencyNumber.includes(q)
    );
  });

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleCopySosMessage = () => {
    const time = new Date().toISOString().substring(0, 19).replace('T', ' ') + ' UTC';
    const message = `EMERGENCY SOS: Earthquake shaking experienced. Need urgent assistance at current GPS coordinates. Time: ${time}.`;
    navigator.clipboard.writeText(message);
    setSosCopied(true);
    setTimeout(() => setSosCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 p-6 text-slate-800 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Strip */}
      <div className="pb-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-rose-700 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Disaster Readiness & Public Safety</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Earthquake Survival Training, Go-Bag & Global Helplines
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Test your survival knowledge with our scored quiz, check off essential go-bag supplies, and access verified emergency dispatch contacts.
          </p>
        </div>

        {/* Sub-nav tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setSubTab('quiz')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              subTab === 'quiz' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Safety Quiz
          </button>
          <button
            type="button"
            onClick={() => setSubTab('gobag')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              subTab === 'gobag' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Emergency Go-Bag ({goBagPercent}%)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('helpline')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              subTab === 'helpline' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Global Helplines
          </button>
          <button
            type="button"
            onClick={() => setSubTab('protocol')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              subTab === 'protocol' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Action Protocols
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: QUIZ */}
      {subTab === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {!quizSubmitted ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
              {/* Progress & Category */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 border-b border-slate-100 pb-3">
                <span>
                  Question <span className="text-amber-700 font-bold">{currentQuestionIndex + 1}</span> of{' '}
                  {SAFETY_QUIZ_QUESTIONS.length}
                </span>
                <span className="capitalize text-slate-700 font-semibold">
                  Topic: {currentQ.category.replace('-', ' ')}
                </span>
              </div>

              {/* Question Statement */}
              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = userSelection === idx;
                  const isCorrect = currentQ.correctIndex === idx;

                  let optionStyle = 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80 text-slate-800';
                  if (showExplanation) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-semibold shadow-xs';
                    } else {
                      optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-amber-50 border-amber-500 text-amber-900 font-semibold shadow-xs';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={showExplanation}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scientific Explanation Reveal */}
              {showExplanation && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs leading-relaxed animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold font-mono">
                    {userSelection === currentQ.correctIndex ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct Assessment!
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Recommended Protocol: Option {String.fromCharCode(65 + currentQ.correctIndex)}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 font-sans leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={handlePrevQuestion}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={userSelection === undefined}
                  onClick={handleNextQuestion}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {currentQuestionIndex === SAFETY_QUIZ_QUESTIONS.length - 1 ? 'Finish & View Score' : 'Next Question'}
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Score Card */
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-5 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center mx-auto text-2xl font-bold font-mono">
                {totalScore}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {totalScore >= 9
                    ? 'Master Seismologist & Disaster Commander'
                    : totalScore >= 7
                    ? 'Well-Prepared Civilian'
                    : 'At-Risk: Review Seismic Protocols'}
                </h2>
                <p className="text-xs font-mono text-slate-600 mt-1">
                  You scored {totalScore} out of {SAFETY_QUIZ_QUESTIONS.length} points ({totalScore * 10}%)
                </p>
              </div>

              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                {totalScore >= 8
                  ? 'Outstanding knowledge! You understand the physics of structural failure, natural tsunami cues, and why Drop, Cover & Hold On saves lives.'
                  : 'Earthquakes give zero warning. Review the action protocols and ensure your family practices Drop, Cover, and Hold On drills biannually.'}
              </p>

              <button
                type="button"
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Safety Assessment</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: GO-BAG CHECKLIST */}
      {subTab === 'gobag' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
                  72-Hour Evacuation Readiness
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Earthquake Go-Bag Supplies Checklist
                </h2>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-slate-500 font-semibold">Readiness Score:</span>{' '}
                <span className="text-amber-700 font-bold text-sm tabular-nums">{goBagPercent}%</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${goBagPercent}%` }}
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every household member should have an accessible backpack stored near an exterior exit door.
              Check off your assembled supplies below:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goBagItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleToggleGoBagItem(item.id)}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  item.completed
                    ? 'bg-white border-emerald-500 text-slate-900 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700 shadow-xs'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                    item.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <div className={`text-xs font-bold ${item.completed ? 'text-slate-900' : 'text-slate-700'}`}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GLOBAL HELPLINES */}
      {subTab === 'helpline' && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Quick SOS Bar */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-rose-900">Quick SOS Distress Dispatch Template</div>
                <p className="text-[11px] text-rose-700">
                  Copies a standardized text message with current UTC timestamp for low-signal emergency SMS dispatch.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopySosMessage}
              className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs"
            >
              {sosCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{sosCopied ? 'Template Copied!' : 'Copy SOS Template'}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search country, disaster agency or phone..."
              value={helplineSearch}
              onChange={(e) => setHelplineSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
            />
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHelplines.map((item) => (
              <div
                key={item.code}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{item.flag}</span>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{item.code}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.country}</h3>
                  <div className="text-xs text-slate-600 leading-snug">{item.disasterAgency}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Emergency Line:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(item.emergencyNumber)}
                      className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.emergencyNumber}</span>
                      {copiedNumber === item.emergencyNumber ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Agency Dispatch:</span>
                    <span className="text-slate-800 font-semibold">{item.agencyPhone}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 italic leading-tight pt-1">
                    {item.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ACTION PROTOCOLS */}
      {subTab === 'protocol' && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Indoors: Home & Office</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>DROP</strong> down onto your hands and knees before the ground motion knocks you down.</li>
              <li><strong>COVER</strong> your head and neck under a sturdy table or desk.</li>
              <li><strong>HOLD ON</strong> to your shelter with one hand and move with it if it shifts.</li>
              <li>Stay away from exterior glass windows, mirrors, bookcases, and hanging chandeliers.</li>
            </ul>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Driving in an Automobile</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Gradually pull over to the shoulder safely away from overpasses, bridges, and power lines.</li>
              <li>Engage the parking handbrake firmly and leave your seatbelt fastened.</li>
              <li>Stay inside the vehicle until shaking stops; the car's suspension absorbs shock waves.</li>
              <li>Turn on the car radio to public broadcast channels (NOAA or AM radio) for route guidance.</li>
            </ul>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <Waves className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Coastal / Tsunami Warning Zones</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>If shaking lasts &gt; 20 seconds, assume a destructive tsunami has been generated.</li>
              <li>Do NOT wait for municipal sirens or text alerts—evacuate immediately on foot.</li>
              <li>Head inland or climb at least 30 meters (100 feet) above sea level immediately.</li>
              <li>A rapidly receding ocean is a dangerous warning sign: the tsunami crest will follow shortly.</li>
            </ul>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Post-Quake Fire & Utility Isolation</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>NEVER strike matches, lighters, or operate light switches; sparks ignite leaked gas.</li>
              <li>If you smell rotten eggs (mercaptan gas odor) or hear hissing, turn off the main gas valve.</li>
              <li>Extinguish small fires immediately with a dry-chemical fire extinguisher.</li>
              <li>Listen for aftershocks; inspect chimneys and brick walls before re-entering buildings.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
