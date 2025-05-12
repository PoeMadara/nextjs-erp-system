
import type { Cliente, Proveedor, Empleado, Producto, Almacen, Factura, DetalleFactura } from '@/types';

let clientes: Cliente[] = [
  { id: 'CLI001', nombre: 'Juan Pérez', nif: '12345678A', direccion: 'Calle Falsa 123', poblacion: 'Ciudad Real', telefono: '926111222', email: 'juan.perez@example.com' },
  { id: 'CLI002', nombre: 'Ana López', nif: '87654321B', direccion: 'Avenida Principal 45', poblacion: 'Miguelturra', telefono: '926333444', email: 'ana.lopez@example.com' },
];

let proveedores: Proveedor[] = [
  { id: 'PRO001', nombre: 'Suministros Informáticos SL', nif: 'B12345678', direccion: 'Polígono Industrial La Estrella, Nave 10', poblacion: 'Argamasilla', telefono: '926555666', email: 'pedidos@suministrosinfo.com' },
  { id: 'PRO002', nombre: 'Material Oficina Global', nif: 'A87654321', direccion: 'Calle Comercio 7', poblacion: 'Valdepeñas', telefono: '926777888', email: 'ventas@materialoficina.com' },
];

let empleados: Empleado[] = [
  { id: 'EMP001', nombre: 'Admin ERP', email: 'admin@example.com', telefono: '600123123' },
  { id: 'EMP002', nombre: 'Laura García', email: 'laura.garcia@example.com', telefono: '600987654' },
];

let almacenes: Almacen[] = [
  { id: 'ALM001', nombre: 'Almacén Central', ubicacion: 'Calle Logística 1, Polígono Central' },
  { id: 'ALM002', nombre: 'Almacén Tienda', ubicacion: 'Trastienda, Calle Comercial 5' },
];

let productos: Producto[] = [
  { id: 'PROD001', nombre: 'Portátil Modelo X', descripcion: 'Portátil 15 pulgadas, 16GB RAM, 512GB SSD', precioCompra: 600.00, precioVenta: 899.99, iva: 21.00, stock: 50 },
  { id: 'PROD002', nombre: 'Monitor 24 pulgadas', descripcion: 'Monitor LED Full HD', precioCompra: 120.00, precioVenta: 179.50, iva: 21.00, stock: 120 },
  { id: 'PROD003', nombre: 'Teclado Mecánico RGB', descripcion: 'Teclado mecánico con retroiluminación RGB', precioCompra: 45.00, precioVenta: 79.90, iva: 21.00, stock: 75 },
  { id: 'PROD004', nombre: 'Ratón Inalámbrico Ergo', descripcion: 'Ratón ergonómico inalámbrico', precioCompra: 20.00, precioVenta: 35.00, iva: 21.00, stock: 200 },
];

let facturas: Factura[] = [
  { 
    id: 'FV2024-00001', fecha: '2024-05-10', tipo: 'Venta', clienteId: 'CLI001', empleadoId: 'EMP001', almacenId: 'ALM001', 
    baseImponible: 179.50, totalIva: 37.69, totalFactura: 217.19, estado: 'Pagada',
    detalles: [
      { productoId: 'PROD002', productoNombre: 'Monitor 24 pulgadas', cantidad: 1, precioUnitario: 179.50, porcentajeIva: 21.00, subtotal: 179.50, subtotalConIva: 217.195 }
    ],
    clienteNombre: 'Juan Pérez', empleadoNombre: 'Admin ERP'
  },
  { 
    id: 'FC2024-00001', fecha: '2024-06-15', tipo: 'Compra', proveedorId: 'PRO001', empleadoId: 'EMP002', almacenId: 'ALM001', 
    baseImponible: 600.00, totalIva: 126.00, totalFactura: 726.00, estado: 'Pendiente',
    detalles: [
      { productoId: 'PROD001', productoNombre: 'Portátil Modelo X', cantidad: 1, precioUnitario: 600.00, porcentajeIva: 21.00, subtotal: 600.00, subtotalConIva: 726.00 }
    ],
    proveedorNombre: 'Suministros Informáticos SL', empleadoNombre: 'Laura García'
  },
];


