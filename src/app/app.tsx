import { useIntegration } from "@tma.js/react-router-integration";
import { initNavigator } from "@tma.js/sdk-react";
import { useEffect, useMemo } from "react";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import { GameProvider } from "../lib/context/game/game.provider";
import { BoostersPage } from "../pages/boosters/page";
import { BoosterPage } from "../pages/boosters/paid.page";
import { TablePage } from "../pages/table/page";
import { EarnPage } from "../pages/earn/page";
import { IndexPage } from "../pages/index";
import { NotificationProvider } from "../lib/context/notification/notification.provider";
import { postEvent } from "@tma.js/sdk";
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";

export const App = ({ connected }: { connected: boolean }) => {
  const tmaNavigator = useMemo(() => initNavigator("app-navigation-state"), []);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [location, reactNavigator] = useIntegration(tmaNavigator);
  useEffect(() => {
    tmaNavigator.attach();
    postEvent("web_app_expand");

    return () => tmaNavigator.detach();
  }, [tmaNavigator]);

  return (
    <>
      <main className="h-full overflow-hidden">
        <TonConnectUIProvider
          manifestUrl="https://gist.githubusercontent.com/breavedev/40545ae9e458253e4e6017bc1dc5a69a/raw/efe3604d6214c80452d1f4ae35b5a39b4766f108/tonconnect-manifest.json"
          uiPreferences={{ theme: THEME.DARK }}
          walletsListConfiguration={{
            includeWallets: [
              {
                appName: "safepalwallet",
                name: "SafePal",
                imageUrl:
                  "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
                tondns: "",
                aboutUrl: "https://www.safepal.com",
                universalLink: "https://link.safepal.io/ton-connect",
                jsBridgeKey: "safepalwallet",
                bridgeUrl: "https://ton-bridge.safepal.com/tonbridge/v1/bridge",
                platforms: ["ios", "android", "chrome", "firefox"],
              },
              {
                appName: "bitgetTonWallet",
                name: "Bitget Wallet",
                imageUrl:
                  "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget%20wallet_logo_iOS.png",
                aboutUrl: "https://web3.bitget.com",
                deepLink: "bitkeep://",
                jsBridgeKey: "bitgetTonWallet",
                bridgeUrl: "https://bridge.tonapi.io/bridge",
                platforms: ["ios", "android", "chrome"],
                universalLink: "https://bkcode.vip/ton-connect",
              },
              {
                appName: "tonwallet",
                name: "TON Wallet",
                imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
                aboutUrl:
                  "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
                universalLink: "https://wallet.ton.org/ton-connect",
                jsBridgeKey: "tonwallet",
                bridgeUrl: "https://bridge.tonapi.io/bridge",
                platforms: ["chrome", "android"],
              },
            ],
          }}
          actionsConfiguration={{
            twaReturnUrl: "https://t.me/my_nothink_bot/nothink",
          }}
        >
          <Router location={location} navigator={reactNavigator}>
            <NotificationProvider>
              <GameProvider connected={connected}>
                <Routes>
                  <Route path="/" Component={IndexPage}>
                    <Route path="/boosters" Component={BoostersPage}>
                      <Route path=":key" Component={BoosterPage} />
                    </Route>
                    <Route path="/table" Component={TablePage} />
                    <Route path="/earn" Component={EarnPage} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </GameProvider>
            </NotificationProvider>
          </Router>
        </TonConnectUIProvider>
      </main>
    </>
  );
};
