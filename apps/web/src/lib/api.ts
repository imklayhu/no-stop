export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface BaiduRouteStep {
  path: string; // "lng,lat;lng,lat"
  traffic_lights?: number;
  instruction?: string;
}

export interface BaiduRoute {
  steps: BaiduRouteStep[];
  distance: number;
  duration: number;
  originLocation: { lng: number; lat: number };
  destinationLocation: { lng: number; lat: number };
}

export interface BaiduResult {
  routes: BaiduRoute[];
  // other fields omitted
}

export interface RouteResponse {
  baiduResult: BaiduResult;
  scoreResult: {
    trafficLights: number;
    trafficCondition?: string;
    uTurns: number;
    sharpTurns: number;
    maxContinuousDist: number;
    totalDistance: number;
    score: number;
  } | null;
  error?: string;
}

export async function fetchRoute(origin: string, destination?: string, distance: number = 30): Promise<RouteResponse> {
  try {
    let url = `${API_URL}/test-route?origin=${origin}`;
    if (destination) {
      url += `&destination=${destination}`;
    } else {
      url += `&distance=${distance}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch route failed:', error);
    throw error;
  }
}
