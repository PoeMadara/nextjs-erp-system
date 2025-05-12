"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Cliente } from "@/types";

const clienteSchema = z.object({
  nombre: z.string().min(2, { message: "Nombre must be at least 2 characters." }),
  nif: z.string().regex(/^[A-Za-z0-9]{9}$/, { message: "NIF must be 9 alphanumeric characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  direccion: z.string().optional(),
  poblacion: z.string().optional(),
  telefono: z.string().optional(),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;

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
  submitButtonText = "Save Cliente" 
}: ClienteFormProps) {
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

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>{defaultValues?.id ? "Edit Cliente" : "Create New Cliente"}</CardTitle>
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
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
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
                    <FormLabel>NIF</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678A" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="juan.perez@example.com" {...field} />
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
                  <FormLabel>Dirección (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle Falsa 123" {...field} />
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
                    <FormLabel>Población (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ciudad Real" {...field} />
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
                    <FormLabel>Teléfono (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="926123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
