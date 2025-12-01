export type ScenarioKey = "scen3" | "scen2" | "scen15";

export const scenarioOptions: { key: ScenarioKey; label: string }[] = [
  { key: "scen3", label: "3°C scenario" },
  { key: "scen2", label: "2°C scenario" },
  { key: "scen15", label: "1.5°C scenario" },
];

// Shared scenario colors across charts (aligned with ExpansionTimelineChart)
export const scenarioColors: Record<ScenarioKey, string> = {
  scen3: "#ef4444",   // 3°C scenario — red
  scen2: "#3b82f6",   // 2°C scenario — blue
  scen15: "#8b5cf6",  // 1.5°C scenario — violet
};

type ScenarioShares = {
  label: string;
  BAU: number;
  scen3: number;
  scen2: number;
  scen15: number;
};

const materials: ScenarioShares[] = [
  { label: "Other materials", BAU: 4, scen3: 4, scen2: 4, scen15: 3 },
  { label: "Concrete", BAU: 4, scen3: 4, scen2: 3, scen15: 3 },
  { label: "Plastics", BAU: 6, scen3: 5, scen2: 5, scen15: 5 },
  { label: "SF6", BAU: 7, scen3: 7, scen2: 7, scen15: 7 },
  { label: "Copper", BAU: 15, scen3: 13, scen2: 11, scen15: 11 },
  { label: "Iron & Steel", BAU: 20, scen3: 18, scen2: 17, scen15: 16 },
  { label: "Aluminum", BAU: 44, scen3: 35, scen2: 33, scen15: 31 },
];

const components: ScenarioShares[] = [
  { label: "Substations", BAU: 1, scen3: 1, scen2: 1, scen15: 1 },
  { label: "Transformers", BAU: 4, scen3: 4, scen2: 3, scen15: 3 },
  { label: "Switchgears", BAU: 8, scen3: 8, scen2: 8, scen15: 8 },
  { label: "Cables", BAU: 43, scen3: 35, scen2: 32, scen15: 30 },
  { label: "Overhead lines", BAU: 44, scen3: 38, scen2: 36, scen15: 34 },
];

const processes: ScenarioShares[] = [
  { label: "Other processes", BAU: 11, scen3: 10, scen2: 10, scen15: 9 },
  { label: "Clinker", BAU: 3, scen3: 4, scen2: 4, scen15: 3 },
  { label: "Aluminum (process emissions)", BAU: 6, scen3: 6, scen2: 6, scen15: 6 },
  { label: "SF6", BAU: 7, scen3: 7, scen2: 7, scen15: 7 },
  { label: "Coal", BAU: 8, scen3: 7, scen2: 6, scen15: 6 },
  { label: "Transport", BAU: 9, scen3: 8, scen2: 8, scen15: 8 },
  { label: "Heat", BAU: 11, scen3: 11, scen2: 10, scen15: 10 },
  { label: "Iron & steel (process emissions)", BAU: 11, scen3: 10, scen2: 10, scen15: 9 },
  { label: "Electricity", BAU: 34, scen3: 23, scen2: 19, scen15: 18 },
];

const expansion: ScenarioShares[] = [
  { label: "2023 → 2025", BAU: 10, scen3: 10, scen2: 10, scen15: 10 },
  { label: "2025 → 2030", BAU: 26, scen3: 25, scen2: 25, scen15: 25 },
  { label: "2030 → 2035", BAU: 26, scen3: 22, scen2: 21, scen15: 20 },
  { label: "2035 → 2040", BAU: 20, scen3: 16, scen2: 13, scen15: 12 },
  { label: "2040 → 2045", BAU: 18, scen3: 13, scen2: 11, scen15: 9 },
];

export const plotDatasets = {
  materials,
  components,
  processes,
  expansion,
};

export type PlotDatasetKey = keyof typeof plotDatasets;
