'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FaqItem {
  pregunta: string;
  respuesta: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    pregunta: '¿Ubicación y horario de Serrano 447?',
    respuesta: 'Serrano 447, a 150m de Plaza Prat. Operamos 24/7 con CCTV.',
  },
  {
    pregunta: '¿Cómo funciona la política de 10 min de gracia?',
    respuesta: 'Si te retiras dentro de 10 minutos, la barrera abre con costo $0 automáticamente.',
  },
  {
    pregunta: '¿Medios de pago?',
    respuesta: 'Efectivo con cálculo de vuelto exacto, Débito, Crédito y Transferencias.',
  },
];

const GALLERY_IMAGES = [
  {
    title: 'Acceso Automatizado LPR',
    desc: 'Barreras y reconocimiento de patentes',
    tag: 'Control Central',
    image: '/login-panel.jpg',
  },
  {
    title: 'Monitoreo CCTV',
    desc: 'Seguridad 24/7',
    tag: 'Seguridad',
    image: '/hub-bg.jpg', // Abstract metallic
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-white flex flex-col font-sans selection:bg-[#80093A] selection:text-white relative overflow-hidden">
      
      {/* Background Image full viewport with heavy gradient fade */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80 pointer-events-none"
        style={{ backgroundImage: "url('/landing-hero.jpg')" }}
      />
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080E]/40 via-[#06080E]/70 to-[#06080E] pointer-events-none" />

      {/* HEADER macOS FROSTED GLASS */}
      <header className="sticky top-0 z-50 glass-panel mx-4 mt-4 rounded-3xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/hub"
              className="w-10 h-10 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cordano-logo.png" alt="Cordano" className="w-full h-full object-contain p-1" />
            </Link>
            <div className="hidden sm:block">
              <span className="font-extrabold text-sm tracking-widest text-white">PARKOPS CORDANO</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#tarifas" className="hover:text-white transition">Tarifas</a>
            <a href="#instalaciones" className="hover:text-white transition">Instalaciones</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="macos-btn-primary px-6 py-2.5 rounded-full text-white text-xs font-bold flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION INMERSIVO */}
      <section className="relative z-10 pt-32 pb-20 text-center px-4 max-w-5xl mx-auto space-y-8 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel text-xs font-bold text-emerald-300 mx-auto spring-anim hover:scale-105">
          <Sparkles className="w-4 h-4" />
          <span>Infraestructura Inteligente • Cordano Inversiones</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.05] text-glow">
          Estacionamiento <br />
          <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            Serrano 447
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          30 plazas físicas monitoreadas, tarifas fraccionadas por minuto y máxima seguridad en el centro de Iquique.
        </p>

        {/* Botones Grandes Táctiles */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <Link
            href="/login"
            className="macos-btn-primary h-16 px-10 rounded-full text-white font-extrabold text-sm flex items-center gap-3"
          >
            <span>INGRESAR AL ERP</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#tarifas"
            className="macos-btn h-16 px-10 rounded-full text-white font-bold text-sm flex items-center gap-2"
          >
            <span>VER TARIFAS</span>
          </a>
        </div>
      </section>

      {/* TARIFAS (Glass Cards) */}
      <section id="tarifas" className="relative z-10 py-20 px-4 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black text-white tracking-tight">Tarifas Oficiales</h2>
          <p className="text-sm text-slate-400 font-mono">Sin redondeos abusivos.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { tipo: 'Automóvil', precio: '$25', unidad: '/ min', desc: '$1.500 CLP por hora.' },
            { tipo: 'SUV / Camioneta', precio: '$30', unidad: '/ min', desc: '$1.800 CLP por hora.' },
            { tipo: 'Pernocta Nocturna', precio: '$8.000', unidad: '/ noche', desc: 'De 21:00 a 08:00 hrs.' },
            { tipo: 'Convenio Mensual', precio: '$75.000', unidad: '/ mes', desc: 'Plaza reservada 24/7.' }
          ].map((t, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center spring-anim hover:-translate-y-2">
              <span className="text-xs font-bold uppercase text-slate-400 font-mono mb-4">{t.tipo}</span>
              <div className="text-4xl font-black text-white font-mono mb-2">{t.precio} <span className="text-sm font-sans text-slate-400">{t.unidad}</span></div>
              <p className="text-xs text-slate-400 font-medium">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACORDEÓN METALIZADO */}
      <section id="faq" className="relative z-10 py-20 px-4 max-w-3xl mx-auto w-full space-y-10">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="glass-panel rounded-3xl overflow-hidden transition-all duration-300">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-bold text-white hover:text-cyan-300 transition"
                >
                  <span className="text-sm md:text-base">{item.pregunta}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-slate-300 leading-relaxed">
                    {item.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-10 border-t border-white/[0.05] text-center text-xs text-slate-500 font-mono">
        Serrano 447, Iquique, Región de Tarapacá, Chile <br />
        Cordano Inversiones Inmobiliarias Ltda.
      </footer>
    </div>
  );
}
