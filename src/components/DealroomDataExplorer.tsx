import React, { useState, useMemo } from "react";
import { 
  BookOpen, Shield, Users, MapPin, ExternalLink, Calendar, 
  Briefcase, FileText, Globe, GraduationCap, Building, UserCircle, 
  HelpCircle, TrendingUp, Sparkles, Search, Layers, CheckCircle, 
  Award, ArrowUpRight, DollarSign, Filter, RefreshCw
} from "lucide-react";

// ==========================================
// STATIC HIGH-FIDELITY DATASETS FOR DEALROOM EXPLORER
// ==========================================

// 1. OUR DATA (Methodology / Enrichment Data)
const PIPELINE_STEPS = [
  { step: "01", title: "Automated Scraping & Ingestion", desc: "Sovereign indexers continuous monitoring of municipal corporate registries, public domain press, and agricultural data feeds." },
  { step: "02", title: "AI Entity Resolution", desc: "Machine learning models match founder names, deduplicate company profiles, and resolve funding news to prevent double-counting." },
  { step: "03", title: "Multi-Agent Classification", desc: "Intelligent agent pipelines classify companies into specific sub-sectors based on their technical whitepapers and job listings." },
  { step: "04", title: "Manual Verification", desc: "Professional Dealroom research analysts manually review and vet high-growth scaleups and financing events above $10M." },
  { step: "05", title: "Sponsor/Founder Self-Reporting", desc: "VC firms and founders directly access the secure portal to update active hiring metrics, ARR ranges, and cap tables." }
];

const METRICS_COVERAGE = [
  { label: "Global Private Profiles", value: "2.4M+", change: "+14,500 this week" },
  { label: "Financing Rounds Cataloged", value: "850k+", change: "+1,200 this week" },
  { label: "Active Vetted Investors", value: "180k+", change: "99.8% resolution rate" },
  { label: "Ecosystems Benchmarked", value: "140+", change: "Covers 6 continents" }
];

// 2. TECH SECTOR TAXONOMY
const TAXONOMY_TREE = [
  { 
    macro: "Deep Tech", 
    color: "border-l-4 border-[#00FF9C]", 
    industries: [
      { name: "Sovereign AI Infrastructure", tags: ["LLM Base Models", "Quantization Adapters", "Localized Vectors", "GPU Orchestration"] },
      { name: "Grid Tech & Climate", tags: ["Tokamak Fusion", "Scope-3 Emitting APIs", "Grid Balance Logic", "Smart Thermal Systems"] },
      { name: "Quantum Computing & HSM", tags: ["Quantum Annealing", "Post-Quantum Cryptography", "Superconducting Qubits"] },
      { name: "Robotics & Space", tags: ["VLM Humanoids", "Low Earth Orbit Satellites", "Edge Computing Hubs", "Propulsion Models"] }
    ]
  },
  { 
    macro: "Enterprise Software", 
    color: "border-l-4 border-purple-600", 
    industries: [
      { name: "Agentic Workflows", tags: ["Autonomous Agents", "Workflow Orchestration", "Auto-compliance Nodes", "Contract Reviewers"] },
      { name: "SaaS Dev Tools", tags: ["Continuous Deployment", "Database Versioning", "Static Type Tracers", "Code Assistants"] },
      { name: "Sovereign Audit Systems", tags: ["Data Leak Prevention", "RegTech Compliance", "Zero-Knowledge Proofs"] }
    ]
  },
  { 
    macro: "Health & Biotech", 
    color: "border-l-4 border-pink-500", 
    industries: [
      { name: "AI Therapeutics", tags: ["De-Novo Protein Synthesis", "Oncology Targeting", "Automated Clinical Trials"] },
      { name: "Digital Medicine", tags: ["Predictive Diagnostics", "Telehealth Nodes", "Smart Wearable Interfacing"] }
    ]
  },
  { 
    macro: "Fintech", 
    color: "border-l-4 border-yellow-500", 
    industries: [
      { name: "Sovereign Ledger Services", tags: ["Stablecoin Networks", "Clearance Protocols", "Corporate Multi-user Payroll"] },
      { name: "Decentralized Asset Audits", tags: ["Custodial Audit Engines", "Yield Verification", "Crypto Compliance"] }
    ]
  }
];

