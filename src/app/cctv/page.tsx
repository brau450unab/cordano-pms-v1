'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Video, AlertCircle, ArrowLeft, ShieldCheck, Radio, RefreshCw } from 'lucide-react';

export default function CctvPage() {
  return (
    <div className="min-h-screen bg-[#06080E] text-white flex flex-col font-sans selection:bg-[#80093A] selection:text-white relative overflow-hidden">
      
      {/* Background Texture from Magnific AI */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: "url('/hub-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080E]/60 to-[#06080E] pointer-events-none" />

      {/* Header macOS Frosted Glass */}
      <header className="relative z-40 glass-panel mx-4 mt-4 rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/hub"
              className="p-3 rounded-2xl macos-btn hover:scale-105 active:scale-95 transition"
              title="Volver al Launchpad"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div>
              <span className="font-extrabold text-base tracking-wide text-white block">
                CIRCUITO CERRADO DE TELEVISIÓN (CCTV)
              </span>
              <p className="text-[11px] text-slate-400 font-mono">Infraestructura Física • Serrano 447, Iquique</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono glass-panel px-3.5 py-1.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-amber-300 font-semibold">MÓDULO EN PROCESO DE VINCULACIÓN</span>
          </div>
        </div>
      </header>

      {/* Aviso de Integración Independiente */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 mt-6">
        <div className="glass-panel border-amber-500/30 bg-amber-950/20 px-6 py-4 rounded-2xl text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Operación Física Independiente:</strong> Las cámaras de seguridad operan actualmente con su grabador NVR/DVR local de manera autónoma. Esta pantalla presenta la arquitectura base y librerías (WebRTC / HLS / RTSP Proxy) preparadas para su conexión directa en la Fase 2.
            </span>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CÁMARA 01: ACCESO SERRANO 447 */}
          <div className="glass-panel rounded-3xl overflow-hidden text-white shadow-2xl flex flex-col justify-between h-72 p-5 relative spring-anim hover:border-cyan-500/40">
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold tracking-wider">CAM 01 • ACCESO CALLE SERRANO</span>
              </div>
              <span className="text-[10px] font-mono bg-black/60 border border-white/10 px-2.5 py-1 rounded-full text-cyan-300">
                LPR READY (RTSP://)
              </span>
            </div>

            {/* Simulación visual de encuadre LPR */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-24 border-2 border-emerald-500/60 rounded-xl flex items-center justify-center relative bg-emerald-950/20 backdrop-blur-[1px]">
                <span className="text-[9px] font-mono text-emerald-400 absolute top-1.5 left-2 font-bold">
                  ÁREA DE CAPTURA VEHICULAR
                </span>
                <span className="text-xs font-mono text-emerald-300 font-bold bg-black/70 px-3 py-1 rounded-lg border border-emerald-500/40">
                  DETECCIÓN PATENTE
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 z-10 border-t border-white/10 pt-3">
              <span>Barrera Ingreso: <strong className="text-emerald-400">MONITOREADA</strong></span>
              <span>Sensor Lazo 1: STANDBY</span>
            </div>
          </div>

          {/* CÁMARA 02: SALIDA & PATIO DE MANIOBRAS */}
          <div className="glass-panel rounded-3xl overflow-hidden text-white shadow-2xl flex flex-col justify-between h-72 p-5 relative spring-anim hover:border-sky-500/40">
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold tracking-wider">CAM 02 • PATIO & BARRERA SALIDA</span>
              </div>
              <span className="text-[10px] font-mono bg-black/60 border border-white/10 px-2.5 py-1 rounded-full text-sky-300">
                POS TOTEM READY
              </span>
            </div>

            {/* Simulación visual */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-24 border-2 border-sky-500/60 rounded-xl flex items-center justify-center relative bg-sky-950/20 backdrop-blur-[1px]">
                <span className="text-[9px] font-mono text-sky-400 absolute top-1.5 left-2 font-bold">
                  ZONA DE LIQUIDACIÓN
                </span>
                <span className="text-xs font-mono text-sky-300 font-bold bg-black/70 px-3 py-1 rounded-lg border border-sky-500/40">
                  PISTOLA LÁSER ACTIVA
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 z-10 border-t border-white/10 pt-3">
              <span>Barrera Salida: <strong className="text-emerald-400">MONITOREADA</strong></span>
              <span>Sensor Lazo 2: STANDBY</span>
            </div>
          </div>
        </div>

        {/* Ficha Técnica de Arquitectura Futura */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Radio className="w-5 h-5 text-[#ff80a0]" />
            <h2 className="text-base font-bold text-white">
              Librerías & Especificación Técnica para la Conexión en Fase 2
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1.5">
              <span className="font-bold text-cyan-300 block font-mono">1. Protocolo WebRTC / RTSP</span>
              <p className="text-slate-400">
                Transmisión de ultra-baja latencia (&lt;300ms) desde el grabador local NVR de Serrano 447 hacia el navegador mediante proxy H.264.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1.5">
              <span className="font-bold text-emerald-300 block font-mono">2. Biblioteca HLS.js</span>
              <p className="text-slate-400">
                Fallback automático para streaming HTTP Live Streaming en dispositivos móviles y tablets de supervisores remotos.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1.5">
              <span className="font-bold text-purple-300 block font-mono">3. Vinculación con Incidentes</span>
              <p className="text-slate-400">
                Capacidad de asociar una captura fotográfica al ticket ante fugas de vehículos o discusiones de tarifa para la auditoría inmutable.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
