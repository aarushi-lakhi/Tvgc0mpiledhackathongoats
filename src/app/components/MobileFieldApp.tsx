import { useState, useEffect } from 'react';
import { Camera, MapPin, ChevronRight, Zap, Signal, Battery, Wifi } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RecentScan {
  id: string;
  thumbnail: string;
  status: 'high' | 'medium' | 'low';
  score: number;
  timestamp: string;
  assetId: string;
}

const recentScans: RecentScan[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1691039923133-2ce1a7da85c9?w=400',
    status: 'high',
    score: 88,
    timestamp: '2 min ago',
    assetId: 'AUS-002',
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=400',
    status: 'high',
    score: 85,
    timestamp: '15 min ago',
    assetId: 'AUS-008',
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1509390138518-329f1b7c21d0?w=400',
    status: 'medium',
    score: 64,
    timestamp: '1 hr ago',
    assetId: 'AUS-003',
  },
  {
    id: '4',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    status: 'medium',
    score: 58,
    timestamp: '2 hr ago',
    assetId: 'AUS-009',
  },
  {
    id: '5',
    thumbnail: 'https://images.unsplash.com/photo-1508881598441-324f3974994b?w=400',
    status: 'low',
    score: 32,
    timestamp: '3 hr ago',
    assetId: 'AUS-007',
  },
];

const getStatusColor = (status: 'high' | 'medium' | 'low'): string => {
  switch (status) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
  }
};

export function MobileFieldApp() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [gpsCoords, setGpsCoords] = useState({ lat: 30.2749, lng: -97.7341 });
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate slight GPS coordinate changes
  useEffect(() => {
    const gpsInterval = setInterval(() => {
      setGpsCoords({
        lat: 30.2749 + (Math.random() - 0.5) * 0.0001,
        lng: -97.7341 + (Math.random() - 0.5) * 0.0001,
      });
    }, 2000);
    return () => clearInterval(gpsInterval);
  }, []);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      // Navigate to results or show success
    }, 1500);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col max-w-[430px] mx-auto relative overflow-hidden">
      {/* Status Bar */}
      <div className="bg-black text-white px-4 py-2 flex items-center justify-between text-xs z-20">
        <div className="flex items-center gap-1">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
        </div>
        <div className="font-semibold">
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs">94%</span>
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* App Header */}
      <div className="bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 pt-10 pb-6 px-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">GridAware Field</h1>
              <p className="text-gray-300 text-xs">Asset Inspector</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 relative bg-black">
        {/* Camera Feed Simulation */}
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1691039923133-2ce1a7da85c9?w=1080"
          alt="Camera viewfinder"
          className="w-full h-full object-cover"
        />

        {/* Capture flash overlay */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white animate-pulse"></div>
        )}

        {/* Viewfinder Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid lines */}
          <svg className="w-full h-full opacity-30">
            <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="white" strokeWidth="1" />
            <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="white" strokeWidth="1" />
            <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="white" strokeWidth="1" />
            <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="white" strokeWidth="1" />
          </svg>

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>

          {/* Center focus indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 border-2 border-cyan-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            </div>
          </div>

          {/* AI Detection Banner */}
          <div className="absolute top-20 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="font-semibold">AI DETECTION READY</span>
              </div>
              <p className="text-white text-xs">
                Point camera at utility pole and tap capture
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="bg-gradient-to-t from-gray-900 via-gray-900 to-transparent px-6 pb-8 pt-6">
        {/* GPS Coordinates */}
        <div className="mb-6 flex items-center justify-center gap-2 text-white">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-sm">
            {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}
          </span>
        </div>

        {/* Capture Button */}
        <div className="flex items-center justify-center mb-8">
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            {/* Outer ring */}
            <div className="absolute -inset-2 rounded-full border-4 border-blue-400/30"></div>
            
            {/* Inner button */}
            <div className="w-full h-full rounded-full flex items-center justify-center">
              {isCapturing ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-8 h-8 text-white" />
              )}
            </div>

            {/* Pulse effect */}
            {!isCapturing && (
              <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 animate-ping"></div>
            )}
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-white font-semibold text-sm">Capture & Analyze</p>
          <p className="text-gray-400 text-xs mt-1">AI processes in real-time</p>
        </div>

        {/* Recent Scans Carousel */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">Recent Scans</h3>
            <button className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300">
              View All
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                className="flex-shrink-0 w-20 cursor-pointer group"
              >
                <div className="relative mb-2">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-600 group-hover:border-blue-400 transition-colors">
                    <ImageWithFallback
                      src={scan.thumbnail}
                      alt={`Scan ${scan.assetId}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Status Indicator */}
                  <div
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-800 ${getStatusColor(scan.status)} shadow-lg`}
                  >
                    <div className="w-full h-full rounded-full animate-pulse"></div>
                  </div>

                  {/* Score Badge */}
                  <div className="absolute bottom-1 left-1 right-1 bg-black/80 backdrop-blur-sm rounded px-1 py-0.5">
                    <p className="text-white text-xs font-bold text-center">{scan.score}</p>
                  </div>
                </div>

                {/* Scan Info */}
                <div className="text-center">
                  <p className="text-white text-xs font-medium truncate">{scan.assetId}</p>
                  <p className="text-gray-400 text-xs">{scan.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
