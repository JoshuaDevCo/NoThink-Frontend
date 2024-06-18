import { createStore } from "zustand";
import { boosterApi } from "../apis/booster";
import { BoosterType } from "../types/booster";

export type Booster = {
  _id: string;
  label?: string;
  description?: string;
  level: number;
  price: number;
  denom: string;
  type: string;
};
export type IBoosterStore = {
  init: () => void;
  refresh: () => void;
  mine: Record<string, Booster[]>;
  list: Record<string, Booster[]>;
  daily: Record<string, (Booster & { usages: number; max_usages: number })[]>;

  loading: boolean;
  use: (type: BoosterType) => Promise<boolean>;

  zenPower?: {
    startedAt: number;
    isActive: boolean;
  };
  setLoading: (value: boolean) => void;
  stop: () => void;
};

export const BoosterStore = createStore<IBoosterStore>((set) => ({
  list: {},
  mine: {},
  daily: {},
  loading: false,
  init: () => {
    boosterApi.getAll().then((r) => set({ list: r.data }));
    boosterApi.getMine().then((r) => {
      console.log(r.data);
      set({ mine: r.data });
    });
    boosterApi.getDaily().then((r) => {
      set({ daily: r.data });
    });
    //
    // set({});
  },
  refresh: () => {
    boosterApi.getAll().then((r) => set({ list: r.data }));
    boosterApi.getMine().then((r) => {
      console.log(r.data);
      set({ mine: r.data });
    });
    boosterApi.getDaily().then((r) => {
      set({ daily: r.data });
    });
  },
  use: (type) => {
    set({ loading: true });
    return boosterApi.use(type).then((r) => {
      // const used = r.data;
      if (type === "zen-power" && r.data) {
        set({
          zenPower: {
            isActive: true,
            startedAt: performance.now(),
          },
        });
      }
      return r.data;
    });
  },
  setLoading: (value: boolean) => {
    set({ loading: value });
  },
  stop: () => {
    set({ zenPower: undefined });
  },
}));
