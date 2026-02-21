import { X, MapPin, Clock, AlertTriangle, Send, FileText, ShieldCheck } from 'lucide-react';
import { VulnerabilityGauge } from './VulnerabilityGauge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';

interface MapMarker {
  id: string;
  risk: 'high' | 'medium' | 'low';
  vulnerabilityScore: number;
  identifiedRisk: string;
  gps: string;
}

interface MapSidebarProps {
  marker: MapMarker | null;
  onClose: () => void;
}

/* ── Image mapping by identified risk ── */

const riskImageMap: Record<string, { src: string; alt: string }> = {
  'Vegetation Encroachment': {
    src: 'https://images.unsplash.com/photo-1682283406400-a2f8b825457e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwYnJhbmNoZXMlMjBncm93aW5nJTIwaW50byUyMHBvd2VyJTIwbGluZXMlMjB2ZWdldGF0aW9ufGVufDF8fHx8MTc3MTYzNjY0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Vegetation encroaching on power lines',
  },
  'Tree Limb Contact': {
    src: 'https://images.unsplash.com/photo-1721486168037-aab8e6095f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwbGltYiUyMGZhbGxlbiUyMG9uJTIwcG93ZXIlMjBsaW5lJTIwc3Rvcm0lMjBkYW1hZ2V8ZW58MXx8fHwxNzcxNjM2NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Tree limb making contact with power line',
  },
  'Transformer Rust': {
    src: 'https://images.unsplash.com/photo-1725391798478-5fe9cfc8398e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXN0eSUyMGVsZWN0cmljYWwlMjB0cmFuc2Zvcm1lciUyMHV0aWxpdHklMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzcxNjM2NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Rusted electrical transformer',
  },
  'Transformer Overheating': {
    src: 'https://images.unsplash.com/photo-1760789149696-30ce2d28b331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwc3Vic3RhdGlvbiUyMHBvd2VyJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3MTYzNjY0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Overheating transformer at substation',
  },
  'Transformer Overloading': {
    src: 'https://images.unsplash.com/photo-1725391798478-5fe9cfc8398e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXN0eSUyMGVsZWN0cmljYWwlMjB0cmFuc2Zvcm1lciUyMHV0aWxpdHklMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzcxNjM2NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Overloaded transformer equipment',
  },
  'Wire Fatigue': {
    src: 'https://images.unsplash.com/photo-1762363825510-9ff4c51a9381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWdnaW5nJTIwcG93ZXIlMjBsaW5lcyUyMGVsZWN0cmljYWwlMjB3aXJlc3xlbnwxfHx8fDE3NzE2MzY2NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Fatigued electrical wires showing wear',
  },
  'Conductor Sag': {
    src: 'https://images.unsplash.com/photo-1762363825510-9ff4c51a9381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWdnaW5nJTIwcG93ZXIlMjBsaW5lcyUyMGVsZWN0cmljYWwlMjB3aXJlc3xlbnwxfHx8fDE3NzE2MzY2NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Sagging conductor lines between poles',
  },
  'Feeder Line Degradation': {
    src: 'https://images.unsplash.com/photo-1635179885954-c778885a1197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwZWxlY3RyaWNhbCUyMGluc3VsYXRvciUyMHBvd2VyJTIwcG9sZXxlbnwxfHx8fDE3NzE2MzY2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Degraded feeder lines on utility pole',
  },
  'Pole Degradation': {
    src: 'https://images.unsplash.com/photo-1717513607312-7d6388a2f666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjB3b29kZW4lMjB1dGlsaXR5JTIwcG9sZSUyMGRhbWFnZWR8ZW58MXx8fHwxNzcxNjM2NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Degraded wooden utility pole',
  },
  'Pole Lean Detected': {
    src: 'https://images.unsplash.com/photo-1717513607312-7d6388a2f666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjB3b29kZW4lMjB1dGlsaXR5JTIwcG9sZSUyMGRhbWFnZWR8ZW58MXx8fHwxNzcxNjM2NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Leaning utility pole requiring attention',
  },
  'Overloaded Circuit': {
    src: 'https://images.unsplash.com/photo-1467733238130-bb6846885316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwY2lyY3VpdCUyMGJyZWFrZXIlMjBvdmVybG9hZGVkJTIwcGFuZWx8ZW58MXx8fHwxNzcxNjM2NjQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Overloaded electrical circuit panel',
  },
  'Insulator Cracking': {
    src: 'https://images.unsplash.com/photo-1635179885954-c778885a1197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwZWxlY3RyaWNhbCUyMGluc3VsYXRvciUyMHBvd2VyJTIwcG9sZXxlbnwxfHx8fDE3NzE2MzY2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Cracked ceramic insulator on power pole',
  },
  'Underground Cable Fault': {
    src: 'https://images.unsplash.com/photo-1711375211760-117f793d1f15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMGVsZWN0cmljYWwlMjBjYWJsZSUyMGNvbmR1aXQlMjB0cmVuY2h8ZW58MXx8fHwxNzcxNjM2NjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Underground electrical cable conduit',
  },
  'Capacitor Bank Failure': {
    src: 'https://images.unsplash.com/photo-1768554591368-292194a9f50c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwc3dpdGNoZ2VhciUyMHBhbmVsJTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3NzE2MzY2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Failed capacitor bank unit',
  },
  'Substation Flooding Risk': {
    src: 'https://images.unsplash.com/photo-1710904074075-187909fb0ff0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vZGVkJTIwZWxlY3RyaWNhbCUyMHN1YnN0YXRpb24lMjB3YXRlciUyMGRhbWFnZXxlbnwxfHx8fDE3NzE2MzY2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Substation with flooding risk',
  },
  'Recloser Malfunction': {
    src: 'https://images.unsplash.com/photo-1768554591368-292194a9f50c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwc3dpdGNoZ2VhciUyMHBhbmVsJTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3NzE2MzY2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Malfunctioning recloser unit',
  },
  'Switch Gear Wear': {
    src: 'https://images.unsplash.com/photo-1768554591368-292194a9f50c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwc3dpdGNoZ2VhciUyMHBhbmVsJTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3NzE2MzY2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Worn switchgear panel',
  },
  'Aging Infrastructure': {
    src: 'https://images.unsplash.com/photo-1767989394831-1ca05fe82dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjB3ZWF0aGVyZWQlMjBjb3Jyb2RlZCUyMG1ldGFsJTIwdXRpbGl0eSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzE2MzY2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Aging utility infrastructure',
  },
  'Minor Corrosion': {
    src: 'https://images.unsplash.com/photo-1767989394831-1ca05fe82dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjB3ZWF0aGVyZWQlMjBjb3Jyb2RlZCUyMG1ldGFsJTIwdXRpbGl0eSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzE2MzY2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Minor corrosion on utility equipment',
  },
  'None Detected': {
    src: 'https://images.unsplash.com/photo-1766042494020-2570196e6f8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMG1vZGVybiUyMGVsZWN0cmljYWwlMjBpbmZyYXN0cnVjdHVyZSUyMHBvd2VyJTIwZ3JpZHxlbnwxfHx8fDE3NzE2MzY2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Clean modern electrical infrastructure',
  },
};

