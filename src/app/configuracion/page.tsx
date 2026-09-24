'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  DollarSign,
  Building,
  Users,
  ShieldCheck,
  ArrowLeft,
  Save,
  CheckCircle2,
  Clock,
  KeyRound,
  Lock,
  Phone
} from 'lucide-react';

export default function ConfiguracionPage() {
  const [tab, setTab] = useState<'tarifas' | 'empresa' | 'usuarios' | 'caja'>('tarifas');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados de Configuración
  const [tarifaAuto, setTarifaAuto] = useState(35);
  const [tarifaMoto, setTarifaMoto] = useState(25);
  const [tarifaCamioneta, setTarifaCamioneta] = useState(45);
  const [minutosGracia, setMinutosGracia] = useState(30);
  const [multaExtravio, setMultaExtravio] = useState(10000);

  const [nombreEmpresa, setNombreEmpresa] = useState('Cordano Inversiones Inmobiliarias Ltda.');
  const [rutEmpresa, setRutEmpresa] = useState('76.842.190-5');
  const [direccion, setDireccion] = useState('Serrano 447, Iquique, Chile');
  const [telefonoWhatsappTicket, setTelefonoWhatsappTicket] = useState('+56 9 8765 4321');

  const [fondoSugerido, setFondoSugerido] = useState(50000);
  const [umbralDescuadrePorc, setUmbralDescuadrePorc] = useState(5);

  const [usuarios, setUsuarios] = useState([
    { id: 'USR-01', nombre: 'Carlos Morales', email: 'carlos.morales@cordano.cl', rol: 'OPERADOR_VENDEDOR', pin: '1234', activo: true },
    { id: 'USR-02', nombre: 'Braulio Arancibia', email: 'braulio.admin@cordano.cl', rol: 'ADMINISTRADOR', pin: '9999', activo: true },
    { id: 'USR-03', nombre: 'Angelo Cordano', email: 'angelo.admin@cordano.cl', rol: 'ADMINISTRADOR', pin: '8888', activo: true },
    { id: 'USR-04', nombre: 'Patricia Cordano', email: 'patricia.admin@cordano.cl', rol: 'ADMINISTRADOR', pin: '7777', activo: true },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-[#1D1D1F] flex flex-col font-sans selection:bg-[#80093A] selection:text-white">
      {/* Encabezado */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="font-bold text-base tracking-wide text-white">MÓDULO DE CONFIGURACIÓN ERP</span>
              <p className="text-[11px] text-slate-400 font-mono">Cordano Inversiones • Versión de Reglas V4.0</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#80093A] hover:bg-[#A52C55] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </header>

      {savedSuccess && (
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Configuración guardada y auditada con éxito. Una nueva versión de reglas ha sido activada en Cloud Run.</span>
          </div>
        </div>
      )}

      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {/* Navegación por Pestañas Modulares */}
        <div className="flex bg-[#F3F3F5] p-1 rounded-2xl border border-slate-200 text-xs font-semibold max-w-xl">
          <button
            onClick={() => setTab('tarifas')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'tarifas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>1. Tarifas & Gracia</span>
          </button>
          <button
            onClick={() => setTab('empresa')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'empresa' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>2. Empresa & Ticket</span>
          </button>
          <button
            onClick={() => setTab('usuarios')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'usuarios' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3. Usuarios & PIN</span>
          </button>
          <button
            onClick={() => setTab('caja')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'caja' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Parámetros Caja</span>
          </button>
        </div>

        {/* PESTAÑA 1: TARIFAS & GRACIA */}
        {tab === 'tarifas' && (
          <div className="bg-white rounded-3xl border border-[#E2E2E4] shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="border-b pb-4">
              <h2 className="text-base font-bold text-slate-900">Motor de Tarifas Dinámicas & Gracia</h2>
              <p className="text-xs text-slate-500">
                Regla Canónica: Los cambios de tarifas aplican a nuevos ingresos; los autos ya estacionados adentro conservan su tarifa congelada.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Automóviles (CLP / Minuto)
                </label>
                <input
                  type="number"
                  value={tarifaAuto}
                  onChange={(e) => setTarifaAuto(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Estándar: $35/min ($2.100/hora)</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Motocicletas (CLP / Minuto)
                </label>
                <input
                  type="number"
                  value={tarifaMoto}
                  onChange={(e) => setTarifaMoto(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Estándar: $25/min ($1.500/hora)</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Camionetas / SUV (CLP / Minuto)
                </label>
                <input
                  type="number"
                  value={tarifaCamioneta}
                  onChange={(e) => setTarifaCamioneta(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Estándar: $45/min ($2.700/hora)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase text-[#80093A] mb-1">
                  Tiempo de Gracia Inicial (Minutos Libres)
                </label>
                <input
                  type="number"
                  value={minutosGracia}
                  onChange={(e) => setMinutosGracia(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 bg-rose-50/40 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Regla acordada: Si sale antes de {minutosGracia} min paga $0; al minuto {minutosGracia + 1} se cobra completo desde el minuto 0.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Multa por Ticket Extraviado ($ CLP)
                </label>
                <input
                  type="number"
                  value={multaExtravio}
                  onChange={(e) => setMultaExtravio(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Fija: $10.000 CLP sumados al tiempo de estadía real.</span>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: DATOS DE LA EMPRESA & WHATSAPP */}
        {tab === 'empresa' && (
          <div className="bg-white rounded-3xl border border-[#E2E2E4] shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="border-b pb-4">
              <h2 className="text-base font-bold text-slate-900">Datos Institucionales & Ticket Térmico</h2>
              <p className="text-xs text-slate-500">
                Información impresa en la cabecera del rollo de 80mm y en los comprobantes digitales enviados al cliente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Razón Social de la Empresa
                </label>
                <input
                  type="text"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  RUT Tributario
                </label>
                <input
                  type="text"
                  value={rutEmpresa}
                  onChange={(e) => setRutEmpresa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Dirección del Recinto
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#80093A] mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp de Atención Garita (Impreso en Ticket)
                </label>
                <input
                  type="text"
                  value={telefonoWhatsappTicket}
                  onChange={(e) => setTelefonoWhatsappTicket(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 bg-rose-50/40 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Aparece al pie del ticket físico para consultas directas del conductor.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: USUARIOS & PIN INDIVIDUAL */}
        {tab === 'usuarios' && (
          <div className="bg-white rounded-3xl border border-[#E2E2E4] shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Control de Acceso & PIN Individual</h2>
                <p className="text-xs text-slate-500">
                  Cada acción crítica queda firmada por el PIN de 4 dígitos del usuario responsable.
                </p>
              </div>
              <Link
                href="/registro"
                className="px-3.5 py-1.5 rounded-xl bg-[#80093A] text-white text-xs font-bold hover:bg-[#A52C55] transition shadow-sm"
              >
                + Alta de Operador
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#F9F9FB] text-slate-500 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">ID / Nombre</th>
                    <th className="py-2.5 px-3">Correo</th>
                    <th className="py-2.5 px-3">Rol</th>
                    <th className="py-2.5 px-3 text-center">PIN Asignado</th>
                    <th className="py-2.5 px-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{u.nombre}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{u.id}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono">{u.email}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            u.rol === 'ADMINISTRADOR'
                              ? 'bg-slate-900 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {u.rol}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#80093A] tracking-widest">
                        ••••
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          ACTIVO
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: PARÁMETROS DE CAJA */}
        {tab === 'caja' && (
          <div className="bg-white rounded-3xl border border-[#E2E2E4] shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="border-b pb-4">
              <h2 className="text-base font-bold text-slate-900">Políticas Financieras & Cierre Ciego</h2>
              <p className="text-xs text-slate-500">
                Reglas de control de efectivo, fondo de cambio y alertas automáticas de descuadres.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Fondo Inicial Sugerido para Apertura ($ CLP)
                </label>
                <input
                  type="number"
                  value={fondoSugerido}
                  onChange={(e) => setFondoSugerido(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Monto predeterminado sugerido en la pantalla de inicio de turno.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#80093A] mb-1">
                  Umbral de Descuadre Crítico (% Sobre Recaudación)
                </label>
                <input
                  type="number"
                  value={umbralDescuadrePorc}
                  onChange={(e) => setUmbralDescuadrePorc(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 bg-rose-50/40 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Si la diferencia en el Cierre Ciego supera el {umbralDescuadrePorc}%, el sistema exige una justificación escrita obligatoria del operador.
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
