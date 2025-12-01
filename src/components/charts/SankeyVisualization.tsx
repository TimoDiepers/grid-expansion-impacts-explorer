import { useEffect, useMemo, useRef, useState } from "react";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import { sankeyData } from "@/data";

// Node colors - organized by category
const NODE_COLORS: Record<string, string> = {
  // Grid (final target)
  "grid status quo": "#17becf",
  // Components
  "cables": "#f97316",
  "overhead lines": "#2563eb",
  "transformers": "#22c55e",
  "substations": "#ef4444",
  "switchgears": "#a855f7",
  // Materials
  "aluminum": "#60a5fa",
  "copper": "#f87171",
  "iron & steel": "#4ade80",
  "plastics": "#c084fc",
  "concrete": "#9ca3af",
  "SF6": "#fbbf24",
  "other materials": "#a3e635",
  // Processes
  "electricity": "#64748b",
  "heat": "#fcd34d",
  "transport": "#22d3ee",
  "coal": "#1e293b",
  "clinker": "#65a30d",
  "aluminum (process emissions)": "#d97706",
  "iron & steel (process emissions)": "#dc2626",
  "other processes": "#a855f7",
};
type SankeyNodeDatum = {
  name: string;
  color: string;
  index?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  value?: number;
};

type SankeyLinkDatum = {
  source: string | SankeyNodeDatum | number;
  target: string | SankeyNodeDatum | number;
  value: number;
  sourceName: string;
  targetName: string;
  index?: number;
  width?: number;
  y0?: number;
  y1?: number;
};

function buildSankeyGraph() {
  const nodeSet = new Set<string>();
  sankeyData.forEach((d) => {
    nodeSet.add(d.source);
    nodeSet.add(d.target);
  });

  const nodes: SankeyNodeDatum[] = Array.from(nodeSet).map((name) => ({
    name,
    color: NODE_COLORS[name] || "#9ca3af",
  }));

  const links: SankeyLinkDatum[] = sankeyData
    .filter((d) => d.value > 0.1)
    .map((d) => ({
      source: d.source,
      target: d.target,
      value: d.value,
      sourceName: d.source,
      targetName: d.target,
    }));

  return { nodes, links };
}

