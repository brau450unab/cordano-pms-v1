# CORDANO PMS V1 — Sistema de Gestión de Estacionamientos
**ParkOps Iquique (Serrano 447)**

Conectado y preparado para **Google Cloud Run** en el proyecto:
- **ID de Proyecto GCP**: `gen-lang-client-0862587160`
- **Número de Proyecto**: `349577440002`
- **Región**: `us-west1`
- **Servicio Cloud Run (Independiente)**: `cordano-pms-v1`

---

## 🚀 Arquitectura y Principio de Independencia en Cloud Run

Este proyecto está configurado para desplegarse como un **servicio independiente** en Google Cloud Run. Esto significa:
1. **Aislamiento Total**: No altera ni sobrescribe ninguna otra aplicación o servicio que ya esté corriendo en tu proyecto `gen-lang-client-0862587160`.
2. **URL y Ciclo de Vida Propios**: Obtiene su propia URL HTTPS gestionada por Google (ej. `https://cordano-pms-v1-349577440002.us-west1.run.app`).
3. **Escalado Automático a Cero**: Costo eficiente (escala de 0 a 10 instancias según demanda).
4. **Contenedor Standalone**: Empaquetado optimizado con Node 20 y Next.js Standalone.

---

## 📋 Módulos Implementados

1. **POS de Entrada (Check-In)**:
   - Validación Anti-Passback en memoria (<100ms) para evitar cobros dobles o ingresos duplicados.
   - SLA operativo < 10 segundos.
   - Emisión de ticket canónico: `TKT-AAAAMMDD-T0X-XXXX`.
   - Envío de ticket digital vía WhatsApp.

2. **POS de Salida (Check-Out)**:
   - Cálculo automático de permanencia según tarifas ($35/min auto, $45/min camioneta, $25/min moto).
   - Período de gracia inicial de 10 minutos (cobro $0).
   - Calculador de Vuelto asistido para evitar descuadres en efectivo.
   - Medios de pago: Efectivo, Tarjeta, Transferencia.

3. **Layout en Tiempo Real (30 Slots)**:
   - Grilla interactiva de los 30 espacios divididos en Sector A (1 a 15) y Sector B (16 a 30).
   - Estados: Verde (Libre) / Rojo (Ocupado con patente y tiempo transcurrido).

4. **Cierre de Caja Ciego (Shift Close)**:
   - El operador declara físicamente el dinero contado sin conocer el monto esperado por el sistema.
   - Cálculo instantáneo de descuadre (sobrante / faltante / cuadrada).

5. **Bitácora Inmutable de Auditoría**:
   - Registro secuencial con ID único de cada apertura, ingreso, salida y cierre.

6. **Panel y Conexión Cloud Run**:
   - Diagnóstico de conexión en tiempo real.
   - Herramienta para probar conectividad y latencia con tu aplicación existente de Cloud Run.

---

## 📚 Documentación del Proyecto

El repositorio cuenta con una estructura documental estandarizada en `/docs`:
- **Documentación Vigente (Versión 2.0 Canónica)**:
  - [`PRD_SISTEMA_DE_PARKING.md`](file:///c:/Users/BraulioAM/OneDrive%20-%20UNIVERSIDAD%20ANDRES%20BELLO/PROYECTOS%20ANTIGRAVITY/NUEVO%20PMS%20CORDANO/docs/PRD_SISTEMA_DE_PARKING.md): Requerimientos de producto, flujo de 5 fases, caja ciega y perfiles.
  - [`PARKOPS_ESPECIFICACIONES_TECNICAS_V2.md`](file:///c:/Users/BraulioAM/OneDrive%20-%20UNIVERSIDAD%20ANDRES%20BELLO/PROYECTOS%20ANTIGRAVITY/NUEVO%20PMS%20CORDANO/docs/PARKOPS_ESPECIFICACIONES_TECNICAS_V2.md): Microservicio Cloud Run, contratos de tickets, sellos SHA-256 e IndexedDB.
  - [`ESPECIFICACION_DISENO_FLUJO_Y_LANDING.md`](file:///c:/Users/BraulioAM/OneDrive%20-%20UNIVERSIDAD%20ANDRES%20BELLO/PROYECTOS%20ANTIGRAVITY/NUEVO%20PMS%20CORDANO/docs/ESPECIFICACION_DISENO_FLUJO_Y_LANDING.md): Especificación UI/UX macOS, bi-panel 40/60 y modales `backdrop-blur`.
  - [`MAPA_DE_SITIO_Y_ARQUITECTURA.md`](file:///c:/Users/BraulioAM/OneDrive%20-%20UNIVERSIDAD%20ANDRES%20BELLO/PROYECTOS%20ANTIGRAVITY/NUEVO%20PMS%20CORDANO/docs/MAPA_DE_SITIO_Y_ARQUITECTURA.md): Diagrama de rutas, roles RBAC y accesos.
  - [`INDICE_DOCUMENTACION.md`](file:///c:/Users/BraulioAM/OneDrive%20-%20UNIVERSIDAD%20ANDRES%20BELLO/PROYECTOS%20ANTIGRAVITY/NUEVO%20PMS%20CORDANO/docs/INDICE_DOCUMENTACION.md): Índice maestro de documentos vigentes y archivo histórico.
- **Archivo Histórico (`[ARCHIVADO]_`)**:
  - Las versiones anteriores y borradores preliminares han sido archivados con el prefijo `[ARCHIVADO]_` para fines de trazabilidad.
  - API de acceso programático y resolución inteligente: `GET /api/docs`.

---

## 🛠️ Ejecución Local

Para ejecutar la aplicación localmente en tu equipo:

```bash
# Iniciar servidor de desarrollo (puerto 3000)
npm run dev

# Abrir en el navegador:
http://localhost:3000
```

---

## ☁️ Opciones de Despliegue hacia Google Cloud Run

### Opción 1: Despliegue con `gcloud` CLI (Automático)
Si tienes instalado Google Cloud SDK:
```bash
# Simplemente ejecuta el archivo incluido:
deploy-cloudrun.bat
```
O mediante el comando directo:
```bash
gcloud run deploy cordano-pms-v1 \
  --source . \
  --project gen-lang-client-0862587160 \
  --region us-west1 \
  --allow-unauthenticated \
  --port 8080
```

### Opción 2: Despliegue vía Google Cloud Console (Recomendado sin CLI local)
1. Sube este proyecto a tu repositorio de GitHub (ej. `brau450unab/pms_matic` o un nuevo repositorio `cordano-pms-v1`).
2. Ingresa a [Google Cloud Console](https://console.cloud.google.com/run?project=gen-lang-client-0862587160).
3. Selecciona **Crear servicio** (o *Create Service*).
4. Elige **Implementar continuamente desde un repositorio** (Cloud Build).
5. Selecciona el repositorio y la rama `main`.
6. Asigna el nombre de servicio: `cordano-pms-v1`.
7. Región: `us-west1`.
8. ¡Listo! Cloud Run compilará con el `Dockerfile` incluido y publicará la URL de tu aplicación independiente.

### Opción 3: Despliegue con Google Cloud Build
El proyecto ya incluye `cloudbuild.yaml`:
```bash
gcloud builds submit --config cloudbuild.yaml --project gen-lang-client-0862587160
```
