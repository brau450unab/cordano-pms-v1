'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Car,
  LayoutGrid,
  Moon,
  Vault,
  FileBarChart,
  Settings,
  Users,
  BookOpen,
  Wifi,
  Camera,
  ChevronLeft,
  ChevronRight,
  User,
  RefreshCw,
  Grid,
  Home
} from 'lucide-react';

interface MacOSNavigationShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  roleLabel?: string;
  rightActions?: React.ReactNode;
  hideSidebarByDefault?: boolean;
}

export const MacOSNavigationShell: React.FC<MacOSNavigationShellProps> = ({
  children,
  title = 'ParkOps PMS · Cordano Serrano 447',
  subtitle,
  roleLabel,
  rightActions,
  hideSidebarByDefault = false,
}) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(hideSidebarByDefault);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('es-CL', {
          timeZone: 'America/Santiago',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { label: 'Garita POS', href: '/', shortcut: 'F1', icon: Car },
    { label: 'Menú Central', href: '/admin', shortcut: 'F2', icon: LayoutGrid },
    { label: 'Convenios Noche', href: '/convenios', shortcut: 'F3', icon: Moon },
    { label: 'Arqueo Caja', href: '/admin?tab=shifts', shortcut: 'F4', icon: Vault },
    { label: 'Reportes Z', href: '/reportes', shortcut: 'F5', icon: FileBarChart },
    { label: 'Configuración', href: '/configuracion', shortcut: 'F6', icon: Settings },
    { label: 'Usuarios PIN', href: '/admin/usuarios', shortcut: 'F7', icon: Users },
    { label: 'Manuales SOP', href: '/documentacion', shortcut: 'F8', icon: BookOpen },
    { label: 'Monitoreo CCTV', href: '/cctv', shortcut: 'F9', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-[#1D1D1F] flex flex-col font-sans selection:bg-[#80093A] selection:text-white">
      {/* Top macOS Sonoma / Sequoia Menubar */}
      <header className="h-13 px-4 py-2.5 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/landing"
              title="Ir a Portal Institucional"
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition"
            />
            <Link
              href="/hub"
              title="Ir a Panel de Control"
              className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition"
            />
            <Link
              href="/admin"
              title="Maximizar / Menú Central"
              className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition"
            />
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="w-7 h-7 rounded-lg bg-[#80093A] text-white font-extrabold text-xs flex items-center justify-center shadow-sm hover:bg-[#60062B] transition"
            >
              C
            </Link>
            <div>
              <span className="text-xs font-bold tracking-tight text-slate-900 block leading-tight">
                {title}
              </span>
              {subtitle && (
                <span className="text-[10px] text-slate-500 font-mono block leading-tight">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Status Pills & Actions */}
        <div className="flex items-center gap-2.5 font-mono text-xs tabular-nums">
          <span className="hidden md:inline-flex px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 items-center gap-1.5 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online · Sync OK
          </span>

          <span className="hidden lg:inline-flex px-3 py-1 rounded-full bg-[#80093A]/10 text-[#80093A] border border-[#80093A]/20 font-semibold text-[11px]">
            Turno Mañana · Op: Ana R. | Fondo: $50.000
          </span>

          <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
            {currentTime || '12:00:00'} CLT
          </span>

          {rightActions}
        </div>
      </header>

      {/* Main Body with Collapsible Lateral Menu (Mockup #5) */}
      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`${
            collapsed ? 'w-16' : 'w-64'
          } bg-white border-r border-slate-200/80 p-3 flex flex-col justify-between shrink-0 transition-all duration-200 select-none`}
        >
          <div className="space-y-3">
            {/* Brand & Collapse Header */}
            <div className="flex items-center justify-between px-1 pt-1">
              {!collapsed && (
                <Link href="/landing" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border-2 border-[#80093A] flex items-center justify-center text-[#80093A] font-black text-sm">
                    C
                  </div>
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    Cordano
                  </span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                title={collapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition mx-auto sm:mx-0"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            {/* Operator Shift Card */}
            {!collapsed && (
              <Link
                href="/login"
                className="p-2.5 rounded-2xl bg-[#F9F9FB] border border-slate-200/90 flex items-center justify-between hover:border-[#80093A]/40 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#80093A]">
                      Operador Shifts
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">Ana R. · Garita #1</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            )}

            {/* Navigation Items with F1-F9 Badges */}
            <nav className="space-y-1 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href.split('?')[0]);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={`${item.label} (${item.shortcut})`}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#80093A] text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </span>
                    {!collapsed && (
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold tabular-nums ${
                          isActive
                            ? 'bg-white text-[#80093A]'
                            : 'bg-[#80093A]/10 text-[#80093A]'
                        }`}
                      >
                        {item.shortcut}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sync Status Card */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {!collapsed ? (
              <div className="p-3 rounded-2xl bg-[#F9F9FB] border border-slate-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <p className="font-bold text-slate-800 text-[11px] leading-tight">Sync status</p>
                    <p className="text-[10px] text-slate-500 font-mono">Cloud Run + IndexedDB</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
            ) : (
              <div className="flex justify-center py-2" title="Sync status: Online">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};
