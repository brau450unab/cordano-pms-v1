export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'UP',
    service: 'cordano-pms-v1',
    description: 'Cordano Parking Management System V1 (Iquique, Serrano 447)',
    gcp: {
      projectId: process.env.NEXT_PUBLIC_GCP_PROJECT_ID || 'gen-lang-client-0862587160',
      projectNumber: process.env.NEXT_PUBLIC_GCP_PROJECT_NUMBER || '349577440002',
      region: process.env.NEXT_PUBLIC_GCP_REGION || 'us-west1',
      kService: process.env.K_SERVICE || 'local-standalone',
      kRevision: process.env.K_REVISION || 'v1',
    },
    timestamp: new Date().toISOString(),
  });
}
