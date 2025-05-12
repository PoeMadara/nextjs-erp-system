"use client";
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export default function NewProveedorPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader
        title={t('suppliers.newTitle')}
        description={t('suppliers.newDescription')}
        actionButton={
          <Button variant="outline" asChild>
            <Link href="/dashboard/proveedores">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.proveedores')})}
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
            {t('suppliers.underConstructionMessage')}
          </p>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">{t('suppliers.formPlannedFields')}:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>{t('suppliers.fieldSupplierName')}</li>
              <li>{t('suppliers.fieldNIFCIF')}</li>
              <li>{t('suppliers.fieldContactEmail')}</li>
              <li>{t('suppliers.fieldPhone')}</li>
              <li>{t('suppliers.fieldFullAddress')}</li>
              <li>{t('suppliers.fieldContactPerson')}</li>
              <li>{t('suppliers.fieldPaymentTerms')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
