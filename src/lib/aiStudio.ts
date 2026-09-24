import { GoogleGenAI, Type } from '@google/genai';

/**
 * Cliente Integrado de Google AI Studio / Gemini API para ParkOps Cordano
 * Ubicación: Serrano 447, Iquique, Chile
 */

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY || '';

export const getAiStudioClient = () => {
  if (!apiKey) {
    console.warn('[AI Studio] GEMINI_API_KEY no configurada en las variables de entorno.');
  }
  return new GoogleGenAI({ apiKey: apiKey || 'demo-key' });
};

export interface LprOcrResult {
  plate: string;
  format: 'NEW_CHILE' | 'OLD_CHILE' | 'MOTO_CHILE' | 'FOREIGN' | 'UNKNOWN';
  confidence: number;
  vehicleTypeHint: 'AUTO' | 'CAMIONETA' | 'MOTO' | 'OTRO';
  colorHint?: string;
  makeModelHint?: string;
}

export interface DamageInspectionResult {
  hasDamage: boolean;
  damages: Array<{
    location: string;
    type: 'RAYON' | 'ABOLLADURA' | 'ROTO' | 'PARACHOQUES' | 'OTRO';
    severity: 'LEVE' | 'MODERADO' | 'GRAVE';
    description: string;
  }>;
  summaryText: string;
}

export interface ShiftAuditResult {
  status: 'OPTIMO' | 'OBSERVACION' | 'DESCUADRE_CRITICO';
  discrepancyClp: number;
  confidenceScore: number;
  anomaliesDetected: string[];
  executiveSummary: string;
  recommendations: string[];
}

/**
 * 1. Reconocimiento de Patentes (ANPR / LPR) desde imagen con Google AI Studio
 */
export async function recognizePlateFromImage(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<LprOcrResult> {
  // Limpiar encabezado data URL si viene presente
  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  if (!apiKey) {
    // Modo de contingencia / mock si no hay API key configurada
    return {
      plate: 'KJ-89-21',
      format: 'NEW_CHILE',
      confidence: 0.98,
      vehicleTypeHint: 'AUTO',
      colorHint: 'Gris Plata',
      makeModelHint: 'Toyota Yaris'
    };
  }

  try {
    const ai = getAiStudioClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType
              }
            },
            {
              text: `Eres el subsistema de reconocimiento óptico de patentes (ANPR/LPR) para el estacionamiento ParkOps Cordano en Serrano 447, Iquique, Chile.
Analiza la imagen adjunta del vehículo y extrae:
1. Matrícula / Patente en mayúsculas y formato estándar chileno (ej: "ABCD12" -> "AB-CD-12" o "AB1234" -> "AB-12-34").
2. Formato: NEW_CHILE (4 letras + 2 dígitos), OLD_CHILE (2 letras + 4 dígitos), MOTO_CHILE, FOREIGN o UNKNOWN.
3. Confianza de 0 a 1.
4. Tipo de vehículo sugerido: AUTO ($25/min), CAMIONETA ($30/min), MOTO ($15/min) u OTRO.
5. Color estimado y marca/modelo si es visible.`
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plate: { type: Type.STRING, description: 'Patente en formato XX-YY-ZZ o XX-YY-99' },
            format: { type: Type.STRING, enum: ['NEW_CHILE', 'OLD_CHILE', 'MOTO_CHILE', 'FOREIGN', 'UNKNOWN'] },
            confidence: { type: Type.NUMBER, description: 'Nivel de confianza de 0 a 1' },
            vehicleTypeHint: { type: Type.STRING, enum: ['AUTO', 'CAMIONETA', 'MOTO', 'OTRO'] },
            colorHint: { type: Type.STRING },
            makeModelHint: { type: Type.STRING }
          },
          required: ['plate', 'format', 'confidence', 'vehicleTypeHint']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as LprOcrResult;
    }
    throw new Error('Respuesta vacía de Google AI Studio');
  } catch (error) {
    console.error('[AI Studio] Error en recognizePlateFromImage:', error);
    return {
      plate: 'DESCONOCIDA',
      format: 'UNKNOWN',
      confidence: 0,
      vehicleTypeHint: 'AUTO'
    };
  }
}

/**
 * 2. Inspección Visual de Daños Preexistentes al Ingresar
 */
export async function inspectVehicleDamage(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<DamageInspectionResult> {
  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  if (!apiKey) {
    return {
      hasDamage: false,
      damages: [],
      summaryText: 'Sin daños visibles preexistentes detectados en carrocería.'
    };
  }

  try {
    const ai = getAiStudioClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType
              }
            },
            {
              text: `Actúa como perito de recepción de vehículos para ParkOps Cordano (Serrano 447, Iquique).
Examina minuciosamente la carrocería, parachoques, vidrios y espejos del vehículo ingresando.
Detecta cualquier daño preexistente (rayones, abolladuras, focos rotos, pintura saltada) para dejar constancia legal en el ticket térmico y evitar reclamaciones falsas al estacionamiento.
Si el vehículo está en buenas condiciones, indica hasDamage = false y un texto de resumen positivo.`
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasDamage: { type: Type.BOOLEAN },
            damages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  location: { type: Type.STRING, description: 'Ubicación física en el auto, ej: Puerta delantera derecha' },
                  type: { type: Type.STRING, enum: ['RAYON', 'ABOLLADURA', 'ROTO', 'PARACHOQUES', 'OTRO'] },
                  severity: { type: Type.STRING, enum: ['LEVE', 'MODERADO', 'GRAVE'] },
                  description: { type: Type.STRING }
                },
                required: ['location', 'type', 'severity', 'description']
              }
            },
            summaryText: { type: Type.STRING, description: 'Texto conciso para imprimir en el ticket térmico' }
          },
          required: ['hasDamage', 'damages', 'summaryText']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DamageInspectionResult;
    }
    throw new Error('Respuesta vacía');
  } catch (error) {
    console.error('[AI Studio] Error en inspectVehicleDamage:', error);
    return {
      hasDamage: false,
      damages: [],
      summaryText: 'Sin daños visibles registrados.'
    };
  }
}

