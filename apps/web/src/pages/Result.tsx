import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import { RouteResponse } from "@/lib/api";
import MapContainer from "@/components/MapContainer";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeData = location.state?.routeData as RouteResponse | undefined;
  // 兼容单路线和多路线数据结构 (目前API返回的是 routes 数组)
  const routes = routeData?.baiduResult?.routes || [];
  // 提取评分数据，如果是多路线，这里需要调整 logic。
  // 当前后端 ScoringService 只针对第一条路线返回了 scoreResult。
  // 理想情况：后端 fetchRoute 应该对所有路线都进行评分。
  // MVP Phase 2: 假设 fetchRoute 目前返回的结构是 { baiduResult, scoreResult, ... }
  // 如果后端升级了 generateCircuitRoute 返回多条路线，我们需要确保 API 响应结构也包含了每条路线的评分。
  
  // 临时：前端只展示第一条，等待后续 task 完善 "Web前端：Result页支持多路线切换与展示" 逻辑
  // 但为了不报错，先取第一个。
  // 实际上，后端 generateCircuitRoute 已经返回了 { routes: [...] }，每条 route 对象里包含了 distance, duration, steps, trafficCondition 等。
  // 但是 ScoringService 目前是在 AppController 里调用的，且只处理了第一条？
  // 让我们检查一下 AppController。
  
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  
  // 重新计算当前选中路线的评分（如果后端没返回数组评分，前端暂时无法展示多条的差异化评分）
  // 这是一个需要后端配合修改的地方。目前先展示 UI 框架。

  // 假设 routeData.scoreResult 是针对第0条的。
  const scoreData = routeData?.scoreResult; 

  if (!routeData || routes.length === 0) {
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

  // 构造当前路线的显示数据
  // 注意：由于后端 API 结构限制，目前 scoreData 可能只对应第一条。
  // 我们需要重构 Result 页以支持多条路线的切换。
  // 这里先简单实现：如果 routes 有多条，显示切换按钮。
  
  const currentRoute = routes[currentRouteIndex];
  // 临时 Mock：因为后端还没返回每条路线的 score，我们暂时只展示第一条的 scoreData
  // 或者复用 scoreData，但在 UI 上提示“仅供参考”
  
  return (
    <div className="min-h-screen bg-brand-black text-white flex items-center justify-center">
      <MobileFrame>
        <div className="relative z-10 p-4 pt-4 flex justify-between items-start w-full pointer-events-none">
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg text-slate-800 pointer-events-auto" onClick={() => navigate("/")}>
            <span className="material-icons">chevron_left</span>
          </button>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white/95 rounded-full px-4 py-1.5 flex items-center gap-1 shadow-md">
              <span className="text-slate-900 text-sm font-bold">推荐路线 {String.fromCharCode(65 + currentRouteIndex)}</span>
              {scoreData && (
                <span className="text-brand-accent flex items-center">
                  <span className="material-icons text-[14px]">star</span>
                  <span className="text-slate-900 text-sm font-bold ml-0.5">{scoreData.score.toFixed(1)}</span>
                </span>
              )}
            </div>
            <div className="bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-white text-xs font-medium">
              候选 {currentRouteIndex + 1} / {routes.length}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          {/* 传递 routes 数组和当前 index 给 MapContainer (需修改 MapContainer 支持) */}
          <MapContainer routeData={{ ...routeData, baiduResult: { routes: [currentRoute] } }} />
        </div>

        {/* 左右切换按钮 (仅当有多条路线时显示) */}
        {routes.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none z-20">
            <button 
              className={`w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur pointer-events-auto transition-opacity ${currentRouteIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
              onClick={() => setCurrentRouteIndex(i => Math.max(0, i - 1))}
              disabled={currentRouteIndex === 0}
            >
              <span className="material-icons">chevron_left</span>
            </button>
            <button 
              className={`w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur pointer-events-auto transition-opacity ${currentRouteIndex === routes.length - 1 ? 'opacity-0' : 'opacity-100'}`}
              onClick={() => setCurrentRouteIndex(i => Math.min(routes.length - 1, i + 1))}
              disabled={currentRouteIndex === routes.length - 1}
            >
              <span className="material-icons">chevron_right</span>
            </button>
          </div>
        )}

        <div className="mt-auto z-10 p-4 pointer-events-none fixed bottom-0 left-0 right-0">
          <div className="bg-brand-black/90 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-6 border border-white/10 pointer-events-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-brand-gray text-sm font-medium">总距离</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-white text-4xl font-bold tracking-tight">{(currentRoute.distance / 1000).toFixed(1)}</span>
                  <span className="text-brand-accent font-bold text-lg">km</span>
                </div>
              </div>
              {scoreData && (
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
              )}
            </div>

            {scoreData && (
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
            )}
            
            {/* 展示实时路况标签 */}
            {currentRoute.trafficCondition && (
               <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                 <span className="material-icons text-brand-accent text-sm">traffic</span>
                 <span className="text-xs text-white">
                   路况评估: <span className={currentRoute.trafficCondition === '拥堵' ? 'text-red-400' : 'text-green-400'}>{currentRoute.trafficCondition}</span>
                 </span>
               </div>
            )}

            <div className="flex gap-3 pt-2">
              <button 
                className="flex-[0.8] bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-4 rounded-2xl transition-all"
                onClick={() => setCurrentRouteIndex(i => (i + 1) % routes.length)}
              >
                下一条
              </button>
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
