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
import type { Cliente } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

const makeClienteSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  nombre: z.string().min(2, { message: t('clientes.validation.nameMinLength', { count: 2 }) }),
  nif: z.string().regex(/^[A-Za-z0-9]{9}$/, { message: t('clientes.validation.nifRegex') }).optional().or(z.literal('')),
  email: z.string().email({ message: t('clientes.validation.emailInvalid') }),
  direccion: z.string().optional(),
  poblacion: z.string().optional(),
  telefono: z.string().optional(),
});

export type ClienteFormValues = z.infer<ReturnType<typeof makeClienteSchema>>;

interface ClienteFormProps {
  onSubmit: (values: ClienteFormValues) => void;
  defaultValues?: Partial<Cliente>;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function ClienteForm({ 
  onSubmit, 
  defaultValues, 
  isSubmitting = false, 
  submitButtonText 
}: ClienteFormProps) {
  const { t } = useTranslation();
  const clienteSchema = makeClienteSchema(t);
  
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: defaultValues?.nombre || "",
      nif: defaultValues?.nif || "",
      email: defaultValues?.email || "",
      direccion: defaultValues?.direccion || "",
      poblacion: defaultValues?.poblacion || "",
      telefono: defaultValues?.telefono || "",
    },
  });

  const actualSubmitButtonText = submitButtonText || (defaultValues?.id ? t('clientes.updateButton') : t('clientes.createButton'));

  return (
    <Card className="max-w-2xl mx-auto shadow-lg mt-6">
      <CardHeader>
        <CardTitle>{defaultValues?.id ? t('clienteForm.editTitle') : t('clienteForm.createTitle')}</CardTitle>
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
                    <FormLabel>{t('clienteForm.nameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('clienteForm.namePlaceholder')} {...field} />
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
                    <FormLabel>{t('clienteForm.nifLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('clienteForm.nifPlaceholder')} {...field} />
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
                  <FormLabel>{t('clienteForm.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('clienteForm.emailPlaceholder')} {...field} />
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
                  <FormLabel>{t('clienteForm.addressLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('clienteForm.addressPlaceholder')} {...field} />
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
                    <FormLabel>{t('clienteForm.cityLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('clienteForm.cityPlaceholder')} {...field} />
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
                    <FormLabel>{t('clienteForm.phoneLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('clienteForm.phonePlaceholder')} {...field} />
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
