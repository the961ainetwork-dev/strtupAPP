import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State
interface SourceDocument {
  id: string;
  name: string;
  content: string;
  clusterId: number;
  uploadedAt: string;
}

let userStatus: "not_applied" | "pending_approval" | "approved" = "not_applied";
let trialEmail: string = "";
let trialExpiresAt: number | null = null;
let systemLogs: Array<{ id: string; timestamp: string; event: string; details?: string }> = [];

// Pre-populated default documents for the 4 clusters
let sourceDocuments: SourceDocument[] = [
  // Cluster 1
  {
    id: "c1-doc1",
    name: "emerging_llm_architectures_2026.pdf",
    content: "A detailed analysis of Mixture of Experts (MoE) in Gemini 3.5. Model scale reaches 1.2 Trillion parameters with active routing of 64 expert modules. Token window extended to 5 Million tokens with linear attention mechanisms.",
    clusterId: 1,
    uploadedAt: new Date().toISOString()
  },
  {
    id: "c1-doc2",
    name: "consumer_ai_framework_adoption.md",
    content: "Consumer interfaces are shifting to conversational agents. Research shows 72% of developers are integrating deep multi-turn agents. Frame latency drops below 150ms for voice modalities.",
    clusterId: 1,
    uploadedAt: new Date().toISOString()
  },
  // Cluster 2
  {
    id: "c2-doc1",
    name: "multi_agent_orchestration_specs.yaml",
    content: "Orchestration engine specs. Agents use directed acyclic graphs (DAGs) to pass state variables. Prompt routing takes 35ms. Persistence layer stores chat histories in high-performance local memory.",
    clusterId: 2,
    uploadedAt: new Date().toISOString()
  },
  {
    id: "c2-doc2",
    name: "vector_db_indexing_benchmarks.txt",
    content: "Vector search benchmark: Hierarchical Navigable Small World (HNSW) graphs achieve 98.4% recall at 1200 QPS. Cosine distance queries are optimized using SIMD parallel hardware instructions.",
    clusterId: 2,
    uploadedAt: new Date().toISOString()
  },
  // Cluster 3
  {
    id: "c3-doc1",
    name: "macro_sovereign_tech_exposure_2026.csv",
    content: "Sovereign AI capital allocation: United States allocated $42B in federal compute contracts. EU sovereign funds committed €15B for localized LLM training clusters. Sovereign risk is concentrated in GPU shipping lanes and energy grid dependencies.",
    clusterId: 3,
    uploadedAt: new Date().toISOString()
  },
  {
    id: "c3-doc2",
    name: "ai_venture_funding_trajectories.json",
    content: "AI-native funding rounds: Seed rounds average $8.5M at $45M valuation. Series A rounds have ballooned to $38M average. Capital flows are shifting from raw model training to vertical-specific workflow automation tools.",
    clusterId: 3,
    uploadedAt: new Date().toISOString()
  },
  // Cluster 4
  {
    id: "c4-doc1",
    name: "ai_native_startup_playbook.md",
    content: "Venture incubation model: Core GTM is high-density customer integrations. Product-led growth (PLG) strategies combined with customized enterprise APIs. Key operational gap is enterprise-grade security compliance (SOC2 Type II).",
    clusterId: 4,
    uploadedAt: new Date().toISOString()
  },
  {
    id: "c4-doc2",
    name: "competitor_landscape_blueprints.json",
    content: "Competitor matrix: 45% of startups focus on customer service agents, 30% focus on code intelligence, and 25% focus on complex analytical workflows. Gaps remain in secure cross-border data orchestration.",
    clusterId: 4,
    uploadedAt: new Date().toISOString()
  }
];

// Helper to log system events (admin dashboard signals, webhooks)
function logSystemEvent(event: string, details?: string) {
  systemLogs.unshift({
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    event,
    details
  });
}

// Initialize system log
logSystemEvent("System Initialized", "STARTUP Platform server running.");

