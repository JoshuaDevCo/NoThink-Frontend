import { createStore } from "zustand";
import { challengeApi } from "../apis/challenge";

export interface IChallengeStore {
  inited: boolean;
  list: { type: string; reward: string; label: string }[];
  completed: { _id: string; type: string; claimed: boolean }[];

  init: () => void;
  refresh: () => void;
  claim: (challengeId: string) => Promise<void>;
}

export const ChallengeStore = createStore<IChallengeStore>((set) => ({
  inited: false,
  completed: [],
  list: [],
  refresh: () => {
    challengeApi.getCompleted().then((r) => {
      set({ completed: r.data });
    });
  },
  init: () => {
    challengeApi.getAll().then((r) => {
      set({ list: r.data });
    });
    challengeApi
      .getCompleted()
      .then((r) => {
        set({ completed: r.data });
      })
      .catch((e) => console.error(e));
  },
  claim: async (challengeId: string) => {
    await challengeApi.claim(challengeId);
    await challengeApi.getCompleted().then((r) => {
      set({ completed: r.data });
    });
  },
}));
