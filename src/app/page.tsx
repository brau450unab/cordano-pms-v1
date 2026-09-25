'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { SerranoLayoutMap } from '@/components/SerranoLayoutMap';
import { ShiftModal } from '@/components/ShiftModal';
import { ThermalTicketPDFTemplate } from '@/components/ThermalTicketPDFTemplate';
import { ParkingSlot, Shift, AuditLog, Ticket, VehicleType, PaymentMethod } from '@/types';
import {
  Car,
  Truck,
  Bike,
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  Search,
  Grid,
  Printer,
  MessageCircle,
  DollarSign,
  ArrowRightLeft,
  Globe,
  Unlock,
  Percent,
  FileWarning,
  Eye,
  LayoutDashboard,
  FileBarChart2,
  Camera
} from 'lucide-react';

function CockpitContent() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [shift, setShift] = useState<Shift | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Sub-modo en la consola izquierda (40%): 'pos' (Unificado Check-in & Digital Receipt) | 'activos'
  const [consoleView, setConsoleView] = useState<'pos' | 'activos'>('pos');

  // Estado del input principal de Patente / Ticket (F1 / F2)
  const [plateInput, setPlateInput] = useState('ABCD-12');
  const [inTipo, setInTipo] = useState<VehicleType>('auto');
  const [selectedTariffPlan, setSelectedTariffPlan] = useState<'MINUTO' | 'JORNADA' | 'NOCHE'>('MINUTO');
  const [inForeign, setInForeign] = useState(false);
  const [inSlot, setInSlot] = useState<string>('');
  const [inTelefono, setInTelefono] = useState('');
  const [inLoading, setInLoading] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  // Estado del Recibo Digital en Vivo (Digital Receipt en la consola 40%)
  const [activeReceipt, setActiveReceipt] = useState<{
    ticket?: Ticket;
    patente: string;
    entryTime: string;
    exitTime: string;
    durationText: string;
    minutos: number;
    tariffLabel: string;
    baseAmount: number;
    discountAmount: number;
    surchargeAmount: number;
    finalAmount: number;
    isSimulated: boolean;
  }>({
    patente: 'ABCD-12',
    entryTime: '09:30 AM',
    exitTime: '12:00 PM',
    durationText: '2h 30m (150 min)',
    minutos: 150,
    tariffLabel: '$30 / min',
    baseAmount: 4500,
    discountAmount: 0,
    surchargeAmount: 0,
    finalAmount: 4500,
    isSimulated: true,
  });

  // Medio de Pago y Calculadora de Vuelto en consola
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EFECTIVO');
  const [cashReceived, setCashReceived] = useState<number | ''>(5000);
  const [barrierOpenPulse, setBarrierOpenPulse] = useState(false);

  // Pop-up 1: Ticket Térmico 80mm & PDF (F8)
  const [ticketPreviewModal, setTicketPreviewModal] = useState<Ticket | null>(null);

  // Pop-up 2: Autorización PIN Antifraude (Verde: Descuento Operador [F6] | Rojo: Ticket Perdido Admin [F7])
  const [pinAuditModal, setPinAuditModal] = useState<'DISCOUNT' | 'LOST_TICKET' | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinJustification, setPinJustification] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [pinError, setPinError] = useState<string | null>(null);

  // Pop-up 3: Arqueo de Caja Ciega
  const [activeShiftModal, setActiveShiftModal] = useState(false);

  // Pop-up 4: Galería de Mockups Oficiales V2.0
  const [showMockupReference, setShowMockupReference] = useState(false);

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

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Formateo de patente chilena (ABCD-12)
  const formatPlate = (val: string) => {
    const raw = val.toUpperCase();
    if (inForeign) return raw.slice(0, 12);
    const clean = raw.replace(/[^A-Z0-9]/g, '');
    if (clean.length > 4) {
      return `${clean.slice(0, 4)}-${clean.slice(4, 6)}`;
    }
    return clean.slice(0, 7);
  };

  // Buscar patente en recinto o calcular recibo en vivo
  const handleLookupOrPreviewPlate = useCallback(
    async (queryPlate: string) => {
      const target = queryPlate.trim().toUpperCase();
      if (!target) return;

      try {
        const res = await fetch(`/api/checkout?id=${encodeURIComponent(target)}`);
        if (res.ok) {
          const data = await res.json();
          const t: Ticket = data.ticket;
          const mins: number = data.minutosTranscurridos || 45;
          const hrs = Math.floor(mins / 60);
          const remMins = mins % 60;
          const entryStr = new Date(t.fecha_hora_ingreso).toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const exitStr = new Date().toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
          });

          setPlateInput(t.patente);
          setActiveReceipt({
            ticket: t,
            patente: t.patente,
            entryTime: entryStr,
            exitTime: exitStr,
            durationText: `${hrs}h ${remMins}m (${mins} min)`,
            minutos: mins,
            tariffLabel: `$${t.tarifa_por_minuto || 30} / min`,
            baseAmount: data.montoAPagar,
            discountAmount: 0,
            surchargeAmount: 0,
            finalAmount: data.montoAPagar,
            isSimulated: false,
          });
          setCashReceived(Math.ceil((data.montoAPagar || 1000) / 1000) * 1000);
          setStatusBanner({
            type: 'success',
            text: `Ticket activo localizado para ${t.patente} (${t.id_ticket}). Listo para liquidar.`,
          });
          return;
        }
      } catch {
        // Fallback a simulación interactiva
      }

      // Si no está en recinto aún, actualiza vista previa de recibo según plan seleccionado
      const base =
        selectedTariffPlan === 'JORNADA'
          ? 6000
          : selectedTariffPlan === 'NOCHE'
          ? 5000
          : 4500;
      const label =
        selectedTariffPlan === 'JORNADA'
          ? 'Jornada $6.000'
          : selectedTariffPlan === 'NOCHE'
          ? 'Noche $5.000'
          : '$30 / min';

      setActiveReceipt({
        patente: target,
        entryTime: '09:30 AM',
        exitTime: '12:00 PM',
        durationText: selectedTariffPlan === 'MINUTO' ? '2h 30m (150 min)' : selectedTariffPlan,
        minutos: 150,
        tariffLabel: label,
        baseAmount: base,
        discountAmount: 0,
        surchargeAmount: 0,
        finalAmount: base,
        isSimulated: true,
      });
    },
    [selectedTariffPlan]
  );

  // Actualizar recibo cuando cambia la píldora de tarifa
  const handleSelectTariffPlan = (plan: 'MINUTO' | 'JORNADA' | 'NOCHE') => {
    setSelectedTariffPlan(plan);
    const base = plan === 'JORNADA' ? 6000 : plan === 'NOCHE' ? 5000 : 4500;
    const label =
      plan === 'JORNADA' ? 'Jornada $6.000' : plan === 'NOCHE' ? 'Noche $5.000' : '$30 / min';
    setActiveReceipt((prev) => ({
      ...prev,
      tariffLabel: label,
      baseAmount: base,
      discountAmount: 0,
      surchargeAmount: 0,
      finalAmount: base,
    }));
    setCashReceived(base >= 5000 ? 10000 : 5000);
  };

  // Emitir Nuevo Ingreso (Check-in) -> Abre Ticket Térmico 80mm
  const handleCheckinVehicle = async () => {
    if (!plateInput.trim()) return;
    setInLoading(true);
    setStatusBanner(null);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patente: plateInput.trim().toUpperCase(),
          tipo: inTipo,
          telefono: inTelefono ? `+569${inTelefono.replace(/[^0-9]/g, '')}` : undefined,
          isForeignPlate: inForeign,
          slotId: inSlot ? Number(inSlot) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar ingreso');

      setTicketPreviewModal(data.ticket);
      setStatusBanner({
        type: 'success',
        text: `Ingreso registrado: ${data.ticket.patente} en Plaza ${
          data.ticket.slot_numero || 'Auto'
        } • Ticket ${data.ticket.id_ticket}`,
      });
      fetchData();
    } catch (err: any) {
      setStatusBanner({ type: 'error', text: err.message });
    } finally {
      setInLoading(false);
    }
  };

  // Liquidar Cobro y Abrir Barrera
  const handleProcessPayment = async (methodOverride?: PaymentMethod) => {
    const chosenMethod = methodOverride || paymentMethod;
    setPaymentMethod(chosenMethod);

    if (activeReceipt.ticket) {
      setInLoading(true);
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: activeReceipt.ticket.id_ticket,
            metodoPago: chosenMethod,
            montoEntregado: Number(cashReceived || activeReceipt.finalAmount),
            accion: 'COBRO',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al liquidar cobro');

        setBarrierOpenPulse(true);
        setTimeout(() => setBarrierOpenPulse(false), 3000);
        setStatusBanner({
          type: 'success',
          text: `Cobro liquidado ($${activeReceipt.finalAmount.toLocaleString(
            'es-CL'
          )} CLP vía ${chosenMethod}). Barrera Abierta para ${activeReceipt.patente}.`,
        });
        fetchData();
      } catch (err: any) {
        setStatusBanner({ type: 'error', text: err.message });
      } finally {
        setInLoading(false);
      }
    } else {
      // Simulación directa sobre el recibo activo
      setBarrierOpenPulse(true);
      setTimeout(() => setBarrierOpenPulse(false), 3000);
      setStatusBanner({
        type: 'success',
        text: `Cobro registrado ($${activeReceipt.finalAmount.toLocaleString(
          'es-CL'
        )} CLP vía ${chosenMethod}). Barrera Abierta para ${activeReceipt.patente}.`,
      });
    }
  };

  // Aplicar Autorización Antifraude por PIN (Verde: Descuento Operador | Rojo: Ticket Perdido Admin)
  const handleConfirmPinAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    if (pinInput.length < 4) {
      setPinError('Debe ingresar un PIN válido de 4 dígitos.');
      return;
    }

    if (pinAuditModal === 'DISCOUNT') {
      if (pinJustification.trim().length <= 10) {
        setPinError(
          'Regla Antifraude: La justificación escrita es obligatoria y debe superar los 10 caracteres.'
        );
        return;
      }
      const disc = Math.round(activeReceipt.baseAmount * (discountPercent / 100));
      const nextFinal = Math.max(0, activeReceipt.baseAmount - disc);
      setActiveReceipt((prev) => ({
        ...prev,
        discountAmount: disc,
        surchargeAmount: 0,
        finalAmount: nextFinal,
      }));
      setStatusBanner({
        type: 'success',
        text: `AUDITORÍA VERDE: Descuento ${discountPercent}% (-$${disc.toLocaleString(
          'es-CL'
        )}) autorizado con PIN Operador.`,
      });
    } else if (pinAuditModal === 'LOST_TICKET') {
      const recargo = 8000;
      setActiveReceipt((prev) => ({
        ...prev,
        discountAmount: 0,
        surchargeAmount: recargo,
        tariffLabel: 'Multa Ticket Extraviado',
        finalAmount: recargo,
      }));
      setCashReceived(10000);
      setStatusBanner({
        type: 'warning',
        text: 'AUDITORÍA ROJA: Recargo por Ticket Extraviado ($8.000 CLP) aplicado con PIN Administrador.',
      });
    }

    setPinInput('');
    setPinJustification('');
    setPinAuditModal(null);
  };

  // Abrir vista previa de Ticket 80mm (F8)
  const handleOpen80mmTicketPreview = () => {
    if (activeReceipt.ticket) {
      setTicketPreviewModal(activeReceipt.ticket);
      return;
    }
    // Construye un ticket demostrativo canónico si aún no se ha emitido
    const demoTicket: Ticket = {
      id_ticket: 'TKT-20260419-T01-0842',
      patente: (plateInput || 'ABCD-12').toUpperCase(),
      vehiculo_tipo: inTipo,
      fecha_hora_ingreso: new Date().toISOString(),
      tarifa_por_minuto: 30,
      tiempo_gracia_minutos: 10,
      estado_ticket: 'ACTIVO',
      is_offline: false,
      reprint_count: 0,
      slot_numero: inSlot ? Number(inSlot) : 12,
    };
    setTicketPreviewModal(demoTicket);
  };

  // Atajos globales de Teclado (Regla 1 AGENTS.md: F1–F9, Enter, Esc)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'F1' || e.key === 'F2') {
        e.preventDefault();
        const input = document.getElementById('pos-plate-input') as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      } else if (e.key === 'F3') {
        e.preventDefault();
        handleSelectTariffPlan(
          selectedTariffPlan === 'MINUTO'
            ? 'JORNADA'
            : selectedTariffPlan === 'JORNADA'
            ? 'NOCHE'
            : 'MINUTO'
        );
      } else if (e.key === 'F4') {
        e.preventDefault();
        handleProcessPayment('EFECTIVO');
      } else if (e.key === 'F5') {
        e.preventDefault();
        handleProcessPayment('TARJETA');
      } else if (e.key === 'F6') {
        e.preventDefault();
        setPinAuditModal('DISCOUNT');
      } else if (e.key === 'F7') {
        e.preventDefault();
        setPinAuditModal('LOST_TICKET');
      } else if (e.key === 'F8') {
        e.preventDefault();
        handleOpen80mmTicketPreview();
      } else if (e.key === 'F9') {
        e.preventDefault();
        setBarrierOpenPulse(true);
        setTimeout(() => setBarrierOpenPulse(false), 3000);
        setStatusBanner({
          type: 'success',
          text: ` Pulso LPR enviado a Barrera Principal (Serrano 447) para ${plateInput}.`,
        });
      } else if (e.key === 'Escape') {
        setTicketPreviewModal(null);
        setPinAuditModal(null);
        setActiveShiftModal(false);
        setShowMockupReference(false);
      }
    },
    [plateInput, selectedTariffPlan, activeReceipt]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Estadísticas rápidas y tickets activos
  const activeTickets: Ticket[] = slots
    .filter((s) => s.estado === 'OCUPADO' && s.ticket_actual)
    .map((s) => s.ticket_actual!);

  const vueltoCalculado =
    typeof cashReceived === 'number'
      ? Math.max(0, cashReceived - activeReceipt.finalAmount)
      : 0;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F9F9FB] text-slate-900 flex flex-col font-sans select-none">
      {/* ===================================================================== */}
      {/* 1. BARRA SUPERIOR DE VENTANA ESTILO macOS SONOMA / SEQUOIA (48px)     */}
      {/* ===================================================================== */}
      <header className="h-12 bg-white/95 backdrop-blur-md border-b border-[#E2E2E4] px-4 flex items-center justify-between shrink-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Izquierda: Semáforo macOS + Marca ParkOps Burgundy + Enlaces Rápidos */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block" />
          </div>

          <div className="h-4 w-[1px] bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#80093A] flex items-center justify-center text-white font-black text-xs shadow-sm">
              P
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#80093A]">
              ParkOps
            </span>
            <span className="text-[11px] font-medium text-slate-400 hidden xl:inline">
              PMS Cordano (Serrano 447, Iquique)
            </span>
          </div>

          {/* Navegación Rápida estilo Mockup #1 */}
          <nav className="hidden md:flex items-center gap-1 ml-2 bg-[#F3F4F6] p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
            <span className="px-3 py-1 rounded-lg bg-white text-slate-900 shadow-xs font-bold">
              Garita POS
            </span>
            <Link
              href="/hub"
              className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition flex items-center gap-1"
            >
              <Grid className="w-3.5 h-3.5 text-[#80093A]" />
              <span>Menú Central</span>
            </Link>
            <Link
              href="/admin"
              className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition flex items-center gap-1"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
              <span>Panel Control</span>
            </Link>
            <Link
              href="/convenios"
              className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition"
            >
              Convenios
            </Link>
            <Link
              href="/reportes"
              className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition flex items-center gap-1"
            >
              <FileBarChart2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Reportes</span>
            </Link>
            <Link
              href="/cctv"
              className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              <span>CCTV</span>
            </Link>
          </nav>
        </div>

        {/* Derecha: Estado Online + Turno Cajero + Botón Caja Ciega + Referencia Visual */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F3F4F6] border border-slate-200/80 text-[11px] text-slate-700 font-medium">
            <span>
              Shift: <strong className="font-semibold text-slate-900">Morning</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span>
              Cashier:{' '}
              <strong className="font-semibold text-slate-900">
                {shift?.nombre_operador ? shift.nombre_operador.split(' ')[0] : 'Ana R.'}
              </strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {currentTime || '12:00:00'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setActiveShiftModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title="Abrir Arqueo de Caja Ciega"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Arqueo Ciego</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMockupReference(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Ver Lámina Mockup #1 Oficial"
          >
            <Eye className="w-3.5 h-3.5 text-[#80093A]" />
            <span className="hidden sm:inline">Mockup V2</span>
          </button>
        </div>
      </header>

      {/* Banner flotante de notificación operativa */}
      {statusBanner && (
        <div className="px-4 pt-2 shrink-0">
          <div
            className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-xs ${
              statusBanner.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : statusBanner.type === 'warning'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusBanner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusBanner.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. CUERPO OPERATIVO 40/60 SIN SCROLL (Mockup #1 Canónico)             */}
      {/* ===================================================================== */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden min-h-0">
        {/* ----------------------------------------------------------------- */}
        {/* COLUMNA IZQUIERDA (40% -> 5 cols): POS BOOTH CONSOLE              */}
        {/* ----------------------------------------------------------------- */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E2E4] shadow-[0_4px_14px_rgba(0,0,0,0.04)] p-4 flex flex-col justify-between overflow-hidden min-h-0">
          {/* Cabecera Consola POS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>POS Booth Console</span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[#80093A]/10 text-[#80093A]">
                    Zero-Scroll
                  </span>
                </h1>
                <p className="text-[11px] text-slate-500">
                  Ingreso rotativo, liquidación por minuto y emisión térmica 80mm
                </p>
              </div>

              {/* Conmutador rápido entre Consola POS y Lista de Activos */}
              <div className="flex bg-[#F3F4F6] p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setConsoleView('pos')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    consoleView === 'pos'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Consola POS
                </button>
                <button
                  type="button"
                  onClick={() => setConsoleView('activos')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    consoleView === 'activos'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  En Recinto ({activeTickets.length})
                </button>
              </div>
            </div>

            {consoleView === 'pos' ? (
              <div className="space-y-3">
                {/* 1. Buscador / Input de Matrícula o Ticket con Autofoco Inmediato (F1 / F2) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="pos-plate-input"
                      className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
                    >
                      License Plate / Ticket Folio
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setInForeign(!inForeign)}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold border transition cursor-pointer flex items-center gap-1 ${
                          inForeign
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <Globe className="w-3 h-3" />
                        <span>{inForeign ? 'Extranjera' : 'CL'}</span>
                      </button>
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-300 rounded">
                        F2
                      </kbd>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="pos-plate-input"
                        type="text"
                        autoFocus
                        value={plateInput}
                        onChange={(e) => setPlateInput(formatPlate(e.target.value))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleLookupOrPreviewPlate(plateInput);
                          }
                        }}
                        placeholder="ABCD-12"
                        className="w-full h-12 pl-10 pr-16 rounded-xl bg-[#F9F9FB] border-2 border-slate-300 focus:border-[#80093A] focus:bg-white focus:outline-none font-mono font-black text-2xl tracking-widest text-slate-900 uppercase tabular-nums transition"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-200/80 text-[10px] font-mono font-bold text-slate-600">
                        F1
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLookupOrPreviewPlate(plateInput)}
                      className="px-3.5 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shrink-0"
                      title="Consultar patente o calcular estadía"
                    >
                      Buscar
                    </button>

                    <button
                      type="button"
                      disabled={inLoading}
                      onClick={handleCheckinVehicle}
                      className="px-3.5 h-12 rounded-xl bg-[#80093A] hover:bg-[#68072f] text-white text-xs font-bold transition cursor-pointer shrink-0 shadow-xs"
                      title="Registrar Nuevo Ingreso y Emitir Ticket 80mm"
                    >
                      + Ingreso
                    </button>
                  </div>
                </div>

                {/* 2. Píldoras de Tarifa (Tariff Selection) + Categoría Vehicular */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-8">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Tariff Selection
                      </span>
                      <kbd className="text-[10px] font-mono font-semibold text-slate-400">
                        [F3]
                      </kbd>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectTariffPlan('MINUTO')}
                        className={`h-10 rounded-xl font-mono text-xs font-bold border transition cursor-pointer ${
                          selectedTariffPlan === 'MINUTO'
                            ? 'bg-[#80093A] text-white border-[#80093A] shadow-xs'
                            : 'bg-[#F3F4F6] text-slate-700 border-slate-200 hover:bg-slate-200/70'
                        }`}
                      >
                        $30/min
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectTariffPlan('JORNADA')}
                        className={`h-10 rounded-xl font-mono text-xs font-bold border transition cursor-pointer ${
                          selectedTariffPlan === 'JORNADA'
                            ? 'bg-[#80093A] text-white border-[#80093A] shadow-xs'
                            : 'bg-[#F3F4F6] text-slate-700 border-slate-200 hover:bg-slate-200/70'
                        }`}
                      >
                        Jornada $6.000
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectTariffPlan('NOCHE')}
                        className={`h-10 rounded-xl font-mono text-xs font-bold border transition cursor-pointer ${
                          selectedTariffPlan === 'NOCHE'
                            ? 'bg-[#80093A] text-white border-[#80093A] shadow-xs'
                            : 'bg-[#F3F4F6] text-slate-700 border-slate-200 hover:bg-slate-200/70'
                        }`}
                      >
                        Noche $5.000
                      </button>
                    </div>
                  </div>

                  {/* Selector compacto de tipo de vehículo */}
                  <div className="col-span-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Vehículo
                    </span>
                    <div className="grid grid-cols-3 gap-1 bg-[#F3F4F6] p-1 rounded-xl border border-slate-200 h-10 items-center">
                      <button
                        type="button"
                        onClick={() => setInTipo('auto')}
                        title="Auto ($25-$30/min)"
                        className={`h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                          inTipo === 'auto'
                            ? 'bg-white text-[#80093A] shadow-2xs'
                            : 'text-slate-500'
                        }`}
                      >
                        <Car className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setInTipo('camioneta')}
                        title="Camioneta / SUV ($30/min)"
                        className={`h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                          inTipo === 'camioneta'
                            ? 'bg-white text-[#80093A] shadow-2xs'
                            : 'text-slate-500'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setInTipo('moto')}
                        title="Moto ($15/min)"
                        className={`h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                          inTipo === 'moto'
                            ? 'bg-white text-[#80093A] shadow-2xs'
                            : 'text-slate-500'
                        }`}
                      >
                        <Bike className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Recibo Digital en Vivo (Digital Receipt con borde punteado estilo Mockup #1) */}
                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-[#F9F9FB] p-3.5 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Digital Receipt · {activeReceipt.patente}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500">
                      {activeReceipt.ticket
                        ? activeReceipt.ticket.id_ticket
                        : 'TKT-20260419-T01-0842'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1 text-xs">
                    <span className="text-slate-500">Entry Time:</span>
                    <span className="text-right font-mono font-bold text-slate-800 tabular-nums">
                      {activeReceipt.entryTime}
                    </span>

                    <span className="text-slate-500">Exit Time:</span>
                    <span className="text-right font-mono font-bold text-slate-800 tabular-nums">
                      {activeReceipt.exitTime}
                    </span>

                    <span className="text-slate-500">Duration:</span>
                    <span className="text-right font-mono font-bold text-slate-800 tabular-nums">
                      {activeReceipt.durationText}
                    </span>

                    <span className="text-slate-500">Tariff:</span>
                    <span className="text-right font-mono font-bold text-slate-800 tabular-nums">
                      {activeReceipt.tariffLabel}
                    </span>

                    {activeReceipt.discountAmount > 0 && (
                      <>
                        <span className="text-emerald-700 font-bold">
                          Descuento Autorizado (PIN):
                        </span>
                        <span className="text-right font-mono font-bold text-emerald-700 tabular-nums">
                          -${activeReceipt.discountAmount.toLocaleString('es-CL')}
                        </span>
                      </>
                    )}

                    {activeReceipt.surchargeAmount > 0 && (
                      <>
                        <span className="text-rose-700 font-bold">
                          Multa Ticket Extraviado (PIN):
                        </span>
                        <span className="text-right font-mono font-bold text-rose-700 tabular-nums">
                          ${activeReceipt.surchargeAmount.toLocaleString('es-CL')}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Total CLP
                    </span>
                    <span className="text-3xl font-mono font-black text-[#80093A] tabular-nums tracking-tight">
                      ${activeReceipt.finalAmount.toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>

                {/* 4. Medios de Pago (Cash F4 / Card F5) + Calculadora de Vuelto + Excepciones PIN */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleProcessPayment('EFECTIVO')}
                      className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition cursor-pointer ${
                        paymentMethod === 'EFECTIVO'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Cash (F4)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProcessPayment('TARJETA')}
                      className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition cursor-pointer ${
                        paymentMethod === 'TARJETA'
                          ? 'bg-sky-600 hover:bg-sky-700 text-white border-sky-700 shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card (F5)</span>
                    </button>
                  </div>

                  {/* Calculadora compacta de Efectivo Recibido -> Vuelto */}
                  <div className="grid grid-cols-2 gap-2 bg-[#F3F4F6] p-2 rounded-xl border border-slate-200/90">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Efectivo:
                      </span>
                      <input
                        type="number"
                        step={500}
                        value={cashReceived}
                        onChange={(e) =>
                          setCashReceived(e.target.value ? Number(e.target.value) : '')
                        }
                        className="w-24 text-right font-mono font-bold text-xs bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-900 tabular-nums"
                      />
                    </div>
                    <div className="flex items-center justify-between px-2 border-l border-slate-300">
                      <span className="text-[10px] font-bold uppercase text-emerald-700">
                        Vuelto:
                      </span>
                      <span className="font-mono font-black text-sm text-emerald-700 tabular-nums">
                        ${vueltoCalculado.toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>

                  {/* Botones de Auditoría Antifraude por PIN (Regla 5 AGENTS.md: Verde Descuento / Rojo Ticket Perdido) */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPinError(null);
                        setPinAuditModal('DISCOUNT');
                      }}
                      className="h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Percent className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Descuento PIN [F6]</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPinError(null);
                        setPinAuditModal('LOST_TICKET');
                      }}
                      className="h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <FileWarning className="w-3.5 h-3.5 text-rose-600" />
                      <span>Ticket Perdido [F7]</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Vista rápida de Vehículos Activos en Recinto */
              <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
                {activeTickets.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No hay vehículos rotativos activos en este momento.
                  </div>
                ) : (
                  activeTickets.map((t) => (
                    <div
                      key={t.id_ticket}
                      className="p-3 rounded-xl bg-[#F9F9FB] border border-slate-200 flex items-center justify-between hover:border-[#80093A]/50 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-slate-900 tabular-nums">
                            {t.patente}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                            Plaza {t.slot_numero || 'A'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {t.id_ticket} • Ingreso:{' '}
                          {new Date(t.fecha_hora_ingreso).toLocaleTimeString('es-CL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTicketPreviewModal(t)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Ver Ticket 80mm"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConsoleView('pos');
                            handleLookupOrPreviewPlate(t.patente);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#80093A] text-white text-xs font-bold cursor-pointer"
                        >
                          Cobrar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 5. Pie de Consola POS: Print Ticket 80mm (F8) + Open Barrier (F9) */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-12 gap-2">
            <button
              type="button"
              onClick={handleOpen80mmTicketPreview}
              className="col-span-7 h-12 rounded-xl bg-[#80093A] hover:bg-[#68072f] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:scale-[0.99]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Ticket 80mm (F8)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setBarrierOpenPulse(true);
                setTimeout(() => setBarrierOpenPulse(false), 3000);
                setStatusBanner({
                  type: 'success',
                  text: `Barrera Principal Abierta manualmente [F9] para ${plateInput}.`,
                });
              }}
              className={`col-span-5 h-12 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                barrierOpenPulse
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-[#F3F4F6] hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <Unlock className="w-4 h-4" />
              <span>{barrierOpenPulse ? 'Barrier OPEN!' : 'Open Barrier (F9)'}</span>
            </button>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* COLUMNA DERECHA (60% -> 7 cols): INTERACTIVE PARKING LAYOUT       */}
        {/* ----------------------------------------------------------------- */}
        <section className="lg:col-span-7 h-full overflow-hidden min-h-0">
          <SerranoLayoutMap
            slots={slots}
            onSelectSlotForCheckout={(patente) => {
              setConsoleView('pos');
              handleLookupOrPreviewPlate(patente);
            }}
            onSelectSlotForCheckin={(slotId) => {
              setConsoleView('pos');
              setInSlot(slotId.toString());
              const input = document.getElementById('pos-plate-input') as HTMLInputElement;
              if (input) input.focus();
            }}
          />
        </section>
      </main>

      {/* ===================================================================== */}
      {/* POP-UP 1: TICKET TÉRMICO 80MM & PDF (Sección 12 del Catálogo)         */}
      {/* ===================================================================== */}
      {ticketPreviewModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setTicketPreviewModal(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <span className="text-xs font-extrabold text-slate-800 ml-1">
                  80mm Thermal & PDF Ticket Layout
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTicketPreviewModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ThermalTicketPDFTemplate
              folio={ticketPreviewModal.id_ticket}
              patente={ticketPreviewModal.patente}
              fecha={new Date(ticketPreviewModal.fecha_hora_ingreso).toLocaleDateString(
                'es-CL'
              )}
              horaIngreso={new Date(
                ticketPreviewModal.fecha_hora_ingreso
              ).toLocaleTimeString('es-CL', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              sectorPlaza={
                ticketPreviewModal.slot_numero
                  ? `${ticketPreviewModal.slot_numero <= 15 ? 'A' : 'B'}-${String(
                      ticketPreviewModal.slot_numero
                    ).padStart(2, '0')} (${
                      ticketPreviewModal.vehiculo_tipo?.toUpperCase() || 'AUTO'
                    })`
                  : 'A-12 (General)'
              }
              tarifaTexto={`$${ticketPreviewModal.tarifa_por_minuto || 30} / min`}
              isOffline={Boolean(ticketPreviewModal.is_offline)}
              showActions={true}
              onClose={() => setTicketPreviewModal(null)}
            />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* POP-UP 2: AUTORIZACIÓN PIN ANTIFRAUDE (Sección 9.3 del Catálogo)      */}
      {/* ===================================================================== */}
      {pinAuditModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPinAuditModal(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera Semántica Verde (Descuento) o Roja (Ticket Perdido) */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    pinAuditModal === 'DISCOUNT'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {pinAuditModal === 'DISCOUNT'
                      ? 'Autorización PIN Operador · Descuento'
                      : 'Autorización PIN Administrador · Ticket Perdido'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {pinAuditModal === 'DISCOUNT'
                      ? 'Auditoría Antifraude en Verde (Justificación >10 caracteres)'
                      : 'Auditoría Antifraude en Rojo (Recargo fijo $8.000 CLP)'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPinAuditModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                {pinError}
              </div>
            )}

            <form onSubmit={handleConfirmPinAudit} className="space-y-4">
              {pinAuditModal === 'DISCOUNT' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Porcentaje de Descuento Comercial
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[10, 20, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDiscountPercent(pct)}
                          className={`py-2 rounded-xl font-mono text-xs font-bold border cursor-pointer ${
                            discountPercent === pct
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          -{pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Justificación Escrita Obligatoria (&gt;10 caracteres)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={pinJustification}
                      onChange={(e) => setPinJustification(e.target.value)}
                      placeholder="Ej: Cliente convenio Notaría Serrano con sello timbrado..."
                      className="w-full px-3 py-2 rounded-xl bg-[#F9F9FB] border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] font-mono text-slate-400">
                      Caracteres ingresados: {pinJustification.trim().length} / mín. 11
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-rose-900 block">
                      Multa Oficial por Extravío de Ticket
                    </span>
                    <span className="text-[11px] text-rose-700">
                      Se registrará en rojo en el log inmutable de auditoría
                    </span>
                  </div>
                  <span className="font-mono font-black text-xl text-rose-700 tabular-nums">
                    $8.000
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {pinAuditModal === 'DISCOUNT'
                    ? 'PIN Individual Operador (4 dígitos)'
                    : 'PIN Supervisor / Administrador (4 dígitos)'}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  className="w-full h-12 text-center font-mono font-black text-2xl tracking-[0.5em] rounded-xl bg-[#F9F9FB] border border-slate-300 focus:outline-none focus:border-[#80093A]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPinAuditModal(null)}
                  className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex-1 h-11 rounded-xl text-white text-xs font-extrabold cursor-pointer shadow-sm ${
                    pinAuditModal === 'DISCOUNT'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {pinAuditModal === 'DISCOUNT'
                    ? 'Autorizar Descuento (Verde)'
                    : 'Aplicar Recargo $8.000 (Rojo)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* POP-UP 3: ARQUEO DE CAJA CIEGA (Sección 9.2 del Catálogo)             */}
      {/* ===================================================================== */}
      {activeShiftModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActiveShiftModal(false)}
        >
          <div
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ShiftModal
              currentShift={shift}
              onClose={() => setActiveShiftModal(false)}
              onShiftUpdated={fetchData}
            />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* POP-UP 4: VISOR DE MOCKUP OFICIAL #1 (Garita POS & Layout 40/60)      */}
      {/* ===================================================================== */}
      {showMockupReference && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowMockupReference(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 max-w-5xl w-full p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Lámina Oficial Mockup #1 · Garita POS (40%) + Layout Serrano 447 (60%)
                </h3>
                <p className="text-xs text-slate-500">
                  Especificación Canónica V2.0 consolidada en PRD & Catálogo de Estructuras
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMockupReference(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src="/mockups/ui_garita_pos_y_layout_estacionamiento.jpg"
                alt="Mockup Oficial Garita POS y Layout Serrano 447"
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#F9F9FB] flex items-center justify-center text-slate-700 font-mono text-sm">
          Cargando ParkOps Garita POS...
        </div>
      }
    >
      <CockpitContent />
    </Suspense>
  );
}
