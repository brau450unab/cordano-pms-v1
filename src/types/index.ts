export type VehicleType = 'auto' | 'camioneta' | 'moto';

// Máquina de Estados Canónica de 4 Fases
export type TicketStatus = 'CREADO' | 'IN_PARKING' | 'PAGADO' | 'ENTREGADO' | 'ANULADO' | 'ACTIVO';

export type PaymentMethod = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';

export type IncidenceType = 
  | 'FUGA' 
  | 'DESCUENTO' 
  | 'SOBRECARGO' 
  | 'MULTA_EXTRAVIO' 
  | 'COBRO_PARCIAL' 
  | 'ANULACION_ERROR';

export interface Ticket {
  id_ticket: string; // TKT-AAAAMMDD-T0X-XXXX o TKT-AAAAMMDD-T0X-XXXXO
  patente: string;
  is_foreign_plate?: boolean;
  vehiculo_tipo: VehicleType;
  slot_numero: number;
  slot_codigo?: string;
  fecha_hora_ingreso: string;
  fecha_hora_salida?: string;
  duracion_total_minutos?: number;
  monto_total_cobrado?: number;
  monto_original_calculado?: number;
  estado_ticket: TicketStatus;
  driver_name?: string;
  driver_phone?: string;
  driver_email?: string;
  service_type?: 'TRANSITORIO' | 'NOCHE' | 'CONVENIO';
  metodo_pago?: PaymentMethod;
  monto_entregado?: number;
  vuelto?: number;
  tarifa_por_minuto: number;
  tiempo_gracia_minutos: number;
  is_offline?: boolean;
  sufijo_offline?: string;
  reprint_count: number;
  observaciones?: string;
  incidencia?: IncidenceType;
  descuento_aplicado?: number;
  recargo_multa?: number;
  pin_autorizador?: string;
}

export type SlotStatus = 'DISPONIBLE' | 'OCUPADO' | 'RESERVADO' | 'MANTENCION';

export type SlotType = 'NORMAL' | 'PMR' | 'ELECTRICO' | 'SOBRECUPO';

export interface ParkingSlot {
  id: number;
  codigo: string; // A-01 a A-15, B-16 a B-30, o SOBRECUPO-XX
  sector: 'A' | 'B' | 'SOBRECUPO';
  tipo: SlotType;
  estado: SlotStatus;
  ticket_actual?: Ticket;
}

export interface CashDenominations {
  b20000: number;
  b10000: number;
  b5000: number;
  b2000: number;
  b1000: number;
  monedas: number;
}

export interface Shift {
  id_turno: string; // SHF-timestamp
  id_operador: string;
  nombre_operador: string;
  monto_inicial_caja: number;
  desglose_efectivo?: CashDenominations;
  monto_declarado_efectivo?: number;
  monto_declarado_tarjeta?: number;
  monto_declarado_transferencia?: number;
  monto_esperado_efectivo?: number;
  monto_esperado_tarjeta?: number;
  monto_esperado_transferencia?: number;
  monto_esperado_total?: number;
  diferencia?: number;
  estado: 'ABIERTO' | 'CERRADO';
  fecha_apertura: string;
  fecha_cierre?: string;
  total_tickets_emitidos: number;
  total_tickets_cobrados: number;
  total_fugas?: number;
  total_descuentos?: number;
  hash_sellado?: string;
}

export type AuditColorTag = 'VERDE' | 'ROJO' | 'AZUL' | 'GRIS';

export interface AuditLog {
  id_auditoria: string;
  accion: string;
  tipo_evento?: IncidenceType | 'CIERRE' | 'APERTURA' | 'REIMPRESION' | 'SISTEMA';
  color_tag?: AuditColorTag;
  id_usuario: string;
  nombre_usuario: string;
  fecha_hora: string;
  motivo?: string;
  autorizador_pin?: string;
  metadatos?: Record<string, any>;
}

export interface CloudRunConnectionInfo {
  projectId: string;
  projectNumber: string;
  region: string;
  serviceName: string;
  serviceUrl?: string;
  existingAppUrl?: string;
  status: 'ONLINE' | 'STANDALONE_READY' | 'CONFIGURED';
}
