import { X, MapPin, Clock, AlertTriangle, Send, FileText } from 'lucide-react';
import { VulnerabilityGauge } from './VulnerabilityGauge';
import { ImageWithFallback } from './figma/ImageWithFallback';
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

interface MapSidebarProps {
  marker: MapMarker | null;
  onClose: () => void;
}

export function MapSidebar({ marker, onClose }: MapSidebarProps) {
  const navigate = useNavigate();

  if (!marker) return null;

  return (
    <div className="absolute top-0 left-0 bottom-0 w-[480px] bg-white shadow-2xl z-30 flex flex-col animate-slide-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">Asset Details</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Asset ID */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="text-sm text-gray-600">Asset ID</div>
          <div className="text-xl font-bold text-gray-900">{marker.id}</div>
        </div>

        {/* Image */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-700 mb-3">Uploaded Image</div>
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1691039923133-2ce1a7da85c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1dGlsaXR5JTIwcG9sZSUyMHRyYW5zZm9ybWVyJTIwcG93ZXIlMjBsaW5lc3xlbnwxfHx8fDE3NzE2MzM1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Utility pole"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Vulnerability Score */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Vulnerability Score
            </h3>
          </div>
          <VulnerabilityGauge score={marker.vulnerabilityScore} />
        </div>

        {/* Location Details */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-gray-600">GPS Coordinates:</span>
                <span className="ml-2 font-mono text-gray-900">{marker.gps}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-gray-600">Last Scanned:</span>
                <span className="ml-2 font-medium text-gray-900">Feb 21, 2026 - 14:32 CST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="px-6 py-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            AI Analysis
          </h3>
          <div className={`border rounded-lg p-4 ${
            marker.risk === 'high' ? 'bg-red-50 border-red-200' :
            marker.risk === 'medium' ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex gap-3">
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                marker.risk === 'high' ? 'text-red-600' :
                marker.risk === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
              <div className="space-y-2 text-sm text-gray-900 leading-relaxed">
                <p>
                  <span className={`font-semibold ${
                    marker.risk === 'high' ? 'text-red-700' :
                    marker.risk === 'medium' ? 'text-yellow-700' :
                    'text-green-700'
                  }`}>
                    {marker.risk === 'high' ? 'Critical alert:' : 
                     marker.risk === 'medium' ? 'Warning:' : 'Normal:'}
                  </span> {marker.identifiedRisk}
                  {marker.risk === 'high' && ' detected. Immediate attention required to prevent potential service disruption or safety hazards.'}
                  {marker.risk === 'medium' && ' detected. Recommend scheduling maintenance within the next 30 days.'}
                  {marker.risk === 'low' && '. Asset is in good condition. Continue regular monitoring schedule.'}
                </p>
              </div>
            </div>
          </div>

          {/* Detected Objects */}
          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Detected Components
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Transformer</span>
                <span className="text-xs font-medium text-gray-500">Confidence: 98%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Power Lines</span>
                <span className="text-xs font-medium text-gray-500">Confidence: 99%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Support Pole</span>
                <span className="text-xs font-medium text-gray-500">Confidence: 97%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/inspection/${marker.id}`)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FileText className="w-5 h-5" />
            Full Inspection Report
          </button>
          {marker.risk === 'high' && (
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              <Send className="w-5 h-5" />
              Dispatch Crew
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
