'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Server, ExternalLink, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CloudRunConnectionInfo } from '@/types';

export const CloudRunBanner: React.FC = () => {
  const [cloudInfo, setCloudInfo] = useState<CloudRunConnectionInfo | null>(null);
  const [existingUrl, setExistingUrl] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(false);

  useEffect(() => {
    fetch('/api/cloudrun')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCloudInfo(data.cloudrun);
          if (data.cloudrun.existingAppUrl) {
            setExistingUrl(data.cloudrun.existingAppUrl);
          }
        }
      })
      .catch((err) => console.error('Error fetching cloud run info:', err));
  }, []);

  const handleTestExistingApp = async () => {
    if (!existingUrl) return;
    setLoadingTest(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/cloudrun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: existingUrl }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setLoadingTest(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Encabezado del estado de Google Cloud */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-sky-500/20 p-3 rounded-xl border border-sky-400/30">
              <Cloud className="w-8 h-8 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight">Google Cloud Run</h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Servicio Independiente
                </span>
              </div>
              <p className="text-sm text-slate-300">
                Arquitectura aislada en GCP • Contenedor Next.js Standalone
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div>
              <span className="text-slate-400 block">ID de Proyecto</span>
              <span className="font-mono font-bold text-sky-300 text-sm">
                gen-lang-client-0862587160
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Número de Proyecto</span>
              <span className="font-mono font-bold text-slate-200 text-sm">349577440002</span>
            </div>
            <div>
              <span className="text-slate-400 block">Región Asignada</span>
              <span className="font-mono font-bold text-slate-200 text-sm">us-west1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Guía de Independencia y Despliegue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-sky-50 border border-sky-200">
            <div className="flex items-start space-x-3">
              <Server className="w-5 h-5 text-sky-700 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sky-900 text-sm">
                  1. Este Servicio: <span className="font-mono">cordano-pms-v1</span>
                </h4>
                <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                  Este proyecto se empaqueta en su propio contenedor Docker independiente con su propio endpoint HTTPS público o privado. No sobrescribe ni altera los microservicios existentes en tu proyecto de Cloud Run.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href="/api/health"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-white px-2.5 py-1 rounded border border-sky-300"
                  >
                    Ver Healthcheck Local (/api/health)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div>
                <h4 className="font-semibold text-emerald-900 text-sm">
                  2. Conexión con tu Aplicación Existente
                </h4>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Puedes configurar la URL del servicio actual de Cloud Run para que este PMS consuma sus APIs, sincronice transacciones o trabaje en conjunto manteniendo código separado.
                </p>
                <p className="text-xs font-mono text-emerald-900 mt-2 bg-emerald-100/60 p-1.5 rounded">
                  Configurado en: .env.local y cloudbuild.yaml
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnóstico de conectividad con la app existente */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <h4 className="text-sm font-semibold text-slate-800 mb-2">
            Probar Conexión con Aplicación Existente en Cloud Run
          </h4>
          <p className="text-xs text-slate-600 mb-3">
            Ingresa la URL HTTPS de tu servicio de Cloud Run existente para verificar conectividad y latencia desde esta aplicación:
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://tu-aplicacion-existente-xxx-uw.a.run.app"
              value={existingUrl}
              onChange={(e) => setExistingUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            />
            <button
              onClick={handleTestExistingApp}
              disabled={loadingTest || !existingUrl}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-md flex items-center justify-center gap-2 transition"
            >
              {loadingTest ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Probando...
                </>
              ) : (
                'Probar Conexión'
              )}
            </button>
          </div>

          {testResult && (
            <div
              className={`mt-4 p-3 rounded-md text-xs border ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="font-semibold flex items-center gap-1.5">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                )}
                {testResult.message || testResult.error}
              </div>
              {testResult.latencyMs && (
                <div className="mt-1 text-slate-600">
                  Latencia de respuesta: <span className="font-mono font-bold">{testResult.latencyMs} ms</span> | Estado HTTP:{' '}
                  <span className="font-mono font-bold">{testResult.httpStatus}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
