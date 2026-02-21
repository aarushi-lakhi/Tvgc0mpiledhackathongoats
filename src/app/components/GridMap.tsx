import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle } from 'lucide-react';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  risk: 'high' | 'medium' | 'low';
  vulnerabilityScore: number;
  identifiedRisk: string;
}

const markers: MapMarker[] = [
  { id: 'AUS-001', lat: 30.2672, lng: -97.7431, risk: 'high', vulnerabilityScore: 87, identifiedRisk: 'Vegetation Encroachment' },
  { id: 'AUS-002', lat: 30.2749, lng: -97.7341, risk: 'high', vulnerabilityScore: 92, identifiedRisk: 'Transformer Rust' },
  { id: 'AUS-003', lat: 30.2655, lng: -97.7525, risk: 'medium', vulnerabilityScore: 64, identifiedRisk: 'Wire Fatigue' },
  { id: 'AUS-004', lat: 30.2800, lng: -97.7400, risk: 'low', vulnerabilityScore: 28, identifiedRisk: 'None Detected' },
  { id: 'AUS-005', lat: 30.2600, lng: -97.7500, risk: 'high', vulnerabilityScore: 78, identifiedRisk: 'Vegetation Encroachment' },
  { id: 'AUS-006', lat: 30.2720, lng: -97.7380, risk: 'medium', vulnerabilityScore: 55, identifiedRisk: 'Pole Degradation' },
  { id: 'AUS-007', lat: 30.2690, lng: -97.7460, risk: 'low', vulnerabilityScore: 32, identifiedRisk: 'None Detected' },
  { id: 'AUS-008', lat: 30.2775, lng: -97.7355, risk: 'high', vulnerabilityScore: 85, identifiedRisk: 'Overloaded Circuit' },
  { id: 'AUS-009', lat: 30.2625, lng: -97.7490, risk: 'medium', vulnerabilityScore: 58, identifiedRisk: 'Wire Fatigue' },
  { id: 'AUS-010', lat: 30.2710, lng: -97.7420, risk: 'low', vulnerabilityScore: 25, identifiedRisk: 'None Detected' },
];

const getMarkerColor = (risk: 'high' | 'medium' | 'low'): string => {
  switch (risk) {
    case 'high':
      return '#ef4444'; // red
    case 'medium':
      return '#eab308'; // yellow
    case 'low':
      return '#22c55e'; // green
  }
};

export function GridMap() {
  useEffect(() => {
    // Fix for default marker icon issue with webpack
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '',
      iconUrl: '',
      shadowUrl: '',
    });
  }, []);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={[30.2672, -97.7431]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.lng]}
            radius={12}
            fillColor={getMarkerColor(marker.risk)}
            color="#fff"
            weight={2}
            opacity={1}
            fillOpacity={0.8}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold">{marker.id}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vulnerability:</span>
                    <span className="font-medium">{marker.vulnerabilityScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk:</span>
                    <span className="font-medium capitalize">{marker.risk}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-600 text-xs">Issue:</span>
                    <div className="font-medium text-xs mt-1">{marker.identifiedRisk}</div>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

// Global L declaration for TypeScript
declare global {
  const L: any;
}
