
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
import { format } from "date-fns";

export default function EditFacturaPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();
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
    if (!factura) return;
    setIsSubmitting(true);
    
    const facturaToUpdate: Partial<Factura> = {
      ...values,
      fecha: format(values.fecha, "yyyy-MM-dd"), // Format date back to string for storage
      // clienteId, proveedorId, empleadoId, almacenId are directly from 'values'
      // moneda, estado, detalles are directly from 'values'
      // baseImponible, totalIva, totalFactura are calculated and set in 'values' by the form
    };

    try {
      await updateFacturaApi(factura.id, facturaToUpdate as Factura); // Cast needed due to partial nature
      toast({
        title: t('common.success'),
        description: t('facturas.successUpdate', { id: factura.id }),
      });
      router.push(`/dashboard/facturas/${factura.id}/view`); // Or back to list
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('facturas.failUpdate', { id: factura.id }),
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
        defaultValues={factura}
        isSubmitting={isSubmitting}
        submitButtonText={t('facturaForm.updateButton')}
      />
    </>
  );
}

    