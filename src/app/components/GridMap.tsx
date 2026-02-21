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
      <div className="h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
        {/* Grid lines to simulate map */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Simulated city streets/blocks */}
        <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
          {/* Main roads */}
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-300 opacity-40"></div>
          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-400 opacity-50"></div>
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-300 opacity-40"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-300 opacity-40"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-gray-400 opacity-50"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-300 opacity-40"></div>

          {/* City blocks */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gray-200 opacity-10 rounded"
              style={{
                left: `${(i * 17 + 10) % 85}%`,
                top: `${(i * 23 + 15) % 80}%`,
                width: `${8 + (i % 3) * 2}%`,
                height: `${6 + (i % 4) * 2}%`,
              }}
            ></div>
          ))}

          {/* Utility Markers */}
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
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