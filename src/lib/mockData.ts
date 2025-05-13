
import type { Cliente, Proveedor, Empleado, Producto, Almacen, Factura, DetalleFactura, EmpleadoRole, FacturaTipo, FacturaEstado, CurrencyCode, TeamActivityLog, TeamActivityModule, TeamActivityAction } from '@/types';
import { subDays, subHours, subMinutes } from 'date-fns';

let clientes: Cliente[] = [
  { id: 'CLI001', nombre: 'Juan Pérez', nif: '12345678A', direccion: 'Calle Falsa 123', poblacion: 'Ciudad Real', telefono: '926111222', email: 'juan.perez@example.com' },
  { id: 'CLI002', nombre: 'Ana López', nif: '87654321B', direccion: 'Avenida Principal 45', poblacion: 'Miguelturra', telefono: '926333444', email: 'ana.lopez@example.com' },
];

let proveedores: Proveedor[] = [
  { id: 'PRO001', nombre: 'Suministros Informáticos SL', nif: 'B12345678', direccion: 'Polígono Industrial La Estrella, Nave 10', poblacion: 'Argamasilla', telefono: '926555666', email: 'pedidos@suministrosinfo.com', personaContacto: 'Carlos Duty', terminosPago: '30 días' },
  { id: 'PRO002', nombre: 'Material Oficina Global', nif: 'A87654321', direccion: 'Calle Comercio 7', poblacion: 'Valdepeñas', telefono: '926777888', email: 'ventas@materialoficina.com', personaContacto: 'Lucía Admin', terminosPago: 'Al contado' },
];

let empleados: Empleado[] = [];

let almacenes: Almacen[] = [
  { id: 'ALM001', nombre: 'Almacén Central', ubicacion: 'Calle Logística 1, Polígono Central', capacidad: '1000 m2', personaContacto: 'Jefe Almacén', telefonoContacto: '926000000', notas: 'Recepción principal de mercancías.' },
  { id: 'ALM002', nombre: 'Almacén Tienda', ubicacion: 'Trastienda, Calle Comercial 5', capacidad: '200 unidades', notas: 'Stock para tienda física.' },
];

let productos: Producto[] = [
  { id: 'PROD001', nombre: 'Portátil Modelo X', descripcion: 'Portátil 15 pulgadas, 16GB RAM, 512GB SSD', precioCompra: 600.00, precioVenta: 899.99, iva: 21.00, stock: 50, categoria: 'Electrónica', referencia: 'LX15-512'},
  { id: 'PROD002', nombre: 'Monitor 24 pulgadas', descripcion: 'Monitor LED Full HD', precioCompra: 120.00, precioVenta: 179.50, iva: 21.00, stock: 120, categoria: 'Periféricos', referencia: 'MON24-FHD' },
  { id: 'PROD003', nombre: 'Teclado Mecánico RGB', descripcion: 'Teclado mecánico con retroiluminación RGB', precioCompra: 45.00, precioVenta: 79.90, iva: 21.00, stock: 75, categoria: 'Periféricos', referencia: 'TEC-MEC-RGB' },
  { id: 'PROD004', nombre: 'Ratón Inalámbrico Ergo', descripcion: 'Ratón ergonómico inalámbrico', precioCompra: 20.00, precioVenta: 35.00, iva: 21.00, stock: 200, categoria: 'Periféricos', referencia: 'RAT-ERG-WL' },
];

