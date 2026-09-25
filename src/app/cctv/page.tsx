'use client';

import React, { useState } from 'react';
import { MacOSNavigationShell } from '@/components/MacOSNavigationShell';
import {
  Camera,
  Eye,
  X,
  Unlock,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

const CCTV_FEEDS = [
  {
    id: 'CAM-01',
    name: 'CAM 01 · Acceso Principal Serrano 447 (LPR Entrada)',
    plateDetected: 'ABCD-12',
    confidence: '99.4%',
    sector: 'Gate 1 · Main Entry',
    status: 'LIVE · 60 FPS',
    bgImage: '/serrano-render.jpg',
  },
  {
    id: 'CAM-02',
    name: 'CAM 02 · Salida y Barrera Cobro Garita (LPR Salida)',
    plateDetected: 'JK-LP-34',
    confidence: '98.9%',
    sector: 'Gate 2 · Main Exit',
    status: 'LIVE · 60 FPS',
    bgImage: '/hub-bg.jpg',
  },
  {
    id: 'CAM-03',
    name: 'CAM 03 · Pasillo Central Sector A (Plazas 01–15)',
    plateDetected: 'RT-WX-91',
    confidence: '97.8%',
    sector: 'Driving Lane · Sector A',
    status: 'LIVE · 30 FPS',
    bgImage: '/landing-bg.jpg',
  },
  {
    id: 'CAM-04',
    name: 'CAM 04 · Sector B & Zona VIP / Carga EV (Plazas 16–30)',
    plateDetected: 'CD-AB-89',
    confidence: '99.1%',
    sector: 'Sector B · VIP / EV',
    status: 'LIVE · 30 FPS',
    bgImage: '/login-bg.jpg',
  },
];

export default function CctvPage() {
  const [selectedFeed, setSelectedFeed] = useState<(typeof CCTV_FEEDS)[0] | null>(null);
  const [showMockup, setShowMockup] = useState(false);

  return (
    <MacOSNavigationShell
      title="Monitoreo de Cámaras LPR / CCTV en Vivo"
      subtitle="Sección 13.3 del Catálogo · Grilla 2x2 con Reconocimiento Óptico de Patentes (OCR)"
      roleLabel="Seguridad LPR"
      rightActions={
        <button
          type="button"
          onClick={() => setShowMockup(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#80093A]" />
          <span>Mockup #5</span>
        </button>
      }
    >
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Grilla 2x2 de Cámaras LPR con Bounding Box Burdeos (#80093A) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CCTV_FEEDS.map((cam) => (
            <div
              key={cam.id}
              className="bg-white rounded-3xl border border-[#E2E2E4] overflow-hidden shadow-2xs flex flex-col"
            >
              {/* Cabecera de Cámara */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-slate-900">
                    {cam.name}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-600 tabular-nums">
                  {cam.status}
                </span>
              </div>

              {/* Visor de Video con Bounding Box LPR en color Burdeos #80093A */}
              <div className="relative h-64 bg-slate-900 overflow-hidden">
                <img
                  src={cam.bgImage}
                  alt={cam.name}
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Bounding Box LPR (#80093A) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-24 border-2 border-[#80093A] rounded-xl bg-[#80093A]/15 backdrop-blur-[2px] flex flex-col items-center justify-center shadow-lg">
                  <span className="px-2 py-0.5 rounded bg-[#80093A] text-white font-mono text-[10px] font-bold uppercase tracking-wider -mt-7 shadow-xs">
                    LPR OCR · {cam.confidence}
                  </span>
                  <span className="font-mono font-black text-2xl text-white tracking-widest mt-1 tabular-nums">
                    {cam.plateDetected}
                  </span>
                </div>

                {/* Telemetría inferior */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/15">
                    {cam.sector}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFeed(cam)}
                    className="p-2 rounded-lg bg-black/60 hover:bg-[#80093A] border border-white/15 transition cursor-pointer"
                    title="Ampliar cámara"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Cámara Ampliada */}
      {selectedFeed && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedFeed(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                {selectedFeed.name} — Patente Detectada: {selectedFeed.plateDetected}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedFeed(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={selectedFeed.bgImage}
                alt={selectedFeed.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {showMockup && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowMockup(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 max-w-5xl w-full p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                Lámina Oficial Mockup #5 · Monitoreo CCTV LPR 2x2
              </h3>
              <button
                type="button"
                onClick={() => setShowMockup(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src="/mockups/ui_menu_lateral_convenios_usuarios_cctv.jpg"
                alt="Mockup Oficial CCTV"
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </MacOSNavigationShell>
  );
}
