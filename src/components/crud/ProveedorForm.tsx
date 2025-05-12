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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Proveedor } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { Textarea } from "@/components/ui/textarea";

const makeProveedorSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  nombre: z.string().min(2, { message: t('suppliers.validation.nameMinLength', { count: 2 }) }),
  nif: z.string().min(1, { message: t('suppliers.validation.nifRequired')}).regex(/^[A-Za-z0-9]{9}$/, { message: t('suppliers.validation.nifRegex') }),
  email: z.string().email({ message: t('suppliers.validation.emailInvalid') }),
  direccion: z.string().optional(),
  poblacion: z.string().optional(),
  telefono: z.string().optional(),
  personaContacto: z.string().optional(),
  terminosPago: z.string().optional(),
});

export type ProveedorFormValues = z.infer<ReturnType<typeof makeProveedorSchema>>;

interface ProveedorFormProps {
  onSubmit: (values: ProveedorFormValues) => void;
  defaultValues?: Partial<Proveedor>;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function ProveedorForm({ 
  onSubmit, 
  defaultValues, 
  isSubmitting = false, 
  submitButtonText 
}: ProveedorFormProps) {
  const { t } = useTranslation();
  const proveedorSchema = makeProveedorSchema(t);
  
  const form = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      nombre: defaultValues?.nombre || "",
      nif: defaultValues?.nif || "",
      email: defaultValues?.email || "",
      direccion: defaultValues?.direccion || "",
      poblacion: defaultValues?.poblacion || "",
      telefono: defaultValues?.telefono || "",
      personaContacto: defaultValues?.personaContacto || "",
      terminosPago: defaultValues?.terminosPago || "",
    },
  });

  const actualSubmitButtonText = submitButtonText || (defaultValues?.id ? t('suppliers.updateButton') : t('suppliers.createButton'));

  return (
    <Card className="max-w-2xl mx-auto shadow-lg mt-6">
      <CardHeader>
        <CardTitle>{defaultValues?.id ? t('supplierForm.editTitle') : t('supplierForm.createTitle')}</CardTitle>
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
                    <FormLabel>{t('supplierForm.nameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('supplierForm.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('supplierForm.nifLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('supplierForm.nifPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('supplierForm.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('supplierForm.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('supplierForm.addressLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('supplierForm.addressPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="poblacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('supplierForm.cityLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('supplierForm.cityPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('supplierForm.phoneLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('supplierForm.phonePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="personaContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('supplierForm.contactPersonLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('supplierForm.contactPersonPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terminosPago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('supplierForm.paymentTermsLabel')}</FormLabel>
                    <FormControl>
                       <Textarea placeholder={t('supplierForm.paymentTermsPlaceholder')} {...field} />
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
