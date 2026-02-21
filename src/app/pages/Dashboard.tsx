import { Zap, User } from 'lucide-react';
import { GridMap } from '../components/GridMap';
import { HighRiskAssetsTable } from '../components/HighRiskAssetsTable';
import { AICopilot } from '../components/AICopilot';

export function Dashboard() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Micro-GridAware
              </h1>
            </div>
            <div className="flex items-center gap-4">
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

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Column: Map + Table */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Map Section */}
          <div className="flex-[2] min-h-0">
            <div className="h-full flex flex-col">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Austin Grid Overview</h2>
                <p className="text-sm text-gray-600">Real-time utility pole vulnerability monitoring</p>
              </div>
              <div className="flex-1 min-h-0">
                <GridMap />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="flex-1 min-h-0 overflow-auto">
            <HighRiskAssetsTable />
          </div>
        </div>

        {/* Right Sidebar: AI Copilot */}
        <div className="w-[420px] flex-shrink-0">
          <AICopilot />
        </div>
      </div>
    </div>
  );
}
