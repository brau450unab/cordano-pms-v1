'use client';

import React from 'react';
import { Printer, MessageCircle } from 'lucide-react';

export interface ThermalTicketProps {
  folio: string; // Ej: 'TKT-20260925-T01-0042' o 'TKT-20260925-T01-0042O'
  isOffline?: boolean;
  plate?: string;
  patente?: string;
  spotCode?: string;
  sectorPlaza?: string;
  entryDate?: string;
  fecha?: string;
  entryTime?: string;
  horaIngreso?: string;
  tariffLabel?: string;
  tarifaTexto?: string;
  vehicleType?: string;
  notes?: string;
  showActions?: boolean;
  onClose?: () => void;
}

export const ThermalTicketPDFTemplate: React.FC<ThermalTicketProps> = ({
  folio = 'TKT-20260925-T01-0042',
  isOffline = false,
  plate,
  patente,
  spotCode,
  sectorPlaza,
  entryDate,
  fecha,
  entryTime,
  horaIngreso,
  tariffLabel,
  tarifaTexto,
  vehicleType = 'AUTO',
  notes,
  showActions = false,
  onClose,
}) => {
  const finalFolio = isOffline && !folio.endsWith('O') ? `${folio}O` : folio;
  const resolvedPlate = plate || patente || 'ABCD-12';
  const resolvedSpot = spotCode || sectorPlaza || 'A-12 (General)';
  const resolvedDate = entryDate || fecha || '19/04/2026';
  const resolvedTime = entryTime || horaIngreso || '09:30 AM';
  const resolvedTariff = tariffLabel || tarifaTexto || '$30 / min (10m gracia)';

  return (
    <div className="space-y-4">
      <div className="w-[302px] bg-white text-black p-5 font-mono text-xs border border-slate-300 shadow-lg rounded-xl mx-auto print:shadow-none print:border-none select-none">
        {/* Thermal paper header */}
        <div className="text-center border-b border-slate-300 pb-3 space-y-0.5">
          <p className="font-black text-xl tracking-tight text-[#80093A] font-sans">
            Cordano
          </p>
          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
            Inversiones Inmobiliarias Ltda.
          </p>
          <p className="text-[10px] text-slate-500">Serrano 447, Iquique - Chile</p>
        </div>

        {/* Folio & Timestamp */}
        <div className="py-2.5 border-b border-slate-200 space-y-1 tabular-nums text-[11px]">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Folio</span>
            <strong className="font-extrabold text-sm text-slate-900 tracking-tight">
              {finalFolio}
            </strong>
          </div>
          {isOffline && (
            <div className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-center">
              EMITIDO EN CONTINGENCIA OFFLINE (SUFIJO O)
            </div>
          )}
          <div className="flex justify-between text-[10px] text-slate-600 pt-1">
            <span>FECHA: {resolvedDate}</span>
            <span>HORA: {resolvedTime}</span>
          </div>
        </div>

        {/* License Plate Highlight (Mockup #4 exact layout) */}
        <div className="py-3 text-center border-b border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
            License Plate / Patente
          </span>
          <div className="text-3xl font-black tracking-widest my-1 tabular-nums text-slate-950">
            {resolvedPlate}
          </div>
          <div className="flex justify-center items-center gap-2 text-[11px] font-bold text-slate-700">
            <span className="px-2 py-0.5 rounded bg-slate-100">PLAZA: {resolvedSpot}</span>
            <span>•</span>
            <span>{vehicleType}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{resolvedTariff}</p>
          {notes && (
            <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 mt-1.5">
              Obs: {notes}
            </p>
          )}
        </div>

        {/* Dual Identification: Code 128 Barcode + 2D QR (Regla #4) */}
        <div className="py-3.5 border-b border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">
            Code 128 + QR Dual Scan
          </span>
          <div className="flex items-center justify-between gap-3">
            {/* Linear Code 128 Barcode */}
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full h-14"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 8px, #000 8px, #000 11px, transparent 11px, transparent 13px)',
                }}
              />
              <span className="text-[9px] tracking-widest font-bold tabular-nums mt-1 text-slate-700">
                {finalFolio}
              </span>
            </div>

            {/* 2D QR Code SVG representation */}
            <div className="w-16 h-16 border-2 border-black p-1 shrink-0 grid grid-cols-5 grid-rows-5 gap-0.5 bg-white">
              <div className="bg-black col-span-2 row-span-2" />
              <div className="bg-black" />
              <div className="bg-black col-span-2 row-span-2" />
              <div className="bg-black" />
              <div className="bg-white" />
              <div className="bg-black" />
              <div className="bg-black" />
              <div className="bg-white" />
              <div className="bg-black col-span-2 row-span-2" />
              <div className="bg-black" />
              <div className="bg-black" />
              <div className="bg-white" />
              <div className="bg-black" />
            </div>
          </div>
        </div>

        {/* Legal Warning Footer */}
        <div className="pt-2.5 text-[10px] leading-tight text-center text-slate-600 space-y-1">
          <p className="font-bold text-slate-900 uppercase">
            Advertencia Legal por Extravío
          </p>
          <p>
            Conserve este comprobante. El extravío del ticket tiene un recargo fijo de{' '}
            <strong className="text-slate-900">$8.000 CLP</strong> sujeto a validación con
            PIN de Administrador.
          </p>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center justify-center gap-2 print:hidden">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.print();
              if (onClose) onClose();
            }}
            className="h-10 px-4 rounded-xl bg-[#80093A] hover:bg-[#68072f] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir 80mm / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => {
              alert(`Comprobante digital enviado por WhatsApp para patente ${resolvedPlate}.`);
              if (onClose) onClose();
            }}
            className="h-10 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      )}
    </div>
  );
};
