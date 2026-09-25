export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pmsStore } from '@/lib/pmsStore';
import { VehicleType } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patente,
      tipo,
      telefono,
      email,
      isForeignPlate,
      slotId,
      forzarIngreso,
      nombreConductor,
      driverName,
      observacionesDanio,
      observaciones,
      vehicleDamageNotes,
    } = body;

    if (!patente) {
      return NextResponse.json(
        { error: 'La patente es obligatoria.' },
        { status: 400 }
      );
    }

    const ticket = pmsStore.checkin(
      patente,
      (tipo as VehicleType) || 'auto',
      telefono,
      email,
      Boolean(isForeignPlate),
      slotId ? Number(slotId) : undefined,
      Boolean(forzarIngreso),
      nombreConductor || driverName,
      observacionesDanio || observaciones || vehicleDamageNotes
    );

    return NextResponse.json({
      success: true,
      ticket,
      message: `Ingreso registrado exitosamente para la patente ${ticket.patente} en slot ${ticket.slot_codigo || ticket.slot_numero}.`,
    });
  } catch (error: any) {
    const isAntiPassback = error.message?.includes('ANTI-PASSBACK');
    return NextResponse.json(
      {
        error: error.message || 'Error al procesar el check-in.',
        isAntiPassback,
      },
      { status: isAntiPassback ? 409 : 400 }
    );
  }
}
