import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Cell, Pie, PieChart, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CountUp } from "@/components/CountUp";

interface ElectricityDonutChartProps {
  data: {
    year: number;
    scenario?: string;
    totalGCO2e: number;
    gridShare: number;
    generation: Record<string, { share: number; impact: number }>;
  };
}

export const ElectricityDonutChart = memo(ElectricityDonutChartComponent, (prevProps, nextProps) =>
  dataIsEqual(prevProps.data, nextProps.data)
);
export const ELECTRICITY_COLORS: Record<string, string> = {
  Coal: "#52525b",
  Gas: "#f97316",
  Wind: "#3b82f6",
  Solar: "#eab308",
  Biomass: "#22c55e",
  Nuclear: "#fbbf24",
  Hydro: "#06b6d4",
  Hydrogen: "#ed7577ff",
  Other: "#9ca3af",
  "Grid infrastructure": "#1e40af",
};

const GRID_GRADIENT_START = "#645de8ff";
const GRID_GRADIENT_END = "#a855f7";

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function interpolateHexColor(start: string, end: string, t = 0.5) {
  const parse = (hex: string) => hex.replace("#", "").match(/.{2}/g)!.map((h) => parseInt(h, 16));
  const [r1, g1, b1] = parse(start);
  const [r2, g2, b2] = parse(end);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(Math.round(r1 + (r2 - r1) * t))}${toHex(Math.round(g1 + (g2 - g1) * t))}${toHex(Math.round(b1 + (b2 - b1) * t))}`;
}

const gridLegendColor = interpolateHexColor(GRID_GRADIENT_START, GRID_GRADIENT_END);

function GenerationStackBar({ generation, order, animate }: { generation: Record<string, { share: number }>; order: string[]; animate: boolean }) {
  const filtered = order
    .map((name) => [name, generation[name]] as const)
    .filter(([, v]) => v && v.share >= 2);

  const total = filtered.reduce((sum, [, v]) => sum + v!.share, 0);
  if (total === 0) return null;

  const entries = filtered.map(([name, v]) => {
    const scaled = Number(((v!.share / total) * 100).toFixed(1));
    return [name, { ...v, share: scaled }] as const;
  });

  const activeRow = Object.fromEntries(entries.map(([name, v]) => [name, v!.share]));
  const zeroRow = Object.fromEntries(entries.map(([name]) => [name, 0]));

  const data = [
    { label: "mix", ...(animate ? activeRow : zeroRow) },
  ];

  const chartConfig = entries.reduce((acc, [name]) => {
    acc[name] = { label: name, color: ELECTRICITY_COLORS[name] || "#9ca3af" };
    return acc;
  }, {} as ChartConfig);

  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">Generation mix</span>
      </div>
      <ChartContainer config={chartConfig} className="h-6 w-full px-2 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          {/* key forces BarChart + bars to remount when order changes so corner radii follow the new edges */}
          <BarChart key={order.join("-")} data={data} layout="vertical" margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis type="category" dataKey="label" hide />
            <ChartTooltip
              cursor={false}
              content={(props) => {
                const payload = props?.payload ?? [];
                if (payload.length === 0) return null;
                const point = active ? payload.find((p) => p.dataKey === active) : payload[0];
                if (!point) return null;
                const { dataKey, value, color } = point;

                return (
                  <ChartTooltipContent
                    {...props}
                    payload={[point]}
                    hideLabel
                    hideIndicator
                    formatter={() => (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-300 text-xs">{dataKey as string}</span>
                        <span className="font-mono font-medium text-gray-100 text-xs">
                          {typeof value === "number" ? value.toFixed(1) : value}%
                        </span>
                      </div>
                    )}
                  />
                );
              }}
            />
            {entries.map(([name], idx) => {
              const radius = entries.length === 1
                ? [8, 8, 8, 8]
                : idx === 0
                  ? [8, 0, 0, 8]
                  : idx === entries.length - 1
                    ? [0, 8, 8, 0]
                    : [0, 0, 0, 0];

              return (
                <Bar
                  key={`${name}-${idx}`}
                  dataKey={name}
                  stackId="mix"
                  fill={ELECTRICITY_COLORS[name] || "#9ca3af"}
                  radius={radius}
                  onMouseEnter={() => setActive(name)}
                  onMouseLeave={() => setActive(null)}
                  isAnimationActive={animate}
                  animationDuration={900}
                  animationBegin={120}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

type CellWithCornerRadiusProps = React.ComponentProps<typeof Cell> & {
  cornerRadius?: number;
};
const RoundedCell = Cell as unknown as React.FC<CellWithCornerRadiusProps>;

function dataIsEqual(prev: ElectricityDonutChartProps["data"], next: ElectricityDonutChartProps["data"]) {
  if (
    prev.year !== next.year ||
    prev.scenario !== next.scenario ||
    prev.totalGCO2e !== next.totalGCO2e ||
    prev.gridShare !== next.gridShare
  ) {
    return false;
  }

  const prevKeys = Object.keys(prev.generation);
  const nextKeys = Object.keys(next.generation);

  if (prevKeys.length !== nextKeys.length) return false;

  return prevKeys.every((key) => {
    const prevVal = prev.generation[key];
    const nextVal = next.generation[key];
    return !!nextVal && prevVal.share === nextVal.share && prevVal.impact === nextVal.impact;
  });
}

function ElectricityDonutChartComponent({ data }: ElectricityDonutChartProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  const labelDuration = 1.2; // keep in sync with pie animation (1200ms)

  useEffect(() => {
    if (isInView && !hasAnimated) setHasAnimated(true);
  }, [isInView, hasAnimated]);

  const previousTotalGCO2e = usePrevious(data.totalGCO2e);
  const targetTotal = Number(data.totalGCO2e.toFixed(1));
  const startTotal = previousTotalGCO2e !== undefined ? Number(previousTotalGCO2e.toFixed(1)) : 0;
  const labelStartValue = hasAnimated ? startTotal : 0;

  const { sortedData, chartData, chartConfig, displayOrder } = useMemo(() => {
    const MIN_VALUE = 0.001;

    const pieData = Object.entries(data.generation)
      .map(([name, values]) => ({
        name,
        value: values.impact,
        share: values.share,
        fill: ELECTRICITY_COLORS[name] || "#9ca3af",
      }))
      .filter((entry) => entry.value > MIN_VALUE);

    pieData.push({
      name: "Grid infrastructure",
      value: data.gridShare,
      share: 0,
      fill: ELECTRICITY_COLORS["Grid infrastructure"] ?? "#1e40af",
    });

    const ordered = [
      ...pieData
        .filter((d) => d.name !== "Grid infrastructure")
        .sort((a, b) => b.value - a.value),
      pieData.find((d) => d.name === "Grid infrastructure")!,
    ];

    const config = ordered.reduce((acc, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.name === "Grid infrastructure" ? gridLegendColor : item.fill,
      };
      return acc;
    }, {} as ChartConfig);

    return {
      sortedData: ordered,
      chartData: hasAnimated ? ordered : ordered.map((d) => ({ ...d, value: 0 })),
      chartConfig: config,
      displayOrder: ordered.map((d) => d.name),
    };
    // hasAnimated deliberately included so chartData updates once animation is allowed
  }, [data, hasAnimated]);

  return (
    <div ref={ref} className="flex flex-col items-center w-full">
      <ChartContainer
        config={chartConfig}
        className="relative w-full h-[320px] sm:h-[400px] md:h-[360px] -mb-20"
      >
        <PieChart margin={{ top: -200, right: 0, bottom: 0, left: 0 }} className="-translate-y-22">
            <defs>
              <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="20%">
                <stop offset="0%" stopColor={GRID_GRADIENT_START} stopOpacity={1} />
                <stop offset="100%" stopColor={GRID_GRADIENT_END} stopOpacity={1} />
              </linearGradient>
            </defs>

            <ChartTooltip
              wrapperStyle={{ zIndex: 9999, pointerEvents: "none" }}
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
            cx="48%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius="55%"
            outerRadius="93%"
            paddingAngle={1}
            dataKey="value"
            nameKey="name"
            isAnimationActive={true}
            animationDuration={1200}
            animationBegin={0}
              >
                {(() => {
                  const totalValue = sortedData.reduce((sum, item) => sum + item.value, 0);

                  return sortedData.map((entry, index) => {
                    const arcSpan = totalValue > 0 ? (entry.value / totalValue) * 180 : 0;
                    // Use a smooth, continuous formula for corner radius that scales with arc size
                    // This avoids step-function discontinuities and keeps radii proportional to arc dimensions
                    // For very small arcs (< 2 degrees), use minimal rounding to prevent rendering issues
                    // For larger arcs, scale up to a max of 8px to match other charts
                    const cornerRadius = arcSpan < 2
                      ? Math.max(0.5, arcSpan * 0.5)
                      : Math.min(8, 1 + arcSpan * 0.4);

                    return (
                      <RoundedCell
                        key={`cell-${index}`}
                        fill={entry.name === "Grid infrastructure" ? "url(#gridGrad)" : entry.fill}
                        fillOpacity={1}
                        opacity={1}
                        stroke="transparent"
                        strokeWidth={1}
                        className={entry.name === "Grid infrastructure" ? "grid-pulse" : undefined}
                        cornerRadius={cornerRadius}
                      />
                    );
                  });
                })()}
              </Pie>

            <ChartLegend
              verticalAlign="bottom"
              height={64}
              content={() => (
                <ChartLegendContent
                  payload={sortedData.map((item) => ({
                    value: item.name,
                    dataKey: item.name,
                    color: item.name === "Grid infrastructure" ? gridLegendColor : item.fill,
                  })) as any}
                  className="text-[10px] sm:text-xs flex-wrap gap-1 justify-center"
                />
              )}
            />
          </PieChart>

        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-44 z-0">
          <div className="text-center">
            <CountUp
              target={targetTotal}
              start={isInView}
              startValue={labelStartValue}
              duration={labelDuration}
              decimals={1}
              className="text-xl sm:text-3xl font-semibold text-gray-100 leading-tight z-0"
              suffix=" g"
            />
            <div className="text-[11px] text-zinc-300 mt-1">CO₂-eq/kWh</div>
          </div>
        </div>
      </ChartContainer>
      <GenerationStackBar generation={data.generation} order={displayOrder} animate={hasAnimated} />
    </div>
  );
}
