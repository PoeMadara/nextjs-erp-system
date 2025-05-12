
"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { FacturaForm, type FacturaFormValues } from '@/components/crud/FacturaForm';
import { addFactura } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import type { FacturaTipo } from '@/types';
import { format } from 'date-fns';

const NO_WAREHOUSE_SENTINEL_VALUE = "__NO_WAREHOUSE_SENTINEL__";

export default function NewFacturaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [initialType, setInitialType] = useState<FacturaTipo | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tipoParam = searchParams.get('tipo');
    if (tipoParam === 'venta') {
      setInitialType('Venta');
    } else if (tipoParam === 'compra') {
      setInitialType('Compra');
    } else {
      setInitialType(undefined); 
    }
  }, [searchParams]);

  const handleSubmit = async (values: FacturaFormValues) => {
    setIsSubmitting(true);
    
    const facturaToCreate = {
      ...values,
      fecha: format(values.fecha, "yyyy-MM-dd"), 
      almacenId: (values.almacenId === "" || values.almacenId === NO_WAREHOUSE_SENTINEL_VALUE) ? undefined : values.almacenId,
    };

    try {
      const newFactura = await addFactura(facturaToCreate);
      toast({
        title: t('common.success'),
        description: t('facturas.successCreate', { id: newFactura.id }),
      });
      router.push(`/dashboard/facturas/${newFactura.id}/view`);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: t('common.error'),
        description: t('facturas.failCreate'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = initialType === 'Venta' ? t('newFacturaPage.titleCreateTyped', { type: t('facturas.typeSale') })
                  : initialType === 'Compra' ? t('newFacturaPage.titleCreateTyped', { type: t('facturas.typePurchase') })
                  : t('newFacturaPage.titleCreateGeneral');

  const pageDescription = initialType === 'Venta' ? t('newFacturaPage.descriptionTyped', { type: t('facturas.typeSale').toLowerCase() })
                        : initialType === 'Compra' ? t('newFacturaPage.descriptionTyped', { type: t('facturas.typePurchase').toLowerCase() })
                        : t('newFacturaPage.descriptionGeneral');

  const backLink = initialType === 'Venta' ? "/dashboard/facturas/ventas"
                 : initialType === 'Compra' ? "/dashboard/facturas/compras"
                 : "/dashboard/facturas";
  
  const backLinkText = initialType === 'Venta' ? t('sidebar.facturasVentas')
                     : initialType === 'Compra' ? t('sidebar.facturasCompras')
                     : t('sidebar.facturasTodas');


  const formDefaultValues: Partial<FacturaFormValues> = initialType ? { tipo: initialType, almacenId: "" } : { tipo: 'Venta', almacenId: "" };


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
        isEditMode={false} 
        submitButtonText={t('facturaForm.createButton')}
      />
    </>
  );
}

    