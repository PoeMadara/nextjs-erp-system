import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export const metadata = {
  title: 'Empleados - ERP System',
};

export default function EmpleadosPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader
        title={t('employees.title')}
        description={t('employees.description')}
        actionButton={
          <Button asChild className="shadow-sm" disabled>
            <Link href="/dashboard/empleados/new">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('employees.addNewEmployeeButton')}
            </Link>
          </Button>
        }
      />
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Construction className="h-6 w-6" />
            {t('common.underConstruction')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            {t('employees.underConstructionMessage')}
          </p>
           <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">{t('common.plannedFeatures')}:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>{t('employees.feature1')}</li>
              <li>{t('employees.feature2')}</li>
              <li>{t('employees.feature3')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
