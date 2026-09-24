'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  ArrowRightLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
  Flame,
  FileQuestion,
  Percent,
  Lock,
  Printer,
  X,
  ArrowRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { PaymentMethod, Ticket } from '@/types';

interface PosCheckoutProps {
  onCheckoutSuccess: () => void;
  activeTickets: Ticket[];
  initialPlate?: string;
}

export const PosCheckout: React.FC<PosCheckoutProps> = ({
  onCheckoutSuccess,
  activeTickets,
  initialPlate,
}) => {
  const [busqueda, setBusqueda] = useState(initialPlate || '');
  const [ticketCalc, setTicketCalc] = useState<{
    ticket: Ticket;
    minutosTranscurridos: number;
    montoAPagar: number;
    montoOriginal: number;
    estaEnGracia: boolean;
    advertenciaMinutos?: string;
  } | null>(null);

  React.useEffect(() => {
    if (initialPlate) {
      setBusqueda(initialPlate);
      buscarTicket(initialPlate);
    }
  }, [initialPlate]);

  const [metodoPago, setMetodoPago] = useState<PaymentMethod>('EFECTIVO');
  const [montoEntregado, setMontoEntregado] = useState<number | ''>('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultadoCobro, setResultadoCobro] = useState<{ ticket: Ticket; vuelto: number } | null>(null);

  // Estados de Modales de Excepción con PIN
  const [modalTipo, setModalTipo] = useState<'FUGA' | 'EXTRAVIO' | 'DESCUENTO' | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [motivoInput, setMotivoInput] = useState('');
  const [nuevoMontoInput, setNuevoMontoInput] = useState<number | ''>('');

  const buscarTicket = async (idOrPlate: string) => {
    if (!idOrPlate) return;
    setError(null);
    setResultadoCobro(null);
    setLoadingSearch(true);

    try {
      const res = await fetch(`/api/checkout?id=${encodeURIComponent(idOrPlate)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ticket no encontrado');
      }

      setTicketCalc(data);
      setMontoEntregado(data.montoAPagar);
    } catch (err: any) {
      setError(err.message);
      setTicketCalc(null);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleCobro = async () => {
    if (!ticketCalc) return;
    setError(null);
    setLoadingPay(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticketCalc.ticket.id_ticket,
          metodoPago,
          montoEntregado: Number(montoEntregado || 0),
          accion: 'COBRO',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pago');
      }

      setResultadoCobro(data);
      setTicketCalc(null);
      setBusqueda('');
      onCheckoutSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingPay(false);
    }
  };

  const handleExcepcionPin = async () => {
    if (!ticketCalc || !modalTipo) return;
    if (!pinInput || pinInput.length < 4) {
      setError('Debes ingresar un PIN de autorización de 4 dígitos.');
      return;
    }

    setLoadingPay(true);
    setError(null);

    try {
      let endpointBody: any = {
        id: ticketCalc.ticket.id_ticket,
        pin: pinInput,
        motivo: motivoInput || 'Autorizado por operador',
      };

      if (modalTipo === 'FUGA') {
        endpointBody.accion = 'FUGA';
      } else if (modalTipo === 'EXTRAVIO') {
        endpointBody.accion = 'EXTRAVIO';
      } else if (modalTipo === 'DESCUENTO') {
        endpointBody.accion = 'DESCUENTO';
        endpointBody.nuevoMonto = Number(nuevoMontoInput || 0);
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpointBody),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error autorizando excepción');
      }

      setResultadoCobro(data);
      setModalTipo(null);
      setTicketCalc(null);
      setBusqueda('');
      onCheckoutSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingPay(false);
    }
  };

  const vuelto =
    ticketCalc && typeof montoEntregado === 'number'
      ? Math.max(0, montoEntregado - ticketCalc.montoAPagar)
      : 0;

  return (
    <div className="space-y-6 text-white">
      {/* Cabecera Despejada */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            Punto de Cobro & Salida
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Escaneo QR / Código 128 o selección directa de vehículo
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 bg-white/[0.04] border border-white/10 rounded-xl text-slate-300">
          {activeTickets.length} Vehículos Activos
        </span>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <h4 className="font-bold">Aviso</h4>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Recibo de Pago Exitoso */}
      {resultadoCobro && (
        <div className="p-5 bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 border border-emerald-500/40 rounded-3xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-bold text-white block">
                Cobro Liquidado • Barrera Abierta
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Patente: <strong className="text-emerald-300">{resultadoCobro.ticket.patente}</strong> • Vuelto Entregado: ${resultadoCobro.vuelto.toLocaleString('es-CL')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setResultadoCobro(null)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            Continuar
          </button>
        </div>
      )}

      {/* 1. BUSCADOR UNIVERSAL Y SELECTOR VISUAL DE VEHÍCULOS ACTIVOS */}
      <div className="space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            buscarTicket(busqueda);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Escanear ticket o escribir patente (ej: KD-JL-84)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/50 border border-white/10 text-white font-mono font-bold text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loadingSearch || !busqueda}
            className="px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-2xl transition shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loadingSearch ? 'Buscando...' : 'BUSCAR [ENTER]'}
          </button>
        </form>

        {/* Mini Grid Visual de Vehículos en Turno (Píldoras Táctiles) */}
        {activeTickets.length > 0 && !ticketCalc && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Vehículos en Turno (Clic para liquidar):
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {activeTickets.map((t) => (
                <button
                  key={t.id_ticket}
                  type="button"
                  onClick={() => {
                    setBusqueda(t.patente);
                    buscarTicket(t.patente);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-sky-600/30 border border-white/10 hover:border-sky-500/50 text-white font-mono text-xs font-bold transition flex items-center gap-2 shrink-0 active:scale-95"
                >
                  <span>{t.patente}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {t.slot_numero ? `Slot ${t.slot_numero}` : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. PANEL DE LIQUIDACIÓN Y CÁLCULO DE VUELTO GIGANTE */}
      {ticketCalc && (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#151D2E] to-[#0E1422] border border-white/15 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          {/* Ficha Resumen del Vehículo */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-[11px] text-slate-400 font-mono block">Ticket {ticketCalc.ticket.id_ticket}</span>
              <h3 className="text-2xl font-mono font-black text-white tracking-wider">
                {ticketCalc.ticket.patente}
              </h3>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-slate-400">Tiempo de Estadía:</span>
              <span className="block text-base font-bold text-sky-400">
                {ticketCalc.minutosTranscurridos} minutos
              </span>
            </div>
          </div>

          {/* TOTAL A PAGAR GIGANTE */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total a Cobrar:</span>
              {ticketCalc.estaEnGracia ? (
                <div className="text-emerald-400 font-mono font-black text-3xl">
                  $0 CLP <span className="text-xs font-bold text-emerald-300">(Tiempo de Gracia)</span>
                </div>
              ) : (
                <div className="text-white font-mono font-black text-4xl">
                  ${ticketCalc.montoAPagar.toLocaleString('es-CL')} <span className="text-xs font-bold text-slate-400">CLP</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-mono">Tarifa Aplicada:</span>
              <span className="block font-mono text-sm text-slate-200">
                ${ticketCalc.ticket.tarifa_por_minuto}/min ({(ticketCalc.ticket.vehiculo_tipo || 'auto').toUpperCase()})
              </span>
            </div>
          </div>

          {/* 3. SELECTOR DE MEDIO DE PAGO (BOTONES GRANDES 52px) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Medio de Pago
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMetodoPago('EFECTIVO')}
                className={`h-14 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 text-xs font-bold ${
                  metodoPago === 'EFECTIVO'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 border-emerald-400 text-white shadow-lg'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>[1] Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setMetodoPago('TARJETA')}
                className={`h-14 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 text-xs font-bold ${
                  metodoPago === 'TARJETA'
                    ? 'bg-gradient-to-r from-sky-600 to-sky-700 border-sky-400 text-white shadow-lg'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>[2] Transbank POS</span>
              </button>

              <button
                type="button"
                onClick={() => setMetodoPago('TRANSFERENCIA')}
                className={`h-14 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 text-xs font-bold ${
                  metodoPago === 'TRANSFERENCIA'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 border-purple-400 text-white shadow-lg'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <ArrowRightLeft className="w-5 h-5" />
                <span>[3] Transferencia</span>
              </button>
            </div>
          </div>

          {/* 4. CALCULADORA DE VUELTO GIGANTE (SI ES EFECTIVO) */}
          {metodoPago === 'EFECTIVO' && (
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-black/40 border border-white/10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Monto Recibido
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    step={100}
                    value={montoEntregado}
                    onChange={(e) => setMontoEntregado(e.target.value ? Number(e.target.value) : '')}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Vuelto a Entregar:
                </span>
                <div className="h-12 px-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-emerald-300 font-mono font-black text-2xl">
                  <span>${vuelto.toLocaleString('es-CL')}</span>
                  <span className="text-xs text-emerald-400 font-semibold font-sans">CLP</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. BOTÓN PRINCIPAL DE COBRO & CONFIRMACIÓN (54px) */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={loadingPay}
              onClick={handleCobro}
              className="w-full h-14 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:opacity-95 text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(16,185,129,0.4)] border border-white/20 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loadingPay ? (
                'Procesando Transacción...'
              ) : (
                <>
                  <span>CONFIRMAR COBRO & ABRIR BARRERA [ENTER]</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Acciones de Excepción / PIN (Colapsadas / Botones Sutiles) */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
              <button
                type="button"
                onClick={() => setModalTipo('DESCUENTO')}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <Percent className="w-3.5 h-3.5" />
                <span>Aplicar Descuento (PIN)</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTipo('EXTRAVIO')}
                className="text-rose-400 hover:underline flex items-center gap-1"
              >
                <FileQuestion className="w-3.5 h-3.5" />
                <span>Ticket Perdido ($10.000)</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTipo('FUGA')}
                className="text-slate-400 hover:text-rose-400 transition flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Fuga / Evasión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Excepción con PIN */}
      {modalTipo && ticketCalc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-[#111726] rounded-3xl border border-white/10 max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#ffb1c2]" />
                Autorización de Excepción ({modalTipo})
              </h3>
              <button
                onClick={() => setModalTipo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  PIN de Seguridad (4 Dígitos)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  placeholder="••••"
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full py-2.5 px-3 bg-black/50 border border-white/20 rounded-xl text-center font-mono font-bold text-xl tracking-[0.4em] text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Justificación Obligatoria (&gt;10 caracteres)
                </label>
                <textarea
                  rows={2}
                  value={motivoInput}
                  onChange={(e) => setMotivoInput(e.target.value)}
                  placeholder="Motivo autorizado por jefatura de operaciones..."
                  className="w-full p-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              {modalTipo === 'DESCUENTO' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nuevo Monto Final a Cobrar (CLP)
                  </label>
                  <input
                    type="number"
                    value={nuevoMontoInput}
                    onChange={(e) => setNuevoMontoInput(Number(e.target.value))}
                    className="w-full p-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalTipo(null)}
                  className="flex-1 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExcepcionPin}
                  disabled={loadingPay || pinInput.length < 4}
                  className="flex-1 py-2.5 bg-[#80093A] hover:bg-[#A52C55] text-white text-xs font-bold rounded-xl shadow-lg disabled:opacity-50"
                >
                  Autorizar con PIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
