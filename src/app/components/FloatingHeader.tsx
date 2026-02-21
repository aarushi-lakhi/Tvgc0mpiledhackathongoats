import { Zap, Sparkles, Upload, User, Search, Bell, Menu } from 'lucide-react';

interface FloatingHeaderProps {
  onAICopilotOpen: () => void;
  onUploadModalOpen: () => void;
}

export function FloatingHeader({ onAICopilotOpen, onUploadModalOpen }: FloatingHeaderProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
      {/* Left Island: Branding & Search */}
      <div className="flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 p-1.5 pr-4 bg-white/90 backdrop-blur-md border border-white/20 shadow-xl rounded-full">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-gray-900 tracking-tight">Micro-GridAware</span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Austin Energy</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md border border-white/20 shadow-lg rounded-full w-64 group focus-within:w-80 transition-all duration-300">
          <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search assets, grid ID..." 
            className="bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 w-full"
          />
        </div>
      </div>

      {/* Right Island: Controls & Profile */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={onAICopilotOpen}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md hover:bg-white border border-white/40 shadow-lg rounded-full transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">AI Advisor</span>
        </button>

        <button
          onClick={onUploadModalOpen}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 rounded-full transition-all hover:scale-105 active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium">Upload Scan</span>
        </button>

        <div className="h-8 w-px bg-gray-300/50 mx-1"></div>

        <button className="p-2.5 bg-white/80 backdrop-blur-md hover:bg-white border border-white/40 shadow-lg rounded-full transition-all relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <button className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-white/80 backdrop-blur-md hover:bg-white border border-white/40 shadow-lg rounded-full transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white shadow-md">
            <span className="text-xs font-bold">SM</span>
          </div>
          <div className="flex flex-col items-start leading-none hidden sm:flex">
             <span className="text-xs font-bold text-gray-800">Sarah M.</span>
             <span className="text-[10px] text-gray-500">Manager</span>
          </div>
        </button>
      </div>
    </div>
  );
}