let facturas: Factura[] = [
  { 
    id: 'FV2024-00001', fecha: '2024-05-10', tipo: 'Venta', clienteId: 'CLI001', empleadoId: 'EMP001', almacenId: 'ALM001', 
    baseImponible: 179.50, totalIva: 37.69, totalFactura: 217.19, estado: 'Pagada', moneda: 'EUR',
    detalles: [
      { id: 'DET001', productoId: 'PROD002', productoNombre: 'Monitor 24 pulgadas', cantidad: 1, precioUnitario: 179.50, porcentajeIva: 21.00, subtotal: 179.50, subtotalConIva: 217.195 }
    ],
    clienteNombre: 'Juan Pérez', empleadoNombre: 'Admin ERP'
  },
  { 
    id: 'FC2024-00001', fecha: '2024-06-15', tipo: 'Compra', proveedorId: 'PRO001', empleadoId: 'EMP002', almacenId: 'ALM001', 
    baseImponible: 600.00, totalIva: 126.00, totalFactura: 726.00, estado: 'Pendiente', moneda: 'USD',
    detalles: [
      { id: 'DET002', productoId: 'PROD001', productoNombre: 'Portátil Modelo X', cantidad: 1, precioUnitario: 600.00, porcentajeIva: 21.00, subtotal: 600.00, subtotalConIva: 726.00 }
    ],
    proveedorNombre: 'Suministros Informáticos SL', empleadoNombre: 'Laura García'
  },
   { 
    id: 'FV2024-00002', fecha: '2024-07-01', tipo: 'Venta', clienteId: 'CLI002', empleadoId: 'EMP001', almacenId: 'ALM002', 
    baseImponible: 79.90, totalIva: 16.78, totalFactura: 96.68, estado: 'Pendiente', moneda: 'GBP',
    detalles: [
      { id: 'DET003', productoId: 'PROD003', productoNombre: 'Teclado Mecánico RGB', cantidad: 1, precioUnitario: 79.90, porcentajeIva: 21.00, subtotal: 79.90, subtotalConIva: 96.679 }
    ],
    clienteNombre: 'Ana López', empleadoNombre: 'Admin ERP'
  },
];

const AVATAR_COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c', '#d35400'];
let colorIndex = 0;
const getNextAvatarColor = () => {
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  colorIndex++;
  return color;
}

let teamActivityLogs: TeamActivityLog[] = []; 

const LOG_LIMIT = 20;

const generateId = (prefix: string, currentItems: {id: string}[]) => {
  const maxNum = currentItems.reduce((max, item) => {
    if (!item || !item.id) return max;
    const numStr = item.id.replace(prefix, '').replace(/^.*-/, ''); // Handles FV2024-00001 like IDs too
    if (numStr && /^\d+$/.test(numStr)) {
        const num = parseInt(numStr, 10);
        return Math.max(max, num);
    }
    return max;
  }, 0);
  return `${prefix}${(maxNum + 1).toString().padStart(3, '0')}`;
};

interface AddTeamActivityLogData {
  usuario_id: string;
  modulo: TeamActivityModule;
  accion: TeamActivityAction;
  descripcionKey: string;
  descripcionParams?: Record<string, string | number | undefined | null>;
  entidad_id?: string;
  entidad_nombre?: string;
  t: (key: string, params?: any) => string; 
}

export const addTeamActivityLog = async (logData: AddTeamActivityLogData): Promise<TeamActivityLog> => {
  const actingUser = await getEmpleadoById(logData.usuario_id);
  if (!actingUser) {
    console.warn(`Activity Log: User with ID ${logData.usuario_id} not found. Logging as System.`);
  }

  const userName = actingUser?.nombre || 'System';
  const userAvatarColor = actingUser?.avatarColor || getNextAvatarColor();

  const descripcion = logData.t(logData.descripcionKey, {
    ...logData.descripcionParams,
    userName: userName,
  });
  
  const newLog: TeamActivityLog = {
    id: generateId('ACT', teamActivityLogs),
    usuario_id: logData.usuario_id,
    nombre_usuario: userName,
    avatar_color: userAvatarColor,
    modulo: logData.modulo,
    accion: logData.accion,
    descripcion: descripcion, 
    timestamp: new Date().toISOString(),
    entidad_id: logData.entidad_id,
    entidad_nombre: logData.entidad_nombre,
  };

  teamActivityLogs.unshift(newLog); 
  if (teamActivityLogs.length > LOG_LIMIT) {
    teamActivityLogs = teamActivityLogs.slice(0, LOG_LIMIT); 
  }
  return newLog;
};


// Clientes CRUD
export const getClientes = async (): Promise<Cliente[]> => [...clientes];
export const getClienteById = async (id: string): Promise<Cliente | undefined> => clientes.find(c => c.id === id);

