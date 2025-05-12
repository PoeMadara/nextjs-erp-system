import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Empleados - ERP Simplified',
};

export default function EmpleadosPage() {
  return (
    <>
      <PageHeader
        title="Empleados"
        description="Manage employee records and access."
        actionButton={
          <Button asChild className="shadow-sm" disabled>
            <Link href="/dashboard/empleados/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Empleado
            </Link>
          </Button>
        }
      />
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Construction className="h-6 w-6" />
            Under Construction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            The Empleados management section is currently under development.
          </p>
           <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">Planned Features:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>View and manage employee profiles.</li>
              <li>Assign roles and permissions.</li>
              <li>Track employee activity related to ERP operations.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
