'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { SerranoLayoutMap } from '@/components/SerranoLayoutMap';
import { ShiftModal } from '@/components/ShiftModal';
import { ParkingSlot, Shift, AuditLog, Ticket, VehicleType, PaymentMethod } from '@/types';
import {
  Car,
  Truck,
  Bike,
  CreditCard,
  LayoutGrid,
  Clock,
  ShieldCheck,
  Video,
  LogOut,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  ArrowRight,
  Search,
  Grid,
  Printer,
  Share2,
  MessageCircle,
  FileSpreadsheet,
  Users,
  DollarSign,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Globe,
  Camera,
  Check,
  History
} from 'lucide-react';

function CockpitContent() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [shift, setShift] = useState<Shift | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Sub-pestañas operativas del panel derecho: 'terminal' | 'tabla' | 'clientes'
  const [posTab, setPosTab] = useState<'terminal' | 'tabla' | 'clientes'>('terminal');

  // Buscador superior rápido de Patente / Ticket
  const [quickSearchInput, setQuickSearchInput] = useState('');

  // Estados del Formulario de Ingreso (Check-in)
  const [inPatente, setInPatente] = useState('');
  const [inTipo, setInTipo] = useState<VehicleType>('auto');
  const [inForeign, setInForeign] = useState(false);
  const [inTelefono, setInTelefono] = useState('');
  const [inSlot, setInSlot] = useState<string>('');
  const [inNotes, setInNotes] = useState('');
  const [showInAdvanced, setShowInAdvanced] = useState(false);
  const [inLoading, setInLoading] = useState(false);
  const [inError, setInError] = useState<string | null>(null);

  // Pop-up 1: Previsualización de Ticket Térmico (80mm) al ingresar
  const [ticketPreviewModal, setTicketPreviewModal] = useState<Ticket | null>(null);
  const [ticketPrintSuccess, setTicketPrintSuccess] = useState(false);

  // Pop-up 2: Liquidación y Cobro (Checkout)
  const [checkoutModal, setCheckoutModal] = useState<{
    ticket: Ticket;
    minutosTranscurridos: number;
    montoAPagar: number;
    montoOriginal: number;
    estaEnGracia: boolean;
  } | null>(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<PaymentMethod>('EFECTIVO');
  const [checkoutCashReceived, setCheckoutCashReceived] = useState<number | ''>('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccessTicket, setCheckoutSuccessTicket] = useState<{ ticket: Ticket; vuelto: number } | null>(null);

  // Modal 3: Arqueo de Caja Ciega
  const [activeShiftModal, setActiveShiftModal] = useState(false);

  // Reloj oficial CLT
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
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [resSlots, resShift, resAudit] = await Promise.all([
        fetch('/api/slots').then((r) => r.json()).catch(() => ({ slots: [] })),
        fetch('/api/shifts').then((r) => r.json()).catch(() => ({ shift: null })),
        fetch('/api/audit').then((r) => r.json()).catch(() => ({ logs: [] })),
      ]);

      if (resSlots.slots) setSlots(resSlots.slots);
      if (resShift.shift) setShift(resShift.shift);
      if (resAudit.logs) setAuditLogs(resAudit.logs);
    } catch (e) {
      console.error('Error cargando PMS:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Atajos globales de Teclado (F1: Autofoco patente, F8: Caja Ciega, Esc: Cerrar Pop-ups)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setCheckoutModal(null);
        setTicketPreviewModal(null);
        const input = document.getElementById('pos-plate-input') as HTMLInputElement;
        if (input) input.focus();
      } else if (e.key === 'F8') {
        e.preventDefault();
        setActiveShiftModal((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCheckoutModal(null);
        setTicketPreviewModal(null);
        setActiveShiftModal(false);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Formateador automático de patentes chilenas (ABCD-12)
  const handlePatenteInputChange = (val: string) => {
    const raw = val.toUpperCase();
    if (inForeign) {
      setInPatente(raw);
    } else {
      const clean = raw.replace(/[^A-Z0-9]/g, '');
      if (clean.length > 4 && !clean.includes('-')) {
        setInPatente(`${clean.slice(0, 4)}-${clean.slice(4, 6)}`);
      } else {
        setInPatente(clean.slice(0, 7));
      }
    }
  };

  // Envío del Check-in: Genera y abre el Pop-up del Ticket Térmico
  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inPatente) return;
    setInError(null);
    setInLoading(true);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patente: inPatente,
          tipo: inTipo,
          telefono: inTelefono ? `+569${inTelefono.replace(/[^0-9]/g, '')}` : undefined,
          isForeignPlate: inForeign,
          slotId: inSlot ? Number(inSlot) : undefined,
          observaciones: inNotes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar el ingreso');

      // Abrir Pop-up de previsualización de Ticket Térmico (80mm)
      setTicketPreviewModal(data.ticket);
      setTicketPrintSuccess(false);

      // Limpiar formulario
      setInPatente('');
      setInTelefono('');
      setInSlot('');
      setInNotes('');
      setShowInAdvanced(false);

      // Actualizar datos de fondo
      fetchData();
    } catch (err: any) {
      setInError(err.message);
    } finally {
      setInLoading(false);
    }
  };

  // Acción al presionar "Imprimir Ticket" en el Pop-up:
  // Cierra el pop-up, vuelve al POS y actualiza los slots inmediatamente
  const handlePrintTicketAndClose = () => {
    setTicketPrintSuccess(true);
    setTimeout(() => {
      setTicketPreviewModal(null);
      setTicketPrintSuccess(false);
      fetchData();
    }, 600);
  };

  // Apertura del Pop-up de Cobro a partir de una patente o ticket
  const handleOpenCheckoutByPlate = async (patenteOrId: string) => {
    if (!patenteOrId) return;
    setCheckoutError(null);
    setCheckoutLoading(true);

    try {
      const res = await fetch(`/api/checkout?id=${encodeURIComponent(patenteOrId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ticket no encontrado');

      setCheckoutModal(data);
      setCheckoutCashReceived(data.montoAPagar);
      setCheckoutPaymentMethod('EFECTIVO');
      setQuickSearchInput('');
    } catch (err: any) {
      alert(`Aviso: ${err.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Procesar liquidación y pago del vehículo
  const handleConfirmCheckout = async () => {
    if (!checkoutModal) return;
    setCheckoutError(null);
    setCheckoutLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: checkoutModal.ticket.id_ticket,
          metodoPago: checkoutPaymentMethod,
          montoEntregado: Number(checkoutCashReceived || 0),
          accion: 'COBRO',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar cobro');

      setCheckoutSuccessTicket(data);
      setCheckoutModal(null);
      fetchData();
    } catch (err: any) {
      setCheckoutError(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalSlots = 30;
  const disponibles = slots.filter((s) => s.estado === 'DISPONIBLE').length;
  const ocupados = slots.filter((s) => s.estado === 'OCUPADO').length;
  const availableSlotIds = slots.filter((s) => s.estado === 'DISPONIBLE').map((s) => s.id);

  // Listado de tickets activos en recinto
  const activeTickets: Ticket[] = slots
    .filter((s) => s.estado === 'OCUPADO' && s.ticket_actual)
    .map((s) => s.ticket_actual!);

  // Vuelto en efectivo calculado
  const vueltoCalculado =
    checkoutModal && typeof checkoutCashReceived === 'number'
      ? Math.max(0, checkoutCashReceived - checkoutModal.montoAPagar)
      : 0;

  return (
    <div className="min-h-screen bg-[#06080E] text-white flex flex-col font-sans selection:bg-[#80093A] selection:text-white relative overflow-hidden">
      {/* Background Texture from Magnific AI */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: "url('/hub-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080E]/60 to-[#06080E] pointer-events-none" />

      {/* 1. ENCABEZADO SUPERIOR METALIZADO CON BUSCADOR RÁPIDO & REGRESO AL LAUNCHPAD */}
      <header className="relative z-40 glass-panel mx-4 mt-4 rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1700px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
          {/* Logo y Regreso al Launchpad */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/hub"
              title="Volver al Menú Principal (Launchpad)"
              className="w-12 h-12 rounded-2xl macos-btn-primary flex items-center justify-center hover:scale-105 active:scale-95 transition"
            >
              <Grid className="w-5 h-5 text-white" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">PARKOPS COCKPIT</span>
                <span className="bg-[#80093A]/40 text-[#ffb1c2] border border-[#80093A]/70 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  Serrano 447
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Turno: {shift?.id_turno || 'ACTIVO'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{disponibles} Plazas Libres</span>
              </p>
            </div>
          </div>

          {/* BUSCADOR RÁPIDO SUPERIOR DE PATENTE / TICKET (Abre Pop-up de Cobro) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOpenCheckoutByPlate(quickSearchInput);
            }}
            className="flex-1 max-w-md hidden sm:flex items-center gap-2"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Escanear ticket o escribir patente (ej: KD-JL-84)..."
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-white font-mono font-bold text-xs tracking-wider placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#80093A] transition"
              />
            </div>
            <button
              type="submit"
              disabled={checkoutLoading || !quickSearchInput}
              className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold font-mono transition shadow-lg shrink-0 disabled:opacity-50 active:scale-95"
            >
              COBRAR
            </button>
          </form>

          {/* Atajos de Control & Reloj */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-xl font-mono text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="tabular-nums font-bold tracking-wider">{currentTime || '12:00:00'} CLT</span>
            </div>

            <button
              onClick={() => setActiveShiftModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Caja [F8]</span>
            </button>

            <Link
              href="/hub"
              className="px-3 py-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
            >
              <span>Launchpad</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Recibo Rápido de Cobro Exitoso */}
      {checkoutSuccessTicket && (
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 pt-3">
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-center justify-between text-xs text-emerald-300 animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-sm text-white block">
                  Cobro Liquidado • Barrera Abierta para {checkoutSuccessTicket.ticket.patente}
                </span>
                <span className="font-mono text-slate-300">
                  Total Cobrado: ${checkoutSuccessTicket.ticket.monto_total_cobrado?.toLocaleString('es-CL')} • Vuelto: ${checkoutSuccessTicket.vuelto.toLocaleString('es-CL')} CLP
                </span>
              </div>
            </div>
            <button
              onClick={() => setCheckoutSuccessTicket(null)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl"
            >
              Listo
            </button>
          </div>
        </div>
      )}

      {/* 2. DISPOSICIÓN PRINCIPAL UNIFICADA EN UNA SOLA VISTA */}
      {/* IZQUIERDA: SLOTS DE ESTACIONAMIENTO REAL (45%) | DERECHA: PUNTO DE VENTA COMPACTO (55%) */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* PANEL IZQUIERDO: MATRIZ DE SLOTS SERRANO 447 (ESTÉTICA REAL DE ESTACIONAMIENTO) */}
        <div className="lg:col-span-5 h-[calc(100vh-125px)] sticky top-22">
          <SerranoLayoutMap
            slots={slots}
            onSelectSlotForCheckout={(patente) => handleOpenCheckoutByPlate(patente)}
            onSelectSlotForCheckin={(slotId) => {
              setInSlot(slotId.toString());
              const input = document.getElementById('pos-plate-input') as HTMLInputElement;
              if (input) input.focus();
            }}
          />
        </div>

        {/* PANEL DERECHO: PUNTO DE VENTA COMPACTO CON MEJORES FUENTES & SUB-PESTAÑAS */}
        <div className="lg:col-span-7 glass-panel rounded-[2rem] p-5 sm:p-7 flex flex-col min-h-[calc(100vh-140px)] space-y-6 spring-anim relative z-10">
          {/* Barra de Sub-Pestañas del POS */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPosTab('terminal')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                  posTab === 'terminal'
                    ? 'bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Terminal POS & Check-In</span>
              </button>

              <button
                type="button"
                onClick={() => setPosTab('tabla')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                  posTab === 'tabla'
                    ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Tabla de Vehículos ({activeTickets.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setPosTab('clientes')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                  posTab === 'clientes'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Clientes & Abonados</span>
              </button>
            </div>

            <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline">
              F1: Autofoco Patente
            </span>
          </div>

          {/* SUB-PESTAÑA 1: TERMINAL OPERATIVA & INGRESO RÁPIDO */}
          {posTab === 'terminal' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between animate-in fade-in duration-150">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#80093A]" />
                      Ingreso de Vehículo a Garita
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Emite ticket térmico dual y actualiza la matriz instantáneamente
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInForeign(!inForeign)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                      inForeign
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{inForeign ? 'Patente Extranjera' : 'Chilena'}</span>
                  </button>
                </div>

                {inError && (
                  <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 rounded-2xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{inError}</span>
                  </div>
                )}

                <form onSubmit={handleCheckinSubmit} className="space-y-5">
                  {/* 1. INPUT GIGANTE DE MATRÍCULA PATENTE */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Placa Patente <span className="text-[#ff86a5]">*</span>
                    </label>
                    <input
                      id="pos-plate-input"
                      type="text"
                      required
                      autoFocus
                      maxLength={inForeign ? 12 : 8}
                      placeholder={inForeign ? 'EJ: PB-9821-PE' : 'KD-JL-84'}
                      value={inPatente}
                      onChange={(e) => handlePatenteInputChange(e.target.value)}
                      className="w-full py-4 px-4 text-center font-mono font-black text-3xl sm:text-4xl tracking-widest uppercase bg-black/60 border-2 border-white/20 rounded-2xl focus:outline-none focus:border-[#ff86a5] focus:ring-4 focus:ring-[#80093A]/30 text-white shadow-inner transition"
                    />
                  </div>

                  {/* 2. SELECTOR VISUAL DE CATEGORÍA VEHICULAR */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Categoría Vehicular
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setInTipo('auto')}
                        className={`h-18 rounded-2xl border-2 transition flex flex-col items-center justify-center gap-1 ${
                          inTipo === 'auto'
                            ? 'bg-gradient-to-b from-[#80093A] to-[#A52C55] border-[#ff86a5] text-white shadow-lg'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Car className="w-5 h-5" />
                        <span className="text-xs font-bold">Auto</span>
                        <span className="text-[10px] font-mono opacity-80">$25/min</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInTipo('camioneta')}
                        className={`h-18 rounded-2xl border-2 transition flex flex-col items-center justify-center gap-1 ${
                          inTipo === 'camioneta'
                            ? 'bg-gradient-to-b from-[#80093A] to-[#A52C55] border-[#ff86a5] text-white shadow-lg'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Truck className="w-5 h-5 text-amber-300" />
                        <span className="text-xs font-bold">Camioneta/SUV</span>
                        <span className="text-[10px] font-mono opacity-80">$30/min</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInTipo('moto')}
                        className={`h-18 rounded-2xl border-2 transition flex flex-col items-center justify-center gap-1 ${
                          inTipo === 'moto'
                            ? 'bg-gradient-to-b from-[#80093A] to-[#A52C55] border-[#ff86a5] text-white shadow-lg'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Bike className="w-5 h-5 text-emerald-300" />
                        <span className="text-xs font-bold">Moto</span>
                        <span className="text-[10px] font-mono opacity-80">$15/min</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. MENÚ COLAPSABLE DE OPCIONES SECUNDARIAS */}
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                    <button
                      type="button"
                      onClick={() => setShowInAdvanced(!showInAdvanced)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.03] transition"
                    >
                      <span className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-sky-400" />
                        <span>Asignar Plaza Específica & Datos Opcionales</span>
                      </span>
                      {showInAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showInAdvanced && (
                      <div className="p-4 pt-2 border-t border-white/[0.06] space-y-3 animate-in slide-in-from-top-2 duration-150">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                              Bahía / Slot Específico
                            </label>
                            <select
                              value={inSlot}
                              onChange={(e) => setInSlot(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#0B0F1A] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                            >
                              <option value="">Próximo libre automático</option>
                              {availableSlotIds.map((id) => (
                                <option key={id} value={id}>
                                  Slot {id.toString().padStart(2, '0')} (Sector {id <= 15 ? 'A' : 'B'})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                              Teléfono WhatsApp
                            </label>
                            <input
                              type="tel"
                              placeholder="+56 9 1234 5678"
                              value={inTelefono}
                              onChange={(e) => setInTelefono(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                            Glosa de Daños Previos (Ticket Térmico)
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Sin daños visibles / Rayón menor parachoque"
                            value={inNotes}
                            onChange={(e) => setInNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. BOTÓN GIGANTE DE EMISIÓN DE TICKET (54px) */}
                  <button
                    type="submit"
                    disabled={inLoading || !inPatente}
                    className="w-full h-14 bg-gradient-to-r from-[#80093A] via-[#A52C55] to-[#80093A] hover:opacity-95 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(128,9,58,0.5)] border border-white/20 transition active:scale-[0.99] disabled:opacity-50"
                  >
                    {inLoading ? (
                      'Generando Ticket...'
                    ) : (
                      <>
                        <span>EMITIR TICKET DUAL & ABRIR BARRERA [ENTER]</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Barra rápida de vehículos activos para cobro inmediato con un clic */}
              {activeTickets.length > 0 && (
                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Vehículos en Recinto (Clic para cobrar en pop-up):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {activeTickets.map((t) => (
                      <button
                        key={t.id_ticket}
                        type="button"
                        onClick={() => handleOpenCheckoutByPlate(t.patente)}
                        className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-sky-600/30 border border-white/10 hover:border-sky-500/50 text-white font-mono text-xs font-bold transition flex items-center gap-2 shrink-0 active:scale-95"
                      >
                        <Car className="w-3.5 h-3.5 text-sky-400" />
                        <span>{t.patente}</span>
                        <span className="text-[10px] text-slate-400">
                          {t.slot_numero ? `S-${t.slot_numero}` : ''}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-PESTAÑA 2: TABLA DE VEHÍCULOS (ACTIVOS, SALIDOS & SOBREESTADÍA) */}
          {posTab === 'tabla' && (
            <div className="space-y-4 flex-1 overflow-y-auto animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Registro de Vehículos del Turno</h3>
                  <p className="text-xs text-slate-400 font-mono">Control de aforo e histórico de cobros</p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-white/[0.05] border border-white/10 rounded-xl text-slate-300">
                  {activeTickets.length} Activos • Serrano 447
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/[0.06] text-[11px] uppercase">
                      <th className="py-2.5 px-3">Ticket</th>
                      <th className="py-2.5 px-3">Patente</th>
                      <th className="py-2.5 px-3">Slot</th>
                      <th className="py-2.5 px-3">Hora Ingreso</th>
                      <th className="py-2.5 px-3">Tarifa</th>
                      <th className="py-2.5 px-3">Estado</th>
                      <th className="py-2.5 px-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {activeTickets.map((t) => (
                      <tr key={t.id_ticket} className="hover:bg-white/[0.02] transition">
                        <td className="py-3 px-3 text-slate-400 text-[11px]">{t.id_ticket}</td>
                        <td className="py-3 px-3 font-bold text-white text-sm">{t.patente}</td>
                        <td className="py-3 px-3 font-bold text-sky-400">
                          {t.slot_numero ? `Slot ${t.slot_numero}` : 'Asignada'}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {new Date(t.fecha_hora_ingreso).toLocaleTimeString('es-CL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">${t.tarifa_por_minuto}/min</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Activo
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenCheckoutByPlate(t.patente)}
                            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition"
                          >
                            Cobrar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-PESTAÑA 3: CLIENTES & ABONADOS MENSUALES */}
          {posTab === 'clientes' && (
            <div className="space-y-4 flex-1 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Directorio Rápido de Convenios</h3>
                  <p className="text-xs text-slate-400 font-mono">Clientes con plaza fija o pernocta mensual</p>
                </div>
                <Link
                  href="/convenios"
                  className="text-xs font-bold text-[#ffb1c2] hover:underline flex items-center gap-1"
                >
                  <span>Gestionar en ERP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { cliente: 'Estudio Jurídico Serrano', patente: 'JKLP34', slot: 'A-02', estado: 'Al Día' },
                  { cliente: 'Consulado de Italia', patente: 'CDAB89', slot: 'B-18', estado: 'Al Día' },
                  { cliente: 'Transportes Marítimos', patente: 'FGHI12', slot: 'B-25', estado: 'Pendiente' },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-white text-sm block font-sans">{c.cliente}</span>
                      <span className="text-slate-400">
                        Patente: <strong className="text-sky-400">{c.patente}</strong> • Plaza: {c.slot}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {c.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. POP-UP DINÁMICO 1: PREVISUALIZACIÓN DE TICKET TÉRMICO (80MM) */}
      {ticketPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#111726] rounded-3xl border border-white/10 max-w-sm w-full p-6 text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Cabecera Pop-up */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Ticket Térmico de Ingreso</h3>
              </div>
              <button
                type="button"
                onClick={() => setTicketPreviewModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulación Realista de Ticket Térmico 80mm */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 font-mono text-center shadow-inner space-y-3 text-xs border border-slate-300">
              <div className="space-y-0.5 border-b border-dashed border-slate-400 pb-2">
                <h4 className="font-black text-sm tracking-tight font-sans">CORDANO INVERSIONES</h4>
                <p className="text-[10px] text-slate-600">Estacionamiento Serrano 447, Iquique</p>
                <p className="text-[10px] text-slate-500">RUT: 76.543.210-K</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Ticket N°</span>
                <span className="font-bold text-xs block text-slate-800">{ticketPreviewModal.id_ticket}</span>
                <div className="text-2xl font-black tracking-widest text-black py-1">
                  {ticketPreviewModal.patente}
                </div>
                <div className="text-[11px] font-bold text-slate-700">
                  {ticketPreviewModal.slot_numero ? `Bahía Asignada: Slot ${ticketPreviewModal.slot_numero}` : 'Plaza Asignada'}
                </div>
              </div>

              {/* Simulación Visual de Código QR & Código de Barras 128 */}
              <div className="py-2 border-y border-dashed border-slate-300 flex flex-col items-center gap-1.5">
                <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[9px] font-sans font-bold p-1">
                  [ QR CODE DUAL ]
                </div>
                <div className="h-6 w-36 bg-slate-900 flex items-center justify-center text-white text-[8px] tracking-widest">
                  ||||| |||| || |||||
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{ticketPreviewModal.id_ticket}</span>
              </div>

              <div className="text-[10px] text-slate-600 space-y-0.5 text-left pt-1">
                <div className="flex justify-between">
                  <span>Ingreso:</span>
                  <strong>
                    {new Date(ticketPreviewModal.fecha_hora_ingreso).toLocaleString('es-CL', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Tarifa:</span>
                  <strong>${ticketPreviewModal.tarifa_por_minuto} / minuto</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo Gracia:</span>
                  <strong>10 minutos sin cobro</strong>
                </div>
              </div>

              <p className="text-[9px] text-slate-500 text-center pt-1 italic border-t border-dashed border-slate-300">
                Conserve este comprobante. Recargo por extravío: $10.000 CLP.
              </p>
            </div>

            {/* Botones del Pop-up: Imprimir o WhatsApp */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handlePrintTicketAndClose}
                className="w-full h-12 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition active:scale-[0.99]"
              >
                <Printer className="w-4 h-4" />
                <span>{ticketPrintSuccess ? '¡Imprimiendo Ticket!' : 'IMPRIMIR TICKET & ACTUALIZAR SLOTS'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Enviando ticket a WhatsApp de ${ticketPreviewModal.patente}...`);
                  handlePrintTicketAndClose();
                }}
                className="w-full h-11 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-emerald-400 border border-white/10 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. POP-UP DINÁMICO 2: LIQUIDACIÓN, COBRO & VUELTO GIGANTE (CHECKOUT) */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#111726] rounded-3xl border border-white/15 max-w-lg w-full p-6 text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Cabecera */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold">Liquidación de Cobro y Salida</h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {checkoutError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 rounded-xl">
                {checkoutError}
              </div>
            )}

            {/* Datos del Vehículo */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between font-mono">
              <div>
                <span className="text-[11px] text-slate-400 block">Patente Vehículo:</span>
                <span className="text-2xl font-black text-white tracking-wider">
                  {checkoutModal.ticket.patente}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Tiempo en Garita:</span>
                <span className="text-base font-bold text-sky-400">
                  {checkoutModal.minutosTranscurridos} minutos
                </span>
              </div>
            </div>

            {/* TOTAL A PAGAR GIGANTE */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-black border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400">Total a Liquidar:</span>
                {checkoutModal.estaEnGracia ? (
                  <div className="text-emerald-400 font-mono font-black text-3xl">
                    $0 CLP <span className="text-xs font-bold text-emerald-300">(Tiempo de Gracia)</span>
                  </div>
                ) : (
                  <div className="text-white font-mono font-black text-4xl">
                    ${checkoutModal.montoAPagar.toLocaleString('es-CL')}{' '}
                    <span className="text-xs font-bold text-slate-400">CLP</span>
                  </div>
                )}
              </div>
              <div className="text-right font-mono text-xs text-slate-400">
                ${checkoutModal.ticket.tarifa_por_minuto}/minuto
              </div>
            </div>

            {/* Selector de Medios de Pago */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Método de Pago
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod('EFECTIVO')}
                  className={`h-12 rounded-2xl border-2 transition font-bold text-xs flex items-center justify-center gap-1.5 ${
                    checkoutPaymentMethod === 'EFECTIVO'
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 border-emerald-400 text-white shadow-lg'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>[1] Efectivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod('TARJETA')}
                  className={`h-12 rounded-2xl border-2 transition font-bold text-xs flex items-center justify-center gap-1.5 ${
                    checkoutPaymentMethod === 'TARJETA'
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 border-sky-400 text-white shadow-lg'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>[2] Transbank</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod('TRANSFERENCIA')}
                  className={`h-12 rounded-2xl border-2 transition font-bold text-xs flex items-center justify-center gap-1.5 ${
                    checkoutPaymentMethod === 'TRANSFERENCIA'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 border-purple-400 text-white shadow-lg'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>[3] Transf.</span>
                </button>
              </div>
            </div>

            {/* Calculadora de Vuelto Gigante en Verde Esmeralda */}
            {checkoutPaymentMethod === 'EFECTIVO' && (
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Efectivo Recibido
                  </label>
                  <input
                    type="number"
                    step={100}
                    value={checkoutCashReceived}
                    onChange={(e) => setCheckoutCashReceived(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <span className="block text-[11px] font-bold text-emerald-400 uppercase mb-1">
                    Vuelto a Entregar:
                  </span>
                  <div className="h-11 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-emerald-300 font-mono font-black text-xl">
                    <span>${vueltoCalculado.toLocaleString('es-CL')}</span>
                    <span className="text-[10px] text-emerald-400">CLP</span>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de Confirmación de Pago & Apertura de Barrera */}
            <button
              type="button"
              disabled={checkoutLoading}
              onClick={handleConfirmCheckout}
              className="w-full h-13 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:opacity-95 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(16,185,129,0.4)] border border-white/20 transition active:scale-[0.99] disabled:opacity-50"
            >
              {checkoutLoading ? 'Procesando Pago...' : 'CONFIRMAR COBRO & ABRIR BARRERA [ENTER]'}
            </button>
          </div>
        </div>
      )}

      {/* 5. MODAL DE CAJA CIEGA & ARQUEO DE TURNO */}
      {activeShiftModal && shift && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl">
            <ShiftModal
              currentShift={shift}
              onClose={() => setActiveShiftModal(false)}
              onShiftUpdated={fetchData}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070A12] flex items-center justify-center text-white font-mono text-sm">Cargando ParkOps Cockpit...</div>}>
      <CockpitContent />
    </Suspense>
  );
}
