'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Car,
  ShieldCheck,
  Clock,
  Cloud,
  FileSpreadsheet,
  KeyRound,
  Printer,
  AlertTriangle,
  HelpCircle,
  Search,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  FolderArchive,
  FileText,
  ExternalLink,
  X,
  History,
  Check
} from 'lucide-react';

type DocSection = 'garitero' | 'admin' | 'faq' | 'arquitectura' | 'repositorio';

interface DocMetadata {
  name: string;
  title: string;
  size: number;
  lastModified: string;
  originalName?: string;
  replacedBy?: string;
}

export default function DocumentacionPage() {
  const [activeSection, setActiveSection] = useState<DocSection>('garitero');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados para el Repositorio de Documentación (Vigente vs Archivado)
  const [vigentes, setVigentes] = useState<DocMetadata[]>([]);
  const [archivados, setArchivados] = useState<DocMetadata[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [selectedDocContent, setSelectedDocContent] = useState<{
    name: string;
    content: string;
    isArchived: boolean;
    canonicalReplacement?: string;
  } | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    if (activeSection === 'repositorio' && vigentes.length === 0) {
      setLoadingDocs(true);
      fetch('/api/docs')
        .then((r) => r.json())
        .then((data) => {
          if (data.vigentes) setVigentes(data.vigentes);
          if (data.archivados) setArchivados(data.archivados);
        })
        .catch((err) => console.error('Error fetching docs catalog:', err))
        .finally(() => setLoadingDocs(false));
    }
  }, [activeSection, vigentes.length]);

  const handleOpenDoc = (docName: string) => {
    setLoadingContent(true);
    fetch(`/api/docs?name=${encodeURIComponent(docName)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.content) {
          setSelectedDocContent(data);
        } else {
          alert('No se pudo cargar el documento: ' + (data.error || 'Desconocido'));
        }
      })
      .catch((err) => alert('Error de conexión al cargar documento'))
      .finally(() => setLoadingContent(false));
  };

  const filteredVigentes = vigentes.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArchivados = archivados.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-slate-900 flex flex-col font-sans selection:bg-[#80093A] selection:text-white">
      {/* Encabezado Superior */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin"
              className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center hover:opacity-90 transition"
              title="Volver al Administrador"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cordano-logo.png" alt="Cordano Logo" className="w-full h-full object-contain p-0.5" />
            </Link>
            <div>
              <span className="font-bold text-base tracking-wide text-white flex items-center gap-2">
                MANUALES & REPOSITORIO SOP
                <span className="bg-[#80093A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  CONFIDENCIAL
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-mono">Serrano 447, Iquique • ParkOps Cordano</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Módulos</span>
            </Link>
          </div>
        </div>
      </header>

      {/* CUERPO PRINCIPAL DE LA DOCUMENTACIÓN */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* NAVEGACIÓN LATERAL / TABS DE SECCIONES */}
        <aside className="lg:col-span-3 space-y-3 sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 space-y-1">
            <button
              onClick={() => setActiveSection('garitero')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition ${
                activeSection === 'garitero'
                  ? 'bg-[#80093A] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Guía del Garitero (Fases 1-6)
              </span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => setActiveSection('admin')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition ${
                activeSection === 'admin'
                  ? 'bg-[#80093A] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Manual Administrador
              </span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => setActiveSection('faq')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition ${
                activeSection === 'faq'
                  ? 'bg-[#80093A] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                FAQ de Incidencias
              </span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => setActiveSection('arquitectura')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition ${
                activeSection === 'arquitectura'
                  ? 'bg-[#80093A] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Arquitectura Cloud Run
              </span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            {/* PESTAÑA NUEVA: REPOSITORIO & ARCHIVO HISTÓRICO */}
            <button
              onClick={() => setActiveSection('repositorio')}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between transition border-t border-slate-100 mt-2 ${
                activeSection === 'repositorio'
                  ? 'bg-[#80093A] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-amber-500" />
                Repositorio de Docs & Archivo
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-normal">
                V2.0
              </span>
            </button>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs space-y-2 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">
              Soporte Urgente Garita
            </span>
            <p className="text-slate-300">
              En caso de contingencia eléctrica o corte de fibra, active el modo Offline en el navegador.
            </p>
            <span className="block font-mono text-emerald-400 font-bold">
              WhatsApp Garita: +56 9 8765 4321
            </span>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <section className="lg:col-span-9 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* SECCIÓN 1: GUÍA DEL GARITERO */}
          {activeSection === 'garitero' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#80093A] uppercase tracking-wider">
                  Procedimiento Operativo Estándar (SOP)
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Guía Paso a Paso para Operadores de Garita
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Flujo físico y digital para la atención rápida en el acceso de Serrano 447, Iquique.
                </p>
              </div>

              {/* Atajos de Teclado Keyboard-First */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#80093A]" />
                  Atajos Rápidos de Teclado (Keyboard-First)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <kbd className="bg-[#80093A] text-white px-2 py-0.5 rounded font-bold">F1</kbd>
                    <span className="block text-slate-600 mt-1">Ingreso de Vehículo</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <kbd className="bg-sky-800 text-white px-2 py-0.5 rounded font-bold">F2</kbd>
                    <span className="block text-slate-600 mt-1">Cobro de Ticket</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <kbd className="bg-amber-800 text-white px-2 py-0.5 rounded font-bold">F8</kbd>
                    <span className="block text-slate-600 mt-1">Arqueo Ciego Caja</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <kbd className="bg-slate-800 text-white px-2 py-0.5 rounded font-bold">Esc</kbd>
                    <span className="block text-slate-600 mt-1">Cerrar Pop-ups</span>
                  </div>
                </div>
              </div>

              {/* Las 6 Fases Operativas */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="text-xs font-extrabold text-[#80093A] block">
                    FASE 1: APERTURA DE TURNO Y CAJA
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Al iniciar la jornada, verifique el dinero en el cajón de sencillo. Ingrese el monto total de efectivo en el modal inicial (estándar $50.000 CLP) y digite su PIN de operador. No es obligatorio contar moneda por moneda al abrir.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="text-xs font-extrabold text-[#80093A] block">
                    FASE 2: INGRESO DE VEHÍCULO (CHECK-IN)
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Con el vehículo frente a la garita, digite la patente en el campo superior (con autofoco). Si es chilena, el sistema aplica la máscara automática. Presione <kbd className="font-bold">Enter</kbd> para generar el ticket térmico con código de barras lineal (Code 128) y abrir paso al conductor hacia el Sector A o Sector B.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="text-xs font-extrabold text-[#80093A] block">
                    FASE 3: COBRO Y SALIDA (CHECK-OUT)
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Al acercarse el vehículo a la salida, escanee el código de barras o digite la patente en el buscador. El sistema calcula los minutos transcurridos y el valor exacto en CLP. Si estuvo menos de 30 minutos, el cobro es $0. Seleccione Efectivo, Tarjeta o Transferencia, digite el monto entregado y el visor mostrará el vuelto en números gigantes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="text-xs font-extrabold text-[#80093A] block">
                    FASE 4: EXCEPCIONES Y CASOS ESPECIALES
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cualquier cobro parcial, descuento especial o extravío de ticket requiere que el operador ingrese su PIN individual. Esto no traba la salida del cliente: la operación se registra inmediatamente y pasa a la cola de visación del Administrador.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="text-xs font-extrabold text-[#80093A] block">
                    FASE 5: CIERRE CIEGO DE CAJA (ARQUEO F8)
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Al terminar su turno, presione <kbd className="font-bold">F8</kbd>. Cuente el efectivo físico en caja y digite el valor total sin mirar la pantalla del sistema. Luego digite los montos de vouchers de tarjetas y transferencias. El sistema contrastará el dinero declarado contra lo recaudado según tickets e imprimirá el Reporte Z duplicado con sello SHA-256.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="text-xs font-extrabold text-[#80093A] block">
                    FASE 6: CAMBIO DE TURNO LIMPIO
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    El operador saliente entrega el efectivo recaudado en el sobre sellado de remesa, dejando únicamente el fondo base ($50.000) en el cajón para que el operador entrante inicie su turno con su respectivo PIN.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 2: MANUAL DEL ADMINISTRADOR */}
          {activeSection === 'admin' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#80093A] uppercase tracking-wider">
                  Supervisión y Control Financiero
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Manual de Administración y Conciliación
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Directrices para la visación de excepciones, auditoría antifraude y exportación de datos.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <h3 className="font-bold text-sm text-amber-900 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-700" />
                    Aprobación de Excepciones con PIN de Supervisor
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Todas las incidencias registradas en garita (fugas, cobros parciales autorizados, multas por ticket perdido) aparecen en la pestaña <strong>Aprobaciones con PIN</strong> del Dashboard. El Administrador revisa el motivo declarado por el operador y aprueba la excepción digitando su PIN de 4 dígitos.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 rounded-2xl space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    Exportación a Excel / Google Sheets en 1 Clic
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    En la barra superior del Dashboard y en el módulo de Reportes existe el botón <strong>&ldquo;Excel / Sheets&rdquo;</strong>. Al presionarlo, el sistema genera inmediatamente un archivo <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">.csv</code> codificado en UTF-8 con la totalidad de registros, patentes, minutos cobrados y medios de pago para abrirlo en Excel sin distorsión de caracteres.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <h3 className="font-bold text-sm text-slate-900">Principio de Custodia (Single Writer)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Para asegurar que ningún faltante de caja pueda atribuirse a manipulaciones remotas, el Administrador tiene perfil de <strong>Solo Lectura</strong> sobre las estadías activas de garita. No puede cerrar tickets ni cobrar en paralelo al operador que tiene el turno abierto.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 3: FAQ OPERATIVA */}
          {activeSection === 'faq' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#80093A] uppercase tracking-wider">
                  Resolución Rápida de Incidencias
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Preguntas Frecuentes del Personal
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Protocolos ante situaciones imprevistas en el estacionamiento de Serrano 447.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900">
                    ¿Qué hacer si un conductor pierde el ticket de papel?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    1. En la sección de cobro, presione el botón <strong>Ticket Perdido</strong>.<br />
                    2. Digite la patente del vehículo. El sistema buscará la hora exacta de ingreso en la base de datos.<br />
                    3. Se aplicará la tarifa del tiempo transcurrido más la multa fija de $10.000 CLP.<br />
                    4. Digite su PIN de operador para autorizar la liquidación e imprima el comprobante sustituto.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900">
                    ¿Qué ocurre si se corta la conexión a Internet en la garita?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    El sistema está equipado con <strong>IndexedDB Offline-First</strong>. La garita seguirá imprimiendo tickets normalmente, añadiendo el sufijo <strong>&ldquo;O&rdquo;</strong> (ej. <code className="font-mono">TKT-20260923-T01-0012O</code>). Cuando se restablezca la conexión, todos los registros se sincronizan automáticamente con Google Cloud Run de forma idempotente y sin duplicados.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900">
                    ¿Cómo registrar un vehículo que se dio a la fuga sin pagar?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    En el formulario de cobro, busque la patente del vehículo fugado y presione <strong>Reportar Fuga</strong>. Ingrese su PIN de operador y una breve observación (ej. &ldquo;Vehículo aceleró rompiendo cono&rdquo;). La plaza quedará liberada, el ticket se anula contablemente en color rojo y no afectará el cuadre de dinero en su arqueo de caja.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 4: ESPECIFICACIONES CLOUD RUN */}
          {activeSection === 'arquitectura' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#80093A] uppercase tracking-wider">
                  Infraestructura y Persistencia
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Especificaciones Técnicas Cloud Run & Offline
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Configuración del microservicio y modelo de datos en Google Cloud.
                </p>
              </div>

              <div className="bg-slate-900 text-white p-5 rounded-2xl font-mono text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">GCP Project:</span>
                  <span className="text-sky-300 font-bold">gen-lang-client-0862587160 (N° 349577440002)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Cloud Run Service:</span>
                  <span className="text-emerald-400 font-bold">cordano-pms-v1 (us-west1)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Puerto del Contenedor:</span>
                  <span className="text-slate-200">8080</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Stitch Project ID:</span>
                  <span className="text-amber-400">projects/12916038623650348087</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Simbología Térmica:</span>
                  <span className="text-slate-200">Lineal Code 128 (Sin Códigos QR)</span>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 5: REPOSITORIO & ARCHIVO HISTÓRICO */}
          {activeSection === 'repositorio' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#80093A] uppercase tracking-wider">
                    Catálogo de Documentos
                  </span>
                  <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Repositorio Oficial & Archivo Histórico
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Distinción clara entre las especificaciones vigentes V2.0 y los documentos archivados de etapas previas.
                  </p>
                </div>

                {/* Buscador de Documentos */}
                <div className="relative max-w-xs w-full">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrar documentos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#80093A]"
                  />
                </div>
              </div>

              {loadingDocs ? (
                <div className="text-center py-12 text-slate-400 text-xs font-mono">
                  Cargando catálogo de documentación...
                </div>
              ) : (
                <div className="space-y-8">
                  {/* GRUPO 1: DOCUMENTACIÓN VIGENTE Y CANÓNICA */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                        Documentación Vigente Oficial (V2.0 Canónica)
                      </h3>
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {filteredVigentes.length} Activos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredVigentes.map((doc) => (
                        <div
                          key={doc.name}
                          onClick={() => handleOpenDoc(doc.name)}
                          className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-sm hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                                OFICIAL V2.0
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {(doc.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#80093A] transition">
                              {doc.name}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 text-[11px] text-slate-500">
                            <span>Lectura directa &rarr;</span>
                            <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#80093A]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GRUPO 2: ARCHIVO HISTÓRICO ([ARCHIVADO]_) */}
                  <div className="space-y-3 pt-4 border-t border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                        Archivo Histórico de Versiones Anteriores
                      </h3>
                      <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                        {filteredArchivados.length} Archivados
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Documentos preliminares y minutas previas preservadas para trazabilidad y auditoría histórica.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredArchivados.map((doc) => (
                        <div
                          key={doc.name}
                          onClick={() => handleOpenDoc(doc.name)}
                          className="bg-amber-50/30 p-4 rounded-2xl border border-amber-200/70 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                ARCHIVADO
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {(doc.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-800 font-mono truncate group-hover:text-[#80093A] transition">
                              {doc.name}
                            </h4>
                            {doc.replacedBy && (
                              <p className="text-[11px] text-amber-800 font-medium">
                                Superado por: <span className="font-mono">{doc.replacedBy}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-amber-200/50 mt-2 text-[11px] text-slate-500">
                            <span>Ver versión histórica &rarr;</span>
                            <History className="w-3.5 h-3.5 text-amber-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* MODAL LECTOR DE DOCUMENTO (MARKDOWN VIEWER) */}
      {selectedDocContent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            {/* Cabecera del Lector */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm truncate">{selectedDocContent.name}</span>
                    {selectedDocContent.isArchived ? (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                        HISTÓRICO ARCHIVADO
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                        OFICIAL VIGENTE
                      </span>
                    )}
                  </div>
                  {selectedDocContent.canonicalReplacement && (
                    <p className="text-[11px] text-amber-200">
                      Reemplazado oficialmente por: {selectedDocContent.canonicalReplacement}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedDocContent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Markdown Renderizado */}
            <div className="p-6 overflow-y-auto font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed select-text bg-[#FDFDFE]">
              {selectedDocContent.content}
            </div>

            {/* Footer con Acciones */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono">
                Directorio: /docs/{selectedDocContent.name}
              </span>
              <button
                onClick={() => setSelectedDocContent(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
