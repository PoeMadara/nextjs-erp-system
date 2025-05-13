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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Empleado, EmpleadoRole } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

const makeEmpleadoSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  nombre: z.string().min(2, { message: t('employees.validation.nameMinLength', { count: 2 }) }),
  email: z.string().email({ message: t('employees.validation.emailInvalid') }),
  telefono: z.string().optional(),
  role: z.enum(['admin', 'moderator', 'user'], { required_error: t('employees.validation.roleRequired')}),
});

export type EmpleadoFormValues = z.infer<ReturnType<typeof makeEmpleadoSchema>>;

interface EmpleadoFormProps {
  onSubmit: (values: EmpleadoFormValues) => void;
  defaultValues?: Partial<Empleado>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  canEditRole?: boolean; // New prop
  isEditingSelf?: boolean; // New prop
}

export function EmpleadoForm({ 
  onSubmit, 
  defaultValues, 
  isSubmitting = false, 
  submitButtonText,
  canEditRole = true, // Default to true for new employee form
  isEditingSelf = false 
}: EmpleadoFormProps) {
  const { t } = useTranslation();
  const empleadoSchema = makeEmpleadoSchema(t);
  
  const form = useForm<EmpleadoFormValues>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: {
      nombre: defaultValues?.nombre || "",
      email: defaultValues?.email || "",
      telefono: defaultValues?.telefono || "",
      role: defaultValues?.role || 'user',
    },
  });

  const actualSubmitButtonText = submitButtonText || (defaultValues?.id ? t('employees.updateButton') : t('employees.createButton'));

  const roles: EmpleadoRole[] = ['admin', 'moderator', 'user'];

  return (
    <Card className="max-w-2xl mx-auto shadow-lg mt-6">
      <CardHeader>
        <CardTitle>{defaultValues?.id ? t('employeeForm.editTitle') : t('employeeForm.createTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employeeForm.nameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('employeeForm.namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employeeForm.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('employeeForm.emailPlaceholder')} {...field} />
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
                  <FormLabel>{t('employeeForm.phoneLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('employeeForm.phonePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('employeeForm.roleLabel')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!canEditRole || (isEditingSelf && field.value === 'admin' && roles.filter(r => r === 'admin').length <=1 )} // Disable if cannot edit role or if editing self and is last admin
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('employees.selectRole')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem 
                          key={role} 
                          value={role}
                          // Prevent demoting the last admin, or self if last admin
                          disabled={isEditingSelf && field.value === 'admin' && role !== 'admin' && empleados.filter(e => e.role === 'admin').length <= 1}
                        >
                          {t(`employees.role${role.charAt(0).toUpperCase() + role.slice(1)}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
