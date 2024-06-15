import client from "./client";

export const gameApi = {
  getGameInfo: () => client.get("/game/latest"),
 
  sync: (data: {
    score: number;
    click: number;
    energy: number;
    max_energy: number;
  }) => client.post("/game/sync", data),
};
