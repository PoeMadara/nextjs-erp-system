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
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Revenue" 
          value="$15,231.89" 
          icon={DollarSign} 
          description="+20.1% from last month" 
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <MetricCard 
          title="New Customers" 
          value="+230" 
          icon={Users} 
          description="+18.7% from last month"
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <MetricCard 
          title="Sales" 
          value="+1,234" 
          icon={ShoppingCart} 
          description="+5.3% from last month"
          className="shadow-md hover:shadow-lg transition-shadow"
        />
        <MetricCard 
          title="Products in Stock" 
          value="5,782" 
          icon={Package} 
          description="Total items available"
          className="shadow-md hover:shadow-lg transition-shadow"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SalesChart />
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Warehouse Status
            </CardTitle>
            <CardDescription>Overview of current warehouse capacity and items.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
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
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Last few sales recorded in the system.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
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
            <CardTitle>Recent Purchase Orders</CardTitle>
            <CardDescription>Last few purchase orders created.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
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
            <CardTitle>Team Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://picsum.photos/seed/teamactivity/400/200" alt="Team Activity Chart" width={400} height={200} className="rounded-md" data-ai-hint="team activity chart" />
            <p className="text-sm text-muted-foreground mt-2">Placeholder for team activity feed or chart.</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li><span className="font-semibold text-primary">New:</span> Low stock alert for Product XYZ.</li>
              <li><span className="font-semibold text-destructive">Overdue:</span> Invoice #INV-0078 payment.</li>
              <li><span className="font-semibold text-yellow-500">Pending:</span> Approval for PO #PO-056.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard/facturas/new" className="text-primary hover:underline">Create New Invoice</a></li>
              <li><a href="/dashboard/clientes/new" className="text-primary hover:underline">Add New Customer</a></li>
              <li><a href="/dashboard/productos" className="text-primary hover:underline">View Products</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
