import React from 'react';
import AdminLayout from '../components/AdminLayout';

const SystemInsights: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex-1 w-full max-w-7xl mx-auto space-y-4">
        {/* Page Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface font-semibold tracking-tight">AI Efficacy Monitor</h1>
            <p className="font-body-md text-body-md text-on-surface-muted mt-1">Real-time technical health and predictive performance metrics.</p>
          </div>
          <div className="flex items-center gap-2 text-primary font-data-mono text-xs bg-primary-container/10 px-3 py-1.5 rounded-full border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(173,198,255,1)]"></span>
            SYSTEM ONLINE
          </div>
        </div>

        {/* Metrics Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="font-label-caps text-label-caps text-on-surface-muted uppercase tracking-wider">Total AI Analyses</span>
              <span className="material-symbols-outlined text-primary text-opacity-80" style={{ fontVariationSettings: "'FILL' 0" }}>data_usage</span>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface mt-2 mb-1">8,421</div>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-xs text-primary font-data-mono bg-primary-container/20 px-1.5 py-0.5 rounded">+12.4%</span>
              <span className="font-body-sm text-body-sm text-on-surface-muted">vs last 30 days</span>
            </div>
            {/* Decorative background graph */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 0%, #4d8eff 100%)", clipPath: "polygon(0 100%, 0 50%, 20% 60%, 40% 40%, 60% 70%, 80% 30%, 100% 20%, 100% 100%)" }}></div>
          </div>
          
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col relative overflow-hidden shadow-[inset_0_0_20px_rgba(77,142,255,0.1)] border-l-2 border-l-primary">
            <div className="flex justify-between items-start">
              <span className="font-label-caps text-label-caps text-on-surface-muted uppercase tracking-wider">Success Rate</span>
              <span className="material-symbols-outlined text-primary text-opacity-80" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface mt-2 mb-1">98.2<span className="text-lg text-on-surface-muted">%</span></div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-auto">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '98.2%' }}></div>
            </div>
            <div className="flex justify-between mt-2 font-data-mono text-[10px] text-on-surface-muted">
              <span>TARGET: 95%</span>
              <span className="text-primary">OVERPERFORMING</span>
            </div>
          </div>
          
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="font-label-caps text-label-caps text-on-surface-muted uppercase tracking-wider">Avg. Latency</span>
              <span className="material-symbols-outlined text-[#F59E0B] text-opacity-80" style={{ fontVariationSettings: "'FILL' 0" }}>speed</span>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface mt-2 mb-1">142<span className="text-lg text-on-surface-muted">ms</span></div>
            <div className="flex items-center gap-1 mt-auto h-8 items-end w-full space-x-1">
              <div className="bg-primary-container rounded-t-sm w-full transition-all duration-500 ease-out h-[40%]"></div>
              <div className="bg-primary-container rounded-t-sm w-full transition-all duration-500 ease-out h-[60%]"></div>
              <div className="bg-primary-container rounded-t-sm w-full transition-all duration-500 ease-out h-[30%]"></div>
              <div className="bg-primary-container rounded-t-sm w-full transition-all duration-500 ease-out h-[80%]"></div>
              <div className="bg-surface-variant rounded-t-sm w-full transition-all duration-500 ease-out h-[100%] bg-[#F59E0B]/80"></div>
              <div className="bg-primary-container rounded-t-sm w-full transition-all duration-500 ease-out h-[40%]"></div>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-muted mt-2">Spike detected at 14:00 UTC</span>
          </div>
          
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="font-label-caps text-label-caps text-on-surface-muted uppercase tracking-wider">Acceptance Rate</span>
              <span className="material-symbols-outlined text-primary text-opacity-80" style={{ fontVariationSettings: "'FILL' 0" }}>thumb_up</span>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface mt-2 mb-1">94.0<span className="text-lg text-on-surface-muted">%</span></div>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-xs text-[#FFB4AB] font-data-mono bg-[#93000a]/20 px-1.5 py-0.5 rounded">-1.2%</span>
              <span className="font-body-sm text-body-sm text-on-surface-muted">Admin agreement</span>
            </div>
          </div>
        </div>

        {/* Complex Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Histogram: Analysis Confidence */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] lg:col-span-7 h-96 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-headline-md font-medium">Analysis Confidence Distribution</h2>
              <button className="text-on-surface-muted hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>more_horiz</span>
              </button>
            </div>
            <div className="flex-1 flex items-end justify-between gap-1 w-full relative group">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-data-mono text-on-surface-muted pb-6">
                <span>1000</span>
                <span>750</span>
                <span>500</span>
                <span>250</span>
                <span>0</span>
              </div>
              {/* Chart Area */}
              <div className="ml-8 flex-1 flex items-end justify-between gap-1 h-full pb-6 relative border-b border-border-muted">
                {/* Bars */}
                <div className="w-full flex justify-between items-end gap-1 px-2 h-full">
                  <div className="bg-surface-variant rounded-t-sm w-full transition-all duration-500 ease-out h-[5%]" title="<50%: 50 cases"></div>
                  <div className="bg-surface-variant rounded-t-sm w-full transition-all duration-500 ease-out h-[8%]" title="50-60%: 80 cases"></div>
                  <div className="bg-surface-variant rounded-t-sm w-full transition-all duration-500 ease-out h-[15%]" title="60-70%: 150 cases"></div>
                  <div className="bg-primary-container rounded-t-sm w-full transition-all duration-500 ease-out h-[35%]" title="70-80%: 350 cases"></div>
                  <div className="bg-primary-container rounded-t-sm w-full transition-all duration-500 ease-out h-[60%]" title="80-90%: 600 cases"></div>
                  <div className="bg-primary-container rounded-t-sm w-full transition-all duration-500 ease-out h-[90%] bg-primary shadow-[0_0_15px_#adc6ff]" title="90-95%: 900 cases"></div>
                  <div className="bg-primary-container rounded-t-sm w-full transition-all duration-500 ease-out h-[70%]" title=">95%: 700 cases"></div>
                </div>
                {/* X-Axis Labels */}
                <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[10px] font-data-mono text-on-surface-muted px-2">
                  <span>&lt;50%</span>
                  <span>60%</span>
                  <span>70%</span>
                  <span>80%</span>
                  <span>90%</span>
                  <span className="text-primary font-bold">95%</span>
                  <span>&gt;95%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Human Override Trends */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] lg:col-span-5 h-96 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-headline-md font-medium">Human Override Trends</h2>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-label-caps text-on-surface-muted"><div className="w-2 h-2 bg-surface-variant rounded-full"></div> AI</span>
                <span className="flex items-center gap-1 text-[10px] font-label-caps text-on-surface"><div className="w-2 h-2 bg-primary rounded-full"></div> Human</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center relative">
              {/* Abstract Representation of Overrides */}
              <div className="space-y-4 w-full">
                <div className="flex items-center w-full">
                  <div className="w-24 text-[11px] font-data-mono text-on-surface-muted truncate">Severity Class.</div>
                  <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden flex relative">
                    <div className="absolute left-0 top-0 h-full bg-primary/40 w-[85%]"></div>
                    <div className="absolute left-0 top-0 h-full bg-primary w-[70%] border-r border-background"></div>
                  </div>
                  <div className="w-12 text-right text-[11px] font-data-mono text-[#FFB4AB]">15% diff</div>
                </div>
                <div className="flex items-center w-full">
                  <div className="w-24 text-[11px] font-data-mono text-on-surface-muted truncate">Entity Extract.</div>
                  <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden flex relative">
                    <div className="absolute left-0 top-0 h-full bg-primary/40 w-[95%]"></div>
                    <div className="absolute left-0 top-0 h-full bg-primary w-[92%] border-r border-background"></div>
                  </div>
                  <div className="w-12 text-right text-[11px] font-data-mono text-on-surface-muted">3% diff</div>
                </div>
                <div className="flex items-center w-full">
                  <div className="w-24 text-[11px] font-data-mono text-on-surface-muted truncate">Policy Match</div>
                  <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden flex relative">
                    <div className="absolute left-0 top-0 h-full bg-primary/40 w-[78%]"></div>
                    <div className="absolute left-0 top-0 h-full bg-primary w-[55%] border-r border-background"></div>
                  </div>
                  <div className="w-12 text-right text-[11px] font-data-mono text-[#FFB4AB] font-bold">23% diff</div>
                </div>
                <div className="flex items-center w-full">
                  <div className="w-24 text-[11px] font-data-mono text-on-surface-muted truncate">Sentiment Anal.</div>
                  <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden flex relative">
                    <div className="absolute left-0 top-0 h-full bg-primary/40 w-[98%]"></div>
                    <div className="absolute left-0 top-0 h-full bg-primary w-[95%] border-r border-background"></div>
                  </div>
                  <div className="w-12 text-right text-[11px] font-data-mono text-on-surface-muted">3% diff</div>
                </div>
              </div>
              <div className="mt-6 p-3 bg-[#93000a]/10 border border-[#FFB4AB]/20 rounded-lg flex items-start gap-3">
                <span className="material-symbols-outlined text-[#FFB4AB] text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>warning</span>
                <p className="font-body-sm text-[12px] text-on-surface-muted leading-tight">High divergence detected in <strong className="text-on-surface">Policy Match</strong> category. Human reviewers are consistently downgrading severity recommended by AI model v2.4.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Table */}
        <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col relative overflow-hidden border-t-4 border-t-[#F59E0B]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-headline-md text-headline-md font-medium text-[#F59E0B] flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>rule</span>
                Low-Confidence Analysis Queue
              </h2>
              <p className="font-body-sm text-[12px] text-on-surface-muted mt-1">Cases flagged for manual review (Confidence &lt; 75%)</p>
            </div>
            <button className="px-4 py-2 border border-border-subtle rounded-md text-sm font-medium hover:bg-surface-container-highest transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262626] text-[11px] font-label-caps text-on-surface-muted uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-normal">Case ID</th>
                  <th className="pb-3 px-4 font-normal">Trigger Node</th>
                  <th className="pb-3 px-4 font-normal">AI Confidence</th>
                  <th className="pb-3 px-4 font-normal">Flag Reason</th>
                  <th className="pb-3 pl-4 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                <tr className="border-b border-[#262626]/50 hover:bg-surface-container-highest/30 transition-colors">
                  <td className="py-3 pr-4 font-data-mono text-on-surface">GRV-8921A</td>
                  <td className="py-3 px-4 text-on-surface-muted">NLP_Sentiment_Engine</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden"><div className="bg-[#F59E0B] w-[62%] h-full"></div></div>
                      <span className="font-data-mono text-[#F59E0B] text-[11px]">62%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-on-surface-muted truncate max-w-[200px]">Ambiguous sarcasm detection in user text.</td>
                  <td className="py-3 pl-4 text-right">
                    <button className="text-primary hover:text-primary-container font-medium text-[12px] transition-colors">Review</button>
                  </td>
                </tr>
                <tr className="border-b border-[#262626]/50 hover:bg-surface-container-highest/30 transition-colors">
                  <td className="py-3 pr-4 font-data-mono text-on-surface">GRV-8919C</td>
                  <td className="py-3 px-4 text-on-surface-muted">Policy_Mapper_v2</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden"><div className="bg-[#FFB4AB] w-[48%] h-full"></div></div>
                      <span className="font-data-mono text-[#FFB4AB] text-[11px]">48%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-on-surface-muted truncate max-w-[200px]">Multiple conflicting policy clauses identified.</td>
                  <td className="py-3 pl-4 text-right">
                    <button className="text-primary hover:text-primary-container font-medium text-[12px] transition-colors">Review</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-highest/30 transition-colors">
                  <td className="py-3 pr-4 font-data-mono text-on-surface">GRV-8905B</td>
                  <td className="py-3 px-4 text-on-surface-muted">Entity_Extractor</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden"><div className="bg-[#F59E0B] w-[71%] h-full"></div></div>
                      <span className="font-data-mono text-[#F59E0B] text-[11px]">71%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-on-surface-muted truncate max-w-[200px]">Unrecognized institutional acronym (Dpt. HXA)</td>
                  <td className="py-3 pl-4 text-right">
                    <button className="text-primary hover:text-primary-container font-medium text-[12px] transition-colors">Review</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemInsights;