export const addCliente = async (clienteData: Omit<Cliente, 'id'>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Cliente> => {
  const newCliente = { ...clienteData, id: generateId('CLI', clientes) };
  clientes.push(newCliente);
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Clientes',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.clienteCreado',
    descripcionParams: { entidadNombre: newCliente.nombre },
    entidad_id: newCliente.id,
    entidad_nombre: newCliente.nombre,
    t,
  });
  return newCliente;
};

export const updateCliente = async (id: string, updates: Partial<Cliente>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Cliente | null> => {
  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) return null;
  clientes[index] = { ...clientes[index], ...updates };
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Clientes',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.clienteModificado',
    descripcionParams: { entidadNombre: clientes[index].nombre },
    entidad_id: clientes[index].id,
    entidad_nombre: clientes[index].nombre,
    t,
  });
  return clientes[index];
};

export const deleteCliente = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
  const clienteToDelete = clientes.find(c => c.id === id);
  if (!clienteToDelete) return false;
  const initialLength = clientes.length;
  clientes = clientes.filter(c => c.id !== id);
  const success = clientes.length < initialLength;
  if (success) {
    await addTeamActivityLog({
      usuario_id: actingUserId,
      modulo: 'Clientes',
      accion: 'eliminar',
      descripcionKey: 'teamActivity.log.clienteEliminado',
      descripcionParams: { entidadNombre: clienteToDelete.nombre },
      entidad_id: clienteToDelete.id,
      entidad_nombre: clienteToDelete.nombre,
      t,
    });
  }
  return success;
};


// Proveedores CRUD
export const getProveedores = async (): Promise<Proveedor[]> => [...proveedores];
export const getProveedorById = async (id: string): Promise<Proveedor | undefined> => proveedores.find(p => p.id === id);
export const addProveedor = async (proveedorData: Omit<Proveedor, 'id'>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Proveedor> => {
  const newProveedor = { ...proveedorData, id: generateId('PRO', proveedores) };
  proveedores.push(newProveedor);
   await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Proveedores',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.proveedorCreado',
    descripcionParams: { entidadNombre: newProveedor.nombre },
    entidad_id: newProveedor.id,
    entidad_nombre: newProveedor.nombre,
    t,
  });
  return newProveedor;
};
export const updateProveedor = async (id: string, updates: Partial<Proveedor>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Proveedor | null> => {
  const index = proveedores.findIndex(p => p.id === id);
  if (index === -1) return null;
  proveedores[index] = { ...proveedores[index], ...updates };
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Proveedores',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.proveedorModificado',
    descripcionParams: { entidadNombre: proveedores[index].nombre },
    entidad_id: proveedores[index].id,
    entidad_nombre: proveedores[index].nombre,
    t,
  });
  return proveedores[index];
};
export const deleteProveedor = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
   const proveedorToDelete = proveedores.find(p => p.id === id);
   if(!proveedorToDelete) return false;
   const initialLength = proveedores.length;
   proveedores = proveedores.filter(p => p.id !== id);
   const success = proveedores.length < initialLength;
   if(success){
        await addTeamActivityLog({
            usuario_id: actingUserId,
            modulo: 'Proveedores',
            accion: 'eliminar',
            descripcionKey: 'teamActivity.log.proveedorEliminado',
            descripcionParams: { entidadNombre: proveedorToDelete.nombre },
            entidad_id: proveedorToDelete.id,
            entidad_nombre: proveedorToDelete.nombre,
            t,
        });
   }
   return success;
};

// Empleados CRUD
export const getEmpleados = async (): Promise<Empleado[]> => [...empleados];
export const getEmpleadoById = async (id: string): Promise<Empleado | undefined> => empleados.find(e => e.id === id);
export const getEmpleadoByEmail = async (email: string): Promise<Empleado | undefined> => empleados.find(e => e.email.toLowerCase() === email.toLowerCase());

