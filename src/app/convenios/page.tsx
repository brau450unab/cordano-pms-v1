'use client';

import React, { useState } from 'react';
import { MacOSNavigationShell } from '@/components/MacOSNavigationShell';
import {
  Moon,
  Building2,
  Plus,
  Search,
  ShieldCheck,
  CheckCircle2,
  X,
  Eye,
  Lock
} from 'lucide-react';

interface ParallelServiceRecord {
  id: string;
  patente: string;
  titular: string;
  empresa: string;
  modalidad: 'CONVENIO_MENSUAL' | 'PERNOCTA_NOCHE';
  plazaBloqueada: string;
  tarifaFija: number;
  vigencia: string;
  estado: 'ACTIVO' | 'POR_VENCER';
}

const INITIAL_CONVENIOS: ParallelServiceRecord[] = [
  {
    id: 'CNV-2026-01',
    patente: 'JK-LP-34',
    titular: 'Rodrigo Poblete',
    empresa: 'Notaría Serrano 447',
    modalidad: 'CONVENIO_MENSUAL',
    plazaBloqueada: 'A-03 (VIP)',
    tarifaFija: 85000,
    vigencia: '01/04/2026 – 30/04/2026',
    estado: 'ACTIVO',
  },
  {
    id: 'CNV-2026-02',
    patente: 'CD-AB-89',
    titular: 'Consulado de Italia',
    empresa: 'Cuerpo Consular Iquique',
    modalidad: 'CONVENIO_MENSUAL',
    plazaBloqueada: 'B-18 (VIP)',
    tarifaFija: 90000,
    vigencia: '01/04/2026 – 30/04/2026',
    estado: 'ACTIVO',
  },
  {
    id: 'PRN-2026-03',
    patente: 'WX-YZ-19',
    titular: 'Transportes Tarapacá',
    empresa: 'Hotel Gavina Express (Pernocta)',
    modalidad: 'PERNOCTA_NOCHE',
    plazaBloqueada: 'B-22 (Reservada)',
    tarifaFija: 5000,
    vigencia: '21:00 PM – 08:00 AM',
    estado: 'ACTIVO',
  },
  {
    id: 'PRN-2026-04',
    patente: 'MN-PQ-77',
    titular: 'Fabián Morales',
    empresa: 'Pernocta Particular Nocturna',
    modalidad: 'PERNOCTA_NOCHE',
    plazaBloqueada: 'A-14 (Reservada)',
    tarifaFija: 5000,
    vigencia: '22:00 PM – 08:00 AM',
    estado: 'POR_VENCER',
  },
];

