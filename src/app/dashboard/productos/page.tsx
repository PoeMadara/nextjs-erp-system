import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export const metadata = {
  title: 'Productos - ERP System',
};

export default function ProductosPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader
        title={t('products.title')}
        description={t('products.description')}
        actionButton={
          <Button asChild className="shadow-sm" disabled>
            <Link href="/dashboard/productos/new">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('products.addNewProductButton')}
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
            {t('products.underConstructionMessage')}
          </p>
           <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">{t('common.plannedFeatures')}:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>{t('products.feature1')}</li>
              <li>{t('products.feature2')}</li>
              <li>{t('products.feature3')}</li>
              <li>{t('products.feature4')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
