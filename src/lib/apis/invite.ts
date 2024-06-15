import client from "./client";

export const inviteApi = {
  getLink: () => client.get<{ _id: string }>("/ref/link"),
};
