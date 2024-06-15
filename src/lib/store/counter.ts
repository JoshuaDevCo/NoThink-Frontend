import { createStore } from "zustand";
import { TCounterBooster } from "../types/booster";
import { gameApi } from "../apis/game";

export type TCounterStore = {
  inited: boolean;
  is_booster_active: boolean;
  booster_type: string | null;

  total_balance: number;
  count: number;
  tap_value: number;
  clicks: number;
  multiplier: number;

  auto_tapped: number;

  is_energy_locked: boolean;
  max_energy: number;
  energy: number;
  energy_recharge_time: number;
  energy_reduce: number;

  latest_sync_date: Date;

  click: () => void;
  init: () => void;
  refresh: () => void;
  sync: () => Promise<void>;
  applyBooster: (booster: TCounterBooster, ms: number) => void;
  startEnergyRecharge: () => number;
  setTapValue: (value: number) => void;
};

const getSnapshot = (): Omit<
  TCounterStore,
  | "inited"
  | "isBoosterActive"
  | "boosterType"
  | "click"
  | "init"
  | "sync"
  | "startEnergyRecharge"
  | "applyBooster"
  | "setTapValue"
  | "refresh"
  | "auto_tapped"
> => {
  const stringGameSnapshot = localStorage.getItem("snapshot");
  if (!stringGameSnapshot) {
    return {
      clicks: 0,
      count: 0,
      energy: 100,
      energy_recharge_time: 0,
      max_energy: 100,
      energy_reduce: 1,
      is_energy_locked: false,
      latest_sync_date: new Date(),
      multiplier: 1,
      tap_value: 1,
      total_balance: 0,
      booster_type: null,
      is_booster_active: false,
    };
  }
  const snapshot = JSON.parse(stringGameSnapshot);
  const latest_sync_date =
    new Date(Number(snapshot.latest_sync_date)) || new Date();
  return {
    clicks: Number(snapshot.clicks || "0"),
    count: Number(snapshot.count || "0"),
    energy: Number(snapshot.energy || "100"),
    energy_recharge_time: Number(snapshot.energy_recharge_time || "0"),
    max_energy: Number(snapshot.max_energy || "100"),
    energy_reduce: Number(snapshot.energy_reduce || "1"),
    is_energy_locked: snapshot.is_energy_locked === "true" || false,
    latest_sync_date,
    multiplier: Number(snapshot.multiplier || "1"),
    tap_value: Number(snapshot.tap_value || "1"),
    total_balance: Number(snapshot.total_balance || "0"),
    booster_type: snapshot.booster_type || null,
    is_booster_active: snapshot.is_booster_active === "true" || false,
  };
};
const setInitalValue = (data: Partial<Record<keyof TCounterStore, number>>) => {
  const stringGameSnapshot = localStorage.getItem("snapshot");
  if (!stringGameSnapshot) {
    localStorage.setItem("snapshot", JSON.stringify(data));
    return;
  }
  const parsed = JSON.parse(stringGameSnapshot);
  const result = { ...parsed, ...data };
  localStorage.setItem("snapshot", JSON.stringify(result));
};

export const CounterStore = createStore<TCounterStore>((set, get) => {
  const snapshot = getSnapshot();
  return {
    inited: false,
    auto_tapped: 0,
    ...snapshot,
    click: () => {
      const energy = get().energy;
      let energyReduce = get().energy_reduce;
      const energyLock = get().is_energy_locked;
      const tapValue = get().tap_value;
      if (energyLock) {
        energyReduce = 0;
      }
      if (energy - energyReduce < 0) return;

      set((state) => {
        setInitalValue({
          count: state.count + tapValue * state.multiplier,
          energy: state.energy - energyReduce,
          clicks: state.clicks + 1,
        });
        return {
          count: state.count + tapValue * state.multiplier,
          energy: state.energy - energyReduce,
          clicks: state.clicks + 1,
        };
      });
    },
    init: () => {
      gameApi.getGameInfo().then((r) => {
        setTimeout(() => {
          set({
            inited: true,
            total_balance: r.data.score,
            multiplier: r.data.multiplier,
            energy: r.data.energy,
            max_energy: r.data.max_energy,
            tap_value: r.data.tap_value || 1,
            energy_reduce: 1,
            energy_recharge_time: r.data.energy_recharge_time_reduce || 0,
            auto_tapped: r.data.auto_tapped || 0,
          });
        }, 1000);
        setInitalValue({
          multiplier: r.data.multiplier,
          total_balance: r.data.score,
          energy: r.data.energy,
          max_energy: r.data.max_energy,
          tap_value: r.data.tap_value || 1,
          energy_reduce: 1,
          energy_recharge_time: r.data.energy_recharge_time_reduce || 0,
        });
      });
    },
    sync: async () => {
      if (!get().inited) {
        return;
      }
      const score = get().count;
      const click = get().clicks;
      const energy = get().energy;
      const maxEnergy = get().max_energy;
      return gameApi
        .sync({ score, click, energy, max_energy: maxEnergy })
        .then(() => {
          set((state) => {
            setInitalValue({
              clicks: 0,
              count: 0,
              total_balance: state.total_balance + state.count,
              latest_sync_date: Date.now(),
            });
            return {
              clicks: 0,
              count: 0,
              total_balance: state.total_balance + state.count,
              latest_sync_date: new Date(),
            };
          });
        });
    },
    refresh() {
      gameApi.getGameInfo().then((r) => {
        set({
          total_balance: r.data.score,
          multiplier: r.data.multiplier,
          energy: r.data.energy,
          max_energy: r.data.max_energy,
          tap_value: r.data.tap_value || 1,
          energy_reduce: 1,
          energy_recharge_time: r.data.energy_recharge_time_reduce || 0,
        });
        setInitalValue({
          multiplier: r.data.multiplier,
          total_balance: r.data.score,
          energy: r.data.energy,
          max_energy: r.data.max_energy,
          tap_value: r.data.tap_value || 1,
          energy_reduce: 1,
          energy_recharge_time: r.data.energy_recharge_time_reduce || 0,
        });
      });
    },
    startEnergyRecharge: () => {
      const id = setInterval(() => {
        set((state) => ({
          energy:
            state.energy === state.max_energy
              ? state.max_energy
              : state.energy + 1,
        }));
      }, 3000 * (1 - get().energy_recharge_time));
      return id;
    },
    applyBooster: (booster, ms) => {
      set({ is_booster_active: true });
      setTimeout(() => {}, ms);
    },
    setTapValue: (value) => {
      set({ tap_value: value });
    },
  };
});
