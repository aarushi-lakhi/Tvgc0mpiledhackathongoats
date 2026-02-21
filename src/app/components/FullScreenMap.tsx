import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Austin, TX coordinates
const CENTER: L.LatLngExpression = [30.3000, -97.7500];
const DEFAULT_ZOOM = 12;

// Austin Energy HQ (depot for route start)
const DEPOT: L.LatLngExpression = [30.2650, -97.7386];

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
  dispatchedMarkerIds?: Set<string>;
  onRouteInfo?: (info: { distanceKm: number; durationMin: number }) => void;
}

/* ── helpers ─────────────────────────────────────────────── */

const riskColors: Record<string, { bg: string; border: string }> = {
  high:   { bg: '#dc2626', border: '#991b1b' },
  medium: { bg: '#f59e0b', border: '#b45309' },
  low:    { bg: '#10b981', border: '#047857' },
};

function createPinIcon(risk: 'high' | 'medium' | 'low', dispatched = false) {
  const { bg, border } = riskColors[risk];
  const scale = risk === 'high' ? 1.2 : 1;
  const w = Math.round(32 * scale);
  const h = Math.round(42 * scale);

  const pulseRing = dispatched
    ? `<style>
        @keyframes dispatch-pulse {
          0% { r: 18; opacity: 0.6; }
          100% { r: 28; opacity: 0; }
        }
        .dispatch-ring { animation: dispatch-pulse 1.5s ease-out infinite; }
      </style>
      <circle cx="16" cy="16" r="18" fill="none" stroke="#2563eb" stroke-width="2" class="dispatch-ring"/>
      <circle cx="16" cy="16" r="15" fill="none" stroke="#2563eb" stroke-width="1.5" opacity="0.3"/>`
    : '';

  const truckOverlay = dispatched
    ? `<circle cx="24" cy="6" r="6" fill="#2563eb" stroke="white" stroke-width="1.5"/>
       <path d="M21.5 5 L23 5 L23 7 L24.5 7 L24.5 5.5 L25.5 6.5 L25.5 7 L26.5 7 L26.5 5 L25 5 L25 4.5 L22 4.5 L22 7 L21.5 7 Z" fill="white"/>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w + (dispatched ? 12 : 0)}" height="${h + (dispatched ? 4 : 0)}" viewBox="${dispatched ? '-6 -4' : '0 0'} ${32 + (dispatched ? 12 : 0)} ${42 + (dispatched ? 4 : 0)}" fill="none">
    ${pulseRing}
    <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 42 16 42C16 42 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
          fill="${bg}" stroke="${dispatched ? '#2563eb' : border}" stroke-width="${dispatched ? 2 : 1}"/>
    <circle cx="16" cy="16" r="6" fill="white"/>
    <circle cx="16" cy="16" r="3" fill="${bg}"/>
    ${truckOverlay}
  </svg>`;

  const extraW = dispatched ? 12 : 0;
  const extraH = dispatched ? 4 : 0;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [w + extraW, h + extraH],
    iconAnchor: [(w + extraW) / 2, h + extraH],
    popupAnchor: [0, -(h + extraH)],
  });
}

