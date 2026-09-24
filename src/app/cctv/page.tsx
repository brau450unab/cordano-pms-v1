'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Video, AlertCircle, ArrowLeft, ShieldCheck, Radio, RefreshCw } from 'lucide-react';

export default function CctvPage() {
  return (
    <div className="min-h-screen bg-[#F9F9FB] text-[#1D1D1F] flex flex-col font-sans selection:bg-[#80093A] selection:text-white">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="font-bold text-base tracking-wide text-white">CIRCUITO CERRADO DE TELEVISIÓN (CCTV)</span>
              <p className="text-[11px] text-slate-400 font-mono">Infraestructura Física • Serrano 447, Iquique</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-amber-300 font-semibold">MÓDULO EN PROCESO DE VINCULACIÓN</span>
          </div>
        </div>
      </header>

      {/* Aviso de Integración Independiente (Decisión Cuestionario Grill-Me) */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Operación Física Independiente:</strong> Las cámaras de seguridad operan actualmente con su grabador NVR/DVR local de manera autónoma. Esta pantalla presenta la arquitectura base y librerías (WebRTC / HLS / RTSP Proxy) preparadas para su conexión directa en la Fase 2.
          </span>
        </div>
      </div>

      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CÁMARA 01: ACCESO SERRANO 447 */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 text-white shadow-lg flex flex-col justify-between h-72 p-4 relative">
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold tracking-wider">CAM 01 • ACCESO CALLE SERRANO</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-800/80 px-2.5 py-1 rounded text-slate-300">
                LPR READY (RTSP://)
              </span>
            </div>

            {/* Simulación visual de encuadre LPR */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-24 border-2 border-emerald-500/50 rounded-xl flex items-center justify-center relative bg-emerald-950/10">
                <span className="text-[9px] font-mono text-emerald-400 absolute top-1.5 left-2 font-bold">
                  ÁREA DE CAPTURA VEHICULAR
                </span>
                <span className="text-xs font-mono text-emerald-300 font-bold bg-black/60 px-3 py-1 rounded-lg">
                  DETECCIÓN PATENTE
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 z-10 border-t border-slate-800/80 pt-2">
              <span>Barrera Ingreso: MONITOREADA</span>
              <span>Sensor Lazo 1: STANDBY</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* CÁMARA 02: SALIDA & PATIO DE MANIOBRAS */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 text-white shadow-lg flex flex-col justify-between h-72 p-4 relative">
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold tracking-wider">CAM 02 • PATIO & BARRERA SALIDA</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-800/80 px-2.5 py-1 rounded text-slate-300">
                POS TOTEM READY
              </span>
            </div>

            {/* Simulación visual */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-24 border-2 border-sky-500/50 rounded-xl flex items-center justify-center relative bg-sky-950/10">
                <span className="text-[9px] font-mono text-sky-400 absolute top-1.5 left-2 font-bold">
                  ZONA DE LIQUIDACIÓN
                </span>
                <span className="text-xs font-mono text-sky-300 font-bold bg-black/60 px-3 py-1 rounded-lg">
                  PISTOLA LÁSER ACTIVA
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 z-10 border-t border-slate-800/80 pt-2">
              <span>Barrera Salida: MONITOREADA</span>
              <span>Sensor Lazo 2: STANDBY</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Ficha Técnica de Arquitectura Futura */}
        <div className="bg-white rounded-3xl border border-[#E2E2E4] shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Radio className="w-5 h-5 text-[#80093A]" />
            <h2 className="text-base font-bold text-slate-900">
              Librerías & Especificación Técnica para la Conexión en Fase 2
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block font-mono">1. Protocolo WebRTC / RTSP</span>
              <p className="text-slate-500">
                Transmisión de ultra-baja latencia (&lt;300ms) desde el grabador local NVR de Serrano 447 hacia el navegador mediante proxy H.264.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block font-mono">2. Biblioteca HLS.js</span>
              <p className="text-slate-500">
                Fallback automático para streaming HTTP Live Streaming en dispositivos móviles y tablets de supervisores remotos.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block font-mono">3. Vinculación con Incidentes</span>
              <p className="text-slate-500">
                Capacidad de asociar una captura fotográfica al ticket ante fugas de vehículos o discusiones de tarifa para la auditoría inmutable.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
