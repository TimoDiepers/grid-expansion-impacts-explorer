import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { materialContributions } from "@/data";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type MaterialKey =
  | "Aluminum"
  | "Iron & Steel"
  | "Copper"
  | "Plastics"
  | "Concrete"
  | "SF6"
  | "Other";
type ComponentKey = "overheadLines" | "cables" | "transformers" | "substations" | "switchgears";
type FoldedRow = { component: string } & Record<MaterialKey, number>;

const MATERIALS: readonly MaterialKey[] = [
  "Aluminum",
  "Iron & Steel",
  "Copper",
  "Plastics",
  "Concrete",
  "SF6",
  "Other",
] as const;
const COMPONENTS: readonly ComponentKey[] = [
  "overheadLines",
  "cables",
  "transformers",
  "substations",
  "switchgears",
] as const;
const SEGMENTS: readonly MaterialKey[] = MATERIALS;
const PERCENT_THRESHOLD = 0.02; // <2% gets dropped (treated as 0) to avoid edge rounding on slivers

const chartConfig = {
  Aluminum: { label: "Aluminum", color: "#38bdf8" },
  "Iron & Steel": { label: "Iron & Steel", color: "#64748b" },
  Copper: { label: "Copper", color: "#f97316" },
  Plastics: { label: "Plastics", color: "#a855f7" },
  Concrete: { label: "Concrete", color: "#cbd5e1" },
  SF6: { label: "SF6", color: "#facc15" },
  Other: { label: "Other", color: "#94a3b8" },
} satisfies ChartConfig;

function buildComponentRows(): FoldedRow[] {
  return COMPONENTS.map((component) => {
    const row: FoldedRow = {
      component:
        component === "overheadLines"
          ? "Overhead Lines"
          : component.charAt(0).toUpperCase() + component.slice(1),
      Aluminum: 0,
      "Iron & Steel": 0,
      Copper: 0,
      Plastics: 0,
      Concrete: 0,
      SF6: 0,
      Other: 0,
    };

    for (const mat of MATERIALS) {
      const source = materialContributions.find((m) => m.name === mat);
      if (!source) continue;
      row[mat] = (source as unknown as Record<string, number>)[component] ?? 0;
    }
    return row;
  });
}

function foldSmallSegments(row: FoldedRow): FoldedRow {
  const totalsum = SEGMENTS.reduce((sum, key) => sum + (row[key] ?? 0), 0);
  if (totalsum <= 0) return { ...row };

  const next: FoldedRow = { ...row };
  for (const key of SEGMENTS) {
    const val = row[key] ?? 0;
    if (totalsum !== 0 && val / totalsum < PERCENT_THRESHOLD) {
      next[key] = 0;
    }
  }
  return next;
}

function roundedStackShape(key: MaterialKey, payload: FoldedRow) {
  // Find first and last non-zero keys in this row
  let firstKey: MaterialKey | undefined;
  for (const k of SEGMENTS) {
    if ((payload[k] ?? 0) > 1e-6) {
      firstKey = k;
      break;
    }
  }

  let lastKey: MaterialKey | undefined;
  for (let i = SEGMENTS.length - 1; i >= 0; i--) {
    const k = SEGMENTS[i];
    if ((payload[k] ?? 0) > 1e-6) {
      lastKey = k;
      break;
    }
  }

  const radius: [number, number, number, number] = [0, 0, 0, 0];
  // For vertical stacks: first key sits at the bottom, last key at the top.
  if (key === firstKey) {
    radius[2] = 6; // bottom-right
    radius[3] = 6; // bottom-left
  }
  if (key === lastKey) {
    radius[0] = 6; // top-left
    radius[1] = 6; // top-right
  }
  return radius;
}

export function MaterialContributionChart() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isInView && !ready) setReady(true);
  }, [isInView, ready]);

  const componentRows = buildComponentRows();
  const folded = componentRows.map(foldSmallSegments);

  const data = ready
    ? folded
    : folded.map((d) =>
        SEGMENTS.reduce(
          (acc, key) => ({ ...acc, [key]: 0 }),
          { ...d }
        )
      );

  return (
    <div ref={ref} className="w-full">
      <ChartContainer
        config={chartConfig}
        className="h-[420px] sm:h-[500px] md:h-[560px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 16, right: 22, left: 16, bottom: 80 }}
            barGap={18}
            barCategoryGap="45%"
            barSize={110}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
            <XAxis
              dataKey="component"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 11, fill: "#e5e7eb" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              domain={[0, "auto"]}
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
                        {typeof value === "number" ? value.toFixed(2) : value} Mt CO₂-eq
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
            {SEGMENTS.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="impact"
                fill={`var(--color-${key})`}
                isAnimationActive={true}
                animationDuration={900}
                animationBegin={idx * 120}
                shape={(props: any) => {
                  const payload = (props as { payload: FoldedRow }).payload;
                  const radius = roundedStackShape(key, payload);
                  return <Rectangle {...(props as object)} radius={radius} />;
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
