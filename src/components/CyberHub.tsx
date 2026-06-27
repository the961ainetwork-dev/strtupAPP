import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Terminal, X, ArrowRight, ShieldCheck, Cpu, MessageSquare, ChevronDown, ChevronUp, Send, Loader2, Sparkles, Check, Info } from "lucide-react";
import { KnowledgeBase } from "./KnowledgeBase";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What is the 24-Hour Demo Trial?",
    answer: "The 24-Hour Free Demo Trial grants you instant, unrestricted administrative access to all 4 system pillars and the RAG document-grounded notebook workspace. No credit card is required. Once activated, a real-time countdown is displayed, and your access terminates automatically after 24 hours."
  },
  {
    question: "How does the Source-Grounded RAG model work?",
    answer: "RAG (Retrieval-Augmented Generation) ensures that the underlying Gemini model only answers queries based on the files you upload and select in your active workspace. If you query the model without selecting context files, or if the file contents don't contain the answers, the system strictly halts to prevent hallucination."
  },
  {
    question: "What file formats can I upload to the Source Vault?",
    answer: "The platform supports raw textual streams, documentation (.md, .txt, .json, .csv, .yaml), and research transcripts. Each uploaded file is instantly structured and stored locally in the in-memory vector database under the selected active cluster."
  },
  {
    question: "How can I compile reports and export them to PDF?",
    answer: "As you prompt the RAG chat, synthesized intelligence is generated on the left panel. You can easily click and select sections, write manual outlines in the Right panel canvas, and click 'EXPORT REPORT TO PDF' to instantly download a professionally formatted PDF."
  },
  {
    question: "What is the Admin Panel Override at the bottom?",
    answer: "To help you simulate and test various operational webhooks and subscription clearance states (Not Applied, Pending Approval, Approved), you can click the Admin Panel Override at the bottom-right of the screen to toggle database variables instantaneously."
  },
  {
    question: "Is my uploaded data compliant with GDPR guidelines?",
    answer: "Yes. All uploaded files and session transcripts are stored transiently in RAM and active context variables. We do not persist data permanently across sessions unless explicitly requested, and we strictly comply with GDPR data-minimization directives."
  }
];

const STEPS = [
  {
    number: "01",
    title: "Select an Active Cluster",
    description: "Navigate between the four primary operational pathways (AI Research, Architectures, Finance, or GTM Incubators) on the dashboard."
  },
  {
    number: "02",
    title: "Upload Grounding Context",
    description: "In the Left Panel, look at the Source Vault. Use the Upload field to commit custom documentation files (.txt, .md, .yaml) to target that cluster's knowledge vector."
  },
  {
    number: "03",
    title: "Target and Toggle Active Sources",
    description: "Select individual source files using checkmark boxes in the Vault. The chat input strictly enforces active selection to avoid RAG grounding failures."
  },
  {
    number: "04",
    title: "Prompt and Synthesize",
    description: "Submit query signals to the Gemini-grounded neural engine. Copy response blocks, edit titles, and structure your dynamic draft on the Right Panel scratchpad."
  },
  {
    number: "05",
    title: "Export Finished Intelligence",
    description: "Click the 'EXPORT REPORT TO PDF' button. Your compiled draft is rendered on-the-fly into a clean, professional, and audited technical PDF document."
  }
];

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface CyberHubProps {
  onActivateTrialDirectly: (email: string) => Promise<void>;
  currentStatus: "not_applied" | "pending_approval" | "approved";
  onTriggerScrollToPricing: () => void;
}

