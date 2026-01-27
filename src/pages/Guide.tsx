import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";

export default function Guide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-black text-white flex items-center justify-center">
      <MobileFrame>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-2 pb-2 z-10 border-b border-white/5 bg-brand-black">
          <button
            onClick={() => navigate("/result")}
            className="p-2 -ml-2 text-brand-gray hover:text-white"
          >
            <span className="material-icons-round">expand_more</span>
          </button>
          <h2 className="text-lg font-bold">路书详情</h2>
          <button className="p-2 -mr-2 text-brand-gray hover:text-white">
            <span className="material-icons-round">share</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-gradient-to-br from-brand-dark to-brand-dark/50 rounded-2xl p-5 mb-6 border border-brand-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <span className="material-icons-round text-brand-accent text-[96px]">bolt</span>
            </div>
            <h3 className="text-brand-accent font-bold text-sm mb-2 flex items-center gap-2">
              <span className="material-icons-round text-sm">bolt</span>
              AI 路书分析
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              这条 30.5km 的路线 <span className="text-white font-bold">完美避开了早高峰拥堵路段</span>。前 5km 可作为热身，进入滨江路段后有长达 12km 的无红绿灯直路，非常适合进行 <span className="text-brand-accent">甜区功率训练</span>。注意第 22km 处有一个施工路口，建议减速。
            </p>
          </div>

          <div className="space-y-0 relative pl-4 border-l-2 border-gray-800 ml-2">
            <div className="pb-8 relative pl-6">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-brand-success ring-4 ring-brand-black"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white">热身路段</h4>
                  <p className="text-xs text-brand-gray mt-1">0 - 5.0 km · 城市道路</p>
                </div>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">3 红绿灯</span>
              </div>
            </div>

            <div className="pb-8 relative pl-6">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-brand-accent ring-4 ring-brand-black"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white">核心训练区</h4>
                  <p className="text-xs text-brand-gray mt-1">5.0 - 22.0 km · 滨江绿道</p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] border border-brand-accent/30 text-brand-accent px-1.5 py-0.5 rounded">无红绿灯</span>
                    <span className="text-[10px] border border-brand-accent/30 text-brand-accent px-1.5 py-0.5 rounded">路况极佳</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-8 relative pl-6">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-brand-danger ring-4 ring-brand-black"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white">注意路段</h4>
                  <p className="text-xs text-brand-gray mt-1">22.0 - 22.5 km · 施工区域</p>
                </div>
                <span className="text-xs bg-brand-danger/20 text-brand-danger px-2 py-1 rounded">减速慢行</span>
              </div>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-brand-success ring-4 ring-brand-black"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white">放松冷身</h4>
                  <p className="text-xs text-brand-gray mt-1">22.5 - 30.5 km · 返程</p>
                </div>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">1 红绿灯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-brand-black border-t border-white/5 z-20">
          <button className="w-full bg-brand-accent text-brand-black font-bold text-lg h-14 rounded-2xl shadow-lg shadow-brand-accent/25 hover:bg-brand-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-3">
            <span className="material-icons-round">download</span>
            导出 GPX 文件
          </button>
          <button className="w-full bg-brand-dark border border-white/10 text-brand-gray font-bold text-sm h-12 rounded-xl hover:bg-brand-dark/80 hover:text-white transition-all flex items-center justify-center gap-2">
            <span className="material-icons-round text-lg">sync</span>
            同步到 Strava (开发中)
          </button>
        </div>
      </MobileFrame>
    </div>
  );
}
