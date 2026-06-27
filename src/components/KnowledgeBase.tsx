import React, { useState, useMemo } from "react";
import { 
  Search, Play, Clock, BookOpen, Shield, HelpCircle, 
  ChevronRight, ArrowLeft, Video, Tv, CheckCircle, Info,
  Sparkles, ExternalLink, RefreshCw, Layers, Sliders, ChevronLeft
} from "lucide-react";

interface DocArticle {
  id: string;
  title: string;
  category: "AI & RAG" | "Data & Vault" | "VC & Dealroom" | "Compliance";
  readTime: string;
  summary: string;
  content: string[];
  tags: string[];
}

const DOCUMENTATION_ARTICLES: DocArticle[] = [
  {
    id: "doc-rag-mastery",
    title: "Mastering the Source-Grounded RAG Engine",
    category: "AI & RAG",
    readTime: "4 min read",
    summary: "How retrieval-augmented generation enforces context-accuracy to avoid model hallucinations.",
    content: [
      "Retrieval-Augmented Generation (RAG) is a core security protocol on the platform. Rather than letting the underlying Gemini models answer questions purely from their pre-trained parameters, RAG forces the models to look at specified file sources.",
      "To activate grounding, you must select at least one document checkmark inside the Source Vault (located in the Left Panel of your workspace). If zero files are selected, the system will lock the chat box input to prevent unsecured queries.",
      "Our backend slices text sources into semantic chunks. When a user prompt is dispatched, the database indexes relevant chunks using cosine similarity parameters, sending them alongside the user query to the Gemini model as immutable facts.",
      "Rule of thumb: Keep documents focused. Splitting large research reports into concise paragraphs or specialized manuals yields far greater accuracy than committing single massive files."
    ],
    tags: ["RAG", "grounding", "Source Vault", "Gemini", "vector database"]
  },
  {
    id: "doc-token-diagnostics",
    title: "Interpreting Real-Time Token Diagnostics",
    category: "AI & RAG",
    readTime: "3 min read",
    summary: "Analyzing input/output yields, cumulative costs, and transaction histories via Recharts.",
    content: [
      "The Central Screen houses real-time token diagnostics directly above the neural chat stream. This dashboard tracks cumulative bandwidth and cost statistics for the active cluster.",
      "Input Bandwidth represents the prompt context (system instruction, active grounding chunks, and historical conversation logs). This fluctuates based on the size of checkmarked documents.",
      "Output Yield represents the raw output tokens compiled by the model. These are plotted continuously over your transaction timeline.",
      "Toggle between 'Bandwidth Area' (representing raw timeline flow) and 'Cumulative Bars' to view detailed stacking cost structures."
    ],
    tags: ["Token diagnostics", "Recharts", "Input bandwidth", "Output yield", "costs"]
  },
  {
    id: "doc-vc-cockpit",
    title: "Leveraging the Venture Capital Dealroom Cockpit",
    category: "VC & Dealroom",
    readTime: "5 min read",
    summary: "Utilizing funding trackers, investor power-laws, segment multiples, and regional geo-plots.",
    content: [
      "The Dealroom VC Cockpit is accessed via the view-mode switcher in the navigation bar. It provides real-time venture tracking cloned from Dealroom.co frameworks.",
      "The VC Investment Dashboard lets you search and filter globally verified funding deals by technology sector, location (e.g. EU vs. US), and round size.",
      "The Power Law ratings list elite venture firms (like Sequoia or Accel) based on real outcome statistics. Click 'EXPORT THIS ACTIVE DATA TO CANVAS' to instantly compile reports to the Right Panel scratchpad.",
      "Explore Ecosystem Indices, Startup Journeys, and Regional Geo Plots to evaluate competitive indicators for deep technology start-ups globally."
    ],
    tags: ["Dealroom", "VC Cockpit", "funding", "Power Law", "multiples", "ecosystem"]
  },
  {
    id: "doc-source-vault",
    title: "Managing the Source Vault & Document Chunking",
    category: "Data & Vault",
    readTime: "3 min read",
    summary: "How to commit text streams, manage operational directories, and ensure compliance.",
    content: [
      "The Source Vault accepts custom text files, markdown files, JSON, and technical transcripts. Each cluster supports up to 50 active sources.",
      "To upload, drag-and-drop or browse your file system using the Vault upload field. Documents are instantly mapped to the selected cluster ID.",
      "If you experience issues where queries fail, confirm that the file is checked in the list. Clear inactive assets with the Trash icon to optimize vector lookup times.",
      "GDPR standards dictate that data is processed strictly in temporary random-access variables, maintaining extreme privacy safeguards."
    ],
    tags: ["Source Vault", "upload", "markdown", "file formats", "GDPR"]
  }
];

