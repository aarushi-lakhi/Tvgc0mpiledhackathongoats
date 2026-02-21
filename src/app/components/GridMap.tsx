import { useState } from 'react';
import { MapPin, AlertTriangle, ZoomIn, ZoomOut } from 'lucide-react';

interface MapMarker {
  id: string;
  x: number; // percentage position
  y: number; // percentage position
  risk: 'high' | 'medium' | 'low';
  vulnerabilityScore: number;
  identifiedRisk: string;
  gps: string;
}

const markers: MapMarker[] = [
  { id: 'AUS-001', x: 35, y: 45, risk: 'high', vulnerabilityScore: 87, identifiedRisk: 'Vegetation Encroachment', gps: '30.2672, -97.7431' },
  { id: 'AUS-002', x: 62, y: 28, risk: 'high', vulnerabilityScore: 92, identifiedRisk: 'Transformer Rust', gps: '30.2749, -97.7341' },
  { id: 'AUS-003', x: 28, y: 58, risk: 'medium', vulnerabilityScore: 64, identifiedRisk: 'Wire Fatigue', gps: '30.2655, -97.7525' },
  { id: 'AUS-004', x: 75, y: 22, risk: 'low', vulnerabilityScore: 28, identifiedRisk: 'None Detected', gps: '30.2800, -97.7400' },
  { id: 'AUS-005', x: 18, y: 65, risk: 'high', vulnerabilityScore: 78, identifiedRisk: 'Vegetation Encroachment', gps: '30.2600, -97.7500' },
  { id: 'AUS-006', x: 55, y: 38, risk: 'medium', vulnerabilityScore: 55, identifiedRisk: 'Pole Degradation', gps: '30.2720, -97.7380' },
  { id: 'AUS-007', x: 42, y: 52, risk: 'low', vulnerabilityScore: 32, identifiedRisk: 'None Detected', gps: '30.2690, -97.7460' },
  { id: 'AUS-008', x: 68, y: 32, risk: 'high', vulnerabilityScore: 85, identifiedRisk: 'Overloaded Circuit', gps: '30.2775, -97.7355' },
  { id: 'AUS-009', x: 25, y: 62, risk: 'medium', vulnerabilityScore: 58, identifiedRisk: 'Wire Fatigue', gps: '30.2625, -97.7490' },
  { id: 'AUS-010', x: 48, y: 48, risk: 'low', vulnerabilityScore: 25, identifiedRisk: 'None Detected', gps: '30.2710, -97.7420' },
];

const getMarkerColor = (risk: 'high' | 'medium' | 'low'): string => {
  switch (risk) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
  }
};

const getMarkerBorderColor = (risk: 'high' | 'medium' | 'low'): string => {
  switch (risk) {
    case 'high':
      return 'border-red-300';
    case 'medium':
      return 'border-yellow-300';
    case 'low':
      return 'border-green-300';
  }
};

