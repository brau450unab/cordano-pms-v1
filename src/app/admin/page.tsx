'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MacOSNavigationShell } from '@/components/MacOSNavigationShell';
import { ParkingSlot, Shift, AuditLog } from '@/types';
import {
  ShieldCheck,
  Download,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Lock,
  Unlock,
  Sparkles,
  X,
  Eye,
  Clock,
  DollarSign,
  Users,
  FileBarChart2
} from 'lucide-react';

interface PendingException {
  id: string;
  ticketId: string;
  patente: string;
  operador: string;
  tipo: 'DESCUENTO' | 'TICKET_PERDIDO';
  montoOriginal: number;
  montoFinal: number;
  motivo: string;
  timestamp: string;
  estado: 'PENDIENTE' | 'APROBADA';
}

export default function AdminDashboardPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'antifraud' | 'blindcash'>('overview');

  // Estado interactivo de las 4 Barreras (Mockup #2)
  const [gates, setGates] = useState([
    { id: 1, name: 'Gate 1 (Main Entry)', status: 'OPEN' as 'OPEN' | 'CLOSED' },
    { id: 2, name: 'Gate 2 (Main Exit)', status: 'CLOSED' as 'OPEN' | 'CLOSED' },
    { id: 3, name: 'Gate 3 (Emergency)', status: 'CLOSED' as 'OPEN' | 'CLOSED' },
    { id: 4, name: 'Gate 4 (VIP Area)', status: 'OPEN' as 'OPEN' | 'CLOSED' },
  ]);

  // Excepciones de Auditoría Antifraude (Verde = Descuento Operador, Rojo = Ticket Perdido Admin)
  const [exceptions, setExceptions] = useState<PendingException[]>([
    {
      id: 'AUD-VERDE-01',
      ticketId: 'TKT-20260419-T01-0839',
      patente: 'JK-LP-34',
      operador: 'Ana R. (OP-01)',
      tipo: 'DESCUENTO',
      montoOriginal: 4500,
      montoFinal: 3600,
      motivo: 'Convenio comercial Notaría Serrano con timbre validado en garita (>10 caracteres).',
      timestamp: '10:42:18 CLT',
      estado: 'APROBADA',
    },
    {
      id: 'AUD-ROJO-02',
      ticketId: 'TKT-20260419-T01-0841',
      patente: 'ABCD-12',
      operador: 'Ana R. (OP-01)',
      tipo: 'TICKET_PERDIDO',
      montoOriginal: 3200,
      montoFinal: 8000,
      motivo: 'Extravío de ticket térmico físico declarado por conductor; se aplica multa fija $8.000 CLP.',
      timestamp: '11:15:04 CLT',
      estado: 'PENDIENTE',
    },
    {
      id: 'AUD-VERDE-03',
      ticketId: 'TKT-20260419-T01-0844',
      patente: 'RT-WX-91',
      operador: 'Carlos M. (OP-02)',
      tipo: 'DESCUENTO',
      montoOriginal: 3000,
      montoFinal: 2400,
      motivo: 'Descuento 20% autorizado por demora en maniobra de camión proveedor en pasillo central.',
      timestamp: '11:50:30 CLT',
      estado: 'APROBADA',
    },
  ]);

  const [selectedException, setSelectedException] = useState<PendingException | null>(null);
  const [adminPin, setAdminPin] = useState('');
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/slots').then((r) => r.json()).catch(() => ({ slots: [] })),
      fetch('/api/shifts').then((r) => r.json()).catch(() => ({ shift: null })),
      fetch('/api/audit').then((r) => r.json()).catch(() => ({ logs: [] })),
    ]).then(([resSlots, resShift, resAudit]) => {
      if (resSlots.slots) setSlots(resSlots.slots);
      if (resShift.shift) setCurrentShift(resShift.shift);
      if (resAudit.logs) setAuditLogs(resAudit.logs);
    });
  }, []);

  const occupiedCount = slots.filter((s) => s.estado !== 'DISPONIBLE').length || 24;
  const totalSlots = 30;
  const occupancyPct = Math.round((occupiedCount / totalSlots) * 100);

  const toggleGate = (id: number, nextStatus: 'OPEN' | 'CLOSED') => {
    setGates((prev) => prev.map((g) => (g.id === id ? { ...g, status: nextStatus } : g)));
  };

  const handleApproveWithAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin.length < 4 || !selectedException) return;
    setExceptions((prev) =>
      prev.map((ex) =>
        ex.id === selectedException.id ? { ...ex, estado: 'APROBADA' } : ex
      )
    );
    setBannerMsg(
      `Excepción ${selectedException.id} (${selectedException.patente}) ratificada con PIN de Administrador.`
    );
    setSelectedException(null);
    setAdminPin('');
  };

  const handleExportCSV = () => {
    const headers = 'ID,Ticket,Patente,Operador,Tipo,Monto_Original,Monto_Final,Motivo,Estado\n';
    const rows = exceptions
      .map(
        (ex) =>
          `"${ex.id}","${ex.ticketId}","${ex.patente}","${ex.operador}","${ex.tipo}",${ex.montoOriginal},${ex.montoFinal},"${ex.motivo}","${ex.estado}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `auditoria_antifraude_cordano_serrano447.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MacOSNavigationShell
      title="Panel de Control Ejecutivo"
      subtitle="Serrano 447 · Telemetría KPI, Control de Barreras, Auditoría PIN y Caja Ciega"
      roleLabel="Administrador ERP"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Regla 7 AGENTS.md: Incompatibilidad de Caja para Administradores */}
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Regla de Segregación RBAC (Incompatibilidad de Caja):</strong> El rol de{' '}
              <strong>Administrador</strong> audita arqueos, autoriza anulaciones con PIN y configura tarifas, pero{' '}
              <strong>no puede abrir turnos de caja directamente</strong>.
            </span>
          </div>
          <Link
            href="/admin/usuarios"
            className="font-bold text-[#80093A] hover:underline shrink-0"
          >
            Ver Matriz RBAC →
          </Link>
        </div>

        {bannerMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{bannerMsg}</span>
            </div>
            <button type="button" onClick={() => setBannerMsg(null)}>
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}

        {/* 1. FILA DE 4 TARJETAS KPI (Mockup #2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E2E4] shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Occupancy (Serrano 447)
            </span>
            <div className="text-2xl font-mono font-black text-slate-900 tabular-nums mt-1">
              {occupiedCount}/{totalSlots}{' '}
              <span className="text-sm text-[#80093A]">({occupancyPct}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-[#80093A] rounded-full"
                style={{ width: `${Math.min(100, occupancyPct)}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E2E4] shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Daily Revenue (Rotativo)
            </span>
            <div className="text-2xl font-mono font-black text-emerald-700 tabular-nums mt-1">
              $185.000 <span className="text-xs font-bold text-slate-400">CLP</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-2 block">
              Excluye convenios mensuales en paralelo
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E2E4] shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Shifts
            </span>
            <div className="text-2xl font-mono font-black text-slate-900 tabular-nums mt-1">
              2 <span className="text-xs font-semibold text-emerald-600">● En Curso</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 mt-2 block">
              Caja Base: ${(currentShift?.monto_inicial_caja || 50000).toLocaleString('es-CL')} CLP
            </span>
          </div>

          <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
              Alerts & Excepciones PIN
            </span>
            <div className="text-2xl font-mono font-black text-rose-700 tabular-nums mt-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>1 Alerta Activa</span>
            </div>
            <span className="text-[11px] text-rose-700 mt-2 block">
              Sobrestadía en Plaza A-04 (&gt;4h)
            </span>
          </div>
        </div>

        {/* Pestañas de Submódulos del Panel de Control */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#80093A] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Control de Barreras & IA
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('antifraud')}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'antifraud'
                  ? 'bg-[#80093A] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Auditoría Antifraude PIN (Verde / Rojo)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('blindcash')}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'blindcash'
                  ? 'bg-[#80093A] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cuadre de Caja Ciega
            </button>
          </div>

          <span className="text-xs font-mono text-slate-500">
            Folio Turno: <strong>{currentShift?.id_turno || 'TURNO-20260419-M01'}</strong>
          </span>
        </div>

        {/* SUB-VISTA 1: CONTROL DE BARRERAS EN TIEMPO REAL & RESUMEN IA */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E2E4] p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Real-Time Gate Controls (Serrano 447)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Accionamiento remoto de barreras electromecánicas y lazo inductivo
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-bold">
                  4/4 Online
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gates.map((gate) => (
                  <div
                    key={gate.id}
                    className="p-4 rounded-2xl bg-[#F9F9FB] border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        {gate.name}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold mt-1 ${
                          gate.status === 'OPEN' ? 'text-emerald-600' : 'text-slate-500'
                        }`}
                      >
                        {gate.status === 'OPEN' ? (
                          <Unlock className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                        <span>Status: {gate.status}</span>
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleGate(gate.id, 'OPEN')}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-extrabold cursor-pointer transition ${
                          gate.status === 'OPEN'
                            ? 'bg-[#10B981] text-white'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        OPEN
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleGate(gate.id, 'CLOSED')}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-extrabold cursor-pointer transition ${
                          gate.status === 'CLOSED'
                            ? 'bg-[#EF4444] text-white'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E2E4] p-5 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#80093A]">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-base font-extrabold">AI Operational Summary</h2>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-[#F9F9FB] p-4 rounded-xl border border-slate-200">
                  Peak occupancy expected at <strong className="font-mono">14:00</strong>. All systems nominal.
                  La rotación promedio del turno mañana es de <strong className="font-mono">48 min</strong> por vehículo con ticket medio de <strong className="font-mono">$2.850 CLP</strong>.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <Link
                  href="/reportes"
                  className="p-3 rounded-xl bg-[#F9F9FB] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between"
                >
                  <span>Reporte Z SHA-256</span>
                  <FileBarChart2 className="w-4 h-4 text-[#80093A]" />
                </Link>
                <Link
                  href="/convenios"
                  className="p-3 rounded-xl bg-[#F9F9FB] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between"
                >
                  <span>Convenios & Noche</span>
                  <Users className="w-4 h-4 text-[#80093A]" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* SUB-VISTA 2: AUDITORÍA ANTIFRAUDE PIN (VERDE DESCUENTOS / ROJO TICKET PERDIDO) */}
        {activeTab === 'antifraud' && (
          <div className="bg-white rounded-2xl border border-[#E2E2E4] p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Bitácora Antifraude por PIN (Regla 5 AGENTS.md)
                </h2>
                <p className="text-xs text-slate-500">
                  Resaltado cromático obligatorio: <strong className="text-emerald-700">Verde</strong> para Descuentos con PIN Operador (&gt;10 caracteres) y <strong className="text-rose-700">Rojo</strong> para Ticket Extraviado con PIN Admin.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {exceptions.map((ex) => {
                const isDiscount = ex.tipo === 'DESCUENTO';
                return (
                  <div
                    key={ex.id}
                    className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isDiscount
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/70 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase ${
                            isDiscount
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {isDiscount ? '🟢 DESCUENTO PIN OPERADOR' : '🔴 TICKET PERDIDO PIN ADMIN'}
                        </span>
                        <span className="font-mono font-black text-sm">{ex.patente}</span>
                        <span className="font-mono text-xs opacity-75">({ex.ticketId})</span>
                        <span className="text-xs font-semibold">• {ex.operador}</span>
                        <span className="font-mono text-[11px] opacity-75">• {ex.timestamp}</span>
                      </div>
                      <p className="text-xs font-medium">
                        <strong>Justificación registrada:</strong> “{ex.motivo}”
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right font-mono tabular-nums">
                        <span className="text-[11px] line-through opacity-70 block">
                          Base: ${ex.montoOriginal.toLocaleString('es-CL')}
                        </span>
                        <span className="text-base font-black">
                          Final: ${ex.montoFinal.toLocaleString('es-CL')} CLP
                        </span>
                      </div>

                      {ex.estado === 'PENDIENTE' ? (
                        <button
                          type="button"
                          onClick={() => setSelectedException(ex)}
                          className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-extrabold cursor-pointer shadow-xs"
                        >
                          Visar con PIN Admin
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-white/80 border border-current/20 text-[11px] font-mono font-bold">
                          ✓ Visado PIN
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-VISTA 3: ARQUEO DE CAJA CIEGA (EFECTIVO SISTEMA VS RECONTADO = DIFERENCIA) */}
        {activeTab === 'blindcash' && (
          <div className="bg-white rounded-2xl border border-[#E2E2E4] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Auditoría de Cierres de Caja Ciega (Sección 9.2 del Catálogo)
                </h2>
                <p className="text-xs text-slate-500">
                  Fórmula canónica: Efectivo Sistema vs Efectivo Recontado Físico = Diferencia / Cuadre
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                SHA-256 Verificado
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                    <th className="py-3 px-3">Turno / Fecha</th>
                    <th className="py-3 px-3">Operador</th>
                    <th className="py-3 px-3 text-right">Fondo Inicial</th>
                    <th className="py-3 px-3 text-right">Efectivo Sistema</th>
                    <th className="py-3 px-3 text-right">Efectivo Recontado Físico</th>
                    <th className="py-3 px-3 text-right">Diferencia / Cuadre</th>
                    <th className="py-3 px-3">Hash SHA-256</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      TURNO-20260419-M01
                    </td>
                    <td className="py-3.5 px-3 font-sans font-semibold text-slate-700">
                      Ana R. (OP-01)
                    </td>
                    <td className="py-3.5 px-3 text-right">$50.000</td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-900">$142.500</td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-900">$142.500</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        $0 (Cuadre Exacto)
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">9f86d081...8b4c2a</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      TURNO-20260418-T02
                    </td>
                    <td className="py-3.5 px-3 font-sans font-semibold text-slate-700">
                      Carlos M. (OP-02)
                    </td>
                    <td className="py-3.5 px-3 text-right">$50.000</td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-900">$168.000</td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-900">$166.500</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                        -$1.500 (Faltante)
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">4e074085...623f19</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Visado con PIN Administrador */}
      {selectedException && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedException(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#80093A]" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Ratificar Excepción con PIN Administrador
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedException(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
              <div className="font-mono font-bold">
                {selectedException.patente} • {selectedException.ticketId}
              </div>
              <p>{selectedException.motivo}</p>
            </div>

            <form onSubmit={handleApproveWithAdminPin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  PIN Administrador (4 dígitos)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  autoFocus
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  className="w-full h-12 text-center font-mono font-black text-2xl tracking-[0.5em] rounded-xl bg-[#F9F9FB] border border-slate-300"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedException(null)}
                  className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#80093A] text-white text-xs font-extrabold cursor-pointer"
                >
                  Confirmar PIN Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MacOSNavigationShell>
  );
}
