import React, { useState, useMemo } from "react";
import { Search, MapPin, Globe, Mail, Phone, Code, Palette, Award, Shield, Check, Heart, ExternalLink, Plus } from "lucide-react";

interface AgencyItem {
  id: string;
  name: string;
  type: "Technical Agency" | "Design Studio" | "Software Developer" | "AI Startup";
  location: string;
  country: "UAE" | "Saudi Arabia" | "Qatar" | "Egypt" | "Jordan" | "Lebanon" | "Kuwait" | "Oman" | "Global";
  description: string;
  specialties: string[];
  teamSize: string;
  established: string;
  vetted: boolean;
  likes: number;
  featuredProject: {
    title: string;
    description: string;
  };
  contactEmail: string;
}

export const YellowPagesDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [likedAgencies, setLikedAgencies] = useState<Record<string, boolean>>({});

  // Form states for new agency proposals
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<AgencyItem["type"]>("Technical Agency");
  const [newCountry, setNewCountry] = useState<AgencyItem["country"]>("UAE");
  const [newLocation, setNewLocation] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSpecs, setNewSpecs] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [agencies, setAgencies] = useState<AgencyItem[]>([
    {
      id: "ag-1",
      name: "Amana Tech Lab",
      type: "Technical Agency",
      location: "Dubai Internet City, Dubai",
      country: "UAE",
      description: "Premier Middle-East systems integrator specializing in custom corporate multi-agent workflows, sovereign database isolation, and high-performance React client-side dashboards.",
      specialties: ["Multi-Agent Orchestration", "Sovereign Cloud", "Vite/React Integrations"],
      teamSize: "35 operators",
      established: "2024",
      vetted: true,
      likes: 124,
      featuredProject: {
        title: "Emirates Sovereign Agent Matrix",
        description: "Deploying air-gapped retrieval networks mapping legal municipal directives across UAE."
      },
      contactEmail: "info@amana.tech"
    },
    {
      id: "ag-2",
      name: "Dune AI Solutions",
      type: "AI Startup",
      location: "KAFD, Riyadh",
      country: "Saudi Arabia",
      description: "Leading deeptech hub focusing on fine-tuning large Arabic language models, local embedding vectorization, and high-security compliance consulting for GCC government divisions.",
      specialties: ["Arabic LLM Tuning", "Vector DB Architecture", "SOC2 Readiness"],
      teamSize: "50 researchers",
      established: "2025",
      vetted: true,
      likes: 189,
      featuredProject: {
        title: "Dune-Core-V2-7B Arabic Model",
        description: "Pre-trained model optimized for regional dialect comprehension and regulatory code compilation."
      },
      contactEmail: "contact@duneai.sa"
    },
    {
      id: "ag-3",
      name: "Byblos Digital Studio",
      type: "Design Studio",
      location: "Gemmayzeh, Beirut",
      country: "Lebanon",
      description: "High-fidelity digital design studio specializing in minimalist UI/UX, Swiss-school layouts, and bespoke generative mockups for cutting-edge technology platforms.",
      specialties: ["Interface Design", "Brand Systems", "Interactive Frontends"],
      teamSize: "12 creatives",
      established: "2023",
      vetted: true,
      likes: 85,
      featuredProject: {
        title: "Hyper-Minimalist AI Trading Desk",
        description: "An elegant monochrome real-time terminal UI crafted for high-frequency algorithmic desks."
      },
      contactEmail: "hello@byblos.design"
    },
    {
      id: "ag-4",
      name: "Nile Generative Systems",
      type: "Software Developer",
      location: "Maadi, Cairo",
      country: "Egypt",
      description: "Agile engineering squad producing lightweight AI agents, consumer mobile extensions, and automated server-side scraping pipelines for commercial databases.",
      specialties: ["Web Scraping", "Server-side Proxy API", "Node.js Microservices"],
      teamSize: "22 engineers",
      established: "2024",
      vetted: false,
      likes: 56,
      featuredProject: {
        title: "Nile-Scraper-Agent Pro",
        description: "Decentralized crawling bot collecting raw agricultural sector indices across MENA regions."
      },
      contactEmail: "ops@nilegenerative.eg"
    },
    {
      id: "ag-5",
      name: "Oasis Systems",
      type: "Technical Agency",
      location: "West Bay, Doha",
      country: "Qatar",
      description: "Bespoke spatial computing and computer vision agency deploying smart city visualizers, high-density telemetry logging, and local drone routing networks.",
      specialties: ["Computer Vision", "Telemetry Dashboards", "Spatial Analytics"],
      teamSize: "18 architects",
      established: "2025",
      vetted: true,
      likes: 92,
      featuredProject: {
        title: "Doha Smart Transit Grid Tracker",
        description: "Real-time municipal computer vision engine automating traffic signal configurations via local models."
      },
      contactEmail: "engineering@oasis.qa"
    },
    {
      id: "ag-6",
      name: "Petra AI Consulting",
      type: "Software Developer",
      location: "Al-Abdali, Amman",
      country: "Jordan",
      description: "Specialized consultancy implementing grounded document search (RAG) models for educational institutes and regional non-profit legal frameworks.",
      specialties: ["RAG Engineering", "PDF Parsing", "Document Indexing"],
      teamSize: "8 developers",
      established: "2024",
      vetted: false,
      likes: 41,
      featuredProject: {
        title: "Petra Law Corpus Grounder",
        description: "Structuring thousands of public Jordanian legal PDFs into a single search query vector space."
      },
      contactEmail: "consult@petra.ai"
    },
    {
      id: "ag-7",
      name: "Red Sea Code Crafts",
      type: "Design Studio",
      location: "Jeddah Corniche, Jeddah",
      country: "Saudi Arabia",
      description: "Creative design and frontend engineering cooperative producing bespoke web applications, interactive web design, and bespoke Tailwind design libraries.",
      specialties: ["Creative Frontends", "Tailwind Theme Customization", "Motion Physics"],
      teamSize: "15 developers",
      established: "2025",
      vetted: true,
      likes: 110,
      featuredProject: {
        title: "Red Sea Oceanography Live",
        description: "Immersive WebGL map tracking maritime temperature parameters alongside marine sensor alerts."
      },
      contactEmail: "craft@redsea.io"
    },
    {
      id: "ag-8",
      name: "Sumerian AI",
      type: "Technical Agency",
      location: "Mansour, Baghdad",
      country: "Iraq",
      description: "Pioneering computer vision team training deep neural frameworks to restore, archive, and catalog archaeological sites and historic visual manuscripts.",
      specialties: ["Visual Reconstruction", "Generative Archiving", "Image Restoration"],
      teamSize: "10 specialists",
      established: "2025",
      vetted: false,
      likes: 74,
      featuredProject: {
        title: "Cuneiform Tablet Translation Neural Matrix",
        description: "Optical translation model converting clay tablets in real-time into modern linguistic files."
      },
      contactEmail: "research@sumerian.ai"
    }
  ]);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const alreadyLiked = likedAgencies[id];
    setLikedAgencies(prev => ({ ...prev, [id]: !alreadyLiked }));
    setAgencies(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: alreadyLiked ? item.likes - 1 : item.likes + 1
        };
      }
      return item;
    }));
  };

  const handleAddAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDesc.trim()) return;

    const parsedSpecs = newSpecs.split(",").map(s => s.trim()).filter(Boolean);
    const newAgency: AgencyItem = {
      id: `ag-custom-${Date.now()}`,
      name: newName,
      type: newType,
      country: newCountry,
      location: newLocation.trim() || "MENA Regional HQ",
      description: newDesc,
      specialties: parsedSpecs.length > 0 ? parsedSpecs : ["AI Systems", "Web Development"],
      teamSize: "Flexible Squad",
      established: "2026",
      vetted: false,
      likes: 1,
      featuredProject: {
        title: newProjectTitle.trim() || "General AI Systems",
        description: newProjectDesc.trim() || "Active client implementation pipeline under security NDA."
      },
      contactEmail: newEmail.trim() || "contact@portal.hub"
    };

    setAgencies(prev => [newAgency, ...prev]);
    setNewName("");
    setNewDesc("");
    setNewSpecs("");
    setNewLocation("");
    setNewProjectTitle("");
    setNewProjectDesc("");
    setNewEmail("");
    setShowAddModal(false);
  };

  const filteredAgencies = useMemo(() => {
    return agencies.filter(item => {
      const matchCountry = selectedCountry === "ALL" || item.country === selectedCountry;
      const matchType = selectedType === "ALL" || item.type === selectedType;
      const matchSearch = searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCountry && matchType && matchSearch;
    });
  }, [agencies, selectedCountry, selectedType, searchQuery]);

  return (
    <div className="p-6 space-y-6">
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-widest">vetted directory of Middle-East operators</span>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <Award size={18} className="text-black" />
            YELLOW PAGES DIRECTORY
          </h2>
          <p className="text-[11px] text-zinc-600 mt-1 max-w-2xl font-sans">
            Explore active technical agencies, UI/UX design studios, and software development teams shaping the GCC & MENA artificial intelligence landscape.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 border border-black bg-black text-white hover:bg-zinc-800 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus size={14} /> PROPOSE AGENCY
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-surface p-4 border border-border">
        
        {/* Search */}
        <div className="md:col-span-2 relative">
          <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">SEARCH DIRECTORY</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, keywords, specialized techs..."
            className="w-full bg-white border border-border p-2 text-xs focus:outline-none focus:border-black font-mono text-black"
          />
        </div>

        {/* Country Filter */}
        <div>
          <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">COUNTRY</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-white border border-border p-2 text-xs focus:outline-none font-mono text-black"
          >
            <option value="ALL">ALL GCC & MENA</option>
            <option value="UAE">UAE</option>
            <option value="Saudi Arabia">SAUDI ARABIA</option>
            <option value="Qatar">QATAR</option>
            <option value="Egypt">EGYPT</option>
            <option value="Jordan">JORDAN</option>
            <option value="Lebanon">LEBANON</option>
            <option value="Kuwait">KUWAIT</option>
            <option value="Oman">OMAN</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-[9px] text-zinc-500 font-black uppercase block mb-1">AGENCY TYPE</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-white border border-border p-2 text-xs focus:outline-none font-mono text-black"
          >
            <option value="ALL">ALL SPECIALTIES</option>
            <option value="Technical Agency">TECHNICAL AGENCIES</option>
            <option value="Design Studio">DESIGN STUDIOS</option>
            <option value="Software Developer">SOFTWARE DEVELOPERS</option>
            <option value="AI Startup">AI STARTUPS</option>
          </select>
        </div>

      </div>

      {/* Add Agency Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border max-w-xl w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="font-black text-black uppercase text-[11px] flex items-center gap-1.5">
                <Plus size={14} /> PROPOSE DIGITAL AGENCY & STUDIO
              </span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-red-600 hover:underline font-bold text-[10px]"
              >
                [CLOSE]
              </button>
            </div>

            <form onSubmit={handleAddAgency} className="space-y-3 font-mono text-black">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Agency Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Damascus AI Crafts"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Agency Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none"
                  >
                    <option value="Technical Agency">Technical Agency</option>
                    <option value="Design Studio">Design Studio</option>
                    <option value="Software Developer">Software Developer</option>
                    <option value="AI Startup">AI Startup</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Country Location</label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value as any)}
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none"
                  >
                    <option value="UAE">UAE</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Oman">Oman</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">City Address</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Abu Dhabi Global Market"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase block">Brief Description of Services</label>
                <textarea
                  required
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explain their core engineering competency, model specializations, or design methodologies..."
                  className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Specialties (comma separated)</label>
                  <input
                    type="text"
                    value={newSpecs}
                    onChange={(e) => setNewSpecs(e.target.value)}
                    placeholder="e.g. Fine-tuning, RAG, Web3, React"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase block">Contact Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="operator@agency.com"
                    className="w-full bg-surface border border-border p-1.5 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="border border-zinc-200 p-2.5 space-y-1.5 bg-zinc-50">
                <span className="font-bold text-[8px] text-zinc-500 uppercase block">KEY REPRESENTATIVE PROJECT</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="Project Title"
                    className="bg-white border border-border p-1 text-[10px] focus:outline-none w-full"
                  />
                  <input
                    type="text"
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="Short description..."
                    className="bg-white border border-border p-1 text-[10px] focus:outline-none w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-black text-white font-bold uppercase hover:bg-zinc-800 cursor-pointer text-xs"
              >
                PROPOSE AGENCY TO MIDDLE-EAST SYSTEM REGISTRY
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Masonry Pinterest Style Layout */}
      {filteredAgencies.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border bg-surface text-zinc-600 uppercase font-mono">
          NO VETTED AGENCIES FOUND MATCHING THE ACTIVE SEARCH FILTERS.
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5 [column-fill:_balance]">
          {filteredAgencies.map((agency, index) => {
            // Generate deterministic staggered styles based on index to simulate Pinterest aesthetic heights
            const staggerPadding = index % 3 === 0 ? "pb-6" : index % 3 === 1 ? "pb-4" : "pb-8";
            const borderAccent = index % 4 === 0 ? "border-l-4 border-l-black" : index % 4 === 1 ? "border-l-4 border-l-green-600" : index % 4 === 2 ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-blue-600";
            
            return (
              <div
                key={agency.id}
                className={`break-inside-avoid bg-white border border-border p-5 space-y-4 hover:border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group rounded-none cursor-default ${staggerPadding} ${borderAccent}`}
              >
                {/* Header Info */}
                <div className="flex justify-between items-start gap-2 border-b border-zinc-150 pb-2">
                  <div>
                    <span className="text-[8px] bg-zinc-900 text-white border border-black px-2 py-0.5 font-bold tracking-widest uppercase block w-max">
                      {agency.type}
                    </span>
                    <h3 className="font-black text-[13.5px] text-black uppercase mt-2 leading-tight group-hover:text-zinc-700 transition-colors">
                      {agency.name}
                    </h3>
                  </div>

                  {agency.vetted && (
                    <span className="flex items-center gap-0.5 text-[8px] bg-green-50 text-green-800 border border-green-300 px-1.5 py-0.5 font-bold tracking-widest uppercase">
                      <Shield size={9} className="text-green-700 fill-green-100" /> VETTED
                    </span>
                  )}
                </div>

                {/* Geographic anchor */}
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-bold">
                  <MapPin size={11} className="text-zinc-500 shrink-0" />
                  <span className="truncate">{agency.location}, <strong className="text-black uppercase">{agency.country}</strong></span>
                </div>

                {/* Description */}
                <p className="text-[10.5px] leading-relaxed text-zinc-700 font-sans">
                  {agency.description}
                </p>

                {/* Tags/Specialties */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {agency.specialties.map(spec => (
                    <span key={spec} className="text-[8px] bg-zinc-100 border border-zinc-200 hover:border-zinc-400 px-1.5 py-0.5 text-zinc-700 font-bold uppercase font-mono transition-colors">
                      #{spec}
                    </span>
                  ))}
                </div>

                {/* Featured Project Panel with dynamic overlay hover effect */}
                <div className="bg-zinc-50 border border-zinc-200 p-3 text-[10px] space-y-1.5 group-hover:bg-zinc-100/60 transition-colors duration-300">
                  <span className="text-[8px] font-black tracking-widest text-zinc-400 block uppercase font-mono">FLAGSHIP PILOT PROJECT</span>
                  <span className="font-bold text-black uppercase block leading-tight">{agency.featuredProject.title}</span>
                  <p className="text-zinc-600 leading-normal font-sans text-[9px]">{agency.featuredProject.description}</p>
                </div>

                {/* Meta stats */}
                <div className="flex justify-between items-center pt-3 border-t border-zinc-150 text-[9px] text-zinc-500 font-mono">
                  <div>
                    <span className="block">ESTD: <strong className="text-black">{agency.established}</strong></span>
                    <span className="block uppercase">TEAM: <strong className="text-black">{agency.teamSize}</strong></span>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`mailto:${agency.contactEmail}`}
                      className="p-1.5 border border-border hover:border-black hover:bg-zinc-50 text-black cursor-pointer bg-white transition-colors"
                      title={`Contact agency at ${agency.contactEmail}`}
                    >
                      <Mail size={12} />
                    </a>
                    <button
                      onClick={(e) => handleLike(agency.id, e)}
                      className={`px-2.5 py-1.5 border flex items-center gap-1.5 cursor-pointer font-bold transition-all ${
                        likedAgencies[agency.id]
                          ? "bg-black text-white border-black"
                          : "bg-white text-zinc-600 border-border hover:border-black hover:text-black"
                      }`}
                    >
                      <Heart size={11} className={likedAgencies[agency.id] ? "fill-white" : ""} /> {agency.likes}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
