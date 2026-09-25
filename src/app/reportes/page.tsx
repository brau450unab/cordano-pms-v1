'use client';

import React, { useState } from 'react';
import { MacOSNavigationShell } from '@/components/MacOSNavigationShell';
import { ThermalTicketPDFTemplate } from '@/components/ThermalTicketPDFTemplate';
import {
  Download,
  Printer,
  ShieldCheck,
  FileBarChart2,
  Eye,
  X,
  CheckCircle2,
  Hash
} from 'lucide-react';

const HOURLY_STATS = [
  { hour: '08:00', occ: 42, clp: 18500 },
  { hour: '09:00', occ: 65, clp: 29400 },
  { hour: '10:00', occ: 80, clp: 41200 },
  { hour: '11:00', occ: 92, clp: 52800 },
  { hour: '12:00', occ: 96, clp: 61500 },
  { hour: '13:00', occ: 88, clp: 48900 },
  { hour: '14:00', occ: 94, clp: 56200 },
  { hour: '15:00', occ: 78, clp: 39400 },
  { hour: '16:00', occ: 72, clp: 34800 },
  { hour: '17:00', occ: 84, clp: 44100 },
  { hour: '18:00', occ: 68, clp: 31000 },
  { hour: '19:00', occ: 50, clp: 22500 },
];

const Z_REPORTS = [
  {
    folioZ: 'Z-20260419-001',
    fecha: '19/04/2026 16:00',
    operador: 'Ana R. (OP-01)',
    ticketsEmitidos: 64,
    efectivoSistema: 142500,
    efectivoRecontado: 142500,
    tarjetasTransbank: 98000,
    diferencia: 0,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    folioZ: 'Z-20260418-002',
    fecha: '18/04/2026 23:55',
    operador: 'Carlos M. (OP-02)',
    ticketsEmitidos: 71,
    efectivoSistema: 168000,
    efectivoRecontado: 166500,
    tarjetasTransbank: 112000,
    diferencia: -1500,
    sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
  },
  {
    folioZ: 'Z-20260418-001',
    fecha: '18/04/2026 16:00',
    operador: 'Ana R. (OP-01)',
    ticketsEmitidos: 59,
    efectivoSistema: 134000,
    efectivoRecontado: 134000,
    tarjetasTransbank: 89500,
    diferencia: 0,
    sha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
  },
];