const defaultImage = {
  src: 'https://images.unsplash.com/photo-1766042494020-2570196e6f8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMG1vZGVybiUyMGVsZWN0cmljYWwlMjBpbmZyYXN0cnVjdHVyZSUyMHBvd2VyJTIwZ3JpZHxlbnwxfHx8fDE3NzE2MzY2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  alt: 'Utility infrastructure',
};

/* ── Detected components by risk type ── */

function getDetectedComponents(identifiedRisk: string): { name: string; confidence: number }[] {
  switch (identifiedRisk) {
    case 'Vegetation Encroachment':
      return [
        { name: 'Overgrown Vegetation', confidence: 96 },
        { name: 'Power Line Clearance Violation', confidence: 94 },
        { name: 'Support Pole', confidence: 98 },
      ];
    case 'Tree Limb Contact':
      return [
        { name: 'Tree Limb / Branch', confidence: 97 },
        { name: 'Direct Contact Point', confidence: 91 },
        { name: 'Conductor Line', confidence: 99 },
      ];
    case 'Transformer Rust':
      return [
        { name: 'Transformer Unit', confidence: 99 },
        { name: 'Surface Corrosion', confidence: 93 },
        { name: 'Oil Leak Staining', confidence: 72 },
      ];
    case 'Transformer Overheating':
      return [
        { name: 'Transformer Unit', confidence: 99 },
        { name: 'Thermal Anomaly', confidence: 88 },
        { name: 'Cooling Fin Blockage', confidence: 81 },
      ];
    case 'Transformer Overloading':
      return [
        { name: 'Transformer Unit', confidence: 99 },
        { name: 'Load Capacity Exceeded', confidence: 90 },
        { name: 'Bushing Stress', confidence: 76 },
      ];
    case 'Wire Fatigue':
      return [
        { name: 'Conductor Wire', confidence: 98 },
        { name: 'Strand Fraying', confidence: 85 },
        { name: 'Splice Point Wear', confidence: 79 },
      ];
    case 'Conductor Sag':
      return [
        { name: 'Conductor Line', confidence: 99 },
        { name: 'Excessive Sag Detected', confidence: 92 },
        { name: 'Ground Clearance Risk', confidence: 87 },
      ];
    case 'Feeder Line Degradation':
      return [
        { name: 'Feeder Line', confidence: 97 },
        { name: 'Insulation Degradation', confidence: 86 },
        { name: 'Connection Hardware', confidence: 94 },
      ];
    case 'Pole Degradation':
      return [
        { name: 'Wooden Utility Pole', confidence: 99 },
        { name: 'Base Rot Detected', confidence: 88 },
        { name: 'Woodpecker Damage', confidence: 65 },
      ];
    case 'Pole Lean Detected':
      return [
        { name: 'Utility Pole', confidence: 99 },
        { name: 'Lean Angle Deviation', confidence: 94 },
        { name: 'Guy Wire Tension Loss', confidence: 81 },
      ];
    case 'Overloaded Circuit':
      return [
        { name: 'Circuit Breaker Panel', confidence: 98 },
        { name: 'Thermal Overload Sign', confidence: 91 },
        { name: 'Distribution Feeder', confidence: 96 },
      ];
    case 'Insulator Cracking':
      return [
        { name: 'Ceramic Insulator', confidence: 97 },
        { name: 'Surface Crack Pattern', confidence: 89 },
        { name: 'Flashover Damage', confidence: 74 },
      ];
    case 'Underground Cable Fault':
      return [
        { name: 'Underground Conduit', confidence: 95 },
        { name: 'Cable Sheath Damage', confidence: 87 },
        { name: 'Junction Box', confidence: 93 },
      ];
    case 'Capacitor Bank Failure':
      return [
        { name: 'Capacitor Bank', confidence: 98 },
        { name: 'Blown Fuse Indicator', confidence: 90 },
        { name: 'Mounting Hardware', confidence: 96 },
      ];
    case 'Substation Flooding Risk':
      return [
        { name: 'Substation Perimeter', confidence: 99 },
        { name: 'Water Intrusion Path', confidence: 86 },
        { name: 'Ground-Level Equipment', confidence: 95 },
      ];
    case 'Recloser Malfunction':
      return [
        { name: 'Recloser Unit', confidence: 97 },
        { name: 'Actuator Mechanism', confidence: 83 },
        { name: 'Control Wiring', confidence: 91 },
      ];
    case 'Switch Gear Wear':
      return [
        { name: 'Switchgear Enclosure', confidence: 98 },
        { name: 'Contact Surface Erosion', confidence: 85 },
        { name: 'Arc Damage', confidence: 78 },
      ];
    case 'Aging Infrastructure':
      return [
        { name: 'Structural Support', confidence: 97 },
        { name: 'Material Fatigue', confidence: 88 },
        { name: 'Hardware Corrosion', confidence: 82 },
      ];
    case 'Minor Corrosion':
      return [
        { name: 'Equipment Surface', confidence: 96 },
        { name: 'Surface Oxidation', confidence: 84 },
        { name: 'Fastener Condition', confidence: 92 },
      ];
    default:
      return [
        { name: 'Power Infrastructure', confidence: 98 },
        { name: 'Support Structure', confidence: 97 },
        { name: 'Electrical Hardware', confidence: 96 },
      ];
  }
}

