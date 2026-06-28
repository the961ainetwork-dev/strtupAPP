import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Twitter, 
  Linkedin, 
  BookOpen, 
  Facebook, 
  Instagram, 
  MessageSquare, 
  Heart, 
  RefreshCw, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Filter, 
  ArrowUpRight, 
  Maximize2, 
  Check, 
  Globe, 
  AlertTriangle,
  Flame,
  Info
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  Legend 
} from "recharts";
import { Tooltip as CustomTooltip } from "./Tooltip";

interface SocialPost {
  id: string;
  network: "LinkedIn" | "X" | "Substack" | "Facebook" | "Instagram";
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  text: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  likes: number;
  commentsCount: number;
  trendingTool?: string;
  sentimentScore: number; // 0 to 100
  reach: number; // Simulated reach metric
}

interface TrendKeyword {
  keyword: string;
  count: number;
  growth: number; // percentage
  status: "SURGING" | "STEADY" | "COOLING";
  category: "Model Tech" | "Regional Venture" | "RAG & DB" | "Infrastructure";
}

export const SocialIntelligence: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState<"ALL" | "Positive" | "Neutral" | "Negative">("ALL");
  const [activeRefresh, setActiveRefresh] = useState(false);
  const [activeNetworkFilter, setActiveNetworkFilter] = useState<string>("ALL");
  const [autoIngestActive, setAutoIngestActive] = useState(true);
  const [showDetailPost, setShowDetailPost] = useState<SocialPost | null>(null);
  
  // Custom draft post form
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [draftNetwork, setDraftNetwork] = useState<SocialPost["network"]>("X");
  const [draftAuthor, setDraftAuthor] = useState("");
  const [draftText, setDraftText] = useState("");
  const [draftSentiment, setDraftSentiment] = useState<SocialPost["sentiment"]>("Positive");

  // Initial core posts seed
  const [posts, setPosts] = useState<SocialPost[]>([
    // LinkedIn
    {
      id: "li-1",
      network: "LinkedIn",
      author: "Tariq Al-Mansoori",
      handle: "VP of Sovereign Compute @ Dubai Cloud",
      avatar: "TM",
      timestamp: "3 mins ago",
      text: "Outstanding progress with our localized multi-agent sovereign node trials this quarter! Successfully isolated over 12,000 document embedding arrays across strict geographical boundaries. Enterprise partners reporting 99.4% recall accuracy with zero global data leakage.",
      sentiment: "Positive",
      likes: 421,
      commentsCount: 62,
      trendingTool: "MENA-Sovereign-Cloud",
      sentimentScore: 94,
      reach: 24500
    },
    {
      id: "li-2",
      network: "LinkedIn",
      author: "Reem Al-Otaibi",
      handle: "AI Venture Lead @ Riyadh Capital",
      avatar: "RO",
      timestamp: "24 mins ago",
      text: "Consolidation in seed multiples for general conversational wrappers is clear. However, specialized deep-tech models with real Arabic fine-tunings and document-level grounding are commanding premium valuations. Graph RAG is where value is being captured right now.",
      sentiment: "Positive",
      likes: 289,
      commentsCount: 34,
      trendingTool: "Graph-RAG-Pro",
      sentimentScore: 88,
      reach: 18400
    },
    {
      id: "li-3",
      network: "LinkedIn",
      author: "Marcus Vance",
      handle: "Independent Enterprise Auditor",
      avatar: "MV",
      timestamp: "2 hrs ago",
      text: "Many corporations deploying RAG systems are completely ignoring inverse-vector prompt reconstruction threats. Standard system boundaries can be easily bypassed. We need immediate, robust local audit modules before deploying internal legal pipelines.",
      sentiment: "Negative",
      likes: 185,
      commentsCount: 76,
      sentimentScore: 18,
      reach: 12100
    },

    // X / Twitter
    {
      id: "x-1",
      network: "X",
      author: "AI Developer Flash",
      handle: "@aidev_flash",
      avatar: "DF",
      timestamp: "1 min ago",
      text: "Vite + React 18 remains the absolute gold standard for client-side multi-agent interfaces. The responsiveness when mounting direct WebRTC audio streams is unmatched. Say goodbye to heavy backend server rendering for quick user dashboards! 🚀⚡",
      sentiment: "Positive",
      likes: 842,
      commentsCount: 124,
      trendingTool: "Vite + WebRTC Streams",
      sentimentScore: 96,
      reach: 48900
    },
    {
      id: "x-2",
      network: "X",
      author: "Hana Code",
      handle: "@hana_codes_ai",
      avatar: "HC",
      timestamp: "12 mins ago",
      text: "Trying to index 10,000 page legal PDFs with general vector scrapers is a complete nightmare. Context limits are real and chunks get fragmented horribly. We need better layout-aware parsers that respect tables and page markers! 📑",
      sentiment: "Negative",
      likes: 310,
      commentsCount: 53,
      trendingTool: "Layout-Aware Parser",
      sentimentScore: 22,
      reach: 19500
    },
    {
      id: "x-3",
      network: "X",
      author: "Sovereign AI Press",
      handle: "@sovereign_intel",
      avatar: "SI",
      timestamp: "1 hr ago",
      text: "Benchmark tests show local 4-bit Llama-4-Lite quantizations beating cloud-based commercial models in speed for direct technical summaries. Absolute game changer for offline client workloads.",
      sentiment: "Positive",
      likes: 512,
      commentsCount: 42,
      sentimentScore: 91,
      reach: 32000
    },

    // Substack
    {
      id: "sub-1",
      network: "Substack",
      author: "The Cognitive Scrape",
      handle: "cognitivescrape.substack.com",
      avatar: "CS",
      timestamp: "45 mins ago",
      text: "Deep-Dive Essay: 'Why Monospace Layouts Prevent Cognitive Fatigue'. In this issue we explore empirical testing results from visual cognition centers showing why high-contrast, uncluttered monospace boards yield over 18% higher data scanning accuracy.",
      sentiment: "Positive",
      likes: 156,
      commentsCount: 38,
      trendingTool: "Monospace UI Manual",
      sentimentScore: 85,
      reach: 11000
    },
    {
      id: "sub-2",
      network: "Substack",
      author: "Ecosystem Alpha Digest",
      handle: "ecosystemalpha.substack.com",
      avatar: "EA",
      timestamp: "3 hrs ago",
      text: "Weekly Round-up: Tracking Riyadh's $100B Al-alat tech allocation. The focus is shifting sharply toward sovereign physical manufacturing nodes and localized model optimization clusters. Startups without concrete MENA regional strategies are struggling.",
      sentiment: "Neutral",
      likes: 178,
      commentsCount: 21,
      trendingTool: "Regional Compute Hubs",
      sentimentScore: 55,
      reach: 14200
    },

    // Facebook
    {
      id: "fb-1",
      network: "Facebook",
      author: "Middle East Developers Network",
      handle: "MENA Software Alliance",
      avatar: "MA",
      timestamp: "1 hr ago",
      text: "Looking for recommendations! We are setting up a grounded RAG portal for Jordanian civil code lookup. Which vector database are you finding has the cleanest support for bilingual search weights? Testing Qdrant vs pgvector.",
      sentiment: "Neutral",
      likes: 124,
      commentsCount: 92,
      sentimentScore: 50,
      reach: 8400
    },
    {
      id: "fb-2",
      network: "Facebook",
      author: "Khaled Al-Harbi",
      handle: "Jeddah Tech Hub",
      avatar: "KH",
      timestamp: "5 hrs ago",
      text: "Incredible turnout at the Jeddah AI Hackathon this weekend! 150+ engineers building local model adapters. Proud of our team securing second place using a localized cuneiform script translation neural mesh. Talent here is exploding!",
      sentiment: "Positive",
      likes: 240,
      commentsCount: 45,
      sentimentScore: 97,
      reach: 13500
    },

    // Instagram
    {
      id: "inst-1",
      network: "Instagram",
      author: "Byblos Design Studio",
      handle: "@byblos.design",
      avatar: "BD",
      timestamp: "2 hrs ago",
      text: "Behind the scenes: Custom UI design system for sovereign financial desks. We paired 'Space Grotesk' headings with ultra-crisp 'JetBrains Mono' tables to optimize reading speeds for heavy real-time compliance pipelines. High contrast, low fatigue.",
      sentiment: "Positive",
      likes: 512,
      commentsCount: 22,
      sentimentScore: 92,
      reach: 22000
    },
    {
      id: "inst-2",
      network: "Instagram",
      author: "Tech Jordan Hub",
      handle: "@tech_jordan",
      avatar: "TJ",
      timestamp: "8 hrs ago",
      text: "Infographic of the week: The physical infrastructure of regional generative models. Mapping data centers in Abu Dhabi, Dubai, Amman, and Riyadh. Sovereign AI is not just software - it is physical server arrays, fiber loops, and massive clean-energy setups.",
      sentiment: "Positive",
      likes: 418,
      commentsCount: 31,
      sentimentScore: 89,
      reach: 21500
    }
  ]);

  // Simulated emerging keywords tracking
  const [trends, setTrends] = useState<TrendKeyword[]>([
    { keyword: "Sovereign AI", count: 420, growth: 124, status: "SURGING", category: "Model Tech" },
    { keyword: "Arabic LLM", count: 310, growth: 88, status: "SURGING", category: "Model Tech" },
    { keyword: "Graph RAG", count: 280, growth: 64, status: "SURGING", category: "RAG & DB" },
    { keyword: "Riyadh Compute Nodes", count: 195, growth: 45, status: "STEADY", category: "Infrastructure" },
    { keyword: "Offline Quantization", count: 150, growth: 32, status: "STEADY", category: "Infrastructure" },
    { keyword: "Custom Adapters", count: 98, growth: -5, status: "COOLING", category: "Regional Venture" }
  ]);

  // Hourly sentiment history for charts
  const chartData = useMemo(() => {
    return [
      { time: "08:00", X: 82, LinkedIn: 85, Substack: 70, Facebook: 65, Instagram: 75 },
      { time: "10:00", X: 75, LinkedIn: 88, Substack: 74, Facebook: 68, Instagram: 80 },
      { time: "12:00", X: 89, LinkedIn: 91, Substack: 82, Facebook: 72, Instagram: 83 },
      { time: "14:00", X: 64, LinkedIn: 84, Substack: 79, Facebook: 70, Instagram: 85 },
      { time: "16:00", X: 81, LinkedIn: 89, Substack: 85, Facebook: 75, Instagram: 88 },
      { time: "18:00", X: 90, LinkedIn: 92, Substack: 88, Facebook: 78, Instagram: 91 }
    ];
  }, []);

  // Set up periodic simulated ingestion
  useEffect(() => {
    if (!autoIngestActive) return;

    const interval = setInterval(() => {
      const networks: Array<SocialPost["network"]> = ["X", "LinkedIn", "Substack", "Facebook", "Instagram"];
      const randomNet = networks[Math.floor(Math.random() * networks.length)];
      
      const names = ["Ahmad Al-Raji", "Samer Haddad", "Amira Mansour", "Tech Catalyst MENA", "Nile Vector Group"];
      const handles = ["@alraji_ai", "@samer_h", "@amiram_tech", "@catalyst_mena", "@nile_vector"];
      const contents = [
        "Just finalized benchmark evaluation for regional multi-agent task loops. Latency dropped by 45% using native model layers! #SovereignAI",
        "Significant venture deployment targeting Jordanian health tech grounding pipelines. Real value over superficial wrappers.",
        "Experiencing issues with multi-bilingual token synchronization on standard cloud vector stores. Transitioning to self-hosted database clusters.",
        "Deep tracking of Riyadh's latest hardware allocations. Local compute capability is expanding exponentially.",
        "Excited to support regional neural translation modules. High fidelity Arabic legal transcripts now live."
      ];
      const tools = ["VectorSync v2", "DeepArabic-7B", "LocalRAG-Mesh", "Sovereign-Edge-3", "Cairo-Embedder"];
      const idx = Math.floor(Math.random() * names.length);
      const isPositive = Math.random() > 0.25;
      const score = isPositive ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40) + 10;

      const newPost: SocialPost = {
        id: `auto-${Date.now()}`,
        network: randomNet,
        author: names[idx],
        handle: randomNet === "X" ? handles[idx] : `Ecosystem Practitioner ${idx + 1}`,
        avatar: names[idx].split(" ").map(n => n[0]).join(""),
        timestamp: "Just now",
        text: contents[Math.floor(Math.random() * contents.length)],
        sentiment: score > 70 ? "Positive" : score < 40 ? "Negative" : "Neutral",
        likes: Math.floor(Math.random() * 80) + 10,
        commentsCount: Math.floor(Math.random() * 30) + 2,
        trendingTool: Math.random() > 0.4 ? tools[Math.floor(Math.random() * tools.length)] : undefined,
        sentimentScore: score,
        reach: Math.floor(Math.random() * 15000) + 2000
      };

      // Also randomly boost trend keyword counts slightly
      setTrends(prev => prev.map(t => {
        if (Math.random() > 0.7) {
          const added = Math.floor(Math.random() * 5) + 1;
          return { ...t, count: t.count + added, growth: t.growth + Math.floor(Math.random() * 3) };
        }
        return t;
      }));

      setPosts(prev => [newPost, ...prev]);
    }, 9000);

    return () => clearInterval(interval);
  }, [autoIngestActive]);

  const handleRefresh = () => {
    setActiveRefresh(true);
    setTimeout(() => {
      setActiveRefresh(false);
      // Insert one high impact signal manual trigger
      const manualPost: SocialPost = {
        id: `manual-${Date.now()}`,
        network: "X",
        author: "Sovereign Labs Global",
        handle: "@sovereign_global",
        avatar: "SL",
        timestamp: "Just now",
        text: "🚨 BREAKING: Announcing certified open-source weights for Riyadh-M4 legal intelligence matrix. Full context safety constraints baked natively into system instructions. Standard-setting performance for enterprise compliance benchmarks. #ArabicLLM",
        sentiment: "Positive",
        likes: 1240,
        commentsCount: 215,
        trendingTool: "Riyadh-M4-Weights",
        sentimentScore: 98,
        reach: 85000
      };
      setPosts(prev => [manualPost, ...prev]);
    }, 1200);
  };

  const handleDraftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftAuthor.trim() || !draftText.trim()) return;

    const score = draftSentiment === "Positive" ? 90 : draftSentiment === "Negative" ? 20 : 50;
    const newDraft: SocialPost = {
      id: `draft-${Date.now()}`,
      network: draftNetwork,
      author: draftAuthor,
      handle: draftNetwork === "X" ? `@${draftAuthor.toLowerCase().replace(/\s+/g, "")}` : "Sovereign Operator",
      avatar: draftAuthor.split(" ").map(n => n[0]).join(""),
      timestamp: "Just now",
      text: draftText,
      sentiment: draftSentiment,
      likes: 12,
      commentsCount: 1,
      sentimentScore: score,
      reach: 3400
    };

    setPosts(prev => [newDraft, ...prev]);
    setDraftAuthor("");
    setDraftText("");
    setShowDraftForm(false);
  };

  // Filter posts based on user search, sentiment, and active network filter
  const filteredPosts = useMemo(() => {
    return posts.filter(item => {
      const matchSentiment = selectedSentiment === "ALL" || item.sentiment === selectedSentiment;
      const matchNetwork = activeNetworkFilter === "ALL" || item.network === activeNetworkFilter;
      const matchSearch = searchQuery === "" ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.trendingTool && item.trendingTool.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSentiment && matchNetwork && matchSearch;
    });
  }, [posts, selectedSentiment, activeNetworkFilter, searchQuery]);

  // Aggregate stats
  const postStats = useMemo(() => {
    const total = posts.length;
    const positive = posts.filter(p => p.sentiment === "Positive").length;
    const neutral = posts.filter(p => p.sentiment === "Neutral").length;
    const negative = posts.filter(p => p.sentiment === "Negative").length;
    const avgScore = Math.round(posts.reduce((sum, p) => sum + p.sentimentScore, 0) / (total || 1));
    const totalReach = posts.reduce((sum, p) => sum + p.reach, 0);

    return {
      total,
      avgScore,
      totalReach,
      positivePercent: total > 0 ? Math.round((positive / total) * 100) : 0,
      neutralPercent: total > 0 ? Math.round((neutral / total) * 100) : 0,
      negativePercent: total > 0 ? Math.round((negative / total) * 100) : 0,
    };
  }, [posts]);

  // Get filtered column posts helper
  const getNetworkPosts = (net: SocialPost["network"]) => {
    return filteredPosts.filter(p => p.network === net);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050505] text-zinc-300 font-mono select-none">
      
      {/* Upper Status Ribbon */}
      <div className="bg-[#0c0c0e] border-b border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between gap-4 shrink-0 text-[10px]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse"></span>
          <span className="text-zinc-400 font-black tracking-widest uppercase">REAL-TIME SOCIAL FEED AGGREGATOR</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-500">
          <div>INGESTION ENGINE: <span className="text-zinc-300 font-bold">ACTIVE (5 CORE CHANNELS)</span></div>
          <div>SCAN INTERVAL: <span className="text-zinc-300 font-bold">9000MS</span></div>
          <div className="flex items-center gap-1.5">
            <span>AUTO-STREAM</span>
            <button 
              onClick={() => setAutoIngestActive(!autoIngestActive)}
              className={`w-8 h-4 rounded-full relative transition-colors ${autoIngestActive ? "bg-[#00ff66]" : "bg-zinc-800"}`}
            >
              <span className={`absolute top-0.5 w-3 h-3 bg-black transition-all ${autoIngestActive ? "right-0.5" : "left-0.5"}`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel Header & Intro */}
      <div className="p-4 sm:p-6 border-b border-zinc-800 bg-gradient-to-b from-[#09090b] to-[#050505] shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 font-bold tracking-widest uppercase">COGNITIVE PULSE LAYER</span>
              <span className="text-[10px] bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 px-2 py-0.5 font-bold uppercase flex items-center gap-1">
                <Globe size={10} /> MULTI-CHANNEL INTEGRATION
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2 uppercase">
              <TrendingUp size={20} className="text-[#00ff66]" />
              SOCIAL INTELLIGENCE PORTAL
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-4xl font-sans leading-relaxed">
              Synthesizing real-time discussion maps, product adoption feedback, and technical confidence scores from <strong>LinkedIn, X (Twitter), Substack, Facebook, and Instagram</strong>. Powered by localized language models tracking regional sovereign investment ecosystems.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={activeRefresh}
              className="px-3 py-2 border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-600 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
            >
              <RefreshCw size={12} className={activeRefresh ? "animate-spin text-[#00ff66]" : ""} />
              {activeRefresh ? "SYNCING..." : "SYNC FEEDS"}
            </button>
            
            <button
              onClick={() => setShowDraftForm(!showDraftForm)}
              className="px-3 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus size={14} /> DRAFT INTEL SIGNAL
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Analytical Indicators Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border-b border-zinc-800 bg-[#09090b] shrink-0">
        
        {/* Metric 1: Sentiment Health */}
        <div className="lg:col-span-3 bg-black/40 border border-zinc-800 p-3 flex flex-col justify-between">
          <div>
            <span className="text-[8px] font-black text-zinc-500 block uppercase tracking-wider">SYSTEM COGNITIVE STATUS</span>
            <span className="text-lg font-black text-white uppercase flex items-center gap-1 mt-1">
              <Sparkles size={14} className="text-[#00ff66]" /> 
              {postStats.avgScore > 70 ? "HIGH CONFIDENCE" : postStats.avgScore > 50 ? "STABLE SIGNAL" : "CAUTIOUS WATCH"}
            </span>
            <div className="text-[10px] text-zinc-400 mt-1 font-sans">
              Average Sentiment Score: <strong className="text-white font-mono">{postStats.avgScore}/100</strong>
            </div>
          </div>
          <div className="mt-3 flex gap-2 items-center">
            <div className="flex-grow bg-zinc-900 h-1.5 flex overflow-hidden">
              <div className="bg-[#00ff66] h-full" style={{ width: `${postStats.positivePercent}%` }} title={`Positive: ${postStats.positivePercent}%`}></div>
              <div className="bg-zinc-500 h-full" style={{ width: `${postStats.neutralPercent}%` }} title={`Neutral: ${postStats.neutralPercent}%`}></div>
              <div className="bg-red-500 h-full" style={{ width: `${postStats.negativePercent}%` }} title={`Negative: ${postStats.negativePercent}%`}></div>
            </div>
            <span className="text-[10px] font-bold text-white shrink-0">{postStats.positivePercent}% Pos</span>
          </div>
        </div>

        {/* Metric 2: Trends Radar */}
        <div className="lg:col-span-4 bg-black/40 border border-zinc-800 p-3">
          <span className="text-[8px] font-black text-zinc-500 block uppercase tracking-wider mb-2">SURGING CONVERSATIONAL SIGNALS</span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[9px] font-bold">
            {trends.slice(0, 4).map((t, idx) => (
              <div key={idx} className="flex justify-between items-center bg-zinc-900/60 p-1 border border-zinc-800/40">
                <span className="text-zinc-300 truncate mr-1">#{t.keyword.replace(/\s+/g, "")}</span>
                <span className="text-[#00ff66] shrink-0 font-mono text-[8px] flex items-center gap-0.5">
                  <ArrowUpRight size={8} />+{t.growth}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Metric 3: Graph / Trend Chart */}
        <div className="lg:col-span-5 bg-black/40 border border-zinc-800 p-2 h-[85px] flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center text-[8px] font-black text-zinc-500 tracking-wider">
            <span>UNIFIED EMERGENCE INDEX (HOURLY)</span>
            <span className="text-zinc-400">CHANNELS RESPONSE LEVEL</span>
          </div>
          <div className="w-full h-[60px] mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 2, right: 2, left: -25, bottom: 2 }}>
                <defs>
                  <linearGradient id="colorX" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff66" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00ff66" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#4a4a4a" fontSize={7} />
                <YAxis stroke="#4a4a4a" fontSize={7} domain={[40, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "8px", fontFamily: "monospace" }} 
                  itemStyle={{ color: "#ffffff" }}
                />
                <Area type="monotone" dataKey="X" stroke="#00ff66" strokeWidth={1} fillOpacity={1} fill="url(#colorX)" name="X Sentiment" />
                <Area type="monotone" dataKey="LinkedIn" stroke="#3b82f6" strokeWidth={1} fillOpacity={0} name="LinkedIn" />
                <Area type="monotone" dataKey="Substack" stroke="#f97316" strokeWidth={1} fillOpacity={0} name="Substack" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Inline Multi-Channel Filters toolbar */}
      <div className="px-4 py-2.5 border-b border-zinc-800 bg-[#050505] shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        
        {/* Left Side: Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="text-zinc-500 font-bold uppercase text-[9px] mr-1 flex items-center gap-1">
            <Filter size={11} /> FILTER BY CHANNEL:
          </span>
          <CustomTooltip position="top" content="Synthesized aggregator of active web streams across all channels">
            <button
              onClick={() => setActiveNetworkFilter("ALL")}
              className={`px-2.5 py-0.5 border text-[9px] font-bold tracking-tight uppercase cursor-pointer transition-all ${
                activeNetworkFilter === "ALL" 
                  ? "bg-white text-black border-white" 
                  : "border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              ALL FEEDS
            </button>
          </CustomTooltip>

          <CustomTooltip position="top" content="Professional research updates, executive summaries, and academic announcements">
            <button
              onClick={() => setActiveNetworkFilter("LinkedIn")}
              className={`px-2.5 py-0.5 border text-[9px] font-bold tracking-tight uppercase cursor-pointer transition-all ${
                activeNetworkFilter === "LinkedIn" 
                  ? "bg-[#3b82f6] text-white border-[#3b82f6]" 
                  : "border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              LinkedIn
            </button>
          </CustomTooltip>

          <CustomTooltip position="top" content="High-frequency sentiment trends, real-time developer releases, and tech debates">
            <button
              onClick={() => setActiveNetworkFilter("X")}
              className={`px-2.5 py-0.5 border text-[9px] font-bold tracking-tight uppercase cursor-pointer transition-all ${
                activeNetworkFilter === "X" 
                  ? "bg-zinc-800 text-white border-zinc-700" 
                  : "border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              X / Twitter
            </button>
          </CustomTooltip>

          <CustomTooltip position="top" content="In-depth analysis newsletters, specialized code walk-throughs, and long-form journals">
            <button
              onClick={() => setActiveNetworkFilter("Substack")}
              className={`px-2.5 py-0.5 border text-[9px] font-bold tracking-tight uppercase cursor-pointer transition-all ${
                activeNetworkFilter === "Substack" 
                  ? "bg-[#f97316] text-white border-[#f97316]" 
                  : "border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              Substack
            </button>
          </CustomTooltip>

          <CustomTooltip position="top" content="Regional community projects, local meetups, and open-source foundation announcements">
            <button
              onClick={() => setActiveNetworkFilter("Facebook")}
              className={`px-2.5 py-0.5 border text-[9px] font-bold tracking-tight uppercase cursor-pointer transition-all ${
                activeNetworkFilter === "Facebook" 
                  ? "bg-[#1877f2] text-white border-[#1877f2]" 
                  : "border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              Facebook
            </button>
          </CustomTooltip>

          <CustomTooltip position="top" content="UI/UX mockup portfolios, visual prototype diagrams, and tech infographics">
            <button
              onClick={() => setActiveNetworkFilter("Instagram")}
              className={`px-2.5 py-0.5 border text-[9px] font-bold tracking-tight uppercase cursor-pointer transition-all ${
                activeNetworkFilter === "Instagram" 
                  ? "bg-pink-600 text-white border-pink-600" 
                  : "border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              Instagram
            </button>
          </CustomTooltip>
        </div>

        {/* Right Side: Sentiment Selector & Search */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          
          {/* Sentiment Selection */}
          <div className="flex items-center border border-zinc-800 bg-[#0c0c0e]">
            <button
              onClick={() => setSelectedSentiment("ALL")}
              className={`px-2 py-1 text-[9px] font-bold border-r border-zinc-800 ${
                selectedSentiment === "ALL" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setSelectedSentiment("Positive")}
              className={`px-2 py-1 text-[9px] font-bold border-r border-zinc-800 ${
                selectedSentiment === "Positive" ? "bg-green-950 text-[#00ff66]" : "text-zinc-500 hover:text-white"
              }`}
            >
              POS
            </button>
            <button
              onClick={() => setSelectedSentiment("Neutral")}
              className={`px-2 py-1 text-[9px] font-bold border-r border-zinc-800 ${
                selectedSentiment === "Neutral" ? "bg-zinc-900 text-zinc-300" : "text-zinc-500 hover:text-white"
              }`}
            >
              NEU
            </button>
            <button
              onClick={() => setSelectedSentiment("Negative")}
              className={`px-2 py-1 text-[9px] font-bold ${
                selectedSentiment === "Negative" ? "bg-red-950 text-red-400" : "text-zinc-500 hover:text-white"
              }`}
            >
              NEG
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-44">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keyword filter..."
              className="w-full bg-[#0c0c0e] border border-zinc-800 pl-7 pr-3 py-1 text-[10px] focus:outline-none focus:border-[#00ff66] text-white"
            />
            <Search className="absolute left-2 top-2.5 text-zinc-500 size-3" />
          </div>

        </div>

      </div>

      {/* Main Multi-Column Stream Layout */}
      <div className="flex-grow overflow-x-auto overflow-y-hidden bg-[#030304] scrollbar-custom">
        <div className="flex h-full min-w-[1300px] divide-x divide-zinc-800/80">
          
          {/* Column 1: LinkedIn */}
          <div className="flex-1 min-w-[260px] flex flex-col h-full bg-[#050506]/30">
            <div className="p-3 bg-[#0c0c0e]/90 border-b border-zinc-800 font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Linkedin size={13} className="fill-blue-400 text-blue-400" /> LINKEDIN INTEL
              </span>
              <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-none font-bold text-[8px] font-mono">
                {getNetworkPosts("LinkedIn").length} SIGNALS
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-2.5 space-y-3 scrollbar-custom">
              {renderPostColumn(getNetworkPosts("LinkedIn"))}
            </div>
          </div>

          {/* Column 2: X (Twitter) */}
          <div className="flex-1 min-w-[260px] flex flex-col h-full bg-[#050506]/30">
            <div className="p-3 bg-[#0c0c0e]/90 border-b border-zinc-800 font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 text-white">
                <Twitter size={13} className="fill-white text-white" /> X / TWITTER FEED
              </span>
              <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-none font-bold text-[8px] font-mono">
                {getNetworkPosts("X").length} SIGNALS
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-2.5 space-y-3 scrollbar-custom">
              {renderPostColumn(getNetworkPosts("X"))}
            </div>
          </div>

          {/* Column 3: Substack */}
          <div className="flex-1 min-w-[260px] flex flex-col h-full bg-[#050506]/30">
            <div className="p-3 bg-[#0c0c0e]/90 border-b border-zinc-800 font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 text-orange-400">
                <BookOpen size={13} className="text-orange-400" /> SUBSTACK BRIEFS
              </span>
              <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-none font-bold text-[8px] font-mono">
                {getNetworkPosts("Substack").length} SIGNALS
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-2.5 space-y-3 scrollbar-custom">
              {renderPostColumn(getNetworkPosts("Substack"))}
            </div>
          </div>

          {/* Column 4: Facebook */}
          <div className="flex-1 min-w-[260px] flex flex-col h-full bg-[#050506]/30">
            <div className="p-3 bg-[#0c0c0e]/90 border-b border-zinc-800 font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 text-blue-500">
                <Facebook size={13} className="fill-blue-500 text-blue-500" /> FACEBOOK MATRIX
              </span>
              <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-none font-bold text-[8px] font-mono">
                {getNetworkPosts("Facebook").length} SIGNALS
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-2.5 space-y-3 scrollbar-custom">
              {renderPostColumn(getNetworkPosts("Facebook"))}
            </div>
          </div>

          {/* Column 5: Instagram */}
          <div className="flex-1 min-w-[260px] flex flex-col h-full bg-[#050506]/30">
            <div className="p-3 bg-[#0c0c0e]/90 border-b border-zinc-800 font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5 text-pink-500">
                <Instagram size={13} className="text-pink-500" /> INSTAGRAM MONITOR
              </span>
              <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-none font-bold text-[8px] font-mono">
                {getNetworkPosts("Instagram").length} SIGNALS
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-2.5 space-y-3 scrollbar-custom">
              {renderPostColumn(getNetworkPosts("Instagram"))}
            </div>
          </div>

        </div>
      </div>

      {/* Draft Custom Intel Modal */}
      {showDraftForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09090b] border border-zinc-800 max-w-md w-full p-6 space-y-4 text-xs text-zinc-300 font-mono">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
              <span className="font-black uppercase text-[11px] text-white flex items-center gap-1.5">
                <Plus size={14} className="text-[#00ff66]" /> DRAFT SOCIAL COGNITIVE SIGNAL
              </span>
              <button 
                onClick={() => setShowDraftForm(false)}
                className="text-red-400 hover:text-red-300 font-bold text-[10px] cursor-pointer"
              >
                [CLOSE]
              </button>
            </div>

            <form onSubmit={handleDraftSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold uppercase block mb-1">Target Channel</label>
                  <select
                    value={draftNetwork}
                    onChange={(e) => setDraftNetwork(e.target.value as any)}
                    className="w-full bg-[#050505] border border-zinc-800 p-1.5 focus:outline-none focus:border-[#00ff66] text-[10px] text-white"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X">X (Twitter)</option>
                    <option value="Substack">Substack</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="text-[8px] text-zinc-500 font-bold uppercase block mb-1">Author Entity</label>
                  <input
                    type="text"
                    required
                    value={draftAuthor}
                    onChange={(e) => setDraftAuthor(e.target.value)}
                    placeholder="e.g. Salim K."
                    className="w-full bg-[#050505] border border-zinc-800 p-1.5 focus:outline-none focus:border-[#00ff66] text-[10px] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[8px] text-zinc-500 font-bold uppercase block mb-1">Raw Discussion Transcript</label>
                <textarea
                  required
                  rows={4}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Insert post copy, community thread discussion, or technical feedback vectors..."
                  className="w-full bg-[#050505] border border-zinc-800 p-1.5 focus:outline-none focus:border-[#00ff66] text-[10px] text-white resize-none"
                />
              </div>

              <div>
                <label className="text-[8px] text-zinc-500 font-bold uppercase block mb-1">Subjective Sentiment Class</label>
                <select
                  value={draftSentiment}
                  onChange={(e) => setDraftSentiment(e.target.value as any)}
                  className="w-full bg-[#050505] border border-zinc-800 p-1.5 focus:outline-none focus:border-[#00ff66] text-[10px] text-white"
                >
                  <option value="Positive">Positive Confidence</option>
                  <option value="Neutral">Neutral / Inquiry</option>
                  <option value="Negative">Negative / Security Risk</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-white text-black font-bold uppercase hover:bg-zinc-200 cursor-pointer text-[10px] transition-all"
              >
                COMMIT SIGNAL VECTOR TO LIVE DECK
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Post Detail Inspector Modal */}
      {showDetailPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#09090b] border border-zinc-800 max-w-lg w-full p-6 space-y-4 text-xs text-zinc-300 font-mono">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2.5">
              <span className="font-black uppercase text-[11px] text-[#00ff66] flex items-center gap-1.5">
                <Maximize2 size={13} /> DEEP SIGNAL AUDIT REPORT
              </span>
              <button 
                onClick={() => setShowDetailPost(null)}
                className="text-red-400 hover:text-red-300 font-bold text-[10px] cursor-pointer"
              >
                [DISMISS]
              </button>
            </div>

            {/* Core Content */}
            <div className="p-3 bg-black/50 border border-zinc-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#00ff66] uppercase font-bold">{showDetailPost.network} SOURCE INTEGRATION</span>
                <span className="text-zinc-500">{showDetailPost.timestamp}</span>
              </div>
              <div className="font-bold text-white uppercase text-[12px]">{showDetailPost.author} ({showDetailPost.handle})</div>
              <p className="text-[11px] text-zinc-200 font-sans leading-relaxed pt-1 border-t border-zinc-900">
                {showDetailPost.text}
              </p>
            </div>

            {/* Simulated NLP Metadata */}
            <div className="space-y-2.5">
              <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-widest">SENTIMENT EXTRACTS & META ENTITIES</span>
              
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="bg-zinc-900/60 p-2 border border-zinc-800/60">
                  <span className="text-zinc-500 block uppercase text-[8px]">Sentiment Score</span>
                  <span className="text-white font-black text-lg">{showDetailPost.sentimentScore}/100</span>
                  <span className="text-zinc-400 block text-[8px] mt-0.5">Confidence Vector Weight</span>
                </div>

                <div className="bg-zinc-900/60 p-2 border border-zinc-800/60">
                  <span className="text-zinc-500 block uppercase text-[8px]">Classified Level</span>
                  <span className={`font-black text-lg block ${
                    showDetailPost.sentiment === "Positive" ? "text-[#00ff66]" :
                    showDetailPost.sentiment === "Negative" ? "text-red-400" : "text-zinc-400"
                  }`}>{showDetailPost.sentiment.toUpperCase()}</span>
                  <span className="text-zinc-400 block text-[8px] mt-0.5">Calculated Threshold Mode</span>
                </div>

                <div className="bg-zinc-900/60 p-2 border border-zinc-800/60">
                  <span className="text-zinc-500 block uppercase text-[8px]">Organic Reach Level</span>
                  <span className="text-white font-black text-[12px]">{showDetailPost.reach.toLocaleString()} views</span>
                  <span className="text-zinc-400 block text-[8px] mt-0.5">Estimated impression index</span>
                </div>

                <div className="bg-zinc-900/60 p-2 border border-zinc-800/60">
                  <span className="text-zinc-500 block uppercase text-[8px]">Associated Tech Stack</span>
                  <span className="text-[#00ff66] font-black text-[11px] block truncate">{showDetailPost.trendingTool || "NONE SPECIFIED"}</span>
                  <span className="text-zinc-400 block text-[8px] mt-0.5">Parsed entity tag</span>
                </div>
              </div>

              {/* Advanced Indicators */}
              <div className="bg-[#050505] p-3 border border-zinc-800 text-[9.5px] text-zinc-400 leading-normal space-y-1">
                <div>• <strong className="text-zinc-300">Toxicity Score:</strong> 0.02 (Extremely Clean)</div>
                <div>• <strong className="text-zinc-300">Linguistic Tone:</strong> Professional, high technical depth, ecosystem builder perspective</div>
                <div>• <strong className="text-zinc-300">Intent Mapping:</strong> Advocacy, tool validation, regional deployment update</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert("Signal pinned to active Research Clipboard!");
                  setShowDetailPost(null);
                }}
                className="flex-1 py-1.5 bg-[#00ff66]/10 border border-[#00ff66]/40 text-[#00ff66] uppercase font-bold text-[9px] hover:bg-[#00ff66]/20 transition-all cursor-pointer"
              >
                PIN SIGNAL TO CLIENT CLIPPINGS
              </button>
              <button
                onClick={() => setShowDetailPost(null)}
                className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase font-bold text-[9px] hover:text-white transition-all cursor-pointer"
              >
                DISMISS
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

  function renderPostColumn(items: SocialPost[]) {
    if (items.length === 0) {
      return (
        <div className="py-16 text-center text-zinc-600 font-mono text-[9px] uppercase border border-dashed border-zinc-900/60 p-4">
          <Activity size={18} className="mx-auto mb-2 text-zinc-700 animate-pulse" />
          No matching signal streams found.
        </div>
      );
    }

    return items.map(post => (
      <div
        key={post.id}
        className="bg-[#09090b] border border-zinc-800 hover:border-[#00ff66]/40 p-3.5 space-y-3.5 transition-all flex flex-col justify-between rounded-none group relative"
      >
        {/* Post Meta / Header */}
        <div className="flex justify-between items-start gap-2 border-b border-zinc-900 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-none bg-zinc-800 text-white flex items-center justify-center font-extrabold text-[9px] shrink-0 border border-zinc-700">
              {post.avatar}
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-white text-[10px] block truncate uppercase tracking-tight">{post.author}</span>
              <span className="text-[8px] text-zinc-500 block truncate font-mono">{post.handle}</span>
            </div>
          </div>

          <span className="text-[8px] text-zinc-500 shrink-0 font-bold uppercase">{post.timestamp}</span>
        </div>

        {/* Content Body */}
        <p className="text-[10px] leading-relaxed text-zinc-300 font-sans break-words whitespace-pre-wrap">
          {post.text}
        </p>

        {/* Dynamic Tool tag parsed */}
        {post.trendingTool && (
          <div className="flex items-center gap-1 text-[8px] bg-zinc-900/80 text-[#00ff66] border border-zinc-800 px-2 py-0.5 w-max font-bold uppercase font-mono tracking-tight">
            <Sparkles size={9} className="text-[#00ff66]" /> TOOL: {post.trendingTool}
          </div>
        )}

        {/* Footer info: Sentiment indicator + Upvotes + Comments + Inspect button */}
        <div className="flex justify-between items-center pt-2.5 border-t border-zinc-900 text-[8.5px] font-mono text-zinc-500">
          
          {/* Custom Sentiment Badges */}
          <span className={`text-[8px] font-black border px-1.5 py-0.5 uppercase ${
            post.sentiment === "Positive" ? "bg-green-950/40 border-green-800/60 text-[#00ff66]" :
            post.sentiment === "Neutral" ? "bg-zinc-900/60 border-zinc-800/60 text-zinc-400" :
            "bg-red-950/40 border-red-900/60 text-red-400"
          }`}>
            {post.sentiment}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
              }}
              className="hover:text-white flex items-center gap-0.5 font-bold cursor-pointer active:scale-95 transition-all text-zinc-500"
              title="Like Signal"
            >
              <Heart size={9} className="text-zinc-500 group-hover:text-red-400 transition-colors" /> {post.likes}
            </button>
            
            <span className="flex items-center gap-0.5 font-bold text-zinc-500" title="Comments count">
              <MessageSquare size={9} /> {post.commentsCount}
            </span>

            <button
              onClick={() => setShowDetailPost(post)}
              className="hover:text-[#00ff66] text-zinc-500 flex items-center gap-0.5 font-bold cursor-pointer ml-1 p-0.5 hover:bg-zinc-900"
              title="Deep Inspect"
            >
              <Maximize2 size={9} />
            </button>
          </div>
        </div>

      </div>
    ));
  }
};
