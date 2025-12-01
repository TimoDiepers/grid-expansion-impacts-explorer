import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { expansionYearlyData } from "@/data";
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
  static: {
    label: "Static (BAU)",
    color: "#6b7280",
  },
  npi: {
    label: "3°C scenario",
    color: "#ef4444",
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

export function ExpansionTimelineChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Use zeroed data until in view to prevent early animation
  const chartData = hasAnimated 
    ? expansionYearlyData 
    : expansionYearlyData.map(d => ({ year: d.year, static: 0, npi: 0, pkBudg1000: 0, pkBudg650: 0 }));

  return (
    <div ref={ref} className="w-full">
      <ChartContainer config={chartConfig} className="h-44 sm:h-56 md:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fontSize: 9, fill: "#9ca3af" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              tickFormatter={(value) => `${value}`}
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              width={22}
              domain={[0, 'auto']}
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
                        {typeof value === "number" ? value.toFixed(2) : value} Mt CO₂-eq
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="static"
              stroke="var(--color-static)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "var(--color-static)", r: 2 }}
              activeDot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={0}
            />
            <Line
              type="monotone"
              dataKey="npi"
              stroke="var(--color-npi)"
              strokeWidth={2}
              dot={{ fill: "var(--color-npi)", r: 2 }}
              activeDot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={200}
            />
            <Line
              type="monotone"
              dataKey="pkBudg1000"
              stroke="var(--color-pkBudg1000)"
              strokeWidth={2}
              dot={{ fill: "var(--color-pkBudg1000)", r: 2 }}
              activeDot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={400}
            />
            <Line
              type="monotone"
              dataKey="pkBudg650"
              stroke="var(--color-pkBudg650)"
              strokeWidth={2}
              dot={{ fill: "var(--color-pkBudg650)", r: 2 }}
              activeDot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={600}
            />
            <ChartLegend
              verticalAlign="top"
              content={<ChartLegendContent className="text-[11px]" />}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
