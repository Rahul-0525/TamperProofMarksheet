import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, FileText, QrCode, Lock, AlertTriangle, GitBranch } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Marksheet', path: '/marksheet/2024CS001', icon: FileText },
    { label: 'Verify Portal', path: '/verify', icon: QrCode },
    { label: 'Dual Governance', path: '/governance', icon: Lock },
    { label: 'Tamper Audit', path: '/audit', icon: AlertTriangle },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/marksheet') && location.pathname.startsWith('/marksheet')) return true;
    return location.pathname === path;
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md no-print">
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

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Branch Pill & Status */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700/80 text-xs text-slate-300 font-mono">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>feature/frontend-ui</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/50 text-[11px] text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Ledger v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
