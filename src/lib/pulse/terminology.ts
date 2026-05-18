type UnitLabels = {
  singular: string;
  plural: string;
  numbered: (n: number | string) => string;
};

const UNIT: UnitLabels = {
  singular: "Module",
  plural: "Modules",
  numbered: (n) => `Module ${String(n).padStart(2, "0")}`,
};

export function useUnitLabel(): UnitLabels {
  return UNIT;
}
