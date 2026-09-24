import { NextRequest, NextResponse } from 'next/server';
import { pmsStore } from '@/lib/pmsStore';
import { CashDenominations } from '@/types';

export async function GET() {
  const currentShift = pmsStore.getCurrentShift();
  return NextResponse.json({
    shift: currentShift,
  });
}

// POST: Abrir nuevo turno
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idOperador, nombreOperador, montoInicial } = body;

    const shift = pmsStore.openShift(
      idOperador || 'OP-01',
      nombreOperador || 'Carlos Soto (Operador)',
      Number(montoInicial || 50000)
    );

    return NextResponse.json({
      success: true,
      shift,
      message: 'Nuevo turno abierto exitosamente.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT: Cierre de caja ciego con desglose físico
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { desglose, montoTarjeta, montoTransferencia, montoEfectivo } = body;

    // Desglose de billetes o fallback
    const desgloseFinal: CashDenominations = desglose || {
      b20000: 0,
      b10000: 0,
      b5000: 0,
      b2000: 0,
      b1000: 0,
      monedas: Number(montoEfectivo || 0),
    };

    const result = pmsStore.closeShiftBlind(
      desgloseFinal,
      Number(montoTarjeta || 0),
      Number(montoTransferencia || 0)
    );

    return NextResponse.json({
      success: true,
      ...result,
      message: 'Cierre ciego de turno procesado correctamente.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
