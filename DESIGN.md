---
name: ParkOps Cordano Design System V2.0 (macOS Sonoma / Sequoia Enterprise)
logo: '/cordano-logo.png'
colors:
  # Cordano Official Brand Accent
  primary: '#80093A' # Borgoña Cordano
  primary-hover: '#60062B'
  primary-subtle: 'rgba(128, 9, 58, 0.12)'
  primary-container: '#9E1B52'
  
  # macOS Sonoma / Sequoia Enterprise Surfaces (V2.0 Canónica)
  background: '#F9F9FB'
  surface: '#FFFFFF'
  surface-dim: '#F1F5F9'
  surface-bright: '#FFFFFF'
  surface-header-dark: '#1A1C1D'
  border-subtle: '#E2E2E4'
  
  # Text
  text-primary: '#1D1D1F'
  text-secondary: '#64748B'
  on-surface: '#0F172A'
  on-surface-variant: '#475569'
  
  # Semantic Parking Status (Serrano 447 - 30 Plazas + 5 Sobrecupo)
  status-available: '#10B981'  # Verde Esmeralda (#10B981)
  status-occupied: '#64748B'   # Gris Pizarra (#64748B)
  status-reserved: '#F59E0B'   # Ámbar Convenio / Sobrecupo (#F59E0B)
  status-subscriber: '#3B82F6' # Azul Abonado / VIP (#3B82F6)
  status-pmr: '#06B6D4'        # Cian Movilidad Reducida (#06B6D4)
  status-ev: '#8B5CF6'         # Violeta Carga Eléctrica (#8B5CF6)
  status-overstay: '#EF4444'   # Rojo Carmesí Alerta / Sobrestadía (#EF4444)
  
  # Auditoría Antifraude y Finanzas
  audit-approved: '#10B981'    # Verde para descuentos autorizados (PIN Operador)
  audit-warning: '#EF4444'     # Rojo para recargos, tickets perdidos y fugas (PIN Admin)

typography:
  font-primary: 'Geist, Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
  font-mono: 'Geist Mono, JetBrains Mono, "SF Mono", monospace'
  
  headline-xl:
    fontFamily: Geist, Inter, sans-serif
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist, Inter, sans-serif
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist, Inter, sans-serif
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist, Inter, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono-lg:
    fontFamily: Geist Mono, monospace
    fontSize: 28px
    fontWeight: '800'
    letterSpacing: 0.04em
    fontVariantNumeric: tabular-nums
  data-mono-md:
    fontFamily: Geist Mono, monospace
    fontSize: 14px
    fontWeight: '600'
    letterSpacing: 0.02em
    fontVariantNumeric: tabular-nums

components:
  macos-card:
    background: '#FFFFFF'
    border: '1px solid #E2E2E4'
    borderRadius: 24px
    boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.05)'
  modal-backdrop:
    background: 'rgba(15, 23, 42, 0.35)'
    backdropBlur: '16px'
  button-primary:
    height: 48px
    borderRadius: 16px
    background: '#80093A'
    color: '#FFFFFF'
    fontWeight: '700'
    fontSize: 14px
---

# Design System Canónico V2.0: ParkOps Cordano (macOS Sonoma / Sequoia Enterprise)

Especificación visual oficial consolidada para **ParkOps PMS & ERP** de **Cordano Inversiones Inmobiliarias Ltda.** (Serrano 447, Iquique):
- **Superficie Base**: `#F9F9FB` (Alto contraste diurno para operación en garita bajo luz solar de Iquique).
- **Acento Corporativo**: Borgoña Cordano `#80093A` con hover `#60062B`.
- **Menubar Superior & Menú Lateral Colapsable**: Controles semáforo macOS (`#FF5F56`, `#FFBD2E`, `#27C93F`), atajos `F1`–`F9` visibles y estado de sincronización Cloud Run.
- **Popups Centrales (`backdrop-blur-md`)**: Ficha informativa de plaza de solo lectura, Autorización Antifraude con PIN (Verde/Rojo), Arqueo de Caja Ciega y Ticket Térmico 80mm / PDF con doble código (`Code 128` + `QR 2D`).
