import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Save, Send, AlertTriangle, Camera, Zap } from 'lucide-react';
import { VulnerabilityGauge } from './VulnerabilityGauge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BoundingBox {
  id: string;
  label: string;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  color: string;
}

const boundingBoxes: BoundingBox[] = [
  {
    id: 'transformer',
    label: 'Transformer (Rust 80%)',
    x: 35,
    y: 25,
    width: 30,
    height: 35,
    color: '#ef4444', // red
  },
  {
    id: 'vegetation',
    label: 'Vegetation Danger Zone',
    x: 15,
    y: 15,
    width: 25,
    height: 40,
    color: '#f59e0b', // amber
  },
];

interface AssetInspectionProps {
  onBack?: () => void;
}

export function AssetInspection({ onBack }: AssetInspectionProps) {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Asset Inspection</h1>
                  <p className="text-sm text-gray-500">AI-Powered Analysis</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Asset ID: AUS-002</div>
                <div className="text-xs text-gray-500">Austin Energy Grid</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Side - Image with Bounding Boxes */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Uploaded Image</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>AI Analysis Complete</span>
            </div>
          </div>

          {/* Image Container with Bounding Boxes */}
          <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1691039923133-2ce1a7da85c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1dGlsaXR5JTIwcG9sZSUyMHRyYW5zZm9ybWVyJTIwcG93ZXIlMjBsaW5lc3xlbnwxfHx8fDE3NzE2MzM1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Utility pole with transformer"
              className="w-full h-full object-cover"
            />

            {/* Bounding Boxes Overlay */}
            <div className="absolute inset-0">
              {boundingBoxes.map((box) => (
                <div
                  key={box.id}
                  className={`absolute cursor-pointer transition-all ${
                    selectedBox === box.id ? 'z-10' : 'z-0'
                  }`}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                  onMouseEnter={() => setSelectedBox(box.id)}
                  onMouseLeave={() => setSelectedBox(null)}
                >
                  {/* Neon border effect */}
                  <div
                    className="w-full h-full border-2 rounded"
                    style={{
                      borderColor: box.color,
                      boxShadow: `0 0 20px ${box.color}80, inset 0 0 20px ${box.color}20`,
                    }}
                  >
                    {/* Corner markers */}
                    <div
                      className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 rounded-tl"
                      style={{ borderColor: box.color }}
                    ></div>
                    <div
                      className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 rounded-tr"
                      style={{ borderColor: box.color }}
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 rounded-bl"
                      style={{ borderColor: box.color }}
                    ></div>
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4 rounded-br"
                      style={{ borderColor: box.color }}
                    ></div>
                  </div>

                  {/* Label */}
                  <div
                    className="absolute -top-8 left-0 px-3 py-1 rounded text-xs font-semibold text-white whitespace-nowrap"
                    style={{
                      backgroundColor: box.color,
                      boxShadow: `0 0 15px ${box.color}80`,
                    }}
                  >
                    {box.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Scanning animation overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Detection Legend */}
          <div className="mt-4 flex gap-4">
            {boundingBoxes.map((box) => (
              <div key={box.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border-2"
                  style={{ borderColor: box.color, backgroundColor: `${box.color}20` }}
                ></div>
                <span className="text-sm text-gray-700">{box.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - AI Analysis Results */}
        <div className="w-[480px] bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Analysis Results</h2>
            </div>
          </div>

          {/* Vulnerability Score */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Vulnerability Score
              </h3>
            </div>
            <VulnerabilityGauge score={88} />
          </div>

          {/* Metadata */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-gray-600">GPS Coordinates:</span>
                  <span className="ml-2 font-mono text-gray-900">30.2749, -97.7341</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-gray-600">Upload Time:</span>
                  <span className="ml-2 font-medium text-gray-900">Feb 21, 2026 - 14:32 CST</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="flex-1 px-6 py-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              AI Summary
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-gray-900 leading-relaxed">
                  <p>
                    <span className="font-semibold text-red-700">Critical alert:</span> Tree
                    branches detected within 3 feet of high-voltage lines. Immediate vegetation
                    management required to prevent potential arc flash or line contact during
                    high winds.
                  </p>
                  <p>
                    <span className="font-semibold text-red-700">Moderate rust detected</span> on
                    transformer housing. Corrosion level at 80% coverage indicates advanced
                    deterioration. Recommend inspection for structural integrity and potential
                    oil leaks.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Detections */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Detected Objects
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Transformer</span>
                  <span className="text-xs font-medium text-gray-500">Confidence: 98%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Vegetation (High Risk)</span>
                  <span className="text-xs font-medium text-gray-500">Confidence: 95%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Power Lines</span>
                  <span className="text-xs font-medium text-gray-500">Confidence: 99%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Save className="w-5 h-5" />
                Save to Database
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                <Send className="w-5 h-5" />
                Dispatch Crew
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
