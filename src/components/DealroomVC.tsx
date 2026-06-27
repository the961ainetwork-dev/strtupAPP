import React, { useState, useMemo } from "react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, CartesianGrid, Legend, LineChart, Line, 
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from "recharts";
import { 
  TrendingUp, Award, Map, BarChart3, Rocket, Globe, 
  Users, Navigation, Filter, Share2, Search, ExternalLink, 
  Plus, Calendar, ArrowUpRight, DollarSign, Briefcase, FileText
} from "lucide-react";

interface DealroomVCProps {
  onAppendToCanvas: (text: string) => void;
  userEmail?: string;
}

// ==========================================
// 1. DATASETS FOR EXTRAPOLATED DEALROOM INFO
// ==========================================

// VC Investment Funding Transactions
const FUNDING_DEALS = [
  { id: "deal-1", startup: "SovereignLLM", sector: "Deep Tech", location: "Germany", amount: 150, round: "Series B", date: "2026-06-15", lead: "DTCP", notes: "Sovereign cloud integration focused on EU compliance." },
  { id: "deal-2", startup: "CognitiveAgents", sector: "Enterprise Software", location: "United States", amount: 85, round: "Series A", date: "2026-06-12", lead: "Founder Collective", notes: "Multi-agent orchestration layers for Fortune 500 banks." },
  { id: "deal-3", startup: "HeliosFusion", sector: "Energy/Climate", location: "United Kingdom", amount: 210, round: "Series C", date: "2026-06-10", lead: "Temasek", notes: "Commercial tokamak pilot scale rollout in Europe." },
  { id: "deal-4", startup: "QuantShield", sector: "Deep Tech", location: "France", amount: 45, round: "Seed", date: "2026-06-08", lead: "Eurazeo", notes: "Post-quantum security layers for enterprise networks." },
  { id: "deal-5", startup: "AuraBiotech", sector: "Healthtech", location: "Switzerland", amount: 120, round: "Series B", date: "2026-06-05", lead: "Sofinnova", notes: "AI-designed antibodies for oncology pipelines." },
  { id: "deal-6", startup: "LedgerSafe", sector: "Fintech", location: "Singapore", amount: 30, round: "Series A", date: "2026-05-28", lead: "Vertex Ventures", notes: "Custodial audit framework for sovereign asset registries." },
  { id: "deal-7", startup: "CarbonTrace", sector: "Energy/Climate", location: "Sweden", amount: 18, round: "Seed", date: "2026-05-24", lead: "EQT Ventures", notes: "Scope-3 emissions tracing API for heavy manufacturing." },
  { id: "deal-8", startup: "OmniRobotics", sector: "Deep Tech", location: "Japan", amount: 95, round: "Series B", date: "2026-05-20", lead: "SoftBank Vision Fund", notes: "Humanoid factory operators utilizing multi-modal VLM models." },
  { id: "deal-9", startup: "ZenPayroll", sector: "Fintech", location: "Brazil", amount: 65, round: "Series C", date: "2026-05-15", lead: "Kaszek", notes: "Decentralized automated corporate payroll for LatAm." },
  { id: "deal-10", startup: "DocuVerify AI", sector: "Enterprise Software", location: "United States", amount: 12, round: "Pre-Seed", date: "2026-05-10", lead: "Y Combinator", notes: "Grounded RAG agent for legal compliance and lease reviews." }
];

// Funding Trend Over Years
const ANNUAL_FUNDING_TREND = [
  { year: "2020", totalFunding: 340, dealCount: 14200, avgDeal: 23.9 },
  { year: "2021", totalFunding: 630, dealCount: 21800, avgDeal: 28.8 },
  { year: "2022", totalFunding: 415, dealCount: 18100, avgDeal: 22.9 },
  { year: "2023", totalFunding: 285, dealCount: 15400, avgDeal: 18.5 },
  { year: "2024", totalFunding: 350, dealCount: 16900, avgDeal: 20.7 },
  { year: "2025", totalFunding: 420, dealCount: 17800, avgDeal: 23.5 },
  { year: "2026 (Proj)", totalFunding: 495, dealCount: 19500, avgDeal: 25.3 }
];

// Funding Breakdown by Sector (2025/2026)
const SECTOR_BREAKDOWN = [
  { name: "Deep Tech", value: 145, color: "#00FF9C" },
  { name: "Enterprise Software", value: 125, color: "#a855f7" },
  { name: "Energy/Climate", value: 110, color: "#3b82f6" },
  { name: "Healthtech", value: 85, color: "#ec4899" },
  { name: "Fintech", value: 65, color: "#eab308" },
  { name: "Other", value: 45, color: "#6b7280" }
];

// Power Law: Top Venture Capital Investors by Realized Outcomes
const POWER_LAW_INVESTORS = [
  { rank: 1, firm: "Sequoia Capital", exitsCount: 142, totalValue: 840, primarySector: "Multi-sector", hitRate: "48%", topExit: "Stripe / Snowflake" },
  { rank: 2, firm: "Andreessen Horowitz", exitsCount: 115, totalValue: 620, primarySector: "Enterprise/Web3", hitRate: "42%", topExit: "Coinbase / Airbnb" },
  { rank: 3, firm: "Accel", exitsCount: 98, totalValue: 480, primarySector: "SaaS/Security", hitRate: "45%", topExit: "Slack / CrowdStrike" },
  { rank: 4, firm: "Y Combinator", exitsCount: 220, totalValue: 450, primarySector: "Early Stage", hitRate: "35%", topExit: "Dropbox / Airbnb" },
  { rank: 5, firm: "Benchmark", exitsCount: 65, totalValue: 390, primarySector: "Platforms", hitRate: "55%", topExit: "Uber / Elastic" },
  { rank: 6, firm: "Bessemer Venture Partners", exitsCount: 78, totalValue: 310, primarySector: "Cloud SaaS", hitRate: "39%", topExit: "Twilio / Shopify" },
  { rank: 7, firm: "Index Ventures", exitsCount: 72, totalValue: 295, primarySector: "Consumer/Fintech", hitRate: "41%", topExit: "Adyen / Figma" },
  { rank: 8, firm: "Founders Fund", exitsCount: 54, totalValue: 280, primarySector: "Deep Tech/Space", hitRate: "46%", topExit: "Palantir / SpaceX" }
];

// Market Maps Landscaped Companies
const MARKET_MAP_SECTORS = {
  "Generative AI Infrastructure": [
    { category: "Core LLMs & Foundational Models", companies: ["OpenAI", "Anthropic", "Mistral AI", "DeepSeek", "Cohere", "SovereignLLM"] },
    { category: "Vector Ops & RAG Middleware", companies: ["Pinecone", "Milvus", "LlamaIndex", "LangChain", "Qdrant", "Chroma"] },
    { category: "Compute Orchestration & Hardware", companies: ["NVIDIA DGX", "CoreWeave", "Lambda Labs", "Together AI", "Groq"] },
    { category: "Agentic Interface & Workspace Apps", companies: ["Cognition AI", "CrewAI", "Cursor", "MultiOn", "Harvey AI", "Synthesis Cockpit"] }
  ],
  "Sovereign Compute & National Infrastructure": [
    { category: "Sovereign Cloud Operators", companies: ["Scaleway (EU)", "STC Cloud (MEA)", "Sakura Internet (JP)", "SovereignGrid (US)"] },
    { category: "Cryptographic Security & HSM", companies: ["QuantShield", "HashiCorp", "KMS Sovereign", "SandboxAQ"] },
    { category: "Data Sovereignty Compliance Engines", companies: ["OneTrust", "Securiti.ai", "InCountry", "SovereignVault"] }
  ],
  "Climate Fintech & Grid Tech": [
    { category: "Carbon Credit Markets", companies: ["Pachama", "Cloverly", "Flowcarbon", "CarbonTrace"] },
    { category: "Grid Load Optimization", companies: ["Zap Energy", "GridTek", "WeaveGrid", "HeliosFusion"] },
    { category: "ESG Auditing Standards", companies: ["Watershed", "Persefoni", "Sweep", "SustainAI"] }
  ]
};

