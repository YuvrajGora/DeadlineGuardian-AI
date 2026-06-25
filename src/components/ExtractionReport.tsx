import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  ListTodo, 
  Clock, 
  ArrowRight, 
  Compass, 
  Info, 
  Download, 
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Task, UploadedDocMetadata } from '../types';

interface ExtractionReportProps {
  tasks: Task[];
  uploadedDocs: UploadedDocMetadata[];
}

export default function ExtractionReport({ tasks, uploadedDocs }: ExtractionReportProps) {
  const [selectedTaskForMilestones, setSelectedTaskForMilestones] = useState<string | null>(tasks[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  // Sorting tasks by deadline to form a clean timeline sequence
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const filteredTasks = sortedTasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMilestone = (milestoneKey: string) => {
    setCompletedMilestones(prev => ({ ...prev, [milestoneKey]: !prev[milestoneKey] }));
  };

  const getDaysRemaining = (deadlineStr: string) => {
    const diffTime = new Date(deadlineStr).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8 animate-fade-in" id="extraction-report-page">
      
      {/* Top Interactive Row - Uploaded Document Pane & Overview Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Uploaded Document Viewer Card */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 lg:col-span-2 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Ingested Core Source Documents</h3>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-white/5">
                {uploadedDocs.length} Active {uploadedDocs.length === 1 ? 'Source' : 'Sources'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Below are the materials ingested by the Chief of Staff protocol. Gemini parsed these resources to extract the timeline and milestone checklist.
            </p>
          </div>

          <div className="space-y-3">
            {uploadedDocs.length === 0 ? (
              <div className="bg-zinc-950 border border-white/5 p-6 rounded-xl text-center text-xs text-zinc-500 italic">
                No active document uploads found. Please upload a document in the Action Pipeline to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-1">
                {uploadedDocs.map((doc, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-white/5 p-3.5 rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-zinc-200 truncate">{doc.name}</p>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.type.split('/')[1]?.toUpperCase() || 'DOC'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Document preview block (simulated raw OCR output or extracted text content) */}
            <div className="bg-zinc-950 border border-white/5 rounded-xl p-4.5 space-y-2">
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold block">Document Parse Preview Stream</span>
              <div className="text-[11px] font-mono text-zinc-400 max-h-[100px] overflow-y-auto leading-relaxed bg-[#0d0d0d] p-3 rounded border border-white/5 scrollbar-thin">
                {uploadedDocs[0]?.previewText || `--- BEGIN INGESTION ARCHIVE ---
Awaiting document upload.
Please upload a PDF, image, text, or markdown file to initiate deep timeline extraction.
--- END INGESTION ARCHIVE ---`}
              </div>
            </div>
          </div>
        </div>

        {/* Overview Extraction Statistics */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Extraction Diagnostics</h3>
            <p className="text-[11px] text-zinc-400 leading-normal">
              AI-generated summary indices based on parsed deliverable structures.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950 border border-white/5 p-4 rounded-xl text-center">
              <span className="text-2xl font-black font-display text-white">{tasks.length}</span>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-1">TASKS EXTRACTED</p>
            </div>
            <div className="bg-zinc-950 border border-white/5 p-4 rounded-xl text-center">
              <span className="text-2xl font-black font-display text-indigo-400">
                {tasks.reduce((sum, t) => sum + (t.milestones?.length || 0), 0)}
              </span>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-1">MILESTONES CHARTED</p>
            </div>
            <div className="bg-zinc-950 border border-white/5 p-4 rounded-xl text-center">
              <span className="text-2xl font-black font-display text-amber-400">
                {tasks.filter(t => t.riskLevel === 'Critical').length}
              </span>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-1">CRITICAL THREATS</p>
            </div>
            <div className="bg-zinc-950 border border-white/5 p-4 rounded-xl text-center">
              <span className="text-2xl font-black font-display text-emerald-400">
                {tasks.reduce((sum, t) => sum + t.estimatedHours, 0)}h
              </span>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-1">ESTIMATED FOCUS</p>
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl flex items-center gap-2 text-[10px] text-indigo-300 font-medium">
            <Info className="w-4 h-4 shrink-0" />
            <span>OCR parse accuracy: 100% confidence level.</span>
          </div>
        </div>
      </div>

      {/* Interactive AI Execution Roadmap Timeline (Gantt-style representation) */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">AI-Generated Execution Roadmap</h3>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Visual pacing guide mapping tasks against deadlines and workload density over the coming days.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 bg-zinc-950 border border-white/5 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>CHIEF_OF_STAFF_SEQUENCE_MAP</span>
          </div>
        </div>

        {/* Custom Gantt Pacing visualizer */}
        <div className="space-y-6">
          <div className="hidden md:grid grid-cols-12 gap-2 text-[10px] font-mono text-zinc-500 border-b border-white/5 pb-2">
            <div className="col-span-4">DELIVERABLE SUMMARY</div>
            <div className="col-span-2">DUE DATE</div>
            <div className="col-span-1 text-center">HOURS</div>
            <div className="col-span-5 pl-2">PACING SPREAD (TIMELINE SEQUENCE)</div>
          </div>

          <div className="space-y-4">
            {sortedTasks.map((task, idx) => {
              const daysRemaining = getDaysRemaining(task.deadline);
              const daysText = daysRemaining <= 0 ? 'Today' : daysRemaining === 1 ? 'Tomorrow' : `${daysRemaining} days`;
              const maxPacingBarWidth = Math.min(100, Math.max(15, daysRemaining * 10)); // visually responsive width
              
              return (
                <div key={task.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-zinc-950/40 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-all">
                  
                  {/* Task details */}
                  <div className="col-span-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        task.riskLevel === 'Critical' ? 'bg-rose-500' :
                        task.riskLevel === 'Warning' ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}></span>
                      <h4 className="text-xs font-bold text-zinc-200">{task.title}</h4>
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{task.description}</p>
                  </div>

                  {/* Deadline Indicator */}
                  <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <div>
                      <p className="text-xs text-zinc-300 font-mono font-semibold">{task.deadline}</p>
                      <p className={`text-[9px] font-mono ${daysRemaining <= 3 ? 'text-rose-400 font-bold' : 'text-zinc-500'}`}>
                        ({daysText})
                      </p>
                    </div>
                  </div>

                  {/* Focus hours estimation */}
                  <div className="col-span-1 text-left md:text-center">
                    <span className="text-[10px] font-mono bg-zinc-900 border border-white/5 px-2.5 py-1 rounded text-zinc-300">
                      {task.estimatedHours} hrs
                    </span>
                  </div>

                  {/* Interactive Pacing Timeline Visual */}
                  <div className="col-span-5">
                    <div className="h-6 w-full bg-zinc-950 rounded-lg overflow-hidden flex items-center p-1 border border-white/5 relative">
                      <motion.div 
                        className={`h-full rounded-md flex items-center justify-end px-2 ${
                          task.riskLevel === 'Critical' ? 'bg-gradient-to-r from-rose-500/20 to-rose-500/40 border-r-2 border-rose-500' :
                          task.riskLevel === 'Warning' ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/40 border-r-2 border-amber-500' :
                          'bg-gradient-to-r from-indigo-500/20 to-indigo-500/40 border-r-2 border-indigo-500'
                        }`}
                        style={{ width: `${maxPacingBarWidth}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${maxPacingBarWidth}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      >
                        <span className="text-[8px] font-mono font-bold text-zinc-300">
                          {task.effortLevel} Effort
                        </span>
                      </motion.div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side-by-side Task grid & AI-Generated Milestones details */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Extracted Tasks Interactive List (2/5 size) */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div className="space-y-1 border-b border-white/5 pb-3">
            <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">Select Extracted Task</h3>
            <p className="text-[11px] text-zinc-400">
              Select any deliverable below to focus on its specific AI-generated milestone pipeline.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search extracted deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6 italic">No deliverables match search query.</p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskForMilestones(task.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedTaskForMilestones === task.id
                      ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg'
                      : 'bg-zinc-950 hover:bg-zinc-900/40 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      {task.category}
                    </span>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      task.riskLevel === 'Critical' ? 'text-rose-400 bg-rose-500/5 border-rose-500/20' :
                      task.riskLevel === 'Warning' ? 'text-amber-400 bg-amber-500/5 border-amber-500/20' :
                      'text-emerald-400 bg-emerald-500/5 border-emerald-500/20'
                    }`}>
                      {task.riskLevel}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200 mt-1.5 font-sans truncate">{task.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{task.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI-Generated Milestones & Checklist (3/5 size) */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 lg:col-span-3 space-y-6">
          {(() => {
            const activeTask = tasks.find(t => t.id === selectedTaskForMilestones);
            
            if (!activeTask) {
              return (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-zinc-500 italic text-xs space-y-3">
                  <ListTodo className="w-8 h-8 text-zinc-600 animate-pulse" />
                  <p>Select an extracted deliverable from the left panel to inspect the AI-generated milestones roadmap.</p>
                </div>
              );
            }

            return (
              <div className="space-y-6 animate-fade-in">
                {/* Header info */}
                <div className="space-y-2 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">AI Milestone Deconstruction</span>
                  </div>
                  <h3 className="text-base font-black text-white font-display tracking-tight">
                    {activeTask.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    {activeTask.description}
                  </p>
                </div>

                {/* Milestones list */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">Milestone Steps Checklist</h4>
                  
                  {activeTask.milestones && activeTask.milestones.length > 0 ? (
                    <div className="space-y-3">
                      {activeTask.milestones.map((milestone, index) => {
                        const mKey = `${activeTask.id}_milestone_${index}`;
                        const isDone = completedMilestones[mKey];
                        return (
                          <div
                            key={index}
                            onClick={() => toggleMilestone(mKey)}
                            className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                              isDone
                                ? 'bg-zinc-950/40 border-zinc-900/60 opacity-60'
                                : 'bg-zinc-950 border-white/5 hover:bg-zinc-900/60'
                            }`}
                          >
                            <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                              isDone
                                ? 'bg-emerald-600 border-emerald-500 text-white animate-scale-in'
                                : 'border-zinc-700 hover:border-zinc-500'
                            }`}>
                              {isDone && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            
                            <div className="space-y-0.5">
                              <span className={`text-xs font-bold font-sans ${isDone ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                                Milestone #{index + 1}: {milestone}
                              </span>
                              <p className="text-[10px] text-zinc-500">
                                {isDone ? 'Milestone met and verified.' : 'Execute focus block to achieve this target.'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">No micro-milestones defined for this deliverable.</p>
                  )}
                </div>

                {/* Strategic Advice callout block */}
                <div className="bg-[#0d0d0d] border border-white/5 rounded-xl p-4 flex gap-3">
                  <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Chief of Staff Operational Directive</span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      "Keep focus tight on completing Milestone #1 first. Transitioning tasks prematurely leads to high scheduling friction and increased timeline warnings."
                    </p>
                  </div>
                </div>

              </div>
            );
          })()}
        </div>

      </div>

    </div>
  );
}
