import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Home,
  Building2,
  Users,
  ShieldCheck,
  Search,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Phone,
  Layers,
  Info,
  Calendar,
  Compass,
  Maximize2
} from 'lucide-react';

export interface ApartmentCluster {
  id: string;
  name: string;
  society: string;
  locality: string;
  distanceKm: number;
  travelTime: string;
  elderPopulation: string;
  activeHomePatients: number;
  keySpecialty: string;
  specialtyTag: 'ortho' | 'geriatric' | 'neuro' | 'spine';
  visitingPhysio: string;
  visitSlots: string;
  landmark: string;
  // Position coordinates in percentage for the SVG map (0 - 100%)
  coord: { x: number; y: number };
  category: 'core' | 'extended' | 'outer';
}

const CLUSTERS_DATA: ApartmentCluster[] = [
  {
    id: 'cqal-sahakar',
    name: 'CQAL Layout & F-Block Bungalows',
    society: 'CQAL Senior Officers Enclave & 60ft Rd',
    locality: 'Sahakarnagar Central',
    distanceKm: 0.6,
    travelTime: '4–6 mins',
    elderPopulation: '320+ Senior Citizens',
    activeHomePatients: 7,
    keySpecialty: 'Post-TKR & Daily Assisted Mobility',
    specialtyTag: 'geriatric',
    visitingPhysio: 'Dr. Rajesh Kumar, BPT (Senior)',
    visitSlots: 'Daily 01:30 PM & 03:00 PM',
    landmark: 'Behind Sahakarnagar Post Office',
    coord: { x: 46, y: 56 },
    category: 'core'
  },
  {
    id: 'judicial-telecom',
    name: 'Judicial Layout & Telecom Colony',
    society: 'Judicial Officers Colony & Telecom Layout',
    locality: 'Judicial Layout (Near GKVK Gate)',
    distanceKm: 1.8,
    travelTime: '8–12 mins',
    elderPopulation: '280+ Retired Jurists & Civil Servants',
    activeHomePatients: 5,
    keySpecialty: 'Geriatric Balance & Osteoarthritis Care',
    specialtyTag: 'geriatric',
    visitingPhysio: 'Dr. Anita Rao, MPT (Neuro/Geri)',
    visitSlots: 'Mon / Wed / Fri 02:00 PM',
    landmark: 'Near Judicial Layout Club & Park',
    coord: { x: 33, y: 38 },
    category: 'core'
  },
  {
    id: 'alpine-pyramid',
    name: 'Alpine Pyramid & Raintree Boulevard',
    society: 'Alpine Pyramid Apts & L&T Raintree',
    locality: 'Sahakarnagar North / Byatarayanapura',
    distanceKm: 2.2,
    travelTime: '10–14 mins',
    elderPopulation: '450+ Multi-generation Families',
    activeHomePatients: 8,
    keySpecialty: 'Post-Op Knee/Hip Rehab & Walker Training',
    specialtyTag: 'ortho',
    visitingPhysio: 'Dr. Rajesh Kumar, BPT',
    visitSlots: 'Tue / Thu / Sat 02:30 PM',
    landmark: 'Off Rajiv Gandhi Nagar Main Road',
    coord: { x: 42, y: 26 },
    category: 'core'
  },
  {
    id: 'tata-nagar',
    name: 'Tata Nagar & Kodigehalli Enclave',
    society: 'Tata Nagar Layout & Sterling Terraces',
    locality: 'Tata Nagar (West of Sahakarnagar)',
    distanceKm: 2.6,
    travelTime: '12–16 mins',
    elderPopulation: '310+ Senior IISc/DRDO Retirees',
    activeHomePatients: 4,
    keySpecialty: 'Post-Stroke Gait & Upper Limb Retraining',
    specialtyTag: 'neuro',
    visitingPhysio: 'Dr. Anita Rao, MPT',
    visitSlots: 'Mon / Wed / Fri 03:45 PM',
    landmark: 'Near Kodigehalli Railway Gate',
    coord: { x: 26, y: 64 },
    category: 'extended'
  },
  {
    id: 'godrej-platinum',
    name: 'Godrej Platinum & Woodsman Estate',
    society: 'Godrej Platinum Towers & Woodsman',
    locality: 'Bellary Road / Hebbal Flyover Corridor',
    distanceKm: 3.4,
    travelTime: '14–18 mins',
    elderPopulation: '260+ Elders (NRI & Tech Leaders Families)',
    activeHomePatients: 6,
    keySpecialty: 'Post-Surgical TKR/THR & Spine Recovery',
    specialtyTag: 'ortho',
    visitingPhysio: 'Dr. Rajesh Kumar, BPT',
    visitSlots: 'Daily 04:15 PM',
    landmark: 'Opp. Aster CMI Hospital, Bellary Rd',
    coord: { x: 74, y: 52 },
    category: 'extended'
  },
  {
    id: 'prestige-kensington',
    name: 'Prestige Kensington Gardens',
    society: 'Prestige Kensington Towers (A to D)',
    locality: 'HMT / Vidyaranyapura Link Road',
    distanceKm: 3.9,
    travelTime: '16–20 mins',
    elderPopulation: '380+ Senior Residents',
    activeHomePatients: 4,
    keySpecialty: 'Parkinson’s Mobility & Cardiac Conditioning',
    specialtyTag: 'geriatric',
    visitingPhysio: 'Dr. Anita Rao, MPT',
    visitSlots: 'Tue / Thu / Sat 04:00 PM',
    landmark: 'Near BEL Circle / HMT Watch Factory Rd',
    coord: { x: 20, y: 32 },
    category: 'extended'
  },
  {
    id: 'sobha-petunia',
    name: 'Sobha Petunia & Hebbal Lake Enclave',
    society: 'Sobha Petunia Luxury Apartments',
    locality: 'Hebbal Kempapura Lake Road',
    distanceKm: 4.5,
    travelTime: '18–22 mins',
    elderPopulation: '190+ Senior Residents',
    activeHomePatients: 3,
    keySpecialty: 'Gentle Hydro & Bedside Strength Maintenance',
    specialtyTag: 'geriatric',
    visitingPhysio: 'Dr. Rajesh Kumar, BPT',
    visitSlots: 'Mon / Thu 04:45 PM',
    landmark: 'East of Hebbal Lake Promenade',
    coord: { x: 82, y: 72 },
    category: 'outer'
  },
  {
    id: 'rmv-extension',
    name: 'RMV 2nd Stage & Dollars Colony',
    society: 'RMV Extension & CPRI Colony Road',
    locality: 'Sanjaynagar / RMV 2nd Stage Border',
    distanceKm: 4.8,
    travelTime: '18–24 mins',
    elderPopulation: '350+ Senior Citizens',
    activeHomePatients: 3,
    keySpecialty: 'Chronic Cervical & Lumbar Spine Care',
    specialtyTag: 'spine',
    visitingPhysio: 'Dr. Rajesh Kumar, BPT',
    visitSlots: 'Wed / Sat 05:00 PM',
    landmark: 'Near CPRI Main Gate / Ashwathnagar',
    coord: { x: 50, y: 88 },
    category: 'outer'
  }
];