// Valuation Multiples SaaS EV/ARR and segment trends
const SEGMENT_MULTIPLES = [
  { year: "2020", SaaS: 16.5, Deeptech: 9.2, Marketplace: 6.8, Hardware: 3.5 },
  { year: "2021", SaaS: 31.4, Deeptech: 14.8, Marketplace: 12.5, Hardware: 5.2 },
  { year: "2022", SaaS: 12.8, Deeptech: 8.5, Marketplace: 5.4, Hardware: 2.8 },
  { year: "2023", SaaS: 7.2, Deeptech: 6.1, Marketplace: 3.9, Hardware: 2.1 },
  { year: "2024", SaaS: 8.9, Deeptech: 8.4, Marketplace: 4.5, Hardware: 2.6 },
  { year: "2025", SaaS: 10.5, Deeptech: 11.2, Marketplace: 5.2, Hardware: 3.1 },
  { year: "2026 (YTD)", SaaS: 11.8, Deeptech: 13.5, Marketplace: 5.9, Hardware: 3.4 }
];

// Startup Journey Benchmarks from Seed -> Series A
const JOURNEY_BENCHMARKS = [
  { metric: "Annual Recurring Revenue (ARR)", seedMin: "$200k", seriesAMin: "$1.5m - $2.5m", relevance: "Core baseline for software products" },
  { metric: "Year-over-Year Growth Rate", seedMin: "N/A (Product building)", seriesAMin: "150% - 300% YoY", relevance: "Proves enterprise scalability" },
  { metric: "Net Revenue Retention (NRR)", seedMin: "N/A", seriesAMin: "110% - 135%", relevance: "Validates customer success/expansion" },
  { metric: "Core Team Size", seedMin: "3 - 8 FTEs", seriesAMin: "15 - 35 FTEs", relevance: "Requires middle management layering" },
  { metric: "Time to Raise (Months)", seedMin: "2 - 4 months", seriesAMin: "4 - 6 months", relevance: "Diligence is deeper in 2026" },
  { metric: "Pre-money Valuation Range", seedMin: "$6m - $12m", seriesAMin: "$25m - $55m", relevance: "Varies by sector and agentic IP" }
];

// Ecosystem Index: Countries and hubs benchmarked
const ECOSYSTEM_RANKINGS = [
  { rank: 1, hub: "Silicon Valley", country: "United States", score: 98.5, activeUnicorns: 260, annualFundings: 142.5, policyIndex: "9.2/10" },
  { rank: 2, hub: "London", country: "United Kingdom", score: 89.2, activeUnicorns: 48, annualFundings: 24.8, policyIndex: "8.8/10" },
  { rank: 3, hub: "New York", country: "United States", score: 87.5, activeUnicorns: 62, annualFundings: 29.5, policyIndex: "8.5/10" },
  { rank: 4, hub: "Paris", country: "France", score: 84.1, activeUnicorns: 34, annualFundings: 18.2, policyIndex: "9.4/10" },
  { rank: 5, hub: "Tel Aviv", country: "Israel", score: 82.6, activeUnicorns: 28, annualFundings: 11.4, policyIndex: "8.0/10" },
  { rank: 6, hub: "Munich/Berlin", country: "Germany", score: 81.3, activeUnicorns: 29, annualFundings: 14.1, policyIndex: "8.9/10" },
  { rank: 7, hub: "Singapore", country: "Singapore", score: 79.8, activeUnicorns: 18, annualFundings: 9.8, policyIndex: "9.5/10" },
  { rank: 8, hub: "Tokyo", country: "Japan", score: 76.5, activeUnicorns: 11, annualFundings: 7.2, policyIndex: "9.0/10" }
];

// University and Corporate Talent Origin Pools
const TALENT_ORIGINS = {
  universities: [
    { name: "Stanford University", count: 840, primaryHub: "Silicon Valley", focus: "AI & Systems Architecture" },
    { name: "Massachusetts Institute of Technology (MIT)", count: 620, primaryHub: "Boston / NY", focus: "Robotics & Quantum Hardware" },
    { name: "UC Berkeley", count: 590, primaryHub: "Silicon Valley", focus: "Open Source AI & BioTech" },
    { name: "Harvard University", count: 480, primaryHub: "New York", focus: "Enterprise Software & Bio" },
    { name: "University of Cambridge / Oxford", count: 410, primaryHub: "London", focus: "Deep Tech & LLM Research" },
    { name: "INSEAD", count: 280, primaryHub: "Paris / Singapore", focus: "B2B SaaS Go-To-Market" }
  ],
  alumniNetworks: [
    { group: "OpenAI Syndicate", alumniCount: 45, startupsFounded: 18, coreFocus: "Cognitive Multi-Agents & Robotics" },
    { group: "Stripe Alumni Network", alumniCount: 112, startupsFounded: 42, coreFocus: "Fintech Core & Billing Middleware" },
    { group: "Google DeepMind Pioneers", alumniCount: 54, startupsFounded: 22, coreFocus: "Sovereign AI Infrastructure" },
    { group: "Palantir Intelligence Circle", alumniCount: 88, startupsFounded: 31, coreFocus: "Defense Tech & Mission Systems" },
    { group: "SpaceX Aerospace Network", alumniCount: 39, startupsFounded: 12, coreFocus: "Fusion Energy & Orbital Logics" }
  ]
};

// Geo Maps Ecosystem Coordinates for Custom SVG Map plot representation
const GEO_HUBS = [
  { name: "North America (Valley/NY)", x: 25, y: 35, funding: 172.0, unicorns: 322, status: "DOMINANT" },
  { name: "Western Europe (London/Paris/Munich)", x: 48, y: 30, funding: 57.1, unicorns: 111, status: "GROWING" },
  { name: "Israel (Tel Aviv)", x: 55, y: 42, funding: 11.4, unicorns: 28, status: "HIGH_DENSITY" },
  { name: "Asia-Pacific (Tokyo/Singapore/Syd)", x: 80, y: 55, funding: 24.5, unicorns: 42, status: "EMERGING" },
  { name: "Latin America (São Paulo)", x: 38, y: 75, funding: 8.5, unicorns: 19, status: "INFLECTING" }
];

