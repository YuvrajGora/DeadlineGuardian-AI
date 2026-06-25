import React from 'react';
import Markdown from 'react-markdown';
import { Sparkles, Compass, AlertOctagon, TrendingUp } from 'lucide-react';

interface DailyBriefingProps {
  summary: string;
  completionProbability: number;
  highestImpactTaskTitle?: string;
  recommendations?: string[];
  riskAlerts?: string[];
  productivityInsight?: string;
}

export default function DailyBriefing({
  summary,
  completionProbability,
  highestImpactTaskTitle,
  recommendations = [],
  riskAlerts = [],
  productivityInsight,
}: DailyBriefingProps) {
  return (
    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20" id="daily-briefing-panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-indigo-400 font-display font-semibold uppercase tracking-wider">Daily Briefing</span>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">Status Diagnostic</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-mono text-zinc-500 uppercase">System Intelligence</p>
          <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
          </p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Executive Overview</h3>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4.5">
            <div className="markdown-body text-sm text-zinc-300 leading-relaxed font-sans prose prose-zinc prose-invert max-w-none">
              <Markdown>{summary || "No document loaded yet. Please drop project guidelines or syllabus above to trigger your AI chief-of-staff briefing!"}</Markdown>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Highest Impact Focus Task */}
          {highestImpactTaskTitle && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-indigo-400/10 group-hover:scale-110 transition-transform">
                <Compass className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Top Priority Task</p>
              <h4 className="text-xs font-semibold text-white mt-1.5 line-clamp-2 leading-snug">{highestImpactTaskTitle}</h4>
              <p className="text-[10px] text-zinc-400 mt-1">
                Tackle this to unblock downstream dependencies.
              </p>
            </div>
          )}

          {/* Productivity Insight */}
          {productivityInsight && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-1 text-indigo-400 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Aesthetic Insight</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{productivityInsight}"
              </p>
            </div>
          )}
        </div>

        {/* Recommendations & Risks Row */}
        {(recommendations.length > 0 || riskAlerts.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
            {/* Recommendations checklist */}
            {recommendations.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">AI Recommended Next Actions</p>
                <ul className="space-y-1">
                  {recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span className="line-clamp-2">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk Alerts */}
            {riskAlerts.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">Timeline Overlaps & Threats</p>
                <ul className="space-y-1">
                  {riskAlerts.map((alert, idx) => (
                    <li key={idx} className="text-xs text-rose-300 leading-relaxed flex items-start gap-1.5">
                      <span className="text-rose-500 shrink-0 mt-0.5">•</span>
                      <span className="line-clamp-2">{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