// Helper to generate next ID
const generateId = (prefix: string, currentItems: {id: string}[]) => {
  const maxNum = currentItems.reduce((max, item) => {
    const numStr = item.id.replace(prefix, '');
    // Ensure numStr is not empty and contains only digits before parsing
    if (numStr && /^\d+$/.test(numStr)) {
        const num = parseInt(numStr, 10);
        return Math.max(max, num);
    }
    return max;
  }, 0);
  return `${prefix}${(maxNum + 1).toString().padStart(3, '0')}`;
};


// Clientes CRUD
export const getClientes = async (): Promise<Cliente[]> => [...clientes];
export const getClienteById = async (id: string): Promise<Cliente | undefined> => clientes.find(c => c.id === id);
export const addCliente = async (cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
  const newCliente = { ...cliente, id: generateId('CLI', clientes) };
  clientes.push(newCliente);
  return newCliente;
};
export const updateCliente = async (id: string, updates: Partial<Cliente>): Promise<Cliente | null> => {
  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) return null;
  clientes[index] = { ...clientes[index], ...updates };
  return clientes[index];
};
export const deleteCliente = async (id: string): Promise<boolean> => {
  const initialLength = clientes.length;
  clientes = clientes.filter(c => c.id !== id);
  return clientes.length < initialLength;
};

// Proveedores CRUD (similar structure, simplified for brevity)
export const getProveedores = async (): Promise<Proveedor[]> => [...proveedores];
export const getProveedorById = async (id: string): Promise<Proveedor | undefined> => proveedores.find(p => p.id === id);
export const addProveedor = async (proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor> => {
  const newProveedor = { ...proveedor, id: generateId('PRO', proveedores) };
  proveedores.push(newProveedor);
  return newProveedor;
};
export const updateProveedor = async (id: string, updates: Partial<Proveedor>): Promise<Proveedor | null> => {
  const index = proveedores.findIndex(p => p.id === id);
  if (index === -1) return null;
  proveedores[index] = { ...proveedores[index], ...updates };
  return proveedores[index];
};
export const deleteProveedor = async (id: string): Promise<boolean> => {
   const initialLength = proveedores.length;
   proveedores = proveedores.filter(p => p.id !== id);
   return proveedores.length < initialLength;
};

// Empleados CRUD
export const getEmpleados = async (): Promise<Empleado[]> => [...empleados];
export const getEmpleadoById = async (id: string): Promise<Empleado | undefined> => empleados.find(e => e.id === id);
export const getEmpleadoByEmail = async (email: string): Promise<Empleado | undefined> => empleados.find(e => e.email.toLowerCase() === email.toLowerCase());

export const addEmpleado = async (empleado: Omit<Empleado, 'id'>): Promise<Empleado> => {
  const newEmpleado = { ...empleado, id: generateId('EMP', empleados) };
  empleados.push(newEmpleado);
  return newEmpleado;
};
export const updateEmpleado = async (id: string, updates: Partial<Empleado>): Promise<Empleado | null> => {
  const index = empleados.findIndex(e => e.id === id);
  if (index === -1) return null;
  empleados[index] = { ...empleados[index], ...updates };
  return empleados[index];
};
export const deleteEmpleado = async (id: string): Promise<boolean> => {
    const initialLength = empleados.length;
    empleados = empleados.filter(e => e.id !== id);
    return empleados.length < initialLength;
};

// Productos CRUD
export const getProductos = async (): Promise<Producto[]> => [...productos];
export const getProductoById = async (id: string): Promise<Producto | undefined> => productos.find(p => p.id === id);
export const addProducto = async (producto: Omit<Producto, 'id'>): Promise<Producto> => {
  const newProducto = { ...producto, id: generateId('PROD', productos) };
  productos.push(newProducto);
  return newProducto;
};
export const updateProducto = async (id: string, updates: Partial<Producto>): Promise<Producto | null> => {
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) return null;
  productos[index] = { ...productos[index], ...updates };
  return productos[index];
};
export const deleteProducto = async (id: string): Promise<boolean> => {
    const initialLength = productos.length;
    productos = productos.filter(p => p.id !== id);
    return productos.length < initialLength;
};


