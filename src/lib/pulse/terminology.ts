import { useDesignVersion } from "./designVersion";

type UnitLabels = {
  singular: string;
  plural: string;
  numbered: (n: number | string) => string;
};

const V1_UNIT: UnitLabels = {
  singular: "Release",
  plural: "Releases",
  numbered: (n) => `Release ${String(n).padStart(2, "0")}`,
};

const V2_UNIT: UnitLabels = {
  singular: "Module",
  plural: "Modules",
  numbered: (n) => `Module ${String(n).padStart(2, "0")}`,
};

export function useUnitLabel(): UnitLabels {
  const { designVersion } = useDesignVersion();
  return designVersion === "v2" ? V2_UNIT : V1_UNIT;
}
