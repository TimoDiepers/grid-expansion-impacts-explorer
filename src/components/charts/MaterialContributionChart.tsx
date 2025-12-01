import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { plotDatasets, scenarioOptions, scenarioColors, type PlotDatasetKey, type ScenarioKey } from "@/data/plotData";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const datasetOptions: { key: PlotDatasetKey; label: string }[] = [
  { key: "materials", label: "Materials" },
  { key: "components", label: "Components" },
  { key: "processes", label: "Processes" },
  { key: "expansion", label: "Time periods" },
];

// Display order for scenarios (align plot and toggles): BAU, 3°C, 2°C, 1.5°C
const scenarioOrder: ScenarioKey[] = ["scen3", "scen2", "scen15"];

export function MaterialContributionChart() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [ready, setReady] = useState(false);
  const [datasetKey, setDatasetKey] = useState<PlotDatasetKey>("materials");

  useEffect(() => {
    if (isInView && !ready) setReady(true);
  }, [isInView, ready]);

  const chartConfig = useMemo<ChartConfig>(() => {
    const orderedOptions = scenarioOrder
      .map((key) => scenarioOptions.find((s) => s.key === key)!)
      .filter(Boolean);

    return orderedOptions.reduce<ChartConfig>(
      (acc, option) => ({
        ...acc,
        [option.key]: { label: option.label, color: scenarioColors[option.key] },
      }),
      { BAU: { label: "Business as Usual", color: "#6b7280" } }
    );
  }, []);

  const { chartData, maxValue } = useMemo(() => {
    const rows = plotDatasets[datasetKey];
    const entries = rows.map((row) => {
      const scenarioValues = scenarioOrder.reduce<Record<string, number>>(
        (acc, key) => ({ ...acc, [key]: ready ? row[key] : 0 }),
        {}
      );

      return {
        category: row.label,
        BAU: ready ? row.BAU : 0,
        ...scenarioValues,
      };
    });

    const maxVal = Math.max(
      ...rows.flatMap((r) => [r.BAU, ...scenarioOrder.map((key) => r[key])]),
      0
    );

    if (datasetKey === "expansion") {
      // Preserve chronological order for time-period view
      return { chartData: entries, maxValue: maxVal };
    }

    // Sort descending by BAU, but keep any "Other" category anchored to the right
    const sorted = entries.sort((a, b) => {
      const isOtherA = /other/i.test(a.category);
      const isOtherB = /other/i.test(b.category);
      if (isOtherA && !isOtherB) return 1;
      if (!isOtherA && isOtherB) return -1;
      return b.BAU - a.BAU;
    });
    return { chartData: sorted, maxValue: maxVal };
  }, [datasetKey, ready]);

  const yMax = useMemo(() => {
    // Use raw maxValue (not animated zeros) for stable baseline during fade-in
    const max = Math.max(maxValue, 1);
    // Add 5% headroom but cap at 120 to avoid runaway
    return Math.min(Math.ceil(max * 1.05), 120);
  }, [maxValue]);

  return (
    <div ref={ref} className="w-full space-y-2">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 flex-wrap">
          {datasetOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setDatasetKey(option.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                datasetKey === option.key
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[640px] sm:min-w-0">
          <ChartContainer
            config={chartConfig}
            className="h-[400px] sm:h-[460px] md:h-[520px] w-full"
          >
            <BarChart
              data={chartData}
              barGap={12}
              barCategoryGap={20}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={0}
                height={60}
                tick={{ fontSize: 11, fill: "#e5e7eb" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                domain={[0, yMax]}
                tickFormatter={(v) => `${v}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-400 text-xs">
                          {chartConfig[name as keyof typeof chartConfig]?.label || name}
                        </span>
                        <span className="font-mono font-medium text-gray-100 text-xs">
                          {typeof value === "number" ? value.toFixed(1) : value}%
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <ChartLegend
                verticalAlign="top"
                content={(props) => {
                  const { payload } = props;
                  const normalizedPayload = payload
                    ? payload.map((item) => ({
                        ...item,
                        dataKey: item.dataKey != null ? String(item.dataKey) : undefined,
                      }))
                    : payload;

                  return (
                    <ChartLegendContent
                      payload={normalizedPayload ? [...normalizedPayload].reverse() : normalizedPayload}
                      className="text-[11px]"
                    />
                  );
                }}
              />

              <Bar
                dataKey="BAU"
                name="BAU"
                fill="var(--color-BAU)"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
                style={{ opacity: ready ? 1 : 0, transition: "opacity 450ms ease-out" }}
              />

              {scenarioOrder.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={chartConfig[key]?.label as string}
                  fill={`var(--color-${key})`}
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationBegin={120 + index * 120}
                  animationEasing="ease-out"
                  style={{ opacity: ready ? 1 : 0, transition: "opacity 450ms ease-out" }}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
