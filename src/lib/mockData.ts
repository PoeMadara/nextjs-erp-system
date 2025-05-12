
import type { Cliente, Proveedor, Empleado, Producto, Almacen, Factura, DetalleFactura, EmpleadoRole, FacturaTipo, FacturaEstado, CurrencyCode } from '@/types';

let clientes: Cliente[] = [
  { id: 'CLI001', nombre: 'Juan Pérez', nif: '12345678A', direccion: 'Calle Falsa 123', poblacion: 'Ciudad Real', telefono: '926111222', email: 'juan.perez@example.com' },
  { id: 'CLI002', nombre: 'Ana López', nif: '87654321B', direccion: 'Avenida Principal 45', poblacion: 'Miguelturra', telefono: '926333444', email: 'ana.lopez@example.com' },
];

let proveedores: Proveedor[] = [
  { id: 'PRO001', nombre: 'Suministros Informáticos SL', nif: 'B12345678', direccion: 'Polígono Industrial La Estrella, Nave 10', poblacion: 'Argamasilla', telefono: '926555666', email: 'pedidos@suministrosinfo.com', personaContacto: 'Carlos Duty', terminosPago: '30 días' },
  { id: 'PRO002', nombre: 'Material Oficina Global', nif: 'A87654321', direccion: 'Calle Comercio 7', poblacion: 'Valdepeñas', telefono: '926777888', email: 'ventas@materialoficina.com', personaContacto: 'Lucía Admin', terminosPago: 'Al contado' },
];

let empleados: Empleado[] = [
  // Initial admin will be created on first registration.
];

let almacenes: Almacen[] = [
  { id: 'ALM001', nombre: 'Almacén Central', ubicacion: 'Calle Logística 1, Polígono Central' },
  { id: 'ALM002', nombre: 'Almacén Tienda', ubicacion: 'Trastienda, Calle Comercial 5' },
];

let productos: Producto[] = [
  { id: 'PROD001', nombre: 'Portátil Modelo X', descripcion: 'Portátil 15 pulgadas, 16GB RAM, 512GB SSD', precioCompra: 600.00, precioVenta: 899.99, iva: 21.00, stock: 50, categoria: 'Electrónica', referencia: 'LX15-512'},
  { id: 'PROD002', nombre: 'Monitor 24 pulgadas', descripcion: 'Monitor LED Full HD', precioCompra: 120.00, precioVenta: 179.50, iva: 21.00, stock: 120, categoria: 'Periféricos', referencia: 'MON24-FHD' },
  { id: 'PROD003', nombre: 'Teclado Mecánico RGB', descripcion: 'Teclado mecánico con retroiluminación RGB', precioCompra: 45.00, precioVenta: 79.90, iva: 21.00, stock: 75, categoria: 'Periféricos', referencia: 'TEC-MEC-RGB' },
  { id: 'PROD004', nombre: 'Ratón Inalámbrico Ergo', descripcion: 'Ratón ergonómico inalámbrico', precioCompra: 20.00, precioVenta: 35.00, iva: 21.00, stock: 200, categoria: 'Periféricos', referencia: 'RAT-ERG-WL' },
];

let facturas: Factura[] = [
  { 
    id: 'FV2024-00001', fecha: '2024-05-10', tipo: 'Venta', clienteId: 'CLI001', empleadoId: empleados.length > 0 ? empleados[0].id : 'EMP001', almacenId: 'ALM001', 
    baseImponible: 179.50, totalIva: 37.69, totalFactura: 217.19, estado: 'Pagada', moneda: 'EUR',
    detalles: [
      { id: 'DET001', productoId: 'PROD002', productoNombre: 'Monitor 24 pulgadas', cantidad: 1, precioUnitario: 179.50, porcentajeIva: 21.00, subtotal: 179.50, subtotalConIva: 217.195 }
    ],
    clienteNombre: 'Juan Pérez', empleadoNombre: empleados.length > 0 ? empleados[0].nombre : 'Admin ERP'
  },
  { 
    id: 'FC2024-00001', fecha: '2024-06-15', tipo: 'Compra', proveedorId: 'PRO001', empleadoId: empleados.length > 1 ? empleados[1].id : 'EMP002', almacenId: 'ALM001', 
    baseImponible: 600.00, totalIva: 126.00, totalFactura: 726.00, estado: 'Pendiente', moneda: 'USD',
    detalles: [
      { id: 'DET002', productoId: 'PROD001', productoNombre: 'Portátil Modelo X', cantidad: 1, precioUnitario: 600.00, porcentajeIva: 21.00, subtotal: 600.00, subtotalConIva: 726.00 }
    ],
    proveedorNombre: 'Suministros Informáticos SL', empleadoNombre: empleados.length > 1 ? empleados[1].nombre : 'Laura García'
  },
   { 
    id: 'FV2024-00002', fecha: '2024-07-01', tipo: 'Venta', clienteId: 'CLI002', empleadoId: empleados.length > 0 ? empleados[0].id : 'EMP001', almacenId: 'ALM002', 
    baseImponible: 79.90, totalIva: 16.78, totalFactura: 96.68, estado: 'Pendiente', moneda: 'GBP',
    detalles: [
      { id: 'DET003', productoId: 'PROD003', productoNombre: 'Teclado Mecánico RGB', cantidad: 1, precioUnitario: 79.90, porcentajeIva: 21.00, subtotal: 79.90, subtotalConIva: 96.679 }
    ],
    clienteNombre: 'Ana López', empleadoNombre: empleados.length > 0 ? empleados[0].nombre : 'Admin ERP'
  },
];


