// import { InitDataParsed } from "@tma.js/sdk-react";
import client from "./client";

export const authClient = {
  connect: (rawData: unknown, data: unknown, startParam?: string) =>
    client
      .post("/auth/connect", { initDataRaw: rawData, data, startParam })
      .then((res) => {
        localStorage.setItem("jwt", res.data);
      }),
};
