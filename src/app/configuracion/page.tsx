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
    <div className="min-h-screen bg-[#06080E] text-white flex flex-col font-sans selection:bg-[#80093A] selection:text-white relative overflow-hidden">
      
      {/* Background Texture from Magnific AI */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: "url('/hub-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080E]/60 to-[#06080E] pointer-events-none" />

      {/* Encabezado macOS Glass */}
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
                MÓDULO DE CONFIGURACIÓN ERP
              </span>
              <p className="text-[11px] text-slate-400 font-mono">Cordano Inversiones • Motor de Reglas V4.0</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="macos-btn-primary px-5 py-2.5 rounded-2xl text-white font-bold text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </header>

      {savedSuccess && (
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-4">
          <div className="p-4 glass-panel border-emerald-500/40 bg-emerald-950/20 rounded-2xl text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Configuración guardada y auditada con éxito. Nueva versión de reglas activada en Cloud Run.</span>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {/* Navegación por Pestañas Modulares */}
        <div className="flex glass-panel p-1.5 rounded-2xl text-xs font-semibold max-w-xl">
          <button
            onClick={() => setTab('tarifas')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              tab === 'tarifas' ? 'bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>1. Tarifas & Gracia</span>
          </button>
          <button
            onClick={() => setTab('empresa')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              tab === 'empresa' ? 'bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>2. Empresa & Ticket</span>
          </button>
          <button
            onClick={() => setTab('usuarios')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              tab === 'usuarios' ? 'bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3. Usuarios & PIN</span>
          </button>
          <button
            onClick={() => setTab('caja')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              tab === 'caja' ? 'bg-gradient-to-r from-[#80093A] to-[#A52C55] text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Parámetros Caja</span>
          </button>
        </div>

        {/* PESTAÑA 1: TARIFAS & GRACIA */}
        {tab === 'tarifas' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white">Motor de Tarifas Dinámicas & Gracia</h2>
              <p className="text-xs text-slate-400">
                Regla Canónica: Los cambios de tarifas aplican a nuevos ingresos; los autos ya estacionados adentro conservan su tarifa congelada.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Automóviles (CLP / Minuto)
                </label>
                <input
                  type="number"
                  value={tarifaAuto}
                  onChange={(e) => setTarifaAuto(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl glass-panel text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">Estándar: $35/min ($2.100/hora)</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Motocicletas (CLP / Minuto)
                </label>
                <input
                  type="number"
                  value={tarifaMoto}
                  onChange={(e) => setTarifaMoto(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl glass-panel text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">Estándar: $25/min ($1.500/hora)</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Camionetas / SUV (CLP / Minuto)
                </label>
                <input
                  type="number"
                  value={tarifaCamioneta}
                  onChange={(e) => setTarifaCamioneta(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl glass-panel text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">Estándar: $45/min ($2.700/hora)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div>
                <label className="block text-xs font-bold uppercase text-[#ff80a0] mb-1.5">
                  Tiempo de Gracia Inicial (Minutos Libres)
                </label>
                <input
                  type="number"
                  value={minutosGracia}
                  onChange={(e) => setMinutosGracia(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl glass-panel border-[#80093A]/50 text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Regla acordada: Si sale antes de {minutosGracia} min paga $0; al minuto {minutosGracia + 1} se cobra completo desde el minuto 0.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Multa por Ticket Extraviado ($ CLP)
                </label>
                <input
                  type="number"
                  value={multaExtravio}
                  onChange={(e) => setMultaExtravio(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl glass-panel text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">Fija: $10.000 CLP sumados al tiempo de estadía real.</span>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: DATOS DE LA EMPRESA & WHATSAPP */}
        {tab === 'empresa' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white">Datos Institucionales & Ticket Térmico</h2>
              <p className="text-xs text-slate-400">
                Información impresa en la cabecera del rollo de 80mm y en los comprobantes digitales enviados al cliente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Razón Social de la Empresa
                </label>
                <input
                  type="text"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl glass-panel text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  RUT Tributario
                </label>
                <input
                  type="text"
                  value={rutEmpresa}
                  onChange={(e) => setRutEmpresa(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl glass-panel text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Dirección del Recinto
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl glass-panel text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#ff80a0] mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp de Atención Garita (Impreso en Ticket)
                </label>
                <input
                  type="text"
                  value={telefonoWhatsappTicket}
                  onChange={(e) => setTelefonoWhatsappTicket(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl glass-panel border-[#80093A]/50 text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Aparece al pie del ticket físico para consultas directas del conductor.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: USUARIOS & PIN INDIVIDUAL */}
        {tab === 'usuarios' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold text-white">Control de Acceso & PIN Individual</h2>
                <p className="text-xs text-slate-400">
                  Cada acción crítica queda firmada por el PIN de 4 dígitos del usuario responsable.
                </p>
              </div>
              <Link
                href="/registro"
                className="macos-btn px-4 py-2 rounded-xl text-white text-xs font-bold"
              >
                + Alta de Operador
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-black/30 text-slate-400 font-bold uppercase border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">ID / Nombre</th>
                    <th className="py-3 px-4">Correo</th>
                    <th className="py-3 px-4">Rol</th>
                    <th className="py-3 px-4 text-center">PIN Asignado</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{u.nombre}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{u.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            u.rol === 'ADMINISTRADOR'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {u.rol}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-cyan-400 tracking-widest">
                        ••••
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
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
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white">Políticas Financieras & Cierre Ciego</h2>
              <p className="text-xs text-slate-400">
                Reglas de control de efectivo, fondo de cambio y alertas automáticas de descuadres.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Fondo Inicial Sugerido para Apertura ($ CLP)
                </label>
                <input
                  type="number"
                  value={fondoSugerido}
                  onChange={(e) => setFondoSugerido(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl glass-panel text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Monto predeterminado sugerido en la pantalla de inicio de turno.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#ff80a0] mb-1.5">
                  Umbral de Descuadre Crítico (% Sobre Recaudación)
                </label>
                <input
                  type="number"
                  value={umbralDescuadrePorc}
                  onChange={(e) => setUmbralDescuadrePorc(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl glass-panel border-[#80093A]/50 text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#80093A] tabular-nums"
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">
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
