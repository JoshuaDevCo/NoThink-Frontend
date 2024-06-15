import client from "./client";

export const boosterApi = {
  use: (
    type:
      | "zen-power"
      | "lotus-energy"
      | "multitap"
      | "energy-limit-increase"
      | "energy-recharge-decrease"
      | "autotapper"
  ) => client.post<boolean>(`/game/boosters/use/${type}`),

  getAll: () => client.get("/game/boosters/list"),
  getMine: () => client.get("/game/boosters/mine"),
  getDaily: () => client.get("/game/boosters/daily"),
};
