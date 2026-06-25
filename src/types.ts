export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  milestones: string[];
  effortLevel: "Low" | "Medium" | "High";
  estimatedHours: number;
  riskLevel: "Safe" | "Warning" | "Critical";
  riskExplanation: string;
  dependencies: string[];
  category: string; // "Assignment" | "Project Brief" | "Action Item" | "Milestone" | "Other"
  status: "pending" | "completed";
  createdAt: number;
  confidenceScore: number; // Percentage (0-100) computed from workload, deadline proximity, dependency count, and estimated hours
}

export interface DailyBriefing {
  summary: string;
  highestImpactTask: string; // Title of task
  recommendations: string[];
  riskAlerts: string[];
  productivityInsight: string;
}

export interface ExecutiveRecommendation {
  actionType: "first" | "postpone" | "delegate" | "reduce_scope" | "ignore" | string;
  taskTitle: string;
  recommendation: string;
  reasoning: string;
}

export interface CrisisPlan {
  recoveryStrategy: string; // Markdown text explaining the plan
  prioritizedTaskIds: string[];
  postponedTaskIds: string[];
  allocatedHoursPerDay: { date: string; hours: number }[];
  projectedCompletionProbability: number;
  calendarEvents: {
    summary: string;
    description: string;
    startDateTime: string; // ISO String
    endDateTime: string; // ISO String
  }[];
  // Extended Executive Decision Engine Properties
  currentSituation?: {
    totalTasks: number;
    remainingHours: number;
    availableHours: number;
    conflictCount: number;
    currentCompletionProbability: number;
  };
  executiveRecommendations?: ExecutiveRecommendation[];
  impactAnalysis?: {
    currentProbability: number;
    afterProbability: number;
    improvement: number;
  };
  reasoningEngine?: string;
}

export interface RiskFactor {
  factor: string;
  severity: "Low" | "Medium" | "High" | string;
  mitigation: string;
}

export interface MissionControlData {
  missionObjective: string;
  keyDeliverables: string[];
  estimatedEffort: string;
  deadlineAnalysis: string;
  riskFactors: RiskFactor[];
  criticalPathDependencies: string[];
  successProbability: number;
  recommendedExecutionStrategy: string; // Markdown sequence of phases
}

export interface UploadedDocMetadata {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  previewText?: string;
}
