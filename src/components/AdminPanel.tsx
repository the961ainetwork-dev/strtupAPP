import React, { useEffect, useState } from "react";
import { SystemLog } from "../types";
import { Shield, RefreshCw, CheckCircle2, AlertOctagon, Terminal } from "lucide-react";

interface AdminPanelProps {
  currentStatus: "not_applied" | "pending_approval" | "approved";
  onStatusChange: (newStatus: "not_applied" | "pending_approval" | "approved") => void;
  logs: SystemLog[];
  onRefreshLogs: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentStatus,
  onStatusChange,
  logs,
  onRefreshLogs
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateStatus = async (status: "not_applied" | "pending_approval" | "approved") => {
    try {
      const response = await fetch("/api/admin/toggle-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        onStatusChange(data.status);
        onRefreshLogs();
      }
    } catch (error) {
      console.error("Failed to update status manually:", error);
    }
  };

  return (
    <div id="admin-control-root" className="fixed bottom-6 right-6 z-50 font-mono text-xs">
      {/* Floating Launcher Button */}
      <button
        id="btn-admin-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border border-border font-bold tracking-wider cursor-pointer transition-all ${
          isOpen ? "bg-surface text-accent" : "bg-black text-accent"
        }`}
      >
        <Shield size={14} className={isOpen ? "animate-spin text-accent" : "text-accent"} />
        ADMIN PANEL OVERRIDE
      </button>

      {/* Control Drawer / Panel */}
      {isOpen && (
        <div id="admin-panel-drawer" className="absolute bottom-12 right-0 w-96 bg-surface border border-border text-zinc-300 p-4 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
            <span className="text-accent font-bold tracking-widest flex items-center gap-1.5">
              <Terminal size={14} className="text-accent" /> ADMINISTRATIVE OVERRIDES
            </span>
            <button
              id="btn-refresh-logs"
              onClick={onRefreshLogs}
              className="text-text-dim hover:text-white cursor-pointer active:scale-95"
              title="Refresh administrative state"
            >
              <RefreshCw size={12} />
            </button>
          </div>

          <p className="text-text-dim leading-relaxed mb-4">
            Verify the gatekeeper flow by manipulating user database records. When a candidate upgrades, a Webhook fires instantly here.
          </p>

          {/* Database State Selector */}
          <div className="bg-[#050505] border border-border p-3 mb-4">
            <div className="font-bold text-zinc-300 mb-2 uppercase tracking-wider">
              Prime Tier Status in DB:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-status-not-applied"
                onClick={() => updateStatus("not_applied")}
                className={`py-1.5 px-1 border font-bold text-center cursor-pointer transition-colors text-[11px] uppercase ${
                  currentStatus === "not_applied"
                    ? "bg-white text-black border-white"
                    : "bg-surface text-text-dim border-border hover:bg-[#15151a]"
                }`}
              >
                Not Applied
              </button>
              <button
                id="btn-status-pending"
                onClick={() => updateStatus("pending_approval")}
                className={`py-1.5 px-1 border font-bold text-center cursor-pointer transition-colors text-[11px] uppercase ${
                  currentStatus === "pending_approval"
                    ? "bg-amber-500 text-black border-amber-400"
                    : "bg-surface text-text-dim border-border hover:bg-[#15151a]"
                }`}
              >
                Pending
              </button>
              <button
                id="btn-status-approved"
                onClick={() => updateStatus("approved")}
                className={`py-1.5 px-1 border font-bold text-center cursor-pointer transition-colors text-[11px] uppercase ${
                  currentStatus === "approved"
                    ? "bg-accent text-black border-accent animate-pulse"
                    : "bg-surface text-text-dim border-border hover:bg-[#15151a]"
                }`}
              >
                Approved
              </button>
            </div>

            <div className="mt-3 text-[10px] text-text-dim flex items-center gap-1.5">
              <span>Status Diagnostics:</span>
              {currentStatus === "not_applied" && (
                <span className="text-[#a0a0a0] flex items-center gap-1 font-bold">
                  <AlertOctagon size={10} /> LOCK_SCREEN_ACTIVE
                </span>
              )}
              {currentStatus === "pending_approval" && (
                <span className="text-amber-400 flex items-center gap-1 font-bold">
                  <AlertOctagon size={10} /> REVIEW_QUEUE_ACTIVE
                </span>
              )}
              {currentStatus === "approved" && (
                <span className="text-accent flex items-center gap-1 font-bold">
                  <CheckCircle2 size={10} /> WORKSPACE_UNLOCKED
                </span>
              )}
            </div>
          </div>

          {/* Webhook & System Signal Logs */}
          <div>
            <div className="font-bold text-zinc-300 mb-1.5 uppercase tracking-wider flex items-center justify-between text-[11px]">
              <span>Internal Webhook & Signal Log:</span>
              <span className="text-[10px] text-text-dim uppercase">{logs.length} signals</span>
            </div>
            <div className="bg-black border border-border rounded p-2 h-44 overflow-y-auto space-y-2 font-mono scrollbar-custom">
              {logs.length === 0 ? (
                <div className="text-zinc-600 italic text-[10px] text-center pt-16">
                  No system signals received yet. Apply for Prime to trigger webhooks.
                </div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="border-b border-border/40 pb-1.5 last:border-0 text-[10px]">
                    <div className="flex justify-between text-text-dim text-[9px] mb-0.5">
                      <span className="text-accent font-bold">{log.event}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-zinc-300 break-words leading-tight">
                      {log.details || "Signal acknowledged."}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 text-[9px] text-center text-text-dim border-t border-border pt-2 uppercase tracking-widest">
            AI Ecosystem Diagnostics Console v1.0
          </div>
        </div>
      )}
    </div>
  );
};
