import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  QrCode,
  Lock,
  AlertTriangle,
  FileSpreadsheet,
  Home as HomeIcon,
  ShieldCheck,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Public Portal', path: '/', icon: HomeIcon, roleBadge: 'STUDENT / PUBLIC', desc: 'University results search' },
    { label: 'Marksheet', path: '/marksheet', icon: FileText, roleBadge: 'TRANSCRIPT', desc: 'Official grade transcript' },
    { label: 'Verify Portal', path: '/verify', icon: QrCode, roleBadge: 'THIRD-PARTY / HR', desc: 'QR cryptographic proof' },
    { label: 'Governance Chamber', path: '/governance', icon: Lock, roleBadge: 'DEAN & CONTROLLER', desc: 'Dual-key Ed25519 signing' },
    { label: 'Tamper Auditor', path: '/audit', icon: AlertTriangle, roleBadge: 'SECURITY / AUDITOR', desc: 'Direct SQL tamper detection' },
    { label: 'Registrar Terminal', path: '/admin', icon: FileSpreadsheet, roleBadge: 'REGISTRAR ADMIN', desc: 'Batch Merkle tree publishing' },
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
    setMobileMenuOpen(false); // close drawer on route change
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
      {/* Sleek LPU Top Institutional Bar (Responsive & Spacey with Radial Mist) */}
      <div className="navbar-top-institution px-4 sm:px-8 py-2 text-xs text-pine-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-[11px] truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shadow-sm shadow-[#fbbf24]/50 flex-shrink-0 animate-pulse" />
            <span className="font-semibold text-white tracking-wide truncate">Lovely Professional University</span>
            <span className="text-pine-400 hidden sm:inline">&bull;</span>
            <span className="text-pine-300 hidden sm:inline">Division of Examinations</span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[10px] flex-shrink-0">
            <span className="text-pine-400 hidden md:inline">Current View:</span>
            <span className="text-[#fbbf24] font-bold px-2.5 py-0.5 bg-[#f59e0b]/15 rounded-full border border-[#f59e0b]/30">
              {navItems[activeIndex]?.roleBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Main Glass Floating Header with Radial Gradient Lighting */}
      <div className="navbar-radial-glow px-4 sm:px-8 lg:px-10 shadow-xl">
        <div className="max-w-7xl mx-auto h-18 sm:h-20 flex items-center justify-between">
          {/* TruGrade Logo */}
          <Link to="/" className="flex items-center space-x-3 group select-none">
            <div className="w-9 h-9 rounded-2xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#fbbf24] shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center tracking-tight">
                <span className="font-display text-2xl font-black text-white group-hover:text-pine-100 transition">
                  Tru
                </span>
                <span className="font-display text-2xl font-black text-[#fbbf24] group-hover:text-[#f59e0b] transition">
                  Grade
                </span>
              </div>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-pine-300 font-mono -mt-1 hidden sm:block">
                LPU Academic Ledger
              </span>
            </div>
          </Link>

          {/* Desktop Sliding Capsule Navigation - Spacey & Relaxed */}
          <nav
            ref={navContainerRef}
            className="relative hidden lg:flex items-center p-1.5 bg-black/35 border border-white/[0.12] rounded-full overflow-x-auto shadow-inner space-x-1"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* The Animated Sliding Glass Pill */}
            <div
              className="absolute top-1.5 bottom-1.5 bg-white/[0.16] border border-white/[0.28] rounded-full shadow-md pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
                  className={`relative z-10 flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 whitespace-nowrap active:scale-95 ${
                    isSelected || isHovered
                      ? 'text-white'
                      : 'text-pine-200/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Desktop Verify Pill + Mobile Hamburger Toggle */}
          <div className="flex items-center space-x-3">
            <Link
              to="/verify"
              className="hidden sm:flex btn-pill-white px-5 py-2.5 text-xs font-bold items-center space-x-2 active:scale-95"
            >
              <QrCode className="w-4 h-4 text-[#0a0f09]" />
              <span>Verify Marksheet</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/10 transition active:scale-95"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#fbbf24]" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Full Touch-Friendly Experience) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[88px] bottom-0 bg-black/80 backdrop-blur-2xl z-40 p-4 overflow-y-auto animate-fadeIn border-t border-white/10">
          <div className="max-w-md mx-auto space-y-2.5 pb-20">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-pine-400">
              Select Portal Mode
            </div>

            {navItems.map((item, idx) => {
              const isSelected = activeIndex === idx;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#18362d] border-[#fbbf24]/50 shadow-lg'
                      : 'bg-white/[0.05] border-white/[0.08] hover:bg-white/[0.1]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${
                      isSelected ? 'bg-[#fbbf24]/20 text-[#fbbf24]' : 'bg-white/[0.08] text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">{item.label}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-pine-300">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.08] text-pine-200">
                      {item.roleBadge.split('/')[0]}
                    </span>
                    <ChevronRight className="w-4 h-4 text-pine-400" />
                  </div>
                </Link>
              );
            })}

            <div className="pt-4">
              <Link
                to="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-pill-white w-full py-3 text-xs font-bold flex items-center justify-center space-x-2"
              >
                <QrCode className="w-4 h-4 text-[#0e1c19]" />
                <span>Open Instant QR Scanner</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
