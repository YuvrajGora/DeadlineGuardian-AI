import { Task } from '../types';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Prepare configuration
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfigJson.measurementId,
  databaseId: firebaseConfigJson.firestoreDatabaseId || "(default)"
};

// Check if Firebase is configured
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "";

let app: any = null;
let db: any = null;
let auth: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = firebaseConfig.databaseId && firebaseConfig.databaseId !== "(default)"
      ? getFirestore(app, firebaseConfig.databaseId)
      : getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase & Firestore initialized successfully with project ID:", firebaseConfig.projectId);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.log("Firebase is not fully configured. Falling back to local Sandbox storage.");
}

// In-memory callbacks for active auth session changes
const authCallbacks: {
  onSuccess?: (user: User, token: string | null) => void;
  onFailure?: () => void;
} = {};

/**
 * Check if Firestore is available and active.
 */
export const isFirebaseAvailable = (): boolean => {
  return db !== null;
};

/**
 * Check if Firebase Auth is available and active.
 */
export const isFirebaseAuthAvailable = (): boolean => {
  return auth !== null;
};

/**
 * Get configured Firebase Project ID.
 */
export const getFirebaseProjectId = (): string => {
  return firebaseConfig.projectId || "";
};

/**
 * Listen for authentication changes and handle saved user sessions.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  authCallbacks.onSuccess = onAuthSuccess;
  authCallbacks.onFailure = onAuthFailure;

  let unsubscribeFirebase: (() => void) | null = null;

  if (auth) {
    unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        };
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('dg_user', JSON.stringify(user));
        localStorage.setItem('dg_token', token);
        if (onAuthSuccess) {
          onAuthSuccess(user, token);
        }
      } else {
        // Fallback to check localStorage sandbox/server OAuth sessions
        const savedUser = localStorage.getItem('dg_user');
        const savedToken = localStorage.getItem('dg_token');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser) as User;
            if (onAuthSuccess) {
              onAuthSuccess(user, savedToken);
            }
          } catch (e) {
            if (onAuthFailure) onAuthFailure();
          }
        } else {
          if (onAuthFailure) onAuthFailure();
        }
      }
    });
  } else {
    // If Firebase Auth is not configured, fallback to localStorage entirely
    const savedUser = localStorage.getItem('dg_user');
    const savedToken = localStorage.getItem('dg_token');
    setTimeout(() => {
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser) as User;
          if (onAuthSuccess) {
            onAuthSuccess(user, savedToken);
          }
        } catch (e) {
          if (onAuthFailure) onAuthFailure();
        }
      } else {
        if (onAuthFailure) onAuthFailure();
      }
    }, 100);
  }

  return () => {
    authCallbacks.onSuccess = undefined;
    authCallbacks.onFailure = undefined;
    if (unsubscribeFirebase) {
      unsubscribeFirebase();
    }
  };
};

/**
 * Handle Google Sign-In via Firebase Auth or fall back to custom/Sandbox OAuth flow.
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (auth) {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar');
      provider.addScope('https://www.googleapis.com/auth/calendar.events');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken || "firebase_auth_token";
      
      const user: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      };
      
      localStorage.setItem('dg_user', JSON.stringify(user));
      localStorage.setItem('dg_token', accessToken);
      
      if (authCallbacks.onSuccess) {
        authCallbacks.onSuccess(user, accessToken);
      }
      return { user, accessToken };
    } catch (err) {
      console.error("Firebase Auth sign in failed, falling back to server OAuth:", err);
    }
  }

  try {
    // 1. Fetch the custom Google OAuth authorization URL from backend
    const response = await fetch('/api/auth/google/url');
    if (!response.ok) {
      throw new Error('Failed to retrieve authentication URL from server.');
    }
    const data = await response.json();

    // 2. If credentials are not configured yet, gracefully fall back to a fully interactive Local Sandbox
    if (data.error === "MISSING_CREDENTIALS") {
      console.warn("Google Workspace credentials are not configured. Launching local Sandbox mode.");
      
      const sandboxUser: User = {
        uid: "sandbox_user_123",
        email: "yuvrajgora10mar@gmail.com",
        displayName: "Yuvraj Gora (Sandbox)",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
      };
      
      // Use "sandbox_" prefix to enable simulated calendar syncs in CrisisMode.tsx
      const sandboxToken = "sandbox_token_demo_only";

      localStorage.setItem('dg_user', JSON.stringify(sandboxUser));
      localStorage.setItem('dg_token', sandboxToken);

      if (authCallbacks.onSuccess) {
        authCallbacks.onSuccess(sandboxUser, sandboxToken);
      }

      return { user: sandboxUser, accessToken: sandboxToken };
    }

    // 3. Open OAuth popup for Google Workspace
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      data.url,
      'google_oauth_popup',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      throw new Error("Popup blocked! Please allow popups to connect your Google Calendar.");
    }

    // 4. Listen for postMessage from callback handler in popup
    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        // Allow localhost and standard sandbox previews
        const origin = event.origin;
        if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('firebaseapp.com')) {
          return;
        }

        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          const { user, accessToken } = event.data.payload;

          localStorage.setItem('dg_user', JSON.stringify(user));
          localStorage.setItem('dg_token', accessToken);

          if (authCallbacks.onSuccess) {
            authCallbacks.onSuccess(user, accessToken);
          }

          window.removeEventListener('message', handleMessage);
          resolve({ user, accessToken });
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup is closed
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          reject(new Error("Authentication popup closed by user."));
        }
      }, 1000);
    });

  } catch (err) {
    console.error("Authentication failed:", err);
    throw err;
  }
};

/**
 * Handle logout
 */
