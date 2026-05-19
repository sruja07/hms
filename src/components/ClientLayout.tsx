"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { useState, useEffect } from "react";
import { 
  Lock, 
  ShieldAlert, 
  UserCheck, 
  Users,
  Activity,
  User,
  KeyRound,
  Home
} from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("staff");
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Strictly clinical routes ALWAYS require authentication (Lockscreen if unauthenticated)
  const strictlyClinicalRoutes = ["/dashboard", "/patients", "/wards", "/billing"];
  
  // Shared routes are public for patient actions, but clinical when authenticated
  const sharedRoutes = ["/doctors", "/appointments"];

  const isStrictlyClinical = strictlyClinicalRoutes.some(route => pathname === route || pathname.startsWith(route));
  const isShared = sharedRoutes.some(route => pathname === route || pathname.startsWith(route));

  // Determine if we should show the Clinical Sidebar and Layout
  const isClinical = isStrictlyClinical || (isShared && isAuthenticated);

  // Monitor path changes to handle strict session-only lock behavior!
  useEffect(() => {
    const session = sessionStorage.getItem("tulsi_session");
    const role = sessionStorage.getItem("tulsi_role") || "staff";

    if (isClinical) {
      if (session === "true") {
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      // HIGH SECURITY DIRECTIVE:
      // The moment the user exits the clinical workspace routes to visit public portal pages,
      // we immediately clear active credentials so it is guaranteed to ask for the password next time!
      sessionStorage.removeItem("tulsi_session");
      sessionStorage.removeItem("tulsi_role");
      setIsAuthenticated(false);
    }
    setCheckingAuth(false);
  }, [pathname, isClinical]);

  // Handle standard credential log-in
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoginLoading(true);

    // Simple robust hospital credentials configuration
    setTimeout(() => {
      if (username.toLowerCase() === "admin" && password === "admin123") {
        sessionStorage.setItem("tulsi_session", "true");
        sessionStorage.setItem("tulsi_role", "admin");
        setIsAuthenticated(true);
        setUserRole("admin");
        setErrorMsg("");
      } else if (username.toLowerCase() === "staff" && password === "staff123") {
        sessionStorage.setItem("tulsi_session", "true");
        sessionStorage.setItem("tulsi_role", "staff");
        setIsAuthenticated(true);
        setUserRole("staff");
        setErrorMsg("");
      } else {
        setErrorMsg("❌ Invalid username or passcode. Please check hospital records.");
      }
      setLoginLoading(false);
    }, 400);
  };

  // Quick Demo Access Login helpers
  const triggerDemoLogin = (role: "admin" | "staff") => {
    setErrorMsg("");
    setLoginLoading(true);
    setTimeout(() => {
      if (role === "admin") {
        sessionStorage.setItem("tulsi_session", "true");
        sessionStorage.setItem("tulsi_role", "admin");
        setIsAuthenticated(true);
        setUserRole("admin");
      } else {
        sessionStorage.setItem("tulsi_session", "true");
        sessionStorage.setItem("tulsi_role", "staff");
        setIsAuthenticated(true);
        setUserRole("staff");
      }
      setLoginLoading(false);
    }, 300);
  };

  // Perform logout action
  const handleLogout = () => {
    sessionStorage.removeItem("tulsi_session");
    sessionStorage.removeItem("tulsi_role");
    setIsAuthenticated(false);
    setUserRole("staff");
    setUsername("");
    setPassword("");
    setErrorMsg("");
  };

  // Loading phase blocker: only for strictly clinical routes to avoid public layout flash
  if (checkingAuth && isStrictlyClinical) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Activity className="w-12 h-12 text-[#f97316] animate-spin" />
      </div>
    );
  }

  // If strictly clinical but unauthenticated -> show beautiful lock screen login portal!
  if (isStrictlyClinical && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        {/* Soft abstract brand blur background circles */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Secure Form Card */}
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
          
          {/* Top Brand & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20 mb-4 animate-bounce">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Tulsi Hospitals</h2>
            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mt-1.5">Secure Staff Workspace Gate</p>
          </div>

          {/* Actual Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs font-semibold flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Username input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. staff or admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all text-sm font-semibold"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Workspace Passcode</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all text-sm font-semibold"
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 rounded-xl font-bold bg-[#f97316] hover:bg-[#ea580c] text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loginLoading ? "Verifying Credentials..." : "Access Workspace →"}
            </button>
          </form>

          {/* Quick Demo Access (WOW factor for user testing) */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <p className="text-[10px] text-center font-extrabold text-slate-400 uppercase tracking-widest">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => triggerDemoLogin("staff")}
                className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Staff Access
              </button>
              <button
                onClick={() => triggerDemoLogin("admin")}
                className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Admin Access
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-500 italic mt-2">
              Demo details: use <code className="text-slate-300 bg-white/5 px-1 py-0.5 rounded">staff123</code> / <code className="text-slate-300 bg-white/5 px-1 py-0.5 rounded">admin123</code> above
            </p>
          </div>

        </div>

        {/* Back to public home */}
        <a 
          href="/" 
          className="mt-6 text-xs text-slate-400 hover:text-[#f97316] transition-colors font-bold uppercase tracking-wider flex items-center gap-1"
        >
          ← Return to Public Patient Portal
        </a>
      </div>
    );
  }

  // If in clinical context (strictly clinical, or shared route when logged in) -> render clinical sidebar layout!
  if (isClinical) {
    return (
      <div className="flex min-h-screen bg-slate-50 w-full">
        {/* Sidebar */}
        <Sidebar userRole={userRole} onLogout={handleLogout} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden w-full">
          {/* Top Bar for Clinical Workspace */}
          <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-30 w-full">
            <span className="text-sm font-bold text-slate-800 uppercase tracking-widest bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
              🩺 Clinical Workspace
            </span>
            <div className="flex items-center gap-3">
              <a 
                href="/" 
                className="text-xs border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Home className="w-4 h-4 text-slate-500" />
                Home
              </a>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded border">
                Live Server
              </span>
              <a 
                href="/" 
                className="text-xs bg-[#f97316] text-white hover:bg-orange-600 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm"
              >
                Back to Patient Portal
              </a>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-300">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Otherwise, render standard public portal view with TopNav
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full">
      <TopNav />
      <main className="flex-1 w-full">{children}</main>
      
      {/* Premium Footer */}
      <footer className="bg-[#0f172a] text-slate-400 py-8 border-t border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-white font-bold text-lg tracking-tight">Tulsi Hospitals</span>
            <p className="text-xs text-slate-500">© 2026 Srujan. All rights reserved.</p>
          </div>
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Main Campus Location</span>
            <p className="text-sm text-slate-400">98, HAL Airport Road, Bengaluru, Karnataka 560017</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
