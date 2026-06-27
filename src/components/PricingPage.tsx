import React, { useState } from "react";
import { Check, HelpCircle, Shield, Sparkles, Zap, Info, ArrowRight } from "lucide-react";

export const PricingPage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Developer Sandbox",
      priceMonthly: 0,
      priceAnnual: 0,
      description: "Ideal for independent researchers, system prototype builders, and open-source contributors.",
      features: [
        "Access to basic Yellow Pages Directory & Repositories",
        "Continuous live social sentiment deck updates",
        "Up to 5 custom proposed startup or agency entries",
        "Standard API rate limits (150 requests / hour)",
        "Local browser persistent database state",
      ],
      notIncluded: [
        "Automated webhook pipeline integration",
        "Vetted credentials status verification",
        "Real-time ADGM & KAFD Municipal registration feed",
        "Premium multi-agent workflow dashboards",
      ],
      cta: "Access Free Terminal",
      badge: "Open Source",
      highlight: false,
    },
    {
      name: "Venture Builder Pro",
      priceMonthly: 149,
      priceAnnual: 119,
      description: "Engineered for active tech venture labs, regional accelerators, and growth-stage AI startups.",
      features: [
        "All Developer Sandbox features included",
        "Interactive private markets directory & unlimited entries",
        "Live municipal & ADGM/KAFD registration alert feed",
        "Automated outbound pipeline webhook integrations",
        "Priority verified vetting credentials audit",
        "Full CSV/JSON diagnostic raw data exports",
        "Enhanced API rates (15,000 requests / hour)",
      ],
      notIncluded: [
        "Sovereign air-gapped container server deployment",
        "Custom regulatory compliance model tuning",
      ],
      cta: "Initiate Venture Pipeline",
      badge: "Most Popular",
      highlight: true,
    },
    {
      name: "Sovereign Enterprise",
      priceMonthly: 799,
      priceAnnual: 639,
      description: "Custom built for sovereign funds, multi-user workspaces, and strict governmental operators.",
      features: [
        "All Venture Builder Pro features included",
        "Sovereign air-gapped on-premise container database node",
        "Continuous 24/7 continuous compliance auditing engines",
        "Fine-tuned bilingual Arabic/English dialect adapters",
        "Unlimited custom automated workspace pipelines",
        "Guaranteed 99.99% uptime with direct systems engineer SLA",
        "Unlimited API rate throughput across all local zones",
      ],
      notIncluded: [],
      cta: "Request Custom Proposal",
      badge: "Sovereign Guard",
      highlight: false,
    },
  ];

  return (
    <div id="pricing-page-root" className="p-6 space-y-8 text-black bg-white">
      
      {/* Top Heading banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-widest">ECOSYSTEM SUBSCRIPTIONS</span>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <Zap size={18} className="text-black" />
            AVANT-GARDE PORTAL PRICING
          </h2>
          <p className="text-[11px] text-zinc-600 mt-1 max-w-2xl font-sans">
            Support the Middle-East deeptech index. Gain access to premium workflow builders, persistent cloud vaults, continuous municipal monitoring, and sovereign webhook networks.
          </p>
        </div>

        {/* Annual / Monthly Toggle Switcher */}
        <div className="flex items-center bg-zinc-100 border border-border p-1 rounded-none font-mono text-[10px]">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-3 py-1 font-bold uppercase cursor-pointer transition-all ${
              billingPeriod === "monthly" ? "bg-black text-white" : "text-zinc-600 hover:text-black"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("annual")}
            className={`px-3 py-1 font-bold uppercase cursor-pointer transition-all flex items-center gap-1 ${
              billingPeriod === "annual" ? "bg-black text-white" : "text-zinc-600 hover:text-black"
            }`}
          >
            Annual <span className="bg-green-100 text-green-800 text-[8px] px-1 py-0.5 font-sans font-extrabold">-20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`border relative p-5 flex flex-col justify-between space-y-6 transition-all ${
              plan.highlight
                ? "border-black bg-zinc-50/50 ring-2 ring-black ring-offset-2"
                : "border-border bg-white hover:border-zinc-400"
            }`}
          >
            {/* Top Info section */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className={`text-[8px] border px-2 py-0.5 font-bold tracking-widest uppercase ${
                  plan.highlight ? "bg-black text-white border-black" : "bg-zinc-100 text-zinc-700 border-border"
                }`}>
                  {plan.badge}
                </span>
                
                {plan.highlight && (
                  <span className="flex items-center gap-0.5 text-[8px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 font-bold tracking-wider uppercase font-mono">
                    <Sparkles size={9} /> Recommended
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-black text-black uppercase tracking-tight">{plan.name}</h3>
                <p className="text-[10.5px] text-zinc-500 font-sans mt-1 leading-normal h-8">{plan.description}</p>
              </div>

              {/* Price Tag */}
              <div className="pt-2 border-t border-dashed border-zinc-200">
                <span className="text-3xl font-black text-black tracking-tighter">
                  ${billingPeriod === "monthly" ? plan.priceMonthly : plan.priceAnnual}
                </span>
                <span className="text-zinc-500 font-mono text-[10px] ml-1">
                  / month {billingPeriod === "annual" && plan.priceAnnual > 0 && "(billed annually)"}
                </span>
              </div>
            </div>

            {/* List of features */}
            <div className="space-y-3 pt-4 border-t border-zinc-100 flex-grow">
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block font-mono">INCLUDED CAPABILITIES:</span>
              <ul className="space-y-2 text-[10px] font-sans">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start gap-2 text-zinc-800">
                    <Check size={12} className="text-green-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
                
                {plan.notIncluded.map((feat, nidx) => (
                  <li key={nidx} className="flex items-start gap-2 text-zinc-400">
                    <span className="text-[11px] leading-none text-zinc-300 font-bold shrink-0 mt-0.5">✕</span>
                    <span className="line-through">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Trigger */}
            <div className="pt-4 border-t border-zinc-100">
              <button
                className={`w-full py-2.5 font-black uppercase text-center text-[10.5px] cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                  plan.highlight
                    ? "bg-black text-white hover:bg-zinc-800"
                    : "bg-white border border-black text-black hover:bg-zinc-50"
                }`}
              >
                {plan.cta} <ArrowRight size={11} />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Pricing FAQ Information footer */}
      <div className="bg-zinc-50 border border-border p-4 space-y-3 font-sans">
        <h4 className="text-[11px] font-black text-black uppercase tracking-wider flex items-center gap-1.5">
          <Info size={13} className="text-zinc-500" />
          PREMIUM INTEGRATION CLARIFICATIONS
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-zinc-600 leading-relaxed">
          <div className="space-y-1">
            <strong className="text-black uppercase text-[9.5px]">Is there a contractual binding lock-in period?</strong>
            <p>No. Standard monthly plans can be terminated or downgraded at the end of any cycle. Annual contracts offer substantial discounts and are non-refundable once the core systems parameters are provisioned.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-black uppercase text-[9.5px]">How does the sovereign air-gapped node work?</strong>
            <p>For Enterprise accounts, we package the multi-agent vector registries, scraping engines, and fine-tuned dialect frameworks as clean docker containers mapped directly to local servers of your choosing.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
