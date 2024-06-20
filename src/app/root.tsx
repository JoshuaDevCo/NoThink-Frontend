import { useLayoutEffect, useState } from "react";
import { App } from "./app";
import { authClient } from "../lib/apis/auth";
import { useLaunchParams } from "@tma.js/sdk-react";
const Inner = () => {
  const params = useLaunchParams();
  const [connected, setConnected] = useState(false);
  // const debug = params.startParam === "debug";
  // Enable debug mode to see all the methods sent and events received.
  useLayoutEffect(() => {
    import("eruda")
      .then((lib) => lib.default.init())
      .then(() => {
        try {
          authClient
            .connect(params.initDataRaw, params.initData)
            .then(() => {
              console.log(params.initData, params.initDataRaw);
              localStorage.setItem(
                "user",
                JSON.stringify(params.initData?.user)
              );
              setConnected(true);
            })
            .catch((e) => console.error(e));
        } catch (error) {
          console.error("Unable to extract telegram initData");
        }
      });
  }, []);

  return (
    // <SDKProvider acceptCustomStyles debug={debug}>
    <App connected={connected} />
    // </SDKProvider>
  );
};

export const Root = () => <Inner />;
