import React, { useState, useMemo } from "react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, 
  CartesianGrid, Legend 
} from "recharts";
import { 
  Activity, TrendingUp, HelpCircle, Award, Brain, BarChart2, ShieldAlert, Zap, Layers 
} from "lucide-react";

interface ClusterDashboardProps {
  clusterId: number;
  clusterTitle: string;
}

interface ClusterSpecificData {
  topics: { name: string; percentage: number; trend: number[] }[];
  trendsData: { day: string; queryVolume: number; accuracy: number; tokens: number }[];
}

export const ClusterDashboard: React.FC<ClusterDashboardProps> = ({ clusterId, clusterTitle }) => {
  const [selectedMetric, setSelectedMetric] = useState<"queries" | "accuracy" | "tokens">("queries");

  // Generate highly customized datasets per cluster
  const dashboardData = useMemo<ClusterSpecificData>(() => {
    const daysCount = 30;
    const now = new Date();
    const trendsData = [];

    // Set stable seeds based on clusterId
    const baseQuery = clusterId === 1 ? 40 : clusterId === 2 ? 25 : clusterId === 3 ? 15 : 30;
    const baseAccuracy = clusterId === 1 ? 92 : clusterId === 2 ? 95 : clusterId === 3 ? 88 : 91;
    const baseTokens = clusterId === 1 ? 120 : clusterId === 2 ? 160 : clusterId === 3 ? 90 : 140;

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      // Generate continuous-looking mathematical curves with random variation
      const sinModifier = Math.sin((daysCount - i) / 3);
      const cosModifier = Math.cos((daysCount - i) / 4);

      const queryVolume = Math.round(baseQuery + sinModifier * 12 + Math.random() * 6);
      const accuracy = Math.round(baseAccuracy + cosModifier * 3 + Math.random() * 1.5 * (clusterId === 3 ? 2 : 1));
      const tokens = Math.round(baseTokens + sinModifier * 30 + cosModifier * 15 + Math.random() * 20);

      trendsData.push({
        day: dayStr,
        queryVolume: Math.max(5, queryVolume),
        accuracy: Math.min(100, Math.max(50, accuracy)),
        tokens: Math.max(10, tokens),
      });
    }

    // Custom high-frequency topics per cluster with individual 30-day trendlines
    let topics: { name: string; percentage: number; trend: number[] }[] = [];
    if (clusterId === 1) {
      topics = [
        { name: "Mixture of Experts", percentage: 38, trend: [20, 22, 25, 28, 30, 32, 35, 38] },
        { name: "Sparsely Gated Routing", percentage: 24, trend: [15, 14, 18, 16, 20, 22, 21, 24] },
        { name: "Retrieval Grounding", percentage: 20, trend: [10, 12, 11, 15, 14, 17, 19, 20] },
        { name: "Attention Map Density", percentage: 18, trend: [8, 9, 11, 10, 12, 15, 16, 18] },
      ];
    } else if (clusterId === 2) {
      topics = [
        { name: "HNSW Vector Recalls", percentage: 35, trend: [18, 20, 24, 25, 28, 30, 32, 35] },
        { name: "Multi-Agent States", percentage: 28, trend: [12, 15, 16, 20, 22, 24, 26, 28] },
        { name: "Code Orchestration Paths", percentage: 22, trend: [10, 11, 14, 15, 18, 19, 21, 22] },
        { name: "State Variable Audits", percentage: 15, trend: [5, 7, 8, 10, 11, 12, 14, 15] },
      ];
    } else if (clusterId === 3) {
      topics = [
        { name: "Sovereign Compute Allocations", percentage: 42, trend: [22, 25, 28, 32, 35, 38, 40, 42] },
        { name: "Quantitative RAG Risk Score", percentage: 26, trend: [12, 14, 15, 18, 20, 22, 25, 26] },
        { name: "Middle East Tech Rounds", percentage: 18, trend: [8, 9, 12, 11, 14, 15, 16, 18] },
        { name: "Regulatory Capital Flight", percentage: 14, trend: [5, 6, 8, 9, 11, 12, 13, 14] },
      ];
    } else {
      topics = [
        { name: "SOC2 Compliance Checklist", percentage: 34, trend: [15, 18, 20, 24, 26, 28, 31, 34] },
        { name: "Vertical AI Go-To-Market", percentage: 30, trend: [12, 14, 16, 19, 22, 25, 28, 30] },
        { name: "Incubation Pipeline Velocities", percentage: 20, trend: [8, 10, 12, 14, 15, 17, 18, 20] },
        { name: "Integrations Checkpoints", percentage: 16, trend: [5, 7, 8, 10, 12, 13, 15, 16] },
      ];
    }

    return { topics, trendsData };
  }, [clusterId]);

  const activeMetricConfig = useMemo(() => {
    switch (selectedMetric) {
      case "queries":
        return { key: "queryVolume", name: "QUERY VOLUME", color: "var(--color-accent, #00ff66)", suffix: " calls" };
      case "accuracy":
        return { key: "accuracy", name: "MODEL ACCURACY", color: "#3b82f6", suffix: "%" };
      case "tokens":
        return { key: "tokens", name: "TOKEN CONSUMPTION", color: "#f59e0b", suffix: "k tkn" };
    }
  }, [selectedMetric]);

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0c0c0e] border border-zinc-800 p-2 font-mono text-[9px] shadow-2xl leading-normal text-zinc-300">
          <p className="text-white font-bold uppercase mb-1.5 border-b border-zinc-850 pb-1">
            {label}
          </p>
          <p className="flex justify-between gap-6">
            <span className="uppercase text-zinc-400">{payload[0].name}:</span>
            <span className="font-bold" style={{ color: payload[0].color }}>
              {payload[0].value}{activeMetricConfig.suffix}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-grow flex flex-col overflow-y-auto bg-[#08080a] p-4 space-y-4 font-mono text-[10px]">
      
      {/* Active Cluster Title Display */}
      <div className="bg-surface border border-border p-3">
        <div className="flex items-center gap-1.5 text-[8.5px] text-zinc-500 uppercase tracking-widest font-bold">
          <Brain size={11} className="text-accent" /> Grounded Analytics Node
        </div>
        <h3 className="text-white font-bold uppercase mt-1 leading-snug tracking-tight text-[11.5px]">
          PILLAR_0{clusterId}: {clusterTitle.split(" & ")[0].toUpperCase()}
        </h3>
      </div>

      {/* Usage Trends Section */}
      <div className="border border-border bg-[#050507] p-3">
        <div className="flex items-center justify-between uppercase tracking-wider mb-2.5">
          <span className="font-bold text-zinc-400 flex items-center gap-1">
            <TrendingUp size={11} className="text-accent" /> Usage Trends (30D)
          </span>
          
          <div className="flex bg-[#0c0c0e] border border-border p-0.5">
            {(["queries", "accuracy", "tokens"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMetric(m)}
                className={`px-1.5 py-0.5 text-[7px] font-bold uppercase cursor-pointer transition-colors ${
                  selectedMetric === m 
                    ? "bg-accent text-black font-black" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* High-density Line Chart */}
        <div className="h-[120px] w-full mt-1.5 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData.trendsData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#141418" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#3f3f46" 
                tick={{ fill: "#52525b", fontSize: 7 }} 
                axisLine={false}
                tickLine={false}
                interval={7}
              />
              <YAxis 
                stroke="#3f3f46" 
                tick={{ fill: "#52525b", fontSize: 7 }} 
                axisLine={false}
                tickLine={false}
                domain={selectedMetric === "accuracy" ? [70, 100] : ["auto", "auto"]}
              />
              <ChartTooltip content={<CustomChartTooltip />} />
              <Line 
                type="monotone" 
                dataKey={activeMetricConfig.key} 
                name={activeMetricConfig.name} 
                stroke={activeMetricConfig.color} 
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, stroke: "#fff", strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Frequent Topics Section */}
      <div className="border border-border bg-[#050507] p-3 space-y-2">
        <div className="flex items-center gap-1 uppercase tracking-wider mb-1 text-zinc-400 font-bold">
          <Layers size={11} className="text-accent" /> Semantic Core Topics
        </div>

        <div className="space-y-2.5">
          {dashboardData.topics.map((topic, index) => {
            // Mini 8-point trendline mapping
            const points = topic.trend;
            const minVal = Math.min(...points);
            const maxVal = Math.max(...points);
            const range = maxVal - minVal || 1;
            
            // Construct a mini inline svg path string for the micro-trendline
            const svgWidth = 48;
            const svgHeight = 12;
            const pathPoints = points.map((val, idx) => {
              const x = (idx / (points.length - 1)) * svgWidth;
              const y = svgHeight - ((val - minVal) / range) * svgHeight;
              return `${x},${y}`;
            }).join(" ");

            return (
              <div key={index} className="flex items-center justify-between bg-surface/55 p-2 border border-border/60">
                <div className="space-y-0.5 max-w-[55%]">
                  <div className="text-white font-bold truncate tracking-tight text-[9.5px]">
                    {topic.name}
                  </div>
                  <div className="text-[7.5px] text-zinc-500 uppercase font-black">
                    FREQUENCY DEPTH: <span className="text-accent">{topic.percentage}%</span>
                  </div>
                </div>

                {/* Micro trend sparks & visual status bar */}
                <div className="flex items-center gap-3">
                  {/* Inline Micro Sparkline */}
                  <div className="w-[48px] h-[12px] bg-[#0c0c0e] border border-zinc-900 flex items-center justify-center p-0.5">
                    <svg width={svgWidth} height={svgHeight}>
                      <polyline
                        fill="none"
                        stroke="var(--color-accent, #00ff66)"
                        strokeWidth="1.2"
                        points={pathPoints}
                      />
                    </svg>
                  </div>
                  
                  {/* Mini gauge */}
                  <div className="w-10 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-accent" 
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Health / Compliance Indicator */}
      <div className="p-3 bg-surface border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse shrink-0" />
          <div className="leading-tight">
            <span className="text-white font-bold uppercase block text-[8px] tracking-wider">NEURAL COMPLIANCE</span>
            <span className="text-zinc-500 text-[7px] uppercase">Grounded strictly to PDF Vector indices</span>
          </div>
        </div>
        <div className="text-[8.5px] text-zinc-400 font-bold bg-[#0c0c0e] px-2 py-1 border border-border">
          STABILITY 99.8%
        </div>
      </div>

    </div>
  );
};
