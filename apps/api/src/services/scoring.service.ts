import { Injectable, Logger } from '@nestjs/common';

export interface RouteMetrics {
  trafficLights: number;
  uTurns: number;
  sharpTurns: number;
  maxContinuousDist: number; // km
  totalDistance: number; // km
  trafficCondition?: string; // 新增：实时路况
  score: number;
}

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  /**
   * 评分算法 (MVP版)
   * Score = 100 - (红绿灯 * 5) - (掉头弯 * 10) - (急弯 * 3) + (连续路段 * 3)
   */
  calculateScore(routeData: { distance: number; steps?: { instruction?: string }[]; trafficCondition?: string }): RouteMetrics {
    // 1. 提取基础数据
    // 注意：百度API返回的结构可能需要适配，这里假设已标准化或基于百度原始数据
    // 百度API v2 riding result.routes[0]
    // steps: [{ traffic_lights: number, path: "lng,lat;lng,lat" }] (需确认steps是否有traffic_lights字段)
    // 实际百度Web API riding v4 返回的 steps 里可能不直接包含红绿灯数，可能需要从 path 几何分析或 text instruction 分析
    // MVP简化：假设输入已经包含红绿灯计数（若API不提供，暂时只能置0或通过POI匹配）
    
    // 暂时Mock数据提取逻辑，等待真实API响应结构确认
    // 假设 routeData 是百度API返回的 route 对象
    
    const distance = routeData.distance / 1000; // 米转千米
    
    // MVP Hack: 百度API不直接返回红绿灯数量，需要自行通过路口匹配或 instruction 关键词匹配
    // 这里先简单统计 steps 数量作为路口复杂度的近似，后续接入MCP/LLM增强
    let trafficLights = 0; 
    // 尝试从 instruction 中查找 "红绿灯" 关键词 (百度API中文指令)
    if (routeData.steps) {
      routeData.steps.forEach((step: { instruction?: string }) => {
        if (step.instruction) {
          // 匹配常见红绿灯描述
          if (step.instruction.includes('红绿灯') || step.instruction.includes('交通灯')) {
            trafficLights++;
          }
        }
      });
    }

    // 尝试获取路况信息 (Mock: 因为百度骑行API不返回路况)
    // 假设：如果 trafficLights 密度过高，或者处于市中心区域（可通过坐标判断），则路况较差
    // MVP: 仅根据红绿灯密度给出一个路况评分
    // const trafficCondition = trafficLights > (distance / 2) ? '拥堵' : '畅通'; // 每2km超过1个红绿灯视为拥堵

    const uTurns = 0; // 需要几何计算，MVP Phase 1 暂略
    const sharpTurns = 0; // 需要几何计算
    const maxContinuousDist = 0; // 需要几何计算

    // 2. 计算得分
    let score = 100;
    score -= trafficLights * 5;
    score -= uTurns * 10;
    score -= sharpTurns * 3;
    score += maxContinuousDist * 3;
    
    // 如果路况拥堵，扣分
    if (routeData.trafficCondition === '拥堵') {
      score -= 20;
    } else if (routeData.trafficCondition === '缓行') {
      score -= 10;
    }

    // 归一化 0-100
    score = Math.max(0, Math.min(100, score));

    return {
      trafficLights,
      uTurns,
      sharpTurns,
      maxContinuousDist,
      totalDistance: distance,
      trafficCondition: routeData.trafficCondition || '未知',
      score,
    };
  }
}