interface InteractiveServiceMapProps {
  onBookHomeVisit?: (clusterName?: string) => void;
  onNavigateToSection?: (section: string) => void;
}

export const InteractiveServiceMap: React.FC<InteractiveServiceMapProps> = ({
  onBookHomeVisit,
  onNavigateToSection
}) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>('cqal-sahakar');
  const [radiusFilter, setRadiusFilter] = useState<'all' | 'core' | 'extended' | 'outer'>('all');
  const [conditionFilter, setConditionFilter] = useState<'all' | 'ortho' | 'geriatric' | 'neuro' | 'spine'>('all');
  const [hoveredClusterId, setHoveredClusterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'directory'>('map');

  // Clinic coordinates on the 100x100 grid
  const clinicCoord = { x: 48, y: 52 };

  // Filtered clusters
  const filteredClusters = useMemo(() => {
    return CLUSTERS_DATA.filter(c => {
      if (radiusFilter !== 'all' && c.category !== radiusFilter) return false;
      if (conditionFilter !== 'all' && c.specialtyTag !== conditionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.society.toLowerCase().includes(q) ||
          c.locality.toLowerCase().includes(q) ||
          c.keySpecialty.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [radiusFilter, conditionFilter, searchQuery]);

  const activeCluster = useMemo(() => {
    return (
      CLUSTERS_DATA.find(c => c.id === (hoveredClusterId || selectedClusterId)) ||
      CLUSTERS_DATA[0]
    );
  }, [selectedClusterId, hoveredClusterId]);

  return (
    <section id="service-area-map" className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Interactive Care Coverage & Home Dispatch Map</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Sahakarnagar Service Radius & Elder Living Clusters
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Explore our daily home-physiotherapy visit routes across Sahakarnagar and North Bangalore. 
            All elder care visits are scheduled in dedicated afternoon transit windows (01:30 PM – 04:30 PM) 
            with zero travel fatigue for the therapist.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl self-start md:self-auto border border-stone-200 dark:border-stone-700">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Schematic Map
          </button>
          <button
            onClick={() => setViewMode('directory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'directory'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Apartment Directory ({CLUSTERS_DATA.length})
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search apartment, road, or layout..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600"
          />
        </div>

        {/* Radius Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-stone-500 mr-1 shrink-0">Radius:</span>
          {[
            { id: 'all', label: 'All Zones (0-5 km)' },
            { id: 'core', label: 'Core (0–2.5 km)' },
            { id: 'extended', label: 'Extended (2.5–4 km)' },
            { id: 'outer', label: 'Outer (4–5 km)' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setRadiusFilter(r.id as any)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                radiusFilter === r.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Condition Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-stone-500 mr-1 shrink-0">Condition:</span>
          {[
            { id: 'all', label: 'All Care' },
            { id: 'geriatric', label: 'Elder Mobility' },
            { id: 'ortho', label: 'Post-TKR/THR' },
            { id: 'neuro', label: 'Stroke Rehab' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setConditionFilter(c.id as any)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                conditionFilter === c.id
                  ? 'bg-teal-700 text-white font-bold'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Schematic Interactive Map Canvas */}
          <div className="lg:col-span-8 bg-stone-900 rounded-3xl border border-stone-800 p-4 sm:p-5 relative overflow-hidden shadow-lg">
            {/* Map Canvas Header Bar */}
            <div className="flex items-center justify-between mb-3 text-xs text-stone-300 border-b border-stone-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-white text-xs">Active Service Grid: Sahakarnagar & North Bangalore</span>
              </div>
              <div className="hidden sm:flex items-center space-x-3 text-[11px] text-stone-400">
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 mr-1.5 inline-block" />
                  Sahakar Physio Centre (Base)
                </span>
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1.5 inline-block" />
                  Elder Living Cluster
                </span>
              </div>
            </div>

            {/* SVG Interactive Map */}
            <div className="relative w-full aspect-4/3 sm:aspect-16/10 bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 select-none">
              <svg
                viewBox="0 0 1000 650"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
              >
                <defs>
                  {/* Subtle Grid Pattern */}
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262626" strokeWidth="0.75" strokeOpacity="0.4" />
                  </pattern>

                  {/* Pulsating Clinic Marker Gradient */}
                  <radialGradient id="clinicGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#0d9488" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                  </radialGradient>

                  {/* Connecting Route Dash Gradient */}
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Base Grid */}
                <rect width="1000" height="650" fill="url(#grid)" />

                {/* Major Landmarks Background Zones */}
                {/* GKVK Green Reserve (North-West) */}
                <path
                  d="M 50 20 Q 180 30 220 150 Q 160 220 60 200 Z"
                  fill="#14532d"
                  fillOpacity="0.22"
                  stroke="#15803d"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text x="110" y="100" fill="#4ade80" fontSize="11" fontWeight="bold" opacity="0.7">
                  GKVK Agricultural Campus
                </text>
                <text x="110" y="116" fill="#86efac" fontSize="9" opacity="0.5">
                  (Botanical Green Belt)
                </text>

                {/* Hebbal Lake (East) */}
                <path
                  d="M 800 280 C 850 250, 930 260, 960 340 C 970 420, 910 500, 830 520 C 780 470, 780 330, 800 280 Z"
                  fill="#0e7490"
                  fillOpacity="0.25"
                  stroke="#0891b2"
                  strokeWidth="1.2"
                />
                <text x="850" y="390" fill="#38bdf8" fontSize="12" fontWeight="bold" opacity="0.8">
                  Hebbal Lake
                </text>
                <text x="850" y="406" fill="#7dd3fc" fontSize="9" opacity="0.6">
                  Promenade & Biodiversity
                </text>

                {/* Sahakarnagar BBMP Ground / Park (Center) */}
                <rect
                  x="420"
                  y="370"
                  width="70"
                  height="45"
                  rx="6"
                  fill="#166534"
                  fillOpacity="0.3"
                  stroke="#22c55e"
                  strokeWidth="0.8"
                />
                <text x="428" y="396" fill="#86efac" fontSize="9" fontWeight="bold" opacity="0.7">
                  BBMP Park
                </text>

                {/* Major Road Arteries */}
                {/* 1. Bellary Road (NH 44 - North to Airport, South to Hebbal Flyover) */}
                <path
                  d="M 720 0 L 730 650"
                  stroke="#404040"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 720 0 L 730 650"
                  stroke="#eab308"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  opacity="0.6"
                />
                <text x="735" y="80" fill="#a3a3a3" fontSize="10" fontWeight="bold" transform="rotate(89 735 80)">
                  Bellary Rd / NH 44 (To KIAL Airport ↑)
                </text>
                <text x="735" y="580" fill="#a3a3a3" fontSize="10" fontWeight="bold" transform="rotate(89 735 580)">
                  To Hebbal Flyover & Aster CMI ↓
                </text>

                {/* 2. Sahakarnagar 60 Feet Road (Primary Commercial Spine) */}
                <path
                  d="M 480 80 L 480 580"
                  stroke="#525252"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <text x="490" y="160" fill="#38bdf8" fontSize="10" fontWeight="bold">
                  60 Feet Road (Sahakarnagar Main Spine)
                </text>

                {/* 3. Outer Ring Road (East-West Bottom) */}
                <path
                  d="M 0 590 Q 400 570 1000 610"
                  stroke="#404040"
                  strokeWidth="10"
                />
                <text x="180" y="618" fill="#a3a3a3" fontSize="10" fontWeight="bold">
                  Outer Ring Road (ORR) → Manyata Tech Park
                </text>

                {/* 4. Kodigehalli Main Road */}
                <path
                  d="M 100 420 Q 300 400 480 370"
                  stroke="#383838"
                  strokeWidth="5"
                />
                <text x="210" y="390" fill="#737373" fontSize="9">
                  Kodigehalli Main Rd
                </text>

                {/* 5. Judicial Layout Link Road */}
                <path
                  d="M 280 180 Q 380 220 480 200"
                  stroke="#383838"
                  strokeWidth="4"
                />
                <text x="310" y="195" fill="#737373" fontSize="9">
                  Judicial Layout Double Rd
                </text>

                {/* 6. Railway Line (Hebbal - Yelahanka) */}
                <path
                  d="M 330 0 L 250 650"
                  stroke="#262626"
                  strokeWidth="3"
                  strokeDasharray="3 5"
                />
                <text x="285" y="50" fill="#525252" fontSize="8" transform="rotate(82 285 50)">
                  Railway Track (SWR)
                </text>

                {/* Concentric Service Radius Rings from Sahakar Physio Clinic (480, 338) */}
                {/* 1.5 km Core Zone */}
                <circle
                  cx="480"
                  cy="338"
                  r="130"
                  fill="#0f766e"
                  fillOpacity="0.08"
                  stroke="#0d9488"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <text x="480" y="200" textAnchor="middle" fill="#2dd4bf" fontSize="9" fontWeight="bold" opacity="0.8">
                  Core Zone (0 – 1.8 km) • 10-Min Scooter Dispatch
                </text>

                {/* 3.5 km Extended Zone */}
                <circle
                  cx="480"
                  cy="338"
                  r="260"
                  fill="#0369a1"
                  fillOpacity="0.04"
                  stroke="#0284c7"
                  strokeWidth="1.2"
                  strokeDasharray="6 6"
                  opacity="0.7"
                />
                <text x="480" y="70" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" opacity="0.7">
                  Extended Zone (1.8 – 3.5 km) • 15-Min Afternoon Slots
                </text>

                {/* 5.0 km Outer Zone */}
                <circle
                  cx="480"
                  cy="338"
                  r="380"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="1"
                  strokeDasharray="8 8"
                  opacity="0.4"
                />
                <text x="480" y="640" textAnchor="middle" fill="#94a3b8" fontSize="8" opacity="0.6">
                  Outer North Bangalore Boundary (~5.0 km)
                </text>

                {/* Dynamic Route Line from Clinic to Active/Selected Cluster */}
                {activeCluster && (
                  <g>
                    <line
                      x1="480"
                      y1="338"
                      x2={activeCluster.coord.x * 10}
                      y2={activeCluster.coord.y * 6.5}
                      stroke="url(#routeGradient)"
                      strokeWidth="2.5"
                      strokeDasharray="5 4"
                      className="animate-pulse"
                    />
                    {/* Distance Badge in the middle of line */}
                    <rect
                      x={(480 + activeCluster.coord.x * 10) / 2 - 35}
                      y={(338 + activeCluster.coord.y * 6.5) / 2 - 12}
                      width="70"
                      height="20"
                      rx="6"
                      fill="#1c1917"
                      stroke="#f59e0b"
                      strokeWidth="1"
                    />
                    <text
                      x={(480 + activeCluster.coord.x * 10) / 2}
                      y={(338 + activeCluster.coord.y * 6.5) / 2 + 2}
                      textAnchor="middle"
                      fill="#fef08a"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {activeCluster.distanceKm} km • {activeCluster.travelTime}
                    </text>
                  </g>
                )}

                {/* Apartment Cluster Pins */}
                {filteredClusters.map(cluster => {
                  const cx = cluster.coord.x * 10;
                  const cy = cluster.coord.y * 6.5;
                  const isSelected = cluster.id === activeCluster.id;
                  const isCore = cluster.category === 'core';

                  return (
                    <g
                      key={cluster.id}
                      className="cursor-pointer transition-transform duration-200"
                      onClick={() => setSelectedClusterId(cluster.id)}
                      onMouseEnter={() => setHoveredClusterId(cluster.id)}
                      onMouseLeave={() => setHoveredClusterId(null)}
                    >
                      {/* Selection Aura */}
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="26"
                          fill="#f59e0b"
                          fillOpacity="0.25"
                          stroke="#f59e0b"
                          strokeWidth="1.5"
                          className="animate-ping"
                        />
                      )}

                      {/* Cluster Dot Backing */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 15 : 12}
                        fill={isSelected ? '#f59e0b' : isCore ? '#0d9488' : '#3b82f6'}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />

                      {/* Icon inside dot */}
                      <text
                        x={cx}
                        y={cy + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={isSelected ? '11' : '9'}
                        fontWeight="bold"
                      >
                        {cluster.activeHomePatients}
                      </text>

                      {/* Cluster Name Label */}
                      <rect
                        x={cx - (cluster.name.length * 3.2)}
                        y={cy + 16}
                        width={cluster.name.length * 6.4}
                        height="16"
                        rx="4"
                        fill={isSelected ? '#1c1917' : '#0a0a0a'}
                        fillOpacity="0.88"
                        stroke={isSelected ? '#f59e0b' : '#404040'}
                        strokeWidth="0.8"
                      />
                      <text
                        x={cx}
                        y={cy + 28}
                        textAnchor="middle"
                        fill={isSelected ? '#fef08a' : '#e5e5e5'}
                        fontSize="8.5"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {cluster.name.split('&')[0].trim()}
                      </text>
                    </g>
                  );
                })}

                {/* Central Clinic Pin: Sahakar Physio Centre (480, 338) */}
                <g className="cursor-pointer" onClick={() => setSelectedClusterId('cqal-sahakar')}>
                  {/* Radar beacon waves */}
                  <circle cx="480" cy="338" r="45" fill="url(#clinicGlow)" />
                  <circle
                    cx="480"
                    cy="338"
                    r="25"
                    fill="#0f766e"
                    fillOpacity="0.3"
                    stroke="#14b8a6"
                    strokeWidth="1.5"
                    className="animate-ping"
                  />

                  {/* Main Clinic Pin Body */}
                  <circle cx="480" cy="338" r="16" fill="#0d9488" stroke="#ffffff" strokeWidth="3" />
                  <circle cx="480" cy="338" r="6" fill="#ffffff" />

                  {/* Clinic Label Badge */}
                  <g transform="translate(480, 310)">
                    <rect
                      x="-85"
                      y="-28"
                      width="170"
                      height="26"
                      rx="13"
                      fill="#134e4a"
                      stroke="#2dd4bf"
                      strokeWidth="1.5"
                    />
                    <text x="0" y="-11" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="black">
                      🏥 SAHAKAR PHYSIO CLINIC
                    </text>
                  </g>
                </g>
              </svg>

              {/* Map Floating Legend (Bottom Left) */}
              <div className="absolute bottom-2.5 left-2.5 bg-stone-900/90 backdrop-blur-xs p-2 rounded-xl border border-stone-800 text-[10px] text-stone-300 space-y-1 shadow-md">
                <div className="font-bold text-stone-200 uppercase tracking-wider text-[9px]">Map Legend</div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 border border-white" />
                  <span>Core &lt;2km (Sahakarnagar & CQAL)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white" />
                  <span>Extended 2-4km (Bellary Rd / Tata Nagar)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" />
                  <span>Selected Active Cluster</span>
                </div>
              </div>

              {/* Active Route Quick Stats (Top Right) */}
              <div className="absolute top-2.5 right-2.5 bg-stone-900/90 backdrop-blur-xs px-3 py-2 rounded-xl border border-stone-800 text-[11px] text-stone-200 shadow-md">
                <div className="text-[9px] text-teal-400 font-bold uppercase tracking-wider">Focused Cluster:</div>
                <div className="font-bold text-white truncate max-w-[170px]">{activeCluster.name}</div>
                <div className="text-[10px] text-amber-300 font-semibold mt-0.5">
                  {activeCluster.distanceKm} km • ~{activeCluster.travelTime}
                </div>
              </div>
            </div>

            {/* Micro instructions under map */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400">
              <span className="inline-flex items-center">
                <Info className="w-3.5 h-3.5 mr-1 text-teal-400" />
                Click on any pin or society name to view dedicated elder-care visiting slots and physio assignment.
              </span>
              <span className="text-stone-500 font-mono text-[10px]">
                Base: #48, 60 Feet Road, F-Block (PIN 560092)
              </span>
            </div>
          </div>

          {/* Right Inspector & Booking Card */}
          <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm space-y-4">
            {/* Cluster Status Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  activeCluster.category === 'core'
                    ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300'
                }`}>
                  {activeCluster.category === 'core' ? 'Core 10-Min Dispatch' : 'Extended Transit Route'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 mt-1.5 leading-snug">
                  {activeCluster.name}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {activeCluster.locality}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-center shrink-0">
                <div className="text-base font-black text-amber-900 dark:text-amber-200">
                  {activeCluster.distanceKm} km
                </div>
                <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                  {activeCluster.travelTime}
                </div>
              </div>
            </div>

            {/* Landmark & Society */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-1.5">
              <div className="flex items-center text-stone-700 dark:text-stone-300">
                <Building2 className="w-3.5 h-3.5 mr-1.5 text-stone-400 shrink-0" />
                <span className="font-semibold">{activeCluster.society}</span>
              </div>
              <div className="flex items-center text-stone-500 dark:text-stone-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-teal-600 shrink-0" />
                <span>Landmark: {activeCluster.landmark}</span>
              </div>
            </div>

            {/* Clinical Highlights Grid */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900">
                <div className="flex items-center space-x-1.5 text-teal-900 dark:text-teal-200 font-semibold">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span>Senior Density:</span>
                </div>
                <span className="font-bold text-teal-950 dark:text-teal-100 text-[11px]">
                  {activeCluster.elderPopulation}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center space-x-1.5 text-stone-700 dark:text-stone-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Primary Care Focus:</span>
                </div>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px]">
                  {activeCluster.keySpecialty}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center space-x-1.5 text-stone-700 dark:text-stone-300 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Assigned Visit Slots:</span>
                </div>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px]">
                  {activeCluster.visitSlots}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center space-x-1.5 text-stone-700 dark:text-stone-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Visiting Physio:</span>
                </div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">
                  {activeCluster.visitingPhysio}
                </span>
              </div>
            </div>

            {/* Active Patients Badge */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-950 dark:text-emerald-200">
                  {activeCluster.activeHomePatients} Active Elder Patients
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                Under Active Rehab
              </span>
            </div>

            {/* Booking Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => onBookHomeVisit && onBookHomeVisit(activeCluster.name)}
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-all shadow-md hover:shadow-teal-700/20 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Home Visit in this Society</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/919845021980?text=${encodeURIComponent(
                    `Hello Sahakar Physio, I would like to inquire about Home Care Physiotherapy for my elder parent at ${activeCluster.name} (${activeCluster.society}).`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center space-x-1 text-center"
                >
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  <span>WhatsApp Inquire</span>
                </a>

                {onNavigateToSection && (
                  <button
                    onClick={() => onNavigateToSection('homecare')}
                    className="py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-[11px] transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Route Ops OS</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Directory Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredClusters.map(cluster => {
            const isSelected = cluster.id === activeCluster.id;
            return (
              <div
                key={cluster.id}
                onClick={() => {
                  setSelectedClusterId(cluster.id);
                  setViewMode('map');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-teal-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {cluster.distanceKm} km • {cluster.travelTime}
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400">
                      {cluster.activeHomePatients} active
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-stone-900 dark:text-stone-100">
                    {cluster.name}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                    {cluster.society}
                  </p>

                  <div className="mt-3 p-2 rounded-xl bg-stone-50 dark:bg-stone-800 text-[11px] space-y-1">
                    <div className="text-stone-600 dark:text-stone-300 font-medium">
                      <strong>Focus:</strong> {cluster.keySpecialty}
                    </div>
                    <div className="text-stone-500 dark:text-stone-400 text-[10px]">
                      <strong>Physio:</strong> {cluster.visitingPhysio}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
                  <span>View on Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transit Fatigue & Coverage Assurance Banner */}
      <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-teal-950 dark:text-teal-100">
              Guaranteed 45-Minute 1:1 In-Home Rehab Protocol
            </div>
            <div className="text-teal-800 dark:text-teal-300 text-[11px] mt-0.5">
              Therapists are limited to 4–5 visits/day with geofenced clustering. No rushed sessions, full vitals check (BP, SpO2), and digital exercise progress logs.
            </div>
          </div>
        </div>

        <button
          onClick={() => onBookHomeVisit && onBookHomeVisit('General Sahakarnagar Inquiry')}
          className="whitespace-nowrap px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          Check My Apartment Availability →
        </button>
      </div>
    </section>
  );
};
