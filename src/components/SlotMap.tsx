'use client';

import React, { useState } from 'react';
import { ParkingSlot } from '@/types';
import {
  Car,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Accessibility,
  LayoutGrid,
  Columns3,
  ArrowRight,
  ShieldAlert,
  Search,
  Maximize2
} from 'lucide-react';

interface SlotMapProps {
  slots: ParkingSlot[];
  onSelectSlotForCheckout?: (patente: string) => void;
}

export const SlotMap: React.FC<SlotMapProps> = ({ slots, onSelectSlotForCheckout }) => {
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | 'kanban'>('2d');
  const [filtroTipo, setFiltroTipo] = useState<'ALL' | 'NORMAL' | 'PMR' | 'ELECTRICO'>('ALL');

  const sectorA = slots.filter((s) => s.sector === 'A' || s.id <= 15);
  const sectorB = slots.filter((s) => s.sector === 'B' || (s.id > 15 && s.id <= 30));
  const sobrecupoSlots = slots.filter((s) => s.sector === 'SOBRECUPO' || s.id > 30);

  const ocupados = slots.filter((s) => s.estado === 'OCUPADO').length;
  const libres = slots.filter((s) => s.estado === 'DISPONIBLE').length;
  const tasaOcupacion = slots.length > 0 ? Math.round((ocupados / slots.length) * 100) : 0;

  const getMinutosEstadia = (fechaIngreso?: string) => {
    if (!fechaIngreso) return 0;
    const diff = Date.now() - new Date(fechaIngreso).getTime();
    return Math.max(1, Math.floor(diff / 60000));
  };

  const getTarifaEstimada = (minutos: number) => {
    // $25/minuto con tope 30m gracia para demo
    return Math.max(1000, Math.ceil(minutos * 25 / 10) * 10);
  };

  // Clasificación para columnas Kanban
  const kanbanMenor1h = slots.filter(
    (s) => s.estado === 'OCUPADO' && getMinutosEstadia(s.ticket_actual?.fecha_hora_ingreso) < 60
  );
  const kanban1a2h = slots.filter((s) => {
    const m = getMinutosEstadia(s.ticket_actual?.fecha_hora_ingreso);
    return s.estado === 'OCUPADO' && m >= 60 && m < 120;
  });
  const kanban2a4h = slots.filter((s) => {
    const m = getMinutosEstadia(s.ticket_actual?.fecha_hora_ingreso);
    return s.estado === 'OCUPADO' && m >= 120 && m < 240;
  });
  const kanbanMayor4h = slots.filter(
    (s) => s.estado === 'OCUPADO' && getMinutosEstadia(s.ticket_actual?.fecha_hora_ingreso) >= 240
  );

  // Helper para styling semántico de cada slot según Rule 3
  const getSlotStyle = (slot: ParkingSlot) => {
    const isOcupado = slot.estado === 'OCUPADO';
    const minutos = getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso);
    const isSobrestadia = isOcupado && minutos >= 180;

    if (isSobrestadia) {
      return {
        bg: 'bg-rose-50 border-rose-400 hover:border-rose-500 ring-1 ring-rose-300',
        badge: 'bg-rose-500 text-white',
        text: 'text-rose-950',
        dot: 'bg-rose-500 animate-pulse',
      };
    }
    if (isOcupado) {
      return {
        bg: 'bg-slate-100 border-slate-400 hover:border-slate-500',
        badge: 'bg-slate-600 text-white',
        text: 'text-slate-900',
        dot: 'bg-slate-600',
      };
    }
    if (slot.tipo === 'PMR') {
      return {
        bg: 'bg-cyan-50/70 border-cyan-300 hover:border-cyan-400',
        badge: 'bg-cyan-600 text-white',
        text: 'text-cyan-950',
        dot: 'bg-cyan-500',
      };
    }
    if (slot.tipo === 'ELECTRICO') {
      return {
        bg: 'bg-violet-50/70 border-violet-300 hover:border-violet-400',
        badge: 'bg-violet-600 text-white',
        text: 'text-violet-950',
        dot: 'bg-violet-500',
      };
    }
    return {
      bg: 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400',
      badge: 'bg-emerald-600 text-white',
      text: 'text-emerald-950',
      dot: 'bg-emerald-500',
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      {/* Barra de Control y Ocupación */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-sky-600" />
            Matriz de Plazas en Tiempo Real (Serrano 447)
          </h3>
          <p className="text-xs text-slate-500">
            30 Plazas Canónicas • Sector A (Oeste: PMR/EV) y Sector B (Este) + Sobrecupo
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Switch de Vistas: 2D Plano vs Kanban */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === '2d' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Plano 2D Garita
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'kanban' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              Kanban por Estadía
            </button>
          </div>

          {/* Medidor de Ocupación */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  tasaOcupacion > 85 ? 'bg-rose-500' : tasaOcupacion > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${tasaOcupacion}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
              {tasaOcupacion}% ({ocupados}/30)
            </span>
          </div>
        </div>
      </div>

      {/* Leyenda Semántica de Códigos de Color (Rule 3) */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-200">
        <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">Leyenda:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-700">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
          <span className="text-slate-700">Ocupado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
          <span className="text-slate-700">PMR (A-01, A-02)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
          <span className="text-slate-700">EV Carga (A-03)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-slate-700">Sobrestadía &gt;3h</span>
        </div>
      </div>

      {/* VISTA 1: PLANO 2D CANÓNICO SERRANO 447 */}
      {viewMode === '2d' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sector A (Oeste: Slots 01 a 15) */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Sector A • Entrada & Garita (Slots 01 - 15)
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-500">
                  {sectorA.filter((s) => s.estado === 'DISPONIBLE').length} Libres
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {sectorA.map((slot) => {
                  const isOcupado = slot.estado === 'OCUPADO';
                  const minutos = getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso);
                  const style = getSlotStyle(slot);

                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`relative p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-20 shadow-sm active:scale-95 ${style.bg}`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-mono font-bold text-xs text-slate-800 flex items-center gap-1">
                          {slot.codigo}
                          {slot.tipo === 'PMR' && <Accessibility className="w-3 h-3 text-cyan-600" />}
                          {slot.tipo === 'ELECTRICO' && <Zap className="w-3 h-3 text-violet-600" />}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                      </div>

                      {isOcupado && slot.ticket_actual ? (
                        <div>
                          <span className={`font-mono font-bold text-xs block truncate ${style.text}`}>
                            {slot.ticket_actual.patente}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 flex items-center gap-0.5 tabular-nums">
                            <Clock className="w-2.5 h-2.5" />
                            {minutos}m
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                          Libre
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sector B (Este: Slots 16 a 30) */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Sector B • Salida & Fondo (Slots 16 - 30)
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-500">
                  {sectorB.filter((s) => s.estado === 'DISPONIBLE').length} Libres
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {sectorB.map((slot) => {
                  const isOcupado = slot.estado === 'OCUPADO';
                  const minutos = getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso);
                  const style = getSlotStyle(slot);

                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`relative p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-20 shadow-sm active:scale-95 ${style.bg}`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-mono font-bold text-xs text-slate-800">
                          {slot.codigo}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                      </div>

                      {isOcupado && slot.ticket_actual ? (
                        <div>
                          <span className={`font-mono font-bold text-xs block truncate ${style.text}`}>
                            {slot.ticket_actual.patente}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 flex items-center gap-0.5 tabular-nums">
                            <Clock className="w-2.5 h-2.5" />
                            {minutos}m
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                          Libre
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Slots Virtuales de Sobrecupo si existen */}
          {sobrecupoSlots.length > 0 && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Slots Virtuales de Sobrecupo Temporal (Capacidad 30 Excedida)
              </h4>
              <div className="flex flex-wrap gap-2">
                {sobrecupoSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-900 shadow-sm flex items-center gap-2"
                  >
                    <span>{slot.codigo}</span>
                    <span className="text-amber-700">({slot.ticket_actual?.patente || 'Ocupado'})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: TABLERO KANBAN POR ESTADÍA */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Columna 1: < 1 hora */}
          <div className="bg-emerald-50/40 rounded-xl border border-emerald-200 p-3 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-emerald-200">
              <span className="text-xs font-bold text-emerald-900">&lt; 1 Hora (Tránsito)</span>
              <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {kanbanMenor1h.length}
              </span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {kanbanMenor1h.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-400 transition text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-slate-900">{slot.ticket_actual?.patente}</span>
                    <span className="font-mono text-[10px] text-slate-500">{slot.codigo}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                    <span>{getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso)} min</span>
                    <span className="text-emerald-700 font-semibold">
                      ~${getTarifaEstimada(getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso)).toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              ))}
              {kanbanMenor1h.length === 0 && (
                <p className="text-[11px] text-slate-400 text-center py-4">Sin vehículos en este rango</p>
              )}
            </div>
          </div>

          {/* Columna 2: 1 a 2 horas */}
          <div className="bg-sky-50/40 rounded-xl border border-sky-200 p-3 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-sky-200">
              <span className="text-xs font-bold text-sky-900">1 a 2 Horas (Estándar)</span>
              <span className="font-mono text-xs font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                {kanban1a2h.length}
              </span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {kanban1a2h.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-sky-400 transition text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-slate-900">{slot.ticket_actual?.patente}</span>
                    <span className="font-mono text-[10px] text-slate-500">{slot.codigo}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                    <span>{getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso)} min</span>
                    <span className="text-sky-700 font-semibold">
                      ~${getTarifaEstimada(getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso)).toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              ))}
              {kanban1a2h.length === 0 && (
                <p className="text-[11px] text-slate-400 text-center py-4">Sin vehículos en este rango</p>
              )}
            </div>
          </div>

          {/* Columna 3: 2 a 4 horas */}
          <div className="bg-amber-50/40 rounded-xl border border-amber-200 p-3 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-amber-200">
              <span className="text-xs font-bold text-amber-900">2 a 4 Horas (Prolongada)</span>
              <span className="font-mono text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {kanban2a4h.length}
              </span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {kanban2a4h.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-amber-400 transition text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-slate-900">{slot.ticket_actual?.patente}</span>
                    <span className="font-mono text-[10px] text-slate-500">{slot.codigo}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                    <span>{getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso)} min</span>
                    <span className="text-amber-700 font-semibold">
                      ~${getTarifaEstimada(getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso)).toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              ))}
              {kanban2a4h.length === 0 && (
                <p className="text-[11px] text-slate-400 text-center py-4">Sin vehículos en este rango</p>
              )}
            </div>
          </div>

          {/* Columna 4: > 4 horas */}
          <div className="bg-rose-50/40 rounded-xl border border-rose-200 p-3 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-rose-200">
              <span className="text-xs font-bold text-rose-900">&gt; 4 Horas (Alerta Sobrestadía)</span>
              <span className="font-mono text-xs font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                {kanbanMayor4h.length}
              </span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {kanbanMayor4h.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className="p-2.5 bg-white rounded-lg border border-rose-300 shadow-sm cursor-pointer hover:border-rose-500 transition text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-rose-950">{slot.ticket_actual?.patente}</span>
                    <span className="font-mono text-[10px] text-slate-500">{slot.codigo}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                    <span className="text-rose-700 font-bold">{getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso)} min</span>
                    <span className="text-rose-800 font-bold">
                      ~${getTarifaEstimada(getMinutosEstadia(slot.ticket_actual?.fecha_hora_ingreso)).toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              ))}
              {kanbanMayor4h.length === 0 && (
                <p className="text-[11px] text-slate-400 text-center py-4">Sin vehículos en alerta</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POP-UP MODAL FLOTANTE CENTRAL CON BACKDROP-BLUR (Rule 6: Progressive Disclosure) */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-slate-900">
                  Plaza {selectedSlot.codigo}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    selectedSlot.estado === 'OCUPADO'
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedSlot.estado}
                </span>
                {selectedSlot.tipo !== 'NORMAL' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {selectedSlot.tipo}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {selectedSlot.ticket_actual ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Patente:</span>
                    <span className="font-bold text-base text-slate-900">
                      {selectedSlot.ticket_actual.patente}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">N° Ticket:</span>
                    <span className="text-slate-700">{selectedSlot.ticket_actual.id_ticket}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Hora Ingreso:</span>
                    <span className="text-slate-700">
                      {new Date(selectedSlot.ticket_actual.fecha_hora_ingreso).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tiempo Transcurrido:</span>
                    <span className="font-bold text-sky-700 tabular-nums">
                      {getMinutosEstadia(selectedSlot.ticket_actual.fecha_hora_ingreso)} min
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-bold">Cobro Estimado a la Fecha:</span>
                    <span className="font-bold text-emerald-700 text-sm tabular-nums">
                      ${getTarifaEstimada(getMinutosEstadia(selectedSlot.ticket_actual.fecha_hora_ingreso)).toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (onSelectSlotForCheckout && selectedSlot.ticket_actual) {
                        const pat = selectedSlot.ticket_actual.patente;
                        setSelectedSlot(null);
                        onSelectSlotForCheckout(pat);
                      }
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    COBRAR SALIDA (F2)
                  </button>
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="px-4 py-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Cerrar (Esc)
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  Esta plaza se encuentra disponible para estacionar.
                </p>
                <p className="text-[11px] text-slate-400">
                  {selectedSlot.tipo === 'PMR' && 'Reservada para personas con movilidad reducida (Ley 20.422).'}
                  {selectedSlot.tipo === 'ELECTRICO' && 'Habilitada con cargador para vehículo eléctrico.'}
                  {selectedSlot.tipo === 'NORMAL' && 'Plaza regular de garita Serrano 447.'}
                </p>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="mt-2 px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Aceptar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
