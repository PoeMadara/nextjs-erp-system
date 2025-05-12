"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction, FileEdit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { getFacturaById } from "@/lib/mockData";
import type { Factura } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditFacturaPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <Card className="mt-6 shadow-lg">
            <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
            <CardContent><Skeleton className="h-20 w-full" /></CardContent>
        </Card>
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
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileEdit className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>{t('common.formUnderConstruction')}</CardTitle>
              <CardDescription>{t('editFacturaPage.formComingSoon', { id: factura.id })}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t('editFacturaPage.constructionDetails')}
          </p>
          <div className="space-y-3 p-4 border rounded-md bg-muted/50">
            <h4 className="font-semibold text-lg">{t('editFacturaPage.plannedFormTitle')}</h4>
             <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
              <li>{t('editFacturaPage.fieldReviewHeader')}</li>
              <li>{t('editFacturaPage.fieldModifyDetails')}</li>
              <li>{t('editFacturaPage.fieldChangeCurrency')}</li>
              <li>{t('editFacturaPage.fieldAdjustVAT')}</li>
              <li>{t('editFacturaPage.fieldUpdateStatus')}</li>
            </ul>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Construction className="h-5 w-5"/> 
            <span>{t('editFacturaPage.checkBackSoon')}</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
```