import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  CheckSquare, 
  Clock, 
  CalendarDays, 
  AlertTriangle, 
  GitFork, 
  Compass, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Info, 
  Zap,
  Activity,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Task, MissionControlData } from '../types';
import { DEMO_DATASETS } from '../demoData';

interface MissionControlProps {
  tasks: Task[];
  missionData: MissionControlData | null;
  isLoading: boolean;
  onLoadDemo?: (demoId: string) => void;
}

export default function MissionControl({ tasks, missionData, isLoading, onLoadDemo }: MissionControlProps) {
  const [completedDeliverables, setCompletedDeliverables] = useState<Record<string, boolean>>({});

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 space-y-8 animate-pulse" id="mission-control-skeleton">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-zinc-800 rounded"></div>
            <div className="h-8 w-64 bg-zinc-800 rounded"></div>
          </div>
          <div className="h-12 w-32 bg-zinc-800 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-zinc-900 rounded-xl md:col-span-2"></div>
          <div className="h-48 bg-zinc-900 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-zinc-900 rounded-xl"></div>
          <div className="h-64 bg-zinc-900 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Blank/Empty State (No document uploaded or demo loaded yet)
  if (!missionData) {
    return (
      <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-10 text-center space-y-6 flex flex-col items-center justify-center relative overflow-hidden" id="mission-control-empty">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 to-transparent pointer-events-none"></div>
        <div className="bg-indigo-500/5 border border-indigo-500/15 p-4 rounded-full relative">
          <Compass className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="max-w-md space-y-2 relative">
          <h3 className="text-lg font-bold text-zinc-100 font-display">Mission Control Offline</h3>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
            Your AI Chief of Staff requires a document ingestion (or Sandbox Demo seed) to formulate a global strategic execution plan.
          </p>
        </div>
        <div className="text-[10px] font-mono text-zinc-600 bg-zinc-950 px-3.5 py-1.5 rounded-md border border-zinc-900">
          STATUS: WAITING_FOR_COMMAND
        </div>

        {/* Try Demo Cards in Mission Control empty state */}
        {onLoadDemo && (
          <div className="mt-8 border-t border-white/5 pt-8 w-full max-w-4xl relative z-10">
            <div className="flex flex-col items-center gap-1.5 mb-6 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase">Interactive Demo</span>
              </div>
              <h4 className="text-sm font-bold text-white">Bypass Setup: Try Pre-seeded Templates</h4>
              <p className="text-xs text-zinc-400 max-w-md">
                Load a realistic dataset to immediately test the system\'s analytical outputs, mission diagnostics, and schedule deconfliction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {DEMO_DATASETS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => onLoadDemo(demo.id)}
                  className="bg-[#0c0c0c] border border-white/10 hover:border-indigo-500/30 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between text-left group cursor-pointer shadow-lg hover:shadow-indigo-500/5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none rounded-bl-full" />
                  <div>
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400">
                      {demo.badge}
                    </span>
                    <h5 className="font-display font-bold text-xs text-white mt-2 group-hover:text-indigo-400 transition-colors">
                      {demo.name}
                    </h5>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                      {demo.description}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono text-indigo-400 mt-4 font-bold flex items-center gap-1">
                    Load Demo <ArrowRight className="w-3 h-3 text-indigo-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const toggleDeliverable = (item: string) => {
    setCompletedDeliverables(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const getRiskColor = (level: "Safe" | "Warning" | "Critical" | string) => {
    switch (level) {
      case 'Critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const getRiskBadgeColor = (level: "Safe" | "Warning" | "Critical" | string) => {
    switch (level) {
      case 'Critical': return 'bg-rose-500 text-rose-100';
      case 'Warning': return 'bg-amber-500 text-amber-950';
      default: return 'bg-emerald-500 text-emerald-950';
    }
  };

  const criticalTasksCount = tasks.filter(t => t.riskLevel === 'Critical').length;
  const topRiskFactor = missionData.riskFactors?.[0] ?? { factor: "No critical risks identified yet.", severity: "Low", mitigation: "Proceed as planned." };
  const highestImpactTask = tasks.length > 0 
    ? tasks.reduce((prev, current) => (prev.estimatedHours > current.estimatedHours) ? prev : current)
    : null;
  
  const missionStatus = criticalTasksCount > 0 
    ? { text: "CRITICAL: PIPELINE RISK ACTIVE", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" }
    : { text: "ACTIVE: TACTICAL ROUTE SECURED", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };

  const recommendedNextAction = tasks.filter(t => t.status === 'pending')
    .sort((a, b) => a.deadline.localeCompare(b.deadline))[0]?.title 
    ?? "Review Syllabus or upload custom briefs for the next project milestone.";

  return (
    <div className="space-y-8 animate-fade-in" id="mission-control-dashboard-section">
      {/* Executive Briefing Dashboard Card */}
      <div className="bg-[#0c0c0d] border border-indigo-500/15 rounded-2xl p-6 relative overflow-hidden shadow-xl" id="mc-executive-briefing-card">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-black text-xs text-zinc-100 uppercase tracking-widest">Executive Intelligence Briefing</h3>
              <p className="text-[9px] font-mono text-indigo-400 mt-0.5 font-bold">CHIEF OF STAFF OPERATIONS REPORT</p>
            </div>
          </div>

          <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border uppercase self-start sm:self-auto ${missionStatus.color}`}>
            {missionStatus.text}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Item 1: Primary Objective */}
          <div className="bg-zinc-950/50 border border-white/5 p-4 rounded-xl space-y-2 text-left">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">🎯 Primary Objective</span>
            <p className="text-zinc-200 text-xs font-sans font-medium leading-relaxed line-clamp-3">
              "{missionData.missionObjective}"
            </p>
          </div>

          {/* Item 2: Top Risk */}
          <div className="bg-zinc-950/50 border border-white/5 p-4 rounded-xl space-y-2 text-left">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Top Risk & Mitigation
            </span>
            <p className="text-zinc-200 text-xs font-sans font-bold leading-tight truncate">{topRiskFactor.factor}</p>
            <p className="text-zinc-400 text-[11px] font-sans leading-normal line-clamp-2 italic border-t border-white/5 pt-1.5">
              Mitigation: {topRiskFactor.mitigation}
            </p>
          </div>

          {/* Item 3: Highest Impact Task */}
          <div className="bg-zinc-950/50 border border-white/5 p-4 rounded-xl space-y-2 text-left">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">🔥 Highest Impact Task</span>
            <p className="text-zinc-200 text-xs font-sans font-bold leading-tight truncate">{highestImpactTask ? highestImpactTask.title : "N/A"}</p>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-zinc-400">
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5 font-semibold text-zinc-300">{highestImpactTask ? highestImpactTask.effortLevel : "Low"} Effort</span>
              <span>{highestImpactTask ? highestImpactTask.estimatedHours : 0} hrs</span>
            </div>
          </div>

          {/* Item 4: Recommended Next Action */}
          <div className="bg-zinc-950/50 border border-white/5 p-4 rounded-xl space-y-2 text-left">
            <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold block flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              Recommended Next Action
            </span>
            <p className="text-zinc-200 text-xs font-sans font-medium leading-relaxed line-clamp-3">
              Execute: <strong className="text-indigo-400">{recommendedNextAction}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Overview Block with Progress Dial */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-indigo-300">
                AI Chief of Staff Strategic Briefing
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">
              Mission Control Center
            </h2>
            
            <div className="space-y-2 border-l-2 border-indigo-500/20 pl-4 py-1">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Primary Objective</p>
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed font-sans font-medium">
                "{missionData.missionObjective}"
              </p>
            </div>
          </div>

          {/* High-Fidelity Dial Gauge */}
          <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 border border-white/5 rounded-2xl self-center shrink-0 w-full sm:w-auto sm:px-8">
            <div className="relative flex items-center justify-center w-28 h-28">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#1c1917"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8" /* Make it a 3/4 gauge */
                  strokeLinecap="round"
                  className="origin-center rotate-45"
                />
                {/* Animated progress arc */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#6366f1"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (188.4 * missionData.successProbability) / 100}
                  strokeLinecap="round"
                  className="origin-center rotate-45"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (188.4 * missionData.successProbability) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black font-display text-white tracking-tight">
                  {missionData.successProbability}%
                </span>
                <p className="text-[8px] font-mono font-bold uppercase tracking-wider text-indigo-400 mt-0.5">
                  SUCCESS PROBABILITY
                </p>
              </div>
            </div>
            
            <div className="mt-3 text-center space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-400">
                {missionData.successProbability >= 80 ? '🟢 TIMELINE STRENGTH: EXCELLENT' : 
                 missionData.successProbability >= 50 ? '🟡 TIMELINE STRENGTH: MODERATE' : 
                 '🔴 TIMELINE STRENGTH: CRITICAL'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Strategy, Key Deliverables, Effort & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recommended Execution Strategy (Markdown sequence of phases) */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Compass className="w-4 h-4 text-indigo-400" />
            <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Recommended Execution Strategy</h3>
          </div>
          
          <div className="text-zinc-300 text-xs leading-relaxed font-sans prose prose-invert prose-indigo max-w-none">
            <Markdown>{missionData.recommendedExecutionStrategy}</Markdown>
          </div>
        </div>

        {/* Deliverables summary checklist & Effort level */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Key Deliverables Checklist</h3>
            </div>
            
            <ul className="space-y-3">
              {missionData.keyDeliverables.map((item, index) => (
                <li 
                  key={index}
                  onClick={() => toggleDeliverable(item)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    completedDeliverables[item] 
                      ? 'bg-zinc-950/40 border-zinc-900/60 opacity-60' 
                      : 'bg-zinc-950 hover:bg-zinc-900/60 border-white/5'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                    completedDeliverables[item] 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'border-zinc-700 hover:border-zinc-500'
                  }`}>
                    {completedDeliverables[item] && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs font-medium font-sans select-none leading-normal ${
                    completedDeliverables[item] ? 'line-through text-zinc-500' : 'text-zinc-200'
                  }`}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Effort Summary Block */}
          <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Workload & Effort Analysis</span>
            </div>
            <p className="text-zinc-300 text-xs font-sans leading-relaxed">
              {missionData.estimatedEffort}
            </p>
          </div>
        </div>
      </div>

      {/* Critical Path & Timeline Analysis */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-indigo-400" />
            <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Critical Path Dependencies</h3>
          </div>
          <div className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 px-2.5 py-1 border border-indigo-500/10 rounded-md">
            SEQUENCE GRAPH ACTIVE
          </div>
        </div>

        {/* Visual Critical Path sequence map */}
        <div className="relative">
          {missionData.criticalPathDependencies.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No sequential path constraints detected. Tasks can be completed concurrently.</p>
          ) : (
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-start gap-4 md:gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {missionData.criticalPathDependencies.map((dep, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex-1 bg-zinc-950 border border-white/5 p-4 rounded-xl flex items-center gap-3 shadow-lg relative min-w-[200px]">
                    <div className="w-6 h-6 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-200 font-sans line-clamp-1">{dep}</p>
                      <p className="text-[9px] font-mono text-zinc-500 mt-0.5">Prerequisite Phase</p>
                    </div>
                  </div>
                  {idx < missionData.criticalPathDependencies.length - 1 && (
                    <div className="flex items-center justify-center shrink-0 self-center my-1 md:my-0">
                      <ChevronRight className="w-5 h-5 text-indigo-500 transform rotate-90 md:rotate-0" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Timeline Analysis paragraph */}
        <div className="p-4.5 bg-zinc-950 border border-white/5 rounded-xl flex gap-3">
          <CalendarDays className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Syllabus / Deadline Analysis</span>
            <p className="text-zinc-300 text-xs font-sans leading-relaxed">
              {missionData.deadlineAnalysis}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Factors & Recommended Mitigations */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <AlertTriangle className="w-4 h-4 text-indigo-400" />
          <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Risk Factors & Recommended Mitigations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missionData.riskFactors.map((risk, index) => (
            <div key={index} className="bg-zinc-950 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-zinc-200 font-sans leading-tight line-clamp-2">{risk.factor}</h4>
                  <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${
                    risk.severity === 'High' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                    risk.severity === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  }`}>
                    {risk.severity} Severity
                  </span>
                </div>
              </div>
              <div className="border-t border-white/5 pt-3 space-y-1 bg-white/[0.01] -mx-5 -mb-5 p-5 rounded-b-2xl">
                <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Mitigation Strategy</span>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                  {risk.mitigation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Risk Reasonings Explanations Section */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Gemini Risk Diagnostics Reasoning</h3>
        </div>
        
        <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-xl">
          For every extracted deliverable, our AI Chief of Staff evaluates the complexity, prerequisites, and timeline closeness to output a custom risk tier. Examine the Gemini reasoning below:
        </p>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-zinc-950 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-zinc-100">{task.title}</h4>
                  <span className="text-[9px] font-mono text-zinc-500">[{task.category}]</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal line-clamp-1">{task.description}</p>
                <div className="flex items-center gap-1.5 mt-2 bg-[#0d0d0d] border border-white/5 p-2 rounded-lg">
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <p className="text-[11px] text-indigo-300 font-sans italic font-medium leading-normal">
                    " {task.riskExplanation} "
                  </p>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col items-end gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 border-white/5 pt-2.5 sm:pt-0 mt-1 sm:mt-0">
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskColor(task.riskLevel)}`}>
                  {task.riskLevel} Risk
                </span>
                <span className="text-[9px] font-mono text-zinc-500">Due: {task.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