interface WalkthroughStep {
  id: number;
  target: string;
  title: string;
  description: string;
  position: string;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 1,
    target: "Cognitive Cluster Selector",
    title: "1. Cognitive Cluster Toggles",
    description: "Navigate between AI Research, Architectures, Finance, or GTM Incubators to separate data buckets.",
    position: "Left Panel Header"
  },
  {
    id: 2,
    target: "Source Vault",
    title: "2. Grounding Document Vault",
    description: "Upload .txt, .md, or .yaml files. Toggle checkmarks to select active sources. If none are selected, chat is locked.",
    position: "Left Panel Main"
  },
  {
    id: 3,
    target: "Token Diagnostics",
    title: "3. Real-Time Token Diagnostics",
    description: "Visualizes cumulative token use and input/output bandwidth trends utilizing interactive Recharts.",
    position: "Central Column Top"
  },
  {
    id: 4,
    target: "Neural Chat",
    title: "4. Neural Reasoning Chat",
    description: "Dispatches grounded prompts. Your selected document chunks are injected automatically.",
    position: "Central Column Main"
  },
  {
    id: 5,
    target: "Scratchpad Canvas",
    title: "5. Assembly Scratchpad Canvas",
    description: "Where reports are drafted, structured, and customized. Features instant raw text editing and Markdown structure.",
    position: "Right Panel Main"
  },
  {
    id: 6,
    target: "PDF Report Compiler",
    title: "6. PDF Report Compiler",
    description: "Compiles your scratchpad outline directly into an audited, beautifully styled PDF format.",
    position: "Right Panel Footer"
  }
];

interface VideoGuide {
  id: string;
  title: string;
  duration: string;
  description: string;
  category: string;
  thumbnailColor: string;
  videoSrcMock: string;
  chapters: string[];
}

const VIDEO_GUIDES: VideoGuide[] = [
  {
    id: "vid-intro",
    title: "Guided Platform Orientation Walkthrough",
    duration: "2:45 mins",
    description: "A comprehensive look at our dual-mode interface, cognitive cluster partitioning, and document grounding.",
    category: "Basics",
    thumbnailColor: "from-teal-950 to-emerald-900",
    videoSrcMock: "Orientation_Loop_2026.mp4",
    chapters: ["0:00 - Introduction", "0:45 - Navigating Clusters", "1:30 - Grounding Checks", "2:15 - Core PDF Compiler"]
  },
  {
    id: "vid-rag",
    title: "Advanced Grounded RAG & PDF Compiling",
    duration: "4:12 mins",
    description: "Step-by-step tutorial on uploading research data, targeting files, formulating precise prompts, and downloading dossiers.",
    category: "Workflows",
    thumbnailColor: "from-purple-950 to-indigo-950",
    videoSrcMock: "RAG_Grounding_Masterclass.mp4",
    chapters: ["0:00 - Grounding Principles", "1:10 - Document Chunking", "2:30 - Prompt Tuning", "3:40 - PDF Rendering"]
  },
  {
    id: "vid-dealroom",
    title: "Deep Dive into VC Dealroom & Power Law Indices",
    duration: "3:30 mins",
    description: "How to parse venture capital analytics, filter funding trends, look up exit multiples, and export tabular data to your active canvas.",
    category: "Analytics",
    thumbnailColor: "from-amber-950 to-orange-900",
    videoSrcMock: "VC_Market_Metrics.mp4",
    chapters: ["0:00 - VC Mode Switch", "0:55 - Sector Landscapes", "2:10 - Multiples & Valuations", "3:05 - Exporting Vectors"]
  }
];

