import FacturaListClientPage from '@/components/crud/FacturaListClientPage';

export const metadata = {
  title: 'Facturas de Compra - ERP System',
};

export default function FacturasComprasPage() {
  return (
    <FacturaListClientPage
      pageTitleKey="purchaseInvoices.title"
      pageDescriptionKey="purchaseInvoices.description"
      newButtonTextKey="purchaseInvoices.newPurchaseInvoiceButton"
      newButtonLink="/dashboard/facturas/new?tipo=compra"
      invoiceTypeFilter="Compra"
    />
  );
}
