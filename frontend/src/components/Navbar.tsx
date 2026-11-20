import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  QrCode,
  Lock,
  AlertTriangle,
  FileSpreadsheet,
  Home as HomeIcon,
  Layers,
  Sparkles,
  Cpu
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Public Portal', path: '/', icon: HomeIcon, roleBadge: 'STUDENT / PUBLIC' },
    { label: 'Marksheet', path: '/marksheet/2024CS001', icon: FileText, roleBadge: 'TRANSCRIPT' },
    { label: 'Verify Portal', path: '/verify', icon: QrCode, roleBadge: 'THIRD-PARTY / HR' },
    { label: 'Governance Chamber', path: '/governance', icon: Lock, roleBadge: 'DEAN & CONTROLLER' },
    { label: 'Tamper Auditor', path: '/audit', icon: AlertTriangle, roleBadge: 'SECURITY / AUDITOR' },
    { label: 'Registrar Terminal', path: '/admin', icon: FileSpreadsheet, roleBadge: 'REGISTRAR ADMIN' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && path.startsWith('/marksheet') && location.pathname.startsWith('/marksheet')) return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  const activeItem = navItems.find(item => isActive(item.path)) || navItems[0];

  return (
    <header className="sticky top-0 z-50 no-print transition-all duration-300">
      {/* Sleek Top Banner: Role Architecture Indicator */}
      <div className="bg-[#080c14]/90 backdrop-blur-md border-b border-white/[0.06] px-4 py-1.5 text-center text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2 mx-auto">
          <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>
            <strong className="text-slate-200">Decoupled Enterprise Architecture:</strong> In production, each portal is isolated on internal subdomains (<code className="text-indigo-300">results.edu</code>, <code className="text-indigo-300">verify.edu</code>, <code className="text-indigo-300">board.edu</code>, <code className="text-indigo-300">audit.edu</code>).
          </span>
        </div>
        <div className="hidden lg:flex items-center space-x-2 font-mono text-[10px]">
          <span className="text-slate-500">Active Context:</span>
          <span className="text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            {activeItem.roleBadge}
          </span>
        </div>
      </div>

      {/* Main Floating Glass Dock Navbar */}
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto glass-dock rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & University Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition">
                <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition duration-300" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-200 transition">
                  VeriMark
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 rounded-md tracking-wider">
                  H8 LEDGER
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Cryptographic Result Authority</p>
            </div>
          </Link>

          {/* Navigation Pill Dock */}
          <nav className="flex items-center space-x-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-x-auto">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Live Ledger Status Pill */}
          <div className="hidden xl:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-medium">
              <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Ledger Active &bull; 1.4s Batch</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
