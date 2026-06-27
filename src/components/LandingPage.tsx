import React, { useState, useEffect, useMemo } from "react";
import { ClusterInfo, CLUSTERS } from "../types";
import { YellowPagesDirectory } from "./YellowPagesDirectory";
import { YellowPagesRepositories } from "./YellowPagesRepositories";
import { SocialSentimentDeck } from "./SocialSentimentDeck";
import { PrivateMarketsAI } from "./PrivateMarketsAI";
import { PricingPage } from "./PricingPage";
import { AuthPage, UserAccount } from "./AuthPage";
import { AdminPanel } from "./AdminPanel";
import { 
  ShieldCheck, ArrowRight, Sparkles, Terminal, Activity, FileText, 
  TrendingUp, Cpu, RefreshCw, ShoppingCart, Loader2, Search, Plus, 
  Globe, LineChart, BookOpen, Share2, HelpCircle, Check, Award, Lock, Unlock, Command, LogOut, CheckSquare, UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SCROLLING_LINES = [
  "SYS_LOAD // PORTAL_RESOURCES",
  "CONN_ACTIVE // PROTOCOL_ESTABLISHED",
  "NEWSWIRE_FEED // INGEST_OK",
  "SENTIMENT_INDEX // ANALYZING",
  "COMPANIES_TRACKER // 100% ONLINE",
  "Ecosystem_Reports_Sync // DONE",
  "COCKPIT_STATUS_STANDBY",
  "PORT_3000_INGRESS_MONITOR"
];

interface LandingPageProps {
  currentStatus: "not_applied" | "pending_approval" | "approved";
  onApplyPrime: () => void;
  onRefreshLogs: () => void;
  onActivateTrial: (email: string) => Promise<void>;
}

interface NewswireItem {
  id: string;
  title: string;
  category: "COMPANIES" | "TOOLS" | "OPPORTUNITIES";
  source: string;
  timestamp: string;
  summary: string;
  content: string;
  likes: number;
}

interface ResearchReport {
  id: string;
  title: string;
  author: string;
  institution: string;
  date: string;
  summary: string;
  tags: string[];
  reads: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentStatus,
  onApplyPrime,
  onRefreshLogs,
  onActivateTrial
}) => {
  // Navigation: expanded with new pricing, security, and administrative tabs
  const [activeTab, setActiveTab] = useState<
    "portal_hub" | "yellow_pages_directory" | "yellow_pages_repositories" | "social_sentiment" | "private_markets" | "about_us" | "pricing" | "auth" | "admin"
  >("portal_hub");
  
  // Dynamic user session state synced with local persistence
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("avantgarde_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Global search command deck state
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  
  // Previous states preserved
  const [activeHoverCluster, setActiveHoverCluster] = useState<number | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderEmail, setOrderEmail] = useState("maanbarazy@gmail.com");
  const [tickerTick, setTickerTick] = useState(0);
  const [trialEmailInput, setTrialEmailInput] = useState("");
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialError, setTrialError] = useState("");

  // Newswire states
  const [newsCategory, setNewsCategory] = useState<string>("ALL");
  const [newsSearch, setNewsSearch] = useState("");
  const [selectedNews, setSelectedNews] = useState<NewswireItem | null>(null);
  
  // Custom News Submit form states
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState<"COMPANIES" | "TOOLS" | "OPPORTUNITIES">("COMPANIES");
  const [newSource, setNewSource] = useState("");
  const [newSummary, setNewSummary] = useState("");

  // Research states
  const [selectedReport, setSelectedReport] = useState<ResearchReport | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [repTitle, setRepTitle] = useState("");
  const [repAuthor, setRepAuthor] = useState("");
  const [repInst, setRepInst] = useState("");
  const [repSummary, setRepSummary] = useState("");
  const [repTags, setRepTags] = useState("");

  // Seeded AI Newswire Feed
  const [newswire, setNewswire] = useState<NewswireItem[]>([
    {
      id: "news-1",
      title: "Anthropic deploys sovereign compute nodes inside secure EU cloud limits",
      category: "COMPANIES",
      source: "Sovereign AI Press",
      timestamp: "10 mins ago",
      summary: "Strategic data positioning forces local vector indexes to operate inside strict geographic boundaries.",
      content: "Anthropic has committed an enterprise-level cluster infrastructure tailored specifically for European compliance models. By storing parameters on isolated arrays, developers can query generative neural weights without leaking transactional logs or user embeddings to external global networks.",
      likes: 42
    },
    {
      id: "news-2",
      title: "Gemini Node.js SDK rolls out low-latency WebRTC speech streams",
      category: "TOOLS",
      source: "Google Developer Feed",
      timestamp: "1 hr ago",
      summary: "Direct WebSocket hooks eliminate intermediate buffer lag, yielding near-instant conversational speed.",
      content: "The latest SDK update provides real-time bidirectional audio integrations natively. Perfect for developers crafting complex full-stack agentic frontends that require low-latency responses without heavy intermediate REST overhead.",
      likes: 56
    },
    {
      id: "news-3",
      title: "Global Cyber Incubator opens $25M funding tranche for multi-agent setups",
      category: "OPPORTUNITIES",
      source: "Venture Dispatch",
      timestamp: "2 hrs ago",
      summary: "Grant proposals require working code prototypes. Applications close in less than two weeks.",
      content: "Selected founders will receive immediate equity-free cloud compute credits alongside custom mentorship from premier venture groups. Projects center around self-assembling scratchpad layouts, multi-user Canvas collaboration tools, and grounded document ingestion pipeline nodes.",
      likes: 89
    },
    {
      id: "news-4",
      title: "NVIDIA confirms Blackwell Ultra chip allocation prioritizing agent startups",
      category: "COMPANIES",
      source: "Hardware Matrix",
      timestamp: "4 hrs ago",
      summary: "Production lines shift emphasis to accommodate high-density contextual window calculations.",
      content: "Blackwell Ultra production architectures have been re-calibrated to support parallel token calculations across hundreds of independent retrieval-augmented vector databases simultaneously. This signals a transition from massive central training models toward distributed agent micro-networks.",
      likes: 31
    },
    {
      id: "news-5",
      title: "Llama-4-Instruct-Lite local deployment benchmarks outperform GPT-4o-mini",
      category: "TOOLS",
      source: "Meta AI open research",
      timestamp: "6 hrs ago",
      summary: "Ultra-compact quantizations run directly on client hardware with zero cloud API dependency.",
      content: "By employing 4-bit quantization on local web containers, the model achieves over 90 tokens per second on consumer laptop architectures. This offers standard users high-fidelity summarization without incurring monthly token costs.",
      likes: 72
    },
    {
      id: "news-6",
      title: "CleanTech RAG Challenge offers $150K cash prize for carbon ledger parsing",
      category: "OPPORTUNITIES",
      source: "Eco-Informatics Fund",
      timestamp: "1 day ago",
      summary: "Contestants must index and structure unstructured municipal carbon reports in a compliant layout.",
      content: "To compete, developers must set up secure ingestion modules that can process massive legal PDFs, highlight inconsistencies, and export clean Excel carbon spreadsheets. Judges evaluate grounded accuracy above standard conversational fluency.",
      likes: 114
    }
  ]);

  // Seeded Research reports
  const [reports, setReports] = useState<ResearchReport[]>([
    {
      id: "rep-1",
      title: "The Power-Law of Scale in Agentic Workflows",
      author: "Dr. Clara Sterling",
      institution: "MIT AI Research Lab",
      date: "June 2026",
      summary: "Quantifying overall performance gains as a function of recursive scratchpad edits vs raw parameter size.",
      tags: ["Agentic", "Scale Laws", "Scratchpad"],
      reads: 320
    },
    {
      id: "rep-2",
      title: "Retrospective Analysis of EU Venture Investment Multiples",
      author: "Ecosystem Intelligence Team",
      institution: "Dealroom Frameworks",
      date: "May 2026",
      summary: "An empirical deep-dive into Series-A valuation caps across deeptech, aerospace, and sovereign models.",
      tags: ["VC", "Dealroom", "Ecosystem"],
      reads: 489
    },
    {
      id: "rep-3",
      title: "Preventing Private Vector Leaks in Grounded Systems",
      author: "Sovereign Security Guild",
      institution: "Cyber Security Council",
      date: "April 2026",
      summary: "Methods to protect private PDFs against inverse-vector reconstruction prompts from hostile users.",
      tags: ["RAG", "Security", "Privacy"],
      reads: 215
    },
    {
      id: "rep-4",
      title: "Monospace Typography Constraints on Cognitive Bandwidth",
      author: "Prof. Kenneth Grotesk",
      institution: "Visual Cognition Institute",
      date: "March 2026",
      summary: "Why pure high-contrast black-and-white layouts enhance technical review accuracy compared to dark slop.",
      tags: ["UI/UX", "Typography", "Space Grotesk"],
      reads: 180
    }
  ]);

  // Terminal Line adaptation
  useEffect(() => {
    if (activeHoverCluster !== null) {
      const cluster = CLUSTERS.find(c => c.id === activeHoverCluster);
      const lines = [
        `$ INITIALIZING ${cluster?.hoverCommand}...`,
        `[STATUS] ESTABLISHING TUNNEL CONNECTION... SUCCESS`,
        `[AUDIT] BUFFERING ${cluster?.title.toUpperCase()} PROTOCOLS...`,
        `[SECURE] MOUNTING RAW GROUNDED DATA SOURCE VECTOR VECTOR_0${activeHoverCluster}...`,
        `[MODEL] GROUNDING CONTEXT Persona_Loaded: "${cluster?.persona}"`,
        `$ SYSTEM READY FOR HIGH-DENSITY COGNITIVE SCRAPE.`
      ];
      setTerminalLines(lines);
    } else {
      setTerminalLines([]);
    }
  }, [activeHoverCluster]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerTick(prev => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(async () => {
      try {
        const response = await fetch("/api/apply-prime", { method: "POST" });
        const data = await response.json();
        if (data.success) {
          onApplyPrime();
          onRefreshLogs();
          setShowCheckout(false);
        }
      } catch (err) {
        console.error("Failed to apply for Prime:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const handleRegisterTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialEmailInput.trim() || !trialEmailInput.includes("@")) {
      setTrialError("A valid email address containing '@' is required.");
      return;
    }
    setTrialLoading(true);
    setTrialError("");
    try {
      await onActivateTrial(trialEmailInput.trim());
    } catch (err: any) {
      setTrialError(err.message || "Pipeline error during trial clearance.");
    } finally {
      setTrialLoading(false);
    }
  };

  // Submit custom news
  const handleSubmitNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const newItem: NewswireItem = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      category: newCat,
      source: newSource.trim() || "User Flash",
      timestamp: "Just now",
      summary: newSummary,
      content: newSummary + " Submitted directly by community operator for system-wide intelligence indexing.",
      likes: 1
    };

    setNewswire(prev => [newItem, ...prev]);
    setNewTitle("");
    setNewSource("");
    setNewSummary("");
    setShowNewsForm(false);
  };

  // Submit custom report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repTitle.trim() || !repSummary.trim()) return;

    const parsedTags = repTags.split(",").map(t => t.trim()).filter(Boolean);
    const newReport: ResearchReport = {
      id: `custom-rep-${Date.now()}`,
      title: repTitle,
      author: repAuthor.trim() || "Independent Researcher",
      institution: repInst.trim() || "Open Ecosystem Consortium",
      date: "June 2026",
      summary: repSummary,
      tags: parsedTags.length > 0 ? parsedTags : ["Community", "Research"],
      reads: 1
    };

    setReports(prev => [newReport, ...prev]);
    setRepTitle("");
    setRepAuthor("");
    setRepInst("");
    setRepSummary("");
    setRepTags("");
    setShowReportForm(false);
  };

  // Filter newswire
  const filteredNewswire = useMemo(() => {
    return newswire.filter(item => {
      const matchCategory = newsCategory === "ALL" || item.category === newsCategory;
      const matchSearch = newsSearch === "" || 
        item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
        item.summary.toLowerCase().includes(newsSearch.toLowerCase()) ||
        item.content.toLowerCase().includes(newsSearch.toLowerCase()) ||
        item.source.toLowerCase().includes(newsSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [newswire, newsCategory, newsSearch]);

  return (
    <div id="landing-page-root" className="min-h-screen bg-bg text-[#000000] selection:bg-accent selection:text-white font-mono text-xs">
      
      {/* Top Banner Ticker */}
      <div className="bg-[#000000] text-white font-mono text-[10px] py-2 px-4 border-b border-border flex items-center justify-between whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 text-[#ffffff] font-bold">
            <Cpu size={10} className="text-white animate-pulse" /> ECOSYSTEM_STATUS: ONLINE
          </span>
          <span className="hidden sm:inline">GEMINI_3.5_FLASH: OPTIMIZED</span>
          <span className="hidden md:inline">VECTOR INDEX: 98.4% RECALL</span>
          <span className="hidden lg:inline text-white">AI SENTIMENT: EXTREME OPTIMISM (91/100)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>PORT: 3000</span>
          <span>TIME_UTC: {new Date().toISOString().slice(11, 19)}</span>
        </div>
      </div>

      {/* Main Sub-Navigation Bar */}
      <div className="border-b border-border bg-surface p-1">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-black" />
            <span className="font-bold tracking-tight text-black uppercase">AVANT-GARDE PORTAL</span>
          </div>

          <div className="flex flex-wrap items-center bg-white border border-border p-0.5 gap-0.5">
            <button
              onClick={() => setActiveTab("portal_hub")}
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest uppercase cursor-pointer transition-colors ${
                activeTab === "portal_hub"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              [ PORTAL HUB COCKPIT ]
            </button>
            <button
              onClick={() => setActiveTab("yellow_pages_directory")}
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest uppercase cursor-pointer transition-colors ${
                activeTab === "yellow_pages_directory"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              [ YELLOW PAGES DIRECTORY ]
            </button>
            <button
              onClick={() => setActiveTab("yellow_pages_repositories")}
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest uppercase cursor-pointer transition-colors ${
                activeTab === "yellow_pages_repositories"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              [ REPOSITORIES ]
            </button>
            <button
              id="btn-active-tab-social-sentiment"
              onClick={() => setActiveTab("social_sentiment")}
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest uppercase cursor-pointer transition-colors ${
                activeTab === "social_sentiment"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              [ SOCIAL AI SENTIMENT ]
            </button>
            <button
              id="btn-active-tab-private-markets"
              onClick={() => setActiveTab("private_markets")}
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest uppercase cursor-pointer transition-colors ${
                activeTab === "private_markets"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              [ PRIVATE MARKETS & STARTUPS ]
            </button>
            <button
              onClick={() => setActiveTab("about_us")}
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest uppercase cursor-pointer transition-colors ${
                activeTab === "about_us"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              [ ABOUT US & GATEWAY ]
            </button>
            <button
              onClick={() => setActiveTab("pricing")}
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest uppercase cursor-pointer transition-colors ${
                activeTab === "pricing"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              [ PRICING ]
            </button>
            <button
              onClick={() => setActiveTab("auth")}
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest uppercase cursor-pointer transition-colors flex items-center gap-1 ${
                activeTab === "auth"
                  ? "bg-black text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <UserPlus size={10} />
              {currentUser ? `[ ${currentUser.fullName.split(" ")[0].toUpperCase()} ]` : "[ SIGN IN / SIGN UP ]"}
            </button>
            <button
              onClick={() => {
                if (currentUser?.role === "admin") {
                  setActiveTab("admin");
                } else {
                  setActiveTab("auth");
                  alert("Security Protocol: Accessing the Admin Cockpit requires an active Administrator session. Please sign up with the 'System Admin Preset' or login as admin@avant-garde.ai.");
                }
              }}
              className={`px-2.5 py-1.5 text-[9px] font-black tracking-widest uppercase cursor-pointer transition-colors flex items-center gap-1 ${
                activeTab === "admin"
                  ? "bg-black text-white"
                  : currentUser?.role === "admin"
                  ? "text-green-600 hover:text-green-700 font-extrabold"
                  : "text-zinc-400 hover:text-black"
              }`}
            >
              {currentUser?.role === "admin" ? <Unlock size={10} className="text-green-600 animate-pulse" /> : <Lock size={10} />}
              [ ADMIN COCKPIT ]
            </button>
            <button
              onClick={() => setShowGlobalSearch(true)}
              className="px-2.5 py-1.5 text-[9px] font-black tracking-widest uppercase cursor-pointer bg-zinc-900 text-[#00ff66] hover:bg-black transition-colors flex items-center gap-1 border border-[#00ff66]/40"
              title="Open Global Search (Ctrl+K)"
            >
              <Command size={10} /> [ SEARCH COCKPIT ]
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-x border-border min-h-screen flex flex-col bg-bg">
        
        {activeTab === "portal_hub" ? (
          /* ======================================================== */
          /* THE REDESIGNED HOMEPAGE: THREE PANEL PORTAL HUB COCKPIT   */
          /* ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow min-h-[600px]">
            
            {/* ------------------------------------------------------ */}
            {/* LEFT PANEL (Lg: 3 Cols): Sections & Market Sentiment   */}
            {/* ------------------------------------------------------ */}
            <aside className="lg:col-span-3 border-r border-border p-4 bg-surface space-y-6">
              
              {/* Portal Hub Sections overview */}
              <div className="space-y-3.5">
                <span className="text-[10px] text-black font-black tracking-widest uppercase block border-b border-border pb-1">
                  SYSTEM CORE DIRECTIVES
                </span>
                <div className="space-y-2">
                  <div className="border border-border bg-white p-2.5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-black uppercase text-[11px]">[01] RAG RESEARCH</span>
                      <span className="text-[8px] bg-black text-white px-1 font-bold">PRIME TIER</span>
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-1 uppercase">Source-Grounded Notebooks</p>
                  </div>

                  <div className="border border-border bg-white p-2.5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-black uppercase text-[11px]">[02] COGNITIVE CORE</span>
                      <span className="text-[8px] bg-black text-white px-1 font-bold">PRIME TIER</span>
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-1 uppercase">4 Specialized Clusters</p>
                  </div>

                  <div className="border border-border bg-white p-2.5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-black uppercase text-[11px]">[03] DEALROOM VC</span>
                      <span className="text-[8px] bg-black text-white px-1 font-bold">PRIME TIER</span>
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-1 uppercase">Funding Power-Law Indices</p>
                  </div>

                  <div className="border border-border bg-white p-2.5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-black uppercase text-[11px]">[04] KNOWLEDGE DIRECTORY</span>
                      <span className="text-[8px] bg-green-200 border border-green-400 text-green-800 px-1 font-bold">AVAILABLE</span>
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-1 uppercase">Manual & Tutorial Tooltips</p>
                  </div>
                </div>

                <div className="bg-white border border-border p-3 text-[10px] leading-relaxed text-zinc-600 text-center">
                  <span className="text-black font-black block uppercase mb-1">PROMPT UNLOCK REQUIREMENT</span>
                  Apply for Certified Prime Tier or activate the 24-hour instant demo loop in the <strong className="text-black underline cursor-pointer" onClick={() => setActiveTab("about_us")}>About & Gateway</strong> panel.
                </div>
              </div>

              {/* Real-time Market Sentiment Gauge */}
              <div className="space-y-3">
                <span className="text-[10px] text-black font-black tracking-widest uppercase block border-b border-border pb-1">
                  MARKET SENTIMENT INDICATORS
                </span>

                <div className="bg-white border border-border p-3.5 space-y-3.5">
                  <div>
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="uppercase text-zinc-600">AI Compute Ingress (A100)</span>
                      <span className="text-red-600">$0.78 / hr [DOWNWARD]</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1 mt-1">
                      <div className="bg-black h-full w-[35%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="uppercase text-zinc-600">Global VC Funding Speed</span>
                      <span className="text-black font-bold">$1.2B / week [EXPONENTIAL]</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1 mt-1">
                      <div className="bg-black h-full w-[85%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="uppercase text-zinc-600">Model Recall Precision</span>
                      <span className="text-black">99.12% RAG Average</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1 mt-1">
                      <div className="bg-black h-full w-[99%]"></div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 space-y-2 text-[9.5px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">COMPUTE DEMAND:</span>
                      <span className="font-bold text-black uppercase">CRITICAL_HIGH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">SEED STAGE MULTIPLE:</span>
                      <span className="font-bold text-black">12.4x ARR AVG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">SOVEREIGN ALLOCATION:</span>
                      <span className="font-bold text-[#e11d48]">ACTIVE GUARD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin contact widget */}
              <div className="bg-black text-white p-3 space-y-1.5 text-center">
                <span className="text-[9px] font-black tracking-widest text-[#ffffff]/80 uppercase block">CORE WEBHOOK TRIGGERS</span>
                <p className="text-[9.5px] leading-tight text-[#e0e0e0]">All status transitions are broadcast automatically via the background admin channels.</p>
              </div>

            </aside>

            {/* ------------------------------------------------------ */}
            {/* MIDDLE PANEL (Lg: 5 Cols): AI News Newswire Feed      */}
            {/* ------------------------------------------------------ */}
            <main className="lg:col-span-5 p-4 space-y-4 flex flex-col overflow-hidden">
              
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border pb-3">
                <div>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase block">REAL-TIME MONITOR</span>
                  <h2 className="text-base font-black text-black uppercase tracking-tight flex items-center gap-1.5">
                    <Globe size={15} className="text-black" />
                    AI SYSTEM NEWSWIRE
                  </h2>
                </div>

                <button
                  onClick={() => setShowNewsForm(!showNewsForm)}
                  className="px-2.5 py-1 border border-black bg-black text-white hover:bg-zinc-800 text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus size={11} /> SUBMIT NEWS FLASH
                </button>
              </div>

              {/* Submit Custom News Interactive Dialogue Block */}
              {showNewsForm && (
                <form onSubmit={handleSubmitNews} className="bg-surface border border-border p-3 space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-1">
                    <span className="font-black text-[9px] text-black uppercase">SUBMIT SYSTEM INTELLIGENCE NEWS FLASH</span>
                    <button type="button" onClick={() => setShowNewsForm(false)} className="text-[8px] font-bold text-red-600 hover:underline">
                      CANCEL
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[8px] text-zinc-600 uppercase font-bold block mb-0.5">Headline Title</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="NVIDIA announces chip scale metrics..."
                        className="w-full bg-white border border-border p-1.5 text-[10px] focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-zinc-600 uppercase font-bold block mb-0.5">Source / Agency</label>
                      <input
                        type="text"
                        value={newSource}
                        onChange={(e) => setNewSource(e.target.value)}
                        placeholder="e.g. Wired, TechCrunch"
                        className="w-full bg-white border border-border p-1.5 text-[10px] focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[8px] text-zinc-600 uppercase font-bold block mb-0.5">Category Domain</label>
                      <select
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value as any)}
                        className="w-full bg-white border border-border p-1.5 text-[10px] focus:outline-none"
                      >
                        <option value="COMPANIES">COMPANIES</option>
                        <option value="TOOLS">TOOLS</option>
                        <option value="OPPORTUNITIES">OPPORTUNITIES</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[8px] text-zinc-600 uppercase font-bold block mb-0.5">Summary</label>
                      <input
                        type="text"
                        required
                        value={newSummary}
                        onChange={(e) => setNewSummary(e.target.value)}
                        placeholder="Keep summary compact and technical..."
                        className="w-full bg-white border border-border p-1.5 text-[10px] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-black text-white text-[9px] font-black uppercase hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    DISPATCH FLASH INTELLIGENCE VECTORS
                  </button>
                </form>
              )}

              {/* Filtering Interface */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    placeholder="Search newswire by keywords, companies or opportunities..."
                    className="w-full bg-white border border-border p-2 pl-8 text-[11px] text-black focus:outline-none focus:border-black"
                  />
                  <Search className="absolute left-2.5 top-2.5 text-zinc-500 size-3.5" />
                </div>

                {/* Categories filtering pills */}
                <div className="flex flex-wrap gap-1">
                  {["ALL", "COMPANIES", "TOOLS", "OPPORTUNITIES"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewsCategory(cat)}
                      className={`px-2 py-0.5 border text-[9px] cursor-pointer transition-all ${
                        newsCategory === cat 
                          ? "bg-black text-white border-black font-bold" 
                          : "bg-white border-border text-zinc-600 hover:text-black"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic News items */}
              <div className="flex-grow space-y-3 overflow-y-auto max-h-[500px] scrollbar-custom pr-1.5">
                {filteredNewswire.length === 0 ? (
                  <div className="py-12 text-center text-zinc-600 uppercase">
                    NO INTELLIGENCE VECTORS FOUND MATCHING THE ACTIVE SEARCH TERMS.
                  </div>
                ) : (
                  filteredNewswire.map(item => (
                    <div
                      key={item.id}
                      className="border border-border p-3.5 bg-white hover:border-black/60 transition-colors space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[8px] border px-1.5 py-0.5 font-bold shrink-0 ${
                          item.category === "COMPANIES" ? "bg-amber-100 border-amber-300 text-amber-800" :
                          item.category === "TOOLS" ? "bg-blue-100 border-blue-300 text-blue-800" :
                          "bg-purple-100 border-purple-300 text-purple-800"
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-[9px] text-zinc-600 shrink-0 font-bold">{item.timestamp}</span>
                      </div>

                      <div>
                        <h4 
                          onClick={() => setSelectedNews(selectedNews?.id === item.id ? null : item)}
                          className="text-[12px] font-black text-black hover:underline cursor-pointer uppercase leading-tight tracking-tight"
                        >
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-zinc-600 mt-1 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      {/* Detailed Drawer */}
                      {selectedNews?.id === item.id && (
                        <div className="bg-surface border border-border p-3 text-[10.5px] leading-relaxed text-zinc-700 mt-2">
                          <p className="mb-2">{item.content}</p>
                          <div className="text-[9px] font-bold text-black uppercase">
                            SOURCE AGENCY: {item.source}
                          </div>
                        </div>
                      )}

                      {/* Footer interaction bar */}
                      <div className="flex justify-between items-center pt-2 border-t border-border/30 text-[9px] text-zinc-600 font-mono">
                        <span className="flex items-center gap-1">
                          BY: <strong className="text-black">{item.source}</strong>
                        </span>
                        
                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              setNewswire(prev => prev.map(p => p.id === item.id ? { ...p, likes: p.likes + 1 } : p));
                            }}
                            className="hover:text-black hover:underline font-bold"
                          >
                            ▲ RECON_UPVOTE ({item.likes})
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </main>

            {/* ------------------------------------------------------ */}
            {/* RIGHT PANEL (Lg: 4 Cols): Research & Intelligence Dossiers */}
            {/* ------------------------------------------------------ */}
            <aside className="lg:col-span-4 p-4 bg-surface border-l border-border space-y-4">
              
              <div className="flex justify-between items-center border-b border-border pb-3">
                <div>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase block">INTEL DOCUMENTS</span>
                  <h2 className="text-base font-black text-black uppercase tracking-tight flex items-center gap-1.5">
                    <BookOpen size={15} className="text-black" />
                    RESEARCH LIBRARY
                  </h2>
                </div>
                
                <button
                  onClick={() => setShowReportForm(!showReportForm)}
                  className="px-2.5 py-1 border border-black bg-white text-black hover:bg-black hover:text-white text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus size={11} /> PROPOSE DOSSIER
                </button>
              </div>

              {/* Research submission dialogue */}
              {showReportForm && (
                <form onSubmit={handleSubmitReport} className="bg-white border border-border p-3 space-y-3 text-[10px]">
                  <div className="flex justify-between items-center border-b border-border pb-1">
                    <span className="font-black text-[9px] text-black uppercase">PROPOSE TECHNICAL WHITE PAPER</span>
                    <button type="button" onClick={() => setShowReportForm(false)} className="text-[8px] font-bold text-red-600 hover:underline">
                      CANCEL
                    </button>
                  </div>

                  <div>
                    <label className="text-[8px] text-zinc-600 uppercase font-bold block">Document Title</label>
                    <input
                      type="text"
                      required
                      value={repTitle}
                      onChange={(e) => setRepTitle(e.target.value)}
                      placeholder="e.g. Scaling laws in sparse networks"
                      className="w-full bg-surface border border-border p-1.5 text-[10px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[8px] text-zinc-600 uppercase font-bold block">Primary Investigator</label>
                      <input
                        type="text"
                        value={repAuthor}
                        onChange={(e) => setRepAuthor(e.target.value)}
                        placeholder="Dr. Jean-Luc"
                        className="w-full bg-surface border border-border p-1.5 text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-zinc-600 uppercase font-bold block">Institution</label>
                      <input
                        type="text"
                        value={repInst}
                        onChange={(e) => setRepInst(e.target.value)}
                        placeholder="e.g. Stanford AI"
                        className="w-full bg-surface border border-border p-1.5 text-[10px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] text-zinc-600 uppercase font-bold block">Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={repTags}
                      onChange={(e) => setRepTags(e.target.value)}
                      placeholder="e.g. Scale, Transformers, RAG"
                      className="w-full bg-surface border border-border p-1.5 text-[10px]"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] text-zinc-600 uppercase font-bold block">Abstract / Summary</label>
                    <textarea
                      required
                      rows={2}
                      value={repSummary}
                      onChange={(e) => setRepSummary(e.target.value)}
                      placeholder="Write executive summary vectors..."
                      className="w-full bg-surface border border-border p-1.5 text-[10px] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-black text-white text-[9px] font-black uppercase hover:bg-zinc-800"
                  >
                    SUBMIT TO SYSTEM DIRECTORY
                  </button>
                </form>
              )}

              {/* Research Dossiers lists */}
              <div className="space-y-3">
                {reports.map(rep => (
                  <div
                    key={rep.id}
                    className="border border-border bg-white p-3.5 space-y-2 hover:border-black/50 transition-colors"
                  >
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-black block">
                        {rep.institution} // {rep.date}
                      </span>
                      <h4 
                        onClick={() => setSelectedReport(selectedReport?.id === rep.id ? null : rep)}
                        className="text-[11.5px] font-black text-black hover:underline cursor-pointer uppercase mt-0.5 leading-tight"
                      >
                        {rep.title}
                      </h4>
                    </div>

                    <p className="text-[10px] text-zinc-600 leading-relaxed font-sans">
                      {rep.summary}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {rep.tags.map(tag => (
                        <span key={tag} className="text-[8px] bg-zinc-100 border border-border px-1.5 py-0.5 text-zinc-600 uppercase font-bold">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Report detail abstract */}
                    {selectedReport?.id === rep.id && (
                      <div className="bg-surface border border-border p-3 text-[10px] leading-relaxed text-zinc-700 mt-2 space-y-2">
                        <span className="font-black text-black uppercase text-[8px] block border-b border-border pb-1">TECHNICAL ABSTRACT</span>
                        <p>Investigator {rep.author} presents empirical test results evaluating system accuracy. By isolating local vectors from cloud processing arrays, the operational security bounds remain intact throughout multi-user prompt runs.</p>
                        <div className="text-[8px] text-zinc-600 font-bold uppercase">
                          CANDIDATE PEER REVIEWS: {rep.reads} RECON READS
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-border/30 text-[9px]">
                      <span className="text-zinc-600 uppercase">
                        AUTHOR: <strong className="text-black">{rep.author}</strong>
                      </span>
                      
                      <button
                        onClick={() => {
                          setReports(prev => prev.map(p => p.id === rep.id ? { ...p, reads: p.reads + 1 } : p));
                          setSelectedReport(rep);
                        }}
                        className="text-black hover:underline font-black uppercase flex items-center gap-1"
                      >
                        [ PREVIEW ABSTRACT ]
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Research ecosystem citation info */}
              <div className="bg-white border border-border p-3 text-[9px] leading-relaxed text-zinc-600">
                <span className="text-black font-black uppercase block mb-1">Ecosystem Grounding Citation Note</span>
                All research white papers committed to this index registry undergo manual verification protocols to secure system RAG compatibility.
              </div>

            </aside>

          </div>
        ) : activeTab === "yellow_pages_directory" ? (
          <YellowPagesDirectory />
        ) : activeTab === "yellow_pages_repositories" ? (
          <YellowPagesRepositories />
        ) : activeTab === "social_sentiment" ? (
          <SocialSentimentDeck />
        ) : activeTab === "private_markets" ? (
          <PrivateMarketsAI />
        ) : activeTab === "pricing" ? (
          <PricingPage />
        ) : activeTab === "auth" ? (
          <AuthPage 
            currentUser={currentUser} 
            onLoginSuccess={(usr) => {
              setCurrentUser(usr);
              localStorage.setItem("avantgarde_current_user", JSON.stringify(usr));
              if (usr.role === "admin") {
                setActiveTab("admin");
              } else {
                setActiveTab("portal_hub");
              }
            }} 
            onLogout={() => {
              setCurrentUser(null);
              localStorage.removeItem("avantgarde_current_user");
              setActiveTab("portal_hub");
            }} 
          />
        ) : activeTab === "admin" ? (
          currentUser?.role === "admin" ? (
            <AdminPanel />
          ) : (
            <div className="p-8 text-center font-mono space-y-4">
              <Lock className="mx-auto text-red-600" size={32} />
              <h3 className="text-sm font-black text-black">SECURITY SYSTEM BLOCK</h3>
              <p className="text-[11px] text-zinc-600 max-w-md mx-auto leading-relaxed">
                Your current session does not hold root administrative clearance keys. Please authenticate under a System Admin role profile.
              </p>
              <button
                onClick={() => setActiveTab("auth")}
                className="px-4 py-2 border border-black bg-black text-white text-xs font-bold uppercase hover:bg-zinc-800"
              >
                PROCEED TO GATEWAY
              </button>
            </div>
          )
        ) : (
          /* ======================================================== */
          /* THE ORIGINAL LANDING PAGE: ABOUT US & COCKPIT GATEWAY    */
          /* ======================================================== */
          <>
            {/* Top Branding Section */}
            <header className="border-b border-border grid grid-cols-1 md:grid-cols-3 bg-white">
              <div className="p-6 md:col-span-2 border-b md:border-b-0 md:border-r border-border bg-white flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold tracking-widest bg-black text-white px-2.5 py-1">
                    SYSTEM MANUAL // OPERATIONAL PORTAL
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mt-5 text-black uppercase leading-none">
                    AVANT-GARDE <br /><span className="text-black underline decoration-2">ABOUT US & GATEWAY</span>
                  </h1>
                </div>
                <p className="font-mono text-xs text-zinc-600 mt-6 md:mt-12 uppercase tracking-wider">
                  ESTABLISHED IN 2026 // INTELLECTUAL PORTAL HUB COCKPIT
                </p>
              </div>

              <div className="p-6 bg-surface text-[#000000] flex flex-col justify-between font-mono border-b md:border-b-0 border-border">
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                    <span className="text-black font-bold tracking-widest">MACRO TICKERS</span>
                    <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">GPT-5 COMPILER:</span>
                      <span className="text-black font-bold">READY_AGENT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">GEMINI PRO 3.1:</span>
                      <span className="text-black font-bold">ACTIVE_RAG [99.1%]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">VC FUNDING INDEX:</span>
                      <span className="text-black font-bold">+$8.5M AVG SEED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">SOVEREIGN RISK SPREAD:</span>
                      <span className="text-[#e11d48] font-bold">0.12 [CRITICAL]</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-[10px] text-zinc-650 leading-tight uppercase">
                  PLATFORM VERIFIED FOR MULTI-CLUSTER RESEARCH & DEPLOYMENT COCKPIT.
                </div>
              </div>
            </header>

            {/* Hero Matrix Section */}
            <section className="border-b border-border grid grid-cols-1 lg:grid-cols-12 bg-[#ffffff]">
              <div className="lg:col-span-8 p-6 md:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border bg-surface/30">
                <span className="font-mono text-xs font-bold text-black tracking-wider flex items-center gap-1.5 uppercase">
                  <Activity size={14} className="text-black" /> SYSTEM OVERVIEW PROTOCOLS
                </span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black mt-4 leading-tight uppercase">
                  THE PERMANENT INTELLECTUAL COCKPIT FOR HIGH-SPEED RAG RESEARCH
                </h2>
                <p className="text-zinc-700 mt-6 max-w-2xl leading-relaxed text-sm">
                  Say goodbye to scattered files and ungrounded LLM hallucinations. Our multi-cluster platform provides a structured, source-grounded research cockpit styled like Google's NotebookLM, but packed with sophisticated and distinctive technical precision.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#pricing-section"
                    className="px-6 py-3 border border-black bg-black text-white font-mono font-bold text-xs tracking-wider uppercase cursor-pointer hover:bg-zinc-800 transition-all duration-200"
                  >
                    APPLY FOR PRIME ACCESS
                  </a>
                  <a
                    href="#clusters-section"
                    className="px-6 py-3 border border-border bg-transparent text-black font-mono font-bold text-xs tracking-wider uppercase cursor-pointer hover:bg-surface transition-all duration-200"
                  >
                    EXPLORE 4 CORE CLUSTERS
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 bg-surface flex flex-col justify-between border-b lg:border-b-0 border-border">
                <div>
                  <span className="font-mono text-[11px] font-bold tracking-widest text-zinc-600 flex items-center gap-1.5 uppercase">
                    <Terminal size={12} /> Live Active Index Output
                  </span>
                  
                  <div className="mt-4 bg-[#ffffff] border border-border p-3.5 font-mono text-[10px] text-black rounded-none">
                    <div className="flex justify-between items-center text-zinc-500 border-b border-border pb-1.5 mb-2">
                      <span>TERMINAL FEEDER</span>
                      <span className="flex items-center gap-1 text-black"><span className="w-1.5 h-1.5 rounded-full bg-black"></span>LIVE</span>
                    </div>
                    <div className="space-y-1.5 h-44 overflow-y-auto scrollbar-custom">
                      <div>&gt;_ system status: ok</div>
                      <div>&gt;_ fetching indices from 4 pillars...</div>
                      {tickerTick % 4 >= 0 && <div className="text-zinc-600 font-bold">&gt;_ Cluster 01: Comprehension OK</div>}
                      {tickerTick % 4 >= 1 && <div className="text-black font-bold">&gt;_ Cluster 02: Systems Audit OK</div>}
                      {tickerTick % 4 >= 2 && <div className="text-black font-bold">&gt;_ Cluster 03: Investment Quant OK</div>}
                      {tickerTick % 4 >= 3 && <div className="text-zinc-650 font-bold">&gt;_ Cluster 04: Alpha Incubation OK</div>}
                      <div className="text-zinc-500">&gt;_ ping latency: 14ms (Tunnel_3000)</div>
                      <div className="text-zinc-500 animate-pulse">&gt;_ waiting for user auth validation...</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4 font-mono text-xs">
                  <span className="text-zinc-650">PORTAL USER:</span> <br />
                  <span className="font-bold text-black break-all">{orderEmail}</span>
                </div>
              </div>
            </section>

            {/* The Hub Introduction */}
            <section id="clusters-section" className="border-b border-border p-6 md:p-10 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold tracking-widest text-black bg-surface border border-border px-2 py-0.5">
                      INTRODUCING OPERATIONAL PILLARS
                    </span>
                    <h3 className="text-3xl font-black mt-4 text-black uppercase leading-none">
                      THE 4 CORE <br /><span className="text-black">CLUSTERS</span>
                    </h3>
                  </div>
                  <p className="font-mono text-xs text-zinc-600 mt-4 leading-relaxed uppercase">
                    UPON UPGRADING TO THE <span className="text-black font-bold">PRIME FEATURE TIER</span>, THE ENTIRE PLATFORM TRANSFORMS FROM AN INTERACTIVE DISCOVERY ENGINE INTO A PERMANENT RESEARCH, TESTING, AND DEPLOYMENT COCKPIT.
                  </p>
                </div>

                <div className="md:col-span-2 text-zinc-700 leading-relaxed text-sm space-y-4 font-sans">
                  <p>
                    Each operational cluster represents a customized data ecosystem. When toggled, the workspace's theme adaptation layer adjusts the underlying LLM prompting pathways, persona grounding vectors, and specific analysis modules.
                  </p>
                  <p className="font-mono text-xs font-semibold text-black uppercase bg-surface border border-border p-3.5 inline-block">
                    ★ PREREQUISITE: PRIME UPGRADE REQ. ADMINISTRATIVE CLEARANCE WILL BE MANUALLY AUDITED UPON COMMITTING APPLICATION TO PREVENT SYSTEM ABUSE.
                  </p>
                </div>
              </div>
            </section>

            {/* Cluster Navigation Blocks Grid */}
            <section className="border-b border-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-surface">
              {CLUSTERS.map((cluster) => {
                const isHovered = activeHoverCluster === cluster.id;
                return (
                  <motion.div
                    key={cluster.id}
                    onMouseEnter={() => setActiveHoverCluster(cluster.id)}
                    onMouseLeave={() => setActiveHoverCluster(null)}
                    whileHover={{
                      scale: 1.015,
                      zIndex: 10,
                      transition: { duration: 0.15 }
                    }}
                    className={`p-6 border-b md:border-b-0 md:border-r border-border flex flex-col justify-between cursor-pointer relative overflow-hidden transition-colors duration-300 ${
                      isHovered ? "bg-white text-black" : "bg-surface text-zinc-750"
                    }`}
                  >
                    {/* Scrolling terminal stream background effect */}
                    <motion.div
                      initial={{ y: 0 }}
                      animate={isHovered ? { y: [0, -250] } : { y: 0 }}
                      transition={{
                        ease: "linear",
                        duration: 4,
                        repeat: Infinity
                      }}
                      className="absolute inset-0 font-mono text-[8px] leading-none select-none pointer-events-none p-2 whitespace-nowrap overflow-hidden text-black opacity-[0.03] flex flex-col gap-1 z-0"
                    >
                      {Array.from({ length: 4 }).flatMap(() => SCROLLING_LINES).map((line, idx) => (
                        <div key={idx}>{`> ${line}`}</div>
                      ))}
                    </motion.div>

                    <div className="relative z-10">
                      <span className={`font-mono text-[10px] font-bold tracking-widest block ${
                        isHovered ? "text-black font-black" : "text-zinc-650"
                      }`}>
                        {cluster.tag}
                      </span>
                      
                      <motion.h4 
                        animate={isHovered ? {
                          x: [0, -1.5, 1.5, -1, 1, -2, 2, 0],
                          y: [0, 0.5, -0.5, 0, -1, 1, 0, 0],
                        } : {}}
                        transition={{ duration: 0.25 }}
                        className={`text-lg font-black tracking-tight mt-3 uppercase leading-tight block ${
                          isHovered ? "text-black" : "text-black/85"
                        }`}
                      >
                        {cluster.title}
                      </motion.h4>
                      
                      <p className={`text-xs mt-3 leading-relaxed ${isHovered ? "text-black" : "text-zinc-600"}`}>
                        {cluster.purpose}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-dashed border-border relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold tracking-widest">
                          {isHovered ? "VIEW ACTIVE STREAM" : "INTERACTIVE CARDS"}
                        </span>
                        <ArrowRight size={14} className={isHovered ? "text-black animate-pulse" : "text-zinc-500"} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </section>

            {/* Dynamic Terminal animation output based on hover */}
            {activeHoverCluster !== null && (
              <div className="bg-white border-b border-border p-4 font-mono text-[11px] text-black h-44 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-1">
                  {terminalLines.map((line, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span className="text-zinc-500">[{idx}]</span>
                      <span>{line}</span>
                    </div>
                  ))}
                  <div className="animate-pulse text-zinc-500">$ PROCESS_STREAM: STANDBY_GROUNDING...</div>
                </div>
              </div>
            )}

            {/* Gatekeeper Flow Display & Pricing Grid */}
            <section id="pricing-section" className="p-6 md:p-10 bg-white border-b border-border flex-grow flex flex-col justify-center">
              <div className="max-w-5xl mx-auto w-full text-center">
                <span className="font-mono text-xs font-bold tracking-widest bg-surface text-black px-3 py-1 border border-border uppercase inline-block">
                  PLATFORM CLEARANCE PLANS
                </span>
                <h3 className="text-3xl md:text-5xl font-black mt-6 tracking-tight text-black uppercase leading-none">
                  SECURE DEPLOYMENT COCKPIT
                </h3>
                <p className="text-zinc-700 text-sm mt-4 max-w-2xl mx-auto">
                  Get immediate access to our fully grounded NotebookLM adapting workspace. Choose between instant trial clearance or the full certified administrative tier.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 max-w-4xl mx-auto text-left">
                  
                  {/* Card 1: Certified Prime Tier */}
                  <div className="bg-surface border border-border p-6 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="absolute top-0 right-0 bg-black text-white font-mono text-[9px] font-black px-2.5 py-1 tracking-widest uppercase">
                        ADMIN AUDITED
                      </div>
                      <h4 className="font-mono text-xs font-bold text-zinc-650 uppercase tracking-widest">PRIME TIER</h4>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-black">$49</span>
                        <span className="font-mono text-xs text-zinc-650">/ PER MONTH APPLIED</span>
                      </div>

                      <ul className="mt-6 space-y-2.5 text-xs text-zinc-700 font-mono">
                        <li className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-black" /> FULL GROUNDED NOTEBOOK WORKSPACE
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-black" /> ALL 4 DYNAMIC PILLARS ACTIVE
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-black" /> LOCAL DRAG/DROP SOURCE VAULT
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-black" /> VERCEL EDGE-READY PDF COMPILER
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-black" /> AUDITED ACCESS PROTECTION SYSTEM
                        </li>
                      </ul>
                    </div>

                    {/* Status Display and Button Handler */}
                    <div className="mt-8 border-t border-border pt-6">
                      {currentStatus === "not_applied" && (
                        <button
                          id="btn-open-checkout"
                          onClick={() => setShowCheckout(true)}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-black bg-black text-white font-mono font-bold text-xs tracking-wider uppercase cursor-pointer hover:bg-zinc-800 transition-colors"
                        >
                          <ShoppingCart size={14} /> APPLY FOR PRIME ACCESS
                        </button>
                      )}

                      {currentStatus === "pending_approval" && (
                        <div className="bg-amber-100 p-3.5 border border-amber-500/30">
                          <span className="font-mono text-[10px] font-black text-amber-800 flex items-center gap-1 uppercase tracking-wider animate-pulse">
                            ⚠ REVIEW PENDING
                          </span>
                          <p className="text-[10px] text-amber-700 leading-relaxed font-mono mt-1">
                            Please use the floating Admin Panel at bottom right to instantly approve this status.
                          </p>
                        </div>
                      )}
                      
                      {currentStatus === "approved" && (
                        <div className="bg-zinc-100 p-3 border border-border text-center">
                          <span className="font-mono text-xs font-black text-black uppercase tracking-wider">
                            ✓ APPROVED STATE ACTIVE
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 2: 24-Hour Trial Demo */}
                  <div className="bg-white border-2 border-dashed border-border p-6 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="absolute top-0 right-0 bg-zinc-200 border-b border-l border-border font-mono text-[9px] font-black px-2.5 py-1 tracking-widest uppercase text-black">
                        INSTANT CLEARANCE
                      </div>
                      <h4 className="font-mono text-xs font-bold text-black uppercase tracking-widest">24-HOUR FREE TRIAL</h4>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-black">$0</span>
                        <span className="font-mono text-xs text-zinc-650">/ NO CARD REQUIRED</span>
                      </div>

                      <ul className="mt-6 space-y-2.5 text-xs text-zinc-700 font-mono">
                        <li className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-black" /> BYPASS AUDIT QUEUE INSTANTLY
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-black" /> 24-HOUR EXPIRE COUNTDOWN TIMER
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-black" /> DYNAMIC RAG SOURCE LOADING
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-black" /> PDF REPORT COMPILER CLEARED
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-black" /> TEST COGNITIVE LOOPS TODAY
                        </li>
                      </ul>
                    </div>

                    {/* Direct Registration Form */}
                    <div className="mt-8 border-t border-border pt-6">
                      {currentStatus === "approved" ? (
                        <div className="bg-zinc-100 p-3 border border-border text-center">
                          <span className="font-mono text-xs font-black text-black uppercase tracking-wider">
                            ✓ DEMO TRIAL ACTIVATED
                          </span>
                        </div>
                      ) : (
                        <form onSubmit={handleRegisterTrialSubmit} className="space-y-3 font-mono">
                          <div>
                            <label className="block text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                              Operational Email Identifier
                            </label>
                            <input
                              type="email"
                              required
                              value={trialEmailInput}
                              onChange={(e) => setTrialEmailInput(e.target.value)}
                              placeholder="operator@organization.com"
                              className="w-full bg-surface border border-border p-2 text-xs text-black rounded-none focus:outline-none focus:border-black"
                            />
                          </div>
                          
                          {trialError && (
                            <div className="text-[10px] text-red-600 font-bold uppercase">
                              ⚠ {trialError}
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={trialLoading}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-transparent border border-black hover:bg-black hover:text-white text-black font-bold text-xs tracking-wider uppercase cursor-pointer transition-colors"
                          >
                            {trialLoading ? (
                              <>
                                <Loader2 className="animate-spin" size={12} />
                                PROVISIONING DIRECT ROUTE...
                              </>
                            ) : (
                              <>
                                <Sparkles size={12} /> START INSTANT FREE TRIAL
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </>
        )}

        {/* Visual Footer */}
        <footer className="bg-surface text-zinc-600 border-t border-border p-6 font-mono text-center text-[10px] uppercase tracking-widest mt-auto">
          AI ECOSYSTEM ARCHITECTURE © 2026 // GROUNDED PRE-REGULATION PORTAL HUB
        </footer>
      </div>

      {/* Cart / Checkout Modal Flow */}
      {showCheckout && (
        <div id="checkout-modal-overlay" className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-border max-w-md w-full p-6 relative text-black">
            <button
              id="btn-close-checkout"
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 font-mono font-bold hover:text-red-600 cursor-pointer text-xs text-zinc-500"
            >
              [X] CLOSE
            </button>
            <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 uppercase">
              DEEP ADMINISTRATIVE CHECKOUT
            </span>
            
            <h3 className="text-xl font-black mt-4 uppercase tracking-tight text-black">
              PRIMAL INTEL SUBSCRIPTION
            </h3>
            
            <form onSubmit={handleApply} className="mt-6 font-mono text-xs space-y-4">
              <div>
                <label className="block text-zinc-600 font-bold mb-1.5 uppercase tracking-wider">
                  Operational Email Identifier
                </label>
                <input
                  id="checkout-email-input"
                  type="email"
                  required
                  value={orderEmail}
                  onChange={(e) => setOrderEmail(e.target.value)}
                  className="w-full border border-border p-2 bg-white text-black rounded-none focus:outline-none focus:border-black font-bold"
                  placeholder="name@organization.com"
                />
              </div>

              <div className="bg-surface border border-border p-3 space-y-2 text-[11px] text-zinc-650">
                <div className="flex justify-between font-bold text-black border-b border-dashed border-border pb-1.5">
                  <span>SUBSCRIPTION ACCESS TIER:</span>
                  <span className="text-black font-black">PRIME</span>
                </div>
                <div className="flex justify-between">
                  <span>MONTHLY DUES:</span>
                  <span className="text-black font-bold">$49.00 USD</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>DISPATCH WEBHOOK FEE:</span>
                  <span>$0.00 INCLUDED</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-border pt-1.5 font-bold text-zinc-700">
                  <span>BILLING FREQUENCY:</span>
                  <span>ONCE PER CALENDAR MONTH</span>
                </div>
              </div>

              <div className="text-[10px] text-zinc-600 leading-relaxed uppercase">
                BY COMPLETING ORDER, AN AUTOMATED WEBHOOK SIGNAL (candidacy_submitted) WILL BE FIRED TO SYSTEM MANAGERS. YOUR SPACE ACCESS CODE IS MARKED PENDING UNTIL MANUAL CLEARANCE.
              </div>

              <button
                id="btn-submit-checkout"
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white font-bold tracking-wider uppercase cursor-pointer border border-black hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin animate-infinite" size={14} />
                    LAUNCHING DISPATCH PIPELINES...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> COMPLETE ORDER & APPLY
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Command Center Search Modal */}
      {showGlobalSearch && (
        <div id="global-search-overlay" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center p-4 pt-20">
          <div className="bg-white border-2 border-black max-w-xl w-full p-5 relative text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3 mb-4">
              <span className="font-mono text-[9px] font-bold bg-black text-white px-2 py-0.5 uppercase tracking-widest flex items-center gap-1">
                <Command size={10} /> AVANT-GARDE GLOBAL SEARCH SYSTEM
              </span>
              <button
                onClick={() => {
                  setShowGlobalSearch(false);
                  setGlobalSearchQuery("");
                }}
                className="text-red-600 hover:underline font-mono font-black text-[10px]"
              >
                [X] DISMISS
              </button>
            </div>

            {/* Input bar */}
            <div className="relative">
              <span className="absolute left-3 top-3 text-zinc-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                autoFocus
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search anything (e.g. Amana, arabic, Llama, JurisAgent)..."
                className="w-full bg-zinc-50 border border-zinc-350 p-3 pl-10 text-xs focus:outline-none focus:border-black font-mono text-black placeholder-zinc-400"
              />
            </div>

            {/* Search results cataloging */}
            <div className="mt-4 max-h-[340px] overflow-y-auto space-y-2 pr-1 font-mono">
              <span className="text-[8px] text-zinc-450 uppercase tracking-widest block font-bold mb-1.5 border-b border-dashed border-zinc-150 pb-1">
                Registry Index Match List
              </span>

              {(() => {
                const searchItems = [
                  // Agencies
                  { id: "ag-1", name: "Amana Tech Lab", type: "AGENCY", desc: "Premier Middle-East systems integrator specializing in custom corporate multi-agent workflows.", category: "yellow_pages_directory" },
                  { id: "ag-2", name: "Dune AI Solutions", type: "AGENCY", desc: "Leading deeptech hub focusing on fine-tuning large Arabic language models.", category: "yellow_pages_directory" },
                  { id: "ag-3", name: "Byblos Digital Studio", type: "AGENCY", desc: "High-fidelity digital design studio specializing in minimalist UI/UX.", category: "yellow_pages_directory" },
                  { id: "ag-4", name: "Nile Generative Systems", type: "AGENCY", desc: "Agile engineering squad producing lightweight AI agents.", category: "yellow_pages_directory" },
                  { id: "ag-5", name: "Oasis Systems", type: "AGENCY", desc: "Bespoke spatial computing and computer vision agency deploying smart transit grids.", category: "yellow_pages_directory" },
                  { id: "ag-6", name: "Petra AI Consulting", type: "AGENCY", desc: "Specialized consultancy implementing document search (RAG) models.", category: "yellow_pages_directory" },
                  // Repositories
                  { id: "repo-1", name: "menalm-rag-ingestion", type: "REPOSITORY", desc: "Sovereign PDF parser and HNSW hierarchical vector index pipeline.", category: "yellow_pages_repositories" },
                  { id: "repo-2", name: "dune-arabic-llama-weights", type: "REPOSITORY", desc: "Fine-tuning scripts, quantization configs, and adapters mapping 4-bit Llama.", category: "yellow_pages_repositories" },
                  { id: "repo-3", name: "react-monospace-agent-canvas", type: "REPOSITORY", desc: "Monospace Canvas playground styled like terminal interfaces.", category: "yellow_pages_repositories" },
                  { id: "repo-4", name: "nile-node-scraping-orchestrator", type: "REPOSITORY", desc: "Resilient server-side crawler to ingest public agricultural databases.", category: "yellow_pages_repositories" },
                  // Startups
                  { id: "su-1", name: "JurisAgent AI", type: "STARTUP", desc: "Autonomous contract compliance agent checking regional regulatory guidelines.", category: "private_markets" },
                  { id: "su-2", name: "Synaptic Fabric", type: "STARTUP", desc: "Low-latency orchestration layer designed to link server-side vector scrapers.", category: "private_markets" },
                  { id: "su-3", name: "Veritas Vector Audit", type: "STARTUP", desc: "Continuous scanning nodes verifying that client vector registries do not leak data.", category: "private_markets" }
                ];

                const filtered = searchItems.filter(item => 
                  !globalSearchQuery || 
                  item.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                  item.desc.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                  item.type.toLowerCase().includes(globalSearchQuery.toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center p-6 text-zinc-450 border border-dashed border-zinc-200 text-[10px] uppercase">
                      No system-level search matches found. Try another query term.
                    </div>
                  );
                }

                return filtered.map(item => {
                  const badgeColor = 
                    item.type === "AGENCY" 
                      ? "bg-green-100 text-green-800 border-green-300" 
                      : item.type === "REPOSITORY" 
                      ? "bg-blue-100 text-blue-800 border-blue-300" 
                      : "bg-purple-100 text-purple-800 border-purple-300";

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.category as any);
                        setShowGlobalSearch(false);
                        setGlobalSearchQuery("");
                      }}
                      className="p-2.5 border border-zinc-200 bg-zinc-50 hover:bg-black hover:text-white hover:border-black cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 border uppercase ${badgeColor}`}>
                            {item.type}
                          </span>
                          <span className="font-bold text-xs uppercase group-hover:text-[#00ff66]">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-tight group-hover:text-zinc-300 font-sans">
                          {item.desc}
                        </p>
                      </div>

                      <span className="text-[9px] text-zinc-400 font-mono tracking-wider text-right shrink-0">
                        LAUNCH WORKSPACE ↗
                      </span>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Micro instruction footer */}
            <div className="mt-4 pt-3 border-t border-zinc-150 text-[9px] text-zinc-400 text-center font-sans">
              Press <kbd className="bg-zinc-100 border px-1 rounded font-mono text-[10px] text-black">ESC</kbd> or click closing button to terminate query mode.
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
