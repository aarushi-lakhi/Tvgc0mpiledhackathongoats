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
  // === Downtown & Central ===
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

  // === East Austin ===
  { id: 'AUS-011', risk: 'high', vulnerabilityScore: 91, identifiedRisk: 'Transformer Overheating', gps: '30.2630, -97.7180' },
  { id: 'AUS-012', risk: 'medium', vulnerabilityScore: 62, identifiedRisk: 'Insulator Cracking', gps: '30.2580, -97.7120' },
  { id: 'AUS-013', risk: 'high', vulnerabilityScore: 83, identifiedRisk: 'Underground Cable Fault', gps: '30.2700, -97.7100' },
  { id: 'AUS-014', risk: 'low', vulnerabilityScore: 19, identifiedRisk: 'None Detected', gps: '30.2650, -97.7250' },
  { id: 'AUS-015', risk: 'medium', vulnerabilityScore: 51, identifiedRisk: 'Capacitor Bank Failure', gps: '30.2710, -97.7150' },

  // === South Austin / South Congress ===
  { id: 'AUS-016', risk: 'high', vulnerabilityScore: 88, identifiedRisk: 'Substation Flooding Risk', gps: '30.2450, -97.7530' },
  { id: 'AUS-017', risk: 'medium', vulnerabilityScore: 67, identifiedRisk: 'Pole Degradation', gps: '30.2380, -97.7470' },
  { id: 'AUS-018', risk: 'low', vulnerabilityScore: 22, identifiedRisk: 'None Detected', gps: '30.2500, -97.7600' },
  { id: 'AUS-019', risk: 'high', vulnerabilityScore: 79, identifiedRisk: 'Vegetation Encroachment', gps: '30.2420, -97.7650' },
  { id: 'AUS-020', risk: 'medium', vulnerabilityScore: 59, identifiedRisk: 'Conductor Sag', gps: '30.2350, -97.7580' },

  // === Zilker / Barton Springs ===
  { id: 'AUS-021', risk: 'medium', vulnerabilityScore: 53, identifiedRisk: 'Wire Fatigue', gps: '30.2640, -97.7700' },
  { id: 'AUS-022', risk: 'low', vulnerabilityScore: 30, identifiedRisk: 'Minor Corrosion', gps: '30.2670, -97.7750' },
  { id: 'AUS-023', risk: 'high', vulnerabilityScore: 81, identifiedRisk: 'Tree Limb Contact', gps: '30.2580, -97.7800' },

  // === North Austin / Mueller ===
  { id: 'AUS-024', risk: 'low', vulnerabilityScore: 15, identifiedRisk: 'None Detected', gps: '30.2980, -97.7060' },
  { id: 'AUS-025', risk: 'medium', vulnerabilityScore: 48, identifiedRisk: 'Recloser Malfunction', gps: '30.3020, -97.7120' },
  { id: 'AUS-026', risk: 'high', vulnerabilityScore: 90, identifiedRisk: 'Transformer Overloading', gps: '30.3100, -97.7200' },
  { id: 'AUS-027', risk: 'low', vulnerabilityScore: 21, identifiedRisk: 'None Detected', gps: '30.2950, -97.7250' },

  // === The Domain / North Central ===
  { id: 'AUS-028', risk: 'medium', vulnerabilityScore: 57, identifiedRisk: 'Switch Gear Wear', gps: '30.3950, -97.7250' },
  { id: 'AUS-029', risk: 'high', vulnerabilityScore: 86, identifiedRisk: 'Feeder Line Degradation', gps: '30.3900, -97.7350' },
  { id: 'AUS-030', risk: 'low', vulnerabilityScore: 27, identifiedRisk: 'None Detected', gps: '30.4000, -97.7180' },
  { id: 'AUS-031', risk: 'medium', vulnerabilityScore: 61, identifiedRisk: 'Capacitor Bank Failure', gps: '30.3850, -97.7420' },

  // === UT Campus / Hyde Park ===
  { id: 'AUS-032', risk: 'medium', vulnerabilityScore: 54, identifiedRisk: 'Conductor Sag', gps: '30.2850, -97.7350' },
  { id: 'AUS-033', risk: 'low', vulnerabilityScore: 18, identifiedRisk: 'None Detected', gps: '30.2920, -97.7380' },
  { id: 'AUS-034', risk: 'high', vulnerabilityScore: 76, identifiedRisk: 'Aging Infrastructure', gps: '30.2880, -97.7280' },

  // === West Lake Hills / Westlake ===
  { id: 'AUS-035', risk: 'high', vulnerabilityScore: 84, identifiedRisk: 'Vegetation Encroachment', gps: '30.2930, -97.7950' },
  { id: 'AUS-036', risk: 'medium', vulnerabilityScore: 63, identifiedRisk: 'Pole Lean Detected', gps: '30.2870, -97.8050' },
  { id: 'AUS-037', risk: 'low', vulnerabilityScore: 24, identifiedRisk: 'Minor Corrosion', gps: '30.2750, -97.8100' },

  // === South Lamar / Bouldin Creek ===
  { id: 'AUS-038', risk: 'high', vulnerabilityScore: 89, identifiedRisk: 'Overloaded Circuit', gps: '30.2520, -97.7620' },
  { id: 'AUS-039', risk: 'medium', vulnerabilityScore: 52, identifiedRisk: 'Insulator Cracking', gps: '30.2480, -97.7700' },
  { id: 'AUS-040', risk: 'low', vulnerabilityScore: 31, identifiedRisk: 'None Detected', gps: '30.2550, -97.7550' },

  // === Southeast Austin / Riverside ===
  { id: 'AUS-041', risk: 'high', vulnerabilityScore: 93, identifiedRisk: 'Underground Cable Fault', gps: '30.2400, -97.7250' },
  { id: 'AUS-042', risk: 'medium', vulnerabilityScore: 66, identifiedRisk: 'Switch Gear Wear', gps: '30.2350, -97.7350' },
  { id: 'AUS-043', risk: 'low', vulnerabilityScore: 20, identifiedRisk: 'None Detected', gps: '30.2450, -97.7150' },
  { id: 'AUS-044', risk: 'high', vulnerabilityScore: 82, identifiedRisk: 'Transformer Rust', gps: '30.2300, -97.7200' },

  // === Far North / Round Rock edge ===
  { id: 'AUS-045', risk: 'medium', vulnerabilityScore: 56, identifiedRisk: 'Wire Fatigue', gps: '30.4200, -97.7000' },
  { id: 'AUS-046', risk: 'high', vulnerabilityScore: 80, identifiedRisk: 'Feeder Line Degradation', gps: '30.4350, -97.7100' },
  { id: 'AUS-047', risk: 'low', vulnerabilityScore: 16, identifiedRisk: 'None Detected', gps: '30.4250, -97.7250' },

  // === Southwest Austin / Oak Hill ===
  { id: 'AUS-048', risk: 'high', vulnerabilityScore: 77, identifiedRisk: 'Tree Limb Contact', gps: '30.2350, -97.8500' },
  { id: 'AUS-049', risk: 'medium', vulnerabilityScore: 60, identifiedRisk: 'Pole Degradation', gps: '30.2420, -97.8400' },
  { id: 'AUS-050', risk: 'low', vulnerabilityScore: 29, identifiedRisk: 'None Detected', gps: '30.2500, -97.8300' },
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