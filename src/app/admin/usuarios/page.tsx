'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  KeyRound,
  UserPlus,
  Lock,
  CheckCircle2,
  X,
  Grid,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';

interface ERPUser {
  id: string;
  nombre: string;
  email: string;
  rol: 'OPERADOR' | 'ADMIN' | 'SUPERVISOR';
  pin: string;
  estado: 'ACTIVO' | 'SUSPENDIDO';
  ultimoAcceso: string;
}

const INITIAL_USERS: ERPUser[] = [
  {
    id: 'USR-01',
    nombre: 'Carlos Morales',
    email: 'carlos.operador@cordano.cl',
    rol: 'OPERADOR',
    pin: '1234',
    estado: 'ACTIVO',
    ultimoAcceso: '2026-09-24 14:30',
  },
  {
    id: 'USR-02',
    nombre: 'Braulio Administrador',
    email: 'braulio.admin@cordano.cl',
    rol: 'ADMIN',
    pin: '9999',
    estado: 'ACTIVO',
    ultimoAcceso: '2026-09-24 16:15',
  },
  {
    id: 'USR-03',
    nombre: 'Javier Supervisor',
    email: 'javier.supervisor@cordano.cl',
    rol: 'SUPERVISOR',
    pin: '5555',
    estado: 'ACTIVO',
    ultimoAcceso: '2026-09-23 21:00',
  },
];

export default function UsuariosPage() {
  const [users, setUsers] = useState<ERPUser[]>(INITIAL_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNombre, setNewNombre] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRol, setNewRol] = useState<'OPERADOR' | 'ADMIN' | 'SUPERVISOR'>('OPERADOR');
  const [newPin, setNewPin] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      alert('El PIN debe tener 4 dígitos');
      return;
    }

    const newUser: ERPUser = {
      id: `USR-0${users.length + 1}`,
      nombre: newNombre,
      email: newEmail,
      rol: newRol,
      pin: newPin,
      estado: 'ACTIVO',
      ultimoAcceso: 'Pendiente primer login',
    };

    setUsers([...users, newUser]);
    setSuccessMsg(`Usuario ${newNombre} dado de alta con PIN ${newPin}.`);
    setShowAddModal(false);
    setNewNombre('');
    setNewEmail('');
    setNewPin('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

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
                GESTIÓN DE USUARIOS & PERMISOS ERP
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
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Usuario ERP</span>
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

        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0A0E18] border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                <span>Usuarios con Acceso a Garita y Sistema ERP</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Segregación de roles: Administradores auditan; Operadores abren y cierran turnos.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-white/[0.05] border border-white/10 rounded-xl text-slate-300">
              {users.length} Cuentas Activas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/[0.06] text-[11px] uppercase">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Correo</th>
                  <th className="py-3 px-4">Rol Asignado</th>
                  <th className="py-3 px-4">PIN Autorizador</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Último Acceso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-bold text-white">{u.id}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-200">{u.nombre}</td>
                    <td className="py-3 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          u.rol === 'ADMIN'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : u.rol === 'SUPERVISOR'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                        }`}
                      >
                        {u.rol}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#ffb1c2]">•••• (PIN activo)</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                        {u.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{u.ultimoAcceso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Nuevo Usuario */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#111726] rounded-3xl border border-white/10 max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                Alta de Usuario ERP
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcelo Rojas"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="marcelo@cordano.cl"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Rol ERP</label>
                  <select
                    value={newRol}
                    onChange={(e: any) => setNewRol(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F1A] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                  >
                    <option value="OPERADOR">Operador Garita</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">PIN (4 Dígitos)</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="••••"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono font-bold text-center text-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                  />
                </div>
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
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
