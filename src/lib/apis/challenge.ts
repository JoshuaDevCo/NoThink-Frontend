import client from "./client";

export const challengeApi = {
  getAll: () => client.get("/game/challenge/all"),
  getCompleted: () => client.get("/game/challenge/completed"),
  claim: (challengeId: string) =>
    client.post("/game/challenge/claim", { challengeId }),
};