// 3. COMPANIES
const COMPANIES_DATA = [
  { id: "co-1", name: "SovereignLLM", sector: "Deep Tech", subsector: "Sovereign AI Infrastructure", valuation: "$1,200M", status: "UNICORN", location: "Berlin, Germany", growthScore: 98, totalRaised: "$240M", latestFunding: "Series B ($150M)", leadInvestor: "DTCP", founded: 2024 },
  { id: "co-2", name: "JurisAgent AI", sector: "Enterprise Software", subsector: "Agentic Workflows", valuation: "$180M", status: "BREAKOUT", location: "Riyadh, Saudi Arabia", growthScore: 94, totalRaised: "$32M", latestFunding: "Series A ($18M)", leadInvestor: "Riyadh Ventures", founded: 2025 },
  { id: "co-3", name: "BioSynth Therapeutics", sector: "Health & Biotech", subsector: "AI Therapeutics", valuation: "$2,400M", status: "DECON-SCALE", location: "Boston, USA", growthScore: 99, totalRaised: "$480M", latestFunding: "Series C ($210M)", leadInvestor: "Sofinnova Partners", founded: 2023 },
  { id: "co-4", name: "Aether Defence Tech", sector: "Deep Tech", subsector: "Quantum Computing & HSM", valuation: "$4,500M", status: "UNICORN", location: "Paris, France", growthScore: 97, totalRaised: "$620M", latestFunding: "Series D ($310M)", leadInvestor: "BPIFrance", founded: 2022 },
  { id: "co-5", name: "Zenith Energy Systems", sector: "Deep Tech", subsector: "Grid Tech & Climate", valuation: "$9,100M", status: "UNICORN", location: "London, UK", growthScore: 95, totalRaised: "$1,100M", latestFunding: "Series C ($210M)", leadInvestor: "Temasek", founded: 2021 },
  { id: "co-6", name: "Cognitive Grid", sector: "Deep Tech", subsector: "Grid Tech & Climate", valuation: "$380M", status: "BREAKOUT", location: "Munich, Germany", growthScore: 89, totalRaised: "$65M", latestFunding: "Series A ($30M)", leadInvestor: "EQT Ventures", founded: 2024 },
  { id: "co-7", name: "OrbitLogistics", sector: "Deep Tech", subsector: "Robotics & Space", valuation: "$1,800M", status: "UNICORN", location: "Tokyo, Japan", growthScore: 92, totalRaised: "$280M", latestFunding: "Series B ($95M)", leadInvestor: "SoftBank Vision Fund", founded: 2023 },
  { id: "co-8", name: "Veritas Vector Audit", sector: "Enterprise Software", subsector: "Sovereign Audit Systems", valuation: "$85M", status: "SEED", location: "Stockholm, Sweden", growthScore: 91, totalRaised: "$15M", latestFunding: "Seed ($12M)", leadInvestor: "Creandum", founded: 2025 },
  { id: "co-9", name: "Synaptic Fabric", sector: "Enterprise Software", subsector: "Agentic Workflows", valuation: "$145M", status: "BREAKOUT", location: "Singapore", growthScore: 88, totalRaised: "$28M", latestFunding: "Series A ($15M)", leadInvestor: "Vertex Ventures", founded: 2024 },
  { id: "co-10", name: "Dune AI Solutions", sector: "Deep Tech", subsector: "Sovereign AI Infrastructure", valuation: "$220M", status: "BREAKOUT", location: "Dubai, UAE", growthScore: 93, totalRaised: "$45M", latestFunding: "Series A ($25M)", leadInvestor: "Shorooq Partners", founded: 2024 }
];

// 4. LOCATIONS
const LOCATIONS_DATA = [
  { rank: 1, hub: "London", country: "United Kingdom", region: "EMEA", score: 96.5, funding: "$28.4B", unicorns: 52, policyGrade: "A+", university: "University College London" },
  { rank: 2, hub: "Paris", country: "France", region: "EMEA", score: 94.2, funding: "$21.8B", unicorns: 38, policyGrade: "A", university: "INSEAD / Sorbonne" },
  { rank: 3, hub: "Singapore", country: "Singapore", region: "APAC", score: 91.8, funding: "$14.2B", unicorns: 21, policyGrade: "A+", university: "National University of Singapore" },
  { rank: 4, hub: "Berlin/Munich", country: "Germany", region: "EMEA", score: 89.9, funding: "$12.5B", unicorns: 18, policyGrade: "B+", university: "Technical University of Munich" },
  { rank: 5, hub: "Riyadh VC Hub", country: "Saudi Arabia", region: "MEA", score: 88.7, funding: "$4.9B", unicorns: 6, policyGrade: "A+", university: "Stanford Riyadh Affiliate" },
  { rank: 6, hub: "Stockholm", country: "Sweden", region: "EMEA", score: 87.3, funding: "$7.4B", unicorns: 12, policyGrade: "B+", university: "KTH Royal Institute of Technology" },
  { rank: 7, hub: "Tokyo", country: "Japan", region: "APAC", score: 85.1, funding: "$8.6B", unicorns: 11, policyGrade: "B", university: "University of Tokyo" },
  { rank: 8, hub: "Dubai", country: "United Arab Emirates", region: "MEA", score: 84.8, funding: "$3.8B", unicorns: 4, policyGrade: "A", university: "Zayed University Affiliates" }
];

