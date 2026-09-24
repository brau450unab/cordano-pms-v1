'use client';

import React, { useState } from 'react';
import {
  Clock,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ShieldCheck,
  DollarSign,
  Layers,
  ArrowRight,
  Hash,
  Copy,
  Check,
  X
} from 'lucide-react';
import { Shift, CashDenominations } from '@/types';

interface ShiftModalProps {
  currentShift: Shift | null;
  onShiftUpdated: () => void;
  onClose?: () => void;
}

export const ShiftModal: React.FC<ShiftModalProps> = ({ currentShift, onShiftUpdated, onClose }) => {
  // Estado para desglose por denominación de billetes chilenos
  const [denominaciones, setDenominaciones] = useState<CashDenominations>({
    b20000: 0,
    b10000: 0,
    b5000: 0,
    b2000: 0,
    b1000: 0,
    monedas: 0,
  });

  // Estados para otros medios de pago
  const [tarjeta, setTarjeta] = useState<number | ''>('');
  const [transferencia, setTransferencia] = useState<number | ''>('');
  const [pinOperador, setPinOperador] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cierreResultado, setCierreResultado] = useState<any>(null);
  const [showZReportModal, setShowZReportModal] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);

  // Estados para Apertura de nuevo turno
  const [nombreOp, setNombreOp] = useState('Braulio Arancibia (Operador Garita)');
  const [cajaBase, setCajaBase] = useState<number>(50000);

  // Cálculo en vivo del subtotal de efectivo físico recontado
  const subtotal20k = denominaciones.b20000 * 20000;
  const subtotal10k = denominaciones.b10000 * 10000;
  const subtotal5k = denominaciones.b5000 * 5000;
  const subtotal2k = denominaciones.b2000 * 2000;
  const subtotal1k = denominaciones.b1000 * 1000;
  const subtotalMonedas = Number(denominaciones.monedas || 0);

  const totalEfectivoRecontado =
    subtotal20k + subtotal10k + subtotal5k + subtotal2k + subtotal1k + subtotalMonedas;

  const handleDenomChange = (field: keyof CashDenominations, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setDenominaciones((prev) => ({
      ...prev,
      [field]: num,
    }));
  };

  const handleCierreCiego = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pinOperador || pinOperador.length < 4) {
      setError('Debes ingresar tu PIN de operador de 4 dígitos para validar el cierre.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/shifts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desglose: denominaciones,
          montoEfectivo: totalEfectivoRecontado,
          montoTarjeta: Number(tarjeta || 0),
          montoTransferencia: Number(transferencia || 0),
          pinOperador,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar el cierre ciego');

      setCierreResultado(data);
      onShiftUpdated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirTurno = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idOperador: 'OP-01',
          nombreOperador: nombreOp,
          montoInicial: Number(cajaBase || 0),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al abrir nuevo turno');

      setCierreResultado(null);
      setDenominaciones({
        b20000: 0,
        b10000: 0,
        b5000: 0,
        b2000: 0,
        b1000: 0,
        monedas: 0,
      });
      setTarjeta('');
      setTransferencia('');
      setPinOperador('');
      onShiftUpdated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            Protocolo de Cierre de Caja Ciego & Arqueo Garita
          </h3>
          <p className="text-xs text-slate-500">
            Declaración física de valores sin revelar montos esperados por el sistema (Antifraude estricto)
          </p>
        </div>

        {currentShift && (
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                currentShift.estado === 'ABIERTO'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-200 text-slate-800 border border-slate-300'
              }`}
            >
              Turno {currentShift.estado}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-500">
              {currentShift.id_turno}
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition ml-2"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Si hay un turno ABIERTO */}
      {currentShift && currentShift.estado === 'ABIERTO' && !cierreResultado && (
        <div className="space-y-6">
          {/* Tarjeta de Datos del Turno Actual */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Operador en Turno</span>
              <p className="font-bold text-slate-800 text-sm">{currentShift.nombre_operador}</p>
              <span className="text-[10px] text-slate-500 font-mono">ID: {currentShift.id_operador}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Hora Apertura</span>
              <p className="font-mono text-sm font-semibold text-slate-700">
                {new Date(currentShift.fecha_apertura).toLocaleDateString()} {new Date(currentShift.fecha_apertura).toLocaleTimeString()}
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Caja Base Inicial</span>
              <p className="font-mono font-bold text-slate-900 text-base tabular-nums">
                ${currentShift.monto_inicial_caja.toLocaleString('es-CL')}
              </p>
            </div>
          </div>

          {/* Aviso Didáctico de Caja Ciega */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="block mb-0.5">Protocolo de Auditoría Ciega:</strong>
              El operador cuenta el efectivo físico real por billete y moneda, más los comprobantes de tarjeta y comprobantes de transferencia. El sistema <strong>no muestra el monto acumulado</strong> hasta que el operador ratifica y firma con su PIN.
            </div>
          </div>

          <form onSubmit={handleCierreCiego} className="space-y-6">
            {/* Desglose de Billetes y Monedas */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Desglose Físico por Denominación (Pesos Chilenos CLP)
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 tabular-nums">
                  Total Recontado: ${totalEfectivoRecontado.toLocaleString('es-CL')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* $20.000 */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="block text-xs font-mono font-bold text-slate-700 mb-1">$20.000</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={denominaciones.b20000 || ''}
                    onChange={(e) => handleDenomChange('b20000', e.target.value)}
                    className="w-full text-center font-mono font-bold text-sm py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <span className="block text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                    = ${subtotal20k.toLocaleString('es-CL')}
                  </span>
                </div>

                {/* $10.000 */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="block text-xs font-mono font-bold text-slate-700 mb-1">$10.000</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={denominaciones.b10000 || ''}
                    onChange={(e) => handleDenomChange('b10000', e.target.value)}
                    className="w-full text-center font-mono font-bold text-sm py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <span className="block text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                    = ${subtotal10k.toLocaleString('es-CL')}
                  </span>
                </div>

                {/* $5.000 */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="block text-xs font-mono font-bold text-slate-700 mb-1">$5.000</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={denominaciones.b5000 || ''}
                    onChange={(e) => handleDenomChange('b5000', e.target.value)}
                    className="w-full text-center font-mono font-bold text-sm py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <span className="block text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                    = ${subtotal5k.toLocaleString('es-CL')}
                  </span>
                </div>

                {/* $2.000 */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="block text-xs font-mono font-bold text-slate-700 mb-1">$2.000</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={denominaciones.b2000 || ''}
                    onChange={(e) => handleDenomChange('b2000', e.target.value)}
                    className="w-full text-center font-mono font-bold text-sm py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <span className="block text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                    = ${subtotal2k.toLocaleString('es-CL')}
                  </span>
                </div>

                {/* $1.000 */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="block text-xs font-mono font-bold text-slate-700 mb-1">$1.000</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={denominaciones.b1000 || ''}
                    onChange={(e) => handleDenomChange('b1000', e.target.value)}
                    className="w-full text-center font-mono font-bold text-sm py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <span className="block text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                    = ${subtotal1k.toLocaleString('es-CL')}
                  </span>
                </div>

                {/* Monedas */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                  <span className="block text-xs font-mono font-bold text-slate-700 mb-1">Monedas ($)</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={denominaciones.monedas || ''}
                    onChange={(e) => handleDenomChange('monedas', e.target.value)}
                    className="w-full text-center font-mono font-bold text-sm py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <span className="block text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                    = ${subtotalMonedas.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>

            {/* Medios Electrónicos y PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Vouchers Transbank POS ($)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={tarjeta}
                  onChange={(e) => setTarjeta(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-right text-base font-mono font-bold px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Comprobantes Transferencia ($)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={transferencia}
                  onChange={(e) => setTransferencia(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-right text-base font-mono font-bold px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-rose-700 mb-1.5 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  PIN Operador (4 Dígitos) *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={pinOperador}
                  onChange={(e) => setPinOperador(e.target.value)}
                  className="w-full text-center text-lg font-mono font-bold tracking-widest px-3 py-2 border border-rose-300 rounded-xl bg-rose-50/50 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Botón de Cierre Ciego */}
            <button
              type="submit"
              disabled={loading || totalEfectivoRecontado === 0}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                'Comparando Valores & Generando Sello Criptográfico...'
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  DECLARAR VALORES Y EJECUTAR CIERRE CIEGO (F8)
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* RESULTADO COMPARATIVO DE CAJA CIEGA (3 COLUMNAS CANÓNICAS) */}
      {(cierreResultado || (currentShift && currentShift.estado === 'CERRADO')) && (
        <div className="space-y-6 p-6 rounded-2xl border border-slate-300 bg-slate-50 animate-fadeIn">
          {/* Header de Resultado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Auditoría Comparativa de Cierre de Caja
              </h4>
              <p className="text-xs text-slate-500">
                Cuadre auditado con sello criptográfico inmutable en Cloud Run
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowZReportModal(true)}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir Reporte Z (Auditoría)
              </button>
            </div>
          </div>

          {/* 3 Columnas Canónicas: Efectivo Sistema vs Efectivo Recontado Físico = Cuadre */}
          {(() => {
            const shiftData = cierreResultado ? cierreResultado.shift : currentShift;
            const diff = shiftData?.diferencia || 0;
            const isCuadrada = diff === 0;

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Columna 1: Efectivo Sistema */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
                  <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
                    Efectivo Sistema (Esperado)
                  </span>
                  <span className="text-2xl font-bold font-mono text-sky-800 block tabular-nums">
                    ${(shiftData?.monto_esperado_efectivo || 0).toLocaleString('es-CL')}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                    Base (${(shiftData?.monto_inicial_caja || 0).toLocaleString('es-CL')}) + Cobrado
                  </span>
                </div>

                {/* Columna 2: Efectivo Recontado Físico */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
                  <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
                    Efectivo Recontado Físico
                  </span>
                  <span className="text-2xl font-bold font-mono text-slate-900 block tabular-nums">
                    ${(shiftData?.monto_declarado_efectivo || 0).toLocaleString('es-CL')}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                    Declarado a ciegas por operador
                  </span>
                </div>

                {/* Columna 3: Diferencia / Cuadre */}
                <div
                  className={`p-4 rounded-xl border text-center shadow-sm ${
                    isCuadrada
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : diff > 0
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <span className="text-xs uppercase font-semibold block mb-1">
                    {isCuadrada
                      ? 'Caja Cuadrada Exacta'
                      : diff > 0
                      ? 'Sobrante en Gaveta'
                      : 'Faltante de Caja'}
                  </span>
                  <span className="text-2xl font-bold font-mono block tabular-nums">
                    ${Math.abs(diff).toLocaleString('es-CL')}
                  </span>
                  <span className="text-[11px] font-semibold mt-1 block">
                    {isCuadrada ? '0 discrepancias' : diff > 0 ? '+ Excedente' : '- Déficit'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Sello Hash SHA-256 inmutable */}
          {(() => {
            const shiftData = cierreResultado ? cierreResultado.shift : currentShift;
            const hash = shiftData?.hash_sellado || 'SHA256-PENDING-SYNC';

            return (
              <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Sello Criptográfico Inmutable (Auditoría Cordano Inversiones):
                    </span>
                    <span className="text-emerald-300 font-bold tracking-wider">{hash}</span>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(hash)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1.5 transition shrink-0"
                >
                  {hashCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Hash
                    </>
                  )}
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* FORMULARIO PARA ABRIR NUEVO TURNO (Si no hay turno o está cerrado) */}
      {(!currentShift || currentShift.estado === 'CERRADO') && (
        <form onSubmit={handleAbrirTurno} className="p-6 rounded-2xl border border-sky-200 bg-sky-50/60 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-700" />
            <h4 className="font-bold text-sky-950 text-base">Apertura de Nuevo Turno Operativo</h4>
          </div>
          <p className="text-xs text-sky-800">
            Ingresa el operador responsable y el fondo de cambio inicial asignado a la gaveta.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Nombre de Operador de Turno
              </label>
              <input
                type="text"
                required
                value={nombreOp}
                onChange={(e) => setNombreOp(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Fondo de Caja Base Inicial ($)
              </label>
              <input
                type="number"
                required
                value={cajaBase}
                onChange={(e) => setCajaBase(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono font-bold text-right bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm shadow transition"
          >
            INICIAR Y HABILITAR NUEVO TURNO DE GARITA
          </button>
        </form>
      )}

      {/* MODAL POP-UP DE REPORTE Z (Térmico 80mm) */}
      {showZReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-300 space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center border-b pb-2">
              <h5 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-sky-600" />
                Reporte Z de Caja (80mm)
              </h5>
              <button
                onClick={() => setShowZReportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulación del Ticket Térmico Z */}
            <div className="bg-slate-50 p-4 border border-dashed border-slate-300 rounded font-mono text-[11px] leading-tight text-slate-800 space-y-2">
              <div className="text-center font-bold">
                <p>CORDANO INVERSIONES INMOBILIARIAS</p>
                <p>PARKOPS IQUIQUE • SERRANO 447</p>
                <p className="text-[10px] text-slate-500 mt-1">*** REPORTE Z DE AUDITORIA ***</p>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>TURNO:</span>
                  <span className="font-bold">{cierreResultado?.shift?.id_turno || currentShift?.id_turno}</span>
                </div>
                <div className="flex justify-between">
                  <span>OPERADOR:</span>
                  <span>{cierreResultado?.shift?.nombre_operador || currentShift?.nombre_operador}</span>
                </div>
                <div className="flex justify-between">
                  <span>FECHA CIERRE:</span>
                  <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>CAJA BASE:</span>
                  <span className="tabular-nums">${(cierreResultado?.shift?.monto_inicial_caja || currentShift?.monto_inicial_caja || 0).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between">
                  <span>EFECTIVO ESPERADO:</span>
                  <span className="tabular-nums">${(cierreResultado?.shift?.monto_esperado_efectivo || currentShift?.monto_esperado_efectivo || 0).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>EFECTIVO RECONTADO:</span>
                  <span className="tabular-nums">${(cierreResultado?.shift?.monto_declarado_efectivo || currentShift?.monto_declarado_efectivo || 0).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between font-bold text-sky-800">
                  <span>DIFERENCIA / CUADRE:</span>
                  <span className="tabular-nums">${(cierreResultado?.shift?.diferencia || currentShift?.diferencia || 0).toLocaleString('es-CL')}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] text-slate-500 text-center break-all">
                SELLO SHA-256:<br />
                {cierreResultado?.shift?.hash_sellado || currentShift?.hash_sellado || 'SHA256-OFFLINE-SEAL'}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir Térmica
              </button>
              <button
                onClick={() => setShowZReportModal(false)}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
