import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const periodo = searchParams.get('periodo') || 'hoy';

  const csvContent = [
    'ID_Ticket,Patente,Fecha_Hora,Tipo_Vehiculo,Metodo_Pago,Monto_CLP,Operador,Estado',
    'TKT-20260924-T01-0001,JKLP34,2026-09-24 08:30:00,AUTO,EFECTIVO,2000,Carlos Morales,PAGADO',
    'TKT-20260924-T01-0002,CDAB89,2026-09-24 09:15:00,CAMIONETA,TARJETA,4800,Carlos Morales,PAGADO',
    'TKT-20260924-T01-0003,FGHI12,2026-09-24 09:40:00,AUTO,EFECTIVO,2000,Carlos Morales,PAGADO',
    'TKT-20260924-T01-0004,BCDE45,2026-09-24 10:15:00,AUTO,TRANSFERENCIA,3750,Carlos Morales,PAGADO',
    'TKT-20260924-T01-0005,ABCD12,2026-09-24 11:30:00,AUTO,EFECTIVO,15250,Carlos Morales,MULTA_EXTRAVIO',
    'TKT-20260924-T01-0006,WXYZ78,2026-09-24 12:10:00,CAMIONETA,TARJETA,6000,Carlos Morales,PAGADO',
  ].join('\n');

  return new NextResponse('\uFEFF' + csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="parkops_export_${periodo}.csv"`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}
