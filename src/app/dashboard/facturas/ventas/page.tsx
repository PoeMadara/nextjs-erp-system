import FacturaListClientPage from '@/components/crud/FacturaListClientPage';

export const metadata = {
  title: 'Facturas de Venta - ERP System',
};

export default function FacturasVentasPage() {
  return (
    <FacturaListClientPage
      pageTitleKey="salesInvoices.title"
      pageDescriptionKey="salesInvoices.description"
      newButtonTextKey="salesInvoices.newSalesInvoiceButton"
      newButtonLink="/dashboard/facturas/new?tipo=venta"
      invoiceTypeFilter="Venta"
    />
  );
}
