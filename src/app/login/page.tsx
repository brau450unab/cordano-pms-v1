'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  ArrowLeft,
  Eye,
  X
} from 'lucide-react';

type RoleOption = 'operador' | 'supervisor' | 'admin';

const OPERATORS_BY_ROLE: Record<RoleOption, { id: string; name: string; shift: string }[]> = {
  operador: [
    { id: 'OP-01', name: 'Ana R. — Operadora Turno Mañana', shift: 'Morning (08:00 - 16:00)' },
    { id: 'OP-02', name: 'Carlos M. — Operador Turno Tarde', shift: 'Evening (16:00 - 00:00)' },
  ],
  supervisor: [
    { id: 'SUP-01', name: 'Roberto V. — Supervisor de Recinto', shift: 'All Shifts' },
  ],
  admin: [
    { id: 'ADM-01', name: 'Gerencia — Cordano Inversiones Ltda.', shift: 'Auditoría ERP (Sin Caja)' },
  ],
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleOption>('operador');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('OP-01');
  const [pin, setPin] = useState('1234');
  const [initialCash, setInitialCash] = useState<number>(50000);
  const [showMockup, setShowMockup] = useState(false);

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role);
    setSelectedProfileId(OPERATORS_BY_ROLE[role][0].id);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('parkops_active_role', selectedRole);
    }
    if (selectedRole === 'operador') {
      router.push('/');
    } else {
      router.push('/hub');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-slate-900 flex flex-col font-sans">
      {/* Barra superior macOS Sonoma */}
      <header className="h-14 bg-white/95 backdrop-blur-md border-b border-[#E2E2E4] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>
          <div className="h-4 w-[1px] bg-slate-200" />
          <Link
            href="/landing"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Portal Interno</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setShowMockup(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#80093A]" />
          <span>Mockup #3</span>
        </button>
      </header>

      {/* Contenedor Central de Login Corporativo (Mockup #3 · Sección 3 del Catálogo) */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[460px] bg-white rounded-3xl border border-[#E2E2E4] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] p-7 sm:p-8 space-y-6">
          {/* Identidad Corporativa */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#80093A] text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
              C
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Acceso al Sistema — ParkOps PMS
            </h1>
            <p className="text-xs text-slate-500">
              Cordano Inversiones Inmobiliarias Ltda. • Serrano 447, Iquique
            </p>
          </div>

          {/* 1. Selector de Rol (Segmented Control estilo macOS) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Seleccione su Rol Operativo
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#F3F4F6] p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleRoleSelect('operador')}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  selectedRole === 'operador'
                    ? 'bg-[#80093A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Operador Garita
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('supervisor')}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  selectedRole === 'supervisor'
                    ? 'bg-[#80093A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Supervisor
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-[#80093A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Administrador
              </button>
            </div>
          </div>

          {/* Aviso Regla 7 AGENTS.md: Segregación de Roles e Incompatibilidad de Caja */}
          {selectedRole === 'admin' ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Incompatibilidad de Caja (Regla 7):</strong>
                El rol Administrador audita y configura, pero <strong>no abre turnos de caja</strong> directamente para salvaguardar la trazabilidad del arqueo ciego.
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Habilitado para Turno de Caja Ciega</span>
              </span>
              <span className="font-mono font-bold tabular-nums">
                Base: ${initialCash.toLocaleString('es-CL')}
              </span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Selector de Usuario / Operador */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Usuario / Operador Asignado
              </label>
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#F9F9FB] border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#80093A]"
              >
                {OPERATORS_BY_ROLE[selectedRole].map((op) => (
                  <option key={op.id} value={op.id}>
                    [{op.id}] {op.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Declaración de Fondo Inicial de Sencillo (Sólo Operador) */}
            {selectedRole === 'operador' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Fondo Inicial de Sencillo Declarado (CLP)
                </label>
                <input
                  type="number"
                  step={5000}
                  value={initialCash}
                  onChange={(e) => setInitialCash(Number(e.target.value || 0))}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F9F9FB] border border-slate-300 font-mono font-bold text-sm text-slate-900 tabular-nums focus:outline-none focus:border-[#80093A]"
                />
              </div>
            )}

            {/* PIN Personal de 4 dígitos */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Contraseña / PIN de Seguridad (4 dígitos)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 text-center font-mono font-black text-2xl tracking-[0.5em] rounded-xl bg-[#F9F9FB] border border-slate-300 text-slate-900 focus:outline-none focus:border-[#80093A] tabular-nums"
                />
              </div>
            </div>

            {/* Botón Principal Burdeos (#80093A) */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#80093A] hover:bg-[#68072f] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-[0.99]"
            >
              <span>
                {selectedRole === 'operador'
                  ? 'Iniciar Sesión y Abrir Turno en Garita POS'
                  : 'Ingresar al Menú Central Launchpad'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

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
                Lámina Oficial Mockup #3 · Landing Interno, Login por Roles y Manuales SOP
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
                src="/mockups/ui_landing_login_manuales_soporte.jpg"
                alt="Mockup Oficial Login"
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
