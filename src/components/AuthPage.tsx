import React, { useState, useEffect } from "react";
import { Key, Mail, User, ShieldCheck, HelpCircle, Check, ArrowRight, LogIn, UserPlus } from "lucide-react";

export interface UserAccount {
  email: string;
  fullName: string;
  role: "admin" | "developer" | "venture_builder";
  signUpDate: string;
  status: "active" | "suspended";
}

interface AuthPageProps {
  onLoginSuccess?: (user: UserAccount) => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, currentUser, onLogout }) => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  
  // Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserAccount["role"]>("developer");
  
  // Feedback
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Key storage helpers
  const getUsersFromStorage = (): UserAccount[] => {
    const raw = localStorage.getItem("startup_users");
    if (!raw) {
      // Default baseline users pre-loaded for rich administrative experience
      const defaultUsers: UserAccount[] = [
        {
          email: "admin@startup.ai",
          fullName: "Maan Barazy (Administrator)",
          role: "admin",
          signUpDate: "2026-01-15",
          status: "active"
        },
        {
          email: "faisal@riyadh.vc",
          fullName: "Faisal Al-Jassim",
          role: "venture_builder",
          signUpDate: "2026-04-10",
          status: "active"
        },
        {
          email: "dr.amina@stanford.edu",
          fullName: "Dr. Amina El-Khoury",
          role: "developer",
          signUpDate: "2026-05-22",
          status: "active"
        }
      ];
      localStorage.setItem("startup_users", JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(raw);
  };

  const saveUsersToStorage = (users: UserAccount[]) => {
    localStorage.setItem("startup_users", JSON.stringify(users));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password === "Maan70939779") {
      const match: UserAccount = {
        email: "admin@startup.ai",
        fullName: "Maan Barazy (Administrator)",
        role: "admin",
        signUpDate: "2026-01-15",
        status: "active"
      };
      setSuccessMsg(`Session authenticated successfully as ${match.fullName}.`);
      
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(match);
        }
      }, 800);
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg("Please complete all required security credentials.");
      return;
    }

    const currentUsers = getUsersFromStorage();
    const match = currentUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!match) {
      setErrorMsg("No account associated with this email exists in our system registry.");
      return;
    }

    if (match.status === "suspended") {
      setErrorMsg("This user account has been suspended by the administrator.");
      return;
    }

    // Accept any password for smooth developer preview simulation
    setSuccessMsg(`Session authenticated successfully as ${match.fullName}.`);
    
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(match);
      }
    }, 800);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password || !fullName.trim()) {
      setErrorMsg("Please provide all required registration values.");
      return;
    }

    const currentUsers = getUsersFromStorage();
    const existing = currentUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      setErrorMsg("An account with this email address already exists.");
      return;
    }

    const newAcct: UserAccount = {
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      role: selectedRole,
      signUpDate: new Date().toISOString().split("T")[0],
      status: "active"
    };

    const updated = [...currentUsers, newAcct];
    saveUsersToStorage(updated);

    // Save active auth users back to make them dynamic
    setSuccessMsg("Registration complete. Log in credentials added to live administrative panel.");
    
    setTimeout(() => {
      // Auto Sign-in
      if (onLoginSuccess) {
        onLoginSuccess(newAcct);
      }
    }, 1000);
  };

  return (
    <div id="auth-page-root" className="p-6 max-w-lg mx-auto space-y-6 text-black bg-white">
      
      {/* Visual Header */}
      <div className="text-center space-y-2 border-b border-border pb-4">
        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block font-mono">CREDENTIAL GATEWAY</span>
        <h2 className="text-lg font-black text-black uppercase tracking-tight flex items-center justify-center gap-1.5">
          <ShieldCheck size={18} className="text-black" />
          SYSTEM AUTHENTICATION
        </h2>
        <p className="text-[10px] text-zinc-600 font-sans max-w-sm mx-auto">
          Sign up to propose new startups, view secure database registries, or activate direct automated webhooks.
        </p>
      </div>

      {currentUser ? (
        /* Logged In State */
        <div className="border border-black p-5 space-y-4 bg-zinc-50 font-mono text-xs">
          <span className="text-[8px] bg-black text-white px-2 py-0.5 font-bold uppercase block w-max">Active Session</span>
          
          <div className="space-y-1.5 leading-relaxed">
            <p>NAME: <strong className="text-black uppercase">{currentUser.fullName}</strong></p>
            <p>EMAIL: <strong className="text-black">{currentUser.email}</strong></p>
            <p>ROLE PRESET: <strong className="text-black uppercase">{currentUser.role}</strong></p>
            <p>REGISTRATION STAMP: <strong className="text-black">{currentUser.signUpDate}</strong></p>
            <p>STATUS: <span className="text-green-700 font-bold">SYSTEM_ONLINE</span></p>
          </div>

          <div className="pt-3 border-t border-zinc-200">
            <button
              onClick={onLogout}
              className="w-full py-2 border border-red-600 text-red-600 font-bold uppercase text-[10px] cursor-pointer hover:bg-red-50 transition-colors"
            >
              TERMINATE SECURITY SESSION (LOG OUT)
            </button>
          </div>
        </div>
      ) : (
        /* Sign-In / Sign-Up Form Box */
        <div className="border border-border p-5 space-y-4">
          
          {/* Form Switch tabs */}
          <div className="grid grid-cols-2 border border-border bg-zinc-100 p-0.5 font-mono text-[9px]">
            <button
              onClick={() => {
                setAuthMode("signin");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-1.5 font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-1 ${
                authMode === "signin" ? "bg-white text-black font-black border border-border" : "text-zinc-600 hover:text-black"
              }`}
            >
              <LogIn size={11} /> SIGN IN
            </button>
            <button
              onClick={() => {
                setAuthMode("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-1.5 font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-1 ${
                authMode === "signup" ? "bg-white text-black font-black border border-border" : "text-zinc-600 hover:text-black"
              }`}
            >
              <UserPlus size={11} /> SIGN UP / REGISTER
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 font-mono text-[10px] leading-tight">
              ERROR: {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-2.5 font-mono text-[10px] leading-tight flex items-center gap-1.5">
              <Check size={12} className="text-green-700" strokeWidth={3} /> {successMsg}
            </div>
          )}

          <form onSubmit={authMode === "signin" ? handleSignIn : handleSignUp} className="space-y-3 font-mono">
            
            {authMode === "signup" && (
              <div>
                <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-zinc-400">
                    <User size={12} />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samer Al-Aswad"
                    className="w-full bg-surface border border-border p-2 pl-8 text-[11px] focus:outline-none focus:border-black text-black"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-zinc-400">
                  <Mail size={12} />
                </span>
                <input
                  type="email"
                  required={authMode === "signup"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={authMode === "signin" ? "Optional if using Admin Password" : "e.g. admin@startup.ai"}
                  className="w-full bg-surface border border-border p-2 pl-8 text-[11px] focus:outline-none focus:border-black text-black"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 text-zinc-400">
                  <Key size={12} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface border border-border p-2 pl-8 text-[11px] focus:outline-none focus:border-black text-black"
                />
              </div>
            </div>

            {authMode === "signup" && (
              <div>
                <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">Requested Workspace Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full bg-surface border border-border p-2 text-[11px] focus:outline-none focus:border-black text-black"
                >
                  <option value="developer">Developer Preset (Standard API Sandbox)</option>
                  <option value="venture_builder">Venture Builder Preset (Access Ingestion Webhooks)</option>
                  <option value="admin">System Admin Preset (Full Auditing Console)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-black text-white hover:bg-zinc-800 font-bold uppercase text-[10.5px] cursor-pointer flex items-center justify-center gap-1"
            >
              {authMode === "signin" ? (
                <>
                  AUTHENTICATE SECURE SESSION <ArrowRight size={11} />
                </>
              ) : (
                <>
                  REGISTER AND ACQUIRE CREDENTIALS <ArrowRight size={11} />
                </>
              )}
            </button>

          </form>

          {/* Prompt info */}
          <div className="bg-zinc-50 p-2.5 border border-dashed border-zinc-200 text-[9.5px] text-zinc-500 leading-normal font-sans">
            <span className="font-bold text-black uppercase font-mono block mb-0.5">💡 Simulation Access Hint:</span>
            To access the **Admin Console** tab directly, you can simply use the admin password **`Maan70939779`** (no email required) to log in instantly.
          </div>

        </div>
      )}

    </div>
  );
};
