'use client';

import React, { useState } from 'react';
import { MacOSNavigationShell } from '@/components/MacOSNavigationShell';
import {
  Users,
  ShieldCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  Eye,
  X,
  Plus
} from 'lucide-react';

interface StaffUser {
  id: string;
  nombre: string;
  rol: 'OPERADOR_GARITA' | 'SUPERVISOR' | 'ADMINISTRADOR';
  pinMasked: string;
  accesoCajaCiega: boolean;
  permisos: string;
  estado: 'ACTIVO' | 'EN_TURNO';
}

const INITIAL_USERS: StaffUser[] = [
  {
    id: 'OP-01',
    nombre: 'Ana R. (Garita Mañana)',
    rol: 'OPERADOR_GARITA',
    pinMasked: '•••• (4821)',
    accesoCajaCiega: true,
    permisos: 'Check-in, Cobro, Arqueo Ciego, Descuento menor con PIN + Justificación >10 car.',
    estado: 'EN_TURNO',
  },
  {
    id: 'OP-02',
    nombre: 'Carlos M. (Garita Tarde)',
    rol: 'OPERADOR_GARITA',
    pinMasked: '•••• (7390)',
    accesoCajaCiega: true,
    permisos: 'Check-in, Cobro, Arqueo Ciego, Descuento menor con PIN + Justificación >10 car.',
    estado: 'ACTIVO',
  },
  {
    id: 'SUP-01',
    nombre: 'Roberto V. (Supervisor Recinto)',
    rol: 'SUPERVISOR',
    pinMasked: '•••• (9104)',
    accesoCajaCiega: true,
    permisos: 'Visado de Ticket Perdido ($8.000), Anulaciones, Apertura de Sobrecupo SC-01..05',
    estado: 'ACTIVO',
  },
  {
    id: 'ADM-01',
    nombre: 'Gerencia Cordano Inversiones',
    rol: 'ADMINISTRADOR',
    pinMasked: '•••• (0001)',
    accesoCajaCiega: false,
    permisos: 'Auditoría Reporte Z SHA-256, Motor de Tarifas, RBAC (Bloqueado para abrir caja)',
    estado: 'ACTIVO',
  },
];

export default function UsuariosPage() {
  const [users] = useState<StaffUser[]>(INITIAL_USERS);
  const [showMockup, setShowMockup] = useState(false);

  return (
    <MacOSNavigationShell
      title="Usuarios, Roles RBAC & PINs Antifraude"
      subtitle="Sección 13.2 del Catálogo · Segregación de Roles e Incompatibilidad de Caja para Administradores"
      roleLabel="Seguridad RBAC"
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Aviso Regla 7 AGENTS.md */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
          <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block">
              Regla 7 (Incompatibilidad de Caja para Administradores):
            </strong>
            El rol de <strong>Administrador</strong> audita cierres de caja ciega, firma autorizaciones por ticket extraviado (en Rojo) y configura tarifas, pero tiene <strong>bloqueada la apertura directa de turnos de caja</strong> para garantizar trazabilidad antifraude.
          </div>
        </div>

        {/* Tabla de Usuarios y PINs (Mockup #5) */}
        <div className="bg-white rounded-3xl border border-[#E2E2E4] overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F9F9FB] border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Funcionario</th>
                <th className="py-3.5 px-4">Rol RBAC</th>
                <th className="py-3.5 px-4">PIN Individual</th>
                <th className="py-3.5 px-4">Apertura de Caja Ciega</th>
                <th className="py-3.5 px-4">Alcance y Atribuciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-mono font-bold text-slate-500">
                    {u.id}
                  </td>
                  <td className="py-4 px-4 font-extrabold text-slate-900">
                    {u.nombre}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-extrabold ${
                        u.rol === 'ADMINISTRADOR'
                          ? 'bg-[#80093A]/10 text-[#80093A] border border-[#80093A]/30'
                          : u.rol === 'SUPERVISOR'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-700 tabular-nums">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200">
                      <KeyRound className="w-3 h-3 text-[#80093A]" />
                      {u.pinMasked}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {u.accesoCajaCiega ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Habilitado (Caja Ciega)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Incompatibilidad de Caja</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-600">{u.permisos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                Lámina Oficial Mockup #5 · Usuarios RBAC, Convenios y Cámaras LPR
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
                alt="Mockup Oficial Usuarios"
                className="w-full h-auto object-contain max-h-[75vh]"
              />
            </div>
          </div>
        </div>
      )}
    </MacOSNavigationShell>
  );
}
