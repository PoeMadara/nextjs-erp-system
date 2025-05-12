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
import { useTranslation } from "@/hooks/useTranslation";

export default function EditClientePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
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
            toast({ title: t('common.error'), description: t('clientes.notFound'), variant: "destructive" });
            router.push("/dashboard/clientes");
          }
        } catch (error) {
          toast({ title: t('common.error'), description: t('clientes.failFetchDetails'), variant: "destructive" });
          router.push("/dashboard/clientes");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCliente();
    } else {
      // Should not happen if routing is correct, but good to handle
      toast({ title: t('common.error'), description: t('clientes.invalidId'), variant: "destructive" });
      router.push("/dashboard/clientes"); 
    }
  }, [id, router, toast, t]);

  const handleSubmit = async (values: ClienteFormValues) => {
    if (!cliente) return;
    setIsSubmitting(true);
    try {
      await updateCliente(cliente.id, values);
      toast({
        title: t('common.success'),
        description: t('clientes.successUpdate', { name: values.nombre }),
      });
      router.push("/dashboard/clientes");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('clientes.failUpdate'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHeader 
          title={t('clientes.editTitle')} 
          description={t('common.loading')} 
          actionButton={
            <Button variant="outline" asChild disabled>
                <Link href="/dashboard/clientes">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.clientes')})}
                </Link>
            </Button>
          }
        />
        <div className="max-w-2xl mx-auto mt-6">
            <Skeleton className="h-12 w-1/2 mb-4" /> 
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/3" />
            </div>
        </div>
      </>
    );
  }

  if (!cliente) {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback:
    return (
      <PageHeader 
        title={t('common.error')} 
        description={t('clientes.notFound')} 
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/clientes">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.clientes')})}
              </Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader 
        title={t('clientes.editTitle')}
        description={t('clientes.editDescription', { name: cliente.nombre })}
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/clientes">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.clientes')})}
              </Link>
          </Button>
        }
      />
      <ClienteForm 
        onSubmit={handleSubmit} 
        defaultValues={cliente} 
        isSubmitting={isSubmitting}
        submitButtonText={t('clientes.updateButton')}
      />
    </>
  );
}
