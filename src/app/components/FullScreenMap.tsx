import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Loader2, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

// Austin, TX coordinates
const CENTER = { lat: 30.2672, lng: -97.7431 };

// Custom Map Style for a sleek, modern look
const MAP_STYLES = [
  {
    "featureType": "all",
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#c9c9c9" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  }
];

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

const containerStyle = {
  width: '100%',
  height: '100%'
};

export function FullScreenMap({ markers, selectedMarker, onMarkerClick }: FullScreenMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_API_KEY_HERE" // Replace with your actual API key
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const getMarkerIcon = (risk: 'high' | 'medium' | 'low') => {
    let color = '';
    switch (risk) {
      case 'high': color = '#dc2626'; break;
      case 'medium': color = '#f59e0b'; break;
      case 'low': color = '#10b981'; break;
    }
    
    // Create a custom SVG pin data URI
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="white" stroke="${color}" stroke-width="4"/>
        <circle cx="20" cy="20" r="8" fill="${color}"/>
      </svg>
    `;
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20)
    };
  };

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={CENTER}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: true, // We'll build our own controls or keep it clean
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {markers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => onMarkerClick(marker)}
            icon={getMarkerIcon(marker.risk)}
            animation={marker.risk === 'high' ? window.google.maps.Animation.BOUNCE : undefined}
          />
        ))}

        {selectedMarker && (
          <InfoWindowF
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => onMarkerClick(selectedMarker)} // This might need a close handler prop if we want to deselect
            options={{ pixelOffset: new window.google.maps.Size(0, -20) }}
          >
            <div className="px-1 py-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${
                  selectedMarker.risk === 'high' ? 'bg-red-500' : 
                  selectedMarker.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <h3 className="font-bold text-gray-900 text-sm">{selectedMarker.id}</h3>
              </div>
              <p className="text-xs text-gray-600 font-medium">{selectedMarker.identifiedRisk}</p>
              <div className="mt-2 text-xs text-gray-400">
                Score: <span className="text-gray-700 font-bold">{selectedMarker.vulnerabilityScore}</span>
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      {/* Custom Overlay Controls (Zoom, etc) can go here if we disabled default UI */}
      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-4 transition-all hover:scale-105">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Risk Assessment</div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
            <span className="text-xs font-medium text-gray-700">Critical (High Risk)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs font-medium text-gray-700">Warning (Medium)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-medium text-gray-700">Stable (Low Risk)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
