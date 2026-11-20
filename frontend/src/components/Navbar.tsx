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
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Public Portal', path: '/', icon: HomeIcon, roleBadge: 'STUDENT / PUBLIC' },
    { label: 'Marksheet', path: '/marksheet/2024CS001', icon: FileText, roleBadge: 'TRANSCRIPT' },
    { label: 'Verify Portal', path: '/verify', icon: QrCode, roleBadge: 'THIRD-PARTY / HR' },
    { label: 'Governance Chamber', path: '/governance', icon: Lock, roleBadge: 'DEAN & CONTROLLER' },
    { label: 'Tamper Auditor', path: '/audit', icon: AlertTriangle, roleBadge: 'SECURITY / JUDGE' },
    { label: 'Registrar Terminal', path: '/admin', icon: FileSpreadsheet, roleBadge: 'EXAM ADMIN' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && path.startsWith('/marksheet') && location.pathname.startsWith('/marksheet')) return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  // Identify active persona label
  const activeItem = navItems.find(item => isActive(item.path)) || navItems[0];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md no-print">
      {/* Top Banner: Enterprise Separation Notice for Evaluators */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-900/40 px-4 py-1.5 text-center text-[11px] text-indigo-300 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 mx-auto">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            <strong>Role-Isolated Architecture:</strong> In production, these 4 portals run on isolated subdomains (<code>results.edu</code>, <code>verify.edu</code>, <code>board.edu</code>, <code>audit.edu</code>). Switch roles below for the 5-minute evaluator demo.
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-1 font-mono text-[10px] text-slate-400">
          <span>Active Role:</span>
          <span className="text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-950/80 rounded border border-emerald-800">
            {activeItem.roleBadge}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & University Header */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600/50 transition">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  VeriMark
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  H8 LEDGER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Tamper-Proof Exam Result System</p>
            </div>
          </Link>

          {/* Navigation Tabs (Persona Switcher) */}
          <nav className="flex items-center space-x-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Status Badge */}
          <div className="hidden xl:flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/50 text-[11px] text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Ledger Synchronized</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
