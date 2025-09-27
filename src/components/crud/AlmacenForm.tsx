
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
import type { Almacen } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

const makeAlmacenSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  nombre: z.string().min(2, { message: t('almacenForm.nameLabel') + " " + t('common.error') }), // Basic validation example
  ubicacion: z.string().optional(),
  capacidad: z.string().optional(),
  personaContacto: z.string().optional(),
  telefonoContacto: z.string().optional(),
  notas: z.string().optional(),
});

export type AlmacenFormValues = z.infer<ReturnType<typeof makeAlmacenSchema>>;

interface AlmacenFormProps {
  onSubmit: (values: AlmacenFormValues) => void;
  defaultValues?: Partial<Almacen>;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function AlmacenForm({ 
  onSubmit, 
  defaultValues, 
  isSubmitting = false, 
  submitButtonText 
}: AlmacenFormProps) {
  const { t } = useTranslation();
  const almacenSchema = makeAlmacenSchema(t);
  
  const form = useForm<AlmacenFormValues>({
    resolver: zodResolver(almacenSchema),
    defaultValues: {
      nombre: defaultValues?.nombre || "",
      ubicacion: defaultValues?.ubicacion || "",
      capacidad: defaultValues?.capacidad || "",
      personaContacto: defaultValues?.personaContacto || "",
      telefonoContacto: defaultValues?.telefonoContacto || "",
      notas: defaultValues?.notas || "",
    },
  });

  const actualSubmitButtonText = submitButtonText || (defaultValues?.id ? t('warehouse.updateButton') : t('warehouse.createButton'));

  return (
    <Card className="max-w-2xl mx-auto shadow-lg mt-6">
      <CardHeader>
        <CardTitle>{defaultValues?.id ? t('almacenForm.editTitle') : t('almacenForm.createTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('almacenForm.nameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('almacenForm.namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('almacenForm.locationLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('almacenForm.locationPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('almacenForm.capacityLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('almacenForm.capacityPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="personaContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('almacenForm.contactPersonLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('almacenForm.contactPersonPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefonoContacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('almacenForm.contactPhoneLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('almacenForm.contactPhonePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('almacenForm.notesLabel')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('almacenForm.notesPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? t('common.saving') : actualSubmitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
