'use client';

import React from 'react';
import { ShieldCheck, Calendar, User, Search } from 'lucide-react';
import { AuditLog } from '@/types';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [filtro, setFiltro] = React.useState('');

  const logsFiltrados = logs.filter(
    (l) =>
      l.accion.toLowerCase().includes(filtro.toLowerCase()) ||
      l.nombre_usuario.toLowerCase().includes(filtro.toLowerCase()) ||
      (l.motivo && l.motivo.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            Bitácora de Auditoría Inmutable
          </h3>
          <p className="text-xs text-slate-500">
            Registro secuencial y no modificable de eventos operativos y de seguridad
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filtrar eventos o usuario..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3">Fecha / Hora</th>
              <th className="py-2.5 px-3">Evento / Acción</th>
              <th className="py-2.5 px-3">Usuario</th>
              <th className="py-2.5 px-3">Detalle / Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {logsFiltrados.map((log) => {
              const esCierre = log.accion.includes('CERRADO');
              const esCheckin = log.accion.includes('CHECKIN');
              const esCheckout = log.accion.includes('CHECKOUT');

              return (
                <tr key={log.id_auditoria} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                    {new Date(log.fecha_hora).toLocaleTimeString()} •{' '}
                    {new Date(log.fecha_hora).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        esCierre
                          ? 'bg-amber-100 text-amber-800'
                          : esCheckin
                          ? 'bg-sky-100 text-sky-800'
                          : esCheckout
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {log.accion}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-sans">{log.nombre_usuario}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-sans">{log.motivo || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
