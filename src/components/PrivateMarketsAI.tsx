import React, { useState, useMemo } from "react";
import { Search, Plus, Cpu, DollarSign, Users, Award, ShieldAlert, ArrowUpRight, Zap, RefreshCw, Send, Check } from "lucide-react";

interface AIStartup {
  id: string;
  name: string;
  subSector: "AI for Legal" | "Multi-Agent Frameworks" | "AI Audit Engines" | "Sovereign AI Infrastructure" | "Arabic LLM Applications";
  founders: string[];
  founderBackgrounds: string;
  seedInvestment: string;
  valuationCap: string;
  tractionScore: string; // e.g., "94/100" or "8,400 APIs/mo"
  launchTraction: string;
  formationDate: string;
  recentFundingRound: string;
  status: "Active Ingestion" | "Venture Pipeline Accepted" | "Under Evaluation";
  summary: string;
}

interface FormationAlert {
  id: string;
  companyName: string;
  subSector: string;
  founders: string;
  fundingSignal: string;
  source: string;
  timestamp: string;
  ingested: boolean;
}

export const PrivateMarketsAI: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubSector, setSelectedSubSector] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"directory" | "formations_feed">("directory");
  
  // Pipeline Simulation
  const [webhookUrl, setWebhookUrl] = useState("https://api.avant-garde.internal/v1/venture-builder/ingest");
  const [webhookSent, setWebhookSent] = useState(false);
  const [isRefreshingFeed, setIsRefreshingFeed] = useState(false);

  // New Startup Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newSubSector, setNewSubSector] = useState<AIStartup["subSector"]>("Multi-Agent Frameworks");
  const [newFounders, setNewFounders] = useState("");
  const [newFounderBg, setNewFounderBg] = useState("");
  const [newSeedAmount, setNewSeedAmount] = useState("");
  const [newValuation, setNewValuation] = useState("");
  const [newTraction, setNewTraction] = useState("");
  const [newSummary, setNewSummary] = useState("");

  const [startups, setStartups] = useState<AIStartup[]>([
    {
      id: "su-1",
      name: "JurisAgent AI",
      subSector: "AI for Legal",
      founders: ["Dr. Amina El-Khoury", "Ziad Barakat"],
      founderBackgrounds: "Ex-Stanford NLP Research Fellow, Former Lead Partner at MENA Law Corp",
      seedInvestment: "$2.4M",
      valuationCap: "$18.0M",
      tractionScore: "92/100",
      launchTraction: "42 Enterprise law firms deployed, processing 450K clauses/mo",
      formationDate: "January 2026",
      recentFundingRound: "Seed (Lead by Riyadh DeepTech Fund)",
      status: "Venture Pipeline Accepted",
      summary: "Autonomous contract compliance agent that checks local Gulf regulatory guidelines and alerts multi-user workspaces on legal deviations."
    },
    {
      id: "su-2",
      name: "Synaptic Fabric",
      subSector: "Multi-Agent Frameworks",
      founders: ["Faisal Al-Jassim", "Dr. Hans Mueller"],
      founderBackgrounds: "Former Principal Architect at OpenAI Team, ex-MIT Distributed Systems Lab",
      seedInvestment: "$3.8M",
      valuationCap: "$25.0M",
      tractionScore: "96/100",
      launchTraction: "3,200 active developers, 1.2M weekly token coordinates",
      formationDate: "November 2025",
      recentFundingRound: "Seed (Lead by UAE Capital Partners)",
      status: "Active Ingestion",
      summary: "Low-latency orchestration layer designed to link server-side vector scrapers with browser-side React scratchpads seamlessly."
    },
    {
      id: "su-3",
      name: "Veritas Vector Audit",
      subSector: "AI Audit Engines",
      founders: ["Leila Masri", "Omar Hariri"],
      founderBackgrounds: "Cybersecurity Analyst at Kaspersky Labs, ex-CERN Data Infrastructure Group",
      seedInvestment: "$1.5M",
      valuationCap: "$12.0M",
      tractionScore: "89/100",
      launchTraction: "250+ automatic structural compliance scans, 34 critical leaks detected",
      formationDate: "February 2026",
      recentFundingRound: "Pre-seed (Lead by Oasis Seed Syndicate)",
      status: "Under Evaluation",
      summary: "Continuous scanning nodes verifying that client vector registries do not leak private administrative PDFs."
    },
    {
      id: "su-4",
      name: "Sovereign Array",
      subSector: "Sovereign AI Infrastructure",
      founders: ["Tariq Barghouti", "Karim Zein"],
      founderBackgrounds: "Hardware Engineering Lead at NVIDIA, former Systems Engineer at Aramco",
      seedInvestment: "$5.0M",
      valuationCap: "$38.0M",
      tractionScore: "95/100",
      launchTraction: "3 sovereign nodes live in secure cloud arrays across GCC borders",
      formationDate: "October 2025",
      recentFundingRound: "Seed (Co-led by Saudi Investment Authority & MEVP)",
      status: "Venture Pipeline Accepted",
      summary: "Air-gapped database arrays allowing corporate networks to call high-density parameters with zero outbound global connections."
    },
    {
      id: "su-5",
      name: "Bilingual Brain",
      subSector: "Arabic LLM Applications",
      founders: ["Dr. Reem Al-Mansoori", "Sami Haddad"],
      founderBackgrounds: "Arabic Dialectologist from Damascus University, former Senior NLP Engineer at Google",
      seedInvestment: "$1.8M",
      valuationCap: "$14.5M",
      tractionScore: "91/100",
      launchTraction: "12,000 active monthly API subscriptions, high dialectoral accuracy",
      formationDate: "March 2026",
      recentFundingRound: "Seed (Lead by Badia Impact Fund)",
      status: "Active Ingestion",
      summary: "Context-aware bilingual fine-tunes mapping commercial negotiations, banking metrics, and local conversational dialects."
    }
  ]);

  // Real-time AI Company Formations and Funding Signals
  const [formationAlerts, setFormationAlerts] = useState<FormationAlert[]>([
    {
      id: "al-1",
      companyName: "Heuristic Legal Systems",
      subSector: "AI for Legal",
      founders: "Samer Al-Aswad & Nadia K.",
      fundingSignal: "$950K Pre-seed filed in Abu Dhabi",
      source: "ADGM Registry",
      timestamp: "5 mins ago",
      ingested: false
    },
    {
      id: "al-2",
      companyName: "Kinetix Orchestration",
      subSector: "Multi-Agent Frameworks",
      founders: "Prof. Kenneth Grotesk & team",
      fundingSignal: "Incorporated with $1.2M commitment",
      source: "KAFD Registry",
      timestamp: "45 mins ago",
      ingested: true
    },
    {
      id: "al-3",
      companyName: "Guardrail Networks",
      subSector: "AI Audit Engines",
      founders: "Dr. Clara Sterling",
      fundingSignal: "$2.1M Seed round opened",
      source: "Venture Pulse",
      timestamp: "2 hours ago",
      ingested: false
    },
    {
      id: "al-4",
      companyName: "Q-Compute Sovereign",
      subSector: "Sovereign AI Infrastructure",
      founders: "Oasis Founders Group",
      fundingSignal: "State-backed $10.0M seed tranche assigned",
      source: "Qatar Gazette",
      timestamp: "1 day ago",
      ingested: true
    }
  ]);

  const handleRefreshAlerts = () => {
    setIsRefreshingFeed(true);
    setTimeout(() => {
      setIsRefreshingFeed(false);
      const incomingAlert: FormationAlert = {
        id: `al-custom-${Date.now()}`,
        companyName: `Omni-Agent Corp [FORMATION]`,
        subSector: "Multi-Agent Frameworks",
        founders: "Former Antigravity Engineers",
        fundingSignal: "$3.2M Seed announced by Riyadh Angels",
        source: "Sovereign Venture Feed",
        timestamp: "Just now",
        ingested: false
      };
      setFormationAlerts(prev => [incomingAlert, ...prev]);
    }, 1200);
  };

  const handleIngestToVentureBuilder = (alertId: string) => {
    // Simulate pipeline ingestion
    setFormationAlerts(prev => prev.map(al => {
      if (al.id === alertId) {
        // Create new startup item in the local list
        const newStartup: AIStartup = {
          id: `su-ingested-${Date.now()}`,
          name: al.companyName.replace(" [FORMATION]", ""),
          subSector: (al.subSector as any) || "Multi-Agent Frameworks",
          founders: al.founders.split("&").map(f => f.trim()),
          founderBackgrounds: `Ingested from ${al.source} stream automatically`,
          seedInvestment: al.fundingSignal.split(" ")[0] || "$1.0M",
          valuationCap: "Under Valuation",
          tractionScore: "New Formation",
          launchTraction: "Beta stage pipeline under active venture builder scraping",
          formationDate: "June 2026",
          recentFundingRound: al.fundingSignal,
          status: "Active Ingestion",
          summary: `Dynamic startup formations signals automatically ingested into venture builder networks via administrative webhooks.`
        };
        // Add to startups
        setStartups(current => [newStartup, ...current]);
        return { ...al, ingested: true };
      }
      return al;
    }));
  };

  const handleSendWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookSent(true);
    setTimeout(() => setWebhookSent(false), 2500);
  };

  const handleAddStartup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newSummary.trim()) return;

    const newSU: AIStartup = {
      id: `su-custom-${Date.now()}`,
      name: newCompanyName,
      subSector: newSubSector,
      founders: newFounders.split(",").map(f => f.trim()).filter(Boolean),
      founderBackgrounds: newFounderBg.trim() || "Independent Founders",
      seedInvestment: newSeedAmount.trim() || "$500K",
      valuationCap: newValuation.trim() || "$5.0M",
      tractionScore: "85/100",
      launchTraction: newTraction.trim() || "Beta testing workspace launched",
      formationDate: "June 2026",
      recentFundingRound: "Pre-seed",
      status: "Active Ingestion",
      summary: newSummary
    };

    setStartups(prev => [newSU, ...prev]);
    setNewCompanyName("");
    setNewFounders("");
    setNewFounderBg("");
    setNewSeedAmount("");
    setNewValuation("");
    setNewTraction("");
    setNewSummary("");
    setShowAddModal(false);
  };

  const filteredStartups = useMemo(() => {
    return startups.filter(su => {
      const matchSubSector = selectedSubSector === "ALL" || su.subSector === selectedSubSector;
      const matchStatus = selectedStatus === "ALL" || su.status === selectedStatus;
      const matchSearch = searchQuery === "" ||
        su.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        su.founders.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
        su.founderBackgrounds.toLowerCase().includes(searchQuery.toLowerCase()) ||
        su.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubSector && matchStatus && matchSearch;
    });
  }, [startups, selectedSubSector, selectedStatus, searchQuery]);

  return (
    <div id="private-markets-root" className="p-6 space-y-6">
      
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-widest">PRIVATE SECTOR VENTURE STRATEGY</span>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <Cpu size={18} className="text-black" />
            PRIVATE MARKETS & AI STARTUPS
          </h2>
          <p className="text-[11px] text-zinc-600 mt-1 max-w-2xl font-sans">
            Massive, dedicated focus tracking early-stage Artificial Intelligence and Machine Learning formations, founder lineages, seed allocations, and tool launch traction metrics across GCC & MENA regions.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            id="tab-btn-directory"
            onClick={() => setActiveTab("directory")}
            className={`px-3 py-1.5 border text-xs font-bold uppercase cursor-pointer transition-all ${
              activeTab === "directory" ? "bg-black text-white border-black" : "bg-white border-border text-zinc-600 hover:text-black"
            }`}
          >
            STARTUPS DIRECTORY
          </button>
          <button
            id="tab-btn-formations"
            onClick={() => setActiveTab("formations_feed")}
            className={`px-3 py-1.5 border text-xs font-bold uppercase cursor-pointer transition-all ${
              activeTab === "formations_feed" ? "bg-black text-white border-black" : "bg-white border-border text-zinc-600 hover:text-black"
            }`}
          >
            LIVE FORMATIONS FEED
          </button>
        </div>
      </div>

      {activeTab === "directory" ? (
        <>
          {/* Sub Sector Categorizations & Filtering Box */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-surface p-4 border border-border">
            
            <div className="md:col-span-2 relative">
              <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">SEARCH STARTUPS & FOUNDERS</label>
              <input
                id="search-startups"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company name, founder background, core keywords..."
                className="w-full bg-white border border-border p-2 text-xs focus:outline-none focus:border-black font-mono text-black"
              />
            </div>

            <div>
              <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">AI SUB-SECTOR</label>
              <select
                id="select-subsector"
                value={selectedSubSector}
                onChange={(e) => setSelectedSubSector(e.target.value)}
                className="w-full bg-white border border-border p-2 text-xs focus:outline-none font-mono text-black"
              >
                <option value="ALL">ALL SUB-SECTORS</option>
                <option value="AI for Legal">AI FOR LEGAL</option>
                <option value="Multi-Agent Frameworks">MULTI-AGENT FRAMEWORKS</option>
                <option value="AI Audit Engines">AI AUDIT ENGINES</option>
                <option value="Sovereign AI Infrastructure">SOVEREIGN AI INFRASTRUCTURE</option>
                <option value="Arabic LLM Applications">ARABIC LLM APPLICATIONS</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">INGESTION STATUS</label>
              <select
                id="select-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white border border-border p-2 text-xs focus:outline-none font-mono text-black"
              >
                <option value="ALL">ALL PIPELINES</option>
                <option value="Active Ingestion">ACTIVE INGESTION</option>
                <option value="Venture Pipeline Accepted">ACCEPTED IN PORTFOLIO</option>
                <option value="Under Evaluation">UNDER EVALUATION</option>
              </select>
            </div>

          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-border p-3.5 bg-white flex flex-col justify-between">
              <span className="text-[8px] text-zinc-400 font-bold uppercase block">TOTAL INVESTED PORTFOLIO SEED</span>
              <span className="text-xl font-black text-black mt-1">$14.5M USD</span>
              <span className="text-[9px] text-zinc-600 mt-1 uppercase">Tracked Across 5 Primary Verticals</span>
            </div>
            <div className="border border-border p-3.5 bg-white flex flex-col justify-between">
              <span className="text-[8px] text-zinc-400 font-bold uppercase block">AVERAGE FOUNDER HIT RATE</span>
              <span className="text-xl font-black text-black mt-1">84% SERIAL TECHS</span>
              <span className="text-[9px] text-zinc-600 mt-1 uppercase">With Prior Stanford, MIT, or Tech Exit Lineages</span>
            </div>
            <div className="border border-border p-3.5 bg-white flex flex-col justify-between">
              <span className="text-[8px] text-zinc-400 font-bold uppercase block">LAUNCH TRACTION MULTIPLE</span>
              <span className="text-xl font-black text-green-700 mt-1">4.2x ARR GROWTH</span>
              <span className="text-[9px] text-zinc-600 mt-1 uppercase">Weighted average on system-wide integrations</span>
            </div>
          </div>

          {/* Active Action Banner */}
          <div className="flex justify-between items-center bg-black text-white p-3 border border-border">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#ffffff]/90 flex items-center gap-1.5">
              <Zap size={13} className="text-white animate-pulse" />
              VENTURE BUILDER AUTOMATED PIPELINE PIPING ACTIVE
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1 bg-white text-black hover:bg-zinc-200 text-[10px] font-black uppercase cursor-pointer"
            >
              [ REGISTER STARTUP FORMATION ]
            </button>
          </div>

          {/* Startups Ingestion Directory Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredStartups.map(su => (
              <div key={su.id} className="bg-white border border-border p-4 space-y-3 hover:border-black transition-colors relative">
                
                {/* Header Row */}
                <div className="flex justify-between items-start gap-4 border-b border-zinc-100 pb-2">
                  <div>
                    <span className="text-[8px] bg-zinc-100 border border-border px-1.5 py-0.5 text-zinc-600 font-bold uppercase">
                      {su.subSector}
                    </span>
                    <h3 className="font-black text-sm text-black uppercase mt-1.5">
                      {su.name}
                    </h3>
                  </div>

                  <span className={`text-[8.5px] border px-2 py-0.5 font-bold uppercase tracking-wider ${
                    su.status === "Venture Pipeline Accepted" ? "bg-green-100 border-green-300 text-green-800" :
                    su.status === "Active Ingestion" ? "bg-blue-100 border-blue-300 text-blue-800" :
                    "bg-amber-100 border-amber-300 text-amber-800"
                  }`}>
                    {su.status}
                  </span>
                </div>

                {/* Founders section */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold">
                    <Users size={12} className="text-zinc-400" />
                    FOUNDED BY: <strong className="text-black uppercase">{su.founders.join(", ")}</strong>
                  </div>
                  <p className="text-[9.5px] text-zinc-600 font-sans italic leading-tight">
                    Background: {su.founderBackgrounds}
                  </p>
                </div>

                {/* Summary / Core Idea */}
                <p className="text-[10.5px] leading-relaxed text-zinc-700 font-sans border-t border-dashed border-zinc-100 pt-2">
                  {su.summary}
                </p>

                {/* Multi-layered stats parameters */}
                <div className="grid grid-cols-2 gap-2 bg-zinc-50 p-2.5 border border-zinc-200 font-mono text-[9.5px]">
                  <div>
                    <span className="text-zinc-400 block text-[8px] uppercase font-bold">SEED FUNDING RECEIVED:</span>
                    <strong className="text-black">{su.seedInvestment}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[8px] uppercase font-bold">CAP VALUATION MATRIX:</span>
                    <strong className="text-black">{su.valuationCap}</strong>
                  </div>
                  <div className="col-span-2 border-t border-zinc-200/50 pt-1.5 mt-1">
                    <span className="text-zinc-400 block text-[8px] uppercase font-bold">LAUNCH TRACTION INDICATORS:</span>
                    <strong className="text-green-700">{su.launchTraction}</strong>
                  </div>
                </div>

                {/* Footer Info Row */}
                <div className="flex justify-between items-center pt-2.5 border-t border-zinc-100 text-[9px] text-zinc-500">
                  <span>FORMATION DATE: <strong className="text-black">{su.formationDate}</strong></span>
                  <span className="uppercase text-black font-bold">ROUND: {su.recentFundingRound}</span>
                </div>

              </div>
            ))}
          </div>

        </>
      ) : (
        /* ======================================================== */
        /* LIVE FORMATIONS & FUNDING CHANNELS INGESTION FEED        */
        /* ======================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel: Live Signal stream */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex justify-between items-center border-b border-border pb-2">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider">MUNICIPAL AND REGISTRATION WEBHOOK TRIGGERS</span>
                <h3 className="font-black text-black uppercase text-sm">EARLY-STAGE DEEPTECH FORMATIONS ALERT MATRIX</h3>
              </div>

              <button
                onClick={handleRefreshAlerts}
                disabled={isRefreshingFeed}
                className="px-2.5 py-1.5 border border-border bg-white hover:border-black text-[9px] font-bold uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={11} className={isRefreshingFeed ? "animate-spin" : ""} />
                {isRefreshingFeed ? "SCANNING REGISTRIES..." : "POLL MUNICIPAL REGISTRIES"}
              </button>
            </div>

            <p className="text-[10.5px] text-zinc-600 font-sans leading-relaxed">
              These signals are continuous, direct ledger extractions of artificial intelligence and machine learning business formations filed at Abu Dhabi Global Market (ADGM), Riyadh King Abdullah Financial District (KAFD), and Oman tech clusters.
            </p>

            <div className="space-y-3">
              {formationAlerts.map(al => (
                <div key={al.id} className="border border-border bg-white p-3.5 space-y-3 hover:border-black/50 transition-colors flex flex-col justify-between">
                  
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[8px] bg-zinc-100 border border-border px-1.5 py-0.5 text-zinc-600 font-bold uppercase tracking-wider block w-max">
                        {al.subSector}
                      </span>
                      <h4 className="font-black text-black uppercase mt-1 text-[11.5px]">{al.companyName}</h4>
                    </div>

                    <span className="text-[9px] text-zinc-500 font-bold">{al.timestamp} // {al.source}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono leading-relaxed bg-zinc-50 p-2.5 border border-zinc-200">
                    <div>
                      <span className="text-zinc-400 block text-[8px] uppercase font-bold">PROPOSED FOUNDERS:</span>
                      <strong className="text-black">{al.founders}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[8px] uppercase font-bold">FUNDING SIGNAL INTENSITY:</span>
                      <strong className="text-red-700">{al.fundingSignal}</strong>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                    <span className="text-[9px] text-zinc-500 uppercase">
                      Ingestion Status: <strong className={al.ingested ? "text-green-700" : "text-amber-700"}>{al.ingested ? "SYSTEM_INGESTED" : "AWAITING_TRIGGER"}</strong>
                    </span>

                    <button
                      disabled={al.ingested}
                      onClick={() => handleIngestToVentureBuilder(al.id)}
                      className={`px-3 py-1 border text-[9px] font-bold uppercase cursor-pointer transition-colors ${
                        al.ingested 
                          ? "bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed" 
                          : "bg-black text-white border-black hover:bg-zinc-800"
                      }`}
                    >
                      {al.ingested ? "INGESTED" : "TRIGGER VENTURE BUILDER INGEST"}
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Right panel: Automations Webhook & Pipe Settings */}
          <div className="lg:col-span-4 bg-surface border border-border p-4 space-y-4">
            
            <div className="border-b border-border pb-2">
              <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider font-mono">AUTOMATED SYSTEM PIPE</span>
              <h3 className="font-black text-black uppercase text-sm">VENTURE PIPELINE INTEGRATION</h3>
            </div>

            <p className="text-[10.5px] text-zinc-600 font-sans leading-relaxed">
              Feed early-stage formation events directly into internal databases or external team channels using custom API webhooks.
            </p>

            <form onSubmit={handleSendWebhook} className="space-y-3.5 font-mono text-black">
              <div>
                <label className="text-[8.5px] text-zinc-500 font-bold uppercase block mb-1">VENTURE BUILDER WEBHOOK URL</label>
                <input
                  type="url"
                  required
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-white border border-border p-2 text-[10px] focus:outline-none focus:border-black font-mono"
                />
              </div>

              <div>
                <label className="text-[8.5px] text-zinc-500 font-bold uppercase block mb-1">MIME TYPE STRUCTURE</label>
                <input
                  type="text"
                  disabled
                  value="application/json; charset=utf-8"
                  className="w-full bg-zinc-100 border border-border p-2 text-[10px] focus:outline-none"
                />
              </div>

              <div className="bg-white border border-border p-2.5 font-mono text-[8px] text-zinc-500 space-y-1">
                <span className="font-bold text-black uppercase block border-b border-zinc-150 pb-0.5 mb-1">PAYLOAD STRUCTURE SCHEMA</span>
                <div>{`{`}</div>
                <div className="pl-2">{`"event": "AI_FORMATION_INGESTION",`}</div>
                <div className="pl-2">{`"source_agency": "ADGM_MUNICIPAL",`}</div>
                <div className="pl-2">{`"timestamp_utc": "${new Date().toISOString()}",`}</div>
                <div className="pl-2">{`"payload": { "name": "JurisAgent", "seed": "$2.4M" }`}</div>
                <div>{`}`}</div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-black text-white hover:bg-zinc-800 text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {webhookSent ? (
                  <>
                    <Check size={12} strokeWidth={3} className="text-green-400" /> WEBHOOK TRIGGER OK
                  </>
                ) : (
                  <>
                    <Send size={11} /> FIRE TEST PIPELINE PAYLOAD
                  </>
                )}
              </button>
            </form>

            <div className="bg-white border border-border p-3 space-y-1.5 text-[9.5px] leading-tight text-zinc-500">
              <span className="font-black text-black uppercase block">AUTOMATION PIPELINE SUCCESS</span>
              <p className="font-sans">This webhook links continuously with our core document intelligence notebook to auto-compile executive RAG summaries of new companies inside your active Workspace.</p>
            </div>

          </div>

        </div>
      )}

      {/* Add Startup Modal Dialogue */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border max-w-xl w-full p-6 space-y-4 text-xs text-black">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="font-black uppercase text-[11px] flex items-center gap-1.5">
                <Plus size={14} /> PROPOSE DIGITAL AI STARTUP FORMATION
              </span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-red-600 hover:underline font-bold text-[10px]"
              >
                [CLOSE]
              </button>
            </div>

            <form onSubmit={handleAddStartup} className="space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="e.g. Heuristic Legal"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">AI Sector Category</label>
                  <select
                    value={newSubSector}
                    onChange={(e) => setNewSubSector(e.target.value as any)}
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none"
                  >
                    <option value="AI for Legal">AI for Legal</option>
                    <option value="Multi-Agent Frameworks">Multi-Agent Frameworks</option>
                    <option value="AI Audit Engines">AI Audit Engines</option>
                    <option value="Sovereign AI Infrastructure">Sovereign AI Infrastructure</option>
                    <option value="Arabic LLM Applications">Arabic LLM Applications</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Founders (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={newFounders}
                    onChange={(e) => setNewFounders(e.target.value)}
                    placeholder="e.g. Samer Al-Aswad, Nadia K."
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Founder Academic Backgrounds</label>
                  <input
                    type="text"
                    value={newFounderBg}
                    onChange={(e) => setNewFounderBg(e.target.value)}
                    placeholder="e.g. Stanford NLP Research, former Google Senior dev"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Seed Investment Amount</label>
                  <input
                    type="text"
                    value={newSeedAmount}
                    onChange={(e) => setNewSeedAmount(e.target.value)}
                    placeholder="e.g. $1.5M"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Cap Valuation Target</label>
                  <input
                    type="text"
                    value={newValuation}
                    onChange={(e) => setNewValuation(e.target.value)}
                    placeholder="e.g. $12.0M"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Launch Traction KPI</label>
                  <input
                    type="text"
                    value={newTraction}
                    onChange={(e) => setNewTraction(e.target.value)}
                    placeholder="e.g. 15 pilot groups live"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase block">Executive Project Summary</label>
                <textarea
                  required
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Explain their core technology strategy, model configurations, and target compliance frameworks..."
                  className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-black text-white font-bold uppercase hover:bg-zinc-800 cursor-pointer text-xs animate-none"
              >
                PROPOSE STARTUP TO SYSTEM REGISTRY & WEBHOOK INGEST
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
