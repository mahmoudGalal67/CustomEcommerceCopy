"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { TrendingUp } from "lucide-react";

const chartConfig = {
  Revenue: {
    label: "Visitors",
  },
} satisfies ChartConfig;

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--chart-1)",
  processing: "var(--chart-4)",
  shipped: "var(--chart-3)",
  completed: "var(--chart-2)",
  cancelled: "var(--chart-5)",
};

interface Props {
  data: {
    status: string;
    total: number;
    fill?: string;
  }[];
}

const AppPieChart = ({ data }: Props) => {
  const chartData = data.map((item) => ({
    ...item,
    fill: STATUS_COLORS[item.status] ?? "hsl(220 14% 80%)",
  }));

  // If you don't use React compiler use useMemo hook to improve performance
  const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">Orders By Status</h1>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-62.5"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalRevenue.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Revenue
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="mt-4 flex flex-col gap-2 items-center">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total Revenue
        </div>
      </div>
    </div>
  );
};

export default AppPieChart;
