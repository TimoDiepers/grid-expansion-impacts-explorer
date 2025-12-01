import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer } from "recharts";
import { expansionComparisonData } from "@/data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const chartConfig = {
  base: {
    label: "3°C scenario",
    color: "#6b7280",
  },
  pkBudg1000: {
    label: "2°C scenario",
    color: "#3b82f6",
  },
  pkBudg650: {
    label: "1.5°C scenario",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

export function ImpactCategoryComparisonChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);
  
  const fullData = expansionComparisonData.impactCategories.map((item) => ({
    ...item,
    base: item.base * 100,
    pkBudg1000: item.pkBudg1000 * 100,
    pkBudg650: item.pkBudg650 * 100,
  }));

  // Use zeroed data until in view
  const chartData = hasAnimated 
    ? fullData 
    : fullData.map(d => ({ ...d, base: 0, pkBudg1000: 0, pkBudg650: 0 }));

  return (
    <div ref={ref} className="w-full">
      <div className="w-full overflow-x-auto -mx-2 px-2">
        <ChartContainer config={chartConfig} className="h-[420px] sm:h-[500px] md:h-[600px] min-w-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              barGap={2}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
              <XAxis
                type="number"
                domain={[-30, 20]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value > 0 ? "+" : ""}${value}%`}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
              />
              <YAxis
                type="category"
                dataKey="category"
                width={110}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#e5e7eb" }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <span className="text-gray-400 text-xs">
                          {chartConfig[name as keyof typeof chartConfig]?.label || name}
                        </span>
                        <span className="font-mono font-medium text-gray-100 text-xs">
                          {typeof value === "number"
                            ? `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
                            : value}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <ReferenceLine x={0} stroke="#6b7280" strokeDasharray="3 3" />
              <Bar
                dataKey="base"
                fill="var(--color-base)"
                radius={[0, 6, 6, 0]}
                isAnimationActive={true}
                animationDuration={1200}
                animationBegin={0}
              />
              <Bar
                dataKey="pkBudg1000"
                fill="var(--color-pkBudg1000)"
                radius={[0, 6, 6, 0]}
                isAnimationActive={true}
                animationDuration={1200}
                animationBegin={200}
              />
              <Bar
                dataKey="pkBudg650"
                fill="var(--color-pkBudg650)"
                radius={[0, 6, 6, 0]}
                isAnimationActive={true}
                animationDuration={1200}
                animationBegin={400}
              />
              <ChartLegend
                verticalAlign="top"
                content={<ChartLegendContent className="text-[11px]" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
