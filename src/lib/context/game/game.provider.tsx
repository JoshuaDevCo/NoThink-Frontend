import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import { IGameContext } from "./game.tyoes";
import { CounterStore } from "../../store/counter";
import { useStore } from "zustand";
import { StatStore } from "../../store/stat";
import { BoosterStore } from "../../store/booster";
import { useGameTick } from "../../hooks/useGameTick";
import { BoosterType } from "../../types/booster";
import { ChallengeStore } from "../../store/challenge";
import { useNotification } from "../notification/notification.provider";

export const GameContext = createContext<IGameContext>({
  counter: {
    applyBooster: () => {},
    refresh: () => {},
    inited: false,
    is_booster_active: false,
    booster_type: null,
    total_balance: 0,
    auto_tapped: 0,
    count: 0,
    tap_value: 0,
    clicks: 0,
    multiplier: 0,
    is_energy_locked: false,
    max_energy: 0,
    energy: 0,
    energy_recharge_time: 0,
    energy_reduce: 0,
    latest_sync_date: new Date(),
    click: function (): void {
      throw new Error("Function not implemented.");
    },
    init: function (): void {
      throw new Error("Function not implemented.");
    },
    sync: async function () {
      throw new Error("Function not implemented.");
    },
    startEnergyRecharge: function (): number {
      throw new Error("Function not implemented.");
    },
    setTapValue: function (): void {
      throw new Error("Function not implemented.");
    },
  },
  stat: {
    init: function (): void {
      throw new Error("Function not implemented.");
    },
    tappers: 0,
    score: 0,
    place: -1,
    list: [],
    invited_list: [],
    inited: false,
    refreshNumbers: function (): void {
      throw new Error("Function not implemented.");
    },
  },
  booster: {
    init: function (): void {
      throw new Error("Function not implemented.");
    },
    refresh: function (): void {
      throw new Error("Function not implemented.");
    },
    mine: {},
    list: {},
    daily: {},
    loading: false,
    use: function (): Promise<boolean> {
      throw new Error("Function not implemented.");
    },
    stop: function (): void {
      throw new Error("Function not implemented.");
    },
  },
  challenge: {
    list: [],
    completed: [],
    init: function (): void {
      throw new Error("Function not implemented.");
    },
    refresh: function (): void {
      throw new Error("Function not implemented.");
    },
    claim: function (): Promise<void> {
      throw new Error("Function not implemented.");
    },
    inited: false,
  },
});

export const GameProvider = ({
  children,
  connected,
}: PropsWithChildren<{ connected: boolean }>) => {
  const frameTime = useGameTick();
  const counter = useStore(CounterStore);
  const stat = useStore(StatStore);
  const booster = useStore(BoosterStore);
  const challenge = useStore(ChallengeStore);

  const notification = useNotification();

  const useBooster = useCallback(
    async (type: BoosterType) => {
      if (type === "lotus-energy") {
        await counter.sync();
      }
      return booster.use(type).then(async (used) => {
        console.log(type, used);
        await booster.refresh();
        if (type === "zen-power" && used) {
          counter.setTapValue(2);
        } else {
          await counter.refresh();
        }
        return used;
      });
    },
    [booster.use, counter.setTapValue]
  );

  const handleClick = useCallback(() => {
    counter.click();
  }, []);

  const handleClaim = useCallback((challengeId: string) => {
    return challenge.claim(challengeId).then(async () => {
      await counter.sync();
      await counter.refresh();
    });
  }, []);

  useEffect(() => {
    if (!connected) return;
    counter.init();
    stat.init();
    booster.init();
    challenge.init();
  }, [connected]);

  useEffect(() => {
    if (!booster.zenPower || !booster.zenPower.isActive) return;
    if ((frameTime - booster.zenPower.startedAt) / 1000 >= 30) {
      booster.stop();
      counter.setTapValue(1);
    }
  }, [booster.zenPower, frameTime]);

  useEffect(() => {
    if (challenge.inited) {
      challenge.completed
        .filter((challenge) => !challenge.claimed)
        .forEach((challenge) => {
          notification.append({
            type: "challange",
            label: challenge.type,
            text: "text",
          });
        });
    }
  }, [challenge.inited]);

  useEffect(() => {
    if (counter.auto_tapped > 0) {
      notification.append({
        type: "bot",
        label: "+" + counter.auto_tapped,
        text: "You got this! Your NO-THINK Bot has just mined coins for you!",
      });
    }
  }, [counter.auto_tapped]);

  // useEffect(() => {
  //   if (!stat.inited) return;
  //   const handler = setInterval(() => {
  //     stat.refreshNumbers();
  //   }, 3000);
  //   return () => {
  //     clearInterval(handler);
  //   };
  // }, [stat.inited]);

  useEffect(() => {
    if (!connected) return;
    const handler = counter.startEnergyRecharge();
    return () => {
      clearInterval(handler);
    };
  }, [counter.energy_recharge_time, connected]);
  //   const booster = useBoosterStore();
  return (
    <GameContext.Provider
      value={{
        counter: { ...counter, click: handleClick },
        stat,
        booster: { ...booster, use: useBooster },
        challenge: { ...challenge, claim: handleClaim },
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
