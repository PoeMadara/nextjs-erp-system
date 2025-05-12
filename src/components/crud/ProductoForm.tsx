"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Producto } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

const makeProductoSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  nombre: z.string().min(2, { message: t('products.validation.nameMinLength', { count: 2 }) }),
  referencia: z.string().optional(),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  precioCompra: z.coerce.number().positive({ message: t('products.validation.pricePositive')}),
  precioVenta: z.coerce.number().positive({ message: t('products.validation.pricePositive')}),
  iva: z.coerce.number().min(0, { message: t('products.validation.ivaNonNegative')}),
  stock: z.coerce.number().min(0, { message: t('products.validation.stockNonNegative')}),
});

export type ProductoFormValues = z.infer<ReturnType<typeof makeProductoSchema>>;

interface ProductoFormProps {
  onSubmit: (values: ProductoFormValues) => void;
  defaultValues?: Partial<Producto>;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function ProductoForm({ 
  onSubmit, 
  defaultValues, 
  isSubmitting = false, 
  submitButtonText 
}: ProductoFormProps) {
  const { t } = useTranslation();
  const productoSchema = makeProductoSchema(t);
  
  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: defaultValues?.nombre || "",
      referencia: defaultValues?.referencia || "",
      descripcion: defaultValues?.descripcion || "",
      categoria: defaultValues?.categoria || "",
      precioCompra: defaultValues?.precioCompra || 0,
      precioVenta: defaultValues?.precioVenta || 0,
      iva: defaultValues?.iva || 21,
      stock: defaultValues?.stock || 0,
    },
  });

  const actualSubmitButtonText = submitButtonText || (defaultValues?.id ? t('products.updateButton') : t('products.createButton'));

  return (
    <Card className="max-w-2xl mx-auto shadow-lg mt-6">
      <CardHeader>
        <CardTitle>{defaultValues?.id ? t('productForm.editTitle') : t('productForm.createTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('productForm.nameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('productForm.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('productForm.referenceLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('productForm.referencePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('productForm.descriptionLabel')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('productForm.descriptionPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('productForm.categoryLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('productForm.categoryPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="precioCompra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('productForm.purchasePriceLabel')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="precioVenta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('productForm.salePriceLabel')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="iva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('productForm.vatLabel')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="21" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('productForm.stockLabel')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? t('common.saving') : actualSubmitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
