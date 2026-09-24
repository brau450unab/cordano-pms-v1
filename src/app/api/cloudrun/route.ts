import { NextRequest, NextResponse } from 'next/server';
import { pmsStore } from '@/lib/pmsStore';

export async function GET() {
  const info = pmsStore.getCloudRunInfo();
  return NextResponse.json({
    success: true,
    cloudrun: info,
    architecture: {
      isolation: 'INDEPENDENT_SERVICE',
      targetService: 'cordano-pms-v1',
      gcpProjectId: info.projectId,
      gcpProjectNumber: info.projectNumber,
      region: info.region,
      containerEngine: 'Google Cloud Run (Fully Managed)',
      scaling: '0 to 10 instances (Auto-scaling on demand)',
    },
  });
}

// POST: Probar conectividad con la aplicación existente de Cloud Run
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetUrl = body.url || process.env.EXISTING_CLOUDRUN_APP_URL;

    if (!targetUrl) {
      return NextResponse.json({
        success: false,
        error: 'No se ha configurado la URL de la aplicación existente en Cloud Run.',
      }, { status: 400 });
    }

    const startTime = Date.now();
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'CordanoPMS-CloudRun-Connector/1.0' },
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - startTime;

      return NextResponse.json({
        success: true,
        targetUrl,
        httpStatus: response.status,
        statusText: response.statusText,
        latencyMs,
        message: 'Conexión exitosa con la aplicación externa de Cloud Run.',
      });
    } catch (fetchErr: any) {
      return NextResponse.json({
        success: false,
        targetUrl,
        error: `No se pudo conectar con ${targetUrl}: ${fetchErr.message}`,
      }, { status: 502 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
