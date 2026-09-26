"use client";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-3)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const AppBarChart = ({
  data,
}: {
  data: { revenue: string; orders: number };
}) => {
  const chartData = [
    {
      label: "Revenue",
      revenue: Number(data.revenue),
      orders: 0,
    },
    {
      label: "Orders",
      revenue: 0,
      orders: data.orders,
    },
  ];
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">Total Revenue and Orders</h1>
      <ChartContainer config={chartConfig} className="min-h-50 w-full">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />

          <XAxis dataKey="label" />

          <YAxis yAxisId="left" />

          <YAxis yAxisId="right" orientation="right" />

          <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" />

          <Bar yAxisId="right" dataKey="orders" fill="var(--color-orders)" />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AppBarChart;
