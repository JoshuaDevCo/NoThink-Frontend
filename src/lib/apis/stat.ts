import client from "./client";

export const statApi = {
  getTappers: () => client.get<number>("/stat/tappers"),
  getScore: () => client.get<number>("/stat/score"),
  getRankTable: () => client.get("/stat/table"),
  getInvitedRankTable: () => client.get("/stat/invited/table"),
  getPlacementInRankTable: () => client.get("/stat/placement/table"),
};
