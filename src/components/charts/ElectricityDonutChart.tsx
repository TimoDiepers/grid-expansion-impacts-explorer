import { Pie, PieChart, Cell } from "recharts";
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

interface ElectricityDonutChartProps {
  data: {
    year: number;
    scenario?: string;
    totalGCO2e: number;
    gridShare: number;
    generation: Record<string, { share: number; impact: number }>;
  };
}

const COLORS: Record<string, string> = {
  Coal: "#52525b",
  Gas: "#f97316",
  Wind: "#3b82f6",
  Solar: "#eab308",
  Biomass: "#22c55e",
  Nuclear: "#fbbf24",
  Hydro: "#06b6d4",
  Hydrogen: "#a855f7",
  Other: "#9ca3af",
  "Grid infrastructure": "#1e40af",
};

export function ElectricityDonutChart({ data }: ElectricityDonutChartProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  // hover state removed

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);
  
  const pieData = Object.entries(data.generation).map(([name, values]) => ({
    name,
    value: values.impact,
    share: values.share,
    fill: COLORS[name] || "#9ca3af",
  }));

  // Add grid infrastructure
  pieData.push({
    name: "Grid infrastructure",
    value: data.gridShare,
    share: 0,
    fill: COLORS["Grid infrastructure"],
  });

  // Sort by value descending, but keep Grid infrastructure at the end
  const sortedData = [
    ...pieData
      .filter((d) => d.name !== "Grid infrastructure")
      .sort((a, b) => b.value - a.value),
    pieData.find((d) => d.name === "Grid infrastructure")!,
  ];

  // Use zeroed data until in view
  const chartData = hasAnimated 
    ? sortedData 
    : sortedData.map(d => ({ ...d, value: 0 }));

  // Build chart config dynamically
  const chartConfig = sortedData.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
      color: item.fill,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div ref={ref} className="flex flex-col items-center w-full">
      {/* Half-circle chart with shadcn container */}
      <ChartContainer
        config={chartConfig}
        className="w-full h-[280px] sm:h-[360px] md:h-[420px]"
      >
        <PieChart margin={{ top: -250, right: 0, bottom: 0, left: 0 }}>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <span className="text-gray-400 text-xs">{name}</span>
                    <span className="font-mono font-medium text-gray-100 text-xs">
                      {typeof value === "number" ? value.toFixed(1) : value}%
                    </span>
                  </div>
                )}
              />
            }
          />
          <Pie
            data={chartData}
            cx="50%"
            cy="82%"
            startAngle={180}
            endAngle={0}
            innerRadius="55%"
            outerRadius="95%"
            paddingAngle={1}
            dataKey="value"
            nameKey="name"
            isAnimationActive={true}
            animationDuration={1200}
            animationBegin={0}
          >
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                fillOpacity={1}
                opacity={1}
                stroke="transparent"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <ChartLegend
            verticalAlign="bottom"
            content={
              <ChartLegendContent
                className="text-[10px] sm:text-xs flex-wrap gap-1 justify-center -translate-y-20"
              />
            }
          />
        </PieChart>
      </ChartContainer>
      <div className="mt-1 text-center -translate-y-16 sm:-translate-y-48">
        <div className="text-sm sm:text-base font-semibold text-gray-100">
          {data.totalGCO2e} g CO₂-eq/kWh
        </div>
        {data.scenario && (
          <div className="text-[10px] sm:text-xs font-semibold text-gray-300">
            {data.scenario}
          </div>
        )}
      </div>
    </div>
  );
}