export default function ConveniosPage() {
  const [records, setRecords] = useState<ParallelServiceRecord[]>(INITIAL_CONVENIOS);
  const [filterMode, setFilterMode] = useState<'ALL' | 'CONVENIO_MENSUAL' | 'PERNOCTA_NOCHE'>('ALL');
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showMockup, setShowMockup] = useState(false);

  // Formulario Pop-up de Nuevo Convenio / Pernocta en Paralelo
  const [newPatente, setNewPatente] = useState('');
  const [newTitular, setNewTitular] = useState('');
  const [newEmpresa, setNewEmpresa] = useState('');
  const [newModalidad, setNewModalidad] = useState<'CONVENIO_MENSUAL' | 'PERNOCTA_NOCHE'>('PERNOCTA_NOCHE');
  const [newPlaza, setNewPlaza] = useState('A-09');

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatente.trim() || !newTitular.trim()) return;

    const item: ParallelServiceRecord = {
      id: `${newModalidad === 'CONVENIO_MENSUAL' ? 'CNV' : 'PRN'}-2026-0${records.length + 1}`,
      patente: newPatente.toUpperCase(),
      titular: newTitular,
      empresa: newEmpresa || 'Particular Serrano 447',
      modalidad: newModalidad,
      plazaBloqueada: `${newPlaza} (${newModalidad === 'CONVENIO_MENSUAL' ? 'VIP' : 'Reservada'})`,
      tarifaFija: newModalidad === 'CONVENIO_MENSUAL' ? 85000 : 5000,
      vigencia:
        newModalidad === 'CONVENIO_MENSUAL'
          ? 'Mensual Vigente'
          : '21:00 PM – 08:00 AM',
      estado: 'ACTIVO',
    };

    setRecords([item, ...records]);
    setNewPatente('');
    setNewTitular('');
    setNewEmpresa('');
    setShowNewModal(false);
  };

  const filtered = records.filter((r) => {
    const matchesMode = filterMode === 'ALL' || r.modalidad === filterMode;
    const matchesSearch =
      r.patente.toLowerCase().includes(search.toLowerCase()) ||
      r.titular.toLowerCase().includes(search.toLowerCase()) ||
      r.empresa.toLowerCase().includes(search.toLowerCase());
    return matchesMode && matchesSearch;
  });

  return (
    <MacOSNavigationShell
      title="Convenios y Noche (Servicios en Paralelo)"
      subtitle="Regla 7 AGENTS.md · Bloquea plaza en matriz sin alterar contabilidad rotativa por minuto"
      roleLabel="Gestión Comercial"
      rightActions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMockup(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#80093A]" />
            <span>Mockup #5</span>
          </button>
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#80093A] hover:bg-[#68072f] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Convenio / Pernocta</span>
          </button>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner explicativo Regla 7 AGENTS.md */}
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-3 text-xs text-blue-950">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-blue-950">
              Aislamiento Contable de Servicios en Paralelo (Regla 7):
            </strong>
            Los vehículos registrados en este submódulo bloquean su plaza asignada en la matriz de Serrano 447 (en color <strong>Azul #3B82F6</strong> para Abonados/VIP o <strong>Ámbar #F59E0B</strong> para Pernocta Reservada), pero <strong>no ingresan a la lista de transitorios ni alteran el arqueo rotativo por minuto del día</strong>.
          </div>
        </div>

        {/* Resumen superior */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E2E4] shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Abonados Mensuales Activos
            </span>
            <div className="text-2xl font-mono font-black text-blue-600 tabular-nums mt-1">
              {records.filter((r) => r.modalidad === 'CONVENIO_MENSUAL').length} Plazas VIP
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Facturación mensual recurrente
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E2E4] shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Vehículos en Pernocta Nocturna
            </span>
            <div className="text-2xl font-mono font-black text-amber-600 tabular-nums mt-1">
              {records.filter((r) => r.modalidad === 'PERNOCTA_NOCHE').length} Plazas Reservadas
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Tarifa plana $5.000 CLP (21:00 a 08:00)
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E2E4] shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Recaudación Paralela Mensual
            </span>
            <div className="text-2xl font-mono font-black text-[#80093A] tabular-nums mt-1">
              $185.000 <span className="text-xs text-slate-400">CLP</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              ● Separado de Caja Ciega Rotativa
            </span>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-white rounded-2xl border border-[#E2E2E4] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex bg-[#F3F4F6] p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Todos ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('CONVENIO_MENSUAL')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === 'CONVENIO_MENSUAL'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Convenios Mensuales
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('PERNOCTA_NOCHE')}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === 'PERNOCTA_NOCHE'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Pernocta Noche ($5.000)
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar patente, titular o empresa..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#F9F9FB] border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#80093A]"
            />
          </div>
        </div>

        {/* Tabla Limpia de Convenios y Noche (Mockup #5) */}
        <div className="bg-white rounded-2xl border border-[#E2E2E4] overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F9F9FB] border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Folio</th>
                <th className="py-3.5 px-4">Patente</th>
                <th className="py-3.5 px-4">Titular / Empresa</th>
                <th className="py-3.5 px-4">Modalidad Paralela</th>
                <th className="py-3.5 px-4">Plaza Bloqueada</th>
                <th className="py-3.5 px-4">Vigencia / Horario</th>
                <th className="py-3.5 px-4 text-right">Tarifa Fija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-sm text-slate-900 tabular-nums">
                    {item.patente}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{item.titular}</span>
                    <span className="text-[11px] text-slate-500">{item.empresa}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {item.modalidad === 'CONVENIO_MENSUAL' ? (
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px] inline-flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>Abonado Mensual</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px] inline-flex items-center gap-1">
                        <Moon className="w-3 h-3" />
                        <span>Pernocta Nocturna</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {item.plazaBloqueada}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{item.vigencia}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-[#80093A] tabular-nums">
                    ${item.tarifaFija.toLocaleString('es-CL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop-up Flotante macOS: Registrar Nuevo Convenio o Pernocta */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                Registrar Servicio en Paralelo (Convenio / Noche)
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Modalidad de Servicio Paralelo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewModalidad('PERNOCTA_NOCHE')}
                    className={`py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      newModalidad === 'PERNOCTA_NOCHE'
                        ? 'bg-[#80093A] text-white border-[#80093A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Pernocta Noche ($5.000)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewModalidad('CONVENIO_MENSUAL')}
                    className={`py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      newModalidad === 'CONVENIO_MENSUAL'
                        ? 'bg-[#80093A] text-white border-[#80093A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Convenio Mensual ($85.000)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patente Vehículo
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatente}
                    onChange={(e) => setNewPatente(e.target.value.toUpperCase())}
                    placeholder="ABCD-12"
                    className="w-full h-10 px-3 rounded-xl bg-[#F9F9FB] border border-slate-300 font-mono font-bold text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Plaza a Bloquear
                  </label>
                  <select
                    value={newPlaza}
                    onChange={(e) => setNewPlaza(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#F9F9FB] border border-slate-300 font-mono font-bold text-xs"
                  >
                    <option value="A-09">Plaza A-09 (Sector A)</option>
                    <option value="A-15">Plaza A-15 (Sector A)</option>
                    <option value="B-21">Plaza B-21 (Sector B)</option>
                    <option value="B-28">Plaza B-28 (Sector B)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Titular / Conductor
                </label>
                <input
                  type="text"
                  required
                  value={newTitular}
                  onChange={(e) => setNewTitular(e.target.value)}
                  placeholder="Ej: María José Gómez"
                  className="w-full h-10 px-3 rounded-xl bg-[#F9F9FB] border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Empresa / Institución Convenio
                </label>
                <input
                  type="text"
                  value={newEmpresa}
                  onChange={(e) => setNewEmpresa(e.target.value)}
                  placeholder="Ej: Estudio Jurídico Serrano 447"
                  className="w-full h-10 px-3 rounded-xl bg-[#F9F9FB] border border-slate-300 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#80093A] text-white text-xs font-extrabold cursor-pointer"
                >
                  Bloquear Plaza &amp; Guardar
                </button>
              </div>
            </form>
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
                Lámina Oficial Mockup #5 · Sidebar Colapsable, Convenios, Usuarios y CCTV
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
                alt="Mockup Oficial Convenios"
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </MacOSNavigationShell>
  );
}
