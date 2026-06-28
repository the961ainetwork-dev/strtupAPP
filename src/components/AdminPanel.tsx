import React, { useState, useEffect } from "react";
import { Shield, Users, FileText, Plus, Trash2, Edit2, Check, AlertTriangle, RefreshCw, Sparkles, X } from "lucide-react";
import { UserAccount } from "./AuthPage";

interface SuccessStory {
  id: string;
  title: string;
  clientName: string;
  subSector: string;
  impactMetrics: string;
  description: string;
  datePublished: string;
}

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"users" | "stories">("users");
  const [selectedStoryForPopup, setSelectedStoryForPopup] = useState<SuccessStory | null>(null);

  // Story Form State
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyClient, setStoryClient] = useState("");
  const [storySector, setStorySector] = useState("");
  const [storyMetrics, setStoryMetrics] = useState("");
  const [storyDesc, setStoryDesc] = useState("");

  const [notification, setNotification] = useState("");

  // Load users and stories
  useEffect(() => {
    loadUsers();
    loadStories();
  }, []);

  const loadUsers = () => {
    const rawUsers = localStorage.getItem("startup_users");
    if (rawUsers) {
      setUsers(JSON.parse(rawUsers));
    } else {
      const defaultUsers: UserAccount[] = [
        {
          email: "admin@startup.ai",
          fullName: "Maan Barazy (Administrator)",
          role: "admin",
          signUpDate: "2026-01-15",
          status: "active"
        },
        {
          email: "faisal@riyadh.vc",
          fullName: "Faisal Al-Jassim",
          role: "venture_builder",
          signUpDate: "2026-04-10",
          status: "active"
        },
        {
          email: "dr.amina@stanford.edu",
          fullName: "Dr. Amina El-Khoury",
          role: "developer",
          signUpDate: "2026-05-22",
          status: "active"
        }
      ];
      localStorage.setItem("startup_users", JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  };

  const loadStories = () => {
    const rawStories = localStorage.getItem("startup_stories");
    if (rawStories) {
      setStories(JSON.parse(rawStories));
    } else {
      const defaultStories: SuccessStory[] = [
        {
          id: "story-1",
          title: "Sovereign Arabized Vector Translation Infrastructure",
          clientName: "Ministry of Digits & Communications",
          subSector: "Sovereign AI Infrastructure",
          impactMetrics: "+140% dialectoral precision match, 0.4ms context latency",
          description: "Implemented custom multi-layer RAG matching parameters to safely translate local municipal dialects inside air-gapped regional databases.",
          datePublished: "2026-03-12"
        },
        {
          id: "story-2",
          title: "Continuous Multi-Agent Compliance Pipeline Setup",
          clientName: "Riyadh Legal Advisors Joint-Stock",
          subSector: "AI for Legal",
          impactMetrics: "94% review workflow compression, 45,000 documents verified/mo",
          description: "Structured persistent webhook pipelines querying automated compliance logs to continuously monitor multi-user legal workspace drafts.",
          datePublished: "2026-05-01"
        }
      ];
      localStorage.setItem("startup_stories", JSON.stringify(defaultStories));
      setStories(defaultStories);
    }
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // User Actions
  const handleToggleUserStatus = (email: string) => {
    const updated = users.map(u => {
      if (u.email === email) {
        // Prevent disabling self
        if (email === "admin@startup.ai") {
          triggerNotification("Security block: Root administrator account cannot be suspended.");
          return u;
        }
        const newStatus = u.status === "active" ? "suspended" : "active";
        return { ...u, status: newStatus as "active" | "suspended" };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("startup_users", JSON.stringify(updated));
    triggerNotification("User account status modified successfully.");
  };

  const handleDeleteUser = (email: string) => {
    if (email === "admin@startup.ai") {
      triggerNotification("Security block: Root administrator account cannot be removed.");
      return;
    }
    const filtered = users.filter(u => u.email !== email);
    setUsers(filtered);
    localStorage.setItem("startup_users", JSON.stringify(filtered));
    triggerNotification("User registration credentials purged from database.");
  };

  const handleChangeUserRole = (email: string, newRole: UserAccount["role"]) => {
    const updated = users.map(u => {
      if (u.email === email) {
        return { ...u, role: newRole };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("startup_users", JSON.stringify(updated));
    triggerNotification(`Clearance modified successfully for ${email}.`);
  };

  // Story Actions
  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim() || !storyClient.trim() || !storyDesc.trim()) {
      triggerNotification("Please fill in all mandatory success story text boxes.");
      return;
    }

    let updatedStories: SuccessStory[] = [];

    if (editingStoryId) {
      // Edit mode
      updatedStories = stories.map(st => {
        if (st.id === editingStoryId) {
          return {
            ...st,
            title: storyTitle.trim(),
            clientName: storyClient.trim(),
            subSector: storySector.trim() || "Multi-Agent Frameworks",
            impactMetrics: storyMetrics.trim() || "Active Pilot Mode",
            description: storyDesc.trim()
          };
        }
        return st;
      });
      triggerNotification("Success story parameters updated successfully.");
    } else {
      // Create mode
      const newStory: SuccessStory = {
        id: `story-custom-${Date.now()}`,
        title: storyTitle.trim(),
        clientName: storyClient.trim(),
        subSector: storySector.trim() || "Multi-Agent Frameworks",
        impactMetrics: storyMetrics.trim() || "Active Pilot Mode",
        description: storyDesc.trim(),
        datePublished: new Date().toISOString().split("T")[0]
      };
      updatedStories = [newStory, ...stories];
      triggerNotification("New DeepTech success story added to public catalog.");
    }

    setStories(updatedStories);
    localStorage.setItem("startup_stories", JSON.stringify(updatedStories));

    // Clear inputs
    setEditingStoryId(null);
    setStoryTitle("");
    setStoryClient("");
    setStorySector("");
    setStoryMetrics("");
    setStoryDesc("");
  };

  const handleStartEditStory = (st: SuccessStory) => {
    setEditingStoryId(st.id);
    setStoryTitle(st.title);
    setStoryClient(st.clientName);
    setStorySector(st.subSector);
    setStoryMetrics(st.impactMetrics);
    setStoryDesc(st.description);
  };

  const handleDeleteStory = (storyId: string) => {
    const filtered = stories.filter(st => st.id !== storyId);
    setStories(filtered);
    localStorage.setItem("startup_stories", JSON.stringify(filtered));
    triggerNotification("Success story entry removed.");
  };

  const handleCancelStoryEdit = () => {
    setEditingStoryId(null);
    setStoryTitle("");
    setStoryClient("");
    setStorySector("");
    setStoryMetrics("");
    setStoryDesc("");
  };

  return (
    <div id="admin-panel-root" className="p-6 space-y-6 text-black bg-white">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-widest">SYSTEM CONTROL PANEL</span>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <Shield size={18} className="text-black" />
            ADMIN COCKPIT & DIRECTORY CONTROLS
          </h2>
          <p className="text-[11px] text-zinc-600 mt-1 max-w-2xl font-sans">
            Secure multi-user administration dashboard to monitor user registrations, toggle security access suspension, and compose custom deeptech success stories.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab("users")}
            className={`px-3 py-1.5 border text-xs font-bold uppercase cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "users" ? "bg-black text-white border-black" : "bg-white border-border text-zinc-600 hover:text-black"
            }`}
          >
            <Users size={12} /> ADMINISTRATE SIGN-UPS ({users.length})
          </button>
          <button
            onClick={() => setActiveSubTab("stories")}
            className={`px-3 py-1.5 border text-xs font-bold uppercase cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === "stories" ? "bg-black text-white border-black" : "bg-white border-border text-zinc-600 hover:text-black"
            }`}
          >
            <FileText size={12} /> SUCCESS STORIES ({stories.length})
          </button>
        </div>
      </div>

      {/* Live Action Notifications */}
      {notification && (
        <div className="bg-zinc-900 text-white p-3 font-mono text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all">
          <Sparkles size={12} className="text-amber-400 animate-pulse" />
          {notification}
        </div>
      )}

      {activeSubTab === "users" ? (
        /* ======================================================== */
        /* ADMINISTRATE SIGN-UPS SECTION                            */
        /* ======================================================== */
        <div className="space-y-4">
          <div className="border border-border bg-zinc-50 p-3.5 text-[10.5px] font-sans leading-normal text-zinc-600">
            <strong>ADMINISTRATOR NOTICE:</strong> As a system administrator, you have complete authority to authorize or suspend user profiles. Suspended profiles will instantly receive an authorization blocker when trying to authenticate on the Portal Hub.
          </div>

          <div className="border border-border overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[10.5px]">
              <thead>
                <tr className="bg-zinc-100 border-b border-border">
                  <th className="p-2.5 font-bold uppercase text-zinc-500">Full Name / ID</th>
                  <th className="p-2.5 font-bold uppercase text-zinc-500">Email Address</th>
                  <th className="p-2.5 font-bold uppercase text-zinc-500">Assigned Role</th>
                  <th className="p-2.5 font-bold uppercase text-zinc-500">Sign Up Date</th>
                  <th className="p-2.5 font-bold uppercase text-zinc-500">Status</th>
                  <th className="p-2.5 font-bold uppercase text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(usr => (
                  <tr key={usr.email} className="border-b border-border hover:bg-zinc-50/50">
                    <td className="p-2.5 font-bold text-black uppercase">{usr.fullName}</td>
                    <td className="p-2.5 text-zinc-600">{usr.email}</td>
                    <td className="p-2.5 text-black">
                      <select
                        value={usr.role}
                        onChange={(e) => handleChangeUserRole(usr.email, e.target.value as any)}
                        className="bg-white border border-border px-1 py-0.5 text-[10px] focus:outline-none"
                      >
                        <option value="developer">Developer</option>
                        <option value="venture_builder">Venture Builder</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-2.5 text-zinc-500">{usr.signUpDate}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 border font-bold text-[9px] uppercase ${
                        usr.status === "active" ? "bg-green-100 border-green-300 text-green-800" : "bg-red-100 border-red-300 text-red-800"
                      }`}>
                        {usr.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUserStatus(usr.email)}
                        className={`px-2 py-0.5 border font-bold text-[9px] uppercase cursor-pointer ${
                          usr.status === "active" 
                            ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100" 
                            : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {usr.status === "active" ? "SUSPEND" : "ACTIVATE"}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(usr.email)}
                        className="px-2 py-0.5 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[9px] uppercase cursor-pointer"
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* SUCCESS STORIES & CONTENT CREATION SECTION               */
        /* ======================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Create & Edit Form Column */}
          <div className="lg:col-span-5 bg-surface border border-border p-4 space-y-4">
            <div className="border-b border-border pb-2">
              <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider font-mono">CONSTRUX ENGINE</span>
              <h3 className="font-black text-black uppercase text-sm">
                {editingStoryId ? "EDIT SUCCESS STORY" : "CREATE SUCCESS STORY"}
              </h3>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-3.5 font-mono text-black">
              
              <div>
                <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">Story Title</label>
                <input
                  type="text"
                  required
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="e.g. Arabized Vector Translation Layer"
                  className="w-full bg-white border border-border p-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">Client Name / Sponsor</label>
                  <input
                    type="text"
                    required
                    value={storyClient}
                    onChange={(e) => setStoryClient(e.target.value)}
                    placeholder="e.g. Ministry of Digits"
                    className="w-full bg-white border border-border p-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">AI Sub-Sector</label>
                  <select
                    value={storySector}
                    onChange={(e) => setStorySector(e.target.value)}
                    className="w-full bg-white border border-border p-2 text-xs focus:outline-none focus:border-black"
                  >
                    <option value="Sovereign AI Infrastructure">Sovereign AI Infrastructure</option>
                    <option value="AI for Legal">AI for Legal</option>
                    <option value="Multi-Agent Frameworks">Multi-Agent Frameworks</option>
                    <option value="AI Audit Engines">AI Audit Engines</option>
                    <option value="Arabic LLM Applications">Arabic LLM Applications</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">Impact Metrics Summary</label>
                <input
                  type="text"
                  required
                  value={storyMetrics}
                  onChange={(e) => setStoryMetrics(e.target.value)}
                  placeholder="e.g. 94% accuracy, 35K actions automated"
                  className="w-full bg-white border border-border p-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">Executive Summary / Case Study Narrative</label>
                <textarea
                  required
                  rows={4}
                  value={storyDesc}
                  onChange={(e) => setStoryDesc(e.target.value)}
                  placeholder="Write a clear, non-hyped summary explaining the architecture implementation, technical benefits, and user outcomes..."
                  className="w-full bg-white border border-border p-2 text-xs focus:outline-none focus:border-black resize-none font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                {editingStoryId && (
                  <button
                    type="button"
                    onClick={handleCancelStoryEdit}
                    className="flex-1 py-2 border border-zinc-300 text-zinc-600 uppercase text-[10px] font-bold hover:bg-zinc-50 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <X size={11} /> CANCEL
                  </button>
                )}
                
                <button
                  type="submit"
                  className="flex-1 py-2 bg-black text-white hover:bg-zinc-800 uppercase text-[10px] font-black cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check size={11} strokeWidth={3} /> {editingStoryId ? "SAVE REVISIONS" : "PUBLISH CASE STORY"}
                </button>
              </div>

            </form>
          </div>

          {/* List of Published Stories Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border-b border-border pb-2">
              <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">CATALOG MANIFEST</span>
              <h3 className="font-black text-black uppercase text-sm">PUBLISHED SUCCESS STORY DIRECTORY</h3>
            </div>

            <div className="space-y-3">
              {stories.length === 0 ? (
                <div className="border border-dashed border-border p-8 text-center text-zinc-500 text-[11px]">
                  No stories currently cataloged. Use the builder block to register new success case studies.
                </div>
              ) : (
                stories.map(st => (
                  <div key={st.id} className="border border-border bg-white p-4 space-y-3 hover:border-black transition-all">
                    
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[8px] bg-zinc-100 border border-border px-1.5 py-0.5 text-zinc-600 font-bold uppercase">
                          {st.subSector}
                        </span>
                        <h4 className="font-black text-black uppercase mt-1 text-xs">{st.title}</h4>
                      </div>

                      <span className="text-[9px] text-zinc-400 font-mono">{st.datePublished}</span>
                    </div>

                    <div className="text-[10px] text-zinc-600 leading-normal">
                      <strong>Sponsor:</strong> <span className="text-black uppercase">{st.clientName}</span>
                    </div>

                    <p className="text-[10.5px] font-sans text-zinc-700 leading-relaxed bg-zinc-50 p-2.5 border border-zinc-200">
                      {st.description}
                    </p>

                    <div className="text-[10px] font-mono bg-zinc-900 text-[#00ff66] p-2 flex items-center gap-1.5">
                      <strong className="uppercase text-[8.5px] text-zinc-400">METRICS ACHIEVED:</strong> {st.impactMetrics}
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                      <button
                        onClick={() => setSelectedStoryForPopup(st)}
                        className="px-2.5 py-1 border border-black bg-zinc-50 hover:bg-black hover:text-white text-[9px] font-black uppercase cursor-pointer flex items-center gap-1 transition-all"
                      >
                        [ READ STORY ]
                      </button>
                      <button
                        onClick={() => handleStartEditStory(st)}
                        className="px-2.5 py-1 border border-zinc-300 bg-white hover:border-black text-[9px] font-bold uppercase cursor-pointer flex items-center gap-1"
                      >
                        <Edit2 size={10} /> EDIT
                      </button>
                      <button
                        onClick={() => handleDeleteStory(st.id)}
                        className="px-2.5 py-1 border border-red-200 bg-red-50 text-red-700 hover:border-red-600 hover:text-white text-[9px] font-bold uppercase cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 size={10} /> REMOVE
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------ */}
      {/* SUCCESS STORY DETAIL MODAL POPUP                       */}
      {/* ------------------------------------------------------ */}
      {selectedStoryForPopup && (
        <div 
          id="success-story-modal"
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedStoryForPopup(null)}
        >
          <div 
            className="bg-white border border-black max-w-2xl w-full p-6 space-y-4 shadow-2xl relative select-none animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button 
              onClick={() => setSelectedStoryForPopup(null)}
              className="absolute top-4 right-4 p-1.5 border border-black/10 hover:border-black bg-zinc-50 hover:bg-black hover:text-white transition-all cursor-pointer"
              title="Close story panel"
            >
              <X size={14} />
            </button>

            {/* Header Metadata */}
            <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
              <span className="text-[9px] border bg-emerald-100 border-emerald-300 text-emerald-800 px-2.5 py-0.5 font-bold uppercase tracking-wider">
                {selectedStoryForPopup.subSector}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">
                PUBLISHED: {selectedStoryForPopup.datePublished}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-400 font-bold uppercase block tracking-widest">DEEPTECH SUCCESS STORY</span>
              <h2 className="text-xl font-extrabold text-black uppercase leading-tight tracking-tight font-sans">
                {selectedStoryForPopup.title}
              </h2>
            </div>

            {/* Sponsor info */}
            <div className="text-[11px] text-zinc-700 font-mono leading-normal">
              SPONSOR/PARTNER: <strong className="text-black uppercase">{selectedStoryForPopup.clientName}</strong>
            </div>

            {/* Full Content Body */}
            <div className="space-y-3 font-sans text-xs leading-relaxed text-zinc-800 select-text">
              <p className="text-zinc-800 text-xs font-normal leading-relaxed">
                {selectedStoryForPopup.description}
              </p>
            </div>

            {/* Metrics Achievements Box */}
            <div className="bg-zinc-900 border border-zinc-800 p-3.5 text-[11px] leading-relaxed text-emerald-400 font-mono font-medium flex flex-col gap-1 rounded-none">
              <span className="text-[9px] text-zinc-500 font-bold uppercase">KEY PERFORMANCE METRICS MET</span>
              <div className="flex items-center gap-1.5 text-xs text-[#00ff66]">
                <Sparkles size={11} className="text-[#00ff66]" /> {selectedStoryForPopup.impactMetrics}
              </div>
            </div>

            {/* Footer with Close buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-200 font-mono text-[10px]">
              <div className="flex items-center gap-1 text-zinc-500">
                REGISTRY SECURED // GCC INTEL
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedStoryForPopup(null)}
                  className="px-4 py-1.5 bg-black hover:bg-zinc-800 text-white font-extrabold uppercase cursor-pointer"
                >
                  CLOSE CASE STUDY
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
