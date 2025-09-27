
"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { useTranslation } from "@/hooks/useTranslation"

interface ChartDataItem {
  month: string;
  sales: number;
}

interface SalesChartProps {
  chartData: ChartDataItem[];
  currencySymbol?: string;
}

export function SalesChart({ chartData, currencySymbol = "$" }: SalesChartProps) {
  const { t } = useTranslation();

  const chartConfig = {
    sales: {
      label: t('dashboardPage.chartSalesLabel'),
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{t('dashboardPage.salesOverviewTitle')}</CardTitle>
        <CardDescription>{t('dashboardPage.salesOverviewDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-30}
                textAnchor="end"
                height={50}
                interval={0} // Ensure all ticks are attempted to be shown
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `${currencySymbol}${Math.round(value / 1000)}K`}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