export const addEmpleado = async (empleadoData: Omit<Empleado, 'id' | 'isBlocked' | 'role' | 'avatarColor'> & {password?: string, role?: EmpleadoRole}, actingUserId?: string, t?: (key: string, params?: any) => string): Promise<Empleado> => {
  const role: EmpleadoRole = empleadoData.role || (empleados.length === 0 ? 'admin' : 'user');
  const newEmpleado: Empleado = { 
    ...empleadoData, 
    id: generateId('EMP', empleados),
    role: role, 
    isBlocked: false, 
    password: empleadoData.password || 'password123',
    avatarColor: getNextAvatarColor()
  };
  empleados.push(newEmpleado);
  if (empleados.length === 1 && newEmpleado.role !== 'admin') {
    newEmpleado.role = 'admin'; 
  }
  if(actingUserId && t){
     await addTeamActivityLog({
        usuario_id: actingUserId,
        modulo: 'Empleados',
        accion: 'crear',
        descripcionKey: 'teamActivity.log.empleadoCreado',
        descripcionParams: { entidadNombre: newEmpleado.nombre },
        entidad_id: newEmpleado.id,
        entidad_nombre: newEmpleado.nombre,
        t,
      });
  }
  return newEmpleado;
};

export const updateEmpleado = async (id: string, updates: Partial<Omit<Empleado, 'password' | 'avatarColor'>>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Empleado | null> => {
  const index = empleados.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  const currentEmpleado = {...empleados[index]}; 
  const { password, avatarColor, ...restOfUpdates } = updates as any; 
  empleados[index] = { ...currentEmpleado, ...restOfUpdates };

  if (updates.role && updates.role !== currentEmpleado.role) {
    await addTeamActivityLog({
      usuario_id: actingUserId,
      modulo: 'Empleados',
      accion: 'asignar_rol',
      descripcionKey: 'teamActivity.log.empleadoRolAsignado',
      descripcionParams: { rol: t(`employees.role${updates.role.charAt(0).toUpperCase() + updates.role.slice(1)}`), entidadNombre: empleados[index].nombre },
      entidad_id: empleados[index].id,
      entidad_nombre: empleados[index].nombre,
      t,
    });
  } else if (updates.isBlocked !== undefined && updates.isBlocked !== currentEmpleado.isBlocked) {
     await addTeamActivityLog({
      usuario_id: actingUserId,
      modulo: 'Empleados',
      accion: updates.isBlocked ? 'bloquear' : 'desbloquear',
      descripcionKey: updates.isBlocked ? 'teamActivity.log.empleadoBloqueado' : 'teamActivity.log.empleadoDesbloqueado',
      descripcionParams: { entidadNombre: empleados[index].nombre },
      entidad_id: empleados[index].id,
      entidad_nombre: empleados[index].nombre,
      t,
    });
  } else {
      await addTeamActivityLog({
        usuario_id: actingUserId,
        modulo: 'Empleados',
        accion: 'modificar',
        descripcionKey: 'teamActivity.log.empleadoModificado',
        descripcionParams: { entidadNombre: empleados[index].nombre },
        entidad_id: empleados[index].id,
        entidad_nombre: empleados[index].nombre,
        t,
    });
  }

  return empleados[index];
};

export const deleteEmpleado = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
    const empleadoToDelete = empleados.find(e => e.id === id);
    if (!empleadoToDelete) return false;

    if (empleadoToDelete?.role === 'admin') {
      const adminCount = empleados.filter(e => e.role === 'admin').length;
      if (adminCount <= 1) {
        console.warn("Cannot delete the last admin.");
        return false; 
      }
    }
    const initialLength = empleados.length;
    empleados = empleados.filter(e => e.id !== id);
    const success = empleados.length < initialLength;

    if (success) {
      await addTeamActivityLog({
        usuario_id: actingUserId,
        modulo: 'Empleados',
        accion: 'eliminar',
        descripcionKey: 'teamActivity.log.empleadoEliminado',
        descripcionParams: { entidadNombre: empleadoToDelete.nombre },
        entidad_id: empleadoToDelete.id,
        entidad_nombre: empleadoToDelete.nombre,
        t,
      });
    }
    return success;
};

