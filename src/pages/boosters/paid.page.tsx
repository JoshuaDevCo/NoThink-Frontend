import { useParams } from "react-router-dom";
import { MutlitapBoosterIcon } from "../../assets/boosters/multitap";
import { ReactNode, useMemo, useState } from "react";
import { EnergyLimitBoosterIcon } from "../../assets/boosters/energy_limit";
import { SpeedRechardeBoosterIcon } from "../../assets/boosters/speed_recharge";
import { NoThinkBotBoosterIcon } from "../../assets/boosters/no_think_bot";
import { CoinIconSmall as CoinIcon } from "../../assets/coin/coin-small";
import { TonCoinSmall as TonCoinIcon } from "../../assets/coin/ton-small";
import cn from "classnames";
import { BoosterType } from "../../lib/types/booster";
import { useGame } from "../../lib/hooks/useGame";
import { Booster } from "../../lib/store/booster";
import { useLaunchParams } from "@tma.js/sdk-react";
import TonWeb from "tonweb";
import * as buffer from "buffer";
import { useTonConnectUI } from "@tonconnect/ui-react";
// import { beginCell } from "@ton/core";
// import { TonConnect } from "@tonconnect/ui-react";

window.Buffer = buffer.Buffer;

const BoughtIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.22223 16.5562L11.8889 21.2229L22.7778 10.334"
      stroke="url(#paint0_linear_13503_3125)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle
      cx="15"
      cy="15"
      r="14"
      stroke="url(#paint1_linear_13503_3125)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_13503_3125"
        x1="15"
        y1="10.334"
        x2="15"
        y2="21.2229"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#34D2AC" />
        <stop offset="1" stop-color="#26BEFF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_13503_3125"
        x1="15"
        y1="1"
        x2="15"
        y2="29"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#34D2AC" />
        <stop offset="1" stop-color="#26BEFF" />
      </linearGradient>
    </defs>
  </svg>
);

const ICONS: Record<string, ReactNode> = {
  multitap: <MutlitapBoosterIcon />,
  "energy-limit-increase": <EnergyLimitBoosterIcon />,
  "energy-recharge-decrease": <SpeedRechardeBoosterIcon />,
  autotapper: <NoThinkBotBoosterIcon />,
};

const LABELS: Record<string, string> = {
  multitap: "Multitap",
  "energy-limit-increase": "Energy Limit",
  "energy-recharge-decrease": "Speed Recharging",
  autotapper: "NO-THINK Bot",
};

const DESCRIPTIONS: Record<string, string> = {
  multitap: "Increases the number of coins earned per tap",
  "energy-limit-increase":
    "Increases the total amount of NO-THINK coin that can be mined in one session by increasing the energy cap",
  "energy-recharge-decrease":
    "Decreases the time needed for NO-THINK coin energy to replenish",
  autotapper:
    "Automatically mines coins when you’re offline for more than 60 minutes",
};

export const BoosterPage = () => {
  const { key } = useParams();
  const { booster, counter } = useGame();
  const { list, mine, use } = booster;
  const { total_balance, count } = counter;
  const [loading, setLoading] = useState(false);
  const params = useLaunchParams();
  const [tonConnectUI] = useTonConnectUI();
  // const wallet = useTonWallet();
  const mineMaxBoosterLevel = useMemo(
    () =>
      key
        ? Math.max(
            ...(!mine[key] || mine[key]?.length === 0
              ? [0]
              : mine[key].map((booster) => booster.level))
          )
        : 0,
    [key, mine]
  );

  const sendTransaction = async (user: number, booster: Booster) => {
    // console.log(user, booster);

    // console.log(Buffer.from("123"));
    // const body = beginCell();
    //   .storeStringTail("123132132132132121212121212121123") // write our text comment
    //   .endCell();
    let userInfo = new TonWeb.boc.Cell();
    // userInfo.bits.writeString(String(user));
    const transaction = {
      validUntil: Math.round(Date.now() / 1000) + 600,
      messages: [
        {
          address: "UQAyz0PWZt2Zb5qmOunVzaKBYhGBa366QBgZdBLZNK7UDvBz", // destination address
          amount: String(booster.price * 1000000000), //Toncoin in nanotons
          // amount: "100",
          // payload: body.toBoc().toString("base64"),
          payload: "hello",
        },
      ],
    };
    // console.log(transaction);
    return await tonConnectUI.sendTransaction(transaction);
  };

  const balance = useMemo(() => total_balance + count, [total_balance, count]);
  return (
    <div className="absolute z-50 top-0 left-0 h-full w-full bg">
      <div className="px-[20px] pt-[20px] pb-[30px] h-full overflow-auto">
        <div className="card-bg-gradient p-[40px_50px] rounded-[30px] flex flex-col items-center gap-[10px]">
          {key && ICONS[key]}
          <div className="text-[30px] font-bold text-center">
            {key && LABELS[key]}
          </div>
          <div className="text-center">{key && DESCRIPTIONS[key]}</div>
        </div>
        <div className="mt-[30px] mb-[20px] text-[14px] font-black">Levels</div>
        <div className="flex flex-col gap-[3px]">
          {key &&
            list[key] &&
            list[key]
              .sort((a, b) => a.level - b.level)
              .map((booster) => (
                <div
                  key={booster._id}
                  className={cn(
                    "p-[15px_15px_15px_10px] items-center rounded-[15px] bg-white/15 flex justify-between",
                    {
                      "opacity-40 pointer-events-none":
                        mineMaxBoosterLevel + 1 < booster.level,
                    }
                  )}
                >
                  <div className="flex gap-[15px]">
                    <div className="flex-1">{key && ICONS[key]}</div>
                    <div className="flex flex-col gap-[5px]">
                      <div>Level {booster.level}</div>
                      <div className="text-[14px]">{booster.description}</div>
                    </div>
                  </div>
                  <div>
                    {mine[key]?.find((mine) => mine._id === booster._id) ? (
                      <BoughtIcon />
                    ) : (
                      <button
                        className="p-[8px_10px] flex gap-[5px] items-center rounded-[10px] button-bg-gradient [&>svg]:w-[16px] [&>svg]:h-[16px] disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={async () => {
                          setLoading(true);
                          if (booster.denom == "ton") {
                            // tonConnectUI.disconnect();
                            // tonConnectUI.openModal();
                            await sendTransaction(
                              Number(params.initData?.user?.id),
                              booster
                            )
                              .then(() => {
                                use(key as BoosterType)
                                  .then(() => {
                                    setLoading(false);
                                  })
                                  .catch(() => {
                                    setLoading(false);
                                  });
                              })
                              .catch(() => setLoading(false));
                          } else {
                            use(key as BoosterType)
                              .then(() => {
                                setLoading(false);
                              })
                              .catch(() => {
                                setLoading(false);
                              });
                          }
                        }}
                        disabled={loading || balance < booster.price}
                      >
                        <span>Pay</span>
                        {booster.denom === "nothink" && <CoinIcon />}
                        {booster.denom === "ton" && <TonCoinIcon />}
                        <span>
                          {new Intl.NumberFormat().format(booster.price || 0)}
                          {booster.denom === "ton" && " TON"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
