import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { sankey as d3Sankey } from "d3-sankey";
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
  depth?: number;
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

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [entryComplete, setEntryComplete] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const { width: chartWidth, height: chartHeight } = useContainerSize(containerRef);
  const baseGraph = useMemo(() => buildSankeyGraph(), []);
  const nodeWidth = 22;
  const linkInset = nodeWidth / 2; // pull links slightly into node bodies to align with rounded corners

  const { nodes, links } = useMemo(() => {
    // Ultra-tight margins so the diagram hugs the container edges
    const margin = { top: 12, right: 0, bottom: 12, left: 0 };

    const sankey = d3Sankey<SankeyNodeDatum, SankeyLinkDatum>()
      .nodeId((d) => d.name)
      .nodeWidth(nodeWidth)
      .nodePadding(nodeWidth)
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

  const linkPath = useMemo(
    () =>
      (link: SankeyLinkDatum) => {
        const source = link.source as SankeyNodeDatum;
        const target = link.target as SankeyNodeDatum;
        const x0 = (source.x1 ?? 0) - linkInset;
        const x1 = (target.x0 ?? 0) + linkInset;
        const y0 = link.y0 ?? 0;
        const y1 = link.y1 ?? 0;
        const xi = (x0 + x1) / 2;
        return `M${x0},${y0}C${xi},${y0} ${xi},${y1} ${x1},${y1}`;
      },
    [linkInset]
  );

  // Staged fade: leftmost column first, then its outgoing links, then next column, etc.
  // Use small stagger so layers overlap while still revealing left-to-right
  const layerDelayMs = 200;
  const nodeDelayMs = (node: SankeyNodeDatum) => (node.depth ?? 0) * layerDelayMs;
  const nodeDelay = (node: SankeyNodeDatum) => `${nodeDelayMs(node)}ms`;
  const linkDelayMs = (link: SankeyLinkDatum) => {
    const source = link.source as SankeyNodeDatum;
    return 160 + (source.depth ?? 0) * layerDelayMs;
  };
  const linkDelay = (link: SankeyLinkDatum) => `${linkDelayMs(link)}ms`;
  const entryEasing = "cubic-bezier(0.16, 1, 0.3, 1)";

  // Remove stagger delay after the initial entrance so hover states respond immediately
  useEffect(() => {
    if (!hasAnimated) return;
    const maxNodeDelay = nodes.length ? Math.max(...nodes.map(nodeDelayMs)) : 0;
    const maxLinkDelay = links.length ? Math.max(...links.map(linkDelayMs)) : 0;
    const maxDelay = Math.max(maxNodeDelay, maxLinkDelay);
    // longer buffer to align with slower entrance while still clearing hover delay
    const timer = window.setTimeout(() => setEntryComplete(true), maxDelay + 900);
    return () => window.clearTimeout(timer);
  }, [hasAnimated, nodes, links]);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    value?: number;
  } | null>(null);

  const [hoveredLinkKey, setHoveredLinkKey] = useState<string | null>(null);
  const [hoveredLinkNodes, setHoveredLinkNodes] = useState<[string, string] | null>(null);
  const [hoveredNodeName, setHoveredNodeName] = useState<string | null>(null);
  const [adjacentNodes, setAdjacentNodes] = useState<Set<string>>(new Set());

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

      <div className="w-full overflow-x-auto p-0 lg:p-4">
        <div
          ref={containerRef}
          className="relative min-w-[760px] h-auto rounded-xl"
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
                    x1={(source.x1 ?? 0) - linkInset}
                    y1={(link.y0 ?? 0) + (link.width ?? 0) / 2}
                    x2={(target.x0 ?? chartWidth) + linkInset}
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
                const effectiveOpacity = hasAnimated
                  ? isDimming
                    ? isHighlighted
                      ? 0.42
                      : 0.1
                    : 0.35
                  : 0;

                return (
                  <path
                    key={id}
                    d={linkPath(link) ?? ""}
                    fill="none"
                    stroke={`url(#${id})`}
                    strokeWidth={strokeWidth}
                    strokeOpacity={effectiveOpacity}
                    className="cursor-pointer"
                    style={{
                      transition: `transform 640ms ease-out, stroke-opacity 640ms ease-out, opacity 740ms ease-out`,
                      transitionDelay: hasAnimated && !entryComplete ? linkDelay(link) : "0ms",
                      transform: hasAnimated ? "translateX(0px)" : "translateX(-24px)",
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      pointerEvents: hasAnimated ? "auto" : "none",
                    }}
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
                  (hoveredLinkNodes?.includes(node.name) ?? false) ||
                  adjacentNodes.has(node.name);
                const nodeDimming =
                  hoveredLinkKey !== null || hoveredNodeName !== null || hoveredLinkNodes !== null;

                return (
                  <g key={node.name}>
                    <rect
                      x={node.x0}
                      y={node.y0}
                      width={nodeWidth}
                      height={nodeHeight}
                      rx={8}
                      ry={8}
                      fill={node.color}
                      fillOpacity={hasAnimated ? (nodeDimming ? (nodeHighlighted ? 0.38 : 0.12) : 0.35) : 0}
                      stroke={node.color}
                      strokeWidth={2}
                      strokeOpacity={hasAnimated ? (nodeDimming ? (nodeHighlighted ? 1 : 0.3) : 0.9) : 0}
                      className="shadow-sm"
                      style={{
                        transition: `transform 640ms ease-out, fill-opacity 640ms ease-out, stroke-opacity 640ms ease-out, opacity 740ms ease-out`,
                        transitionDelay: hasAnimated && !entryComplete ? nodeDelay(node) : "0ms",
                        transform: hasAnimated ? "translateX(0px)" : "translateX(-16px)",
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        pointerEvents: hasAnimated ? "auto" : "none",
                      }}
                      onMouseMove={(event) => {
                        setHoveredNodeName(node.name);
                        // highlight adjacent nodes (sources/targets connected to this node)
                        const connected = links.reduce<Set<string>>((acc, link) => {
                          const s = (link.source as SankeyNodeDatum).name;
                          const t = (link.target as SankeyNodeDatum).name;
                          if (s === node.name) acc.add(t);
                          if (t === node.name) acc.add(s);
                          return acc;
                        }, new Set<string>());
                        setAdjacentNodes(connected);
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
                        setAdjacentNodes(new Set());
                      }}
                    />

                    {nodeHeight > 12 && (
                      <text
                        x={labelX}
                        y={(node.y0 ?? 0) + nodeHeight / 2}
                        textAnchor={textAnchor}
                        dominantBaseline="middle"
                        className="fill-gray-200 text-[11px] sm:text-[12px] font-medium"
                        opacity={hasAnimated ? 0.95 : 0}
                        style={{
                          transition: `transform 920ms ${entryEasing}, opacity 640ms ${entryEasing}`,
                          transitionDelay: hasAnimated && !entryComplete ? nodeDelay(node) : "0ms",
                          transform: hasAnimated ? "translateX(0px)" : "translateX(-16px)",
                          transformBox: "fill-box",
                          transformOrigin: "center",
                        }}
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
