import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  QrCode,
  Lock,
  AlertTriangle,
  FileSpreadsheet,
  Home as HomeIcon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const navItems = [
    { label: 'Public Portal', path: '/', icon: HomeIcon, roleBadge: 'STUDENT / PUBLIC' },
    { label: 'Marksheet', path: '/marksheet/2024CS001', icon: FileText, roleBadge: 'TRANSCRIPT' },
    { label: 'Verify Portal', path: '/verify', icon: QrCode, roleBadge: 'THIRD-PARTY / HR' },
    { label: 'Governance Chamber', path: '/governance', icon: Lock, roleBadge: 'DEAN & CONTROLLER' },
    { label: 'Tamper Auditor', path: '/audit', icon: AlertTriangle, roleBadge: 'SECURITY / AUDITOR' },
    { label: 'Registrar Terminal', path: '/admin', icon: FileSpreadsheet, roleBadge: 'REGISTRAR ADMIN' },
  ];

  const getActiveIndex = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname.startsWith('/marksheet')) return 1;
    if (location.pathname === '/verify') return 2;
    if (location.pathname === '/governance') return 3;
    if (location.pathname === '/audit') return 4;
    if (location.pathname === '/admin') return 5;
    return 0;
  };

  const [activeIndex, setActiveIndex] = useState(getActiveIndex());
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const targetIndex = hoverIndex !== null ? hoverIndex : activeIndex;

  useEffect(() => {
    setActiveIndex(getActiveIndex());
  }, [location.pathname]);

  // Update sliding pill position dynamically based on active or hovered item
  useEffect(() => {
    const activeEl = itemRefs.current[targetIndex];
    if (activeEl && navContainerRef.current) {
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  }, [targetIndex, location.pathname]);

  return (
    <header className="sticky top-0 z-50 no-print transition-all duration-300">
      {/* Sleek LPU Top Bar with Deep Eggplant & Coral Accent */}
      <div className="bg-[#2D142C] text-slate-300 px-4 py-1.5 text-xs border-b border-[#510A32]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#EE4540] animate-pulse" />
            <span className="font-semibold text-white">Lovely Professional University</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-300">Division of Student Welfare &amp; Academic Examinations</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 font-mono text-[10px]">
            <span className="text-slate-400">Current Portal:</span>
            <span className="text-[#EE4540] font-bold px-2 py-0.5 bg-[#EE4540]/15 rounded border border-[#EE4540]/25">
              {navItems[activeIndex]?.roleBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Main Glassy Frosted Navigation Bar in Lighter Aesthetic */}
      <div className="glass-frosted-nav px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          {/* TruGrade Wordmark Logo */}
          <Link to="/" className="flex items-center space-x-3 group select-none">
            <div className="flex flex-col">
              <div className="flex items-center tracking-tight">
                <span className="font-display text-2xl font-black text-[#2D142C] group-hover:text-[#510A32] transition">
                  Tru
                </span>
                <span className="font-display text-2xl font-black text-[#EE4540] group-hover:text-[#C72C41] transition">
                  Grade
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C72C41] ml-1 self-end mb-1.5 group-hover:scale-125 transition" />
              </div>
              <span className="text-[9px] font-bold tracking-wider uppercase text-[#801336]/80 font-mono -mt-1">
                LPU Academic Ledger
              </span>
            </div>
          </Link>

          {/* Smooth Sliding Pill Navigation Menu */}
          <nav
            ref={navContainerRef}
            className="relative flex items-center p-1 bg-[#2D142C]/[0.04] border border-[#801336]/10 rounded-xl overflow-x-auto shadow-sm"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* The Animated Sliding Pill with Coral to Ruby Gradient */}
            <div
              className="absolute top-1 bottom-1 bg-gradient-to-r from-[#EE4540] to-[#C72C41] rounded-lg shadow-md shadow-[#EE4540]/30 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: `${pillStyle.left}px`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.opacity,
              }}
            />

            {navItems.map((item, idx) => {
              const isSelected = activeIndex === idx;
              const isHovered = hoverIndex === idx;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onMouseEnter={() => setHoverIndex(idx)}
                  className={`relative z-10 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 whitespace-nowrap active:scale-95 ${
                    isSelected || isHovered
                      ? 'text-white'
                      : 'text-[#510A32] hover:text-[#2D142C]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
