import { Outlet, useNavigate } from "react-router-dom";
import { EnergyLimitBoosterIcon } from "../../assets/boosters/energy_limit";
import { LotusEnergyBoosterIcon } from "../../assets/boosters/lotus_enegry";
import { MutlitapBoosterIcon } from "../../assets/boosters/multitap";
import { NoThinkBotBoosterIcon } from "../../assets/boosters/no_think_bot";
import { SpeedRechardeBoosterIcon } from "../../assets/boosters/speed_recharge";
import { ZenPowerBoosterIcon } from "../../assets/boosters/zen_power";
import { CoinIcon } from "../../assets/coin/icon";
import { BoosterItem } from "../../components/booster/booster";
import { useGame } from "../../lib/hooks/useGame";
import { Booster } from "../../lib/store/booster";
import { TonCoinIcon } from "../../assets/coin/ton-coin";

const getNextBoosterPrice = (currentBought: number, boosters: Booster[]) => {
  const currentBooster = boosters[currentBought];
  const booster = boosters.find(
    (booster) => booster.level === currentBought + 1
  );
  const price = booster?.price;
  if (!price && currentBought == boosters.length)
    return { amount: "Max", denom: currentBooster?.denom };
  if (!price) {
    return { amount: "Free", denom: currentBooster?.denom };
  }
  return {
    amount: new Intl.NumberFormat().format(price),
    denom: booster.denom,
  };
};

export const BoostersPage = () => {
  const navigate = useNavigate();
  const { booster, counter } = useGame();
  const { mine, use, daily, list } = booster;
  const { tap_value } = counter;
  return (
    <>
      <div className="absolute z-50 top-0 left-0 h-full w-full bg">
        <div className="h-full px-[20px] pt-[20px] pb-[30px] overflow-auto">
          <div className="flex flex-col gap-[20px]">
            <div className="text-[14px] font-black leading-[1.3]">
              Daily Free Boosters
            </div>
            <div className="flex flex-col gap-[3px]">
              <BoosterItem
                title="Zen Power (x2)"
                description={`${
                  (daily["zen-power"]?.[0]?.max_usages || 3) -
                  (daily["zen-power"]?.[0]?.usages || 0)
                }/3 available`}
                icon={ZenPowerBoosterIcon}
                onClick={() => {
                  use("zen-power").then((r) => {
                    if (r === true) {
                      navigate("/");
                    }
                  });
                }}
                disabled={
                  daily["zen-power"]?.[0]?.usages ===
                    daily["zen-power"]?.[0]?.max_usages || tap_value === 2
                }
              />
              <BoosterItem
                title="Lotus Energy"
                description={`${
                  (daily["lotus-energy"]?.[0]?.max_usages || 3) -
                  (daily["lotus-energy"]?.[0]?.usages || 0)
                }/3 available`}
                icon={LotusEnergyBoosterIcon}
                onClick={() => {
                  use("lotus-energy").then((r) => {
                    if (r === true) {
                      navigate("/");
                    }
                  });
                }}
                disabled={
                  daily["lotus-energy"]?.[0]?.usages ===
                  daily["lotus-energy"]?.[0]?.max_usages
                }
              />
            </div>
            <div className="text-[14px] font-black leading-[1.3]">
              <div>Buy Boosters</div>
              <div className="text-[13px] font-semibold text-white/70">
                Use coins to get more boosters.
              </div>
            </div>
            <div className="flex flex-col gap-[3px]">
              <BoosterItem
                title="Multitap"
                titleSuffix={`Lvl ${mine["multitap"]?.length || 0}`}
                icon={MutlitapBoosterIcon}
                // to="/boosters/zen-power"
                description={
                  <span className="flex items-center gap-[5px] [&>svg]:w-[12px] [&>svg]:h-[12px]">
                    {getNextBoosterPrice(
                      mine["multitap"]?.length || 0,
                      list["multitap"] || []
                    ).denom === "ton" ? (
                      <TonCoinIcon />
                    ) : (
                      <CoinIcon />
                    )}{" "}
                    {
                      getNextBoosterPrice(
                        mine["multitap"]?.length || 0,
                        list["multitap"] || []
                      ).amount
                    }
                    {getNextBoosterPrice(
                      mine["multitap"]?.length || 0,
                      list["multitap"] || []
                    ).denom === "ton" && " TON"}
                  </span>
                }
                to="/boosters/multitap"
              />
              <BoosterItem
                title="Energy Limit"
                titleSuffix={`Lvl ${
                  mine["energy-limit-increase"]?.length || 0
                }`}
                description={
                  <span className="flex items-center gap-[5px] [&>svg]:w-[12px] [&>svg]:h-[12px]">
                    {getNextBoosterPrice(
                      mine["energy-limit-increase"]?.length || 0,
                      list["energy-limit-increase"] || []
                    ).denom === "ton" ? (
                      <TonCoinIcon />
                    ) : (
                      <CoinIcon />
                    )}{" "}
                    {
                      getNextBoosterPrice(
                        mine["energy-limit-increase"]?.length || 0,
                        list["energy-limit-increase"] || []
                      ).amount
                    }
                    {getNextBoosterPrice(
                      mine["energy-limit-increase"]?.length || 0,
                      list["energy-limit-increase"] || []
                    ).denom === "ton" && " TON"}
                  </span>
                }
                icon={EnergyLimitBoosterIcon}
                to="/boosters/energy-limit-increase"
              />
              <BoosterItem
                title="Speed Recharging"
                titleSuffix={`Lvl ${
                  mine["energy-recharge-decrease"]?.length || 0
                }`}
                description={
                  <span className="flex items-center gap-[5px] [&>svg]:w-[12px] [&>svg]:h-[12px]">
                    {getNextBoosterPrice(
                      mine["energy-recharge-decrease"]?.length || 0,
                      list["energy-recharge-decrease"] || []
                    ).denom === "ton" ? (
                      <TonCoinIcon />
                    ) : (
                      <CoinIcon />
                    )}{" "}
                    {
                      getNextBoosterPrice(
                        mine["energy-recharge-decrease"]?.length || 0,
                        list["energy-recharge-decrease"] || []
                      ).amount
                    }
                    {getNextBoosterPrice(
                      mine["energy-recharge-decrease"]?.length || 0,
                      list["energy-recharge-decrease"] || []
                    ).denom === "ton" && " TON"}
                  </span>
                }
                icon={SpeedRechardeBoosterIcon}
                to="/boosters/energy-recharge-decrease"
              />
              <BoosterItem
                title="NO-THINK Bot"
                description={
                  <span className="flex items-center gap-[5px] [&>svg]:w-[12px] [&>svg]:h-[12px]">
                    {getNextBoosterPrice(
                      mine["autotapper"]?.length || 0,
                      list["autotapper"] || []
                    ).denom === "ton" ? (
                      <TonCoinIcon />
                    ) : (
                      <CoinIcon />
                    )}{" "}
                    {
                      getNextBoosterPrice(
                        mine["autotapper"]?.length || 0,
                        list["autotapper"] || []
                      ).amount
                    }
                    {getNextBoosterPrice(
                      mine["autotapper"]?.length || 0,
                      list["autotapper"] || []
                    ).denom === "ton" && " TON"}
                  </span>
                }
                icon={NoThinkBotBoosterIcon}
                to="/boosters/autotapper"
              />
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};
