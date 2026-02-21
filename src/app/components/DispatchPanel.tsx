import { Truck, X, Clock, Route, CheckCircle2 } from 'lucide-react';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  risk: 'high' | 'medium' | 'low';
  vulnerabilityScore: number;
  identifiedRisk: string;
  gps: string;
}

interface DispatchPanelProps {
  dispatchedMarkers: MapMarker[];
  routeDistance: number; // km
  routeDuration: number; // minutes (from OSRM)
  onClearAll: () => void;
  onRemoveMarker: (id: string) => void;
  onFocusMarker: (marker: MapMarker) => void;
}

export function DispatchPanel({
  dispatchedMarkers,
  routeDistance,
  routeDuration,
  onClearAll,
  onRemoveMarker,
  onFocusMarker,
}: DispatchPanelProps) {
  if (dispatchedMarkers.length === 0) return null;

  // OSRM gives driving time; add 15 min per stop for inspection
  const inspectionTimeMin = dispatchedMarkers.length * 15;
  const totalTimeMin = Math.round(routeDuration) + inspectionTimeMin;
  const hours = Math.floor(totalTimeMin / 60);
  const mins = totalTimeMin % 60;

  // Also show just driving time
  const driveHours = Math.floor(routeDuration / 60);
  const driveMins = Math.round(routeDuration % 60);

  return (
    <div className="absolute bottom-6 right-6 z-[1100] w-80 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Truck className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <div className="text-[13px] text-white">Crew Dispatch Active</div>
            <div className="text-[11px] text-blue-200">
              {dispatchedMarkers.length} stop{dispatchedMarkers.length !== 1 ? 's' : ''} queued
            </div>
          </div>
        </div>
        <button
          onClick={onClearAll}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          title="Clear all dispatches"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Route stats */}
      <div className="px-4 py-3 border-b border-gray-100 flex gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Route className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-[11px] text-gray-400">Distance</div>
            <div className="text-[14px] text-gray-900">{routeDistance.toFixed(1)} km</div>
          </div>
        </div>
        <div className="w-px bg-gray-100" />
        <div className="flex items-center gap-2 flex-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-[11px] text-gray-400">Est. Time</div>
            <div className="text-[14px] text-gray-900">
              {hours > 0 ? `${hours}h ` : ''}{mins}m
            </div>
          </div>
        </div>
      </div>

      {/* Stop list */}
      <div className="max-h-[200px] overflow-y-auto">
        {dispatchedMarkers.map((marker, index) => (
          <div
            key={marker.id}
            className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors group cursor-pointer border-b border-gray-50 last:border-0"
            onClick={() => onFocusMarker(marker)}
          >
            {/* Stop number */}
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-[11px] text-white">{index + 1}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-gray-900 truncate">{marker.id}</div>
              <div className="text-[11px] text-gray-500 truncate">{marker.identifiedRisk}</div>
            </div>

            {/* Score badge */}
            <div className="text-[11px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded shrink-0">
              {marker.vulnerabilityScore}
            </div>

            {/* Remove */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveMarker(marker.id);
              }}
              className="w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all shrink-0"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Road-optimized route · {driveHours > 0 ? `${driveHours}h ` : ''}{driveMins}m drive + {inspectionTimeMin}m inspection</span>
        </div>
      </div>
    </div>
  );
}