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
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Zap,
  TrendingUp,
  Layers,
  BarChart3,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Activity,
  Leaf,
  Cable,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  accent?: "blue" | "emerald" | "violet" | "amber" | "cyan" | "rose" | "indigo" | "teal" | "lime";
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
  };

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${accentColors[accent]} flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg`}>
          {step}
        </div>
        <Badge variant="secondary" className="text-xs">Step {step} of 7</Badge>
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold dark:text-zinc-100 light:text-zinc-900 tracking-tight mb-2">
        {title}
      </h2>
      <p className="dark:text-zinc-400 light:text-zinc-600 text-sm sm:text-base max-w-2xl">{subtitle}</p>
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
    blue: "text-blue-400 dark:bg-gradient-to-br dark:from-blue-950/90 dark:to-blue-900/80 light:bg-gradient-to-br light:from-blue-100 light:to-blue-50 border-blue-500/30 light:border-blue-200",
    emerald: "text-emerald-400 dark:bg-gradient-to-br dark:from-emerald-950/90 dark:to-emerald-900/80 light:bg-gradient-to-br light:from-emerald-100 light:to-emerald-50 border-emerald-500/30 light:border-emerald-200",
    violet: "text-violet-400 dark:bg-gradient-to-br dark:from-violet-950/90 dark:to-violet-900/80 light:bg-gradient-to-br light:from-violet-100 light:to-violet-50 border-violet-500/30 light:border-violet-200",
    amber: "text-amber-400 dark:bg-gradient-to-br dark:from-amber-950/90 dark:to-amber-900/80 light:bg-gradient-to-br light:from-amber-100 light:to-amber-50 border-amber-500/30 light:border-amber-200",
    rose: "text-rose-400 dark:bg-gradient-to-br dark:from-rose-950/90 dark:to-rose-900/80 light:bg-gradient-to-br light:from-rose-100 light:to-rose-50 border-rose-500/30 light:border-rose-200",
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
      <div className="text-xs dark:text-zinc-400 light:text-zinc-600 mt-2">{label}</div>
    </div>
  );
}

// Scroll indicator component
function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 dark:text-zinc-500 light:text-zinc-400">
      <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="p-2 rounded-full dark:border-zinc-800 dark:bg-zinc-900/50 light:border-zinc-300 light:bg-white/50 border"
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
    <div className="min-h-screen overflow-x-hidden relative transition-colors duration-300">
      {/* Fixed grid background */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />
      {/* Theme Toggle - Fixed at top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
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
            className="inline-flex items-center gap-2 dark:bg-zinc-800/50 dark:border-zinc-700/50 dark:text-zinc-300 light:bg-white/70 light:border-zinc-200 light:text-zinc-700 border px-4 py-2 rounded-full mb-6 will-change-transform"
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
            <span className="dark:text-zinc-100 light:text-zinc-900">Climate Impacts of</span>
            <br />
            <span className="gradient-text">Grid Expansion</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl dark:text-zinc-400 light:text-zinc-600 mb-10 leading-relaxed max-w-2xl mx-auto will-change-transform"
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
            title="Electricity Generation Evolution"
            subtitle="How the generation mix transforms and what it means for grid infrastructure's relative impact"
            accent="teal"
          />

          <div className="flex flex-col gap-3 sm:gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
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
                    <CardHeader className="flex w-full flex-row items-start justify-between gap-3 p-4 sm:p-5 min-h-[140px] max-h-[220px] max-[450px]:flex-col max-[450px]:items-start">
                      {scenario.scenario === "Status Quo" ? (
                        <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <CardTitle className="text-xs sm:text-sm">
                      Status Quo
                    </CardTitle>
                    <CardDescription className="text-[10px]">
                      {scenario.year} • {scenario.impactLabel}
                    </CardDescription>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <Select
                      value={selectedScenario}
                      onValueChange={(v) => setSelectedScenario(v as typeof selectedScenario)}
                    >
                      <SelectTrigger className="w-48 dark:bg-zinc-900 dark:border-zinc-800 light:bg-white light:border-zinc-300 text-sm">
                        <SelectValue placeholder="Select scenario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="npi2045">3°C (2045)</SelectItem>
                        <SelectItem value="pkBudg1000_2045">2°C (2045)</SelectItem>
                        <SelectItem value="pkBudg650_2045">1.5°C (2045)</SelectItem>
                      </SelectContent>
                    </Select>
                    <CardDescription className="text-[10px]">
                      {scenario.year} • {scenario.impactLabel}
                    </CardDescription>
                  </div>
                </>
              )}
                <div className="flex items-center flex-shrink-0 w-auto max-[420px]:w-full">
                  <div className="flex items-center gap-2 rounded-lg border border-indigo-400/40 bg-gradient-to-br from-[#645de8] to-[#a855f7] px-3 py-2 shadow-lg shadow-indigo-900/30 text-left w-auto min-w-[160px]">
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
                    <CardContent className="px-2 pb-4 flex-1 flex items-center justify-center h-[360px] sm:h-[400px] md:h-[460px]">
                      <ElectricityDonutChart data={scenario as any} />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-950/50 via-violet-950/50 to-blue-950/50 card-hover">
            <CardContent className="py-8 sm:py-10">
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
                <p className="text-sm sm:text-base dark:text-zinc-400 light:text-zinc-600 max-w-xl mx-auto">
                  Grid infrastructure's share of total electricity impact increases from 
                  ~1% today to over 22% in the 1.5°C scenario as generation becomes cleaner.
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

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
            <Card className="lg:col-span-2 card-hover w-full min-w-0">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <BarChart3 className="h-5 w-5" />
                  <CardTitle className="text-lg">Total Impact (2023)</CardTitle>
                </div>
                <CardDescription>
                  Combined climate impact of all grid components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2">
                  {totalGridImpact.toFixed(2)}
                </div>
                <div className="text-sm dark:text-zinc-400 light:text-zinc-600 mb-4">
                  Megatonnes of CO₂ equivalent
                </div>
                <div className="p-3 dark:bg-blue-500/10 light:bg-blue-100 rounded-lg border dark:border-blue-500/20 light:border-blue-200">
                  <p className="text-xs sm:text-sm dark:text-blue-300 light:text-blue-700">
                    ≈ <strong>4.6 g CO₂-eq/kWh</strong> contribution to Germany's 
                    electricity carbon footprint
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 card-hover w-full min-w-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Component Breakdown</CardTitle>
                <CardDescription>Climate impact by infrastructure type</CardDescription>
              </CardHeader>
              <CardContent>
                <GridStatusQuoChart />
              </CardContent>
            </Card>
          </div>

          {/* Component Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {gridStatusQuoComponents.map((component, index) => (
              <motion.div
                key={component.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="text-center card-hover dark:border-zinc-800/50 light:border-zinc-200">
                  <CardContent className="pt-5 pb-4">
                    <div
                      className="text-xl sm:text-2xl font-bold mb-1"
                      style={{ color: component.color }}
                    >
                      {component.value.toFixed(1)}
                    </div>
                    <div className="text-[10px] sm:text-xs dark:text-zinc-500 light:text-zinc-500 mb-2">Mt CO₂-eq</div>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">{component.name}</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Section 3: Material Flows */}
        <AnimatedSection className="mb-24 sm:mb-32">
          <SectionHeader
            step={3}
            title="Material & Process Analysis"
            subtitle="Tracing the environmental impact from industrial processes through materials to grid components"
            accent="violet"
          />

          <Card className="mb-6 card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-violet-400 mb-2">
                <Layers className="h-5 w-5" />
                <CardTitle className="text-lg">Material Flow Diagram</CardTitle>
              </div>
              <CardDescription>
                Visualizing how processes contribute to materials, and materials to components
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
            accent="emerald"
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
                  scenario.color === "emerald" ? "dark:border-emerald-500/30 dark:bg-emerald-950/20 light:border-emerald-200 light:bg-emerald-50" : ""
                }`}>
                  <CardContent className="pt-5 text-center">
                    <div className="text-xs dark:text-zinc-400 light:text-zinc-600 mb-1">{scenario.name}</div>
                    <div className={`text-2xl sm:text-3xl font-bold mb-1 ${
                      scenario.color === "zinc" ? "dark:text-zinc-400 light:text-zinc-500" :
                      scenario.color === "amber" ? "text-amber-400" :
                      scenario.color === "blue" ? "text-blue-400" :
                      "text-emerald-400"
                    }`}>
                      {scenario.value}
                    </div>
                    <div className="text-[10px] sm:text-xs dark:text-zinc-500 light:text-zinc-500 mb-2">Mt CO₂-eq</div>
                    <Badge 
                      variant={scenario.change === "Baseline" ? "outline" : "success"} 
                      className="text-[10px]"
                    >
                      {scenario.change}
                    </Badge>
                    <div className="text-[10px] dark:text-zinc-500 light:text-zinc-500 mt-2">{scenario.desc}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
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
              <CardTitle className="text-lg">Scenario Comparison by Category</CardTitle>
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
              <CardTitle className="text-lg">Impact Category Comparison</CardTitle>
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
                      finding.color === "emerald" ? "dark:bg-emerald-500/10 light:bg-emerald-100 text-emerald-400 border dark:border-emerald-500/20 light:border-emerald-200" :
                      finding.color === "blue" ? "dark:bg-blue-500/10 light:bg-blue-100 text-blue-400 border dark:border-blue-500/20 light:border-blue-200" :
                      "dark:bg-violet-500/10 light:bg-violet-100 text-violet-400 border dark:border-violet-500/20 light:border-violet-200"
                    }`}>
                      {finding.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold dark:text-zinc-100 light:text-zinc-900 mb-2">
                      {finding.title}
                    </h3>
                    <p className="text-sm dark:text-zinc-400 light:text-zinc-600 leading-relaxed">
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
      <footer className="border-t dark:border-zinc-800/50 light:border-zinc-200 mt-16 dark:bg-zinc-900/50 light:bg-white/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Cable className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm dark:text-zinc-400 light:text-zinc-600">PLCA Grid Expansion Explorer</span>
            </div>
            <p className="text-xs sm:text-sm dark:text-zinc-500 light:text-zinc-500 text-center">
              Data from: <span className="dark:text-zinc-400 light:text-zinc-600">Prospective Life Cycle Assessment of Germany's Electricity Grid Expansion</span>
            </p>
            <Button variant="ghost" size="sm">
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
