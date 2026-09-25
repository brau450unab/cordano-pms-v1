'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Unlock,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Car,
  LayoutGrid,
  Eye,
  X,
  CheckCircle2
} from 'lucide-react';

const MOCKUP_SHEETS = [
  {
    id: 'm1',
    title: 'Lámina #1 · Garita POS (40%) + Layout Plazas (60%)',
    subtitle: 'Operación Keyboard-First F1–F9 sin scroll y matriz Serrano 447',
    src: '/mockups/ui_garita_pos_y_layout_estacionamiento.jpg',
    route: '/',
  },
  {
    id: 'm2',
    title: 'Lámina #2 · Menú Central Launchpad + Panel de Control',
    subtitle: 'Squircles Burdeos estilo Odoo/macOS, 4 KPIs, Barreras 1–4 y Resumen IA',
    src: '/mockups/ui_menu_central_launchpad_y_panel_control.jpg',
    route: '/hub',
  },
  {
    id: 'm3',
    title: 'Lámina #3 · Landing Interno + Login Roles + Manuales SOP',
    subtitle: 'Portal minimalista con Manuales protegidos por PIN y Flujo SOP 6 Fases',
    src: '/mockups/ui_landing_login_manuales_soporte.jpg',
    route: '/documentacion',
  },
  {
    id: 'm4',
    title: 'Lámina #4 · Pop-ups macOS + Ticket 80mm + Reportes Z + Config',
    subtitle: 'Caja Ciega, PIN Verde/Rojo, Ticket Code 128 + QR y Reporte Z SHA-256',
    src: '/mockups/ui_popups_reportes_configuracion_ticket_pdf.jpg',
    route: '/reportes',
  },
  {
    id: 'm5',
    title: 'Lámina #5 · Sidebar Colapsable + Convenios + Usuarios + CCTV LPR',
    subtitle: 'Servicios paralelos Noche/Convenios, Matriz RBAC y 4 Cámaras LPR en vivo',
    src: '/mockups/ui_menu_lateral_convenios_usuarios_cctv.jpg',
    route: '/convenios',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [manualPin, setManualPin] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [previewMockup, setPreviewMockup] = useState<(typeof MOCKUP_SHEETS)[0] | null>(
    null
  );

  const handleUnlockManuals = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualPin.length < 4) {
      setPinError('Ingrese un PIN de personal válido de 4 dígitos (ej. 1234).');
      return;
    }
    setPinError(null);
    setPinUnlocked(true);
    setTimeout(() => {
      router.push('/documentacion');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-slate-900 flex flex-col font-sans">
      {/* ===================================================================== */}
      {/* 1. BARRA DE VENTANA macOS SONOMA / SEQUOIA                            */}
      {/* ===================================================================== */}
      <header className="h-14 bg-white/95 backdrop-blur-md border-b border-[#E2E2E4] px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#80093A] flex items-center justify-center text-white font-black text-sm shadow-xs">
              C
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 block leading-none">
                Cordano Inversiones Inmobiliarias Ltda.
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Serrano 447, Iquique — Portal Interno de Operaciones
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistema Online</span>
          </span>

          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-[#80093A] hover:bg-[#68072f] text-white text-xs font-extrabold transition shadow-xs"
          >
            Iniciar Sesión
          </Link>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. PORTAL INTERNO MINIMALISTA (Mockup #3 · Sección 1 del Catálogo)    */}
      {/* ===================================================================== */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Tarjeta Principal de Acceso Operativo */}
        <section className="bg-white rounded-3xl border border-[#E2E2E4] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#80093A]/10 text-[#80093A] text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4" />
            <span>Estética Canónica V2.0 · macOS Sonoma Enterprise</span>
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              ParkOps PMS &amp; ERP — Serrano 447, Iquique
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Plataforma de control de estacionamiento (30 plazas + fila central de sobrecupo), emisión térmica dual de 80mm (Code 128 + QR), arqueo de caja ciega y auditoría antifraude por PIN.
            </p>
          </div>

          {/* Botones de Acción Primaria */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="h-13 px-7 rounded-2xl bg-[#80093A] hover:bg-[#68072f] text-white font-extrabold text-sm inline-flex items-center gap-2.5 shadow-md transition active:scale-[0.99]"
            >
              <span>Ingresar al Sistema (Login)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="h-13 px-6 rounded-2xl bg-[#F3F4F6] hover:bg-slate-200 text-slate-900 border border-slate-300 font-extrabold text-sm inline-flex items-center gap-2 transition"
            >
              <Car className="w-4 h-4 text-[#80093A]" />
              <span>Ir a Garita POS (40/60)</span>
            </Link>

            <Link
              href="/hub"
              className="h-13 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm inline-flex items-center gap-2 transition"
            >
              <LayoutGrid className="w-4 h-4 text-[#80093A]" />
              <span>Menú Central Launchpad</span>
            </Link>
          </div>

          {/* Sub-Tarjeta de Manuales y Soporte Operativo Protegida por PIN (Mockup #3) */}
          <div className="max-w-xl mx-auto mt-6 p-6 rounded-2xl bg-[#F9F9FB] border border-slate-200/90 text-left space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#80093A]/10 text-[#80093A] flex items-center justify-center shrink-0">
                  {pinUnlocked ? (
                    <Unlock className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Manuales y Soporte Operativo (Protegido por PIN)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Acceso directo a procedimientos de garita, flujo SOP de 6 fases y contingencia offline (-O)
                  </p>
                </div>
              </div>
              <BookOpen className="w-5 h-5 text-slate-400 shrink-0" />
            </div>

            {pinError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                {pinError}
              </div>
            )}

            {pinUnlocked && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PIN Verificado. Abriendo Manuales y Flujo SOP...</span>
              </div>
            )}

            <form
              onSubmit={handleUnlockManuals}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
            >
              <input
                type="password"
                maxLength={4}
                value={manualPin}
                onChange={(e) => setManualPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="PIN Personal (ej: 1234)"
                className="flex-1 h-11 px-4 rounded-xl bg-white border border-slate-300 font-mono font-bold text-sm tracking-widest text-slate-900 focus:outline-none focus:border-[#80093A] tabular-nums"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition cursor-pointer shrink-0"
              >
                Desbloquear Manuales
              </button>
            </form>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 3. CATÁLOGO VISUAL DE LAS 5 LÁMINAS MOCKUP CANÓNICAS V2.0             */}
        {/* ===================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Catálogo Oficial de Estructuras &amp; Mockups V2.0 (PRD Consolidado)
              </h2>
              <p className="text-xs text-slate-500">
                Haz clic en cualquier lámina para inspeccionar el diseño de alta resolución o abrir la vista interactiva
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCKUP_SHEETS.map((sheet) => (
              <div
                key={sheet.id}
                className="bg-white rounded-2xl border border-[#E2E2E4] overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => setPreviewMockup(sheet)}
                    className="relative h-44 bg-slate-100 overflow-hidden cursor-pointer group border-b border-slate-100"
                  >
                    <img
                      src={sheet.src}
                      alt={sheet.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-extrabold shadow-md flex items-center gap-1.5 transition">
                        <Eye className="w-3.5 h-3.5 text-[#80093A]" />
                        <span>Ampliar Lámina</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xs font-extrabold text-slate-900">
                      {sheet.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">{sheet.subtitle}</p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewMockup(sheet)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Ver Mockup
                  </button>
                  <Link
                    href={sheet.route}
                    className="text-xs font-extrabold text-[#80093A] hover:underline flex items-center gap-1"
                  >
                    <span>Abrir Módulo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Pie corporativo */}
      <footer className="py-5 border-t border-[#E2E2E4] bg-white text-center text-xs text-slate-500">
        © 2026 Cordano Inversiones Inmobiliarias Ltda. • Uso Interno Exclusivo • Serrano 447, Iquique
      </footer>

      {/* Modal de Vista Previa de Lámina Mockup */}
      {previewMockup && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewMockup(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 max-w-5xl w-full p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {previewMockup.title}
                </h3>
                <p className="text-xs text-slate-500">{previewMockup.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={previewMockup.route}
                  className="px-3 py-1.5 rounded-xl bg-[#80093A] text-white text-xs font-bold"
                >
                  Ir a Vista En Vivo →
                </Link>
                <button
                  type="button"
                  onClick={() => setPreviewMockup(null)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={previewMockup.src}
                alt={previewMockup.title}
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
