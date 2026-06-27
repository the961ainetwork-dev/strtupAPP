export interface SourceDocument {
  id: string;
  name: string;
  content: string;
  clusterId: number;
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  citations?: string[];
  tokens?: {
    input: number;
    output: number;
    total: number;
  };
  model?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  event: string;
  details?: string;
}

export interface ClusterInfo {
  id: number;
  title: string;
  tag: string;
  purpose: string;
  persona: string;
  vaultContext: string;
  chatLogic: string;
  hoverCommand: string;
  sampleQuery: string;
}

export const CLUSTERS: ClusterInfo[] = [
  {
    id: 1,
    title: "AI Tools Research & Comprehension",
    tag: "CLUSTER_01 // COGNITIVE",
    purpose: "Deep-dive analysis, synthesis and explanation of emerging AI models, LLMs, and foundational consumer frameworks.",
    persona: "Elite Technical Researcher",
    vaultContext: "Research papers, model documentation, whitepapers, and market studies.",
    chatLogic: "Breaks down complex mathematical, attention-mechanism, routing, and algorithmic parameters.",
    hoverCommand: "LOAD_COMPREHENSION_MATRIX",
    sampleQuery: "Explain Mixture of Experts parameter routing in Gemini 3.5."
  },
  {
    id: 2,
    title: "Developer AI Tools & Architecture Angle",
    tag: "CLUSTER_02 // SYSTEMS",
    purpose: "Testing and architecture auditing of deep infrastructure tools, multi-agent systems, orchestration graphs, and Vector DBs.",
    persona: "Senior AI Solutions Architect",
    vaultContext: "API schemas, SDK documentations, code repositories, and system architecture charts.",
    chatLogic: "Audits codebase execution paths, maps state variable transfers, and details API integration specs.",
    hoverCommand: "AUDIT_PIPELINE_ORCHESTRATION",
    sampleQuery: "Review the recall optimization metrics of HNSW vector indexing."
  },
  {
    id: 3,
    title: "Investment Analysis & Sovereign Risk",
    tag: "CLUSTER_03 // QUANT",
    purpose: "Macro trajectories tracking, venture capital rounds, macroeconomic indicators, and sovereign computing infrastructure risks.",
    persona: "Macro Tech Financial Analyst",
    vaultContext: "Balance sheets, VC prospectuses, regulatory filings, and sovereign compute allocations.",
    chatLogic: "Runs strict quantitative RAG synthesis and risks modeling without fabricating data.",
    hoverCommand: "SCRAPE_SOVEREIGN_RISK_SPREAD",
    sampleQuery: "Synthesize public sovereign compute contracts for United States and EU."
  },
  {
    id: 4,
    title: "Business Opportunities & Ventures",
    tag: "CLUSTER_04 // ALPHA",
    purpose: "Go-to-market orchestration, operational bottleneck reviews, and business model design for AI-native startups.",
    persona: "Venture Incubation Builder",
    vaultContext: "Competitor analysis frameworks, Pitch decks, blueprints, and operational playbooks.",
    chatLogic: "Stress-tests commercial viability, customer integration layers, and SOC2 compliance paths.",
    hoverCommand: "ORCHESTRATE_INCUBATION_PATH",
    sampleQuery: "Audit go-to-market strategies and SOC2 Type II compliance gaps for vertical AI."
  }
];
