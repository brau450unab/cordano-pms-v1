'use client';

import React, { useState } from 'react';
import { MacOSNavigationShell } from '@/components/MacOSNavigationShell';
import {
  Settings,
  Printer,
  Save,
  CheckCircle2,
  Eye,
  X,
  Wifi,
  ShieldCheck
} from 'lucide-react';

export default function ConfiguracionPage() {
  const [tarifaMinutoAuto, setTarifaMinutoAuto] = useState(30);
  const [tarifaJornada, setTarifaJornada] = useState(6000);
  const [tarifaPernocta, setTarifaPernocta] = useState(5000);
  const [multaTicketPerdido, setMultaTicketPerdido] = useState(8000);
  const [minutosGracia, setMinutosGracia] = useState(10);

  // Switches de Hardware macOS
  const [printer80mmConnected, setPrinter80mmConnected] = useState(true);
  const [dualBarcodeEnabled, setDualBarcodeEnabled] = useState(true);
  const [offlineContingencyEnabled, setOfflineContingencyEnabled] = useState(true);
  const [lprAutoOpenEnabled, setLprAutoOpenEnabled] = useState(true);

  const [savedNotice, setSavedNotice] = useState(false);
  const [showMockup, setShowMockup] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <MacOSNavigationShell
      title="Configuraciones del Sistema (Tarifas & Hardware)"
      subtitle="Sección 13.1 del Catálogo · Motor Tarifario CLP e Impresora Térmica ESC/POS 80mm"
      roleLabel="Configuración ERP"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMockup(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#80093A]" />
            <span>Mockup #4</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#80093A] hover:bg-[#68072f] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSave} className="max-w-5xl mx-auto space-y-6">
        {savedNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Parámetros tarifarios y configuración de impresora térmica 80mm sincronizados con Cloud Run e IndexedDB local.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Tarjeta Motor de Tarifas CLP (Tabular-Nums) */}
          <div className="bg-white rounded-3xl border border-[#E2E2E4] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Parámetros del Motor Tarifario (CLP)
                </h2>
                <p className="text-xs text-slate-500">
                  Valores oficiales aplicados en Garita POS Serrano 447
                </p>
              </div>
              <Settings className="w-5 h-5 text-[#80093A]" />
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Tarifa Rotativa por Minuto (Auto / SUV)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Cobro base fraccionado por minuto efectivo
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    value={tarifaMinutoAuto}
                    onChange={(e) => setTarifaMinutoAuto(Number(e.target.value))}
                    className="w-24 h-10 px-3 text-right rounded-xl bg-white border border-slate-300 font-mono font-black text-sm text-slate-900 tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Tarifa Plana Jornada Diurna
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Tope diario horario hábil (08:00 a 20:00 hrs)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    step={500}
                    value={tarifaJornada}
                    onChange={(e) => setTarifaJornada(Number(e.target.value))}
                    className="w-28 h-10 px-3 text-right rounded-xl bg-white border border-slate-300 font-mono font-black text-sm text-slate-900 tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Tarifa Pernocta Nocturna (En Paralelo)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Horario 21:00 PM a 08:00 AM (Bloquea plaza)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    step={500}
                    value={tarifaPernocta}
                    onChange={(e) => setTarifaPernocta(Number(e.target.value))}
                    className="w-28 h-10 px-3 text-right rounded-xl bg-white border border-slate-300 font-mono font-black text-sm text-slate-900 tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
                <div>
                  <span className="text-xs font-bold text-rose-950 block">
                    Multa por Extravío de Ticket (PIN Admin)
                  </span>
                  <span className="text-[11px] text-rose-700">
                    Impresa en leyenda legal inferior del ticket 80mm
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-rose-700">$</span>
                  <input
                    type="number"
                    step={500}
                    value={multaTicketPerdido}
                    onChange={(e) => setMultaTicketPerdido(Number(e.target.value))}
                    className="w-28 h-10 px-3 text-right rounded-xl bg-white border border-rose-300 font-mono font-black text-sm text-rose-800 tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Tiempo de Gracia Libre de Cobro
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Minutos iniciales sin cargo al ingresar
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={minutosGracia}
                    onChange={(e) => setMinutosGracia(Number(e.target.value))}
                    className="w-20 h-10 px-3 text-right rounded-xl bg-white border border-slate-300 font-mono font-black text-sm text-slate-900 tabular-nums"
                  />
                  <span className="text-xs font-mono text-slate-500">min</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Tarjeta Impresora Térmica 80mm & Contingencia Offline */}
          <div className="bg-white rounded-3xl border border-[#E2E2E4] p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Hardware de Garita &amp; Impresora 80mm
                  </h2>
                  <p className="text-xs text-slate-500">
                    Switches nativos estilo macOS System Settings
                  </p>
                </div>
                <Printer className="w-5 h-5 text-[#80093A]" />
              </div>

              {/* Switch 1 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F9FB] border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Thermal Printer 80mm ESC/POS (USB / LAN)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    ● Epson TM-T20III Conectada (302px roll width)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPrinter80mmConnected(!printer80mmConnected)}
                  className={`w-12 h-7 rounded-full transition p-1 cursor-pointer ${
                    printer80mmConnected ? 'bg-[#10B981]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      printer80mmConnected ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Switch 2 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F9FB] border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Identificación Dual (Code 128 + QR 2D)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Imprime código lineal láser y QR móvil simultáneamente
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDualBarcodeEnabled(!dualBarcodeEnabled)}
                  className={`w-12 h-7 rounded-full transition p-1 cursor-pointer ${
                    dualBarcodeEnabled ? 'bg-[#10B981]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      dualBarcodeEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Switch 3 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F9FB] border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Modo Contingencia Offline-First (Sufijo -O)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Persistencia local IndexedDB + folio TKT-AAAAMMDD-T0X-XXXXO
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setOfflineContingencyEnabled(!offlineContingencyEnabled)
                  }
                  className={`w-12 h-7 rounded-full transition p-1 cursor-pointer ${
                    offlineContingencyEnabled ? 'bg-[#10B981]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      offlineContingencyEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Switch 4 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F9FB] border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Apertura Automática LPR para Abonados VIP
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Acciona Gate 1 al detectar patente convenio al día
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLprAutoOpenEnabled(!lprAutoOpenEnabled)}
                  className={`w-12 h-7 rounded-full transition p-1 cursor-pointer ${
                    lprAutoOpenEnabled ? 'bg-[#10B981]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      lprAutoOpenEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-2 font-semibold">
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span>Cloud Run Endpoint: cordano-pms-v1 (us-west1)</span>
              </span>
              <span className="font-mono font-bold text-emerald-700">24ms</span>
            </div>
          </div>
        </div>
      </form>

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
                Lámina Oficial Mockup #4 · Configuraciones, Reportes Z y Ticket 80mm
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
                src="/mockups/ui_popups_reportes_configuracion_ticket_pdf.jpg"
                alt="Mockup Oficial Configuración"
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </MacOSNavigationShell>
  );
}
