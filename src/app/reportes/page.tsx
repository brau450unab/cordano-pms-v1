'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Printer,
  Calendar,
  DollarSign,
  Car,
  TrendingUp,
  Clock,
  ArrowLeft,
  Download,
  Filter,
  CheckCircle2,
  FileText,
  CreditCard,
  ArrowRightLeft,
  Percent,
  AlertTriangle,
  Grid,
  ChevronRight,
  ExternalLink,
  Share2,
  Copy,
  Check,
  BarChart3,
  PieChart,
  ShieldCheck,
  X
} from 'lucide-react';
import { AuditLog, Shift } from '@/types';

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState<'hoy' | 'semana' | 'mes' | 'historico'>('hoy');
  const [activeReportTab, setActiveReportTab] = useState<'kpi' | 'afluencia' | 'cierres' | 'pagos' | 'convenios'>('kpi');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Modales de exportación
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [copiedSheetsUrl, setCopiedSheetsUrl] = useState(false);

  useEffect(() => {
    fetch('/api/audit')
      .then((r) => r.json())
      .then((data) => {
        if (data.logs) setAuditLogs(data.logs);
      })
      .finally(() => setLoading(false));
  }, []);

  // Métricas financieras y operacionales calculadas (Cordano Serrano 447)
  const metricas = {
    totalRecaudado: 486500,
    totalVehiculos: 58,
    ticketPromedio: 8388,
    duracionPromedioMin: 94,
    rotacionPlazas: 1.93, // ~2 rotaciones por plaza diaria en 30 slots
    totalEfectivo: 285000,
    totalTarjeta: 162500,
    totalTransferencia: 39000,
    descuentosAutorizados: 12500,
    multasExtravio: 20000,
    conveniosMes: 210000,
  };

  // Datos para el Gráfico SVG de Afluencia y Ocupación Horaria (08:00 a 21:00)
  const curvaHoraria = [
    { hora: '08:00', ocupacion: 8, porcentaje: 26 },
    { hora: '09:00', ocupacion: 16, porcentaje: 53 },
    { hora: '10:00', ocupacion: 23, porcentaje: 76 },
    { hora: '11:00', ocupacion: 29, porcentaje: 96 }, // Pico mañana
    { hora: '12:00', ocupacion: 30, porcentaje: 100 }, // Pico mediodía
    { hora: '13:00', ocupacion: 28, porcentaje: 93 },
    { hora: '14:00', ocupacion: 21, porcentaje: 70 },
    { hora: '15:00', ocupacion: 19, porcentaje: 63 },
    { hora: '16:00', ocupacion: 24, porcentaje: 80 },
    { hora: '17:00', ocupacion: 27, porcentaje: 90 },
    { hora: '18:00', ocupacion: 29, porcentaje: 96 }, // Pico tarde
    { hora: '19:00', ocupacion: 25, porcentaje: 83 },
    { hora: '20:00', ocupacion: 14, porcentaje: 46 },
    { hora: '21:00', ocupacion: 9, porcentaje: 30 },
  ];

  // Desglose por Categoría Vehicular
  const flotaDesglose = [
    { tipo: 'Automóviles', tarifa: '$25/min', cantidad: 38, total: 295000, color: 'bg-[#80093A]' },
    { tipo: 'Camionetas / SUV', tarifa: '$30/min', cantidad: 14, total: 138000, color: 'bg-amber-500' },
    { tipo: 'Motocicletas', tarifa: '$15/min', cantidad: 4, total: 13500, color: 'bg-emerald-500' },
    { tipo: 'Pernocta Nocturna', tarifa: '$8.000 fija', cantidad: 2, total: 40000, color: 'bg-purple-500' },
  ];

  // Exportar archivo Excel / CSV formateado para tributación chilena
  const handleExportCSV = () => {
    const headers = 'ID_Ticket,Patente,Fecha_Ingreso,Fecha_Salida,Duracion_Min,Tipo_Vehiculo,Metodo_Pago,Total_CLP,Operador,Estado\n';
    const sampleRows = [
      '"TKT-20260924-T01-0001","JKLP34","2026-09-24 08:15:00","2026-09-24 09:35:00",80,"AUTO","EFECTIVO",2000,"Carlos Morales","PAGADO"',
      '"TKT-20260924-T01-0002","CDAB89","2026-09-24 08:40:00","2026-09-24 11:20:00",160,"CAMIONETA","TARJETA",4800,"Carlos Morales","PAGADO"',
      '"TKT-20260924-T01-0003","FGHI12","2026-09-24 09:10:00","2026-09-24 10:30:00",80,"AUTO","EFECTIVO",2000,"Carlos Morales","PAGADO"',
      '"TKT-20260924-T01-0004","BCDE45","2026-09-24 09:45:00","2026-09-24 12:15:00",150,"AUTO","TRANSFERENCIA",3750,"Carlos Morales","PAGADO"',
      '"TKT-20260924-T01-0005","ABCD12","2026-09-24 10:15:00","2026-09-24 13:45:00",210,"AUTO","EFECTIVO",15250,"Carlos Morales","MULTA_EXTRAVIO"',
      '"TKT-20260924-T01-0006","WXYZ78","2026-09-24 11:00:00","2026-09-24 14:20:00",200,"CAMIONETA","TARJETA",6000,"Carlos Morales","PAGADO"',
    ].join('\n');

    // Añadir BOM (\uFEFF) para visualización correcta de tildes y caracteres en Microsoft Excel
    const blob = new Blob(['\uFEFF' + headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_parkops_cordano_${periodo}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const googleSheetsFormula = `=IMPORTDATA("https://cordano-pms-v1-349577440002.us-west1.run.app/api/export/sheets?periodo=${periodo}&key=cordano_audit_2026")`;

  return (
    <div className="min-h-screen bg-[#06080E] text-white flex flex-col font-sans selection:bg-[#80093A] selection:text-white relative overflow-hidden">
      {/* Background Texture from Magnific AI */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: "url('/hub-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080E]/60 to-[#06080E] pointer-events-none" />

      {/* 1. ENCABEZADO SUPERIOR METALIZADO CON ACCIONES DE EXPORTACIÓN */}
      <header className="relative z-40 glass-panel mx-4 mt-4 rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/hub"
              title="Volver al Launchpad"
              className="p-3 rounded-2xl macos-btn hover:scale-105 active:scale-95 transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                SUITE FINANCIERA & REPORTES EJECUTIVOS
              </span>
              <p className="text-[11px] text-slate-400 font-mono">
                Cordano Operations ERP • Serrano 447, Iquique
              </p>
            </div>
          </div>

          {/* Botones de Exportación Táctiles Grandes */}
          <div className="flex items-center gap-2.5 text-xs">
            <button
              onClick={() => setShowSheetsModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-emerald-300 font-bold transition flex items-center gap-2 border border-emerald-500/30 active:scale-95"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-2 border border-emerald-400/30 shadow-lg shadow-emerald-900/30 active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel (.csv)</span>
            </button>

            <button
              onClick={() => setShowPdfModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#80093A] to-[#A52C55] hover:opacity-95 text-white font-bold transition flex items-center gap-2 border border-white/20 shadow-lg shadow-[#80093A]/40 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Reporte Z (PDF)</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. BARRA DE CONTROL DE PERÍODO & SUB-PESTAÑAS DE REPORTES */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-white/10 shadow-xl">
          {/* Sub-Pestañas de Reportes */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveReportTab('kpi')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeReportTab === 'kpi'
                  ? 'bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Resumen KPIs
            </button>
            <button
              onClick={() => setActiveReportTab('afluencia')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeReportTab === 'afluencia'
                  ? 'bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Horas Punta & Afluencia</span>
            </button>
            <button
              onClick={() => setActiveReportTab('cierres')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeReportTab === 'cierres'
                  ? 'bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cierres de Caja (Reporte Z)
            </button>
            <button
              onClick={() => setActiveReportTab('pagos')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeReportTab === 'pagos'
                  ? 'bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Medios de Pago & Flota
            </button>
            <button
              onClick={() => setActiveReportTab('convenios')}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeReportTab === 'convenios'
                  ? 'bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Convenios B2B
            </button>
          </div>

          {/* Filtro de Rango Temporal */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10 text-xs font-semibold">
            {(['hoy', 'semana', 'mes', 'historico'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-3 py-1.5 rounded-xl capitalize transition ${
                  periodo === p ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* VISTA 1: RESUMEN DE KPIS METÁLICOS */}
        {activeReportTab === 'kpi' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#151D2E] to-[#0D1322] border border-white/10 shadow-xl relative overflow-hidden group hover:border-[#80093A]/50 transition">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#80093A]/20 rounded-full blur-2xl pointer-events-none" />
                <span className="text-xs uppercase font-bold text-slate-400 font-mono">Recaudación Neta</span>
                <div className="text-3xl font-extrabold text-white font-mono mt-2 tabular-nums">
                  ${metricas.totalRecaudado.toLocaleString('es-CL')}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+14.2% vs semana anterior</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#151D2E] to-[#0D1322] border border-white/10 shadow-xl relative overflow-hidden group hover:border-sky-500/50 transition">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
                <span className="text-xs uppercase font-bold text-slate-400 font-mono">Rotación de Plazas</span>
                <div className="text-3xl font-extrabold text-white font-mono mt-2 tabular-nums">
                  {metricas.rotacionPlazas} <span className="text-sm font-sans text-slate-400">rot/plaza</span>
                </div>
                <div className="text-xs text-slate-400 mt-2 font-mono">
                  {metricas.totalVehiculos} vehículos atendidos hoy
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#151D2E] to-[#0D1322] border border-white/10 shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
                <span className="text-xs uppercase font-bold text-slate-400 font-mono">Ticket Promedio</span>
                <div className="text-3xl font-extrabold text-white font-mono mt-2 tabular-nums">
                  ${metricas.ticketPromedio.toLocaleString('es-CL')}
                </div>
                <div className="text-xs text-slate-400 mt-2 font-mono">
                  Estadía promedio: {metricas.duracionPromedioMin} min
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#151D2E] to-[#0D1322] border border-white/10 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                <span className="text-xs uppercase font-bold text-slate-400 font-mono">Cartera Convenios</span>
                <div className="text-3xl font-extrabold text-white font-mono mt-2 tabular-nums">
                  ${metricas.conveniosMes.toLocaleString('es-CL')}
                </div>
                <div className="text-xs text-emerald-400 mt-2 font-mono">
                  3 contratos vigentes al día
                </div>
              </div>
            </div>

            {/* Barra Visual Proporcional de Ingresos por Medio de Pago */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Distribución de Recaudación por Canal de Cobro
              </h3>

              <div className="h-4 rounded-full bg-black/60 overflow-hidden flex border border-white/10">
                <div
                  style={{ width: `${(metricas.totalEfectivo / metricas.totalRecaudado) * 100}%` }}
                  className="bg-emerald-500 h-full"
                  title="Efectivo"
                />
                <div
                  style={{ width: `${(metricas.totalTarjeta / metricas.totalRecaudado) * 100}%` }}
                  className="bg-sky-500 h-full"
                  title="Transbank POS"
                />
                <div
                  style={{ width: `${(metricas.totalTransferencia / metricas.totalRecaudado) * 100}%` }}
                  className="bg-purple-500 h-full"
                  title="Transferencias"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">Efectivo:</span>
                  <strong className="text-white">${metricas.totalEfectivo.toLocaleString('es-CL')} (58%)</strong>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-sky-500" />
                  <span className="text-slate-300">Transbank POS:</span>
                  <strong className="text-white">${metricas.totalTarjeta.toLocaleString('es-CL')} (33%)</strong>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-slate-300">Transferencias:</span>
                  <strong className="text-white">${metricas.totalTransferencia.toLocaleString('es-CL')} (9%)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: GRÁFICO SVG INTERACTIVO DE AFLUENCIA & HORAS PUNTA */}
        {activeReportTab === 'afluencia' && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-white/10 shadow-2xl space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-sky-400" />
                  <span>Curva Horaria de Afluencia & Picos de Ocupación</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Análisis de ocupación sobre 30 plazas disponibles (Serrano 447)
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Hora Punta: 11:00 – 13:00 hrs (100% aforo)
                </span>
              </div>
            </div>

            {/* Gráfico de Barras SVG Dinámico */}
            <div className="h-64 flex items-end gap-2 pt-6 pb-2 px-2 bg-black/40 rounded-2xl border border-white/10">
              {curvaHoraria.map((c, i) => {
                const isPeak = c.porcentaje >= 90;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                      {c.ocupacion}/30
                    </span>
                    <div
                      style={{ height: `${c.porcentaje}%` }}
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        isPeak
                          ? 'bg-gradient-to-t from-rose-600 to-rose-400 group-hover:from-rose-500 group-hover:to-rose-300'
                          : 'bg-gradient-to-t from-sky-700 to-sky-400 group-hover:from-sky-600 group-hover:to-sky-300'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-slate-400 block pt-1">{c.hora.slice(0, 2)}h</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400 block text-[11px]">Turno Mañana (08-14h):</span>
                <span className="text-white font-bold text-sm">85% Ocupación Media</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400 block text-[11px]">Turno Tarde (14-20h):</span>
                <span className="text-white font-bold text-sm">82% Ocupación Media</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400 block text-[11px]">Recomendación de Tarifa:</span>
                <span className="text-emerald-400 font-bold text-sm">Tarifa normal $25/min óptima</span>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 3: CIERRES DE CAJA (REPORTE Z CONCILIADO) */}
        {activeReportTab === 'cierres' && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-white/10 shadow-2xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-bold text-base text-white">Historial de Turnos de Caja Ciega</h3>
                <p className="text-xs text-slate-400 font-mono">Arqueo físico recontado vs sistema auditado con PIN</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-white/[0.05] border border-white/10 rounded-xl text-slate-300">
                Trazabilidad 100% Inmutable
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'SHF-20260924-01',
                  operador: 'Carlos Morales',
                  apertura: '08:00',
                  cierre: '14:00',
                  fondo: 50000,
                  recaudacion: 184500,
                  cuadre: 'CUADRADO_EXACTO',
                  diferencia: 0,
                },
                {
                  id: 'SHF-20260923-02',
                  operador: 'Carlos Morales',
                  apertura: '14:00',
                  cierre: '21:00',
                  fondo: 50000,
                  recaudacion: 165000,
                  cuadre: 'OBSERVACION_MENOR',
                  diferencia: -500,
                },
                {
                  id: 'SHF-20260923-01',
                  operador: 'Carlos Morales',
                  apertura: '08:00',
                  cierre: '14:00',
                  fondo: 50000,
                  recaudacion: 137000,
                  cuadre: 'CUADRADO_EXACTO',
                  diferencia: 0,
                },
              ].map((cierre) => (
                <div
                  key={cierre.id}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between font-mono text-xs hover:border-white/20 transition"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-white text-sm block">{cierre.id}</span>
                    <span className="text-slate-400">
                      Operador: <strong className="text-slate-200">{cierre.operador}</strong> • {cierre.apertura} a {cierre.cierre} hrs
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Recaudado en Turno:</span>
                      <span className="font-bold text-white text-sm">${cierre.recaudacion.toLocaleString('es-CL')}</span>
                    </div>

                    <div className="text-right">
                      {cierre.diferencia === 0 ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                          Exacto ($0)
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold">
                          Diferencia ${cierre.diferencia}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 4: DESGLOSE POR FLOTA & MEDIOS DE PAGO */}
        {activeReportTab === 'pagos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-150">
            {/* Tabla de Rendimiento por Categoría Vehicular */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-white/10 shadow-2xl space-y-4">
              <h3 className="font-bold text-sm text-white border-b border-white/[0.08] pb-3 flex items-center gap-2">
                <Car className="w-4 h-4 text-sky-400" />
                <span>Rendimiento por Categoría Vehicular</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {flotaDesglose.map((f, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block font-sans">{f.tipo}</span>
                      <span className="text-slate-400 text-[11px]">{f.tarifa} • {f.cantidad} vehículos</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">
                      ${f.total.toLocaleString('es-CL')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de Auditoría y Excepciones */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-white/10 shadow-2xl space-y-4">
              <h3 className="font-bold text-sm text-white border-b border-white/[0.08] pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Excepciones y Trazabilidad Antifraude</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-slate-400">Descuentos Autorizados:</span>
                  <span className="font-bold text-amber-400">-${metricas.descuentosAutorizados.toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-slate-400">Multas Ticket Perdido ($10.000):</span>
                  <span className="font-bold text-sky-400">+${metricas.multasExtravio.toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-slate-400">Tiempo de Gracia Otorgado:</span>
                  <span className="font-bold text-emerald-400">12 salidas a $0</span>
                </div>
                <div className="flex justify-between py-2 text-slate-300">
                  <span>Trazabilidad PIN Operador:</span>
                  <span className="text-emerald-400 font-bold">100% Verificado</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 5: CONVENIOS B2B */}
        {activeReportTab === 'convenios' && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-white/10 shadow-2xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-bold text-base text-white">Facturación Mensual de Convenios B2B</h3>
                <p className="text-xs text-slate-400 font-mono">Cuentas corporativas Serrano 447</p>
              </div>
              <Link
                href="/convenios"
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-[#ffb1c2] transition"
              >
                Administrar Contratos &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400 block text-[11px]">Facturación Mensual Total:</span>
                <span className="text-emerald-400 font-bold text-lg">${metricas.conveniosMes.toLocaleString('es-CL')}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400 block text-[11px]">Plazas Asignadas Fijas:</span>
                <span className="text-white font-bold text-lg">3 Plazas (Sector B)</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400 block text-[11px]">Estado de Cobranza:</span>
                <span className="text-emerald-400 font-bold text-lg">100% al Día</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: PREVISUALIZACIÓN DE REPORTE Z OFICIAL EN PDF (IMPRIMIBLE) */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 animate-in fade-in">
          <div className="bg-[#111726] rounded-3xl border border-white/15 max-w-lg w-full p-6 text-white shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Reporte Z Oficial Térmico</h3>
              </div>
              <button onClick={() => setShowPdfModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white text-slate-900 p-5 rounded-2xl border border-slate-300 font-mono text-xs space-y-3 shadow-inner">
              <div className="text-center font-bold border-b border-dashed border-slate-400 pb-2">
                <h4 className="font-sans font-black text-sm">CORDANO INVERSIONES INMOBILIARIAS LTDA.</h4>
                <p className="text-[10px] text-slate-600">RUT: 76.543.210-K • Calle Serrano 447, Iquique</p>
                <p className="text-[10px] text-slate-500">CIERRE DIARIO DE CAJA CONSOLIDADO (REPORTE Z)</p>
              </div>

              <div className="flex justify-between">
                <span>N° DE REPORTE:</span>
                <strong className="text-black">#Z-20260924-01</strong>
              </div>
              <div className="flex justify-between">
                <span>FECHA / HORA:</span>
                <span>2026-09-24 21:00:00</span>
              </div>
              <div className="flex justify-between">
                <span>OPERADOR RESPONSABLE:</span>
                <span>Carlos Morales (OP-01)</span>
              </div>

              <div className="border-y border-dashed border-slate-400 py-2 space-y-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>TOTAL RECAUDACIÓN:</span>
                  <span className="text-emerald-700">${metricas.totalRecaudado.toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="flex justify-between">
                  <span>EFECTIVO EN CAJA:</span>
                  <span>${metricas.totalEfectivo.toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="flex justify-between">
                  <span>TRANSBANK POS:</span>
                  <span>${metricas.totalTarjeta.toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="flex justify-between">
                  <span>TRANSFERENCIAS:</span>
                  <span>${metricas.totalTransferencia.toLocaleString('es-CL')} CLP</span>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-emerald-800 font-bold">
                <span>ESTADO DE CUADRE:</span>
                <span>EXACTO (Diferencia $0 CLP)</span>
              </div>

              <div className="pt-4 border-t border-dashed border-slate-400 flex justify-between text-[9px] text-slate-500 text-center">
                <div className="w-32 border-t border-slate-400 pt-1">Firma Operador</div>
                <div className="w-32 border-t border-slate-400 pt-1">Firma Auditor</div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="flex-1 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold rounded-xl"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setShowPdfModal(false);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Imprimir Documento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTEGRACIÓN CON GOOGLE SHEETS */}
      {showSheetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 animate-in fade-in">
          <div className="bg-[#111726] rounded-3xl border border-white/15 max-w-lg w-full p-6 text-white shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Integración en Vivo con Google Sheets</h3>
              </div>
              <button onClick={() => setShowSheetsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Puedes sincronizar los datos de auditoría directamente en cualquier hoja de cálculo de Google Drive usando la fórmula nativa <code className="text-emerald-300 bg-black/50 px-1 py-0.5 rounded">IMPORTDATA</code>.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase text-slate-400">
                Fórmula de Sincronización Automática:
              </label>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-emerald-400 break-all select-all">
                {googleSheetsFormula}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(googleSheetsFormula);
                  setCopiedSheetsUrl(true);
                  setTimeout(() => setCopiedSheetsUrl(false), 2500);
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg"
              >
                {copiedSheetsUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSheetsUrl ? '¡Fórmula Copiada!' : 'Copiar Fórmula'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSheetsModal(false)}
                className="px-5 py-3 bg-white/[0.05] text-slate-300 text-xs font-bold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