export const CyberHub: React.FC<CyberHubProps> = ({
  onActivateTrialDirectly,
  currentStatus,
  onTriggerScrollToPricing
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"get_started" | "knowledge_base" | "faq" | "chatbot">("get_started");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // GDPR State
  const [showGDPR, setShowGDPR] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [telemetryConsent, setTelemetryConsent] = useState(true);

  // Chatbot State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "bot",
      text: "OPERATIONAL PROTOCOL ONLINE. I am your platform manual advisor. Ask me anything about RAG parameters, 24h trials, PDF compilers, or GDPR safeguards.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  
  // Trial input workflow in chatbot
  const [chatbotTrialEmail, setChatbotTrialEmail] = useState("");
  const [trialStatusInChat, setTrialStatusInChat] = useState<"idle" | "loading" | "success">("idle");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if GDPR already accepted
    const gdprAccepted = localStorage.getItem("avant_garde_gdpr_accepted");
    if (!gdprAccepted) {
      setShowGDPR(true);
    }
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isBotTyping]);

  const acceptGDPR = () => {
    localStorage.setItem("avant_garde_gdpr_accepted", "true");
    localStorage.setItem("avant_garde_gdpr_telemetry", telemetryConsent.toString());
    setShowGDPR(false);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    const query = chatInput.toLowerCase();
    setChatInput("");
    setIsBotTyping(true);

    setTimeout(() => {
      let replyText = "";
      
      if (query.includes("trial") || query.includes("24") || query.includes("free") || query.includes("demo") || query.includes("register")) {
        if (currentStatus === "approved") {
          replyText = "Your operational access has already been unlocked (Approved state). You are fully cleared to utilize all workspace tools without limits.";
        } else {
          replyText = "The 24-Hour Free Demo Trial can be activated directly. It allows you to bypass the manual audit queue instantly. Simply type your email in the box inside our chatbot UI below, or use the main registration workflow on the dashboard.";
        }
      } else if (query.includes("rag") || query.includes("ground") || query.includes("source") || query.includes("reference")) {
        replyText = "To trigger grounding, select files in the 'Source Vault' panel. If 0 files are selected, the chat input is locked with a warning to avoid RAG failure. This is standard protocol to guarantee absolute context accuracy.";
      } else if (query.includes("pdf") || query.includes("export") || query.includes("report")) {
        replyText = "You can export PDF reports from the Right Panel scratchpad. It bundles the canvas title, current text layout, and the active intelligence pillar name into a secure compiled template.";
      } else if (query.includes("gdpr") || query.includes("cookie") || query.includes("privacy")) {
        replyText = "We strictly enforce GDPR compliance. All data streams are held within transient states. Telemetry tracking can be toggled under cookie regulations. No persistent background telemetry is shared without explicit consent.";
      } else if (query.includes("limit") || query.includes("max") || query.includes("file")) {
        replyText = "Under standard operational guidelines, you can commit up to 50 individual file vectors per cluster. Individual file chunks are indexed directly within our high-performance memory cache.";
      } else if (query.includes("admin") || query.includes("override") || query.includes("webhook")) {
        replyText = "The Admin Panel Override at the bottom-right lets you simulate state triggers. For example, submitting candidacy dispatches a webhook event 'candidacy_submitted' and logs state change updates.";
      } else {
        replyText = "Command acknowledged. Under current manual protocols, I recommend navigating to the 'GET STARTED' tab to view structural timelines, or consulting our interactive FAQ catalog.";
      }

      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setIsBotTyping(false);
    }, 850);
  };

  const handleChatbotRegisterTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatbotTrialEmail.trim()) return;
    setTrialStatusInChat("loading");
    try {
      await onActivateTrialDirectly(chatbotTrialEmail);
      setTrialStatusInChat("success");
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: "bot",
        text: `⚡ SYSTEM LOG: DEMO TRIAL ACTIVATED for '${chatbotTrialEmail}'. Your workspace is now fully unlocked. You have been granted immediate 24-hour clearance. Navigate to any cluster on the dashboard to start!`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (err) {
      setTrialStatusInChat("idle");
    }
  };

  return (
    <>
      {/* GDPR Consent Banner */}
      <AnimatePresence>
        {showGDPR && (
          <motion.div
            id="gdpr-compliance-banner"
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-accent/40 p-5 backdrop-blur-md font-mono text-xs text-zinc-300 shadow-[0_-8px_24px_rgba(0,0,0,0.8)]"
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <span className="text-accent font-black tracking-widest text-[10px] uppercase flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-accent" /> GDPR SECURITY & COMPLIANCE DIRECTIVE (EU 2016/679)
                </span>
                <p className="text-[11px] leading-relaxed text-zinc-400">
                  This platform utilizes browser local storage variables and diagnostic session cookies to secure your 24-Hour Free Demo Trial timeline, preserve workspace scratchpads, and index source text files locally in random access memory (RAM).
                </p>
                <div className="flex flex-wrap gap-4 mt-2 pt-1 text-[10px] text-zinc-500">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={telemetryConsent}
                      onChange={(e) => setTelemetryConsent(e.target.checked)}
                      className="accent-accent border-border"
                    />
                    Enable Local Storage Timeline State Check
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="accent-accent border-border"
                    />
                    Accept Anonymous Server Signal Logging
                  </label>
                </div>
              </div>

              <button
                id="btn-gdpr-accept"
                onClick={acceptGDPR}
                className="bg-accent hover:bg-[#00e08b] text-black font-bold tracking-wider uppercase px-5 py-2.5 border border-accent cursor-pointer transition-colors shrink-0 text-[11px]"
              >
                CONSENT & AUTHORIZE PROTOCOLS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Support Deck Trigger */}
      <div className="fixed bottom-4 left-4 z-40">
        <motion.button
          id="btn-cyberhub-trigger"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-black border border-accent text-accent font-mono text-[11px] font-bold tracking-widest cursor-pointer shadow-[0_0_15px_rgba(0,255,156,0.15)] hover:bg-surface transition-colors"
        >
          <HelpCircle size={14} className="animate-pulse" />
          <span>OPERATIONAL CORE MANUAL</span>
        </motion.button>
      </div>

      {/* Manual & Help Modal */}
      <AnimatePresence>
        {isOpen && (
          <div id="cyberhub-modal-overlay" className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              id="cyberhub-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border max-w-3xl w-full h-[80vh] flex flex-col font-mono text-zinc-300 relative"
            >
              {/* Header */}
              <div className="p-4 border-b border-border bg-black flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-accent" />
                  <span className="text-white font-black tracking-widest text-xs uppercase">
                    Avant-Garde Platform Manual v1.2
                  </span>
                </div>
                <button
                  id="btn-cyberhub-close"
                  onClick={() => setIsOpen(false)}
                  className="text-text-dim hover:text-white cursor-pointer text-xs"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-border bg-[#050505] shrink-0 text-[11px]">
                <button
                  id="tab-get-started"
                  onClick={() => setActiveTab("get_started")}
                  className={`flex-1 py-3 text-center font-bold tracking-widest border-r border-border transition-colors cursor-pointer ${
                    activeTab === "get_started" ? "bg-surface text-accent border-b border-b-accent" : "text-text-dim hover:text-white"
                  }`}
                >
                  [01] GET STARTED
                </button>
                <button
                  id="tab-knowledge-base"
                  onClick={() => setActiveTab("knowledge_base")}
                  className={`flex-1 py-3 text-center font-bold tracking-widest border-r border-border transition-colors cursor-pointer ${
                    activeTab === "knowledge_base" ? "bg-surface text-accent border-b border-b-accent" : "text-text-dim hover:text-white"
                  }`}
                >
                  [02] KNOWLEDGE BASE
                </button>
                <button
                  id="tab-faq"
                  onClick={() => setActiveTab("faq")}
                  className={`flex-1 py-3 text-center font-bold tracking-widest border-r border-border transition-colors cursor-pointer ${
                    activeTab === "faq" ? "bg-surface text-accent border-b border-b-accent" : "text-text-dim hover:text-white"
                  }`}
                >
                  [03] SYSTEM FAQ
                </button>
                <button
                  id="tab-chatbot"
                  onClick={() => setActiveTab("chatbot")}
                  className={`flex-1 py-3 text-center font-bold tracking-widest transition-colors cursor-pointer ${
                    activeTab === "chatbot" ? "bg-surface text-accent border-b border-b-accent" : "text-text-dim hover:text-white"
                  }`}
                >
                  [04] ASSISTANCE CHATBOT
                </button>
              </div>

              {/* Main Content Pane */}
              <div className="flex-grow p-5 overflow-y-auto scrollbar-custom bg-[#09090c]">
                
                {/* TAB 1: GET STARTED GUIDE */}
                {activeTab === "get_started" && (
                  <div className="space-y-6">
                    <div className="border border-accent/20 bg-accent/5 p-4 flex items-start gap-3">
                      <Info size={16} className="text-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="text-accent font-black text-xs block uppercase">UNIFIED PIPELINE BRIEFING</span>
                        <p className="text-[11px] leading-relaxed text-zinc-300 mt-1">
                          The Avant-Garde platform provides real-time model synthesis grounded strictly in uploaded user reference manuals. To successfully compile an audit dossier, execute the pipeline workflow mapped below.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] text-text-dim tracking-widest uppercase font-black block">SYSTEM WORKFLOW MILESTONES</span>
                      <div className="grid grid-cols-1 gap-3">
                        {STEPS.map((step) => (
                          <div key={step.number} className="border border-border bg-black/40 p-3.5 flex items-start gap-4">
                            <span className="text-accent font-black text-sm tracking-tighter shrink-0">{step.number}</span>
                            <div>
                              <h5 className="text-xs font-black text-white uppercase tracking-wider">{step.title}</h5>
                              <p className="text-[11px] leading-relaxed text-zinc-400 mt-1">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {currentStatus !== "approved" && (
                      <div className="border border-dashed border-border p-4 text-center space-y-3">
                        <span className="text-[10px] text-text-dim block uppercase">READY TO EXECUTE CORE CHANNELS?</span>
                        <button
                          id="guide-btn-trial"
                          onClick={() => {
                            setActiveTab("chatbot");
                            setChatMessages(prev => [...prev, {
                              id: Math.random().toString(),
                              sender: "bot",
                              text: "Great! I've loaded the 24-Hour Free Demo registration pipeline directly in our chatbot below. Please enter your email to get instant clearance.",
                              timestamp: new Date().toLocaleTimeString()
                            }]);
                          }}
                          className="px-4 py-2 bg-accent text-black font-bold tracking-wider text-[10px] uppercase cursor-pointer hover:bg-[#00e08b] transition-colors"
                        >
                          ACTIVATE 24-HOUR DEMO WORKSPACE
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: KNOWLEDGE BASE */}
                {activeTab === "knowledge_base" && (
                  <KnowledgeBase />
                )}

                {/* TAB 2: SYSTEM FAQ */}
                {activeTab === "faq" && (
                  <div className="space-y-4">
                    <span className="text-[10px] text-text-dim tracking-widest uppercase font-black block">FREQUENTLY ENCOUNTERED SIGNAL QUERIES</span>
                    <div className="space-y-2.5">
                      {FAQ_DATA.map((faq, idx) => {
                        const isOpen = openFaqIndex === idx;
                        return (
                          <div key={idx} className="border border-border bg-black/30">
                            <button
                              onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                              className="w-full text-left p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors text-white hover:text-accent"
                            >
                              <span>{faq.question}</span>
                              {isOpen ? <ChevronUp size={14} className="text-accent" /> : <ChevronDown size={14} className="text-text-dim" />}
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden border-t border-border"
                                >
                                  <p className="p-4 text-[11px] leading-relaxed text-zinc-400 font-normal">
                                    {faq.answer}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: HELP CHATBOT */}
                {activeTab === "chatbot" && (
                  <div className="h-full flex flex-col">
                    <div className="flex-grow min-h-[250px] max-h-[350px] border border-border bg-black p-3 overflow-y-auto space-y-3.5 scrollbar-custom">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                          <div className={`max-w-[85%] p-3 text-[11px] leading-relaxed font-mono ${
                            msg.sender === "user" ? "bg-accent/15 border border-accent text-white" : "bg-surface border border-border text-zinc-300"
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[8px] text-text-dim uppercase mt-1">{msg.sender === "user" ? "OPERATOR" : "SYSTEM MANUAL CORRELATION"} // {msg.timestamp}</span>
                        </div>
                      ))}
                      {isBotTyping && (
                        <div className="flex items-center gap-1.5 text-accent text-[10px] animate-pulse">
                          <Loader2 size={12} className="animate-spin" /> CORRELATING GROUNDING DATA...
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input or Inline Trial Registration Box */}
                    {currentStatus !== "approved" && (
                      <div className="mt-4 p-3 bg-accent/5 border border-accent/20">
                        <span className="text-[10px] text-accent font-black uppercase tracking-wider block mb-2">QUICK LINK: 24-HOUR DEMO ACCOUNT REGISTRATION</span>
                        {trialStatusInChat === "success" ? (
                          <div className="text-[11px] font-bold text-accent uppercase flex items-center gap-1.5 py-1">
                            <Check size={14} /> DEMO CLEARANCE ACTIVE. RE-LOADING ENGINE STATE.
                          </div>
                        ) : (
                          <form onSubmit={handleChatbotRegisterTrial} className="flex gap-2">
                            <input
                              type="email"
                              required
                              value={chatbotTrialEmail}
                              onChange={(e) => setChatbotTrialEmail(e.target.value)}
                              placeholder="operator@organization.com"
                              className="flex-grow bg-black border border-border p-2 text-xs focus:outline-none focus:border-accent text-white"
                            />
                            <button
                              type="submit"
                              disabled={trialStatusInChat === "loading"}
                              className="bg-accent hover:bg-[#00e08b] text-black font-bold text-[10px] tracking-widest uppercase px-4 py-2 border border-accent cursor-pointer transition-colors disabled:opacity-40"
                            >
                              {trialStatusInChat === "loading" ? "ACTIVATING..." : "START TRIAL"}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex gap-2 shrink-0">
                      <input
                        id="cyberchat-input"
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                        placeholder="Inquire about RAG, GDPR, file capacities..."
                        className="flex-grow bg-black border border-border p-2.5 text-xs text-white focus:outline-none focus:border-accent"
                      />
                      <button
                        id="btn-send-cyberchat"
                        onClick={handleSendChatMessage}
                        disabled={!chatInput.trim()}
                        className="bg-accent hover:bg-[#00e08b] text-black font-bold p-2.5 border border-accent cursor-pointer transition-colors disabled:opacity-40"
                      >
                        <Send size={14} />
                      </button>
                    </div>

                    {/* Quick helper tag buttons inside chat */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setChatInput("How do I upload custom grounding documents?")}
                        className="text-[9px] bg-surface border border-border hover:border-accent hover:text-white px-2 py-1 transition-colors text-text-dim"
                      >
                        #UPLOAD_FILES
                      </button>
                      <button
                        onClick={() => setChatInput("Is my data GDPR compliant?")}
                        className="text-[9px] bg-surface border border-border hover:border-accent hover:text-white px-2 py-1 transition-colors text-text-dim"
                      >
                        #GDPR_SAFEGUARDS
                      </button>
                      <button
                        onClick={() => setChatInput("How can I export PDF reports?")}
                        className="text-[9px] bg-surface border border-border hover:border-accent hover:text-white px-2 py-1 transition-colors text-text-dim"
                      >
                        #EXPORT_PDF
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="p-4 bg-black border-t border-border flex justify-between items-center text-[9px] text-text-dim shrink-0 uppercase tracking-widest">
                <span>SECURITY LEVEL: DEMO GRANTED</span>
                <span>SYSTEM ACTIVE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
