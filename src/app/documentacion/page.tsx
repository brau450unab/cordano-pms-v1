'use client';

import React, { useState } from 'react';
import { MacOSNavigationShell } from '@/components/MacOSNavigationShell';
import {
  BookOpen,
  ShieldCheck,
  Printer,
  WifiOff,
  Keyboard,
  Eye,
  X,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const SOP_PHASES = [
  {
    step: '01',
    title: 'Apertura de Turno y Fondo Inicial',
    desc: 'El Operador declara el fondo inicial de sencillo en CLP para dar vuelto (Regla 5). El rol Administrador no puede abrir caja.',
    shortcut: 'Login',
  },
  {
    step: '02',
    title: 'Detección LPR / Digitación de Patente',
    desc: 'El campo de matrícula tiene autofoco inmediato [F1/F2]. Se selecciona tarifa ($30/min, Jornada $6.000 o Noche $5.000).',
    shortcut: 'F1 / F2',
  },
  {
    step: '03',
    title: 'Emisión de Ticket Térmico 80mm Dual',
    desc: 'Imprime comprobante de 80mm con Code 128 lineal + QR 2D + advertencia legal de recargo por extravío ($8.000 CLP).',
    shortcut: 'F8',
  },
  {
    step: '04',
    title: 'Monitoreo en Matriz Serrano 447',
    desc: 'Las 30 plazas (Sector A 01–15, Sector B 16–30) y fila de sobrecupo (SC-01..05) actualizan su color semántico en vivo.',
    shortcut: '60% Map',
  },
  {
    step: '05',
    title: 'Liquidación, Vuelto o Excepción PIN',
    desc: 'Cobro en Efectivo [F4] o Tarjeta [F5]. Descuentos exigen PIN Operador + justificación >10 car. (Verde); Ticket perdido exige PIN Admin (Rojo).',
    shortcut: 'F4–F7',
  },
  {
    step: '06',
    title: 'Arqueo de Caja Ciega y Reporte Z SHA-256',
    desc: 'El operador cuenta billetes y monedas sin ver el monto del sistema. Se calcula Efectivo Sistema vs Recontado = Diferencia y se firma con SHA-256.',
    shortcut: 'Cierre Z',
  },
];

export default function DocumentacionPage() {
  const [showMockup, setShowMockup] = useState(false);

  return (
    <MacOSNavigationShell
      title="Manuales Operativos & Flujo SOP de Garita"
      subtitle="Sección 2 del Catálogo · Procedimiento Estándar de 6 Fases, Atajos F1–F9 y Contingencia Offline (-O)"
      roleLabel="Soporte & SOP"
      rightActions={
        <button
          type="button"
          onClick={() => setShowMockup(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#80093A]" />
          <span>Mockup #3</span>
        </button>
      }
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. DIAGRAMA DE FLUJO SOP DE 6 FASES EN GARITA (Mockup #3) */}
        <section className="bg-white rounded-3xl border border-[#E2E2E4] p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#80093A] block">
                Standard Operating Procedure (SOP)
              </span>
              <h2 className="text-lg font-extrabold text-slate-900">
                Flujo Operativo de 6 Fases — Garita Serrano 447, Iquique
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold">
              PIN Personal Verificado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOP_PHASES.map((p) => (
              <div
                key={p.step}
                className="p-4 rounded-2xl bg-[#F9F9FB] border border-slate-200/90 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-[#80093A] text-white font-mono font-black text-xs flex items-center justify-center">
                      {p.step}
                    </span>
                    <kbd className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] font-bold text-slate-600">
                      {p.shortcut}
                    </kbd>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. PROTOCOLO DE CONTINGENCIA OFFLINE (-O) Y ATAJOS DE TECLADO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-[#E2E2E4] p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <WifiOff className="w-5 h-5 text-amber-600" />
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Protocolo de Contingencia Offline-First (Sufijo -O)
                </h2>
                <p className="text-xs text-slate-500">
                  Regla 4 AGENTS.md · Continuidad operativa ante cortes de fibra en Iquique
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <strong>1. Sufijo Automático -O:</strong> Todo ticket emitido sin enlace a Cloud Run agrega automáticamente el sufijo <code className="font-mono font-bold">O</code> al correlativo (<code className="font-mono font-bold">TKT-AAAAMMDD-T0X-XXXXO</code>).
              </li>
              <li className="p-3 rounded-xl bg-[#F9F9FB] border border-slate-200">
                <strong>2. Almacenamiento Local IndexedDB:</strong> Los movimientos quedan resguardados en el navegador de garita y se sincronizan en lote al restablecerse la red.
              </li>
              <li className="p-3 rounded-xl bg-[#F9F9FB] border border-slate-200">
                <strong>3. Lectura Dual Sin Red:</strong> El código de barras lineal <strong>Code 128</strong> codifica el timestamp de entrada para liquidar la tarifa por minuto aún sin conexión al servidor.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2E2E4] p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <Keyboard className="w-5 h-5 text-[#80093A]" />
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Mapa Oficial de Atajos de Teclado (Garita Sin Scroll)
                </h2>
                <p className="text-xs text-slate-500">
                  Regla 1 AGENTS.md · Operación 100% por teclado físico
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { key: 'F1 / F2', action: 'Autofoco Patente / Ticket' },
                { key: 'F3', action: 'Alternar Tarifa ($30 / Jornada / Noche)' },
                { key: 'F4', action: 'Cobro Rápido en Efectivo' },
                { key: 'F5', action: 'Cobro Rápido con Tarjeta POS' },
                { key: 'F6', action: 'Descuento con PIN Operador (Verde)' },
                { key: 'F7', action: 'Ticket Perdido $8.000 PIN Admin (Rojo)' },
                { key: 'F8', action: 'Imprimir Ticket Térmico 80mm' },
                { key: 'F9', action: 'Abrir Barrera Principal' },
              ].map((k) => (
                <div
                  key={k.key}
                  className="p-2.5 rounded-xl bg-[#F9F9FB] border border-slate-200 flex items-center justify-between gap-2"
                >
                  <kbd className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[11px]">
                    {k.key}
                  </kbd>
                  <span className="font-sans text-[11px] font-semibold text-slate-700 text-right">
                    {k.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showMockup && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowMockup(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 max-w-5xl w-full p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                Lámina Oficial Mockup #3 · Manuales Operativos y Flujo SOP de 6 Fases
              </h3>
              <button
                type="button"
                onClick={() => setShowMockup(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src="/mockups/ui_landing_login_manuales_soporte.jpg"
                alt="Mockup Oficial Manuales"
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </MacOSNavigationShell>
  );
}
