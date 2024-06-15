export type TCounterBoosterReset = () => {
  currentCount: number;
  currentMultiplier: number;
};
export type TCounterBooster = {
  type: string;

  execute: (
    currentCount: number,
    currentMultiplier: number
  ) => {
    multiplier: number;
    reset: TCounterBoosterReset;
  };
};

export type BoosterType =
  | "zen-power"
  | "lotus-energy"
  | "multitap"
  | "energy-limit-increase"
  | "energy-recharge-decrease"
  | "autotapper";
