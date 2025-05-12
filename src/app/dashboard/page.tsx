import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, ListChecks } from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/useTranslation";

// Mock data - replace with actual data fetching
const recentSales = [
  { id: "FV2024-0123", customer: "Juan Pérez", amount: 217.19, date: "2024-07-15" },
  { id: "FV2024-0122", customer: "Ana López", amount: 899.99, date: "2024-07-14" },
  { id: "FV2024-0121", customer: "Carlos Ruiz", amount: 79.90, date: "2024-07-14" },
];

const recentOrders = [
  { id: "PC2024-0056", supplier: "Suministros IT", amount: 600.00, date: "2024-07-13" },
  { id: "PC2024-0055", supplier: "Oficina Global", amount: 120.50, date: "2024-07-12" },
];

const warehouseStatus = [
  { name: "Almacén Central", capacity: "85%", items: 1250, location: "Polígono Central" },
  { name: "Almacén Tienda", capacity: "60%", items: 340, location: "Trastienda Local" },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('dashboardPage.title')}</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title={t('dashboardPage.totalRevenue')} 
          value="$15,231.89" 
          icon={DollarSign} 
          description={t('dashboardPage.fromLastMonth', {value: "20.1"})}
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <MetricCard 
          title={t('dashboardPage.newCustomers')}
          value="+230" 
          icon={Users} 
          description={t('dashboardPage.fromLastMonth', {value: "18.7"})}
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <MetricCard 
          title={t('dashboardPage.sales')}
          value="+1,234" 
          icon={ShoppingCart} 
          description={t('dashboardPage.fromLastMonth', {value: "5.3"})}
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <MetricCard 
          title={t('dashboardPage.productsInStock')}
          value="5,782" 
          icon={Package} 
          description={t('dashboardPage.totalItemsAvailable')}
          className="shadow-md hover:shadow-lg transition-shadow"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SalesChart />
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              {t('dashboardPage.warehouseStatus')}
            </CardTitle>
            <CardDescription>{t('dashboardPage.warehouseOverview')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboardPage.warehouse')}</TableHead>
                  <TableHead>{t('dashboardPage.location')}</TableHead>
                  <TableHead className="text-right">{t('dashboardPage.items')}</TableHead>
                  <TableHead className="text-right">{t('dashboardPage.capacity')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouseStatus.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell className="text-right">{item.items}</TableCell>
                    <TableCell className="text-right">{item.capacity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>{t('dashboardPage.recentSales')}</CardTitle>
            <CardDescription>{t('dashboardPage.recentSalesDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboardPage.invoiceId')}</TableHead>
                  <TableHead>{t('dashboardPage.customer')}</TableHead>
                  <TableHead>{t('dashboardPage.date')}</TableHead>
                  <TableHead className="text-right">{t('dashboardPage.amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell className="text-right">${sale.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>{t('dashboardPage.recentPurchaseOrders')}</CardTitle>
            <CardDescription>{t('dashboardPage.recentPurchaseOrdersDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboardPage.orderId')}</TableHead>
                  <TableHead>{t('dashboardPage.supplier')}</TableHead>
                  <TableHead>{t('dashboardPage.date')}</TableHead>
                  <TableHead className="text-right">{t('dashboardPage.amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{t('dashboardPage.teamActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://picsum.photos/seed/teamactivity/400/200" alt="Team Activity Chart" width={400} height={200} className="rounded-md" data-ai-hint="team activity chart"/>
            <p className="text-sm text-muted-foreground mt-2">{t('dashboardPage.teamActivityPlaceholder')}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{t('dashboardPage.notifications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li><span className="font-semibold text-primary">{t('dashboardPage.notificationNew')}</span> {t('dashboardPage.lowStockAlert')}</li>
              <li><span className="font-semibold text-destructive">{t('dashboardPage.notificationOverdue')}</span> {t('dashboardPage.overdueInvoicePayment')}</li>
              <li><span className="font-semibold text-yellow-500">{t('dashboardPage.notificationPending')}</span> {t('dashboardPage.pendingPOApproval')}</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{t('dashboardPage.quickLinks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard/facturas/new" className="text-primary hover:underline">{t('dashboardPage.quickLinkCreateInvoice')}</a></li>
              <li><a href="/dashboard/clientes/new" className="text-primary hover:underline">{t('dashboardPage.quickLinkAddCustomer')}</a></li>
              <li><a href="/dashboard/productos" className="text-primary hover:underline">{t('dashboardPage.quickLinkViewProducts')}</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
