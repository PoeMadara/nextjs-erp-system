"use client";
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction, Warehouse as WarehouseIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export default function NewAlmacenPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader
        title={t('newWarehousePage.titleCreate')}
        description={t('newWarehousePage.description')}
        actionButton={
          <Button variant="outline" asChild>
            <Link href="/dashboard/almacen">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.almacen')})}
            </Link>
          </Button>
        }
      />
      <Card className="mt-6 shadow-lg">
        <CardHeader>
           <div className="flex items-center gap-3">
            <WarehouseIcon className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>{t('common.formUnderConstruction')}</CardTitle>
              <CardDescription>{t('newWarehousePage.formComingSoon')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t('newWarehousePage.constructionDetails')}
          </p>
          <div className="space-y-3 p-4 border rounded-md bg-muted/50">
            <h4 className="font-semibold text-lg">{t('newWarehousePage.plannedFormTitle')}</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
              <li>{t('newWarehousePage.fieldWarehouseName')}</li>
              <li>{t('newWarehousePage.fieldLocationAddress')}</li>
              <li>{t('newWarehousePage.fieldCapacity')}</li>
              <li>{t('newWarehousePage.fieldContactInfo')}</li>
              <li>{t('newWarehousePage.fieldNotes')}</li>
            </ul>
          </div>
           <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Construction className="h-5 w-5"/> 
            <span>{t('newWarehousePage.checkBackSoon')}</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