function useContainerSize(ref: React.RefObject<HTMLDivElement>) {
  const [size, setSize] = useState({ width: 960, height: 460 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      const height = Math.max(420, Math.min(620, width * 0.55));
      setSize({ width, height });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export function SankeyVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: chartWidth, height: chartHeight } = useContainerSize(containerRef);
  const baseGraph = useMemo(() => buildSankeyGraph(), []);

  const { nodes, links } = useMemo(() => {
    // Ultra-tight margins so the diagram hugs the container edges
    const margin = { top: 12, right: 4, bottom: 12, left: 4 };

    const sankey = d3Sankey<SankeyNodeDatum, SankeyLinkDatum>()
      .nodeId((d) => d.name)
      .nodeWidth(14)
      .nodePadding(16)
      .extent([
        [margin.left, margin.top],
        [chartWidth - margin.right, chartHeight - margin.bottom],
      ]);

    const graph = sankey({
      nodes: baseGraph.nodes.map((node) => ({ ...node })),
      links: baseGraph.links.map((link) => ({ ...link })),
    });

    return { nodes: graph.nodes, links: graph.links };
  }, [baseGraph, chartWidth, chartHeight]);

  const linkPath = useMemo(() => sankeyLinkHorizontal<SankeyLinkDatum, SankeyNodeDatum>(), []);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    value?: number;
  } | null>(null);

  const [hoveredLinkKey, setHoveredLinkKey] = useState<string | null>(null);
  const [hoveredLinkNodes, setHoveredLinkNodes] = useState<[string, string] | null>(null);
  const [hoveredNodeName, setHoveredNodeName] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-gray-400">
          Total climate impact: <strong className="text-gray-100">64.76 Mt CO₂-eq</strong>
        </p>
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
          Flow from processes → materials → components → grid
        </p>
      </div>

      <div className="w-full overflow-x-auto -mx-2 px-2">
        <div
          ref={containerRef}
          className="relative min-w-[760px] h-[440px] sm:h-[500px] rounded-xl"
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-label="Sankey diagram of grid expansion impacts"
          >
            <defs>
              {links.map((link) => {
                const source = link.source as SankeyNodeDatum;
                const target = link.target as SankeyNodeDatum;
                const gradientId = `link-gradient-${link.index ?? `${link.sourceName}-${link.targetName}`}`;

                return (
                  <linearGradient
                    key={gradientId}
                    id={gradientId}
                    gradientUnits="userSpaceOnUse"
                    x1={source.x1 ?? 0}
                    y1={(link.y0 ?? 0) + (link.width ?? 0) / 2}
                    x2={target.x0 ?? chartWidth}
                    y2={(link.y1 ?? 0) + (link.width ?? 0) / 2}
                  >
                    <stop offset="0%" stopColor={source.color} stopOpacity={0.82} />
                    <stop offset="100%" stopColor={target.color} stopOpacity={0.82} />
                  </linearGradient>
                );
              })}
            </defs>

            <g>
              {links.map((link) => {
                const linkKey = `${link.index ?? `${link.sourceName}-${link.targetName}`}`;
                const id = `link-gradient-${linkKey}`;
                const strokeWidth = Math.max(1.5, link.width || 1);
                const isHighlighted =
                  hoveredLinkKey === linkKey ||
                  hoveredNodeName === link.sourceName ||
                  hoveredNodeName === link.targetName;
                const isDimming = hoveredLinkKey !== null || hoveredNodeName !== null;
                const effectiveOpacity = isDimming ? (isHighlighted ? 0.42 : 0.1) : 0.35;

                return (
                  <path
                    key={id}
                    d={linkPath(link)}
                    fill="none"
                    stroke={`url(#${id})`}
                    strokeWidth={strokeWidth}
                    strokeOpacity={effectiveOpacity}
                    className="cursor-pointer"
                    style={{ transition: "stroke-opacity 220ms ease, opacity 220ms ease" }}
                    onMouseMove={(event) => {
                      setHoveredLinkKey(linkKey);
                      setHoveredLinkNodes([link.sourceName, link.targetName]);
                      setTooltip({
                        x: event.clientX + 12,
                        y: event.clientY + 12,
                        title: `${link.sourceName} → ${link.targetName}`,
                        value: link.value,
                      });
                    }}
                    onMouseLeave={() => {
                      setTooltip(null);
                      setHoveredLinkKey(null);
                      setHoveredLinkNodes(null);
                    }}
                  />
                );
              })}
            </g>

            <g>
              {nodes.map((node) => {
                const nodeWidth = (node.x1 ?? 0) - (node.x0 ?? 0);
                const nodeHeight = (node.y1 ?? 0) - (node.y0 ?? 0);
                const cx = (node.x0 ?? 0) + nodeWidth / 2;
                const isLeft = (node.x0 ?? 0) < chartWidth * 0.35;
                const isRight = (node.x1 ?? 0) > chartWidth * 0.65;
                const textAnchor = isLeft ? "start" : isRight ? "end" : "middle";
                const labelX = isLeft ? (node.x1 ?? 0) + 6 : isRight ? (node.x0 ?? 0) - 6 : cx;
                const nodeHighlighted =
                  hoveredNodeName === node.name ||
                  (hoveredLinkNodes?.includes(node.name) ?? false);
                const nodeDimming =
                  hoveredLinkKey !== null || hoveredNodeName !== null || hoveredLinkNodes !== null;
                const nodeOpacity = nodeDimming ? (nodeHighlighted ? 0.95 : 0.3) : 0.9;

                return (
                  <g key={node.name}>
                    <rect
                      x={node.x0}
                      y={node.y0}
                      width={nodeWidth}
                      height={nodeHeight}
                      rx={3}
                      ry={3}
                      fill={node.color}
                      fillOpacity={nodeOpacity}
                      className="shadow-sm"
                      style={{ transition: "fill-opacity 220ms ease, opacity 220ms ease" }}
                      onMouseMove={(event) => {
                        setHoveredNodeName(node.name);
                        setTooltip({
                          x: event.clientX + 12,
                          y: event.clientY + 12,
                          title: node.name,
                          value: node.value,
                        });
                      }}
                      onMouseLeave={() => {
                        setTooltip(null);
                        setHoveredNodeName(null);
                      }}
                    />

                    {nodeHeight > 12 && (
                      <text
                        x={labelX}
                        y={(node.y0 ?? 0) + nodeHeight / 2}
                        textAnchor={textAnchor}
                        dominantBaseline="middle"
                        className="fill-gray-200 text-[11px] sm:text-[12px] font-medium"
                      >
                        {node.name.length > 16 ? `${node.name.slice(0, 16)}…` : node.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {tooltip && (
            <div
              className="pointer-events-none fixed z-50 rounded-md border border-zinc-700 bg-zinc-900/95 px-2.5 py-1.5 text-[11px] shadow-xl"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <div className="text-gray-100 font-semibold whitespace-nowrap">{tooltip.title}</div>
              {tooltip.value !== undefined && (
                <div className="text-gray-400">{tooltip.value.toFixed(2)} Mt CO₂-eq</div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
