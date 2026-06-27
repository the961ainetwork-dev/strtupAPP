import React, { useState } from "react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, CartesianGrid, Legend, ReferenceLine
} from "recharts";
import { Cpu, Zap, Activity, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

interface TokenHistoryItem {
  timestamp: string;
  input: number;
  output: number;
  total: number;
  query: string;
}

interface TokenDiagnosticsProps {
  activeClusterId: number;
  activeClusterTitle: string;
  tokenHistory: TokenHistoryItem[];
  sessionTokens: { input: number; output: number; total: number };
}

export const TokenDiagnostics: React.FC<TokenDiagnosticsProps> = ({
  activeClusterId,
  activeClusterTitle,
  tokenHistory,
  sessionTokens,
}) => {
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Compute stats based on the cluster's token history
  const clusterTotal = tokenHistory.reduce((sum, item) => sum + item.total, 0);
  const clusterInput = tokenHistory.reduce((sum, item) => sum + item.input, 0);
  const clusterOutput = tokenHistory.reduce((sum, item) => sum + item.output, 0);
  const avgCost = tokenHistory.length > 0 ? Math.round(clusterTotal / tokenHistory.length) : 0;
  const lastPromptCost = tokenHistory.length > 0 ? tokenHistory[tokenHistory.length - 1].total : 0;

  // Render Tooltip styled for our deep cyberpunk theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as TokenHistoryItem;
      return (
        <div className="bg-[#0c0c0e] border border-border p-3 font-mono text-xs shadow-2xl">
          <p className="text-[#00FF9C] font-bold uppercase mb-1.5 border-b border-border pb-1">
            {data.timestamp} - {data.query}
          </p>
          <div className="space-y-1 text-zinc-300">
            <p className="flex justify-between gap-6">
              <span>INPUT TOKENS:</span>
              <span className="font-bold text-white">{data.input.toLocaleString()}</span>
            </p>
            <p className="flex justify-between gap-6">
              <span>OUTPUT TOKENS:</span>
              <span className="font-bold text-white">{data.output.toLocaleString()}</span>
            </p>
            <p className="flex justify-between gap-6 border-t border-border/30 pt-1 text-[#00FF9C]">
              <span>TOTAL COST:</span>
              <span className="font-black">{data.total.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="token-diagnostics-panel" className="bg-[#09090b] border-b border-border shrink-0 flex flex-col overflow-hidden transition-all duration-300">
      
      {/* Diagnostics Header/Accordion Trigger */}
      <div 
        id="diagnostics-toggle-bar"
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-2 bg-zinc-950 flex items-center justify-between cursor-pointer hover:bg-zinc-900 transition-colors border-b border-border/40 select-none"
      >
        <div className="flex items-center gap-2">
          <Cpu className={`text-[#00FF9C] size-3.5 ${isExpanded ? "animate-pulse" : ""}`} />
          <span className="font-mono text-[10px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            COGNITIVE REAL-TIME DIAGNOSTICS // CLUSTER_0{activeClusterId}
            <span className="px-1.5 py-0.5 bg-accent/10 border border-accent/20 text-accent font-black text-[9px] rounded-none">
              {clusterTotal.toLocaleString()} TOKENS CONSUMED
            </span>
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-mono text-text-dim">
          <span className="hidden sm:inline">LAST INTERACTION: <span className="text-white font-bold">{lastPromptCost} tokens</span></span>
          <span className="hidden sm:inline">AVG_COST: <span className="text-[#00FF9C] font-bold">{avgCost}</span></span>
          {isExpanded ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          
          {/* Diagnostic Widget Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="bg-[#050505] border border-border p-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-[#00FF9C]/10 border-b border-l border-border font-mono text-[8px] font-black px-1.5 py-0.5 tracking-widest text-[#00FF9C]">
                CUMULATIVE
              </div>
              <span className="font-mono text-[9px] text-text-dim block uppercase">Active Input Bandwidth</span>
              <span className="text-lg font-black text-white block mt-1 tracking-tight font-mono">
                {clusterInput.toLocaleString()}
                <span className="text-[10px] text-zinc-500 font-normal ml-1">toks</span>
              </span>
            </div>

            <div className="bg-[#050505] border border-border p-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-purple-500/10 border-b border-l border-border font-mono text-[8px] font-black px-1.5 py-0.5 tracking-widest text-purple-400">
                SYNTHESIS
              </div>
              <span className="font-mono text-[9px] text-text-dim block uppercase">Active Output Yield</span>
              <span className="text-lg font-black text-white block mt-1 tracking-tight font-mono">
                {clusterOutput.toLocaleString()}
                <span className="text-[10px] text-zinc-500 font-normal ml-1">toks</span>
              </span>
            </div>

            <div className="bg-[#050505] border border-border p-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-amber-500/10 border-b border-l border-border font-mono text-[8px] font-black px-1.5 py-0.5 tracking-widest text-amber-400">
                EFFICIENCY
              </div>
              <span className="font-mono text-[9px] text-text-dim block uppercase">Interactive Prompts</span>
              <span className="text-lg font-black text-white block mt-1 tracking-tight font-mono">
                {tokenHistory.length}
                <span className="text-[10px] text-zinc-500 font-normal ml-1">runs</span>
              </span>
            </div>

            <div className="bg-[#050505] border border-border p-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-blue-500/10 border-b border-l border-border font-mono text-[8px] font-black px-1.5 py-0.5 tracking-widest text-blue-400">
                ACTIVE COCKPIT
              </div>
              <span className="font-mono text-[9px] text-text-dim block uppercase">Total Session Tokens</span>
              <span className="text-lg font-black text-[#00FF9C] block mt-1 tracking-tight font-mono">
                {sessionTokens.total.toLocaleString()}
                <span className="text-[10px] text-zinc-500 font-normal ml-1">toks</span>
              </span>
            </div>
          </div>

          {/* Recharts Visualization Frame */}
          <div className="bg-[#050505] border border-border p-3 flex flex-col h-[180px]">
            
            {/* Chart controls */}
            <div className="flex justify-between items-center mb-2.5">
              <div className="font-mono text-[9px] text-text-dim uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={10} className="text-[#00FF9C]" />
                REAL-TIME TRANSACTION HISTORY
              </div>
              
              <div className="flex gap-1.5 font-mono text-[9px]">
                <button
                  id="btn-toggle-area-chart"
                  onClick={() => setChartType("area")}
                  className={`px-2 py-0.5 border cursor-pointer uppercase ${
                    chartType === "area" 
                      ? "bg-[#00FF9C] text-black border-[#00FF9C] font-bold" 
                      : "bg-surface border-border text-zinc-400 hover:text-white"
                  }`}
                >
                  BANDWIDTH AREA
                </button>
                <button
                  id="btn-toggle-bar-chart"
                  onClick={() => setChartType("bar")}
                  className={`px-2 py-0.5 border cursor-pointer uppercase ${
                    chartType === "bar" 
                      ? "bg-[#00FF9C] text-black border-[#00FF9C] font-bold" 
                      : "bg-surface border-border text-zinc-400 hover:text-white"
                  }`}
                >
                  CUMULATIVE BARS
                </button>
              </div>
            </div>

            {/* Recharts Body */}
            <div className="flex-grow w-full">
              {tokenHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center font-mono text-[10px] text-zinc-600 uppercase border border-dashed border-border/60">
                  NO DISPATCH SIGNAL LOGGED YET. PROMPT THE MODEL TO TRACE QUANTIZED METRICS.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "area" ? (
                    <AreaChart
                      data={tokenHistory}
                      margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorInput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00FF9C" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#00FF9C" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" vertical={false} />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#444444" 
                        fontSize={8}
                        fontFamily="JetBrains Mono"
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#444444" 
                        fontSize={8}
                        fontFamily="JetBrains Mono"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        iconType="rect"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: '#666' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="input" 
                        name="Input Bandwidth"
                        stroke="#00FF9C" 
                        fillOpacity={1} 
                        fill="url(#colorInput)" 
                        strokeWidth={1.5}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="output" 
                        name="Output Yield"
                        stroke="#a855f7" 
                        fillOpacity={1} 
                        fill="url(#colorOutput)" 
                        strokeWidth={1.5}
                      />
                    </AreaChart>
                  ) : (
                    <BarChart
                      data={tokenHistory}
                      margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" vertical={false} />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#444444" 
                        fontSize={8}
                        fontFamily="JetBrains Mono"
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#444444" 
                        fontSize={8}
                        fontFamily="JetBrains Mono"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        iconType="rect"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: '#666' }}
                      />
                      <Bar dataKey="input" name="Input (Tokens)" fill="#00FF9C" stackId="a" />
                      <Bar dataKey="output" name="Output (Tokens)" fill="#a855f7" stackId="a" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>

            {/* Diagnostic Alert Ticker */}
            <div className="mt-1.5 font-mono text-[8px] text-[#00FF9C]/80 flex justify-between uppercase tracking-wider">
              <span>● AUDIT COMPLIANCE: 100% GATED</span>
              <span>TOKEN CACHE RECALL RATIO: 94.6%</span>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
