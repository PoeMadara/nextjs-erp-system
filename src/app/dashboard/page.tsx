
"use client";
import { useEffect, useState, useMemo } from 'react';
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { PurchasesChart } from "@/components/dashboard/PurchasesChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, ListChecks, TrendingUp, TrendingDown, Banknote } from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from '@/hooks/useTranslation';
import { getRecentSales, getRecentOrders, getWarehouseStatus, getTotalStockValue, getClientes } from '@/lib/mockData';
import type { RecentSale, RecentOrder, WarehouseSummary, Cliente, CurrencyCode } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  totalRevenue: number; // Assumed to be in BASE_CURRENCY (e.g., USD)
  newCustomersCount: number;
  salesCount: number;
  productsInStock: number;
  recentSales: RecentSale[]; // Amounts also in BASE_CURRENCY
  recentOrders: RecentOrder[]; // Amounts also in BASE_CURRENCY
  warehouseStatus: WarehouseSummary[];
}

type DisplayCurrency = 'USD' | 'EUR' | 'GBP';

const MOCK_EXCHANGE_RATES: Record<DisplayCurrency, Record<DisplayCurrency, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, USD: 1 },
  EUR: { USD: 1.08, GBP: 0.85, EUR: 1 },
  GBP: { USD: 1.26, EUR: 1.17, GBP: 1 },
};
const BASE_CURRENCY: DisplayCurrency = 'USD'; // Assume all data from mockData.ts is in USD

const CURRENCY_SYMBOLS: Record<DisplayCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

// Mock monthly data (assumed to be in BASE_CURRENCY)
const baseSalesData = [
  { month: "January", sales: 1860 }, { month: "February", sales: 3050 }, { month: "March", sales: 2370 },
  { month: "April", sales: 730 }, { month: "May", sales: 2090 }, { month: "June", sales: 2140 },
  { month: "July", sales: 2500 }, { month: "August", sales: 1900 }, { month: "September", sales: 3200 },
  { month: "October", sales: 2800 }, { month: "November", sales: 2200 }, { month: "December", sales: 3500 },
];

const basePurchasesData = [
  { month: "January", purchases: 1200 }, { month: "February", purchases: 2200 }, { month: "March", purchases: 1500 },
  { month: "April", purchases: 500 }, { month: "May", purchases: 1800 }, { month: "June", purchases: 1600 },
  { month: "July", purchases: 2000 }, { month: "August", purchases: 1300 }, { month: "September", purchases: 2500 },
  { month: "October", purchases: 2100 }, { month: "November", purchases: 1700 }, { month: "December", purchases: 2800 },
];


export default function DashboardPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<DisplayCurrency>('EUR');

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
          newCustomersCount: allClientes.length,
          salesCount: stockValueData.salesCount,
          productsInStock: stockValueData.totalStock,
          recentSales: salesData,
          recentOrders: ordersData,
          warehouseStatus: warehouseData,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const convertAmount = (amount: number, from: DisplayCurrency, to: DisplayCurrency): number => {
    if (from === to) return amount;
    const rate = MOCK_EXCHANGE_RATES[from]?.[to];
    return rate ? amount * rate : amount; // Fallback to original amount if rate not found
  };

  const displayTotalRevenue = useMemo(() => {
    if (!data) return 0;
    return convertAmount(data.totalRevenue, BASE_CURRENCY, selectedCurrency);
  }, [data, selectedCurrency]);

  const displaySalesChartData = useMemo(() => {
    return baseSalesData.map(item => ({
      ...item,
      sales: parseFloat(convertAmount(item.sales, BASE_CURRENCY, selectedCurrency).toFixed(0))
    }));
  }, [selectedCurrency]);

  const displayPurchasesChartData = useMemo(() => {
    return basePurchasesData.map(item => ({
      ...item,
      purchases: parseFloat(convertAmount(item.purchases, BASE_CURRENCY, selectedCurrency).toFixed(0))
    }));
  }, [selectedCurrency]);
  
  const displayRecentSales = useMemo(() => {
    if (!data) return [];
    return data.recentSales.map(sale => ({
        ...sale,
        amount: convertAmount(sale.amount, sale.currency as DisplayCurrency, selectedCurrency) 
    }));
  }, [data, selectedCurrency]);

  const displayRecentOrders = useMemo(() => {
    if (!data) return [];
    return data.recentOrders.map(order => ({
        ...order,
        amount: convertAmount(order.amount, order.currency as DisplayCurrency, selectedCurrency)
    }));
  }, [data, selectedCurrency]);


  const currencySymbol = CURRENCY_SYMBOLS[selectedCurrency];

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-10 w-32" />
        </div>
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('dashboardPage.title')}</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="currency-select" className="text-sm font-medium text-muted-foreground">
            {t('dashboardPage.selectCurrencyPrompt')}
          </Label>
          <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as DisplayCurrency)}>
            <SelectTrigger id="currency-select" className="w-[120px] shadow-sm">
              <Banknote className="h-4 w-4 mr-2 opacity-70" />
              <SelectValue placeholder={t('dashboardPage.selectCurrencyPrompt')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">{t('dashboardPage.currencyUSD')}</SelectItem>
              <SelectItem value="EUR">{t('dashboardPage.currencyEUR')}</SelectItem>
              <SelectItem value="GBP">{t('dashboardPage.currencyGBP')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title={t('dashboardPage.totalRevenue')} 
          value={`${currencySymbol}${displayTotalRevenue.toFixed(2)}`} 
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
        <SalesChart chartData={displaySalesChartData} currencySymbol={currencySymbol} />
        <PurchasesChart chartData={displayPurchasesChartData} currencySymbol={currencySymbol} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
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
                 {data.warehouseStatus.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                         {t('common.loading')}
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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
                {displayRecentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell className="text-right">{currencySymbol}{sale.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                 {displayRecentSales.length === 0 && (
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
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
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
                {displayRecentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">{currencySymbol}{order.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {displayRecentOrders.length === 0 && (
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
             {/* Placeholder if no notifications */}
            {/* <p className="text-sm text-muted-foreground">{t('common.loading')}</p> */}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <CardTitle>{t('dashboardPage.quickLinks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard/facturas/new" className="text-primary hover:underline">{t('dashboardPage.quickLinkCreateInvoice')}</Link></li>
              <li><Link href="/dashboard/clientes/new" className="text-primary hover:underline">{t('dashboardPage.quickLinkAddCustomer')}</Link></li>
              <li><Link href="/dashboard/productos" className="text-primary hover:underline">{t('dashboardPage.quickLinkViewProducts')}</Link></li>
            </ul>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
