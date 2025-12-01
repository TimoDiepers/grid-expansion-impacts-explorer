import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from "recharts";
import { gridStatusQuoComponents } from "@/data";
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
  value: {
    label: "Climate Impact",
  },
  "Overhead lines": {
    label: "Overhead lines",
    color: "#2563eb",
  },
  Cables: {
    label: "Cables",
    color: "#f97316",
  },
  Transformers: {
    label: "Transformers",
    color: "#22c55e",
  },
  Substations: {
    label: "Substations",
    color: "#ef4444",
  },
  Switchgears: {
    label: "Switchgears",
    color: "#a855f7",
  },
} satisfies ChartConfig;

const COLORS: Record<string, string> = {
  "Overhead lines": "#2563eb",
  Cables: "#f97316",
  Transformers: "#22c55e",
  Substations: "#ef4444",
  Switchgears: "#a855f7",
};

const GRADIENT_IDS: Record<string, string> = {
  "Overhead lines": "url(#gradientOverhead)",
  Cables: "url(#gradientCables)",
  Transformers: "url(#gradientTransformers)",
  Substations: "url(#gradientSubstations)",
  Switchgears: "url(#gradientSwitchgears)",
};

export function GridStatusQuoChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Use empty data until in view to prevent early animation
  const chartData = hasAnimated ? gridStatusQuoComponents : gridStatusQuoComponents.map(d => ({ ...d, value: 0 }));

  return (
    <div ref={ref}>
      <ChartContainer config={chartConfig} className="h-48 sm:h-64 md:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            barSize={20}
          >
            <defs>
              {/* Gradients for horizontal bars: fades at left (start), solid at right (end) */}
              <linearGradient id="gradientOverhead" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="gradientCables" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="gradientTransformers" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="gradientSubstations" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="gradientSwitchgears" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              domain={[0, "auto"]}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={90}
              tick={{ fontSize: 11, fill: "#e5e7eb" }}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <span className="text-gray-400 text-xs">{name}</span>
                      <span className="font-mono font-medium text-gray-100 text-xs">
                        {typeof value === "number" ? value.toFixed(2) : value} Mt CO₂-eq
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar 
              dataKey="value" 
              radius={[0, 8, 8, 0]}
              isAnimationActive={true}
              animationDuration={1200}
              animationBegin={0}
            >
              {gridStatusQuoComponents.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={GRADIENT_IDS[entry.name] || COLORS[entry.name] || "#8884d8"} />
              ))}
            </Bar>
            <ChartLegend
              verticalAlign="top"
              content={<ChartLegendContent className="text-[11px]" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
