'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  Car,
  CheckCircle2,
  Plus,
  X,
  Grid,
  Search,
  Phone,
  Mail,
  UserCheck,
  Clock
} from 'lucide-react';

interface Convenio {
  id: string;
  cliente: string;
  rut: string;
  patente: string;
  tipo: 'CONVENIO_EMPRESA' | 'PERNOCTA_MENSUAL';
  slotAsignado?: string;
  montoMensual: number;
  estadoPago: 'AL_DIA' | 'PENDIENTE' | 'VENCIDO';
  vigenciaHasta: string;
  telefono: string;
}

const INITIAL_CONVENIOS: Convenio[] = [
  {
    id: 'CNV-01',
    cliente: 'Estudio Jurídico Serrano Ltda.',
    rut: '76.890.123-4',
    patente: 'JKLP34',
    tipo: 'CONVENIO_EMPRESA',
    slotAsignado: 'A-02',
    montoMensual: 75000,
    estadoPago: 'AL_DIA',
    vigenciaHasta: '2026-10-31',
    telefono: '+56 9 8123 4567',
  },
  {
    id: 'CNV-02',
    cliente: 'Consulado General de Italia',
    rut: '69.001.002-3',
    patente: 'CDAB89',
    tipo: 'CONVENIO_EMPRESA',
    slotAsignado: 'B-18',
    montoMensual: 75000,
    estadoPago: 'AL_DIA',
    vigenciaHasta: '2026-11-15',
    telefono: '+56 9 7654 3210',
  },
  {
    id: 'CNV-03',
    cliente: 'Transportes Marítimos del Norte',
    rut: '77.445.678-9',
    patente: 'FGHI12',
    tipo: 'PERNOCTA_MENSUAL',
    slotAsignado: 'B-25',
    montoMensual: 60000,
    estadoPago: 'PENDIENTE',
    vigenciaHasta: '2026-09-30',
    telefono: '+56 9 9988 7766',
  },
];

export default function ConveniosPage() {
  const [convenios, setConvenios] = useState<Convenio[]>(INITIAL_CONVENIOS);
  const [busqueda, setBusqueda] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCliente, setNewCliente] = useState('');
  const [newRut, setNewRut] = useState('');
  const [newPatente, setNewPatente] = useState('');
  const [newTipo, setNewTipo] = useState<'CONVENIO_EMPRESA' | 'PERNOCTA_MENSUAL'>('CONVENIO_EMPRESA');
  const [newSlot, setNewSlot] = useState('A-05');
  const [newMonto, setNewMonto] = useState(75000);
  const [newTelefono, setNewTelefono] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateConvenio = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Convenio = {
      id: `CNV-0${convenios.length + 1}`,
      cliente: newCliente,
      rut: newRut,
      patente: newPatente.toUpperCase(),
      tipo: newTipo,
      slotAsignado: newSlot,
      montoMensual: Number(newMonto),
      estadoPago: 'AL_DIA',
      vigenciaHasta: '2026-10-31',
      telefono: newTelefono,
    };

    setConvenios([...convenios, newEntry]);
    setSuccessMsg(`Convenio para ${newCliente} (${newPatente.toUpperCase()}) registrado exitosamente.`);
    setShowAddModal(false);
    setNewCliente('');
    setNewRut('');
    setNewPatente('');
    setNewTelefono('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const filtered = convenios.filter(
    (c) =>
      c.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.patente.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.rut.includes(busqueda)
  );

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex flex-col font-sans selection:bg-[#80093A] selection:text-white">
      {/* Header macOS Metalizado */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#090D17]/85 border-b border-white/[0.08] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/hub"
              title="Volver al Launchpad"
              className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                CONVENIOS CORPORATIVOS & ABONADOS
              </span>
              <p className="text-[11px] text-slate-400 font-mono">
                Cordano Inversiones Inmobiliarias Ltda. • Serrano 447, Iquique
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#80093A] to-[#A52C55] hover:opacity-95 text-white font-bold transition flex items-center gap-2 border border-white/20 shadow-lg shadow-[#80093A]/40 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Convenio</span>
            </button>
            <Link
              href="/hub"
              className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition"
              title="Launchpad"
            >
              <Grid className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {successMsg && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Buscador y Resumen */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-white/10 shadow-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por cliente, patente o RUT..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#80093A]"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Total Mensual Facturado:</span>
              <span className="text-emerald-400 font-bold text-sm">$210.000 CLP</span>
            </div>
            <div className="border-l border-white/10 pl-4">
              <span className="text-slate-400 block text-[10px]">Abonados Activos:</span>
              <span className="text-white font-bold text-sm">{convenios.length} contratos</span>
            </div>
          </div>
        </div>

        {/* Tabla de Convenios */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-white/10 shadow-2xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/[0.06] text-[11px] uppercase">
                  <th className="py-3 px-4">Contrato</th>
                  <th className="py-3 px-4">Cliente / Razón Social</th>
                  <th className="py-3 px-4">RUT</th>
                  <th className="py-3 px-4">Patente</th>
                  <th className="py-3 px-4">Plaza Asignada</th>
                  <th className="py-3 px-4">Monto Mes</th>
                  <th className="py-3 px-4">Estado Pago</th>
                  <th className="py-3 px-4">Vigencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-bold text-white">{c.id}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                      <div>{c.cliente}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.telefono}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{c.rut}</td>
                    <td className="py-3 px-4 font-bold text-sky-400">{c.patente}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 font-bold text-white">
                        {c.slotAsignado || 'Rotativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      ${c.montoMensual.toLocaleString('es-CL')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          c.estadoPago === 'AL_DIA'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {c.estadoPago === 'AL_DIA' ? 'Al Día' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{c.vigenciaHasta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Nuevo Convenio */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#111726] rounded-3xl border border-white/10 max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Registrar Nuevo Convenio Corporativo
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateConvenio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Cliente o Razón Social
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Notaría Serrano Ltda."
                  value={newCliente}
                  onChange={(e) => setNewCliente(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">RUT Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="76.123.456-7"
                    value={newRut}
                    onChange={(e) => setNewRut(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Patente Vehículo</label>
                  <input
                    type="text"
                    required
                    placeholder="ABCD-12"
                    value={newPatente}
                    onChange={(e) => setNewPatente(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono font-bold text-center text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Plaza Asignada</label>
                  <input
                    type="text"
                    placeholder="A-05"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Monto Mensual (CLP)</label>
                  <input
                    type="number"
                    step={5000}
                    required
                    value={newMonto}
                    onChange={(e) => setNewMonto(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Teléfono WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+56 9 8765 4321"
                  value={newTelefono}
                  onChange={(e) => setNewTelefono(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-white/[0.05] text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  Registrar Convenio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
