import { createStore } from "zustand";
import { challengeApi } from "../apis/challenge";

export interface IChallengeStore {
  inited: boolean;
  loading: null | string;
  list: { type: string; reward: string; label: string }[];
  completed: { _id: string; type: string; claimed: boolean }[];

  init: () => void;
  refresh: () => void;
  claim: (challengeId: string) => Promise<void>;
}

export const ChallengeStore = createStore<IChallengeStore>((set) => ({
  loading: null,
  inited: false,
  completed: [],
  list: [],
  refresh: () => {
    challengeApi.getCompleted().then((r) => {
      set({ completed: r.data });
    });
  },
  init: () => {
    Promise.all([
      challengeApi.getAll().then((r) => {
        set({ list: r.data });
      }),
      challengeApi
        .getCompleted()
        .then((r) => {
          set({ completed: r.data });
        })
        .catch((e) => console.error(e)),
    ]).then(() => {
      set({ inited: true });
    });
  },
  claim: async (challengeId: string) => {
    set({ loading: challengeId });
    await challengeApi.claim(challengeId);
    await challengeApi.getCompleted().then((r) => {
      set({ completed: r.data });
      set({ loading: null });
    });
  },
}));