export const logout = async () => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase Auth sign out failed:", e);
    }
  }
  localStorage.removeItem('dg_user');
  localStorage.removeItem('dg_token');
  if (authCallbacks.onFailure) {
    authCallbacks.onFailure();
  }
};

// --- Firestore Helpers for Tasks ---

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  if (db && !userId.startsWith('sandbox')) {
    try {
      const colRef = collection(db, 'users', userId, 'tasks');
      const querySnapshot = await getDocs(colRef);
      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() } as Task);
      });
      if (tasks.length > 0) {
        localStorage.setItem(`dg_tasks_${userId}`, JSON.stringify(tasks));
        return tasks;
      }
    } catch (e) {
      console.error("Error loading tasks from Firestore:", e);
    }
  }

  const key = `dg_tasks_${userId}`;
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data) as Task[];
    } catch (e) {
      console.error("Failed to parse local tasks:", e);
    }
  }
  return [];
};

export const saveUserTask = async (userId: string, task: Task): Promise<void> => {
  const tasks = await getUserTasks(userId);
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  if (existingIndex > -1) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }
  localStorage.setItem(`dg_tasks_${userId}`, JSON.stringify(tasks));

  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'tasks', task.id);
      await setDoc(docRef, task, { merge: true });
    } catch (e) {
      console.error("Failed to save task to Firestore:", e);
    }
  }
};

export const deleteUserTask = async (userId: string, taskId: string): Promise<void> => {
  const tasks = await getUserTasks(userId);
  const updated = tasks.filter(t => t.id !== taskId);
  localStorage.setItem(`dg_tasks_${userId}`, JSON.stringify(updated));

  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'tasks', taskId);
      await deleteDoc(docRef);
    } catch (e) {
      console.error("Failed to delete task from Firestore:", e);
    }
  }
};

export const toggleTaskStatus = async (userId: string, taskId: string, completed: boolean): Promise<void> => {
  const tasks = await getUserTasks(userId);
  const updated = tasks.map(t => {
    if (t.id === taskId) {
      return { ...t, status: completed ? 'completed' as const : 'pending' as const };
    }
    return t;
  });
  localStorage.setItem(`dg_tasks_${userId}`, JSON.stringify(updated));

  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'tasks', taskId);
      await setDoc(docRef, { status: completed ? 'completed' : 'pending' }, { merge: true });
    } catch (e) {
      console.error("Failed to toggle task status in Firestore:", e);
    }
  }
};

export const saveMultipleTasks = async (userId: string, newTasks: Task[]): Promise<void> => {
  const tasks = await getUserTasks(userId);
  
  const merged = [...tasks];
  newTasks.forEach(newTask => {
    const idx = merged.findIndex(t => t.id === newTask.id || t.title === newTask.title);
    if (idx > -1) {
      merged[idx] = { ...merged[idx], ...newTask };
    } else {
      merged.push(newTask);
    }
  });

  localStorage.setItem(`dg_tasks_${userId}`, JSON.stringify(merged));

  if (db && !userId.startsWith('sandbox')) {
    try {
      const batch = writeBatch(db);
      newTasks.forEach(task => {
        const docRef = doc(db, 'users', userId, 'tasks', task.id);
        batch.set(docRef, task, { merge: true });
      });
      await batch.commit();
    } catch (e) {
      console.error("Failed to save multiple tasks to Firestore:", e);
    }
  }
};

// --- Firestore Custom Document Helpers ---

/**
 * Save Mission Control state to Firestore and localStorage fallback.
 */
export const saveMissionControl = async (userId: string, data: any): Promise<void> => {
  const key = `dg_mission_control_${userId}`;
  if (data) {
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    localStorage.removeItem(key);
  }

  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', 'missionControl');
      await setDoc(docRef, { data }, { merge: true });
    } catch (e) {
      console.error("Failed to save mission control to Firestore:", e);
    }
  }
};

/**
 * Load Mission Control state.
 */
