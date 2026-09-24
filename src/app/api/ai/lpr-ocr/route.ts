import { NextRequest, NextResponse } from 'next/server';
import { recognizePlateFromImage } from '@/lib/aiStudio';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Parámetro imageBase64 es requerido' },
        { status: 400 }
      );
    }

    const result = await recognizePlateFromImage(imageBase64, mimeType || 'image/jpeg');

    return NextResponse.json({
      success: true,
      data: result,
      source: 'Google AI Studio (Gemini 2.5 Flash LPR)'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al procesar LPR con Google AI Studio' },
      { status: 500 }
    );
  }
}