// Lazy initialize Gemini Client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return null to trigger smart-simulation fallback cleanly
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Personas & System Prompts
const SYSTEM_PROMPTS: Record<number, string> = {
  1: `You are an elite technical researcher specializing in AI Tools Research & Comprehension. Your task is to explain, analyze, and synthesize emerging AI models and foundational consumer frameworks.
Strict RAG Rules:
- You must ONLY use the provided Source Documents to answer. Do not use outside knowledge.
- You must explicitly cite the active source file name using brackets like [Source: filename.pdf] when referencing information from it.
- If the user's query cannot be answered using the provided Source Documents, or if no sources are selected, or if the query falls outside their bounds, you MUST reply with exactly: "The selected source vector contains no baseline data regarding this query." Do not add anything else.`,

  2: `You are a Senior AI Solutions Architect specializing in Developer AI Tools & Architecture. Your task is to evaluate deep infrastructure developer tools, Multi-Agent Systems, Orchestration Frameworks, Vector DBs, and prompt engineering utilities.
Strict RAG Rules:
- You must ONLY use the provided Source Documents to answer. Do not use outside knowledge.
- You must explicitly cite the active source file name using brackets like [Source: filename.pdf] when referencing information from it.
- If the user's query cannot be answered using the provided Source Documents, or if no sources are selected, or if the query falls outside their bounds, you MUST reply with exactly: "The selected source vector contains no baseline data regarding this query." Do not add anything else.`,

  3: `You are an expert Financial Analyst specializing in Investment Analysis & Sovereign Risk. Your task is to run quantitative synthesis and track financial trajectories, funding rounds, macroeconomic indicators, and sovereign technology sector exposure.
Strict RAG Rules:
- You must ONLY use the provided Source Documents to answer. Do not use outside knowledge. Do not invent or estimate financial metrics outside of the documents.
- You must explicitly cite the active source file name using brackets like [Source: filename.pdf] when referencing information from it.
- If the user's query cannot be answered using the provided Source Documents, or if no sources are selected, or if the query falls outside their bounds, you MUST reply with exactly: "The selected source vector contains no baseline data regarding this query." Do not add anything else.`,

  4: `You are an elite Venture Builder specializing in Business Opportunities & Ventures. Your task is to evaluate go-to-market strategies, identify operational gaps, and design incubation pathways for AI-native startup models.
Strict RAG Rules:
- You must ONLY use the provided Source Documents to answer. Do not use outside knowledge.
- You must explicitly cite the active source file name using brackets like [Source: filename.pdf] when referencing information from it.
- If the user's query cannot be answered using the provided Source Documents, or if no sources are selected, or if the query falls outside their bounds, you MUST reply with exactly: "The selected source vector contains no baseline data regarding this query." Do not add anything else.`
};

