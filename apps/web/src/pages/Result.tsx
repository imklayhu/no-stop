import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";

export default function Result() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-black text-white flex items-center justify-center">
      <MobileFrame>
        <div className="relative z-10 p-4 pt-4 flex justify-between items-start w-full">
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg text-slate-800" onClick={() => navigate("/")}>
            <span className="material-icons">chevron_left</span>
          </button>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white/95 rounded-full px-4 py-1.5 flex items-center gap-1 shadow-md">
              <span className="text-slate-900 text-sm font-bold">推荐路线 A</span>
              <span className="text-brand-accent flex items-center">
                <span className="material-icons text-[14px]">star</span>
                <span className="text-slate-900 text-sm font-bold ml-0.5">9.8</span>
              </span>
            </div>
            <div className="bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-white text-xs font-medium">候选 1 / 3</div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <svg className="drop-shadow-lg w-3/4 max-w-[80%] h-auto" viewBox="0 0 100 100">
            <path d="M20 50 L45 35 L70 55" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
            <circle cx="20" cy="50" r="4" fill="white" stroke="#F59E0B" strokeWidth="2"></circle>
          </svg>
        </div>

        <div className="mt-auto relative z-10 p-4">
          <div className="bg-brand-black/90 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-6 border border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-brand-gray text-sm font-medium">总距离</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-white text-4xl font-bold tracking-tight">30.5</span>
                  <span className="text-brand-accent font-bold text-lg">km</span>
                </div>
              </div>
              <div className="flex justify-end gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-brand-gray text-xs font-medium mb-1">红绿灯</span>
                  <span className="text-white text-2xl font-bold">4</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-brand-gray text-xs font-medium mb-1">掉头</span>
                  <span className="text-white text-2xl font-bold">0</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-brand-gray text-sm">路况得分</span>
                <span className="text-brand-accent font-bold text-sm">极佳</span>
              </div>
              <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full bg-brand-accent w-[92%] rounded-full"></div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-[0.8] bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-4 rounded-2xl transition-all">下一条</button>
              <button className="flex-[1.5] bg-brand-accent hover:bg-amber-500 text-brand-black font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-accent/20" onClick={() => navigate("/guide")}>
                查看详情 & 导出
                <span className="material-icons text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </MobileFrame>
    </div>
  );
}
