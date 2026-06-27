import React, { useState, useMemo } from "react";
import { Search, Plus, Terminal, Check, Star, Code, GitFork, BookOpen, ExternalLink, RefreshCw, Copy, GitBranch } from "lucide-react";

interface RepoItem {
  id: string;
  name: string;
  author: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  tags: string[];
  cloneUrl: string;
  primaryUse: string;
  demoAvailable: boolean;
  activeContributors: number;
}

export const YellowPagesRepositories: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [starRatings, setStarRatings] = useState<Record<string, boolean>>({});

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLang, setNewLang] = useState("TypeScript");
  const [newTags, setNewTags] = useState("");
  const [newClone, setNewClone] = useState("");
  const [newUse, setNewUse] = useState("");

  const [repos, setRepos] = useState<RepoItem[]>([
    {
      id: "repo-1",
      name: "menalm-rag-ingestion",
      author: "amana-tech-org",
      description: "Sovereign PDF parser and HNSW hierarchical vector index pipeline designed for rapid deployment in high-security Middle East municipal clouds. Connects natively to Gemini APIs and custom DBs.",
      stars: 342,
      forks: 48,
      language: "TypeScript",
      tags: ["RAG", "HNSW Index", "PDF Parser", "Sovereign Cloud"],
      cloneUrl: "git clone https://github.com/amana-tech/menalm-rag-ingestion.git",
      primaryUse: "Document Intelligence",
      demoAvailable: true,
      activeContributors: 14
    },
    {
      id: "repo-2",
      name: "dune-arabic-llama-weights",
      author: "dune-ai-labs",
      description: "Fine-tuning scripts, quantization configs, and adapters mapping 4-bit Llama models for high-fidelity GCC dialects, legal terminology, and banking compliance terminology.",
      stars: 812,
      forks: 112,
      language: "Python",
      tags: ["Fine-tuning", "LLM", "Quantization", "Dialects"],
      cloneUrl: "git clone https://github.com/dune-ai/dune-arabic-llama-weights.git",
      primaryUse: "Dialect Tuning",
      demoAvailable: false,
      activeContributors: 25
    },
    {
      id: "repo-3",
      name: "react-monospace-agent-canvas",
      author: "byblos-studios",
      description: "Highly polished Canvas playground styled like modern monospace terminals. Integrates source vaults, real-time citation highlights, Recharts token diagnostics, and instant PDF print layouts.",
      stars: 421,
      forks: 36,
      language: "TypeScript",
      tags: ["Canvas", "Interface", "Mono UI", "Vite/React"],
      cloneUrl: "git clone https://github.com/byblos/react-monospace-agent-canvas.git",
      primaryUse: "UI Playground",
      demoAvailable: true,
      activeContributors: 6
    },
    {
      id: "repo-4",
      name: "nile-node-scraping-orchestrator",
      author: "nile-generative",
      description: "Resilient server-side Node.js crawler designed to scrape and serialize public agricultural registries, energy indexes, and weather statistics into grounded vector embeddings.",
      stars: 189,
      forks: 29,
      language: "JavaScript",
      tags: ["Scraper", "Crawling", "Embedding Ingestion", "NodeJS"],
      cloneUrl: "git clone https://github.com/nile-gen/nile-node-scraping-orchestrator.git",
      primaryUse: "Web Scraping",
      demoAvailable: true,
      activeContributors: 8
    },
    {
      id: "repo-5",
      name: "qatar-transit-vision-core",
      author: "oasis-systems",
      description: "YOLO-based spatial computer vision pipeline configured to output real-time traffic density statistics to administrative telemetry interfaces over low-latency ports.",
      stars: 264,
      forks: 41,
      language: "Python",
      tags: ["YOLO", "Computer Vision", "Telemetry", "Smart Cities"],
      cloneUrl: "git clone https://github.com/oasis-qa/qatar-transit-vision-core.git",
      primaryUse: "Visual Tracking",
      demoAvailable: false,
      activeContributors: 11
    },
    {
      id: "repo-6",
      name: "petra-law-corpus-indexer",
      author: "petra-ai-jordan",
      description: "Fast multi-threaded scraper indexing public Jordanian law documents, automating section alignment, and generating structured metadata files for deep semantic query matching.",
      stars: 94,
      forks: 18,
      language: "Go",
      tags: ["Go", "Metadata", "Structuring", "Legal AI"],
      cloneUrl: "git clone https://github.com/petra-jordan/petra-law-corpus-indexer.git",
      primaryUse: "Legal Processing",
      demoAvailable: true,
      activeContributors: 4
    }
  ]);

  const copyCloneCmd = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStar = (id: string) => {
    const alreadyStarred = starRatings[id];
    setStarRatings(prev => ({ ...prev, [id]: !alreadyStarred }));
    setRepos(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          stars: alreadyStarred ? r.stars - 1 : r.stars + 1
        };
      }
      return r;
    }));
  };

  const handleAddRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const parsedTags = newTags.split(",").map(t => t.trim()).filter(Boolean);
    const newRepo: RepoItem = {
      id: `repo-custom-${Date.now()}`,
      name: newTitle,
      author: newAuthor.trim() || "independent-developer",
      description: newDesc,
      stars: 1,
      forks: 0,
      language: newLang,
      tags: parsedTags.length > 0 ? parsedTags : ["AI", "Open Source"],
      cloneUrl: newClone.trim() || `git clone https://github.com/${newAuthor}/${newTitle}.git`,
      primaryUse: newUse.trim() || "General Utilities",
      demoAvailable: false,
      activeContributors: 1
    };

    setRepos(prev => [newRepo, ...prev]);
    setNewTitle("");
    setNewAuthor("");
    setNewDesc("");
    setNewTags("");
    setNewClone("");
    setNewUse("");
    setShowAddModal(false);
  };

  const filteredRepos = useMemo(() => {
    return repos.filter(item => {
      const matchLanguage = selectedLanguage === "ALL" || item.language === selectedLanguage;
      const matchCategory = selectedCategory === "ALL" || item.primaryUse.toUpperCase() === selectedCategory.toUpperCase();
      const matchSearch = searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchLanguage && matchCategory && matchSearch;
    });
  }, [repos, selectedLanguage, selectedCategory, searchQuery]);

  return (
    <div className="p-6 space-y-6">

      {/* Top section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-widest">ECOSYSTEM REPOSITORIES & PACKAGES</span>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <Code size={18} className="text-black" />
            YELLOW PAGES OF REPOSITORIES
          </h2>
          <p className="text-[11px] text-zinc-600 mt-1 max-w-2xl font-sans">
            Explore interesting, high-impact open source repositories, custom RAG libraries, fine-tuning adapters, and sovereign models tailored for regional digital solutions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 border border-black bg-black text-white hover:bg-zinc-800 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus size={14} /> SUBMIT REPOSITORY
        </button>
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-surface p-4 border border-border">
        
        {/* Search */}
        <div className="md:col-span-2 relative">
          <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">SEARCH REPOSITORIES</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by repository name, tag, author, or description..."
            className="w-full bg-white border border-border p-2 text-xs focus:outline-none focus:border-black font-mono text-black"
          />
        </div>

        {/* Language Filter */}
        <div>
          <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">LANGUAGE</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-white border border-border p-2 text-xs focus:outline-none font-mono text-black"
          >
            <option value="ALL">ALL LANGUAGES</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Go">Go</option>
          </select>
        </div>

        {/* Use Category Filter */}
        <div>
          <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">PRIMARY OBJECTIVE</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-border p-2 text-xs focus:outline-none font-mono text-black"
          >
            <option value="ALL">ALL CATEGORIES</option>
            <option value="Document Intelligence">DOCUMENT INTELLIGENCE</option>
            <option value="Dialect Tuning">DIALECT TUNING</option>
            <option value="UI Playground">UI PLAYGROUND</option>
            <option value="Web Scraping">WEB SCRAPING</option>
            <option value="Visual Tracking">VISUAL TRACKING</option>
            <option value="Legal Processing">LEGAL PROCESSING</option>
          </select>
        </div>

      </div>

      {/* Add Repository Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border max-w-xl w-full p-6 space-y-4 text-xs text-black">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="font-black text-black uppercase text-[11px] flex items-center gap-1.5">
                <Plus size={14} /> PROPOSE OPEN SOURCE PROJECT
              </span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-red-600 hover:underline font-bold text-[10px]"
              >
                [CLOSE]
              </button>
            </div>

            <form onSubmit={handleAddRepo} className="space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Repository Name</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. sovereign-vectordb-sync"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Author / Organization</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. amana-tech"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase block">Technical Description</label>
                <textarea
                  required
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summarize the codebase structure, pipeline layers, and system integration specs..."
                  className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Primary Language</label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value)}
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Go">Go</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. RAG, Vectors, Fast-API"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase block">Primary Objective Class</label>
                <input
                  type="text"
                  value={newUse}
                  onChange={(e) => setNewUse(e.target.value)}
                  placeholder="e.g. Document Intelligence, Web Scraping"
                  className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase block">Git Clone Command</label>
                <input
                  type="text"
                  value={newClone}
                  onChange={(e) => setNewClone(e.target.value)}
                  placeholder="git clone https://github.com/..."
                  className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-black text-white font-bold uppercase hover:bg-zinc-800 cursor-pointer text-xs"
              >
                REGISTER REPOSITORY TO REGIONAL WORKSPACE INDEX
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepos.map(repo => (
          <div
            key={repo.id}
            className="border border-border bg-white p-4 space-y-3 hover:border-black transition-colors relative"
          >
            {/* Header info */}
            <div className="flex justify-between items-start gap-4 border-b border-zinc-100 pb-2">
              <div>
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">
                  AUTHOR: {repo.author}
                </span>
                <h3 className="font-black text-sm text-black uppercase mt-1 flex items-center gap-1">
                  <BookOpen size={13} />
                  {repo.name}
                </h3>
              </div>

              <div className="flex items-center gap-1 text-[10px] bg-zinc-100 border border-border px-1.5 py-0.5 text-zinc-700 font-bold uppercase">
                <Code size={11} /> {repo.language}
              </div>
            </div>

            {/* Description */}
            <p className="text-[10.5px] leading-relaxed text-zinc-700 font-sans">
              {repo.description}
            </p>

            {/* Specialties & Objective badge */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[8px] bg-black text-white px-2 py-0.5 font-bold tracking-wider uppercase shrink-0">
                {repo.primaryUse}
              </span>
              {repo.tags.map(tag => (
                <span key={tag} className="text-[8px] bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 text-zinc-500 font-bold uppercase font-mono">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Terminal Copy Command Block */}
            <div className="bg-surface border border-border p-2 flex items-center justify-between font-mono text-[9px] text-zinc-600 gap-2">
              <span className="truncate block font-bold text-black">&gt;_ {repo.cloneUrl}</span>
              <button
                onClick={() => copyCloneCmd(repo.cloneUrl, repo.id)}
                className="p-1 border border-border hover:border-black bg-white cursor-pointer hover:bg-black hover:text-white transition-colors shrink-0 flex items-center gap-1 font-bold text-[8px] uppercase"
              >
                {copiedId === repo.id ? (
                  <>
                    <Check size={9} strokeWidth={3} className="text-green-600" /> COPIED
                  </>
                ) : (
                  <>
                    <Copy size={9} /> COPY
                  </>
                )}
              </button>
            </div>

            {/* Footer metrics bar */}
            <div className="flex justify-between items-center pt-2.5 border-t border-zinc-100 text-[9px] text-zinc-500 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Star size={11} className="text-amber-500 fill-amber-500" /> <strong className="text-black">{repo.stars} stars</strong>
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={11} className="text-zinc-500" /> <strong className="text-black">{repo.forks}</strong>
                </span>
                <span className="flex items-center gap-1 hidden sm:inline">
                  CONTRIBUTORS: <strong className="text-black">{repo.activeContributors}</strong>
                </span>
              </div>

              <div className="flex gap-2">
                {repo.demoAvailable && (
                  <span className="text-[8.5px] bg-green-100 text-green-800 border border-green-200 font-bold px-1.5 py-0.5 uppercase tracking-wide">
                    Live Demo Ready
                  </span>
                )}
                
                <button
                  onClick={() => handleStar(repo.id)}
                  className={`px-2 py-0.5 border text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    starRatings[repo.id]
                      ? "bg-black text-white border-black"
                      : "bg-white text-zinc-600 border-border hover:border-black hover:text-black"
                  }`}
                >
                  <Star size={10} className={starRatings[repo.id] ? "fill-white" : ""} /> STAR
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
