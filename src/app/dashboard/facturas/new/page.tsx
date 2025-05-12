"use client";
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function NewFacturaPage() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [tipoFactura, setTipoFactura] = useState<'Venta' | 'Compra' | 'General'>('General');
  const [tipoFacturaText, setTipoFacturaText] = useState('');

  useEffect(() => {
    const tipo = searchParams.get('tipo');
    if (tipo === 'venta') {
      setTipoFactura('Venta');
      setTipoFacturaText(t('facturas.typeSale'));
    } else if (tipo === 'compra') {
      setTipoFactura('Compra');
      setTipoFacturaText(t('facturas.typePurchase'));
    } else {
      setTipoFactura('General');
      setTipoFacturaText(t('common.all'));
    }
  }, [searchParams, t]);

  const pageTitle = tipoFactura === 'General' ? t('newFacturaPage.createGeneralTitle') : t('newFacturaPage.createTypedTitle', { type: tipoFacturaText });
  const pageDescription = tipoFactura === 'General' 
    ? t('newFacturaPage.descriptionGeneral')
    : t('newFacturaPage.descriptionTyped', { type: tipoFacturaText.toLowerCase() });

  const partyRole = tipoFactura === 'Venta' ? t('newFacturaPage.clientRole') : tipoFactura === 'Compra' ? t('newFacturaPage.supplierRole') : t('newFacturaPage.clientSupplierRole');

  return (
    <>
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actionButton={
          <Button variant="outline" asChild>
            <Link href="/dashboard/facturas">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.facturas')})}
            </Link>
          </Button>
        }
      />
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Construction className="h-6 w-6" />
            {t('common.formUnderConstruction')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            {t('newFacturaPage.formUnderConstruction', { type: tipoFacturaText.toLowerCase() })}
          </p>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">{t('newFacturaPage.plannedSections')}:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>{t('newFacturaPage.sectionHeader', { partyRole: partyRole })}</li>
              <li>{t('newFacturaPage.sectionLineItems')}</li>
              <li>{t('newFacturaPage.sectionTotals')}</li>
              <li>{t('newFacturaPage.sectionPayment')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
