import { useNavigate, useLocation } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import { RouteResponse } from "@/lib/api";
import MapContainer from "@/components/MapContainer";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeData = location.state?.routeData as RouteResponse | undefined;
  const scoreData = routeData?.scoreResult;

  if (!scoreData || !routeData) {
    return (
      <div className="min-h-screen bg-brand-black text-white flex items-center justify-center">
        <MobileFrame>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className="text-brand-gray">未找到路线数据</p>
            <button 
              className="bg-brand-accent text-brand-black font-bold py-2 px-6 rounded-xl"
              onClick={() => navigate("/")}
            >
              返回首页
            </button>
          </div>
        </MobileFrame>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-white flex items-center justify-center">
      <MobileFrame>
        <div className="relative z-10 p-4 pt-4 flex justify-between items-start w-full pointer-events-none">
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg text-slate-800 pointer-events-auto" onClick={() => navigate("/")}>
            <span className="material-icons">chevron_left</span>
          </button>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white/95 rounded-full px-4 py-1.5 flex items-center gap-1 shadow-md">
              <span className="text-slate-900 text-sm font-bold">推荐路线 A</span>
              <span className="text-brand-accent flex items-center">
                <span className="material-icons text-[14px]">star</span>
                <span className="text-slate-900 text-sm font-bold ml-0.5">{scoreData.score.toFixed(1)}</span>
              </span>
            </div>
            <div className="bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-white text-xs font-medium">候选 1 / 1</div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <MapContainer routeData={routeData} />
        </div>

        <div className="mt-auto z-10 p-4 pointer-events-none fixed bottom-0 left-0 right-0">
          <div className="bg-brand-black/90 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-6 border border-white/10 pointer-events-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-brand-gray text-sm font-medium">总距离</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-white text-4xl font-bold tracking-tight">{scoreData.totalDistance.toFixed(1)}</span>
                  <span className="text-brand-accent font-bold text-lg">km</span>
                </div>
              </div>
              <div className="flex justify-end gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-brand-gray text-xs font-medium mb-1">红绿灯</span>
                  <span className="text-white text-2xl font-bold">{scoreData.trafficLights}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-brand-gray text-xs font-medium mb-1">掉头</span>
                  <span className="text-white text-2xl font-bold">{scoreData.uTurns}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-brand-gray text-sm">路况得分</span>
                <span className="text-brand-accent font-bold text-sm">
                  {scoreData.score >= 90 ? "极佳" : scoreData.score >= 80 ? "优秀" : "良好"}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-accent rounded-full transition-all duration-1000" 
                  style={{ width: `${scoreData.score}%` }}
                ></div>
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
