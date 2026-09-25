'use client';

import React, { useState } from 'react';
import { ParkingSlot, Ticket } from '@/types';
import {
  Car,
  Zap,
  Accessibility,
  X,
  ArrowRight,
  Lock,
  AlertTriangle
} from 'lucide-react';

interface SerranoLayoutMapProps {
  slots: ParkingSlot[];
  onSelectSlotForCheckout: (patente: string) => void;
  onSelectSlotForCheckin?: (slotId: number) => void;
  selectedCheckinSlotId?: string;
}

export const SerranoLayoutMap: React.FC<SerranoLayoutMapProps> = ({
  slots,
  onSelectSlotForCheckout,
  onSelectSlotForCheckin,
  selectedCheckinSlotId,
}) => {
  // Estado para el Popup Informativo Puro de Plaza (Regla #6 y Sección 9.1 del Catálogo)
  const [inspectedSlot, setInspectedSlot] = useState<ParkingSlot | null>(null);

  const officialSlots = slots.filter((s) => s.sector === 'A' || s.sector === 'B');
  const sobrecupoSlots = slots.filter((s) => s.sector === 'SOBRECUPO');
  const sectorASlots = slots.filter((s) => s.sector === 'A').slice(0, 15);
  const sectorBSlots = slots.filter((s) => s.sector === 'B').slice(0, 15);

  const occupiedOfficial = officialSlots.filter((s) => s.estado === 'OCUPADO').length;
  const availableCount = Math.max(0, 30 - occupiedOfficial);

  const calculateElapsedMinutes = (fechaIngreso: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(fechaIngreso).getTime()) / 60000);
    return Math.max(1, diff);
  };

  const calculateCurrentAmount = (ticket?: Ticket) => {
    if (!ticket) return 0;
    const mins = calculateElapsedMinutes(ticket.fecha_hora_ingreso);
    if (mins <= (ticket.tiempo_gracia_minutos || 10)) {
      return 0;
    }
    const rate = ticket.tarifa_por_minuto || 30;
    return Math.ceil((mins * rate) / 10) * 10;
  };

  // Determina el color semántico exacto según Regla #3 y Mockup #1
  const getSlotVisualStyle = (slot: ParkingSlot) => {
    const isOccupied = slot.estado === 'OCUPADO';
    const isReserved = slot.estado === 'RESERVADO';
    const ticket = slot.ticket_actual;
    const mins = ticket ? calculateElapsedMinutes(ticket.fecha_hora_ingreso) : 0;
    const isSelectedForCheckin = selectedCheckinSlotId && Number(selectedCheckinSlotId) === slot.id;

    if (isSelectedForCheckin && !isOccupied) {
      return {
        bg: 'bg-[#80093A] text-white ring-2 ring-[#80093A] ring-offset-2',
        badge: 'Asignar',
      };
    }

    // Sobrestadía / Alerta (> 180 min) -> Rojo #EF4444
    if (isOccupied && mins > 180) {
      return {
        bg: 'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-sm',
        badge: 'Alerta >3h',
      };
    }

    // Ocupada -> Gris Pizarra #64748B
    if (isOccupied) {
      return {
        bg: 'bg-[#64748B] hover:bg-[#475569] text-white shadow-sm',
        badge: `${mins}m`,
      };
    }

    // Reservada / Convenio -> Ámbar #F59E0B
    if (isReserved) {
      return {
        bg: 'bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-sm',
        badge: 'Convenio',
      };
    }

    // PMR (Movilidad Reducida) -> Cian #06B6D4
    if (slot.tipo === 'PMR') {
      return {
        bg: 'bg-[#06B6D4] hover:bg-[#0891B2] text-white shadow-sm',
        badge: 'PMR',
      };
    }

    // Punto de Carga EV -> Violeta #8B5CF6
    if (slot.tipo === 'ELECTRICO') {
      return {
        bg: 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-sm',
        badge: 'EV',
      };
    }

    // Plazas VIP / Abonados demostrativas en Sector B (ej. B-16, B-17) -> Azul #3B82F6
    if (slot.codigo === 'B-16' || slot.codigo === 'B-17') {
      return {
        bg: 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-sm',
        badge: 'VIP',
      };
    }

    // Disponible -> Verde Esmeralda #10B981
    return {
      bg: 'bg-[#10B981] hover:bg-[#059669] text-white shadow-sm',
      badge: 'Libre',
    };
  };

  const renderSlotTile = (slot: ParkingSlot) => {
    const isOccupied = slot.estado === 'OCUPADO';
    const ticket = slot.ticket_actual;
    const style = getSlotVisualStyle(slot);
    const monto = ticket ? calculateCurrentAmount(ticket) : 0;

    return (
      <button
        key={slot.id}
        type="button"
        onClick={() => {
          if (isOccupied && ticket) {
            setInspectedSlot(slot);
          } else if (onSelectSlotForCheckin) {
            onSelectSlotForCheckin(slot.id);
          }
        }}
        className={`group relative h-[68px] rounded-2xl p-2 flex flex-col justify-between text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80093A] ${style.bg}`}
        title={
          isOccupied && ticket
            ? `Plaza ${slot.codigo} • Patente ${ticket.patente} (Clic para ver ficha)`
            : `Plaza ${slot.codigo} Disponible (Clic para preasignar)`
        }
      >
        <div className="flex items-center justify-between w-full">
          <span className="font-mono text-xs font-extrabold tracking-tight">
            {slot.codigo}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold opacity-90">
            {slot.tipo === 'PMR' && <Accessibility className="w-3 h-3" />}
            {slot.tipo === 'ELECTRICO' && <Zap className="w-3 h-3" />}
            {style.badge}
          </span>
        </div>

        {isOccupied && ticket ? (
          <div className="w-full space-y-0.5">
            <div className="bg-white/95 text-slate-900 font-mono text-[11px] font-black px-1.5 py-0.5 rounded-md text-center tabular-nums truncate shadow-sm">
              {ticket.patente}
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono tabular-nums text-white/90 px-0.5">
              <span>{calculateElapsedMinutes(ticket.fecha_hora_ingreso)}m</span>
              <span className="font-bold">${monto.toLocaleString('es-CL')}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-[10px] font-mono opacity-90">
            <span>Disponible</span>
          </div>
        )}
      </button>
    );
  };

  return (
    <section className="w-full h-full bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between overflow-hidden select-none">
      {/* Cabecera de la Matriz */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Interactive Parking Layout Matrix
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-700 tabular-nums">
              {occupiedOfficial}/30 Ocupadas · {availableCount} Libres
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Serrano 447, Iquique · Clic en plaza ocupada para abrir ficha informativa
          </p>
        </div>

        {/* Leyenda Semántica Oficial (Regla #3) */}
        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono font-semibold">
          <span className="px-2 py-0.5 rounded-md bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/40">
            ● Libre
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#64748B]/15 text-[#334155] border border-[#64748B]/40">
            ● Ocupada
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#3B82F6]/15 text-[#1E40AF] border border-[#3B82F6]/40">
            ● VIP
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#06B6D4]/15 text-[#155E75] border border-[#06B6D4]/40">
            ● PMR
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6]/15 text-[#5B21B6] border border-[#8B5CF6]/40">
            ● EV
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#F59E0B]/15 text-[#92400E] border border-[#F59E0B]/40">
            ● Convenio
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#EF4444]/15 text-[#991B1B] border border-[#EF4444]/40">
            ● Alerta
          </span>
        </div>
      </div>

      {/* Cuerpo Espacial: Sector A (Izquierda) + Driving Lane (Centro) + Sector B (Derecha) (Mockup #1) */}
      <div className="flex-1 flex flex-col justify-center py-2 overflow-y-auto">
        <div className="grid grid-cols-12 gap-2.5 items-stretch">
          {/* Sector A: 15 Plazas (5 filas x 3 columnas) */}
          <div className="col-span-5 space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Sector A (01–15)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Oeste</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sectorASlots.map((slot) => renderSlotTile(slot))}
            </div>
          </div>

          {/* Carril Central de Circulación (Driving Lane de Mockup #1) */}
          <div className="col-span-2 bg-slate-100/90 border border-slate-200/80 rounded-2xl flex flex-col items-center justify-between py-4 px-1 relative">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 text-center">
              Acceso
            </span>
            <div className="flex-1 w-px border-l-2 border-dashed border-slate-300 my-2" />
            <span className="text-[11px] font-bold text-slate-600 tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 py-2">
              Driving lane · Serrano 447
            </span>
            <div className="flex-1 w-px border-l-2 border-dashed border-slate-300 my-2" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 text-center">
              Salida
            </span>
          </div>

          {/* Sector B: 15 Plazas (5 filas x 3 columnas) */}
          <div className="col-span-5 space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Sector B (16–30)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Este / VIP</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sectorBSlots.map((slot) => renderSlotTile(slot))}
            </div>
          </div>
        </div>

        {/* Fila 7: 5 Plazas Adicionales de Sobrecupo Temporal (SC-01 a SC-05) */}
        {sobrecupoSlots.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Fila 7 · Sobrecupo Temporal Pasillo (SC-01 a SC-05)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Contingencia Alta Demanda</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {sobrecupoSlots.map((slot) => renderSlotTile(slot))}
            </div>
          </div>
        )}
      </div>

      {/* POPUP FLOTANTE CENTRAL (backdrop-blur): Spot Info Read-Only Modal (Mockup #4 y Sección 9.1) */}
      {inspectedSlot && inspectedSlot.ticket_actual && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setInspectedSlot(null)}
        >
          <div
            className="max-w-sm w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-slate-400 block">
                  Spot Info · Solo Lectura
                </span>
                <h3 className="text-xl font-bold font-mono text-slate-900">
                  Plaza {inspectedSlot.codigo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedSlot(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs tabular-nums">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Patente:</span>
                <strong className="text-base font-black px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-900">
                  {inspectedSlot.ticket_actual.patente}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Folio Ticket:</span>
                <strong className="text-slate-800">{inspectedSlot.ticket_actual.id_ticket}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hora Ingreso:</span>
                <strong className="text-slate-800">
                  {new Date(inspectedSlot.ticket_actual.fecha_hora_ingreso).toLocaleTimeString(
                    'es-CL',
                    { hour: '2-digit', minute: '2-digit' }
                  )}{' '}
                  hrs
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tiempo Transcurrido:</span>
                <strong className="text-amber-700">
                  {calculateElapsedMinutes(inspectedSlot.ticket_actual.fecha_hora_ingreso)} minutos
                </strong>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-slate-100 items-baseline">
                <span className="text-slate-500 font-sans font-semibold">Monto Acumulado:</span>
                <strong className="text-xl font-extrabold text-[#80093A]">
                  ${calculateCurrentAmount(inspectedSlot.ticket_actual).toLocaleString('es-CL')} CLP
                </strong>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setInspectedSlot(null)}
                className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                Cerrar (Esc)
              </button>
              <button
                type="button"
                onClick={() => {
                  const plate = inspectedSlot.ticket_actual!.patente;
                  setInspectedSlot(null);
                  onSelectSlotForCheckout(plate);
                }}
                className="flex-1 h-11 rounded-xl bg-[#80093A] hover:bg-[#60062B] text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <span>Ir a Cobro en Garita</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
