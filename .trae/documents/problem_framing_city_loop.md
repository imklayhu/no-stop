# Problem Framing Canvas: AI-Powered City Loop Planner (AI 城市绕圈规划师)

## 1. Context (背景)
- **Target Audience (目标用户)**: 资深骑行爱好者 (Serious Cyclists)。
- **Scenario (场景)**: 
    - **核心场景**: 工作日晚间训练 (夜骑)，用户有模糊的骑行意图（如“想找个安静的地方练腿”）。
    - **扩展场景**: 周末/清晨的日间训练。
- **Activity (活动)**: 通过自然语言交互，寻找并规划一条“懂我”的高质量训练路线，规避隐形风险。
- **Core Need (核心需求)**: 替代机械的参数筛选和无效的实地探路，通过 AI 的意图理解和常识推理，获得安全且符合当前心境的路线。

## 2. The 4 Ws (四个维度)

### Who (谁是用户?)
- 拥有专业设备（公路车、GPS码表）的骑行者。
- 对路线安全性有极高要求，尤其是夜骑时的“隐形风险”（如夜市、放学时段的学校）。
- 厌倦了复杂的地图筛选工具，希望有一个像“老鸟”一样的助手。

### What (他们在做什么/想做什么?)
- **模糊意图表达**: 比如“想去个没车的地方骑 1 小时”，而不是手动设置“距离=30km, 路况=拥堵低”。
- **规避隐形风险**: 想要避开地图上看起来通畅，但实际上不适合骑行的地方（如夜市、施工扬尘区）。
- **获得情感共鸣**: 希望得到的不仅仅是 GPX，还有类似教练或老朋友的推荐理由。

### Where (在哪里发生?)
- **规划阶段**: 在家或办公室，与 AI 助手进行对话式交互。
- **执行阶段**: 户外骑行，依靠码表导航，享受 AI 筛选出的优质路线。

### Why (为什么这是个问题?)
- **交互门槛高**: 传统工具需要用户将模糊需求手动转化为具体参数，操作繁琐。
- **常识缺失**: 传统导航算法只懂“路网”，不懂“环境”。它不知道周五晚上的夜市对骑行者意味着危险。
- **缺乏温度**: 纯数据的展示（红绿灯 x3）无法给用户带来出发的信心和期待。

## 3. Problem Statement (问题陈述)

**English:**
Serious cyclists need an AI-powered route planner that understands natural language intent and environmental context because traditional map tools force them to manually configure complex parameters and fail to identify "common sense" risks (like night markets or school zones), leading to frustration during planning and potential safety hazards during the ride.

**中文:**
资深骑行爱好者需要一种具备 AI 意图理解和环境常识推理能力的路线规划工具。
**但是 (But)**，目前的地图工具操作机械繁琐，且缺乏对“环境语义”的理解（例如无法识别夜市、学校放学等隐形风险）。
**因为 (Because)**，传统算法只处理结构化路网数据，无法像人类一样进行常识推理，导致推荐的路线虽然“通畅”但并不“安全”或“舒适”。
**这让他们感到 (Emotion)**，在规划时感到费神，在骑行时对未知路况感到担忧，缺乏对路线的信任感。

## 4. Specific Requirements & Constraints (具体需求与约束)

| 维度 | 关键指标/要求 | 原因/备注 |
| :--- | :--- | :--- |
| **AI 能力** | **意图解析 (Intent Parsing)** | 支持自然语言输入，自动提取距离、时间、偏好等参数。 |
| **核心算法** | **常识推理评分 (Semantic Scoring)** | 结合时间 + POI + 环境上下文，识别隐形风险（如夜市、施工）。 |
| **交互体验** | **情感化路书 (AI Scouting Report)** | 生成有温度、教练视角的路线点评，而非冷冰冰的数据。 |
| **核心产出** | **GPX 文件** | 最终交付物仍需是标准的 GPX，确保硬件兼容性。 |
| **场景适应** | **动态风险评估** | 同一条路，周五晚上（夜市）和周一晚上（清静）的评分应不同。 |

## 5. Value Proposition (价值主张)
**“懂骑行，更懂环境的 AI 领航员”**
不只是导航，而是基于 Minimax 大模型的深度推理。它听得懂你的模糊想法，看得见地图背后的隐形风险，像一位经验丰富的老鸟，为你推荐最适合当下的那条完美闭环。
