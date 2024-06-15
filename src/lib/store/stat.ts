import { createStore } from "zustand";
import { statApi } from "../apis/stat";

export interface IStatStore {
  inited: boolean;
  init: () => void;
  refreshNumbers: () => void;
  tappers: number;
  score: number;
  list: {
    _id: string;
    score: number;
    telegram_details: { username: string };
  }[];
  invited_list: {
    _id: string;
    score: number;
    telegram_details: { username: string };
  }[];
  place: number;
}

export const StatStore = createStore<IStatStore>((set) => ({
  inited: false,
  list: [],
  invited_list: [],
  tappers: 0,
  score: 0,
  place: -1,
  init: () => {
    Promise.all([
      statApi.getScore().then((res) => {
        set({ score: res.data });
      }),
      statApi.getTappers().then((res) => {
        set({ tappers: res.data });
      }),
      statApi.getRankTable().then((res) => {
        set({ list: res.data });
      }),
      statApi.getInvitedRankTable().then((res) => {
        set({ invited_list: res.data });
      }),
      statApi.getPlacementInRankTable().then((res) => {
        set({ place: res.data });
      }),
    ]).then(() => set({ inited: true }));
  },
  refreshNumbers: () => {
    statApi.getScore().then((res) => {
      set({ score: res.data });
    });
    statApi.getTappers().then((res) => {
      set({ tappers: res.data });
    });
  },
}));
