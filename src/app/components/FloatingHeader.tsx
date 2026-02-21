import { useState } from 'react';
import {
  Search,
  Menu,
  Bell,
  Layers,
  ScanLine,
  Sparkles,
  ChevronDown,
  X,
} from 'lucide-react';

interface FloatingHeaderProps {
  onAICopilotOpen: () => void;
  onUploadModalOpen: () => void;
}

export function FloatingHeader({
  onAICopilotOpen,
  onUploadModalOpen,
}: FloatingHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
      <div className="flex items-start gap-2 p-3">
        {/* ── Main search bar (Google Maps style) ── */}
        <div
          className={`pointer-events-auto flex items-center gap-1 bg-white rounded-lg px-2 py-1 transition-shadow duration-200 flex-1 max-w-[600px] ${
            searchFocused
              ? 'shadow-[0_2px_8px_rgba(0,0,0,0.2)] ring-1 ring-blue-500/20'
              : 'shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
          }`}
        >
          {/* Hamburger / Back */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Search input */}
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search grid assets, IDs..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-gray-800 placeholder-gray-500 py-2 min-w-0"
          />

          {/* Search icon */}
          {searchValue ? (
            <button
              onClick={() => setSearchValue('')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
          )}

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 shrink-0" />

          {/* Profile avatar */}
          <button className="w-10 h-10 flex items-center justify-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white">
              <span className="text-[13px]">S</span>
            </div>
          </button>
        </div>

        {/* ── Right-side action buttons ── */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* AI Advisor */}
          <button
            onClick={onAICopilotOpen}
            className="flex items-center gap-2 bg-white rounded-lg pl-3 pr-4 h-[48px] shadow-[0_1px_4px_rgba(0,0,0,0.12)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all group"
          >
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[14px] text-gray-700 group-hover:text-gray-900 transition-colors hidden sm:inline">
              AI Advisor
            </span>
          </button>

          {/* Upload Scan */}
          <button
            onClick={onUploadModalOpen}
            className="flex items-center gap-2 bg-white rounded-lg pl-3 pr-4 h-[48px] shadow-[0_1px_4px_rgba(0,0,0,0.12)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all group"
          >
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <ScanLine className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[14px] text-gray-700 group-hover:text-gray-900 transition-colors hidden sm:inline">
              Upload Scan
            </span>
          </button>

          {/* Notifications */}
          <button className="w-[48px] h-[48px] flex items-center justify-center bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.12)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-3 right-3.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* ── Floating bottom-right control stack (Google Maps style) ── */}
      <div className="absolute right-3 bottom-auto top-[72px] pointer-events-auto flex flex-col gap-2">
        {/* Layers button */}
        <button className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.15)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:bg-gray-50 transition-all">
          <Layers className="w-[18px] h-[18px] text-gray-700" />
        </button>
      </div>

      {/* ── Dropdown menu (slide out) ── */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-20 pointer-events-auto"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-[60px] left-3 z-30 pointer-events-auto bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.16)] w-72 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Branding */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1a73e8] flex items-center justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] text-gray-900">
                  Micro-GridAware
                </span>
                <span className="text-[12px] text-gray-500">
                  Austin Energy Grid Management
                </span>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              {[
                { label: 'Dashboard', active: true },
                { label: 'Asset Inventory' },
                { label: 'Risk Reports' },
                { label: 'Field Operations' },
                { label: 'Settings' },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full text-left px-4 py-2.5 text-[14px] transition-colors ${
                    item.active
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* User section */}
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white shrink-0">
                  <span className="text-[13px]">S</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] text-gray-900 truncate">
                    Sarah Mitchell
                  </span>
                  <span className="text-[12px] text-gray-500 truncate">
                    Grid Operations Manager
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
