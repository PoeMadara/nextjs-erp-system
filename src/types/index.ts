export interface Cliente {
  id: string; // Codigo
  nombre: string;
  nif: string;
  direccion?: string;
  poblacion?: string;
  telefono?: string;
  email: string;
}

export interface Proveedor {
  id: string; // Codigo
  nombre: string;
  nif: string;
  direccion?: string;
  poblacion?: string;
  telefono?: string;
  email: string;
}

export interface Empleado {
  id: string; // Codigo
  nombre: string;
  email: string;
  telefono?: string;
  // PasswordHash is handled by backend, not stored/managed in frontend state directly for forms typically
}

export interface Almacen {
  id: string; // Codigo
  nombre: string;
  ubicacion?: string;
}

export interface Producto {
  id: string; // Codigo
  nombre: string;
  descripcion?: string;
  precioCompra: number;
  precioVenta: number;
  iva: number; // Percentage e.g., 21 for 21%
  stock: number;
}

export type FacturaTipo = 'Compra' | 'Venta';
export type FacturaEstado = 'Pendiente' | 'Pagada' | 'Cancelada';

export interface DetalleFactura {
  id?: string; // Auto-increment or UUID, generated
  productoId: string;
  productoNombre?: string; // For display convenience
  cantidad: number;
  precioUnitario: number;
  porcentajeIva: number;
  subtotal?: number; // Calculated: cantidad * precioUnitario
  subtotalConIva?: number; // Calculated
}

export interface Factura {
  id: string; // Numero
  fecha: string; // ISO Date string e.g. "2024-05-10"
  tipo: FacturaTipo;
  clienteId?: string;
  proveedorId?: string;
  empleadoId: string;
  almacenId?: string;
  baseImponible: number;
  totalIva: number;
  totalFactura: number;
  estado: FacturaEstado;
  detalles: DetalleFactura[];
  // For display purposes
  clienteNombre?: string;
  proveedorNombre?: string;
  empleadoNombre?: string;
}

// For dashboard summaries
export interface RecentSale {
  id: string;
  customer: string;
  amount: number;
  date: string;
}

export interface RecentOrder {
  id: string;
  supplier: string;
  amount: number;
  date: string;
}

export interface WarehouseSummary {
  name: string;
  capacity: string;
  items: number;
  location: string;
}
