# Problem Framing Canvas: City Loop Route Planner (城市绕圈路书生成器)

## 1. Context (背景)
- **Target Audience (目标用户)**: 资深骑行爱好者 (Serious Cyclists)。
- **Scenario (场景)**: 
    - **核心场景**: 工作日晚间训练 (夜骑)。
    - **扩展场景**: 周末/清晨的日间训练。
- **Activity (活动)**: 寻找并规划适合绕圈训练的路线，导出 GPX 文件到码表使用。
- **Core Need (核心需求)**: 替代手动“描点”规划和实地“探路”过程，快速获得一条可信赖的、高质量的训练路线。

## 2. The 4 Ws (四个维度)

### Who (谁是用户?)
- 拥有专业设备（公路车、GPS码表）的骑行者。
- 习惯使用 Strava、行者等工具，但厌倦了手动规划路线的繁琐。
- 对路线质量敏感：要求路面平整、无断头路、少红绿灯。

### What (他们在做什么/想做什么?)
- **摆脱手动规划**: 不想在地图上一个个点去描，去猜测这条路是否适合骑行。
- **避免无效探路**: 不想亲自骑过去才发现那是条烂路或施工路段。
- **获取 GPX**: 最终只需要一个 GPX 文件，导入码表导航即可。

### Where (在哪里发生?)
- **规划阶段**: 在家或办公室，使用手机/电脑进行路线生成。
- **执行阶段**: 户外骑行，依靠码表导航，无需手机 App 实时参与。

### Why (为什么这是个问题?)
- **信息黑盒**: 普通地图看不出路灯亮度、路面平整度、是否适合绕圈（如有无隔离带、非机动车道宽度）。
- **试错成本高**: 实地探路（Scouting）耗时耗力，对于上班族来说极其奢侈。
- **现有工具低效**: Strava 路线构建器基于热力图，但不一定代表“现在”适合绕圈（可能是以前的热门路段现在施工了）。

## 3. Problem Statement (问题陈述)

**English:**
Serious cyclists need a reliable way to generate high-quality loop training routes and export them as GPX files because manually drawing routes on maps is tedious and lacks critical "on-the-ground" details (like lighting or current road conditions), forcing them to waste time physically scouting routes or risking their training session on unknown roads, which leads to frustration and inefficient training.

**中文:**
资深骑行爱好者需要一种能够自动生成高质量绕圈训练路线并导出 GPX 的工具。
**但是 (But)**，目前的地图工具（如 Strava Route Builder）主要依赖手动描点或过时的热力图，缺乏对“适骑性”（路灯、路况、施工）的深度判断。
**因为 (Because)**，用户为了确保路线可行，往往需要花费大量时间实地“探路”或承担走到死胡同/烂路的风险。
**这让他们感到 (Emotion)**，在规划时感到繁琐，在骑行未知路线时感到不安，难以专注于训练本身。

## 4. Specific Requirements & Constraints (具体需求与约束)

| 维度 | 关键指标/要求 | 原因/备注 |
| :--- | :--- | :--- |
| **核心产出** | **GPX 文件** | 必须标准格式，支持导入 Garmin/Wahoo/Bryton 等码表。 |
| **交互模式** | **规划即走** | 用户在 App 完成生成和导出后，骑行过程中**不需要**再打开 App。 |
| **路线算法** | **智能避坑** | 能够通过数据（路灯、非机动车道、施工信息）替代人工探路。 |
| **场景适应** | **全天候 (夜骑 + 日间)** | 夜骑强调路灯/大车少；日间/周末场景相对宽松，但仍需避开拥堵。 |
| **训练类型** | **绕圈 (Loop)** | 闭环路线。不管是 3km 的小圈还是 10km 的大圈，必须首尾相接。 |
| **硬件依赖** | **无实时 GPS 依赖** | App 不负责骑行中的计圈、配速监测（交给码表）。 |

## 5. Value Proposition (价值主张)
**“你的 AI 探路员”**
不只是画线，更是帮你“验路”。通过多维数据融合，瞬间生成一条这周末就能直接去骑的完美闭环路线，直接导出 GPX 到码表，把时间留给骑行，而不是画图。
