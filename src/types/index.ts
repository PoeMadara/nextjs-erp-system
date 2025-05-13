
export interface Cliente {
  id: string; // Codigo
  nombre: string;
  nif?: string; // Made optional to align with form
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
  personaContacto?: string;
  terminosPago?: string;
}

export type EmpleadoRole = 'admin' | 'moderator' | 'user';

export interface Empleado {
  id: string; // Codigo
  nombre: string;
  email: string;
  telefono?: string;
  role: EmpleadoRole;
  password?: string; // For mock authentication simulation
  isBlocked?: boolean; // For blocking user access
  avatarColor?: string; // For team activity display
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
  categoria?: string;
  referencia?: string;
}

export type FacturaTipo = 'Compra' | 'Venta';
export type FacturaEstado = 'Pendiente' | 'Pagada' | 'Cancelada';
export type CurrencyCode = 'EUR' | 'USD' | 'GBP'; // Add more as needed

export interface DetalleFactura {
  id?: string; // Auto-increment or UUID, generated. Optional for new lines in form.
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
  moneda: CurrencyCode;
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
  currency: CurrencyCode;
}

export interface RecentOrder {
  id: string;
  supplier: string;
  amount: number;
  date: string;
  currency: CurrencyCode;
}

export interface WarehouseSummary {
  name: string;
  capacity: string;
  items: number;
  location: string;
}

export type TeamActivityModule = "Facturación" | "Compras" | "Productos" | "Clientes" | "Proveedores" | "Empleados" | "Almacén" | "Sistema";
export type TeamActivityAction = "crear" | "modificar" | "eliminar" | "asignar_rol" | "bloquear" | "desbloquear" | "login" | "logout";

export interface TeamActivityLog {
  id: string;
  usuario_id: string;
  nombre_usuario: string;
  avatar_color: string; 
  modulo: TeamActivityModule;
  accion: TeamActivityAction; // The verb, e.g., 'crear', 'modificar'
  descripcion: string; // The detailed, final, potentially localized message
  timestamp: string; // ISO Date string
  entidad_id?: string; 
  entidad_nombre?: string; 
}
