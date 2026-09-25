export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { askGaritaAssistant } from '@/lib/aiStudio';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, context } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'El parámetro query es requerido' },
        { status: 400 }
      );
    }

    const answer = await askGaritaAssistant(query, context);

    return NextResponse.json({
      success: true,
      answer,
      source: 'Google AI Studio (Gemini 2.5 Flash Garita Copilot)'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al consultar asistente con Google AI Studio' },
      { status: 500 }
    );
  }
}
