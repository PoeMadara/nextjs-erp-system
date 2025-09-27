
"use client";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, CalendarIcon, DollarSign } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Factura, DetalleFactura, Cliente, Proveedor, Producto, Empleado, Almacen, FacturaTipo, FacturaEstado, CurrencyCode } from "@/types";
import { getClientes, getProveedores, getProductos, getEmpleados, getAlmacenes } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

const ALL_CURRENCIES: CurrencyCode[] = ['EUR', 'USD', 'GBP'];
const ALL_STATUSES: FacturaEstado[] = ['Pendiente', 'Pagada', 'Cancelada'];
const ALL_TYPES: FacturaTipo[] = ['Venta', 'Compra'];
const NO_WAREHOUSE_SENTINEL_VALUE = "__NO_WAREHOUSE_SENTINEL__";

const makeDetalleFacturaSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  id: z.string().optional(),
  productoId: z.string().min(1, { message: t('facturaForm.validation.productoRequired') }),
  cantidad: z.coerce.number().min(1, { message: t('facturaForm.validation.cantidadMin') }),
  precioUnitario: z.coerce.number().min(0, { message: t('facturaForm.validation.precioMin') }),
  porcentajeIva: z.coerce.number().min(0, { message: t('facturaForm.validation.ivaMin') }),
});

const makeFacturaSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  id: z.string().optional(),
  fecha: z.date({ required_error: t('facturaForm.validation.fechaRequired') }),
  tipo: z.enum(ALL_TYPES, { required_error: t('facturaForm.validation.tipoRequired')}),
  clienteId: z.string().optional(),
  proveedorId: z.string().optional(),
  empleadoId: z.string().min(1, { message: t('facturaForm.validation.empleadoRequired') }),
  almacenId: z.string().optional(), // Can be ID, empty string, or sentinel
  moneda: z.enum(ALL_CURRENCIES, { required_error: t('facturaForm.validation.monedaRequired') }),
  estado: z.enum(ALL_STATUSES, { required_error: t('facturaForm.validation.estadoRequired') }),
  detalles: z.array(makeDetalleFacturaSchema(t)).min(1, { message: t('facturaForm.validation.detallesMin') }),
  baseImponible: z.number().default(0),
  totalIva: z.number().default(0),
  totalFactura: z.number().default(0),
}).refine(data => {
  if (data.tipo === 'Venta' && !data.clienteId) return false;
  return true;
}, {
  message: t('facturaForm.validation.clienteRequired'),
  path: ["clienteId"],
}).refine(data => {
  if (data.tipo === 'Compra' && !data.proveedorId) return false;
  return true;
}, {
  message: t('facturaForm.validation.proveedorRequired'),
  path: ["proveedorId"],
});


export type FacturaFormValues = z.infer<ReturnType<typeof makeFacturaSchema>>;

interface FacturaFormProps {
  onSubmit: (values: FacturaFormValues) => Promise<void>;
  defaultValues?: Partial<FacturaFormValues>; 
  isSubmitting?: boolean;
  submitButtonText?: string;
  isEditMode?: boolean;
}

const statusTranslationMap: Record<FacturaEstado, string> = {
  'Pendiente': 'facturas.statusPending',
  'Pagada': 'facturas.statusPaid',
  'Cancelada': 'facturas.statusCancelled',
};

const typeTranslationMap: Record<FacturaTipo, string> = {
  'Venta': 'facturas.typeSale',
  'Compra': 'facturas.typePurchase',
};


