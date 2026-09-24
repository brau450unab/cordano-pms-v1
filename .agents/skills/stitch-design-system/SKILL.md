---
name: stitch-design-system
description: Google Labs Stitch design system generator and screen builder. Use when creating or updating DESIGN.md tokens, generating UI screens via StitchMCP, or maintaining design tokens across the application.
---

# Stitch Design System: Generación de Pantallas y Tokens con StitchMCP

Esta skill gestiona la creación de sistemas de diseño estructurados en `DESIGN.md` y la invocación de herramientas del servidor MCP `StitchMCP` para generar variantes y prototipos de pantallas de alta fidelidad para **ParkOps Cordano**.

---

## 1. Proyecto Activo en Google Stitch

- **ID del Proyecto**: `12916038623650348087` (Ruta completa: `projects/12916038623650348087`)
- **Título**: `NUEVO PMS CORDANO - ParkOps Iquique`
- **Tipo de Dispositivo**: `DESKTOP` (optimizado para terminales de garita 1080p / 4K)
- **Modo de Color**: `DARK` (Slate `#0F172A` / `#020617` con acento Sky Blue `#0284C7`)

---

## 2. Invocación de Herramientas de StitchMCP

### Generación de Nuevas Pantallas desde Texto:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "generate_screen_from_text",
  Arguments: {
    "projectId": "12916038623650348087",
    "prompt": "Cockpit de Garita para estacionamiento ParkOps en Iquique...",
    "deviceType": "DESKTOP",
    "modelId": "GEMINI_3_8_FLASH"
  }
)
```

### Consulta de Pantallas Generadas:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "list_screens",
  Arguments: {
    "projectId": "projects/12916038623650348087"
  }
)
```

### Actualización de Tokens de Diseño:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "upload_design_md",
  Arguments: {
    "projectId": "12916038623650348087",
    "designMdBase64": "<base64>"
  }
)
```

---

## 3. Tokens Canónicos de ParkOps en `DESIGN.md`

- **Colores de Estado de Plazas**:
  - `status-available`: `#10B981` (Verde Esmeralda)
  - `status-occupied`: `#64748B` (Pizarra)
  - `status-reserved`: `#F59E0B` (Ámbar)
  - `status-subscriber`: `#3B82F6` (Azul)
  - `status-pmr`: `#06B6D4` (Cian)
  - `status-overstay`: `#EF4444` (Rojo Alerta)
- **Tipografía**:
  - `data-mono`: `JetBrains Mono, Fira Code, monospace` (con `tabular-nums` obligatorio para dinero, patentes y cronómetros).
  - `body-md` / `headline-md`: `Inter, sans-serif`.
