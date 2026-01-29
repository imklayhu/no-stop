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
  calculateScore(routeData: { distance: number; steps?: { instruction?: string }[]; trafficCondition?: string; trafficLightCount?: number }): RouteMetrics {
    // 1. 提取基础数据
    const distance = routeData.distance / 1000; // 米转千米
    
    // 红绿灯计算策略：
    // 优先使用 API 返回的 trafficLightCount (来自驾车API)，如果为 0 或未提供，则回退到指令解析
    let trafficLights = routeData.trafficLightCount || 0;

    // 如果 API 数据为 0，尝试从 instruction 中解析 (Backup)
    if (trafficLights === 0 && routeData.steps) {
      routeData.steps.forEach((step: { instruction?: string }) => {
        if (step.instruction) {
          // 匹配常见红绿灯描述
          if (step.instruction.includes('红绿灯') || step.instruction.includes('交通灯')) {
            trafficLights++;
          }
        }
      });
    }

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
