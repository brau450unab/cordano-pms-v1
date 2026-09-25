'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  LayoutGrid,
  Lock,
  LayoutDashboard,
  Moon,
  FileBarChart2,
  Settings,
  Users,
  BookOpen,
  Camera,
  Search,
  Sparkles,
  Eye,
  X,
  LogOut,
  ShieldCheck,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { ParkingSlot } from '@/types';

interface LaunchpadItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  shortcut: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LAUNCHPAD_ITEMS: LaunchpadItem[] = [
  {
    id: 'garita',
    title: 'Garita / POS',
    subtitle: 'Check-in y cobro 40/60',
    href: '/',
    shortcut: 'F1',
    icon: Car,
  },
  {
    id: 'layout',
    title: 'Layout Plazas',
    subtitle: 'Matriz 30 cupos + Sobrecupo',
    href: '/',
    shortcut: 'F2',
    icon: LayoutGrid,
  },
  {
    id: 'arqueo',
    title: 'Arqueo Ciego',
    subtitle: 'Declaración física antifraude',
    href: '/',
    shortcut: 'F3',
    icon: Lock,
  },
  {
    id: 'panel',
    title: 'Panel de Control',
    subtitle: 'KPIs, barreras y auditoría PIN',
    href: '/admin',
    shortcut: 'F4',
    icon: LayoutDashboard,
  },
  {
    id: 'convenios',
    title: 'Convenios y Noche',
    subtitle: 'Abonados y pernoctas en paralelo',
    href: '/convenios',
    shortcut: 'F5',
    icon: Moon,
  },
  {
    id: 'reportes',
    title: 'Reportes y Estadísticas',
    subtitle: 'Gráfico horario y Reporte Z SHA-256',
    href: '/reportes',
    shortcut: 'F6',
    icon: FileBarChart2,
  },
  {
    id: 'configuracion',
    title: 'Configuraciones',
    subtitle: 'Motor tarifas e impresora 80mm',
    href: '/configuracion',
    shortcut: 'F7',
    icon: Settings,
  },
  {
    id: 'usuarios',
    title: 'Usuarios',
    subtitle: 'RBAC, PINs y segregación de caja',
    href: '/admin/usuarios',
    shortcut: 'F8',
    icon: Users,
  },
  {
    id: 'manuales',
    title: 'Manuales y Soporte',
    subtitle: 'Flujo SOP 6 fases y contingencia',
    href: '/documentacion',
    shortcut: 'F9',
    icon: BookOpen,
  },
];