/**
 * 3. Auditoría Inteligente de Arqueo Ciego y Turnos de Caja
 */
export async function auditShiftReport(shiftData: {
  operatorName: string;
  openedAt: string;
  closedAt: string;
  initialCash: number;
  systemCash: number;
  physicalCashDeclared: number;
  cardPosTotal: number;
  transferTotal: number;
  totalTransactions: number;
  discountsAppliedCount: number;
  lostTicketsCount: number;
  discountsJustifications?: string[];
}): Promise<ShiftAuditResult> {
  const discrepancy = shiftData.physicalCashDeclared - shiftData.systemCash;

  if (!apiKey) {
    return {
      status: discrepancy === 0 ? 'OPTIMO' : Math.abs(discrepancy) > 5000 ? 'DESCUADRE_CRITICO' : 'OBSERVACION',
      discrepancyClp: discrepancy,
      confidenceScore: 0.95,
      anomaliesDetected: discrepancy !== 0 ? [`Diferencia de $${discrepancy} CLP entre conteo físico y sistema.`] : [],
      executiveSummary: `Turno de ${shiftData.operatorName} auditado con ${shiftData.totalTransactions} transacciones. Cuadre ${discrepancy === 0 ? 'perfecto' : 'con observación'}.`,
      recommendations: ['Registrar depósito bancario de efectivo', 'Archivar Reporte Z firmado']
    };
  }

  try {
    const ai = getAiStudioClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Eres el auditor financiero automatizado de Cordano Inversiones Inmobiliarias Ltda. para el estacionamiento Serrano 447, Iquique.
Analiza la siguiente información de cierre de turno de caja ciega:
${JSON.stringify(shiftData, null, 2)}

Reglas de Negocio:
1. El rol de Administrador no puede operar caja. Solo cajeros autorizados.
2. Descuentos requieren PIN individual y justificación >10 caracteres.
3. Descuadre en efectivo: si Diferencia = 0 es ÓPTIMO; si Diferencia está entre -$5.000 y +$5.000 es OBSERVACIÓN; si supera $5.000 es DESCUADRE_CRITICO.
4. Identifica anomalías (tickets extraviados reiterados, descuentos injustificados, discrepancias de efectivo).
5. Genera un resumen ejecutivo y recomendaciones concretas para la administración.`
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['OPTIMO', 'OBSERVACION', 'DESCUADRE_CRITICO'] },
            discrepancyClp: { type: Type.NUMBER },
            confidenceScore: { type: Type.NUMBER },
            anomaliesDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
            executiveSummary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['status', 'discrepancyClp', 'confidenceScore', 'anomaliesDetected', 'executiveSummary', 'recommendations']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ShiftAuditResult;
    }
    throw new Error('Respuesta vacía');
  } catch (error) {
    console.error('[AI Studio] Error en auditShiftReport:', error);
    return {
      status: discrepancy === 0 ? 'OPTIMO' : 'OBSERVACION',
      discrepancyClp: discrepancy,
      confidenceScore: 0.8,
      anomaliesDetected: [`Diferencia de $${discrepancy} CLP`],
      executiveSummary: `Auditoría completada en modo contingencia para ${shiftData.operatorName}.`,
      recommendations: ['Revisar arqueo físico con supervisor']
    };
  }
}

/**
 * 4. Asistente Operativo de Garita y Base de Conocimiento SOP
 */
export async function askGaritaAssistant(query: string, operationalContext?: any): Promise<string> {
  if (!apiKey) {
    return `[Asistente ParkOps] Protocolo para '${query}': En Serrano 447, los primeros 10 minutos son de gracia. Para cobros por pérdida de ticket se requiere autorización de Administrador. Contacto soporte: +56 9 8421 9904.`;
  }

  try {
    const ai = getAiStudioClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Eres el copiloto de inteligencia operativa de Garita para ParkOps Cordano (Serrano 447, Iquique).
Contexto Operativo Actual:
${operationalContext ? JSON.stringify(operationalContext, null, 2) : '30 Plazas totales, Sector A (01-15) y Sector B (16-30). Tarifa: Auto $25/min, Camioneta $30/min, Moto $15/min. Gracia: 10 min.'}

Instrucciones:
- Responde de forma muy concisa, clara y orientada a la acción inmediata para el operador de garita.
- Si preguntan por contingencia offline, recuerda que el sistema sigue operando en IndexedDB local emitiendo tickets con sufijo 'O'.
- Si preguntan por cobros especiales, recuerda que Pernocta ($8.000) y Convenios ($75.000) se manejan por el submódulo paralelo sin alterar los minutos rotativos.

Pregunta del Operador:
"${query}"`
            }
          ]
        }
      ]
    });

    return response.text || 'Sin respuesta del asistente.';
  } catch (error) {
    console.error('[AI Studio] Error en askGaritaAssistant:', error);
    return 'El asistente de IA se encuentra temporalmente en modo offline. Aplica los protocolos estándar del manual SOP de Serrano 447.';
  }
}