// Almacenes CRUD
export const getAlmacenes = async (): Promise<Almacen[]> => [...almacenes];
export const getAlmacenById = async (id: string): Promise<Almacen | undefined> => almacenes.find(a => a.id === id);
export const addAlmacen = async (almacen: Omit<Almacen, 'id'>): Promise<Almacen> => {
  const newAlmacen = { ...almacen, id: generateId('ALM', almacenes) };
  almacenes.push(newAlmacen);
  return newAlmacen;
};
export const updateAlmacen = async (id: string, updates: Partial<Almacen>): Promise<Almacen | null> => {
  const index = almacenes.findIndex(a => a.id === id);
  if (index === -1) return null;
  almacenes[index] = { ...almacenes[index], ...updates };
  return almacenes[index];
};
export const deleteAlmacen = async (id: string): Promise<boolean> => {
    const initialLength = almacenes.length;
    almacenes = almacenes.filter(a => a.id !== id);
    return almacenes.length < initialLength;
};

// Facturas (Read-only for now for simplicity in mock)
export const getFacturas = async (): Promise<Factura[]> => {
  // Enrich with names for display
  return facturas.map(f => ({
    ...f,
    clienteNombre: f.clienteId ? clientes.find(c=>c.id === f.clienteId)?.nombre : undefined,
    proveedorNombre: f.proveedorId ? proveedores.find(p=>p.id === f.proveedorId)?.nombre : undefined,
    empleadoNombre: empleados.find(e=>e.id === f.empleadoId)?.nombre,
    detalles: f.detalles.map(d => ({
      ...d,
      productoNombre: productos.find(p=>p.id === d.productoId)?.nombre
    }))
  }));
};

export const getFacturaById = async (id: string): Promise<Factura | undefined> => {
  const factura = facturas.find(f => f.id === id);
  if (!factura) return undefined;
  return {
    ...factura,
    clienteNombre: factura.clienteId ? clientes.find(c=>c.id === factura.clienteId)?.nombre : undefined,
    proveedorNombre: factura.proveedorId ? proveedores.find(p=>p.id === factura.proveedorId)?.nombre : undefined,
    empleadoNombre: empleados.find(e=>e.id === factura.empleadoId)?.nombre,
    detalles: factura.detalles.map(d => ({
      ...d,
      productoNombre: productos.find(p=>p.id === d.productoId)?.nombre
    }))
  };
};

// For dashboard summaries
export const getRecentSales = async (limit: number = 3) => {
  return facturas
    .filter(f => f.tipo === 'Venta')
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, limit)
    .map(f => ({
      id: f.id,
      customer: f.clienteNombre || clientes.find(c => c.id === f.clienteId)?.nombre || 'N/A',
      amount: f.totalFactura,
      date: f.fecha,
    }));
};

export const getRecentOrders = async (limit: number = 2) => {
   return facturas
    .filter(f => f.tipo === 'Compra')
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, limit)
    .map(f => ({
      id: f.id,
      supplier: f.proveedorNombre || proveedores.find(p => p.id === f.proveedorId)?.nombre || 'N/A',
      amount: f.totalFactura,
      date: f.fecha,
    }));
};

export const getWarehouseStatus = async () => {
  return almacenes.map(alm => ({
    name: alm.nombre,
    capacity: `${Math.floor(Math.random() * 40) + 50}%`, // Random capacity for demo
    items: productos.reduce((sum, p) => sum + p.stock, 0) / almacenes.length, // simplified item count
    location: alm.ubicacion || 'N/A',
  }));
};
