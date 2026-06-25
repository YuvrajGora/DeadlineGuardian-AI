import React from 'react';
import { Task } from '../types';
import { AlertTriangle, ShieldCheck, Zap, Activity, Clock, Flame } from 'lucide-react';

interface AnalyticsSectionProps {
  tasks: Task[];
  completionProbability: number;
}

export default function AnalyticsSection({ tasks, completionProbability }: AnalyticsSectionProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const totalCompleted = completedTasks.length;

  const criticalCount = pendingTasks.filter((t) => t.riskLevel === 'Critical').length;
  const warningCount = pendingTasks.filter((t) => t.riskLevel === 'Warning').length;
  const safeCount = pendingTasks.filter((t) => t.riskLevel === 'Safe').length;

  const totalHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const pendingHours = pendingTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const completedHours = completedTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

  const highEffortHours = pendingTasks
    .filter((t) => t.effortLevel === 'High')
    .reduce((sum, t) => sum + t.estimatedHours, 0);
  const mediumEffortHours = pendingTasks
    .filter((t) => t.effortLevel === 'Medium')
    .reduce((sum, t) => sum + t.estimatedHours, 0);
  const lowEffortHours = pendingTasks
    .filter((t) => t.effortLevel === 'Low')
    .reduce((sum, t) => sum + t.estimatedHours, 0);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionProbability / 100) * circumference;

  let healthSummary = "Timeline Safe";
  let healthDesc = "Your commitments are balanced and manageable.";
  let healthColor = "text-emerald-400";
  let healthBorder = "border-emerald-500/20";
  let healthBg = "bg-emerald-500/5";

  if (criticalCount > 0) {
    healthSummary = "Timeline Under Threat";
    healthDesc = `${criticalCount} task(s) require immediate deconfliction.`;
    healthColor = "text-rose-400";
    healthBorder = "border-rose-500/20";
    healthBg = "bg-rose-500/5";
  } else if (warningCount > 1 || pendingHours > 30) {
    healthSummary = "High Workload Accumulation";
    healthDesc = "Workload piling up. Activate Crisis Mode deconfliction.";
    healthColor = "text-amber-400";
    healthBorder = "border-amber-500/20";
    healthBg = "bg-amber-500/5";
  }

  return (
    <div className="grid grid-cols-1 gap-6 w-full" id="analytics-section-grid">
      {/* 1. Completion Probability Dial */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-white/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-zinc-600">
          <Activity className="w-4 h-4" />
        </div>
        
        <h3 className="font-display font-semibold text-xs text-zinc-400 mb-4 uppercase tracking-widest">Timeline Reliability</h3>
        
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-white/5"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-indigo-500/10"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-indigo-500"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2.5xl font-mono font-bold text-white tracking-tight">
              {completionProbability}%
            </span>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">Confidence</span>
          </div>
        </div>

        <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed font-mono">
          Confidence is calculated based on effort levels and pending workload.
        </p>
      </div>

      {/* 2. Risk Grid Stats */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 relative overflow-hidden">
        <div>
          <h3 className="font-display font-semibold text-xs text-zinc-400 mb-4 uppercase tracking-widest">Deadline Risks</h3>
          
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {/* Critical */}
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl text-center">
              <AlertTriangle className="w-4 h-4 text-rose-500 mx-auto mb-1.5" />
              <p className="text-base font-mono font-bold text-rose-400">{criticalCount}</p>
              <p className="text-[9px] text-zinc-500 font-semibold tracking-wider uppercase">Critical</p>
            </div>

            {/* Warning */}
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl text-center">
              <AlertTriangle className="w-4 h-4 text-amber-500 mx-auto mb-1.5" />
              <p className="text-base font-mono font-bold text-amber-400">{warningCount}</p>
              <p className="text-[9px] text-zinc-500 font-semibold tracking-wider uppercase">Warning</p>
            </div>

            {/* Safe */}
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-base font-mono font-bold text-emerald-400">{safeCount}</p>
              <p className="text-[9px] text-zinc-500 font-semibold tracking-wider uppercase">Safe</p>
            </div>
          </div>
        </div>

        {/* Diagnosis Card */}
        <div className={`border ${healthBorder} ${healthBg} p-3 rounded-xl flex items-start gap-2.5`}>
          <Flame className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${healthColor}`} />
          <div className="text-left">
            <p className={`text-xs font-semibold ${healthColor}`}>{healthSummary}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">{healthDesc}</p>
          </div>
        </div>
      </div>

      {/* 3. Workload Effort Breakdown */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-xs text-zinc-400 uppercase tracking-widest">Capacity load</h3>
            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              {pendingHours} hrs left
            </span>
          </div>

          <div className="space-y-3">
            {/* High Effort */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-rose-500" /> High Effort</span>
                <span className="text-zinc-300">{highEffortHours} hrs</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full" 
                  style={{ width: `${totalHours ? (highEffortHours / totalHours) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium Effort */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Medium Effort</span>
                <span className="text-zinc-300">{mediumEffortHours} hrs</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${totalHours ? (mediumEffortHours / totalHours) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Low Effort */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-500" /> Low Effort</span>
                <span className="text-zinc-300">{lowEffortHours} hrs</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${totalHours ? (lowEffortHours / totalHours) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Task progress metrics footer */}
        <div className="border-t border-white/5 pt-3.5 mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 text-left">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-600" />
            <span>Tasks: <span className="text-white font-semibold">{totalCompleted}/{totalTasks}</span></span>
          </div>
          <div>
            Hours Done: <span className="text-white font-semibold">{completedHours}/{totalHours}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
