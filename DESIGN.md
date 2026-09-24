---
name: Cordano Operations ERP & ParkOps Design System (macOS Pathway Redux)
logo: '/cordano-logo.png'
colors:
  # Cordano Official Brand Accent
  primary: '#80093A' # Borgoña Sofisticado Cordano
  primary-hover: '#A52C55'
  primary-subtle: 'rgba(128, 9, 58, 0.12)'
  primary-container: '#c6456d'
  
  # Base Dual Theme & Apple Surfaces
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#edeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  
  # Text
  text-primary: '#1D1D1F'
  text-secondary: '#515154'
  on-surface: '#1a1c1d'
  on-surface-variant: '#414753'
  
  # Semantic Parking Status (Serrano 447)
  status-available: '#10B981' # Verde Esmeralda
  status-occupied: '#64748B'  # Gris Pizarra
  status-reserved: '#F59E0B'  # Ámbar
  status-subscriber: '#3B82F6' # Azul Sistema
  status-pmr: '#06B6D4'       # Cian Movilidad Reducida (Ley 20.422)
  status-ev: '#8B5CF6'        # Violeta Carga Eléctrica
  status-overstay: '#EF4444'   # Rojo Carmesí Alerta
  
  # Auditoría y Finanzas
  audit-approved: '#10B981'   # Verde para descuentos autorizados
  audit-warning: '#EF4444'    # Rojo para recargos, tickets perdidos y fugas
  
typography:
  font-primary: 'Manrope, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
  font-mono: 'IBM Plex Mono, Geist Mono, "SF Mono", monospace'
  
  headline-xl:
    fontFamily: Manrope, sans-serif
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope, sans-serif
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Manrope, sans-serif
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope, sans-serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Manrope, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono-lg:
    fontFamily: IBM Plex Mono, monospace
    fontSize: 28px
    fontWeight: '600'
    letterSpacing: 0.04em
    fontVariantNumeric: tabular-nums
  data-mono-md:
    fontFamily: IBM Plex Mono, monospace
    fontSize: 16px
    fontWeight: '550'
    letterSpacing: 0.02em
    fontVariantNumeric: tabular-nums

components:
  # Pill & Rounded macOS Buttons
  button-primary:
    height: 48px
    borderRadius: 999px # Pill-shaped
    background: '#80093A'
    hoverBackground: '#A52C55'
    color: '#FFFFFF'
    fontWeight: '600'
    fontSize: 14px
    padding: '0 24px'
  button-garita:
    height: 48px
    borderRadius: 14px
    background: '#1A1C1D'
    hoverBackground: '#000000'
    color: '#FFFFFF'
    fontWeight: '600'
    fontSize: 14px
---

# Design Tokens Oficiales: Cordano Operations ERP

Este archivo define la especificación de diseño oficial aprobada para el proyecto ParkOps Cordano, combinando el logotipo corporativo de Cordano Inversiones Inmobiliarias Ltda., el acento Borgoña (`#80093A`), las superficies minimalistas macOS y el código semántico de estacionamiento para Serrano 447.
