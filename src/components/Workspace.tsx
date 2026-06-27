import React, { useState, useEffect, useRef } from "react";
import { SourceDocument, ChatMessage, CLUSTERS, ClusterInfo } from "../types";
import { exportCanvasToPdf } from "./PdfExporter";
import { TokenDiagnostics } from "./TokenDiagnostics";
import { DealroomVC } from "./DealroomVC";
import { YellowPagesDirectory } from "./YellowPagesDirectory";
import { YellowPagesRepositories } from "./YellowPagesRepositories";
import { SocialSentimentDeck } from "./SocialSentimentDeck";
import { 
  Terminal, ShieldCheck, Cpu, Upload, Trash2, 
  Send, HelpCircle, FileText, Check, Plus, 
  ChevronRight, RefreshCw, Layers, Edit, 
  ArrowLeft, Info, Copy, Sparkles, BookOpen
} from "lucide-react";

interface WorkspaceProps {
  onResetStatus: () => void;
  logs: any[];
  onRefreshLogs: () => void;
  trialExpiresAt?: number | null;
  userEmail?: string;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  onResetStatus,
  logs,
  onRefreshLogs,
  trialExpiresAt,
  userEmail = "maanbarazy@gmail.com"
}) => {
  // Active Cluster State (starts at 1)
  const [activeClusterId, setActiveClusterId] = useState<number>(1);
  const activeCluster = CLUSTERS.find(c => c.id === activeClusterId) || CLUSTERS[0];

  // Sources Vault State
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);

  // New Custom Document Upload State
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocContent, setNewDocContent] = useState("");

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [promptInput, setPromptInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Scratchpad State
  const [canvasTitle, setCanvasTitle] = useState("Research Briefing Synthesis");
  const [canvasContent, setCanvasContent] = useState(
    "## Operational Workspace Report Draft\n\nUse this canvas scratchpad to consolidate analytical research summaries from the Central Chat Engine."
  );

  // Session Token Accumulation Tracking
  const [sessionTokens, setSessionTokens] = useState({
    input: 0,
    output: 0,
    total: 0
  });

  // Workspace View Mode: Grounded AI Workspace vs Dealroom VC Cockpit
  const [workspaceMode, setWorkspaceMode] = useState<"grounded_ai" | "dealroom_vc" | "yellow_pages_directory" | "yellow_pages_repositories" | "social_sentiment">("grounded_ai");

  // Token history per cognitive cluster
  const [clusterTokenHistory, setClusterTokenHistory] = useState<Record<number, Array<{ timestamp: string; input: number; output: number; total: number; query: string }>>>({
    1: [
      { timestamp: "10:00:15", input: 1200, output: 450, total: 1650, query: "Init Comprehension" },
      { timestamp: "10:15:30", input: 2400, output: 850, total: 3250, query: "Map Attention" },
      { timestamp: "10:30:45", input: 3100, output: 1100, total: 4200, query: "Trace Routing" }
    ],
    2: [
      { timestamp: "09:45:00", input: 800, output: 350, total: 1150, query: "Audit Schema" },
      { timestamp: "10:05:12", input: 1500, output: 600, total: 2100, query: "Recall Optimization" },
      { timestamp: "10:22:18", input: 2200, output: 950, total: 3150, query: "HNSW Vector Indexes" }
    ],
    3: [
      { timestamp: "10:10:02", input: 3500, output: 1400, total: 4900, query: "Risk RAG Analysis" },
      { timestamp: "10:28:40", input: 4100, output: 1600, total: 5700, query: "Sovereign Contracts" }
    ],
    4: [
      { timestamp: "09:50:11", input: 1800, output: 750, total: 2550, query: "Incubation Path" },
      { timestamp: "10:12:05", input: 2900, output: 1200, total: 4100, query: "GTM Playbooks" }
    ]
  });

  // Inspected Source Dialog (Tooltip alternative)
  const [inspectedDoc, setInspectedDoc] = useState<SourceDocument | null>(null);

  // Countdown state for 24h direct trial access
  const [trialTimeLeft, setTrialTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!trialExpiresAt) {
      setTrialTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const remaining = trialExpiresAt - Date.now();
      if (remaining <= 0) {
        setTrialTimeLeft("EXPIRED");
        onResetStatus(); // automatically boot back to landing/pricing state
        return;
      }
      const hrs = Math.floor(remaining / (3600 * 1000));
      const mins = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
      const secs = Math.floor((remaining % (60 * 1000)) / 1000);
      setTrialTimeLeft(
        `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [trialExpiresAt, onResetStatus]);

  // Chat scroll anchor ref
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load sources when active cluster changes
  const fetchSources = async () => {
    setIsLoadingSources(true);
    try {
      const response = await fetch(`/api/sources?clusterId=${activeClusterId}`);
      const data = await response.json();
      setSources(data);
      // Auto-select all loaded documents by default for an optimal out-of-the-box grounding context
      setSelectedSourceIds(data.map((d: any) => d.id));
    } catch (err) {
      console.error("Failed to load active source vectors:", err);
    } finally {
      setIsLoadingSources(false);
    }
  };

  useEffect(() => {
    fetchSources();
    // Pre-populate chat history with a greeting from the active cluster persona
    setChatMessages([
      {
        id: "greet-" + Date.now(),
        sender: "ai",
        text: `### [SYSTEM TUNNEL RESTORED]\nGreetings researcher. I am operating under persona specifications **"${activeCluster.persona}"**.\n\nMy attention weights are currently bound strictly to the selected source documents in the Source Vault.\n\n**Operational Focus:** ${activeCluster.chatLogic}\n\nAsk me anything grounded in your loaded materials, or append custom research papers using the drag/drop panel on the left.`,
        timestamp: new Date().toLocaleTimeString(),
        model: "Grounding Model Active"
      }
    ]);
  }, [activeClusterId]);

  // Keep chat scrolled to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle source selections
  const toggleSourceSelection = (id: string) => {
    setSelectedSourceIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Upload custom text document
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocContent.trim()) return;

    try {
      const response = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDocName.trim().endsWith(".pdf") || newDocName.trim().endsWith(".md") || newDocName.trim().endsWith(".txt") 
            ? newDocName.trim() 
            : `${newDocName.trim()}.pdf`,
          content: newDocContent.trim(),
          clusterId: activeClusterId
        })
      });
      const data = await response.json();
      if (data.success) {
        setNewDocName("");
        setNewDocContent("");
        setIsAddingDoc(false);
        fetchSources();
        onRefreshLogs();
      }
    } catch (err) {
      console.error("Failed to commit source document:", err);
    }
  };

  // Delete source document
  const handleDeleteSource = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid checkbox toggling when clicking delete icon
    try {
      const response = await fetch(`/api/sources/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (data.success) {
        setSources(prev => prev.filter(s => s.id !== id));
        setSelectedSourceIds(prev => prev.filter(item => item !== id));
        onRefreshLogs();
      }
    } catch (err) {
      console.error("Failed to purge source document:", err);
    }
  };

  // Submit Prompt Chat
  const handleSendPrompt = async (suggestedMessage?: string) => {
    const textToSend = suggestedMessage || promptInput;
    if (!textToSend.trim() || isSendingMessage) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!suggestedMessage) setPromptInput("");
    setIsSendingMessage(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clusterId: activeClusterId,
          message: textToSend,
          selectedSourceIds
        })
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString(),
        citations: data.citations || [],
        tokens: data.tokens,
        model: data.model
      };

      setChatMessages(prev => [...prev, aiMsg]);

      // Accumulate session tokens and update history
      if (data.tokens) {
        const inputTokens = data.tokens.input || 0;
        const outputTokens = data.tokens.output || 0;
        const totalTokens = data.tokens.total || 0;

        setSessionTokens(prev => ({
          input: prev.input + inputTokens,
          output: prev.output + outputTokens,
          total: prev.total + totalTokens
        }));

        const queryText = textToSend.slice(0, 18) + (textToSend.length > 18 ? "..." : "");
        const newRecord = {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          input: inputTokens,
          output: outputTokens,
          total: totalTokens,
          query: queryText
        };

        setClusterTokenHistory(prev => ({
          ...prev,
          [activeClusterId]: [...(prev[activeClusterId] || []), newRecord]
        }));
      }

    } catch (error) {
      console.error("Error communicating with grounding chat:", error);
      const errorMsg: ChatMessage = {
        id: "error-" + Date.now(),
        sender: "ai",
        text: "System communication failure. Verify server configuration or internet routing constraints.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Append response to editor
  const appendToCanvas = (text: string) => {
    // Strip markdown h1/h2 tags lightly or formatting if preferred, but rich text editor handles MD perfectly.
    const cleanText = text.replace(/\[Source:[^\]]+\]/g, (match) => `**${match}**`);
    setCanvasContent(prev => `${prev}\n\n### Synthesis Feed Append (${new Date().toLocaleTimeString()})\n${cleanText}`);
  };

  // Click on source link citation helper
  const handleCitationClick = (citationName: string) => {
    const matched = sources.find(s => s.name === citationName);
    if (matched) {
      setInspectedDoc(matched);
    } else {
      // Find globally
      alert(`Citation found for: ${citationName}. Check current Cluster Source Vault to verify.`);
    }
  };

  return (
    <div id="workspace-container" className="h-screen flex flex-col bg-bg text-[#e0e0e0] overflow-hidden font-sans">
      
      {/* Global CSS Top Navigation Bar */}
      <nav id="workspace-nav" className="bg-[#000] border-b border-border px-6 py-2.5 flex items-center justify-between shrink-0 font-mono text-xs text-text-dim">
        <div className="flex items-center gap-4">
          <button 
            id="btn-workspace-back"
            onClick={onResetStatus}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer transition-colors bg-surface border border-border px-2.5 py-1 text-[11px]"
          >
            <ArrowLeft size={12} /> PORTAL HUB
          </button>
          
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          
          <div className="hidden sm:flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${trialExpiresAt ? "bg-amber-400 animate-ping" : "bg-accent animate-pulse"}`}></span>
            <span className="font-bold text-zinc-200 uppercase">
              {trialExpiresAt ? "COCKPIT_LEVEL: 24h DIRECT TRIAL ACCESS" : "COCKPIT_LEVEL: UNLOCKED PRIME"}
            </span>
          </div>

          {trialExpiresAt && trialTimeLeft && (
            <div className="bg-amber-950/20 border border-amber-500/40 text-amber-400 text-[10px] font-black px-2.5 py-0.5 animate-pulse flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              TIME LEFT: {trialTimeLeft}
            </div>
          )}

          {/* High-tech View Mode Switcher */}
          <div className="h-4 w-px bg-border hidden lg:block"></div>
          <div className="hidden lg:flex items-center bg-[#09090b] border border-border p-0.5 font-mono flex-wrap gap-0.5">
            <button
              id="btn-workspace-mode-chat"
              onClick={() => setWorkspaceMode("grounded_ai")}
              className={`px-3 py-1 text-[10px] font-bold tracking-tight uppercase cursor-pointer transition-colors ${
                workspaceMode === "grounded_ai"
                  ? "bg-accent text-black font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              [ GROUNDED AI WORKSPACE ]
            </button>
            <button
              id="btn-workspace-mode-dealroom"
              onClick={() => setWorkspaceMode("dealroom_vc")}
              className={`px-3 py-1 text-[10px] font-bold tracking-tight uppercase cursor-pointer transition-colors ${
                workspaceMode === "dealroom_vc"
                  ? "bg-accent text-black font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              [ DEALROOM VC COCKPIT ]
            </button>
            <button
              id="btn-workspace-mode-yellow-pages"
              onClick={() => setWorkspaceMode("yellow_pages_directory")}
              className={`px-3 py-1 text-[10px] font-bold tracking-tight uppercase cursor-pointer transition-colors ${
                workspaceMode === "yellow_pages_directory"
                  ? "bg-accent text-black font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              [ YELLOW PAGES DIRECTORY ]
            </button>
            <button
              id="btn-workspace-mode-repos"
              onClick={() => setWorkspaceMode("yellow_pages_repositories")}
              className={`px-3 py-1 text-[10px] font-bold tracking-tight uppercase cursor-pointer transition-colors ${
                workspaceMode === "yellow_pages_repositories"
                  ? "bg-accent text-black font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              [ REPOSITORIES ]
            </button>
            <button
              id="btn-workspace-mode-social"
              onClick={() => setWorkspaceMode("social_sentiment")}
              className={`px-3 py-1 text-[10px] font-bold tracking-tight uppercase cursor-pointer transition-colors ${
                workspaceMode === "social_sentiment"
                  ? "bg-accent text-black font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              [ SOCIAL AI SENTIMENT ]
            </button>
          </div>
        </div>

        {/* Diagnostic readout */}
        <div className="hidden md:flex items-center gap-6 text-[11px] text-text-dim">
          <span>PORT: <span className="text-accent font-bold">3000</span></span>
          <span>SPEED: <span className="text-accent font-bold">110 tok/s</span></span>
          <span>COGNITIVE: <span className="text-zinc-300">RAG Gated</span></span>
          <span className="bg-surface px-2.5 py-1 border border-border text-zinc-300 break-all max-w-[200px] text-ellipsis overflow-hidden">
            {userEmail}
          </span>
        </div>
      </nav>

      {/* Workspace Three-Panel Split Grid Layout */}
      <div id="workspace-main" className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        
        {workspaceMode === "grounded_ai" ? (
          <>
            {/* ========================================================= */}
            {/* LEFT PANEL (30% Width): Source Vault & Active Cluster Selector */}
            {/* ========================================================= */}
        <aside id="left-source-vault" className="w-full lg:w-[30%] border-r border-border bg-[#0c0c0e] flex flex-col overflow-hidden">
          
          {/* Active Cluster Selectors Toggles */}
          <div className="p-4 border-b border-border shrink-0 bg-black">
            <div className="font-mono text-[10px] text-text-dim uppercase tracking-widest mb-2 flex justify-between items-center">
              <span>ACTIVE COGNITIVE PILLARS</span>
              <Layers size={10} className="text-text-dim" />
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              {CLUSTERS.map(c => (
                <button
                  key={c.id}
                  id={`btn-cluster-toggle-${c.id}`}
                  onClick={() => setActiveClusterId(c.id)}
                  className={`p-2 text-left border cursor-pointer font-mono text-[10px] font-bold tracking-tight leading-tight transition-all uppercase rounded-none ${
                    activeClusterId === c.id
                      ? "bg-accent text-black border-accent"
                      : "bg-surface border-border text-text-dim hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <span className="block opacity-60 text-[8px] tracking-widest">{c.tag.split(" // ")[0]}</span>
                  <span className="block truncate mt-0.5">{c.title.split(" & ")[0].split(" Tools")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Persona Header Description Banner */}
          <div className="p-3.5 bg-surface/50 border-b border-border text-[11px] leading-relaxed shrink-0 text-zinc-400">
            <div className="font-mono font-bold text-zinc-200 uppercase flex items-center gap-1.5 mb-1 text-[10px]">
              <Sparkles size={11} className="text-accent" /> Grounded Active Persona:
            </div>
            <p className="font-mono font-black text-accent uppercase text-[12px]">{activeCluster.persona}</p>
            <p className="mt-1.5 text-zinc-400">{activeCluster.purpose}</p>
          </div>

          {/* The Source Vault List */}
          <div className="flex-grow flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border shrink-0 flex items-center justify-between bg-black/40">
              <span className="font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen size={13} className="text-text-dim" /> SOURCE VAULT ({sources.length})
              </span>
              
              <button
                id="btn-trigger-add-doc"
                onClick={() => setIsAddingDoc(!isAddingDoc)}
                className="flex items-center gap-1 text-[10px] font-mono font-bold text-accent hover:text-[#00e08b] bg-surface border border-border px-2 py-1 cursor-pointer rounded-none"
              >
                <Plus size={10} /> ADD CONTEXT
              </button>
            </div>

            {/* Content list / dropzone placeholder */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-custom">
              
              {/* Inline Upload Form */}
              {isAddingDoc && (
                <form id="upload-context-form" onSubmit={handleAddDocument} className="bg-surface border border-border p-3.5 space-y-3 mb-4">
                  <div className="font-mono text-[10px] font-bold text-zinc-300 uppercase">
                    COMMIT LOCAL FILE SOURCE
                  </div>
                  <div>
                    <input
                      id="source-title-input"
                      type="text"
                      required
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="w-full bg-black border border-border p-1.5 text-xs font-mono text-white focus:outline-none focus:border-accent"
                      placeholder="e.g. prompt_engineering_guide.pdf"
                    />
                  </div>
                  <div>
                    <textarea
                      id="source-content-input"
                      required
                      rows={5}
                      value={newDocContent}
                      onChange={(e) => setNewDocContent(e.target.value)}
                      className="w-full bg-black border border-border p-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-accent resize-none scrollbar-custom"
                      placeholder="Paste baseline research raw string content here..."
                    />
                  </div>
                  <div className="flex justify-end gap-2 text-[10px] font-mono">
                    <button
                      id="btn-cancel-add-doc"
                      type="button"
                      onClick={() => setIsAddingDoc(false)}
                      className="px-2.5 py-1 text-text-dim hover:text-white cursor-pointer"
                    >
                      CANCEL
                    </button>
                    <button
                      id="btn-submit-add-doc"
                      type="submit"
                      className="px-3 py-1 bg-accent text-black font-bold cursor-pointer hover:bg-[#00e08b]"
                    >
                      COMMIT CONTEXT
                    </button>
                  </div>
                </form>
              )}

              {/* Standard Vault Sources Checkbox List */}
              {isLoadingSources ? (
                <div className="text-center py-12 text-text-dim font-mono text-[11px] animate-pulse">
                  REINDEXING CONTEXT FILES...
                </div>
              ) : sources.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border p-6">
                  <Upload size={24} className="mx-auto text-text-dim mb-2.5" />
                  <p className="font-mono text-[10px] text-text-dim uppercase">
                    Vault empty for active cluster.
                  </p>
                  <p className="text-[9px] text-zinc-600 leading-normal mt-1">
                    Commit custom context research files using the 'Add Context' module to start.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-mono text-[9px] text-text-dim uppercase pb-1 leading-none">
                    SELECT DOCUMENTS TO GROUND THE CURRENT PROMPT:
                  </p>
                  {sources.map(doc => {
                    const isSelected = selectedSourceIds.includes(doc.id);
                    return (
                      <div
                        key={doc.id}
                        id={`source-item-${doc.id}`}
                        onClick={() => toggleSourceSelection(doc.id)}
                        className={`p-3 border transition-all cursor-pointer select-none flex items-start justify-between relative ${
                          isSelected 
                            ? "bg-surface border-accent" 
                            : "bg-[#050505] border-border hover:border-zinc-700 text-zinc-400"
                        }`}
                      >
                        <div className="flex gap-2.5 items-start flex-grow">
                          <div className={`mt-0.5 border w-3.5 h-3.5 flex items-center justify-center shrink-0 ${
                            isSelected ? "border-accent bg-accent text-black" : "border-border bg-black"
                          }`}>
                            {isSelected && <Check size={10} strokeWidth={3} />}
                          </div>
                          
                          <div className="min-w-0 flex-grow">
                            <span className={`font-mono text-xs font-bold block truncate uppercase ${isSelected ? "text-white" : "text-zinc-400"}`}>
                              {doc.name}
                            </span>
                            <span className="text-[10px] text-text-dim line-clamp-1 mt-1 leading-normal font-mono">
                              {doc.content}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pl-2">
                          <button
                            id={`btn-inspect-source-${doc.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectedDoc(doc);
                            }}
                            className="text-text-dim hover:text-white cursor-pointer active:scale-90"
                            title="Inspect document source content"
                          >
                            <Info size={11} />
                          </button>
                          
                          <button
                            id={`btn-delete-source-${doc.id}`}
                            onClick={(e) => handleDeleteSource(doc.id, e)}
                            className="text-zinc-650 hover:text-red-450 cursor-pointer active:scale-90"
                            title="Delete file"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTRAL SCREEN (40% Width): Dynamic Cluster Engine & AI Chat */}
        {/* ========================================================= */}
        <main id="center-chat-engine" className="w-full lg:w-[40%] border-r border-border bg-[#070709] flex flex-col overflow-hidden">
          
          {/* Header metadata */}
          <div className="p-4 border-b border-border shrink-0 bg-black flex justify-between items-center font-mono">
            <div>
              <span className="text-[10px] text-text-dim uppercase tracking-widest leading-none block">ACTIVE CHANNEL CHANNEL_0{activeClusterId}</span>
              <span className="text-white text-xs font-bold uppercase mt-1 block">SOURCE-GROUNDED RAG CHAT</span>
            </div>
            
            {/* Real-time cumulative Token usage stats */}
            <div className="text-right text-[10px] text-text-dim leading-tight border-l border-border pl-4">
              <div>SESSION TOKENS USED:</div>
              <div className="text-accent font-bold mt-0.5 uppercase tracking-wider">{sessionTokens.total} TOKENS</div>
            </div>
          </div>

          {/* Real-time Recharts Token diagnostics component for active cluster */}
          <TokenDiagnostics 
            activeClusterId={activeClusterId}
            activeClusterTitle={activeCluster.title}
            tokenHistory={clusterTokenHistory[activeClusterId] || []}
            sessionTokens={sessionTokens}
          />

          {/* Chat log window */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-custom bg-[#040405]">
            {chatMessages.map((msg, index) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id || index}
                  id={`chat-msg-${msg.id}`}
                  className={`flex flex-col ${isAi ? "items-start" : "items-end"}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] font-mono text-text-dim">
                    <span className="uppercase font-bold">{isAi ? activeCluster.persona : "Maan Barazy"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className={`p-4 border max-w-[90%] font-mono text-[11px] leading-relaxed relative group ${
                    isAi 
                      ? "bg-surface border-border text-zinc-250" 
                      : "bg-accent text-black border-accent font-bold shadow-[0_0_15px_rgba(0,255,156,0.1)]"
                  }`}>
                    {/* Render message formatting lightly / replace citation links */}
                    <div className="whitespace-pre-wrap whitespace-normal prose-sm">
                      {msg.text.split("\n\n").map((para, pIdx) => {
                        // Dynamic parser to render bracket source citation clickable
                        const citationRegex = /(\[Source:\s*([^\]]+)\])/g;
                        const parts = [];
                        let lastIdx = 0;
                        let match;

                        while ((match = citationRegex.exec(para)) !== null) {
                          const fullMatch = match[1];
                          const docName = match[2];
                          const start = match.index;

                          if (start > lastIdx) {
                            parts.push(para.substring(lastIdx, start));
                          }

                          parts.push(
                            <button
                              key={start}
                              id={`citation-link-${docName}`}
                              onClick={() => handleCitationClick(docName)}
                              className="mx-0.5 px-1.5 py-0.5 bg-accent/20 hover:bg-accent/40 text-accent font-bold border border-accent/40 cursor-pointer rounded-none inline-block text-[10px]"
                            >
                              {docName}
                            </button>
                          );

                          lastIdx = citationRegex.lastIndex;
                        }

                        if (lastIdx < para.length) {
                          parts.push(para.substring(lastIdx));
                        }

                        return (
                          <p key={pIdx} className="mb-2.5 last:mb-0">
                            {parts.length > 0 ? parts : para}
                          </p>
                        );
                      })}
                    </div>

                    {/* Citations metadata row */}
                    {isAi && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-2.5 border-t border-dashed border-border flex flex-wrap items-center gap-1.5 text-[9px] text-text-dim">
                        <span>CITED MATERIAL:</span>
                        {msg.citations.map((c, cIdx) => (
                          <button
                            key={cIdx}
                            id={`tag-citation-${c}`}
                            onClick={() => handleCitationClick(c)}
                            className="bg-[#050505] border border-border px-1.5 py-0.5 text-zinc-400 hover:text-white cursor-pointer font-mono"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Metadata indicators */}
                    {isAi && msg.tokens && (
                      <div className="mt-2.5 text-[8px] text-text-dim flex justify-between uppercase font-mono tracking-widest border-t border-border pt-1.5">
                        <span>MODEL: {msg.model || "gemini-3.5-flash"}</span>
                        <span>INPUT: {msg.tokens.input} | OUTPUT: {msg.tokens.output}</span>
                      </div>
                    )}

                    {/* Append response button to Scratchpad (only shown for AI messages) */}
                    {isAi && (
                      <button
                        id={`btn-append-canvas-${msg.id}`}
                        onClick={() => appendToCanvas(msg.text)}
                        className="absolute right-2.5 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-border px-2 py-0.5 text-[10px] text-accent font-mono font-bold tracking-tight cursor-pointer hover:bg-zinc-900 hover:text-white"
                        title="Append this synthesis chunk to document editor canvas"
                      >
                        APPEND TO CANVAS
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isSendingMessage && (
              <div id="ai-typing-loader" className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1 text-[10px] font-mono text-text-dim">
                  <span className="uppercase font-bold">{activeCluster.persona}</span>
                  <span>•</span>
                  <span>GENERATING ANALYSIS...</span>
                </div>
                <div className="p-4 border border-dashed border-border bg-surface/30 text-text-dim max-w-[80%] font-mono text-[11px] animate-pulse">
                  SYSTEM BUFFERING VECTOR STACK... COMPUTING GROUNDED RETRIEVAL METRICS...
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick-builder helper prompts */}
          <div className="px-4 py-2 bg-black border-t border-border shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            <span className="text-[9px] font-mono font-bold text-text-dim uppercase self-center tracking-widest pr-1">MODIFIERS:</span>
            <button
              id="btn-shortcut-summarize"
              onClick={() => handleSendPrompt("Summarize all selected sources and point out the key architectural specs.")}
              className="text-[10px] font-mono bg-surface hover:bg-zinc-850 border border-border px-2 py-1 text-zinc-300 cursor-pointer rounded-none active:scale-95"
            >
              SUMMARIZE_ALL
            </button>
            <button
              id="btn-shortcut-audit"
              onClick={() => handleSendPrompt("Audit the material and extract any technical contradictions or operational risks.")}
              className="text-[10px] font-mono bg-surface hover:bg-zinc-850 border border-border px-2 py-1 text-zinc-300 cursor-pointer rounded-none active:scale-95"
            >
              RISKS_AUDIT
            </button>
            <button
              id="btn-shortcut-flowchart"
              onClick={() => handleSendPrompt("Establish a chronological timeline or structured orchestration pipeline mapping based on this documentation.")}
              className="text-[10px] font-mono bg-surface hover:bg-zinc-850 border border-border px-2 py-1 text-zinc-300 cursor-pointer rounded-none active:scale-95"
            >
              STRUCTURED_MAP
            </button>
          </div>

          {/* Input prompt tray */}
          <div className="p-4 bg-black border-t border-border shrink-0">
            <div className="flex gap-2">
              <input
                id="prompt-input"
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
                disabled={isSendingMessage}
                className="flex-grow bg-[#050505] border border-border p-2.5 text-xs font-mono text-white focus:outline-none focus:border-accent placeholder-zinc-650 disabled:opacity-50"
                placeholder={
                  selectedSourceIds.length === 0 
                    ? "⚠️ SELECT CONTEXT FIRST TO PREVENT RAG FAILURE..." 
                    : `Ask ${activeCluster.persona.split(" ")[0]} grounded query...`
                }
              />
              
              <button
                id="btn-send-prompt"
                onClick={() => handleSendPrompt()}
                disabled={!promptInput.trim() || isSendingMessage}
                className="bg-accent hover:bg-[#00e08b] text-black font-mono font-bold text-xs px-4 py-2 border border-accent cursor-pointer active:translate-y-[1px] disabled:opacity-40 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono text-text-dim mt-2">
              <span>ACTIVE_GROUNDING: {selectedSourceIds.length} FILES SELECTED</span>
              <span>PRESS ENTER TO COMPILE SIGNAL</span>
            </div>
          </div>
        </main>
          </>
        ) : workspaceMode === "dealroom_vc" ? (
          <div className="w-full lg:w-[70%] border-r border-border flex flex-col overflow-hidden">
            <DealroomVC onAppendToCanvas={appendToCanvas} userEmail={userEmail} />
          </div>
        ) : workspaceMode === "yellow_pages_directory" ? (
          <div className="w-full lg:w-[70%] border-r border-border flex flex-col overflow-hidden overflow-y-auto bg-white text-black">
            <YellowPagesDirectory />
          </div>
        ) : workspaceMode === "yellow_pages_repositories" ? (
          <div className="w-full lg:w-[70%] border-r border-border flex flex-col overflow-hidden overflow-y-auto bg-white text-black">
            <YellowPagesRepositories />
          </div>
        ) : (
          <div className="w-full lg:w-[70%] border-r border-border flex flex-col overflow-hidden overflow-y-auto bg-white text-black">
            <SocialSentimentDeck />
          </div>
        )}

        {/* ========================================================= */}
        {/* RIGHT PANEL (30% Width): The Canvas Scratchpad & Assembly */}
        {/* ========================================================= */}
        <aside id="right-canvas-editor" className="w-full lg:w-[30%] border-t lg:border-t-0 border-border bg-[#0c0c0e] flex flex-col overflow-hidden">
          
          {/* Header Title Editor */}
          <div className="p-4 border-b border-border bg-black shrink-0">
            <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest leading-none block">THE CANVAS & EDITOR (30%)</span>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Edit size={12} className="text-text-dim shrink-0" />
              <input
                id="canvas-title-input"
                type="text"
                value={canvasTitle}
                onChange={(e) => setCanvasTitle(e.target.value)}
                className="bg-transparent text-white font-bold text-xs uppercase border-none focus:outline-none focus:bg-surface p-1 w-full truncate"
                placeholder="REPORT DOCUMENT SYNTHESIS"
              />
            </div>
          </div>

          {/* Canvas scratchpad textbox */}
          <div className="flex-grow flex flex-col p-4 overflow-hidden">
            <textarea
              id="canvas-editor-input"
              value={canvasContent}
              onChange={(e) => setCanvasContent(e.target.value)}
              className="w-full flex-grow bg-[#09090b] border border-border p-4 text-xs font-mono text-zinc-300 leading-relaxed focus:outline-none focus:border-accent resize-none overflow-y-auto scrollbar-custom"
              placeholder="Assembled summaries will appear here. You can also directly type, write, or draft custom research layouts..."
            />
          </div>

          {/* Canvas action tray */}
          <div className="p-4 bg-black border-t border-border shrink-0 space-y-2">
            <button
              id="btn-export-pdf"
              onClick={() => exportCanvasToPdf(canvasTitle, canvasContent, activeCluster.title)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-accent bg-accent hover:bg-[#00e08b] text-black font-mono font-bold text-xs tracking-wider uppercase cursor-pointer transition-colors"
            >
              <FileText size={14} /> EXPORT REPORT TO PDF
            </button>

            <button
              id="btn-clear-canvas"
              onClick={() => setCanvasContent("")}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-surface hover:bg-zinc-850 text-text-dim hover:text-white font-mono text-[10px] uppercase cursor-pointer border border-border transition-colors"
            >
              <Trash2 size={11} /> CLEAR SCRATCHPAD
            </button>
          </div>
        </aside>

      </div>

      {/* Citations Inspections Modal Dialog */}
      {inspectedDoc && (
        <div id="inspect-modal-overlay" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border max-w-2xl w-full p-6 font-mono text-xs text-zinc-300">
            <div className="flex justify-between items-center border-b border-border pb-2.5 mb-4">
              <span className="text-accent font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <FileText size={14} /> Source Document Inspector:
              </span>
              <button
                id="btn-close-inspect"
                onClick={() => setInspectedDoc(null)}
                className="text-text-dim hover:text-white cursor-pointer text-[10px]"
              >
                [CLOSE]
              </button>
            </div>

            <h4 className="text-white font-black uppercase text-sm mb-3">
              FILENAME: {inspectedDoc.name}
            </h4>
            
            <div className="bg-black border border-border p-4 max-h-[50vh] overflow-y-auto leading-relaxed text-zinc-300 whitespace-pre-wrap select-all scrollbar-custom">
              {inspectedDoc.content}
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-between text-[10px] text-text-dim">
              <span>COMMITTED: {new Date(inspectedDoc.uploadedAt).toLocaleString()}</span>
              <span>CLUSTER ID: {inspectedDoc.clusterId}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
