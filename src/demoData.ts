import { Task, MissionControlData, CrisisPlan, UploadedDocMetadata } from './types';

export interface DemoDataset {
  id: string;
  name: string;
  description: string;
  badge: string;
  tasks: Task[];
  summary: string;
  completionProbability: number;
  missionControl: MissionControlData;
  uploadedDocs: UploadedDocMetadata[];
  crisisPlan: CrisisPlan;
}

export const DEMO_DATASETS: DemoDataset[] = [
  {
    id: 'university_syllabus',
    name: 'University Syllabus',
    description: 'CS-301 Advanced Distributed Systems Academic Blueprint',
    badge: 'Academics',
    completionProbability: 68,
    uploadedDocs: [
      {
        name: 'CS301_Distributed_Systems_Syllabus.pdf',
        size: '1.4 MB',
        type: 'application/pdf',
        uploadedAt: '10:14:42 AM',
        previewText: 'CS-301: ADVANCED DISTRIBUTED SYSTEMS\nSyllabus & Core Course Map\nProf. Raymond K. Miller\n\nCOURSE DELIVERABLES & DEADLINES:\n- Raft Consensus Implementation Lab: Due June 26, 2026. Worth 20% of course grade.\n- Midterm Exam (Focus on Paxos, Vector Clocks, and BFT): June 29, 2026. Worth 30%.\n- Research Paper Presentation & Slide Submission: July 3, 2026. Worth 15%.'
      }
    ],
    summary: `### 🎓 Academic Core Syllabus Assessment: CS-301 Distributed Systems
    
We have successfully ingested and parsed the CS-301 Advanced Distributed Systems course syllabus. 

The AI has flagged **Raft Consensus Implementation Lab** as your highest-priority milestone, followed immediately by the **Midterm Examination**. We have constructed a secure, safety-first study sequence designed to clear these hurdles without timeline collisions or exam prep deficits.`,
    tasks: [
      {
        id: 'demo_univ_task_1',
        title: 'Distributed Consensus Lab: Complete Raft Election Engine',
        description: 'Design the leader election loop, randomized heartbeat timeouts, and RPC append entries flow. Ensure state machine replication invariants are preserved.',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        milestones: [
          'Design randomized timeout loops',
          'Implement RPC RequestVote and AppendEntries handles',
          'Conduct state-machine replication verification'
        ],
        effortLevel: 'High',
        estimatedHours: 12,
        riskLevel: 'Critical',
        riskExplanation: 'Critical Risk: Heavy engineering workload with an absolute deadline in 48 hours. Representing 20% of your total grade.',
        dependencies: [],
        category: 'Assignment',
        status: 'pending',
        createdAt: Date.now(),
        confidenceScore: 68
      },
      {
        id: 'demo_univ_task_2',
        title: 'Midterm Examination: Prepare Vector Clocks & Paxos Core',
        description: 'Review core course packets for logical clocks, vector clocks, Paxos consensus, and Byzantine Fault Tolerance (BFT) parameters.',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
        milestones: [
          'Review Lecture Slides 1-8',
          'Execute sample Vector Clock logical sequencing puzzles',
          'Draft Paxos vs Raft comparison sheet'
        ],
        effortLevel: 'Medium',
        estimatedHours: 8,
        riskLevel: 'Warning',
        riskExplanation: 'Warning Risk: Multi-topic theoretical examination with highly complex conceptual algorithms.',
        dependencies: ['Distributed Consensus Lab: Complete Raft Election Engine'],
        category: 'Assignment',
        status: 'pending',
        createdAt: Date.now() + 1,
        confidenceScore: 78
      },
      {
        id: 'demo_univ_task_3',
        title: 'Research Paper Presentation: Compile Slides & Outline',
        description: 'Analyze chosen distributed systems research paper. Construct 10-slide delivery outline detailing problem definition, system layout, and evaluation metrics.',
        deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 9 days from now
        milestones: [
          'Select chosen research paper text',
          'Outline 10 slides (Introduction, Methodology, Experiments)',
          'Perform 5-minute rehearsal talk'
        ],
        effortLevel: 'Low',
        estimatedHours: 4,
        riskLevel: 'Safe',
        riskExplanation: 'Safe Risk: Long timeline buffer with simple deliverables and highly manageable workload.',
        dependencies: ['Midterm Examination: Prepare Vector Clocks & Paxos Core'],
        category: 'Milestone',
        status: 'pending',
        createdAt: Date.now() + 2,
        confidenceScore: 92
      }
    ],
    missionControl: {
      missionObjective: 'Aerate academic pressure by implementing state-machine replication and mastering vector clocks before CS-301 Midterm gates.',
      keyDeliverables: [
        'Raft Consensus Implementation Lab',
        'Advanced Systems Midterm Examination',
        'Academic Research Presentation Slides'
      ],
      estimatedEffort: '24 focus hours total, pacing roughly 4.8 hours per day over a 5-day cycle.',
      deadlineAnalysis: 'Raft Lab deadline is highly imminent (48 hours). Completing Raft immediately relieves 50% of the total scheduling pressure, allowing comfortable preparation for the Midterm.',
      riskFactors: [
        {
          factor: 'Raft Split-Vote Deadlocks',
          severity: 'High',
          mitigation: 'Implement proper randomized election timeouts between 150ms and 300ms to guarantee single-candidate elections.'
        },
        {
          factor: 'Theoretical Concept Gaps',
          severity: 'Medium',
          mitigation: 'Prioritize reviewing BFT quorum margins (3f + 1 node consensus limit) to secure examination points.'
        }
      ],
      criticalPathDependencies: [
        'Complete Raft Election Engine',
        'Draft Paxos vs Raft Comparison'
      ],
      successProbability: 68,
      recommendedExecutionStrategy: `### 📈 Strategic 3-Phase Execution Roadmap
      
#### Phase 1: High-Priority Ingestion (Days 1-2)
- Allocate deep, uninterrupted 90-minute blocks in the morning to **Raft Election Engine**. 
- Resolve election safety invariants before implementing log replication RPC handlers.

#### Phase 2: Examination Prep (Days 3-5)
- Dedicate 2 hours daily to logical clocks and vector clocks equations. 
- Build a quick comparison guide summarizing Raft vs. Multi-Paxos.

#### Phase 3: Research Handoff (Days 6-9)
- Compile slide deliverables. 
- Conduct one 5-minute dry run presentation to solidfy confidence.`
    },
    crisisPlan: {
      recoveryStrategy: `### 🚨 Chief of Staff Academic Crisis Recovery Roadmap

Due to extreme schedule density and the upcoming Raft lab deadline, we have engaged the **Syllabus Guardian Protocol** to maximize your grade preservation probability.

We have audited your **3 active academic commitments** requiring **24 required study hours**. By reorganizing secondary deliverables and isolating high-priority focus windows, we can raise your project completion probability from **68% to 92%**.

#### Strategic Directives:
1. **Academic De-Scoping**: Apply a strict Minimum Viable Product (MVP) filter to your Raft Lab. Prioritize robust election loops over complex logging edge-cases to secure 85% of baseline points quickly.
2. **Postpone Slide Polish**: Put off aesthetic slide redesigns for the presentation until your Midterm examination is completely completed.
3. **Calendar Sprints**: Lock in the three pre-scheduled focus slots to defend your core study blocks.`,
      prioritizedTaskIds: ['Distributed Consensus Lab: Complete Raft Election Engine', 'Midterm Examination: Prepare Vector Clocks & Paxos Core'],
      postponedTaskIds: ['Research Paper Presentation: Compile Slides & Outline'],
      allocatedHoursPerDay: [
        { date: new Date().toISOString().split('T')[0], hours: 6 },
        { date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 6 },
        { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 4 },
        { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 4 },
        { date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 2 },
        { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 2 },
        { date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 0 }
      ],
      projectedCompletionProbability: 92,
      impactAnalysis: {
        currentProbability: 68,
        afterProbability: 92,
        improvement: 24
      },
      currentSituation: {
        totalTasks: 3,
        remainingHours: 24,
        availableHours: 35,
        conflictCount: 1,
        currentCompletionProbability: 68
      },
      executiveRecommendations: [
        {
          actionType: 'first',
          taskTitle: 'Distributed Consensus Lab: Complete Raft Election Engine',
          recommendation: 'Ditch advanced performance enhancements. Build a robust Leader Election state machine and submit immediately to secure core credits.',
          reasoning: 'Critical bottleneck. Worth 20% of your grade, and the deadline falls within 48 hours.'
        },
        {
          actionType: 'reduce_scope',
          taskTitle: 'Midterm Examination: Prepare Vector Clocks & Paxos Core',
          recommendation: 'Leverage summary sheets and execute 3 mock problems. Do not waste time reading the full textbook chapters.',
          reasoning: 'High-leverage action. Focusing on high-yield exam patterns yields 90% of exam returns with 50% less prep time.'
        },
        {
          actionType: 'postpone',
          taskTitle: 'Research Paper Presentation: Compile Slides & Outline',
          recommendation: 'Defer draft review until the midterm is completed. The slides represent only a minor grade fraction.',
          reasoning: 'Highly postponement-safe. Long timeline runway with zero active downstream dependencies.'
        }
      ],
      calendarEvents: [
        {
          summary: '🛡️ CS-301 Raft Consensus Deep Focus Block',
          description: 'Guardian-allocated deep work session. Goal: Implement Raft Leader state machine and randomized election timeouts.',
          startDateTime: `${new Date().toISOString().split('T')[0]}T09:00:00Z`,
          endDateTime: `${new Date().toISOString().split('T')[0]}T11:00:00Z`
        },
        {
          summary: '🛡️ Distributed Systems Midterm Review Session',
          description: 'Guardian-allocated focus study block. Review Vector Clock sequencing algorithms and Byzantine limits.',
          startDateTime: `${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}T10:00:00Z`,
          endDateTime: `${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}T12:00:00Z`
        }
      ]
    }
  },
  {
    id: 'software_prd',
    name: 'Software Project PRD',
    description: 'Project Aegis Cloud Storage API Layer Architecture Roadmap',
    badge: 'Software PRD',
    completionProbability: 72,
    uploadedDocs: [
      {
        name: 'Project_Aegis_API_PRD.md',
        size: '184 KB',
        type: 'text/markdown',
        uploadedAt: '03:45:11 PM',
        previewText: '# PRD: Project Aegis Cloud Storage Service API\n## Section 1: Authentication & Authorization\n\nALL Endpoints must be protected by robust OAuth2 Token Middleware. \n- Token Introspection Endpoint: /oauth/introspect\n- Middleware deployment deadline: Due in 3 days.\n- Database Integration (Drizzle + Connection Pooling config): Due in 6 days.\n- E2E Test Suite (Jest / Supertest): Due in 12 days.'
      }
    ],
    summary: `### 💻 Engineering System PRD Assessment: Project Aegis
    
We have scanned the Project Aegis Cloud Storage specifications.

The AI has parsed three key development streams. The **OAuth2 Token Middleware** is flagged as a high-priority architectural gate. Connecting your **PostgreSQL Connection Pool** and implementing **Jest E2E Tests** are scheduled sequentially to prevent blocking the web frontend team.`,
    tasks: [
      {
        id: 'demo_soft_task_1',
        title: 'Security: Implement OAuth2 Token Verification Middleware',
        description: 'Code the request interceptor middleware. Parse Bearer tokens, call the Token Introspection endpoint, and bind user identity payloads to requests.',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        milestones: [
          'Create request interceptor handler',
          'Code Bearer token header parsing logic',
          'Mock token introspection response pipeline'
        ],
        effortLevel: 'High',
        estimatedHours: 10,
        riskLevel: 'Critical',
        riskExplanation: 'Critical Risk: Hard blocker for all downstream API endpoints and frontend feature integration. Deadline is in 3 days.',
        dependencies: [],
        category: 'Action Item',
        status: 'pending',
        createdAt: Date.now(),
        confidenceScore: 72
      },
      {
        id: 'demo_soft_task_2',
        title: 'Database: Setup PostgreSQL Connection Pool & Drizzle ORM',
        description: 'Initialize Drizzle ORM config files. Configure connection pooling parameters (max connections, idle timeout) for reliable database connectivity.',
        deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days from now
        milestones: [
          'Initialize Drizzle configuration schemas',
          'Configure connection pooling parameters in client',
          'Test query latency and leak metrics locally'
        ],
        effortLevel: 'Medium',
        estimatedHours: 6,
        riskLevel: 'Warning',
        riskExplanation: 'Warning Risk: Requires configuration of env secrets and cloud sql network credentials.',
        dependencies: ['Security: Implement OAuth2 Token Verification Middleware'],
        category: 'Action Item',
        status: 'pending',
        createdAt: Date.now() + 1,
        confidenceScore: 81
      },
      {
        id: 'demo_soft_task_3',
        title: 'Testing: Setup Jest/Supertest End-to-End API Suite',
        description: 'Establish unit testing environment. Write mock auth test suites and verify server-level API route returns.',
        deadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 11 days from now
        milestones: [
          'Initialize Jest environment configuration',
          'Write end-to-end endpoint tests using Supertest',
          'Configure GitHub Actions test pipeline triggers'
        ],
        effortLevel: 'Low',
        estimatedHours: 4,
        riskLevel: 'Safe',
        riskExplanation: 'Safe Risk: Comfortable delivery runway. Clear specs and standardized library structures.',
        dependencies: ['Database: Setup PostgreSQL Connection Pool & Drizzle ORM'],
        category: 'Milestone',
        status: 'pending',
        createdAt: Date.now() + 2,
        confidenceScore: 94
      }
    ],
    missionControl: {
      missionObjective: 'Secure the cloud storage middleware gate and configure robust database pooling pipelines ahead of frontend feature freezes.',
      keyDeliverables: [
        'OAuth2 Auth Middleware Interceptor',
        'Drizzle PostgreSQL Pool Initializer',
        'E2E Supertest API Coverage Suite'
      ],
      estimatedEffort: '20 focus hours total, pacing roughly 3.3 hours per day over a 6-day cycle.',
      deadlineAnalysis: 'OAuth2 middleware represents a massive architectural gate due in 3 days. Developing this first unblocks parallel database integration timelines seamlessly.',
      riskFactors: [
        {
          factor: 'Database Pool Starvation',
          severity: 'High',
          mitigation: 'Implement lazy connection pool cleanup handlers and configure max connections to 20 to avoid exhausting database handles.'
        },
        {
          factor: 'Mock Introspection Latency',
          severity: 'Medium',
          mitigation: 'Utilize secure client-side in-memory Redis caching to prevent round-trip token inspection requests from lagging.'
        }
      ],
      criticalPathDependencies: [
        'OAuth2 Token Verification Middleware',
        'PostgreSQL Connection Pool Config'
      ],
      successProbability: 72,
      recommendedExecutionStrategy: `### 🛠️ Engineering Execution Protocol
      
#### Phase 1: Authentication Gateway (Days 1-3)
- Focus entirely on coding **OAuth2 verification middleware**. 
- Write extensive local mock payloads to test validation routines before connecting live oauth providers.

#### Phase 2: Database Pipeline (Days 4-6)
- Setup Drizzle models and migrate schemas.
- Set up connection monitoring logs to audit connection lease lifetimes.

#### Phase 3: CI/CD Quality Assurance (Days 7-11)
- Standardize Jest suite runs in local hooks.
- Configure automatic PR testing blocks in GitHub Actions workflows.`
    },
    crisisPlan: {
      recoveryStrategy: `### 🚨 Chief of Staff Engineering Crisis Recovery Roadmap

Due to tight development margins and frontend integration blockages, we have engaged the **Architecture Shield Protocol** to secure your core deployment gates.

We have audited your **3 core engineering features** requiring **20 active development hours**. Reorganizing testing pipelines raises your release probability from **72% to 94%**.

#### Strategic Directives:
1. **Scope Reduction**: Scale back complex automated testing fixtures in your initial Jest PR. Deliver simple happy-path endpoint tests to unblock merge reviews immediately.
2. **Postpone Staging CI/CD**: Avoid spending cycles configuring multi-region staging environment pipelines. Stick to standard local Docker environments.
3. **Dedicated Sprint Block**: Protect daily morning blocks from meetings to write OAuth token validation loops.`,
      prioritizedTaskIds: ['Security: Implement OAuth2 Token Verification Middleware', 'Database: Setup PostgreSQL Connection Pool & Drizzle ORM'],
      postponedTaskIds: ['Testing: Setup Jest/Supertest End-to-End API Suite'],
      allocatedHoursPerDay: [
        { date: new Date().toISOString().split('T')[0], hours: 5 },
        { date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 5 },
        { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 3 },
        { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 3 },
        { date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 2 },
        { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 2 },
        { date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 0 }
      ],
      projectedCompletionProbability: 94,
      impactAnalysis: {
        currentProbability: 72,
        afterProbability: 94,
        improvement: 22
      },
      currentSituation: {
        totalTasks: 3,
        remainingHours: 20,
        availableHours: 32,
        conflictCount: 1,
        currentCompletionProbability: 72
      },
      executiveRecommendations: [
        {
          actionType: 'first',
          taskTitle: 'Security: Implement OAuth2 Token Verification Middleware',
          recommendation: 'Construct Bearer token validation logic utilizing static security verification hashes first, bypassing live provider networks during staging.',
          reasoning: 'Crucial gate. Blocks every downstream endpoint, and the delivery threshold is 3 days.'
        },
        {
          actionType: 'reduce_scope',
          taskTitle: 'Database: Setup PostgreSQL Connection Pool & Drizzle ORM',
          recommendation: 'Initialize basic environment connections using raw queries if ORM syntax migration presents an initial hurdle.',
          reasoning: 'Reduces startup friction and gets database ingestion online early.'
        },
        {
          actionType: 'postpone',
          taskTitle: 'Testing: Setup Jest/Supertest End-to-End API Suite',
          recommendation: 'Postpone Jest pipeline setup until auth middleware is fully compiled and merged to main.',
          reasoning: 'Safe postponement. Testing lacks active dependencies and can be backfilled safely.'
        }
      ],
      calendarEvents: [
        {
          summary: '🛡️ Engineering Sprint: Auth Middleware Interceptor',
          description: 'Guardian-allocated focus block. Goal: Implement bearer token parsing and auth validation logic.',
          startDateTime: `${new Date().toISOString().split('T')[0]}T09:00:00Z`,
          endDateTime: `${new Date().toISOString().split('T')[0]}T11:00:00Z`
        },
        {
          summary: '🛡️ Engineering Sprint: PostgreSQL Pooling Setup',
          description: 'Guardian-allocated focus block. Configure DB credentials, ORM structures, and pooling parameters.',
          startDateTime: `${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}T10:00:00Z`,
          endDateTime: `${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}T12:00:00Z`
        }
      ]
    }
  },
  {
    id: 'marketing_campaign',
    name: 'Marketing Campaign',
    description: 'Q3 Global Product Launch Strategy & Distribution Campaign',
    badge: 'Marketing',
    completionProbability: 75,
    uploadedDocs: [
      {
        name: 'Q3_Global_Launch_Strategy.txt',
        size: '52 KB',
        type: 'text/plain',
        uploadedAt: '01:12:05 PM',
        previewText: 'PROJECT PLAN: Q3 GLOBAL PRODUCT LAUNCH CAMPAIGN\nTarget Audience: B2B tech developers & decision makers\n\nREQUIRED DELIVERABLES:\n- PR Release copywriting and distribution setup: Due in 2 days. Critical path item.\n- Paid Advertising Ad Sets and Conversion Pixel config: Due in 4 days.\n- Funnel Analytics Telemetry Reports and Dashboards: Due in 10 days.'
      }
    ],
    summary: `### 📣 Strategic Marketing Assessment: Q3 Global Product Launch
    
We have ingested and processed the Q3 Global Product Launch campaign documents. 

The AI has scheduled your campaign preparation. Drafting and distributing the **PR Wire Release Copy** is marked as your critical-path bottleneck. It is followed by the **Paid Advertising Ad Sets configuration** and the development of your **Analytics Funnel Dashboard** to track live conversion events.`,
    tasks: [
      {
        id: 'demo_mkt_task_1',
        title: 'PR Strategy: Finalize Release Copy & Wire Distribution',
        description: 'Draft the official launch press release, secure stakeholder approvals, and configure wire distribution schedules.',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        milestones: [
          'Draft core launch announcement copy',
          'Secure executive/legal stakeholder sign-off',
          'Configure distribution channels and embargo times'
        ],
        effortLevel: 'High',
        estimatedHours: 8,
        riskLevel: 'Critical',
        riskExplanation: 'Critical Risk: Press distribution schedules have strict embargo cutoffs. Missing this slips the entire social and launch timeline.',
        dependencies: [],
        category: 'Project Brief',
        status: 'pending',
        createdAt: Date.now(),
        confidenceScore: 75
      },
      {
        id: 'demo_mkt_task_2',
        title: 'Acquisition: Launch Paid Ad Sets & Config Pixel Pixels',
        description: 'Build responsive search/display copy, define custom developer target criteria, and set up landing page event conversion tags.',
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days from now
        milestones: [
          'Draft ad copy variations (Headlines, CTAs)',
          'Define targeting criteria (Tech Stack, Job Role)',
          'Inject and verify web conversion tracking tags'
        ],
        effortLevel: 'Medium',
        estimatedHours: 6,
        riskLevel: 'Warning',
        riskExplanation: 'Warning Risk: Ad platform spend authorization requires 24-hour review buffers.',
        dependencies: ['PR Strategy: Finalize Release Copy & Wire Distribution'],
        category: 'Action Item',
        status: 'pending',
        createdAt: Date.now() + 1,
        confidenceScore: 83
      },
      {
        id: 'demo_mkt_task_3',
        title: 'Telemetry: Build Campaign Performance Funnel Dashboards',
        description: 'Configure GA4 reporting filters. Create visual data boards linking UTM sources to mock conversion events.',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
        milestones: [
          'Configure custom UTM parameters sheet',
          'Build performance dashboard mock views',
          'Verify webhook conversion alerts to Slack'
        ],
        effortLevel: 'Low',
        estimatedHours: 4,
        riskLevel: 'Safe',
        riskExplanation: 'Safe Risk: Comfortable timeline with pre-configured templates and lower implementation urgency.',
        dependencies: ['Acquisition: Launch Paid Ad Sets & Config Pixel Pixels'],
        category: 'Milestone',
        status: 'pending',
        createdAt: Date.now() + 2,
        confidenceScore: 95
      }
    ],
    missionControl: {
      missionObjective: 'Execute the B2B press wire launch campaign and warm up custom ad sets to drive targeted developer acquisitions.',
      keyDeliverables: [
        'Global Launch Press Release Copy',
        'Developer-Targeted Search Ad Sets',
        'Conversion Funnel Performance Dashboard'
      ],
      estimatedEffort: '18 focus hours total, pacing roughly 4.5 hours per day over a 4-day cycle.',
      deadlineAnalysis: 'PR distribution wire release represents a critical schedule gate due in 2 days. Successfully distributing PR under embargo triggers social ad sets campaigns sequentially.',
      riskFactors: [
        {
          factor: 'Ad Review Disapproval',
          severity: 'High',
          mitigation: 'Avoid using sensationalist tech jargon in ad copy to pass platform compliance guidelines on first attempt.'
        },
        {
          factor: 'Press Kit Embargo Slip',
          severity: 'Medium',
          mitigation: 'Watermark media assets and restrict folder permissions to verified journalists prior to wire launch.'
        }
      ],
      criticalPathDependencies: [
        'Stakeholder Release Approvals',
        'Paid Search Ad Creative Approvals'
      ],
      successProbability: 75,
      recommendedExecutionStrategy: `### 📣 Launch Execution Protocol
      
#### Phase 1: Embargo PR Prep (Days 1-2)
- Focus entirely on copywriting and legal reviews for **PR distribution copy**.
- Establish contact sheets with tech journalists ahead of wire scheduling.

#### Phase 2: Traffic Acquisition Setup (Days 3-4)
- Formulate Google and Facebook ad copy templates.
- Test tracking tag triggers on staging landing pages.

#### Phase 3: Traffic Analytics Dashboard (Days 5-10)
- Link campaign parameters to GA4.
- Build daily conversion performance review layouts.`
    },
    crisisPlan: {
      recoveryStrategy: `### 🚨 Chief of Staff Marketing Campaign Crisis Recovery Roadmap

Due to tight wire-distribution cutoff windows and press schedules, we have engaged the **Campaign Shield Protocol** to secure your Q3 launch deliverables.

We have audited your **3 campaign milestones** requiring **18 hours of work**. Reorganizing assets raises your launch probability from **75% to 95%**.

#### Strategic Directives:
1. **De-Scope Custom Visuals**: Standardize paid ad creatives using pre-designed corporate templates. Avoid waiting on custom design asset loops.
2. **Postpone Real-time Webhooks**: Focus on standard GA4 analytics reporting; postpone building Slack/Discord automated webhook triggers.
3. **Time-block PR Drafts**: Commit 3 hours tomorrow morning specifically to press drafting.`,
      prioritizedTaskIds: ['PR Strategy: Finalize Release Copy & Wire Distribution', 'Acquisition: Launch Paid Ad Sets & Config Pixel Pixels'],
      postponedTaskIds: ['Telemetry: Build Campaign Performance Funnel Dashboards'],
      allocatedHoursPerDay: [
        { date: new Date().toISOString().split('T')[0], hours: 5 },
        { date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 5 },
        { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 3 },
        { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 3 },
        { date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 2 },
        { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], hours: 0 }
      ],
      projectedCompletionProbability: 95,
      impactAnalysis: {
        currentProbability: 75,
        afterProbability: 95,
        improvement: 20
      },
      currentSituation: {
        totalTasks: 3,
        remainingHours: 18,
        availableHours: 28,
        conflictCount: 1,
        currentCompletionProbability: 75
      },
      executiveRecommendations: [
        {
          actionType: 'first',
          taskTitle: 'PR Strategy: Finalize Release Copy & Wire Distribution',
          recommendation: 'Complete baseline press release copy first, utilizing established templates, and secure wire channels immediately to avoid embargo delay.',
          reasoning: 'Critical bottleneck. Embargo wire deadlines cannot be postponed without delaying the entire Q3 launch.'
        },
        {
          actionType: 'reduce_scope',
          taskTitle: 'Acquisition: Launch Paid Ad Sets & Config Pixel Pixels',
          recommendation: 'Configure only 2 high-intent ad sets rather than the planned multi-persona matrix, and verify tracking on primary tags only.',
          reasoning: 'Saves 3-4 hours of complex campaign build and review time, ensuring safe launch targets.'
        },
        {
          actionType: 'postpone',
          taskTitle: 'Telemetry: Build Campaign Performance Funnel Dashboards',
          recommendation: 'Postpone advanced analytics dashboard configuration until paid campaigns are live and collecting traffic.',
          reasoning: 'Sufficient runway. Creating visual reports has zero downstream effect prior to launch traffic arriving.'
        }
      ],
      calendarEvents: [
        {
          summary: '🛡️ Campaign Sprint: Draft Press Wire Release Copy',
          description: 'Guardian-allocated focus block. Finalize launch story copywriting and media list alignments.',
          startDateTime: `${new Date().toISOString().split('T')[0]}T09:00:00Z`,
          endDateTime: `${new Date().toISOString().split('T')[0]}T11:00:00Z`
        },
        {
          summary: '🛡️ Campaign Sprint: Setup Search & Display Ads',
          description: 'Guardian-allocated focus block. Configure target coordinates, budgets, and landing page pixel tags.',
          startDateTime: `${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}T10:00:00Z`,
          endDateTime: `${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}T12:00:00Z`
        }
      ]
    }
  }
];
