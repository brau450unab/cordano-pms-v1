'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, KeyRound, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export default function RegistroOperadorPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('OPERADOR_VENDEDOR');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] flex flex-col justify-center items-center p-4 font-sans selection:bg-[#80093A] selection:text-white">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E2E4] shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl border border-slate-800 bg-black flex items-center justify-center shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cordano-logo.png" alt="Cordano Logo" className="w-full h-full object-contain p-1" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">Alta de Personal Operativo</h1>
          <p className="text-xs text-slate-500">
            Registro y asignación de credenciales para la sede Serrano 447, Iquique.
          </p>
        </div>

        {success ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-950">Operador Registrado Exitosamente</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              El usuario <strong>{nombre}</strong> ha sido habilitado con rol <strong>{rol}</strong> y PIN personal para operaciones de caja y arqueo.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-black transition"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nombre Completo del Trabajador
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Morales Soto"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Correo Institucional / Contacto
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="carlos.morales@cordano.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Teléfono Móvil
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+569 8765 4321"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#80093A] mb-1 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" />
                  PIN (4 Dígitos) *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full py-2 px-3 rounded-xl border border-rose-300 bg-rose-50/40 text-center font-mono font-bold text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Rol Asignado
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
              >
                <option value="OPERADOR_VENDEDOR">Operador de Garita (Vendedor / Cajero)</option>
                <option value="SUPERVISOR">Supervisor de Turno (Autorizaciones)</option>
                <option value="ADMINISTRADOR">Administrador (Control Total)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2 font-mono">
              <MapPin className="w-4 h-4 text-[#80093A] shrink-0" />
              <span>Sede Asignada: Serrano 447, Iquique (Sede 01)</span>
            </div>

            <button
              type="submit"
              disabled={loading || pin.length !== 4}
              className="w-full py-3.5 rounded-full font-bold text-xs text-white bg-[#80093A] hover:bg-[#A52C55] shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Registrando en Base de Datos...' : 'CREAR Y HABILITAR OPERADOR'}
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-400">
          <Link href="/login" className="hover:text-[#80093A] transition">
            &larr; Volver al Inicio de Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