// Extrapolated Curated News Articles
const EXTRAPOLATED_NEWS = [
  { id: "news-1", category: "VC Investment Dashboard", date: "2026-06-25", title: "Global Funding Accelerates 15% in Q2", body: "Led by massive sovereign AI computational infrastructure purchases and fusion energy breakthroughs. Europe matches historical peaks.", source: "Dealroom Analytics" },
  { id: "news-2", category: "Power Law", date: "2026-06-20", title: "Sequoia & Accel Double Down on Agentic Software", body: "Analysis shows venture giants are shortening decision windows to less than 7 days for developers building in the vector reasoning stack.", source: "Silicon Valley Dispatch" },
  { id: "news-3", category: "Market Maps", date: "2026-06-18", title: "Unveiling the Sovereign Computing Stack Landscape", body: "We map 48 companies building in the localized sovereign hardware, private vectors, and non-US attention mechanism layers.", source: "Dealroom Research" },
  { id: "news-4", category: "Multiples & Exits", date: "2026-06-14", title: "Enterprise SaaS Valuation Multiples Stabilize", body: "After the volatility of 2021-24, enterprise SaaS multi-baggers settled at an average of 10.5x to 11.8x EV/ARR with strong rule-of-40 guidelines.", source: "Exits Monitor" },
  { id: "news-5", category: "Startup Journey", date: "2026-06-08", title: "The Series A Chasm Widens in AI space", body: "While Seed funding is abundant, Series A investors are requiring fully validated ARR of at least $1.5m with demonstrable expansion loops.", source: "Venture Playbook" },
  { id: "news-6", category: "Ecosystem Index", date: "2026-06-03", title: "Paris Threatens London's Early Stage Supremacy", body: "Backed by aggressive research grants, tech tax exemptions, and DeepMind/Meta research alumni, French hubs capture 32% of early AI rounds.", source: "Ecosystem Hubs Report" },
  { id: "news-7", category: "Founder and Operator Talent", date: "2026-05-28", title: "The OpenAI Mafia Emerges as Major Syndicate", body: "Former research directors and operators from safety groups raise over $1.2B in total across 14 new ventures launched in Silicon Valley.", source: "Talent Vector Index" },
  { id: "news-8", category: "Geo Maps", date: "2026-05-22", title: "Sovereign Computations Fragmenting Global Map", body: "New policies in APAC and Europe force data physical storage on-premise, generating secondary capital booms for regional data silos.", source: "Geopolitical Tech Brief" }
];


