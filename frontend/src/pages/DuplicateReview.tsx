import React from 'react';
import { useNavigate } from 'react-router-dom';

const DuplicateReview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-on-background relative pb-[88px]">
      {/* Focused Workspace Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-[#363941] bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="h-6 w-px bg-[#363941]"></div>
          <div>
            <h1 className="text-xl font-medium text-on-surface">Duplicate Review Workspace</h1>
            <p className="text-sm text-on-surface-variant">Resolve potential redundancy</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1d2027] px-3 py-1.5 rounded-full border border-[#363941]">
            <span className="material-symbols-outlined text-primary text-sm">sparkles</span>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">AI Confidence: 92%</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Content */}
      <main className="flex-1 p-6 flex flex-col xl:flex-row gap-4 max-w-[1600px] mx-auto w-full">
        {/* Left Panel: Original Complaint */}
        <section className="flex-1 flex flex-col gap-4 min-w-[320px]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#8c909f]"></div>
            <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Original Record</h2>
          </div>
          <div className="bg-[#191b23] border border-[#363941] rounded-xl p-5 flex-1 flex flex-col gap-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono text-sm text-on-surface-variant mb-1">GRV-2023-8942</div>
                <h3 className="text-xl font-medium text-on-surface">Unsafe Working Conditions on Site B</h3>
              </div>
              <span className="px-2 py-1 rounded-md bg-[#32353c] text-on-surface text-xs font-bold">Oct 12, 2023</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 p-5 bg-[#1d2027] rounded-lg border border-[#363941]">
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-1 uppercase">Location</div>
                <div className="text-sm text-on-surface">North Wing, Level 3</div>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-1 uppercase">Category</div>
                <div className="text-sm text-on-surface">Safety Hazard</div>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-1 uppercase">Reporter</div>
                <div className="text-sm text-on-surface">Anonymous</div>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-1 uppercase">Status</div>
                <div className="text-sm text-primary">In Investigation</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-on-surface-variant mb-2 uppercase">Description</div>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                Exposed wiring near the main water dispenser in the North Wing break room. It has been like this for three days and poses a significant electrocution risk, especially with the frequent spills in the area.
              </p>
            </div>

            <div className="mt-auto pt-4">
              <div className="text-xs font-bold text-on-surface-variant mb-2 uppercase">Extracted Entities</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#32353c] text-on-surface font-mono text-xs">wiring</span>
                <span className="px-2.5 py-1 rounded-full bg-[#32353c] text-on-surface font-mono text-xs">water_dispenser</span>
                <span className="px-2.5 py-1 rounded-full bg-[#32353c] text-on-surface font-mono text-xs">north_wing</span>
              </div>
            </div>
          </div>
        </section>

        {/* Center Divider / AI Analysis */}
        <section className="xl:w-[320px] shrink-0 flex flex-col gap-4">
          <div className="flex items-center gap-3 xl:justify-center">
            <span className="material-symbols-outlined text-primary">compare_arrows</span>
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Similarity Analysis</h2>
          </div>
          <div className="bg-[#1d2027] border border-[#363941] rounded-xl p-5 flex-1 flex flex-col gap-6 relative shadow-[0_0_24px_rgba(173,198,255,0.15)]" style={{ background: 'linear-gradient(135deg, rgba(77, 142, 255, 0.1) 0%, rgba(87, 27, 193, 0.1) 100%)' }}>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>
            <div className="text-center pb-4 border-b border-[#363941]">
              <div className="text-4xl font-bold text-primary mb-1">92%</div>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Match Probability</div>
            </div>
            <div className="flex flex-col gap-4">
              {/* Common Signals */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
                  <h4 className="text-xs font-bold text-on-surface uppercase">Common Signals</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center bg-[#191b23] p-2 rounded-md border border-[#363941]">
                    <span className="text-sm text-on-surface-variant">Location</span>
                    <span className="font-mono text-xs text-on-surface">North Wing</span>
                  </li>
                  <li className="flex justify-between items-center bg-[#191b23] p-2 rounded-md border border-[#363941]">
                    <span className="text-sm text-on-surface-variant">Subject</span>
                    <span className="font-mono text-xs text-on-surface">Exposed Wiring</span>
                  </li>
                  <li className="flex justify-between items-center bg-[#191b23] p-2 rounded-md border border-[#363941]">
                    <span className="text-sm text-on-surface-variant">Timeframe</span>
                    <span className="font-mono text-xs text-on-surface">&lt; 24h apart</span>
                  </li>
                </ul>
              </div>
              {/* Different Signals */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-orange-400 text-[18px]">error</span>
                  <h4 className="text-xs font-bold text-on-surface uppercase">Different Signals</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center bg-[#191b23] p-2 rounded-md border border-[#363941]">
                    <span className="text-sm text-on-surface-variant">Reporter</span>
                    <span className="font-mono text-xs text-on-surface">Unknown vs. J. Doe</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Potential Duplicate */}
        <section className="flex-1 flex flex-col gap-4 min-w-[320px]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Potential Duplicate</h2>
          </div>
          <div className="bg-[#191b23] border border-[#363941] rounded-xl p-5 flex-1 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute inset-0 border-[0.5px] border-primary/20 rounded-xl pointer-events-none"></div>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono text-sm text-primary mb-1">GRV-2023-8810</div>
                <h3 className="text-xl font-medium text-on-surface">Electrical hazard in break room</h3>
              </div>
              <span className="px-2 py-1 rounded-md bg-[#32353c] text-on-surface text-xs font-bold">Oct 13, 2023</span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5 bg-[#1d2027] rounded-lg border border-[#363941]">
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-1 uppercase">Location</div>
                <div className="text-sm text-on-surface bg-primary/10 px-1 -mx-1 rounded inline-block">North Wing, Break Room</div>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-1 uppercase">Category</div>
                <div className="text-sm text-on-surface">Facilities</div>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-1 uppercase">Reporter</div>
                <div className="text-sm text-on-surface">John Doe</div>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-1 uppercase">Status</div>
                <div className="text-sm text-on-surface">New</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-on-surface-variant mb-2 uppercase">Description</div>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                There are some wires hanging out of the wall near the water cooler on the 3rd floor north side. Someone could get shocked when getting a drink.
              </p>
            </div>

            <div className="mt-auto pt-4">
              <div className="text-xs font-bold text-on-surface-variant mb-2 uppercase">Extracted Entities</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs">wires</span>
                <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs">water_cooler</span>
                <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs">3rd_floor_north</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Sticky Actions */}
      <footer className="fixed bottom-0 left-0 right-0 h-[88px] bg-[#272a31] border-t border-[#363941] flex items-center justify-center px-6 z-40 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md bg-opacity-90">
        <div className="max-w-[800px] w-full flex items-center justify-between gap-4">
          <button className="px-6 py-3 rounded-lg border border-[#363941] bg-[#10131a] hover:bg-[#32353c] text-on-surface text-sm font-bold transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">close</span>
            Not Related
          </button>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 rounded-lg border border-[#363941] bg-[#10131a] hover:bg-[#32353c] text-on-surface text-sm font-bold transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">link</span>
              Mark Related
            </button>
            <button className="px-8 py-3 rounded-lg bg-primary hover:bg-[#4d8eff] text-[#002e6a] text-sm font-bold transition-all shadow-[0_0_24px_rgba(173,198,255,0.15)] flex items-center gap-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-[#571bc1] opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <span className="material-symbols-outlined text-[18px]">merge_type</span>
              Confirm Duplicate
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DuplicateReview;
