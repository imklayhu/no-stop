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
   * @param origin 起点坐标 (lat,lng)
   * @param distanceKm 目标总距离 (km)
   */
  async generateCircuitRoute(origin: string, distanceKm: number = 30) {
    // 1. 计算折返点坐标
    // 简单算法：在随机方向或固定方向上，距离 D/2 处找一点
    // 百度坐标系假设近似为平面或简单球面，经纬度转换需注意
    // 1度纬度 ≈ 111km，1度经度 ≈ 111km * cos(lat)
    
    const [latStr, lngStr] = origin.split(',');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    
    const halfDistKm = distanceKm / 2;
    
    // 随机方位角 (0-360)
    // 为了MVP稳定性，暂时固定向北或东北，避免算到海里或非法区域（后续需结合地图边界检查）
    // 或者随机生成几个方向尝试
    const bearing = Math.random() * 360; 
    
    // 计算目标点坐标 (简易 Haversine 逆向)
    const R = 6371; // 地球半径 km
    const d = halfDistKm;
    
    const lat1 = lat * Math.PI / 180;
    const lng1 = lng * Math.PI / 180;
    const brng = bearing * Math.PI / 180;

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d/R) + Math.cos(lat1) * Math.sin(d/R) * Math.cos(brng));
    const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(d/R) * Math.cos(lat1), Math.cos(d/R) - Math.sin(lat1) * Math.sin(lat2));

    const destLat = lat2 * 180 / Math.PI;
    const destLng = lng2 * 180 / Math.PI;
    const destStr = `${destLat.toFixed(6)},${destLng.toFixed(6)}`;

    this.logger.log(`Generating circuit: ${origin} -> ${destStr} -> ${origin} (Approx ${distanceKm}km)`);

    // 2. 分别规划 A->B 和 B->A
    const [routeAB, routeBA] = await Promise.all([
      this.getRidingRoute(origin, destStr),
      this.getRidingRoute(destStr, origin)
    ]);

    // 3. 合并路线数据
    // 百度 API result 结构: { routes: [ { distance: number, duration: number, steps: [] } ] }
    if (!routeAB?.routes?.[0] || !routeBA?.routes?.[0]) {
      throw new Error('Failed to plan circuit route segment');
    }

    const leg1 = routeAB.routes[0];
    const leg2 = routeBA.routes[0];

    // 合并 steps
    // 注意：B->A 的起点 B 可能与 A->B 的终点 B 坐标微小差异，直接拼接 steps 即可
    const mergedSteps = [...(leg1.steps || []), ...(leg2.steps || [])];
    const totalDistance = leg1.distance + leg2.distance;
    const totalDuration = leg1.duration + leg2.duration;

    // 4. 获取路况评估 (通过驾车API辅助)
    const trafficCondition = await this.getTrafficStatus(origin, destStr);

    return {
      routes: [{
        distance: totalDistance,
        duration: totalDuration,
        steps: mergedSteps,
        originLocation: routeAB.origin,
        destinationLocation: routeBA.destination, // 应该是 A
        trafficCondition // 添加路况字段
      }]
    };
  }

  /**
   * 获取路况状态 (通过驾车API获取拥堵评估)
   * @param origin 起点
   * @param destination 终点
   */
  async getTrafficStatus(origin: string, destination: string): Promise<string> {
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
        this.logger.warn('Failed to fetch driving traffic data, using default');
        return '未知';
      }

      // 简单评估：根据拥堵距离或标签判断
      // 真实API返回的 traffic_condition 可能是一个数组，包含 geo_cnt 和 status (0:未知, 1:畅通, 2:缓行, 3:拥堵, 4:严重拥堵)
      // 这里做简化处理：如果包含 status >= 3 的路段超过一定比例，则认为拥堵
      
      // 注意：具体字段需参照百度文档，这里假设一种常见的结构或仅使用 duration 对比
      // 如果没有 traffic_condition 字段，可以对比 duration 和 distance (假设平均车速)
      
      const route = data.result.routes[0];
      // 假设：如果平均车速 < 20km/h (5.5m/s) 且距离 > 1km，认为拥堵 (城市路况)
      const speed = route.distance / route.duration; // m/s
      
      if (speed < 5.5) {
        return '拥堵';
      } else if (speed < 8.3) { // < 30km/h
        return '缓行';
      } else {
        return '畅通';
      }
    } catch (error: any) {
      this.logger.error(`Error fetching traffic status: ${error.message}`);
      return '未知';
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