// Simulated Intelligent Offline RAG Model in case Gemini API is unconfigured/offline
function simulateOfflineRAG(clusterId: number, query: string, selectedSources: SourceDocument[]) {
  if (selectedSources.length === 0) {
    return {
      text: "The selected source vector contains no baseline data regarding this query.",
      tokens: { input: 45, output: 12, total: 57 },
      citations: []
    };
  }

  // Look for key phrases or words matching the documents
  const matchedSources: SourceDocument[] = [];
  const qLower = query.toLowerCase();

  for (const doc of selectedSources) {
    // Find if words in the document overlap with the query or simple match
    const words = qLower.split(/[^a-zA-Z0-9]/).filter(w => w.length > 3);
    const contentLower = doc.content.toLowerCase();
    const nameLower = doc.name.toLowerCase();

    // Check query overlap with doc name or content keywords
    const isMatch = words.some(w => contentLower.includes(w) || nameLower.includes(w)) || 
                    qLower.includes("all") || qLower.includes("summary") || qLower.includes("explain") || 
                    qLower.includes("list") || qLower.includes("tell me") || qLower.includes("analyze") ||
                    qLower.includes("synthesize");

    if (isMatch) {
      matchedSources.push(doc);
    }
  }

  if (matchedSources.length === 0) {
    return {
      text: "The selected source vector contains no baseline data regarding this query.",
      tokens: { input: 120, output: 14, total: 134 },
      citations: []
    };
  }

  // Construct a beautiful synthesis based on matched source materials with proper brackets [Source: name]
  let synthesisText = "";
  const citations = matchedSources.map(s => s.name);

  if (clusterId === 1) {
    synthesisText = `### Elite Technical Synthesis\nBased on your selected sources, here is the architectural and framework breakdown:\n\n`;
    matchedSources.forEach(s => {
      if (s.name.includes("architecture")) {
        synthesisText += `- **Mixture of Experts Routing**: Gemini 3.5 introduces active routing of 64 expert modules, pushing the model scale to 1.2 Trillion parameters with an expansive 5 Million tokens window. This represents a huge breakthrough in processing depth and attention efficiency. [Source: ${s.name}]\n\n`;
      } else if (s.name.includes("framework")) {
        synthesisText += `- **Consumer Agent Shifts**: Developer trends indicate that 72% are actively transitioning to integrating multi-turn agent pathways. Due to optimization, voice modality latency is verified to drop below 150ms. [Source: ${s.name}]\n\n`;
      } else {
        synthesisText += `- **Document Evaluation**: ${s.content} [Source: ${s.name}]\n\n`;
      }
    });
    synthesisText += `\n*Analysis compiled via Comprehension Engine.*`;
  } else if (clusterId === 2) {
    synthesisText = `### Infrastructure & Developer Tool Audit\nActive code pathways and pipeline evaluation:\n\n`;
    matchedSources.forEach(s => {
      if (s.name.includes("orchestration")) {
        synthesisText += `- **Directed Acyclic Graph (DAG) State Transfers**: Orchestration protocols leverage high-performance DAG configurations to carry variables, limiting routing latency to a mere 35ms. Chat states are persisted locally in-memory for maximum speed. [Source: ${s.name}]\n\n`;
      } else if (s.name.includes("vector")) {
        synthesisText += `- **Vector DB Benchmarking**: Under standard HNSW graph indexing configurations, cosine distance searches achieve 98.4% recall at 1200 queries per second (QPS), accelerated natively through SIMD hardware architectures. [Source: ${s.name}]\n\n`;
      } else {
        synthesisText += `- **API/Architecture Mapping**: ${s.content} [Source: ${s.name}]\n\n`;
      }
    });
  } else if (clusterId === 3) {
    synthesisText = `### Quantitative Tech Sector Synthesis & Sovereign Risks\nFinancial metrics and geopolitical compute allocations analysis:\n\n`;
    matchedSources.forEach(s => {
      if (s.name.includes("macro_sovereign")) {
        synthesisText += `- **Sovereign Capital Allocations**: The United States leads with $42 Billion in dedicated federal compute contracts, while the European Union has committed €15 Billion to sovereign cluster deployments. Critical risk vectors lie in physical GPU shipping lanes and power grid limitations. [Source: ${s.name}]\n\n`;
      } else if (s.name.includes("funding")) {
        synthesisText += `- **Capital & Funding Rounds**: Early-stage venture seed rounds now average $8.5 Million (pegged at a $45 Million valuation ceiling), while Series A rounds scale to $38 Million. Focus is moving rapidly from foundation models towards vertical automation utilities. [Source: ${s.name}]\n\n`;
      } else {
        synthesisText += `- **Balance Sheet Metrics**: ${s.content} [Source: ${s.name}]\n\n`;
      }
    });
  } else {
    synthesisText = `### Venture Strategy & Go-To-Market Evaluation\nStress-testing operational blueprints and incubation viability:\n\n`;
    matchedSources.forEach(s => {
      if (s.name.includes("playbook")) {
        synthesisText += `- **Enterprise Integrations & Compliance Gaps**: Incubation pathways must leverage a hybrid PLG-enterprise strategy. However, the most vital operational bottleneck is securing SOC2 Type II certifications for secure data custody. [Source: ${s.name}]\n\n`;
      } else if (s.name.includes("landscape")) {
        synthesisText += `- **Competitor Clustering**: Current sector layouts place 45% of startups in client service/support, 30% in code/developer intelligence, and 25% in custom analytical workflows. Unexploited value lies in localized compliance automation. [Source: ${s.name}]\n\n`;
      } else {
        synthesisText += `- **Venture Opportunity Blueprint**: ${s.content} [Source: ${s.name}]\n\n`;
      }
    });
  }

  return {
    text: synthesisText,
    tokens: { input: 150 + query.length, output: synthesisText.length / 4, total: Math.floor(150 + query.length + synthesisText.length / 4) },
    citations
  };
}

// --- API ENDPOINTS ---

// User Tier Status
app.get("/api/user-status", (req, res) => {
  // If trial has expired, reset status
  if (trialExpiresAt && Date.now() > trialExpiresAt) {
    userStatus = "not_applied";
    trialExpiresAt = null;
    logSystemEvent(
      "Trial Period Expired",
      `24-hour trial period for user '${trialEmail || "maanbarazy@gmail.com"}' has automatically ended.`
    );
  }
  
  res.json({
    status: userStatus,
    email: trialEmail || "maanbarazy@gmail.com",
    trialExpiresAt: trialExpiresAt
  });
});

// Register for 24-Hour Free Demo Trial
app.post("/api/register-trial", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email address is required for trial registration." });
  }

  userStatus = "approved";
  trialEmail = email.trim();
  trialExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours in ms

  logSystemEvent(
    "Webhook Triggered: trial_registered",
    `User '${trialEmail}' registered directly. Instant 24-Hour Free Demo Access approved.`
  );

  res.json({
    success: true,
    status: userStatus,
    trialExpiresAt,
    email: trialEmail,
    message: "24-Hour trial successfully initialized."
  });
});

// Apply for Prime Tier (Gatekeeper flow)
app.post("/api/apply-prime", (req, res) => {
  userStatus = "pending_approval";
  logSystemEvent(
    "Webhook Triggered: candidacy_submitted",
    `User 'maanbarazy@gmail.com' submitted candidacy. Dispatching webhook notification payload to admin dashboard.`
  );
  res.json({
    success: true,
    status: userStatus,
    message: "Candidacy submitted. The administrative team is verifying your application."
  });
});

