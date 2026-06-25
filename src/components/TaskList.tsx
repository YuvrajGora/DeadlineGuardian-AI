import React, { useState } from 'react';
import { Task } from '../types';
import { 
  Calendar, 
  Zap, 
  CheckSquare, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown,
  Plus,
  CheckCircle,
  Layers
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (taskId: string, completed: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenManualModal: () => void;
}

type SortBy = 'deadline' | 'effort' | 'hours';
type FilterCategory = 'all' | 'Assignment' | 'Project Brief' | 'Action Item' | 'Milestone';
type FilterRisk = 'all' | 'Safe' | 'Warning' | 'Critical';

export default function TaskList({ tasks, onToggleStatus, onDeleteTask, onOpenManualModal }: TaskListProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterRisk, setFilterRisk] = useState<FilterRisk>('all');
  const [sortBy, setSortBy] = useState<SortBy>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleExpand = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const getRiskStyles = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          dot: 'bg-rose-500',
          text: 'text-rose-400',
        };
      case 'Warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          dot: 'bg-amber-500',
          text: 'text-amber-400',
        };
      case 'Safe':
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          dot: 'bg-emerald-500',
          text: 'text-emerald-400',
        };
    }
  };

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchRisk = filterRisk === 'all' || task.riskLevel === filterRisk;
    return matchCategory && matchRisk;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let valA: any = a[sortBy === 'deadline' ? 'deadline' : sortBy === 'hours' ? 'estimatedHours' : 'effortLevel'];
    let valB: any = b[sortBy === 'deadline' ? 'deadline' : sortBy === 'hours' ? 'estimatedHours' : 'effortLevel'];

    if (sortBy === 'effort') {
      const effortMap = { 'Low': 1, 'Medium': 2, 'High': 3 };
      valA = effortMap[a.effortLevel] || 0;
      valB = effortMap[b.effortLevel] || 0;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20" id="task-list-panel">
      {/* List Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h2 className="font-display font-semibold text-base text-white">Active Commitments ({tasks.length})</h2>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">Tactical Schedule Breakdown</p>
          </div>
        </div>
        <button
          onClick={onOpenManualModal}
          className="bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98] shrink-0"
        >
          <Plus className="w-4 h-4 text-indigo-400" />
          Add Task Manually
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 bg-white/[0.01] p-3 rounded-xl border border-white/5">
        {/* Category filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
            className="bg-[#0a0a0a] border border-white/10 text-zinc-300 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500/50 flex-1 cursor-pointer font-sans"
          >
            <option value="all">All Categories</option>
            <option value="Assignment">Assignments</option>
            <option value="Project Brief">Project Briefs</option>
            <option value="Action Item">Action Items</option>
            <option value="Milestone">Milestones</option>
          </select>
        </div>

        {/* Risk filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Risk Level:</span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value as FilterRisk)}
            className="bg-[#0a0a0a] border border-white/10 text-zinc-300 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500/50 flex-1 cursor-pointer font-sans"
          >
            <option value="all">All Risks</option>
            <option value="Safe">Safe</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Sorting selection */}
        <div className="flex items-center gap-2 justify-end">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Sort by:</span>
          <div className="flex bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden text-xs">
            <button
              onClick={() => handleSort('deadline')}
              className={`px-2.5 py-1.5 transition-colors hover:text-white cursor-pointer ${sortBy === 'deadline' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400'}`}
            >
              Deadline
            </button>
            <button
              onClick={() => handleSort('hours')}
              className={`px-2.5 py-1.5 transition-colors hover:text-white cursor-pointer ${sortBy === 'hours' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400'}`}
            >
              Hours
            </button>
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      {sortedTasks.length === 0 ? (
        <div className="border border-white/10 border-dashed rounded-xl p-10 text-center">
          <CheckSquare className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 font-semibold text-sm">No tasks found matching filters</p>
          <p className="text-xs text-zinc-500 mt-1">Try resetting filters or upload a document.</p>
        </div>
      ) : (
        <div className="space-y-2.5 text-left" id="task-list-items-container">
          {sortedTasks.map((task) => {
            const risk = getRiskStyles(task.riskLevel);
            const isCompleted = task.status === 'completed';
            const isExpanded = expandedTask === task.id;

            return (
              <div
                key={task.id}
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                  isCompleted 
                    ? 'border-white/5 bg-white/[0.01] opacity-50' 
                    : isExpanded 
                      ? 'border-white/20 bg-white/[0.04] shadow-lg shadow-black/40' 
                      : 'border-white/10 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.03]'
                }`}
              >
                {/* Main Task Summary Row */}
                <div className="flex items-center justify-between p-4 flex-wrap sm:flex-nowrap gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Toggle Button */}
                    <button
                      onClick={() => onToggleStatus(task.id, !isCompleted)}
                      className="mt-1 text-zinc-500 hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-indigo-400 stroke-[2]" />
                      ) : (
                        <div className="w-5 h-5 rounded border border-white/20 hover:border-indigo-400 transition-colors" />
                      )}
                    </button>

                    {/* Task details brief */}
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-semibold truncate ${isCompleted ? 'line-through text-zinc-500 font-normal' : 'text-white'}`}>
                          {task.title}
                        </h3>
                        <span className="text-[8px] font-mono bg-white/5 border border-white/10 text-zinc-400 px-2 py-0.5 rounded-full">
                          {task.category}
                        </span>
                      </div>
                      
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-sans">{task.description}</p>
                    </div>
                  </div>

                  {/* Task Metrics & Action items */}
                  <div className="flex items-center gap-3 shrink-0 ml-8 sm:ml-0">
                    {/* Confidence Score Badge */}
                    {task.confidenceScore !== undefined && (
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        task.confidenceScore >= 80 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : task.confidenceScore >= 50 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`} title="Calculated from workload, deadline proximity, dependency count, and estimated hours">
                        <span>Confidence: {task.confidenceScore}%</span>
                      </div>
                    )}

                    {/* Risk Badge */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${risk.bg}`}>
                      <span className={`w-1 h-1 rounded-full ${risk.dot}`} />
                      <span>{task.riskLevel}</span>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-1 text-zinc-400 text-xs font-mono">
                      <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                      <span>{task.deadline}</span>
                    </div>

                    {/* Expand/Collapse milestones toggle */}
                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title="View Milestones & Subtasks"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Delete item */}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Commitment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-black/[0.15] p-4 space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">Workload Analysis</p>
                        <div className="flex items-center gap-3 text-zinc-300 flex-wrap">
                          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-indigo-400" /> Effort: {task.effortLevel}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zinc-500" /> Estimated: {task.estimatedHours} hrs</span>
                          {task.confidenceScore !== undefined && (
                            <span className="text-zinc-300 font-mono text-[11px] ml-1">
                              🎯 Confidence: <strong className={
                                task.confidenceScore >= 80 ? 'text-emerald-400' : task.confidenceScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                              }>{task.confidenceScore}%</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">Risk Explanation</p>
                        <p className="text-zinc-300 flex items-center gap-1.5 leading-normal">
                          <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${risk.text}`} />
                          <span>{task.riskExplanation}</span>
                        </p>
                      </div>
                    </div>

                    {/* Milestones checklist */}
                    {task.milestones && task.milestones.length > 0 && (
                      <div className="border-t border-white/5 pt-3 text-left">
                        <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">AI Milestones & Milestones</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {task.milestones.map((milestone, mIdx) => (
                            <div key={mIdx} className="flex items-center gap-2 bg-white/5 border border-white/5 p-2 rounded-lg">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span className="text-zinc-300 truncate">{milestone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dependencies Map */}
                    {task.dependencies && task.dependencies.length > 0 && (
                      <div className="border-t border-white/5 pt-3 text-left">
                        <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">Required Dependencies</p>
                        <div className="flex flex-wrap gap-1.5">
                          {task.dependencies.map((dep, dIdx) => (
                            <span key={dIdx} className="bg-white/5 text-zinc-400 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono">
                              Requires: {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
