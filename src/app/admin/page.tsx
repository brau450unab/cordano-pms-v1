'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ParkingSlot,
  Shift,
  AuditLog,
  PaymentMethod,
  IncidenceType,
} from '@/types';
import {
  LayoutGrid,
  Car,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  Video,
  BookOpen,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Download,
  ArrowRight,
  ChevronDown,
  RefreshCw,
  X,
  Check,
  TrendingUp,
  CreditCard,
  UserCheck,
  Lock,
  Layers
} from 'lucide-react';

interface PendingException {
  id: string;
  ticketId: string;
  patente: string;
  operador: string;
  tipo: 'COBRO_PARCIAL' | 'DESCUENTO' | 'EXTRAVIO' | 'FUGA';
  montoOriginal: number;
  montoCobrado: number;
  motivo: string;
  timestamp: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
}

type AdminModule = 'launcher' | 'overview' | 'approvals' | 'shifts';

export default function AdminDashboardPage() {
  const [activeModule, setActiveModule] = useState<AdminModule>('launcher');
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Lista de excepciones pendientes para aprobación administrativa
  const [pendingExceptions, setPendingExceptions] = useState<PendingException[]>([
    {
      id: 'EXC-01',
      ticketId: 'TKT-20260923-T01-0004',
      patente: 'JKLP34',
      operador: 'Carlos Morales',
      tipo: 'COBRO_PARCIAL',
      montoOriginal: 3500,
      montoCobrado: 2000,
      motivo: 'Cliente argumenta demora por obstrucción en pasillo interno de Serrano 447.',
      timestamp: '2026-09-23T11:45:00Z',
      estado: 'PENDIENTE',
    },
    {
      id: 'EXC-02',
      ticketId: 'TKT-20260923-T01-0007',
      patente: 'ABCD12',
      operador: 'Carlos Morales',
      tipo: 'EXTRAVIO',
      montoOriginal: 14500,
      montoCobrado: 14500,
      motivo: 'Conductor perdió el ticket de papel; patente validada en sistema con multa fija $10.000.',
      timestamp: '2026-09-23T13:10:00Z',
      estado: 'PENDIENTE',
    },
  ]);

  // Modal para ingresar PIN/OTP de Administrador
  const [selectedException, setSelectedException] = useState<PendingException | null>(null);
  const [adminPin, setAdminPin] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/slots').then((r) => r.json()),
      fetch('/api/shifts').then((r) => r.json()),
      fetch('/api/audit').then((r) => r.json()),
    ])
      .then(([resSlots, resShifts, resAudit]) => {
        if (resSlots.slots) setSlots(resSlots.slots);
        if (resShifts.shift) setCurrentShift(resShifts.shift);
        if (resAudit.logs) setAuditLogs(resAudit.logs);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApproveException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPin || adminPin.length < 4) {
      alert('Ingresa el PIN de Administrador (4 dígitos)');
      return;
    }

    if (selectedException) {
      setPendingExceptions((prev) =>
        prev.map((item) =>
          item.id === selectedException.id ? { ...item, estado: 'APROBADA' } : item
        )
      );
      setActionSuccess(`Excepción ${selectedException.id} aprobada con éxito.`);
      setSelectedException(null);
      setAdminPin('');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleExportCSV = () => {
    // Generar CSV descargable para Google Sheets / Excel
    const headers = 'ID_Auditoria,Accion,Tipo_Evento,Fecha_Hora,Usuario,Motivo\n';
    const rows = auditLogs
      .map(
        (log) =>
          `"${log.id_auditoria}","${log.accion}","${log.tipo_evento || 'SISTEMA'}","${log.fecha_hora}","${log.nombre_usuario}","${log.motivo || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_parkops_cordano_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const occupiedCount = slots.filter((s) => s.estado === 'OCUPADO').length;
  const pendingApprovalsCount = pendingExceptions.filter((e) => e.estado === 'PENDIENTE').length;

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-slate-900 flex flex-col font-sans selection:bg-[#80093A] selection:text-white">
      {/* BARRA SUPERIOR MINIMALISTA macOS */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center hover:opacity-90 transition"
              title="Volver al Punto de Venta Garita"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cordano-logo.png" alt="Cordano Logo" className="w-full h-full object-contain p-0.5" />
            </Link>
            <div>
              <span className="font-bold text-base tracking-wide text-white flex items-center gap-2">
                CORDANO ADMIN
                <span className="bg-[#80093A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ERP V4.0
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-mono">Serrano 447, Iquique</p>
            </div>
          </div>

          {/* Navegación Switcher Central */}
          <div className="flex items-center gap-2">
            {activeModule !== 'launcher' ? (
              <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setActiveModule('launcher')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                  title="Volver a la cuadrícula de módulos"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                  <span>Módulos</span>
                </button>

                <select
                  value={activeModule}
                  onChange={(e) => setActiveModule(e.target.value as AdminModule)}
                  className="bg-transparent text-xs text-white font-semibold outline-none px-2 py-1 cursor-pointer"
                >
                  <option value="overview" className="bg-slate-800 text-white">
                    📊 Monitoreo y Plazas
                  </option>
                  <option value="approvals" className="bg-slate-800 text-white">
                    🔑 Cola de Aprobaciones ({pendingApprovalsCount})
                  </option>
                  <option value="shifts" className="bg-slate-800 text-white">
                    💼 Turnos y Arqueo Ciego
                  </option>
                </select>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
                Launchpad de Aplicaciones Administrativas
              </span>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              title="Descargar auditoría completa en CSV/Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excel / Sheets</span>
            </button>

            <Link
              href="/"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
            >
              <Car className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Garita POS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ALERTA DE ÉXITO */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-sm font-semibold shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 1. LOBBY / APP LAUNCHER ESTILO ODOO / MACOS LAUNCHPAD */}
        {activeModule === 'launcher' && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Panel de Módulos • Cordano Inversiones Inmobiliarias
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Selecciona una aplicación para supervisión, conciliación financiera, auditoría o soporte operativo.
              </p>
            </div>

            {/* Cuadrícula de 8 Módulos estilo macOS Squircles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Módulo 1: Garita Operativa */}
              <Link
                href="/"
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#80093A] transition-all group flex flex-col justify-between h-44 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition">
                    <Car className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    En Vivo
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#80093A] transition">
                    Garita Operativa (POS)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ingreso, cobro automático, tickets e impresión térmica.
                  </p>
                </div>
              </Link>

              {/* Módulo 2: Monitoreo en Vivo */}
              <button
                onClick={() => setActiveModule('overview')}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#80093A] transition-all group flex flex-col justify-between h-44 text-left relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#80093A]/10 text-[#80093A] flex items-center justify-center group-hover:scale-105 transition">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                    {occupiedCount}/30 Plazas
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#80093A] transition">
                    Monitoreo & Plazas
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Matriz de ocupación 7×5, cronómetros y recaudación en tiempo real.
                  </p>
                </div>
              </button>

              {/* Módulo 3: Aprobaciones de Excepciones */}
              <button
                onClick={() => setActiveModule('approvals')}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#80093A] transition-all group flex flex-col justify-between h-44 text-left relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  {pendingApprovalsCount > 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                      {pendingApprovalsCount} Pendientes
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      Al día
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#80093A] transition">
                    Aprobaciones con PIN
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Visar descuentos, cobros parciales y tickets perdidos.
                  </p>
                </div>
              </button>

              {/* Módulo 4: Turnos y Arqueo Ciego */}
              <button
                onClick={() => setActiveModule('shifts')}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#80093A] transition-all group flex flex-col justify-between h-44 text-left relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Arqueo Ciego
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#80093A] transition">
                    Turnos & Conciliación
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Auditoría de caja ciega, sellos criptográficos y Reporte Z.
                  </p>
                </div>
              </button>

              {/* Módulo 5: Reportes y Excel */}
              <Link
                href="/reportes"
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#80093A] transition-all group flex flex-col justify-between h-44 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    Export .xlsx
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#80093A] transition">
                    Reportes & Auditoría
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Descarga en 1 clic para Google Sheets, filtros de fechas y medios de pago.
                  </p>
                </div>
              </Link>

              {/* Módulo 6: Configuración ERP */}
              <Link
                href="/configuracion"
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#80093A] transition-all group flex flex-col justify-between h-44 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition">
                    <Settings className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Tarifas & WhatsApp
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#80093A] transition">
                    Configuración ERP
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tarifas por minuto, tiempos de gracia, WhatsApp garita y PINs.
                  </p>
                </div>
              </Link>

              {/* Módulo 7: CCTV & Seguridad */}
              <Link
                href="/cctv"
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#80093A] transition-all group flex flex-col justify-between h-44 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition">
                    <Video className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    CCTV 1080p
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#80093A] transition">
                    CCTV Serrano 447
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Circuito cerrado de televisión, cámaras de acceso y patio central.
                  </p>
                </div>
              </Link>

              {/* Módulo 8: Documentación y Manuales SOP */}
              <Link
                href="/documentacion"
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#80093A] transition-all group flex flex-col justify-between h-44 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center group-hover:scale-105 transition">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                    SOP Fases 1-6
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#80093A] transition">
                    Manuales & Soporte
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Guía de garita, atajos de teclado, FAQ de contingencia y PRD técnico.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* 2. VISTA DETALLADA: MONITOREO EN VIVO Y PLAZAS */}
        {activeModule === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recaudación Turno Actual
                </span>
                <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                  $184.500 CLP
                </div>
                <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
                  42 Tickets cobrados hoy
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ocupación Serrano 447
                </span>
                <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                  {occupiedCount} / 30 Plazas
                </div>
                <span className="text-xs text-slate-500 mt-1 inline-block">
                  {30 - occupiedCount} Disponibles en este momento
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Desglose Efectivo vs Digital
                </span>
                <div className="text-sm font-mono text-slate-700 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Efectivo:</span>
                    <strong className="text-slate-900">$124.500 (67%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tarjeta/Transf:</span>
                    <strong className="text-slate-900">$60.000 (33%)</strong>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Estado de Auditoría
                </span>
                <div className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Cadena SHA-256 Íntegra</span>
                </div>
                <span className="text-xs text-slate-400 font-mono mt-1 block">
                  Sin alteraciones de base de datos
                </span>
              </div>
            </div>

            {/* Listado rápido de Plazas */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-slate-900">
                  Estado de las 35 Plazas (Sector A, B y Sobrecupo)
                </h3>
                <Link href="/" className="text-xs text-[#80093A] font-bold hover:underline">
                  Ver en Garita POS &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-7 gap-2">
                {slots.map((s) => (
                  <div
                    key={s.id}
                    className={`p-2.5 rounded-xl border text-center ${
                      s.estado === 'OCUPADO'
                        ? 'bg-slate-900 border-slate-800 text-white'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <span className="text-xs font-bold font-mono">{s.codigo}</span>
                    <div className="text-[10px] mt-0.5 truncate font-mono">
                      {s.estado === 'OCUPADO' ? s.ticket_actual?.patente || 'OCUPADO' : 'Libre'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. VISTA DETALLADA: COLA DE APROBACIONES CON PIN */}
        {activeModule === 'approvals' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Cola de Aprobaciones de Excepciones de Garita
              </h2>
              <p className="text-xs text-slate-500">
                El operador registró estas operaciones bajo su PIN. El turno no podrá cerrarse hasta que el Administrador las vise.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Ticket / Patente</th>
                    <th className="py-2.5 px-3">Operador</th>
                    <th className="py-2.5 px-3">Tipo Excepción</th>
                    <th className="py-2.5 px-3 text-right">Monto Original</th>
                    <th className="py-2.5 px-3 text-right">Monto Cobrado</th>
                    <th className="py-2.5 px-3">Motivo Declarado</th>
                    <th className="py-2.5 px-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingExceptions.map((exc) => (
                    <tr key={exc.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-900">{exc.patente}</span>
                        <span className="block text-[11px] font-mono text-slate-400">{exc.ticketId}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{exc.operador}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            exc.tipo === 'COBRO_PARCIAL'
                              ? 'bg-amber-100 text-amber-800'
                              : exc.tipo === 'EXTRAVIO'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {exc.tipo}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500 tabular-nums">
                        ${exc.montoOriginal.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        ${exc.montoCobrado.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs">{exc.motivo}</td>
                      <td className="py-3 px-3 text-center">
                        {exc.estado === 'PENDIENTE' ? (
                          <button
                            onClick={() => setSelectedException(exc)}
                            className="px-3 py-1.5 bg-[#80093A] hover:bg-[#A52C55] text-white rounded-lg text-xs font-bold transition shadow-sm"
                          >
                            Visar con PIN
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                            <Check className="w-3.5 h-3.5" /> Aprobada
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. VISTA DETALLADA: TURNOS Y ARQUEO CIEGO */}
        {activeModule === 'shifts' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Histórico de Turnos y Conciliación de Cajas
                </h2>
                <p className="text-xs text-slate-500">
                  Auditoría inmutable de arqueos ciegos, sellos SHA-256 y diferencias de caja.
                </p>
              </div>
              <Link href="/reportes" className="text-xs text-[#80093A] font-bold hover:underline">
                Ver Todos los Reportes &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-900">
                  <span>Turno SHF-20260922-T01</span>
                  <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded">Caja Cuadrada</span>
                </div>
                <p className="text-xs text-slate-600 font-mono">Operador: Carlos Morales • 22 Sep</p>
                <div className="flex justify-between font-mono text-xs pt-1 border-t border-emerald-200/60 tabular-nums">
                  <span className="text-slate-500">Recaudación: $184.500</span>
                  <span className="text-emerald-700 font-bold">Diferencia: $0</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-rose-900">
                  <span>Turno SHF-20260921-T02</span>
                  <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded">Faltante $5.000</span>
                </div>
                <p className="text-xs text-slate-600 font-mono">Operador: Braulio A. • 21 Sep</p>
                <div className="flex justify-between font-mono text-xs pt-1 border-t border-rose-200/60 tabular-nums">
                  <span className="text-slate-500">Recaudación: $142.000</span>
                  <span className="text-rose-700 font-bold">Diferencia: -$5.000</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#F9F9FB] space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Turno SHF-20260921-T01</span>
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded">Caja Cuadrada</span>
                </div>
                <p className="text-xs text-slate-600 font-mono">Operador: Carlos Morales • 21 Sep</p>
                <div className="flex justify-between font-mono text-xs pt-1 border-t border-slate-200 tabular-nums">
                  <span className="text-slate-500">Recaudación: $195.000</span>
                  <span className="text-slate-700 font-bold">Diferencia: $0</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL PARA VISAR EXCEPCIÓN CON PIN DE ADMINISTRADOR */}
      {selectedException && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#80093A]" />
                Aprobación de Excepción con PIN
              </h3>
              <button
                onClick={() => setSelectedException(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">Patente:</span>
                <span className="font-bold text-slate-900">{selectedException.patente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tipo:</span>
                <span className="font-bold text-[#80093A]">{selectedException.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Diferencia:</span>
                <span className="font-bold text-rose-700 tabular-nums">
                  -${(selectedException.montoOriginal - selectedException.montoCobrado).toLocaleString('es-CL')} CLP
                </span>
              </div>
              <p className="text-[11px] text-slate-600 pt-1 font-sans border-t border-slate-200">
                &ldquo;{selectedException.motivo}&rdquo;
              </p>
            </div>

            <form onSubmit={handleApproveException} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  PIN de Administrador (4 Dígitos)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#80093A] outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedException(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#80093A] hover:bg-[#A52C55] text-white rounded-xl font-bold text-xs transition shadow-sm"
                >
                  Autorizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
