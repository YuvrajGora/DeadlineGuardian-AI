import React, { useState, useEffect } from 'react';
import { 
  User,
  initAuth, 
  googleSignIn, 
  logout, 
  getUserTasks, 
  saveUserTask, 
  deleteUserTask, 
  toggleTaskStatus, 
  saveMultipleTasks,
  saveMissionControl,
  getMissionControl,
  saveUploadedDocs,
  getUploadedDocs,
  saveExecutiveBriefing,
  getExecutiveBriefing,
  saveCrisisPlan,
  getCrisisPlan,
  saveUserPreferences,
  getUserPreferences,
  isFirebaseAvailable,
  getFirebaseProjectId
} from './lib/firebase';
import { Task, DailyBriefing as BriefingType, MissionControlData, UploadedDocMetadata } from './types';
import Navbar from './components/Navbar';
import UploadZone from './components/UploadZone';
import AnalyticsSection from './components/AnalyticsSection';
import DailyBriefing from './components/DailyBriefing';
import TaskList from './components/TaskList';
import CrisisMode from './components/CrisisMode';
import ManualTaskModal from './components/ManualTaskModal';
import MissionControl from './components/MissionControl';
import ExtractionReport from './components/ExtractionReport';
import { 
  Shield, 
  Sparkles, 
  Lock, 
  Calendar, 
  AlertCircle, 
  Loader2, 
  CheckCircle,
  Clock,
  Compass,
  ArrowRight,
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  AlertTriangle,
  FileText,
  ChevronRight,
  RefreshCw,
  Home
} from 'lucide-react';
import { DEMO_DATASETS } from './demoData';

const DEMO_TASKS: Task[] = [];

const DEMO_MISSION_CONTROL: MissionControlData | null = null;

