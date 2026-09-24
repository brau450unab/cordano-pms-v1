'use client';

import React from 'react';
import Link from 'next/link';
import {
  Car,
  LayoutGrid,
  Clock,
  ShieldCheck,
  Cloud,
  UserCheck,
  Video,
  Smartphone,
  Keyboard
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'pos' | 'slots' | 'shifts' | 'audit' | 'cloudrun';
  setActiveTab: (tab: 'pos' | 'slots' | 'shifts' | 'audit' | 'cloudrun') => void;
  disponibles: number;
  ocupados: number;
  isTouchMode?: boolean;
  onToggleTouchMode?: () => void;
  onOpenCctv?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  disponibles,
  ocupados,
  isTouchMode = false,
  onToggleTouchMode,
  onOpenCctv,
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Nombre del Proyecto */}
          <div className="flex items-center space-x-3">
            <Link href="/landing" className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center shadow-md hover:scale-105 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cordano-logo.png" alt="Cordano Logo" className="w-full h-full object-contain p-0.5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-wide text-white font-sans">PARKOPS CORDANO</span>
                <span className="bg-[#80093A]/30 text-[#ffb1c2] border border-[#80093A]/60 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  V4.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Serrano 447, Iquique • 30 Plazas</p>
            </div>
          </div>

          {/* Navegación por pestañas con atajos Keyboard-First */}
          <nav className="hidden md:flex space-x-1 sm:space-x-1.5">
            <button
              onClick={() => setActiveTab('pos')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'pos'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>POS Garita</span>
              <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[9px] font-mono bg-sky-950/60 rounded border border-sky-400/40 text-sky-200">
                F1
              </kbd>
            </button>

            <button
              onClick={() => setActiveTab('slots')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'slots'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Plano 30 Slots</span>
              <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[9px] font-mono bg-sky-950/60 rounded border border-sky-400/40 text-sky-200">
                F3
              </kbd>
            </button>

            <button
              onClick={() => setActiveTab('shifts')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'shifts'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Caja Ciega</span>
              <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[9px] font-mono bg-sky-950/60 rounded border border-sky-400/40 text-sky-200">
                F8
              </kbd>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'audit'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Auditoría</span>
            </button>

            <button
              onClick={() => setActiveTab('cloudrun')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'cloudrun'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4 text-emerald-300" />
              <span>Cloud Run</span>
            </button>
          </nav>

          {/* Estado de Slots, Botón CCTV y Switch Táctil */}
          <div className="flex items-center space-x-3">
            {/* Ocupación en Vivo */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono tabular-nums">
              <span className="flex items-center text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                {disponibles} Libres
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-amber-400 font-semibold">{ocupados} Ocupados</span>
            </div>

            {/* Acceso a Cámaras CCTV */}
            {onOpenCctv && (
              <button
                onClick={onOpenCctv}
                title="Ver Cámaras CCTV Garita Serrano 447"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-400 border border-slate-700 transition flex items-center gap-1.5 text-xs"
              >
                <Video className="w-4 h-4 text-sky-400" />
                <span className="hidden xl:inline text-[11px]">CCTV</span>
              </button>
            )}

            {/* Toggle Modo Táctil / Teclado */}
            {onToggleTouchMode && (
              <button
                onClick={onToggleTouchMode}
                title={isTouchMode ? 'Modo Táctil Activo (Botones extra grandes)' : 'Modo Garita Keyboard-First Activo'}
                className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs ${
                  isTouchMode
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {isTouchMode ? (
                  <>
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span className="hidden xl:inline text-[11px]">Táctil</span>
                  </>
                ) : (
                  <>
                    <Keyboard className="w-4 h-4 text-sky-400" />
                    <span className="hidden xl:inline text-[11px]">Garita</span>
                  </>
                )}
              </button>
            )}

            <div className="hidden lg:flex items-center space-x-2 text-xs border-l border-slate-700 pl-3">
              <Link
                href="/hub"
                className="text-[#ffb1c2] hover:text-white text-[11px] font-bold transition flex items-center gap-1 bg-[#80093A]/30 px-2 py-1 rounded-lg border border-[#80093A]/50"
              >
                <span>Launchpad Hub</span>
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                href="/admin"
                className="text-amber-300 hover:text-white text-[11px] font-bold transition flex items-center gap-1"
              >
                <span>Admin ERP</span>
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                href="/documentacion"
                className="text-slate-300 hover:text-white text-[11px] transition"
              >
                SOP
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                href="/landing"
                className="text-slate-400 hover:text-white text-[11px] transition"
              >
                Portal
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                href="/login"
                className="text-[#ffb1c2] hover:text-white text-[11px] font-semibold transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Móvil de Pestañas Inferior para Celulares */}
      <div className="md:hidden flex justify-around bg-slate-950 py-2 border-t border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex flex-col items-center py-1 px-2 ${
            activeTab === 'pos' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Car className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">POS</span>
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={`flex flex-col items-center py-1 px-2 ${
            activeTab === 'slots' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Slots</span>
        </button>
        <button
          onClick={() => setActiveTab('shifts')}
          className={`flex flex-col items-center py-1 px-2 ${
            activeTab === 'shifts' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Caja</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex flex-col items-center py-1 px-2 ${
            activeTab === 'audit' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Auditoría</span>
        </button>
      </div>
    </header>
  );
};