// Admin override to toggle user status
app.post("/api/admin/toggle-approval", (req, res) => {
  const { status } = req.body;
  if (status === "approved" || status === "pending_approval" || status === "not_applied") {
    userStatus = status;
    logSystemEvent(
      "Admin Status Update Override",
      `User status manually toggled to [${status.toUpperCase()}] by Administrator.`
    );
    res.json({ success: true, status: userStatus });
  } else {
    res.status(400).json({ error: "Invalid status state requested" });
  }
});

// System Logs
app.get("/api/system-logs", (req, res) => {
  res.json(systemLogs);
});

// Sources Vault Lists
app.get("/api/sources", (req, res) => {
  const clusterId = parseInt(req.query.clusterId as string) || 1;
  const filtered = sourceDocuments.filter(doc => doc.clusterId === clusterId);
  res.json(filtered);
});

// Add custom source document
app.post("/api/sources", (req, res) => {
  const { name, content, clusterId } = req.body;
  if (!name || !content || !clusterId) {
    return res.status(400).json({ error: "Missing required document parameters (name, content, clusterId)" });
  }

  const newDoc: SourceDocument = {
    id: "doc-" + Math.random().toString(36).substring(7),
    name: name.trim().replace(/\s+/g, "_"),
    content,
    clusterId: parseInt(clusterId),
    uploadedAt: new Date().toISOString()
  };

  sourceDocuments.push(newDoc);
  logSystemEvent(
    "Document Added to Source Vault",
    `Document '${newDoc.name}' (Size: ${newDoc.content.length} chars) committed into Cluster ${newDoc.clusterId}.`
  );
  res.json({ success: true, document: newDoc });
});

// Delete source document
app.delete("/api/sources/:id", (req, res) => {
  const { id } = req.params;
  const index = sourceDocuments.findIndex(doc => doc.id === id);
  if (index !== -1) {
    const deleted = sourceDocuments.splice(index, 1)[0];
    logSystemEvent(
      "Document Purged from Vault",
      `Document '${deleted.name}' deleted from Cluster ${deleted.clusterId}.`
    );
    res.json({ success: true, id });
  } else {
    res.status(404).json({ error: "Document not found" });
  }
});

// Source-Grounded Intelligent Chat (RAG)
app.post("/api/chat", async (req, res) => {
  const { clusterId, message, selectedSourceIds } = req.body;
  if (!clusterId || !message) {
    return res.status(400).json({ error: "Missing clusterId or message parameter" });
  }

  const cid = parseInt(clusterId);
  const selectedDocs = sourceDocuments.filter(doc => 
    doc.clusterId === cid && (selectedSourceIds || []).includes(doc.id)
  );

  // Attempt real Gemini API call
  const ai = getGeminiClient();
  if (ai) {
    try {
      if (selectedDocs.length === 0) {
        return res.json({
          text: "The selected source vector contains no baseline data regarding this query.",
          tokens: { input: 20, output: 14, total: 34 },
          citations: [],
          model: "gemini-3.5-flash (Grounded)"
        });
      }

      const systemInstruction = SYSTEM_PROMPTS[cid] || SYSTEM_PROMPTS[1];
      const contextText = selectedDocs.map(d => `--- START SOURCE: ${d.name} ---\n${d.content}\n--- END SOURCE ---`).join("\n\n");
      
      const fullPrompt = `The user is querying you under active context files.
You MUST adhere strictly to the RAG instructions and personhood rules.

Selected Source Material Context:
${contextText}

User Query: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });

      const responseText = response.text || "No response text was generated.";
      const metadata = response.usageMetadata || { promptTokenCount: 150, candidatesTokenCount: 80, totalTokenCount: 230 };

      // Gather simple citations match from response text to match file names
      const citations = selectedDocs
        .filter(d => responseText.includes(d.name))
        .map(d => d.name);

      return res.json({
        text: responseText,
        tokens: {
          input: metadata.promptTokenCount,
          output: metadata.candidatesTokenCount,
          total: metadata.totalTokenCount
        },
        citations: citations.length > 0 ? citations : selectedDocs.map(d => d.name),
        model: "gemini-3.5-flash"
      });

    } catch (err: any) {
      console.error("Gemini API call failed, falling back to offline simulation:", err.message);
      // Fallback gracefully
      const sim = simulateOfflineRAG(cid, message, selectedDocs);
      return res.json({
        ...sim,
        model: "gemini-3.5-flash (Simulated Fallback due to API error/rate-limit)"
      });
    }
  } else {
    // Return offline simulation immediately if no Gemini API key
    const sim = simulateOfflineRAG(cid, message, selectedDocs);
    return res.json({
      ...sim,
      model: "gemini-3.5-flash (Simulated Offline Engine)"
    });
  }
});


// Serve the service worker file with correct MIME type
app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(process.cwd(), "src", "sw.js"));
});


// --- VITE MIDDLEWARE AND SPA FALLBACK SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
