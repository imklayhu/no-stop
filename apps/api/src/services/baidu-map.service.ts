import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BaiduMapService {
  private readonly logger = new Logger(BaiduMapService.name);
  private readonly ak: string;
  private readonly baseUrl = 'https://api.map.baidu.com';

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(HttpService) private readonly httpService: HttpService,
  ) {
    // 确保 configService 已被注入
    // 强制从 process.env 读取作为 fallback，因为 ConfigService 在构造函数中可能未完全准备好（尽管 Module 已注入）
    const ak = this.configService?.get<string>('BAIDU_MAP_SERVER_AK') || process.env.BAIDU_MAP_SERVER_AK;
    this.ak = ak || '';
    if (!this.ak) {
      this.logger.error('BAIDU_MAP_SERVER_AK is not set');
    }
  }

  /**
   * 生成闭环骑行路线 (MVP: 折返模式 A -> B -> A)
   * 生成3条不同方向的候选路线
   * @param origin 起点坐标 (lat,lng)
   * @param distanceKm 目标总距离 (km)
   */
  async generateCircuitRoute(origin: string, distanceKm: number = 30) {
    const [latStr, lngStr] = origin.split(',');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const halfDistKm = distanceKm / 2;
    const R = 6371; // 地球半径 km

    // 生成3个方向：随机起始角，间隔120度
    const startBearing = Math.random() * 360;
    const bearings = [startBearing, startBearing + 120, startBearing + 240].map(b => b % 360);

    const routePromises = bearings.map(async (bearing) => {
      try {
        // 1. 计算目标点坐标
        const lat1 = lat * Math.PI / 180;
        const lng1 = lng * Math.PI / 180;
        const brng = bearing * Math.PI / 180;
        const d = halfDistKm;

        const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d/R) + Math.cos(lat1) * Math.sin(d/R) * Math.cos(brng));
        const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(d/R) * Math.cos(lat1), Math.cos(d/R) - Math.sin(lat1) * Math.sin(lat2));

        const destLat = lat2 * 180 / Math.PI;
        const destLng = lng2 * 180 / Math.PI;
        const destStr = `${destLat.toFixed(6)},${destLng.toFixed(6)}`;

        this.logger.log(`Generating candidate circuit: ${origin} -> ${destStr} -> ${origin} (Bearing: ${bearing.toFixed(0)})`);

        // 2. 分别规划 A->B 和 B->A
        const [routeAB, routeBA] = await Promise.all([
          this.getRidingRoute(origin, destStr),
          this.getRidingRoute(destStr, origin)
        ]);

        if (!routeAB?.routes?.[0] || !routeBA?.routes?.[0]) {
          return null;
        }

        const leg1 = routeAB.routes[0];
        const leg2 = routeBA.routes[0];

        // 3. 合并路线数据
        const mergedSteps = [...(leg1.steps || []), ...(leg2.steps || [])];
        const totalDistance = leg1.distance + leg2.distance;
        const totalDuration = leg1.duration + leg2.duration;

        // 4. 获取路况评估与红绿灯数据 (通过驾车API辅助)
        const trafficData = await this.getTrafficStatus(origin, destStr);

        return {
          distance: totalDistance,
          duration: totalDuration,
          steps: mergedSteps,
          originLocation: routeAB.origin,
          destinationLocation: routeBA.destination,
          trafficCondition: trafficData.condition,
          trafficLightCount: trafficData.lightCount // 新增：红绿灯数量（辅助）
        };
      } catch (e) {
        this.logger.error(`Failed to generate route for bearing ${bearing}`, e);
        return null;
      }
    });

    const results = await Promise.all(routePromises);
    const validRoutes = results.filter(r => r !== null);

    if (validRoutes.length === 0) {
      throw new Error('Failed to generate any valid circuit routes');
    }

    return {
      routes: validRoutes
    };
  }

  /**
   * 获取路况状态与红绿灯信息 (通过驾车API辅助)
   * @param origin 起点
   * @param destination 终点
   */
  async getTrafficStatus(origin: string, destination: string): Promise<{ condition: string; lightCount: number }> {
    try {
      const url = `${this.baseUrl}/direction/v2/driving`;
      const params = {
        origin,
        destination,
        ak: this.ak,
        traffic_version: 1, // 请求包含路况详细信息
      };

      const { data } = await firstValueFrom(this.httpService.get(url, { params }));
      
      if (data.status !== 0 || !data.result?.routes?.[0]) {
        return { condition: '未知', lightCount: 0 };
      }

      const route = data.result.routes[0];
      
      // 1. 提取红绿灯数量 (百度驾车API result.routes[0].traffic_light_cnt)
      // 注意：这是单程 A->B 的红绿灯，往返大致 x2
      const oneWayLights = route.traffic_light_cnt || 0;
      const lightCount = oneWayLights * 2;

      // 2. 评估路况
      const speed = route.distance / route.duration; // m/s
      let condition = '畅通';
      if (speed < 5.5) {
        condition = '拥堵';
      } else if (speed < 8.3) {
        condition = '缓行';
      }

      return { condition, lightCount };
    } catch (error: any) {
      this.logger.error(`Error fetching traffic status: ${error.message}`);
      return { condition: '未知', lightCount: 0 };
    }
  }

  /**
   * 骑行路线规划
   * @param origin 起点坐标 (lat,lng)
   * @param destination 终点坐标 (lat,lng)
   * @returns 原始路线数据
   */
  async getRidingRoute(origin: string, destination: string) {
    try {
      const url = `${this.baseUrl}/direction/v2/riding`;
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            origin,
            destination,
            ak: this.ak,
            riding_type: 1, // 0:普通 1:电动车 (百度API参数，需确认骑行是否区分，通常v2 riding不区分)
            // 修正：百度骑行v2 API 文档参数是 origin, destination, ak
            // riding_type 是可选的，默认0普通骑行
          },
        }),
      );

      if (response.data.status !== 0) {
        this.logger.error(
          `Baidu Map API Error: ${response.data.message} (${response.data.status})`,
        );
        throw new Error(response.data.message);
      }

      return response.data.result;
    } catch (error) {
      this.logger.error('Failed to get riding route', error);
      throw error;
    }
  }

  /**
   * 圆形区域搜索 (查找补给点)
   * @param query 关键词
   * @param location 中心点 (lat,lng)
   * @param radius 半径 (米)
   */
  async searchPlace(query: string, location: string, radius: number = 1000) {
    try {
      const url = `${this.baseUrl}/place/v2/search`;
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            query,
            location,
            radius,
            output: 'json',
            ak: this.ak,
          },
        }),
      );

      if (response.data.status !== 0) {
        this.logger.error(
          `Baidu Map Place API Error: ${response.data.message} (${response.data.status})`,
        );
        throw new Error(response.data.message);
      }

      return response.data.results;
    } catch (error) {
      this.logger.error('Failed to search place', error);
      throw error;
    }
  }
}
