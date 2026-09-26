"use client";

import { useState } from "react";

import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import PeriodFilter from "@/components/PeriodFilter";
import RevenueChart from "@/components/RevenueChart";
import { useGetPlatformRevenueQuery } from "@/services/AnalyticApi";

const Homepage = () => {
  const [period, setPeriod] = useState("360d");

  const { data = [], isLoading } = useGetPlatformRevenueQuery(period);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-4 2xl:col-span-4">
        <PeriodFilter value={period} onChange={setPeriod} />
        <RevenueChart data={data?.revenue_over_time} />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="top products" items={data?.top_products} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="low stock products" items={data?.low_stock_products} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarChart data={data?.cards} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart data={data?.revenue_by_category} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppPieChart data={data?.orders_by_status} />
      </div>
    </div>
  );
};

export default Homepage;