export function GridMap() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom - 0.2, 0.8))}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 z-10 bg-white border border-gray-200 rounded-lg shadow-sm p-3">
        <div className="text-xs font-semibold text-gray-700 mb-2">Risk Levels</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">High Risk (70+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-600">Medium Risk (50-69)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">Low Risk (&lt;50)</span>
          </div>
        </div>
      </div>

      {/* Map Background with Grid */}
      <div className="h-full w-full bg-[#f0ede4] relative overflow-hidden">
        {/* Zoomed container */}
        <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
          
          {/* Colorado River - curved through the map */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <path
              d="M -50 200 Q 150 180, 300 220 T 650 240 L 650 270 Q 550 255, 300 250 T -50 230 Z"
              fill="#b8d4e8"
              opacity="0.6"
            />
            <path
              d="M -50 200 Q 150 180, 300 220 T 650 240"
              fill="none"
              stroke="#9cb8cc"
              strokeWidth="2"
              opacity="0.4"
            />
          </svg>

          {/* Lady Bird Lake / Town Lake */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <ellipse
              cx="50%"
              cy="55%"
              rx="25%"
              ry="8%"
              fill="#b8d4e8"
              opacity="0.5"
            />
          </svg>

          {/* Parks and green spaces */}
          <div className="absolute top-[12%] left-[15%] w-[12%] h-[15%] bg-green-200 opacity-30 rounded-lg" style={{ zIndex: 2 }}></div>
          <div className="absolute top-[60%] left-[40%] w-[18%] h-[20%] bg-green-200 opacity-30 rounded-lg" style={{ zIndex: 2 }}></div>
          <div className="absolute top-[25%] right-[10%] w-[15%] h-[12%] bg-green-200 opacity-30 rounded-lg" style={{ zIndex: 2 }}></div>

          {/* Major highways - I-35 (diagonal) */}
          <div 
            className="absolute top-0 bottom-0 w-3 bg-gray-400 opacity-50" 
            style={{ 
              left: '45%',
              transform: 'rotate(2deg)',
              transformOrigin: 'top center',
              zIndex: 3
            }}
          ></div>
          <div 
            className="absolute top-0 bottom-0 w-2.5 bg-yellow-100 opacity-40" 
            style={{ 
              left: 'calc(45% + 2px)',
              transform: 'rotate(2deg)',
              transformOrigin: 'top center',
              zIndex: 3
            }}
          ></div>

          {/* Highway 183 (diagonal northeast) */}
          <div 
            className="absolute left-0 right-0 h-2.5 bg-gray-400 opacity-40" 
            style={{ 
              top: '30%',
              transform: 'rotate(-8deg)',
              transformOrigin: 'left center',
              zIndex: 3
            }}
          ></div>

          {/* MoPac (Loop 1) - west side */}
          <div className="absolute top-0 bottom-0 left-[25%] w-2.5 bg-gray-400 opacity-40" style={{ zIndex: 3 }}></div>

          {/* Highway 71 (east-west) */}
          <div className="absolute left-0 right-0 top-[65%] h-2 bg-gray-400 opacity-40" style={{ zIndex: 3 }}></div>

          {/* Major streets - Lamar Blvd */}
          <div className="absolute top-0 bottom-0 left-[35%] w-1.5 bg-gray-300 opacity-35" style={{ zIndex: 4 }}></div>

          {/* Guadalupe / Lavaca (downtown) */}
          <div className="absolute top-0 bottom-0 left-[48%] w-1 bg-gray-300 opacity-35" style={{ zIndex: 4 }}></div>
          <div className="absolute top-0 bottom-0 left-[52%] w-1 bg-gray-300 opacity-35" style={{ zIndex: 4 }}></div>

          {/* Congress Avenue */}
          <div className="absolute top-0 bottom-0 left-[50%] w-1.5 bg-gray-300 opacity-40" style={{ zIndex: 4 }}></div>

          {/* East-west arterials */}
          <div className="absolute left-0 right-0 top-[20%] h-1 bg-gray-300 opacity-30" style={{ zIndex: 4 }}></div>
          <div className="absolute left-0 right-0 top-[38%] h-1 bg-gray-300 opacity-30" style={{ zIndex: 4 }}></div>
          <div className="absolute left-0 right-0 top-[48%] h-1.5 bg-gray-300 opacity-35" style={{ zIndex: 4 }}></div>
          <div className="absolute left-0 right-0 top-[75%] h-1 bg-gray-300 opacity-30" style={{ zIndex: 4 }}></div>
          <div className="absolute left-0 right-0 top-[85%] h-1 bg-gray-300 opacity-30" style={{ zIndex: 4 }}></div>

          {/* Urban grid - denser in downtown area */}
          <svg className="absolute inset-0 w-full h-full opacity-15" style={{ zIndex: 5 }}>
            <defs>
              <pattern id="downtown-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#666" strokeWidth="0.5"/>
              </pattern>
              <pattern id="sparse-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#999" strokeWidth="0.3"/>
              </pattern>
            </defs>
            {/* Downtown dense grid */}
            <rect x="40%" y="35%" width="25%" height="25%" fill="url(#downtown-grid)" />
            {/* Suburban sparse grid */}
            <rect width="100%" height="100%" fill="url(#sparse-grid)" />
          </svg>

          {/* Building blocks - downtown area */}
          {[
            { x: 42, y: 40, w: 3, h: 4 },
            { x: 46, y: 38, w: 4, h: 5 },
            { x: 51, y: 40, w: 3, h: 4 },
            { x: 55, y: 42, w: 4, h: 6 },
            { x: 48, y: 44, w: 2.5, h: 3 },
            { x: 52, y: 46, w: 3, h: 4 },
            { x: 44, y: 48, w: 3.5, h: 5 },
            { x: 56, y: 48, w: 2, h: 3 },
            { x: 47, y: 52, w: 4, h: 3 },
            { x: 53, y: 50, w: 3, h: 4 },
          ].map((block, i) => (
            <div
              key={`downtown-${i}`}
              className="absolute bg-gray-300 opacity-20 rounded-sm shadow-sm"
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.w}%`,
                height: `${block.h}%`,
                zIndex: 6,
              }}
            ></div>
          ))}

          {/* Residential blocks - scattered */}
          {[
            { x: 15, y: 18, w: 6, h: 5 },
            { x: 23, y: 15, w: 5, h: 4 },
            { x: 18, y: 25, w: 7, h: 6 },
            { x: 28, y: 22, w: 5, h: 5 },
            { x: 12, y: 35, w: 8, h: 6 },
            { x: 22, y: 38, w: 6, h: 5 },
            { x: 65, y: 25, w: 7, h: 5 },
            { x: 72, y: 22, w: 6, h: 6 },
            { x: 68, y: 32, w: 5, h: 4 },
            { x: 75, y: 35, w: 6, h: 5 },
            { x: 15, y: 68, w: 8, h: 6 },
            { x: 25, y: 70, w: 6, h: 5 },
            { x: 58, y: 72, w: 7, h: 6 },
            { x: 68, y: 68, w: 6, h: 5 },
          ].map((block, i) => (
            <div
              key={`residential-${i}`}
              className="absolute bg-gray-200 opacity-15 rounded"
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.w}%`,
                height: `${block.h}%`,
                zIndex: 6,
              }}
            ></div>
          ))}

          {/* Austin landmarks indicators */}
          {/* Capitol area */}
          <div className="absolute top-[42%] left-[49%] w-2 h-2 rounded-full bg-blue-400 opacity-40" style={{ zIndex: 7 }}></div>
          
          {/* UT Campus area */}
          <div className="absolute top-[35%] left-[47%] w-8 h-6 border-2 border-orange-300 opacity-25 rounded" style={{ zIndex: 7 }}></div>

          {/* Utility Markers */}
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${marker.x}%`, top: `${marker.y}%`, zIndex: 10 }}
              onClick={() => setSelectedMarker(marker)}
            >
              {/* Pulsing ring effect for high risk */}
              {marker.risk === 'high' && (
                <div className={`absolute inset-0 rounded-full ${getMarkerColor(marker.risk)} animate-ping opacity-75`}></div>
              )}
              
              {/* Marker */}
              <div
                className={`relative w-4 h-4 rounded-full ${getMarkerColor(marker.risk)} border-2 border-white shadow-lg transition-transform group-hover:scale-150 z-10`}
              ></div>

              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                  <div className="font-semibold">{marker.id}</div>
                  <div className="text-gray-300">Score: {marker.vulnerabilityScore}/100</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Marker Popup */}
        {selectedMarker && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-20 w-80">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-gray-900">{selectedMarker.id}</span>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">GPS Coordinates:</span>
                <span className="font-mono text-xs">{selectedMarker.gps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vulnerability Score:</span>
                <span className={`font-semibold ${
                  selectedMarker.risk === 'high' ? 'text-red-600' :
                  selectedMarker.risk === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>{selectedMarker.vulnerabilityScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Level:</span>
                <span className="font-medium capitalize">{selectedMarker.risk}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600 text-xs">Identified Risk:</span>
                <div className="font-medium text-sm mt-1">{selectedMarker.identifiedRisk}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}