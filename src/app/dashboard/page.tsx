
"use client";
import { useEffect, useState } from 'react';
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, ListChecks, TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from '@/hooks/useTranslation';
import { getRecentSales, getRecentOrders, getWarehouseStatus, getTotalStockValue, getClientes } from '@/lib/mockData';
import type { RecentSale, RecentOrder, WarehouseSummary, Cliente } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  totalRevenue: number;
  newCustomersCount: number;
  salesCount: number;
  productsInStock: number;
  recentSales: RecentSale[];
  recentOrders: RecentOrder[];
  warehouseStatus: WarehouseSummary[];
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [
          stockValueData,
          allClientes,
          salesData,
          ordersData,
          warehouseData,
        ] = await Promise.all([
          getTotalStockValue(),
          getClientes(),
          getRecentSales(),
          getRecentOrders(),
          getWarehouseStatus(),
        ]);

        setData({
          totalRevenue: stockValueData.totalRevenue,
          newCustomersCount: allClientes.length, // This is total customers, not "new" for the month
          salesCount: stockValueData.salesCount,
          productsInStock: stockValueData.totalStock,
          recentSales: salesData,
          recentOrders: ordersData,
          warehouseStatus: warehouseData,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Optionally set some error state here to show in UI
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg shadow-md" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-lg shadow-lg" />
          <Skeleton className="h-80 rounded-lg shadow-lg" />
        </div>
         <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-60 rounded-lg shadow-md" />
          <Skeleton className="h-60 rounded-lg shadow-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('dashboardPage.title')}</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title={t('dashboardPage.totalRevenue')} 
          value={`$${data.totalRevenue.toFixed(2)}`} 
          icon={DollarSign} 
          description={t('dashboardPage.fromPaidInvoices')}
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <MetricCard 
          title={t('dashboardPage.totalCustomers')} 
          value={`${data.newCustomersCount}`} 
          icon={Users} 
          description={t('dashboardPage.totalRegisteredCustomers')}
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <MetricCard 
          title={t('dashboardPage.sales')}
          value={`${data.salesCount}`} 
          icon={ShoppingCart} 
          description={t('dashboardPage.totalSalesInvoices')}
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <MetricCard 
          title={t('dashboardPage.productsInStock')}
          value={`${data.productsInStock}`} 
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
                {data.warehouseStatus.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell className="text-right">{item.items.toFixed(0)}</TableCell>
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
                {data.recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell className="text-right">${sale.amount.toFixed(2)} {sale.currency}</TableCell>
                  </TableRow>
                ))}
                 {data.recentSales.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                        {t('dashboardPage.noRecentSales')}
                        </TableCell>
                    </TableRow>
                )}
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
                {data.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">${order.amount.toFixed(2)} {order.currency}</TableCell>
                  </TableRow>
                ))}
                {data.recentOrders.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                        {t('dashboardPage.noRecentPurchases')}
                        </TableCell>
                    </TableRow>
                )}
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
            <Image src="https://picsum.photos/seed/teamactivity/400/200" alt={t('dashboardPage.teamActivityAlt')} width={400} height={200} className="rounded-md" data-ai-hint="team activity chart"/>
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
