import { useState, useMemo } from 'react';
import { FullScreenMap } from '../components/FullScreenMap';
import { MapSidebar } from '../components/MapSidebar';
import { ImageUploadModal } from '../components/ImageUploadModal';
import { AICopilotModal } from '../components/AICopilotModal';
import { FloatingHeader } from '../components/FloatingHeader';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  risk: 'high' | 'medium' | 'low';
  vulnerabilityScore: number;
  identifiedRisk: string;
  gps: string;
}

const RAW_MARKERS = [
  { id: 'AUS-001', risk: 'high', vulnerabilityScore: 87, identifiedRisk: 'Vegetation Encroachment', gps: '30.2672, -97.7431' },
  { id: 'AUS-002', risk: 'high', vulnerabilityScore: 92, identifiedRisk: 'Transformer Rust', gps: '30.2749, -97.7341' },
  { id: 'AUS-003', risk: 'medium', vulnerabilityScore: 64, identifiedRisk: 'Wire Fatigue', gps: '30.2655, -97.7525' },
  { id: 'AUS-004', risk: 'low', vulnerabilityScore: 28, identifiedRisk: 'None Detected', gps: '30.2800, -97.7400' },
  { id: 'AUS-005', risk: 'high', vulnerabilityScore: 78, identifiedRisk: 'Vegetation Encroachment', gps: '30.2600, -97.7500' },
  { id: 'AUS-006', risk: 'medium', vulnerabilityScore: 55, identifiedRisk: 'Pole Degradation', gps: '30.2720, -97.7380' },
  { id: 'AUS-007', risk: 'low', vulnerabilityScore: 32, identifiedRisk: 'None Detected', gps: '30.2690, -97.7460' },
  { id: 'AUS-008', risk: 'high', vulnerabilityScore: 85, identifiedRisk: 'Overloaded Circuit', gps: '30.2775, -97.7355' },
  { id: 'AUS-009', risk: 'medium', vulnerabilityScore: 58, identifiedRisk: 'Wire Fatigue', gps: '30.2625, -97.7490' },
  { id: 'AUS-010', risk: 'low', vulnerabilityScore: 25, identifiedRisk: 'None Detected', gps: '30.2710, -97.7420' },
] as const;

export function Dashboard() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);

  const markers: MapMarker[] = useMemo(() => {
    return RAW_MARKERS.map(m => {
      const [lat, lng] = m.gps.split(',').map(coord => parseFloat(coord.trim()));
      return {
        ...m,
        lat,
        lng,
        risk: m.risk as 'high' | 'medium' | 'low'
      };
    });
  }, []);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  const handleCloseSidebar = () => {
    setSelectedMarker(null);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-100">
      {/* Floating Header */}
      <FloatingHeader 
        onAICopilotOpen={() => setIsAICopilotOpen(true)}
        onUploadModalOpen={() => setIsUploadModalOpen(true)}
      />

      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <FullScreenMap
          markers={markers}
          selectedMarker={selectedMarker}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* Map Sidebar */}
      {selectedMarker && (
        <MapSidebar marker={selectedMarker} onClose={handleCloseSidebar} />
      )}

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* AI Copilot Modal */}
      <AICopilotModal
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
      />
    </div>
  );
}
