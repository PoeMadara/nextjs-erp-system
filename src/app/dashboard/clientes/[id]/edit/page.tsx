"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ClienteForm, type ClienteFormValues } from "@/components/crud/ClienteForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { getClienteById, updateCliente } from "@/lib/mockData";
import type { Cliente } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditClientePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      const fetchCliente = async () => {
        setIsLoading(true);
        try {
          const data = await getClienteById(id);
          if (data) {
            setCliente(data);
          } else {
            toast({ title: "Error", description: "Cliente not found.", variant: "destructive" });
            router.push("/dashboard/clientes");
          }
        } catch (error) {
          toast({ title: "Error", description: "Failed to fetch cliente details.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchCliente();
    } else {
      router.push("/dashboard/clientes"); // Should not happen if route is matched correctly
    }
  }, [id, router, toast]);

  const handleSubmit = async (values: ClienteFormValues) => {
    if (!cliente) return;
    setIsSubmitting(true);
    try {
      await updateCliente(cliente.id, values);
      toast({
        title: "Success!",
        description: `Cliente ${values.nombre} updated successfully.`,
      });
      router.push("/dashboard/clientes");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cliente. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title="Edit Cliente" description="Loading cliente details..." />
        <div className="max-w-2xl mx-auto">
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-2/3 mb-6" />
            <Skeleton className="h-10 w-24" />
        </div>
      </>
    );
  }

  if (!cliente) {
    // This case should ideally be handled by redirect in useEffect, but as a fallback:
    return <PageHeader title="Error" description="Cliente not found or failed to load." />;
  }

  return (
    <>
      <PageHeader 
        title="Edit Cliente" 
        description={`Update details for ${cliente.nombre}.`}
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/clientes">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clientes
              </Link>
          </Button>
        }
      />
      <ClienteForm 
        onSubmit={handleSubmit} 
        defaultValues={cliente} 
        isSubmitting={isSubmitting}
        submitButtonText="Update Cliente"
      />
    </>
  );
}