export default function HubPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMockupModal, setShowMockupModal] = useState(false);

  // Estado interactivo de las 4 Barreras del Panel de Control (Mockup #2)
  const [gates, setGates] = useState([
    { id: 1, name: 'Gate 1 (Main Entry)', status: 'OPEN' as 'OPEN' | 'CLOSED' },
    { id: 2, name: 'Gate 2 (Main Exit)', status: 'CLOSED' as 'OPEN' | 'CLOSED' },
    { id: 3, name: 'Gate 3 (Emergency)', status: 'CLOSED' as 'OPEN' | 'CLOSED' },
    { id: 4, name: 'Gate 4 (VIP Area)', status: 'OPEN' as 'OPEN' | 'CLOSED' },
  ]);

  useEffect(() => {
    fetch('/api/slots')
      .then((r) => r.json())
      .then((data) => {
        if (data?.slots) setSlots(data.slots);
      })
      .catch(() => {});
  }, []);

  // Atajos F1-F9 para abrir módulos desde el Launchpad
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const match = LAUNCHPAD_ITEMS.find((item) => item.shortcut === e.key);
      if (match) {
        e.preventDefault();
        router.push(match.href);
      } else if (e.key === 'Escape') {
        setShowMockupModal(false);
      }
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const occupiedCount = slots.filter((s) => s.estado !== 'DISPONIBLE').length || 24;
  const totalSlots = 30;
  const occupancyPct = Math.round((occupiedCount / totalSlots) * 100);

  const filteredItems = LAUNCHPAD_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleGate = (id: number, nextStatus: 'OPEN' | 'CLOSED') => {
    setGates((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: nextStatus } : g))
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-slate-900 flex flex-col font-sans">
      {/* ===================================================================== */}
      {/* 1. CABECERA SUPERIOR OSCURA ESTILO ODOO / macOS SONOMA (#1A1C1D)      */}
      {/* ===================================================================== */}
      <header className="h-14 bg-[#1A1C1D] text-white px-5 flex items-center justify-between border-b border-black/30 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-4">
          {/* Semáforo macOS */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>

          <div className="h-4 w-[1px] bg-white/15" />

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#80093A] flex items-center justify-center font-black text-xs text-white shadow-xs">
              C
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              ParkOps PMS Cordano
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              | Application switcher
            </span>
          </div>
        </div>

        {/* Buscador Central estilo Spotlight / Odoo */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules, shortcuts (F1–F9)..."
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#80093A] focus:bg-white/15 transition"
            />
          </div>
        </div>

        {/* Controles Derecha: Cámaras CCTV, Mockup #2, Usuario y Salida */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/cctv"
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">CCTV LPR</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowMockupModal(true)}
            className="px-3 py-1.5 rounded-xl bg-[#80093A] hover:bg-[#68072f] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mockup #2</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-200">Admin User</span>
          </div>

          <Link
            href="/landing"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition"
            title="Volver al Portal Interno"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. CUERPO DIVIDIDO: MENÚ CENTRAL LAUNCHPAD (IZQ) + PANEL CONTROL (DER)*/}
      {/* ===================================================================== */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-5 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ----------------------------------------------------------------- */}
        {/* IZQUIERDA (6 Cols): MENÚ CENTRAL (Odoo / macOS Launchpad)         */}
        {/* ----------------------------------------------------------------- */}
        <section className="lg:col-span-6 bg-white rounded-3xl border border-[#E2E2E4] shadow-[0_6px_20px_rgba(0,0,0,0.04)] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#80093A] block">
                Inspired by Odoo, en macOS Launchpad
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Menú Central
              </h1>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#F3F4F6] border border-slate-200 text-[11px] font-mono font-bold text-slate-600">
              Serrano 447 · Iquique
            </span>
          </div>

          {/* Grilla 3x3 de Squircles Burdeos (Mockup #2) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group bg-[#F9F9FB] hover:bg-white rounded-2xl border border-slate-200/90 hover:border-[#80093A]/40 p-4 flex flex-col items-center text-center gap-3 transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-[18px] macos-launchpad-card flex items-center justify-center text-white shadow-md">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <kbd className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200 font-mono text-[10px] font-extrabold shadow-2xs">
                      {item.shortcut}
                    </kbd>
                  </div>

                  <div>
                    <h2 className="text-xs font-extrabold text-slate-900 group-hover:text-[#80093A] transition">
                      {item.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pie rápido con acceso a CCTV y Portal Interno */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Presiona <strong className="font-mono text-slate-800">F1–F9</strong> para abrir cualquier módulo directamente.
            </span>
            <div className="flex items-center gap-3 font-bold text-[#80093A]">
              <Link href="/cctv" className="hover:underline">
                Cámaras LPR →
              </Link>
              <Link href="/landing" className="hover:underline">
                Portal Interno →
              </Link>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* DERECHA (6 Cols): PANEL DE CONTROL EJECUTIVO (Mockup #2)          */}
        {/* ----------------------------------------------------------------- */}
        <section className="lg:col-span-6 bg-white rounded-3xl border border-[#E2E2E4] shadow-[0_6px_20px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Executive Real-Time Telemetry
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Panel de Control
              </h2>
            </div>
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl bg-[#80093A] hover:bg-[#68072f] text-white text-xs font-bold transition shadow-xs"
            >
              Abrir Vista Completa →
            </Link>
          </div>

          {/* 1. Fila de 4 Tarjetas KPI (Tabular-Nums) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200/90">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Occupancy
              </span>
              <div className="text-lg font-mono font-black text-slate-900 tabular-nums mt-1">
                {occupiedCount}/{totalSlots}{' '}
                <span className="text-xs text-[#80093A]">({occupancyPct}%)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#80093A] rounded-full"
                  style={{ width: `${Math.min(100, occupancyPct)}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200/90">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Daily Revenue
              </span>
              <div className="text-lg font-mono font-black text-emerald-700 tabular-nums mt-1">
                $185.000
              </div>
              <span className="text-[10px] font-mono text-slate-400">CLP Rotativo Hoy</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200/90">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Active Shifts
              </span>
              <div className="text-lg font-mono font-black text-slate-900 tabular-nums mt-1">
                2
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                ● Turno Mañana
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                Alerts
              </span>
              <div className="text-lg font-mono font-black text-rose-700 tabular-nums mt-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>1</span>
              </div>
              <span className="text-[10px] font-mono text-rose-600">
                Sobrestadía A-04
              </span>
            </div>
          </div>

          {/* 2. Real-Time Gate Controls (Barreras 1 a 4 como en Mockup #2) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Real-Time Gate Controls (Serrano 447)
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Relé IP & LPR Activo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {gates.map((gate) => (
                <div
                  key={gate.id}
                  className="p-3 rounded-2xl bg-[#F9F9FB] border border-slate-200/90 flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {gate.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold mt-0.5 ${
                        gate.status === 'OPEN' ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                    >
                      {gate.status === 'OPEN' ? (
                        <Unlock className="w-3 h-3" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}
                      <span>Status: {gate.status}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleGate(gate.id, 'OPEN')}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-extrabold transition cursor-pointer ${
                        gate.status === 'OPEN'
                          ? 'bg-[#10B981] text-white shadow-2xs'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      OPEN
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleGate(gate.id, 'CLOSED')}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-extrabold transition cursor-pointer ${
                        gate.status === 'CLOSED'
                          ? 'bg-[#EF4444] text-white shadow-2xs'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. AI Operational Summary (Mockup #2) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#80093A]/8 via-[#80093A]/4 to-transparent border border-[#80093A]/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#80093A] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI Operational Summary · Gemini 2.5 Pro</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                Actualizado hace 1 min
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Peak occupancy expected at <strong className="font-mono">14:00</strong>. All systems nominal. Sector A registra <strong className="font-mono">85%</strong> de ocupación rotativa; se sugiere habilitar fila central de sobrecupo (<strong className="font-mono">SC-01 a SC-05</strong>) entre las 13:00 y 15:30 hrs.
            </p>
          </div>
        </section>
      </main>

      {/* Modal de Referencia Visual Mockup #2 */}
      {showMockupModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowMockupModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 max-w-5xl w-full p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Lámina Oficial Mockup #2 · Menú Central Launchpad + Panel de Control
                </h3>
                <p className="text-xs text-slate-500">
                  Especificación Canónica V2.0 consolidada en PRD & Catálogo de Estructuras
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMockupModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src="/mockups/ui_menu_central_launchpad_y_panel_control.jpg"
                alt="Mockup Oficial Menú Central y Panel de Control"
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
