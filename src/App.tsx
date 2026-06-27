import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Workspace } from "./components/Workspace";
import { AdminPanel } from "./components/AdminPanel";
import { CyberHub } from "./components/CyberHub";
import { SystemLog } from "./types";

export default function App() {
  const [userStatus, setUserStatus] = useState<"not_applied" | "pending_approval" | "approved">("not_applied");
  const [trialExpiresAt, setTrialExpiresAt] = useState<number | null>(null);
  const [email, setEmail] = useState<string>("maanbarazy@gmail.com");
  const [logs, setLogs] = useState<SystemLog[]>([]);

  // Fetch initial database status
  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/user-status");
      const data = await res.json();
      if (data.status) {
        setUserStatus(data.status);
      }
      if (data.trialExpiresAt) {
        setTrialExpiresAt(data.trialExpiresAt);
      } else {
        setTrialExpiresAt(null);
      }
      if (data.email) {
        setEmail(data.email);
      }
    } catch (err) {
      console.error("Failed to load user tier status:", err);
    }
  };

  // Activate 24-Hour Free Demo Trial
  const handleActivateTrial = async (emailInput: string) => {
    try {
      const res = await fetch("/api/register-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput })
      });
      const data = await res.json();
      if (data.success) {
        setUserStatus("approved");
        setTrialExpiresAt(data.trialExpiresAt);
        setEmail(data.email);
        fetchLogs();
      } else {
        throw new Error(data.error || "Failed to register trial");
      }
    } catch (err) {
      console.error("Trial activation error:", err);
      throw err;
    }
  };

  // Fetch administrator signal logs
  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/system-logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to load administrator logs:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchLogs();
  }, []);

  // Poll status and logs periodically in background to capture instant state transitions/webhooks or expiration
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStatus();
      fetchLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerScrollToPricing = () => {
    const section = document.getElementById("pricing-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-bg text-[#e0e0e0] font-sans selection:bg-accent selection:text-black pb-12">
      {userStatus === "approved" ? (
        <Workspace 
          onResetStatus={fetchStatus} 
          logs={logs} 
          onRefreshLogs={fetchLogs}
          trialExpiresAt={trialExpiresAt}
          userEmail={email}
        />
      ) : (
        <LandingPage 
          currentStatus={userStatus} 
          onApplyPrime={fetchStatus} 
          onRefreshLogs={fetchLogs}
          onActivateTrial={handleActivateTrial}
        />
      )}

      {/* Global Cyber Operational Manual, FAQ, Chatbot & GDPR Banner */}
      <CyberHub 
        onActivateTrialDirectly={handleActivateTrial}
        currentStatus={userStatus}
        onTriggerScrollToPricing={triggerScrollToPricing}
      />

      {/* Floating administrative override panel */}
      <AdminPanel 
        currentStatus={userStatus} 
        onStatusChange={(status) => {
          setUserStatus(status);
          if (status !== "approved") {
            setTrialExpiresAt(null);
          }
        }} 
        logs={logs} 
        onRefreshLogs={fetchLogs} 
      />
    </div>
  );
}

