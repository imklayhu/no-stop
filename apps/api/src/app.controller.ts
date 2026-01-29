import { Controller, Get, Query, Inject, Post, Body } from '@nestjs/common';
import { BaiduMapService } from './services/baidu-map.service';
import { ScoringService } from './services/scoring.service';
import { PrismaService } from './services/prisma.service';

@Controller()
export class AppController {
  constructor(
    @Inject(BaiduMapService) private readonly baiduMapService: BaiduMapService,
    @Inject(ScoringService) private readonly scoringService: ScoringService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Get()
  getRoot() {
    return { ok: true };
  }

  // 获取用户历史路线
  @Get('history')
  async getHistory(@Query('userId') userId: string) {
    if (!userId) {
      return { routes: [] };
    }

    try {
      // 检查用户是否存在，不存在则先创建（MVP Mock逻辑）
      // 注意：findMany 本身不会因为用户不存在而报错（只会返回空数组），
      // 但如果 error 是 'Failed to fetch history'，说明是数据库连接或查询抛出了异常。
      // 为了调试，我们先打印具体的 error。
      
      // MVP: 确保 Mock User 存在
      // 真实场景不需要这一步，因为 User 应该在登录时创建
      const mockUserId = '00000000-0000-0000-0000-000000000000';
      if (userId === mockUserId) {
        await this.prisma.user.upsert({
          where: { id: mockUserId },
          update: {},
          create: { id: mockUserId, phone: '13800000000' },
        });
      }

      const routes = await this.prisma.route.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      return { routes };
    } catch (error: any) {
      console.error('History fetch error:', error);
      return { error: `Failed to fetch history: ${error.message}` };
    }
  }

  // 保存路线 (MVP)
  @Post('save-route')
  async saveRoute(@Body() body: { userId: string; routeData: any; scoreData: any }) {
    try {
      const route = await this.prisma.route.create({
        data: {
          userId: body.userId,
          title: '城市绕圈训练', // 默认标题
          distance: body.scoreData?.totalDistance || 0,
          score: body.scoreData?.score || 0,
          pathData: body.routeData,
          metaData: body.scoreData,
          guideText: '',
        },
      });
      return { success: true, id: route.id };
    } catch (error) {
      return { error: 'Failed to save route' };
    }
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

      // 保存到数据库 (可选，MVP为了History功能，这里尝试保存)
      // 注意：真实场景应该由前端点击“保存”或“开始骑行”时触发保存，或者生成时自动保存。
      // 这里为了简化 History 列表展示，生成成功后自动保存第一条作为记录 (Mock User ID)
      const mockUserId = '00000000-0000-0000-0000-000000000000'; // 需要在DB预先创建或 upsert
      
      // 尝试 upsert 一个 Mock User
      try {
        const user = await this.prisma.user.upsert({
          where: { id: mockUserId },
          update: {},
          create: { id: mockUserId, phone: '13800000000' },
        });
        
        // 保存生成的路线记录 (只存第一条作为代表，或者存全部)
        // 为了 History 页面能看到数据
        if (scoreResult) {
           await this.prisma.route.create({
            data: {
              userId: user.id,
              title: '城市绕圈训练',
              distance: scoreResult.totalDistance,
              score: scoreResult.score,
              metaData: scoreResult as any,
              pathData: routeResult as any, // 存完整的 result
              guideText: '',
            }
           });
        }
      } catch (e) {
        console.warn('Auto-save failed:', e);
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
