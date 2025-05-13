
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getFacturaById, updateFactura as updateFacturaApi } from "@/lib/mockData";
import type { Factura } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FacturaForm, type FacturaFormValues } from "@/components/crud/FacturaForm";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

const NO_WAREHOUSE_SENTINEL_VALUE = "__NO_WAREHOUSE_SENTINEL__";

export default function EditFacturaPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth(); // Get user from context
  const [factura, setFactura] = useState<Factura | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      const fetchFactura = async () => {
        setIsLoading(true);
        try {
          const data = await getFacturaById(id);
          if (data) {
            setFactura(data);
          } else {
            toast({ title: t('common.error'), description: t('facturas.notFound'), variant: "destructive" });
            router.push("/dashboard/facturas");
          }
        } catch (error) {
          toast({ title: t('common.error'), description: t('facturas.failFetchDetails'), variant: "destructive" });
          router.push("/dashboard/facturas");
        } finally {
          setIsLoading(false);
        }
      };
      fetchFactura();
    } else {
      router.push("/dashboard/facturas");
    }
  }, [id, router, toast, t]);

  const handleSubmit = async (values: FacturaFormValues) => {
    if (!factura || !user) { // Check for user
        toast({
            title: t('common.error'),
            description: !factura ? t('facturas.notFound') : "User not authenticated.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }
    setIsSubmitting(true);
    
    const facturaToUpdate = {
      ...values,
      id: factura.id, 
      fecha: format(values.fecha, "yyyy-MM-dd"),
      almacenId: (values.almacenId === "" || values.almacenId === NO_WAREHOUSE_SENTINEL_VALUE) ? undefined : values.almacenId,
    };

    try {
      // Pass user.id and t to updateFacturaApi
      await updateFacturaApi(factura.id, facturaToUpdate as Factura, user.id, t); 
      toast({
        title: t('common.success'),
        description: t('facturas.successUpdate', { id: factura.id }),
      });
      router.push(`/dashboard/facturas/${factura.id}/view`);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('facturas.failUpdate', { id: factura.id }),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = t('editFacturaPage.title');
  const pageDescription = factura ? t('editFacturaPage.description', { id: factura.id }) : t('common.loading');
  
  const backLink = factura?.tipo === 'Venta' ? "/dashboard/facturas/ventas" 
                  : factura?.tipo === 'Compra' ? "/dashboard/facturas/compras" 
                  : "/dashboard/facturas";
  
  const backLinkText = factura?.tipo === 'Venta' ? t('sidebar.facturasVentas') 
                  : factura?.tipo === 'Compra' ? t('sidebar.facturasCompras') 
                  : t('sidebar.facturasTodas');

  if (isLoading) {
    return (
      <>
        <PageHeader 
          title={pageTitle}
          description={t('common.loading')}
          actionButton={
            <Button variant="outline" asChild disabled>
                <Link href={backLink}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: backLinkText})}
                </Link>
            </Button>
          }
        />
        <div className="mt-6 space-y-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
             <Skeleton className="h-10 w-24" />
        </div>
      </>
    );
  }
  
  if (!factura) {
     return (
      <>
        <PageHeader 
          title={t('common.error')}
          description={t('facturas.notFound')}
          actionButton={
            <Button variant="outline" asChild>
                <Link href="/dashboard/facturas">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.facturas')})}
                </Link>
            </Button>
          }
        />
      </>
    );
  }

  const formDefaultValues: FacturaFormValues = {
    ...factura,
    fecha: parseISO(factura.fecha), 
    clienteId: factura.clienteId || undefined,
    proveedorId: factura.proveedorId || undefined,
    almacenId: factura.almacenId || "", 
    detalles: factura.detalles.map(d => ({
        ...d,
        productoId: d.productoId || '', 
    }))
  };


  return (
    <>
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actionButton={
          <Button variant="outline" asChild>
            <Link href={backLink}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              {t('pageHeader.backTo', { section: backLinkText })}
            </Link>
          </Button>
        }
      />
      <FacturaForm 
        onSubmit={handleSubmit}
        defaultValues={formDefaultValues}
        isSubmitting={isSubmitting}
        isEditMode={true} 
        submitButtonText={t('facturaForm.updateButton')}
      />
    </>
  );
}

    
