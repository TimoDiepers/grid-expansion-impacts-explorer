import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Cell, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

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

const COLORS: Record<string, string> = {
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

// Mapping from energy source names to gradient IDs
const GRADIENT_IDS: Record<string, string> = {
  Coal: "url(#gradCoal)",
  Gas: "url(#gradGas)",
  Wind: "url(#gradWind)",
  Solar: "url(#gradSolar)",
  Biomass: "url(#gradBiomass)",
  Nuclear: "url(#gradNuclear)",
  Hydro: "url(#gradHydro)",
  Hydrogen: "url(#gradHydrogen)",
  Other: "url(#gradOther)",
  "Grid infrastructure": "url(#gridGrad)",
};

const GRID_GRADIENT_START = "#645de8ff";
const GRID_GRADIENT_END = "#a855f7";

function interpolateHexColor(start: string, end: string, t = 0.5) {
  const parse = (hex: string) => hex.replace("#", "").match(/.{2}/g)!.map((h) => parseInt(h, 16));
  const [r1, g1, b1] = parse(start);
  const [r2, g2, b2] = parse(end);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(Math.round(r1 + (r2 - r1) * t))}${toHex(Math.round(g1 + (g2 - g1) * t))}${toHex(Math.round(b1 + (b2 - b1) * t))}`;
}

const gridLegendColor = interpolateHexColor(GRID_GRADIENT_START, GRID_GRADIENT_END);

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

  useEffect(() => {
    if (isInView && !hasAnimated) setHasAnimated(true);
  }, [isInView, hasAnimated]);

  const { sortedData, chartData, chartConfig } = useMemo(() => {
    const pieData = Object.entries(data.generation).map(([name, values]) => ({
      name,
      value: values.impact,
      share: values.share,
      fill: COLORS[name] || "#9ca3af",
    }));

    pieData.push({
      name: "Grid infrastructure",
      value: data.gridShare,
      share: 0,
      fill: COLORS["Grid infrastructure"],
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
              {/* Grid infrastructure gradient */}
              <radialGradient id="gridGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor={GRID_GRADIENT_START} stopOpacity={0.3} />
                <stop offset="100%" stopColor={GRID_GRADIENT_END} stopOpacity={1} />
              </radialGradient>
              {/* Radial gradients for each energy source: fades at inner radius, solid at outer radius */}
              <radialGradient id="gradCoal" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#52525b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#52525b" stopOpacity={1} />
              </radialGradient>
              <radialGradient id="gradGas" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={1} />
              </radialGradient>
              <radialGradient id="gradWind" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
              </radialGradient>
              <radialGradient id="gradSolar" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#eab308" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#eab308" stopOpacity={1} />
              </radialGradient>
              <radialGradient id="gradBiomass" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
              </radialGradient>
              <radialGradient id="gradNuclear" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={1} />
              </radialGradient>
              <radialGradient id="gradHydro" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
              </radialGradient>
              <radialGradient id="gradHydrogen" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#ed7577" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ed7577" stopOpacity={1} />
              </radialGradient>
              <radialGradient id="gradOther" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#9ca3af" stopOpacity={1} />
              </radialGradient>
            </defs>

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
            cx="48%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius="55%"
            outerRadius="93%"
            paddingAngle={2}
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
                        fill={GRADIENT_IDS[entry.name] || entry.fill}
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
      </ChartContainer>

      <div className="mt-1 text-center">
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
