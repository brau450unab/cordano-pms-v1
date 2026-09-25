---
name: ParkOps Cordano Design System (Liquid Glass & Titanium Dark Mode)
logo: '/cordano-logo.png'
colors:
  # Cordano Official Brand Accent
  primary: '#80093A' # Borgoña Cordano
  primary-hover: '#A52C55'
  primary-subtle: 'rgba(128, 9, 58, 0.25)'
  primary-container: '#c6456d'
  
  # Obsidian & Liquid Glass Surfaces
  background: '#06080E'
  surface: '#0B0F19'
  surface-dim: '#06080E'
  surface-bright: '#1E293B'
  surface-container-lowest: '#030712'
  surface-container-low: '#0B0F19'
  surface-container: '#111726'
  surface-container-high: '#1E2638'
  surface-container-highest: '#334155'
  
  # Text
  text-primary: '#FFFFFF'
  text-secondary: '#94A3B8'
  on-surface: '#F8FAFC'
  on-surface-variant: '#CBD5E1'
  
  # Semantic Parking Status (Serrano 447)
  status-available: '#10B981' # Verde Esmeralda (#10B981)
  status-occupied: '#64748B'  # Gris Pizarra (#64748B)
  status-reserved: '#F59E0B'  # Ámbar (#F59E0B)
  status-subscriber: '#3B82F6' # Azul Sistema (#3B82F6)
  status-pmr: '#06B6D4'       # Cian Movilidad Reducida (#06B6D4)
  status-ev: '#8B5CF6'        # Violeta Carga Eléctrica (#8B5CF6)
  status-overstay: '#EF4444'   # Rojo Carmesí Alerta (#EF4444)
  
  # Auditoría y Finanzas
  audit-approved: '#10B981'   # Verde para descuentos autorizados
  audit-warning: '#EF4444'    # Rojo para recargos, tickets perdidos y fugas

typography:
  font-primary: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
  font-mono: 'Geist Mono, JetBrains Mono, "SF Mono", monospace'
  
  headline-xl:
    fontFamily: Inter, sans-serif
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter, sans-serif
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter, sans-serif
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter, sans-serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono-lg:
    fontFamily: Geist Mono, monospace
    fontSize: 28px
    fontWeight: '700'
    letterSpacing: 0.04em
    fontVariantNumeric: tabular-nums
  data-mono-md:
    fontFamily: Geist Mono, monospace
    fontSize: 16px
    fontWeight: '600'
    letterSpacing: 0.02em
    fontVariantNumeric: tabular-nums

components:
  # Glass Panel & Rounded macOS Buttons
  glass-panel:
    background: 'rgba(15, 23, 42, 0.45)'
    backdropBlur: '20px'
    border: '1px solid rgba(255, 255, 255, 0.12)'
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
  button-primary:
    height: 48px
    borderRadius: 999px # Pill-shaped
    background: 'linear-gradient(135deg, #80093A 0%, #A52C55 100%)'
    color: '#FFFFFF'
    fontWeight: '700'
    fontSize: 14px
    padding: '0 24px'
  button-macos:
    height: 48px
    borderRadius: 16px
    background: 'rgba(255, 255, 255, 0.06)'
    border: '1px solid rgba(255, 255, 255, 0.14)'
    color: '#FFFFFF'
---

# Design Tokens Oficiales: ParkOps Cordano (Liquid Glass Edition)

Este archivo define la especificación de diseño oficial aprobada para el proyecto ParkOps Cordano, combinando el logotipo corporativo de Cordano Inversiones Inmobiliarias Ltda., el acento Borgoña (`#80093A`), la estética oscura obsidian `#06080E`, los paneles translúcidos de cristal líquido y el código semántico de estacionamiento para Serrano 447.
