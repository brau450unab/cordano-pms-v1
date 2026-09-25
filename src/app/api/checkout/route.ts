export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pmsStore } from '@/lib/pmsStore';
import { PaymentMethod } from '@/types';

// GET: Calcular monto a pagar sin finalizar (pre-cobro)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Debes proporcionar un ID de ticket o patente.' }, { status: 400 });
    }

    const calc = pmsStore.calculatePendingCheckout(id);
    return NextResponse.json({
      success: true,
      ...calc,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al calcular cobro.' }, { status: 404 });
  }
}

// POST: Procesar cobro, fuga o excepciones con PIN
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, metodoPago, montoEntregado, accion, pin, motivo, montoNuevo } = body;

    if (!id) {
      return NextResponse.json({ error: 'Falta el identificador del ticket o patente.' }, { status: 400 });
    }

    // Caso 1: Registrar Vehículo en Fuga
    if (accion === 'FUGA') {
      const ticket = pmsStore.registrarFuga(id, pin, motivo);
      return NextResponse.json({
        success: true,
        accion: 'FUGA',
        ticket,
        message: `Fuga registrada para el vehículo ${ticket.patente}. Ticket anulado en auditoría roja.`,
      });
    }

    // Caso 2: Declarar Ticket Extraviado
    if (accion === 'MULTA_EXTRAVIO') {
      const ticket = pmsStore.declararTicketPerdido(id, pin);
      return NextResponse.json({
        success: true,
        accion: 'MULTA_EXTRAVIO',
        ticket,
        message: `Multa reglamentaria de $10.000 CLP aplicada al ticket ${ticket.id_ticket}.`,
      });
    }

    // Caso 3: Descuento o Cobro Parcial
    if (accion === 'DESCUENTO' || accion === 'COBRO_PARCIAL') {
      const ticket = pmsStore.aplicarDescuentoOCobroParcial(id, Number(montoNuevo), pin, motivo, accion);
      return NextResponse.json({
        success: true,
        accion,
        ticket,
        message: `Ajuste de cobro registrado para el ticket ${ticket.id_ticket}.`,
      });
    }

    // Caso 4: Reimpresión física
    if (accion === 'REIMPRESION') {
      const ticket = pmsStore.reimprimirTicket(id);
      return NextResponse.json({
        success: true,
        accion: 'REIMPRESION',
        ticket,
        message: `Reimpresión N° ${ticket.reprint_count} registrada.`,
      });
    }

    // Caso 5: Cobro normal
    if (!metodoPago) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos (metodoPago).' },
        { status: 400 }
      );
    }

    const result = pmsStore.checkout(
      id,
      metodoPago as PaymentMethod,
      Number(montoEntregado || 0)
    );

    return NextResponse.json({
      success: true,
      ticket: result.ticket,
      vuelto: result.vuelto,
      message: `Salida registrada exitosamente. Ticket ${result.ticket.id_ticket} entregado.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al procesar salida.' },
      { status: 400 }
    );
  }
}
