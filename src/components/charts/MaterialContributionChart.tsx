import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { plotDatasets, scenarioOptions, type PlotDatasetKey, type ScenarioKey } from "@/data/plotData";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const datasetOptions: { key: PlotDatasetKey; label: string }[] = [
  { key: "materials", label: "Materials" },
  { key: "components", label: "Components" },
  { key: "processes", label: "Processes" },
  { key: "expansion", label: "Time periods" },
];

const chartBaseConfig = {
  BAU: { label: "Business as Usual", color: "#94a3b8" }, // neutral zinc tone to match UI
  scenario: { label: "Scenario", color: "#38bdf8" },
} satisfies ChartConfig;

export function MaterialContributionChart() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [ready, setReady] = useState(false);
  const [datasetKey, setDatasetKey] = useState<PlotDatasetKey>("materials");
  const [scenario, setScenario] = useState<ScenarioKey>("scen15");

  useEffect(() => {
    if (isInView && !ready) setReady(true);
  }, [isInView, ready]);

  const chartConfig = useMemo<ChartConfig>(() => {
    const selected = scenarioOptions.find((s) => s.key === scenario)?.label ?? "Scenario";
    return {
      ...chartBaseConfig,
      scenario: { label: selected, color: chartBaseConfig.scenario.color },
    };
  }, [scenario]);

  const { chartData, maxValue } = useMemo(() => {
    const rows = plotDatasets[datasetKey];
    const entries = rows.map((row) => ({
      category: row.label,
      BAU: ready ? row.BAU : 0,
      scenario: ready ? row[scenario] : 0,
    }));

    const maxVal = Math.max(...rows.flatMap((r) => [r.BAU, r[scenario]]), 0);

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
  }, [datasetKey, scenario, ready]);

  const yMax = useMemo(() => {
    // Use raw maxValue (not animated zeros) for stable baseline during fade-in
    const max = Math.max(maxValue, 1);
    // Add 5% headroom but cap at 120 to avoid runaway
    return Math.min(Math.ceil(max * 1.05), 120);
  }, [maxValue]);

  return (
    <div ref={ref} className="w-full space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

        <Select value={scenario} onValueChange={(v) => setScenario(v as ScenarioKey)}>
          <SelectTrigger className="w-48 bg-zinc-900 border-zinc-800 text-sm">
            <SelectValue placeholder="Select scenario" />
          </SelectTrigger>
          <SelectContent>
            {scenarioOptions.map((opt) => (
              <SelectItem key={opt.key} value={opt.key}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ChartContainer
        config={chartConfig}
        className="h-[420px] sm:h-[460px] md:h-[520px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 22, left: 12, bottom: 64 }}
            barGap={14}
            barCategoryGap={28}
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
              content={<ChartLegendContent className="text-[11px]" />}
            />

            <Bar
              dataKey="BAU"
              name="BAU"
              fill="var(--color-BAU)"
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              animationDuration={900}
              animationEasing="ease-out"
              style={{ opacity: ready ? 1 : 0, transition: "opacity 450ms ease-out" }}
            />
            <Bar
              dataKey="scenario"
              name="Scenario"
              fill="var(--color-scenario)"
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              animationDuration={900}
              animationBegin={120}
              animationEasing="ease-out"
              style={{ opacity: ready ? 1 : 0, transition: "opacity 450ms ease-out" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