// Productos CRUD
export const getProductos = async (): Promise<Producto[]> => [...productos];
export const getProductoById = async (id: string): Promise<Producto | undefined> => productos.find(p => p.id === id);
export const addProducto = async (productoData: Omit<Producto, 'id'>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Producto> => {
  const newProducto = { ...productoData, id: generateId('PROD', productos) };
  productos.push(newProducto);
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Productos',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.productoCreado',
    descripcionParams: { entidadNombre: newProducto.nombre },
    entidad_id: newProducto.id,
    entidad_nombre: newProducto.nombre,
    t,
  });
  return newProducto;
};
export const updateProducto = async (id: string, updates: Partial<Producto>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Producto | null> => {
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) return null;
  productos[index] = { ...productos[index], ...updates };
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Productos',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.productoModificado',
    descripcionParams: { entidadNombre: productos[index].nombre },
    entidad_id: productos[index].id,
    entidad_nombre: productos[index].nombre,
    t,
  });
  return productos[index];
};
export const deleteProducto = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
    const productoToDelete = productos.find(p => p.id === id);
    if(!productoToDelete) return false;
    const initialLength = productos.length;
    productos = productos.filter(p => p.id !== id);
    const success = productos.length < initialLength;
    if(success){
         await addTeamActivityLog({
            usuario_id: actingUserId,
            modulo: 'Productos',
            accion: 'eliminar',
            descripcionKey: 'teamActivity.log.productoEliminado',
            descripcionParams: { entidadNombre: productoToDelete.nombre },
            entidad_id: productoToDelete.id,
            entidad_nombre: productoToDelete.nombre,
            t,
        });
    }
    return success;
};


// Almacenes CRUD
export const getAlmacenes = async (): Promise<Almacen[]> => [...almacenes];
export const getAlmacenById = async (id: string): Promise<Almacen | undefined> => almacenes.find(a => a.id === id);
export const addAlmacen = async (almacenData: Omit<Almacen, 'id'>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Almacen> => {
  const newAlmacen = { ...almacenData, id: generateId('ALM', almacenes) };
  almacenes.push(newAlmacen);
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Almacén',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.almacenCreado',
    descripcionParams: { entidadNombre: newAlmacen.nombre },
    entidad_id: newAlmacen.id,
    entidad_nombre: newAlmacen.nombre,
    t,
  });
  return newAlmacen;
};
export const updateAlmacen = async (id: string, updates: Partial<Almacen>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Almacen | null> => {
  const index = almacenes.findIndex(a => a.id === id);
  if (index === -1) return null;
  almacenes[index] = { ...almacenes[index], ...updates };
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Almacén',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.almacenModificado',
    descripcionParams: { entidadNombre: almacenes[index].nombre },
    entidad_id: almacenes[index].id,
    entidad_nombre: almacenes[index].nombre,
    t,
  });
  return almacenes[index];
};
export const deleteAlmacen = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
    const almacenToDelete = almacenes.find(a => a.id === id);
    if(!almacenToDelete) return false;
    const initialLength = almacenes.length;
    almacenes = almacenes.filter(a => a.id !== id);
    const success = almacenes.length < initialLength;
    if(success){
        await addTeamActivityLog({
            usuario_id: actingUserId,
            modulo: 'Almacén',
            accion: 'eliminar',
            descripcionKey: 'teamActivity.log.almacenEliminado',
            descripcionParams: { entidadNombre: almacenToDelete.nombre },
            entidad_id: almacenToDelete.id,
            entidad_nombre: almacenToDelete.nombre,
            t,
        });
    }
    return success;
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

