import FacturaListClientPage from '@/components/crud/FacturaListClientPage';

export const metadata = {
  title: 'Facturas - ERP System',
};

export default function FacturasPage() {
  return (
    <FacturaListClientPage
      pageTitleKey="facturas.titleAll"
      pageDescriptionKey="facturas.descriptionAll"
      newButtonTextKey="facturas.createNewButton"
      newButtonLink="/dashboard/facturas/new"
    />
  );
}
