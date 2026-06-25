import React, { useState } from 'react';
import { Task } from '../types';
import { X, Calendar, Plus } from 'lucide-react';

interface ManualTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export default function ManualTaskModal({ isOpen, onClose, onSave }: ManualTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Assignment' | 'Project Brief' | 'Action Item' | 'Milestone' | 'Other'>('Assignment');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [effortLevel, setEffortLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [riskLevel, setRiskLevel] = useState<'Safe' | 'Warning' | 'Critical'>('Safe');
  const [riskExplanation, setRiskExplanation] = useState('Standard deadline within safe margin.');
  const [dependenciesInput, setDependenciesInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    const dependenciesList = dependenciesInput
      ? dependenciesInput.split(',').map((d) => d.trim()).filter(Boolean)
      : [];

    const defaultConfidence = riskLevel === 'Critical' ? 45 : riskLevel === 'Warning' ? 75 : 95;

    const newTask: Task = {
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      category,
      deadline,
      effortLevel,
      estimatedHours: Number(estimatedHours) || 1,
      riskLevel,
      riskExplanation: riskExplanation.trim() || 'Manual commitment.',
      dependencies: dependenciesList,
      milestones: [`Draft requirements for ${title}`, `Coordinate milestones`, `Execute deliverable`],
      status: 'pending',
      createdAt: Date.now(),
      confidenceScore: defaultConfidence
    };

    onSave(newTask);
    
    setTitle('');
    setDescription('');
    setCategory('Assignment');
    setDeadline(new Date().toISOString().split('T')[0]);
    setEffortLevel('Medium');
    setEstimatedHours(4);
    setRiskLevel('Safe');
    setRiskExplanation('Standard deadline within safe margin.');
    setDependenciesInput('');

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h2 className="font-display font-semibold text-base text-white">Add Commitment</h2>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">Manual Workspace Logging</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-zinc-300">
          {/* Title */}
          <div className="space-y-1.5 text-left">
            <label className="font-semibold text-zinc-400">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CS101 Term Paper Draft"
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 text-left">
            <label className="font-semibold text-zinc-400">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief summary of requirements..."
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-2 gap-4 text-left">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-400">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="Assignment">Assignment</option>
                <option value="Project Brief">Project Brief</option>
                <option value="Action Item">Action Item</option>
                <option value="Milestone">Milestone</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-400">Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50 cursor-pointer"
              />
            </div>
          </div>

          {/* Grid effort & hours */}
          <div className="grid grid-cols-2 gap-4 text-left">
            {/* Effort Level */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-400">Effort Level</label>
              <select
                value={effortLevel}
                onChange={(e: any) => setEffortLevel(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="Low">Low Effort</option>
                <option value="Medium">Medium Effort</option>
                <option value="High">High Effort</option>
              </select>
            </div>

            {/* Hours */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-400">Estimated Hours</label>
              <input
                type="number"
                min={1}
                max={100}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          {/* Grid risks */}
          <div className="grid grid-cols-2 gap-4 text-left">
            {/* Risk Level */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-400">Risk Level</label>
              <select
                value={riskLevel}
                onChange={(e: any) => setRiskLevel(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="Safe">Safe</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Dependencies */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-400">Prerequisites</label>
              <input
                type="text"
                value={dependenciesInput}
                onChange={(e) => setDependenciesInput(e.target.value)}
                placeholder="Comma separated names"
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          {/* Risk Explanation */}
          <div className="space-y-1.5 text-left">
            <label className="font-semibold text-zinc-400">Risk Explanation</label>
            <input
              type="text"
              value={riskExplanation}
              onChange={(e) => setRiskExplanation(e.target.value)}
              placeholder="e.g. Well within comfort margin"
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 hover:bg-white/5 rounded-xl font-semibold text-zinc-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-display font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
              Commit Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
