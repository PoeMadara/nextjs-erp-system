"use client";
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export default function NewProductoPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader
        title={t('products.newTitle')}
        description={t('products.newDescription')}
        actionButton={
          <Button variant="outline" asChild>
            <Link href="/dashboard/productos">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.productos')})}
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
            {t('products.underConstructionMessage')}
          </p>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">{t('products.formPlannedFields')}:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>{t('products.fieldProductName')}</li>
              <li>{t('products.fieldDescription')}</li>
              <li>{t('products.fieldPurchasePrice')}</li>
              <li>{t('products.fieldSalePrice')}</li>
              <li>{t('products.fieldVATPercentage')}</li>
              <li>{t('products.fieldInitialStock')}</li>
              <li>{t('products.fieldCategory')}</li>
              <li>{t('products.fieldReferenceSKU')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
