import { useEffect, useRef } from "react";
import { RouteResponse } from "@/lib/api";

interface MapContainerProps {
  routeData: RouteResponse;
}

export default function MapContainer({ routeData }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.BMapGL) return;

    // Initialize Map
    const map = new window.BMapGL.Map(mapRef.current);
    mapInstance.current = map;
    
    // Enable scroll wheel zoom
    map.enableScrollWheelZoom(true);
    
    // Set theme (optional dark mode style)
    // map.setMapStyleV2({     
    //   styleId: 'YOUR_STYLE_ID_IF_ANY' // Use default for MVP or customize later
    // });

    // Parse route path
    if (routeData.baiduResult?.routes?.[0]?.steps) {
      const steps = routeData.baiduResult.routes[0].steps;
      const points: any[] = [];

      steps.forEach((step) => {
        if (!step.path) return;
        const pairs = step.path.split(';');
        pairs.forEach((pair) => {
          const [lng, lat] = pair.split(',').map(Number);
          if (!isNaN(lng) && !isNaN(lat)) {
            points.push(new window.BMapGL.Point(lng, lat));
          }
        });
      });

      if (points.length > 0) {
        // Draw Polyline
        // Use Brand Green (#10B981) for better contrast against map background (which is yellowish/orange for roads)
        const polyline = new window.BMapGL.Polyline(points, {
          strokeColor: "#10B981", 
          strokeWeight: 8, // Thicker for visibility
          strokeOpacity: 0.9,
        });
        map.addOverlay(polyline);
        
        // Start Marker (Greenish)
        const startMarker = new window.BMapGL.Marker(points[0]);
        map.addOverlay(startMarker);

        // End Marker (Reddish)
        const endMarker = new window.BMapGL.Marker(points[points.length - 1]);
        map.addOverlay(endMarker);

        // Auto Viewport
        map.setViewport(points);
      } else {
        // Default center if no path
        const center = new window.BMapGL.Point(116.404, 39.915);
        map.centerAndZoom(center, 12);
      }
    }

    return () => {
      map.destroy();
    };
  }, [routeData]);

  return <div ref={mapRef} className="w-full h-full" />;
}
