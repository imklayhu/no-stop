import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";

export default function Loading() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1200),
      setTimeout(() => setStep(2), 2800),
      setTimeout(() => setStep(3), 4300),
      setTimeout(() => navigate("/result"), 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-brand-black text-white flex items-center justify-center">
      <MobileFrame>
        <div className="relative h-full flex flex-col pt-16 px-8 pb-10">
          {/* Radar */}
          <div className="relative flex-none h-64 flex items-center justify-center">
            <div className="absolute w-64 h-64 border border-brand-accent/20 rounded-full animate-ping"></div>
            <div
              className="absolute w-64 h-64 border border-brand-accent/20 rounded-full animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute w-64 h-64 border border-brand-accent/20 rounded-full animate-ping"
              style={{ animationDelay: "2s" }}
            ></div>
            <div className="absolute w-48 h-48 border border-brand-accent/10 rounded-full"></div>
            <div className="absolute w-32 h-32 border border-brand-accent/20 rounded-full"></div>
            <div className="relative w-20 h-20 bg-brand-black border-2 border-brand-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <span className="material-symbols-outlined text-brand-accent text-4xl">
                polyline
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="flex-1 mt-10 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-brand-success flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">
                  check
                </span>
              </div>
              <span className="text-lg font-medium">解析训练意图...</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="text-lg font-bold text-brand-accent">
                生成候选闭环 (30km ±10%)
              </span>
            </div>

            <div className="flex items-center space-x-4 opacity-30">
              <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center"></div>
              <span className="text-lg font-medium">过滤红绿灯 & 掉头弯</span>
            </div>

            <div className="flex items-center space-x-4 opacity-30">
              <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center"></div>
              <span className="text-lg font-medium">生成路书详情</span>
            </div>
          </div>

          {/* Terminal */}
          <div className="mt-auto bg-[#020617] rounded-2xl p-4 shadow-inner border border-slate-800/50">
            <div className="h-32 overflow-y-auto font-mono text-xs leading-relaxed text-brand-success space-y-1">
              <p className="flex">
                <span className="mr-2">&gt;</span> Analysis: urban_loop mode
              </p>
              <p className="flex">
                <span className="mr-2">&gt;</span> Target: 30km [tolerance: low]
              </p>
              <p className="flex">
                <span className="mr-2">&gt;</span> Constraint: avoid_u_turn =
                true
              </p>
              {step >= 1 && (
                <>
                  <p className="flex">
                    <span className="mr-2">&gt;</span> Fetching road network
                    data...
                  </p>
                  <p className="flex">
                    <span className="mr-2">&gt;</span> Generating 12 candidate
                    loops...
                  </p>
                </>
              )}
              {step >= 2 && (
                <p className="flex opacity-80">
                  <span className="mr-2">&gt;</span> Optimizing segments...
                </p>
              )}
            </div>
          </div>
        </div>
      </MobileFrame>
    </div>
  );
}