export const addFactura = async (facturaData: Omit<Factura, 'id' | 'clienteNombre' | 'proveedorNombre' | 'empleadoNombre' >, actingUserId: string, t: (key: string, params?: any) => string): Promise<Factura> => {
  if (facturaData.tipo === 'Venta' && facturaData.estado !== 'Cancelada') {
    for (const detalle of facturaData.detalles) {
      const producto = productos.find(p => p.id === detalle.productoId);
      if (!producto) throw new Error(t('facturas.validation.productNotFound', {productId: detalle.productoId}));
      if (producto.stock < detalle.cantidad) {
        throw new Error(t('facturas.validation.insufficientStock', {productName: producto.nombre, availableStock: producto.stock, requestedQuantity: detalle.cantidad}));
      }
    }
  }

  const yearPrefix = facturaData.tipo === 'Venta' ? 'FV' : 'FC';
  const year = new Date(facturaData.fecha).getFullYear();
  const yearFacturas = facturas.filter(f => f.id.startsWith(`${yearPrefix}${year}-`));
  const nextIdNum = yearFacturas.length > 0 ? Math.max(...yearFacturas.map(f => parseInt(f.id.split('-')[1])).filter(num => !isNaN(num))) + 1 : 1;
  const newId = `${yearPrefix}${year}-${nextIdNum.toString().padStart(5, '0')}`;
  
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

  if (newFactura.estado !== 'Cancelada') {
    newFactura.detalles.forEach(detalle => {
      if (newFactura.tipo === 'Venta') {
        adjustStock(detalle.productoId, detalle.cantidad, 'decrement');
      } else if (newFactura.tipo === 'Compra') {
        adjustStock(detalle.productoId, detalle.cantidad, 'increment');
      }
    });
  }
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Facturación',
    accion: 'crear',
    descripcionKey: 'teamActivity.log.facturaCreada',
    descripcionParams: { 
        entidadNombre: newFactura.id, 
        tipoFactura: t(newFactura.tipo === 'Venta' ? 'facturas.typeSale' : 'facturas.typePurchase'), 
        clienteProveedorNombre: newFactura.tipo === 'Venta' ? clientes.find(c => c.id === newFactura.clienteId)?.nombre : proveedores.find(p => p.id === newFactura.proveedorId)?.nombre 
    },
    entidad_id: newFactura.id,
    t,
  });
  return newFactura;
};


export const updateFactura = async (id: string, updates: Partial<Factura>, actingUserId: string, t: (key: string, params?: any) => string): Promise<Factura | null> => {
  const index = facturas.findIndex(f => f.id === id);
  if (index === -1) return null;

  const originalFactura = { ...facturas[index], detalles: [...facturas[index].detalles.map(d => ({...d}))] }; 

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
    }) : [...originalFactura.detalles], 
  };

  const newBaseImponible = tentativeUpdatedFactura.detalles.reduce((sum, d) => sum + (d.subtotal || 0), 0);
  const newTotalIva = tentativeUpdatedFactura.detalles.reduce((sum, d) => sum + ((d.subtotalConIva || 0) - (d.subtotal || 0)), 0);
  tentativeUpdatedFactura.baseImponible = parseFloat(newBaseImponible.toFixed(2));
  tentativeUpdatedFactura.totalIva = parseFloat(newTotalIva.toFixed(2));
  tentativeUpdatedFactura.totalFactura = parseFloat((newBaseImponible + newTotalIva).toFixed(2));

  // Revert original stock changes if original factura wasn't cancelled
  if (originalFactura.estado !== 'Cancelada') {
    originalFactura.detalles.forEach(detalle => {
      if (originalFactura.tipo === 'Venta') {
        adjustStock(detalle.productoId, detalle.cantidad, 'increment');
      } else if (originalFactura.tipo === 'Compra') {
        adjustStock(detalle.productoId, detalle.cantidad, 'decrement');
      }
    });
  }

  // Apply new stock changes if new factura isn't cancelled
  if (tentativeUpdatedFactura.estado !== 'Cancelada') {
    if (tentativeUpdatedFactura.tipo === 'Venta') {
      for (const detalle of tentativeUpdatedFactura.detalles) {
        const producto = productos.find(p => p.id === detalle.productoId);
        if (!producto) throw new Error(t('facturas.validation.productNotFound', {productId: detalle.productoId}));
        const currentStockAfterRevert = producto.stock; // Stock after original sale was reverted
        if (currentStockAfterRevert < detalle.cantidad) {
          // If stock is insufficient, revert the revert and throw error
          if (originalFactura.estado !== 'Cancelada') {
            originalFactura.detalles.forEach(d => {
              if (originalFactura.tipo === 'Venta') adjustStock(d.productoId, d.cantidad, 'decrement');
              else if (originalFactura.tipo === 'Compra') adjustStock(d.productoId, d.cantidad, 'increment');
            });
          }
          throw new Error(t('facturas.validation.insufficientStock', {productName: producto.nombre, availableStock: currentStockAfterRevert, requestedQuantity: detalle.cantidad}));
        }
      }
    }
    tentativeUpdatedFactura.detalles.forEach(detalle => {
      if (tentativeUpdatedFactura.tipo === 'Venta') {
        adjustStock(detalle.productoId, detalle.cantidad, 'decrement');
      } else if (tentativeUpdatedFactura.tipo === 'Compra') {
        adjustStock(detalle.productoId, detalle.cantidad, 'increment');
      }
    });
  }
  
  facturas[index] = tentativeUpdatedFactura;
  
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Facturación',
    accion: 'modificar',
    descripcionKey: 'teamActivity.log.facturaModificada',
    descripcionParams: { entidadNombre: facturas[index].id },
    entidad_id: facturas[index].id,
    entidad_nombre: facturas[index].id,
    t,
  });

  const updatedFactura = facturas[index];
  return {
    ...updatedFactura,
    clienteNombre: updatedFactura.clienteId ? clientes.find(c=>c.id === updatedFactura.clienteId)?.nombre : undefined,
    proveedorNombre: updatedFactura.proveedorId ? proveedores.find(p=>p.id === updatedFactura.proveedorId)?.nombre : undefined,
    empleadoNombre: empleados.find(e=>e.id === updatedFactura.empleadoId)?.nombre,
  };
};

