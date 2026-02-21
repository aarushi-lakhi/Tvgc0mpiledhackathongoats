import { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface MapMarker {
  id: string;
  x: number;
  y: number;
  risk: 'high' | 'medium' | 'low';
  vulnerabilityScore: number;
  identifiedRisk: string;
  gps: string;
}

interface FullScreenMapProps {
  markers: MapMarker[];
  selectedMarker: MapMarker | null;
  onMarkerClick: (marker: MapMarker) => void;
}

const getMarkerColor = (risk: 'high' | 'medium' | 'low'): string => {
  switch (risk) {
    case 'high':
      return '#dc2626'; // red-600
    case 'medium':
      return '#f59e0b'; // amber-500
    case 'low':
      return '#10b981'; // emerald-500
  }
};

export function FullScreenMap({ markers, selectedMarker, onMarkerClick }: FullScreenMapProps) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="absolute inset-0 bg-[#e5e3df]">
      {/* Map Controls */}
      <div className="absolute bottom-24 right-6 z-20 flex flex-col gap-2 bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
          className="p-3 hover:bg-gray-100 transition-colors border-b border-gray-200"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))}
          className="p-3 hover:bg-gray-100 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Map Scale */}
      <div className="absolute bottom-6 left-6 z-20 bg-white rounded px-3 py-2 shadow-lg text-xs font-medium text-gray-700">
        5 km
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {/* Water - Colorado River */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <path
              d="M -50 250 Q 200 220, 400 240 Q 600 260, 800 245 Q 1000 230, 1200 250"
              fill="none"
              stroke="#aad3df"
              strokeWidth="50"
              opacity="0.7"
            />
          </svg>

          {/* Lady Bird Lake */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <ellipse cx="50%" cy="52%" rx="22%" ry="6%" fill="#aad3df" opacity="0.6" />
          </svg>

          {/* Parks */}
          <div className="absolute top-[8%] left-[12%] w-[14%] h-[18%] bg-[#c8e6c9] opacity-70 rounded-xl" style={{ zIndex: 2 }}></div>
          <div className="absolute top-[58%] left-[35%] w-[20%] h-[22%] bg-[#c8e6c9] opacity-70 rounded-xl" style={{ zIndex: 2 }}></div>
          <div className="absolute top-[20%] right-[8%] w-[16%] h-[15%] bg-[#c8e6c9] opacity-70 rounded-xl" style={{ zIndex: 2 }}></div>

          {/* Major Highways */}
          {/* I-35 */}
          <div
            className="absolute top-0 bottom-0 w-4 bg-[#fbbf24] border-x-2 border-white"
            style={{
              left: '46%',
              transform: 'rotate(1.5deg)',
              transformOrigin: 'top center',
              zIndex: 5,
            }}
          ></div>

          {/* MoPac */}
          <div className="absolute top-0 bottom-0 left-[28%] w-3.5 bg-[#fbbf24] border-x-2 border-white" style={{ zIndex: 5 }}></div>

          {/* Highway 71 */}
          <div className="absolute left-0 right-0 top-[68%] h-3.5 bg-[#fbbf24] border-y-2 border-white" style={{ zIndex: 5 }}></div>

          {/* Highway 183 */}
          <div
            className="absolute left-0 right-0 h-3 bg-[#fbbf24] border-y-2 border-white"
            style={{
              top: '28%',
              transform: 'rotate(-6deg)',
              transformOrigin: 'left center',
              zIndex: 5,
            }}
          ></div>

          {/* Major Streets */}
          <div className="absolute top-0 bottom-0 left-[38%] w-2 bg-white" style={{ zIndex: 6 }}></div>
          <div className="absolute top-0 bottom-0 left-[50.5%] w-2 bg-white" style={{ zIndex: 6 }}></div>
          <div className="absolute left-0 right-0 top-[38%] h-2 bg-white" style={{ zIndex: 6 }}></div>
          <div className="absolute left-0 right-0 top-[45%] h-2 bg-white" style={{ zIndex: 6 }}></div>

          {/* Street Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{ zIndex: 7 }}>
            <defs>
              <pattern id="street-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#fff" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#street-grid)" />
          </svg>

          {/* Buildings - Downtown */}
          {[
            { x: 44, y: 38, w: 1.5, h: 2 },
            { x: 46, y: 36, w: 2, h: 2.5 },
            { x: 48, y: 39, w: 1.2, h: 1.8 },
            { x: 50, y: 37, w: 2.5, h: 3 },
            { x: 52.5, y: 40, w: 1.8, h: 2.2 },
            { x: 54.5, y: 38, w: 1.5, h: 2.5 },
            { x: 45, y: 42, w: 2, h: 2 },
            { x: 47.5, y: 43, w: 1.5, h: 1.5 },
            { x: 50, y: 42.5, w: 2, h: 2.5 },
            { x: 52.5, y: 43, w: 1.8, h: 2 },
            { x: 46, y: 45.5, w: 2.2, h: 2 },
            { x: 49, y: 46, w: 1.5, h: 1.8 },
            { x: 51, y: 46.5, w: 2, h: 2.2 },
            { x: 53.5, y: 46, w: 1.6, h: 1.9 },
          ].map((building, i) => (
            <div
              key={`building-${i}`}
              className="absolute bg-[#d1d1d1] shadow-sm"
              style={{
                left: `${building.x}%`,
                top: `${building.y}%`,
                width: `${building.w}%`,
                height: `${building.h}%`,
                zIndex: 8,
              }}
            ></div>
          ))}

          {/* Residential Areas */}
          {[
            { x: 10, y: 15, w: 8, h: 10 },
            { x: 20, y: 12, w: 7, h: 8 },
            { x: 15, y: 28, w: 10, h: 12 },
            { x: 8, y: 42, w: 9, h: 10 },
            { x: 65, y: 18, w: 10, h: 12 },
            { x: 75, y: 22, w: 8, h: 9 },
            { x: 70, y: 35, w: 9, h: 10 },
            { x: 12, y: 72, w: 11, h: 10 },
            { x: 58, y: 75, w: 10, h: 9 },
            { x: 72, y: 70, w: 8, h: 11 },
          ].map((area, i) => (
            <div
              key={`residential-${i}`}
              className="absolute bg-[#f0ece0] opacity-60"
              style={{
                left: `${area.x}%`,
                top: `${area.y}%`,
                width: `${area.w}%`,
                height: `${area.h}%`,
                zIndex: 3,
              }}
            ></div>
          ))}

          {/* Street Labels */}
          <div className="absolute top-[45%] left-[50.5%] text-xs font-medium text-gray-600 pointer-events-none transform -translate-y-1/2 bg-white/80 px-1 rounded" style={{ zIndex: 15 }}>
            Congress Ave
          </div>
          <div className="absolute top-[38%] left-[38%] text-xs font-medium text-gray-600 pointer-events-none transform -translate-y-1/2 bg-white/80 px-1 rounded" style={{ zIndex: 15 }}>
            Lamar Blvd
          </div>

          {/* Utility Markers */}
          {markers.map((marker) => {
            const isSelected = selectedMarker?.id === marker.id;
            return (
              <div
                key={marker.id}
                className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
                style={{ left: `${marker.x}%`, top: `${marker.y}%`, zIndex: isSelected ? 25 : 20 }}
                onClick={() => onMarkerClick(marker)}
              >
                {/* Pin shadow */}
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-1.5 rounded-full bg-black/20 blur-sm"
                  style={{ marginTop: '2px' }}
                ></div>

                {/* Pin body */}
                <div
                  className={`relative transition-all duration-200 ${
                    isSelected ? 'scale-125' : 'scale-100 group-hover:scale-110'
                  }`}
                >
                  {/* Pin drop shape */}
                  <svg width="32" height="42" viewBox="0 0 32 42" fill="none" className="drop-shadow-lg">
                    <path
                      d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 42 16 42C16 42 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
                      fill={getMarkerColor(marker.risk)}
                    />
                    <circle cx="16" cy="16" r="6" fill="white" />
                    <circle cx="16" cy="16" r="3" fill={getMarkerColor(marker.risk)} />
                  </svg>

                  {/* Pulse effect for high risk */}
                  {marker.risk === 'high' && !isSelected && (
                    <div
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full animate-ping"
                      style={{ backgroundColor: getMarkerColor(marker.risk), opacity: 0.4 }}
                    ></div>
                  )}
                </div>

                {/* Hover label */}
                {!isSelected && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-xl">
                      {marker.id}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
