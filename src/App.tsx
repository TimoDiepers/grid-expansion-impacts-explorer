import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GridStatusQuoChart,
  MaterialContributionChart,
  ExpansionTimelineChart,
  ImpactCategoryComparisonChart,
  ElectricityDonutChart,
  SankeyVisualization,
} from "@/components/charts";
import { electricityImpactData, gridStatusQuoComponents } from "@/data";
import { CountUp } from "@/components/CountUp";
import {
  Zap,
  TrendingUp,
  Layers,
  BarChart3,
  ChartBar,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Activity,
  Leaf,
  Cable,
  Sigma,
  ArrowDownToDot,
  UtilityPole,
  Unplug,
  Building2,
  ToggleLeft,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { GridComponent } from "@/data";

// Helper to get icon component based on icon field
const getComponentIcon = (icon: GridComponent["icon"]) => {
  const iconMap = {
    "utility-pole": UtilityPole,
    "cable": Cable,
    "transformer": Unplug,
    "building": Building2,
    "toggle-left": ToggleLeft,
  };
  return iconMap[icon];
};

// Grid Component Card with individual inView animation
function GridComponentCard({ component, index }: { component: GridComponent; index: number }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, { once: true, margin: "0px 0px -10% 0px" });
  const IconComponent = getComponentIcon(component.icon);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="card-hover border-zinc-800/50 overflow-hidden">
        <CardContent className="pt-5 pb-4 px-3 sm:px-4">
          <div className="flex flex-col items-center text-center">
            <div 
              className="p-3 rounded-xl mb-3"
              style={{ backgroundColor: `${component.color}20`, color: component.color }}
            >
              <IconComponent className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="text-xs sm:text-sm text-zinc-400 mb-1">{component.name}</div>
            <CountUp
              target={component.displayQuantity}
              start={isInView}
              duration={1}
              suffix={component.quantitySuffix}
              className="text-xl sm:text-2xl font-bold"
              style={{ color: component.color }}
            />
            <div className="text-[10px] sm:text-xs text-zinc-500">{component.unit}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Total Impact Card with individual inView animation
function TotalImpactCard({ totalGridImpact }: { totalGridImpact: number }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, { once: true, margin: "0px 0px -10% 0px" });
  
  return (
    <Card ref={cardRef} className="lg:col-span-2 card-hover w-full min-w-0">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-amber-400 mb-2">
          <Sigma className="h-5 w-5" />
          <CardTitle>Total Impact (2023)</CardTitle>
        </div>
        <CardDescription>
          Combined climate impact of all grid components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountUp
          target={totalGridImpact}
          start={isInView}
          duration={1}
          decimals={2}
          className="text-4xl sm:text-5xl font-bold text-amber-400 mb-2 block"
        />
        <div className="text-sm text-zinc-400 mb-4">
          Megatonnes of CO₂ equivalent
        </div>
        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <p className="text-xs sm:text-sm text-amber-300">
            ≈ <strong>4.6 g CO₂-eq/kWh</strong> contribution to Germany's 
            electricity carbon footprint
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Animated Section component for scroll-triggered animations
function AnimatedSection({ 
  children, 
  className = "",
  delay = 0,
  id
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Section Header component with professional styling
function SectionHeader({
  step,
  title,
  subtitle,
  accent = "blue",
}: {
  step: number;
  title: string;
  subtitle: string;
  accent?: 
    | "blue" 
    | "emerald" 
    | "violet" 
    | "amber" 
    | "cyan" 
    | "rose" 
    | "indigo" 
    | "teal" 
    | "lime"
    | "pink"
    | "slate"
    | "red"
    | "yellow"
    | "purple";
}) {
  const accentColors = {
    blue: "from-blue-500 to-cyan-500",
    emerald: "from-emerald-500 to-teal-500",
    violet: "from-violet-500 to-purple-500",
    amber: "from-amber-500 to-orange-500",
    cyan: "from-cyan-400 to-blue-500",
    rose: "from-rose-500 to-pink-500",
    indigo: "from-indigo-500 to-sky-500",
    teal: "from-teal-400 to-emerald-500",
    lime: "from-lime-400 to-green-500",
    pink: "from-pink-500 to-rose-500",
    slate: "from-slate-500 to-gray-600",
    red: "from-red-500 to-rose-500",
    yellow: "from-yellow-400 to-amber-500",
    purple: "from-purple-500 to-fuchsia-500",
  };

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${accentColors[accent]} flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg`}>
          {step}
        </div>
        <Badge variant="secondary" className="text-xs">Step {step} of 7</Badge>
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">{subtitle}</p>
    </div>
  );
}

// Metric Card component
function MetricCard({
  label,
  value,
  unit,
  trend,
  icon: Icon,
  color = "blue",
}: {
  label: string;
  value: string;
  unit: string;
  trend?: string;
  icon: React.ElementType;
  color?: "blue" | "emerald" | "violet" | "amber" | "rose";
}) {
  const colorClasses = {
    blue: "text-blue-400 bg-gradient-to-br from-blue-950/90 to-blue-900/80 border-blue-500/30",
    emerald: "text-emerald-400 bg-gradient-to-br from-emerald-950/90 to-emerald-900/80 border-emerald-500/30",
    violet: "text-violet-400 bg-gradient-to-br from-violet-950/90 to-violet-900/80 border-violet-500/30",
    amber: "text-amber-400 bg-gradient-to-br from-amber-950/90 to-amber-900/80 border-amber-500/30",
    rose: "text-rose-400 bg-gradient-to-br from-rose-950/90 to-rose-900/80 border-rose-500/30",
  };

  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="h-5 w-5 opacity-70" />
        {trend && (
          <Badge variant="success" className="text-[10px] sm:text-xs">
            {trend}
          </Badge>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs sm:text-sm opacity-70">{unit}</div>
      <div className="text-xs text-zinc-400 mt-2">{label}</div>
    </div>
  );
}

// Scroll indicator component
function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 text-zinc-500">
      <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="p-2 rounded-full border border-zinc-800 bg-zinc-900/50"
      >
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </div>
  );
}

function App() {
  // Calculate key metrics
  const totalGridImpact = gridStatusQuoComponents.reduce((sum, c) => sum + c.value, 0);
  const heroRef = useRef(null);
  const gridGrowthRef = useRef<HTMLDivElement | null>(null);
  const gridGrowthInView = useInView(gridGrowthRef, { once: true, margin: "0px 0px -10% 0px" });
  const [selectedScenario, setSelectedScenario] = useState<"npi2045" | "pkBudg1000_2045" | "pkBudg650_2045">("pkBudg650_2045");
  const baseGridShare = electricityImpactData.statusQuo.gridShare;

  const formatGridDelta = (gridShare: number) => {
    const delta = gridShare - baseGridShare;
    if (Math.abs(delta) < 0.05) return "Baseline";
    const sign = delta > 0 ? "+" : "";
    return `${sign}${delta.toFixed(1)} pts vs 2023`;
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden relative">
      {/* Fixed grid background */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative"
      >
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-zinc-900/70 border border-zinc-700/50 text-zinc-300 px-4 py-2 rounded-full mb-6 will-change-transform"
          >
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs sm:text-sm font-medium">Prospective Life Cycle Assessment</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 will-change-transform"
          >
            <span className="text-zinc-100">Climate Impacts of</span>
            <br />
            <span className="gradient-text">Grid Expansion</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto will-change-transform"
          >
            Explore the environmental impact of electricity grid expansion 
            through 2045 for the case of Germany, considering a range of climate pathways
          </motion.p>

          {/* Key Metrics - Animate each card sequentially */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
              className="will-change-transform"
            >
              <MetricCard
                label="Status Quo"
                value={totalGridImpact.toFixed(1)}
                unit="Mt CO₂-eq"
                icon={BarChart3}
                color="blue"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: "easeOut" }}
              className="will-change-transform"
            >
              <MetricCard
                label="Possible Reduction"
                value="-23%"
                unit="vs BAU"
                trend="1.5°C"
                icon={TrendingUp}
                color="emerald"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="will-change-transform"
            >
              <MetricCard
                label="Scenarios"
                value="3"
                unit="Climate pathways"
                icon={Layers}
                color="violet"
              />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.56, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12 will-change-transform"
          >
            <Button
              variant="gradient"
              size="lg"
              onClick={() => scrollToSection("electricity-evolution")}
              className="group"
            >
              Start Exploring
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-400 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("key-findings")}
            >
              Jump to Findings
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.72, ease: "easeOut" }}
            className="will-change-opacity"
          >
            <ScrollIndicator />
          </motion.div>
        </div>
      </section>

      {/* Main Content - Guided Tour */}
      <main className="max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10">
        {/* Section 1: Electricity Mix */}
        <AnimatedSection id="electricity-evolution" className="mb-24 sm:mb-32">
          <SectionHeader
            step={1}
            title="Electricity's Climate Impact"
            subtitle="How the climate impact of electricity supply transforms and what it means for grid infrastructure's relative impact"
            accent="violet"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch mb-6 sm:mb-8">
            {[
              {
                ...electricityImpactData.statusQuo,
                scenario: "Status Quo",
                impactLabel: `${electricityImpactData.statusQuo.totalGCO2e} g CO₂/kWh`,
              },
              {
                ...electricityImpactData[selectedScenario],
                scenario:
                  selectedScenario === "npi2045"
                    ? "3°C Scenario"
                    : selectedScenario === "pkBudg1000_2045"
                      ? "2°C Scenario"
                      : "1.5°C Scenario",
                impactLabel: `${electricityImpactData[selectedScenario].totalGCO2e} g CO₂/kWh`,
              },
            ].map((scenario, index) => (
              <motion.div
                key={`electricity-card-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="h-full"
              >
                <Card className="card-hover h-full flex flex-col">
                  <CardHeader className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      {scenario.scenario !== "Status Quo" ? (
                        <>
                          <div className="flex flex-wrap items-center gap-2 text-violet-400 mb-2">
                            <TrendingUp className="h-5 w-5" />
                            <span className="text-lg font-semibold text-zinc-200">Scenario</span>
                            <ToggleGroup
                              type="single"
                              value={selectedScenario}
                              accent="violet"
                              onValueChange={(value) => value && setSelectedScenario(value as typeof selectedScenario)}
                              className="gap-0 rounded-lg border border-zinc-800 overflow-hidden bg-zinc-900/60"
                            >
                              <ToggleGroupItem
                                value="pkBudg650_2045"
                                aria-label="1.5 degree scenario"
                                className="font-semibold border-r border-zinc-800 rounded-none"
                              >
                                1.5°C
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="pkBudg1000_2045"
                                aria-label="2 degree scenario"
                                className="font-semibold border-r border-zinc-800 rounded-none"
                              >
                                2°C
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="npi2045"
                                aria-label="3 degree scenario"
                                className="font-semibold rounded-none"
                              >
                                3°C
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                          <CardDescription>Impacts shares in 2045</CardDescription>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-violet-400 mb-2">
                            <ArrowDownToDot className="h-5 w-5" />
                            <CardTitle>{scenario.scenario}</CardTitle>
                          </div> 
                          <CardDescription>Impacts shares in 2023</CardDescription>
                        </>
                      )}
                    </div>

                    <div className="flex items-start flex-shrink-0 w-full sm:w-auto sm:justify-end pt-1 sm:pt-0">
                      <div className="flex items-center gap-3 rounded-lg border border-indigo-400/40 bg-gradient-to-br from-[#645de8] to-[#a855f7] px-3 py-2 -m-1 shadow-lg shadow-indigo-900/30 text-left w-auto min-w-[140px]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-200 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-100" />
                        </span>
                        <div className="leading-tight">
                          <div className="text-[10px] uppercase tracking-[0.08em] text-indigo-100">Grid share</div>
                          <div className="flex items-center gap-2 text-xs text-white">
                            <span className="font-semibold">{scenario.gridShare.toFixed(1)}%</span>
                            <span className="text-[10px] text-indigo-100/80">{formatGridDelta(scenario.gridShare)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-2 pb-4 flex-1 flex items-center justify-center h-[320px] sm:h-[380px] md:h-[440px]">
                    <ElectricityDonutChart data={scenario as any} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-950/50 via-violet-950/50 to-blue-950/50 card-hover p-2">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center" ref={gridGrowthRef}>
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-4 flex items-center justify-center gap-3">
                  <span className="inline-block">1%</span>
                  <span aria-hidden>→</span>
                  <CountUp
                    target={22}
                    start={gridGrowthInView}
                    duration={3}
                    delay={0}
                    startValue={2}
                    className="inline-block"
                    suffix="%"
                  />
                </div>
                <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
                  Grid infrastructure's share of total electricity impact increases from ~1% today to over 22% in the 1.5°C scenario.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Section 2: Grid Status Quo */}
        <AnimatedSection id="status-quo" className="mb-24 sm:mb-32">
          <SectionHeader
            step={2}
            title="Today's Grid Infrastructure"
            subtitle="Understanding the current environmental footprint of Germany's electricity transmission and distribution network"
            accent="amber"
          />

          {/* Component Cards - Infrastructure Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
            {gridStatusQuoComponents.map((component, index) => (
              <GridComponentCard key={component.name} component={component} index={index} />
            ))}
          </div>

          {/* Total Impact and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            <TotalImpactCard totalGridImpact={totalGridImpact} />

            <Card className="lg:col-span-3 card-hover w-full min-w-0">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <ChartBar className="h-5 w-5" />
                  <CardTitle className="text-lg">Component Breakdown</CardTitle>
                </div>
                <CardDescription>Climate impact by infrastructure type</CardDescription>
              </CardHeader>
              <CardContent>
                <GridStatusQuoChart />
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        {/* Section 3: Material Flows */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <SectionHeader
            step={3}
            title="Material & Process Analysis"
            subtitle="Tracing the environmental impact from industrial processes through materials to grid components"
            accent="teal"
          />

          <Card className="mb-6 card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-teal-400 mb-2">
                <Layers className="h-5 w-5" />
                <CardTitle>Impact Sankey Diagram</CardTitle>
              </div>
              <CardDescription>
                Climate impact flows from processes → materials → components → grid
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SankeyVisualization />
            </CardContent>
          </Card>

        </AnimatedSection>

        {/* Section 4: Grid Expansion Scenarios */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <SectionHeader
            step={4}
            title="Grid Expansion Scenarios"
            subtitle="Comparing climate pathways: how prospective LCA reveals emission reduction potential"
            accent="red"
          />

          {/* Scenario Comparison Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              { name: "Static (BAU)", value: "34.5", color: "zinc", change: "Baseline", desc: "Business as usual" },
              { name: "3°C Scenario", value: "30.4", color: "amber", change: "-12%", desc: "National policies" },
              { name: "2°C Scenario", value: "28.3", color: "blue", change: "-18%", desc: "1000 Gt budget" },
              { name: "1.5°C Scenario", value: "26.3", color: "emerald", change: "-23%", desc: "650 Gt budget" },
            ].map((scenario, index) => (
              <motion.div
                key={scenario.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`card-hover ${
                  scenario.color === "emerald" ? "border-emerald-500/30 bg-emerald-950/20" : ""
                }`}>
                  <CardContent className="pt-5 text-center">
                    <div className="text-xs text-zinc-400 mb-1">{scenario.name}</div>
                    <div className={`text-2xl sm:text-3xl font-bold mb-1 ${
                      scenario.color === "zinc" ? "text-zinc-400" :
                      scenario.color === "amber" ? "text-amber-400" :
                      scenario.color === "blue" ? "text-blue-400" :
                      "text-emerald-400"
                    }`}>
                      {scenario.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-zinc-500 mb-2">Mt CO₂-eq</div>
                    <Badge 
                      variant={scenario.change === "Baseline" ? "outline" : "success"} 
                      className="text-[10px]"
                    >
                      {scenario.change}
                    </Badge>
                    <div className="text-[10px] text-zinc-500 mt-2">{scenario.desc}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <TrendingUp className="h-5 w-5" />
                <CardTitle className="text-lg">Expansion Timeline</CardTitle>
              </div>
              <CardDescription>
                Cumulative climate impact of grid expansion from 2025 to 2045
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpansionTimelineChart />
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Section 5: Future Contributions Explorer */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <SectionHeader
            step={5}
            title="Future Contributions Explorer"
            subtitle="Compare BAU with climate scenarios across materials, components, processes, and time periods"
            accent="cyan"
          />

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <BarChart3 className="h-5 w-5" />
                <CardTitle className="text-lg">Scenario Comparison by Category</CardTitle>
              </div>
              <CardDescription>
                Toggle categories and scenarios to see how shares shift over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 sm:p-5 sm:pt-2">
              <MaterialContributionChart />
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Section 6: Impact Categories */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <SectionHeader
            step={6}
            title="Environmental Impact Categories"
            subtitle="Beyond climate change: comprehensive assessment across multiple impact dimensions"
            accent="lime"
          />

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card variant="success" className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-100 text-base flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Most Improved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Climate Change", value: "-23%" },
                    { name: "Energy Resources", value: "-22%" },
                    { name: "Eutrophication", value: "-13%" },
                  ].map((item) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-emerald-300">{item.name}</span>
                      <Badge variant="success" className="text-[10px]">{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="warning" className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-100 text-base">Trade-offs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-amber-300">Land Use</span>
                    <Badge variant="warning" className="text-[10px]">+18%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-amber-300">Material Resources</span>
                    <Badge variant="outline" className="text-[10px]">+1%</Badge>
                  </div>
                </div>
                <p className="mt-3 text-[10px] sm:text-xs text-amber-300/70">
                  Minor increases due to expanded renewable infrastructure
                </p>
              </CardContent>
            </Card>

            <Card variant="accent" className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-100 text-base">Key Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-blue-300">
                  Prospective LCA reveals <strong>significant reductions</strong> across 
                  most environmental impact categories, with only minor trade-offs 
                  in land use.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-lime-400 mb-2">
                <Leaf className="h-5 w-5" />
                <CardTitle>Impact Category Comparison</CardTitle>
              </div>
              <CardDescription>
                Relative change vs. business-as-usual (BAU) across all categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImpactCategoryComparisonChart />
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Section 7: Key Findings */}
        <AnimatedSection id="key-findings" className="mb-16 sm:mb-24">
          <SectionHeader
            step={7}
            title="Key Findings"
            subtitle="The essential insights from this prospective life cycle assessment study"
            accent="rose"
          />

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "23% Reduction Achievable",
                description: "Prospective LCA reveals potential to reduce estimated grid expansion impact by up to 23% compared to static assessment methods.",
                color: "emerald"
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Growing Grid Share",
                description: "As electricity generation decarbonizes, grid infrastructure's relative contribution to total impact increases significantly.",
                color: "blue"
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: "Material Hotspots",
                description: "Overhead lines (aluminum) and transformers (steel/iron) are the largest contributors to grid infrastructure impact.",
                color: "violet"
              },
            ].map((finding, index) => (
              <motion.div
                key={finding.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover group">
                  <CardContent className="pt-6">
                    <div className={`inline-flex p-3 rounded-xl mb-4 transition-transform group-hover:scale-110 ${
                      finding.color === "emerald" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      finding.color === "blue" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                    }`}>
                      {finding.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 mb-2">
                      {finding.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {finding.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Back to Top */}
        <AnimatedSection className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to Top
            <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-16 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Cable className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-zinc-400">PLCA Grid Expansion Explorer</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 text-center">
              Data from: <span className="text-zinc-400">Prospective Life Cycle Assessment of Germany's Electricity Grid Expansion</span>
            </p>
            <Button variant="ghost" size="sm" className="text-zinc-400">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              View Paper
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
