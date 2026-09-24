'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  Car,
  ChevronRight,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      if (email.includes('admin') || email.includes('cordano')) {
        setShowRoleSelector(true);
      } else {
        router.push('/hub');
      }
    }, 500);
  };

  const handleSelectRole = (role: 'operador' | 'admin') => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('parkops_active_role', role);
    }
    router.push('/hub');
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-white flex font-sans selection:bg-[#80093A] selection:text-white">
      
      {/* 1. LEFT PANEL: MAGNIFIC AI RENDER */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: "url('/login-panel.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#06080E]/40 to-[#06080E]" />
        
        {/* Minimal branding overlay */}
        <div className="absolute bottom-12 left-12 glass-panel p-6 rounded-3xl max-w-sm">
          <h2 className="text-2xl font-black text-white leading-tight">ParkOps Control</h2>
          <p className="text-sm text-slate-300 mt-2 font-medium">Acceso seguro a infraestructura de Serrano 447.</p>
        </div>
      </div>

      {/* 2. RIGHT PANEL: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 relative z-10">
        <div className="max-w-md w-full space-y-10">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tight">Bienvenido</h2>
            <p className="text-sm text-slate-400">Ingresa tus credenciales para acceder al ERP.</p>
          </div>

          {/* Quick Demo Logins */}
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => { setEmail('carlos.operador@cordano.cl'); setPassword('carlos1234'); }}
              className="macos-btn px-4 py-2 rounded-full text-xs font-bold text-slate-300"
            >
              Demo Operador
            </button>
            <button
              type="button"
              onClick={() => { setEmail('braulio.admin@cordano.cl'); setPassword('admin1234'); }}
              className="macos-btn px-4 py-2 rounded-full text-xs font-bold text-slate-300"
            >
              Demo Admin
            </button>
          </div>

          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-5 top-4" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@cordano.cl"
                    className="w-full pl-14 pr-6 py-4 rounded-3xl glass-panel text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#80093A] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-5 top-4" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full pl-14 pr-6 py-4 rounded-3xl glass-panel text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#80093A] transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-3xl font-bold text-sm text-white macos-btn-primary flex items-center justify-center gap-3"
            >
              {loading ? 'Validando...' : (
                <>
                  <span>INICIAR SESIÓN</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-6">
            <Link href="/landing" className="text-sm font-bold text-slate-400 hover:text-white transition">
              &larr; Volver
            </Link>
          </div>
        </div>
      </div>

      {/* 3. ROLE SELECTOR MODAL */}
      {showRoleSelector && (
        <div className="fixed inset-0 z-50 bg-[#06080E]/90 backdrop-blur-2xl flex items-center justify-center p-4 spring-anim">
          <div className="glass-panel rounded-[2rem] max-w-md w-full p-8 space-y-6 border border-white/20">
            <div className="text-center space-y-2 pb-4 border-b border-white/10">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Selecciona tu Rol</h3>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSelectRole('operador')}
                className="w-full p-5 rounded-3xl macos-btn flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-base text-white block group-hover:text-cyan-300 transition">Operador Garita</span>
                    <span className="text-xs text-slate-400">Control POS y barreras</span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className="w-full p-5 rounded-3xl macos-btn flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-base text-white block group-hover:text-emerald-300 transition">Administrador</span>
                    <span className="text-xs text-slate-400">Auditoría y finanzas</span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