// 5. INVESTORS
const INVESTORS_DATA = [
  { firm: "Sequoia Capital", stage: "Multi-stage", geo: "US / EMEA / APAC", focus: "Multi-Sector", fundSize: "$12.5B", portfolioCount: "1200+", stars: "Stripe, Snowflake, OpenAI" },
  { firm: "Andreessen Horowitz", stage: "Early to Growth", geo: "US / EMEA", focus: "SaaS, AI, Bio, Web3", fundSize: "$9.4B", portfolioCount: "950+", stars: "Coinbase, Airbnb, Cohere" },
  { firm: "Riyadh Ventures (RVC)", stage: "Seed / Series A", geo: "MEA / Global", focus: "Sovereign AI, Deeptech", fundSize: "$1.5B", portfolioCount: "45", stars: "JurisAgent AI, SovereignLLM" },
  { firm: "Sofinnova Partners", stage: "Early / Growth", geo: "EMEA", focus: "Biotech, Medtech", fundSize: "$2.1B", portfolioCount: "180", stars: "BioSynth, Abivax" },
  { firm: "EQT Ventures", stage: "Seed to Series B", geo: "EMEA / US", focus: "Climate, Deeptech, SaaS", fundSize: "$1.8B", portfolioCount: "140", stars: "Cognitive Grid, CarbonCloud" },
  { firm: "Creandum", stage: "Early Stage", geo: "EMEA", focus: "SaaS, Fintech, Audit", fundSize: "$750M", portfolioCount: "220", stars: "Spotify, Veritas Vector" },
  { firm: "SoftBank Vision Fund", stage: "Growth Stage", geo: "Global", focus: "Robotics, Mobility, AI", fundSize: "$100B", portfolioCount: "410", stars: "OrbitLogistics, Arm" },
  { firm: "Founder Collective", stage: "Seed Stage", geo: "US / EMEA", focus: "Enterprise SaaS, DevTools", fundSize: "$350M", portfolioCount: "310", stars: "Uber, Coupang" }
];

// 6. PEOPLE
const PEOPLE_DATA = [
  { name: "Dr. Amina El-Khoury", role: "Founder & Chief Scientist", company: "SovereignLLM", location: "Munich, Germany", trackRecord: "Ex-Stanford AI researcher, 15+ patents", bio: "Leads research into localized attention mechanisms and European sovereign vector infrastructure deployment." },
  { name: "Faisal Al-Jassim", role: "Managing Director", company: "Riyadh Ventures", location: "Riyadh, Saudi Arabia", trackRecord: "Invested in 18 early deeptech seed rounds", bio: "Former core operations lead at Stripe EMEA. Spearheads regional sovereign computer capital deployments." },
  { name: "Maan Barazy", role: "Venture Builder & Architect", company: "Avant-Garde.ai", location: "Beirut / Riyadh", trackRecord: "Co-founded 4 scaleups, ex-McKinsey Tech", bio: "Designs corporate multi-agent compliance node infrastructures and manages automated private market scrapers." },
  { name: "Sara Larsson", role: "Angel Investor & ex-VP", company: "Independent", location: "Stockholm, Sweden", trackRecord: "Early backer of 28 SaaS startups", bio: "Former VP of Product at Spotify. Advisors to early state vector validation registries." },
  { name: "Yuki Tanaka", role: "Founder & Executive Director", company: "OrbitLogistics", location: "Tokyo, Japan", trackRecord: "Ex-JAXA deep propulsion engineer", bio: "Architected LEO mesh networks tracking orbital cargo logistics pipelines dynamically." },
  { name: "Dr. Samer Al-Aswad", role: "VP of Engineering", company: "JurisAgent AI", location: "Riyadh, Saudi Arabia", trackRecord: "Ex-Google Security, PhD in Cryptography", bio: "Specialist in zero-knowledge compliance verification nodes and multi-tier legal workspace audits." }
];

// 7. SECTORS
const SECTORS_DATA = [
  { id: "sec-1", name: "Artificial Intelligence & Agents", size2026: "$640B", growth: "+185% YoY", primaryHub: "San Francisco / Paris", coreDriver: "Multi-agent automated workflow pipelines & custom compliance agents", keyAssets: "SovereignLLM, JurisAgent AI", grade: "A+" },
  { id: "sec-2", name: "Climate & Grid Tech", size2026: "$420B", growth: "+68% YoY", primaryHub: "Munich / Stockholm", coreDriver: "Scope-3 corporate compliance auditing & nuclear tokamak fusion balancing", keyAssets: "Zenith Energy, Cognitive Grid", grade: "A" },
  { id: "sec-3", name: "Biotech & AI Therapeutics", size2026: "$290B", growth: "+45% YoY", primaryHub: "Boston / Oxford", coreDriver: "AI de-novo protein folding, automated antibodies, and trial compression", keyAssets: "BioSynth Therapeutics", grade: "A" },
  { id: "sec-4", name: "Defence Tech & Sovereign Security", size2026: "$180B", growth: "+112% YoY", primaryHub: "Paris / Berlin", coreDriver: "Air-gapped post-quantum HSM systems & autonomous meshed drones", keyAssets: "Aether Defence Tech", grade: "A+" },
  { id: "sec-5", name: "Sovereign Fintech & Ledger", size2026: "$380B", growth: "-5% YoY", primaryHub: "London / Singapore", coreDriver: "Localized clearing layers, stablecoin networks, and multi-user payroll", keyAssets: "LedgerSafe", grade: "B" },
  { id: "sec-6", name: "Space Tech & Orbital Logics", size2026: "$110B", growth: "+30% YoY", primaryHub: "Tokyo / Houston", coreDriver: "Low Earth Orbit logistics mesh networks & fusion propulsion models", keyAssets: "OrbitLogistics", grade: "B+" }
];

