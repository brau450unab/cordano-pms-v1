'use client';

import React, { useState } from 'react';
import {
  Car,
  Truck,
  Bike,
  AlertCircle,
  CheckCircle,
  Printer,
  ArrowRight,
  Globe,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sparkles,
  Camera,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { VehicleType, Ticket } from '@/types';

interface PosCheckinProps {
  onCheckinSuccess: () => void;
  availableSlots: number[];
}

export const PosCheckin: React.FC<PosCheckinProps> = ({
  onCheckinSuccess,
  availableSlots,
}) => {
  const [patente, setPatente] = useState('');
  const [isForeignPlate, setIsForeignPlate] = useState(false);
  const [tipo, setTipo] = useState<VehicleType>('auto');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [driverName, setDriverName] = useState('');
  const [damageNotes, setDamageNotes] = useState('');
  const [slotSeleccionado, setSlotSeleccionado] = useState<string>('');
  
  // Menú colapsable / desplegable de opciones secundarias
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ultimoTicket, setUltimoTicket] = useState<Ticket | null>(null);
  
  // Estado para Anti-Passback confirmation modal
  const [showAntiPassbackModal, setShowAntiPassbackModal] = useState(false);
  const [antiPassbackMessage, setAntiPassbackMessage] = useState('');

  const handlePatenteChange = (val: string) => {
    const raw = val.toUpperCase();
    if (isForeignPlate) {
      setPatente(raw);
    } else {
      // Formatear patente chilena automáticamente con guion si corresponde
      const clean = raw.replace(/[^A-Z0-9]/g, '');
      if (clean.length > 4 && !clean.includes('-')) {
        setPatente(`${clean.slice(0, 4)}-${clean.slice(4, 6)}`);
      } else {
        setPatente(clean.slice(0, 7));
      }
    }
  };

  const executeCheckin = async (forzar: boolean = false) => {
    if (!patente) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patente,
          tipo,
          telefono: telefono ? `+569${telefono.replace(/[^0-9]/g, '')}` : undefined,
          email: email || undefined,
          driverName: driverName || undefined,
          damageNotes: damageNotes || undefined,
          isForeignPlate,
          slotId: slotSeleccionado ? Number(slotSeleccionado) : undefined,
          forzarIngreso: forzar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isAntiPassback) {
          setAntiPassbackMessage(data.error);
          setShowAntiPassbackModal(true);
          return;
        }
        throw new Error(data.error || 'Error al procesar el ingreso.');
      }

      setUltimoTicket(data.ticket);
      setPatente('');
      setTelefono('');
      setEmail('');
      setDriverName('');
      setDamageNotes('');
      setSlotSeleccionado('');
      setShowAntiPassbackModal(false);
      setShowAdvancedOptions(false);
      onCheckinSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCheckin(false);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Cabecera Despejada */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#80093A]" />
            Registro de Ingreso Rápido
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Serrano 447 • Emisión de Ticket Dual (QR + Code 128)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsForeignPlate(!isForeignPlate)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
            isForeignPlate
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isForeignPlate ? 'Patente Extranjera' : 'Chilena'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/50 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <h4 className="font-bold">Advertencia de Validación</h4>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Ticket Emitido Exitosamente */}
      {ultimoTicket && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block text-sm">
                Ticket {ultimoTicket.id_ticket} Emitido
              </span>
              <span className="font-mono text-slate-300">
                Placa: <strong className="text-white">{ultimoTicket.patente}</strong> • Bahía: {ultimoTicket.slot_numero ? `Slot ${ultimoTicket.slot_numero}` : 'Asignada'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setUltimoTicket(null)}
            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 rounded-xl font-bold flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Reimprimir</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. INPUT GIGANTE DE PATENTE CON AUTOFOCO */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold uppercase tracking-wider text-slate-300">
              Placa Patente del Vehículo <span className="text-[#ff86a5]">*</span>
            </label>
            <span className="font-mono text-[11px] text-slate-400">
              {isForeignPlate ? 'Formato Libre Internacional' : 'Formato: ABCD-12 o AB-1234'}
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              required
              autoFocus
              maxLength={isForeignPlate ? 12 : 8}
              placeholder={isForeignPlate ? 'EJ: PB-9821-PE' : 'KD-JL-84'}
              value={patente}
              onChange={(e) => handlePatenteChange(e.target.value)}
              className="w-full text-center text-3xl sm:text-4xl font-mono font-black tracking-widest py-4 px-4 bg-black/60 border-2 border-white/20 rounded-2xl focus:outline-none focus:border-[#ff86a5] focus:ring-4 focus:ring-[#80093A]/30 text-white uppercase shadow-inner transition"
            />
          </div>
        </div>

        {/* 2. SELECTOR VISUAL DE CATEGORÍA VEHICULAR (BOTONES GRANDES TÁCTILES 56px) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Categoría Tarifaria
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTipo('auto')}
              className={`h-20 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                tipo === 'auto'
                  ? 'bg-gradient-to-b from-[#80093A] to-[#A52C55] border-[#ff86a5] text-white shadow-lg shadow-[#80093A]/30 scale-[1.02]'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Car className="w-6 h-6" />
              <span className="text-xs font-bold">Automóvil</span>
              <span className="text-[11px] font-mono font-semibold opacity-90">$25/min</span>
            </button>

            <button
              type="button"
              onClick={() => setTipo('camioneta')}
              className={`h-20 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                tipo === 'camioneta'
                  ? 'bg-gradient-to-b from-[#80093A] to-[#A52C55] border-[#ff86a5] text-white shadow-lg shadow-[#80093A]/30 scale-[1.02]'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Truck className="w-6 h-6 text-amber-300" />
              <span className="text-xs font-bold">Camioneta / SUV</span>
              <span className="text-[11px] font-mono font-semibold opacity-90">$30/min</span>
            </button>

            <button
              type="button"
              onClick={() => setTipo('moto')}
              className={`h-20 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                tipo === 'moto'
                  ? 'bg-gradient-to-b from-[#80093A] to-[#A52C55] border-[#ff86a5] text-white shadow-lg shadow-[#80093A]/30 scale-[1.02]'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Bike className="w-6 h-6 text-emerald-300" />
              <span className="text-xs font-bold">Motocicleta</span>
              <span className="text-[11px] font-mono font-semibold opacity-90">$15/min</span>
            </button>
          </div>
        </div>

        {/* 3. MENÚ COLAPSABLE DESPLEGABLE: DATOS ADICIONALES (SIN SATURAR LA VISTA) */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/20">
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white hover:bg-white/[0.03] transition"
          >
            <span className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-sky-400" />
              <span>Opciones Avanzadas & Inspección de Carrocería (Opcional)</span>
            </span>
            {showAdvancedOptions ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showAdvancedOptions && (
            <div className="p-4 pt-2 border-t border-white/[0.06] space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Conductor / Teléfono WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+56 9 8421 9904"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Bahía / Slot Específico
                  </label>
                  <select
                    value={slotSeleccionado}
                    onChange={(e) => setSlotSeleccionado(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F1A] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                  >
                    <option value="">Asignar libre automáticamente</option>
                    {availableSlots.map((id) => (
                      <option key={id} value={id}>
                        Slot {id.toString().padStart(2, '0')} (Sector {id <= 15 ? 'A' : 'B'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Observación de Daños Previos (Glosa Legal Ticket)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Rayón leve en parachoques del. der. / Sin daños visibles"
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. BOTÓN GIGANTE DE REGISTRO & IMPRESIÓN (56px) */}
        <button
          type="submit"
          disabled={loading || !patente}
          className="w-full h-14 py-3.5 bg-gradient-to-r from-[#80093A] via-[#A52C55] to-[#80093A] hover:opacity-95 text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(128,9,58,0.5)] border border-white/20 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            'Validando Anti-Passback...'
          ) : (
            <>
              <span>EMITIR TICKET DUAL & ABRIR BARRERA [ENTER]</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Modal Anti-Passback */}
      {showAntiPassbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-[#111726] rounded-3xl border border-white/10 max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-7 h-7" />
              <h3 className="text-base font-bold">Alerta de Anti-Passback</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {antiPassbackMessage}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAntiPassbackModal(false)}
                className="flex-1 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancelar [ESC]
              </button>
              <button
                type="button"
                onClick={() => executeCheckin(true)}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Forzar Ingreso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
