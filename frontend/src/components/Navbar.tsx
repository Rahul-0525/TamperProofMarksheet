import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  QrCode,
  Lock,
  AlertTriangle,
  FileSpreadsheet,
  Home as HomeIcon,
  ChevronRight
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
      {/* Sleek LPU Top Bar */}
      <div className="bg-[#050608]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#ff6b00]" />
            <span className="font-semibold text-slate-300">Lovely Professional University</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400">Division of Student Welfare &amp; Academic Examinations</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 font-mono text-[10px]">
            <span className="text-slate-500">Current Portal:</span>
            <span className="text-[#ff8a34] font-semibold px-2 py-0.5 bg-[#ff6b00]/10 rounded border border-[#ff6b00]/20">
              {navItems[activeIndex]?.roleBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Main Glassy Frosted Navigation Bar */}
      <div className="glass-frosted-nav px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          {/* TruGrade Wordmark Logo */}
          <Link to="/" className="flex items-center space-x-3 group select-none">
            <div className="flex flex-col">
              <div className="flex items-center tracking-tight">
                <span className="font-display text-2xl font-black text-white group-hover:text-slate-100 transition">
                  Tru
                </span>
                <span className="font-display text-2xl font-black text-[#ff6b00] group-hover:text-[#ff8533] transition">
                  Grade
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] ml-1 self-end mb-1.5 group-hover:scale-125 transition" />
              </div>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-slate-400 font-mono -mt-1">
                LPU Academic Ledger
              </span>
            </div>
          </Link>

          {/* Smooth Sliding Pill Navigation Menu */}
          <nav
            ref={navContainerRef}
            className="relative flex items-center p-1 bg-black/40 border border-white/[0.08] rounded-xl overflow-x-auto shadow-inner"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* The Animated Sliding Pill */}
            <div
              className="absolute top-1 bottom-1 bg-gradient-to-r from-[#ff6b00] to-[#ea580c] rounded-lg shadow-lg shadow-[#ff6b00]/25 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: `${pillStyle.left}px`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.opacity,
              }}
            />

            {navItems.map((item, idx) => {
              const isSelected = activeIndex === idx;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onMouseEnter={() => setHoverIndex(idx)}
                  className={`relative z-10 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 whitespace-nowrap active:scale-95 ${
                    isSelected
                      ? 'text-white'
                      : hoverIndex === idx
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
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