// 8. UNIVERSITIES
const UNIVERSITIES_DATA = [
  { university: "Stanford University", activeAlumni: 840, startupsRaised: 620, totalRaised: "$142.5B", unicorns: 52, evGenerated: "$840B", labName: "Stanford AI Lab / Systems Group" },
  { university: "Massachusetts Institute of Technology (MIT)", activeAlumni: 620, startupsRaised: 480, totalRaised: "$98.4B", unicorns: 34, evGenerated: "$620B", labName: "CSAIL / Lincoln Lab" },
  { university: "University of California, Berkeley", activeAlumni: 590, startupsRaised: 410, totalRaised: "$85.1B", unicorns: 28, evGenerated: "$510B", labName: "Berkeley AI Research (BAIR)" },
  { university: "University of Oxford / Cambridge", activeAlumni: 410, startupsRaised: 310, totalRaised: "$42.6B", unicorns: 18, evGenerated: "$295B", labName: "Oxford Robotics Institute" },
  { university: "Stanford Riyadh Affiliate Hub", activeAlumni: 120, startupsRaised: 80, totalRaised: "$9.8B", unicorns: 3, evGenerated: "$45B", labName: "KSA DeepTech Center" },
  { university: "INSEAD", activeAlumni: 280, startupsRaised: 240, totalRaised: "$31.5B", unicorns: 11, evGenerated: "$180B", labName: "GTM Business Incubator" },
  { university: "Sorbonne / Ecole Polytechnique", activeAlumni: 340, startupsRaised: 220, totalRaised: "$24.5B", unicorns: 14, evGenerated: "$165B", labName: "Paris Quantum & AI Lab" }
];