export function FacturaForm({
  onSubmit,
  defaultValues,
  isSubmitting = false,
  submitButtonText,
  isEditMode = false
}: FacturaFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const facturaSchema = makeFacturaSchema(t);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);

  const form = useForm<FacturaFormValues>({
    resolver: zodResolver(facturaSchema),
    defaultValues: {
      fecha: defaultValues?.fecha ? (typeof defaultValues.fecha === 'string' ? parseISO(defaultValues.fecha) : defaultValues.fecha) : new Date(),
      tipo: defaultValues?.tipo || 'Venta',
      clienteId: defaultValues?.clienteId || '',
      proveedorId: defaultValues?.proveedorId || '',
      empleadoId: defaultValues?.empleadoId || '',
      almacenId: defaultValues?.almacenId || '', // Initial value from data can be '', gets handled by Select
      moneda: defaultValues?.moneda || 'EUR',
      estado: defaultValues?.estado || 'Pendiente',
      detalles: defaultValues?.detalles?.map(d => ({
        ...d,
        productoId: d.productoId || '',
        cantidad: d.cantidad || 1,
        precioUnitario: d.precioUnitario || 0,
        porcentajeIva: d.porcentajeIva || 21, 
      })) || [{ productoId: '', cantidad: 1, precioUnitario: 0, porcentajeIva: 21 }],
      baseImponible: defaultValues?.baseImponible || 0,
      totalIva: defaultValues?.totalIva || 0,
      totalFactura: defaultValues?.totalFactura || 0,
      ...(isEditMode && defaultValues?.id ? { id: defaultValues.id } : {})
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "detalles",
  });

  const watchedDetalles = form.watch("detalles");
  const watchedTipo = form.watch("tipo");
  const watchedMoneda = form.watch("moneda");


  useEffect(() => {
    const fetchData = async () => {
      try {
        setClientes(await getClientes());
        setProveedores(await getProveedores());
        setProductos(await getProductos());
        setEmpleados(await getEmpleados());
        setAlmacenes(await getAlmacenes());
      } catch (error) {
        toast({ title: t('common.error'), description: t('facturaForm.failFetchDropdowns'), variant: "destructive" });
      }
    };
    fetchData();
  }, [toast, t]);

  useEffect(() => {
    let base = 0;
    let iva = 0;
    watchedDetalles.forEach(detalle => {
      const itemSubtotal = (detalle.cantidad || 0) * (detalle.precioUnitario || 0);
      const itemIva = itemSubtotal * ((detalle.porcentajeIva || 0) / 100);
      base += itemSubtotal;
      iva += itemIva;
    });
    form.setValue("baseImponible", parseFloat(base.toFixed(2)));
    form.setValue("totalIva", parseFloat(iva.toFixed(2)));
    form.setValue("totalFactura", parseFloat((base + iva).toFixed(2)));
  }, [watchedDetalles, form]); 
  
  const handleProductChange = (index: number, productId: string) => {
    const product = productos.find(p => p.id === productId);
    if (product) {
      form.setValue(`detalles.${index}.precioUnitario`, product.precioVenta);
      form.setValue(`detalles.${index}.porcentajeIva`, product.iva);
    }
  };

  const actualSubmitButtonText = submitButtonText || (isEditMode ? t('facturaForm.updateButton') : t('facturaForm.createButton'));

  useEffect(() => {
    if (!isEditMode) { 
        form.setValue('clienteId', '');
        form.setValue('proveedorId', '');
    }
  }, [watchedTipo, form, isEditMode]);


  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle>{isEditMode ? t('facturaForm.editTitle', {id: defaultValues?.id || ''}) : t('facturaForm.createTitle')}</CardTitle>
        <CardDescription>{t('facturaForm.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('facturaForm.dateLabel')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t('facturaForm.pickDate')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('facturaForm.typeLabel')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      disabled={isEditMode} 
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('facturaForm.selectType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALL_TYPES.map(type => (
                           <SelectItem key={type} value={type}>{t(typeTranslationMap[type])}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedTipo === 'Venta' && (
                <FormField
                  control={form.control}
                  name="clienteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('facturaForm.clientLabel')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('facturaForm.selectClient')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientes.map(c => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {watchedTipo === 'Compra' && (
                 <FormField
                  control={form.control}
                  name="proveedorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('facturaForm.supplierLabel')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('facturaForm.selectSupplier')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proveedores.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="empleadoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('facturaForm.employeeLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('facturaForm.selectEmployee')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {empleados.map(e => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="almacenId"
                render={({ field }) => ( // field.value here is the current form value for almacenId (can be '', ID, or NO_WAREHOUSE_SENTINEL_VALUE)
                  <FormItem>
                    <FormLabel>{t('facturaForm.warehouseLabel')}</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === NO_WAREHOUSE_SENTINEL_VALUE ? "" : value)} 
                      value={field.value === "" ? NO_WAREHOUSE_SENTINEL_VALUE : field.value || ""} // If form value is "", select the "No Warehouse" sentinel. Otherwise, use field.value or "" for placeholder.
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('facturaForm.selectWarehouse')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NO_WAREHOUSE_SENTINEL_VALUE}>{t('facturaForm.noWarehouse')}</SelectItem>
                        {almacenes.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="moneda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('facturaForm.currencyLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                           <DollarSign className="mr-2 h-4 w-4 opacity-50" />
                          <SelectValue placeholder={t('facturaForm.selectCurrency')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALL_CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('facturaForm.statusLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('facturaForm.selectStatus')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALL_STATUSES.map(s => <SelectItem key={s} value={s}>{t(statusTranslationMap[s])}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('facturaForm.detailsTitle')}</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">{t('facturaForm.productLabel')}</TableHead>
                      <TableHead className="w-[15%]">{t('facturaForm.quantityLabel')}</TableHead>
                      <TableHead className="w-[20%]">{t('facturaForm.unitPriceLabel')}</TableHead>
                      <TableHead className="w-[15%]">{t('facturaForm.vatLabel')}</TableHead>
                      <TableHead className="w-[15%] text-right">{t('facturaForm.subtotalLabel')}</TableHead>
                      <TableHead className="w-[5%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`detalles.${index}.productoId`}
                            render={({ field }) => (
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  handleProductChange(index, value)
                                }} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('facturaForm.selectProduct')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {productos.map(p => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            )}
                          />
                            <FormMessage>{form.formState.errors.detalles?.[index]?.productoId?.message}</FormMessage>
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`detalles.${index}.cantidad`}
                            render={({ field }) => <Input type="number" {...field} />}
                          />
                            <FormMessage>{form.formState.errors.detalles?.[index]?.cantidad?.message}</FormMessage>
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`detalles.${index}.precioUnitario`}
                            render={({ field }) => <Input type="number" step="0.01" {...field} />}
                          />
                           <FormMessage>{form.formState.errors.detalles?.[index]?.precioUnitario?.message}</FormMessage>
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`detalles.${index}.porcentajeIva`}
                            render={({ field }) => <Input type="number" step="0.01" {...field} />}
                          />
                          <FormMessage>{form.formState.errors.detalles?.[index]?.porcentajeIva?.message}</FormMessage>
                        </TableCell>
                        <TableCell className="text-right">
                          {((form.watch(`detalles.${index}.cantidad`) || 0) * (form.watch(`detalles.${index}.precioUnitario`) || 0)).toFixed(2)} {watchedMoneda}
                        </TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
               <FormMessage>{form.formState.errors.detalles?.message}</FormMessage> {/* For array-level errors like min(1) */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productoId: '', cantidad: 1, precioUnitario: 0, porcentajeIva: 21 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> {t('facturaForm.addLineItem')}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end pt-6 border-t">
                <div className="md:col-start-3 space-y-1 text-right">
                    <p className="text-sm text-muted-foreground">{t('facturas.taxableBase')}:</p>
                    <p className="font-semibold text-lg">{form.watch("baseImponible").toFixed(2)} {watchedMoneda}</p>
                </div>
                 <div className="space-y-1 text-right">
                    <p className="text-sm text-muted-foreground">{t('facturas.totalVAT')}:</p>
                    <p className="font-semibold text-lg">{form.watch("totalIva").toFixed(2)} {watchedMoneda}</p>
                </div>
                 <div className="col-span-2 md:col-span-4 space-y-1 text-right border-t pt-2 mt-2">
                    <p className="text-lg text-muted-foreground">{t('facturas.totalInvoice')}:</p>
                    <p className="font-bold text-2xl text-primary">{form.watch("totalFactura").toFixed(2)} {watchedMoneda}</p>
                </div>
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting || (!form.formState.isDirty && isEditMode)}>
              {isSubmitting ? t('common.saving') : actualSubmitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    