export const DealroomVC: React.FC<DealroomVCProps> = ({ 
  onAppendToCanvas,
  userEmail = "maanbarazy@gmail.com"
}) => {
  const [activeTab, setActiveTab] = useState<string>("VC Investment Dashboard");
  
  // Filters for VC Investment Dashboard
  const [sectorFilter, setSectorFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [roundFilter, setRoundFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Market Maps Selected Landscape
  const [activeLandscape, setActiveLandscape] = useState<string>("Generative AI Infrastructure");

  // Selected Geo Map Node Details
  const [selectedGeoNode, setSelectedGeoNode] = useState<typeof GEO_HUBS[0] | null>(GEO_HUBS[0]);

  // -------------------------
  // Filtering Logic for Deals
  // -------------------------
  const filteredDeals = useMemo(() => {
    return FUNDING_DEALS.filter(deal => {
      const matchSector = sectorFilter === "All" || deal.sector === sectorFilter;
      const matchLocation = locationFilter === "All" || 
        (locationFilter === "US" && deal.location === "United States") ||
        (locationFilter === "Europe" && ["Germany", "United Kingdom", "France", "Sweden", "Switzerland"].includes(deal.location)) ||
        (locationFilter === "Asia-Pacific" && ["Singapore", "Japan"].includes(deal.location)) ||
        (locationFilter === "Latin America" && deal.location === "Brazil");
      const matchRound = roundFilter === "All" || deal.round === roundFilter;
      const matchSearch = searchQuery === "" || 
        deal.startup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchSector && matchLocation && matchRound && matchSearch;
    });
  }, [sectorFilter, locationFilter, roundFilter, searchQuery]);

  // Metrics summary based on filtered deals
  const totalFilteredFunding = filteredDeals.reduce((sum, d) => sum + d.amount, 0);
  const avgFilteredDeal = filteredDeals.length > 0 ? Math.round(totalFilteredFunding / filteredDeals.length) : 0;

  // Curated extrapolated news for active Tab
  const activeNews = useMemo(() => {
    return EXTRAPOLATED_NEWS.filter(news => news.category === activeTab);
  }, [activeTab]);

  // -------------------------
  // Action Handlers (Exporting Data to scratchpad canvas)
  // -------------------------
  const handleExportBriefing = () => {
    let reportText = "";
    const timestamp = new Date().toLocaleTimeString();
    
    if (activeTab === "VC Investment Dashboard") {
      reportText = `### Dealroom.co Cloned VC Investment Briefing (${timestamp})
- **Active Filter State**: Sector: ${sectorFilter} | Location: ${locationFilter} | Round: ${roundFilter}
- **Total Registered Funding**: $${totalFilteredFunding}M across ${filteredDeals.length} transaction pipelines.
- **Average Round Size**: $${avgFilteredDeal}M.
- **Top Direct Deal**: ${filteredDeals[0]?.startup || "N/A"} raising $${filteredDeals[0]?.amount || 0}M led by ${filteredDeals[0]?.lead || "N/A"}.

#### Live Transaction Logs:
${filteredDeals.map(d => `* **${d.startup}** (${d.round} - ${d.location}): Raised **$${d.amount}M** backed by *${d.lead}*. Notes: ${d.notes}`).join("\n")}
`;
    } else if (activeTab === "Power Law") {
      reportText = `### Dealroom.co Cloned Investor Power Law Briefing (${timestamp})
Elite venture capital syndicates ranked by absolute realized exit count and total equity value unlocked.

#### Top Tier Rankings:
${POWER_LAW_INVESTORS.map(i => `* **Rank #${i.rank} - ${i.firm}**: ${i.exitsCount} exits, unlocking **$${i.totalValue}B** in Enterprise Value. Primary domain: ${i.primarySector}. Hit rate: ${i.hitRate}. Top Exit asset: ${i.topExit}`).join("\n")}
`;
    } else if (activeTab === "Market Maps") {
      const landscapeData = MARKET_MAP_SECTORS[activeLandscape as keyof typeof MARKET_MAP_SECTORS] || [];
      reportText = `### Dealroom.co Curated Market Map Landscape: ${activeLandscape} (${timestamp})
Visual corporate clustering representing high-potential technology ecosystems.

${landscapeData.map(l => `#### ${l.category}:
${l.companies.map(c => `* **${c}**`).join(", ")}`).join("\n\n")}
`;
    } else if (activeTab === "Multiples & Exits") {
      reportText = `### Dealroom.co Cloned Valuation Multiples Analysis (${timestamp})
Tracking EV/ARR & EV/Revenue multiples across deep software and hardware vectors.

#### Historic Multiple Sequences (SaaS vs Deeptech vs Marketplace):
${SEGMENT_MULTIPLES.map(m => `* **Year ${m.year}**: SaaS Multiple: ${m.SaaS}x | Deep Tech: ${m.Deeptech}x | Marketplace: ${m.Marketplace}x`).join("\n")}
`;
    } else if (activeTab === "Startup Journey") {
      reportText = `### Dealroom.co Cloned Startup Journey benchmarks (${timestamp})
Quantified thresholds to guide capital transitions from Pre-Seed → Seed → Series A.

${JOURNEY_BENCHMARKS.map(j => `* **${j.metric}**: Seed limit: ${j.seedMin} | Series A baseline: ${j.seriesAMin}. Relevance: ${j.relevance}`).join("\n")}
`;
    } else if (activeTab === "Ecosystem Index") {
      reportText = `### Dealroom.co Ecosystem Index Benchmarking (${timestamp})
Top global hubs evaluated against sovereign venture funding and regulatory friendliness.

${ECOSYSTEM_RANKINGS.map(r => `* **Rank #${r.rank} - ${r.hub}** (${r.country}): Index Score: ${r.score} | Unicorn Count: ${r.activeUnicorns} | Funding Volume: $${r.annualFundings}B/yr`).join("\n")}
`;
    } else if (activeTab === "Founder and Operator Talent") {
      reportText = `### Dealroom.co Talent Syndicate Mapping (${timestamp})
Tracking human capital migrations and high-performance origin pools.

#### Leading Academic Hubs:
${TALENT_ORIGINS.universities.map(u => `* **${u.name}**: Produced ${u.count} founders active in ${u.primaryHub}. Primary expertise: ${u.focus}`).join("\n")}

#### Alumni Mafia Ecosystems:
${TALENT_ORIGINS.alumniNetworks.map(a => `* **${a.group}**: ${a.alumniCount} core members launching ${a.startupsFounded} independent startups. Domain focus: ${a.coreFocus}`).join("\n")}
`;
    } else if (activeTab === "Geo Maps") {
      reportText = `### Dealroom.co Geopolitical Venture Plot Briefing (${timestamp})
Macro regional venture capital metrics from geographic mapped indexes.

${GEO_HUBS.map(g => `* **${g.name}** (Ecosystem state: ${g.status}): Annual funding volume: $${g.funding}B | Active Unicorn Count: ${g.unicorns}`).join("\n")}
`;
    }

    onAppendToCanvas(reportText);
  };

  return (
    <div id="dealroom-vc-root" className="h-full flex flex-col bg-[#050505] text-[#e0e0e0] overflow-hidden">
      
      {/* Subheader Status Strip */}
      <div className="bg-[#0c0c0e] border-b border-border px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-[#00FF9C] size-4 animate-pulse" />
          <div>
            <span className="font-mono text-[9px] text-[#00FF9C] uppercase tracking-widest leading-none block">DEALROOM.CO LIVE PORTAL</span>
            <span className="font-sans text-xs font-black text-white uppercase mt-0.5 block tracking-tight">GLOBAL VC & SOVEREIGN COMPUTER INTELLIGENCE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-export-vc-brief"
            onClick={handleExportBriefing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/30 hover:bg-accent hover:text-black text-accent font-mono text-[10px] font-bold uppercase transition-all rounded-none cursor-pointer"
          >
            <Share2 size={11} /> EXPORT THIS ACTIVE DATA TO CANVAS
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* SIDE BAR: Resource pages menu */}
        <aside className="w-64 border-r border-border bg-[#09090b] flex flex-col shrink-0 overflow-y-auto scrollbar-custom">
          
          <div className="p-3 bg-black/40 border-b border-border font-mono text-[9px] text-text-dim tracking-wider uppercase">
            VENTURE WORKFLOW INDEX
          </div>

          <nav className="p-2 space-y-1">
            <button
              onClick={() => setActiveTab("VC Investment Dashboard")}
              className={`w-full text-left p-2.5 font-mono text-[11px] font-bold tracking-tight uppercase flex items-center justify-between rounded-none transition-all cursor-pointer border ${
                activeTab === "VC Investment Dashboard" 
                  ? "bg-accent/10 border-accent text-white" 
                  : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUp size={12} className={activeTab === "VC Investment Dashboard" ? "text-accent" : ""} />
                VC INVESTMENT COCKPIT
              </span>
              <span className="text-[8px] bg-[#00FF9C]/20 text-[#00FF9C] px-1 font-mono">LIVE</span>
            </button>

            <button
              onClick={() => setActiveTab("Power Law")}
              className={`w-full text-left p-2.5 font-mono text-[11px] font-bold tracking-tight uppercase flex items-center justify-between rounded-none transition-all cursor-pointer border ${
                activeTab === "Power Law" 
                  ? "bg-accent/10 border-accent text-white" 
                  : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Award size={12} className={activeTab === "Power Law" ? "text-accent" : ""} />
                🏆 POWER LAW INVESTORS
              </span>
            </button>

            <button
              onClick={() => setActiveTab("Market Maps")}
              className={`w-full text-left p-2.5 font-mono text-[11px] font-bold tracking-tight uppercase flex items-center justify-between rounded-none transition-all cursor-pointer border ${
                activeTab === "Market Maps" 
                  ? "bg-accent/10 border-accent text-white" 
                  : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Map size={12} className={activeTab === "Market Maps" ? "text-accent" : ""} />
                🗺️ MARKET LANDSCAPES
              </span>
            </button>

            <button
              onClick={() => setActiveTab("Multiples & Exits")}
              className={`w-full text-left p-2.5 font-mono text-[11px] font-bold tracking-tight uppercase flex items-center justify-between rounded-none transition-all cursor-pointer border ${
                activeTab === "Multiples & Exits" 
                  ? "bg-accent/10 border-accent text-white" 
                  : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <BarChart3 size={12} className={activeTab === "Multiples & Exits" ? "text-accent" : ""} />
                📊 MULTIPLES & EXITS
              </span>
            </button>

            <button
              onClick={() => setActiveTab("Startup Journey")}
              className={`w-full text-left p-2.5 font-mono text-[11px] font-bold tracking-tight uppercase flex items-center justify-between rounded-none transition-all cursor-pointer border ${
                activeTab === "Startup Journey" 
                  ? "bg-accent/10 border-accent text-white" 
                  : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Rocket size={12} className={activeTab === "Startup Journey" ? "text-accent" : ""} />
                🚀 STARTUP JOURNEY
              </span>
            </button>

            <button
              onClick={() => setActiveTab("Ecosystem Index")}
              className={`w-full text-left p-2.5 font-mono text-[11px] font-bold tracking-tight uppercase flex items-center justify-between rounded-none transition-all cursor-pointer border ${
                activeTab === "Ecosystem Index" 
                  ? "bg-accent/10 border-accent text-white" 
                  : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Globe size={12} className={activeTab === "Ecosystem Index" ? "text-accent" : ""} />
                🌍 ECOSYSTEM INDEX
              </span>
            </button>

            <button
              onClick={() => setActiveTab("Founder and Operator Talent")}
              className={`w-full text-left p-2.5 font-mono text-[11px] font-bold tracking-tight uppercase flex items-center justify-between rounded-none transition-all cursor-pointer border ${
                activeTab === "Founder and Operator Talent" 
                  ? "bg-accent/10 border-accent text-white" 
                  : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Users size={12} className={activeTab === "Founder and Operator Talent" ? "text-accent" : ""} />
                🧠 FOUNDER TALENT MATRIX
              </span>
            </button>

            <button
              onClick={() => setActiveTab("Geo Maps")}
              className={`w-full text-left p-2.5 font-mono text-[11px] font-bold tracking-tight uppercase flex items-center justify-between rounded-none transition-all cursor-pointer border ${
                activeTab === "Geo Maps" 
                  ? "bg-accent/10 border-accent text-white" 
                  : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Navigation size={12} className={activeTab === "Geo Maps" ? "text-accent" : ""} />
                🌐 REGIONAL GEO PLOTS
              </span>
            </button>
          </nav>

          {/* Collapsible Extrapolated News Widget Inside Side Bar */}
          <div className="mt-auto p-4 border-t border-border bg-black/40">
            <span className="font-mono text-[9px] text-[#00FF9C] tracking-wider uppercase block mb-2">
              EXTRAPOLATED REALTIME NEWS
            </span>
            
            {activeNews.length === 0 ? (
              <p className="text-[10px] text-text-dim italic">No custom news extrapolated for this view.</p>
            ) : (
              <div className="space-y-3.5">
                {activeNews.map(n => (
                  <div key={n.id} className="border-l-2 border-accent/40 pl-2 text-left">
                    <span className="text-[8px] font-mono text-zinc-500 block">{n.date} // {n.source}</span>
                    <h5 className="font-sans text-[11px] font-black text-white uppercase tracking-tight mt-0.5 leading-tight">{n.title}</h5>
                    <p className="text-[9px] text-zinc-450 mt-1 leading-normal font-mono">{n.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* MIDDLE WINDOW: Deep Content Display based on selected tab */}
        <main className="flex-grow p-5 md:p-6 overflow-y-auto scrollbar-custom bg-[#040405]">
          
          {/* ========================================================= */}
          {/* TAB 1: VC INVESTMENT DASHBOARD */}
          {/* ========================================================= */}
          {activeTab === "VC Investment Dashboard" && (
            <div className="space-y-6">
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-border pb-4 bg-black/20 p-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">GLOBAL VENTURE FUNDING MATRIX</h3>
                  <p className="text-xs text-text-dim mt-1">Live tracking and forecasting of early and late stage corporate funding transactions across technology clusters.</p>
                </div>

                {/* Filter Controls Bar */}
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <div>
                    <label className="block text-[8px] text-text-dim uppercase mb-0.5">Sector</label>
                    <select 
                      value={sectorFilter} 
                      onChange={(e) => setSectorFilter(e.target.value)}
                      className="bg-surface border border-border p-1.5 text-[10px] text-white rounded-none focus:outline-none focus:border-accent uppercase cursor-pointer"
                    >
                      <option value="All">All Sectors</option>
                      <option value="Deep Tech">Deep Tech</option>
                      <option value="Enterprise Software">Enterprise Software</option>
                      <option value="Energy/Climate">Energy/Climate</option>
                      <option value="Healthtech">Healthtech</option>
                      <option value="Fintech">Fintech</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] text-text-dim uppercase mb-0.5">Location</label>
                    <select 
                      value={locationFilter} 
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="bg-surface border border-border p-1.5 text-[10px] text-white rounded-none focus:outline-none focus:border-accent uppercase cursor-pointer"
                    >
                      <option value="All">All Locations</option>
                      <option value="US">North America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia-Pacific">Asia-Pacific</option>
                      <option value="Latin America">Latin America</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] text-text-dim uppercase mb-0.5">Round size</label>
                    <select 
                      value={roundFilter} 
                      onChange={(e) => setRoundFilter(e.target.value)}
                      className="bg-surface border border-border p-1.5 text-[10px] text-white rounded-none focus:outline-none focus:border-accent uppercase cursor-pointer"
                    >
                      <option value="All">All Rounds</option>
                      <option value="Pre-Seed">Pre-Seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="Series C">Series C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] text-text-dim uppercase mb-0.5">Search keyword</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter by startup..."
                        className="bg-surface border border-border p-1 text-[10px] text-white rounded-none focus:outline-none focus:border-accent pl-5 w-32"
                      />
                      <Search className="absolute left-1.5 top-1.5 text-zinc-500 size-2.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistical readout blocks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0c0c0e] border border-border p-4 relative">
                  <span className="font-mono text-[9px] text-text-dim uppercase block">TOTAL FUNDING DETECTED</span>
                  <span className="text-2xl font-black text-[#00FF9C] font-mono mt-1 block">
                    ${totalFilteredFunding}M
                  </span>
                  <p className="text-[9px] text-zinc-500 font-mono mt-1.5">Accumulated across active filters.</p>
                </div>

                <div className="bg-[#0c0c0e] border border-border p-4 relative">
                  <span className="font-mono text-[9px] text-text-dim uppercase block">ROUND COUNT</span>
                  <span className="text-2xl font-black text-white font-mono mt-1 block">
                    {filteredDeals.length} deals
                  </span>
                  <p className="text-[9px] text-zinc-500 font-mono mt-1.5">Direct funding milestones verified.</p>
                </div>

                <div className="bg-[#0c0c0e] border border-border p-4 relative">
                  <span className="font-mono text-[9px] text-text-dim uppercase block">AVERAGE ROUND VALUE</span>
                  <span className="text-2xl font-black text-white font-mono mt-1 block">
                    ${avgFilteredDeal}M
                  </span>
                  <p className="text-[9px] text-zinc-500 font-mono mt-1.5">Mean investment capital injection.</p>
                </div>

                <div className="bg-[#0c0c0e] border border-border p-4 relative">
                  <span className="font-mono text-[9px] text-text-dim uppercase block">PRIMARY CAPITAL HUB</span>
                  <span className="text-2xl font-black text-white font-mono mt-1 block uppercase">
                    {locationFilter === "All" ? "NORTH AMERICA" : locationFilter}
                  </span>
                  <p className="text-[9px] text-zinc-500 font-mono mt-1.5">Highest concentration by region.</p>
                </div>
              </div>

              {/* Dynamic Recharts Visualization graphs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Line Chart of Funding Trajectories over Years */}
                <div className="bg-[#0c0c0e] border border-border p-4">
                  <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>VC TRANSACTION FUNDING TRENDLINES (2020 - 2026)</span>
                    <span className="text-accent">$B raised / yr</span>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ANNUAL_FUNDING_TREND}>
                        <defs>
                          <linearGradient id="dealroomTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00FF9C" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#00FF9C" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" vertical={false} />
                        <XAxis dataKey="year" stroke="#444444" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} />
                        <YAxis stroke="#444444" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#222", fontFamily: "JetBrains Mono", fontSize: 10 }} />
                        <Area type="monotone" dataKey="totalFunding" name="Total Funding ($B)" stroke="#00FF9C" strokeWidth={2} fill="url(#dealroomTrend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Pie Chart of Sector Breakdown */}
                <div className="bg-[#0c0c0e] border border-border p-4">
                  <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>SECTOR CAPITAL ALLOCATION BREAKDOWN</span>
                    <span className="text-purple-400">Total VC volume %</span>
                  </div>
                  <div className="h-[200px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={SECTOR_BREAKDOWN}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {SECTOR_BREAKDOWN.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#222", fontFamily: "JetBrains Mono", fontSize: 10 }} />
                        <Legend wrapperStyle={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Transactions List */}
              <div className="bg-[#0c0c0e] border border-border p-4">
                <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-3 flex justify-between items-center">
                  <span>VERIFIED INVESTMENT TRANSACTIONS ({filteredDeals.length})</span>
                  <span>ALL VALUES IN USD ($) MILLIONS</span>
                </div>

                {filteredDeals.length === 0 ? (
                  <div className="py-12 text-center text-zinc-650 font-mono text-xs uppercase">
                    NO COMPLIANT TRANSACTIONS FOUND UNDER THE SELECTED SECTOR/GEOGRAPHY FILTER CORRIDORS.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="border-b border-border/80 text-text-dim text-[10px] uppercase">
                          <th className="py-2.5 px-3">STARTUP</th>
                          <th className="py-2.5 px-3">SECTOR</th>
                          <th className="py-2.5 px-3">LOCATION</th>
                          <th className="py-2.5 px-3">ROUND</th>
                          <th className="py-2.5 px-3 text-right">CAPITAL AMOUNT</th>
                          <th className="py-2.5 px-3">LEAD INVESTOR</th>
                          <th className="py-2.5 px-3">TRANSACTION DETAILS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {filteredDeals.map((deal) => (
                          <tr key={deal.id} className="hover:bg-surface/50 transition-colors">
                            <td className="py-3 px-3 font-bold text-white uppercase">{deal.startup}</td>
                            <td className="py-3 px-3 text-zinc-300">
                              <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] uppercase">{deal.sector}</span>
                            </td>
                            <td className="py-3 px-3 text-zinc-400">{deal.location}</td>
                            <td className="py-3 px-3 text-zinc-300 font-bold">{deal.round}</td>
                            <td className="py-3 px-3 text-right font-black text-[#00FF9C]">${deal.amount}M</td>
                            <td className="py-3 px-3 text-zinc-300 uppercase">{deal.lead}</td>
                            <td className="py-3 px-3 text-[10.5px] text-zinc-500 leading-normal max-w-xs truncate">{deal.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}


          {/* ========================================================= */}
          {/* TAB 2: POWER LAW (TOP INVESTORS) */}
          {/* ========================================================= */}
          {activeTab === "Power Law" && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">🏆 POWER LAW INVESTOR RATINGS</h3>
                <p className="text-xs text-text-dim mt-1">Ranking institutional venture capital players by total realized exits ($B enterprise value) and verified portfolio hit rates.</p>
              </div>

              {/* Recharts chart plotting outcomes */}
              <div className="bg-[#0c0c0e] border border-border p-4">
                <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>OUTCOMES PLOT: TOTAL EXIT VOLUME ($B) VS NUMBER OF ACCUMULATED EXITS</span>
                  <span className="text-[#00FF9C]">Size denotes capital index</span>
                </div>
                
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={POWER_LAW_INVESTORS} margin={{ left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" vertical={false} />
                      <XAxis dataKey="firm" stroke="#444444" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} />
                      <YAxis stroke="#444444" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#222", fontFamily: "JetBrains Mono", fontSize: 10 }} />
                      <Legend wrapperStyle={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                      <Bar dataKey="totalValue" name="Enterprise Value Created ($B)" fill="#00FF9C" />
                      <Bar dataKey="exitsCount" name="Verified Exits Count" fill="#a855f7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Investor rankings table */}
              <div className="bg-[#0c0c0e] border border-border p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-border/80 text-text-dim text-[10px] uppercase">
                        <th className="py-2.5 px-3">RANK</th>
                        <th className="py-2.5 px-3">VC FIRM</th>
                        <th className="py-2.5 px-3 text-right">EXITS COUNT</th>
                        <th className="py-2.5 px-3 text-right">TOTAL EXIT EV ($B)</th>
                        <th className="py-2.5 px-3 text-center">PORTFOLIO HIT RATE</th>
                        <th className="py-2.5 px-3">PRIMARY INVESTMENT FOCUS</th>
                        <th className="py-2.5 px-3">LEGENDARY HISTORIC EXITS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {POWER_LAW_INVESTORS.map((inv) => (
                        <tr key={inv.firm} className="hover:bg-surface/50 transition-colors">
                          <td className="py-3 px-3 text-accent font-bold">#{inv.rank}</td>
                          <td className="py-3 px-3 text-white font-black uppercase flex items-center gap-1.5">
                            {inv.firm}
                            {inv.rank <= 3 && <span className="text-[8px] bg-[#00FF9C]/20 text-[#00FF9C] px-1 font-mono">ELITE</span>}
                          </td>
                          <td className="py-3 px-3 text-right text-zinc-300 font-bold">{inv.exitsCount} exits</td>
                          <td className="py-3 px-3 text-right text-white font-mono font-black">${inv.totalValue}B</td>
                          <td className="py-3 px-3 text-center text-amber-400 font-bold">{inv.hitRate}</td>
                          <td className="py-3 px-3 text-zinc-400">{inv.primarySector}</td>
                          <td className="py-3 px-3 text-zinc-500 italic max-w-xs truncate">{inv.topExit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* ========================================================= */}
          {/* TAB 3: MARKET MAPS */}
          {/* ========================================================= */}
          {activeTab === "Market Maps" && (
            <div className="space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-4 bg-black/20 p-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">🗺️ SECTOR MARKET LANDSCAPES</h3>
                  <p className="text-xs text-text-dim mt-1">Curated sector landscapes mapping the stack layers of major deep technology breakthroughs.</p>
                </div>

                {/* Dropdown to toggle landscapes */}
                <div className="font-mono text-[10px]">
                  <label className="block text-[8px] text-text-dim uppercase mb-0.5">ACTIVE COGNITIVE LANDSPACE</label>
                  <select 
                    value={activeLandscape}
                    onChange={(e) => setActiveLandscape(e.target.value)}
                    className="bg-surface border border-border p-2 text-xs text-[#00FF9C] rounded-none focus:outline-none focus:border-accent uppercase cursor-pointer"
                  >
                    <option value="Generative AI Infrastructure">Generative AI Infrastructure</option>
                    <option value="Sovereign Compute & National Infrastructure">Sovereign Compute & National Infrastructure</option>
                    <option value="Climate Fintech & Grid Tech">Climate Fintech & Grid Tech</option>
                  </select>
                </div>
              </div>

              {/* Landscape grid boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MARKET_MAP_SECTORS[activeLandscape as keyof typeof MARKET_MAP_SECTORS]?.map((section, idx) => (
                  <div key={idx} className="bg-[#0c0c0e] border border-border p-5 relative">
                    <span className="font-mono text-[9px] text-[#00FF9C] uppercase tracking-widest font-black block border-b border-border pb-1.5 mb-4">
                      SEGMENT_0{idx + 1} // {section.category}
                    </span>
                    
                    <div className="flex flex-wrap gap-2.5">
                      {section.companies.map((comp) => (
                        <div 
                          key={comp} 
                          onClick={() => {
                            // Automatically append this specific company profile to the editor
                            onAppendToCanvas(`- **${comp}**: Mapped under landscape *${activeLandscape}* -> category *${section.category}*.`);
                          }}
                          className="px-2.5 py-1.5 bg-[#121215] hover:bg-[#00FF9C]/10 border border-border hover:border-accent text-white hover:text-[#00FF9C] font-mono text-[11px] uppercase transition-all rounded-none cursor-pointer flex items-center gap-1.5 select-none"
                          title="Click to copy context to canvas"
                        >
                          {comp}
                          <ArrowUpRight size={10} className="opacity-60" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0e1612] border border-[#00FF9C]/30 p-4 text-xs font-mono text-zinc-300">
                <p className="flex items-center gap-2 text-[#00FF9C] font-black text-[11px] uppercase mb-1">
                  <ExternalLink size={13} /> CLUSTER METRICS AT YOUR FINGERTIPS
                </p>
                <p className="leading-relaxed text-[11px]">
                  Click on any company chip to append its structural positioning record directly to the current Canvas Briefing on the right-hand panel for your report building!
                </p>
              </div>

            </div>
          )}


          {/* ========================================================= */}
          {/* TAB 4: MULTIPLES & EXITS */}
          {/* ========================================================= */}
          {activeTab === "Multiples & Exits" && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">📊 VALUATION MULTIPLES & EXIT BENCHMARKS</h3>
                <p className="text-xs text-text-dim mt-1">Enterprise Value relative to ARR and Revenue multiples tracking across major software, marketplace, and deeptech verticals.</p>
              </div>

              {/* Historic Multiple Recharts */}
              <div className="bg-[#0c0c0e] border border-border p-4">
                <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>EV / REVENUE MULTIPLE TRENDS (2020 - 2026)</span>
                  <span className="text-[#00FF9C]">Multiples settle in normal ranges</span>
                </div>

                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SEGMENT_MULTIPLES} margin={{ left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" vertical={false} />
                      <XAxis dataKey="year" stroke="#444444" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} />
                      <YAxis stroke="#444444" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#222", fontFamily: "JetBrains Mono", fontSize: 10 }} />
                      <Legend wrapperStyle={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                      <Line type="monotone" dataKey="SaaS" name="Enterprise SaaS EV/ARR" stroke="#00FF9C" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Deeptech" name="Deep Tech EV/ARR" stroke="#a855f7" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="Marketplace" name="Consumer Marketplaces EV/ARR" stroke="#eab308" strokeWidth={1.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Notable Exit Transactions extrapolated */}
              <div className="bg-[#0c0c0e] border border-border p-4">
                <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-3">
                  RECENT HIGHLIGHTED EXITS & VALUE RECOGNITION
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="bg-surface p-3.5 border border-border">
                    <span className="text-[#00FF9C] font-bold text-[10px] block">M&A ACQUISITION // APPROVED</span>
                    <h4 className="text-white font-black uppercase text-sm mt-1">Figma acquired by Adobe</h4>
                    <p className="text-[10px] text-text-dim mt-1.5 leading-relaxed">
                      Valuation: **$20.0B** cash & stock. EV/ARR Multiple recognized: **20.5x**. One of the highest SaaS outcomes in web design space.
                    </p>
                  </div>

                  <div className="bg-surface p-3.5 border border-border">
                    <span className="text-purple-400 font-bold text-[10px] block">INITIAL PUBLIC OFFERING // COMPLETED</span>
                    <h4 className="text-white font-black uppercase text-sm mt-1">Snowflake IPO</h4>
                    <p className="text-[10px] text-text-dim mt-1.5 leading-relaxed">
                      Valuation at open: **$33.0B**. Peak valuation: **$75.0B**. EV/ARR Multiple peaked at **70.0x** before settling to sustainable ranges in 2026.
                    </p>
                  </div>

                  <div className="bg-surface p-3.5 border border-border">
                    <span className="text-amber-400 font-bold text-[10px] block">M&A TRANSFERS // PENDING</span>
                    <h4 className="text-white font-black uppercase text-sm mt-1">Mistral AI buyout track</h4>
                    <p className="text-[10px] text-text-dim mt-1.5 leading-relaxed">
                      Valuation targets: **$5.8B** under discussion. Expected multiple: **14.2x EV/ARR** due to massive sovereign European cloud traction.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}


          {/* ========================================================= */}
          {/* TAB 5: STARTUP JOURNEY (SEED -> SERIES A BENCHMARKS) */}
          {/* ========================================================= */}
          {activeTab === "Startup Journey" && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">🚀 SEED TO SERIES A DEEP BENCHMARKS</h3>
                <p className="text-xs text-text-dim mt-1">Operational standards and value-add vectors required to guide early stage ventures past the Seed-to-A funding chasm.</p>
              </div>

              {/* Grid of core benchmarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Seed benchmark panel */}
                <div className="bg-[#0c0c0e] border border-border p-5">
                  <span className="font-mono text-[10px] text-[#00FF9C] uppercase tracking-widest font-black block border-b border-border pb-1.5 mb-4">
                    THE SEED TRANSITION ZONE
                  </span>

                  <ul className="space-y-4 font-mono text-xs">
                    <li className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-zinc-400">Target ARR:</span>
                      <span className="text-white font-bold">$200k - $500k</span>
                    </li>
                    <li className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-zinc-400">YoY Momentum:</span>
                      <span className="text-white font-bold">N/A (Launch Phase)</span>
                    </li>
                    <li className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-zinc-400">Employee Scale:</span>
                      <span className="text-white font-bold">3 - 8 Full-Time Employees</span>
                    </li>
                    <li className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-zinc-400">Active Capital pool:</span>
                      <span className="text-[#00FF9C] font-black">$2M - $4M</span>
                    </li>
                  </ul>
                </div>

                {/* Series A panel */}
                <div className="bg-[#0c0c0e] border border-border p-5">
                  <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest font-black block border-b border-border pb-1.5 mb-4">
                    THE SERIES A STANDARD
                  </span>

                  <ul className="space-y-4 font-mono text-xs">
                    <li className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-zinc-400">Target ARR:</span>
                      <span className="text-white font-bold">$1.5M - $2.5M</span>
                    </li>
                    <li className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-zinc-400">YoY Momentum:</span>
                      <span className="text-white font-bold">150% - 300% ARR growth</span>
                    </li>
                    <li className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-zinc-400">Employee Scale:</span>
                      <span className="text-white font-bold">15 - 35 Full-Time Employees</span>
                    </li>
                    <li className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-zinc-400">Active Capital pool:</span>
                      <span className="text-purple-400 font-black">$8M - $15M</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Complete journey metrics benchmark table */}
              <div className="bg-[#0c0c0e] border border-border p-4">
                <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-3">
                  COMPREHENSIVE SEGMENT COMPARISON RETAINED
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-border/80 text-text-dim text-[10px] uppercase">
                        <th className="py-2.5 px-3">METRIC CATEGORY</th>
                        <th className="py-2.5 px-3 text-[#00FF9C]">SEED STANDARDS</th>
                        <th className="py-2.5 px-3 text-purple-400">SERIES A GATEKEEPERS</th>
                        <th className="py-2.5 px-3">TACTICAL RELEVANCE & STRATEGY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {JOURNEY_BENCHMARKS.map((j) => (
                        <tr key={j.metric} className="hover:bg-surface/50 transition-colors">
                          <td className="py-3 px-3 font-bold text-white uppercase">{j.metric}</td>
                          <td className="py-3 px-3 text-zinc-300 font-bold">{j.seedMin}</td>
                          <td className="py-3 px-3 text-white font-black">{j.seriesAMin}</td>
                          <td className="py-3 px-3 text-zinc-500 leading-normal max-w-xs">{j.relevance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* ========================================================= */}
          {/* TAB 6: ECOSYSTEM INDEX */}
          {/* ========================================================= */}
          {activeTab === "Ecosystem Index" && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">🌍 GLOBAL TECH ECOSYSTEM RANKINGS</h3>
                <p className="text-xs text-text-dim mt-1">Benchmarking geographic startup hubs by annual venture capital injection and government policy support.</p>
              </div>

              {/* Benchmarking ranking table */}
              <div className="bg-[#0c0c0e] border border-border p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-border/80 text-text-dim text-[10px] uppercase">
                        <th className="py-2.5 px-3">RANK</th>
                        <th className="py-2.5 px-3">STARTUP HUB CITY</th>
                        <th className="py-2.5 px-3">COUNTRY GEOGRAPHY</th>
                        <th className="py-2.5 px-3 text-right">INDEX SCORE</th>
                        <th className="py-2.5 px-3 text-right">ACTIVE UNICORNS</th>
                        <th className="py-2.5 px-3 text-right">ANNUAL VC VOLUME ($B)</th>
                        <th className="py-2.5 px-3 text-center">REGULATORY RATING</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {ECOSYSTEM_RANKINGS.map((eco) => (
                        <tr key={eco.hub} className="hover:bg-surface/50 transition-colors">
                          <td className="py-3 px-3 text-accent font-bold">#{eco.rank}</td>
                          <td className="py-3 px-3 text-white font-black uppercase">{eco.hub}</td>
                          <td className="py-3 px-3 text-zinc-400">{eco.country}</td>
                          <td className="py-3 px-3 text-right text-white font-bold">{eco.score} pts</td>
                          <td className="py-3 px-3 text-right text-zinc-300">{eco.activeUnicorns}</td>
                          <td className="py-3 px-3 text-right text-[#00FF9C] font-mono font-bold">${eco.annualFundings}B</td>
                          <td className="py-3 px-3 text-center text-zinc-300 font-bold">{eco.policyIndex}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Extrapolated ecosystem highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface p-4 border border-border">
                  <h4 className="font-mono text-xs font-bold text-[#00FF9C] uppercase tracking-wider mb-2">
                    EUROPEAN COGNITIVE ASCENDENCY // PARIS
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    Paris is leading European computational infrastructure growth, driven by deep tech grants, specialized computational centers at Paris-Saclay, and highly competitive developer taxation.
                  </p>
                </div>

                <div className="bg-surface p-4 border border-border">
                  <h4 className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                    SOVEREIGN ASSETS GROWTH // SINGAPORE
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    Singapore represents the top regulatory friendliness index score worldwide. Its sandbox system allows near-instant setup of corporate registries and tokenized physical asset custody frameworks.
                  </p>
                </div>
              </div>

            </div>
          )}


          {/* ========================================================= */}
          {/* TAB 7: FOUNDER AND OPERATOR TALENT */}
          {/* ========================================================= */}
          {activeTab === "Founder and Operator Talent" && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">🧠 HUMAN CAPITAL & TALENT ORIGIN MATRIX</h3>
                <p className="text-xs text-text-dim mt-1">Deep tracking of university roots and alumni company networks ("Maverick Syndicates") that spawn active technology founders.</p>
              </div>

              {/* Grid: Academic vs Corporate Syndicates */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Academic Origins list */}
                <div className="bg-[#0c0c0e] border border-border p-4">
                  <div className="font-mono text-[10px] text-[#00FF9C] uppercase tracking-wider mb-3.5 border-b border-border pb-1.5">
                    TOP ACADEMIC INSTITUTIONS BY PRODUCED FOUNDERS
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {TALENT_ORIGINS.universities.map((uni, idx) => (
                      <div key={idx} className="flex justify-between items-start border-b border-border/20 pb-2.5">
                        <div>
                          <span className="text-white font-bold block">{uni.name}</span>
                          <span className="text-[10px] text-zinc-500 block">Primary Hub: {uni.primaryHub}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[#00FF9C] font-black">{uni.count} founders</span>
                          <span className="text-[9px] text-zinc-550 block">{uni.focus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alumni Networks (Maverick Syndicates) list */}
                <div className="bg-[#0c0c0e] border border-border p-4">
                  <div className="font-mono text-[10px] text-purple-400 uppercase tracking-wider mb-3.5 border-b border-border pb-1.5">
                    MAVERICK SYNDICATES: HIGH-HIT RATE ALUMNI CLUSTERS
                  </div>

                  <div className="space-y-3.5 font-mono text-xs">
                    {TALENT_ORIGINS.alumniNetworks.map((net, idx) => (
                      <div key={idx} className="bg-surface p-3 border border-border/80">
                        <div className="flex justify-between">
                          <span className="text-white font-black uppercase text-sm leading-none">{net.group}</span>
                          <span className="text-[#00FF9C] font-bold text-[10px]">{net.startupsFounded} startups</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                          Core Focus: **{net.coreFocus}**
                        </p>
                        <div className="text-[9px] text-text-dim mt-1.5 uppercase flex justify-between">
                          <span>Verified alumni: {net.alumniCount}</span>
                          <span>Outcome trend: HIGH_ALPHA</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* ========================================================= */}
          {/* TAB 8: GEO MAPS */}
          {/* ========================================================= */}
          {activeTab === "Geo Maps" && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">🌐 REGIONAL VENTURE GEOGRAPHIC NODES</h3>
                <p className="text-xs text-text-dim mt-1">A custom mapped coordinate plotting layout highlighting regional investment pools and active regulatory clusters.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG Map Container (2/3 width) */}
                <div className="lg:col-span-2 bg-[#0c0c0e] border border-border p-4 flex flex-col h-[320px]">
                  <div className="font-mono text-[10px] text-text-dim uppercase tracking-wider mb-2 flex justify-between">
                    <span>COGNITIVE VENTURE NODE GEOGRAPHY MAP</span>
                    <span className="text-accent">Click glowing pulse points to inspect</span>
                  </div>

                  {/* SVG Custom Map Plot */}
                  <div className="flex-grow bg-[#050507] border border-border/40 relative overflow-hidden">
                    
                    {/* Retro Grid Backing Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                    <svg className="w-full h-full" viewBox="0 0 100 80">
                      
                      {/* Stylized continent outline hints */}
                      <path d="M 10,25 L 35,25 L 42,45 L 30,70 L 25,50 Z" fill="#18181b" fillOpacity={0.15} stroke="#27272a" strokeWidth={0.5} strokeDasharray="2 2" />
                      <path d="M 45,20 L 65,22 L 70,40 L 52,48 L 48,32 Z" fill="#18181b" fillOpacity={0.15} stroke="#27272a" strokeWidth={0.5} strokeDasharray="2 2" />
                      
                      {/* Glowing interactive nodes plotted */}
                      {GEO_HUBS.map((node) => {
                        const isSelected = selectedGeoNode?.name === node.name;
                        return (
                          <g 
                            key={node.name} 
                            className="cursor-pointer" 
                            onClick={() => setSelectedGeoNode(node)}
                          >
                            {/* Glow radius circle */}
                            <circle 
                              cx={node.x} 
                              cy={node.y} 
                              r={isSelected ? 4 : 2} 
                              fill={isSelected ? "#00FF9C" : "#8b5cf6"} 
                              fillOpacity={0.15} 
                              className={isSelected ? "animate-pulse" : ""}
                            />
                            
                            {/* Center core coordinate circle */}
                            <circle 
                              cx={node.x} 
                              cy={node.y} 
                              r={1.5} 
                              fill={isSelected ? "#00FF9C" : "#a855f7"} 
                            />
                            
                            {/* Text labels for major hubs */}
                            <text 
                              x={node.x + 3} 
                              y={node.y + 1} 
                              fill={isSelected ? "#ffffff" : "#666666"} 
                              fontSize={2.5} 
                              fontFamily="JetBrains Mono"
                              fontWeight={isSelected ? "bold" : "normal"}
                            >
                              {node.name.split(" ")[0]}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                  </div>
                </div>

                {/* Node inspector panel (1/3 width) */}
                <div className="bg-[#0c0c0e] border border-border p-5 flex flex-col justify-between font-mono text-xs">
                  {selectedGeoNode ? (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[#00FF9C] font-black text-[9px] block">VERIFIED NODE DETAIL REGISTER</span>
                        <h4 className="text-white font-black uppercase text-base mt-1">{selectedGeoNode.name}</h4>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-zinc-500">ANNUAL VENTURE FUNDING:</span>
                          <span className="text-white font-bold">${selectedGeoNode.funding}B / yr</span>
                        </div>
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-zinc-500">ACTIVE UNICORN COUNT:</span>
                          <span className="text-white font-bold">{selectedGeoNode.unicorns} companies</span>
                        </div>
                        <div className="flex justify-between border-b border-border/30 pb-2">
                          <span className="text-zinc-500">ECOSYSTEM STATUS:</span>
                          <span className="text-amber-400 font-bold uppercase">{selectedGeoNode.status}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-450 leading-relaxed pt-2">
                        This regional capital node has been audited under national computing restrictions and conforms to strict secure-tunnel data routing standards.
                      </p>
                    </div>
                  ) : (
                    <div className="text-zinc-500 text-center py-16">
                      SELECT A NODE COORDINATE ON THE GEOGRAPHIC GRID TO TRACE PERFORMANCE INDEX RECORDS.
                    </div>
                  )}

                  <div className="border-t border-border pt-4 mt-4">
                    <button
                      id="btn-trigger-canvas-node-brief"
                      onClick={() => {
                        if (selectedGeoNode) {
                          onAppendToCanvas(`### Mapped Geo Node Brief: ${selectedGeoNode.name}\n- **Funding Volume**: $${selectedGeoNode.funding}B/yr\n- **Unicorn Density**: ${selectedGeoNode.unicorns} unicorns\n- **Node State**: ${selectedGeoNode.status}`);
                        }
                      }}
                      className="w-full py-2 bg-transparent border border-zinc-750 hover:border-accent text-zinc-300 hover:text-white text-[10px] uppercase cursor-pointer tracking-wider font-bold transition-all"
                    >
                      APPEND NODE TO BRIEFING
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
};