export default function ReportesPage() {
  const [simulateOfflineTicket, setSimulateOfflineTicket] = useState(false);
  const [showMockup, setShowMockup] = useState(false);

  const handleExportCSV = () => {
    const headers =
      'Folio_Z,Fecha,Operador,Tickets,Efectivo_Sistema,Efectivo_Recontado,Diferencia,SHA256\n';
    const rows = Z_REPORTS.map(
      (r) =>
        `"${r.folioZ}","${r.fecha}","${r.operador}",${r.ticketsEmitidos},${r.efectivoSistema},${r.efectivoRecontado},${r.diferencia},"${r.sha256}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reportes_z_sha256_cordano.csv';
    a.click();
  };

  return (
    <MacOSNavigationShell
      title="Reportes y Estadísticas (Reporte Z & Ticket 80mm)"
      subtitle="Secciones 11 y 12 del Catálogo · Curva Horaria #80093A, Arqueos Ciegos y Firma SHA-256"
      roleLabel="Auditoría Financiera"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMockup(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#80093A]" />
            <span>Mockup #4</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#80093A] hover:bg-[#68072f] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Reporte Z (CSV)</span>
          </button>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. GRILLA SUPERIOR: GRÁFICO DE BARRAS HORARIO (7 COLS) + TICKET 80MM PREVIEW (5 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Izquierda: Gráfico de Barras de Ocupación y Flujo por Hora (#80093A) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E2E4] p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#80093A] block">
                  Hourly Occupancy &amp; Revenue Telemetry
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Ocupación por Hora — Serrano 447 (08:00 a 19:00)
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#F9F9FB] border border-slate-200 font-mono text-xs font-bold text-slate-700 tabular-nums">
                Peak: 12:00 (96%)
              </span>
            </div>

            {/* Barras verticales en color institucional #80093A */}
            <div className="h-60 pt-6 pb-2 px-2 bg-[#F9F9FB] rounded-2xl border border-slate-200/80 flex items-end justify-between gap-2">
              {HOURLY_STATS.map((item) => (
                <div
                  key={item.hour}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                >
                  <span className="text-[10px] font-mono font-bold text-slate-600 tabular-nums opacity-85 group-hover:text-[#80093A]">
                    {item.occ}%
                  </span>
                  <div className="w-full max-w-[30px] bg-slate-200/70 rounded-t-lg h-36 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-[#520322] to-[#80093A] rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${item.occ}%` }}
                      title={`${item.hour}: ${item.occ}% ($${item.clp.toLocaleString('es-CL')} CLP)`}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 tabular-nums">
                    {item.hour.slice(0, 2)}h
                  </span>
                </div>
              ))}
            </div>

            {/* KPIs inferiores del gráfico */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200/90">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Total Rotativo Día
                </span>
                <span className="text-lg font-mono font-black text-slate-900 tabular-nums">
                  $480.300 CLP
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200/90">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Tickets Emitidos
                </span>
                <span className="text-lg font-mono font-black text-slate-900 tabular-nums">
                  194 Tickets
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200/90">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Estadía Promedio
                </span>
                <span className="text-lg font-mono font-black text-[#80093A] tabular-nums">
                  48 min
                </span>
              </div>
            </div>
          </div>

          {/* Derecha: Previsualizador Oficial del Ticket Térmico 80mm & PDF (Mockup #4) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E2E2E4] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Plantilla Oficial Ticket 80mm &amp; PDF (Code 128 + QR)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Regla 4 AGENTS.md · Identificación dual y sufijo -O en modo offline
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSimulateOfflineTicket(!simulateOfflineTicket)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition cursor-pointer ${
                  simulateOfflineTicket
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {simulateOfflineTicket ? 'Modo Offline (-O)' : 'Modo Online'}
              </button>
            </div>

            <ThermalTicketPDFTemplate
              folio="TKT-20260419-T01-0842"
              patente="ABCD-12"
              fecha="19/04/2026"
              horaIngreso="09:30 AM"
              sectorPlaza="A-12 (General)"
              tarifaTexto="$30 / min"
              isOffline={simulateOfflineTicket}
              showActions={true}
            />
          </div>
        </div>

        {/* 2. TABLA DE AUDITORÍA DE CIERRES Z CON HASH CRIPTOGRÁFICO SHA-256 */}
        <div className="bg-white rounded-3xl border border-[#E2E2E4] p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#80093A]" />
                <span>Historial Inmutable de Cierres Z &amp; Arqueos de Caja Ciega</span>
              </h2>
              <p className="text-xs text-slate-500">
                Cada cierre de turno genera una huella criptográfica SHA-256 verificable ante auditoría interna
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold">
              Integridad 100% Verificada
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono tabular-nums">
              <thead>
                <tr className="bg-[#F9F9FB] border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                  <th className="py-3.5 px-4">Folio Z</th>
                  <th className="py-3.5 px-4">Fecha / Cierre</th>
                  <th className="py-3.5 px-4">Operador</th>
                  <th className="py-3.5 px-4 text-right">Efectivo Sistema</th>
                  <th className="py-3.5 px-4 text-right">Efectivo Recontado</th>
                  <th className="py-3.5 px-4 text-right">Diferencia / Cuadre</th>
                  <th className="py-3.5 px-4">Firma SHA-256</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Z_REPORTS.map((z) => (
                  <tr key={z.folioZ} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-black text-slate-900">{z.folioZ}</td>
                    <td className="py-3.5 px-4 text-slate-600">{z.fecha}</td>
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-800">
                      {z.operador}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      ${z.efectivoSistema.toLocaleString('es-CL')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      ${z.efectivoRecontado.toLocaleString('es-CL')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {z.diferencia === 0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          $0 (Exacto)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                          -${Math.abs(z.diferencia).toLocaleString('es-CL')}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-[10px]"
                        title={z.sha256}
                      >
                        <Hash className="w-3 h-3 text-[#80093A]" />
                        {z.sha256.slice(0, 16)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                Lámina Oficial Mockup #4 · Pop-ups macOS, Ticket 80mm, Reportes Z y Configuración
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
                src="/mockups/ui_popups_reportes_configuracion_ticket_pdf.jpg"
                alt="Mockup Oficial Reportes y Ticket 80mm"
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </MacOSNavigationShell>
  );
}
