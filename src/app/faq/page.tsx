'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ChevronUp, Search, ArrowLeft, ShieldCheck, Clock, CreditCard } from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'clientes' | 'operacion';
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: 'f1',
    category: 'clientes',
    question: '¿Cómo se calcula el valor del estacionamiento y cuál es el tiempo de gracia?',
    answer:
      'La tarifa base se calcula por minuto cerrado hacia arriba según el tipo de vehículo (Auto, Moto, Camioneta/SUV). Se contemplan 30 minutos de gracia iniciales gratuitos. Si su estadía supera este lapso, el cálculo se efectúa desde el minuto cero aplicando la tarifa vigente al momento de su ingreso, redondeando siempre a la decena de peso CLP más cercana.',
  },
  {
    id: 'f2',
    category: 'clientes',
    question: '¿Qué ocurre si extravío mi ticket físico de entrada?',
    answer:
      'El operador puede localizar su estadía exacta en el sistema ingresando la placa patente del vehículo. Al confirmar su ingreso real, se cobra el tiempo transcurrido más una multa fija administrativa por ticket perdido de $10.000 CLP. Si el vehículo no cuenta con patente legible, se requiere una estimación manual visada con PIN de autorización.',
  },
  {
    id: 'f3',
    category: 'clientes',
    question: '¿Qué medios de pago se encuentran habilitados en garita?',
    answer:
      'Aceptamos Efectivo (con entrega exacta de vuelto calculada por el sistema), Tarjetas de Débito y Crédito a través de terminales Transbank físicos, y Transferencias Bancarias directas verificadas con número de comprobante.',
  },
  {
    id: 'f4',
    category: 'clientes',
    question: '¿Puedo solicitar mi ticket o comprobante por WhatsApp?',
    answer:
      'Sí. Al momento del ingreso o pago en garita, puede indicar su número móvil con formato chileno (+569). El operador podrá enviarle de forma instantánea el comprobante digital con el código de ticket y el desglose de cobro a través de un enlace directo wa.me.',
  },
  {
    id: 'f5',
    category: 'operacion',
    question: '¿Cómo continúa operando la garita si se corta la conexión a internet en Iquique?',
    answer:
      'ParkOps opera bajo arquitectura PWA Offline-First. La terminal de garita almacena los tickets e ingresos en la base de datos local IndexedDB, agregando automáticamente el sufijo "O" (ej: TKT-20260923-T01-0004O). Al recuperar el enlace de red, un proceso en segundo plano sincroniza todos los registros con Google Cloud Run de manera idempotente sin duplicar cobros ni generar colisiones.',
  },
  {
    id: 'f6',
    category: 'operacion',
    question: '¿En qué consiste el protocolo de Cierre de Caja Ciego?',
    answer:
      'Al finalizar el turno, el sistema oculta los montos esperados recaudados. El cajero debe contar físicamente los billetes ($20k, $10k, $5k, $2k, $1k), monedas y váucheres de Transbank, e ingresarlos en el sistema junto a su PIN de 4 dígitos. Solo tras enviar su declaración se revela la tabla comparativa de 3 columnas (Esperado vs Declarado = Cuadre), registrándose un sello criptográfico inmutable SHA-256 en la auditoría.',
  },
  {
    id: 'f7',
    category: 'operacion',
    question: '¿Qué sucede si un conductor fuga su vehículo sin pagar?',
    answer:
      'El operador registra la salida manual forzada bajo su PIN individual, seleccionando la opción "Fuga de Vehículo" con motivo obligatorio. El ticket queda cerrado en estado "Fuga" y se registra en la bitácora de auditoría en color Rojo, evitando que dicho monto sea exigido como dinero físico faltante en el arqueo del cajero.',
  },
];

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'clientes' | 'operacion'>('all');
  const [openItem, setOpenItem] = useState<string | null>('f1');
  const [query, setQuery] = useState('');

  const filteredFaqs = faqs.filter((f) => {
    const matchCategory = activeTab === 'all' || f.category === activeTab;
    const matchText =
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchText;
  });

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-[#1D1D1F] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/landing"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#80093A] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Landing</span>
          </Link>
          <span className="font-bold text-sm text-slate-900 font-sans">
            CENTRO DE PREGUNTAS FRECUENTES
          </span>
          <Link
            href="/"
            className="text-xs px-3 py-1.5 rounded-full bg-[#80093A] text-white font-semibold hover:bg-[#A52C55] transition"
          >
            Ir al POS
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#80093A]">
            Soporte y Normativas
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Preguntas Frecuentes • ParkOps Cordano
          </h1>
          <p className="text-sm text-slate-500">
            Respuestas operativas y comerciales para la instalación física de Serrano 447, Iquique.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por término (ej. gracia, ticket perdido, transbank, offline)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#80093A]"
          />
        </div>

        {/* Selector de Categorías */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-[#80093A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todas ({faqs.length})
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === 'clientes'
                ? 'bg-[#80093A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Conductores y Clientes
          </button>
          <button
            onClick={() => setActiveTab('operacion')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === 'operacion'
                ? 'bg-[#80093A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Operación Garita & Auditoría
          </button>
        </div>

        {/* Acordeón de FAQs */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openItem === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => setOpenItem(isOpen ? null : faq.id)}
                  className="w-full text-left p-4.5 flex justify-between items-center gap-4 hover:bg-slate-50 transition"
                >
                  <span className="text-sm font-bold text-slate-900">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4.5 pb-4.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#F9F9FB]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              No se encontraron preguntas que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Cordano Inversiones Inmobiliarias Ltda. • Serrano 447, Iquique, Chile
      </footer>
    </div>
  );
}
