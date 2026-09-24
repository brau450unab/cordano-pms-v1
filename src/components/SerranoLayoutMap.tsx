'use client';

import React, { useState } from 'react';
import { ParkingSlot, Ticket } from '@/types';
import {
  Car,
  Clock,
  DollarSign,
  Info,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Accessibility,
  AlertCircle,
  Sparkles,
  MapPin
} from 'lucide-react';

interface SerranoLayoutMapProps {
  slots: ParkingSlot[];
  onSelectSlotForCheckout: (patente: string) => void;
  onSelectSlotForCheckin?: (slotId: number) => void;
}

export const SerranoLayoutMap: React.FC<SerranoLayoutMapProps> = ({
  slots,
  onSelectSlotForCheckout,
  onSelectSlotForCheckin,
}) => {
  // 30 Plazas oficiales (Sector A 01-15 y Sector B 16-30)
  const officialSlots = slots.filter((s) => s.sector === 'A' || s.sector === 'B');
  const occupiedOfficial = officialSlots.filter((s) => s.estado === 'OCUPADO').length;
  const availableCount = 30 - occupiedOfficial;

  const calculateElapsedMinutes = (fechaIngreso: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(fechaIngreso).getTime()) / 60000);
    return Math.max(0, diff);
  };

  const calculateCurrentAmount = (ticket?: Ticket) => {
    if (!ticket) return 0;
    const mins = calculateElapsedMinutes(ticket.fecha_hora_ingreso);
    if (mins <= (ticket.tiempo_gracia_minutos || 10)) {
      return 0;
    }
    const rate = ticket.tarifa_por_minuto || 25;
    return Math.ceil((mins * rate) / 10) * 10;
  };

  return (
    <div className="bg-[#0B0F19] rounded-3xl border border-white/10 shadow-2xl p-4 sm:p-5 flex flex-col h-full space-y-4">
      {/* Cabecera con Métricas y Estado */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-white">
              Pistas Serrano 447 • Matriz 30 Plazas
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Sector A (01–15 Oeste) • Sector B (16–30 Este)
          </p>
        </div>

        {/* Resumen numérico tabular de ocupación */}
        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <span className="text-xs font-bold text-white tabular-nums block">
              {occupiedOfficial} / 30 Plazas
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {availableCount} Disponibles
            </span>
          </div>
        </div>
      </div>

      {/* Plano de Estacionamiento Real (Asfalto, Líneas y Bahías) */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Sector A: Slots 01 al 15 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-2 h-2 rounded bg-sky-400" />
              <span>Sector A — Acceso Principal (Slots 01 al 15)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Tarifa rotativa</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {slots.slice(0, 15).map((slot) => {
              const isOccupied = slot.estado === 'OCUPADO';
              const ticket = slot.ticket_actual;
              const mins = ticket ? calculateElapsedMinutes(ticket.fecha_hora_ingreso) : 0;
              const monto = ticket ? calculateCurrentAmount(ticket) : 0;

              return (
                <button
                  key={slot.id}
                  onClick={() => {
                    if (isOccupied && ticket) {
                      onSelectSlotForCheckout(ticket.patente);
                    } else if (onSelectSlotForCheckin) {
                      onSelectSlotForCheckin(slot.id);
                    }
                  }}
                  className={`group relative p-2 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between h-[74px] shadow-sm ${
                    isOccupied
                      ? 'bg-gradient-to-b from-[#1E2638] to-[#121826] border-white/20 text-white hover:border-[#ff86a5] hover:shadow-lg active:scale-95'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30 hover:border-emerald-400 active:scale-95'
                  }`}
                  title={isOccupied && ticket ? `Clic para liquidar cobro de ${ticket.patente}` : `Plaza ${slot.codigo} Disponible`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-lg border ${
                        isOccupied
                          ? 'bg-black/50 text-slate-300 border-white/10'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {slot.codigo}
                    </span>

                    {slot.tipo === 'PMR' && (
                      <span title="Movilidad Reducida">
                        <Accessibility className="w-3.5 h-3.5 text-cyan-400" />
                      </span>
                    )}
                    {slot.tipo === 'ELECTRICO' && (
                      <span title="Carga EV">
                        <Zap className="w-3.5 h-3.5 text-violet-400" />
                      </span>
                    )}
                  </div>

                  {isOccupied && ticket ? (
                    <div className="space-y-0.5 w-full overflow-hidden">
                      <div className="font-mono font-black text-xs tracking-wider text-white truncate flex items-center gap-1">
                        <Car className="w-3 h-3 text-sky-400 shrink-0" />
                        <span>{ticket.patente}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono tabular-nums leading-none">
                        <span className="text-slate-400">{mins}m</span>
                        <span className="text-emerald-400 font-extrabold">
                          ${monto.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-[11px] font-bold text-emerald-400/90 font-mono tracking-wider">
                        LIBRE
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pasillo central de circulación vehicular */}
        <div className="h-6 rounded-xl bg-black/40 border border-dashed border-white/10 flex items-center justify-center font-mono text-[10px] text-slate-500 tracking-widest uppercase">
          &uarr; Pasillo de Maniobra &bull; Circulación Unidireccional &uarr;
        </div>

        {/* Sector B: Slots 16 al 30 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-2 h-2 rounded bg-indigo-400" />
              <span>Sector B — Convenios & Noche (Slots 16 al 30)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Área Techada</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {slots.slice(15, 30).map((slot) => {
              const isOccupied = slot.estado === 'OCUPADO';
              const ticket = slot.ticket_actual;
              const mins = ticket ? calculateElapsedMinutes(ticket.fecha_hora_ingreso) : 0;
              const monto = ticket ? calculateCurrentAmount(ticket) : 0;

              return (
                <button
                  key={slot.id}
                  onClick={() => {
                    if (isOccupied && ticket) {
                      onSelectSlotForCheckout(ticket.patente);
                    } else if (onSelectSlotForCheckin) {
                      onSelectSlotForCheckin(slot.id);
                    }
                  }}
                  className={`group relative p-2 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between h-[74px] shadow-sm ${
                    isOccupied
                      ? 'bg-gradient-to-b from-[#1E2638] to-[#121826] border-white/20 text-white hover:border-[#ff86a5] hover:shadow-lg active:scale-95'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30 hover:border-emerald-400 active:scale-95'
                  }`}
                  title={isOccupied && ticket ? `Clic para liquidar cobro de ${ticket.patente}` : `Plaza ${slot.codigo} Disponible`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-lg border ${
                        isOccupied
                          ? 'bg-black/50 text-slate-300 border-white/10'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {slot.codigo}
                    </span>
                  </div>

                  {isOccupied && ticket ? (
                    <div className="space-y-0.5 w-full overflow-hidden">
                      <div className="font-mono font-black text-xs tracking-wider text-white truncate flex items-center gap-1">
                        <Car className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{ticket.patente}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono tabular-nums leading-none">
                        <span className="text-slate-400">{mins}m</span>
                        <span className="text-emerald-400 font-extrabold">
                          ${monto.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-[11px] font-bold text-emerald-400/90 font-mono tracking-wider">
                        LIBRE
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leyenda Semántica */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.08] text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
          <span>Disponible</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-slate-600" />
          <span>Ocupada</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
          <span>PMR</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-violet-400" />
          <span>Carga EV</span>
        </span>
      </div>
    </div>
  );
};