const INITIAL_BRIEFING: BriefingType = {
  summary: `### Welcome to DeadlineGuardian AI!
  
  I am your **AI Chief of Staff**. To begin, please **upload a syllabus, project outline, task sheet, or meeting minutes** in the Action Pipeline tab. 
  
  I will automatically parse your materials, extract actionable deliverables, estimate realistic study/focus hours, map sequential dependencies, and populate your strategic Mission Control dashboard.`,
  highestImpactTask: "None (Awaiting Document)",
  recommendations: [
    "Upload a document or syllabus to begin timeline extraction"
  ],
  riskAlerts: [
    "No active documents uploaded yet."
  ],
  productivityInsight: "Drop in your project syllabus or instruction files to launch your custom Strategic Execution Plan."
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [calendarToken, setCalendarToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [sandboxModeActive, setSandboxModeActive] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [briefing, setBriefing] = useState<BriefingType>(INITIAL_BRIEFING);
  const [completionProbability, setCompletionProbability] = useState<number>(100);
  
  const [missionControl, setMissionControl] = useState<MissionControlData | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocMetadata[]>([]);
  const [crisisPlan, setCrisisPlan] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'mission' | 'pipeline' | 'report' | 'crisis'>('mission');

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const hasLoadedPrefs = React.useRef(false);

  // Initialize Auth Listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setCalendarToken(token);
        setNeedsAuth(false);
        setSandboxModeActive(false);
        // Load user specific tasks if they exist
        loadTasksForUser(currentUser.uid);
      },
      () => {
        setUser(null);
        setCalendarToken(null);
        setNeedsAuth(true);
        // Load sandbox state on fallback
        loadTasksForUser('sandbox');
      }
    );
    return () => unsubscribe();
  }, []);

  // Save User Preferences when they change
  useEffect(() => {
    if (!hasLoadedPrefs.current) return;
    const storagePrefix = user ? user.uid : 'sandbox';
    saveUserPreferences(storagePrefix, { activeTab, sandboxModeActive });
  }, [activeTab, sandboxModeActive, user]);

  const loadTasksForUser = async (userId: string) => {
    try {
      const dbTasks = await getUserTasks(userId);
      const savedMc = await getMissionControl(userId);
      const savedDocs = await getUploadedDocs(userId);
      const savedBriefing = await getExecutiveBriefing(userId);
      const savedCrisisPlan = await getCrisisPlan(userId);
      const savedPrefs = await getUserPreferences(userId);
      
      if (savedMc) {
        setMissionControl(savedMc);
      } else {
        setMissionControl(null);
      }
      
      if (savedDocs) {
        setUploadedDocs(savedDocs);
      } else {
        setUploadedDocs([]);
      }

      if (savedBriefing) {
        setBriefing(savedBriefing);
      }

      if (savedCrisisPlan) {
        setCrisisPlan(savedCrisisPlan);
      } else {
        setCrisisPlan(null);
      }

      if (savedPrefs) {
        if (savedPrefs.activeTab) {
          setActiveTab(savedPrefs.activeTab);
        }
        if (savedPrefs.sandboxModeActive !== undefined) {
          setSandboxModeActive(savedPrefs.sandboxModeActive);
        }
      }

      setTasks(dbTasks);
      
      if (savedBriefing) {
        if (savedBriefing.completionProbability !== undefined) {
          setCompletionProbability(savedBriefing.completionProbability);
        } else {
          recalculateBriefingAndProbability(dbTasks);
        }
      } else {
        recalculateBriefingAndProbability(dbTasks);
      }
    } catch (err) {
      console.error("Failed to load state from Firestore/localStorage:", err);
      setTasks([]);
      setMissionControl(null);
    } finally {
      hasLoadedPrefs.current = true;
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setCalendarToken(result.accessToken);
        setNeedsAuth(false);
        await loadTasksForUser(result.user.uid);
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setCalendarToken(null);
      setNeedsAuth(true);
      setTasks([]);
      setMissionControl(null);
      setUploadedDocs([]);
      setCrisisPlan(null);
      setShowLanding(true);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const resetWorkspace = async () => {
    const storagePrefix = user ? user.uid : 'sandbox';
    setTasks([]);
    setMissionControl(null);
    setUploadedDocs([]);
    setCrisisPlan(null);
    setBriefing(INITIAL_BRIEFING);
    setCompletionProbability(100);
    setShowLanding(true);

    await saveMissionControl(storagePrefix, null);
    await saveUploadedDocs(storagePrefix, []);
    await saveExecutiveBriefing(storagePrefix, INITIAL_BRIEFING);
    await saveCrisisPlan(storagePrefix, null);
    await saveMultipleTasks(storagePrefix, []);
  };

  const handleLoadDemoDataset = (demoId: string) => {
    const demo = DEMO_DATASETS.find(d => d.id === demoId);
    if (!demo) return;
    
    setIsAnalysisLoading(true);
    setActiveTab('mission');
    
    setTimeout(async () => {
      setSandboxModeActive(true);
      setNeedsAuth(true); // Keep needsAuth true to render "Sandbox Mode" status badge, but bypass block!
      setCalendarToken('sandbox_demo_token');
      
      setTasks(demo.tasks);
      
      const criticals = demo.tasks.filter(t => t.riskLevel === 'Critical');
      
      const demoBriefing = {
        summary: demo.summary,
        highestImpactTask: demo.tasks.length > 0 ? demo.tasks[0].title : '',
        recommendations: demo.tasks.slice(0, 2).map(t => `Isolate high-leverage focus sprint for: "${t.title}".`),
        riskAlerts: criticals.map(t => `Critical Risk: Imminent milestone "${t.title}" has narrow buffer.`),
        productivityInsight: demo.missionControl.estimatedEffort || "Prioritize leader election logs or press embargos during high-cognitive morning cycles.",
        completionProbability: demo.completionProbability
      };

      setBriefing(demoBriefing);
      setCompletionProbability(demo.completionProbability);
      setUploadedDocs(demo.uploadedDocs);
      setMissionControl(demo.missionControl);
      setCrisisPlan(demo.crisisPlan);
      
      // Persist sandbox state to Firestore / localStorage fallback
      const storagePrefix = user ? user.uid : 'sandbox';
      await saveMissionControl(storagePrefix, demo.missionControl);
      await saveUploadedDocs(storagePrefix, demo.uploadedDocs);
      await saveMultipleTasks(storagePrefix, demo.tasks);
      await saveExecutiveBriefing(storagePrefix, demoBriefing);
      await saveCrisisPlan(storagePrefix, demo.crisisPlan);
      
      setIsAnalysisLoading(false);
      setShowLanding(false);
    }, 1200);
  };

  // Recalculates probability and brief on checking/unchecking items
  const recalculateBriefingAndProbability = (currentTasks: Task[]) => {
    if (currentTasks.length === 0) {
      setCompletionProbability(100);
      return;
    }

    const completed = currentTasks.filter(t => t.status === 'completed');
    const pending = currentTasks.filter(t => t.status === 'pending');
    
    // Calculate simple baseline probability
    let baseProb = 100;
    
    if (currentTasks.length > 0) {
      baseProb = Math.round((completed.length / currentTasks.length) * 100);
    }

    // Adjust for pending task risks
    const criticals = pending.filter(t => t.riskLevel === 'Critical');
    const warnings = pending.filter(t => t.riskLevel === 'Warning');
    
    let riskDeduction = (criticals.length * 15) + (warnings.length * 5);
    let finalProb = Math.max(10, Math.min(95, (100 - riskDeduction) + (completed.length * 2)));

    if (pending.length === 0) finalProb = 100;

    setCompletionProbability(finalProb);

    // Build custom micro-briefing stats
    const highestFocus = pending.length > 0 ? pending[0].title : "All Clear!";
    
    const recs = pending.slice(0, 2).map(t => `Focus on ${t.title} requirements.`);
    if (pending.length > 0) {
      recs.push(`Submit high-priority milestone items for ${pending[0].title}.`);
    }

    const alerts = criticals.map(t => `${t.title} is marked Critical.`);

    setBriefing({
      summary: `### Dynamic Workload Diagnostics Active
      
You have completed **${completed.length} of ${currentTasks.length}** total assignments. There are **${pending.length} tasks outstanding**, representing roughly **${pending.reduce((sum, t) => sum + t.estimatedHours, 0)} focus hours**.
      
Your timeline is currently estimated at **${finalProb}% success probability**. ${
        criticals.length > 0 
          ? `Tackle your **${criticals.length} Critical** timeline threat(s) immediately.` 
          : 'Your schedule margins remain within safe tolerances.'
      }`,
      highestImpactTask: highestFocus,
      recommendations: recs.length > 0 ? recs : ["You are all caught up! Enjoy some well-deserved rest."],
      riskAlerts: alerts,
      productivityInsight: pending.length > 5 
        ? "Workload dense. Apply the Pomodoro method: 50 minutes of deep focus followed by a 10-minute mental break."
        : "Workload balanced. Protect your evening hours for healthy winding-down sequences."
    });
  };

  // Task Mutators
  const handleToggleStatus = async (taskId: string, completed: boolean) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: (completed ? 'completed' : 'pending') as "pending" | "completed" } : t);
    setTasks(updated);
    recalculateBriefingAndProbability(updated);

    const storagePrefix = user ? user.uid : 'sandbox';
    try {
      await toggleTaskStatus(storagePrefix, taskId, completed);
    } catch (err) {
      console.error("Firestore toggle failed:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this commitment?");
    if (!confirmed) return;

    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    recalculateBriefingAndProbability(updated);

    const storagePrefix = user ? user.uid : 'sandbox';
    try {
      await deleteUserTask(storagePrefix, taskId);
    } catch (err) {
      console.error("Firestore delete failed:", err);
    }
  };

  const handleManualSave = async (newTask: Task) => {
    const updated = [...tasks, newTask];
    setTasks(updated);
    recalculateBriefingAndProbability(updated);

    const storagePrefix = user ? user.uid : 'sandbox';
    try {
      await saveUserTask(storagePrefix, newTask);
    } catch (err) {
      console.error("Firestore save failed:", err);
    }
  };

  // Analysis result integration
  const handleAnalysisComplete = async (
    result: { tasks: any[]; summary: string; completionProbability: number; missionControl: any },
    rawFiles: any[]
  ) => {
    // Standardize tasks with IDs and pending status
    const newTasks: Task[] = result.tasks.map((t, idx) => ({
      id: 'task_' + Math.random().toString(36).substr(2, 9) + '_' + idx,
      title: t.title,
      description: t.description,
      deadline: t.deadline,
      milestones: t.milestones || [],
      effortLevel: (t.effortLevel as "Low" | "Medium" | "High") || 'Medium',
      estimatedHours: Number(t.estimatedHours) || 4,
      riskLevel: (t.riskLevel as "Safe" | "Warning" | "Critical") || 'Safe',
      riskExplanation: t.riskExplanation || 'Extracted via Document Intelligence.',
      dependencies: t.dependencies || [],
      category: t.category || 'Assignment',
      status: 'pending' as const,
      createdAt: Date.now() + idx,
      confidenceScore: Number(t.confidenceScore) || 85
    }));

    // Clear existing pipeline and set exclusively from document
    setTasks(newTasks);
    
    // Set AI summary directly from result
    const calculatedBriefing = {
      summary: result.summary,
      highestImpactTask: newTasks.length > 0 ? newTasks[0].title : '',
      recommendations: newTasks.slice(0, 2).map(t => `Commence subtask milestones for ${t.title}`),
      riskAlerts: newTasks.filter(t => t.riskLevel === 'Critical').map(t => `Timeline collision danger: ${t.title}`),
      productivityInsight: "Your Chief of Staff recommends locking in prerequisites before executing parallel timelines.",
      completionProbability: result.completionProbability
    };

    setBriefing(calculatedBriefing);
    setCompletionProbability(result.completionProbability);

    // Map rawFiles to UploadedDocMetadata (completely document-driven, so overwrite)
    const docMeta: UploadedDocMetadata[] = rawFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type || 'text/plain',
      uploadedAt: new Date().toLocaleTimeString(),
      previewText: file.textContent || 'Parsed binary document metadata stream'
    }));

    setUploadedDocs(docMeta);

    // If missionControl is provided in result, update it
    if (result.missionControl) {
      setMissionControl(result.missionControl);
    }

    // Persist states in Firestore / LocalStorage fallback
    const storagePrefix = user ? user.uid : 'sandbox';
    if (result.missionControl) {
      await saveMissionControl(storagePrefix, result.missionControl);
    }
    await saveUploadedDocs(storagePrefix, docMeta);
    await saveMultipleTasks(storagePrefix, newTasks);
    await saveExecutiveBriefing(storagePrefix, calculatedBriefing);
    setShowLanding(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-400" id="deadline-guardian-root">
      {/* Sleek top navigation */}
      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        hasCalendarToken={!!calendarToken}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-6 md:py-10 space-y-8">
        
        {showLanding ? (
          /* Original DeadlineGuardian Landing / Upload Experience */
          <div className="space-y-10 animate-fade-in" id="landing-page">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center space-y-6 py-4 md:py-6" id="landing-hero">
              <div className="inline-flex bg-indigo-500/5 border border-indigo-500/15 p-4 rounded-2xl mb-1 relative">
                <Shield className="w-10 h-10 text-indigo-500 stroke-[1.5]" />
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full">
                  AI Chief of Staff for Deliverables
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-display font-black tracking-tight text-white leading-none">
                  Upload deadlines.<br />Get a <span className="text-indigo-400">survival plan</span>.
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
                  Overwhelmed by exam syllabi, project briefs, or milestone lists? 
                  DeadlineGuardian AI instantly parses your documents, extracts milestones, estimates workloads, and charts automated study blocks directly to Google Calendar.
                </p>
              </div>
            </div>

            {/* Resume Workspace Callout (if active workspace is saved) */}
            {tasks.length > 0 && (
              <div className="max-w-4xl mx-auto bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl" id="resume-workspace-card">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
                      Saved Workspace Found
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Resume Previous Workspace
                  </h3>
                  <p className="text-xs text-zinc-400 leading-normal">
                    You have an ongoing analysis with <span className="text-white font-semibold font-mono">{tasks.length} tasks</span> fully synchronized.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to start a new analysis? This will clear your current saved workspace.")) {
                        await resetWorkspace();
                      }
                    }}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold font-display text-xs tracking-wider uppercase rounded-xl border border-white/10 transition-all cursor-pointer hover:border-zinc-500/40"
                  >
                    Start New Analysis
                  </button>
                  <button
                    onClick={() => {
                      setShowLanding(false);
                      setActiveTab('mission');
                    }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-display text-xs tracking-wider uppercase rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
                  >
                    <span>Restore Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Core Upload & Briefing preview panel */}
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <DailyBriefing
                  summary={briefing.summary}
                  completionProbability={completionProbability}
                  highestImpactTaskTitle={briefing.highestImpactTask}
                  recommendations={briefing.recommendations}
                  riskAlerts={briefing.riskAlerts}
                  productivityInsight={briefing.productivityInsight}
                />
                
                <div className="space-y-6">
                  <UploadZone
                    onAnalysisComplete={(result, rawFiles) => {
                      handleAnalysisComplete(result, rawFiles);
                      setShowLanding(false);
                      setActiveTab('mission');
                    }}
                    isLoading={isAnalysisLoading}
                    setIsLoading={setIsAnalysisLoading}
                    onLoadDemo={(demoId) => {
                      handleLoadDemoDataset(demoId);
                      setShowLanding(false);
                      setActiveTab('mission');
                    }}
                  />

                  {/* Authentication quick link if not signed in */}
                  {!user && (
                    <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-zinc-300 flex items-center justify-center sm:justify-start gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Google Account Cloud Sync</span>
                        </h4>
                        <p className="text-[11px] text-zinc-500">
                          Authenticate to unlock secure cloud backups and 1-click calendar sync.
                        </p>
                      </div>
                      <button
                        onClick={handleLogin}
                        disabled={isLoggingIn}
                        className="bg-white hover:bg-zinc-100 text-zinc-950 font-display font-bold text-[10px] tracking-wider uppercase px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3.5 h-3.5">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        </svg>
                        <span>Authenticate</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Demo Panel - Judges Quick-Start */}
            <div className="space-y-6 pt-10 border-t border-white/5" id="interactive-demo-section">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase">Interactive Demo</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold font-display text-white">Judge Evaluation Portal</h2>
                <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
                  Bypass file preparation or auth setup. Choose an interactive pre-seeded scenario below to execute the complete AI deconfliction pipeline offline in under 30 seconds.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-4">
                {DEMO_DATASETS.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => {
                      handleLoadDemoDataset(demo.id);
                    }}
                    className="bg-[#0c0c0c] border border-white/10 hover:border-indigo-500/40 p-5.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left group cursor-pointer shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden"
                  >
                    {/* Glowing highlight */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none rounded-bl-full" />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-zinc-400">
                          {demo.badge}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      
                      <div>
                        <h3 className="font-display font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                          {demo.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans line-clamp-3">
                          {demo.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-white/5 pt-3.5 w-full flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>{demo.tasks.length} Action Milestones</span>
                      <span className="text-indigo-400 group-hover:underline flex items-center gap-1 font-bold">
                        Try Demo <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Active Interactive Workspace Panel with Tab Selector */
          <div className="space-y-8" id="active-workspace-panel">
            {/* Global Interactive Tabs navigation toolbar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
                <button
                  onClick={() => setActiveTab('mission')}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeTab === 'mission'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                  <span>Mission Control</span>
                  {missionControl && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('pipeline')}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeTab === 'pipeline'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <ClipboardList className="w-4.5 h-4.5" />
                  <span>Action Pipeline</span>
                  <span className="text-[10px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500 font-bold">
                    {tasks.filter(t => t.status === 'pending').length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('report')}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeTab === 'report'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <BarChart3 className="w-4.5 h-4.5" />
                  <span>Extraction Report</span>
                  {uploadedDocs.length > 0 && (
                    <span className="text-[10px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500 font-bold">
                      {uploadedDocs.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('crisis')}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2.5 cursor-pointer transition-all ${
                    activeTab === 'crisis'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <AlertTriangle className="w-4.5 h-4.5" />
                  <span>Save My Week</span>
                </button>

                <button
                  onClick={() => setShowLanding(true)}
                  className="px-4.5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 cursor-pointer transition-all"
                >
                  <Home className="w-4.5 h-4.5" />
                  <span>Landing Page</span>
                </button>
              </div>

              {/* Status callouts */}
              <div className="flex items-center gap-3 self-end md:self-center">
                {tasks.length > 0 && (
                  <button
                    onClick={resetWorkspace}
                    className="text-[10px] font-mono text-zinc-500 hover:text-rose-400 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 hover:border-rose-500/20 hover:bg-rose-500/5"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin-slow" />
                    Reset Workspace
                  </button>
                )}
                {needsAuth ? (
                  <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/15 px-3 py-1.5 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">Sandbox Mode</span>
                    <button
                      onClick={handleLogin}
                      className="text-[9px] font-sans text-white hover:underline uppercase tracking-wider font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded cursor-pointer"
                    >
                      Auth Sync
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 px-3 py-1.5 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Cloud Synced</span>
                  </div>
                )}
              </div>
            </div>

            {/* Render views based on active tab selection */}
            <div className="transition-all duration-300">
              {activeTab === 'mission' && (
                <MissionControl 
                  tasks={tasks}
                  missionData={missionControl}
                  isLoading={isAnalysisLoading}
                  onLoadDemo={handleLoadDemoDataset}
                />
              )}

              {activeTab === 'pipeline' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                  <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DailyBriefing
                        summary={briefing.summary}
                        completionProbability={completionProbability}
                        highestImpactTaskTitle={briefing.highestImpactTask}
                        recommendations={briefing.recommendations}
                        riskAlerts={briefing.riskAlerts}
                        productivityInsight={briefing.productivityInsight}
                      />
                      <UploadZone
                        onAnalysisComplete={handleAnalysisComplete}
                        isLoading={isAnalysisLoading}
                        setIsLoading={setIsAnalysisLoading}
                        onLoadDemo={handleLoadDemoDataset}
                      />
                    </div>

                    <TaskList
                      tasks={tasks}
                      onToggleStatus={handleToggleStatus}
                      onDeleteTask={handleDeleteTask}
                      onOpenManualModal={() => setIsManualModalOpen(true)}
                    />
                  </div>

                  <div className="lg:col-span-1 space-y-6">
                    <AnalyticsSection
                      tasks={tasks}
                      completionProbability={completionProbability}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'report' && (
                <ExtractionReport 
                  tasks={tasks}
                  uploadedDocs={uploadedDocs}
                />
              )}

              {activeTab === 'crisis' && (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-zinc-100 font-display uppercase tracking-wider text-rose-400">Save My Week Crisis Recovery</h2>
                    <p className="text-xs text-zinc-400 leading-normal max-w-2xl">
                      Overwhelmed? Choose to temporarily postpone low-impact items and let the Chief of Staff allocate specific calendar deconfliction times for critical deliverables.
                    </p>
                  </div>
                  <CrisisMode
                    tasks={tasks}
                    hasCalendarToken={!!calendarToken}
                    onLoginToSync={handleLogin}
                    calendarToken={calendarToken}
                    crisisPlan={crisisPlan}
                    onSaveCrisisPlan={async (newPlan) => {
                      setCrisisPlan(newPlan);
                      const storagePrefix = user ? user.uid : 'sandbox';
                      await saveCrisisPlan(storagePrefix, newPlan);
                    }}
                  />
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Manual Addition Modal */}
      <ManualTaskModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSave={handleManualSave}
      />

      {/* Humble credit line */}
      <footer className="border-t border-white/5 py-8 text-center text-zinc-600 text-xs font-mono mt-16 max-w-7xl mx-auto w-full px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p>DeadlineGuardian AI &copy; 2026</p>
        <p className="opacity-70">Operated securely via Guardian Chief of Staff Protocol</p>
      </footer>
    </div>
  );
}
