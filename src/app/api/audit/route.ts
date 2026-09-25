export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { pmsStore } from '@/lib/pmsStore';

export async function GET() {
  const logs = pmsStore.getAuditLogs();
  return NextResponse.json({
    logs,
    total: logs.length,
  });
}
