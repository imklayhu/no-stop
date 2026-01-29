import { Controller, Get, Query, Inject } from '@nestjs/common';
import { BaiduMapService } from './services/baidu-map.service';
import { ScoringService } from './services/scoring.service';

@Controller()
export class AppController {
  constructor(
    @Inject(BaiduMapService) private readonly baiduMapService: BaiduMapService,
    @Inject(ScoringService) private readonly scoringService: ScoringService,
  ) {}

  @Get()
  getRoot() {
    return { ok: true };
  }

  @Get('test-route')
  async testRoute(
    @Query('origin') origin: string,
    @Query('destination') destination: string, // MVP: 如果传入 destination 则为单程，否则为闭环绕圈
    @Query('distance') distance: string = '30', // 默认30km
  ) {
    if (!origin) {
      return { error: 'origin is required (lat,lng)' };
    }

    try {
      let routeResult;
      
      // 如果没有指定 destination，或者 origin 和 destination 非常接近（视为闭环需求），则生成闭环
      // 这里简化逻辑：只要没传 destination，就默认生成闭环
      if (!destination) {
        routeResult = await this.baiduMapService.generateCircuitRoute(origin, parseFloat(distance));
      } else {
        routeResult = await this.baiduMapService.getRidingRoute(origin, destination);
      }
      
      let scoreResult = null;
      if (routeResult && routeResult.routes && routeResult.routes.length > 0) {
        scoreResult = this.scoringService.calculateScore(routeResult.routes[0]);
      }

      return {
        baiduResult: routeResult,
        scoreResult,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { error: message };
    }
  }
}
