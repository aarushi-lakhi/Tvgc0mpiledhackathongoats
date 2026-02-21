import { Zap, User, Upload, Sparkles, List } from 'lucide-react';
import { useState } from 'react';
import { FullScreenMap } from '../components/FullScreenMap';
import { MapSidebar } from '../components/MapSidebar';
import { ImageUploadModal } from '../components/ImageUploadModal';
import { AICopilotModal } from '../components/AICopilotModal';
import { useNavigate } from 'react-router';

interface MapMarker {
  id: string;
  x: number;
  y: number;
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

export function Dashboard() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const navigate = useNavigate();

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  const handleCloseSidebar = () => {
    setSelectedMarker(null);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col relative">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm relative z-40">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Micro-GridAware</h1>
                <p className="text-xs text-gray-500">Austin Energy Grid Monitor</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAICopilotOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                AI Advisor
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload Images
              </button>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Sarah Martinez</div>
                <div className="text-xs text-gray-500">Grid Operations Manager</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Full Screen Map */}
      <div className="flex-1 relative">
        <FullScreenMap
          markers={markers}
          selectedMarker={selectedMarker}
          onMarkerClick={handleMarkerClick}
        />

        {/* Map Sidebar */}
        <MapSidebar marker={selectedMarker} onClose={handleCloseSidebar} />

        {/* Legend */}
        <div className="absolute top-4 left-6 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="text-xs font-semibold text-gray-700 mb-2">Risk Levels</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-xs text-gray-600">High Risk (70+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-600">Medium (50-69)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-gray-600">Low (&lt;50)</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="absolute top-4 right-6 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-xs font-semibold text-gray-700 mb-3">Grid Status</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-6">
              <span className="text-xs text-gray-600">High Risk</span>
              <span className="text-sm font-bold text-red-600">
                {markers.filter((m) => m.risk === 'high').length}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-xs text-gray-600">Medium Risk</span>
              <span className="text-sm font-bold text-amber-600">
                {markers.filter((m) => m.risk === 'medium').length}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-xs text-gray-600">Low Risk</span>
              <span className="text-sm font-bold text-emerald-600">
                {markers.filter((m) => m.risk === 'low').length}
              </span>
            </div>
          </div>
        </div>
      </div>

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