function createDepotIcon(): L.DivIcon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="16" fill="#1a73e8" stroke="white" stroke-width="3"/>
    <circle cx="18" cy="18" r="12" fill="white" opacity="0.2"/>
    <text x="18" y="22" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="system-ui">HQ</text>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function buildPopupContent(marker: MapMarker, dispatched = false): string {
  const dotColor =
    marker.risk === 'high' ? '#ef4444' :
    marker.risk === 'medium' ? '#f59e0b' : '#10b981';

  const scoreColor =
    marker.risk === 'high' ? '#dc2626' :
    marker.risk === 'medium' ? '#d97706' : '#059669';

  const dispatchBadge = dispatched
    ? `<div style="display:flex;align-items:center;gap:4px;margin-top:6px;padding:3px 8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;">
        <span style="font-size:11px;color:#1d4ed8;font-weight:600;">Crew Dispatched</span>
       </div>`
    : '';

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
      ${dispatchBadge}
    </div>`;
}

/** Haversine distance in km */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Nearest-neighbor TSP from depot through all points, returns ordered indices + total distance */
export function optimizeRoute(
  depot: [number, number],
  points: { lat: number; lng: number }[]
): { order: number[]; totalKm: number } {
  if (points.length === 0) return { order: [], totalKm: 0 };

  const n = points.length;
  const visited = new Array(n).fill(false);
  const order: number[] = [];
  let totalKm = 0;
  let curLat = depot[0];
  let curLng = depot[1];

  for (let step = 0; step < n; step++) {
    let bestIdx = -1;
    let bestDist = Infinity;
    for (let i = 0; i < n; i++) {
      if (visited[i]) continue;
      const d = haversineKm(curLat, curLng, points[i].lat, points[i].lng);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    visited[bestIdx] = true;
    order.push(bestIdx);
    totalKm += bestDist;
    curLat = points[bestIdx].lat;
    curLng = points[bestIdx].lng;
  }

  return { order, totalKm };
}

/* ── OSRM road-following route ─────────────────────────── */

interface OSRMRouteResult {
  coordinates: [number, number][]; // [lat, lng]
  distanceKm: number;
  durationMin: number;
}

/**
 * Calls the free OSRM public routing API to get a real road-following route.
 * Falls back to straight lines on error.
 */
async function fetchOSRMRoute(
  waypoints: { lat: number; lng: number }[]
): Promise<OSRMRouteResult | null> {
  if (waypoints.length < 2) return null;

  // OSRM format: lng,lat;lng,lat;...
  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) return null;

    const route = data.routes[0];
    // GeoJSON coordinates are [lng, lat] — flip to [lat, lng] for Leaflet
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]] as [number, number]
    );

    return {
      coordinates,
      distanceKm: route.distance / 1000,
      durationMin: route.duration / 60,
    };
  } catch {
    return null;
  }
}

/* ── main component ──────────────────────────────────────── */

export function FullScreenMap({
  markers,
  selectedMarker,
  onMarkerClick,
  dispatchedMarkerIds = new Set(),
  onRouteInfo,
}: FullScreenMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const leafletMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const depotMarkerRef = useRef<L.Marker | null>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;
  const onRouteInfoRef = useRef(onRouteInfo);
  onRouteInfoRef.current = onRouteInfo;
  const routeRequestIdRef = useRef(0);
  const isAliveRef = useRef(true);

  /* ── Initialize the map once ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    isAliveRef.current = true;

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

    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    routeLayerRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    return () => {
      isAliveRef.current = false;
      routeRequestIdRef.current++;
      map.remove();
      mapRef.current = null;
      leafletMarkersRef.current.clear();
      routeLayerRef.current = null;
      depotMarkerRef.current = null;
    };
  }, []);

  /* ── Sync markers ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const existingIds = new Set(leafletMarkersRef.current.keys());
    const incomingIds = new Set(markers.map((m) => m.id));

    existingIds.forEach((id) => {
      if (!incomingIds.has(id)) {
        const lm = leafletMarkersRef.current.get(id);
        lm?.remove();
        leafletMarkersRef.current.delete(id);
      }
    });

    markers.forEach((marker) => {
      const isDispatched = dispatchedMarkerIds.has(marker.id);
      const existing = leafletMarkersRef.current.get(marker.id);

      if (existing) {
        existing.setLatLng([marker.lat, marker.lng]);
        existing.setIcon(createPinIcon(marker.risk, isDispatched));
        existing.getPopup()?.setContent(buildPopupContent(marker, isDispatched));
      } else {
        const lm = L.marker([marker.lat, marker.lng], {
          icon: createPinIcon(marker.risk, isDispatched),
        })
          .bindPopup(buildPopupContent(marker, isDispatched), {
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
  }, [markers, dispatchedMarkerIds]);

  /* ── Helper to draw route layers ── */
  const drawRoute = useCallback(
    (
      routeCoords: L.LatLngExpression[],
      orderedMarkers: MapMarker[],
      map: L.Map,
      routeLayer: L.LayerGroup
    ) => {
      // Guard: bail if map was destroyed
      if (!isAliveRef.current || !mapRef.current) return;

      // Glow line underneath
      routeLayer.addLayer(
        L.polyline(routeCoords, {
          color: '#2563eb',
          weight: 12,
          opacity: 0.12,
          smoothFactor: 1,
          lineJoin: 'round',
          lineCap: 'round',
        })
      );

      // Main solid route line
      routeLayer.addLayer(
        L.polyline(routeCoords, {
          color: '#2563eb',
          weight: 5,
          opacity: 0.85,
          smoothFactor: 1,
          lineJoin: 'round',
          lineCap: 'round',
        })
      );

      // Animated dashed overlay
      routeLayer.addLayer(
        L.polyline(routeCoords, {
          color: '#93c5fd',
          weight: 5,
          opacity: 0.5,
          dashArray: '10, 14',
          smoothFactor: 1,
          lineJoin: 'round',
          lineCap: 'round',
        })
      );

      // Stop number labels
      orderedMarkers.forEach((marker, index) => {
        const stopLabel = L.divIcon({
          html: `<div style="
            width:22px;height:22px;border-radius:50%;
            background:#2563eb;color:white;
            display:flex;align-items:center;justify-content:center;
            font-size:11px;font-weight:700;font-family:system-ui;
            border:2px solid white;
            box-shadow:0 1px 4px rgba(0,0,0,0.3);
          ">${index + 1}</div>`,
          className: '',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        routeLayer.addLayer(
          L.marker([marker.lat, marker.lng], {
            icon: stopLabel,
            zIndexOffset: 1000,
            interactive: false,
          })
        );
      });

      // Depot marker
      if (depotMarkerRef.current) {
        depotMarkerRef.current.remove();
      }

      // Guard again before adding to map
      if (!isAliveRef.current || !mapRef.current) return;

      depotMarkerRef.current = L.marker(DEPOT, {
        icon: createDepotIcon(),
        zIndexOffset: 1100,
      })
        .bindPopup(
          `<div style="font-family:system-ui;padding:4px 6px;">
            <strong style="font-size:13px;color:#111827;">Austin Energy HQ</strong>
            <p style="font-size:11px;color:#6b7280;margin:4px 0 0;">Crew dispatch origin</p>
          </div>`,
          { closeButton: false }
        )
        .addTo(map);

      // Fit bounds (no animation to avoid race with cleanup)
      const allPoints: L.LatLngExpression[] = [
        DEPOT,
        ...orderedMarkers.map((m) => [m.lat, m.lng] as L.LatLngExpression),
      ];
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 14, animate: false });
    },
    []
  );

  /* ── Draw route for dispatched markers ── */
  useEffect(() => {
    const map = mapRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer) return;

    // Clear previous route
    routeLayer.clearLayers();
    if (depotMarkerRef.current) {
      depotMarkerRef.current.remove();
      depotMarkerRef.current = null;
    }

    if (dispatchedMarkerIds.size === 0) {
      onRouteInfoRef.current?.({ distanceKm: 0, durationMin: 0 });
      return;
    }

    const dispatchedMarkers = markers.filter((m) => dispatchedMarkerIds.has(m.id));
    if (dispatchedMarkers.length === 0) return;

    const depot: [number, number] = [DEPOT[0] as number, DEPOT[1] as number];
    const { order, totalKm } = optimizeRoute(depot, dispatchedMarkers);
    const orderedMarkers = order.map((i) => dispatchedMarkers[i]);

    // Build waypoints for OSRM: depot + ordered markers
    const waypoints = [
      { lat: depot[0], lng: depot[1] },
      ...orderedMarkers.map((m) => ({ lat: m.lat, lng: m.lng })),
    ];

    // Increment request ID to handle race conditions
    const requestId = ++routeRequestIdRef.current;

    // Immediately draw a straight-line fallback while we wait for OSRM
    const straightPoints: L.LatLngExpression[] = waypoints.map(
      (w) => [w.lat, w.lng] as L.LatLngExpression
    );

    // Show a subtle loading state with thinner dashed line
    routeLayer.addLayer(
      L.polyline(straightPoints, {
        color: '#93c5fd',
        weight: 3,
        opacity: 0.4,
        dashArray: '6, 8',
        smoothFactor: 1,
        lineJoin: 'round',
      })
    );

    // Add stop labels immediately
    orderedMarkers.forEach((marker, index) => {
      const stopLabel = L.divIcon({
        html: `<div style="
          width:22px;height:22px;border-radius:50%;
          background:#2563eb;color:white;
          display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:700;font-family:system-ui;
          border:2px solid white;
          box-shadow:0 1px 4px rgba(0,0,0,0.3);
        ">${index + 1}</div>`,
        className: '',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      routeLayer.addLayer(
        L.marker([marker.lat, marker.lng], {
          icon: stopLabel,
          zIndexOffset: 1000,
          interactive: false,
        })
      );
    });

    // Add depot marker immediately
    depotMarkerRef.current = L.marker(DEPOT, {
      icon: createDepotIcon(),
      zIndexOffset: 1100,
    })
      .bindPopup(
        `<div style="font-family:system-ui;padding:4px 6px;">
          <strong style="font-size:13px;color:#111827;">Austin Energy HQ</strong>
          <p style="font-size:11px;color:#6b7280;margin:4px 0 0;">Crew dispatch origin</p>
        </div>`,
        { closeButton: false }
      )
      .addTo(map);

    // Report straight-line estimate immediately
    onRouteInfoRef.current?.({
      distanceKm: totalKm,
      durationMin: (totalKm / 25) * 60,
    });

    // Fit bounds immediately
    const bounds = L.latLngBounds(straightPoints);
    map.fitBounds(bounds, { padding: [80, 80], maxZoom: 14, animate: false });

    // Now fetch the real road route from OSRM
    fetchOSRMRoute(waypoints).then((result) => {
      // Bail if component unmounted or a newer request has been made
      if (!isAliveRef.current) return;
      if (routeRequestIdRef.current !== requestId) return;

      const liveMap = mapRef.current;
      const liveRouteLayer = routeLayerRef.current;
      if (!liveMap || !liveRouteLayer) return;

      // Clear the loading state
      liveRouteLayer.clearLayers();
      if (depotMarkerRef.current) {
        depotMarkerRef.current.remove();
        depotMarkerRef.current = null;
      }

      if (result) {
        // Draw road-following route
        drawRoute(result.coordinates, orderedMarkers, liveMap, liveRouteLayer);

        // Report actual road distance/duration
        onRouteInfoRef.current?.({
          distanceKm: result.distanceKm,
          durationMin: result.durationMin,
        });

        // Re-fit bounds to the road route
        if (isAliveRef.current && mapRef.current) {
          const routeBounds = L.latLngBounds(result.coordinates);
          liveMap.fitBounds(routeBounds, { padding: [80, 80], maxZoom: 14, animate: false });
        }
      } else {
        // OSRM failed — draw straight-line fallback
        drawRoute(straightPoints, orderedMarkers, liveMap, liveRouteLayer);
      }
    });
  }, [dispatchedMarkerIds, markers, drawRoute]);

  /* ── Fly to selected marker ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedMarker) return;

    if (dispatchedMarkerIds.size === 0) {
      map.flyTo([selectedMarker.lat, selectedMarker.lng], map.getZoom(), {
        duration: 0.5,
      });
    }

    const lm = leafletMarkersRef.current.get(selectedMarker.id);
    if (lm) {
      lm.openPopup();
    }
  }, [selectedMarker]);

  return (
    <div className="absolute inset-0">
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
          {dispatchedMarkerIds.size > 0 && (
            <>
              <div className="h-px bg-gray-100 my-1" />
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-[12px] text-gray-700">
                  Dispatch Route
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}