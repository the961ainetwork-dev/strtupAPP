import React, { useState, useMemo } from "react";
import { Search, Twitter, Linkedin, BookOpen, Facebook, Instagram, MessageSquare, Heart, RefreshCw, Send, Plus, HelpCircle, TrendingUp, Sparkles, Filter } from "lucide-react";

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
  sourceLink?: string;
}

export const SocialSentimentDeck: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState("ALL");
  const [activeRefresh, setActiveRefresh] = useState(false);
  
  // Custom draft post form
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [draftNetwork, setDraftNetwork] = useState<SocialPost["network"]>("X");
  const [draftAuthor, setDraftAuthor] = useState("");
  const [draftText, setDraftText] = useState("");
  const [draftSentiment, setDraftSentiment] = useState<SocialPost["sentiment"]>("Positive");

  const [posts, setPosts] = useState<SocialPost[]>([
    // LinkedIn Column Posts
    {
      id: "li-1",
      network: "LinkedIn",
      author: "Tariq Al-Mansoori",
      handle: "VP of Sovereign Compute @ Dubai Cloud",
      avatar: "TM",
      timestamp: "12 mins ago",
      text: "Outstanding progress with our localized multi-agent sovereign node trials this quarter! Successfully isolated over 12,000 document embedding arrays across strict geographical boundaries. Enterprise partners reporting 99.4% recall accuracy with zero global data leakage. Highly bullish on region-specific LLMs. #SovereignAI #DubaiTech",
      sentiment: "Positive",
      likes: 312,
      commentsCount: 45,
      trendingTool: "MENA-Sovereign-Cloud"
    },
    {
      id: "li-2",
      network: "LinkedIn",
      author: "Reem Al-Otaibi",
      handle: "AI Venture Lead @ Riyadh Capital",
      avatar: "RO",
      timestamp: "1 hr ago",
      text: "We are tracking a noticeable consolidation in seed multiples for general conversational wrappers. However, specialized deep-tech models with real Arabic fine-tunings and document-level grounding are commanding premium valuations. Relational and graph RAG is where the real value is being captured right now in the Gulf.",
      sentiment: "Positive",
      likes: 245,
      commentsCount: 28,
      trendingTool: "Graph-RAG-Pro"
    },
    {
      id: "li-3",
      network: "LinkedIn",
      author: "Marcus Vance",
      handle: "Independent Enterprise Auditor",
      avatar: "MV",
      timestamp: "1 day ago",
      text: "Unpopular opinion: Many corporations deploying RAG systems are completely ignoring inverse-vector prompt reconstruction threats. Standard system boundaries can be easily bypassed. We need immediate, robust local audit modules before deploying internal legal pipelines.",
      sentiment: "Negative",
      likes: 120,
      commentsCount: 52
    },

    // X (Twitter) Column Posts
    {
      id: "x-1",
      network: "X",
      author: "AI Developer Flash",
      handle: "@aidev_flash",
      avatar: "DF",
      timestamp: "5 mins ago",
      text: "Vite + React 18 remains the absolute gold standard for client-side multi-agent interfaces. The responsiveness when mounting direct WebRTC audio streams is unmatched. Say goodbye to heavy backend server rendering for quick user dashboards! 🚀⚡",
      sentiment: "Positive",
      likes: 540,
      commentsCount: 89,
      trendingTool: "Vite + WebRTC Streams"
    },
    {
      id: "x-2",
      network: "X",
      author: "Hana Code",
      handle: "@hana_codes_ai",
      avatar: "HC",
      timestamp: "45 mins ago",
      text: "Trying to index 10,000 page legal PDFs with general vector scrapers is a complete nightmare. Context limits are real and chunks get fragmented horribly. We need better layout-aware parsers that respect tables and page markers! 📑",
      sentiment: "Negative",
      likes: 210,
      commentsCount: 42,
      trendingTool: "Layout-Aware Parser"
    },
    {
      id: "x-3",
      network: "X",
      author: "Sovereign AI Press",
      handle: "@sovereign_intel",
      avatar: "SI",
      timestamp: "2 hrs ago",
      text: "Benchmark tests show local 4-bit Llama-4-Lite quantizations beating cloud-based commercial models in speed for direct technical summaries. Absolute game changer for offline client workloads. 💻⚙️",
      sentiment: "Positive",
      likes: 389,
      commentsCount: 15
    },

    // Substack Column Posts
    {
      id: "sub-1",
      network: "Substack",
      author: "The Cognitive Scrape",
      handle: "cognitivescrape.substack.com",
      avatar: "CS",
      timestamp: "3 hrs ago",
      text: "Deep-Dive Essay: 'Why Monospace Layouts Prevent Cognitive Fatigue'. In this issue we explore empirical testing results from visual cognition centers showing why high-contrast, uncluttered monospace boards yield over 18% higher data scanning accuracy compared to default card grids.",
      sentiment: "Positive",
      likes: 85,
      commentsCount: 19,
      trendingTool: "Monospace UI Manual"
    },
    {
      id: "sub-2",
      network: "Substack",
      author: "Ecosystem Alpha Digest",
      handle: "ecosystemalpha.substack.com",
      avatar: "EA",
      timestamp: "5 hrs ago",
      text: "Weekly Round-up: Tracking Riyadh's $100B Al-alat tech allocation. The focus is shifting sharply toward sovereign physical manufacturing nodes and localized model optimization clusters. Startups without concrete MENA regional strategies are struggling to raise from sovereign wealth brackets.",
      sentiment: "Neutral",
      likes: 112,
      commentsCount: 8,
      trendingTool: "Regional Compute Hubs"
    },

    // Facebook Column Posts
    {
      id: "fb-1",
      network: "Facebook",
      author: "Middle East Developers Network",
      handle: "MENA Software Alliance",
      avatar: "MA",
      timestamp: "4 hrs ago",
      text: "Looking for recommendations! We are setting up a grounded RAG portal for Jordanian civil code lookup. Which vector database are you finding has the cleanest support for bilingual search weights? We are currently testing Qdrant vs pgvector. Any real production feedback is appreciated!",
      sentiment: "Neutral",
      likes: 95,
      commentsCount: 78
    },
    {
      id: "fb-2",
      network: "Facebook",
      author: "Khaled Al-Harbi",
      handle: "Jeddah Tech Hub",
      avatar: "KH",
      timestamp: "1 day ago",
      text: "Incredible turnout at the Jeddah AI Hackathon this weekend! 150+ engineers building local model adapters. Proud of our team securing second place using a localized cuneiform script translation neural mesh. The talent here is exploding!",
      sentiment: "Positive",
      likes: 180,
      commentsCount: 22
    },

    // Instagram Column Posts
    {
      id: "inst-1",
      network: "Instagram",
      author: "Byblos Design Studio",
      handle: "@byblos.design",
      avatar: "BD",
      timestamp: "2 hrs ago",
      text: "Behind the scenes: Custom UI design system for sovereign financial desks. We paired 'Space Grotesk' headings with ultra-crisp 'JetBrains Mono' tables to optimize reading speeds for heavy real-time compliance pipelines. High contrast, low fatigue. 🖤 Minimal design is the ultimate form of precision.",
      sentiment: "Positive",
      likes: 412,
      commentsCount: 11
    },
    {
      id: "inst-2",
      network: "Instagram",
      author: "Tech Jordan Hub",
      handle: "@tech_jordan",
      avatar: "TJ",
      timestamp: "1 day ago",
      text: "Infographic of the week: The physical infrastructure of regional generative models. Mapping data centers in Abu Dhabi, Dubai, Amman, and Riyadh. Sovereign AI is not just software - it is physical server arrays, fiber loops, and massive clean-energy setups. 🌐⚡",
      sentiment: "Positive",
      likes: 310,
      commentsCount: 16
    }
  ]);

  const handleRefresh = () => {
    setActiveRefresh(true);
    setTimeout(() => {
      setActiveRefresh(false);
      // Simulate real-time stream ingestion by adding a mock incoming sentiment alert
      const randomHandles = ["@gpt_tracker", "@gulf_deeptech", "@egyptian_coder", "@qatar_sandbox"];
      const randomAuthors = ["Majed Al-Ghamdi", "Amira El-Sayed", "Doha Sandbox Labs", "Bassem K."];
      const randomComments = [
        "Local model latency in Maadi dropped to 12ms over proxy protocols. Exceptional performance! #NileAI",
        "Exploring custom fine-tunes for Saudi real estate indexing. The potential is unlimited. 🇸🇦",
        "Sovereign data nodes are the only long-term defense against global hallucination servers.",
        "Just cloned the MENA-RAG repository. Configured local index in under 5 minutes!"
      ];
      const randomNetwork: SocialPost["network"][] = ["X", "LinkedIn", "Facebook", "Instagram", "Substack"];
      const randomIndex = Math.floor(Math.random() * randomHandles.length);

      const incomingPost: SocialPost = {
        id: `incoming-${Date.now()}`,
        network: randomNetwork[Math.floor(Math.random() * randomNetwork.length)],
        author: randomAuthors[randomIndex],
        handle: randomHandles[randomIndex],
        avatar: randomAuthors[randomIndex].split(" ").map(n => n[0]).join(""),
        timestamp: "Just now",
        text: randomComments[Math.floor(Math.random() * randomComments.length)],
        sentiment: Math.random() > 0.3 ? "Positive" : "Neutral",
        likes: Math.floor(Math.random() * 50) + 1,
        commentsCount: Math.floor(Math.random() * 10)
      };

      setPosts(prev => [incomingPost, ...prev]);
    }, 1500);
  };

  const handleDraftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftAuthor.trim() || !draftText.trim()) return;

    const newDraft: SocialPost = {
      id: `draft-${Date.now()}`,
      network: draftNetwork,
      author: draftAuthor,
      handle: draftNetwork === "X" ? `@${draftAuthor.toLowerCase().replace(/\s+/g, "")}` : "Ecosystem Operator",
      avatar: draftAuthor.split(" ").map(n => n[0]).join(""),
      timestamp: "Just now",
      text: draftText,
      sentiment: draftSentiment,
      likes: 1,
      commentsCount: 0
    };

    setPosts(prev => [newDraft, ...prev]);
    setDraftAuthor("");
    setDraftText("");
    setShowDraftForm(false);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(item => {
      const matchSentiment = selectedSentiment === "ALL" || item.sentiment === selectedSentiment;
      const matchSearch = searchQuery === "" ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.trendingTool && item.trendingTool.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSentiment && matchSearch;
    });
  }, [posts, selectedSentiment, searchQuery]);

  // Aggregate stats
  const postStats = useMemo(() => {
    const total = posts.length;
    const positive = posts.filter(p => p.sentiment === "Positive").length;
    const neutral = posts.filter(p => p.sentiment === "Neutral").length;
    const negative = posts.filter(p => p.sentiment === "Negative").length;
    return {
      positivePercent: total > 0 ? Math.round((positive / total) * 100) : 0,
      neutralPercent: total > 0 ? Math.round((neutral / total) * 100) : 0,
      negativePercent: total > 0 ? Math.round((negative / total) * 100) : 0,
    };
  }, [posts]);

  // Group columns helper
  const getNetworkPosts = (net: SocialPost["network"]) => {
    return filteredPosts.filter(p => p.network === net);
  };

  return (
    <div className="p-6 space-y-6 flex flex-col h-full overflow-hidden">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4 shrink-0">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-widest">MULTI-CHANNEL PULSE DECK</span>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <TrendingUp size={18} className="text-black" />
            SOCIAL MEDIA AI SENTIMENT DECK
          </h2>
          <p className="text-[11px] text-zinc-600 mt-1 max-w-2xl font-sans">
            Real-time visual monitoring dashboard modeled on TweetDeck. Extrapolates aggregated regional discussions, feedback vectors, and tool mentions across 5 key social channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={activeRefresh}
            className="px-3 py-2 border border-border bg-white text-black hover:border-black text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={activeRefresh ? "animate-spin" : ""} />
            {activeRefresh ? "SYNCING PULSE..." : "SYNC CHANNELS"}
          </button>
          
          <button
            onClick={() => setShowDraftForm(!showDraftForm)}
            className="px-3 py-2 bg-black text-white hover:bg-zinc-800 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> DRAFT INTEL
          </button>
        </div>
      </div>

      {/* Aggregate Indicators Tray */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface p-4 border border-border shrink-0">
        <div className="space-y-1 bg-white p-3 border border-border">
          <span className="text-[8px] font-black text-zinc-400 block uppercase">SYSTEM-WIDE COGNITIVE PULSE</span>
          <span className="text-base font-black text-green-700 uppercase flex items-center gap-1">
            <Sparkles size={14} /> OPTIMISTIC
          </span>
          <p className="text-[9.5px] text-zinc-500 font-sans leading-tight">Sentiment models output strong regional confidence indicators.</p>
        </div>

        <div className="space-y-1 bg-white p-3 border border-border">
          <span className="text-[8px] font-black text-zinc-400 block uppercase">AGGREGATED SENTIMENT SPREAD</span>
          <div className="flex gap-2 items-center pt-1">
            <div className="flex-1 bg-zinc-200 h-2 flex overflow-hidden">
              <div className="bg-green-600 h-full" style={{ width: `${postStats.positivePercent}%` }} title="Positive"></div>
              <div className="bg-zinc-400 h-full" style={{ width: `${postStats.neutralPercent}%` }} title="Neutral"></div>
              <div className="bg-red-500 h-full" style={{ width: `${postStats.negativePercent}%` }} title="Negative"></div>
            </div>
            <span className="text-[10px] font-bold text-black">{postStats.positivePercent}% Pos</span>
          </div>
        </div>

        <div className="space-y-1 bg-white p-3 border border-border">
          <span className="text-[8px] font-black text-zinc-400 block uppercase">TRENDING TOPICS & HASHTAGS</span>
          <div className="flex flex-wrap gap-1 text-[9px] font-bold text-black uppercase">
            <span>#SovereignAI</span>
            <span className="text-zinc-400">•</span>
            <span>#RiyadhTech</span>
            <span className="text-zinc-400">•</span>
            <span>#ArabicLLM</span>
            <span className="text-zinc-400">•</span>
            <span>#GraphRAG</span>
          </div>
        </div>

        {/* Search / Filter Box */}
        <div className="flex flex-col justify-center">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter deck posts by keywords..."
              className="w-full bg-white border border-border p-2 pl-7 text-[10.5px] focus:outline-none focus:border-black font-mono text-black"
            />
            <Search className="absolute left-2.5 top-2.5 text-zinc-500 size-3.5" />
          </div>
        </div>
      </div>

      {/* Draft Custom Sentiment Form Modal */}
      {showDraftForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border max-w-md w-full p-6 space-y-4 text-xs text-black">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="font-black uppercase text-[11px] flex items-center gap-1.5">
                <Plus size={14} /> DRAFT SOCIAL INTEL POST
              </span>
              <button 
                onClick={() => setShowDraftForm(false)}
                className="text-red-600 hover:underline font-bold text-[10px]"
              >
                [CLOSE]
              </button>
            </div>

            <form onSubmit={handleDraftSubmit} className="space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Source Channel</label>
                  <select
                    value={draftNetwork}
                    onChange={(e) => setDraftNetwork(e.target.value as any)}
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X">X (Twitter)</option>
                    <option value="Substack">Substack</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Author Name</label>
                  <input
                    type="text"
                    required
                    value={draftAuthor}
                    onChange={(e) => setDraftAuthor(e.target.value)}
                    placeholder="e.g. Samer K."
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase block">Post Content / Text</label>
                <textarea
                  required
                  rows={4}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Paste direct transcripts, tweets, Substack summaries, or community questions..."
                  className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase block">Classified Sentiment</label>
                <select
                  value={draftSentiment}
                  onChange={(e) => setDraftSentiment(e.target.value as any)}
                  className="w-full bg-surface border border-border p-1.5 focus:outline-none"
                >
                  <option value="Positive">Positive Confidence</option>
                  <option value="Neutral">Neutral / Alert</option>
                  <option value="Negative">Negative / Risk</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-black text-white font-bold uppercase hover:bg-zinc-800 cursor-pointer text-xs"
              >
                COMMIT SIGNAL VECTOR TO DECK
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TweetDeck 5-Column Grid */}
      <div className="flex-grow overflow-x-auto overflow-y-hidden pb-2 scrollbar-custom">
        <div className="flex gap-4 min-w-[1200px] h-full h-[550px]">
          
          {/* Column 1: LinkedIn */}
          <div className="flex-1 bg-surface border border-border flex flex-col h-full rounded-none">
            <div className="p-3 bg-black text-white font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <Linkedin size={13} className="text-white" /> LINKEDIN FEED
              </span>
              <span className="bg-white text-black px-1.5 py-0.5 rounded-none font-bold text-[8px]">
                {getNetworkPosts("LinkedIn").length} POSTS
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-2.5 space-y-3 scrollbar-custom">
              {renderPostColumn(getNetworkPosts("LinkedIn"))}
            </div>
          </div>

          {/* Column 2: X (Twitter) */}
          <div className="flex-1 bg-surface border border-border flex flex-col h-full rounded-none">
            <div className="p-3 bg-black text-white font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <Twitter size={13} className="text-white" /> X / TWITTER FEED
              </span>
              <span className="bg-white text-black px-1.5 py-0.5 rounded-none font-bold text-[8px]">
                {getNetworkPosts("X").length} POSTS
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-2.5 space-y-3 scrollbar-custom">
              {renderPostColumn(getNetworkPosts("X"))}
            </div>
          </div>

          {/* Column 3: Substack */}
          <div className="flex-1 bg-surface border border-border flex flex-col h-full rounded-none">
            <div className="p-3 bg-black text-white font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <BookOpen size={13} className="text-white" /> SUBSTACK BRIEFS
              </span>
              <span className="bg-white text-black px-1.5 py-0.5 rounded-none font-bold text-[8px]">
                {getNetworkPosts("Substack").length} POSTS
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-2.5 space-y-3 scrollbar-custom">
              {renderPostColumn(getNetworkPosts("Substack"))}
            </div>
          </div>

          {/* Column 4: Facebook */}
          <div className="flex-1 bg-surface border border-border flex flex-col h-full rounded-none">
            <div className="p-3 bg-black text-white font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <Facebook size={13} className="text-white" /> FACEBOOK DISPATCH
              </span>
              <span className="bg-white text-black px-1.5 py-0.5 rounded-none font-bold text-[8px]">
                {getNetworkPosts("Facebook").length} POSTS
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-2.5 space-y-3 scrollbar-custom">
              {renderPostColumn(getNetworkPosts("Facebook"))}
            </div>
          </div>

          {/* Column 5: Instagram */}
          <div className="flex-1 bg-surface border border-border flex flex-col h-full rounded-none">
            <div className="p-3 bg-black text-white font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <Instagram size={13} className="text-white" /> INSTAGRAM LABS
              </span>
              <span className="bg-white text-black px-1.5 py-0.5 rounded-none font-bold text-[8px]">
                {getNetworkPosts("Instagram").length} POSTS
              </span>
            </div>
            <div className="flex-grow overflow-y-auto p-2.5 space-y-3 scrollbar-custom">
              {renderPostColumn(getNetworkPosts("Instagram"))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );

  function renderPostColumn(items: SocialPost[]) {
    if (items.length === 0) {
      return (
        <div className="py-12 text-center text-zinc-500 font-mono text-[9px] uppercase">
          No signal feeds found.
        </div>
      );
    }

    return items.map(post => (
      <div
        key={post.id}
        className="bg-white border border-border p-3 space-y-2 hover:border-black/50 transition-all flex flex-col justify-between"
      >
        {/* Post meta / header */}
        <div className="flex justify-between items-start gap-2 border-b border-zinc-100 pb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 rounded-none bg-black text-white flex items-center justify-center font-bold text-[9px] shrink-0">
              {post.avatar}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-black text-[10.5px] block truncate uppercase">{post.author}</span>
              <span className="text-[8.5px] text-zinc-500 block truncate">{post.handle}</span>
            </div>
          </div>

          <span className="text-[8.5px] text-zinc-400 shrink-0 font-bold">{post.timestamp}</span>
        </div>

        {/* Content */}
        <p className="text-[10px] leading-relaxed text-zinc-700 font-sans">
          {post.text}
        </p>

        {/* Trending Tech tool badge */}
        {post.trendingTool && (
          <div className="flex items-center gap-1 text-[8.5px] bg-zinc-100 text-zinc-800 border border-zinc-200 px-1.5 py-0.5 w-max font-bold uppercase font-mono">
            <Sparkles size={10} className="text-zinc-600" /> TOOL: {post.trendingTool}
          </div>
        )}

        {/* Sentiment Indicators & Interactions */}
        <div className="flex justify-between items-center pt-2 border-t border-zinc-100 text-[9px] font-mono text-zinc-500">
          <span className={`text-[8px] font-black border px-1.5 py-0.5 uppercase ${
            post.sentiment === "Positive" ? "bg-green-100 border-green-300 text-green-800" :
            post.sentiment === "Neutral" ? "bg-zinc-100 border-zinc-300 text-zinc-700" :
            "bg-red-100 border-red-300 text-red-800"
          }`}>
            {post.sentiment}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
              }}
              className="hover:text-black flex items-center gap-0.5 font-bold cursor-pointer"
            >
              <Heart size={10} /> {post.likes}
            </button>
            <span className="flex items-center gap-0.5">
              <MessageSquare size={10} /> {post.commentsCount}
            </span>
          </div>
        </div>

      </div>
    ));
  }
};