/* ── Component ── */

export function MapSidebar({ marker, onClose }: MapSidebarProps) {
  const navigate = useNavigate();

  if (!marker) return null;

  const image = riskImageMap[marker.identifiedRisk] ?? defaultImage;
  const components = getDetectedComponents(marker.identifiedRisk);

  const riskConfig = {
    high: {
      label: 'Critical',
      dot: 'bg-red-500',
      headerBg: 'bg-red-50',
      headerBorder: 'border-red-100',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-700',
      alertBg: 'bg-red-50',
      alertBorder: 'border-red-200',
      alertIcon: 'text-red-500',
      alertLabel: 'text-red-700',
      Icon: AlertTriangle,
    },
    medium: {
      label: 'Warning',
      dot: 'bg-amber-500',
      headerBg: 'bg-amber-50/60',
      headerBorder: 'border-amber-100',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-700',
      alertBg: 'bg-amber-50',
      alertBorder: 'border-amber-200',
      alertIcon: 'text-amber-500',
      alertLabel: 'text-amber-700',
      Icon: AlertTriangle,
    },
    low: {
      label: 'Stable',
      dot: 'bg-emerald-500',
      headerBg: 'bg-emerald-50/60',
      headerBorder: 'border-emerald-100',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-700',
      alertBg: 'bg-emerald-50',
      alertBorder: 'border-emerald-200',
      alertIcon: 'text-emerald-500',
      alertLabel: 'text-emerald-700',
      Icon: ShieldCheck,
    },
  };

  const cfg = riskConfig[marker.risk];
  const RiskIcon = cfg.Icon;

  return (
    <div className="absolute top-0 left-0 bottom-0 w-[480px] bg-white shadow-[4px_0_24px_rgba(0,0,0,0.1)] z-30 flex flex-col animate-slide-in">
      {/* Header */}
      <div className={`px-5 py-3.5 flex items-center justify-between flex-shrink-0 border-b ${cfg.headerBorder} ${cfg.headerBg}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${cfg.badgeBg} flex items-center justify-center`}>
            <RiskIcon className={`w-[18px] h-[18px] ${cfg.alertIcon}`} />
          </div>
          <div>
            <h2 className="text-[15px] text-gray-900">Asset Details</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              <span className={`text-[11px] ${cfg.badgeText}`}>{cfg.label}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Asset ID */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-[11px] text-gray-400 uppercase tracking-wider">Asset ID</div>
          <div className="text-[18px] text-gray-900 mt-0.5 font-mono tracking-tight">{marker.id}</div>
        </div>

        {/* Image — risk-specific */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-[12px] text-gray-500 mb-2.5">Uploaded Scan</div>
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {/* Small risk badge overlay */}
            <div className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] ${cfg.badgeBg} ${cfg.badgeText} backdrop-blur-sm`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {marker.identifiedRisk}
            </div>
          </div>
        </div>

        {/* Vulnerability Score */}
        <div className="px-5 py-6 border-b border-gray-100">
          <div className="text-center mb-5">
            <h3 className="text-[11px] text-gray-400 uppercase tracking-wider">
              Vulnerability Score
            </h3>
          </div>
          <VulnerabilityGauge score={marker.vulnerabilityScore} />
        </div>

        {/* Location Details */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[13px]">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <span className="text-gray-500">GPS</span>
                <span className="ml-2 font-mono text-gray-800">{marker.gps}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <span className="text-gray-500">Last Scanned</span>
                <span className="ml-2 text-gray-800">Feb 21, 2026 — 14:32 CST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="px-5 py-5">
          <h3 className="text-[11px] text-gray-400 uppercase tracking-wider mb-3">
            AI Analysis
          </h3>
          <div className={`border rounded-lg p-4 ${cfg.alertBg} ${cfg.alertBorder}`}>
            <div className="flex gap-3">
              <RiskIcon className={`w-[18px] h-[18px] flex-shrink-0 mt-0.5 ${cfg.alertIcon}`} />
              <div className="text-[13px] text-gray-800 leading-relaxed">
                <span className={cfg.alertLabel}>
                  {marker.risk === 'high' ? 'Critical alert:' :
                   marker.risk === 'medium' ? 'Warning:' : 'All clear:'}
                </span>{' '}
                {marker.identifiedRisk}
                {marker.risk === 'high' && ' detected. Immediate attention required to prevent potential service disruption or safety hazards.'}
                {marker.risk === 'medium' && ' detected. Recommend scheduling maintenance within the next 30 days.'}
                {marker.risk === 'low' && '. Asset is in good condition. Continue regular monitoring schedule.'}
              </div>
            </div>
          </div>

          {/* Detected Components — risk-specific */}
          <div className="mt-5 space-y-2.5">
            <h4 className="text-[11px] text-gray-400 uppercase tracking-wider">
              Detected Components
            </h4>
            <div className="space-y-1.5">
              {components.map((comp) => (
                <div
                  key={comp.name}
                  className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg"
                >
                  <span className="text-[13px] text-gray-700">{comp.name}</span>
                  <span className="text-[11px] text-gray-400 font-mono">{comp.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/80 flex-shrink-0">
        <div className="space-y-2.5">
          <button
            onClick={() => navigate(`/inspection/${marker.id}`)}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1765cc] transition-colors text-[14px]"
          >
            <FileText className="w-4 h-4" />
            Full Inspection Report
          </button>
          {marker.risk === 'high' && (
            <button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-[14px]">
              <Send className="w-4 h-4" />
              Dispatch Crew
            </button>
          )}
        </div>
      </div>
    </div>
  );
}