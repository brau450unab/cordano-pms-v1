import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mapeo de compatibilidad histórica: nombres antiguos a nombres archivados y su reemplazo canónico vigente
const COMPATIBILITY_MAP: Record<string, { archivedName: string; canonicalName: string }> = {
  'PRD_MAESTRO_CONSOLIDADO_CORDANO_V4.md': {
    archivedName: '[ARCHIVADO]_PRD_MAESTRO_CONSOLIDADO_CORDANO_V4.md',
    canonicalName: 'PRD_SISTEMA_DE_PARKING.md',
  },
  'PRD_CENTRALIZADO_PARKOPS_CORDANO.md': {
    archivedName: '[ARCHIVADO]_PRD_CENTRALIZADO_PARKOPS_CORDANO.md',
    canonicalName: 'PRD_SISTEMA_DE_PARKING.md',
  },
  'CONSOLIDACION_PRD_Y_GUIA_ENTREVISTA_PARKOPS.md': {
    archivedName: '[ARCHIVADO]_CONSOLIDACION_PRD_Y_GUIA_ENTREVISTA_PARKOPS.md',
    canonicalName: 'PRD_SISTEMA_DE_PARKING.md',
  },
  'PLAN_DE_ARQUITECTURA.md': {
    archivedName: '[ARCHIVADO]_PLAN_DE_ARQUITECTURA.md',
    canonicalName: 'MAPA_DE_SITIO_Y_ARQUITECTURA.md',
  },
  'VISTAS_STITCH_CORDANO.md': {
    archivedName: '[ARCHIVADO]_VISTAS_STITCH_CORDANO.md',
    canonicalName: 'ESPECIFICACION_DISENO_FLUJO_Y_LANDING.md',
  },
  'FLUJO_OPERATIVO_SOP_GARITA_CORDANO.md': {
    archivedName: '[ARCHIVADO]_FLUJO_OPERATIVO_SOP_GARITA_CORDANO.md',
    canonicalName: 'ESPECIFICACION_DISENO_FLUJO_Y_LANDING.md',
  },
  'HISTORIAL_REUNIONES_Y_ACUERDOS.md': {
    archivedName: '[ARCHIVADO]_HISTORIAL_REUNIONES_Y_ACUERDOS.md',
    canonicalName: 'PRD_SISTEMA_DE_PARKING.md',
  },
  'REPORTE_CONSOLIDADO_Y_CUESTIONARIO_GRILLME_CORDANO.md': {
    archivedName: '[ARCHIVADO]_REPORTE_CONSOLIDADO_Y_CUESTIONARIO_GRILLME_CORDANO.md',
    canonicalName: 'PRD_SISTEMA_DE_PARKING.md',
  },
};

const DOCS_DIR = path.join(process.cwd(), 'docs');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedName = searchParams.get('name') || searchParams.get('doc');
    const autoRedirectToCanonical = searchParams.get('preferCanonical') === 'true';

    // 1. Si no se solicita un documento específico, devolver el catálogo completo
    if (!requestedName) {
      if (!fs.existsSync(DOCS_DIR)) {
        return NextResponse.json({ error: 'Directorio docs no encontrado' }, { status: 404 });
      }

      const allFiles = fs.readdirSync(DOCS_DIR);
      const mdFiles = allFiles.filter((f) => f.endsWith('.md'));

      const vigentes: Array<{
        name: string;
        title: string;
        size: number;
        lastModified: string;
      }> = [];

      const archivados: Array<{
        name: string;
        originalName: string;
        title: string;
        size: number;
        lastModified: string;
        replacedBy?: string;
      }> = [];

      for (const fileName of mdFiles) {
        const filePath = path.join(DOCS_DIR, fileName);
        const stats = fs.statSync(filePath);

        if (fileName.startsWith('[ARCHIVADO]_')) {
          const originalName = fileName.replace('[ARCHIVADO]_', '');
          const mapped = COMPATIBILITY_MAP[originalName];

          archivados.push({
            name: fileName,
            originalName,
            title: originalName.replace('.md', '').replace(/_/g, ' '),
            size: stats.size,
            lastModified: stats.mtime.toISOString(),
            replacedBy: mapped ? mapped.canonicalName : undefined,
          });
        } else {
          vigentes.push({
            name: fileName,
            title: fileName.replace('.md', '').replace(/_/g, ' '),
            size: stats.size,
            lastModified: stats.mtime.toISOString(),
          });
        }
      }

      return NextResponse.json({
        total: mdFiles.length,
        totalVigentes: vigentes.length,
        totalArchivados: archivados.length,
        vigentes,
        archivados,
        compatibilityMap: COMPATIBILITY_MAP,
      });
    }

    // 2. Si se solicita un documento específico, resolverlo con compatibilidad inteligente
    let targetFileName = path.basename(requestedName);

    // Si el usuario prefiere la versión canónica vigente y existe un mapeo para el nombre anterior
    if (autoRedirectToCanonical && COMPATIBILITY_MAP[targetFileName]) {
      targetFileName = COMPATIBILITY_MAP[targetFileName].canonicalName;
    }

    let filePath = path.join(DOCS_DIR, targetFileName);

    // Si no existe directamente, comprobar si es un nombre previo que fue archivado con [ARCHIVADO]_
    if (!fs.existsSync(filePath)) {
      if (COMPATIBILITY_MAP[targetFileName]) {
        const archivedTarget = COMPATIBILITY_MAP[targetFileName].archivedName;
        const candidatePath = path.join(DOCS_DIR, archivedTarget);
        if (fs.existsSync(candidatePath)) {
          targetFileName = archivedTarget;
          filePath = candidatePath;
        }
      } else if (!targetFileName.startsWith('[ARCHIVADO]_')) {
        const candidateArchived = `[ARCHIVADO]_${targetFileName}`;
        const candidatePath = path.join(DOCS_DIR, candidateArchived);
        if (fs.existsSync(candidatePath)) {
          targetFileName = candidateArchived;
          filePath = candidatePath;
        }
      }
    }

    // Seguridad: verificar que no haya escape de directorio
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(path.normalize(DOCS_DIR))) {
      return NextResponse.json({ error: 'Acceso no permitido' }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          error: `Documento no encontrado: ${requestedName}`,
          suggestedDocs: Object.keys(COMPATIBILITY_MAP),
        },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    const isArchived = targetFileName.startsWith('[ARCHIVADO]_');
    const originalName = isArchived ? targetFileName.replace('[ARCHIVADO]_', '') : targetFileName;
    const mapped = COMPATIBILITY_MAP[originalName];

    return NextResponse.json({
      name: targetFileName,
      originalName,
      isArchived,
      canonicalReplacement: mapped ? mapped.canonicalName : null,
      size: stats.size,
      lastModified: stats.mtime.toISOString(),
      content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar la documentación', details: error.message },
      { status: 500 }
    );
  }
}
