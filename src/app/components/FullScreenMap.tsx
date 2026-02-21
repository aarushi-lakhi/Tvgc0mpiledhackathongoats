import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Austin, TX coordinates
const CENTER: L.LatLngExpression = [30.3000, -97.7500];
const DEFAULT_ZOOM = 12;

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
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

/* ── helpers ─────────────────────────────────────────────── */

const riskColors: Record<string, { bg: string; border: string }> = {
  high:   { bg: '#dc2626', border: '#991b1b' },
  medium: { bg: '#f59e0b', border: '#b45309' },
  low:    { bg: '#10b981', border: '#047857' },
};

function createPinIcon(risk: 'high' | 'medium' | 'low') {
  const { bg, border } = riskColors[risk];
  const scale = risk === 'high' ? 1.2 : 1;
  const w = Math.round(32 * scale);
  const h = Math.round(42 * scale);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 32 42" fill="none">
    <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 42 16 42C16 42 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
          fill="${bg}" stroke="${border}" stroke-width="1"/>
    <circle cx="16" cy="16" r="6" fill="white"/>
    <circle cx="16" cy="16" r="3" fill="${bg}"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h],
  });
}

function buildPopupContent(marker: MapMarker): string {
  const dotColor =
    marker.risk === 'high' ? '#ef4444' :
    marker.risk === 'medium' ? '#f59e0b' : '#10b981';

  const scoreColor =
    marker.risk === 'high' ? '#dc2626' :
    marker.risk === 'medium' ? '#d97706' : '#059669';

  return `
    <div style="padding:2px 4px; max-width:200px; font-family:system-ui,sans-serif;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <span style="width:8px; height:8px; border-radius:50%; background:${dotColor}; display:inline-block;"></span>
        <strong style="color:#111827; font-size:13px;">${marker.id}</strong>
      </div>
      <p style="font-size:12px; color:#4b5563; margin:0 0 6px 0;">${marker.identifiedRisk}</p>
      <div style="font-size:12px; color:#6b7280; display:flex; justify-content:space-between;">
        <span>Score:</span>
        <span style="font-weight:700; color:${scoreColor};">${marker.vulnerabilityScore}</span>
      </div>
    </div>`;
}

/* ── main component ──────────────────────────────────────── */

export function FullScreenMap({
  markers,
  selectedMarker,
  onMarkerClick,
}: FullScreenMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const leafletMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  // Store the latest callback in a ref so marker click handlers always call the current one
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

  /* ── Initialize the map once ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add a small attribution in the corner
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      leafletMarkersRef.current.clear();
    };
  }, []);

  /* ── Sync markers ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const existingIds = new Set(leafletMarkersRef.current.keys());
    const incomingIds = new Set(markers.map((m) => m.id));

    // Remove markers that are no longer in the data
    existingIds.forEach((id) => {
      if (!incomingIds.has(id)) {
        const lm = leafletMarkersRef.current.get(id);
        lm?.remove();
        leafletMarkersRef.current.delete(id);
      }
    });

    // Add or update markers
    markers.forEach((marker) => {
      const existing = leafletMarkersRef.current.get(marker.id);

      if (existing) {
        // Update position & icon if needed
        existing.setLatLng([marker.lat, marker.lng]);
        existing.setIcon(createPinIcon(marker.risk));
        existing.getPopup()?.setContent(buildPopupContent(marker));
      } else {
        const lm = L.marker([marker.lat, marker.lng], {
          icon: createPinIcon(marker.risk),
        })
          .bindPopup(buildPopupContent(marker), {
            closeButton: true,
            className: 'leaflet-popup-custom',
          })
          .on('click', () => {
            onMarkerClickRef.current(marker);
          })
          .addTo(map);

        leafletMarkersRef.current.set(marker.id, lm);
      }
    });
  }, [markers]);

  /* ── Fly to selected marker ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedMarker) return;

    map.flyTo([selectedMarker.lat, selectedMarker.lng], map.getZoom(), {
      duration: 0.5,
    });

    // Open the popup for the selected marker
    const lm = leafletMarkersRef.current.get(selectedMarker.id);
    if (lm) {
      lm.openPopup();
    }
  }, [selectedMarker]);

  return (
    <div className="absolute inset-0">
      {/* Leaflet map container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.15)] p-4 pointer-events-none">
        <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">
          Risk Assessment
        </div>
        <div className="space-y-2.5 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="text-[12px] text-gray-700">
              Critical (High Risk)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[12px] text-gray-700">
              Warning (Medium)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[12px] text-gray-700">
              Stable (Low Risk)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}