"use client";
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export default function NewEmpleadoPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader
        title={t('employees.newTitle')}
        description={t('employees.newDescription')}
        actionButton={
          <Button variant="outline" asChild>
            <Link href="/dashboard/empleados">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.empleados')})}
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
             {t('employees.underConstructionMessage')}
          </p>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">{t('employees.formPlannedFields')}:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>{t('employees.fieldFullName')}</li>
              <li>{t('employees.fieldEmail')}</li>
              <li>{t('employees.fieldPhone')}</li>
              <li>{t('employees.fieldPosition')}</li>
              <li>{t('employees.fieldPermissions')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
