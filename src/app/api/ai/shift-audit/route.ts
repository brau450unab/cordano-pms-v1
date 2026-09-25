export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auditShiftReport } from '@/lib/aiStudio';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shiftData } = body;

    if (!shiftData || !shiftData.operatorName) {
      return NextResponse.json(
        { error: 'Datos de turno (shiftData) incompletos' },
        { status: 400 }
      );
    }

    const result = await auditShiftReport(shiftData);

    return NextResponse.json({
      success: true,
      data: result,
      source: 'Google AI Studio (Gemini 2.5 Pro Financial Auditor)'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al auditar turno con Google AI Studio' },
      { status: 500 }
    );
  }
}