// Helper to generate next ID
const generateId = (prefix: string, currentItems: {id: string}[]) => {
  const maxNum = currentItems.reduce((max, item) => {
    const numStr = item.id.replace(prefix, '');
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

// Proveedores CRUD
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

export const addEmpleado = async (empleadoData: Omit<Empleado, 'id' | 'isBlocked' | 'role'> & {password?: string, role?: EmpleadoRole}): Promise<Empleado> => {
  const role: EmpleadoRole = empleadoData.role || (empleados.length === 0 ? 'admin' : 'user');
  const newEmpleado: Empleado = { 
    ...empleadoData, 
    id: generateId('EMP', empleados),
    role: role, 
    isBlocked: false, 
    password: empleadoData.password || 'password123' 
  };
  empleados.push(newEmpleado);
  return newEmpleado;
};

export const updateEmpleado = async (id: string, updates: Partial<Omit<Empleado, 'password'>>): Promise<Empleado | null> => {
  const index = empleados.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  const currentEmpleado = empleados[index];
  const { password, ...restOfUpdates } = updates as any; 
  empleados[index] = { ...currentEmpleado, ...restOfUpdates };
  return empleados[index];
};

export const updateEmpleadoBlockedStatus = async (id: string, isBlocked: boolean): Promise<Empleado | null> => {
  const index = empleados.findIndex(e => e.id === id);
  if (index === -1) return null;
  empleados[index].isBlocked = isBlocked;
  return empleados[index];
}

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

// Facturas
export const getFacturas = async (): Promise<Factura[]> => {
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

const generateDetalleId = (facturaId: string, index: number) => `${facturaId}-DET${(index + 1).toString().padStart(3, '0')}`;

const adjustStock = (productoId: string, cantidad: number, tipoAjuste: 'increment' | 'decrement') => {
  const productoIndex = productos.findIndex(p => p.id === productoId);
  if (productoIndex !== -1) {
    if (tipoAjuste === 'increment') {
      productos[productoIndex].stock += cantidad;
    } else {
      productos[productoIndex].stock -= cantidad;
    }
  }
};

export const addFactura = async (facturaData: Omit<Factura, 'id' | 'clienteNombre' | 'proveedorNombre' | 'empleadoNombre' >): Promise<Factura> => {
  // Stock Validation for Sales
  if (facturaData.tipo === 'Venta' && facturaData.estado !== 'Cancelada') {
    for (const detalle of facturaData.detalles) {
      const producto = productos.find(p => p.id === detalle.productoId);
      if (!producto) throw new Error(`Producto con ID ${detalle.productoId} no encontrado.`);
      if (producto.stock < detalle.cantidad) {
        throw new Error(`No hay suficiente stock para ${producto.nombre}. Stock disponible: ${producto.stock}, Solicitado: ${detalle.cantidad}.`);
      }
    }
  }

  const nextIdNum = facturas.length > 0 ? Math.max(...facturas.map(f => parseInt(f.id.split('-')[1])).filter(num => !isNaN(num))) + 1 : 1;
  const prefix = facturaData.tipo === 'Venta' ? 'FV' : 'FC';
  const newId = `${prefix}${new Date().getFullYear()}-${nextIdNum.toString().padStart(5, '0')}`;
  
  const processedDetalles = facturaData.detalles.map((d, index) => {
    const producto = productos.find(p => p.id === d.productoId);
    const subtotal = d.cantidad * d.precioUnitario;
    const subtotalConIva = subtotal * (1 + d.porcentajeIva / 100);
    return {
      ...d,
      id: d.id || generateDetalleId(newId, index),
      productoNombre: producto?.nombre,
      subtotal: parseFloat(subtotal.toFixed(2)),
      subtotalConIva: parseFloat(subtotalConIva.toFixed(2)),
    };
  });

  const baseImponible = processedDetalles.reduce((sum, d) => sum + (d.subtotal || 0), 0);
  const totalIva = processedDetalles.reduce((sum, d) => sum + ((d.subtotalConIva || 0) - (d.subtotal || 0)), 0);

  const newFactura: Factura = {
    ...facturaData,
    id: newId,
    detalles: processedDetalles,
    baseImponible: parseFloat(baseImponible.toFixed(2)),
    totalIva: parseFloat(totalIva.toFixed(2)),
    totalFactura: parseFloat((baseImponible + totalIva).toFixed(2)),
  };
  facturas.push(newFactura);

  // Adjust Stock
  if (newFactura.estado !== 'Cancelada') {
    newFactura.detalles.forEach(detalle => {
      if (newFactura.tipo === 'Venta') {
        adjustStock(detalle.productoId, detalle.cantidad, 'decrement');
      } else if (newFactura.tipo === 'Compra') {
        adjustStock(detalle.productoId, detalle.cantidad, 'increment');
      }
    });
  }
  return newFactura;
};


export const updateFactura = async (id: string, updates: Partial<Factura>): Promise<Factura | null> => {
  const index = facturas.findIndex(f => f.id === id);
  if (index === -1) return null;

  const originalFactura = { ...facturas[index], detalles: [...facturas[index].detalles.map(d => ({...d}))] }; // Deep copy for details

  // Tentatively apply updates to a copy to perform validations
  const tentativeUpdatedFactura: Factura = {
    ...originalFactura,
    ...updates,
    detalles: updates.detalles ? updates.detalles.map((d, idx) => {
        const producto = productos.find(p => p.id === d.productoId);
        const subtotal = d.cantidad * d.precioUnitario;
        const subtotalConIva = subtotal * (1 + d.porcentajeIva / 100);
        return {
            ...d,
            id: d.id || generateDetalleId(id, idx),
            productoNombre: producto?.nombre,
            subtotal: parseFloat(subtotal.toFixed(2)),
            subtotalConIva: parseFloat(subtotalConIva.toFixed(2)),
        };
    }) : [...originalFactura.detalles], // if no details in updates, use original
  };

  // Recalculate totals for tentative updated factura
  const newBaseImponible = tentativeUpdatedFactura.detalles.reduce((sum, d) => sum + (d.subtotal || 0), 0);
  const newTotalIva = tentativeUpdatedFactura.detalles.reduce((sum, d) => sum + ((d.subtotalConIva || 0) - (d.subtotal || 0)), 0);
  tentativeUpdatedFactura.baseImponible = parseFloat(newBaseImponible.toFixed(2));
  tentativeUpdatedFactura.totalIva = parseFloat(newTotalIva.toFixed(2));
  tentativeUpdatedFactura.totalFactura = parseFloat((newBaseImponible + newTotalIva).toFixed(2));


  // 1. Revert stock changes from original invoice state if it wasn't cancelled
  if (originalFactura.estado !== 'Cancelada') {
    originalFactura.detalles.forEach(detalle => {
      if (originalFactura.tipo === 'Venta') {
        adjustStock(detalle.productoId, detalle.cantidad, 'increment');
      } else if (originalFactura.tipo === 'Compra') {
        adjustStock(detalle.productoId, detalle.cantidad, 'decrement');
      }
    });
  }

  // 2. Stock Validation & Application for the new/updated invoice state
  if (tentativeUpdatedFactura.estado !== 'Cancelada') {
    if (tentativeUpdatedFactura.tipo === 'Venta') {
      for (const detalle of tentativeUpdatedFactura.detalles) {
        const producto = productos.find(p => p.id === detalle.productoId);
        if (!producto) throw new Error(`Producto con ID ${detalle.productoId} no encontrado.`);
        // Stock check is against current available stock (after potential reversal)
        if (producto.stock < detalle.cantidad) {
          // If validation fails, we must revert the stock reversal for original invoice
          if (originalFactura.estado !== 'Cancelada') {
            originalFactura.detalles.forEach(d => {
              if (originalFactura.tipo === 'Venta') adjustStock(d.productoId, d.cantidad, 'decrement');
              else if (originalFactura.tipo === 'Compra') adjustStock(d.productoId, d.cantidad, 'increment');
            });
          }
          throw new Error(`No hay suficiente stock para ${producto.nombre}. Stock disponible: ${producto.stock}, Solicitado: ${detalle.cantidad}.`);
        }
      }
    }
    // Apply new stock changes
    tentativeUpdatedFactura.detalles.forEach(detalle => {
      if (tentativeUpdatedFactura.tipo === 'Venta') {
        adjustStock(detalle.productoId, detalle.cantidad, 'decrement');
      } else if (tentativeUpdatedFactura.tipo === 'Compra') {
        adjustStock(detalle.productoId, detalle.cantidad, 'increment');
      }
    });
  }
  
  facturas[index] = tentativeUpdatedFactura;
  
  const updatedFactura = facturas[index];
  return {
    ...updatedFactura,
    clienteNombre: updatedFactura.clienteId ? clientes.find(c=>c.id === updatedFactura.clienteId)?.nombre : undefined,
    proveedorNombre: updatedFactura.proveedorId ? proveedores.find(p=>p.id === updatedFactura.proveedorId)?.nombre : undefined,
    empleadoNombre: empleados.find(e=>e.id === updatedFactura.empleadoId)?.nombre,
  };
};

export const deleteFactura = async (id: string): Promise<boolean> => {
  const index = facturas.findIndex(f => f.id === id);
  if (index === -1) return false;

  const facturaToDelete = facturas[index];

  // Revert stock changes if the invoice wasn't cancelled
  if (facturaToDelete.estado !== 'Cancelada') {
    facturaToDelete.detalles.forEach(detalle => {
      if (facturaToDelete.tipo === 'Venta') {
        adjustStock(detalle.productoId, detalle.cantidad, 'increment');
      } else if (facturaToDelete.tipo === 'Compra') {
        adjustStock(detalle.productoId, detalle.cantidad, 'decrement');
      }
    });
  }

  facturas.splice(index, 1);
  return true;
};


// For dashboard summaries
export const getRecentSales = async (limit: number = 3): Promise<Array<{id: string, customer: string, amount: number, date: string, currency: CurrencyCode}>> => {
  return facturas
    .filter(f => f.tipo === 'Venta')
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, limit)
    .map(f => ({
      id: f.id,
      customer: f.clienteNombre || clientes.find(c => c.id === f.clienteId)?.nombre || 'N/A',
      amount: f.totalFactura,
      date: f.fecha,
      currency: f.moneda,
    }));
};

export const getRecentOrders = async (limit: number = 2): Promise<Array<{id: string, supplier: string, amount: number, date: string, currency: CurrencyCode}>> => {
   return facturas
    .filter(f => f.tipo === 'Compra')
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, limit)
    .map(f => ({
      id: f.id,
      supplier: f.proveedorNombre || proveedores.find(p => p.id === f.proveedorId)?.nombre || 'N/A',
      amount: f.totalFactura,
      date: f.fecha,
      currency: f.moneda,
    }));
};

export const getWarehouseStatus = async (): Promise<Array<{name: string, capacity: string, items: number, location: string }>> => {
  return almacenes.map(alm => ({
    name: alm.nombre,
    capacity: `${Math.floor(Math.random() * 40) + 50}%`, 
    items: productos.reduce((sum, p) => sum + p.stock, 0) / (almacenes.length || 1), // Distribute total stock somewhat evenly for demo
    location: alm.ubicacion || 'N/A',
  }));
};

export const getTotalStockValue = async (): Promise<{totalStock: number, totalRevenue: number, salesCount: number}> => {
    const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
    const totalRevenue = facturas.filter(f => f.tipo === 'Venta' && f.estado === 'Pagada').reduce((sum, f) => sum + f.totalFactura, 0);
    const salesCount = facturas.filter(f => f.tipo === 'Venta').length;
    return { totalStock, totalRevenue, salesCount };
};

    