export const deleteFactura = async (id: string, actingUserId: string, t: (key: string, params?: any) => string): Promise<boolean> => {
  const index = facturas.findIndex(f => f.id === id);
  if (index === -1) return false;

  const facturaToDelete = facturas[index];

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
  await addTeamActivityLog({
    usuario_id: actingUserId,
    modulo: 'Facturación',
    accion: 'eliminar',
    descripcionKey: 'teamActivity.log.facturaEliminada',
    descripcionParams: { entidadNombre: facturaToDelete.id },
    entidad_id: facturaToDelete.id,
    t,
  });
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
  if (almacenes.length === 0) return []; 
  return almacenes.map(alm => ({
    name: alm.nombre,
    capacity: alm.capacidad || 'N/A', 
    items: productos.reduce((sum, p) => sum + p.stock, 0) / almacenes.length, // Simplified: average stock across warehouses
    location: alm.ubicacion || 'N/A',
  }));
};

export const getTotalStockValue = async (): Promise<{totalStock: number, totalRevenue: number, salesCount: number}> => {
    const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
    const totalRevenue = facturas.filter(f => f.tipo === 'Venta' && f.estado === 'Pagada').reduce((sum, f) => sum + f.totalFactura, 0);
    const salesCount = facturas.filter(f => f.tipo === 'Venta').length;
    return { totalStock, totalRevenue, salesCount };
};


export const getTeamActivityLogs = async (limit: number = LOG_LIMIT): Promise<TeamActivityLog[]> => {
  return [...teamActivityLogs] 
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) 
    .slice(0, limit);
};

// Initial example log to test the feed (will be overwritten by new logs if actions are performed)
// This assumes an employee with ID 'EMP001' exists.
// If not, you might need to adjust or ensure one is created first for this to work.
// For example, if `addEmpleado` in AuthContext for the first user logs an activity.

/*
// Example initial log:
if (empleados.find(e => e.id === 'EMP001')) {
    const exampleT = (key: string, params?: any) => { // Simple mock t function for initial log
        let str = key;
        if (params) {
            Object.keys(params).forEach(pKey => {
                str = str.replace(`{${pKey}}`, params[pKey]);
            });
        }
        return str;
    };
    addTeamActivityLog({
        usuario_id: 'EMP001',
        modulo: 'Sistema',
        accion: 'login',
        descripcionKey: 'teamActivity.log.login',
        descripcionParams: { userName: empleados.find(e => e.id === 'EMP001')?.nombre || 'Admin' },
        t: exampleT
    });
}
*/

// To ensure team activity feed is populated upon initial load or actions
// Call addTeamActivityLog in relevant functions:
// - AuthContext: login, logout, register (if register creates an employee and logs their creation)
// - Clientes: addCliente, updateCliente, deleteCliente
// - Proveedores: addProveedor, updateProveedor, deleteProveedor
// - Empleados: updateEmpleado (especially for role/block changes), deleteEmpleado
// - Productos: addProducto, updateProducto, deleteProducto
// - Facturas: addFactura, updateFactura, deleteFactura
// - Almacenes: addAlmacen, updateAlmacen, deleteAlmacen (to be implemented)