export const DealroomDataExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "our_data" | "taxonomy" | "companies" | "locations" | "investors" | "people" | "sectors" | "universities"
  >("our_data");

  // Global search inside the specific explorer directories
  const [explorerQuery, setExplorerQuery] = useState("");

  // Sector and Region Filter presets for directories
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Detailed modal simulation for items
  const [selectedCompany, setSelectedCompany] = useState<typeof COMPANIES_DATA[0] | null>(null);

  // -------------------------
  // Filtering & Search Utilities
  // -------------------------
  const filteredCompanies = useMemo(() => {
    return COMPANIES_DATA.filter(co => {
      const matchSearch = explorerQuery === "" || 
        co.name.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        co.subsector.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        co.location.toLowerCase().includes(explorerQuery.toLowerCase());
      const matchCategory = categoryFilter === "All" || co.sector === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [explorerQuery, categoryFilter]);

  const filteredLocations = useMemo(() => {
    return LOCATIONS_DATA.filter(loc => {
      const matchSearch = explorerQuery === "" || 
        loc.hub.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        loc.country.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        loc.region.toLowerCase().includes(explorerQuery.toLowerCase());
      const matchCategory = categoryFilter === "All" || loc.region === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [explorerQuery, categoryFilter]);

  const filteredInvestors = useMemo(() => {
    return INVESTORS_DATA.filter(inv => {
      const matchSearch = explorerQuery === "" || 
        inv.firm.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        inv.focus.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        inv.geo.toLowerCase().includes(explorerQuery.toLowerCase());
      const matchCategory = categoryFilter === "All" || inv.stage.includes(categoryFilter);
      return matchSearch && matchCategory;
    });
  }, [explorerQuery, categoryFilter]);

  const filteredPeople = useMemo(() => {
    return PEOPLE_DATA.filter(p => {
      const matchSearch = explorerQuery === "" || 
        p.name.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        p.company.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(explorerQuery.toLowerCase());
      return matchSearch;
    });
  }, [explorerQuery]);

  const filteredSectors = useMemo(() => {
    return SECTORS_DATA.filter(sec => {
      const matchSearch = explorerQuery === "" || 
        sec.name.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        sec.coreDriver.toLowerCase().includes(explorerQuery.toLowerCase());
      return matchSearch;
    });
  }, [explorerQuery]);

  const filteredUniversities = useMemo(() => {
    return UNIVERSITIES_DATA.filter(univ => {
      const matchSearch = explorerQuery === "" || 
        univ.university.toLowerCase().includes(explorerQuery.toLowerCase()) ||
        univ.labName.toLowerCase().includes(explorerQuery.toLowerCase());
      return matchSearch;
    });
  }, [explorerQuery]);


  return (
    <div id="dealroom-explorer-root" className="bg-white text-black p-6 space-y-6 min-h-screen">
      
      {/* Header Deck */}
      <div className="border-b-2 border-black pb-5">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block font-mono">
          DEALROOM CORE DATA PLATFORM
        </span>
        <h1 className="text-2xl font-black text-black uppercase tracking-tight flex items-center gap-2 mt-1">
          <Layers className="text-black" size={24} />
          Sovereign Tech Ecosystem Registries
        </h1>
        <p className="text-zinc-600 text-xs font-sans max-w-3xl mt-1 leading-relaxed">
          Unlock verified private tech benchmarks across Europe, Asia-Pacific, and the Middle East. Real-time enrichment pipelines cataloging deep tech sectors, alumni networks, startup indices, and venture portfolios.
        </p>
      </div>

      {/* Grid of the 8 navigation menus */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 border border-black bg-zinc-100 p-1 gap-1 text-[10px] font-mono select-none">
        <button
          onClick={() => { setActiveTab("our_data"); setExplorerQuery(""); setCategoryFilter("All"); }}
          className={`py-2 px-1 text-center font-bold uppercase cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${
            activeTab === "our_data" ? "bg-black text-white border-black" : "bg-white text-zinc-700 hover:text-black border-zinc-200"
          }`}
        >
          <span className="text-sm">🗂</span>
          <span>Our Data</span>
        </button>

        <button
          onClick={() => { setActiveTab("taxonomy"); setExplorerQuery(""); setCategoryFilter("All"); }}
          className={`py-2 px-1 text-center font-bold uppercase cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${
            activeTab === "taxonomy" ? "bg-black text-white border-black" : "bg-white text-zinc-700 hover:text-black border-zinc-200"
          }`}
        >
          <span className="text-sm">🏢</span>
          <span>Taxonomy</span>
        </button>

        <button
          onClick={() => { setActiveTab("companies"); setExplorerQuery(""); setCategoryFilter("All"); }}
          className={`py-2 px-1 text-center font-bold uppercase cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${
            activeTab === "companies" ? "bg-black text-white border-black" : "bg-white text-zinc-700 hover:text-black border-zinc-200"
          }`}
        >
          <span className="text-sm">🏢</span>
          <span>Companies</span>
        </button>

        <button
          onClick={() => { setActiveTab("locations"); setExplorerQuery(""); setCategoryFilter("All"); }}
          className={`py-2 px-1 text-center font-bold uppercase cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${
            activeTab === "locations" ? "bg-black text-white border-black" : "bg-white text-zinc-700 hover:text-black border-zinc-200"
          }`}
        >
          <span className="text-sm">📍</span>
          <span>Locations</span>
        </button>

        <button
          onClick={() => { setActiveTab("investors"); setExplorerQuery(""); setCategoryFilter("All"); }}
          className={`py-2 px-1 text-center font-bold uppercase cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${
            activeTab === "investors" ? "bg-black text-white border-black" : "bg-white text-zinc-700 hover:text-black border-zinc-200"
          }`}
        >
          <span className="text-sm">💎</span>
          <span>Investors</span>
        </button>

        <button
          onClick={() => { setActiveTab("people"); setExplorerQuery(""); setCategoryFilter("All"); }}
          className={`py-2 px-1 text-center font-bold uppercase cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${
            activeTab === "people" ? "bg-black text-white border-black" : "bg-white text-zinc-700 hover:text-black border-zinc-200"
          }`}
        >
          <span className="text-sm">👤</span>
          <span>People</span>
        </button>

        <button
          onClick={() => { setActiveTab("sectors"); setExplorerQuery(""); setCategoryFilter("All"); }}
          className={`py-2 px-1 text-center font-bold uppercase cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${
            activeTab === "sectors" ? "bg-black text-white border-black" : "bg-white text-zinc-700 hover:text-black border-zinc-200"
          }`}
        >
          <span className="text-sm">🧩</span>
          <span>Sectors</span>
        </button>

        <button
          onClick={() => { setActiveTab("universities"); setExplorerQuery(""); setCategoryFilter("All"); }}
          className={`py-2 px-1 text-center font-bold uppercase cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${
            activeTab === "universities" ? "bg-black text-white border-black" : "bg-white text-zinc-700 hover:text-black border-zinc-200"
          }`}
        >
          <span className="text-sm">🎓</span>
          <span>Universities</span>
        </button>
      </div>

      {/* Directory Search & Filter Panel (Only shown for searchable lists) */}
      {["companies", "locations", "investors", "people", "sectors", "universities"].includes(activeTab) && (
        <div className="bg-zinc-50 border border-black p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <span className="absolute left-2.5 top-2.5 text-zinc-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={explorerQuery}
              onChange={(e) => setExplorerQuery(e.target.value)}
              placeholder={`Search database entries...`}
              className="w-full bg-white border border-zinc-300 p-2 pl-8 text-[11px] focus:outline-none focus:border-black font-mono text-black placeholder-zinc-450"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto shrink-0 pb-1 md:pb-0">
            {activeTab === "companies" && (
              <>
                <span className="text-[10px] font-mono text-zinc-500 flex items-center shrink-0 uppercase">Macro filter:</span>
                {["All", "Deep Tech", "Enterprise Software", "Health & Biotech"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-1 text-[9px] font-mono uppercase font-bold border shrink-0 ${
                      categoryFilter === cat ? "bg-black text-white border-black" : "bg-white border-zinc-200 hover:border-black text-zinc-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </>
            )}

            {activeTab === "locations" && (
              <>
                <span className="text-[10px] font-mono text-zinc-500 flex items-center shrink-0 uppercase">Region:</span>
                {["All", "EMEA", "APAC", "MEA"].map(reg => (
                  <button
                    key={reg}
                    onClick={() => setCategoryFilter(reg)}
                    className={`px-2 py-1 text-[9px] font-mono uppercase font-bold border shrink-0 ${
                      categoryFilter === reg ? "bg-black text-white border-black" : "bg-white border-zinc-200 hover:border-black text-zinc-700"
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </>
            )}

            {activeTab === "investors" && (
              <>
                <span className="text-[10px] font-mono text-zinc-500 flex items-center shrink-0 uppercase">Stage:</span>
                {["All", "Seed", "Early", "Growth"].map(stg => (
                  <button
                    key={stg}
                    onClick={() => setCategoryFilter(stg)}
                    className={`px-2 py-1 text-[9px] font-mono uppercase font-bold border shrink-0 ${
                      categoryFilter === stg ? "bg-black text-white border-black" : "bg-white border-zinc-200 hover:border-black text-zinc-700"
                    }`}
                  >
                    {stg}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. OUR DATA                                              */}
      {/* ======================================================== */}
      {activeTab === "our_data" && (
        <div className="space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-none">
            <h2 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5 mb-2">
              <Sparkles size={14} className="text-amber-500" />
              METHODOLOGY & DATA ENRICHMENT PIPELINE
            </h2>
            <p className="text-[11px] leading-relaxed font-sans text-zinc-700">
              Dealroom utilizes complex automated extraction routines combined with expert manual verification. Every transaction, employee metric, and funding loop is dynamically registered under sovereign regulatory requirements.
            </p>
          </div>

          {/* Grid Cards of Live Coverage stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS_COVERAGE.map((met, idx) => (
              <div key={idx} className="border border-black p-4 space-y-1 bg-zinc-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">{met.label}</span>
                <span className="text-xl font-black block text-black font-mono">{met.value}</span>
                <span className="text-[9px] font-mono bg-[#00ff66]/10 text-green-800 border border-green-200 px-1.5 py-0.5 rounded-none inline-block uppercase font-bold">
                  {met.change}
                </span>
              </div>
            ))}
          </div>

          {/* enrichment pipeline illustration */}
          <div className="space-y-4">
            <div className="border-b border-black pb-1.5">
              <h3 className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">INGESTION CORE ENGINE</h3>
              <h4 className="font-black uppercase text-sm text-black">AUTOMATED ENRICHMENT WORKFLOW STAGES</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {PIPELINE_STEPS.map((step, idx) => (
                <div key={idx} className="border border-border p-4 space-y-2 bg-white relative hover:border-black transition-all">
                  <div className="text-[28px] font-black text-zinc-200 font-mono leading-none">{step.step}</div>
                  <h5 className="font-bold uppercase text-[10.5px] text-black leading-snug">{step.title}</h5>
                  <p className="text-[10px] text-zinc-600 font-sans leading-normal">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TECH SECTOR TAXONOMY                                  */}
      {/* ======================================================== */}
      {activeTab === "taxonomy" && (
        <div className="space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 p-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5 mb-2">
              <Building size={14} />
              CLASSIFICATION & TAXONOMY STANDARDS
            </h2>
            <p className="text-[11px] leading-relaxed font-sans text-zinc-700">
              Dealroom's standard classification model guarantees that venture funds, government bodies, and investment banks can query scaleups by structured vertical parameters. We split startups into <strong>Macro Sectors</strong>, <strong>Industries</strong>, and specific semantic tags.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {TAXONOMY_TREE.map((node, idx) => (
              <div key={idx} className={`bg-white border border-border p-5 space-y-4 ${node.color} shadow-sm`}>
                <div className="border-b border-zinc-100 pb-2">
                  <span className="text-[9px] text-zinc-400 font-bold font-mono uppercase tracking-widest">MACRO SECTOR GROUP</span>
                  <h3 className="font-black text-black uppercase text-sm mt-0.5">{node.macro}</h3>
                </div>

                <div className="space-y-3.5">
                  {node.industries.map((ind, iIdx) => (
                    <div key={iIdx} className="space-y-1.5">
                      <span className="font-mono text-[10.5px] font-bold text-black uppercase block">
                        ➔ {ind.name}
                      </span>
                      <div className="flex flex-wrap gap-1 pl-4">
                        {ind.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[8.5px] font-mono bg-zinc-50 hover:bg-zinc-100 border border-border px-2 py-0.5 text-zinc-600 font-bold uppercase transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. COMPANIES                                             */}
      {/* ======================================================== */}
      {activeTab === "companies" && (
        <div className="space-y-4">
          <div className="border border-black overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10.5px]">
              <thead>
                <tr className="bg-zinc-100 border-b border-black">
                  <th className="p-3 font-bold uppercase text-zinc-600">Company Name</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Macro Sector</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Sub-Industry / Focus</th>
                  <th className="p-3 font-bold uppercase text-zinc-600 text-center">Growth Score</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Valuation</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Latest Round</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Primary Hub</th>
                  <th className="p-3 font-bold uppercase text-zinc-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map(co => (
                  <tr key={co.id} className="border-b border-border hover:bg-zinc-50/70 transition-colors">
                    <td className="p-3 font-bold text-black uppercase flex items-center gap-1.5">
                      {co.name}
                      {co.status === "UNICORN" && (
                        <span className="bg-purple-100 text-purple-800 border border-purple-200 font-black text-[8px] px-1 py-0.2 uppercase shrink-0">
                          UNICORN 🦄
                        </span>
                      )}
                      {co.status === "DECON-SCALE" && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 font-black text-[8px] px-1 py-0.2 uppercase shrink-0">
                          DECACORN ⭐
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-zinc-700">{co.sector}</td>
                    <td className="p-3">
                      <span className="bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 text-zinc-600 uppercase text-[9.5px]">
                        {co.subsector}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 font-bold ${
                        co.growthScore >= 95 ? "text-green-700 bg-green-50 border border-green-200" : "text-black bg-zinc-100 border"
                      }`}>
                        {co.growthScore}/100
                      </span>
                    </td>
                    <td className="p-3 font-black text-black">{co.valuation}</td>
                    <td className="p-3 text-zinc-650">{co.latestFunding}</td>
                    <td className="p-3 text-zinc-600 uppercase text-[9.5px]">{co.location}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedCompany(co)}
                        className="px-2 py-1 border border-black bg-black text-white hover:bg-zinc-800 font-bold uppercase text-[9px] cursor-pointer"
                      >
                        DETAILS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Company details preview drawer simulation */}
          {selectedCompany && (
            <div className="border border-black bg-zinc-50 p-5 space-y-4 animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex justify-between items-start border-b border-zinc-200 pb-3">
                <div>
                  <span className="text-[8px] bg-black text-white px-2 py-0.5 font-bold uppercase tracking-widest block w-max font-mono mb-1">
                    Verified Profile Registry
                  </span>
                  <h4 className="text-base font-black text-black uppercase font-mono">{selectedCompany.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-sans mt-0.5">ESTABLISHED IN {selectedCompany.founded} — MANAGED PROFILE</p>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="text-red-600 hover:underline font-mono text-[10px] font-bold"
                >
                  [CLOSE TIMELINE ➔]
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-[11px] text-zinc-700 leading-relaxed">
                <div>
                  <span className="text-[9px] text-zinc-400 block font-bold uppercase">VALUATION BASELINE</span>
                  <strong className="text-black text-sm block">{selectedCompany.valuation}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 block font-bold uppercase">TOTAL CAPITAL RAISED</span>
                  <strong className="text-black text-sm block">{selectedCompany.totalRaised}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 block font-bold uppercase">LATEST INGESTED EVENT</span>
                  <strong className="text-black text-sm block">{selectedCompany.latestFunding}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 block font-bold uppercase">LEAD REVENUE SPONSOR</span>
                  <strong className="text-black text-sm block">{selectedCompany.leadInvestor}</strong>
                </div>
              </div>

              <div className="bg-white border border-border p-3.5 space-y-2">
                <span className="text-[9px] font-mono text-zinc-450 uppercase block font-bold">DEALROOM ENRICHMENT TIMELINE</span>
                <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-sans">
                  <CheckCircle size={12} className="text-green-600" />
                  <span>Regulatory security registry compliance checks complete. <strong>Growth score: {selectedCompany.growthScore}/100</strong> (Top {100 - selectedCompany.growthScore}% global tier).</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-sans">
                  <CheckCircle size={12} className="text-green-600" />
                  <span>HQ geographic anchor mapped securely to <strong>{selectedCompany.location}</strong> with live active hiring indices.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. LOCATIONS                                             */}
      {/* ======================================================== */}
      {activeTab === "locations" && (
        <div className="space-y-4">
          <div className="border border-black overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10.5px]">
              <thead>
                <tr className="bg-zinc-100 border-b border-black">
                  <th className="p-3 font-bold uppercase text-zinc-600">Hub / Ecosystem</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Country</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Region</th>
                  <th className="p-3 font-bold uppercase text-zinc-600 text-center">Dealroom score</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Annual Funding Vol</th>
                  <th className="p-3 font-bold uppercase text-zinc-600 text-center">Active Unicorns</th>
                  <th className="p-3 font-bold uppercase text-zinc-600 text-center">Policy Grade</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Talent Academic Anchor</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocations.map(loc => (
                  <tr key={loc.hub} className="border-b border-border hover:bg-zinc-50/70 transition-colors">
                    <td className="p-3 font-bold text-black uppercase flex items-center gap-1.5">
                      <MapPin size={11} className="text-zinc-500" />
                      {loc.hub}
                    </td>
                    <td className="p-3 text-zinc-700">{loc.country}</td>
                    <td className="p-3">
                      <span className="bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 text-zinc-600 uppercase text-[9px]">
                        {loc.region}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-black">
                      {loc.score}
                    </td>
                    <td className="p-3 font-black text-zinc-800">{loc.funding}</td>
                    <td className="p-3 text-center text-zinc-650 font-bold">{loc.unicorns}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-green-50 text-green-800 border border-green-300 font-bold uppercase">
                        {loc.policyGrade}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-500 font-sans text-[10px]">{loc.university}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. INVESTORS                                             */}
      {/* ======================================================== */}
      {activeTab === "investors" && (
        <div className="space-y-4">
          <div className="border border-black overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10.5px]">
              <thead>
                <tr className="bg-zinc-100 border-b border-black">
                  <th className="p-3 font-bold uppercase text-zinc-600">Venture Capital Firm</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Stage Focus</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Geographic Anchor</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Core Industries</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Latest Fund Size</th>
                  <th className="p-3 font-bold uppercase text-zinc-600 text-center">Portfolio Count</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Flagship Bets</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestors.map(inv => (
                  <tr key={inv.firm} className="border-b border-border hover:bg-zinc-50/70 transition-colors">
                    <td className="p-3 font-bold text-black uppercase flex items-center gap-1.5">
                      <Award size={12} className="text-[#00FF9C] fill-[#00FF9C]/20" />
                      {inv.firm}
                    </td>
                    <td className="p-3 text-zinc-700">{inv.stage}</td>
                    <td className="p-3 uppercase text-[9.5px] text-zinc-600">{inv.geo}</td>
                    <td className="p-3">
                      <span className="bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 text-zinc-600 uppercase text-[9px]">
                        {inv.focus}
                      </span>
                    </td>
                    <td className="p-3 font-black text-black">{inv.fundSize}</td>
                    <td className="p-3 text-center text-zinc-650 font-bold">{inv.portfolioCount}</td>
                    <td className="p-3 text-zinc-500 font-sans text-[10px] italic">{inv.stars}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PEOPLE                                                */}
      {/* ======================================================== */}
      {activeTab === "people" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPeople.map((person, idx) => (
              <div key={idx} className="bg-white border border-black p-5 space-y-3.5 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="flex justify-between items-start gap-2 border-b border-zinc-100 pb-2">
                  <div>
                    <span className="text-[8px] bg-black text-white px-1.5 py-0.5 font-bold tracking-wider uppercase block w-max font-mono">
                      {person.role.split(" ")[0].toUpperCase()}
                    </span>
                    <h4 className="font-black text-sm text-black uppercase mt-1 leading-tight font-mono">
                      {person.name}
                    </h4>
                    <span className="text-[10px] text-zinc-500 block font-mono">{person.role} at <strong>{person.company}</strong></span>
                  </div>
                  <UserCircle size={28} className="text-zinc-300 shrink-0" />
                </div>

                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center gap-1 text-zinc-600 font-bold">
                    <MapPin size={11} className="text-zinc-400" />
                    <span>{person.location}</span>
                  </div>
                  <div className="text-[#00ff66] bg-zinc-900 px-2 py-0.5 font-bold uppercase text-[9px] w-max">
                    TRACK: {person.trackRecord}
                  </div>
                </div>

                <p className="text-[10.5px] leading-relaxed text-zinc-700 font-sans">
                  {person.bio}
                </p>

                <div className="pt-2 border-t border-zinc-100 flex justify-end">
                  <a
                    href={`mailto:contact@avant-garde.ai`}
                    className="text-[9px] font-mono font-bold text-zinc-600 hover:text-black uppercase flex items-center gap-1 border border-zinc-200 px-2 py-1 bg-zinc-50"
                  >
                    ACQUIRE INTRODUCTION <ArrowUpRight size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. SECTORS                                               */}
      {/* ======================================================== */}
      {activeTab === "sectors" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSectors.map((sec, idx) => (
              <div key={idx} className="bg-white border border-black p-5 space-y-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start gap-2 border-b border-zinc-150 pb-2.5">
                  <div>
                    <span className="text-[8px] bg-zinc-900 text-white border border-black px-2 py-0.5 font-bold tracking-widest uppercase block w-max font-mono">
                      SECTOR VERTICAL
                    </span>
                    <h3 className="font-black text-[13px] text-black uppercase mt-2 leading-tight font-mono">
                      {sec.name}
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono bg-green-50 text-green-800 border border-green-300 px-1.5 py-0.5 font-bold uppercase">
                    GRADE: {sec.grade}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-zinc-50 p-2.5 border border-zinc-200">
                  <div>
                    <span className="text-zinc-400 block text-[8px] uppercase font-bold">ESTIMATED SIZE (2026)</span>
                    <strong className="text-black">{sec.size2026}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[8px] uppercase font-bold">1-YR SECTOR GROWTH</span>
                    <strong className="text-green-700">{sec.growth}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-zinc-700 font-sans">
                    <strong>Core Drivers:</strong> {sec.coreDriver}
                  </div>
                  <div className="text-[9.5px] font-mono text-zinc-500">
                    <strong>HIGH-GROWTH ASSETS:</strong> <span className="text-black uppercase font-bold">{sec.keyAssets}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-400">Leading Hub: <strong className="text-zinc-700 uppercase">{sec.primaryHub}</strong></span>
                  <span className="text-[#00ff66] font-bold">MONITORED ➔</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. UNIVERSITIES                                          */}
      {/* ======================================================== */}
      {activeTab === "universities" && (
        <div className="space-y-4">
          <div className="border border-black overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10.5px]">
              <thead>
                <tr className="bg-zinc-100 border-b border-black">
                  <th className="p-3 font-bold uppercase text-zinc-600">University Name</th>
                  <th className="p-3 font-bold uppercase text-zinc-600 text-center">Active Alumni Founders</th>
                  <th className="p-3 font-bold uppercase text-zinc-600 text-center">Startups Raised</th>
                  <th className="p-3 font-bold uppercase text-zinc-600 text-center">Unicorns Spawned</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Total Venture Raised</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Enterprise Value Generated</th>
                  <th className="p-3 font-bold uppercase text-zinc-600">Primary Systems Research Lab</th>
                </tr>
              </thead>
              <tbody>
                {filteredUniversities.map((univ, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-zinc-50/70 transition-colors">
                    <td className="p-3 font-bold text-black uppercase flex items-center gap-1.5">
                      <GraduationCap size={13} className="text-zinc-500" />
                      {univ.university}
                    </td>
                    <td className="p-3 text-center text-zinc-700 font-bold">{univ.activeAlumni}</td>
                    <td className="p-3 text-center text-zinc-650 font-bold">{univ.startupsRaised}</td>
                    <td className="p-3 text-center text-purple-800 font-black">{univ.unicorns}</td>
                    <td className="p-3 font-black text-black">{univ.totalRaised}</td>
                    <td className="p-3 text-green-700 font-bold">{univ.evGenerated}</td>
                    <td className="p-3 text-zinc-500 font-sans text-[10px]">{univ.labName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
