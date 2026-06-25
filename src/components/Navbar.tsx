import React from 'react';
import { User } from '../lib/firebase';
import { Shield, LogOut, Calendar, Clock, UserCheck } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  hasCalendarToken: boolean;
}

export default function Navbar({ user, onLogin, onLogout, isLoggingIn, hasCalendarToken }: NavbarProps) {
  return (
    <nav className="border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4" id="navbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            <span className="font-display text-base font-black tracking-tighter">DG</span>
          </div>
          <div>
            <h1 className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
              DeadlineGuardian <span className="text-indigo-400 text-xs font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">AI</span>
            </h1>
            <p className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase">Chief of Staff Core</p>
          </div>
        </div>

        {/* User / Auth Controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Google Calendar Sync Indicator */}
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                {hasCalendarToken ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-zinc-200 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Calendar Connected
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                    <span className="text-zinc-400">Sandbox Workspace</span>
                  </>
                )}
              </div>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 pr-4 rounded-full">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm border border-indigo-500">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-zinc-100 line-clamp-1">{user.displayName || "Guardian User"}</p>
                  <p className="text-[9px] font-mono text-zinc-500 line-clamp-1">{user.email}</p>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                id="sign-out-btn"
                onClick={onLogout}
                className="p-2.5 rounded-xl border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/5 text-zinc-400 hover:text-rose-400 transition-all duration-200 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              id="google-sign-in-btn"
              onClick={onLogin}
              disabled={isLoggingIn}
              className="group relative flex items-center gap-3 bg-white hover:bg-zinc-100 text-zinc-950 font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-50"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span className="font-display font-semibold text-sm">Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
