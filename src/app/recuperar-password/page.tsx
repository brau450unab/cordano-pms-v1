'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
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
          <h1 className="text-lg font-bold text-slate-900">Recuperación de Contraseña</h1>
          <p className="text-xs text-slate-500">
            Ingresa tu correo institucional asignado para recibir un enlace de restablecimiento seguro.
          </p>
        </div>

        {sent ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-950">Instrucciones Enviadas</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Hemos enviado un enlace temporal y código OTP a <strong>{email}</strong>. Por motivos de seguridad, el enlace expirará en 15 minutos.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 px-6 py-2 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-black transition"
            >
              Volver al Inicio de Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="usuario@cordano.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#80093A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-bold text-xs text-white bg-[#80093A] hover:bg-[#A52C55] shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Enviando Código...' : 'ENVIAR ENLACE DE RECUPERACIÓN'}
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-100 text-center">
          <Link
            href="/login"
            className="text-xs text-slate-500 hover:text-[#80093A] transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Regresar al Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
