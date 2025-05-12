"use client";
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction, FilePlus2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function NewFacturaPage() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [invoiceType, setInvoiceType] = useState<'Venta' | 'Compra' | 'General'>('General');
  const [invoiceTypeText, setInvoiceTypeText] = useState('');

  useEffect(() => {
    const tipo = searchParams.get('tipo');
    if (tipo === 'venta') {
      setInvoiceType('Venta');
      setInvoiceTypeText(t('facturas.typeSale'));
    } else if (tipo === 'compra') {
      setInvoiceType('Compra');
      setInvoiceTypeText(t('facturas.typePurchase'));
    } else {
      setInvoiceType('General');
      setInvoiceTypeText(t('common.all')); // Or a generic term if 'All' doesn't fit
    }
  }, [searchParams, t]);

  const pageTitle = invoiceType === 'General' 
    ? t('newFacturaPage.titleCreateGeneral') 
    : t('newFacturaPage.titleCreateTyped', { type: invoiceTypeText });
  
  const pageDescription = invoiceType === 'General'
    ? t('newFacturaPage.descriptionGeneral')
    : t('newFacturaPage.descriptionTyped', { type: invoiceTypeText.toLowerCase() });

  const associatedParty = invoiceType === 'Venta' 
    ? t('newFacturaPage.associatedPartyClient') 
    : invoiceType === 'Compra' 
    ? t('newFacturaPage.associatedPartySupplier')
    : t('newFacturaPage.associatedPartyGeneric');

  return (
    <>
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actionButton={
          <Button variant="outline" asChild>
            <Link href={invoiceType === 'Venta' ? "/dashboard/facturas/ventas" : invoiceType === 'Compra' ? "/dashboard/facturas/compras" : "/dashboard/facturas"}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              {t('pageHeader.backTo', { section: invoiceType === 'Venta' ? t('sidebar.facturasVentas') : invoiceType === 'Compra' ? t('sidebar.facturasCompras') : t('sidebar.facturasTodas') })}
            </Link>
          </Button>
        }
      />
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FilePlus2 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>{t('common.formUnderConstruction')}</CardTitle>
              <CardDescription>{t('newFacturaPage.formComingSoon', { type: invoiceTypeText.toLowerCase() })}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t('newFacturaPage.constructionDetails')}
          </p>
          <div className="space-y-3 p-4 border rounded-md bg-muted/50">
            <h4 className="font-semibold text-lg">{t('newFacturaPage.plannedFormTitle')}</h4>
            
            <div>
              <h5 className="font-medium">{t('newFacturaPage.sectionHeaderTitle')}</h5>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                <li>{t('newFacturaPage.fieldDate')}</li>
                <li>{t('newFacturaPage.fieldInvoiceNumber')}</li>
                <li>{t('newFacturaPage.fieldInvoiceType')} ({invoiceTypeText})</li>
                <li>{t('newFacturaPage.fieldAssociatedParty', { party: associatedParty })}</li>
                <li>{t('newFacturaPage.fieldEmployee')}</li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium">{t('newFacturaPage.sectionDetailsTitle')}</h5>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                <li>{t('newFacturaPage.fieldProductServiceSelection')}</li>
                <li>{t('newFacturaPage.fieldQuantity')}</li>
                <li>{t('newFacturaPage.fieldUnitPrice')}</li>
                <li>{t('newFacturaPage.fieldVatRate')}</li>
                <li>{t('newFacturaPage.fieldLineSubtotal')}</li>
              </ul>
            </div>

             <div>
              <h5 className="font-medium">{t('newFacturaPage.sectionSummaryTitle')}</h5>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                <li>{t('newFacturaPage.fieldTaxableBase')}</li>
                <li>{t('newFacturaPage.fieldTotalVatAmount')}</li>
                <li>{t('newFacturaPage.fieldGrandTotal')}</li>
                <li>{t('newFacturaPage.fieldStatusSelection')}</li>
              </ul>
            </div>
            {invoiceType === 'Venta' && (
              <div>
                <h5 className="font-medium">{t('newFacturaPage.sectionPaymentTitle')}</h5>
                <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                  <li>{t('newFacturaPage.fieldPaymentMethod')}</li>
                  <li>{t('newFacturaPage.fieldPaymentDueDate')}</li>
                </ul>
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Construction className="h-5 w-5"/> 
            <span>{t('newFacturaPage.checkBackSoon')}</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
