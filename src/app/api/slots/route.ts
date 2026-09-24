import { NextResponse } from 'next/server';
import { pmsStore } from '@/lib/pmsStore';

export async function GET() {
  const slots = pmsStore.getSlots();
  const ocupados = slots.filter((s) => s.estado === 'OCUPADO').length;
  const disponibles = slots.filter((s) => s.estado === 'DISPONIBLE').length;

  return NextResponse.json({
    slots,
    total: slots.length,
    ocupados,
    disponibles,
    porcentajeOcupacion: Math.round((ocupados / slots.length) * 100),
  });
}
