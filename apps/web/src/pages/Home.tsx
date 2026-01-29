import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/MobileFrame";
import { appName } from "@no-stop/shared";
import { fetchRoute } from "@/lib/api";

export default function Home() {
  const navigate = useNavigate();
  const [distance, setDistance] = useState<number>(30);

  // Hardcoded coordinates for MVP demo (Beijing)
  // Origin: 西二旗 (approx)
  // Destination: 闭环模式，不需要显式指定终点，由后端计算折返点
  const TEST_ORIGIN = "40.056885,116.30815";
  // const TEST_DESTINATION = "39.915285,116.403857"; // Deprecated for Loop Mode

  const handleGenerateRoute = async () => {
    navigate("/generating"); // Show loading screen immediately
    
    try {
      // 仅传入起点和距离，触发闭环生成逻辑
      const data = await fetchRoute(TEST_ORIGIN, undefined, distance);
      if (data.error) {
        alert(`Error: ${data.error}`);
        navigate("/"); // Go back on error
      } else {
        navigate("/result", { state: { routeData: data } });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to server");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-white flex items-center justify-center">
      <MobileFrame>
        <header className="px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="material-icons-round text-white">bolt</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">{appName}</h1>
          </div>
        </header>

        <main className="flex-1 px-6 space-y-6 overflow-y-auto pb-8 z-10">
          <section className="mt-2">
            <div className="bg-brand-dark p-5 rounded-3xl border border-white/5 flex justify-between items-center shadow-sm">
              <div className="flex gap-3">
                <span className="material-icons-round text-brand-gray">location_on</span>
                <div>
                  <p className="text-xs text-brand-gray font-medium">当前起终点 (MVP测试)</p>
                  <p className="text-lg font-bold mt-0.5">北京 · 西二旗 → 天安门</p>
                </div>
              </div>
              <button className="text-brand-accent font-bold text-sm">修改</button>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-brand-gray px-1">目标距离 (KM)</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { val: 10, label: "恢复" },
                { val: 30, label: "有氧" },
                { val: 50, label: "耐力" },
                { val: 80, label: "长途" },
              ].map((item) => (
                <button
                  key={item.val}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                    distance === item.val
                      ? "bg-brand-accent text-brand-black shadow-lg shadow-orange-500/30 scale-105"
                      : "bg-brand-dark border border-white/5"
                  }`}
                  onClick={() => setDistance(item.val)}
                >
                  <span
                    className={`${distance === item.val ? "text-white" : ""} text-xl font-bold`}
                  >
                    {item.val}
                  </span>
                  <span
                    className={`text-[10px] ${distance === item.val ? "text-white/80" : "text-brand-gray"}`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-brand-gray px-1">训练类型</h2>
            <div 
              className="space-y-3 cursor-pointer" 
              onClick={handleGenerateRoute}
            >
              <div className="bg-brand-dark/50 p-4 rounded-3xl border-2 border-brand-accent flex items-center justify-between relative overflow-hidden hover:bg-brand-dark/70 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-brand-accent">loop</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">城市绕圈 (点击生成)</h3>
                      <span className="bg-brand-accent px-1.5 py-0.5 rounded text-[10px] font-bold text-brand-black uppercase">
                        推荐
                      </span>
                    </div>
                    <p className="text-xs text-brand-gray mt-0.5">
                      红绿灯少 · 不掉头 · 节奏稳
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 border-2 border-brand-accent rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-brand-accent rounded-full"></div>
                </div>
              </div>

              <div className="bg-brand-dark p-4 rounded-3xl border border-white/5 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-dark rounded-2xl flex items-center justify-center">
                    <span className="material-icons-round text-brand-gray">trending_up</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-400">爬坡训练</h3>
                    <p className="text-xs text-gray-600 mt-0.5">寻找城市周边起伏路段</p>
                  </div>
                </div>
                <div className="w-6 h-6 border-2 border-slate-700 rounded-full"></div>
              </div>
            </div>
          </section>
        </main>

        <footer className="p-6 space-y-4">
          <div className="bg-brand-dark px-5 py-3.5 rounded-2xl border border-white/5 flex items-center justify-between shadow-sm">
            <p className="text-brand-gray text-sm font-medium">或者告诉我，想去哪？有什么要求？</p>
            <span className="material-icons-round text-brand-gray">mic</span>
          </div>
          <button
            onClick={() => navigate("/generating")}
            className="w-full bg-brand-accent hover:bg-amber-600 text-brand-black py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 transition-all active:scale-[0.98]"
          >
            <span className="material-icons-round">bolt</span>
            <span className="text-lg font-bold tracking-wide">生成训练路书</span>
          </button>
        </footer>
      </MobileFrame>
    </div>
  );
}
