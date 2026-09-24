'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  LayoutGrid,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  Video,
  Users,
  ArrowRight,
  LogOut,
  Sparkles,
  Building2,
  BookOpen,
} from 'lucide-react';
import { ParkingSlot, Shift } from '@/types';

export default function HubPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('Operador Garita');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-CL', {
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const r = sessionStorage.getItem('parkops_active_role');
      if (r === 'admin') setUserRole('Administrador ERP');
    }

    Promise.all([
      fetch('/api/slots').then((r) => r.json()).catch(() => ({ slots: [] })),
    ]).then(([resSlots]) => {
      if (resSlots.slots) setSlots(resSlots.slots);
    });
  }, []);

  const totalSlots = 30;
  const occupiedSlots = slots.filter((s) => s.estado === 'OCUPADO').length;
  const availableSlots = totalSlots - occupiedSlots;
  const occupancyPercentage = Math.round((occupiedSlots / totalSlots) * 100);

  const sections = [
    {
      category: 'Operación & Garita',
      categoryDesc: 'Control vehicular, tickets y cámaras',
      modules: [
        {
          title: 'Punto de Venta (POS)',
          subtitle: 'Check-in y cobro unificado con mapa físico',
          icon: Car,
          href: '/',
          shortcut: 'F1',
          stats: `${availableSlots} plazas disponibles`,
        },
        {
          title: 'CCTV Garita',
          subtitle: 'Monitoreo de barreras y LPR en vivo',
          icon: Video,
          href: '/cctv',
          shortcut: 'C',
          stats: 'Cámaras operativas',
        },
      ],
    },
    {
      category: 'Finanzas & Auditoría',
      categoryDesc: 'Caja ciega, balances y antifraude',
      modules: [
        {
          title: 'Reportes Financieros',
          subtitle: 'Métricas P&L y exportación Excel/PDF',
          icon: FileSpreadsheet,
          href: '/reportes',
          shortcut: 'R',
          stats: 'Reporte Z',
        },
        {
          title: 'Auditoría & Antifraude',
          subtitle: 'Inspección de excepciones y autorizaciones',
          icon: ShieldCheck,
          href: '/admin',
          shortcut: 'A',
          stats: 'Trazabilidad 100%',
        },
      ],
    },
    {
      category: 'Gestión Comercial',
      categoryDesc: 'Contratos, pernoctas y matriz física',
      modules: [
        {
          title: 'Convenios & Abonados',
          subtitle: 'Cuentas corrientes mensuales y facturación',
          icon: Building2,
          href: '/convenios',
          shortcut: 'B',
          stats: 'Contratos activos',
        },
        {
          title: 'Matriz 30 Plazas',
          subtitle: 'Layout espacial Serrano 447',
          icon: LayoutGrid,
          href: '/',
          shortcut: 'F3',
          stats: `${occupancyPercentage}% ocupación`,
        },
      ],
    },
    {
      category: 'Configuración ERP',
      categoryDesc: 'Tarifas, roles y accesos',
      modules: [
        {
          title: 'Motor de Tarifas',
          subtitle: 'Definición de precio, recargos y tolerancia',
          icon: Settings,
          href: '/configuracion',
          shortcut: 'S',
          stats: '$25 / min',
        },
        {
          title: 'Usuarios & Roles',
          subtitle: 'Altas de operadores y políticas de acceso',
          icon: Users,
          href: '/admin/usuarios',
          shortcut: 'U',
          stats: 'Control de accesos',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#06080E] text-white flex flex-col font-sans selection:bg-[#80093A] selection:text-white relative overflow-hidden">
      
      {/* Background Texture from Magnific AI */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: "url('/hub-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080E]/60 to-[#06080E] pointer-events-none" />

      {/* HEADER macOS */}
      <header className="sticky top-0 z-50 glass-panel mx-4 mt-4 rounded-3xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/landing"
              className="w-10 h-10 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cordano-logo.png" alt="Cordano" className="w-full h-full object-contain p-1" />
            </Link>
            <div>
              <span className="font-extrabold text-sm tracking-widest text-white block">PARKOPS LAUNCHPAD</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">{userRole}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass-panel rounded-xl font-mono text-xs font-bold text-slate-200">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{currentTime || '12:00:00'}</span>
            </div>

            <Link
              href="/login"
              className="macos-btn px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 flex-1 space-y-12 relative z-10">
        
        {/* Launchpad Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs text-cyan-300 font-bold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Sistemas Activos</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">Centro Operativo</h1>
            <p className="text-sm text-slate-400 mt-2 font-medium max-w-xl">
              Selecciona un módulo. La navegación está optimizada para atajos de teclado.
            </p>
          </div>

          {/* Occupancy Widget */}
          <div className="flex items-center gap-4 glass-panel p-4 rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-black font-mono text-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              {availableSlots}
            </div>
            <div className="font-mono pr-4">
              <div className="text-sm text-white font-bold block">{availableSlots} Libres</div>
              <div className="text-[11px] text-slate-400">{occupiedSlots} Ocupadas</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-10">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-300">{sec.category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sec.modules.map((m, mIdx) => {
                  const Icon = m.icon;
                  return (
                    <Link
                      key={mIdx}
                      href={m.href}
                      className="group glass-panel p-6 rounded-[2rem] flex items-center gap-6 spring-anim hover:-translate-y-1 hover:border-white/20 active:scale-[0.98]"
                    >
                      <div className="w-16 h-16 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:to-white/5 transition-all">
                        <Icon className="w-7 h-7 text-slate-300 group-hover:text-white transition-colors" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-black text-white">{m.title}</h3>
                          <kbd className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold font-mono bg-black/50 border border-white/10 rounded-lg text-slate-400 group-hover:text-cyan-300 transition-colors">
                            {m.shortcut}
                          </kbd>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mb-3">{m.subtitle}</p>
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
                          <span>{m.stats}</span>
                          <span className="text-[#80093A] group-hover:text-[#b01553] flex items-center gap-1 transition-colors">
                            INGRESAR <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 py-6 border-t border-white/[0.05] text-center text-[10px] text-slate-500 font-mono font-bold">
        CORDANO INVERSIONES • CLOUD RUN ARCHITECTURE
      </footer>
    </div>
  );
}
