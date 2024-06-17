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
        <NotificationProvider>
          <GameProvider connected={connected}>
            <Router location={location} navigator={reactNavigator}>
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
            </Router>
          </GameProvider>
        </NotificationProvider>
      </main>
    </>
  );
};