export const KnowledgeBase: React.FC = () => {
  // Search state for Documentation
  const [docSearch, setDocSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Walkthrough step state
  const [activeWalkStep, setActiveWalkStep] = useState<number>(0);

  // Video guide playback simulator state
  const [activeVideo, setActiveVideo] = useState<VideoGuide | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0); // simulation timer
  const [playbackIntervalId, setPlaybackIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  // Filter doc articles
  const filteredDocs = useMemo(() => {
    return DOCUMENTATION_ARTICLES.filter(article => {
      const matchCategory = activeCategory === "All" || article.category === activeCategory;
      const matchSearch = docSearch === "" || 
        article.title.toLowerCase().includes(docSearch.toLowerCase()) ||
        article.summary.toLowerCase().includes(docSearch.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(docSearch.toLowerCase())) ||
        article.content.some(paragraph => paragraph.toLowerCase().includes(docSearch.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [docSearch, activeCategory]);

  // Video Simulation timer play handler
  const handlePlayVideo = (vid: VideoGuide) => {
    if (playbackIntervalId) {
      clearInterval(playbackIntervalId);
    }
    setActiveVideo(vid);
    setIsPlaying(true);
    setPlaybackTime(0);

    const interval = setInterval(() => {
      setPlaybackTime(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 100;
        }
        return prev + 2.5;
      });
    }, 400);

    setPlaybackIntervalId(interval);
  };

  const togglePausePlay = () => {
    if (isPlaying) {
      if (playbackIntervalId) clearInterval(playbackIntervalId);
      setIsPlaying(false);
    } else if (activeVideo) {
      const interval = setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 2.5;
        });
      }, 400);
      setPlaybackIntervalId(interval);
      setIsPlaying(true);
    }
  };

  const handleStopVideo = () => {
    if (playbackIntervalId) {
      clearInterval(playbackIntervalId);
    }
    setIsPlaying(false);
    setActiveVideo(null);
    setPlaybackTime(0);
  };

  return (
    <div id="knowledge-base-root" className="space-y-6 font-mono text-xs text-white">
      
      {/* Intro Header */}
      <div className="border border-[#00FF9C]/20 bg-[#00FF9C]/5 p-4 flex items-start gap-3">
        <Sparkles size={16} className="text-[#00FF9C] shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="text-[#00FF9C] font-black text-[10px] block uppercase tracking-wider">KNOWLEDGE DISCOVERY HUB</span>
          <p className="text-[11px] leading-relaxed text-zinc-300 mt-1">
            Access searchable documentation matrix arrays, interactive walkthrough indicators, and simulated video briefings tailored to guide you from initiation to advanced report compilers.
          </p>
        </div>
      </div>

      {/* THREE INTERACTIVE SECTIONS COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ======================================================== */}
        {/* LEFT COLUMN: SEARCHABLE DOCUMENTATION (LG: 7 Cols)       */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-black/40 border border-border p-4 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-[10px] text-[#00FF9C] font-black tracking-widest uppercase flex items-center gap-1.5">
                <BookOpen size={13} className="text-[#00FF9C]" />
                [01] PLATFORM DOCUMENTATION FILES
              </span>
              
              {selectedDoc && (
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="text-[9px] text-[#00FF9C] hover:underline flex items-center gap-1 cursor-pointer font-bold uppercase"
                >
                  <ArrowLeft size={10} /> BACK TO DIRECTORY
                </button>
              )}
            </div>

            {!selectedDoc ? (
              <>
                {/* Search and Categories */}
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      placeholder="Search files by tags, keywords or topics..."
                      className="w-full bg-black border border-border p-2 pl-8 text-xs text-white focus:outline-none focus:border-[#00FF9C]"
                    />
                    <Search className="absolute left-2.5 top-2.5 text-zinc-500 size-3.5" />
                  </div>

                  {/* Categories tabs */}
                  <div className="flex flex-wrap gap-1.5 text-[9px]">
                    {["All", "AI & RAG", "Data & Vault", "VC & Dealroom"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-2 py-0.5 border cursor-pointer transition-all uppercase ${
                          activeCategory === cat 
                            ? "bg-[#00FF9C] text-black border-[#00FF9C] font-bold" 
                            : "bg-surface border-border text-zinc-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Articles List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-custom pr-1">
                  {filteredDocs.length === 0 ? (
                    <div className="py-8 text-center text-zinc-500 uppercase text-[10px]">
                      NO DOCUMENT MATCHES IN THE CURRENT DIRECTORY QUERY.
                    </div>
                  ) : (
                    filteredDocs.map(article => (
                      <div
                        key={article.id}
                        onClick={() => setSelectedDoc(article)}
                        className="bg-black/30 border border-border p-3 hover:border-[#00FF9C]/60 cursor-pointer transition-all group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[11px] font-black text-white group-hover:text-[#00FF9C] transition-colors uppercase">
                            {article.title}
                          </span>
                          <span className="text-[8px] bg-zinc-900 border border-border text-zinc-400 px-1.5 font-bold uppercase shrink-0">
                            {article.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                        <div className="flex justify-between items-center mt-2 border-t border-border/30 pt-1.5 text-[8px] text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {article.readTime}
                          </span>
                          <span className="text-[#00FF9C] font-black tracking-widest uppercase flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            READ DOSSIER <ChevronRight size={10} />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              /* Selected Article Viewer */
              <div className="bg-black/20 border border-border p-4 space-y-4">
                <div className="border-b border-border pb-3.5 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[8px] bg-accent/20 text-[#00FF9C] border border-[#00FF9C]/30 px-1.5 py-0.5 font-bold uppercase">
                      {selectedDoc.category} // DIRECTIVE
                    </span>
                    <h4 className="text-sm font-black text-white uppercase mt-1.5 tracking-tight leading-tight">
                      {selectedDoc.title}
                    </h4>
                  </div>
                  <span className="text-[9px] text-zinc-400 shrink-0 font-bold flex items-center gap-1">
                    <Clock size={10} /> {selectedDoc.readTime}
                  </span>
                </div>

                <div className="space-y-3.5 text-[11px] leading-relaxed text-zinc-300">
                  {selectedDoc.content.map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {/* Article Tags */}
                <div className="pt-3 border-t border-border/30">
                  <span className="text-[8px] text-zinc-500 uppercase font-black block mb-1.5">METADATA VECTOR TAGS</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDoc.tags.map(tag => (
                      <span 
                        key={tag}
                        onClick={() => {
                          setDocSearch(tag);
                          setSelectedDoc(null);
                        }}
                        className="text-[9px] bg-zinc-900 border border-border text-[#00FF9C]/85 px-1.5 py-0.5 hover:border-[#00FF9C]/50 hover:text-white cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* CURATED VIDEO-GUIDES SECTION                             */}
          {/* ======================================================== */}
          <div className="bg-black/40 border border-border p-4 space-y-4">
            <span className="text-[10px] text-[#00FF9C] font-black tracking-widest uppercase flex items-center gap-1.5">
              <Video size={13} className="text-[#00FF9C]" />
              [02] GETTING STARTED VIDEO BRIEFINGS
            </span>

            {/* Immersive Playback Player Simulator */}
            {activeVideo ? (
              <div className="bg-[#020202] border border-border p-3.5 relative">
                
                {/* Simulated Screen with dynamic loading frames */}
                <div className={`relative aspect-video bg-gradient-to-br ${activeVideo.thumbnailColor} border border-border/50 flex flex-col justify-between p-4 overflow-hidden`}>
                  
                  {/* Glowing CRT overlay effect */}
                  <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-20"></div>

                  {/* Top Bar Video Stats */}
                  <div className="flex justify-between items-center z-10">
                    <span className="text-[8px] bg-black/85 px-2 py-0.5 border border-[#00FF9C]/40 text-[#00FF9C] font-mono tracking-widest font-bold uppercase">
                      STREAMING // {activeVideo.videoSrcMock}
                    </span>
                    <span className="text-[8px] bg-red-600 px-1.5 py-0.5 font-bold text-white uppercase animate-pulse">
                      SIM PLAY
                    </span>
                  </div>

                  {/* Playback graphic center overlay */}
                  <div className="flex flex-col items-center justify-center my-auto z-10 space-y-2">
                    <button 
                      onClick={togglePausePlay}
                      className="p-3 bg-black/80 border border-accent/40 rounded-full text-accent hover:scale-105 hover:bg-black transition-all cursor-pointer"
                    >
                      {isPlaying ? (
                        <div className="w-4 h-4 flex gap-1 justify-center items-center">
                          <div className="w-1.5 h-full bg-[#00FF9C]"></div>
                          <div className="w-1.5 h-full bg-[#00FF9C]"></div>
                        </div>
                      ) : (
                        <Play size={16} fill="#00FF9C" className="translate-x-0.5" />
                      )}
                    </button>
                    {isPlaying ? (
                      <span className="text-[9px] text-[#00FF9C]/95 tracking-widest uppercase font-black bg-black/50 px-2.5 py-0.5 animate-pulse">
                        SYNCHRONIZING AUDIO FEED SIGNAL
                      </span>
                    ) : (
                      <span className="text-[9px] text-zinc-400 tracking-widest uppercase bg-black/50 px-2 py-0.5">
                        PAUSED
                      </span>
                    )}
                  </div>

                  {/* Simulated subtitling based on simulation state percentage */}
                  <div className="bg-black/80 p-2 border border-border max-w-sm mx-auto text-center font-mono text-[9.5px] leading-relaxed text-[#00FF9C] z-10 mt-auto">
                    {playbackTime < 25 && "Welcome to the Platform manual. Today we map out structural layouts..."}
                    {playbackTime >= 25 && playbackTime < 50 && "Select documents inside the Source Vault checkmarks to bypass prompt locks..."}
                    {playbackTime >= 50 && playbackTime < 75 && "Then type dynamic outlines in the right workspace scratchpad panel..."}
                    {playbackTime >= 75 && "And compile finished intelligence models instantly into fully compliant PDF files."}
                  </div>

                  {/* Video Timeline Bar */}
                  <div className="w-full bg-zinc-900 h-1 rounded-none overflow-hidden mt-3 z-10 relative">
                    <div 
                      className="bg-[#00FF9C] h-full transition-all duration-300"
                      style={{ width: `${playbackTime}%` }}
                    ></div>
                  </div>

                </div>

                {/* Player Controls Under Screen */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-3 font-mono text-[9px] text-zinc-400">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={togglePausePlay}
                      className="text-[#00FF9C] font-black hover:underline cursor-pointer uppercase flex items-center gap-1"
                    >
                      {isPlaying ? "PAUSE FEED" : "RESUME FEED"}
                    </button>
                    <span>|</span>
                    <button 
                      onClick={handleStopVideo}
                      className="hover:text-white cursor-pointer uppercase"
                    >
                      STOP / RESET PLAYER
                    </button>
                  </div>

                  {/* Volume Slider Mock */}
                  <div className="flex items-center gap-2">
                    <span onClick={() => setIsMuted(!isMuted)} className="cursor-pointer hover:text-white uppercase font-bold text-[8px]">
                      {isMuted ? "VOLUME: MUTED" : `VOLUME: ${volume}%`}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value));
                        setIsMuted(false);
                      }}
                      className="w-16 accent-accent bg-zinc-800"
                    />
                  </div>
                </div>

                {/* Video metadata detailed lists */}
                <div className="mt-4 border-t border-border pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-bold text-white uppercase text-[10.5px]">{activeVideo.title}</h5>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{activeVideo.description}</p>
                  </div>
                  <div className="bg-black/30 border border-border p-2.5">
                    <span className="text-[8px] text-zinc-500 uppercase font-black block mb-1">CHAPTER DIRECTIVES</span>
                    <ul className="space-y-1 text-[9.5px]">
                      {activeVideo.chapters.map((ch, idx) => (
                        <li key={idx} className="text-zinc-300 flex items-center gap-1.5">
                          <CheckCircle size={10} className="text-accent" /> {ch}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            ) : (
              /* Gallery Grid */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {VIDEO_GUIDES.map(vid => (
                  <div 
                    key={vid.id}
                    className="border border-border bg-black/20 hover:border-accent/40 transition-all flex flex-col justify-between h-[210px] p-3 group relative overflow-hidden"
                  >
                    {/* Tiny hover play icon watermark */}
                    <div className="absolute top-2 right-2 bg-black/85 border border-border font-bold text-[8.5px] text-zinc-400 px-1.5 py-0.5 uppercase">
                      {vid.duration}
                    </div>

                    <div className={`h-[85px] bg-gradient-to-br ${vid.thumbnailColor} border border-border/50 flex items-center justify-center relative mb-2`}>
                      <Play size={20} fill="#00FF9C" className="text-accent opacity-80 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] text-[#00FF9C] uppercase tracking-widest font-bold block">{vid.category} Brief</span>
                        <h5 className="text-[10.5px] font-black text-white uppercase tracking-tight mt-0.5 leading-snug group-hover:text-accent transition-colors">
                          {vid.title}
                        </h5>
                      </div>
                      
                      <button
                        onClick={() => handlePlayVideo(vid)}
                        className="w-full mt-2 py-1.5 bg-accent/15 border border-accent/30 hover:bg-[#00FF9C] hover:text-black text-accent text-[9px] font-black uppercase transition-all tracking-wider text-center cursor-pointer"
                      >
                        INITIALIZE VIDEO BREIF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: INTERACTIVE TOOLTIP WALKTHROUGH (LG: 5 Cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0c0c0e] border border-border p-4 space-y-4">
            <span className="text-[10px] text-[#00FF9C] font-black tracking-widest uppercase flex items-center gap-1.5">
              <Sliders size={13} className="text-[#00FF9C]" />
              [03] DYNAMIC SYSTEM WALKTHROUGH TOOLTIPS
            </span>

            <p className="text-[10px] leading-relaxed text-zinc-400">
              Interactive structural map of the platform cockpit layout. Select individual highlights below to query exact panel locations and operational prerequisites.
            </p>

            {/* Simulated mini dashboard outline graphic */}
            <div className="border border-border bg-black/60 p-3 flex flex-col gap-1.5 relative select-none">
              
              <div className="border border-border/50 bg-zinc-950 p-1.5 flex justify-between items-center text-[7.5px] text-zinc-600 font-mono">
                <span>COCKPIT HEADER</span>
                <span className="text-accent/30 font-black">UNLOCKED</span>
              </div>

              <div className="grid grid-cols-12 gap-1.5">
                {/* Left panel */}
                <div 
                  onClick={() => setActiveWalkStep(1)} // sets active map step to 1 (Vault)
                  className={`col-span-4 border p-2 flex flex-col justify-between h-[85px] cursor-pointer transition-all ${
                    activeWalkStep === 1 || activeWalkStep === 0 
                      ? "bg-accent/10 border-accent/80 text-white shadow-[0_0_10px_rgba(0,255,156,0.1)]" 
                      : "bg-black/40 border-border text-zinc-650 hover:border-zinc-750"
                  }`}
                >
                  <span className="text-[7px] font-bold block leading-tight">LEFT PANEL</span>
                  <div className="border-t border-dashed border-border/60 pt-1 mt-1 text-[6.5px] uppercase">
                    [01] CLUSTER<br/>
                    [02] VAULT
                  </div>
                </div>

                {/* Central Pane */}
                <div className="col-span-5 flex flex-col gap-1.5">
                  <div 
                    onClick={() => setActiveWalkStep(2)} // diagnostics
                    className={`border p-1.5 h-[35px] cursor-pointer transition-all ${
                      activeWalkStep === 2
                        ? "bg-accent/10 border-accent/80 text-white shadow-[0_0_10px_rgba(0,255,156,0.1)]" 
                        : "bg-black/40 border-border text-zinc-650 hover:border-zinc-750"
                    }`}
                  >
                    <span className="text-[6.5px] font-bold block leading-none uppercase">[03] TOKENS DIAGS</span>
                  </div>
                  <div 
                    onClick={() => setActiveWalkStep(3)} // chat
                    className={`border p-1.5 h-[44px] cursor-pointer transition-all ${
                      activeWalkStep === 3
                        ? "bg-accent/10 border-accent/80 text-white shadow-[0_0_10px_rgba(0,255,156,0.1)]" 
                        : "bg-black/40 border-border text-zinc-650 hover:border-zinc-750"
                    }`}
                  >
                    <span className="text-[6.5px] font-bold block leading-none uppercase">[04] NEURAL CHAT</span>
                  </div>
                </div>

                {/* Right panel */}
                <div 
                  onClick={() => setActiveWalkStep(4)} // scratchpad
                  className={`col-span-3 border p-2 flex flex-col justify-between h-[85px] cursor-pointer transition-all ${
                    activeWalkStep === 4 || activeWalkStep === 5
                      ? "bg-accent/10 border-accent/80 text-white shadow-[0_0_10px_rgba(0,255,156,0.1)]" 
                      : "bg-black/40 border-border text-zinc-650 hover:border-zinc-750"
                  }`}
                >
                  <span className="text-[7px] font-bold block leading-tight">RIGHT PANEL</span>
                  <div className="border-t border-dashed border-border/60 pt-1 mt-1 text-[6.5px] uppercase">
                    [05] SCRATCHPAD<br/>
                    [06] PDF PORT
                  </div>
                </div>
              </div>

              {/* View Selector indicator footer */}
              <div className="bg-zinc-950 p-1 border border-border/40 text-[7px] text-zinc-500 uppercase font-bold text-center">
                ACTIVE VIEW CORRIDOR: [ {activeWalkStep === 0 ? "OVERVIEW" : `HIGHLIGHT_0${activeWalkStep}`} ]
              </div>

            </div>

            {/* Detailed Explanatory Interactive Carousel based on state step */}
            <div className="bg-black/40 border border-border p-4 space-y-4">
              
              {/* Carousel Nav Toggles */}
              <div className="flex justify-between items-center border-b border-border/60 pb-2">
                <span className="text-[8px] text-zinc-500 uppercase font-black">
                  ACTIVE TOOLTIP SEQUENCE: STEP {activeWalkStep + 1} OF {WALKTHROUGH_STEPS.length}
                </span>
                
                <div className="flex gap-1">
                  <button 
                    disabled={activeWalkStep === 0}
                    onClick={() => setActiveWalkStep(prev => Math.max(0, prev - 1))}
                    className="p-1 border border-border bg-black hover:border-accent hover:text-white cursor-pointer disabled:opacity-30 disabled:hover:border-border"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button 
                    disabled={activeWalkStep === WALKTHROUGH_STEPS.length - 1}
                    onClick={() => setActiveWalkStep(prev => Math.min(WALKTHROUGH_STEPS.length - 1, prev + 1))}
                    className="p-1 border border-border bg-black hover:border-accent hover:text-white cursor-pointer disabled:opacity-30 disabled:hover:border-border"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Step Display Card */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-[#00FF9C] uppercase tracking-wide">
                    {WALKTHROUGH_STEPS[activeWalkStep].title}
                  </span>
                  <span className="text-[8px] bg-zinc-900 border border-border text-zinc-400 px-1.5 py-0.5 uppercase tracking-widest font-bold">
                    {WALKTHROUGH_STEPS[activeWalkStep].position}
                  </span>
                </div>
                
                <p className="text-[11px] leading-relaxed text-zinc-300 font-normal">
                  {WALKTHROUGH_STEPS[activeWalkStep].description}
                </p>

                <div className="bg-accent/5 border border-accent/20 p-2.5 text-[9.5px] leading-relaxed text-zinc-400 flex items-start gap-2">
                  <Info size={12} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block uppercase mb-0.5">Quick Operational Insight</span>
                    {activeWalkStep === 0 && "To guarantee pipeline coherence, change clusters only when you want to load a completely separate document domain or sector database."}
                    {activeWalkStep === 1 && "The system highlights selected documents in glowing cyan checks. Make sure to commit correct manuals matching your active workflow query."}
                    {activeWalkStep === 2 && "If output bandwidth levels are spiking above expectations, consider clearing the conversational log memory or checking fewer files."}
                    {activeWalkStep === 3 && "You can query the active models continuously. The grounding stream appends selected documentation contexts transparently with every dispatch."}
                    {activeWalkStep === 4 && "You can write custom outlines, summarize insights, or paste full data blocks exported directly from our VC Cockpit dashboards."}
                    {activeWalkStep === 5 && "Double check that your report has a custom title inside the input field. The PDF compiler uses that string for high-contrast cover blocks."}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
