import { AlertCircle, Wrench } from 'lucide-react';

interface Asset {
  id: string;
  gps: string;
  vulnerabilityScore: number;
  identifiedRisk: string;
}

const assets: Asset[] = [
  { id: 'AUS-002', gps: '30.2749, -97.7341', vulnerabilityScore: 92, identifiedRisk: 'Transformer Rust' },
  { id: 'AUS-001', gps: '30.2672, -97.7431', vulnerabilityScore: 87, identifiedRisk: 'Vegetation Encroachment' },
  { id: 'AUS-008', gps: '30.2775, -97.7355', vulnerabilityScore: 85, identifiedRisk: 'Overloaded Circuit' },
  { id: 'AUS-005', gps: '30.2600, -97.7500', vulnerabilityScore: 78, identifiedRisk: 'Vegetation Encroachment' },
  { id: 'AUS-003', gps: '30.2655, -97.7525', vulnerabilityScore: 64, identifiedRisk: 'Wire Fatigue' },
  { id: 'AUS-009', gps: '30.2625, -97.7490', vulnerabilityScore: 58, identifiedRisk: 'Wire Fatigue' },
  { id: 'AUS-006', gps: '30.2720, -97.7380', vulnerabilityScore: 55, identifiedRisk: 'Pole Degradation' },
];

export function HighRiskAssetsTable() {
  const getScoreBadgeColor = (score: number): string => {
    if (score >= 70) return 'bg-red-100 text-red-700 border-red-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">High-Risk Assets</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Asset ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                GPS Coordinates
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Vulnerability Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Identified Risk
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {asset.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                  {asset.gps}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getScoreBadgeColor(asset.vulnerabilityScore)}`}>
                    {asset.vulnerabilityScore}/100
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {asset.identifiedRisk}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <Wrench className="w-4 h-4" />
                    Schedule Repair
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