export const getMissionControl = async (userId: string): Promise<any | null> => {
  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', 'missionControl');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const val = docSnap.data().data;
        localStorage.setItem(`dg_mission_control_${userId}`, JSON.stringify(val));
        return val;
      }
    } catch (e) {
      console.error("Failed to load mission control from Firestore:", e);
    }
  }

  const saved = localStorage.getItem(`dg_mission_control_${userId}`);
  return saved ? JSON.parse(saved) : null;
};

/**
 * Save Uploaded Document Metadata to Firestore and localStorage fallback.
 */
export const saveUploadedDocs = async (userId: string, docs: any[]): Promise<void> => {
  const key = `dg_uploaded_docs_${userId}`;
  localStorage.setItem(key, JSON.stringify(docs));

  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', 'uploadedDocs');
      await setDoc(docRef, { docs }, { merge: true });
    } catch (e) {
      console.error("Failed to save uploaded docs to Firestore:", e);
    }
  }
};

/**
 * Load Uploaded Document Metadata.
 */
export const getUploadedDocs = async (userId: string): Promise<any[]> => {
  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', 'uploadedDocs');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const val = docSnap.data().docs;
        localStorage.setItem(`dg_uploaded_docs_${userId}`, JSON.stringify(val));
        return val;
      }
    } catch (e) {
      console.error("Failed to load uploaded docs from Firestore:", e);
    }
  }

  const saved = localStorage.getItem(`dg_uploaded_docs_${userId}`);
  return saved ? JSON.parse(saved) : [];
};

/**
 * Save Executive Briefing to Firestore and localStorage fallback.
 */
export const saveExecutiveBriefing = async (userId: string, briefing: any): Promise<void> => {
  const key = `dg_briefing_${userId}`;
  localStorage.setItem(key, JSON.stringify(briefing));

  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', 'executiveBriefing');
      await setDoc(docRef, { briefing }, { merge: true });
    } catch (e) {
      console.error("Failed to save executive briefing to Firestore:", e);
    }
  }
};

/**
 * Load Executive Briefing.
 */
export const getExecutiveBriefing = async (userId: string): Promise<any | null> => {
  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', 'executiveBriefing');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const val = docSnap.data().briefing;
        localStorage.setItem(`dg_briefing_${userId}`, JSON.stringify(val));
        return val;
      }
    } catch (e) {
      console.error("Failed to load executive briefing from Firestore:", e);
    }
  }

  const saved = localStorage.getItem(`dg_briefing_${userId}`);
  return saved ? JSON.parse(saved) : null;
};

/**
 * Save Save My Week / Executive Decision Engine plans to Firestore and localStorage fallback.
 */
export const saveCrisisPlan = async (userId: string, plan: any): Promise<void> => {
  const key = `dg_crisis_plan_${userId}`;
  if (plan) {
    localStorage.setItem(key, JSON.stringify(plan));
  } else {
    localStorage.removeItem(key);
  }

  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', 'crisisPlan');
      await setDoc(docRef, { plan }, { merge: true });
    } catch (e) {
      console.error("Failed to save crisis plan to Firestore:", e);
    }
  }
};

/**
 * Load Save My Week / Executive Decision Engine plans.
 */
export const getCrisisPlan = async (userId: string): Promise<any | null> => {
  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', 'crisisPlan');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const val = docSnap.data().plan;
        localStorage.setItem(`dg_crisis_plan_${userId}`, JSON.stringify(val));
        return val;
      }
    } catch (e) {
      console.error("Failed to load crisis plan from Firestore:", e);
    }
  }

  const saved = localStorage.getItem(`dg_crisis_plan_${userId}`);
  return saved ? JSON.parse(saved) : null;
};

/**
 * Save User Preferences to Firestore and localStorage fallback.
 */
export const saveUserPreferences = async (userId: string, preferences: any): Promise<void> => {
  const key = `dg_user_preferences_${userId}`;
  localStorage.setItem(key, JSON.stringify(preferences));

  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', 'userPreferences');
      await setDoc(docRef, { preferences }, { merge: true });
    } catch (e) {
      console.error("Failed to save preferences to Firestore:", e);
    }
  }
};

/**
 * Load User Preferences.
 */
export const getUserPreferences = async (userId: string): Promise<any | null> => {
  if (db && !userId.startsWith('sandbox')) {
    try {
      const docRef = doc(db, 'users', userId, 'documents', 'userPreferences');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const val = docSnap.data().preferences;
        localStorage.setItem(`dg_user_preferences_${userId}`, JSON.stringify(val));
        return val;
      }
    } catch (e) {
      console.error("Failed to load preferences from Firestore:", e);
    }
  }

  const saved = localStorage.getItem(`dg_user_preferences_${userId}`);
  return saved ? JSON.parse(saved) : null;
};
