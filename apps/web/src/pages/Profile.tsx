import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import { API_URL } from "@/lib/api";

interface HistoryRoute {
  id: string;
  createdAt: string;
  metaData: {
    totalDistance: number;
    score: number;
    trafficLights: number;
  };
  pathData: any;
}

export default function Profile() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryRoute[]>([]);
  const [loading, setLoading] = useState(true);

  // MVP: Hardcoded User ID matching backend mock
  const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/history?userId=${MOCK_USER_ID}`);
      const data = await res.json();
      if (data.routes) {
        setHistory(data.routes);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteClick = (route: HistoryRoute) => {
    // Navigate to Result page reusing the existing logic
    // We need to adapt the data structure to match what Result expects (RouteResponse)
    const routeResponse = {
      baiduResult: route.pathData?.baiduResult || route.pathData, // Adapt based on how we saved it
      scoreResult: route.metaData,
    };
    navigate("/result", { state: { routeData: routeResponse } });
  };

  return (
    <div className="min-h-screen bg-brand-black text-white flex items-center justify-center">
      <MobileFrame>
        <header className="px-6 py-4 flex items-center gap-4 z-10 bg-brand-black/90 backdrop-blur sticky top-0">
          <button 
            onClick={() => navigate("/")}
            className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center"
          >
            <span className="material-icons text-brand-gray">chevron_left</span>
          </button>
          <h1 className="text-xl font-bold">个人中心</h1>
        </header>

        <main className="flex-1 px-6 pb-8 overflow-y-auto z-10">
          {/* User Info Card */}
          <section className="mt-4 mb-8 flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center text-brand-black text-2xl font-bold shadow-lg shadow-orange-500/20">
              U
            </div>
            <div>
              <h2 className="text-xl font-bold">骑行者</h2>
              <p className="text-brand-gray text-xs mt-1">ID: {MOCK_USER_ID.slice(0, 8)}...</p>
            </div>
          </section>

          {/* History List */}
          <section>
            <h3 className="text-sm font-bold text-brand-gray mb-4 uppercase tracking-wider">历史路书 ({history.length})</h3>
            
            {loading ? (
              <div className="text-center py-10 text-brand-gray">加载中...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-10 bg-brand-dark rounded-2xl border border-white/5">
                <span className="material-icons text-4xl text-brand-gray mb-2">history</span>
                <p className="text-brand-gray">暂无生成记录</p>
                <button 
                  onClick={() => navigate("/")}
                  className="mt-4 text-brand-accent text-sm font-bold"
                >
                  去生成第一条路线
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((route) => (
                  <div 
                    key={route.id}
                    onClick={() => handleRouteClick(route)}
                    className="bg-brand-dark p-4 rounded-2xl border border-white/5 hover:bg-brand-dark/80 active:scale-[0.98] transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-black rounded-xl flex items-center justify-center text-brand-accent font-bold">
                        {(route.metaData?.totalDistance || 0).toFixed(0)}
                        <span className="text-[10px] ml-0.5">km</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm">城市绕圈训练</h4>
                          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-brand-gray">
                            {new Date(route.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-brand-gray">
                          <span className="flex items-center gap-1">
                            <span className="material-icons text-[10px]">traffic</span>
                            {route.metaData?.trafficLights} 红绿灯
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-icons text-[10px]">star</span>
                            {route.metaData?.score?.toFixed(1)} 分
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="material-icons text-brand-gray group-hover:text-white transition-colors">chevron_right</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </MobileFrame>
    </div>
  );
}
